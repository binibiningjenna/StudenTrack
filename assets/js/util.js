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
function loadDashboardCalendar() {
  const calendarEl = document.getElementById('dashboard-calendar');
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 'auto',
      editable: true,
      eventResizableFromStart: true,
      events: [
        {
          title: 'Quiz',
          start: '2025-07-01',
          end: '2025-07-02',
          color: '#0e6124ff'
        },
        {
          title: 'Comsoc Day',
          start: '2025-07-02',
          end: '2025-07-04',
          color: '#701111ff'
        },
        {
          title: 'Midterm Exam in ADET',
          start: '2025-07-05',
          end: '2025-07-06',
          color: '#1757a6'
        }
      ],
      dateClick: function (info) {
        document.getElementById('eventStart').value = info.dateStr;
        document.getElementById('eventEnd').value = info.dateStr;

        const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
        modal.show();
      },
      eventClick: function (info) {
        document.getElementById('editEventTitle').value = info.event.title;
        document.getElementById('editEventStart').value = info.event.startStr.slice(0, 10);
        document.getElementById('editEventEnd').value = info.event.endStr ? info.event.endStr.slice(0, 10) : '';
        document.getElementById('editEventColor').value = info.event.backgroundColor;

        selectedEvent = info.event;

        const editModal = new bootstrap.Modal(document.getElementById('editEventModal'));
        editModal.show();
      }

    });

    calendar.render();
  }
}

function closeModalAndRedirect() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('confirmdeleteAccountModal'));
  modal.hide();

  setTimeout(() => {
    loadPage('login');
  }, 300);
}