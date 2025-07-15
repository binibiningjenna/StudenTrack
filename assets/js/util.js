export function closeModalAndRedirect() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('confirmdeleteAccountModal'));
  modal.hide();

  setTimeout(() => {
    loadPage('landing');
  }, 300);
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function initLocalStorage() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }

  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify({}));
  }

  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify([]));
  }

  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
  }

  if (!localStorage.getItem('grades')) {
    localStorage.setItem('grades', JSON.stringify([]));
  }

  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify({}));
  }
}
