/**
 * Euphoria Signature Memo: Google Apps Script backend
 * Saves orders/enquiries to Google Sheets, serves products, sends auto-reply emails
 * and (optionally) WhatsApp auto-replies via the WhatsApp Cloud API.
 */
const OWNER_EMAIL = "nthabisengmoloi.tpy@gmail.com";
const BRAND = "Euphoria Signature Memo";
const SHEETS = {
  Products: ["id", "name", "category", "price", "size", "image", "notes", "description", "active"],
  Orders: ["Timestamp", "Ref", "Name", "Phone", "Email", "Address", "City", "Province", "Delivery", "Payment", "Items", "Subtotal", "DeliveryFee", "Total", "Notes", "Status"],
  Enquiries: ["Timestamp", "Ref", "Name", "Email", "Phone", "Service", "Message", "Status"]
};

function setup() { // run once from the editor
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEETS).forEach(n => {
    const sh = ss.getSheetByName(n) || ss.insertSheet(n);
    if (sh.getLastRow() === 0) sh.appendRow(SHEETS[n]);
    sh.getRange(1, 1, 1, SHEETS[n].length).setFontWeight("bold").setBackground("#c9a45c");
    sh.setFrozenRows(1);
  });
}

function doGet(e) {
  if (e.parameter.action === "products") {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
    if (!sh || sh.getLastRow() < 2) return json({ products: [] });
    const [head, ...rows] = sh.getDataRange().getValues();
    const products = rows.filter(r => r[0] && String(r[8]).toLowerCase() !== "no")
      .map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
    return json({ products });
  }
  return json({ ok: true, service: BRAND });
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const now = new Date();
    if (d.type === "order") {
      const items = d.items.map(i => `${i.qty} x ${i.name} (${i.size}) @ R${i.price}`).join("\n");
      ss.getSheetByName("Orders").appendRow([now, d.ref, d.name, d.phone, d.email, d.address, d.city, d.province,
        d.delivery, d.payment, items, d.subtotal, d.deliveryFee, d.total, d.notes || "", "New"]);
      const first = String(d.name).split(" ")[0];
      const msg = `Thank you for choosing ${BRAND}. Your scent story begins, ${first}.\n\nOrder ${d.ref}\n${items}\nDelivery: R${d.deliveryFee}\nTotal: R${d.total}\nPayment: ${d.payment}\n\nWe will contact you on WhatsApp with payment and delivery details.\n\nWith elegance,\n${BRAND}`;
      mail(d.email, `Your ${BRAND} order ${d.ref}`, msg);
      mail(OWNER_EMAIL, `New order ${d.ref} from ${d.name}`, `${msg}\n\nPhone: ${d.phone}\nAddress: ${d.address}, ${d.city}, ${d.province}\nNotes: ${d.notes || "-"}`);
      whatsapp(d.phone, msg);
    } else if (d.type === "enquiry") {
      ss.getSheetByName("Enquiries").appendRow([now, d.ref, d.name, d.email, d.phone || "", d.service || "General", d.message, "New"]);
      const first = String(d.name).split(" ")[0];
      const msg = `Thank you for choosing ${BRAND}. Your scent story begins, ${first}.\n\nWe received your enquiry (${d.ref}) and will reply within one business day.\n\nWith elegance,\n${BRAND}`;
      mail(d.email, `We received your enquiry ${d.ref}`, msg);
      mail(OWNER_EMAIL, `New enquiry ${d.ref} from ${d.name}`, `${d.service || "General"}\n\n${d.message}\n\n${d.email} / ${d.phone || ""}`);
      if (d.phone) whatsapp(d.phone, msg);
    }
    return json({ ok: true });
  } catch (err) { return json({ ok: false, error: String(err) }); }
}

function mail(to, subject, body) { try { MailApp.sendEmail({ to, subject, body, name: BRAND }); } catch (e) { console.error(e); } }

/** Optional WhatsApp auto-reply (WhatsApp Cloud API, Meta). Set Script Properties:
 *  WA_TOKEN, WA_PHONE_ID, and optionally WA_TEMPLATE (an approved template name).
 *  Without these properties, this function does nothing. */
function whatsapp(phone, text) {
  const p = PropertiesService.getScriptProperties();
  const token = p.getProperty("WA_TOKEN"), id = p.getProperty("WA_PHONE_ID");
  if (!token || !id) return;
  let to = String(phone).replace(/\D/g, "");
  if (to.startsWith("0")) to = "27" + to.slice(1);
  const tpl = p.getProperty("WA_TEMPLATE");
  const body = tpl
    ? { messaging_product: "whatsapp", to, type: "template", template: { name: tpl, language: { code: "en" }, components: [{ type: "body", parameters: [{ type: "text", text: text.split("\n")[0] }] }] } }
    : { messaging_product: "whatsapp", to, type: "text", text: { body: text } };
  try {
    UrlFetchApp.fetch(`https://graph.facebook.com/v20.0/${id}/messages`, { method: "post", contentType: "application/json", headers: { Authorization: "Bearer " + token }, payload: JSON.stringify(body), muteHttpExceptions: true });
  } catch (e) { console.error(e); }
}

function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
