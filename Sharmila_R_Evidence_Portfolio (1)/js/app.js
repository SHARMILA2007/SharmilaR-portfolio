(function () {
  const P = window.PORTFOLIO, S = P.student, items = P.items;
  const SECTIONS = [
    { id: "profile", title: "Student Profile", lead: "Academic details and skills." },
    { id: "resume", title: "Updated Resume / CV", lead: "Resume as supplied by the student." },
    { id: "profiles", title: "Professional Profiles", lead: "Online profiles. Only profiles that exist are linked." },
    { id: "certs", title: "Certifications and Online Learning", lead: "Course and online-learning certificates, grouped by platform." },
    { id: "projects", title: "Projects", lead: "Projects with confirmed details only." },
    { id: "internship", title: "Internship", lead: "Internships in date order, each with its completion certificate." },
    { id: "training", title: "Industrial Training", lead: "" },
    { id: "hackathons", title: "Hackathons and Competitions", lead: "Hackathons, coding contests, quizzes and poster challenges." },
    { id: "coding", title: "Coding and Problem Solving", lead: "Coding contests and coding-platform profiles." },
    { id: "aptitude", title: "Aptitude Scores", lead: "Each assessment is shown separately, labelled by test and date." },
    { id: "teamwork", title: "Communication, Teamwork and Leadership", lead: "Team participation and communication evidence." },
    { id: "workshops", title: "Workshops, Seminars and Conferences", lead: "" },
    { id: "research", title: "Research and Publications", lead: "Papers, conference papers, poster and paper presentation certificates." },
    { id: "awards", title: "Awards and Achievements", lead: "Prizes and recognitions." },
    { id: "other", title: "Other Evidence", lead: "Academic records and supporting documents." }
  ];
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inSec = id => items.filter(i => i.section === id || (i.also || []).includes(id));
  const withFiles = id => inSec(id).filter(i => i.file);
  const empty = (t, m) => `<div class="empty"><strong>${esc(t)}</strong>${esc(m)}</div>`;
  const NA = (m) => empty("Not yet available", m || "No evidence has been added for this section yet.");

  /* ---------- cards ---------- */
  function rowsHtml(it) {
    const r = Object.entries(it.rows || {});
    if (!r.length) return "";
    const meter = it.section === "aptitude";
    return `<dl class="rows">${r.map(([k, v]) => {
      const m = meter && /^(\d+) \/ 100$/.exec(v);
      if (m) { const n = +m[1], c = n >= 70 ? "" : n >= 40 ? "mid" : "low";
        return `<dt>${esc(k)}</dt><dd class="meter"><i><b class="${c}" style="width:${n}%"></b></i>${esc(v)}</dd>`; }
      return `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`;
    }).join("")}</dl>`;
  }
  function card(it, idx) {
    const key = items.indexOf(it);
    const search = [it.title, it.issuer, it.date, it.kind, it.group, it.notes, Object.values(it.rows || {}).join(" ")].join(" ").toLowerCase();
    const thumb = it.thumb ? `<button class="thumb" data-view="${key}" aria-label="View ${esc(it.title)}"><img class="thumb" loading="lazy" src="${esc(it.thumb)}" alt="Preview of ${esc(it.title)}"></button>` : "";
    const acts = it.file ? `<div class="acts"><button class="btn btn-ghost sm" data-view="${key}">View</button><a class="btn btn-primary sm" href="${esc(it.file)}" download>Download</a></div>` : "";
    return `<article class="card${it.file ? "" : " pending"}" data-search="${esc(search)}">${thumb}<div class="cbody">
      <span class="tag">${esc(it.kind)}</span><h3>${esc(it.title)}</h3>
      <p class="meta">${esc(it.issuer)}${it.date ? " · " + esc(it.date) : ""}</p>
      ${it.notes ? `<p class="note">${esc(it.notes)}</p>` : ""}${rowsHtml(it)}${acts}</div></article>`;
  }
  function grouped(list) {
    const groups = [...new Set(list.map(i => i.group || ""))];
    return groups.map(g => `${g ? `<h3 class="group">${esc(g)}</h3>` : ""}<div class="grid">${list.filter(i => (i.group || "") === g).map(card).join("")}</div>`).join("");
  }

  /* ---------- section bodies ---------- */
  const posIcon = `<svg viewBox="0 0 400 190" role="img" aria-label="Illustration of a billing counter"><rect width="400" height="190" fill="#dff1f2"/><rect x="60" y="110" width="280" height="14" rx="4" fill="#161a3a"/><rect x="95" y="46" width="130" height="70" rx="8" fill="#252a5c"/><rect x="105" y="55" width="110" height="38" rx="4" fill="#f1f4f8"/><path d="M114 66h60M114 76h80M114 85h45" stroke="#0b6f79" stroke-width="4" stroke-linecap="round"/><rect x="238" y="70" width="70" height="46" rx="6" fill="#f0a30a"/><rect x="246" y="78" width="54" height="8" rx="2" fill="#161a3a"/><circle cx="262" cy="100" r="5" fill="#161a3a"/><circle cx="284" cy="100" r="5" fill="#161a3a"/><path d="M320 40h26l-5 22h-18z" fill="#0b6f79"/><circle cx="325" cy="70" r="4" fill="#0b6f79"/><circle cx="338" cy="70" r="4" fill="#0b6f79"/></svg>`;
  const body = {
    profile() {
      const sk = Object.entries(S.skills).map(([k, v]) => `<div class="skillset"><h4>${esc(k)}</h4>${v.map(x => `<span class="pill${k === "Soft skills" ? " soft" : ""}">${esc(x)}</span>`).join("")}</div>`).join("");
      return `<div class="profile">
        <div class="panel"><h3>Student details</h3><dl>
          <dt>Name</dt><dd>${esc(S.name)}</dd><dt>Register no.</dt><dd>${esc(S.reg)}</dd>
          <dt>College</dt><dd>${esc(S.college)}</dd><dt>Degree</dt><dd>${esc(S.degree)}</dd>
          <dt>Batch</dt><dd>${esc(S.batch)}</dd><dt>CGPA</dt><dd>${esc(S.cgpa)}</dd>
          <dt>Languages</dt><dd>${S.languages.map(esc).join(", ")}</dd>
          <dt>Email</dt><dd><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></dd></dl></div>
        <div class="panel"><h3>Career objective</h3><p>${esc(S.objective)}</p>
          <h3 style="margin-top:16px">School education</h3><dl>${S.school.map(s => `<dt>${esc(s[1])}</dt><dd>${esc(s[0])} · ${esc(s[2])}</dd>`).join("")}</dl></div>
        <div class="panel"><h3>Skills</h3>${sk}</div></div>`;
    },
    resume() {
      const r = withFiles("resume").map(card).join("");
      return `<div class="grid">${r}</div>`;
    },
    profiles() {
      const links = P.profiles.map(p => `<article class="card"><div class="cbody"><span class="tag">${p.coding ? "Coding profile" : "Professional profile"}</span><h3>${esc(p.name)}</h3><p class="meta">${esc(p.label)}</p>
        <div class="acts"><a class="btn btn-primary sm" href="${esc(p.url)}" target="_blank" rel="noopener">Open ${esc(p.name)}</a></div></div></article>`).join("");
      return `<div class="grid">${links}</div><div class="pinfo">${NA("CodeChef and a personal portfolio website have not been added yet.")}</div>`;
    },
    certs() { return grouped(withFiles("certs")); },
    projects() {
      return `<div class="grid">${P.projects.map(p => {
        const ev = items.findIndex(i => i.title === p.evidenceTitle);
        return `<article class="card"><div class="cover">${posIcon}<span>Illustration</span></div><div class="cbody"><span class="tag">${esc(p.type)}</span><h3>${esc(p.title)}</h3>
          <p class="meta">${esc(p.context)}</p><p class="note">${esc(p.summary)}</p><p class="note"><em>${esc(p.missing)}</em></p>
          <div class="acts"><button class="btn btn-ghost sm" data-view="${ev}">View internship certificate</button></div></div></article>`;
      }).join("")}</div><div class="pinfo">${NA("No Product Development Lab, mini or personal projects have been added yet.")}</div>`;
    },
    internship() {
      const order = ["Wiztech Automation Solutions Pvt. Ltd.", "Virtual Tech Services", "Maxim Code"];
      const list = withFiles("internship").sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title));
      return `<ol class="timeline">${list.map(it => {
        const k = items.indexOf(it);
        return `<li><article class="card" data-search="${esc((it.title + " " + it.issuer + " " + it.date + " " + it.notes).toLowerCase())}">
          <button class="thumb" data-view="${k}" aria-label="View ${esc(it.title)}"><img class="thumb" loading="lazy" src="${esc(it.thumb)}" alt="Preview of ${esc(it.title)} certificate"></button>
          <div class="cbody"><p class="when">${esc(it.date)}</p><h3>${esc(it.title)}</h3><span class="tag">${esc(it.kind)}</span>
          <p class="note">${esc(it.notes)}</p>${rowsHtml(it)}
          <div class="acts"><button class="btn btn-ghost sm" data-view="${k}">View</button><a class="btn btn-primary sm" href="${esc(it.file)}" download>Download</a></div></div></article></li>`;
      }).join("")}</ol>`;
    },
    training() { return NA("No industrial training evidence has been added yet."); },
    hackathons() { return `<div class="grid">${withFiles("hackathons").map(card).join("")}</div>`; },
    coding() {
      const pf = P.profiles.filter(p => p.coding).map(p => `<article class="card"><div class="cbody"><span class="tag">Coding profile</span><h3>${esc(p.name)}</h3><p class="meta">${esc(p.label)}</p>
        <div class="acts"><a class="btn btn-primary sm" href="${esc(p.url)}" target="_blank" rel="noopener">Open ${esc(p.name)}</a></div></div></article>`).join("");
      return `<div class="grid">${pf}${withFiles("coding").map(card).join("")}</div><div class="pinfo">${NA("Problems solved, ratings and badges have not been added yet.")}</div>`;
    },
    aptitude() {
      return `<div class="grid">${withFiles("aptitude").map(card).join("")}</div><div class="pinfo">${NA("AMCAT report has not been added yet.")}</div>`;
    },
    teamwork() {
      return `<div class="grid">${withFiles("teamwork").map(card).join("")}</div><div class="pinfo">${NA("Leadership roles, club activities, student coordinator work and event organisation have not been added yet.")}</div>`;
    },
    workshops() { return `<div class="grid">${withFiles("workshops").map(card).join("")}</div>`; },
    research() {
      return `<div class="grid">${withFiles("research").map(card).join("")}</div><div class="pinfo">${NA("Published research papers, conference papers and journal publications have not been added yet.")}</div>`;
    },
    awards() { return `<div class="grid">${inSec("awards").map(card).join("")}</div>`; },
    other() { return grouped(withFiles("other")); }
  };

  /* ---------- render ---------- */
  const secWrap = $("#sections");
  secWrap.innerHTML = SECTIONS.map((s, i) => {
    const html = body[s.id]();
    return `<section class="sec" id="${s.id}" data-sec="${s.id}" aria-labelledby="h-${s.id}"><h2 id="h-${s.id}"><span class="n">${i + 2}</span>${esc(s.title)}</h2>
      ${s.lead ? `<p class="lead">${esc(s.lead)}</p>` : ""}${html}</section>`;
  }).join("");
  const countOf = id => id === "profile" ? 0 : id === "profiles" ? P.profiles.length : id === "coding" ? P.profiles.filter(p => p.coding).length + inSec("coding").filter(i => i.file).length : id === "projects" ? P.projects.length : inSec(id).filter(i => i.file).length;

  $("#heroName").textContent = S.name;
  $("#heroSub").textContent = `${S.degree} · ${S.college} · Batch ${S.batch} · CGPA ${S.cgpa} · Reg. No. ${S.reg}`;
  $("#heroResume").href = "resume/Sharmila_R_Resume.pdf";
  $("#heroLinkedIn").href = S.linkedin;
  $("#ledger").innerHTML = SECTIONS.filter(s => s.id !== "profile").map(s => {
    const c = countOf(s.id);
    return `<li><a href="#${s.id}">${esc(s.title)}</a>${c ? `<b>${c}</b>` : `<span class="none">Not yet available</span>`}</li>`;
  }).join("");

  $("#side").innerHTML = `<h2>Sections</h2><a href="#cover"><span class="n">1</span>Cover</a>` + SECTIONS.map((s, i) => {
    const c = countOf(s.id);
    return `<a href="#${s.id}" data-nav="${s.id}"><span class="n">${i + 2}</span>${esc(s.title)}${c ? `<span class="c">${c}</span>` : ""}</a>`;
  }).join("");

  /* chips + search */
  let active = "all";
  $("#chips").innerHTML = [["all", "All"]].concat(SECTIONS.filter(s => countOf(s.id)).map(s => [s.id, s.title.replace(" and Online Learning", "").replace("Communication, Teamwork and Leadership", "Teamwork").replace("Hackathons and Competitions", "Competitions").replace("Workshops, Seminars and Conferences", "Workshops")])).map(([id, t]) =>
    `<button class="chip" data-chip="${id}" aria-pressed="${id === "all"}">${esc(t)}</button>`).join("");

  function apply() {
    const q = $("#q").value.trim().toLowerCase();
    let shown = 0, total = 0;
    document.querySelectorAll(".sec").forEach(sec => {
      const wanted = active === "all" || sec.dataset.sec === active;
      const cards = sec.querySelectorAll(".card");
      let vis = 0;
      cards.forEach(c => { const ok = !q || (c.dataset.search || c.textContent.toLowerCase()).includes(q); const el = c.closest("li") || c; el.hidden = !ok; if (ok) vis++; });
      total += cards.length;
      const hide = !wanted || (q && vis === 0);
      sec.hidden = hide;
      if (!hide) shown += vis;
    });
    $("#count").textContent = q || active !== "all" ? `Showing ${shown} item${shown === 1 ? "" : "s"}` : `${items.filter(i => i.file).length} documents in this portfolio`;
    $("#nomatch").hidden = !(q && shown === 0);
  }
  $("#q").addEventListener("input", apply);
  $("#chips").addEventListener("click", e => {
    const b = e.target.closest("[data-chip]"); if (!b) return;
    active = b.dataset.chip;
    document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    apply();
    if (active !== "all") document.getElementById(active).scrollIntoView();
  });
  apply();

  /* viewer */
  const dlg = $("#viewer");
  document.addEventListener("click", e => {
    const v = e.target.closest("[data-view]");
    if (v) { const it = items[+v.dataset.view]; if (!it || !it.file) return;
      $("#vTitle").textContent = it.title; $("#vOpen").href = it.file; $("#vDown").href = it.file;
      $("#vBody").innerHTML = it.file.toLowerCase().endsWith(".pdf")
        ? `<iframe src="${esc(it.file)}" title="${esc(it.title)}"></iframe>`
        : `<img src="${esc(it.file)}" alt="${esc(it.title)}">`;
      dlg.showModal(); }
  });
  $("#vClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { $("#vBody").innerHTML = ""; });

  /* mobile menu + active nav */
  const side = $("#side"), mb = $("#menuBtn");
  mb.addEventListener("click", () => { const o = side.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
  side.addEventListener("click", e => { if (e.target.closest("a")) { side.classList.remove("open"); mb.setAttribute("aria-expanded", false); } });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) {
      document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === en.target.id)); } }), { rootMargin: "-20% 0px -70% 0px" });
    document.querySelectorAll(".sec").forEach(s => io.observe(s));
  }
})();

/* ===== motion & interactions ===== */
(function () {
  const P = window.PORTFOLIO, items = P.items, $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* hero art + animated counters (all numbers computed from real data) */
  const hero = $(".hero");
  hero.insertAdjacentHTML("afterbegin", `<div class="hero-art" aria-hidden="true"><div class="sheet s1">Certificate<i></i><small>Course completion</small></div><div class="sheet s2">Internship<i></i><small>Experience</small></div><div class="sheet s3">Competition<i></i><small>Participation</small></div></div>`);
  const n = id => items.filter(i => i.file && (i.section === id)).length;
  const stats = [[items.filter(i => i.file).length, "Documents"], [n("certs"), "Course certificates"], [n("internship"), "Internships"], [n("hackathons"), "Competitions & hackathons"]];
  $(".hero-actions").insertAdjacentHTML("afterend", `<div class="stats">${stats.map(s => `<div class="stat"><b data-n="${s[0]}">0</b><span>${s[1]}</span></div>`).join("")}</div>`);
  document.querySelectorAll(".stat b").forEach(b => {
    const t = +b.dataset.n; if (calm) { b.textContent = t; return; }
    const t0 = performance.now() + 500;
    (function tick(now) { const p = Math.min(1, Math.max(0, (now - t0) / 1300)); b.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(performance.now());
  });

  /* scroll-reveal with stagger */
  document.querySelectorAll(".sec .card, .sec .panel, .sec .empty, .timeline>li").forEach(el => {
    el.classList.add("rv"); const i = [...el.parentElement.children].indexOf(el); el.style.setProperty("--d", Math.min(i, 6) * 0.07 + "s");
  });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  document.querySelectorAll(".rv, .sec").forEach(el => io.observe(el));
  setTimeout(() => document.querySelectorAll(".rv").forEach(e => e.classList.add("in")), 4000);
  document.querySelectorAll(".timeline .card").forEach(c => { const li = c.closest("li"); li.addEventListener("transitionend", () => {}); new MutationObserver(() => c.classList.toggle("in", li.classList.contains("in"))).observe(li, { attributes: true, attributeFilter: ["class"] }); });

  /* cursor spotlight on cards */
  document.addEventListener("pointermove", e => {
    const c = e.target.closest && e.target.closest(".card"); if (!c) return;
    const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
  });

  /* progress bar + back to top */
  document.body.insertAdjacentHTML("beforeend", `<div id="prog"></div><button id="top" aria-label="Back to top">&uarr;</button>`);
  const prog = $("#prog"), top = $("#top");
  addEventListener("scroll", () => { const h = document.documentElement; prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%"; top.classList.toggle("show", h.scrollTop > 700); }, { passive: true });
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" }));

  /* viewer: previous / next document */
  const keys = items.map((it, i) => it.file ? i : -1).filter(i => i >= 0);
  let cur = -1;
  document.addEventListener("click", e => { const v = e.target.closest("[data-view]"); if (v) cur = +v.dataset.view; }, true);
  function go(d) {
    const pos = keys.indexOf(cur); if (pos < 0) return;
    cur = keys[(pos + d + keys.length) % keys.length]; const it = items[cur];
    $("#vTitle").textContent = it.title; $("#vOpen").href = it.file; $("#vDown").href = it.file;
    $("#vBody").innerHTML = it.file.toLowerCase().endsWith(".pdf") ? `<iframe src="${it.file}" title="${it.title}"></iframe>` : `<img src="${it.file}" alt="${it.title}">`;
  }
  $("#vPrev").addEventListener("click", () => go(-1)); $("#vNext").addEventListener("click", () => go(1));
  document.addEventListener("keydown", e => { if (!$("#viewer").open) return; if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); });
})();
