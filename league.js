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

CG.leaguePage = function(L){
  var $ = function(id){ return document.getElementById(id); };
  $("brand").prepend(CG.markSvg(18));
  CG.keyline($("hmeta"), L);
  $("st-cap").textContent = "Standings through Week "+L.meta.through+" · click a column to sort";
  standings($("standings"), L);
  teamNotes($("tnotes"), L);
  forecasting($("preds"), L);
  CG.ledgerTable($("ledger-tab"), L.decisions.ledger, {L:L,
    caption:"Points left on the bench · "+CG.ledgerSpan(L)+" · click to sort"});
  $("ledger-note").textContent = L.decisions.ledgerNote;
  errorLog(L);
  $("upd").textContent = "Updated "+SITE.updated+".";
};
})();
