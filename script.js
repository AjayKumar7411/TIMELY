// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === DOM Elements ===
const form = document.getElementById("teacher-form");
const list = document.getElementById("teacher-list");

// === Load Teachers on Page Load ===
async function loadTeachers() {
  list.innerHTML = "Loading...";
  const { data, error } = await supabase.from("teachers").select("*").order("id", { ascending: true });

  if (error) {
    list.innerHTML = `<p style="color:red;">Error loading teachers: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No teachers added yet.</p>";
    return;
  }

  list.innerHTML = "";
  data.forEach((teacher) => {
    const div = document.createElement("div");
    div.classList.add("teacher");
    div.innerHTML = `<strong>${teacher.name}</strong> — ${teacher.subject} (${teacher.lectures_per_week} lectures/week)`;
    list.appendChild(div);
  });
}

// === Add Teacher Form Submit ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const lectures = parseInt(document.getElementById("lectures").value);

  if (!name || !subject || !lectures) {
    alert("Please fill all fields!");
    return;
  }

  const { error } = await supabase.from("teachers").insert([
    { name, subject, lectures_per_week: lectures, available: true },
  ]);

  if (error) {
    alert("Error adding teacher: " + error.message);
  } else {
    alert("✅ Teacher added successfully!");
    form.reset();
    loadTeachers();
  }
});

// === Initialize ===
loadTeachers();
