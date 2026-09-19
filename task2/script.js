let student = {
  name: "Ali Hassan",
  id: "STU-2023-1205",
  semester: 6,
  cgpa: 3.2,
  academicStanding: "Good Standing",
  feePaid: false,
  completedCourses: ["CS101", "CS201", "CS301", "MATH201"],
  previousCourseGrade: "B+"
};

let course = {
  code: "CS401",
  name: "Advanced Database Systems",
  semester: 6,
  minCgpa: 3.0,
  prerequisites: ["CS301", "MATH201"],
  seatsAvailable: 12,
  totalSeats: 40
};

function parseCourseList(value) {
  return value.split(",").map(c => c.trim()).filter(c => c.length > 0);
}

function checkPrerequisites(completed, required) {
  const missing = required.filter(c => !completed.includes(c));
  return { passed: missing.length === 0, missing };
}

function evaluateRegistration(student, course) {
  const checks = [];

  const prereq = checkPrerequisites(student.completedCourses, course.prerequisites);
  checks.push({
    label: "Prerequisite Courses",
    passed: prereq.passed,
    detail: prereq.passed
      ? "All required prerequisite courses completed."
      : `Missing prerequisite(s): ${prereq.missing.join(", ")}.`
  });

  const cgpaOk = student.cgpa >= course.minCgpa;
  checks.push({
    label: "Minimum CGPA",
    passed: cgpaOk,
    detail: cgpaOk
      ? `CGPA ${student.cgpa} meets the required minimum of ${course.minCgpa}.`
      : `CGPA ${student.cgpa} is below the required minimum of ${course.minCgpa}.`
  });

  const semesterOk = student.semester >= course.semester;
  checks.push({
    label: "Semester Requirement",
    passed: semesterOk,
    detail: semesterOk
      ? `Student is in semester ${student.semester}, eligible for this course.`
      : `Course requires semester ${course.semester} or higher. Student is in semester ${student.semester}.`
  });

  const standingOk = student.academicStanding === "Good Standing";
  checks.push({
    label: "Academic Standing",
    passed: standingOk,
    detail: standingOk
      ? "Student is in good academic standing."
      : `Academic standing is "${student.academicStanding}". Good standing is required.`
  });

  const feeOk = student.feePaid;
  checks.push({
    label: "Fee / Payment Status",
    passed: feeOk,
    detail: feeOk
      ? "All fees have been paid."
      : "Outstanding fee payment detected. Registration cannot proceed until fees are cleared."
  });

  const seatsOk = course.seatsAvailable > 0;
  checks.push({
    label: "Course Availability",
    passed: seatsOk,
    detail: seatsOk
      ? `${course.seatsAvailable} of ${course.totalSeats} seats available.`
      : "Course is full. No seats available for registration."
  });

  let decision, decisionClass, message;

  if (!prereq.passed) {
    decision = "Registration Denied";
    decisionClass = "decision-denied";
    message = `Registration cannot be completed because the prerequisite course${prereq.missing.length > 1 ? "s have" : " has"} not been completed (${prereq.missing.join(", ")}).`;
  } else if (!cgpaOk) {
    decision = "Registration Denied";
    decisionClass = "decision-denied";
    message = `Registration cannot be completed because the student's CGPA (${student.cgpa}) does not meet the minimum requirement of ${course.minCgpa}.`;
  } else if (!feeOk) {
    decision = "Registration Pending";
    decisionClass = "decision-warning";
    message = "Student meets academic requirements but has an unresolved fee issue. Registration will be processed once payment is confirmed.";
  } else if (!seatsOk) {
    decision = "Registration Unavailable";
    decisionClass = "decision-warning";
    message = "Student satisfies all academic requirements, but the course is currently full. Please try again when a seat becomes available.";
  } else if (!semesterOk || !standingOk) {
    decision = "Registration Denied";
    decisionClass = "decision-denied";
    message = !semesterOk
      ? "Student does not meet the semester requirement for this advanced course."
      : "Student's academic standing prevents registration for this course.";
  } else {
    decision = "Registration Approved";
    decisionClass = "decision-approved";
    message = "Student meets all requirements. Registration for " + course.name + " (" + course.code + ") can be completed successfully.";
  }

  return { checks, decision, decisionClass, message };
}

function fillForm() {
  document.getElementById("studentName").value = student.name;
  document.getElementById("studentId").value = student.id;
  document.getElementById("studentSemester").value = student.semester;
  document.getElementById("studentCgpa").value = student.cgpa;
  document.getElementById("academicStanding").value = student.academicStanding;
  document.getElementById("feePaid").value = student.feePaid.toString();
  document.getElementById("completedCourses").value = student.completedCourses.join(", ");
  document.getElementById("previousGrade").value = student.previousCourseGrade;

  document.getElementById("courseCode").value = course.code;
  document.getElementById("courseName").value = course.name;
  document.getElementById("courseSemester").value = course.semester;
  document.getElementById("minCgpa").value = course.minCgpa;
  document.getElementById("prerequisites").value = course.prerequisites.join(", ");
  document.getElementById("seatsAvailable").value = course.seatsAvailable;
  document.getElementById("totalSeats").value = course.totalSeats;
}

function evaluateEligibility() {
  student.name = document.getElementById("studentName").value.trim() || "Unknown";
  student.id = document.getElementById("studentId").value.trim() || "N/A";
  student.semester = parseInt(document.getElementById("studentSemester").value) || 1;
  student.cgpa = parseFloat(document.getElementById("studentCgpa").value) || 0;
  student.academicStanding = document.getElementById("academicStanding").value;
  student.feePaid = document.getElementById("feePaid").value === "true";
  student.completedCourses = parseCourseList(document.getElementById("completedCourses").value);
  student.previousCourseGrade = document.getElementById("previousGrade").value.trim() || "N/A";

  course.code = document.getElementById("courseCode").value.trim() || "N/A";
  course.name = document.getElementById("courseName").value.trim() || "N/A";
  course.semester = parseInt(document.getElementById("courseSemester").value) || 1;
  course.minCgpa = parseFloat(document.getElementById("minCgpa").value) || 0;
  course.prerequisites = parseCourseList(document.getElementById("prerequisites").value);
  course.seatsAvailable = parseInt(document.getElementById("seatsAvailable").value) || 0;
  course.totalSeats = parseInt(document.getElementById("totalSeats").value) || 1;

  render();
}

function render() {
  document.getElementById("studentDetails").innerHTML = `
    <table class="table table-borderless mb-0">
      <tr><td class="text-muted">Name</td><td><strong>${student.name}</strong></td></tr>
      <tr><td class="text-muted">Student ID</td><td>${student.id}</td></tr>
      <tr><td class="text-muted">Current Semester</td><td>Semester ${student.semester}</td></tr>
      <tr><td class="text-muted">CGPA</td><td>${student.cgpa}</td></tr>
      <tr><td class="text-muted">Academic Standing</td><td>${student.academicStanding}</td></tr>
      <tr><td class="text-muted">Fee Status</td><td>${student.feePaid ? '<span class="text-success">Paid</span>' : '<span class="text-danger">Outstanding</span>'}</td></tr>
      <tr><td class="text-muted">Completed Courses</td><td>${student.completedCourses.join(", ") || "None"}</td></tr>
      <tr><td class="text-muted">Previous Performance</td><td>${student.previousCourseGrade}</td></tr>
    </table>
  `;

  document.getElementById("courseDetails").innerHTML = `
    <table class="table table-borderless mb-0">
      <tr><td class="text-muted">Course Code</td><td><strong>${course.code}</strong></td></tr>
      <tr><td class="text-muted">Course Name</td><td>${course.name}</td></tr>
      <tr><td class="text-muted">Required Semester</td><td>Semester ${course.semester}+</td></tr>
      <tr><td class="text-muted">Minimum CGPA</td><td>${course.minCgpa}</td></tr>
      <tr><td class="text-muted">Prerequisites</td><td>${course.prerequisites.join(", ") || "None"}</td></tr>
      <tr><td class="text-muted">Availability</td><td>${course.seatsAvailable} / ${course.totalSeats} seats</td></tr>
    </table>
  `;

  const result = evaluateRegistration(student, course);

  document.getElementById("eligibilityChecks").innerHTML = result.checks.map(c => `
    <div class="check-item ${c.passed ? 'check-pass' : 'check-fail'}">
      <div class="d-flex justify-content-between">
        <strong>${c.label}</strong>
        <span class="badge ${c.passed ? 'bg-success' : 'bg-danger'}">${c.passed ? 'Passed' : 'Failed'}</span>
      </div>
      <small class="text-muted">${c.detail}</small>
    </div>
  `).join("");

  document.getElementById("registrationDecision").innerHTML = `
    <div class="${result.decisionClass} p-4 text-center">
      <h4 class="fw-bold mb-3">${result.decision}</h4>
      <p class="mb-0">${result.message}</p>
    </div>
  `;
}

fillForm();
render();
