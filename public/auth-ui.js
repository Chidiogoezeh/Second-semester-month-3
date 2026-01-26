// This file handles only the visual switching on the login page
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toRegister = document.getElementById('link-to-register');
    const toLogin = document.getElementById('link-to-login');

    const toggle = () => {
        // We use classList.toggle to add/remove the 'hidden' class we defined in style.css
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    };

    // Add listeners if the elements exist on the page
    if (toRegister) toRegister.addEventListener('click', toggle);
    if (toLogin) toLogin.addEventListener('click', toggle);
});