import { hashPassword } from './util.js';
export function initSignupForm() {

  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const rfid = document.getElementById('rfid').value.trim();

      const inputs = ['name', 'email', 'password', 'confirmPassword', 'rfid'];
      inputs.forEach(id => document.getElementById(id).classList.remove('is-invalid'));

      let hasError = false;

      if (!name) {
        document.getElementById('name').classList.add('is-invalid');
        hasError = true;
      }

      if (!email || !email.includes('@') || !email.includes('.')) {
        document.getElementById('email').classList.add('is-invalid');
        hasError = true;
      }

      if (password.length < 8) {
        document.getElementById('password').classList.add('is-invalid');
        hasError = true;
      }

      if (confirmPassword !== password) {
        document.getElementById('confirmPassword').classList.add('is-invalid');
        hasError = true;
      }

      if (!rfid) {
        document.getElementById('rfid').classList.add('is-invalid');
        hasError = true;
      }

      if (hasError) return;

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const emailExists = users.some(user => user.email === email);

      function showToast(message) {
        const toastBody = document.getElementById('signupFormBody');
        toastBody.textContent = message;
        const signupAlert = document.getElementById('signupFormAlert');
        const toast = bootstrap.Toast.getOrCreateInstance(signupAlert);
        toast.show();
      }

      if (emailExists) {
        showToast('Email already exists.')
        return;
      }

      const hashedPassword = await hashPassword(password);
      const newUser = { name, email, password: hashedPassword, rfid };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      loadPage('dashboard');
    });
  }

}