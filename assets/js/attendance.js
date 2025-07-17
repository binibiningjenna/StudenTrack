import { getCurrentUser } from './util.js';

export function initAttendancePage() {

  // Get current user and their saved settings
  const user = getCurrentUser();
  const settings = getUserSettings();

  // Exit if no user or no settings found
  if (!user || !settings) return;

  // Get current academic year, semester, and email
  const year = settings.year;
  const semester = settings.semester;
  const email = user.email;

   // Filter attendance based on user, year, and semester
  const allAttendance = JSON.parse(localStorage.getItem('attendance')) || {};
  const userAttendance = (allAttendance[email] || []).filter(entry =>
    entry.year === year && entry.semester === semester
  );

  let presentCount = 0;
  let absentCount = 0;
  let events = [];

  // Count present and absent days
  userAttendance.forEach(entry => {
    const { date, status } = entry;
    if (status === 'Present') presentCount++;
    else if (status === 'Absent') absentCount++;

    events.push({
      title: status,
      start: date,
      color: status === 'Present' ? '#0e6124ff' : '#701111ff'
    });
  });

  // Calculate total and attendance rate
  const totalLogged = presentCount + absentCount;
  const attendanceRate = totalLogged > 0 ? Math.round((presentCount / totalLogged) * 100) : 0;

  // Update UI or show message if no records
  if (totalLogged === 0) {
    document.querySelector('.attendance-overview')?.insertAdjacentHTML('beforeend', `
    <div class="text-muted text-center my-4">No attendance records found for the selected year and semester.</div>
  `);
  } else {
    document.getElementById('presentDay').textContent = presentCount;
    document.getElementById('absentDay').textContent = absentCount;
    document.getElementById('loggedDay').textContent = totalLogged;
    document.getElementById('attendanceRate').textContent = attendanceRate;
  }

  loadAttendanceCalendar(events);

  // Renders the calendar using FullCalendar
  function loadAttendanceCalendar(events) {
    const calendarEl = document.getElementById('attendance-calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 'auto',
      events: events
    });

    calendar.render();
  }

  function getUserSettings() {
    const user = getCurrentUser();
    if (!user) return null;

    const allSettings = JSON.parse(localStorage.getItem('settings')) || {};
    return allSettings[user.email] || null;
  }

};
