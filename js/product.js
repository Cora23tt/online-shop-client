// product.js
import { cfg, handleUnauthorized } from './main.js';
import { fetchCategory } from './categories.js';
import { addToCart, createCartItem } from './cart.js';

function renderProductCards(products) {
  const productsRow = document.getElementById('products-row');
  var storedCartItems = localStorage.getItem('cart');
  var cartItems = JSON.parse(storedCartItems);
  productsRow.innerHTML = '';
  products.forEach(product => {

    var productCard;
    var InCart = false;
    
    cartItems.forEach(cartItem => {
      if (cartItem.id == product.id) {
        InCart = true;
      }
    });

    if (InCart) {
      productCard = createCartItem(product, 1);
    } else {
      productCard = createProductCard(product);
    }
    productsRow.append(productCard);

  });
}

async function renderProductCard() {
  const product_id = this.parentElement.children[1].children[2].innerHTML;
  const product = await fetchProduct(product_id);
  const category = await fetchCategory(product.category_id);
  var categoryName = '';
  category.translations.forEach(translation => {
    if (translation.language_code == 'en') {
      categoryName = translation.name
    }
  });
  const productViewElement = createProductViewElement(product, categoryName);
  const productDetailsView = document.getElementById('product-details-view');
  productDetailsView.innerHTML = '';
  productDetailsView.appendChild(productViewElement);
  $('#navbar').show();
  window.location.hash = "#product";
}

async function fetchProducts() {
  let attempts = 0;
  let products = [];
  while (attempts < cfg.maxRequests) {
    try {
      const response = await fetch(cfg.apiUrl + '/api/en/product/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
        },
      });
      if (response.status == 401) handleUnauthorized();
      if (!response.ok) {
        throw new Error(`Error fetching product data. Status: ${response.status}`);
      }
      const data = await response.json();
      products = data.products;
      break;
    } catch (error) {
      console.error('Error fetching product data:', error);
      attempts++;
      if (attempts >= cfg.maxRequests) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
    }
  }
  return products;
}

async function fetchProduct(id) {
  let attempts = 0;
  let product = {};
  while (attempts < cfg.maxRequests) {
    try {
      const response = await fetch(cfg.apiUrl + `/api/en/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
        },
      });
      if (response.status == 401) handleUnauthorized();
      if (!response.ok) {
        throw new Error(`Error fetching product. Status: ${response.status}`);
      }
      const data = await response.json();
      product = data.product;
      break;
    } catch (error) {
      console.error('Error fetching product data:', error);
      attempts++;
      if (attempts >= cfg.maxRequests) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
    }
  }
  return product;
}

async function fetchProductsByCategory(categody_id) {
  let attempts = 0;
  let products = [];

  while (attempts < cfg.maxRequests) {
    try {
      const response = await fetch(cfg.apiUrl + `/api/en/product/?type=by_category&category_id=${categody_id.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
        },
      });
      if (response.status == 401) handleUnauthorized();
      if (!response.ok) {
        throw new Error(`Error fetching product data. Status: ${response.status}`);
      }
      const data = await response.json();
      products = data.products;
      break;
    } catch (error) {
      console.error('Error fetching product data:', error);
      attempts++;
      if (attempts >= cfg.maxRequests) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
    }
  }
  return products;
}

function createProductCard(product) {
  const productCard = document.createElement('div');
  productCard.className = 'col-lg-4 col-md-6 mb-4';

  const cardInnerHtml = `
      <div class="card">
        <img src="${product.image_urls[0]}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price}</p>
          <div class="product-id" style="display: none;">${product.id}</div>
          <button class="btn btn-primary" id="add-to-cart-btn">Add to Cart</button>
        </div>  
      </div>  
    `;

  productCard.innerHTML = cardInnerHtml;

  productCard.children[0].children[0].addEventListener('click', renderProductCard); // image click -> show product details
  productCard.children[0].children[1].children[3].addEventListener('click', addToCart); // Add to cart button event handler

  return productCard;
}

function createProductViewElement(product, categoryName) {
  var imageElements = '';
  product.image_urls.forEach(imgUrl => {
    imageElements = imageElements + `
    <div class="carousel-item active">
      <img src="${imgUrl}" class="d-block w-100">
    </div>`;
  });

  const productDiv = document.createElement('div');
  productDiv.innerHTML = `
  <div class="col-sm-4">
    <div id="carouselExample" class="carousel slide carousel-fade">
        <div class="carousel-inner" id="product-view-carousel">
          ${imageElements}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
  </div>
  <div class="col-sm-4">
    <div class="card-body">
        <div class="d-flex">
            <h5 class="card-title">${product.name}</h5>
            <h5 class="card-title mx-3">$${product.price}</h5>
        </div>
        <p class="card-text">${product.description}</p>
        <p class="card-text">${product.consignment_description}</p>
        <div class="d-flex">
            <p class="card-text mb-0"><small class="text-body-secondary">Available count: ${product.quantity}</small></p>
            <p class="card-text mb-0 ms-auto me-3"><small class="text-body-secondary"><u>${categoryName}</u></small></p>
        </div>
        <p class="card-text"><small class="text-body-secondary">Expiration date: ${product.expiration_date}</small></p>
    </div>
  </div>`;
  return productDiv;
}

async function categoriesNavHandler() {
  $('#categories-nav a').attr('class', 'nav-link');
  this.className = 'nav-link active';
  if (this.id == 'tab-all') {
    const products = await fetchProducts();
    renderProductCards(products);
  } else {
    const products = await fetchProductsByCategory(this.id.replace('tab-', ''));
    renderProductCards(products);
  }
}

export { fetchProducts, renderProductCards, categoriesNavHandler, fetchProduct };
