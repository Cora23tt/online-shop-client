// main.js
import { handleSignIn } from './signInForm.js';
import { handleSignUp } from './signUpForm.js';
import { checkSessionAndRedirect, handleUnauthorized } from './userSession.js';

var cfg = {
    apiUrl: "",
    maxRequests: 10,
    retryDelay: 10
};

// reading configs
(function () {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            cfg.apiUrl = data.apiUrl;
            cfg.maxRequests = data.maxRequests;
            cfg.retryDelay = data.retryDelay;
        })
        .catch(error => {
            console.error('Error loading configuration:', error);
        });
})();

window.onload = async () => {
    checkSessionAndRedirect();
    setEventListeners();
    $('#loading-indicator').remove();
}

function setEventListeners() {
    $('#signup-form').on('submit', handleSignUp);
    $('#signin-form').on('submit', handleSignIn);
    $('#logout-btn').on('click', handleUnauthorized);
}

export { cfg, handleUnauthorized };