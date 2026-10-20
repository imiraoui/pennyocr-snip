# Chrome Web Store listing

## Product details

- Name: `PennyOCR Snip — Screenshot OCR`
- Summary: `Turn screenshots, charts, scans, and images into clean text or Markdown. Try 3 free snips monthly—no account needed.`
- Category: `Productivity`
- Language: `English`

## Description

Turn anything on your screen into editable text.

PennyOCR Snip reads screenshots, charts, scanned documents, locked PDF viewers, slides, receipts, handwriting, and images in multiple languages. Draw a box around what you want, and the extracted text lands in your clipboard as clean Markdown or plain text.

WHAT YOU GET

• Snip any region with Option/Alt + Shift + P
• Right-click an image to OCR it in place
• Preserve tables and document structure as Markdown
• Read handwriting, receipts, charts, CJK text, and difficult scans
• Automatically copy each result to your clipboard
• Search a private local history of your last 500 snips
• Switch between Markdown and plain-text output

TRY IT WITHOUT AN ACCOUNT

Get 3 free snips each month with no sign-up. Sign in by email for 30 free snips per month and your first 50 API pages free. Additional usage is $0.75 per 1,000 pages.

BUILT FOR PRIVACY

Only the region or image you explicitly choose is sent to api.pennyocr.com. Snips are processed and discarded by default, never sold, and never used to train models. Your transcript, preferences, and API key stay in Chrome's local extension storage.

PennyOCR Snip requests access only when you invoke it on the current tab. It does not read your browsing history and makes no network requests except to the PennyOCR API.

Learn more, read the benchmark, and use the API at https://pennyocr.com

## URLs

- Homepage: `https://pennyocr.com/?utm_source=chrome_web_store&utm_medium=referral&utm_campaign=pennyocr_snip`
- Privacy policy: `https://pennyocr.com/privacy/`
- Support: `https://pennyocr.com/docs/`

## Single purpose

PennyOCR Snip lets a user deliberately select a visible page region or image and convert it to editable text or Markdown through the PennyOCR OCR API.

## Permission justifications

- `activeTab`: PennyOCR Snip uses activeTab only after the user clicks the extension, presses its keyboard shortcut, or chooses its image context-menu command. It captures the visible tab so the user-selected region or image can be cropped and sent for OCR. It does not access tabs in the background or read browsing history.
- `contextMenus`: Adds the user-facing “OCR this image with PennyOCR” command to image context menus. The command runs only when the user deliberately right-clicks an image and selects it.
- Host permission `https://api.pennyocr.com/*`: Allows the extension to send only user-selected image pixels to the PennyOCR API for OCR, request and verify email sign-in codes, create a PennyOCR API key for the signed-in user, read that user's balance, and request an optional Stripe checkout URL. No other host is granted persistent access.
- Remote code: PennyOCR Snip does not use remote code. All executable JavaScript is included in the uploaded extension package. The extension sends HTTPS requests to api.pennyocr.com and treats responses only as data; it never downloads, evaluates, or executes remote JavaScript or WebAssembly.
- `scripting`: Injects the packaged selection overlay and result notification into the active page only after the user starts a snip or chooses the image context-menu command. It does not inject scripts automatically or on pages the user has not explicitly invoked it on.
- `storage`: Stores the user's output-format preference, recent OCR transcript, email address, and PennyOCR API key in Chrome local extension storage so settings and results persist between popup openings. This data is not used for advertising or browsing-history tracking.

## Privacy-practices certification

Select the checkbox certifying that the disclosures above comply with the Chrome Web Store Developer Program Policies. The extension's data use satisfies the certification because it:

- does not sell or transfer user data to third parties outside the disclosed OCR, authentication, infrastructure, and payment-initiation purposes;
- does not use or transfer user data for personalized advertising;
- does not use or transfer user data for purposes unrelated to PennyOCR Snip's single OCR purpose;
- does not use or transfer user data to determine creditworthiness or for lending;
- processes only the content the user deliberately selects, while the recent transcript and preferences remain in Chrome local storage.

## Data-use disclosures

- Personally identifiable information: email address, only when the user chooses email sign-in.
- Authentication information: one-time sign-in code and PennyOCR API key.
- Website content: only pixels in the page region or image the user explicitly selects for OCR.
- User activity: a local transcript of OCR results and timestamps; this remains in Chrome local storage and is not transmitted as history or analytics.
- The extension does not collect payment-card data. Refill opens a Stripe-hosted checkout page.
- Data is used only to provide OCR, authentication, balance, and billing-initiation features; it is not sold, used for advertising, or used for credit decisions.

## Publishing settings

- Visibility: `Public`
- Mature content: `No`
- Remote code: `No`
