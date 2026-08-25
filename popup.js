const $ = (id) => document.getElementById(id);

async function load() {
  const { apiKey = "", format = "markdown", transcript = [] } =
    await chrome.storage.local.get(["apiKey", "format", "transcript"]);
  $("apiKey").value = apiKey;
  $("format").value = format;
  renderTranscript(transcript);
}

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

$("apiKey").addEventListener("change", (e) =>
  chrome.storage.local.set({ apiKey: e.target.value.trim() })
);
$("format").addEventListener("change", (e) =>
  chrome.storage.local.set({ format: e.target.value })
);

load();
