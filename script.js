// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const content = document.getElementById("content");

document.getElementById("manageBtn").onclick = showManagePage;
document.getElementById("generateBtn").onclick = showGeneratePage;
document.getElementById("viewBtn").onclick = showViewPage;

async function showManagePage() {
  content.innerHTML = `
    <h2>Manage Teachers</h2>
    <form id="teacherForm">
      <input id="teacherName" placeholder="Teacher name" required />
      <button class="submit" type="submit">Add Teacher</button>
    </form>
    <h2>Manage Subjects</h2>
    <form id="subjectForm">
      <input id="subjectName" placeholder="Subject name" required />
      <button class="submit" type="submit">Add Subject</button>
    </form>
    <h2>Manage Classes</h2>
    <form id="classForm">
      <input id="className" placeholder="Class name" required />
      <button class="submit" type="submit">Add Class</button>
    </form>
  `;

  document.getElementById("teacherForm").onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("teacherName").value;
    await supabase.from("teachers").insert([{ name }]);
    alert("Teacher added!");
  };

  document.getElementById("subjectForm").onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("subjectName").value;
    await supabase.from("subjects").insert([{ name }]);
    alert("Subject added!");
  };

  document.getElementById("classForm").onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("className").value;
    await supabase.from("classes").insert([{ name }]);
    alert("Class added!");
  };
}

function showGeneratePage() {
  content.innerHTML = `
    <h2>Generate Timetable</h2>
    <button class="submit" onclick="generateTimetable()">Generate Now</button>
  `;
}

async function generateTimetable() {
  alert("Timetable generation logic coming soon!");
}

async function showViewPage() {
  const { data, error } = await supabase.from("timetable_schedule").select("*");
  if (error) {
    console.error(error);
    alert("Error fetching data");
    return;
  }

  let html = "<h2>View Timetable</h2><table><tr><th>ID</th><th>Class</th><th>Subject</th><th>Teacher</th><th>Day</th><th>Period</th></tr>";
  data.forEach(r => {
    html += `<tr>
      <td>${r.id}</td>
      <td>${r.class_name || "-"}</td>
      <td>${r.subject_name || "-"}</td>
      <td>${r.teacher_name || "-"}</td>
      <td>${r.day || "-"}</td>
      <td>${r.period || "-"}</td>
    </tr>`;
  });
  html += "</table>";
  content.innerHTML = html;
                          }
