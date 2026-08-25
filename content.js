// PennyOCR Snip — page script: selection overlay, toast, clipboard.
// Injected on demand; guard against double-injection.
(() => {
  if (window.__pennyocrSnip) return;
  window.__pennyocrSnip = true;

  const Z = 2147483646;
  let overlay = null;

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "begin-overlay") beginOverlay();
    if (msg.type === "snip-result") {
      if (msg.busy) return toast("READING…", "busy");
      if (!msg.ok) return toast(msg.error || "Something broke.", "err", msg.upsell);
      copyText(msg.text);
      const excerpt = msg.text.trim().slice(0, 140) || "(no text found)";
      const cost = msg.demo ? "FREE SNIP" : msg.costUsd != null ? `$${msg.costUsd.toFixed(5)}` : "";
      toast(`COPIED TO CLIPBOARD · ${cost}\n${excerpt}`, "ok");
    }
  });

  function beginOverlay() {
    if (overlay) overlay.remove();
    overlay = document.createElement("div");
    overlay.style.cssText =
      `position:fixed;inset:0;z-index:${Z};cursor:crosshair;` +
      "background:rgba(28,25,23,0.25);user-select:none";
    const box = document.createElement("div");
    box.style.cssText =
      "position:fixed;border:2px dashed #b87333;background:rgba(184,115,51,0.12);display:none";
    const hint = document.createElement("div");
    hint.textContent = "DRAG TO SELECT · ESC TO CANCEL";
    hint.style.cssText =
      "position:fixed;top:14px;left:50%;transform:translateX(-50%);" +
      "background:#1c1917;color:#f4efe4;font:700 11px/1 monospace;letter-spacing:.12em;" +
      "padding:8px 14px;box-shadow:4px 4px 0 rgba(28,25,23,.3)";
    overlay.append(box, hint);
    document.documentElement.appendChild(overlay);

    let sx = 0, sy = 0, dragging = false;
    const onKey = (e) => { if (e.key === "Escape") cleanup(); };
    const cleanup = () => { overlay?.remove(); overlay = null; removeEventListener("keydown", onKey, true); };
    addEventListener("keydown", onKey, true);

    overlay.addEventListener("mousedown", (e) => {
      dragging = true; sx = e.clientX; sy = e.clientY;
      box.style.display = "block";
      e.preventDefault();
    });
    overlay.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const x = Math.min(sx, e.clientX), y = Math.min(sy, e.clientY);
      const w = Math.abs(e.clientX - sx), h = Math.abs(e.clientY - sy);
      Object.assign(box.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    });
    overlay.addEventListener("mouseup", (e) => {
      if (!dragging) return;
      const rect = {
        x: Math.min(sx, e.clientX), y: Math.min(sy, e.clientY),
        w: Math.abs(e.clientX - sx), h: Math.abs(e.clientY - sy),
      };
      cleanup();
      if (rect.w < 8 || rect.h < 8) return;
      // Let the overlay disappear from the frame before the screenshot.
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          chrome.runtime.sendMessage({ type: "snip-rect", rect, dpr: devicePixelRatio })
        )
      );
    });
  }

  let toastEl = null, toastTimer = null;
  function toast(text, kind, upsell) {
    toastEl?.remove(); clearTimeout(toastTimer);
    toastEl = document.createElement("div");
    const bg = kind === "err" ? "#96562a" : "#1c1917";
    toastEl.style.cssText =
      `position:fixed;right:18px;bottom:18px;z-index:${Z + 1};max-width:340px;` +
      `background:${bg};color:#f4efe4;font:12px/1.55 monospace;white-space:pre-wrap;` +
      "padding:12px 16px;box-shadow:5px 5px 0 rgba(28,25,23,.35)";
    toastEl.textContent = text;
    if (upsell) {
      const a = document.createElement("a");
      a.href = "https://pennyocr.com/dashboard/?utm_source=chrome_ext&utm_medium=extension&utm_campaign=snip_upsell";
      a.target = "_blank";
      a.textContent = "GET A FREE KEY →";
      a.style.cssText = "display:block;margin-top:8px;color:#e8a86b;font-weight:700";
      toastEl.appendChild(a);
    }
    document.documentElement.appendChild(toastEl);
    toastTimer = setTimeout(() => toastEl?.remove(), kind === "busy" ? 30000 : 7000);
  }

  function copyText(text) {
    if (!text) return;
    navigator.clipboard?.writeText(text).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    });
  }
})();
