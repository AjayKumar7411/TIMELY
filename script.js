// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === Helper: Show message ===
function showMessage(msg) {
  alert(msg);
}

// === Add Teacher ===
async function addTeacher() {
  const name = document.getElementById("teacherName").value;
  const subject = document.getElementById("teacherSubject").value;
  const lectures = parseInt(document.getElementById("teacherLectures").value);

  const { error } = await supabase.from("teachers").insert([
    {
      name,
      subject,
      lectures_per_week: lectures,
      available: true,
    },
  ]);

  if (error) showMessage("Error adding teacher: " + error.message);
  else showMessage("Teacher added successfully!");
}

// === Add Course ===
async function addCourse() {
  const name = document.getElementById("courseName").value;
  const start = document.getElementById("courseStart").value;
  const end = document.getElementById("courseEnd").value;
  const duration = parseInt(document.getElementById("courseDuration").value);

  const { error } = await supabase.from("courses").insert([
    {
      name,
      start_time: start,
      end_time: end,
      period_duration: duration,
    },
  ]);

  if (error) showMessage("Error adding course: " + error.message);
  else showMessage("Course added successfully!");
}

// === Add Subject ===
async function addSubject() {
  const courseId = parseInt(document.getElementById("subjectCourse").value);
  const name = document.getElementById("subjectName").value;

  const { error } = await supabase.from("subjects").insert([
    {
      course_id: courseId,
      name,
    },
  ]);

  if (error) showMessage("Error adding subject: " + error.message);
  else showMessage("Subject added successfully!");
}

// === Generate Timetable === (basic random example)
async function generateTimetable() {
  const { data: teachers } = await supabase.from("teachers").select("*");
  const { data: subjects } = await supabase.from("subjects").select("*");
  const { data: courses } = await supabase.from("courses").select("*");

  if (!teachers?.length || !subjects?.length || !courses?.length) {
    showMessage("Please add teachers, subjects, and courses first!");
    return;
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let generated = [];

  for (const course of courses) {
    let period = 1;
    for (const day of days) {
      const randomTeacher =
        teachers[Math.floor(Math.random() * teachers.length)];
      const randomSubject =
        subjects[Math.floor(Math.random() * subjects.length)];

      generated.push({
        course_id: course.id,
        day_of_week: day,
        period_number: period++,
        subject_id: randomSubject.id,
        teacher_id: randomTeacher.id,
      });
    }
  }

  const { error } = await supabase.from("timetable_slots").insert(generated);
  if (error) showMessage("Error generating timetable: " + error.message);
  else showMessage("Timetable generated successfully!");
}
