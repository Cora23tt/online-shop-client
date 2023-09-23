// categories.js
import { cfg, handleUnauthorized } from './main.js';
import { categoriesNavHandler } from './product.js';

function renderCategoriesTabs(categories) {
    const categories_nav = $('#categories-nav');
    categories_nav.html('');
    categories.forEach(category => {
        const category_item = createCategoryItem(category);
        categories_nav.append(category_item);
    });
    $('#categories-nav li a').on('click', categoriesNavHandler);
}

async function fetchCategories() {
    let attempts = 0;
    let categories = [];
    while (attempts < cfg.maxRequests) {
        try {
            const response = await fetch(cfg.apiUrl + '/api/en/category/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                },
            });
            if (response.status == 401) handleUnauthorized();
            if (!response.ok) {
                throw new Error(`Error fetching product data. Status: ${response.status}`);
            }
            const data = await response.json();
            categories = data.categories;
            break;
        } catch (error) {
            console.error('Error fetching categories:', error);
            attempts++;
            if (attempts >= cfg.maxRequests) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
        }
    }
    return categories;
}

async function fetchCategory(id) {
    let attempts = 0;
    let category = {};
    while (attempts < cfg.maxRequests) {
        try {
            const response = await fetch(cfg.apiUrl + `/api/en/category/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                },
            });
            if (response.status == 401) handleUnauthorized();
            if (!response.ok) {
                throw new Error(`Error fetching product data. Status: ${response.status}`);
            }
            const data = await response.json();
            category = data.category;
            break;
        } catch (error) {
            console.error('Error fetching categories:', error);
            attempts++;
            if (attempts >= cfg.maxRequests) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
        }
    }
    return category;
}

function createCategoryItem(category) {
    const categoryItem = document.createElement('li');
    categoryItem.className = 'nav-item';
    const categoryInnerHtml =
        `<a class="nav-link" id="tab-${category.id}">${category.translations[0].name}</a>`;
    categoryItem.innerHTML = categoryInnerHtml;
    return categoryItem;
}

export { fetchCategories, renderCategoriesTabs, fetchCategory };