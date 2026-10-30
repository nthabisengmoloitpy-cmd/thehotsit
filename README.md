# Euphoria Signature Memo: Website

Static website (HTML, CSS, JavaScript) with a Google Sheets backend.

## Files
- `index.html`, `shop.html`, `collections.html`, `about.html`, `contact.html`
- `css/style.css`, `js/config.js` (your settings), `js/app.js`
- `backend/Code.gs` (Google Apps Script)

## Run it
Open `index.html` in a browser. Without step 3 the site runs in demo mode (everything works, nothing is saved or emailed).

## Go live
1. **Host it.** Upload the whole folder to Netlify (drag and drop), GitHub Pages, Vercel or any web host.
2. **Create the sheet.** In Google Sheets create a new spreadsheet, then Extensions > Apps Script. Paste `backend/Code.gs`, save, run `setup` once (approve permissions). It creates the tabs Products, Orders, Enquiries.
3. **Deploy the backend.** Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Copy the Web app URL into `SCRIPT_URL` in `js/config.js`.
4. **Products and images.** In the Products tab add rows: `id, name, category (Her/His/Unisex), price, size, image, notes, description, active`. For `image`, paste a public image URL or a Google Drive share link (set to "Anyone with the link"). Sheet rows override the built-in catalogue; set `active` to `no` to hide one.
5. **Auto-replies.**
   - On-screen thank-you and email confirmations (to customer and to you) work after step 3.
   - WhatsApp: after checkout the customer gets a button that opens a pre-filled WhatsApp chat with you. Fully automatic WhatsApp replies need the WhatsApp Cloud API (Meta business account). Add Script Properties `WA_TOKEN`, `WA_PHONE_ID` and ideally `WA_TEMPLATE` (an approved template, required to message customers first). Without them the script skips WhatsApp.
6. After editing `Code.gs`, redeploy (Deploy > Manage deployments > Edit > New version).

## Editable settings (`js/config.js`)
Phone, email, WhatsApp number, delivery fee (R99, free over R1500 are placeholders), services and fallback products. Prices are the "from" prices you supplied, all as 50ml.

## Notes
- Payments: orders are confirmed by EFT, payment link or pay-on-delivery. Add your bank details to the email text in `Code.gs`, or connect PayFast/Yoco later for card payments.
- Team names/titles on the About page and the delivery fee are placeholders to replace.
