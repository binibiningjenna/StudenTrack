import { showToast } from "./util.js";

export function initCheckInPage() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const attendance = JSON.parse(localStorage.getItem('attendance')) || {};
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    const rfidInput = document.getElementById('rfid');
    const rfidForm = document.getElementById('rfid-form');

    let isProcessing = false;

    rfidForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    // Handle RFID input
    rfidInput.addEventListener('input', function () {
        if (isProcessing) return;

        const rfid = this.value.trim();
        if (rfid.length === 10) {
            isProcessing = true;

            handleCheckIn(rfid); 
            this.value = ''; 

            setTimeout(() => {
                isProcessing = false;
            }, 1000);
        }
    });

    // Keep RFID input focused
    setInterval(() => {
        if (document.activeElement !== rfidInput) {
            rfidInput.focus();
        }
    }, 500);


     // Check if date is weekend
    function isWeekend(dateStr) {
        const day = new Date(dateStr).getDay();
        return day === 0 || day === 6;
    }

    // Handle check-in logic
    function handleCheckIn(rfid) {
        const today = new Date().toISOString().split('T')[0];
        const user = users.find(u => u.rfid === rfid);
        if (!user) return showToast('RFID not recognized', 'error');

        const email = user.email;
        if (!attendance[email]) attendance[email] = [];

        const userSettings = settings[email] || { year: "Not Set", semester: "Not Set" };
        const currentYear = userSettings.year;
        const currentSemester = userSettings.semester;

        if (isWeekend(today)) {
            return showToast('Check-in not allowed on weekends.', 'warning');
        }

        const alreadyLogged = attendance[email].some(entry => entry.date === today);
        if (alreadyLogged) {
            return showToast('Already checked in today.', 'warning');
        }

        attendance[email].push({
            date: today,
            status: "Present",
            year: currentYear,
            semester: currentSemester
        });

        localStorage.setItem('attendance', JSON.stringify(attendance));
        showToast('Check-in successful', 'success');
    }

    // Mark absent for yesterday if not checked in
    function markAbsent() {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (isWeekend(yesterday)) return;

        users.forEach(user => {
            const email = user.email;
            if (!attendance[email]) attendance[email] = [];

            const hasPreviousPresent = attendance[email].some(entry => entry.status === "Present");

            if (hasPreviousPresent) {
                const recordedDates = attendance[email].map(e => e.date);
                if (!recordedDates.includes(yesterday)) {
                    const userSettings = settings[email] || { year: "Not Set", semester: "Not Set" };

                    attendance[email].push({
                        date: yesterday,
                        status: 'Absent',
                        year: userSettings.year,
                        semester: userSettings.semester
                    });
                }
            }
        });

        localStorage.setItem('attendance', JSON.stringify(attendance));
    }


    markAbsent();
}
