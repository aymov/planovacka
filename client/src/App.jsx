import { useState, useCallback, useEffect, useMemo, useRef } from "react";

const API = "/api";

const TH = {
  dark:{bg:"#09090B",tx:"#EEEEF2",t2:"rgba(255,255,255,0.6)",t3:"rgba(255,255,255,0.4)",t4:"rgba(255,255,255,0.3)",
    gl:"rgba(9,9,11,0.75)",gB:"rgba(255,255,255,0.06)",gS:"rgba(16,16,20,0.94)",
    sf:"rgba(255,255,255,0.035)",sB:"rgba(255,255,255,0.06)",sH:"rgba(255,255,255,0.07)",
    cB:"rgba(255,255,255,0.07)",slS:"rgba(255,255,255,0.02)",dS:"rgba(255,255,255,0.015)",
    ac:"#818CF8",aR:"129,140,248",aB:"rgba(129,140,248,0.12)",aT:"#A5B4FC",
    ch:.55,chB:.6,chG:.15,chI:"rgba(255,255,255,0.1)",
    se:"rgba(129,140,248,0.08)",seO:"rgba(129,140,248,0.25)",fO:"rgba(129,140,248,0.5)",
    tB:"rgba(129,140,248,0.02)",tH:"rgba(129,140,248,0.05)",tBd:"rgba(129,140,248,0.4)",
    mB:"rgba(16,16,20,0.96)",mO:"rgba(0,0,0,0.55)",hB:"rgba(255,255,255,0.035)",wB:.1,
    dn:"#F87171",wn:"#FBBF24",ok:"#6EE7A0",sc:"rgba(255,255,255,0.05)",eH:"rgba(255,255,255,0.012)",
    gw:[]},
  light:{bg:"#EEEEF2",tx:"#1A1A1F",t2:"rgba(0,0,0,0.6)",t3:"rgba(0,0,0,0.42)",t4:"rgba(0,0,0,0.28)",
    gl:"rgba(255,255,255,0.85)",gB:"rgba(0,0,0,0.08)",gS:"rgba(255,255,255,0.96)",
    sf:"rgba(0,0,0,0.03)",sB:"rgba(0,0,0,0.08)",sH:"rgba(0,0,0,0.05)",
    cB:"rgba(0,0,0,0.1)",slS:"rgba(0,0,0,0.03)",dS:"rgba(0,0,0,0.025)",
    ac:"#6366F1",aR:"99,102,241",aB:"rgba(99,102,241,0.08)",aT:"#4F46E5",
    ch:.45,chB:.5,chG:.1,chI:"rgba(255,255,255,0.3)",
    se:"rgba(99,102,241,0.06)",seO:"rgba(99,102,241,0.2)",fO:"rgba(99,102,241,0.4)",
    tB:"rgba(99,102,241,0.025)",tH:"rgba(99,102,241,0.05)",tBd:"rgba(99,102,241,0.35)",
    mB:"rgba(255,255,255,0.97)",mO:"rgba(0,0,0,0.2)",hB:"rgba(0,0,0,0.04)",wB:.08,
    dn:"#DC2626",wn:"#D97706",ok:"#16A34A",sc:"rgba(0,0,0,0.08)",eH:"rgba(0,0,0,0.015)",
    gw:[]}
};

const RO = {
  "Copywriters / Ideamakers": { c: "#5A9EC4", e: "Copywriters / Ideamakers" },
  "Art Department": { c: "#C470A0", e: "Art Department" },
  "Strategy": { c: "#D4944E", e: "Strategy" },
};

const EM = [
  { n: "Adéla", r: "Copywriters / Ideamakers" },
  { n: "Andrea", r: "Copywriters / Ideamakers" },
  { n: "Anet", r: "Copywriters / Ideamakers" },
  { n: "Bára", r: "Copywriters / Ideamakers" },
  { n: "Daja", r: "Copywriters / Ideamakers" },
  { n: "Evža", r: "Copywriters / Ideamakers" },
  { n: "Ivča", r: "Copywriters / Ideamakers" },
  { n: "Jáchym", r: "Copywriters / Ideamakers" },
  { n: "Judi", r: "Copywriters / Ideamakers" },
  { n: "Lenka", r: "Copywriters / Ideamakers" },
  { n: "Marek", r: "Copywriters / Ideamakers" },
  { n: "Matej", r: "Copywriters / Ideamakers" },
  { n: "Michal", r: "Copywriters / Ideamakers" },
  { n: "Petr", r: "Copywriters / Ideamakers" },
  { n: "Verča", r: "Copywriters / Ideamakers" },
  { n: "Vláďa", r: "Copywriters / Ideamakers" },
  { n: "Vojta M.", r: "Copywriters / Ideamakers" },
  { n: "André", r: "Art Department" },
  { n: "Alex", r: "Art Department" },
  { n: "Daniel", r: "Art Department" },
  { n: "Dominika", r: "Art Department" },
  { n: "Filip", r: "Art Department" },
  { n: "Filip M.", r: "Art Department" },
  { n: "Fína", r: "Art Department" },
  { n: "Gabi", r: "Art Department" },
  { n: "Gandalf", r: "Art Department" },
  { n: "Gesu", r: "Art Department" },
  { n: "Kirill", r: "Art Department" },
  { n: "Leandro", r: "Art Department" },
  { n: "Lucka", r: "Art Department" },
  { n: "Lukáš Ch", r: "Art Department" },
  { n: "Majo", r: "Art Department" },
  { n: "Michal Č", r: "Art Department" },
  { n: "Roman P.", r: "Art Department" },
  { n: "Ženja", r: "Art Department" },
  { n: "Roman", r: "Strategy" },
  { n: "David", r: "Strategy" },
  { n: "Kristýna", r: "Strategy" },
  { n: "Míša", r: "Strategy" },
];

const CL = [
  { n: "ČSOB", c: "#2563EB", i: "ČS" }, { n: "SKO", c: "#16A34A", i: "SK" },
  { n: "Kozel", c: "#CA8A04", i: "KZ" }, { n: "LIDL", c: "#DC2626", i: "LI" },
  { n: "BS!", c: "#9333EA", i: "BS" }, { n: "Joya", c: "#EA580C", i: "JO" },
  { n: "BK", c: "#E11D48", i: "BK" }, { n: "Brit", c: "#0891B2", i: "BR" },
  { n: "PVZP", c: "#059669", i: "PV" }, { n: "Kingsbet", c: "#D97706", i: "KB" },
  { n: "Lučina", c: "#C026D3", i: "LU" }, { n: "Hipp", c: "#0D9488", i: "HI" },
  { n: "MANA", c: "#EA580C", i: "MA" }, { n: "Šariš", c: "#B45309", i: "ŠA" },
  { n: "Porsche", c: "#6366F1", i: "PO" }, { n: "INT", c: "#475569", i: "IN" },
];

const SL = ["9:30–12", "13–15", "15–18"];
const DY = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"];
const DS = ["Po", "Út", "St", "Čt", "Pá"];

function getMonday(d) {
  const x = new Date(d);
  const y = x.getDay();
  x.setDate(x.getDate() - y + (y === 0 ? -6 : 1));
  x.setHours(0, 0, 0, 0);
  return x;
}
function addD(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fD(d) { return d.getDate() + "." + (d.getMonth() + 1) + "."; }
function wK(d) { return getMonday(d).toISOString().slice(0, 10); }
function cI(w, e, d, s) { return w + "|" + e + "|" + d + "|" + s; }
function rg(h) {
  return parseInt(h.slice(1, 3), 16) + "," + parseInt(h.slice(3, 5), 16) + "," + parseInt(h.slice(5, 7), 16);
}

// ── BULK MODAL ──
function BulkModal({ emps, onApply, onClose, t }) {
  const [cl, setCl] = useState(null);
  const [tk, setTk] = useState("");
  const [sE, setSE] = useState(new Set());
  const [sD, setSD] = useState(new Set());
  const [sS, setSS] = useState(new Set([0, 1, 2]));

  function tog(s, f, v) { const n = new Set(s); if (n.has(v)) n.delete(v); else n.add(v); f(n); }
  function togR(r) {
    const ns = emps.filter(function(e) { return e.r === r; }).map(function(e) { return e.n; });
    const all = ns.every(function(n) { return sE.has(n); });
    const n = new Set(sE);
    ns.forEach(function(nm) { if (all) n.delete(nm); else n.add(nm); });
    setSE(n);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", background: t.mO, backdropFilter: "blur(12px)" }} onClick={onClose}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{ background: t.mB, border: "1px solid " + t.gB, borderRadius: 20, padding: 28, width: 560, maxHeight: "85vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Skupinové přiřazení</span>
          <button onClick={onClose} style={{ background: t.sf, border: "1px solid " + t.sB, color: t.t2, cursor: "pointer", padding: "2px 10px", borderRadius: 10, fontSize: 16, fontFamily: "inherit" }}>✕</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: t.t3, marginBottom: 6, fontWeight: 700, letterSpacing: "0.06em" }}>1. KLIENT</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {CL.map(function(c) {
              var s = cl && cl.n === c.n;
              return <button key={c.n} onClick={function() { setCl(c); if (!tk) setTk(c.n); }} style={{ padding: "4px 10px", borderRadius: 14, fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: s ? "2px solid " + c.c : "2px solid transparent", background: s ? "rgba(" + rg(c.c) + ",0.2)" : "rgba(" + rg(c.c) + ",0.06)", color: c.c }}>{c.n}</button>;
            })}
          </div>
          {cl && <input value={tk} onChange={function(e) { setTk(e.target.value); }} placeholder="Úkol" style={{ background: t.sf, border: "1px solid " + t.sB, borderRadius: 10, padding: "7px 12px", color: t.tx, fontSize: 12, fontFamily: "inherit", outline: "none", width: "100%", marginTop: 8 }} />}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: t.t3, marginBottom: 6, fontWeight: 700, letterSpacing: "0.06em" }}>2. LIDI (klikni na roli = celý tým)</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
            {Object.entries(RO).map(function(entry) {
              var r = entry[0], info = entry[1];
              var ns = emps.filter(function(e) { return e.r === r; }).map(function(e) { return e.n; });
              var all = ns.length > 0 && ns.every(function(n) { return sE.has(n); });
              return <button key={r} onClick={function() { togR(r); }} style={{ padding: "4px 10px", borderRadius: 14, fontSize: 10, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: all ? "rgba(" + rg(info.c) + ",0.15)" : t.sf, color: all ? info.c : t.t3, border: all ? "1.5px solid " + info.c : "1.5px solid transparent" }}>{info.e} {r}</button>;
            })}
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {emps.map(function(e) {
              var on = sE.has(e.n);
              var rc = RO[e.r] ? RO[e.r].c : "#888";
              return <button key={e.n} onClick={function() { tog(sE, setSE, e.n); }} style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: on ? "rgba(" + rg(rc) + ",0.15)" : t.sf, color: on ? rc : t.t3, border: on ? "1px solid " + rc + "40" : "1px solid transparent" }}>{e.n}</button>;
            })}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: t.t3, marginBottom: 6, fontWeight: 700, letterSpacing: "0.06em" }}>3. DNY & SLOTY</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {DY.map(function(d, i) {
              var on = sD.has(i);
              return <button key={i} onClick={function() { tog(sD, setSD, i); }} style={{ flex: 1, padding: 5, borderRadius: 10, fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", textAlign: "center", background: on ? t.aB : t.sf, color: on ? t.aT : t.t3, border: on ? "1.5px solid " + t.ac + "40" : "1.5px solid transparent" }}>{d}</button>;
            })}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {SL.map(function(s, i) {
              var on = sS.has(i);
              return <button key={i} onClick={function() { tog(sS, setSS, i); }} style={{ flex: 1, padding: 5, borderRadius: 10, fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", textAlign: "center", background: on ? t.aB : t.sf, color: on ? t.aT : t.t3, border: on ? "1.5px solid " + t.ac + "40" : "1.5px solid transparent" }}>{s}</button>;
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: t.t3 }}>{sE.size} × {sD.size} × {sS.size} = {sE.size * sD.size * sS.size}</span>
          <button onClick={function() { if (cl && sE.size && sD.size && sS.size) onApply(cl, tk || cl.n, sE, sD, sS); }} disabled={!cl || !sE.size || !sD.size} style={{ background: cl ? "rgba(" + rg(cl.c) + ",0.2)" : t.sf, color: cl ? cl.c : t.t3, fontWeight: 700, fontSize: 14, padding: "8px 24px", borderRadius: 12, border: "1px solid " + (cl ? cl.c + "40" : t.sB), cursor: "pointer", fontFamily: "inherit", opacity: (!cl || !sE.size || !sD.size) ? 0.4 : 1 }}>Přiřadit →</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──
function Inner() {
  const [dark, setDark] = useState(false);
  var t = dark ? TH.dark : TH.light;

  const [wk, setWk] = useState(function() { return getMonday(new Date()); });
  var w = wK(wk);

  const [emps, setEmps] = useState(EM);
  const [cells, setCs] = useState({});
  const [sel, setSel] = useState(null);
  const [paint, setPaint] = useState(false);
  const [paintReady, setPaintReady] = useState(false); // true after mousedown, paint activates on first move
  const [edC, setEdC] = useState(null);
  const [edT, setEdT] = useState("");
  const [srch, setSrch] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const [fR, setFR] = useState(null);
  const [clip, setClip] = useState(null);
  const [foc, setFoc] = useState(null);
  const [mSel, setMSel] = useState(new Set());
  const [anch, setAnch] = useState(null);
  const [bulk, setBulk] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [roleMenu, setRoleMenu] = useState(null); // {x, y, empName}
  const [subSel, setSubSel] = useState(null); // {id: cellId, ci: chipIndex} or null
  const [chipEdit, setChipEdit] = useState(null); // {id, ci} - which chip is being edited
  const [chipEditTxt, setChipEditTxt] = useState("");
  const [emails, setEmails] = useState({}); // {empName: "email@..."}
  const [showSend, setShowSend] = useState(false);
  const [dragChip, setDragChip] = useState(null);
  const [cliFilter, setCliFilter] = useState(null);
  const [viewMode, setViewMode] = useState("normal");
  const [copyMenu, setCopyMenu] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [hoMap, setHoMap] = useState({}); // {"cellId": true} homeoffice per cell
  const [hoMode, setHoMode] = useState(false); // HO painting mode
  const [vacMode, setVacMode] = useState(false); // Vacation painting mode
  const [gcalStatus, setGcalStatus] = useState(null); // {hasCredentials, isAuthenticated}
  const [syncing, setSyncing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved"
  const saveTimer = useRef(null);
  const isLoadingRef = useRef(false);

  // Load schedule from backend when week changes
  useEffect(function() {
    isLoadingRef.current = true;
    fetch(API + "/schedule/" + w)
      .then(function(r) { return r.json(); })
      .then(function(d) { setCs(d.data || {}); isLoadingRef.current = false; })
      .catch(function() { isLoadingRef.current = false; });
  }, [w]);

  // Load employees from backend on mount
  useEffect(function() {
    fetch(API + "/schedule/meta/employees")
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.length) setEmps(d.map(function(e) { return { n: e.name, r: e.role }; }));
      })
      .catch(function() {});
  }, []);

  // Load emails from backend on mount
  useEffect(function() {
    fetch(API + "/schedule/meta/settings/emails")
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.value) setEmails(d.value); })
      .catch(function() {});
  }, []);

  // Check GCal status
  useEffect(function() {
    fetch(API + "/gcal/status")
      .then(function(r) { return r.json(); })
      .then(setGcalStatus)
      .catch(function() {});
  }, []);

  // Auto-save cells to backend (debounced)
  useEffect(function() {
    if (isLoadingRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(function() {
      setSaveStatus("saving");
      fetch(API + "/schedule/" + w, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: cells }),
      }).then(function() { setSaveStatus("saved"); setTimeout(function() { setSaveStatus(""); }, 1500); })
        .catch(function() { setSaveStatus(""); });
    }, 800);
    return function() { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [cells, w]);

  // Save emails when they change
  useEffect(function() {
    var hasAny = Object.values(emails).some(function(e) { return e; });
    if (!hasAny) return;
    fetch(API + "/schedule/meta/settings/emails", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: emails }),
    }).catch(function() {});
  }, [emails]);

  // GCal sync function
  function syncGCal() {
    if (!gcalStatus) return;
    if (!gcalStatus.isAuthenticated) {
      fetch(API + "/gcal/auth-url")
        .then(function(r) { return r.json(); })
        .then(function(d) { if (d.url) window.location.href = d.url; else alert("Nastav Google OAuth credentials v /api/gcal/credentials"); })
        .catch(function() { alert("GCal chyba"); });
      return;
    }
    setSyncing(true);
    fetch(API + "/gcal/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekKey: w, cells: cells, emails: emails }),
    }).then(function(r) { return r.json(); })
      .then(function(d) { setSyncing(false); alert("Sync hotov: " + d.created + " vytvořeno, " + d.updated + " aktualizováno"); })
      .catch(function() { setSyncing(false); alert("Sync selhal"); });
  }

  var flt = useMemo(function() {
    var l = emps;
    if (fR) l = l.filter(function(e) { return e.r === fR; });
    if (srch) { var q = srch.toLowerCase(); l = l.filter(function(e) { return e.n.toLowerCase().includes(q); }); }
    return l;
  }, [srch, fR, emps]);

  var push = useCallback(function() {
    setUndoStack(function(p) { return p.slice(-30).concat([JSON.parse(JSON.stringify(cells))]); });
  }, [cells]);

  var pop = useCallback(function() {
    if (!undoStack.length) return;
    setCs(undoStack[undoStack.length - 1]);
    setUndoStack(function(s) { return s.slice(0, -1); });
  }, [undoStack]);

  var sC = useCallback(function(id, v) {
    setCs(function(p) {
      var n = Object.assign({}, p);
      if (!v || (Array.isArray(v) && v.length === 0)) delete n[id];
      else n[id] = v;
      return n;
    });
  }, []);

  var allIds = useMemo(function() {
    var a = [];
    flt.forEach(function(e) {
      for (var d = 0; d < 5; d++) for (var s = 0; s < 3; s++) a.push(cI(w, e.n, d, s));
    });
    return a;
  }, [flt, w]);

  var gRng = useCallback(function(a, b) {
    var ia = allIds.indexOf(a), ib = allIds.indexOf(b);
    if (ia < 0 || ib < 0) return [b];
    return allIds.slice(Math.min(ia, ib), Math.max(ia, ib) + 1);
  }, [allIds]);

  // Keyboard
  useEffect(function() {
    function h(e) {
      if (edC || chipEdit) return;
      var m = e.metaKey || e.ctrlKey;
      var tg = mSel.size > 1 ? Array.from(mSel) : foc ? [foc] : [];
      if (m && e.key === "z") { e.preventDefault(); pop(); }
      if (m && e.key === "a") { e.preventDefault(); setMSel(new Set(allIds)); }
      if (m && e.key === "c" && foc) { e.preventDefault(); var c = cells[foc]; if (c) setClip(JSON.parse(JSON.stringify(c))); }
      if (m && e.key === "v" && tg.length && clip) { e.preventDefault(); push(); tg.forEach(function(id) { sC(id, JSON.parse(JSON.stringify(clip))); }); }
      if (m && e.key === "x" && foc) { e.preventDefault(); var cx = cells[foc]; if (cx) { setClip(JSON.parse(JSON.stringify(cx))); push(); tg.forEach(function(id) { sC(id, null); }); } }
      if ((e.key === "Delete" || e.key === "Backspace") && !edC) {
        e.preventDefault();
        if (subSel) {
          // Delete only the selected chip
          push();
          var arr = cellArr(subSel.id);
          var filtered = arr.filter(function(_, i) { return i !== subSel.ci; });
          sC(subSel.id, filtered.length ? filtered : null);
          setSubSel(null);
        } else if (tg.length) {
          push(); tg.forEach(function(id) { sC(id, null); });
        }
      }
      if (e.key === "Escape") { setSel(null); setEdC(null); setFoc(null); setMSel(new Set()); setCtx(null); setSubSel(null); setChipEdit(null); }
    }
    window.addEventListener("keydown", h);
    return function() { window.removeEventListener("keydown", h); };
  }, [pop, foc, clip, cells, edC, push, sC, mSel, allIds, subSel]);

  useEffect(function() {
    function h() { setPaint(false); setPaintReady(false); }
    window.addEventListener("mouseup", h);
    return function() { window.removeEventListener("mouseup", h); };
  }, []);

  useEffect(function() {
    function h() { if (ctx) setCtx(null); if (roleMenu) setRoleMenu(null); if (copyMenu) setCopyMenu(null); }
    window.addEventListener("click", h);
    return function() { window.removeEventListener("click", h); };
  }, [ctx, roleMenu]);

  function changeRole(empName, newRole) {
    setEmps(function(prev) {
      return prev.map(function(e) {
        if (e.n === empName) return { n: e.n, r: newRole };
        return e;
      });
    });
    setRoleMenu(null);
  }

  // Cell data is now an array: [{cl,co,tk}, ...] or null
  // Helper: normalize cell to array
  function cellArr(id) {
    var v = cells[id];
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return [v]; // legacy single object
  }

  // Cell handlers
  // LEFT CLICK: always ADDS selected client to cell. Never removes. Never replaces.
  function onDn(id, e) {
    if (e.button !== 0) return;
    e.preventDefault();
    setSubSel(null);
    // Homeoffice mode: toggle HO on this specific cell
    if (hoMode) {
      toggleHOCell(id);
      return;
    }
    // Vacation mode: toggle vacation on this cell
    if (vacMode) {
      push();
      var arr = cellArr(id);
      var isVac = arr.length === 1 && arr[0].cl === "__h";
      if (isVac) { sC(id, null); } else { sC(id, [{ cl: "__h", co: "#374151", tk: "Dovolenka" }]); }
      return;
    }
    if (sel) {
      if (e.shiftKey && anch) {
        push();
        gRng(anch, id).forEach(function(cid) {
          var arr = cellArr(cid);
          var has = arr.some(function(x) { return x.cl === sel.n; });
          if (!has) sC(cid, arr.concat([{ cl: sel.n, co: sel.c, tk: sel.n }]));
        });
        setMSel(new Set(gRng(anch, id)));
        setFoc(id);
        return;
      }
      push();
      var existing = cellArr(id);
      var alreadyIn = existing.some(function(x) { return x.cl === sel.n; });
      if (!alreadyIn) {
        sC(id, existing.concat([{ cl: sel.n, co: sel.c, tk: sel.n }]));
      }
      setFoc(id); setAnch(id); setMSel(new Set([id])); setPaintReady(true);
      return;
    }
    // No client selected: selection mode
    if (e.shiftKey && anch) {
      setMSel(new Set(gRng(anch, id))); setFoc(id);
    } else {
      setFoc(id); setAnch(id); setMSel(new Set([id])); setPaintReady(true);
    }
  }

  // Drag: activates only when mouse actually moves to a DIFFERENT cell
  function onEn(id) {
    if (!paintReady) return;
    // First move activates paint
    if (!paint) setPaint(true);
    if (sel) {
      var arr = cellArr(id);
      var has = arr.some(function(x) { return x.cl === sel.n; });
      if (!has) sC(id, arr.concat([{ cl: sel.n, co: sel.c, tk: sel.n }]));
      setMSel(function(p) { var n = new Set(p); n.add(id); return n; });
    } else if (anch) {
      setMSel(new Set(gRng(anch, id))); setFoc(id);
    }
  }

  function onCx(e, id) {
    e.preventDefault(); setFoc(id);
    setCtx({ x: e.clientX, y: e.clientY, id: id, emp: id.split("|")[1] });
  }

  function onDb(id) {
    setFoc(id);
    setEdC(id);
    var arr = cellArr(id);
    setEdT(arr.map(function(x) { return x.tk; }).join(" / "));
  }

  function commit() {
    if (!edC) return;
    var tx = edT.trim();
    if (!tx) {
      // empty = cancel edit, keep original
      setEdC(null); setEdT("");
      return;
    }
    var parts = tx.split("/").map(function(p) { return p.trim(); }).filter(Boolean);
    var items = parts.map(function(p) {
      var m = CL.find(function(c) { return p.toLowerCase().startsWith(c.n.toLowerCase()); });
      return { cl: m ? m.n : "", co: m ? m.c : "#94A3B8", tk: p };
    });
    sC(edC, items);
    setEdC(null); setEdT("");
  }

  function chipCommit() {
    if (!chipEdit) return;
    var tx = chipEditTxt.trim();
    if (!tx) {
      // empty = cancel edit, keep original
      setChipEdit(null); setChipEditTxt("");
      return;
    }
    var arr = cellArr(chipEdit.id);
    var m = CL.find(function(c) { return tx.toLowerCase().startsWith(c.n.toLowerCase()); });
    var updated = arr.map(function(item, i) {
      if (i !== chipEdit.ci) return item;
      return { cl: m ? m.n : item.cl, co: m ? m.c : item.co, tk: tx };
    });
    sC(chipEdit.id, updated);
    setChipEdit(null); setChipEditTxt("");
  }

  function clrR(n) { push(); setCs(function(p) { var x = Object.assign({}, p); for (var d = 0; d < 5; d++) for (var s = 0; s < 3; s++) delete x[cI(w, n, d, s)]; return x; }); }
  function flD(n, di) { if (!sel) return; push(); for (var s = 0; s < 3; s++) sC(cI(w, n, di, s), [{ cl: sel.n, co: sel.c, tk: sel.n }]); }
  function mkH(n, di) { push(); for (var s = 0; s < 3; s++) sC(cI(w, n, di, s), [{ cl: "__h", co: "#374151", tk: "Dovolenka" }]); }
  function mkHSlot(id) { push(); sC(id, [{ cl: "__h", co: "#374151", tk: "Dovolenka" }]); }
  function toggleHODay(empN, di) {
    for (var s = 0; s < 3; s++) {
      var key = cI(w, empN, di, s);
      setHoMap(function(p) { var n = Object.assign({}, p); if (n[key]) delete n[key]; else n[key] = true; return n; });
    }
  }
  function toggleHOCell(id) {
    setHoMap(function(p) { var n = Object.assign({}, p); if (n[id]) delete n[id]; else n[id] = true; return n; });
  }
  function isCellHO(id) { return hoMap[id] || false; }

  function bApply(cl, tk, es, ds, ss) {
    push();
    setCs(function(p) {
      var n = Object.assign({}, p);
      es.forEach(function(nm) { ds.forEach(function(d) { ss.forEach(function(s) { n[cI(w, nm, d, s)] = [{ cl: cl.n, co: cl.c, tk: tk }]; }); }); });
      return n;
    });
    setBulk(false);
  }

  function xCSV() {
    var csv = "Zaměstnanec,Den,Slot,Klient,Úkol\n";
    emps.forEach(function(e) { for (var d = 0; d < 5; d++) for (var s = 0; s < 3; s++) {
      var arr = cellArr(cI(w, e.n, d, s));
      arr.forEach(function(c) { csv += '"' + e.n + '","' + DY[d] + " " + fD(addD(wk, d)) + '","' + SL[s] + '","' + c.cl + '","' + c.tk + '"\n'; });
    } });
    var b = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a"); a.href = u; a.download = "plan_" + w + ".csv"; a.click();
    URL.revokeObjectURL(u);
  }

  // ICS generation for one employee
  var slotTimes = [
    { sh: 9, sm: 30, eh: 12, em: 0 },
    { sh: 13, sm: 0, eh: 15, em: 0 },
    { sh: 15, sm: 0, eh: 18, em: 0 },
  ];

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  function makeICS(empName) {
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Planovacka//CZ",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Plan " + empName,
    ];
    for (var d = 0; d < 5; d++) {
      var date = addD(wk, d);
      var ymd = date.getFullYear() + pad2(date.getMonth() + 1) + pad2(date.getDate());
      for (var s = 0; s < 3; s++) {
        var arr = cellArr(cI(w, empName, d, s));
        if (!arr.length) continue;
        var st = slotTimes[s];
        var summary = arr.map(function(x) { return x.tk; }).join(" / ");
        var dtStart = ymd + "T" + pad2(st.sh) + pad2(st.sm) + "00";
        var dtEnd = ymd + "T" + pad2(st.eh) + pad2(st.em) + "00";
        var uid = w + "-" + empName + "-" + d + "-" + s + "@planovacka";
        lines.push("BEGIN:VEVENT");
        lines.push("DTSTART:" + dtStart);
        lines.push("DTEND:" + dtEnd);
        lines.push("SUMMARY:" + summary);
        lines.push("DESCRIPTION:" + arr.map(function(x) { return x.cl + ": " + x.tk; }).join("\\n"));
        lines.push("UID:" + uid);
        lines.push("END:VEVENT");
      }
    }
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  function downloadICS(empName) {
    var ics = makeICS(empName);
    var b = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u;
    a.download = empName.replace(/\s/g, "_") + "_" + w + ".ics";
    a.click();
    URL.revokeObjectURL(u);
  }

  function sendEmail(empName) {
    var email = emails[empName];
    if (!email) return;
    var weekLabel = fD(wk) + " - " + fD(addD(wk, 4)) + " " + wk.getFullYear();
    var subject = "Plán na týden " + weekLabel;
    var body = "Ahoj " + empName + ",\n\nTvůj plán na týden " + weekLabel + ":\n\n";
    for (var d = 0; d < 5; d++) {
      var dayTasks = [];
      for (var s = 0; s < 3; s++) {
        var arr = cellArr(cI(w, empName, d, s));
        if (arr.length) {
          dayTasks.push(SL[s] + ": " + arr.map(function(x) { return x.tk; }).join(", "));
        }
      }
      if (dayTasks.length) {
        body += DY[d] + " " + fD(addD(wk, d)) + "\n";
        body += dayTasks.join("\n") + "\n\n";
      }
    }
    body += "---\nVygenerováno z Plánovačky";
    window.open("mailto:" + encodeURIComponent(email) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body));
  }

  function sendAll() {
    var sent = 0;
    emps.forEach(function(e) {
      if (emails[e.n]) { sendEmail(e.n); sent++; }
    });
    return sent;
  }

  // Drop a dragged chip into a cell
  function dropChip(targetId) {
    if (!dragChip) return;
    push();
    // Remove chip from source cell
    var srcArr = cellArr(dragChip.fromId);
    var filtered = srcArr.filter(function(_, i) { return i !== dragChip.ci; });
    sC(dragChip.fromId, filtered.length ? filtered : null);
    // Add chip to target cell
    var tgtArr = cellArr(targetId);
    sC(targetId, tgtArr.concat([dragChip.data]));
    setDragChip(null);
  }

  // Copy one employee's week to next week
  function copyEmpWeek(empN, dir) {
    var tw = wK(addD(wk, dir * 7));
    push();
    setCs(function(p) {
      var n = Object.assign({}, p);
      for (var d = 0; d < 5; d++) for (var s = 0; s < 3; s++) {
        var src = cI(w, empN, d, s);
        var dst = cI(tw, empN, d, s);
        if (p[src]) n[dst] = JSON.parse(JSON.stringify(p[src]));
      }
      return n;
    });
    setCopyMenu(null);
  }

  function ld(n) { var f = 0; for (var d = 0; d < 5; d++) for (var s = 0; s < 3; s++) if (cellArr(cI(w, n, d, s)).length) f++; return f; }
  function isN(di) { return addD(wk, di).toDateString() === new Date().toDateString(); }
  var thisW = wK(wk) === wK(new Date());

  function wrns(n) {
    var l = ld(n), wr = [];
    if (l >= 15) wr.push({ v: "f", m: "Plný!" }); else if (l >= 12) wr.push({ v: "h", m: "Vysoké" });
    for (var d = 0; d < 5; d++) {
      var cs = new Set(); var hol = false;
      for (var s = 0; s < 3; s++) {
        var arr = cellArr(cI(w, n, d, s));
        arr.forEach(function(c) { if (c.cl === "__h") hol = true; else if (c.cl) cs.add(c.cl); });
      }
      if (cs.size >= 3) wr.push({ v: "s", m: DS[d] + ":3kl" });
      if (hol && cs.size > 0) wr.push({ v: "f", m: DS[d] + ":⚠️" });
    }
    return wr;
  }

  function freq(n) {
    var tc = {};
    Object.entries(cells).forEach(function(entry) {
      var k = entry[0], v = entry[1];
      if (!v) return;
      var arr = Array.isArray(v) ? v : [v];
      if (k.split("|")[1] !== n) return;
      arr.forEach(function(item) { if (item.cl !== "__h" && item.tk) tc[item.tk] = (tc[item.tk] || 0) + 1; });
    });
    return Object.entries(tc).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5).map(function(entry) {
      var tk = entry[0];
      var cl = CL.find(function(c) { return tk.toLowerCase().startsWith(c.n.toLowerCase()); });
      return { tk: tk, cl: cl ? cl.n : "", co: cl ? cl.c : "#94A3B8" };
    });
  }

  // Merge consecutive same-client slots per day (compare content + HO status)
  function merged(en, di) {
    var sl = [];
    var slHo = [];
    for (var s = 0; s < 3; s++) {
      sl.push(cellArr(cI(w, en, di, s)));
      slHo.push(isCellHO(cI(w, en, di, s)));
    }
    var g = [], i = 0;
    function same(a, b, ai, bi) {
      if (a.length !== b.length) return false;
      if (slHo[ai] !== slHo[bi]) return false;
      for (var j = 0; j < a.length; j++) if (a[j].cl !== b[j].cl || a[j].tk !== b[j].tk) return false;
      return true;
    }
    while (i < 3) {
      var c = sl[i];
      if (c.length && i < 2 && sl[i + 1].length && same(c, sl[i + 1], i, i + 1)) {
        if (i < 1 && sl[i + 2].length && same(c, sl[i + 2], i, i + 2)) { g.push({ s: i, sp: 3, c: c }); i = 3; }
        else { g.push({ s: i, sp: 2, c: c }); i += 2; }
      } else { g.push({ s: i, sp: 1, c: c }); i++; }
    }
    return g;
  }

  function B(x) { return Object.assign({ background: t.sf, border: "1px solid " + t.sB, color: t.t2, cursor: "pointer", padding: "5px 10px", borderRadius: 10, fontSize: 13, fontFamily: "inherit", fontWeight: 500, transition: "all 0.2s" }, x || {}); }

  // Render cell - now c is an array of items
  function renderCell(emp, di, g, gi) {
    var baseId = cI(w, emp.n, di, g.s);
    var items = g.c; // array
    var ed = edC === baseId;
    var iS = mSel.has(baseId);
    var iF = foc === baseId;
    var cs = g.sp === 1 ? 1 : g.sp === 2 ? 3 : 5;
    var hasContent = items.length > 0;
    var isHol = hasContent && items[0].cl === "__h";
    var firstColor = hasContent ? items[0].co : null;
    var ho = isCellHO(baseId); // homeoffice for this cell
    var hRow = hoverCell ? hoverCell.split("|")[0] : null;
    var hDay = hoverCell ? parseInt(hoverCell.split("|")[1]) : -1;
    var inRow = hRow === emp.n;
    var inCol = hDay === di;
    var crossHl = (inRow || inCol) && !iS && !iF;

    // For merged cells: determine actual slot from click position
    function getSlotId(e) {
      if (g.sp === 1) return baseId;
      var td = e.currentTarget;
      var rect = td.getBoundingClientRect();
      var relX = e.clientX - rect.left;
      var slotWidth = rect.width / g.sp;
      var slotOffset = Math.min(Math.floor(relX / slotWidth), g.sp - 1);
      return cI(w, emp.n, di, g.s + slotOffset);
    }

    return (
      <td key={di + "-" + gi} colSpan={cs}
        onMouseDown={function(e) { onDn(getSlotId(e), e); }}
        onDoubleClick={function(e) { onDb(getSlotId(e)); }}
        onMouseEnter={function() { onEn(baseId); setHoverCell(emp.n + "|" + di); }}
        onContextMenu={function(e) { onCx(e, getSlotId(e)); }}
        onDragOver={function(e) { e.preventDefault(); }}
        onDrop={function(e) { e.preventDefault(); dropChip(getSlotId(e)); }}
        className="cell-td"
        style={{
          padding: 0, border: dark ? "1px solid " + t.cB : "1px solid rgba(0,0,0,0.12)", borderRadius: 8,
          background: iS ? t.se : (inRow && inCol) ? (dark ? "rgba(255,255,255,0.08)" : "#F8F8FA") : crossHl ? (dark ? "rgba(255,255,255,0.05)" : "#F3F3F6") : dark ? "rgba(255,255,255,0.03)" : "#fff",
          cursor: sel ? "crosshair" : "cell", verticalAlign: "top", height: 42,
          outline: iF ? "2px solid " + t.fO : iS ? "1px solid " + t.seO : "none",
          outlineOffset: -1,
          overflow: "hidden",
          transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.1s ease",
          boxShadow: (inRow && inCol && !iS) ? (dark ? "0 0 0 1px rgba(255,255,255,0.15)" : "0 0 0 1px rgba(0,0,0,0.18)") : dark ? "none" : "0 1px 2px rgba(0,0,0,0.03)",
        }}>
        {viewMode === "capacity" ? (
          <div style={{ height: 36, borderRadius: 6, background: hasContent ? (isHol ? t.sf : items.length > 1 ? "linear-gradient(90deg," + items.map(function(c) { return "rgba(" + rg(c.co) + ",0.35)"; }).join(",") + ")" : "rgba(" + rg(firstColor) + ",0.3)") : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {hasContent && !isHol && <span style={{ fontSize: 8, fontWeight: 700, color: firstColor, opacity: 0.8 }}>{items.map(function(c) { return c.cl; }).join("+")}</span>}
            {isHol && <span style={{ fontSize: 8, color: t.t4 }}>🏖</span>}
          </div>
        ) : ed ? (
          <input autoFocus value={edT} onChange={function(e) { setEdT(e.target.value); }} onBlur={commit}
            onKeyDown={function(e) { if (e.key === "Enter") commit(); if (e.key === "Escape") { setEdC(null); setEdT(""); } }}
            style={{ width: "100%", boxSizing: "border-box", background: t.aB, border: "1px solid " + t.ac + "60", borderRadius: 10, padding: "6px 8px", color: t.tx, fontSize: 10, fontFamily: "inherit", outline: "none" }} />
        ) : hasContent ? (
          <div style={{ display: "flex", flexDirection: "column", gap: items.length > 1 ? 2 : 0, padding: items.length > 1 ? 2 : 0, height: "100%" }}>
            {items.map(function(c, ci) {
              var hol = c.cl === "__h";
              var chipSel = subSel && subSel.id === baseId && subSel.ci === ci;
              var isChipEdit = chipEdit && chipEdit.id === baseId && chipEdit.ci === ci;
              var single = items.length === 1;

              if (isChipEdit) {
                return (
                  <input key={ci} autoFocus value={chipEditTxt}
                    onChange={function(e) { setChipEditTxt(e.target.value); }}
                    onBlur={chipCommit}
                    onKeyDown={function(e) {
                      if (e.key === "Enter") chipCommit();
                      if (e.key === "Escape") { setChipEdit(null); setChipEditTxt(""); }
                    }}
                    onMouseDown={function(e) { e.stopPropagation(); }}
                    style={{
                      width: "100%", height: "100%", boxSizing: "border-box",
                      background: "rgba(" + rg(c.co) + ",0.15)",
                      border: "2px solid " + c.co,
                      borderRadius: single ? 7 : 6,
                      padding: "0 10px",
                      color: t.tx, fontSize: 11,
                      fontFamily: "inherit", fontWeight: 500, outline: "none",
                    }} />
                );
              }

              return (
                <div key={ci}
                  draggable={!sel}
                  onDragStart={function(e) {
                    e.stopPropagation();
                    setDragChip({ fromId: baseId, ci: ci, data: c });
                  }}
                  onMouseDown={function(e) {
                    if (e.button !== 0) return;
                    // In HO/vacation mode, don't intercept - let td handle it
                    if (hoMode || vacMode) return;
                    if (sel) return;
                    e.stopPropagation();
                    setFoc(baseId);
                    setSubSel({ id: baseId, ci: ci });
                  }}
                  onDoubleClick={function(e) {
                    e.stopPropagation();
                    setChipEdit({ id: baseId, ci: ci });
                    setChipEditTxt(c.tk);
                    setSubSel(null);
                  }}
                  style={{
                    padding: single ? "0 10px" : "3px 7px",
                    borderRadius: single ? 7 : 6,
                    fontSize: single ? 11 : 9,
                    fontWeight: 600, letterSpacing: "-0.01em",
                    lineHeight: single ? "42px" : "1.4",
                    height: single ? "100%" : "auto",
                    flex: single ? 1 : "none",
                    background: hol ? t.sf : ho ? "rgba(" + rg(c.co) + ",0.12)" : "rgba(" + rg(c.co) + "," + t.ch + ")",
                    color: hol ? t.t4 : ho ? c.co + "90" : c.co,
                    border: chipSel
                      ? "2px solid " + c.co
                      : ho ? "1px dashed rgba(" + rg(c.co) + ",0.3)" : "1px solid rgba(" + rg(c.co) + "," + t.chB + ")",
                    boxShadow: chipSel
                      ? "0 0 0 2px rgba(" + rg(c.co) + ",0.15)"
                      : "none",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    display: "flex", alignItems: "center",
                    cursor: hoMode ? "pointer" : sel ? "crosshair" : "grab",
                    opacity: cliFilter && c.cl !== cliFilter ? 0.15 : 1,
                  }}>
                  {ho && <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginRight: 3, opacity: 0.5 }}><path d="M2 8l6-5.5L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9v4.5a.5.5 0 00.5.5h2.5V11h2v3h2.5a.5.5 0 00.5-.5V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {c.tk}
                  {ci === 0 && g.sp > 1 && <span style={{ marginLeft: 6, fontSize: 8, opacity: 0.35, fontWeight: 400 }}>({SL[g.s].split("–")[0]}–{SL[g.s + g.sp - 1].split("–")[1]})</span>}
                </div>
              );
            })}
          </div>
        ) : <div style={{ minHeight: 30 }} />}
      </td>
    );
  }

  // Render day cells for one employee
  function renderDayCells(emp) {
    var result = [];
    for (var di = 0; di < 5; di++) {
      var groups = merged(emp.n, di);
      for (var gi = 0; gi < groups.length; gi++) {
        result.push(renderCell(emp, di, groups[gi], gi));
        if (groups[gi].s + groups[gi].sp < 3) {
          result.push(<td key={di + "-sep-" + gi} style={{ width: 1, padding: 0, background: t.slS, borderRadius: 2 }} />);
        }
      }
      if (di < 4) result.push(<td key={"dg" + di} style={{ width: 6, padding: 0, background: "transparent", borderRadius: 0 }} />);
    }
    return result;
  }

  // Header columns
  function headerCols() {
    var r = [];
    for (var di = 0; di < 5; di++) {
      r.push(<col key={"ca" + di} />); r.push(<col key={"s1" + di} style={{ width: 1 }} />);
      r.push(<col key={"cb" + di} />); r.push(<col key={"s2" + di} style={{ width: 1 }} />);
      r.push(<col key={"cc" + di} />);
      if (di < 4) r.push(<col key={"cg" + di} style={{ width: 6 }} />);
    }
    return r;
  }

  function headerDays() {
    var r = [];
    for (var di = 0; di < 5; di++) {
      r.push(<th key={"hd" + di} colSpan={5} style={{ padding: "8px 4px", textAlign: "center", fontSize: 12, fontWeight: 700, background: isN(di) ? t.tH : dark ? t.bg : "#F4F4F7", color: isN(di) ? t.aT : t.t2, borderBottom: isN(di) ? "2px solid " + t.tBd : "1px solid " + t.cB, borderRadius: 8 }}>{DY[di]} <span style={{ fontWeight: 400, opacity: 0.5 }}>{fD(addD(wk, di))}</span></th>);
      if (di < 4) r.push(<th key={"hdg" + di} style={{ padding: 0, width: 10, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)", borderRadius: 4 }} />);
    }
    return r;
  }

  function headerSlots() {
    var r = [];
    for (var di = 0; di < 5; di++) {
      for (var si = 0; si < 3; si++) {
        r.push(<th key={"hs" + di + si} style={{ padding: "4px 2px", textAlign: "center", fontSize: 9, fontWeight: 500, color: t.t4, background: isN(di) ? t.tB : "transparent", borderBottom: "1px solid " + t.cB, borderRadius: 4 }}>{SL[si]}</th>);
        if (si < 2) r.push(<th key={"hss" + di + si} style={{ width: 1, padding: 0, background: t.slS, borderRadius: 2 }} />);
      }
      if (di < 4) r.push(<th key={"hsg" + di} style={{ width: 10, padding: 0, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)", borderRadius: 4 }} />);
    }
    return r;
  }

  // Employee rows
  function empRows() {
    var rows = [];
    flt.forEach(function(emp, idx) {
      var l = ld(emp.n);
      var ri = RO[emp.r] || { c: "#64748B", e: "?" };
      var prev = idx > 0 ? flt[idx - 1].r : null;
      var wr = wrns(emp.n);
      var pct = Math.min(l / 15, 1);

      if (emp.r !== prev) {
        rows.push(
          <tr key={"div-" + emp.n}>
            <td colSpan={30} style={{ padding: "10px 12px 5px", fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", color: ri.c, borderTop: idx > 0 ? "1px solid " + t.cB : "none" }}>
              <span style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(" + rg(ri.c) + ",0.1)", borderLeft: "3px solid " + ri.c }}>{emp.r}</span>
            </td>
          </tr>
        );
      }

      rows.push(
        <tr key={emp.n} className="er">
          <td onContextMenu={function(e) { e.preventDefault(); setRoleMenu({ x: e.clientX, y: e.clientY, emp: emp.n, cur: emp.r }); }}
            onMouseEnter={function() { setHoverCell(emp.n + "|-1"); }}
            style={{ padding: "0 12px", position: "sticky", left: 0, zIndex: 10, background: (hoverCell && hoverCell.split("|")[0] === emp.n) ? (dark ? "rgba(255,255,255,0.06)" : "#E8E8ED") : dark ? "rgba(255,255,255,0.02)" : "#F4F4F7", borderLeft: "3px solid " + ri.c, cursor: "context-menu", borderRadius: 8, height: 42, verticalAlign: "middle", border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.n}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: l === 0 ? t.t4 : l >= 13 ? t.dn : l >= 9 ? t.wn : t.t3, flexShrink: 0 }}>{l}</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: t.sf, marginTop: 2 }}>
              <div style={{ height: "100%", borderRadius: 2, width: (pct * 100) + "%", background: l >= 13 ? t.dn : l >= 9 ? t.wn : t.ac, transition: "width 0.3s ease", opacity: l === 0 ? 0 : 0.7 }} />
            </div>
          </td>
          {renderDayCells(emp)}
        </tr>
      );
    });
    return rows;
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif", background: t.bg, color: t.tx, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", WebkitFontSmoothing: "antialiased" }}>



      {/* HEADER */}
      <div style={{ padding: "0 12px", height: 48, flexShrink: 0, background: t.gl, backdropFilter: "blur(40px) saturate(1.5)", borderBottom: "1px solid " + t.gB, display: "flex", alignItems: "center", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.tx, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: t.bg }}>P</div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.02em", color: t.tx }}>Plánovačka</span>
        </div>

        <div style={{ display: "flex", gap: 2, alignItems: "center", marginLeft: "auto" }}>
          <button onClick={function() { setViewMode(viewMode === "normal" ? "capacity" : "normal"); }} style={B({ padding: "5px 8px", background: viewMode === "capacity" ? t.aB : undefined, color: viewMode === "capacity" ? t.aT : t.t3 })} title={viewMode === "capacity" ? "Grid pohled" : "Kapacitni pohled"}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
          <button onClick={function() { setDark(!dark); }} style={B({ padding: "5px 8px" })} title={dark ? "Svetly rezim" : "Tmavy rezim"}>
            {dark ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 9.6A6 6 0 116.4 2 4.5 4.5 0 0014 9.6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>
          <button onClick={function() { setBulk(true); }} style={B({ padding: "5px 8px" })} title="Skupinove prirazeni">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M13 9c1.66 1 2.5 2.5 2.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </button>
          <button onClick={function() { setShowSend(true); }} style={B({ padding: "5px 8px" })} title="Export a rozeslani">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={xCSV} style={B({ padding: "5px 8px" })} title="Stahnout CSV">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={syncGCal} disabled={syncing} style={B({ padding: "5px 10px", display: "flex", alignItems: "center", gap: 4, background: gcalStatus && gcalStatus.isAuthenticated ? "rgba(34,197,94,0.1)" : t.sf, color: gcalStatus && gcalStatus.isAuthenticated ? "#22C55E" : t.t2 })} title="Sync do Google Calendar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 6h6M5 8h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{syncing ? "..." : "GCal"}</span>
          </button>
          {saveStatus && <span style={{ fontSize: 9, color: saveStatus === "saved" ? "#22C55E" : t.t3, fontWeight: 500 }}>{saveStatus === "saving" ? "Ukládám..." : "Uloženo"}</span>}
        </div>
      </div>

      {/* CLIENT BAR - Row 1: Clients */}
      <div style={{ padding: "6px 12px", flexShrink: 0, background: t.gl, backdropFilter: "blur(40px)", display: "flex", gap: 5, flexWrap: "nowrap", alignItems: "center", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {cliFilter && <button onClick={function() { setCliFilter(null); }} style={B({ fontSize: 10, padding: "4px 10px", color: t.dn, border: "1px solid " + t.dn + "40" })}>Clear filter</button>}
        {CL.map(function(c) {
          var s = sel && sel.n === c.n;
          var f = cliFilter === c.n;
          return <button key={c.n}
            onClick={function() { setSel(s ? null : c); setHoMode(false); setVacMode(false); }}
            onDoubleClick={function(e) { e.stopPropagation(); setCliFilter(f ? null : c.n); }}
            style={{ padding: "5px 14px 5px 5px", borderRadius: 50, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, flexShrink: 0, whiteSpace: "nowrap", border: s ? "2px solid " + c.c : "2px solid " + (f ? c.c + "60" : "transparent"), background: s ? "rgba(" + rg(c.c) + ",0.22)" : f ? "rgba(" + rg(c.c) + ",0.12)" : "rgba(" + rg(c.c) + ",0.08)", color: s ? c.c : t.tx, boxShadow: s ? "0 0 0 3px rgba(" + rg(c.c) + ",0.15), 0 2px 8px rgba(" + rg(c.c) + ",0.1)" : "none", opacity: cliFilter && !f && !s ? 0.3 : 1 }}>
            <span style={{ width: 28, height: 28, borderRadius: 50, background: s ? c.c : "rgba(" + rg(c.c) + ",0.25)", color: s ? (dark ? "#111" : "#fff") : c.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0, letterSpacing: "0.02em", transition: "all 0.15s" }}>{c.i || c.n.slice(0, 2)}</span>
            {c.n}
          </button>;
        })}
      </div>
      {/* CONTROLS BAR - Row 2: Search, filters, HO, Dov, Undo */}
      <div style={{ padding: "4px 12px", flexShrink: 0, background: t.gl, backdropFilter: "blur(40px)", borderBottom: "1px solid " + t.gB, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <input value={srch} onChange={function(e) { setSrch(e.target.value); }} placeholder="Hledat..." style={{ background: t.sf, border: "1px solid " + t.sB, borderRadius: 8, color: t.tx, fontSize: 11, fontFamily: "inherit", outline: "none", width: 120, padding: "5px 10px", flexShrink: 0 }} />
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          {Object.entries(RO).map(function(entry) {
            var r = entry[0], info = entry[1];
            var on = fR === r;
            return <button key={r} onClick={function() { setFR(on ? null : r); }} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 9, fontWeight: 500, fontFamily: "inherit", cursor: "pointer", border: on ? "1px solid " + info.c : "1px solid transparent", background: on ? "rgba(" + rg(info.c) + ",0.12)" : "transparent", color: on ? info.c : t.t4 }}>{info.e}</button>;
          })}
        </div>
        <div style={{ height: 16, width: 1, background: t.sB, flexShrink: 0 }} />
        <button onClick={function() { setHoMode(!hoMode); if (!hoMode) { setSel(null); setVacMode(false); } }} style={{ padding: "4px 8px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, background: hoMode ? t.aB : "transparent", color: hoMode ? t.aT : t.t3, border: hoMode ? "1px solid " + t.ac + "40" : "1px solid transparent", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500, transition: "all 0.2s" }} title="Homeoffice rezim">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l6-6 6 6M3 7v6a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 10, fontWeight: 500 }}>HO</span>
        </button>
        <button onClick={function() { setVacMode(!vacMode); if (!vacMode) { setSel(null); setHoMode(false); } }} style={{ padding: "4px 8px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, background: vacMode ? "rgba(" + rg(t.wn) + ",0.15)" : "transparent", color: vacMode ? t.wn : t.t3, border: vacMode ? "1px solid " + t.wn + "40" : "1px solid transparent", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500, transition: "all 0.2s" }} title="Dovolenka rezim">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M5 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 10, fontWeight: 500 }}>Dov</span>
        </button>
        <button onClick={pop} style={{ padding: "4px 8px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, background: "transparent", color: t.t3, border: "1px solid transparent", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500, transition: "all 0.2s" }} title="Zpet (Ctrl+Z)">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 6h7a3 3 0 110 6H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 3L3 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>



      {/* TABLE HEADER - fixed */}
      <div style={{ padding: "0 16px", flexShrink: 0, borderBottom: "1px solid " + t.gB }}>
        <table style={{ borderCollapse: "separate", borderSpacing: "3px 3px", width: "100%", minWidth: 900, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 140 }} />
            {headerCols()}
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2} style={{ background: t.bg, border: "none", padding: "4px 6px", verticalAlign: "middle" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <button onClick={function() { setWk(addD(wk, -7)); }} style={B({ padding: "3px 6px", fontSize: 11 })}>‹</button>
                  <div style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.tx, whiteSpace: "nowrap" }}>{fD(wk)} – {fD(addD(wk, 4))}</div>
                    <div style={{ fontSize: 9, color: t.t3, fontWeight: 500 }}>{wk.getFullYear()}</div>
                  </div>
                  <button onClick={function() { setWk(addD(wk, 7)); }} style={B({ padding: "3px 6px", fontSize: 11 })}>›</button>
                </div>
                <button onClick={function() { setWk(getMonday(new Date())); }} style={B({ padding: "2px 0", fontSize: 9, fontWeight: 500, background: thisW ? t.aB : "transparent", color: thisW ? t.aT : t.t4, width: "100%", marginTop: 2, border: "none" })}>Dnes</button>
              </th>
              {headerDays()}
            </tr>
            <tr>
              {headerSlots()}
            </tr>
          </thead>
        </table>
      </div>

      {/* TABLE BODY - scrollable */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 16px 60px" }}>
        <table onMouseLeave={function() { setHoverCell(null); }} style={{ borderCollapse: "separate", borderSpacing: "3px 3px", width: "100%", minWidth: 900, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 140 }} />
            {headerCols()}
          </colgroup>
          <tbody>
            {empRows()}
          </tbody>
        </table>
      </div>

      {/* BULK MODAL */}
      {bulk && <BulkModal emps={emps} onApply={bApply} onClose={function() { setBulk(false); }} t={t} />}

      {/* SEND MODAL */}
      {showSend && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", background: t.mO, backdropFilter: "blur(12px)" }} onClick={function() { setShowSend(false); }}>
          <div onClick={function(e) { e.stopPropagation(); }} style={{ background: t.mB, border: "1px solid " + t.gB, borderRadius: 20, padding: 28, width: 520, maxHeight: "85vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>📧 Rozeslat plány – {fD(wk)} – {fD(addD(wk, 4))}</span>
              <button onClick={function() { setShowSend(false); }} style={{ background: t.sf, border: "1px solid " + t.sB, color: t.t2, cursor: "pointer", padding: "2px 10px", borderRadius: 10, fontSize: 16, fontFamily: "inherit" }}>✕</button>
            </div>
            <div style={{ fontSize: 11, color: t.t3, marginBottom: 12 }}>Vyplň emaily zaměstnanců. Klikni na 📧 pro odeslání emailu s plánem, nebo 📅 pro stažení .ics kalendáře.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {emps.map(function(e) {
                var ri = RO[e.r] || { c: "#64748B", e: "?" };
                var l = ld(e.n);
                var hasEmail = emails[e.n] && emails[e.n].includes("@");
                return (
                  <div key={e.n} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 10, background: t.sf, border: "1px solid " + t.sB }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: ri.c, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, width: 90, flexShrink: 0 }}>{e.n}</span>
                    <span style={{ fontSize: 9, color: t.t3, width: 30, flexShrink: 0 }}>{l}/15</span>
                    <input
                      value={emails[e.n] || ""}
                      onChange={function(ev) { var v = ev.target.value; setEmails(function(p) { var n = Object.assign({}, p); n[e.n] = v; return n; }); }}
                      placeholder="email@firma.cz"
                      style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid " + t.sB, color: t.tx, fontSize: 11, fontFamily: "inherit", outline: "none", padding: "4px 0" }}
                    />
                    <button
                      onClick={function() { downloadICS(e.n); }}
                      title="Stáhnout .ics kalendář"
                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, padding: "2px 4px", opacity: l > 0 ? 1 : 0.3 }}
                    >📅</button>
                    <button
                      onClick={function() { sendEmail(e.n); }}
                      title="Odeslat email s plánem"
                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, padding: "2px 4px", opacity: hasEmail ? 1 : 0.3 }}
                      disabled={!hasEmail}
                    >📧</button>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <span style={{ fontSize: 11, color: t.t3 }}>
                {Object.values(emails).filter(function(e) { return e && e.includes("@"); }).length} / {emps.length} emailů vyplněno
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={function() {
                    emps.forEach(function(e) { if (ld(e.n) > 0) downloadICS(e.n); });
                  }}
                  style={{ background: t.sf, border: "1px solid " + t.sB, color: t.t2, cursor: "pointer", padding: "6px 14px", borderRadius: 10, fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}
                >📅 Stáhnout všechny .ics</button>
                <button
                  onClick={function() {
                    var count = 0;
                    emps.forEach(function(e) { if (emails[e.n] && emails[e.n].includes("@")) { sendEmail(e.n); count++; } });
                    if (count === 0) alert("Žádné emaily vyplněné!");
                  }}
                  style={{ background: t.aB, border: "1px solid " + t.ac + "40", color: t.aT, cursor: "pointer", padding: "6px 14px", borderRadius: 10, fontSize: 12, fontFamily: "inherit", fontWeight: 700 }}
                >📧 Rozeslat všem</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT MENU */}
      {ctx && (function() {
        var fr = freq(ctx.emp);
        var parts = ctx.id.split("|");
        var eN = parts[1];
        var dI = parseInt(parts[2]);
        var tgt = mSel.size > 1 ? Array.from(mSel) : [ctx.id];
        var curItems = cellArr(ctx.id);
        function ap(v) { push(); tgt.forEach(function(id) { sC(id, [v]); }); setCtx(null); }
        function addTo(v) {
          push();
          tgt.forEach(function(id) {
            var arr = cellArr(id);
            var has = arr.some(function(x) { return x.cl === v.cl; });
            if (!has) sC(id, arr.concat([v]));
          });
          setCtx(null);
        }
        function removeFrom(clName) {
          push();
          tgt.forEach(function(id) {
            var arr = cellArr(id);
            var filtered = arr.filter(function(x) { return x.cl !== clName; });
            sC(id, filtered.length ? filtered : null);
          });
          setCtx(null);
        }

        return (
          <div style={{ position: "fixed", left: Math.min(ctx.x, window.innerWidth - 250), top: ctx.y > window.innerHeight * 0.6 ? "auto" : ctx.y, bottom: ctx.y > window.innerHeight * 0.6 ? (window.innerHeight - ctx.y) : "auto", zIndex: 1000, background: t.gS, backdropFilter: "blur(40px) saturate(1.8)", border: "1px solid " + t.gB, borderRadius: 16, padding: 6, minWidth: 220, maxHeight: "60vh", overflowY: "auto", boxShadow: "0 16px 56px rgba(0,0,0,0.25)" }} onClick={function(e) { e.stopPropagation(); }}>

            {/* Current items — click to remove */}
            {curItems.length > 0 && (
              <div>
                <div style={{ padding: "6px 12px 3px", fontSize: 9, fontWeight: 700, color: t.t3, letterSpacing: "0.06em" }}>V BUŇCE (klik = odebrat)</div>
                {curItems.map(function(item, i) {
                  return <div key={i} onClick={function() { removeFrom(item.cl); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 8, color: item.co }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.co, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.tk}</span>
                    <span style={{ fontSize: 10, color: t.dn }}>✕</span>
                  </div>;
                })}
                <div style={{ height: 1, background: t.sB, margin: "4px 8px" }} />
              </div>
            )}

            {/* Frequent tasks */}
            {fr.length > 0 && (
              <div>
                <div style={{ padding: "6px 12px 3px", fontSize: 9, fontWeight: 700, color: t.t3, letterSpacing: "0.06em" }}>ČASTÉ – {ctx.emp}</div>
                {fr.map(function(f, i) {
                  return <div key={i} onClick={function() { addTo({ cl: f.cl, co: f.co, tk: f.tk }); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 8, color: t.t2 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: f.co, flexShrink: 0 }} /><span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.tk}</span></div>;
                })}
                <div style={{ height: 1, background: t.sB, margin: "4px 8px" }} />
              </div>
            )}

            {/* All clients — click to add */}
            <div style={{ padding: "6px 12px 3px", fontSize: 9, fontWeight: 700, color: t.t3, letterSpacing: "0.06em" }}>PŘIDAT KLIENTA</div>
            {CL.map(function(c) {
              var inCell = curItems.some(function(x) { return x.cl === c.n; });
              return <div key={c.n} onClick={function() { if (!inCell) addTo({ cl: c.n, co: c.c, tk: c.n }); }} className="ci" style={{ padding: "7px 12px", cursor: inCell ? "default" : "pointer", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 8, color: inCell ? t.t4 : t.t2, opacity: inCell ? 0.4 : 1 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: c.c, flexShrink: 0 }} />{c.n}{inCell && <span style={{ marginLeft: "auto", fontSize: 9 }}>✓</span>}</div>;
            })}
            <div style={{ height: 1, background: t.sB, margin: "4px 8px" }} />

            {/* Actions */}
            <div style={{ padding: "6px 12px 3px", fontSize: 9, fontWeight: 700, color: t.t3, letterSpacing: "0.06em" }}>AKCE</div>
            <div onClick={function() { mkHSlot(ctx.id); setCtx(null); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, color: t.t3 }}>Dovolenka (tento slot)</div>
            <div onClick={function() { mkH(eN, dI); setCtx(null); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, color: t.t3 }}>Dovolenka (celý den)</div>
            <div onClick={function() { toggleHODay(eN, dI); setCtx(null); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, color: isCellHO(ctx.id) ? t.aT : t.t3 }}>{isCellHO(ctx.id) ? "✓ Homeoffice (den)" : "Homeoffice (den)"}</div>
            <div style={{ height: 1, background: t.sB, margin: "4px 8px" }} />
            <div onClick={function() { onDb(ctx.id); setCtx(null); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, color: t.t3 }}>Upravit text</div>
            <div onClick={function() { push(); tgt.forEach(function(id) { sC(id, null); }); setCtx(null); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, color: t.dn }}>Vymazat vše{tgt.length > 1 ? " (" + tgt.length + ")" : ""}</div>
          </div>
        );
      })()}

      {/* ROLE PICKER MENU */}
      {roleMenu && (
        <div style={{ position: "fixed", left: Math.min(roleMenu.x, window.innerWidth - 220), top: Math.min(roleMenu.y, window.innerHeight - 300), zIndex: 1000, background: t.gS, backdropFilter: "blur(40px) saturate(1.8)", border: "1px solid " + t.gB, borderRadius: 16, padding: 6, minWidth: 200, boxShadow: "0 16px 56px rgba(0,0,0,0.25)" }} onClick={function(e) { e.stopPropagation(); }}>
          <div style={{ padding: "6px 12px 3px", fontSize: 9, fontWeight: 700, color: t.t3, letterSpacing: "0.06em" }}>TÝM – {roleMenu.emp}</div>
          {Object.entries(RO).map(function(entry) {
            var role = entry[0], info = entry[1];
            var isCur = roleMenu.cur === role;
            return (
              <div key={role} onClick={function() { changeRole(roleMenu.emp, role); }} className="ci" style={{ padding: "7px 12px", cursor: "pointer", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 8, color: isCur ? info.c : t.t2, background: isCur ? "rgba(" + rg(info.c) + ",0.1)" : "transparent", fontWeight: isCur ? 700 : 400 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: info.c, flexShrink: 0 }} />
                {info.e} {role}
                {isCur && <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.5 }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING BAR */}
      {hoMode && !sel && (
        <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: t.gl, backdropFilter: "blur(40px)", borderRadius: 10, padding: "8px 20px", border: "1px solid " + t.ac, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8l6-5.5L14 8" stroke={t.aT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9v4.5a.5.5 0 00.5.5h2.5V11h2v3h2.5a.5.5 0 00.5-.5V9" stroke={t.aT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.aT }}>Homeoffice</span>
          <span style={{ fontSize: 10, color: t.t4 }}>klikej na bunky</span>
          <button onClick={function() { setHoMode(false); }} style={B({ padding: "2px 8px", fontSize: 10 })}>Done</button>
        </div>
      )}
      {vacMode && !sel && (
        <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: t.gl, backdropFilter: "blur(40px)", borderRadius: 10, padding: "8px 20px", border: "1px solid " + t.wn, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.wn }}>Dovolenka</span>
          <span style={{ fontSize: 10, color: t.t4 }}>klikej na bunky</span>
          <button onClick={function() { setVacMode(false); }} style={B({ padding: "2px 8px", fontSize: 10 })}>Done</button>
        </div>
      )}
      {sel && (
        <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: t.gl, backdropFilter: "blur(40px)", borderRadius: 10, padding: "8px 20px", border: "1px solid " + t.gB, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: sel.c }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: t.tx }}>{sel.n}</span>
          <span style={{ fontSize: 10, color: t.t4 }}>click = add | dblclick = edit | backspace = delete | right = menu</span>
          {mSel.size > 1 && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: t.sf, color: t.t2, border: "1px solid " + t.sB }}>{mSel.size} sel</span>}
          <button onClick={function() { setSel(null); }} style={B({ padding: "2px 8px", fontSize: 10 })}>Done</button>
        </div>
      )}

      <style>{
        "* { box-sizing: border-box; }" +
        "::-webkit-scrollbar { width: 6px; height: 6px; }" +
        "::-webkit-scrollbar-track { background: transparent; }" +
        "::-webkit-scrollbar-thumb { background: " + t.sc + "; border-radius: 3px; }" +
        ".ea { opacity: 0; transition: opacity 0.2s; }" +
        ".er:hover .ea { opacity: 1; }" +
        ".cell-td { position: relative; }" +
        ".cell-td:hover { transform: scale(1.02); z-index: 5; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }" +
        ".ci:hover { background: " + t.sH + " !important; }" +
        "td { user-select: none; }" +
        "@media (max-width: 768px) {" +
        "  .cell-td:hover { transform: none !important; }" +
        "}"
      }</style>
    </div>
  );
}

function LoginScreen() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    var token = localStorage.getItem("planovacka_token");
    if (token) {
      fetch(API + "/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      }).then(function(r) { return r.json(); })
        .then(function(d) { if (d.ok) { setLoading(false); window.__authed = true; } else { localStorage.removeItem("planovacka_token"); setLoading(false); } })
        .catch(function() { setLoading(false); });
    } else { setLoading(false); }
  }, []);

  function submit(e) {
    e.preventDefault();
    setErr("");
    fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    }).then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.ok) { localStorage.setItem("planovacka_token", d.token); window.__authed = true; setPw(""); setErr(""); }
        else setErr("Nesprávné heslo");
      })
      .catch(function() { setErr("Chyba spojení"); });
  }

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090B", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>Načítám...</div>;
  if (window.__authed) return null;

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090B", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <form onSubmit={submit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40, width: 340, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#09090B", margin: "0 auto 16px" }}>P</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#EEEEF2", marginBottom: 4 }}>Plánovačka</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Zadej heslo pro přístup</div>
        <input
          type="password"
          value={pw}
          onChange={function(e) { setPw(e.target.value); }}
          placeholder="Heslo"
          autoFocus
          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#EEEEF2", fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 12 }}
        />
        {err && <div style={{ fontSize: 12, color: "#F87171", marginBottom: 8 }}>{err}</div>}
        <button type="submit" style={{ width: "100%", padding: "12px 0", borderRadius: 12, background: "#818CF8", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Vstoupit</button>
      </form>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(!!window.__authed);
  const [err, setErr] = useState(null);

  useEffect(function() {
    // Poll for auth state change from LoginScreen
    var id = setInterval(function() { if (window.__authed && !authed) setAuthed(true); }, 100);
    return function() { clearInterval(id); };
  }, [authed]);

  useEffect(function() {
    function h(e) { setErr(e.error ? e.error.toString() + "\n" + e.error.stack : e.message); }
    window.addEventListener("error", h);
    return function() { window.removeEventListener("error", h); };
  }, []);

  if (!authed) return <LoginScreen />;

  if (err) return (
    <div style={{ padding: 40, fontFamily: "monospace", background: "#1a0000", color: "#ff6b6b", minHeight: "100vh", whiteSpace: "pre-wrap", fontSize: 13 }}>
      <h2>Error caught:</h2>
      <p>{err}</p>
    </div>
  );
  try {
    return <Inner />;
  } catch(e) {
    return (
      <div style={{ padding: 40, fontFamily: "monospace", background: "#1a0000", color: "#ff6b6b", minHeight: "100vh", whiteSpace: "pre-wrap", fontSize: 13 }}>
        <h2>Render error:</h2>
        <p>{e.toString()}</p>
        <p>{e.stack}</p>
      </div>
    );
  }
}
