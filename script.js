// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === Add Teacher ===
async function addTeacher() {
  const name = document.getElementById("teacherName").value.trim();
  const subject = document.getElementById("teacherSubject").value.trim();
  const lectures = parseInt(document.getElementById("lecturesPerWeek").value);

  if (!name || !subject || !lectures) {
    alert("Please fill all teacher details!");
    return;
  }

  const { error } = await supabase.from("teachers").insert([{ name, subject, lectures_per_week: lectures }]);
  if (error) alert("Error adding teacher: " + error.message);
  else alert("✅ Teacher added!");
}

// === Add Class ===
async function addClass() {
  const name = document.getElementById("className").value.trim();
  const section = document.getElementById("section").value.trim();
  const periods = parseInt(document.getElementById("periods").value);

  if (!name || !section || !periods) {
    alert("Please fill all class details!");
    return;
  }

  const { error } = await supabase.from("classes").insert([{ name, section, total_periods_per_week: periods }]);
  if (error) alert("Error adding class: " + error.message);
  else alert("✅ Class added!");
}

// === Generate Smarter Timetable ===
async function generateTimetable() {
  const { data: teachers } = await supabase.from("teachers").select("*");
  const { data: classes } = await supabase.from("classes").select("*");

  if (!teachers.length || !classes.length) {
    alert("Please add teachers and classes first!");
    return;
  }

  // Track teacher workloads
  const teacherLoad = {};
  teachers.forEach((t) => {
    teacherLoad[t.name] = 0;
  });

  let output = "<h4>Generated Smart Timetable</h4>";

  // Generate timetable for each class
  for (const cls of classes) {
    output += `<strong>${cls.name} - ${cls.section}</strong><br>`;
    let previousTeacher = null;
    let consecutiveCount = 0;

    for (let period = 1; period <= cls.total_periods_per_week; period++) {
      // Pick only teachers who have remaining capacity
      const availableTeachers = teachers.filter((t) => teacherLoad[t.name] < t.lectures_per_week);

      if (availableTeachers.length === 0) {
        output += `Period ${period}: No available teacher 😕<br>`;
        continue;
      }

      // Avoid repeating same teacher for too many consecutive classes
      let teacher;
      do {
        teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
      } while (teacher === previousTeacher && consecutiveCount >= 2 && availableTeachers.length > 1);

      // Increment workload
      teacherLoad[teacher.name]++;

      // Manage break logic
      if (teacher === previousTeacher) {
        consecutiveCount++;
      } else {
        consecutiveCount = 1;
      }

      // Assign class period
      output += `Period ${period}: ${teacher.subject} (${teacher.name})<br>`;

      previousTeacher = teacher;
    }

    output += "<hr>";
  }

  document.getElementById("timetableResult").innerHTML = output;
      }

