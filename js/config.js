/* ===== EDIT THIS FILE to configure the site ===== */
window.EUPHORIA = {
  // Paste your Google Apps Script Web App URL here (see README.md, step 3).
  // Leave empty to run in demo mode (site works, nothing is saved).
  SCRIPT_URL: "",
  WHATSAPP: "27703042778",          // international format, no + or spaces
  PHONE_DISPLAY: "0703 042778",
  EMAIL: "nthabisengmoloi.tpy@gmail.com",
  DELIVERY: { fee: 99, freeOver: 1500, collectionLabel: "Pretoria hand delivery / collection" },
  SERVICES: [
    { name: "Gift packaging", price: "from R200", text: "Hand-finished boxes, ribbon and a handwritten card for any occasion." },
    { name: "Custom perfume mixing & refills", price: "from R280", text: "Blend your own signature or refill a bottle you already love." },
    { name: "Bulk orders & corporate gifting", price: "Price on request", text: "Branded gift sets for weddings, teams and client appreciation." }
  ],
  // Fallback catalogue, used when no Google Sheet is connected. Sheet data overrides it.
  PRODUCTS: [
    { id:"her-bloom", name:"Euphoria Bloom", category:"Her", price:450, size:"50ml", image:"", notes:"Peony, white musk, soft vanilla", description:"A light floral that opens like the first morning of spring." },
    { id:"her-rose", name:"Velvet Rose", category:"Her", price:560, size:"50ml", image:"", notes:"Damask rose, amber, praline", description:"Deep, velvety rose wrapped in warm amber." },
    { id:"her-sig", name:"Signature Memo", category:"Her", price:650, size:"50ml", image:"", notes:"Jasmine, sandalwood, tonka", description:"Our house signature: the scent people ask about after you leave." },
    { id:"his-noir", name:"Noir Intensity", category:"His", price:400, size:"50ml", image:"", notes:"Black pepper, oud, leather", description:"Dark, confident and made for evenings." },
    { id:"his-ocean", name:"Ocean Creed", category:"His", price:530, size:"50ml", image:"", notes:"Sea salt, bergamot, cedar", description:"Clean coastal freshness with a woody backbone." },
    { id:"his-gold", name:"Legacy Gold", category:"His", price:700, size:"50ml", image:"", notes:"Saffron, amberwood, vetiver", description:"A rich, resinous statement for the man who leads." },
    { id:"uni-gold", name:"Gold Euphoria", category:"Unisex", price:650, size:"50ml", image:"", notes:"Golden amber, iris, musk", description:"Shared warmth that sits differently on everyone." },
    { id:"uni-vanilla", name:"Vanilla Muse", category:"Unisex", price:380, size:"50ml", image:"", notes:"Madagascar vanilla, cashmere wood", description:"Soft, creamy and quietly addictive." }
  ]
};
