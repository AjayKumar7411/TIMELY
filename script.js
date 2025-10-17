// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === Add Teacher ===
document.getElementById("addTeacherBtn").addEventListener("click", async () => {
  const name = document.getElementById("teacherName").value.trim();
  const lectures = parseInt(document.getElementById("lecturesPerWeek").value) || 0;

  if (!name) return alert("Please enter teacher name!");

  const { data, error } = await supabase
    .from("teachers")
    .insert([{ name, lectures_per_week: lectures, available: true }]);

  const msg = document.getElementById("teacherMsg");
  if (error) {
    msg.textContent = "❌ Error: " + error.message;
  } else {
    msg.textContent = "✅ Teacher added successfully!";
    document.getElementById("teacherName").value = "";
    document.getElementById("lecturesPerWeek").value = "";
    loadTeachers();
  }
});

// === Add Subject ===
document.getElementById("addSubjectBtn").addEventListener("click", async () => {
  const subject = document.getElementById("subjectName").value.trim();
  if (!subject) return alert("Please enter subject name!");

  const { data, error } = await supabase.from("subjects").insert([{ name: subject }]);
  const msg = document.getElementById("subjectMsg");
  if (error) {
    msg.textContent = "❌ Error: " + error.message;
  } else {
    msg.textContent = "✅ Subject added successfully!";
    document.getElementById("subjectName").value = "";
    loadSubjects();
  }
});

// === Load Teachers ===
async function loadTeachers() {
  const { data, error } = await supabase.from("teachers").select("*");
  const list = document.getElementById("teacherList");
  list.innerHTML = "";
  if (data && data.length > 0) {
    data.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = `${t.name} — ${t.lectures_per_week} lectures/week`;
      list.appendChild(li);
    });
  } else {
    list.innerHTML = "<li>No teachers yet.</li>";
  }
}

// === Load Subjects ===
async function loadSubjects() {
  const { data, error } = await supabase.from("subjects").select("*");
  const list = document.getElementById("subjectList");
  list.innerHTML = "";
  if (data && data.length > 0) {
    data.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s.name;
      list.appendChild(li);
    });
  } else {
    list.innerHTML = "<li>No subjects yet.</li>";
  }
}

loadTeachers();
loadSubjects();
