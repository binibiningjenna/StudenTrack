import { hashPassword } from './util.js';
export function initLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('floatingEmail').value.trim();
            const password = document.getElementById('floatingPassword').value.trim();

            const inputs = ['floatingEmail', 'floatingPassword'];
            inputs.forEach(id => document.getElementById(id).classList.remove('is-invalid'));

            let hasError = false;

            if (!email || !email.includes('@') || !email.includes('.')) {
                document.getElementById('floatingEmail').classList.add('is-invalid');
                hasError = true;
            }

            if (!password) {
                document.getElementById('floatingPassword').classList.add('is-invalid');
                hasError = true;
            }

            if (hasError) return;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email);

            function showToast(message) {
                const toastBody = document.getElementById('loginFormBody');
                toastBody.textContent = message;
                const loginAlert = document.getElementById('loginFormAlert');
                const toast = bootstrap.Toast.getOrCreateInstance(loginAlert);
                toast.show();
            }

            if (!user) {
                document.getElementById('floatingEmail').classList.add('is-invalid');
                document.getElementById('floatingPassword').classList.add('is-invalid');
                showToast('Invalid email or password.');
                return;
            }

            const hashedPassword = await hashPassword(password);

            if (user.password !== hashedPassword) {
                document.getElementById('floatingPassword').classList.add('is-invalid');
                showToast('Incorrect password.');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            loadPage('dashboard');
        });
    }

}
