import { renderErrorPage } from './errorPage.js';
import { renderProductCards, fetchProducts } from './product.js';
import { renderCategoriesTabs, fetchCategories } from './categories.js';

async function renderMainPage() {
    try {
        window.location.hash = '#index';
        localStorage.setItem('cart', '[]');

        const categories = await fetchCategories();
        renderCategoriesTabs(categories);

        const products = await fetchProducts();
        renderProductCards(products);

        $('#registration-btn-itm, #login-btn-itm').hide();
        $('#navbar').show();
    } catch (error) {
        renderErrorPage(error);
    }
}

export { renderMainPage };
