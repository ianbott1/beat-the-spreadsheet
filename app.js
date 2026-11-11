/* ============================================================================
   THE CONTROL GROUP — rendering
   Chart rules held to throughout:
     · ink is the default mark; accent picks out the one thing a figure is
       about; ochre is always and only the control group
     · no filled tracks, no rounded data ends, no area fills
     · marks are thin, grids are hairlines, values are direct-labelled
     · every axis label names a value the chart actually reaches
   ========================================================================== */

(function(){
"use strict";

var el = function(t,c,x){var n=document.createElement(t); if(c)n.className=c; if(x!=null)n.textContent=x; return n;};
var team = function(k){return TEAMS[k]||{name:k,sigil:["#####","#...#","#...#","#...#","#####"]};};
var pct = function(wl){var p=String(wl).split("-").map(Number); var t=p[0]+p[1]; return t?100*p[0]/t:0;};

/* ---------- tooltip ---------- */
var tip = el("div"); tip.id = "tip";
function mountTip(){ if(!tip.parentNode) document.body.appendChild(tip); }
document.addEventListener("DOMContentLoaded",mountTip);
function showTip(e,html){
  mountTip();
  tip.innerHTML = html; tip.classList.add("on");
  var r = tip.getBoundingClientRect();
  var x = e.clientX + 14, y = e.clientY - r.height - 12;
  if(x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
  if(y < 8) y = e.clientY + 18;
  tip.style.left = x + "px"; tip.style.top = y + "px";
}
function hideTip(){tip.classList.remove("on");}
function bindTip(node,html){
  if(!html) return node;
  node.addEventListener("mouseenter",function(e){showTip(e,html);});
  node.addEventListener("mousemove",function(e){showTip(e,html);});
  node.addEventListener("mouseleave",hideTip);
  node.setAttribute("tabindex","0");
  node.addEventListener("focus",function(){
    var b = node.getBoundingClientRect();
    showTip({clientX:b.left+Math.min(b.width/2,160),clientY:b.top},html);
  });
  node.addEventListener("blur",hideTip);
  return node;
}

/* ---------- emblem (identity only: tables and rosters, never inside a figure) ---------- */
function sigil(k,size){
  size = size || 22;
  var t = team(k), ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns,"svg");
  svg.setAttribute("viewBox","0 0 24 24");
  svg.setAttribute("aria-hidden","true");
  svg.style.cssText = "flex:none;width:"+size+"px;height:"+size+"px";
  var cell = 2.6, gap = 0.75, span = 5*cell + 4*gap, o = (24-span)/2;
  for(var r=0;r<5;r++) for(var c=0;c<5;c++){
    if(t.sigil[r][c] !== "#") continue;
    var sq = document.createElementNS(ns,"rect");
    sq.setAttribute("x",(o + c*(cell+gap)).toFixed(2));
    sq.setAttribute("y",(o + r*(cell+gap)).toFixed(2));
    sq.setAttribute("width",cell); sq.setAttribute("height",cell);
    sq.setAttribute("fill", t.isControl ? "var(--control)" : "var(--ink-2)");
    svg.appendChild(sq);
  }
  return svg;
}
/* a team can be called something different in a different league */
function teamName(k,L){
  if(L && L.meta && L.meta.names && L.meta.names[k]) return L.meta.names[k];
  return team(k).name;
}
function nameTag(k,L){
  var w = el("span","tm");
  w.appendChild(sigil(k,15));
  w.appendChild(el("span",null,teamName(k,L)));
  return w;
}

/* ---------- masthead ---------- */
function markSvg(size){
  /* a 3x3 block of cells with one selected: the spreadsheet's own row */
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns,"svg");
  svg.setAttribute("viewBox","0 0 24 24");
  svg.setAttribute("aria-hidden","true");
  svg.style.cssText = "flex:none;width:"+size+"px;height:"+size+"px";
  function add(t,a){ var e=document.createElementNS(ns,t); for(var k in a) e.setAttribute(k,a[k]); svg.appendChild(e); return e; }
  for(var r=0;r<3;r++) for(var c=0;c<3;c++) add("rect",{x:2+c*7,y:2+r*7,width:6,height:6,rx:1,fill:"var(--rule-2,#2C3238)"});
  add("rect",{x:1.25,y:8.25,width:21.5,height:7.5,rx:1.5,fill:"none",stroke:"var(--control)","stroke-width":1.5});
  add("rect",{x:20.5,y:14,width:3,height:3,fill:"var(--control)"});
  return svg;
}
function statusPill(meta){
  var map = {live:["live","Week "+meta.current+" open"],opening:["open","Opening week"],awaiting:["soon","Not started"]};
  var m = map[meta.status] || ["soon",meta.status];
  return el("span","pill "+m[0],m[1]);
}

/* ---------- horizontal bar chart ---------- */
/* rows: {label, v, vLabel, tone:'ink'|'acc'|'ctl', quiet, tip}
   opts: {max, ref, refLabel, ticks, tickFmt} */
function barChart(rows,opts){
  opts = opts||{};
  var max = opts.max || Math.max.apply(null,rows.map(function(r){return r.v;}));
  var box = el("div","ch");

  if(opts.ticks){
    var sc = el("div","ch-scale");
    sc.appendChild(el("div"));
    var tk = el("div","ch-ticks");
    opts.ticks.forEach(function(v){
      var s = el("span",null,opts.tickFmt?opts.tickFmt(v):String(v));
      s.style.left = (100*v/max).toFixed(2)+"%";
      if(v===0){s.style.transform="none";}
      tk.appendChild(s);
    });
    sc.appendChild(tk); sc.appendChild(el("div"));
    box.appendChild(sc);
  }

  rows.forEach(function(r){
    var row = el("div","ch-row");
    row.appendChild(el("div","lab"+(r.quiet?" q":""),r.label));
    var track = el("div","ch-track");
    track.appendChild(el("div","ch-base"));
    var fill = el("div","ch-fill"+(r.tone==="acc"?" acc":r.tone==="ctl"?" ctl":""));
    fill.style.width = (100*r.v/max).toFixed(2)+"%";
    if(r.v===0){ row.className += " zero"; fill.className = "ch-zero"; fill.style.width = ""; }
    if(r.quiet) fill.style.background = "var(--mark-soft)";
    track.appendChild(fill);
    if(opts.ref != null){
      var ref = el("div","ch-ref");
      ref.style.left = (100*opts.ref/max).toFixed(2)+"%";
      track.appendChild(ref);
    }
    row.appendChild(track);
    row.appendChild(el("div","val",r.vLabel!=null?r.vLabel:String(r.v)));
    bindTip(row,r.tip);
    box.appendChild(row);
  });
  if(opts.refLabel){
    var n = el("div","note",opts.refLabel);
    n.style.cssText += ";margin-top:10px;font-size:.8rem";
    box.appendChild(n);
  }
  return box;
}

/* ---------- dumbbell ---------- */
function tcol(k){ return "var(--t-"+k+", var(--mark))"; }

function dumbbell(rows,opts){
  opts = opts||{};
  var box = el("div","ch");
  var sc = el("div","ch-scale");
  sc.appendChild(el("div"));
  var tk = el("div","ch-ticks");
  [0,25,50,75,100].forEach(function(v){
    var s = el("span",null,v+"%");
    s.style.left = v+"%";
    if(v===0) s.style.transform="none";
    if(v===100){s.style.left="auto"; s.style.right="0"; s.style.transform="none";}
    tk.appendChild(s);
  });
  sc.appendChild(tk);
  var hd = el("div","eyebrow",opts.gapLabel||"Gap");
  hd.style.cssText += ";min-width:3.6em;text-align:right";
  sc.appendChild(hd);
  box.appendChild(sc);

  rows.forEach(function(r){
    var row = el("div","ch-row");
    row.appendChild(el("div","lab",team(r.k).name));
    var track = el("div","ch-track");
    track.appendChild(el("div","ch-base"));
    var lo = Math.min(r.a,r.b), hi = Math.max(r.a,r.b);
    var conn = el("div","ch-conn");
    conn.style.left = lo.toFixed(2)+"%"; conn.style.width = (hi-lo).toFixed(2)+"%";
    track.appendChild(conn);
    var col = tcol(r.k);
    var hollow = el("div","ch-dot");
    hollow.style.cssText += ";left:"+r.b.toFixed(2)+"%;background:var(--paper);box-shadow:inset 0 0 0 1.5px "+col;
    var solid = el("div","ch-dot");
    solid.style.cssText += ";left:"+r.a.toFixed(2)+"%;background:"+col;
    track.appendChild(hollow); track.appendChild(solid);
    row.appendChild(track);
    var gap = r.a - r.b;
    var v = el("div","val",(gap>0?"+":"")+gap.toFixed(0));
    if(Math.abs(gap) >= 12) v.style.color = gap>0 ? "var(--accent)" : "var(--serious)";
    row.appendChild(v);
    bindTip(row, r.tipText || ("<b>"+team(r.k).name+"</b><br>Against the field "+r.allplay+" ("+r.a.toFixed(0)+"%)<br>Actual record "+r.rec+" ("+r.b.toFixed(0)+"%)"));
    box.appendChild(row);
  });
  return box;
}

/* ---------- scatter ---------- */
function scatter(pts,o){
  var ns = "http://www.w3.org/2000/svg";
  var W = 760, H = 540, m = {t:26,r:30,b:50,l:58};
  var iw = W-m.l-m.r, ih = H-m.t-m.b;
  var sx = function(v){return m.l + (v-o.xd[0])/(o.xd[1]-o.xd[0])*iw;};
  var sy = function(v){return m.t + (v-o.yd[0])/(o.yd[1]-o.yd[0])*ih;};
  var svg = document.createElementNS(ns,"svg");
  svg.setAttribute("viewBox","0 0 "+W+" "+H);
  svg.setAttribute("class","plot");
  svg.setAttribute("role","img");
  svg.setAttribute("aria-label",o.alt||"scatter plot");
  function add(t,a,txt){var n=document.createElementNS(ns,t);for(var k in a)n.setAttribute(k,a[k]);if(txt!=null)n.textContent=txt;svg.appendChild(n);return n;}

  o.yticks.forEach(function(v){
    add("line",{x1:m.l,x2:W-m.r,y1:sy(v),y2:sy(v),stroke:"var(--rule)","stroke-width":1});
    add("text",{x:m.l-11,y:sy(v)+3.5,"text-anchor":"end",class:"ax"},o.yfmt?o.yfmt(v):v);
  });
  o.xticks.forEach(function(v){
    add("text",{x:sx(v),y:H-m.b+20,"text-anchor":"middle",class:"ax"},o.xfmt?o.xfmt(v):v);
  });
  add("line",{x1:m.l,x2:W-m.r,y1:H-m.b,y2:H-m.b,stroke:"var(--rule-2)","stroke-width":1});

  (o.refs||[]).forEach(function(r){
    if(r.y != null){
      add("line",{x1:m.l,x2:W-m.r,y1:sy(r.y),y2:sy(r.y),stroke:"var(--ink-4)","stroke-width":1,"stroke-dasharray":"2 4"});
      add("text",{x:W-m.r,y:sy(r.y)-8,"text-anchor":"end",class:"ax em"},r.label);
    }
    if(r.x != null){
      add("line",{x1:sx(r.x),x2:sx(r.x),y1:m.t,y2:H-m.b,stroke:"var(--ink-4)","stroke-width":1,"stroke-dasharray":"2 4"});
      add("text",{x:sx(r.x)+7,y:m.t+2,class:"ax em"},r.label);
    }
  });

  add("text",{x:m.l+iw/2,y:H-8,"text-anchor":"middle",class:"ax em"},o.xlab);
  add("text",{x:13,y:m.t+ih/2,"text-anchor":"middle",class:"ax em",transform:"rotate(-90 13 "+(m.t+ih/2)+")"},o.ylab);

  pts.forEach(function(p){
    var cx = sx(p.x), cy = sy(p.y);
    var isCtl = p.k && team(p.k).isControl;
    var col = p.synth ? "var(--ink-4)" : (p.k ? tcol(p.k) : "var(--mark)");
    if(p.synth){
      add("rect",{x:cx-4,y:cy-4,width:8,height:8,fill:"var(--paper)",stroke:col,"stroke-width":1.5});
    }else{
      add("circle",{cx:cx,cy:cy,r:5,fill:col});
    }
    var lp = p.lp||"r", tx = cx, ty = cy, anc = "start";
    if(lp==="r"){tx = cx+11; ty = cy+4;}
    if(lp==="l"){tx = cx-11; ty = cy+4; anc="end";}
    if(lp==="t"){tx = cx; ty = cy-12; anc="middle";}
    if(lp==="b"){tx = cx; ty = cy+19; anc="middle";}
    var cls = "lb" + (p.synth?" sy":"") + (isCtl?" ctl":"");
    add("text",{x:tx,y:ty,"text-anchor":anc,class:cls},p.label||team(p.k).name);
    bindTip(add("circle",{cx:cx,cy:cy,r:17,fill:"transparent"}),p.tip);
  });
  return svg;
}

/* ---------- sparkline: line only, no fill ---------- */
function spark(values,o){
  o = o||{};
  var ns = "http://www.w3.org/2000/svg";
  var W = 150, H = 40, p = 5;
  var vals = values.filter(function(v){return v!=null;});
  var lo = o.lo!=null?o.lo:Math.min.apply(null,vals), hi = o.hi!=null?o.hi:Math.max.apply(null,vals);
  if(hi===lo) hi = lo+1;
  var svg = document.createElementNS(ns,"svg");
  svg.setAttribute("viewBox","0 0 "+W+" "+H);
  svg.setAttribute("preserveAspectRatio","none");
  svg.setAttribute("aria-hidden","true");
  svg.style.cssText = "width:100%;height:40px;display:block";
  function add(t,a){var n=document.createElementNS(ns,t);for(var k in a)n.setAttribute(k,a[k]);svg.appendChild(n);return n;}
  var sx = function(i){return p + i*(W-2*p)/Math.max(1,values.length-1);};
  var sy = function(v){return H-p - (v-lo)/(hi-lo)*(H-2*p);};
  if(o.mid!=null) add("line",{x1:0,x2:W,y1:sy(o.mid),y2:sy(o.mid),stroke:"var(--rule-2)","stroke-width":1,"stroke-dasharray":"2 3"});
  var d = values.map(function(v,i){return (i?"L":"M")+sx(i).toFixed(1)+" "+sy(v).toFixed(1);}).join(" ");
  add("path",{d:d,fill:"none",stroke:o.ctl?"var(--control)":"var(--mark)","stroke-width":1.5,"stroke-linejoin":"round","stroke-linecap":"round","vector-effect":"non-scaling-stroke"});
  var last = values.length-1;
  add("circle",{cx:sx(last),cy:sy(values[last]),r:2.6,fill:o.ctl?"var(--control)":"var(--ink)"});
  return svg;
}

/* ---------- sortable table ----------
   Call after building: th elements need data-key; rows carry data-<key> values. */
function sortable(table, defaultKey){
  var ths = table.querySelectorAll("th[data-key]");
  var state = {key:defaultKey, dir:-1};
  function apply(){
    var body = table.querySelector("tbody");
    var rows = [].slice.call(body.querySelectorAll("tr"));
    rows.sort(function(a,b){
      var x = parseFloat(a.getAttribute("data-"+state.key)) || 0;
      var y = parseFloat(b.getAttribute("data-"+state.key)) || 0;
      return state.dir === -1 ? y-x : x-y;
    });
    rows.forEach(function(r,i){
      var rk = r.querySelector(".rk"); if(rk) rk.textContent = String(i+1);
      body.appendChild(r);
    });
    ths.forEach(function(h){
      h.style.color = h.dataset.key===state.key ? "var(--ink)" : "";
      h.setAttribute("aria-sort", h.dataset.key===state.key ? (state.dir===-1?"descending":"ascending") : "none");
      var m = h.querySelector(".arr");
      if(m) m.textContent = h.dataset.key===state.key ? (state.dir===-1 ? " ↓" : " ↑") : "";
    });
  }
  ths.forEach(function(h){
    h.style.cursor = "pointer";
    var m = el("span","arr"); h.appendChild(m);
    h.setAttribute("tabindex","0");
    h.title = "Sort";
    function go(){
      if(state.key === h.dataset.key) state.dir = -state.dir;
      else { state.key = h.dataset.key; state.dir = -1; }
      apply();
    }
    h.addEventListener("click",go);
    h.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});
  });
  apply();
}

/* ---------- prediction explorer ----------
   Week tabs over a grid of every card. Scored weeks mark wrong picks; the
   unscored week marks picks against the majority instead. */
function boardsExplorer(container, L, cols){
  var boards = L.boards || [];
  if(!boards.length) return;
  var nm = function(k){ return teamName(k,L).replace("Claude ",""); };

  var tabs = el("div");
  tabs.style.cssText = "display:flex;gap:2px;flex-wrap:wrap;margin-bottom:14px";
  var host = el("div");
  var note = el("p","note"); note.style.marginTop = "12px";

  var current = boards.length-1;
  function draw(){
    var b = boards[current];
    host.innerHTML = "";
    var scroll = el("div","tscroll");
    var t = el("table");
    var cap = el("caption",null,b.wk + (b.scored ? " · scored" : " · awaiting results"));
    t.appendChild(cap);
    var head = el("thead"), hr = el("tr");
    hr.appendChild(el("th",null,"Game"));
    hr.appendChild(el("th",null,"Result"));
    cols.forEach(function(k){ hr.appendChild(el("th",null,nm(k))); });
    head.appendChild(hr); t.appendChild(head);
    var body = el("tbody");
    b.games.forEach(function(g){
      var tr = el("tr");
      tr.appendChild(el("td","name",nm(g.a)+" v "+nm(g.b)));
      var res = el("td",null, g.w ? nm(g.w) : "—");
      if(g.w) res.className = "lead";
      tr.appendChild(res);
      var sides = {};
      cols.forEach(function(k){ var p=g.picks[k]; if(p) sides[p[0]]=(sides[p[0]]||0)+1; });
      var majority = Object.keys(sides).sort(function(x,y){return sides[y]-sides[x];})[0];
      cols.forEach(function(k){
        var p = g.picks[k], c = el("td");
        if(!p){ c.textContent = "—"; c.style.color = "var(--ink-4)"; tr.appendChild(c); return; }
        c.textContent = nm(p[0]) + (p[1]!=null ? " "+p[1] : "");
        if(b.scored && g.w){
          if(p[0] !== g.w){ c.className = "down"; }
        } else if(p[0] !== majority){ c.className = "up"; }
        tr.appendChild(c);
      });
      body.appendChild(tr);
    });
    t.appendChild(body);
    scroll.appendChild(t);
    host.appendChild(scroll);
    note.textContent = (b.note ? b.note + " " : "") + (b.scored
      ? "Orange marks a miss. Numbers are stated confidence."
      : "Blue marks a pick against the room. Numbers are stated confidence.");
    [].slice.call(tabs.children).forEach(function(btn,i){
      btn.setAttribute("aria-pressed", i===current ? "true" : "false");
      btn.style.cssText = baseTab + (i===current
        ? "color:var(--ink);border-bottom-color:var(--ink);"
        : "color:var(--ink-3);border-bottom-color:transparent;");
    });
  }
  var baseTab = "font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;background:none;border:0;border-bottom:2px solid transparent;padding:7px 11px;cursor:pointer;";
  boards.forEach(function(b,i){
    var btn = el("button",null,b.wk);
    btn.type = "button";
    btn.addEventListener("click",function(){ current = i; draw(); });
    tabs.appendChild(btn);
  });
  container.appendChild(tabs);
  container.appendChild(host);
  container.appendChild(note);
  draw();
}

/* ---------- roster explorer ---------- */
function rosterExplorer(container, L){
  var R = L.rosters;
  if(!R) return;
  var keys = L.teams.map(function(t){return t.k;}).filter(function(k){return R[k];});
  var nm = function(k){ return teamName(k,L).replace("Claude ",""); };
  var tabs = el("div");
  tabs.style.cssText = "display:flex;gap:2px;flex-wrap:wrap;margin-bottom:14px";
  var host = el("div");
  var baseTab = "font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;background:none;border:0;border-bottom:2px solid transparent;padding:7px 11px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;";
  var current = 0;
  function draw(){
    var k = keys[current];
    host.innerHTML = "";
    var scroll = el("div","tscroll");
    var t = el("table");
    t.appendChild(el("caption",null,teamName(k,L)+" · current roster"));
    var head = el("thead"), hr = el("tr");
    ["Slot","Player","Team","Acquired"].forEach(function(h){ hr.appendChild(el("th",null,h)); });
    head.appendChild(hr); t.appendChild(head);
    var body = el("tbody");
    R[k].forEach(function(r){
      var tr = el("tr");
      var slot = el("td",null,r[0]);
      slot.style.cssText = "font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--ink-3);text-align:left";
      if(r[0]==="Bench"||r[0]==="IR") tr.style.color = "var(--ink-3)";
      tr.appendChild(slot);
      var nmc = el("td","name",r[1]);
      if(r[2]){
        var st = el("span",null," "+r[2]);
        st.style.cssText = "font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:"
          + ((r[2]==="IR"||r[2]==="O") ? "var(--crit)" : "var(--serious)");
        nmc.appendChild(st);
      }
      tr.appendChild(nmc);
      tr.appendChild(el("td",null,r[3]));
      var acq = el("td",null,r[4]);
      if(r[4]!=="Draft") acq.className = "up";
      tr.appendChild(acq);
      body.appendChild(tr);
    });
    t.appendChild(body);
    scroll.appendChild(t);
    host.appendChild(scroll);
    if(L.draftBoard){
      var picks = L.draftBoard.filter(function(p){ return p[4]===k; });
      if(picks.length){
        var p = el("p","note");
        p.style.marginTop = "12px";
        p.textContent = "Drafted: " + picks.map(function(x){ return "R"+x[0]+" "+x[1]; }).join(" · ");
        host.appendChild(p);
      }
    }
    [].slice.call(tabs.children).forEach(function(btn,i){
      btn.setAttribute("aria-pressed", i===current ? "true" : "false");
      btn.style.cssText = baseTab + (i===current
        ? "color:var(--ink);border-bottom-color:var(--ink);"
        : "color:var(--ink-3);border-bottom-color:transparent;");
    });
  }
  keys.forEach(function(k,i){
    var btn = el("button");
    btn.type = "button";
    btn.appendChild(sigil(k,13));
    btn.appendChild(document.createTextNode(nm(k)));
    btn.addEventListener("click",function(){ current = i; draw(); });
    tabs.appendChild(btn);
  });
  container.appendChild(tabs);
  container.appendChild(host);
  draw();
}

/* ---------- cumulative race chart ---------- */
function raceChart(container, series, weekLabels, opts){
  opts = opts||{};
  var ns = "http://www.w3.org/2000/svg";
  var W = 820, H = 440, m = {t:14, r:118, b:34, l:46};
  var iw = W-m.l-m.r, ih = H-m.t-m.b;
  var all = [];
  series.forEach(function(s){ s.cum = []; var c=0; s.values.forEach(function(v){ c+=v; s.cum.push(c); all.push(c); }); });
  var hi = Math.max.apply(null,all), lo = 0;
  hi = Math.ceil(hi/100)*100;
  var sx = function(i){ return m.l + i*iw/(weekLabels.length-1); };
  var sy = function(v){ return m.t + (1 - (v-lo)/(hi-lo))*ih; };
  var svg = document.createElementNS(ns,"svg");
  svg.setAttribute("viewBox","0 0 "+W+" "+H);
  svg.setAttribute("class","plot");
  svg.setAttribute("role","img");
  svg.setAttribute("aria-label",opts.alt||"line chart");
  function add(t,a,txt){var n=document.createElementNS(ns,t);for(var k in a)n.setAttribute(k,a[k]);if(txt!=null)n.textContent=txt;svg.appendChild(n);return n;}
  for(var gy=0; gy<=hi; gy+=200){
    add("line",{x1:m.l,x2:W-m.r,y1:sy(gy),y2:sy(gy),stroke:"var(--rule)","stroke-width":1});
    add("text",{x:m.l-9,y:sy(gy)+3.5,"text-anchor":"end",class:"ax"},gy);
  }
  weekLabels.forEach(function(w,i){
    add("text",{x:sx(i),y:H-m.b+20,"text-anchor":"middle",class:"ax"},w);
  });
  add("line",{x1:m.l,x2:W-m.r,y1:sy(0),y2:sy(0),stroke:"var(--rule-2)","stroke-width":1});

  /* draw quiet lines first, emphasised last */
  var ordered = series.slice().sort(function(a,b){ return (a.tone?1:0)-(b.tone?1:0); });
  ordered.forEach(function(s){
    var col = s.k ? tcol(s.k) : "var(--mark-soft)";
    var wgt = s.tone ? 2.6 : 1.7;
    var d = s.cum.map(function(v,i){ return (i?"L":"M")+sx(i).toFixed(1)+" "+sy(v).toFixed(1); }).join(" ");
    add("path",{d:d,fill:"none",stroke:col,"stroke-width":wgt,"stroke-linejoin":"round","stroke-linecap":"round",
      opacity:s.tone?1:0.82});
    add("circle",{cx:sx(s.cum.length-1),cy:sy(s.cum[s.cum.length-1]),r:s.tone?3.6:2.6,fill:col});
    var hit = add("path",{d:d,fill:"none",stroke:"transparent","stroke-width":14});
    bindTip(hit,"<b>"+s.label+"</b><br>"+s.cum[s.cum.length-1].toFixed(1)+" points through "+weekLabels[weekLabels.length-1]);
  });
  /* end labels with collision nudging */
  var labs = series.map(function(s){
    return {y: sy(s.cum[s.cum.length-1]), text:s.label+"  "+Math.round(s.cum[s.cum.length-1]), tone:s.tone, k:s.k};
  }).sort(function(a,b){ return a.y-b.y; });
  for(var i=1;i<labs.length;i++){ if(labs[i].y - labs[i-1].y < 14) labs[i].y = labs[i-1].y + 14; }
  labs.forEach(function(lb){
    add("text",{x:W-m.r+10,y:lb.y+3.5,class:"lb",
      style:"fill:"+(lb.k?tcol(lb.k):"var(--ink-3)")+(lb.tone?"":";font-weight:400")},lb.text);
  });
  container.appendChild(svg);
}

/* ---------- inline magnitude cell ---------- */
function cellBar(v,lo,hi,txt,emph){
  var w = el("span","cellbar");
  w.appendChild(el("span",null,txt));
  var t = Math.max(0,Math.min(1,(v-lo)/(hi-lo)));
  var bar = el("i",emph?"acc":"on");
  bar.style.width = Math.max(3,Math.round(t*52))+"px";
  w.appendChild(bar);
  return w;
}

/* ---------- collapse long lists behind a toggle ---------- */
/* The three-lineup ledger, identical in every league.
   rows: [team, variance, deadStarts, deviationsNet, controllable, total]; opts.L for names,
   opts.extra = {label, key, get(k) -> number|null, fmt} for one optional trailing column. */
function ledgerTable(table, rows, opts){
  opts = opts||{};
  var nm = function(k){ return opts.L ? teamName(k,opts.L) : team(k).name; };
  if(opts.caption) table.appendChild(el("caption",null,opts.caption));
  var head = el("thead"), hr = el("tr");
  var cols = [["Team",""],["Variance","v"],["Dead starts","a"],["Deviations (net)","d"],["Controllable","c"],["Total points lost","t"]];
  if(opts.extra) cols.push([opts.extra.label, opts.extra.key]);
  cols.forEach(function(h){ var th=el("th",null,h[0]); if(h[1]) th.dataset.key=h[1]; hr.appendChild(th); });
  head.appendChild(hr); table.appendChild(head);
  var body = el("tbody");
  function f1(v){ return v ? v.toFixed(1) : "0"; }
  rows.forEach(function(r){
    var tr = el("tr"); if(team(r[0]).isControl) tr.className="is-control";
    tr.setAttribute("data-v",r[1]); tr.setAttribute("data-a",r[2]); tr.setAttribute("data-d",r[3]);
    tr.setAttribute("data-c",-r[4]); tr.setAttribute("data-t",-r[5]);
    var td = el("td","name");
    var w = el("span","tm"); w.appendChild(sigil(r[0],15));
    var dot=el("i"); dot.style.cssText="width:7px;height:7px;border-radius:50%;flex:none;background:var(--t-"+r[0]+", var(--mark))";
    w.appendChild(dot); w.appendChild(el("span",null,nm(r[0]))); td.appendChild(w); tr.appendChild(td);
    tr.appendChild(el("td",null,f1(r[1])));
    var at = el("td",null,f1(r[2])); if(r[2]>=25) at.style.color="var(--crit)"; tr.appendChild(at);
    var dv = el("td",null,(r[3]>0?"+":"")+f1(r[3]));
    if(r[3]>0) dv.className="up"; else if(r[3]<0) dv.className="down";
    tr.appendChild(dv);
    var ct = el("td",null,f1(r[4])); ct.style.fontWeight="640";
    if(r[4]<0) ct.className="up"; else if(r[4]>=25) ct.style.color="var(--crit)";
    tr.appendChild(ct);
    tr.appendChild(el("td","lead",f1(r[5])));
    if(opts.extra){
      var v = opts.extra.get(r[0]);
      tr.setAttribute("data-"+opts.extra.key, v==null?-1:v);
      tr.appendChild(el("td",null, v==null ? "\u2014" : (opts.extra.fmt?opts.extra.fmt(v):String(v))));
    }
    body.appendChild(tr);
  });
  table.appendChild(body);
  sortable(table, "c");
}

/* Deviations from the projections, both directions. rows: [team, calls, won, lost, net] */
function devTable(table, rows, opts){
  opts = opts||{};
  var nm = function(k){ return opts.L ? teamName(k,opts.L) : team(k).name; };
  var head = el("thead"), hr = el("tr");
  [["Team",""],["Calls","n"],["Won","w"],["Lost","l"],["Net points","net"]].forEach(function(h){
    var th=el("th",null,h[0]); if(h[1]) th.dataset.key=h[1]; hr.appendChild(th);
  });
  head.appendChild(hr); table.appendChild(head);
  var body = el("tbody");
  rows.forEach(function(r){
    var tr = el("tr"); if(team(r[0]).isControl) tr.className="is-control";
    tr.setAttribute("data-n",r[1]); tr.setAttribute("data-w",r[2]); tr.setAttribute("data-l",r[3]); tr.setAttribute("data-net",r[4]);
    var td = el("td","name");
    var w = el("span","tm"); w.appendChild(sigil(r[0],15));
    var dot=el("i"); dot.style.cssText="width:7px;height:7px;border-radius:50%;flex:none;background:var(--t-"+r[0]+", var(--mark))";
    w.appendChild(dot); w.appendChild(el("span",null,nm(r[0]))); td.appendChild(w); tr.appendChild(td);
    tr.appendChild(el("td",null,String(r[1])));
    tr.appendChild(el("td",null,String(r[2])));
    tr.appendChild(el("td",null,String(r[3])));
    var nt = el("td",null,(r[4]>0?"+":"")+(r[4]?r[4].toFixed(1):"0"));
    nt.style.fontWeight="640";
    if(r[4]>0) nt.className="up"; else if(r[4]<0) nt.className="down";
    tr.appendChild(nt);
    body.appendChild(tr);
  });
  table.appendChild(body);
  sortable(table, "net");
}

/* All teams in a league, zeros included, for count bars. exclude: keys to drop (e.g. the spreadsheet). */
function countRows(L, pairs, noun, exclude){
  var have = {}; pairs.forEach(function(p){ have[p[0]] = p[1]; });
  return L.teams.map(function(t){ return t.k; })
    .filter(function(k){ return (exclude||[]).indexOf(k)<0; })
    .map(function(k){ var v = have[k]||0, n = teamName(k,L);
      return {k:k, label:n, v:v, vLabel:String(v),
        tip:"<b>"+n+"</b><br>"+(v ? v+" "+noun+(v>1?"s":"") : "None on record")}; })
    .sort(function(a,b){ return b.v-a.v; });
}

function collapseAfter(container, n, labelMore){
  var kids = [].slice.call(container.children);
  if(kids.length <= n+1) return;
  var hidden = kids.slice(n);
  hidden.forEach(function(k){ k.style.display = "none"; });
  var btn = el("button",null,labelMore || ("Show all "+kids.length));
  btn.type = "button";
  btn.style.cssText = "font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;background:none;border:0;border-bottom:2px solid var(--ink);padding:14px 0 6px;cursor:pointer;color:var(--ink);align-self:flex-start";
  var open = false;
  btn.addEventListener("click",function(){
    open = !open;
    hidden.forEach(function(k){ k.style.display = open ? "" : "none"; });
    btn.textContent = open ? "Show fewer" : (labelMore || ("Show all "+kids.length));
  });
  container.appendChild(btn);
}

/* ---------- shared league-page helpers (same output on every league page) ---------- */
function span(ws){ ws = ws||[]; if(!ws.length) return ""; return ws.length===1 ? "Week "+ws[0] : "Weeks "+ws[0]+"–"+ws[ws.length-1]; }
function weekSpan(L){ return span(L.meta.weeks); }
/* ledger, dead-start and deviation tables can lag the scores: decisions.weeks says which weeks they cover */
function ledgerSpan(L){ return span((L.decisions && L.decisions.weeks) || L.meta.weeks); }
function scoredBoards(L){ return (L.boards||[]).filter(function(b){ return b.scored; }); }
function boardSpan(L){ return span(scoredBoards(L).map(function(b){ return Number(String(b.wk).replace(/\D/g,"")); })); }
/* picks each forecaster makes per board x scored boards: never hard-coded */
function pickCount(L){ var b = scoredBoards(L); return b.length ? b.length*b[0].games.length : 0; }
function cardCount(L){ return scoredBoards(L).reduce(function(n,b){
  var who = {}; b.games.forEach(function(g){ Object.keys(g.picks).forEach(function(k){ who[k]=1; }); });
  return n + Object.keys(who).length; },0); }
function mean(a){ a = (a||[]).filter(function(x){return x!=null;}); return a.length ? a.reduce(function(x,y){return x+y;},0)/a.length : null; }

/* Hero keyline: teams, weeks scored, prediction cards, status */
function keyline(container, L){
  [["Teams",L.meta.teams],["Weeks scored",L.meta.weeks.length],["Prediction cards",cardCount(L)],["Status","Week "+L.meta.current]]
    .forEach(function(p){ var d = el("div"); d.appendChild(el("span","eyebrow",p[0])); d.appendChild(el("span","v",String(p[1]))); container.appendChild(d); });
}

/* Lineup efficiency by week plus mean. */
function effTable(table, L, opts){
  opts = opts||{};
  var ws = L.meta.weeks;
  table.appendChild(el("caption",null,"Share of the best legal lineup · "+weekSpan(L)+" · click to sort"));
  var head = el("thead"), hr = el("tr");
  hr.appendChild(el("th",null,"Team"));
  ws.forEach(function(w){ var th = el("th",null,"Week "+w); th.dataset.key = "w"+w; hr.appendChild(th); });
  var thm = el("th",null,"Mean"); thm.dataset.key = "m"; hr.appendChild(thm);
  head.appendChild(hr); table.appendChild(head);
  var body = el("tbody");
  L.teams.filter(function(t){ return t.eff && t.eff.length; })
   .map(function(t){ return {t:t, m:mean(t.eff)}; })
   .sort(function(a,b){ return b.m-a.m; })
   .forEach(function(r){
    var tr = el("tr"); if(team(r.t.k).isControl) tr.className = "is-control";
    tr.setAttribute("data-m", r.m);
    var td = el("td","name"); td.appendChild(nameTag(r.t.k,L)); tr.appendChild(td);
    ws.forEach(function(w,i){
      var v = r.t.eff[i]; tr.setAttribute("data-w"+w, v==null?-1:v);
      var c = el("td");
      if(v==null) c.textContent = "—"; else c.appendChild(cellBar(v,opts.lo||50,100,v.toFixed(1)+"%",v>=99.95));
      tr.appendChild(c);
    });
    tr.appendChild(el("td","lead",r.m.toFixed(1)+"%"));
    body.appendChild(tr);
  });
  table.appendChild(body);
  sortable(table,"m");
}

/* Dead starts, priced. rows: [team, starts, points] */
function attTable(table, rows, opts){
  opts = opts||{};
  if(opts.caption) table.appendChild(el("caption",null,opts.caption));
  var head = el("thead"), hr = el("tr");
  [["Team",""],["Dead starts","n"],["Points lost","pts"]].forEach(function(h){ var th=el("th",null,h[0]); if(h[1]) th.dataset.key=h[1]; hr.appendChild(th); });
  head.appendChild(hr); table.appendChild(head);
  var body = el("tbody");
  rows.forEach(function(p){
    var tr = el("tr"); if(team(p[0]).isControl) tr.className = "is-control";
    tr.setAttribute("data-n",p[1]); tr.setAttribute("data-pts",p[2]);
    var td = el("td","name"); td.appendChild(nameTag(p[0],opts.L)); tr.appendChild(td);
    tr.appendChild(el("td",null,String(p[1])));
    var c = el("td",null,p[2].toFixed(1)); if(p[2]>=(opts.critAt||40)) c.style.color = "var(--crit)";
    tr.appendChild(c);
    body.appendChild(tr);
  });
  table.appendChild(body);
  sortable(table,"pts");
}

/* Manager cards: identical figures in every league. opts.versions: optional k -> version line */
function managerCards(wrap, L, opts){
  opts = opts||{};
  var N = pickCount(L);
  L.teams.slice().sort(function(a,b){ return pct(b.allplay)-pct(a.allplay); }).forEach(function(t){
    var r = el("div","tr"+(team(t.k).isControl?" ctl":""));
    r.appendChild(sigil(t.k,28));
    var idn = el("div","idn");
    idn.appendChild(el("b",null,teamName(t.k,L)));
    idn.appendChild(el("span",null,(opts.versions&&opts.versions[t.k]) || ""));
    r.appendChild(idn);
    var bd = el("div","bd"), fig = el("div","fig"), m = mean(t.eff);
    [[t.rec,"record"],[t.allplay,"field"],[t.pf.toFixed(1),"points"],[t.pred+"/"+N,"picks"],[t.brier.toFixed(3),"Brier"],[m==null?"—":m.toFixed(1)+"%","efficiency"]]
      .forEach(function(p){ var s = el("span"); s.appendChild(el("b",null,p[0])); s.appendChild(document.createTextNode(" "+p[1])); fig.appendChild(s); });
    bd.appendChild(fig);
    bd.appendChild(el("p",null,t.note));
    r.appendChild(bd);
    wrap.appendChild(r);
  });
}

/* Fabrication and void-claim bars, zero-count teams shown */
function errorBars(L, fabId, voidId){
  var mx = function(p){ return Math.max(3, p.reduce(function(m,x){ return Math.max(m,x[1]); },0)); };
  document.getElementById(fabId).appendChild(barChart(countRows(L, L.counts.fabrications||[], "confirmed fabrication", ["espn"]),{max:mx(L.counts.fabrications||[])}));
  document.getElementById(voidId).appendChild(barChart(countRows(L, L.counts.voidClaims||[], "void claim", ["espn"]),{max:mx(L.counts.voidClaims||[])}));
}

window.CG = {
  el:el, team:team, teamName:teamName, pct:pct, sigil:sigil, nameTag:nameTag, markSvg:markSvg,
  statusPill:statusPill, barChart:barChart, dumbbell:dumbbell, scatter:scatter,
  spark:spark, cellBar:cellBar, bindTip:bindTip, sortable:sortable, collapseAfter:collapseAfter, boardsExplorer:boardsExplorer, raceChart:raceChart, rosterExplorer:rosterExplorer, ledgerTable:ledgerTable, devTable:devTable, countRows:countRows,
  weekSpan:weekSpan, ledgerSpan:ledgerSpan, boardSpan:boardSpan, pickCount:pickCount, cardCount:cardCount, mean:mean,
  keyline:keyline, effTable:effTable, attTable:attTable, managerCards:managerCards, errorBars:errorBars
};
})();
