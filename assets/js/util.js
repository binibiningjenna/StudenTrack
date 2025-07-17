export function closeModalAndRedirect() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
  modal.hide();

  setTimeout(() => {
    loadPage('landing');
  }, 300);
}

// // Hashes the given password using SHA-256
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getCurrentUser() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user && user.email ? user : null;
}

export function showToast(msg, type = 'info') {
  const toastElement = document.getElementById('alertToast');
  const toastBody = document.getElementById('toastBody');

  if (!toastElement || !toastBody) return;

  toastElement.className = 'toast align-items-center border-0';
  const colorMap = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-dark'
  };
  const colorClass = colorMap[type] || colorMap.info;
  toastElement.classList.add(...colorClass.split(' '));

  toastBody.textContent = msg;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

export function initLocalStorage() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }

  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify({}));
  }

  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify({}));
  }

  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
  }

  if (!localStorage.getItem('grades')) {
    localStorage.setItem('grades', JSON.stringify({}));
  }

  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify({}));
  }
}
