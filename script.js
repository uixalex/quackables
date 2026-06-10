function playQuack() {
  const a1 = new Audio('assets/quack.mp3');
  a1.volume = 1;
  a1.play();
  a1.onended = () => {
    const a2 = new Audio('assets/quack.mp3');
    a2.volume = 1;
    a2.play();
  };
}

let cartOpen = false;
let cartItems = [];

function toggleCart() {
  cartOpen = !cartOpen;
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel.style.display = 'flex';
  overlay.style.display = cartOpen ? 'block' : 'none';
  requestAnimationFrame(() => {
    panel.classList.toggle('open', cartOpen);
  });
  if (!cartOpen) {
    setTimeout(() => { if (!cartOpen) panel.style.display = 'none'; }, 350);
  }
}

function addToCart(name, price, img) {
  // Animate cart button
  const btn = document.getElementById('cart-btn');
  btn.classList.remove('cart-bounce');
  void btn.offsetWidth;
  btn.classList.add('cart-bounce');

  // Add item
  const existing = cartItems.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ name, price, img, qty: 1 });
  }
  updateCart();

  // Show cart
  if (!cartOpen) toggleCart();
}

function removeFromCart(name) {
  cartItems = cartItems.filter(i => i.name !== name);
  updateCart();
}

function updateCart() {
  const count = cartItems.reduce((s, i) => s + i.qty, 0);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = '$' + total;

  const container = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  empty.style.display = cartItems.length === 0 ? 'block' : 'none';

  container.querySelectorAll('.cart-item').forEach(el => el.remove());

  cartItems.forEach(function(item) {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = '<img src="' + item.img + '" alt="' + item.name + '"/>'
      + '<div class="cart-item-info">'
      + '<div class="cart-item-name">' + item.name + '</div>'
      + '<div class="cart-item-price">$' + item.price + ' x ' + item.qty + '</div>'
      + '</div>'
      + '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.name + '\')">&#x2715;</button>';
    container.appendChild(el);
  });
}

// Hook up all Add to Cart buttons
document.querySelectorAll('.card-back .btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const back = this.closest('.card-back');
    const inner = this.closest('.card-inner');
    const front = inner.querySelector('.card-front');
    const name = back.querySelector('.card-back-name').textContent;
    const priceText = back.querySelector('.card-back-price').textContent.replace(/[^0-9]/g, '');
    const price = parseInt(priceText);
    const img = front.querySelector('img')?.src || '';
    addToCart(name, price, img);
  });
});

// Scroll reveal
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
