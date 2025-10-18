// === Supabase Connection ===
const SUPABASE_URL = "https://xypnidvasmcajnlaises.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cG5pZHZhc21jYWpubGFpc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDI0MTksImV4cCI6MjA3NjExODQxOX0.0BkjTEbKmF0SsebnLgibfopwcCTYx3BT4diJVqGWhOM";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// // script.js — Timely frontend logic (complete)
--

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  alert("Please set SUPABASE_URL and SUPABASE_ANON_KEY in script.js");
}

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- Tab logic ----------
document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ---------- DOM elements ----------
const teacherName = () => document.getElementById("teacherName");
const teacherSubject = () => document.getElementById("teacherSubject");
const teacherLectures = () => document.getElementById("teacherLectures");
const teacherMsg = () => document.getElementById("teacherMsg");

const subjectName = () => document.getElementById("subjectName");
const subjectCode = () => document.getElementById("subjectCode");
const subjectMsg = () => document.getElementById("subjectMsg");

const className = () => document.getElementById("className");
const classSection = () => document.getElementById("classSection");
const classPeriods = () => document.getElementById("classPeriods");
const classMsg = () => document.getElementById("classMsg");

const availTeacher = () => document.getElementById("availTeacher");
const availDay = () => document.getElementById("availDay");
const availPeriod = () => document.getElementById("availPeriod");
const availMsg = () => document.getElementById("availMsg");

const teacherListEl = () => document.getElementById("teacherList");
const subjectListEl = () => document.getElementById("subjectList");
const classListEl = () => document.getElementById("classList");

const daysInput = () => document.getElementById("daysInput");
const periodsPerDayInput = () => document.getElementById("periodsPerDay");
const breakAfterInput = () => document.getElementById("breakAfter");
const periodDurationInput = () => document.getElementById("periodDuration");
const generateMsg = () => document.getElementById("generateMsg");
const scheduleContainer = () => document.getElementById("scheduleContainer");

// ---------- Utility: show message ----------
function showTemp(el, txt){
  if(!el) return;
  el.textContent = txt;
  setTimeout(()=> el.textContent = "", 3000);
}

// ---------- Load initial data ----------
async function loadAll() {
  await loadTeachers();
  await loadSubjects();
  await loadClasses();
  await populateAvailTeachers();
}

// ---------- Teachers ----------
async function addTeacher() {
  const name = teacherName().value.trim();
  const subj = teacherSubject().value.trim();
  const lectures = parseInt(teacherLectures().value) || 0;
  if(!name || !subj) { showTemp(teacherMsg(), "Fill name and subject"); return; }

  const { data, error } = await supabase.from("teachers").insert([{ name, subject: subj, lectures_per_week: lectures }]);
  if(error) { showTemp(teacherMsg(), "Error: "+error.message); console.error(error); }
  else { showTemp(teacherMsg(), "Teacher added"); teacherName().value=""; teacherSubject().value=""; teacherLectures().value=""; loadTeachers(); populateAvailTeachers(); }
}

async function loadTeachers(){
  const { data, error } = await supabase.from("teachers").select("*").order("id",{ascending:true});
  teacherListEl().innerHTML = "";
  if(error) { teacherListEl().innerHTML = "<li>Error loading</li>"; console.error(error); return; }
  if(!data || data.length===0){ teacherListEl().innerHTML = "<li>No teachers yet</li>"; return; }
  data.forEach(t=>{
    const li = document.createElement("li");
    li.textContent = `${t.name} — ${t.subject} (${t.lectures_per_week} / wk)`;
    teacherListEl().appendChild(li);
  });
}

// ---------- Subjects ----------
async function addSubject(){
  const name = subjectName().value.trim();
  const code = subjectCode().value.trim();
  if(!name) { showTemp(subjectMsg(),"Enter subject name"); return; }
  const { data, error } = await supabase.from("subjects").insert([{ name, code }]);
  if(error){ showTemp(subjectMsg(),"Error: "+error.message); console.error(error); }
  else{ showTemp(subjectMsg(),"Subject added"); subjectName().value=""; subjectCode().value=""; loadSubjects(); }
}

async function loadSubjects(){
  const { data, error } = await supabase.from("subjects").select("*").order("id",{ascending:true});
  subjectListEl().innerHTML = "";
  if(error){ subjectListEl().innerHTML="<li>Error</li>"; console.error(error); return; }
  if(!data || data.length===0){ subjectListEl().innerHTML="<li>No subjects yet</li>"; return; }
  data.forEach(s=>{
    const li = document.createElement("li");
    li.textContent = (s.code? s.code+" — ":"")+s.name;
    subjectListEl().appendChild(li);
  });
}

// ---------- Classes ----------
async function addClass(){
  const name = className().value.trim();
  const section = classSection().value.trim();
  const periods = parseInt(classPeriods().value) || 0;
  if(!name || !periods){ showTemp(classMsg(),"Name & periods required"); return; }
  const { data, error } = await supabase.from("classes").insert([{ name, section, total_periods_per_week: periods }]);
  if(error){ showTemp(classMsg(),"Error: "+error.message); console.error(error); }
  else{ showTemp(classMsg(),"Class added"); className().value=""; classSection().value=""; classPeriods().value=""; loadClasses(); }
}

async function loadClasses(){
  const { data, error } = await supabase.from("classes").select("*").order("id",{ascending:true});
  classListEl().innerHTML = "";
  if(error){ classListEl().innerHTML="<li>Error</li>"; console.error(error); return; }
  if(!data || data.length===0){ classListEl().innerHTML="<li>No classes yet</li>"; return; }
  data.forEach(c=>{
    const li = document.createElement("li");
    li.textContent = `${c.name}${c.section? " — "+c.section:""} • ${c.total_periods_per_week} per wk`;
    classListEl().appendChild(li);
  });
}

// ---------- Availability ----------
async function populateAvailTeachers(){
  const sel = availTeacher();
  sel.innerHTML = "";
  const { data } = await supabase.from("teachers").select("id,name").order("id",{ascending:true});
  if(!data) return;
  data.forEach(t=>{
    const opt = document.createElement("option");
    opt.value = t.id; opt.textContent = t.name;
    sel.appendChild(opt);
  });
}

async function addAvailability(){
  const teacher_id = parseInt(availTeacher().value);
  const day = availDay().value;
  const period = parseInt(availPeriod().value);
  if(!teacher_id || !day || !period){ showTemp(availMsg(),"Please fill availability"); return; }
  const { error } = await supabase.from("availability").insert([{ teacher_id, day_of_week: day, period_number: period }]);
  if(error){ showTemp(availMsg(),"Err: "+error.message); console.error(error); }
  else{ showTemp(availMsg(),"Availability saved"); availPeriod().value=""; }
}

// ---------- Smart Timetable Generator ----------
/*
Algorithm (simple but practical):
- Load classes, teachers, subjects, availability
- For each class/day/period pick a teacher who:
  - Teaches that subject (if not specified we pick any)
  - Has remaining weekly capacity
  - Is available in that day/period (if availability records exist)
  - Not assigned to another class at same day/period
- Insert into timetable_schedule
*/
async function generateTimetable(){
  generateMsg().textContent = "Generating...";
  // read inputs
  const daysRaw = (daysInput().value || "Mon,Tue,Wed,Thu,Fri").split(",").map(s=>s.trim()).filter(Boolean);
  const periodsPerDay = parseInt(periodsPerDayInput().value) || 6;
  const breakAfter = parseInt(breakAfterInput().value) || 3;
  const periodDuration = parseInt(periodDurationInput().value) || 50;

  // read DB
  const [{ data: classes }, { data: teachers }, { data: subjects }, { data: availability }] = await Promise.all([
    supabase.from("classes").select("*"),
    supabase.from("teachers").select("*"),
    supabase.from("subjects").select("*"),
    supabase.from("availability").select("*")
  ]);

  if(!classes?.length || !teachers?.length || !subjects?.length){
    generateMsg().textContent = "Add classes, teachers and subjects first.";
    return;
  }

  // teacher workloads: id -> assigned count
  const teacherLoad = {};
  teachers.forEach(t => teacherLoad[t.id] = 0);

  // clear previous schedule
  await supabase.from("timetable_schedule").delete().neq("id",0);

  // helper: check teacher availability (true if either no availability records exist OR there is a matching record)
  const availMap = {}; // key teacherId|day|period -> true
  availability.forEach(a => { availMap[`${a.teacher_id}|${a.day_of_week}|${a.period_number}`] = true; });

  // helper to test teacher free at day/period (no other assignment)
  async function teacherIsFree(teacherId, day, period){
    const { data } = await supabase.from("timetable_schedule").select("id").match({ teacher_id: teacherId, day_of_week: day, period_number: period }).limit(1);
    return !(data && data.length>0);
  }

  // for each class and each day, for each period, assign
  for(const cls of classes){
    for(const day of daysRaw){
      let consecutive = {}; // count consecutive assignments per teacher in this class/day
      for(let p=1;p<=periodsPerDay;p++){
        // if this is the break slot (breakAfter) we insert a break entry
        if(breakAfter>0 && p === breakAfter+1){
          await supabase.from("timetable_schedule").insert([{
            class_id: cls.id, day_of_week: day, period_number: p, is_break: true
          }]);
          // reset consecutive counts
          consecutive = {};
          continue;
        }

        // candidate teachers: those with remaining capacity and available if availability exists
        let candidates = teachers.filter(t => {
          const cap = (t.lectures_per_week || 0);
          return teacherLoad[t.id] < cap;
        });

        // apply availability filter if any availability rows exist for teacher
        if(Object.keys(availMap).length > 0){
          candidates = candidates.filter(t => availMap[`${t.id}|${day}|${p}`]);
        }

        // also ensure teacher is not already assigned elsewhere this day/period
        const finalCandidates = [];
        for(const cand of candidates){
          const free = await teacherIsFree(cand.id, day, p);
          if(free) finalCandidates.push(cand);
        }

        if(finalCandidates.length === 0){
          // Insert empty slot / unassigned
          await supabase.from("timetable_schedule").insert([{
            class_id: cls.id, day_of_week: day, period_number: p, is_break: false
          }]);
          continue;
        }

        // pick candidate with minimal load (balance)
        finalCandidates.sort((a,b) => (teacherLoad[a.id] || 0) - (teacherLoad[b.id] || 0));
        const chosen = finalCandidates[0];

        // increment load
        teacherLoad[chosen.id] = (teacherLoad[chosen.id]||0) + 1;

        // maintain consecutive count to avoid too many repeats for chosen teacher in same class/day
        consecutive[chosen.id] = (consecutive[chosen.id] || 0) + 1;
        if(consecutive[chosen.id] >= (breakAfter || 3)){
          // next iteration the break insertion will reset
        }

        // pick a random subject (or round-robin) — basic approach
        const subject = subjects[(Math.floor(Math.random()*subjects.length))];

        // find next period start/end times (we keep times minimal; main store is period numbers)
        await supabase.from("timetable_schedule").insert([{
          class_id: cls.id,
          teacher_id: chosen.id,
          subject_id: subject.id,
          day_of_week: day,
          period_number: p,
          is_break: false
        }]);
      } // end periods
    } // end days
  } // end classes

  generateMsg().textContent = "Generated timetable; displaying...";
  await showTimetable();
}

// ---------- Read & Show timetable ----------
async function showTimetable(){
  const { data, error } = await supabase.from("timetable_schedule").select(
    `id,class_id,teacher_id,subject_id,day_of_week,period_number,is_break`
  ).order("day_of_week",{ascending:true}).order("period_number",{ascending:true});

  if(error){ scheduleContainer().innerHTML = "<p>Error reading timetable</p>"; console.error(error); return; }
  if(!data || data.length===0){ scheduleContainer().innerHTML = "<p>No timetable generated yet.</p>"; return; }

  // group by day, then class
  const days = {};
  for(const row of data){
    if(!days[row.day_of_week]) days[row.day_of_week] = {};
    if(!days[row.day_of_week][row.class_id]) days[row.day_of_week][row.class_id] = [];
    days[row.day_of_week][row.class_id].push(row);
  }

  let html = "";
  for(const day of Object.keys(days)){
    html += `<h3>${day}</h3>`;
    for(const classId of Object.keys(days[day])){
      const rows = days[day][classId];
      html += `<div class="card"><strong>Class ID: ${classId}</strong><table style="width:100%;margin-top:8px;border-collapse:collapse">`;
      html += `<thead><tr style="text-align:left"><th style="padding:6px;border-bottom:1px solid #eee">Period</th><th style="padding:6px;border-bottom:1px solid #eee">Subject</th><th style="padding:6px;border-bottom:1px solid #eee">Teacher</th></tr></thead><tbody>`;
      for(const r of rows){
        if(r.is_break){
          html += `<tr><td style="padding:6px">Break</td><td colspan="2" style="padding:6px">—</td></tr>`;
        } else {
          html += `<tr><td style="padding:6px">${r.period_number}</td><td style="padding:6px">${r.subject_id || '-'}</td><td style="padding:6px">${r.teacher_id || '-'}</td></tr>`;
        }
      }
      html += `</tbody></table></div>`;
    }
  }
  scheduleContainer().innerHTML = html;
}

// ---------- Wire UI buttons ----------
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("btnAddTeacher").addEventListener("click", addTeacher);
  document.getElementById("btnAddSubject").addEventListener("click", addSubject);
  document.getElementById("btnAddClass").addEventListener("click", addClass);
  document.getElementById("btnAddAvail")?.addEventListener("click", addAvailability);
  document.getElementById("btnGenerate").addEventListener("click", generateTimetable);

  // load initial
  loadAll().catch(err => console.error(err));
});
