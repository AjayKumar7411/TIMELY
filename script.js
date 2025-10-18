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
  const { data: classes } = await supabase.from('classes').select('*');
  const { data: teachers } = await supabase.from('teachers').select('*');
  const { data: subjects } = await supabase.from('subjects').select('*');

  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const periodsPerDay = 6;
  const breakAfter = 3; // give a break after 3 consecutive lectures
  const periodDuration = 60; // minutes

  // Clear previous schedule
  await supabase.from('timetable_schedule').delete().neq('id', 0);

  for (const cls of classes) {
    let startTime = new Date(`1970-01-01T09:00:00`);
    for (const day of days) {
      for (let p = 1; p <= periodsPerDay; p++) {
        if (p === breakAfter + 1) {
          // Insert break
          await supabase.from('timetable_schedule').insert([{
            class_id: cls.id,
            day_of_week: day,
            period_number: p,
            start_time: startTime.toTimeString().slice(0,5),
            end_time: new Date(startTime.getTime() + 15*60000).toTimeString().slice(0,5),
            is_break: true
          }]);
          startTime = new Date(startTime.getTime() + 15*60000);
          continue;
        }

        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];

        const endTime = new Date(startTime.getTime() + periodDuration * 60000);
        await supabase.from('timetable_schedule').insert([{
          class_id: cls.id,
          teacher_id: randomTeacher.id,
          subject_id: randomSubject.id,
          day_of_week: day,
          period_number: p,
          start_time: startTime.toTimeString().slice(0,5),
          end_time: endTime.toTimeString().slice(0,5),
          is_break: false
        }]);
        startTime = endTime;
      }
      startTime = new Date(`1970-01-01T09:00:00`); // reset each day
    }
  }

  alert("✅ Timetable generated with smart breaks!");
    }
async function showTimetable() {
  const { data, error } = await supabase.from('timetable_schedule').select('*');
  if (error) return alert(error.message);

  const grouped = {};
  data.forEach(row => {
    if (!grouped[row.day_of_week]) grouped[row.day_of_week] = [];
    grouped[row.day_of_week].push(row);
  });

  let html = '';
  for (const day in grouped) {
    html += `<h3>${day}</h3><table border="1"><tr><th>Period</th><th>Subject</th><th>Teacher</th><th>Start</th><th>End</th></tr>`;
    grouped[day].forEach(r => {
      html += `<tr>
        <td>${r.period_number}</td>
        <td>${r.is_break ? 'BREAK' : r.subject_id}</td>
        <td>${r.is_break ? '-' : r.teacher_id}</td>
        <td>${r.start_time}</td>
        <td>${r.end_time}</td>
      </tr>`;
    });
    html += '</table>';
  }
  
  document.getElementById('scheduleDisplay').innerHTML = html;
}
await showTimetable();


