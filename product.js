// =============================================
// LOAD PRODUCT FROM URL
// =============================================
(function loadProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const name   = params.get('name');
  const img    = params.get('img');

  if (name) {
    const title      = document.getElementById('product-title');
    const label      = document.getElementById('product-label');
    const breadcrumb = document.getElementById('breadcrumb-name');

    if (title)      title.textContent      = name.toUpperCase();
    if (label)      label.textContent      = name.toUpperCase();
    if (breadcrumb) breadcrumb.textContent = name;

    document.title = name + ' – Larry B';
  }

  if (img) {
    const mainImg = document.getElementById('product-main-img');
    if (mainImg) {
      mainImg.src = img;
      mainImg.alt = name || 'Product Image';
    }
  }
})();


// =============================================
// COLOUR SWATCHES
// =============================================
(function initColourSwatches() {
  const container = document.getElementById('colourSwatches');
  if (!container) return;

  const modal      = document.getElementById('customColourModal');
  const input       = document.getElementById('customColourInput');
  const confirmBtn  = document.getElementById('customColourConfirm');
  const cancelBtn   = document.getElementById('customColourCancel');
  let pendingBtn    = null; // the custom swatch button waiting on input

  container.addEventListener('click', function(e) {
    const btn = e.target.closest('.swatch');
    if (!btn) return;

    if (btn.dataset.colour === 'custom') {
      pendingBtn = btn;
      input.value = '';
      modal.classList.add('open');
      input.focus();
      return; // wait for modal confirm before activating swatch
    }

    container.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    checkReady();
  });

  confirmBtn.addEventListener('click', function() {
    const note = input.value.trim();
    if (!note || !pendingBtn) return;

    pendingBtn.dataset.customNote = note;
    container.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    pendingBtn.classList.add('active');
    checkReady();

    modal.classList.remove('open');
    pendingBtn = null;
  });

  cancelBtn.addEventListener('click', function() {
    modal.classList.remove('open');
    pendingBtn = null;
  });
})();

// =============================================
// SIZE SELECTOR
// =============================================
(function initSizeSelector() {
  const grid = document.getElementById('sizeGrid');
  if (!grid) return;

  grid.addEventListener('click', function(e) {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    grid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    checkReady();
  });
})();


// =============================================
// CHECK READY
// =============================================
function checkReady() {
  const colourChosen = document.querySelector('#colourSwatches .swatch.active');
  const sizeChosen   = document.querySelector('#sizeGrid .size-btn.active');
  const addToCart    = document.getElementById('addToCart');
  if (!addToCart) return;

  if (colourChosen && sizeChosen) {
    addToCart.classList.add('ready');
  } else {
    addToCart.classList.remove('ready');
  }
}


// =============================================
// QUANTITY STEPPER
// =============================================
(function initQuantity() {
  const minus   = document.getElementById('qtyMinus');
  const plus    = document.getElementById('qtyPlus');
  const display = document.getElementById('qtyValue');
  if (!minus || !plus || !display) return;

  let qty = 1;

  minus.addEventListener('click', function() {
    if (qty > 1) { qty--; display.textContent = qty; }
  });

  plus.addEventListener('click', function() {
    qty++;
    display.textContent = qty;
  });
})();


// =============================================
// ACCORDION
// =============================================
(function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const targetId = header.getAttribute('data-target');
      const body     = document.getElementById(targetId);
      const iconId   = 'icon' + targetId.charAt(0).toUpperCase() + targetId.slice(1);
      const icon     = document.getElementById(iconId);
      if (!body) return;

      const isOpen = body.classList.toggle('open');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  });
})();


// =============================================
// CART SYSTEM
// =============================================
const CART_KEY     = 'larryb_cart';
const CART_VERSION = 2;

function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (!saved || saved.version !== CART_VERSION) {
      localStorage.removeItem(CART_KEY);
      return [];
    }
    return saved.items || [];
  } catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify({ version: CART_VERSION, items }));
}

function updateCartBadge() {
  const cart  = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = total;
}

updateCartBadge();

// =============================================
// ADD TO CART
// =============================================
document.getElementById('addToCart').addEventListener('click', function () {
  const colour = document.querySelector('.swatch.active');
  const size   = document.querySelector('.size-btn.active');

  if (!colour) { alert('Please select a colour.'); return; }
  if (!size)   { alert('Please select a size.');   return; }

  const name     = document.getElementById('product-title').textContent;
  const params   = new URLSearchParams(window.location.search);
  const rawPrice = parseFloat(params.get('price')) || 0;
  const qty      = parseInt(document.getElementById('qtyValue').textContent) || 1;
  const colourVal = colour.getAttribute('data-colour');
  const colourNote = colour.dataset.customNote || null;
  const sizeVal   = size.getAttribute('data-size');
  const imgEl     = document.getElementById('product-main-img');
  const img       = imgEl ? imgEl.src : '';

  const id = btoa(name + colourVal + sizeVal).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);

  const cart     = getCart();
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, colour: colourVal, colourNote, size: sizeVal, price: rawPrice, qty, img });
  }

  saveCart(cart);
  updateCartBadge();

  const btn = document.getElementById('addToCart');
  const original = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.background = '#2EAE5E';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 1500);
});