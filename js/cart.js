// cart.js
import { fetchProduct } from "./product.js";
import { renderCheckoutPage } from "./checkout.js";
import { renderMainPage } from "./mainPage.js";

$('#cart-btn').on('click', renderCartPage);
$('#checkout-btn').on('click', renderCheckoutPage);

function renderCartPage() {
    var storedCartItems = localStorage.getItem('cart');
    if (storedCartItems == null) {
        localStorage.setItem('cart', JSON.stringify([]));
        storedCartItems = localStorage.getItem('cart');
    }
    var cartItems = JSON.parse(storedCartItems);
    if (cartItems.length === 0) {
        $('#empty-cart-title').show();
    } else {
        $('#empty-cart-title').hide();
    }
    var cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(async item => {
        const product = await fetchProduct(item.id);
        const cartItem = createCartItem(product, item.quantity)
        cartItemsContainer.append(cartItem);
        // cartItem.children[0].children[1].children[3].addEventListener('click', event => decreaseQuantity(event.target, item.id))
        // cartItem.children[0].children[1].children[5].addEventListener('click', event => increaseQuantity(event.target, item.id))
    });
    window.location.hash = '#cart';
}

function increaseQuantity(_elem, productId) {
    var storedCartItems = localStorage.getItem('cart');
    var cartItems = JSON.parse(storedCartItems);

    cartItems.forEach(cartItem => {
        if (cartItem.id == productId) {
            cartItem.quantity++;
            _elem.parentElement.children[4].innerHTML = cartItem.quantity;
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    });
}

function decreaseQuantity(elem, productId) {
    const counter = parseInt(elem.parentElement.children[4].innerHTML);
    var storedCartItems = localStorage.getItem('cart');
    var cartItems = JSON.parse(storedCartItems);

    if (counter == 1) {
        cartItems.forEach(cartItem => {
            if (cartItem.id == productId) {
                const newCartItems = cartItems.filter(item => item !== cartItem);
                localStorage.setItem('cart', JSON.stringify(newCartItems));
                if (window.location.hash = "#index") {
                    renderMainPage();
                } else {
                    renderCartPage();
                }
                return
            }
        });
    } else {
        cartItems.forEach(cartItem => {
            if (cartItem.id == productId) {
                cartItem.quantity--;
                localStorage.setItem('cart', JSON.stringify(cartItems));
            }
        });
    }

    elem.parentElement.children[4].innerHTML = counter - 1;
}

async function addToCart() {
    const productId = this.parentElement.children[2].innerHTML; // product id from card element

    // replace item to cartItem
    const product = await fetchProduct(productId);
    const cartitem = createCartItem(product, 1)
    this.parentElement.parentElement.parentElement.parentElement.replaceChild(cartitem, this.parentElement.parentElement.parentElement)

    const storedCartItems = localStorage.getItem('cart');
    var cartItems = JSON.parse(storedCartItems);

    // increase item count if exists
    for (let index = 0; index < cartItems.length; index++) {
        const element = cartItems[index];
        if (element.id == productId) {
            cartItems[index].quantity++;
            localStorage.setItem('cart', JSON.stringify(cartItems));
            return
        }
    }

    // add new item
    const newItem = { id: productId, quantity: 1 };
    cartItems.push(newItem)
    localStorage.setItem('cart', JSON.stringify(cartItems));
    return;
}

function createCartItem(product, quantity) {
    const cartItem = document.createElement('div');
    cartItem.className = 'col-lg-4 col-md-6 mb-4';
    const cardInnerHtml = `
        <div class="card mb-3">
          <img src="${product.image_urls[0]}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">$${product.price}</p>
            <div class="product-id" style="display: none;">${product.id}</div>
            <button class="btn btn-primary decrease-quantity me-2">-</button>
            <span class="item-quantity">${quantity}</span>
            <button class="btn btn-primary increase-quantity ms-2">+</button>
          </div>  
        </div>
        `;
    cartItem.innerHTML = cardInnerHtml;
    cartItem.children[0].children[1].children[3].addEventListener('click', event => decreaseQuantity(event.target, product.id))
    cartItem.children[0].children[1].children[5].addEventListener('click', event => increaseQuantity(event.target, product.id))
    return cartItem;
}

export { addToCart, createCartItem };