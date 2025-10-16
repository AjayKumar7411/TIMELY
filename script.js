// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
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
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://xypnidvasmcajnlaises.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM'  // replace this
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const form = document.getElementById('timetableForm')
const result = document.getElementById('result')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const periods = document.getElementById('periods').value
  const timings = document.getElementById('timings').value
  const teachers = document.getElementById('teachers').value

  result.textContent = "⏳ Generating Timetable..."

  // store in Supabase
  const { data, error } = await supabase
    .from('college_data')
    .insert([{ periods, timings, teachers }])

  if (error) {
    result.textContent = "❌ Error saving data."
    console.error(error)
  } else {
    result.textContent = "✅ Timetable data saved successfully!"
  }
})
