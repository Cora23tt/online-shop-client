// signUpForm.js
import { fetchSignIn, renderSignInForm } from "./signInForm.js"
import { renderMainPage } from "./mainPage.js";
import { cfg } from "./main.js"

function renderSignUpForm() {
    window.location.hash = "#registration";
}

async function handleSignUp(event) {
    event.preventDefault();
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
    try {
        const response = await fetchSignUp(email, password);
        if (response.ok) {

            try { // sign in
                const response = await fetchSignIn(email, password);
                if (response.ok) {
                    const data = await response.json();
                    localStorage.clear();
                    localStorage.setItem('session-token', data.token);
                    renderMainPage();
                } else {
                    console.log('Sign-in failed after sign-up: ' + data.error);
                    renderSignInForm();
                }
            } catch (error) {
                console.log('An error occurred during sign-in after sign-up');
                renderSignInForm();
            }

        } else {
            alert('Sign-up failed: ' + data.error);
        }
    } catch (error) {
        console.log('An error occurred during sign-up');
    }
}

async function fetchSignUp(email, password) {
    const userData = {
        email: email,
        password: password
    };

    return await fetch(cfg.apiUrl + '/auth/sign-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
}

export { renderSignUpForm, handleSignUp };