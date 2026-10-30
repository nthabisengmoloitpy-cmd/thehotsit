(function () {
  const C = window.EUPHORIA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const R = n => "R" + Number(n).toLocaleString("en-ZA");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const page = location.pathname.split("/").pop() || "index.html";
  const WA_ICON = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.4 8.600 3.400 15.500c0 2.400.7 4.700 1.900 6.600L3 29l7.100-1.900c1.800 1 3.800 1.500 5.900 1.500 7 0 12.600-5.600 12.600-12.500S23 3 16 3zm0 22.900c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.200 1.100 1.100-4.100-.3-.4a10.300 10.300 0 0 1-1.600-5.500C5.300 9.700 10.100 5 16 5s10.700 4.700 10.700 10.500S21.900 25.900 16 25.900zm5.900-7.700c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.200-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.400-.5-2.600-1.600-1-.9-1.600-1.900-1.800-2.200-.2-.3 0-.5.100-.7l.5-.5c.1-.2.200-.3.300-.5.100-.2.100-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1 1-1 2.400s1 2.800 1.200 3c.1.200 2 3.100 4.900 4.300 2.900 1.200 2.900.8 3.400.8.500-.1 1.700-.7 1.900-1.400.2-.7.200-1.200.2-1.400-.1-.1-.3-.2-.6-.4z"/></svg>';

  /* ---------- bottle illustration (used when a product has no image) ---------- */
  const TINT = { Her: "#d9a7a0", His: "#6f7f8f", Unisex: "#e3c887" };
  const bottle = cat => `<svg viewBox="0 0 120 200" aria-hidden="true"><rect x="44" y="6" width="32" height="26" fill="#c9a45c"/><rect x="50" y="32" width="20" height="14" fill="#8e7233"/><rect x="14" y="46" width="92" height="140" rx="10" fill="${TINT[cat] || "#c9a45c"}" fill-opacity=".28" stroke="#c9a45c" stroke-width="1.5"/><rect x="24" y="56" width="10" height="120" rx="5" fill="#fff" fill-opacity=".16"/><rect x="38" y="104" width="58" height="48" fill="#0a0908" fill-opacity=".72" stroke="#c9a45c" stroke-width=".8"/><text x="67" y="124" text-anchor="middle" font-family="Georgia,serif" font-size="9" letter-spacing="2" fill="#e3c887">EUPHORIA</text><text x="67" y="138" text-anchor="middle" font-family="Georgia,serif" font-size="5.500" letter-spacing="2.500" fill="#c9a45c">SIGNATURE MEMO</text></svg>`;

  /* ---------- layout ---------- */
  const links = [["index.html", "Home"], ["shop.html", "Shop"], ["collections.html", "Collections"], ["about.html", "About"], ["contact.html", "Contact"]];
  const hdr = $("#site-header");
  if (hdr) hdr.outerHTML = `<header class="top"><div class="wrap nav"><a class="logo" href="index.html">EUPHORIA<small>SIGNATURE MEMO</small></a>
    <nav class="menu" id="menu" aria-label="Main">${links.map(([h, t]) => `<a href="${h}" class="${h === page ? "on" : ""}">${t}</a>`).join("")}</nav>
    <div style="display:flex;gap:.6rem;align-items:center"><button class="bag" id="bagBtn" aria-label="Open shopping bag">Bag<b id="bagN">0</b></button><button class="burger" id="burger" aria-label="Menu">&#9776;</button></div></div></header>`;
  const ftr = $("#site-footer");
  if (ftr) ftr.outerHTML = `<footer><div class="wrap"><div class="fgrid"><div><a class="logo" href="index.html">EUPHORIA<small>SIGNATURE MEMO</small></a><p class="muted" style="margin-top:1rem">Luxury fragrances from Pretoria, delivered nationwide. Your scent story begins here.</p></div>
    <div><h3>Explore</h3><ul>${links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
    <div><h3>Contact</h3><ul><li><a href="tel:+${C.WHATSAPP}">${C.PHONE_DISPLAY}</a></li><li><a href="mailto:${C.EMAIL}">${C.EMAIL}</a></li><li>Pretoria, South Africa</li><li>Online store, nationwide delivery</li></ul></div></div>
    <div class="copy">&copy; ${new Date().getFullYear()} Euphoria Signature Memo. All rights reserved.</div></div></footer>
    <a class="wa" href="https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent("Hi Euphoria Signature Memo, I'd like to know more about your fragrances.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_ICON}</a>`;
  document.body.insertAdjacentHTML("beforeend", `<div class="shade" id="shade"></div>
    <aside class="drawer" id="drawer" aria-label="Shopping bag"><header><h3>Your bag</h3><button class="x" id="closeBag" aria-label="Close">&times;</button></header><div class="in" id="drawerBody"></div></aside>
    <dialog id="thanks"><h2 id="thT"></h2><p id="thP"></p><div style="display:grid;gap:.8rem;justify-content:center"><a class="btn" id="thWA" target="_blank" rel="noopener">Continue on WhatsApp</a><button class="btn ghost" id="thClose" type="button">Close</button></div></dialog>`);
  $("#burger")?.addEventListener("click", () => $("#menu").classList.toggle("on"));

  /* ---------- products ---------- */
  let PRODUCTS = C.PRODUCTS.slice();
  const driveFix = u => { const m = String(u || "").match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]+)/); return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800` : u; };
  async function loadProducts() {
    if (!C.SCRIPT_URL) return;
    try {
      const r = await fetch(C.SCRIPT_URL + "?action=products");
      const d = await r.json();
      if (d.products && d.products.length) PRODUCTS = d.products.map(p => ({ ...p, price: Number(p.price), image: driveFix(p.image) }));
    } catch (e) { console.warn("Using built-in catalogue", e); }
  }
  const card = p => `<article class="card"><div class="pic">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : bottle(p.category)}</div>
    <div class="body"><span class="tag">${esc(p.category)} &middot; ${esc(p.size)}</span><h3>${esc(p.name)}</h3><p>${esc(p.description)}<br><em>${esc(p.notes)}</em></p>
    <div class="row"><span class="price">from ${R(p.price)}</span><button class="btn sm" data-add="${esc(p.id)}">Add to bag</button></div></div></article>`;
  function renderGrids() {
    $$("[data-products]").forEach(el => {
      const cat = el.dataset.cat, lim = +el.dataset.limit || 99;
      el.innerHTML = PRODUCTS.filter(p => !cat || p.category === cat).slice(0, lim).map(card).join("");
    });
    const shop = $("#shopGrid");
    if (shop) {
      const f = $(".chip.on")?.dataset.f || "All", q = ($("#q")?.value || "").toLowerCase();
      const list = PRODUCTS.filter(p => (f === "All" || p.category === f) && (p.name + p.notes + p.description).toLowerCase().includes(q));
      shop.innerHTML = list.map(card).join("") || '<p class="muted">No fragrances match your search.</p>';
    }
  }

  /* ---------- cart ---------- */
  let cart = []; try { cart = JSON.parse(localStorage.getItem("esm_cart") || "[]"); } catch (e) {}
  const save = () => { try { localStorage.setItem("esm_cart", JSON.stringify(cart)); } catch (e) {} $("#bagN").textContent = cart.reduce((a, i) => a + i.qty, 0); };
  const find = id => PRODUCTS.find(p => p.id === id);
  const money = () => { const sub = cart.reduce((a, i) => a + (find(i.id)?.price || 0) * i.qty, 0); return sub; };
  const open = on => { $("#drawer").classList.toggle("on", on); $("#shade").classList.toggle("on", on); if (on) drawCart(); };
  function drawCart(checkout) {
    const b = $("#drawerBody");
    if (!cart.length) { b.innerHTML = '<p class="muted">Your bag is empty.</p><p style="margin-top:1rem"><a class="btn" href="shop.html">Browse fragrances</a></p>'; return; }
    const sub = money();
    const lines = cart.map(i => { const p = find(i.id); if (!p) return ""; return `<div class="line"><div><strong>${esc(p.name)}</strong><br><span class="muted">${esc(p.size)} &middot; ${R(p.price)}</span></div><div class="qty"><button data-q="-1" data-id="${esc(i.id)}" aria-label="Less">&minus;</button><span>${i.qty}</span><button data-q="1" data-id="${esc(i.id)}" aria-label="More">+</button></div></div>`; }).join("");
    if (!checkout) {
      b.innerHTML = lines + `<div class="tot big"><span>Subtotal</span><span>${R(sub)}</span></div><p class="muted" style="font-size:.85rem;margin:.6rem 0 1.2rem">Delivery is calculated at checkout.</p><button class="btn" id="goCheckout" style="width:100%">Checkout</button>`;
      return;
    }
    b.innerHTML = lines + `<form id="orderForm" novalidate style="margin-top:1.2rem">
      <label>Full name<input name="name" required autocomplete="name"></label>
      <div class="frow"><label>Phone / WhatsApp<input name="phone" type="tel" required autocomplete="tel"></label><label>Email<input name="email" type="email" required autocomplete="email"></label></div>
      <label>Delivery address<textarea name="address" style="min-height:70px" required autocomplete="street-address"></textarea></label>
      <div class="frow"><label>City<input name="city" required></label><label>Province<select name="province"><option>Gauteng</option><option>Western Cape</option><option>KwaZulu-Natal</option><option>Eastern Cape</option><option>Free State</option><option>Limpopo</option><option>Mpumalanga</option><option>North West</option><option>Northern Cape</option></select></label></div>
      <fieldset style="border:0;display:grid;gap:.5rem"><legend class="muted" style="font-size:.85rem;margin-bottom:.4rem">Delivery</legend>
        <label class="opt"><input type="radio" name="delivery" value="courier" checked> Nationwide courier (${R(C.DELIVERY.fee)}, free over ${R(C.DELIVERY.freeOver)})</label>
        <label class="opt"><input type="radio" name="delivery" value="pretoria"> ${esc(C.DELIVERY.collectionLabel)} (free)</label></fieldset>
      <fieldset style="border:0;display:grid;gap:.5rem"><legend class="muted" style="font-size:.85rem;margin-bottom:.4rem">Payment</legend>
        <label class="opt"><input type="radio" name="payment" value="EFT" checked> EFT (banking details sent with your confirmation)</label>
        <label class="opt"><input type="radio" name="payment" value="Payment link"> Secure payment link sent on WhatsApp</label>
        <label class="opt"><input type="radio" name="payment" value="Pay on delivery"> Pay on delivery (Pretoria only)</label></fieldset>
      <label>Order notes (optional)<textarea name="notes" style="min-height:60px"></textarea></label>
      <div id="sum"></div><p class="err" id="ferr" role="alert"></p><button class="btn" id="placeBtn" type="submit">Place order</button><button class="btn ghost" id="backBag" type="button">Back to bag</button></form>`;
    const upd = () => {
      const d = $("[name=delivery]:checked", b).value, fee = d === "pretoria" || sub >= C.DELIVERY.freeOver ? 0 : C.DELIVERY.fee;
      $("#sum").innerHTML = `<div class="tot"><span>Subtotal</span><span>${R(sub)}</span></div><div class="tot"><span>Delivery</span><span>${fee ? R(fee) : "Free"}</span></div><div class="tot big"><span>Total</span><span>${R(sub + fee)}</span></div>`;
      return fee;
    };
    $$("[name=delivery]", b).forEach(r => r.addEventListener("change", upd)); upd();
    $("#backBag").onclick = () => drawCart();
    $("#orderForm").addEventListener("submit", async e => {
      e.preventDefault(); const f = e.target, v = Object.fromEntries(new FormData(f));
      if (!v.name.trim() || !v.address.trim() || !v.city.trim() || !/^[+\d][\d\s-]{8,}$/.test(v.phone) || !/^\S+@\S+\.\S+$/.test(v.email)) { $("#ferr").textContent = "Please complete your name, a valid phone number, a valid email and your address."; return; }
      $("#ferr").textContent = ""; $("#placeBtn").disabled = true; $("#placeBtn").textContent = "Placing order...";
      const fee = upd(), ref = "ESM-" + Date.now().toString(36).toUpperCase().slice(-6);
      const items = cart.map(i => { const p = find(i.id); return { id: i.id, name: p.name, size: p.size, price: p.price, qty: i.qty }; });
      const payload = { type: "order", ref, ...v, items, subtotal: sub, deliveryFee: fee, total: sub + fee };
      await post(payload);
      const msg = `Hi Euphoria Signature Memo, I just placed order ${ref}.\n` + items.map(i => `${i.qty} x ${i.name} (${i.size})`).join("\n") + `\nTotal: ${R(payload.total)}\nName: ${v.name}`;
      cart = []; save(); open(false);
      thank(`Thank you, ${v.name.split(" ")[0]}`, `Thank you for choosing Euphoria Signature Memo. Your scent story begins now. Order ${ref} (${R(payload.total)}) is confirmed. A confirmation is on its way to ${v.email}, and we will message you on WhatsApp with payment and delivery details.`, msg);
    });
  }
  async function post(payload) {
    if (!C.SCRIPT_URL) { console.info("Demo mode, payload:", payload); return; }
    try { await fetch(C.SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) }); } catch (e) { console.warn(e); }
  }
  function thank(t, p, waMsg) {
    $("#thT").textContent = t; $("#thP").textContent = p;
    $("#thWA").href = `https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
    $("#thanks").showModal();
  }
  $("#thClose").onclick = () => $("#thanks").close();
  $("#bagBtn").onclick = () => open(true); $("#closeBag").onclick = () => open(false); $("#shade").onclick = () => open(false);
  document.addEventListener("keydown", e => { if (e.key === "Escape") open(false); });
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-add]"), q = e.target.closest("[data-q]");
    if (a) { const it = cart.find(i => i.id === a.dataset.add); it ? it.qty++ : cart.push({ id: a.dataset.add, qty: 1 }); save(); open(true); }
    if (q) { const it = cart.find(i => i.id === q.dataset.id); it.qty += +q.dataset.q; if (it.qty < 1) cart = cart.filter(i => i !== it); save(); drawCart($("#orderForm") ? true : false); }
    if (e.target.id === "goCheckout") drawCart(true);
  });

  /* ---------- shop filters, services, enquiry form ---------- */
  $$(".chip").forEach(c => c.addEventListener("click", () => { $$(".chip").forEach(x => x.classList.remove("on")); c.classList.add("on"); renderGrids(); }));
  $("#q")?.addEventListener("input", renderGrids);
  $$("[data-services]").forEach(el => el.innerHTML = C.SERVICES.map(s => `<div><h3>${esc(s.name)}</h3><span class="price">${esc(s.price)}</span><p class="muted">${esc(s.text)}</p><a class="btn ghost sm" href="contact.html?service=${encodeURIComponent(s.name)}" style="margin-top:1rem">Enquire</a></div>`).join(""));
  const cf = $("#contactForm");
  if (cf) {
    const sel = $("[name=service]", cf); C.SERVICES.forEach(s => sel.insertAdjacentHTML("beforeend", `<option>${esc(s.name)}</option>`));
    const pre = new URLSearchParams(location.search).get("service"); if (pre) sel.value = pre;
    cf.addEventListener("submit", async e => {
      e.preventDefault(); const v = Object.fromEntries(new FormData(cf)), err = $("#cerr");
      if (!v.name.trim() || !/^\S+@\S+\.\S+$/.test(v.email) || !v.message.trim()) { err.textContent = "Please add your name, a valid email and a message."; return; }
      err.textContent = ""; const b = $("button", cf); b.disabled = true; b.textContent = "Sending...";
      await post({ type: "enquiry", ref: "ENQ-" + Date.now().toString(36).toUpperCase().slice(-6), ...v });
      thank(`Thank you, ${v.name.split(" ")[0]}`, "Thank you for choosing Euphoria Signature Memo. Your scent story begins with this message. We have sent a confirmation to your email and will reply within one business day.", `Hi Euphoria Signature Memo, I just sent an enquiry about: ${v.service || "your fragrances"}.`);
      cf.reset(); b.disabled = false; b.textContent = "Send message";
    });
  }

  save();
  loadProducts().then(() => { renderGrids(); if ($("#orderForm") === null) drawCart(); });
})();
document.addEventListener("DOMContentLoaded", function () {
  ["heroArt", "aboutArt"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = '<svg viewBox="0 0 120 200" aria-hidden="true"><rect x="44" y="6" width="32" height="26" fill="#c9a45c"/><rect x="50" y="32" width="20" height="14" fill="#8e7233"/><rect x="14" y="46" width="92" height="140" rx="10" fill="#c9a45c" fill-opacity=".22" stroke="#c9a45c" stroke-width="1.500"/><rect x="24" y="56" width="10" height="120" rx="5" fill="#fff" fill-opacity=".16"/><rect x="34" y="100" width="62" height="54" fill="#0a0908" fill-opacity=".78" stroke="#c9a45c" stroke-width=".8"/><text x="65" y="123" text-anchor="middle" font-family="Georgia,serif" font-size="9.500" letter-spacing="2" fill="#e3c887">EUPHORIA</text><text x="65" y="138" text-anchor="middle" font-family="Georgia,serif" font-size="5.500" letter-spacing="2.500" fill="#c9a45c">SIGNATURE MEMO</text></svg>';
  });
});
