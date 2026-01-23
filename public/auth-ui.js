// This file handles only the visual switching on the login page
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toRegister = document.getElementById('link-to-register');
    const toLogin = document.getElementById('link-to-login');

    const toggle = () => {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    };

    if (toRegister) toRegister.addEventListener('click', toggle);
    if (toLogin) toLogin.addEventListener('click', toggle);
});