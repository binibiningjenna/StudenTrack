function loadPage(pageName) {
    const container = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');

    if (['login', 'signup', 'checkin', 'landing'].includes(pageName)) {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
    }

    fetch(`assets/pages/${pageName}.html`)
        .then((res) => res.text())
        .then((data) => {
            container.innerHTML = data;

            switch (pageName) {
                case 'dashboard':
                    setTimeout(() => {
                        loadDashboardCalendar();
                    }, 0);
                    break;
                case 'grades':
                    break;
                case 'attendance':
                    setTimeout(() => {
                        loadAttendanceCalendar();
                    }, 0);
                    break;
                case 'settings':
                    break;
                case 'login':
                    break;
                case 'signup':
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

