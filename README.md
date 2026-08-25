<h1 align="center">PennyOCR Snip</h1>

<p align="center">
  <b>Snip any region of any page — or right-click any image — and get the text back.</b>
</p>

<p align="center">
  <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-4c8dff">
  <img alt="VLM OCR" src="https://img.shields.io/badge/OCR-vision--language%20model-b87333">
  <img alt="3 free/day, no account" src="https://img.shields.io/badge/free%20tier-3%20snips%2Fday%2C%20no%20account-1f7a4d">
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-555">
</p>

Text trapped in a screenshot, a chart, a scanned page, a locked-down PDF viewer,
a slide, a photo of a whiteboard — draw a box around it and it lands in your
clipboard as clean markdown or plain text.

OCR runs on [PennyOCR](https://pennyocr.com), a vision-language-model OCR API.
That's the trade against offline Tesseract-style extensions: your snip travels
to the API, and in exchange you get OCR that reads tables, handwriting, CJK and
terrible scans — [99.5% character accuracy on the public
benchmark](https://pennyocr.com/blog/receipt-ocr-benchmark/) — at $0.75 per
1,000 snips.

**No account needed to try it**: 3 free snips a month. Want more? Type your
email in the popup, enter the 6-digit code from your inbox, and you're signed
in — 30 free snips a month (your first 100 pages are free), no password, no
card, no key to copy around. Your credit balance lives in the popup, next to a
one-click **REFILL** button.

## Install

1. [Download this repo](../../archive/refs/heads/main.zip) or `git clone` it
2. Open `chrome://extensions`, enable **Developer mode**
3. **Load unpacked** → select the folder
4. Pin the coin

## Use

| | |
| --- | --- |
| <kbd>⌥⇧P</kbd> — Option+Shift+P on Mac, Alt+Shift+P elsewhere (or the popup button) | Drag out a region, get the text |
| Right-click an image → **OCR this image with PennyOCR** | Reads the image where it sits |
| Popup | Running transcript of every snip — copy one, or copy all |

Every result is copied to your clipboard the moment it arrives. The popup keeps
your recent snips, and **HISTORY →** opens a full-page, searchable archive of
the last 500 — copy one, copy all, or delete the embarrassing ones.

Markdown output preserves structure (tables come back as tables); switch to
plain text in the popup if you just want the words.

## Sign in

Email → 6-digit code → done. Behind the scenes the extension mints an API key
named "Chrome extension" on your (new or existing) PennyOCR account and stores
it locally — you never handle a key, and you can revoke that key any time from
the [dashboard](https://pennyocr.com/dashboard/). Prefer pasting an existing
key? There's a link for that in the popup.

## Privacy

- The pixels you select are sent to `api.pennyocr.com`, processed, and
  discarded — [not stored, not trained on](https://pennyocr.com/privacy/).
- The extension makes no other network requests, needs no site access at
  install (captures ride on `activeTab`), and stores your transcript and API
  key locally in your browser.

## License

MIT
