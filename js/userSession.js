// userSession.js
import { renderSignInForm } from './signInForm.js';
import { renderMainPage } from './mainPage.js';

function checkSessionAndRedirect() {
    if (localStorage.getItem("session-token") == null) {
        renderSignInForm();
    } else {
        renderMainPage();
    }
}

function handleUnauthorized() {
    localStorage.removeItem("session-token");
    location.hash = '';
    location.reload();
}

export { checkSessionAndRedirect, handleUnauthorized };