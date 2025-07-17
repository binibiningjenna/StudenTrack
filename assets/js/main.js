import { closeModalAndRedirect } from './util.js';
import { initLocalStorage } from './util.js';

function loadPage(pageName) {
    localStorage.setItem('lastPage', pageName);
    const container = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');

    // Hide navbar on auth and landing pages
    if (['login', 'signup', 'checkin', 'landing'].includes(pageName)) {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
        const collapseTarget = document.getElementById('navbars');
        const bsCollapse = bootstrap.Collapse.getInstance(collapseTarget);
        if (bsCollapse) bsCollapse.hide();
    }

    // Fetch and load HTML content, then initialize corresponding module
    fetch(`assets/pages/${pageName}.html`)
        .then((res) => res.text())
        .then((data) => {
            container.innerHTML = data;

            // Dynamically import and init page-specific JS
            switch (pageName) {
                case 'grades':
                    import('./grades.js').then(module => {
                        if (module.initGradesPage) {
                            module.initGradesPage();
                        }
                    });
                    break;
                case 'attendance':
                    import('./attendance.js').then(module => {
                        if (module.initAttendancePage) {
                            module.initAttendancePage();
                        }
                    });
                    break;
                case 'settings':
                    import('./settings.js').then(module => {
                        if (module.initSettingsPage) {
                            module.initSettingsPage();
                        }
                    });
                    break;
                case 'login':
                    import('./login.js').then(module => {
                        if (module.initLoginForm) {
                            module.initLoginForm();
                        }
                    });
                    break;
                case 'signup':
                    import('./signup.js').then(module => {
                        if (module.initSignupForm) {
                            module.initSignupForm();
                        }
                    });
                    break;
                case 'dashboard':
                   import('./dashboard.js').then(module => {
                        if (module.initDashboardPage) {
                            module.initDashboardPage();
                        }
                    });
                    break;
                case 'checkin':
                   import('./checkin.js').then(module => {
                        if (module.initCheckInPage) {
                            module.initCheckInPage();
                        }
                    });
                    break;
                default:
                    break;
            }
        })
        .catch((err) => {
            container.innerHTML = "<p class='text-danger'>Error loading content.</p>";
            console.error(err);
        });
}

// Clear session and return to landing page
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('lastPage', 'landing'); 
    loadPage('landing');
}

// Expose functions globally
window.loadPage = loadPage;
window.closeModalAndRedirect = closeModalAndRedirect;
window.logout = logout;

// Init app on load
document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();
    const lastPage = localStorage.getItem('lastPage') || 'landing';
    loadPage(lastPage);
});