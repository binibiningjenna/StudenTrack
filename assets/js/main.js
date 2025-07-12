function loadPage(pageName) {
    const container = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');

    if (pageName === 'login' || pageName === 'signup') {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'block';
    }

    fetch(`assets/pages/${pageName}.html`)
        .then((res) => res.text())
        .then((data) => {
            container.innerHTML = data;
            window.scrollTo({ top: container.offsetTop, behavior: 'smooth' });

            switch (pageName) {
                case 'dashboard':
                    setTimeout(() => {
                        loadCalendar();
                    }, 0);
                    break;
                case 'grades':
                    //   initGrades();
                    break;
                case 'attendance':
                    //   initAttendance();
                    break;
                case 'settings':
                    //   initSettings();
                    break;
                case 'login':
                    //   initSettings();
                    break;
                case 'signup':
                    //   initSettings();
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

