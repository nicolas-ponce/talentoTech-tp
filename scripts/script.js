const iconCarrito  = document.querySelector('.header_cartIcon');
const cartSection  = document.querySelector('.cart');
const addToCartButtons = document.querySelectorAll('.productos_cardsDiv-card_addToCartBtn');
const cartItemsContainer = document.querySelector('.cart_itemsContainer');
const emptyMessage = document.querySelector('.cart_container__emptyP');
const form = document.querySelector('.contacto_form');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerText = "Enviando...";

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

    if (response.ok) {
        form.reset();
        alert("¡Gracias por tu mensaje!");
    } else {
        alert("Ocurrió un error. Por favor, intentá nuevamente.");
    }
    } catch (error) {
        alert("No se pudo enviar el formulario. Verificá tu conexión.");
    }

    submitButton.disabled = false;
    submitButton.innerText = "Enviar";
  });





let cart = {};


function saveCart() {
  localStorage.setItem('kadleCart', JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem('kadleCart');
  if (!stored) return;
  cart = JSON.parse(stored);
  Object.keys(cart).forEach(id => renderCartItem(id));
  if (Object.keys(cart).length) emptyMessage.style.display = 'none';
}
loadCart();


iconCarrito.addEventListener('click', () => {
  cartSection.classList.toggle('active');
  iconCarrito.classList.toggle('active');
});


addToCartButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card   = btn.closest('.productos_cardsDiv-card');
    const id     = card.querySelector('.productos_cardsDiv-card_name')
                       .innerText.trim().toLowerCase();
    const title  = card.querySelector('.productos_cardsDiv-card_name').innerText;
    const price  = card.querySelector('.productos_cardsDiv-card_price').innerText;
    const imgSrc = card.querySelector('.productos_cardsDiv-card_img').src;

    if (cart[id]) {
      cart[id].qty += 1;
      updateQtyDOM(id);
    } else {
      cart[id] = { title, price, imgSrc, qty: 1 };
      renderCartItem(id);
    }
    emptyMessage.style.display = 'none';
    saveCart();
  });
});


function renderCartItem(id) {

  if (cartItemsContainer.querySelector(`[data-id="${CSS.escape(id)}"]`)) return;

  const { title, price, imgSrc, qty } = cart[id];
  const item = document.createElement('div');
  item.className = 'cart_item';
  item.dataset.id = id;
  item.innerHTML = `
    <img class="cart_item-img" src="${imgSrc}" alt="${title}">
    <div class="cart_item-data">
        <h4 class="cart_item-title">${title}</h4>
        <p class="cart_item-price">${price}</p>
    </div>
    <div class="cart_item-controls">
        <button class="cart_item-btn minus">−</button>
        <span class="cart_item-qty">${qty}</span>
        <button class="cart_item-btn plus">+</button>
        <button class="cart_item-btn delete">✕</button>
    </div>
  `;
  cartItemsContainer.appendChild(item);
}


function updateQtyDOM(id) {
  const safeId = CSS.escape(id);
  const item = cartItemsContainer.querySelector(`[data-id="${safeId}"]`);
  if (item) item.querySelector('.cart_item-qty').innerText = cart[id].qty;
}


cartItemsContainer.addEventListener('click', e => {
  const btn = e.target.closest('.cart_item-btn');
  if (!btn) return;

  const itemDiv = btn.closest('.cart_item');
  const id = itemDiv.dataset.id;

  if (btn.classList.contains('plus')) {
    cart[id].qty += 1;
    updateQtyDOM(id);

  } else if (btn.classList.contains('minus')) {
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) deleteProduct(id);
    else updateQtyDOM(id);

  } else if (btn.classList.contains('delete')) {
    deleteProduct(id);
  }
  saveCart();
});


function deleteProduct(id) {
  const safeId = CSS.escape(id);
  delete cart[id];
  const item = cartItemsContainer.querySelector(`[data-id="${safeId}"]`);
  if (item) item.remove();

  if (Object.keys(cart).length === 0) {
    emptyMessage.style.display = 'block';
  }
}
