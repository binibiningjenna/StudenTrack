import { getCurrentUser } from "./util.js";
import { showToast } from "./util.js";

export function initGradesPage() {
  const addSubjectBtn = document.getElementById('addSubject');
  const inputSubjectRow = document.getElementById('inputSubjectRow');
  const subjectInput = document.getElementById('subject');
  const gradeInput = document.getElementById('grade');
  const academicYearInput = document.getElementById('academicYearInput');
  const semesterInput = document.getElementById('semesterInput');
  const academicYearFilter = document.getElementById('academicYear');
  const semesterFilter = document.getElementById('semester');
  const gradesTableBody = document.getElementById('gradesTableBody');
  const gpaElement = document.getElementById('gpa');

  let isAdding = false;

  addSubjectBtn.addEventListener('click', () => {
    isAdding ? submitNewSubject() : showInputForm();
  });

  academicYearFilter.addEventListener('change', renderGrades);
  semesterFilter.addEventListener('change', renderGrades);

  renderGrades();

  function showInputForm() {
    inputSubjectRow.style.display = 'block';
    addSubjectBtn.innerHTML = '<i class="bi bi-check"></i> Submit';
    isAdding = true;
  }

  function submitNewSubject() {
    const subject = subjectInput.value.trim();
    const grade = parseFloat(gradeInput.value);
    const academicYear = academicYearInput.value;
    const semester = semesterInput.value;

    if (!subject || isNaN(grade) || !academicYear || !semester) {
      return showToast('Please fill in all fields correctly', 'warning');
    }

    if (grade < 1.0 || grade > 5.0) {
      return showToast('Grade must be between 1.0 and 5.0', 'error');
    }

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newGrade = {
      subject,
      grade,
      academicYear,
      semester,
      id: Date.now()
    };

    let allGrades = JSON.parse(localStorage.getItem('grades') || '{}');
    if (!allGrades[currentUser.email]) {
      allGrades[currentUser.email] = [];
    }

    allGrades[currentUser.email].push(newGrade);
    localStorage.setItem('grades', JSON.stringify(allGrades));

    resetForm();
    showToast('Subject added successfully!', 'success');
    renderGrades();
  }

  function renderGrades() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const allGrades = JSON.parse(localStorage.getItem('grades')) || {};
    let grades = allGrades[currentUser.email] || [];

    const selectedYear = academicYearFilter.value;
    const selectedSemester = semesterFilter.value;

    if (selectedYear !== 'all') {
      grades = grades.filter(g => g.academicYear === selectedYear);
    }
    if (selectedSemester !== 'all') {
      grades = grades.filter(g => g.semester === selectedSemester);
    }

    gradesTableBody.innerHTML = '';

    if (grades.length === 0) {
      gradesTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted py-4">No grades found</td>
        </tr>
      `;
      gpaElement.textContent = '0.00';
      return;
    }

    grades.forEach(g => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${g.subject}</td>
        <td class="align-middle">${g.grade.toFixed(2)}</td>
        <td class="align-middle">${g.grade <= 3.0 ? 'Passed' : 'Failed'}</td>
        <td class="text-end">
          <div class="d-inline-flex gap-2">
            <a class="edit-grade" data-bs-toggle="modal" data-bs-target="#editSubjectModal${g.id}"><i class="bi bi-pencil-square"></i></a>
            <a class="delete-grade" data-bs-toggle="modal" data-bs-target="#deleteSubjectModal${g.id}" style="color: red"><i class="bi bi-trash3 pe-2"></i></a>
          </div>
        </td>
      `;
      gradesTableBody.appendChild(row);

      // Append Edit Modal
      document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="editSubjectModal${g.id}" tabindex="-1" aria-labelledby="editSubjectModalLabel${g.id}" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="border-radius: 15px">
              <div class="modal-header bg-dark text-white" style="border-top-left-radius:15px; border-top-right-radius:15px;">
                <h4 class="modal-title w-100 text-center" id="editSubjectModalLabel${g.id}">EDIT GRADE</h4>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="editForm${g.id}">
                  <div class="mb-3">
                    <label class="form-label">Subject</label>
                    <input type="text" class="form-control" value="${g.subject}" id="editSubject${g.id}" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Grade</label>
                    <input type="number" class="form-control" value="${g.grade}" id="editGrade${g.id}" required>
                  </div>
                </form>
              </div>
              <div class="modal-footer justify-content-end">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">CANCEL</button>
                <button type="button" class="btn btn-outline-success" onclick="saveEditGrade(${g.id})" data-bs-dismiss="modal">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        </div>
      `);

      // Append Delete Modal
      document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="deleteSubjectModal${g.id}" tabindex="-1" aria-labelledby="deleteSubjectModalLabel${g.id}" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="border-radius: 15px">
              <div class="modal-header bg-dark text-white" style="border-top-left-radius:15px; border-top-right-radius:15px;">
                <h4 class="modal-title w-100 text-center" id="deleteSubjectModalLabel${g.id}">DELETE SUBJECT</h4>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center text-black">
                Are you sure you want to delete <strong>${g.subject}</strong>? This action cannot be undone.
              </div>
              <div class="modal-footer justify-content-end">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">CANCEL</button>
                <button type="button" class="btn btn-outline-danger" onclick="deleteGrade(${g.id})" data-bs-dismiss="modal">DELETE</button>
              </div>
            </div>
          </div>
        </div>
      `);
    });

    const gpa = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    gpaElement.textContent = gpa.toFixed(2);
  }

  window.deleteGrade = function (id) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const allGrades = JSON.parse(localStorage.getItem('grades')) || {};
    allGrades[currentUser.email] = allGrades[currentUser.email].filter(g => g.id !== id);
    localStorage.setItem('grades', JSON.stringify(allGrades));
    showToast('Grade Deleted', 'error');
    renderGrades();
  };

  window.saveEditGrade = function (id) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const allGrades = JSON.parse(localStorage.getItem('grades')) || {};
    const grades = allGrades[currentUser.email];

    const subjectInput = document.getElementById(`editSubject${id}`);
    const gradeInput = document.getElementById(`editGrade${id}`);

    const updatedSubject = subjectInput.value.trim();
    const updatedGrade = parseFloat(gradeInput.value);

    if (!updatedSubject || isNaN(updatedGrade)) {
      return showToast('Please fill in all fields correctly', 'warning');
    }

    if (updatedGrade < 1.0 || updatedGrade > 5.0) {
      return showToast('Grade must be between 1.0 and 5.0', 'error');
    }

    const updatedGrades = grades.map(g => {
      if (g.id === id) {
        return { ...g, subject: updatedSubject, grade: updatedGrade };
      }
      return g;
    });

    allGrades[currentUser.email] = updatedGrades;
    localStorage.setItem('grades', JSON.stringify(allGrades));
    showToast('Grade updated successfully!', 'success');
    renderGrades();
  }

  function resetForm() {
    subjectInput.value = '';
    gradeInput.value = '';
    academicYearInput.value = '';
    semesterInput.value = '';
    inputSubjectRow.style.display = 'none';
    addSubjectBtn.innerHTML = '<i class="bi bi-plus"></i> Add Subject';
    isAdding = false;
  }
}
