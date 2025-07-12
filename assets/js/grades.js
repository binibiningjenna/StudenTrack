let isAdding = false;

function showSubjectInput() {
  const inputSubject = document.getElementById('inputSubjectRow');
  const addSubjectBtn = document.getElementById('addSubject');
  const subject = document.getElementById('subject');
  const grade = document.getElementById('grade');
  const academicYear = document.getElementById('academicYearInput');
  const semester = document.getElementById('semesterInput');
  const alertContainer = document.getElementById('alertContainer');

  if (!isAdding) {
    inputSubject.style.display = 'block';
    addSubjectBtn.textContent = 'Submit';
    isAdding = true;
  } else {
    const subjectValue = subject.value.trim();
    const gradeValue = grade.value.trim();
    const yearValue = academicYear.value;
    const semesterValue = semester.value;

    if (!subjectValue || !gradeValue || !yearValue || !semesterValue) {
      if (alertContainer) {
        alertContainer.innerHTML = `
          <div class="alert alert-danger d-inline-block" role="alert">
            Please fill in all fields.
          </div>`;
      }
      return;
    }

    subject.value = '';
    grade.value = '';
    academicYear.value = '';
    semester.value = '';
    alertContainer.innerHTML = '';
    inputSubject.style.display = 'none';
    addSubjectBtn.textContent = 'Add Subject';
    isAdding = false;
  }
}
