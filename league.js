/* Shared renderer for the three league pages. Each page supplies its own prose; every number in a table comes from data.js. */
(function(){
var el = CG.el, team = CG.team, pct = CG.pct;

function wins(rec){ var p = rec.split("-").map(Number); return {w:p[0], l:p[1], t:p[2]||0, g:p[0]+p[1]+(p[2]||0)}; }

function standings(tb, L){
  var head = el("thead"), hr = el("tr");
  [["",""],["Team",""],["Record","wins"],["Against the field","ap"],["Luck, in wins","luck"],["Points","pf"],["Lineup efficiency","eff"]].forEach(function(h){
    var th = el("th",null,h[0]); if(h[1]) th.dataset.key = h[1]; hr.appendChild(th);
  });
  head.appendChild(hr); tb.appendChild(head);
  var body = el("tbody");
  L.teams.forEach(function(t){
    var r = wins(t.rec), field = pct(t.allplay)/100, luck = (r.w + r.t/2) - field*r.g;
    var effM = t.eff && t.eff.length ? CG.mean(t.eff) : null;
    var tr = el("tr"); if(team(t.k).isControl) tr.className = "is-control";
    tr.setAttribute("data-wins", r.w + r.t/2);
    tr.setAttribute("data-ap", (field*100).toFixed(1));
    tr.setAttribute("data-luck", luck.toFixed(2));
    tr.setAttribute("data-pf", t.pf);
    tr.setAttribute("data-eff", effM==null ? -1 : effM.toFixed(1));
    var rk = el("td","rk",""); rk.style.color = "var(--ink-4)"; rk.style.width = "2em"; tr.appendChild(rk);
    var td = el("td","name"); td.appendChild(CG.nameTag(t.k)); tr.appendChild(td);
    tr.appendChild(el("td",null,t.rec));
    tr.appendChild(el("td",null,t.allplay+"  ("+(field*100).toFixed(0)+"%)"));
    var lk = el("td",null,(luck>0.05?"+":"")+(Math.abs(luck)<0.05?"0.0":luck.toFixed(1)));
    if(luck >= 0.75) lk.style.color = "var(--good)"; if(luck <= -0.75) lk.style.color = "var(--serious)";
    tr.appendChild(lk);
    tr.appendChild(el("td",null,(+t.pf).toFixed(1)));
    tr.appendChild(el("td",null,effM==null ? "—" : effM.toFixed(1)+"%"));
    body.appendChild(tr);
  });
  tb.appendChild(body);
  CG.sortable(tb,"ap");
}

function forecasting(tb, L){
  var NPICK = CG.pickCount(L);
  tb.appendChild(el("caption",null,"Forecasting · "+CG.boardSpan(L)+" · lower Brier is better · click to sort"));
  var head = el("thead"), hr = el("tr");
  [["Forecaster",""],["Correct","c"],["Accuracy","acc"],["Brier","br"],["Against always saying 50%","d"]].forEach(function(h){var th=el("th",null,h[0]);if(h[1])th.dataset.key=h[1];hr.appendChild(th);});
  head.appendChild(hr); tb.appendChild(head);
  var rows = L.teams.map(function(t){ return {k:t.k, pred:t.pred, brier:t.brier, ctrl:team(t.k).isControl, n:NPICK}; });
  (L.benchmarks||[]).forEach(function(b){ rows.push({k:null, name:b.name, note:b.note, pred:b.pred, brier:b.brier, synth:true, n:b.of||NPICK}); });
  var body = el("tbody");
  rows.forEach(function(r){
    var tr = el("tr"); if(r.ctrl) tr.className = "is-control"; if(r.synth) tr.className = "is-synth";
    tr.setAttribute("data-c",r.pred); tr.setAttribute("data-acc",(100*r.pred/r.n).toFixed(1));
    tr.setAttribute("data-br",(-r.brier).toFixed(3)); tr.setAttribute("data-d",(0.250-r.brier).toFixed(3));
    var td = el("td","name");
    if(r.k) td.appendChild(CG.nameTag(r.k)); else { td.textContent = r.name; if(r.note) td.title = r.note; }
    tr.appendChild(td);
    tr.appendChild(el("td",null,r.pred+"/"+r.n));
    tr.appendChild(el("td",null,(100*r.pred/r.n).toFixed(0)+"%"));
    tr.appendChild(el("td",null,r.brier.toFixed(3)));
    var d = 0.250 - r.brier, dd = el("td",null,(d>0?"+":"")+d.toFixed(3));
    dd.style.color = d>0 ? "var(--good)" : "var(--serious)";
    tr.appendChild(dd);
    body.appendChild(tr);
  });
  tb.appendChild(body);
  CG.sortable(tb,"br");
}

function teamNotes(box, L){
  var order = L.teams.slice().sort(function(a,b){ return pct(b.allplay)-pct(a.allplay); });
  order.forEach(function(t){
    if(!t.note) return;
    var d = el("div","tn");
    var h = el("div","tn-h"); h.appendChild(CG.nameTag(t.k)); h.appendChild(el("span","tn-r",t.rec));
    d.appendChild(h); d.appendChild(el("p",null,t.note));
    box.appendChild(d);
  });
}

function errorLog(L){
  CG.errorBars(L, "fab-bars", "void-bars");
  var ew = document.getElementById("errs");
  L.errors.forEach(function(e){
    var d = el("div","err"), hd = el("div","hd");
    hd.appendChild(CG.sigil(e.who,15));
    hd.appendChild(el("b",null,team(e.who).name));
    hd.appendChild(el("span","kind"+(e.good?" goodk":""),e.kind));
    hd.appendChild(el("span","wk",e.wk));
    d.appendChild(hd);
    d.appendChild(el("q",null,e.q));
    d.appendChild(el("p","res",e.res));
    ew.appendChild(d);
  });
  CG.collapseAfter(ew, 0, "Open the full log · "+L.errors.length+" entries");
}


/* ---------- this week: the open board, game by game ---------- */
function thisWeek(box, L){
  var b = (L.boards||[]).filter(function(x){ return !x.scored; }).pop();
  var sec = document.getElementById("week");
  if(!b){ if(sec) sec.style.display = "none"; return; }
  document.getElementById("wk-h").textContent = b.wk + ": what the forecasters expect";
  var rec = {}; L.teams.forEach(function(t){ rec[t.k] = t.rec; });
  var short = function(k){ return k==="espn" ? "the spreadsheet" : CG.teamName(k,L); };
  b.games.forEach(function(g){
    var ks = Object.keys(g.picks), crowd = ks.filter(function(k){ return k!=="espn"; });
    var nA = crowd.filter(function(k){ return g.picks[k][0]===g.a; }).length, nB = crowd.length-nA;
    var pA = crowd.reduce(function(s,k){ var p=g.picks[k], c=(p[1]==null?50:p[1])/100; return s+(p[0]===g.a?c:1-c); },0)/crowd.length;
    var d = el("div","wkg");
    var top = el("div","wkg-t");
    [g.a,g.b].forEach(function(k,i){
      var s = el("div","wkg-s"+(i?" r":"")); s.appendChild(CG.nameTag(k,L)); s.appendChild(el("span","tn-r",rec[k]||""));
      top.appendChild(s);
    });
    d.appendChild(top);
    var bar = el("div","wkg-bar"), fa = el("i"), fb = el("i");
    fa.style.flex = String(nA||0.0001); fb.style.flex = String(nB||0.0001);
    if(nA>=nB) fa.className = "lead"; if(nB>=nA) fb.className = "lead";
    bar.appendChild(fa); bar.appendChild(fb);
    var sp = g.picks.espn;
    if(sp){ var pos = sp[0]===g.a ? sp[1] : 100-sp[1]; var tk = el("b","wkg-tk"); tk.style.left = (100-pos)+"%"; tk.title = "The spreadsheet: "+short(sp[0])+" "+sp[1]+"%"; bar.appendChild(tk); }
    d.appendChild(bar);
    var lbl = el("div","wkg-n"); lbl.appendChild(el("span",null,nA+" of "+crowd.length)); lbl.appendChild(el("span",null,nB+" of "+crowd.length)); d.appendChild(lbl);
    var bits = [];
    var fav = pA>=0.5 ? g.a : g.b, fp = Math.round(100*Math.max(pA,1-pA));
    bits.push(nA===0||nB===0 ? "Unanimous for "+short(fav)+", averaging "+fp+"%." : "Split "+Math.max(nA,nB)+"–"+Math.min(nA,nB)+"; pooled, "+short(fav)+" "+fp+"%.");
    var room = nA>nB ? g.a : nB>nA ? g.b : null, inGame = g.a==="espn"||g.b==="espn";
    if(sp) bits.push((inGame ? (sp[0]==="espn" ? "The spreadsheet backs itself at "+sp[1]+"%" : "The spreadsheet picks against itself at "+sp[1]+"%")
      : "The spreadsheet: "+short(sp[0])+" "+sp[1]+"%") + (room && room!==sp[0] ? ", against the room." : "."));
    [g.a,g.b].forEach(function(k){ var p = g.picks[k]; if(k!=="espn" && p && p[0]!==k) bits.push(short(k)+" picks against itself at "+p[1]+"%."); });
    d.appendChild(el("p","wkg-p",bits.join(" ")));
    box.appendChild(d);
  });
  var pl = document.getElementById("wk-note"); if(pl) pl.textContent = b.note || "";
  var all = document.getElementById("wk-all");
  if(all){
    var cols = L.teams.map(function(t){ return t.k; });
    if(Object.keys(b.games[0].picks).indexOf("instinct")>=0 && cols.indexOf("instinct")<0) cols.push("instinct");
    var det = el("details","wk-det"), sm = el("summary",null,"Every card, every week");
    det.appendChild(sm); var host = el("div"); det.appendChild(host); all.appendChild(det);
    var built = false; det.addEventListener("toggle",function(){ if(det.open && !built){ CG.boardsExplorer(host, L, cols); built = true; } });
  }
}

/* ---------- week by week: the narrative log ---------- */
function weekLog(box, L){
  var sec = document.getElementById("log");
  if(!L.log || !L.log.length){ if(sec) sec.style.display = "none"; return; }
  L.log.forEach(function(e){
    var d = el("div","lg");
    d.appendChild(el("span","lg-w",e.wk));
    var t = el("div"); t.appendChild(el("h3",null,e.h)); t.appendChild(el("p",null,e.p));
    d.appendChild(t); box.appendChild(d);
  });
  CG.collapseAfter(box, 4, "Read every week · "+L.log.length+" entries");
}

CG.leaguePage = function(L){
  var $ = function(id){ return document.getElementById(id); };
  $("brand").prepend(CG.markSvg(18));
  CG.keyline($("hmeta"), L);
  $("st-cap").textContent = "Standings through Week "+L.meta.through+" · click a column to sort";
  standings($("standings"), L);
  teamNotes($("tnotes"), L);
  if($("wk-games")) thisWeek($("wk-games"), L);
  if($("log-list")) weekLog($("log-list"), L);
  forecasting($("preds"), L);
  CG.ledgerTable($("ledger-tab"), L.decisions.ledger, {L:L,
    caption:"Points left on the bench · "+CG.ledgerSpan(L)+" · click to sort"});
  $("ledger-note").textContent = L.decisions.ledgerNote;
  errorLog(L);
  $("upd").textContent = "Updated "+SITE.updated+".";
};
})();
