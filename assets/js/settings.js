import { getCurrentUser, showToast, hashPassword, closeModalAndRedirect } from './util.js';

export function initSettingsPage() {
    // Get display elements
    const nameDisplay = document.getElementById('name');
    const emailDisplay = document.getElementById('email');
    const rfidDisplay = document.getElementById('rfid');
    const yearSelect = document.getElementById('academicYear');
    const semesterSelect = document.getElementById('semester');

    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Get all users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(user => user.email === currentUser.email);
    if (!userData) return;

    // Display user info
    nameDisplay.textContent = userData.name;
    emailDisplay.textContent = userData.email;
    rfidDisplay.textContent = userData.rfid;

    // Load saved filters
    const filters = JSON.parse(localStorage.getItem('settings')) || {};
    const userFilter = filters[currentUser.email] || {};
    yearSelect.value = userFilter.year || '';
    semesterSelect.value = userFilter.semester || '';

    // Save filter changes
    yearSelect.addEventListener('change', saveFilter);
    semesterSelect.addEventListener('change', saveFilter);

    function saveFilter() {
        const updatedFilters = JSON.parse(localStorage.getItem('settings')) || {};
        updatedFilters[currentUser.email] = {
            year: yearSelect.value,
            semester: semesterSelect.value
        };
        localStorage.setItem('settings', JSON.stringify(updatedFilters));
    }

    // Handle edit modal
    const editModal = document.getElementById('editAccountModal');
    editModal.addEventListener('show.bs.modal', () => {
        // Fill input fields
        document.getElementById('editName').value = userData.name;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editNumber').value = userData.rfid;
    });

    // Update account info
    window.updateUserAccount = function () {
        const nameInput = document.getElementById('editName');
        const emailInput = document.getElementById('editEmail');
        const rfidInput = document.getElementById('editNumber');

        if (!nameInput || !emailInput || !rfidInput) return;

        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();
        const newRFID = rfidInput.value.trim();

        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex === -1) return;

        // Update user data
        users[userIndex].name = newName;
        users[userIndex].email = newEmail;
        users[userIndex].rfid = newRFID;

        // Save changes
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify({ email: newEmail }));

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editAccountModal'));
        modal.hide();

        // Show success toast
        showToast('Account updated successfully.', 'success');

        // Update display info
        nameDisplay.textContent = newName;
        emailDisplay.textContent = newEmail;
        rfidDisplay.textContent = newRFID;
    };

    // Handle delete modal
    const deleteModal = document.getElementById('deleteAccountModal');
    deleteModal.addEventListener('show.bs.modal', () => { });

    // Delete user account
    window.deleteUserAccount = function () {
        const email = currentUser.email;

        // Remove user
        localStorage.setItem('users', JSON.stringify(users.filter(user => user.email !== email)));

        // Remove related data
        ['grades', 'events', 'attendance'].forEach(key => {
            const raw = localStorage.getItem(key);
            let parsed = JSON.parse(raw || 'null');

            if (Array.isArray(parsed)) {
                parsed = parsed.filter(item => item.email !== email);
            } else if (typeof parsed === 'object' && parsed !== null) {
                delete parsed[email];
            } else {
                parsed = Array.isArray(parsed) ? [] : {};
            }

            localStorage.setItem(key, JSON.stringify(parsed));
        });

        // Remove settings
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        delete settings[email];
        localStorage.setItem('settings', JSON.stringify(settings));

        // Clear current user
        localStorage.removeItem('currentUser');

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
        modal.hide();
        document.activeElement.blur();

        // Redirect after delete
        closeModalAndRedirect();
    };

    // Change user password
    window.changePassword = async function () {
        const currentInput = document.getElementById('CurrentPassword');
        const newInput = document.getElementById('NewPassword');
        const confirmInput = document.getElementById('ConfirmPassword');

        const current = currentInput?.value.trim();
        const newPass = newInput?.value.trim();
        const confirm = confirmInput?.value.trim();

        // Check empty fields
        if (!current || !newPass || !confirm) {
            return showToast('Please fill in all fields.', 'warning');
        }

        // Get updated data
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userIndex = users.findIndex(user => user.email === currentUser.email);

        if (userIndex === -1) {
            return showToast('User not found.', 'warning');
        }

        // Validate current password
        const currentHashed = await hashPassword(current);
        const storedHashed = users[userIndex].password;
        if (currentHashed !== storedHashed) {
            return showToast('Current password is incorrect', 'error');
        }

        // Validate new password
        if (newPass.length < 8) {
            return showToast('Password must be at least 8 characters.', 'warning');
        }

        if (newPass !== confirm) {
            return showToast('Passwords do not match.', 'error');
        }

        // Save new password
        const newHashed = await hashPassword(newPass);
        users[userIndex].password = newHashed;
        localStorage.setItem('users', JSON.stringify(users));

        // Show success message
        showToast('Password updated successfully.', 'success');

        // Reset and hide modal
        document.getElementById('editPasswordForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPasswordModal'));
        modal.hide();
    };
}
