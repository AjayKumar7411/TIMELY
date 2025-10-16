// === Supabase Connection ===
const SUPABASE_URL = "https://YOUR-PROJECT-URL.supabase.co";
const SUPABASE_KEY = "YOUR-ANON-KEY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === UI Logic ===
function showForm(type) {
  const forms = document.getElementById("forms");
  forms.innerHTML = "";

  if (type === "course") {
    forms.innerHTML = `
      <h3>Add Course & Subjects</h3>
      <input id="courseName" placeholder="Course Name" />
      <input id="subjectName" placeholder="Subject Name" />
      <button onclick="saveCourse()">Save</button>
    `;
  } else if (type === "lecturer") {
    forms.innerHTML = `
      <h3>Add Lecturer</h3>
      <input id="lecturerName" placeholder="Lecturer Name" />
      <input id="maxLectures" placeholder="Max Lectures per Week" type="number" />
      <button onclick="saveLecturer()">Save</button>
    `;
  }
}

// === Save Data to Supabase ===
async function saveCourse() {
  const course = document.getElementById("courseName").value;
  const subject = document.getElementById("subjectName").value;

  const { data, error } = await supabase
    .from("courses")
    .insert([{ course_name: course, subject_name: subject }]);
  if (error) alert("Error saving course: " + error.message);
  else alert("Course added!");
}

async function saveLecturer() {
  const name = document.getElementById("lecturerName").value;
  const max = document.getElementById("maxLectures").value;

  const { data, error } = await supabase
    .from("lecturers")
    .insert([{ lecturer_name: name, max_lectures: max }]);
  if (error) alert("Error saving lecturer: " + error.message);
  else alert("Lecturer added!");
}

// === Generate Timetable (Simple Placeholder) ===
async function generateTimetable() {
  const { data: courses } = await supabase.from("courses").select("*");
  const { data: lecturers } = await supabase.from("lecturers").select("*");
  let html = "<h3>Generated Timetable</h3><ul>";

  courses.forEach((c, i) => {
    const lecturer = lecturers[i % lecturers.length];
    html += `<li>${c.subject_name} - ${lecturer.lecturer_name}</li>`;
  });

  html += "</ul>";
  document.getElementById("timetable").innerHTML = html;
}
