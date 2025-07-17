import { getCurrentUser, showToast } from "./util.js";

export function initDashboardPage() {

  const currentUser = getCurrentUser();
  if (!currentUser) return;
  document.getElementById('helloUser').textContent = `Hello, ${currentUser.name || 'Student'}!`;

  const allSettings = JSON.parse(localStorage.getItem('settings')) || {};
  const userFilter = allSettings[currentUser.email] || {};
  const currentYear = userFilter.year;
  const currentSemester = userFilter.semester;

  if (!currentYear || !currentSemester) {
    return showToast('To view your Dashboard, Grades, and Attendance, please set your Academic Year and Semester in the Settings.', 'danger');
  }

  // Load and filter grades
  const allGradesObj = JSON.parse(localStorage.getItem('grades')) || {};
  const allGrades = allGradesObj[currentUser.email] || [];

  const filteredGrades = allGrades.filter(g =>
    g.academicYear === currentYear &&
    g.semester === currentSemester
  );

  // Calculate academic stats
  const totalSubjects = filteredGrades.length;
  const passingGrades = filteredGrades.filter(g => g.grade <= 3.0).length;
  const failingGrades = filteredGrades.filter(g => g.grade > 3.0).length;
  const totalGradeValue = filteredGrades.reduce((sum, g) => sum + g.grade, 0);
  const gpa = totalSubjects > 0 ? (totalGradeValue / totalSubjects).toFixed(2) : 'N/A';

  if (totalSubjects === 0) {
    document.querySelector('.academic-overview')?.insertAdjacentHTML('beforeend', `
      <div class="text-muted text-center my-4">No academic records found for the selected year and semester.</div>
    `);
  } else {
    document.getElementById('totalSubjects').textContent = totalSubjects;
    document.getElementById('passingGrades').textContent = passingGrades;
    document.getElementById('failingGrades').textContent = failingGrades;
    document.getElementById('gpa').textContent = gpa;
  }
  
  // Filter events for current user
  const allEvents = JSON.parse(localStorage.getItem('events')) || [];
  const filteredEvents = allEvents.filter(e =>
    e.email === currentUser.email &&
    e.academicYear === currentYear &&
    e.semester === currentSemester
  );

  let selectedEvent = null;
  
  // Initialize calendar with filtered events
  function loadDashboardCalendar() {
    const calendarEl = document.getElementById('dashboard-calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 'auto',
      editable: true,
      droppable: true,
      eventResizableFromStart: true,
      events: filteredEvents,

      dateClick(info) {
        document.getElementById('calendarEventForm').reset();
        document.getElementById('eventStart').value = info.dateStr;
        document.getElementById('eventEnd').value = info.dateStr;
        new bootstrap.Modal(document.getElementById('addEventModal')).show();
      },

      eventClick(info) {
        selectedEvent = info.event;
        const eventData = allEvents.find(e => e.id === selectedEvent.id);
        if (!eventData) return;

        document.getElementById('editEventTitle').value = selectedEvent.title;
        document.getElementById('editEventStart').value = selectedEvent.startStr.slice(0, 10);
        document.getElementById('editEventEnd').value = selectedEvent.endStr?.slice(0, 10) || '';
        document.getElementById('editEventColor').value = selectedEvent.backgroundColor;
        document.getElementById('editAcademicYear').value = eventData.academicYear || '';
        document.getElementById('editSemester').value = eventData.semester || '';

        new bootstrap.Modal(document.getElementById('editEventModal')).show();
      },

      eventDrop(info) {
        const idx = allEvents.findIndex(e => e.id === info.event.id);
        if (idx !== -1) {
          allEvents[idx].start = info.event.startStr;
          allEvents[idx].end = info.event.endStr || info.event.startStr;
          localStorage.setItem('events', JSON.stringify(allEvents));
        }
      }
    });

    calendar.render();
    
    // Add event handler
    document.getElementById('addEventBtn')?.addEventListener('click', () => {
      const title = document.getElementById('eventTitle').value;
      const start = document.getElementById('eventStart').value;
      const end = document.getElementById('eventEnd').value;
      const color = document.getElementById('eventColor').value;
      const academicYear = document.getElementById('academicYearInput').value;
      const semester = document.getElementById('semesterInput').value;

      if (!title || !start || !academicYear || !semester) {
        return showToast('Please fill in all required fields.', 'danger');
      }

      const newEvent = {
        id: Date.now().toString(),
        title,
        start,
        end: end || undefined,
        color,
        academicYear,
        semester,
        email: currentUser.email
      };

      allEvents.push(newEvent);
      localStorage.setItem('events', JSON.stringify(allEvents));

      if (academicYear === currentYear && semester === currentSemester) {
        calendar.addEvent({
          id: newEvent.id,
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end || undefined,
          backgroundColor: newEvent.color
        });
      }

      showToast('Event successfully added!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('addEventModal'))?.hide();
    });

    // Update event handler
    document.getElementById('saveEditEventModal')?.addEventListener('click', () => {
      if (!selectedEvent) return;

      const newYear = document.getElementById('editAcademicYear').value;
      const newSem = document.getElementById('editSemester').value;
      const newTitle = document.getElementById('editEventTitle').value;
      const newStart = document.getElementById('editEventStart').value;
      const newEnd = document.getElementById('editEventEnd').value;
      const newColor = document.getElementById('editEventColor').value;

      const idx = allEvents.findIndex(e => e.id === selectedEvent.id);
      if (idx !== -1) {
        allEvents[idx] = {
          ...allEvents[idx],
          academicYear: newYear,
          semester: newSem,
          title: newTitle,
          start: newStart,
          end: newEnd || undefined,
          color: newColor
        };

        localStorage.setItem('events', JSON.stringify(allEvents));

        selectedEvent.remove(); 

        if (newYear === currentYear && newSem === currentSemester) {
          calendar.addEvent({
            id: allEvents[idx].id,
            title: newTitle,
            start: newStart,
            end: newEnd || undefined,
            backgroundColor: newColor
          });
        }

        showToast('Event successfully updated!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('editEventModal'))?.hide();
        selectedEvent = null;
      }
    });

    // Delete event handler
    document.getElementById('confirmDeleteEventModal')?.addEventListener('click', () => {
      if (!selectedEvent) return;

      const idx = allEvents.findIndex(e => e.id === selectedEvent.id);
      if (idx !== -1) {
        allEvents.splice(idx, 1);
        localStorage.setItem('events', JSON.stringify(allEvents));
      }

      selectedEvent.remove();
      selectedEvent = null;

      showToast('Event successfully deleted.', 'error');
      bootstrap.Modal.getInstance(document.getElementById('deleteEventModal'))?.hide();
    });
  }

  loadDashboardCalendar(); 
}
