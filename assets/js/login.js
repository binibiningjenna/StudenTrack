import { hashPassword, showToast } from './util.js';
export function initLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('floatingEmail').value.trim();
            const password = document.getElementById('floatingPassword').value.trim();

            // Validate login form inputs
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

            // Invalid email (not found)
            if (!user) {
                document.getElementById('floatingEmail').classList.add('is-invalid');
                document.getElementById('floatingPassword').classList.add('is-invalid');
                showToast('Invalid email or password.', 'error');
                return;
            }

            const hashedPassword = await hashPassword(password);

            // Password doesn't match
            if (user.password !== hashedPassword) {
                document.getElementById('floatingPassword').classList.add('is-invalid');
                showToast('Incorrect password.', 'error');
                return;
            }

            // Save current user and redirect to dashboard
            localStorage.setItem('currentUser', JSON.stringify(user));
            loadPage('dashboard');
        });
    }

}
