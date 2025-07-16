import { closeModalAndRedirect } from './util.js';
import { initLocalStorage } from './util.js';

function loadPage(pageName) {
    const container = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');

    if (['login', 'signup', 'checkin', 'landing'].includes(pageName)) {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
        const collapseTarget = document.getElementById('navbars');
        const bsCollapse = bootstrap.Collapse.getInstance(collapseTarget);
        if (bsCollapse) bsCollapse.hide();
    }

    fetch(`assets/pages/${pageName}.html`)
        .then((res) => res.text())
        .then((data) => {
            container.innerHTML = data;

            switch (pageName) {
                case 'grades':
                    import('./grades.js').then(module => {
                        if (module.initGradesPage) {
                            module.initGradesPage();
                        }
                    });
                    break;
                case 'attendance':
                    setTimeout(() => {
                        loadAttendanceCalendar();
                    }, 0);
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
                default:
                    break;
            }
        })
        .catch((err) => {
            container.innerHTML = "<p class='text-danger'>Error loading content.</p>";
            console.error(err);
        });
}


function logout() {
    localStorage.removeItem('currentUser');
    loadPage('landing');
}

window.loadPage = loadPage;
window.closeModalAndRedirect = closeModalAndRedirect;
window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();
    loadPage('landing')
});