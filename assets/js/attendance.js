function loadAttendanceCalendar() {
  const calendarEl = document.getElementById('attendance-calendar');
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 'auto',
      events: [
        {
          title: 'Present',
          start: '2025-07-01',
          color: '#0e6124ff'
        },
        {
          title: 'Absent',
          start: '2025-07-02',
          color: '#701111ff'
        }
      ],

    });

    calendar.render();
  }
}