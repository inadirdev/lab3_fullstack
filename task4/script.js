let applicant = {
  name: "Fatima Khan",
  program: "Software Engineering",
  semester: 5,
  cgpa: 3.65,
  familyIncome: 45000,
  academicPerformance: 82,
  attendance: 88,
  previousScholarship: false,
  completedCredits: 78
};

const SCHOLARSHIP_CRITERIA = {
  minCgpa: 3.5,
  minAttendance: 80,
  maxIncome: 60000,
  minSemester: 3,
  minCredits: 60,
  minAcademicPerformance: 75
};

function analyzeScholarship(student) {
  const criteria = [];

  const cgpaOk = student.cgpa >= SCHOLARSHIP_CRITERIA.minCgpa;
  criteria.push({
    name: "Academic Requirement (CGPA)",
    status: cgpaOk ? "pass" : "fail",
    explanation: cgpaOk
      ? `CGPA of ${student.cgpa} meets the minimum requirement of ${SCHOLARSHIP_CRITERIA.minCgpa}.`
      : `CGPA of ${student.cgpa} is below the required minimum of ${SCHOLARSHIP_CRITERIA.minCgpa}.`
  });

  const attendanceOk = student.attendance >= SCHOLARSHIP_CRITERIA.minAttendance;
  criteria.push({
    name: "Attendance Requirement",
    status: attendanceOk ? "pass" : "fail",
    explanation: attendanceOk
      ? `Attendance of ${student.attendance}% satisfies the ${SCHOLARSHIP_CRITERIA.minAttendance}% minimum.`
      : `Attendance of ${student.attendance}% does not meet the ${SCHOLARSHIP_CRITERIA.minAttendance}% requirement.`
  });

  const incomeOk = student.familyIncome <= SCHOLARSHIP_CRITERIA.maxIncome;
  criteria.push({
    name: "Financial Requirement",
    status: incomeOk ? "pass" : "fail",
    explanation: incomeOk
      ? `Family income of Rs. ${student.familyIncome.toLocaleString()} is within the eligible limit of Rs. ${SCHOLARSHIP_CRITERIA.maxIncome.toLocaleString()}.`
      : `Family income of Rs. ${student.familyIncome.toLocaleString()} exceeds the maximum limit of Rs. ${SCHOLARSHIP_CRITERIA.maxIncome.toLocaleString()}.`
  });

  const semesterOk = student.semester >= SCHOLARSHIP_CRITERIA.minSemester;
  criteria.push({
    name: "Semester Requirement",
    status: semesterOk ? "pass" : "fail",
    explanation: semesterOk
      ? `Student is in semester ${student.semester}, meeting the minimum of semester ${SCHOLARSHIP_CRITERIA.minSemester}.`
      : `Student is in semester ${student.semester}. Minimum semester ${SCHOLARSHIP_CRITERIA.minSemester} is required.`
  });

  const creditsOk = student.completedCredits >= SCHOLARSHIP_CRITERIA.minCredits;
  criteria.push({
    name: "Completed Credits",
    status: creditsOk ? "pass" : "fail",
    explanation: creditsOk
      ? `${student.completedCredits} credits completed (minimum ${SCHOLARSHIP_CRITERIA.minCredits} required).`
      : `Only ${student.completedCredits} credits completed. Minimum ${SCHOLARSHIP_CRITERIA.minCredits} required.`
  });

  const performanceOk = student.academicPerformance >= SCHOLARSHIP_CRITERIA.minAcademicPerformance;
  criteria.push({
    name: "Academic Performance",
    status: performanceOk ? "pass" : "fail",
    explanation: performanceOk
      ? `Academic performance of ${student.academicPerformance}% meets the ${SCHOLARSHIP_CRITERIA.minAcademicPerformance}% threshold.`
      : `Academic performance of ${student.academicPerformance}% is below the ${SCHOLARSHIP_CRITERIA.minAcademicPerformance}% threshold.`
  });

  const passedCount = criteria.filter(c => c.status === "pass").length;
  const failedCount = criteria.filter(c => c.status === "fail").length;

  let classification, resultClass, summary;

  if (failedCount === 0) {
    classification = "Eligible";
    resultClass = "result-eligible";
    summary = "The applicant satisfies all scholarship criteria and is recommended for scholarship approval.";
  } else if (failedCount >= 3 || !cgpaOk) {
    classification = "Not Eligible";
    resultClass = "result-not-eligible";
    summary = "The applicant does not meet the minimum requirements for scholarship consideration.";
  } else {
    classification = "Requires Further Review";
    resultClass = "result-review";
    summary = `The applicant meets ${passedCount} of ${criteria.length} criteria. Manual review is recommended before a final decision.`;
  }

  return { criteria, classification, resultClass, summary, passedCount, failedCount };
}

function reanalyze() {
  applicant.cgpa = parseFloat(document.getElementById("cgpaInput").value);
  applicant.attendance = parseInt(document.getElementById("attendanceInput").value);
  applicant.familyIncome = parseInt(document.getElementById("incomeInput").value);
  applicant.semester = parseInt(document.getElementById("semesterInput").value);
  render();
}

function render() {
  document.getElementById("studentInfo").innerHTML = `
    <table class="table table-borderless mb-0">
      <tr><td class="text-muted">Name</td><td><strong>${applicant.name}</strong></td></tr>
      <tr><td class="text-muted">Program</td><td>${applicant.program}</td></tr>
      <tr><td class="text-muted">Semester</td><td>${applicant.semester}</td></tr>
      <tr><td class="text-muted">CGPA</td><td>${applicant.cgpa}</td></tr>
      <tr><td class="text-muted">Family Income</td><td>Rs. ${applicant.familyIncome.toLocaleString()}</td></tr>
      <tr><td class="text-muted">Academic Performance</td><td>${applicant.academicPerformance}%</td></tr>
      <tr><td class="text-muted">Attendance</td><td>${applicant.attendance}%</td></tr>
      <tr><td class="text-muted">Completed Credits</td><td>${applicant.completedCredits}</td></tr>
      <tr><td class="text-muted">Previous Scholarship</td><td>${applicant.previousScholarship ? "Yes" : "No"}</td></tr>
    </table>
  `;

  document.getElementById("cgpaInput").value = applicant.cgpa;
  document.getElementById("attendanceInput").value = applicant.attendance;
  document.getElementById("incomeInput").value = applicant.familyIncome;
  document.getElementById("semesterInput").value = applicant.semester;

  const result = analyzeScholarship(applicant);

  document.getElementById("criteriaAnalysis").innerHTML = result.criteria.map(c => `
    <div class="criteria-item criteria-${c.status}">
      <div class="d-flex justify-content-between align-items-center">
        <strong>${c.name}</strong>
        <span class="badge ${c.status === 'pass' ? 'bg-success' : 'bg-danger'}">${c.status === 'pass' ? 'Satisfied' : 'Not Satisfied'}</span>
      </div>
      <small class="text-muted">${c.explanation}</small>
    </div>
  `).join("");

  document.getElementById("finalResult").innerHTML = `
    <div class="${result.resultClass} p-4">
      <h4 class="fw-bold text-center mb-3">${result.classification}</h4>
      <p class="text-center mb-3">${result.summary}</p>
      <hr>
      <h6 class="fw-semibold mb-2">Explanation Summary</h6>
      <ul class="mb-0">
        ${result.criteria.map(c => `<li>${c.explanation}</li>`).join("")}
      </ul>
    </div>
  `;
}

render();
