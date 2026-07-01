// ============================================
//   LARRY B — CART PAGE LOGIC (cart.js)
// ============================================

const CART_KEY = 'larryb_cart';
const CART_VERSION = 2;
const TAX_RATE = 0.075;
let discountApplied = 0; // now a decimal percentage, e.g. 0.10 for 10% off (0 = no discount)

// ---------- HELPERS ----------

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

function formatPrice(n) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------- RENDER ----------

function render() {
  const cart      = getCart();
  const layout    = document.getElementById('cart-layout');
  const emptyEl   = document.getElementById('cart-empty');
  const successEl = document.getElementById('checkout-success');
  const subtitle  = document.getElementById('cart-subtitle');
  const list      = document.getElementById('cart-items-list');
  const countEl   = document.getElementById('cart-count');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;
  if (subtitle) subtitle.textContent = totalQty === 0 ? '' : totalQty + (totalQty === 1 ? ' item' : ' items');

  if (cart.length === 0) {
    if (layout)    layout.style.display    = 'none';
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (successEl) successEl.style.display = 'none';
    return;
  }

  if (layout)    layout.style.display    = 'grid';
  if (emptyEl)   emptyEl.style.display   = 'none';
  if (successEl) successEl.style.display = 'none';

list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.img
          ? `<img src="${item.img}" alt="${item.name}">`
          : `<i class="fa fa-image" style="font-size:1.8rem;color:#ccc;"></i>`
        }
      </div>
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-variant">${[item.colourNote ? `Custom: ${item.colourNote}` : item.colour, item.size ? 'Size ' + item.size : ''].filter(Boolean).join(' / ')}</span>
        <span class="cart-item-unit-price">${formatPrice(item.price)} each</span>
        <button class="cart-item-remove" onclick="removeItem('${item.id}')">Remove</button>
      </div>
      <div class="cart-qty">
        <button class="cart-qty-btn" onclick="changeQty('${item.id}', -1)">&#8722;</button>
        <span class="cart-qty-num">${item.qty}</span>
        <button class="cart-qty-btn" onclick="changeQty('${item.id}', 1)">&#43;</button>
      </div>
      <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  calcSummary(cart);
}

// ---------- SUMMARY ----------

function calcSummary(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountApplied ? subtotal * discountApplied : 0;
  const taxBase  = subtotal - discount;
  const tax      = taxBase * TAX_RATE;
  const total    = taxBase + tax;

  document.getElementById('s-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('s-tax').textContent      = formatPrice(tax);
  document.getElementById('s-total').textContent    = formatPrice(total);

  const discRow = document.getElementById('discount-row');
  if (discountApplied) {
    discRow.style.display = 'flex';
    document.getElementById('s-discount').textContent = '−' + formatPrice(discount);
  } else {
    discRow.style.display = 'none';
  }
}

// ---------- ACTIONS ----------

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  render();
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(x => x.id !== id);
  saveCart(cart);
  render();
}

document.addEventListener('DOMContentLoaded', render);

// ---------- PROMO ----------
// Validation now happens server-side via a Netlify Function
// (netlify/functions/check-promo.js). The valid codes are never
// sent to the browser, so they can't be found via view-source or dev tools.

async function applyPromo() {
  const input = document.getElementById('promo-input');
  const msg   = document.getElementById('promo-msg');
  const code  = input.value.trim();

  if (!code) {
    msg.textContent = 'Enter a code.';
    msg.className   = 'promo-msg error';
    return;
  }

  msg.textContent = 'Checking code...';
  msg.className   = 'promo-msg';

  try {
    const res = await fetch('/.netlify/functions/check-promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!res.ok) throw new Error('Request failed');

    const data = await res.json();

    if (data.valid) {
      discountApplied = data.discount; // e.g. 0.10
      msg.textContent = '✓ Code applied — ' + Math.round(data.discount * 100) + '% off your order!';
      msg.className   = 'promo-msg success';
    } else {
      discountApplied = 0;
      msg.textContent = 'Invalid code.';
      msg.className   = 'promo-msg error';
    }
  } catch (err) {
    discountApplied = 0;
    msg.textContent = 'Something went wrong. Please try again.';
    msg.className   = 'promo-msg error';
    console.error('Promo check failed:', err);
  }

  calcSummary(getCart());
}

// ---------- CHECKOUT ----------

function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountApplied ? subtotal * discountApplied : 0;
  const taxBase  = subtotal - discount;
  const tax      = taxBase * TAX_RATE;
  const total    = taxBase + tax;

  const amountInKobo = Math.round(total * 100);

  const customerEmail = prompt('Please enter your email address to continue:');
  if (!customerEmail || !customerEmail.includes('@')) {
    alert('A valid email address is required to complete your order.');
    return;
  }

  const paystackInstance = new PaystackPop();

  paystackInstance.newTransaction({
    key: "pk_live_f5c22feb665d930ab27f22ff18190de674759e42",
    email: customerEmail,
    amount: amountInKobo,
    currency: 'NGN',
    ref: 'LARRYB_' + Math.floor(Math.random() * 1000000000),
    label: 'Larry B Casuals',
    metadata: {
      custom_fields: [
        {
          display_name: 'Cart Items',
          variable_name: 'cart_items',
          value: cart.map(i => `${i.name} x${i.qty}`).join(', ')
        }
      ]
    },
    onSuccess: function (transaction) {
      const layout    = document.getElementById('cart-layout');
      const successEl = document.getElementById('checkout-success');
      layout.style.display    = 'none';
      successEl.style.display = 'block';
      saveCart([]);
      document.getElementById('cart-count').textContent = '0';
      console.log('Payment successful! Reference:', transaction.reference);
    },
    onCancel: function () {
      alert('Payment was cancelled. Your cart is still saved.');
    }
  });
}