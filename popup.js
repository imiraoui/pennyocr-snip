const API_BASE = "https://api.pennyocr.com";
const $ = (id) => document.getElementById(id);

async function load() {
  const { apiKey = "", email = "", format = "markdown", transcript = [] } =
    await chrome.storage.local.get(["apiKey", "email", "format", "transcript"]);
  $("format").value = format;
  renderAuth(apiKey, email);
  renderTranscript(transcript);
}

function renderAuth(apiKey, email) {
  const signedIn = Boolean(apiKey);
  $("authOut").classList.toggle("hidden", signedIn);
  $("authIn").classList.toggle("hidden", !signedIn);
  $("tagline").textContent = signedIn
    ? "$0.75 / 1,000 PAGES · FIRST 50 PAGES FREE"
    : "3 FREE SNIPS A MONTH · SIGN IN FOR 30/MONTH";
  if (signedIn) {
    $("whoEmail").textContent = (email || "SIGNED IN").toUpperCase();
    loadBalance(apiKey);
  }
}

function authErr(msg) {
  const el = $("authErr");
  el.textContent = msg || "";
  el.classList.toggle("hidden", !msg);
}

$("sendCode").addEventListener("click", async () => {
  const email = $("email").value.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return authErr("That doesn't look like an email.");
  authErr("");
  $("sendCode").disabled = true;
  $("sendCode").textContent = "SENDING…";
  try {
    const r = await fetch(`${API_BASE}/auth/request-code`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!r.ok) {
      const b = await r.json().catch(() => ({}));
      throw new Error(b.detail || "Couldn't send the code — try again in a minute.");
    }
    $("codeRow").classList.remove("hidden");
    $("code").focus();
    $("sendCode").textContent = "SENT ✓";
  } catch (e) {
    authErr(e.message);
    $("sendCode").textContent = "EMAIL ME A CODE";
  }
  $("sendCode").disabled = false;
});

$("verify").addEventListener("click", doVerify);
$("code").addEventListener("keydown", (e) => { if (e.key === "Enter") doVerify(); });

async function doVerify() {
  const email = $("email").value.trim().toLowerCase();
  const code = $("code").value.trim();
  if (code.length !== 6) return authErr("The code is 6 digits.");
  authErr("");
  $("verify").disabled = true;
  $("verify").textContent = "…";
  try {
    const r = await fetch(`${API_BASE}/auth/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email, code,
        attribution: {
          referrer: "chrome-extension",
          landing: "chrome_ext",
          utm: { utm_source: "chrome_ext", utm_medium: "extension", utm_campaign: "snip_signin" },
        },
      }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body.detail || "Invalid or expired code.");
    // Trade the session for a durable API key the extension keeps locally.
    const kr = await fetch(`${API_BASE}/dashboard/keys`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${body.session_token}`,
      },
      body: JSON.stringify({ name: "Chrome extension", free_cap: 30 }),
    });
    const kb = await kr.json().catch(() => ({}));
    if (!kr.ok || !kb.api_key) throw new Error("Signed in, but couldn't set up the key — try again.");
    await chrome.storage.local.set({ apiKey: kb.api_key, email: body.email });
    renderAuth(kb.api_key, body.email);
  } catch (e) {
    authErr(e.message);
  }
  $("verify").disabled = false;
  $("verify").textContent = "SIGN IN";
}

$("signOut").addEventListener("click", async () => {
  await chrome.storage.local.remove(["apiKey", "email"]);
  renderAuth("", "");
});

$("showKey").addEventListener("click", () => $("keyRow").classList.toggle("hidden"));
$("apiKey").addEventListener("change", async (e) => {
  const key = e.target.value.trim();
  if (!key) return;
  await chrome.storage.local.set({ apiKey: key, email: "" });
  renderAuth(key, "");
});

function renderTranscript(entries) {
  const box = $("transcript");
  box.innerHTML = "";
  if (!entries.length) {
    box.innerHTML = '<div class="empty">Snips land here — click one to copy it again.</div>';
    return;
  }
  for (const e of [...entries].reverse()) {
    const div = document.createElement("div");
    div.className = "entry";
    const when = document.createElement("div");
    when.className = "when";
    when.textContent = new Date(e.at).toLocaleString().toUpperCase();
    const body = document.createElement("div");
    body.textContent = e.text;
    div.append(when, body);
    div.title = "Click to copy";
    div.addEventListener("click", () => {
      navigator.clipboard.writeText(e.text);
      when.textContent = "COPIED ✓";
      setTimeout(() => (when.textContent = new Date(e.at).toLocaleString().toUpperCase()), 900);
    });
    box.appendChild(div);
  }
}

$("snip").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.runtime.sendMessage({ type: "start-snip", tabId: tab.id });
  window.close();
});

$("copyAll").addEventListener("click", async () => {
  const { transcript = [] } = await chrome.storage.local.get("transcript");
  const all = transcript.map((e) => e.text).join("\n\n---\n\n");
  await navigator.clipboard.writeText(all);
  $("copyAll").textContent = "COPIED ✓";
  setTimeout(() => ($("copyAll").textContent = "COPY ALL"), 900);
});

$("clear").addEventListener("click", async () => {
  await chrome.storage.local.set({ transcript: [] });
  renderTranscript([]);
});

$("format").addEventListener("change", (e) =>
  chrome.storage.local.set({ format: e.target.value })
);

async function loadBalance(apiKey) {
  try {
    const r = await fetch(`${API_BASE}/v1/balance`, { headers: { authorization: `Bearer ${apiKey}` } });
    const b = await r.json();
    if (!r.ok) throw new Error();
    const bits = [`CREDITS: ${b.credit_pages.toLocaleString()} PAGES (≈$${b.credit_value_usd})`];
    if (b.key_free_cap_month != null) {
      bits.push(`FREE SNIPS LEFT THIS MONTH: ${Math.max(0, b.key_free_cap_month - b.key_free_used_month)}/${b.key_free_cap_month}`);
    }
    bits.push(`LIFETIME FREE PAGES LEFT: ${b.free_pages_remaining}`);
    $("balanceRow").textContent = bits.join(" · ");
  } catch {
    $("balanceRow").textContent = "Couldn't load balance — snips still work.";
  }
}

$("refill").addEventListener("click", async () => {
  const { apiKey } = await chrome.storage.local.get("apiKey");
  if (!apiKey) return;
  $("refill").disabled = true;
  $("refill").textContent = "OPENING STRIPE…";
  try {
    const r = await fetch(`${API_BASE}/v1/billing/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ pack: "10k" }),
    });
    const b = await r.json();
    if (!r.ok || !b.url) throw new Error();
    chrome.tabs.create({ url: b.url });
    window.close();
  } catch {
    $("refill").textContent = "FAILED — TRY THE DASHBOARD";
    $("refill").disabled = false;
  }
});

$("viewAll").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("history.html") });
});

// Alt reads as Option on Mac — say so.
if (navigator.platform.toUpperCase().includes("MAC")) {
  document.getElementById("shortcutHint").textContent =
    "OR PRESS ⌥ OPTION + ⇧ SHIFT + P · RIGHT-CLICK ANY IMAGE";
}

load();
