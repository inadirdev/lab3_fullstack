let student = {
  name: "Nadir Hussain",
  id: "STU-2024-0847",
  program: "Computer Science",
  semester: 4,
  marksObtained: 78,
  totalMarks: 100,
  attendance: 84,
  assignment: 85,
  quiz: 72,
  examination: 77
};

const MIN_PASS_MARKS = 50;
const MIN_ATTENDANCE = 75;
const MIN_OVERALL_SCORE = 60;

function calculateOverallScore(s) {
  return Math.round((s.assignment * 0.2) + (s.quiz * 0.2) + (s.examination * 0.6));
}

function getGrade(score) {
  if (score >= 90) return { grade: "A", label: "Excellent", color: "#10b981" };
  if (score >= 80) return { grade: "B", label: "Very Good", color: "#3b82f6" };
  if (score >= 70) return { grade: "C", label: "Good", color: "#6366f1" };
  if (score >= 60) return { grade: "D", label: "Satisfactory", color: "#f59e0b" };
  return { grade: "F", label: "Needs Improvement", color: "#ef4444" };
}

function determineStatus(s, overallScore) {
  const lowAttendance = s.attendance < MIN_ATTENDANCE;
  const lowMarks = s.marksObtained < MIN_PASS_MARKS;
  const lowOverall = overallScore < MIN_OVERALL_SCORE;

  if (lowAttendance && (lowMarks || lowOverall)) {
    return {
      type: "attendance",
      title: "Unsuccessful — Attendance & Performance Issue",
      message: `Student has ${s.attendance}% attendance (minimum ${MIN_ATTENDANCE}% required) and does not meet the academic performance threshold. Both attendance and marks need improvement.`
    };
  }
  if (lowAttendance) {
    return {
      type: "attendance",
      title: "Attendance Warning",
      message: `Student has ${s.attendance}% attendance, which is below the required ${MIN_ATTENDANCE}%. Academic performance is acceptable, but insufficient attendance may affect final standing.`
    };
  }
  if (lowMarks || lowOverall) {
    return {
      type: "fail",
      title: "Unsuccessful",
      message: `Student scored ${s.marksObtained}/${s.totalMarks} marks with an overall weighted score of ${overallScore}%. Minimum required: ${MIN_PASS_MARKS} marks and ${MIN_OVERALL_SCORE}% overall score.`
    };
  }
  return {
    type: "success",
    title: "Successful",
    message: `Student meets all academic requirements with ${overallScore}% overall performance and ${s.attendance}% attendance. Cleared for progression to the next semester.`
  };
}

function fillForm() {
  document.getElementById("nameInput").value = student.name;
  document.getElementById("idInput").value = student.id;
  document.getElementById("programInput").value = student.program;
  document.getElementById("semesterInput").value = student.semester;
  document.getElementById("marksInput").value = student.marksObtained;
  document.getElementById("totalMarksInput").value = student.totalMarks;
  document.getElementById("attendanceInput").value = student.attendance;
  document.getElementById("assignmentInput").value = student.assignment;
  document.getElementById("quizInput").value = student.quiz;
  document.getElementById("examinationInput").value = student.examination;
}

function analyzePerformance() {
  student.name = document.getElementById("nameInput").value.trim() || "Unknown";
  student.id = document.getElementById("idInput").value.trim() || "N/A";
  student.program = document.getElementById("programInput").value.trim() || "N/A";
  student.semester = parseInt(document.getElementById("semesterInput").value) || 1;
  student.marksObtained = parseInt(document.getElementById("marksInput").value) || 0;
  student.totalMarks = parseInt(document.getElementById("totalMarksInput").value) || 100;
  student.attendance = parseInt(document.getElementById("attendanceInput").value) || 0;
  student.assignment = parseInt(document.getElementById("assignmentInput").value) || 0;
  student.quiz = parseInt(document.getElementById("quizInput").value) || 0;
  student.examination = parseInt(document.getElementById("examinationInput").value) || 0;
  renderDashboard();
}

function renderDashboard() {
  const overallScore = calculateOverallScore(student);
  const gradeInfo = getGrade(overallScore);
  const status = determineStatus(student, overallScore);

  document.getElementById("studentInfo").innerHTML = `
    <div class="col-sm-6 col-xl-3">
      <div class="card stat-card h-100">
        <div class="card-body">
          <small class="text-muted">Student Name</small>
          <h6 class="mb-0 fw-semibold">${student.name}</h6>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-xl-3">
      <div class="card stat-card h-100">
        <div class="card-body">
          <small class="text-muted">Student ID</small>
          <h6 class="mb-0 fw-semibold">${student.id}</h6>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-xl-3">
      <div class="card stat-card h-100">
        <div class="card-body">
          <small class="text-muted">Program</small>
          <h6 class="mb-0 fw-semibold">${student.program}</h6>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-xl-3">
      <div class="card stat-card h-100">
        <div class="card-body">
          <small class="text-muted">Semester</small>
          <h6 class="mb-0 fw-semibold">Semester ${student.semester}</h6>
        </div>
      </div>
    </div>
  `;

  const attendanceOk = student.attendance >= MIN_ATTENDANCE;
  document.getElementById("performanceBreakdown").innerHTML = `
    <div class="row g-3">
      <div class="col-sm-6">
        <div class="d-flex justify-content-between mb-1"><span>Assignment (20%)</span><strong>${student.assignment}%</strong></div>
        <div class="progress" style="height:8px"><div class="progress-bar bg-primary" style="width:${student.assignment}%"></div></div>
      </div>
      <div class="col-sm-6">
        <div class="d-flex justify-content-between mb-1"><span>Quiz (20%)</span><strong>${student.quiz}%</strong></div>
        <div class="progress" style="height:8px"><div class="progress-bar bg-info" style="width:${student.quiz}%"></div></div>
      </div>
      <div class="col-sm-6">
        <div class="d-flex justify-content-between mb-1"><span>Examination (60%)</span><strong>${student.examination}%</strong></div>
        <div class="progress" style="height:8px"><div class="progress-bar bg-success" style="width:${student.examination}%"></div></div>
      </div>
      <div class="col-sm-6">
        <div class="d-flex justify-content-between mb-1"><span>Attendance</span><strong class="${attendanceOk ? 'text-success' : 'text-warning'}">${student.attendance}%</strong></div>
        <div class="progress" style="height:8px"><div class="progress-bar ${attendanceOk ? 'bg-success' : 'bg-warning'}" style="width:${student.attendance}%"></div></div>
      </div>
    </div>
    <hr>
    <div class="row text-center">
      <div class="col-4"><small class="text-muted d-block">Marks Obtained</small><strong>${student.marksObtained} / ${student.totalMarks}</strong></div>
      <div class="col-4"><small class="text-muted d-block">Weighted Score</small><strong>${overallScore}%</strong></div>
      <div class="col-4"><small class="text-muted d-block">Grade Category</small><strong>${gradeInfo.label}</strong></div>
    </div>
  `;

  const statusClass = status.type === "success" ? "status-success" : status.type === "attendance" ? "status-attendance" : "status-fail";
  document.getElementById("overallResult").innerHTML = `
    <div class="grade-badge mx-auto mb-3" style="background:${gradeInfo.color}20;color:${gradeInfo.color}">${gradeInfo.grade}</div>
    <h5 class="fw-bold">${status.title}</h5>
    <div class="alert ${statusClass} text-start mt-3 mb-0"><small>${status.message}</small></div>
  `;
}

fillForm();
renderDashboard();
