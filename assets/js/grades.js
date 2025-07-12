let isAdding = false; // Global scope

function showSubjectInput() {
    const inputSubject = document.getElementById('inputSubjectRow');
    const addSubjectBtn = document.getElementById('addSubject');
    const subject = document.getElementById('subject');
    const grade = document.getElementById('grade');

    if (!isAdding) {
        inputSubject.style.display = 'block';
        addSubjectBtn.textContent = 'Submit';
        isAdding = true;
    } else {
        const subjectValue = subject.value.trim();
        const gradeValue = grade.value.trim();

        if (subjectValue === '' || gradeValue === '') {
            const alertContainer = document.getElementById('alertContainer');
            alertContainer.innerHTML = `
                <div class="alert alert-danger d-inline-block" role="alert">
                Please fill in both Subject and Grade
                </div>
            `;
            return;
        }

        // Clear and reset
        subject.value = '';
        grade.value = '';
        alertContainer.innerHTML = '';
        inputSubject.style.display = 'none';
        addSubjectBtn.textContent = 'Add Subject';
        isAdding = false;
    }
}
