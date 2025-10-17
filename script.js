// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  loadTeachers();
  loadSubjects();
});

// 🧑‍🏫 Add Teacher
async function addTeacher() {
  const name = document.getElementById("teacherName").value.trim();
  const subject = document.getElementById("teacherSubject").value.trim();
  const lectures = parseInt(document.getElementById("lecturesPerWeek").value);

  if (!name || !subject || !lectures) {
    alert("Please fill all teacher details.");
    return;
  }

  const { error } = await supabase.from("teachers").insert([{ 
    name, 
    subject, 
    lectures_per_week: lectures 
  }]);

  if (error) {
    alert("Error adding teacher: " + error.message);
  } else {
    alert("✅ Teacher added!");
    clearTeacherFields();
    loadTeachers();
  }
}

function clearTeacherFields() {
  document.getElementById("teacherName").value = "";
  document.getElementById("teacherSubject").value = "";
  document.getElementById("lecturesPerWeek").value = "";
}

// 📚 Add Subject
async function addSubject() {
  const name = document.getElementById("subjectName").value.trim();
  const code = document.getElementById("subjectCode").value.trim();

  if (!name || !code) {
    alert("Please fill all subject details.");
    return;
  }

  const { error } = await supabase.from("subjects").insert([{ name, code }]);

  if (error) {
    alert("Error adding subject: " + error.message);
  } else {
    alert("✅ Subject added!");
    clearSubjectFields();
    loadSubjects();
  }
}

function clearSubjectFields() {
  document.getElementById("subjectName").value = "";
  document.getElementById("subjectCode").value = "";
}

// 📥 Load Teachers
async function loadTeachers() {
  const list = document.getElementById("teacherList");
  list.innerHTML = "Loading...";
  const { data, error } = await supabase.from("teachers").select("*");

  if (error) {
    list.innerHTML = "Error loading teachers.";
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<li>No teachers added yet.</li>";
    return;
  }

  list.innerHTML = "";
  data.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.name} — ${t.subject} (${t.lectures_per_week} lectures/week)`;
    list.appendChild(li);
  });
}

// 📥 Load Subjects
async function loadSubjects() {
  const list = document.getElementById("subjectList");
  list.innerHTML = "Loading...";
  const { data, error } = await supabase.from("subjects").select("*");

  if (error) {
    list.innerHTML = "Error loading subjects.";
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<li>No subjects added yet.</li>";
    return;
  }

  list.innerHTML = "";
  data.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = `${s.code} — ${s.name}`;
    list.appendChild(li);
  });
                                                           }
