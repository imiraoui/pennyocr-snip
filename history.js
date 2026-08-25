const $ = (id) => document.getElementById(id);
let all = [];

async function load() {
  ({ transcript: all = [] } = await chrome.storage.local.get("transcript"));
  render();
}

function render() {
  const q = $("q").value.trim().toLowerCase();
  const shown = q ? all.filter((e) => e.text.toLowerCase().includes(q)) : all;
  $("count").textContent = `${shown.length} SNIP${shown.length === 1 ? "" : "S"}${q ? ` MATCHING "${q.toUpperCase()}"` : ""}`;
  const list = $("list");
  list.innerHTML = "";
  if (!shown.length) {
    list.innerHTML = '<div class="empty">Nothing here yet — snip something.</div>';
    return;
  }
  for (const e of [...shown].reverse()) {
    const div = document.createElement("div");
    div.className = "entry";
    const head = document.createElement("div");
    head.className = "ehead";
    const when = document.createElement("span");
    when.className = "when";
    when.textContent = new Date(e.at).toLocaleString().toUpperCase();
    const acts = document.createElement("span");
    acts.className = "acts";
    const copy = document.createElement("button");
    copy.textContent = "COPY";
    copy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(e.text);
      copy.textContent = "COPIED ✓";
      setTimeout(() => (copy.textContent = "COPY"), 900);
    });
    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "DELETE";
    del.addEventListener("click", async () => {
      all = all.filter((x) => x !== e);
      await chrome.storage.local.set({ transcript: all });
      render();
    });
    acts.append(copy, del);
    head.append(when, acts);
    const pre = document.createElement("pre");
    pre.textContent = e.text;
    div.append(head, pre);
    list.appendChild(div);
  }
}

$("q").addEventListener("input", render);

$("copyAll").addEventListener("click", async () => {
  const q = $("q").value.trim().toLowerCase();
  const shown = q ? all.filter((e) => e.text.toLowerCase().includes(q)) : all;
  await navigator.clipboard.writeText(shown.map((e) => e.text).join("\n\n---\n\n"));
  $("copyAll").textContent = "COPIED ✓";
  setTimeout(() => ($("copyAll").textContent = "COPY ALL"), 900);
});

$("clear").addEventListener("click", async () => {
  all = [];
  await chrome.storage.local.set({ transcript: [] });
  render();
});

// Live-update while the page is open.
chrome.storage.onChanged.addListener((changes) => {
  if (changes.transcript) {
    all = changes.transcript.newValue || [];
    render();
  }
});

load();
