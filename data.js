/* ============================================================================
   THE CONTROL GROUP: data file
   ----------------------------------------------------------------------------
   Everything the site renders comes from this file. Nothing else needs editing
   to add a week of results.

   HOW TO ADD A WEEK (football, hockey or basketball, same shape):
     1. Push the week's result objects onto  LEAGUES.<sport>.results
     2. Update each team's  rec / pf / pa / allplay / scores[] / pred / brier
     3. Add one entry to    LEAGUES.<sport>.log      (the narrative)
     4. Add any new entries to LEAGUES.<sport>.errors
     5. Bump  LEAGUES.<sport>.meta.through  and  meta.status

   RULES FOR WHOEVER EDITS THIS FILE
     • scores[] is index-aligned to meta.weeks — same length, same order.
       Use null for a week that was never played or never recorded.
     • allplay is "W-L" against the whole field that week, cumulative.
       It is commissioner-only in the league itself but public on this site.
     • brier is the mean of (confidence − outcome)². Lower is better.
       0.250 is what you score by saying 50% on everything.
     • isControl marks the spreadsheet, the rule-following control. There is exactly one per league.
     • Do not invent figures. If something is unknown, use null and the page
       will show a dash rather than a wrong number.
   ========================================================================== */

var SITE = {
  title: "Beat the Spreadsheet",
  sub: "A season-long experiment in AI decision-making: eleven frontier AI models manage real fantasy teams, graded by real games, against a rules-based control.",
  commissioner: "Ian Bott",
  updated: "9 November 2026"
};

/* Team identity. Each team's emblem is a 5x5 matrix where '#' is a filled cell.
   They are drawn in ink rather than brand colour on purpose: colour on this
   site carries data meaning (model vs control, good vs bad), so identity is
   carried by shape instead. It also survives greyscale, print and colour
   blindness. To add a team, give it a pattern nothing else is using. */
var TEAMS = {
  fable:    { name:"Claude Fable",  product:"Claude",   maker:"Anthropic", tier:"paid", sigil:["..#..","..#..",".###.",".###.","#####"] },
  meta:     { name:"Muse",       product:"Muse",  maker:"Meta", tier:"free", sigil:["#####","#...#","#.#.#","#...#","#####"] },
  espn:     { name:"Spreadsheet",   product:"ESPN projections",maker:"ESPN projections, followed by rule", tier:"control", sigil:["#.#.#",".#.#.","#.#.#",".#.#.","#.#.#"], isControl:true },
  qwen:     { name:"Qwen",          product:"Qwen",     maker:"Alibaba", tier:"free", sigil:["#.#.#","#.#.#","#.#.#","#.#.#","#.#.#"] },
  grok:     { name:"Grok",          product:"Grok",     maker:"xAI", tier:"free", sigil:["#...#",".#.#.","..#..",".#.#.","#...#"] },
  kimi:     { name:"Kimi",          product:"Kimi",     maker:"Moonshot AI", tier:"free", sigil:["#####",".....","#####",".....","#####"] },
  chatgpt:  { name:"ChatGPT",       product:"ChatGPT",  maker:"OpenAI", tier:"free", sigil:["..#..","..#..","#####","..#..","..#.."] },
  sonnet:   { name:"Claude Sonnet", product:"Claude",   maker:"Anthropic", tier:"paid", sigil:["#####",".###.",".###.","..#..","..#.."] },
  deepseek: { name:"DeepSeek",      product:"DeepSeek", maker:"DeepSeek", tier:"free", sigil:["#....","##...","###..","####.","#####"] },
  gemini:   { name:"Gemini",        product:"Gemini",   maker:"Google", tier:"free", sigil:["..#..",".#.#.","#...#",".#.#.","..#.."] },
  mistral:  { name:"Mistral",       product:"Mistral",  maker:"Mistral", tier:"free", sigil:["..#..",".###.","#####",".###.","..#.."] },
  instinct: { name:"Instinct",      product:"Instinct", maker:"Instinct", tier:"shadow", sigil:["##.##","##.##",".....","##.##","##.##"] }
};

/* The pre-registered questions. Frozen before Week 5; not revised since.
   `verdict` is the commissioner's current read, and is allowed to change. */
/* The study's standing questions. The null hypothesis sits above all four:
   given identical information, a frontier model manages a roster no better
   than ESPN's own projections applied mechanically. */
var HYPOTHESES = [
  { id:"Q1", title:"Does reasoning beat projections?",
    q:"Each league carries one team run on ESPN's numbers alone, the strategy any sensible casual plays. Can models that read the news, weigh sources and argue actually outperform it?",
    how:"Same information, same deadlines, same scoreboard. The spreadsheet is the baseline every model has to clear.",
    verdict:"Bot ahead so far",
    detail:"The spreadsheet ranks first overall across the three leagues, third at managing and third at forecasting; every model ahead of it at one job trails it at the other. It is second against the field in football and hockey, and in hockey the only forecaster under the 50/50 line. In those two leagues no model has beaten it at both managing and forecasting; Claude Fable, the only flagship-tier model in a field of free tiers, out-forecasts it in football but sits six all-play wins behind. Basketball is the exception so far: two weeks in, four models lead it on both." },
  { id:"Q2", title:"Where does the reasoning break down?",
    q:"When a model loses points, what went wrong? Every lineup is compared with two others built from the same roster: the one ESPN's projections would have set, and the best possible in hindsight. The gaps separate bad luck, inattention (starting a player who isn't playing) and deliberate calls against the projections.",
    how:"Weekly box scores plus ESPN's pregame projections make every start auditable after the fact. The models never see the projections; the comparison is run by the commissioner.",
    verdict:"Inattention, not judgment",
    detail:"Across eight football weeks the league left 1,204.4 points on the table: 74% was variance that even perfect projection-following would have left, 18% was dead starts, and the managers' own calls against the projections cost a net 7%. Inattention has cost about two and a half times as much as judgment. Hockey has the same shape over five weeks: 102.1 points of dead starts against a net 42.6 from deviations." },
  { id:"Q3", title:"How well do the AI models forecast?",
    q:"Forecasting is its own faculty: turn public information into a probability and own the number. Every manager calls every game, every week, with a stated confidence, scored by Brier, where honesty about your own uncertainty is mathematically optimal.",
    how:"A 90% claim that misses costs far more than a 60% one. Calibration and accuracy are tracked separately, against mechanical and consensus benchmarks.",
    verdict:"Rarely better than a coin flip",
    detail:"Of thirty model-league forecasting records, two beat the 0.250 line that answering 50/50 to everything earns: Claude Fable and Claude Sonnet, both in football. None does in hockey, where the spreadsheet is the only forecaster under it, and basketball's best, ChatGPT, sits exactly on it. Accuracy and calibration keep crowning different models." },
  { id:"Q4", title:"Does more public information help?",
    q:"Football is the most heavily covered fantasy sport on earth; hockey is the most niche of the three measured here. Where information is scarce, a model that can find and weigh it should pull further ahead of one that can't, so the gap between strong and weak models should widen as coverage thins. Whether the models as a group gain or lose ground on the spreadsheet is open: its projections already price in much of what there is to read.",
    how:"The same nine models manage teams in all three leagues, with basketball adding two more entrants. Correlating each model's results across sports separates stable skill from a lucky draft.",
    verdict:"Open",
    detail:"Managing results travel between football and hockey: ranked by all-play win share, the nine models line up with a rank correlation of 0.86 (p\u22480.003), the first cross-sport result to clear chance on its own. Basketball, three weeks in, does not yet line up with either (\u22120.07 and 0.14). Forecasting results do not travel so far (\u22120.07 to 0.29, none significant). Within each league the link between managing and forecasting is weak: 0.38 in football, \u22120.05 in hockey, \u22120.39 in basketball (rank correlations)." }
];

/* What a single weekly submission actually demands. Each entry is one ability,
   the instrument that measures it, and what seven weeks have shown.
   Add evidence here as it accumulates; the site renders this list verbatim. */
var CAPABILITIES = [
  { n:"Factual accuracy", q:"Is what it says actually true?",
    instr:"Every checkable claim in every submission is verified against rosters, schedules and injury reports. False ones are logged verbatim.",
    f:"Twenty-eight fabrications on record across the three leagues.",
    ev:"Ten in football, six in hockey, twelve in basketball so far. <b>DeepSeek</b> put a running back on the wrong team's roster two weeks straight and built a trade pitch on it. <b>Qwen</b> made an 88% pick on a team being \u201chealthy, deep and balanced\u201d behind three stars who were all on bye. The pick won anyway." },
  { n:"Keeping the world straight", q:"Can it track a league that changes every week?",
    instr:"Rosters, budgets and transactions move constantly. Submissions are checked against the true state.",
    f:"Roster errors are routine; four models once described the same trade backwards in the same week.",
    ev:"Teams have claimed players they already owned, cited players they had dropped, and listed their own players on the wrong NFL teams. <b>DeepSeek</b> opened the basketball season by submitting a lineup for a different team entirely, then calling the real rosters fictional." },
  { n:"Checking before acting", q:"Does it verify before it commits money?",
    instr:"A waiver claim on a rostered player is void, no refund of the week. All rosters are published every Tuesday.",
    f:"Twelve void claims in football, sixteen more in hockey, and the skill is learnable: the league once went two clean weeks after two teams adopted cross-checking.",
    ev:"<b>Gemini</b> has bid on an already-rostered player in every hockey waiver run, fourteen void claims in four weeks. At the other end, <b>DeepSeek</b> once enumerated all nine rostered kickers across ten teams, correctly, before naming the one free agent." },
  { n:"Calibrated forecasting", q:"Does its confidence mean anything?",
    instr:"Five picks a week with stated percentages, scored by Brier, where honesty is mathematically optimal.",
    f:"Accuracy and calibration are different leaderboards with different names on top.",
    ev:"<b>Claude Sonnet</b> and <b>Gemini</b> share a 9/20 football record at 0.229 and 0.344 Brier. Gemini also has the most correct picks in hockey (9 of 15) while being that league's most error-prone manager, which is the strongest argument yet that forecasting and managing are different skills." },
  { n:"Updating on evidence", q:"When the premise dies, does the pick?",
    instr:"Lineups are published before predictions are collected, so a forecast built on a stale assumption can be fixed before it is scored.",
    f:"One clean belief update in seven football weeks, and one perfect inversion of it.",
    ev:"<b>Claude Sonnet</b> reversed a pick and named the exact fact that had changed: its case rested on byes its opponent had just patched on waivers. It was right. <b>DeepSeek</b> wrote \u201cpredictions stand, no revisions needed\u201d and then changed all five numbers." },
  { n:"Planning ahead", q:"Does it act for a week that has not arrived?",
    instr:"Byes are known months out. Roster holes are visible weeks before they cost anything.",
    f:"Two forward-looking moves in seven football weeks, against twenty-one avoidable zeros.",
    ev:"<b>Claude Sonnet</b> bought a backup tight end one week before its starter's bye. <b>Claude Fable</b> timed a trade around one. Meanwhile six teams started a player who scored nothing at a position where they had rostered no alternative, with free agents sitting on the wire." },
  { n:"Negotiation", q:"Can it close a deal with another AI?",
    instr:"At least one trade offer per team per week is mandatory. Both sides' reports are logged, which also catches teams misremembering their own history.",
    f:"Offers are plentiful, closes are rare, and the best close was argued, not lucky.",
    ev:"Week 7 of football: twelve offers, two accepted. <b>DeepSeek</b> landed the trade it wanted on the second ask by naming exactly why the asset had gotten cheaper. Two teams torpedoed their own offers by simultaneously dropping the player they were offering." },
  { n:"Self-knowledge", q:"Can it do an honest post-mortem?",
    instr:"Teams review their own week; every number they cite is checked against the box score.",
    f:"Self-review runs generous, with sharp exceptions in both directions.",
    ev:"<b>Kimi</b> once reproduced every figure of a loss to the decimal. <b>ChatGPT</b> claimed a 48-point head start its lineup slots could not have produced. <b>DeepSeek</b> went from \u201cI have been the unluckiest team in this league\u201d to a precise list of its three weakest starters in seven days." }
];

/* What the design cannot support. Stated because a benchmark without a
   limitations section is marketing. */
var LIMITS = [
  { n:"Variance is loud", t:"Fantasy outcomes carry heavy variance, which is why the site leans on against-the-field records, lineup pricing and hundreds of scored predictions rather than win-loss records, and reports sample sizes with its claims. Mid-table gaps are not yet meaningful." },
  { n:"Products, not raw models", t:"Each competitor runs as its consumer product, with its own tools, memory and context limits, updated by its provider without notice. The two Claude teams run on a paid account; the other nine run as free tiers. What a model reports about its own version or reasoning is recorded as a claim, not a measurement." },
  { n:"A human relay", t:"Every message passes through one commissioner by hand, which is what caps the study at three leagues. Every classification is checked against box scores and published rosters, and the quotes behind it are kept verbatim." }
];

/* ========================== FOOTBALL ====================================== */
LEAGUES = {};

LEAGUES.football = {
  meta:{
    sport:"Football", slug:"football", season:"2026",
    teams:10, format:"Head-to-head points, 14-week regular season",
    weeks:[2,3,4,5,6,7,8,9],                 // scored weeks, index-aligned to scores[]
    through:9, current:10,
    status:"live",
    statusNote:"Week 9 is scored, including lineup efficiency and the points ledger.",
    waiver:"$100 FAAB, sealed bid, highest bid wins",
    byes:""
  },

  /* key, record, points for/against, all-play, prediction record, brier,
     FAAB spent, lineup efficiency by week (W2–W8), attention failures */
  teams:[
    { k:"fable",    rec:"5-3", pf:892.80, pa:768.08, allplay:"46-26", pred:25, brier:0.210, faab:74, eff:[93.6, 89.1, 79.2, 89.6, 87.5, 82.8, 100, 87.1], att:0,
      scores:[106.84, 128.56, 130.08, 123.84, 92.7, 87.92, 100.48, 122.38],
      note:"Lost to Grok by 0.68 in Week 9, the narrowest margin of the season, after picking itself at 52%. Still the best forecaster in any of the three leagues." },
    { k:"meta",     rec:"7-1", pf:933.62, pa:728.12, allplay:"55-17", pred:21, brier:0.252, faab:88, eff:[91.7, 94, 85.2, 79.6, 94.9, 87.3, 85.3, 83.3], att:2,
      scores:[105.08, 116.78, 116.52, 102.2, 99.14, 118.38, 147.88, 127.64],
      note:"7-1 and two games clear after the week's top score, 127.64 against the spreadsheet. All nine models picked it to win." },
    { k:"espn",     rec:"5-3", pf:949.70, pa:866.20, allplay:"51-21", pred:24, brier:0.223, faab:0, eff:[95.4, 76.7, 93.8, 80.7, 99.6, 100, 84.5, 87.1], att:0,
      scores:[182.32, 108.72, 94.82, 105.5, 116.1, 100.62, 129.36, 112.26],
      note:"The control. Starts the highest projection, every week, with no reasoning. Lost to Muse but still leads the league in points, and has spent nothing." },
    { k:"qwen",     rec:"6-2", pf:842.82, pa:745.08, allplay:"40-32", pred:18, brier:0.290, faab:85, eff:[97, 93.1, 87.7, 80.9, 100, 90.3, 91.6, 93], att:2,
      scores:[103.02, 128.78, 81.38, 129.54, 85.04, 112.2, 121.98, 80.88],
      note:"6-2 on a 40-32 record against the field, the biggest gap between record and play in the league. Beat Gemini 80.88 to 66.62 in the week's lowest-scoring game." },
    { k:"grok",     rec:"4-4", pf:903.76, pa:919.48, allplay:"48-24", pred:19, brier:0.266, faab:89, eff:[100, 94.5, 85.9, 95.9, 98.5, 65.2, 100, 89.1], att:1,
      scores:[114.92, 107.56, 110.16, 139.46, 96.5, 87.24, 124.86, 123.06],
      note:"Beat Claude Fable by 0.68 behind Kenneth Walker III's 34.3 at flex. Third against the field and only 4-4." },
    { k:"kimi",     rec:"3-5", pf:834.84, pa:851.24, allplay:"36-36", pred:19, brier:0.263, faab:38, eff:[86.2, 86.3, 97.2, 90, 89.4, 77.4, 93.3, 84], att:3,
      scores:[78.08, 102.14, 133.1, 117.92, 110.18, 92.8, 101.54, 99.08],
      note:"Lost to ChatGPT by 0.76 with C.J. Stroud's 35.36 on its bench behind Patrick Mahomes's 16.48." },
    { k:"chatgpt",  rec:"3-5", pf:836.98, pa:843.48, allplay:"37-35", pred:18, brier:0.268, faab:97, eff:[95.1, 88.5, 95, 77, 94.4, 92.9, 74.8, 89.6], att:0,
      scores:[94.1, 93.64, 113.28, 105.32, 134.22, 94.9, 101.68, 99.84],
      note:"Beat Kimi by 0.76 after picking Kimi at 62%. Only Qwen and Gemini among the models gave it the game." },
    { k:"sonnet",   rec:"3-5", pf:677.38, pa:867.74, allplay:"18-54", pred:18, brier:0.237, faab:100, eff:[92.8, 81.6, 74.8, 92.2, 70.4, 76.7, 80.6, 100], att:2,
      scores:[82.28, 98.14, 89.16, 141.94, 67.38, 76.38, 64.58, 57.52],
      note:"Scored 57.52 and lost to DeepSeek by 46.96. Its lineup was the best its roster allowed: nothing on the bench would have scored more." },
    { k:"deepseek", rec:"3-5", pf:688.42, pa:740.28, allplay:"22-50", pred:17, brier:0.282, faab:91, eff:[93.7, 84.1, 87.1, 75.8, 91.2, 88.1, 59.3, 87.7], att:8,
      scores:[89.06, 65.44, 98.22, 79.74, 82.66, 98.62, 70.2, 104.48],
      note:"Beat Claude Sonnet 104.48 to 57.52 with Brock Purdy's 25.28, a week after starting him on a bye. Called its own game at 58%." },
    { k:"gemini",   rec:"1-7", pf:571.42, pa:802.04, allplay:"7-65", pred:17, brier:0.331, faab:81, eff:[94.2, 79.5, 90.5, 86.6, 84.5, 77.6, 98.9, 89.5], att:10,
      scores:[99.96, 80.52, 85.82, 52.4, 59, 66.3, 60.8, 66.62],
      note:"1-7. Picked itself at 81% against Qwen and lost by 14.26, the seventh time it has backed itself above 70% and lost. Started Jauan Jennings, ruled Out, at flex." }
  ],

  /* Synthetic benchmarks. Not teams. They do not play. Computed after the fact
     to give the models something to beat besides each other.
     consensus = majority pick of the nine models, confidence = mean of that side
     points    = whoever has scored more points, confidence = Φ(gap / margin SD) */
  /* Benchmarks are forecasters that never played a game. */
  benchmarks:[
    { name:"Points-for rule", pred:20, brier:0.244,
      note:"Picks whichever team has scored more total points so far, with confidence set by the size of the gap scaled to the league's own week-to-week scoring spread. No rosters, no news, one number per team. Better than every model except Claude Fable and Claude Sonnet." },
    { name:"Consensus, majority vote", pred:18, brier:0.269,
      note:"Whichever side more of the nine models picked, at the average confidence of that winning side. A majority vote manufactures confidence no single model stated, and the models tend to miss together: in Week 9 seven of nine took Kimi over ChatGPT." },
    { name:"Consensus, pooled probability", pred:17, brier:0.251,
      note:"The same nine cards averaged as probabilities instead of votes, the statistically correct way to pool opinions. Better calibrated than the vote, and still a shade worse than answering fifty per cent to everything." }
  ],

  /* Decision classification, Weeks 3–6. Judgment errors are listed as the
     largest single-week cost rather than a count, because every team has them. */
  decisions:{
    weeks:[2,3,4,5,6,7,8,9],   // weeks the ledger, dead-start and deviation tables cover
    /* THREE-LINEUP LEDGER. Every team-week, from the ESPN box page (projection at lock + actual
       for every rostered player, IR excluded):
         actual   = the lineup the manager started
         proj     = the best legal lineup by ESPN's projections
         best     = the best legal lineup in hindsight
       variance   = best - proj            (what even perfect projection-following leaves on the bench)
       deadStarts = proj - proj-with-the-dead-starters-forced-in, plus est rows (slots with no live
                    alternative on the roster, priced at the 25th percentile of that week's starters at
                    the position)
       deviations = actual - proj-with-dead-starters-forced-in   (NET: positive = the manager's own calls gained)
       controllable = deadStarts - deviations ; total = variance + controllable = best - actual + est
       ledger = [team, variance, deadStarts, deviationsNet, controllable, total]
       deviations = [team, calls, won, lost, net]  (calls paired by position; pair deltas sum exactly to net) */
    attention:[["gemini",12,68.3],["deepseek",7,63.7],["sonnet",1,31.7],["qwen",1,22.8],["kimi",3,21.1],["meta",2,9.7],["grok",1,5.2]],
    attentionNote:"Twenty-seven dead starts across eight weeks, 222.5 points. Week 9 had one: Gemini started Jauan Jennings, ruled Out, at flex, with Xavier Worthy’s 7.8 on its bench. Each is priced against the player ESPN's projections would have started in that slot. Only where the roster held no live alternative at all is the slot estimated (marked est), at the 25th percentile of that week's starters at the position: the realistic value of a waiver pickup.",
    attentionDetail:[
      ["sonnet","Week 4","Trey Benson",31.7,false],["qwen","Week 5","Marvin Harrison Jr.",22.8,false],
      ["gemini","Week 6","Jalen Hurts",14.6,true],["kimi","Week 6","James Conner",9.7,false],
      ["meta","Week 2","Jordan Mason",7.6,false],["deepseek","Week 6","Adonai Mitchell",5.9,true],
      ["deepseek","Week 2","Puka Nacua",5.7,true],["deepseek","Week 3","Adonai Mitchell",5.3,true],
      ["deepseek","Week 6","Mike Gesicki",5.2,true],["grok","Week 6","Tyler Warren",5.2,true],
      ["gemini","Week 6","Saquon Barkley",5.0,true],["gemini","Week 6","Josh Jacobs",5.0,true],
      ["gemini","Week 4","Terry McLaurin",4.8,false],["gemini","Week 5","Saquon Barkley",4.4,true],
      ["deepseek","Week 5","Adonai Mitchell",3.4,true],["gemini","Week 6","Deebo Samuel Sr.",3.2,false],
      ["kimi","Week 2","Zay Flowers",2.8,false],["gemini","Week 6","Evan McPherson",2.5,true],
      ["meta","Week 2","Brock Bowers",2.1,true],["gemini","Week 3","Dallas Goedert",1.0,false],
      ["kimi","Week 7","James Conner",8.6,false],["gemini","Week 7","Jalen Hurts",6.7,false],
      ["gemini","Week 7","David Montgomery",6.7,false],["gemini","Week 7","Deebo Samuel Sr.",6.6,false],
      ["deepseek","Week 8","Brock Purdy",19.8,false],["deepseek","Week 8","Dameon Pierce",18.4,false],["gemini","Week 9","Jauan Jennings",7.8,false]],
    ledger:[
      ["deepseek",94.4,63.7,-10.1,73.8,168.2],["sonnet",122.1,31.7,16,15.7,137.8],["meta",91.1,9.7,-38.1,47.8,138.9],
      ["fable",100.1,0,-21.1,21.1,121.2],["chatgpt",87.1,0,-28.4,28.4,115.5],["espn",114.2,0,0,0,114.2],
      ["gemini",60.6,68.3,15,53.3,113.9],["kimi",108.3,21.1,17.4,3.7,112.0],["grok",77.8,5.2,-15.5,20.7,98.5],["qwen",37.5,22.8,-23.8,46.6,84.1]
    ],
    ledgerNote:"1,204.4 points left on the table in eight weeks: 893.4 to variance, 222.5 to dead starts, and a net 88.6 to deviations. The models' calls against the projections have won 40 and lost 36 but cost points on balance, about two-fifths of what starting inactive players has cost. Gemini, Kimi and Claude Sonnet are the only teams whose calls are net positive; Kimi has the smallest controllable loss in the league. The spreadsheet makes no calls, so all 114.2 of its points lost are variance. Week 9 projections are ESPN's final pregame figures.",
    deviations:[
      ["kimi",9,7,2,17.4],["sonnet",9,5,4,16],["gemini",5,3,2,15],["deepseek",11,6,5,-10.1],["grok",6,3,2,-15.5],
      ["fable",8,4,4,-21.1],["qwen",12,5,7,-23.8],["chatgpt",6,3,3,-28.4],["meta",11,4,7,-38.1]
    ],
    deviationsNote:"Every start that differs from the lineup ESPN's projections would have set, dead starts excluded, priced against the player the projections preferred. Seventy-seven calls in eight weeks, 40 won and 36 lost, net −88.6. The spreadsheet never deviates: it starts the projections' lineup by definition. Week 9's costliest call was Muse starting Mike Washington Jr. (−0.3) and Keenan Allen (4.6) over Breece Hall and Harold Fannin Jr., 17.1 points."
  },

  /* Hard counts behind the transcript, Weeks 2-8. */
  counts:{
    fabrications:[["kimi",2],["deepseek",2],["qwen",2],["gemini",1],["meta",1],["chatgpt",1],["grok",1]],
    voidClaims:[["gemini",6],["grok",4],["deepseek",4],["kimi",2],["chatgpt",1]]
  },

  /* Pre-season draft grades: what the nine models gave each team (A=4.0 scale,
     self-grades excluded) and each grader's predicted top three. */
  draft:{
    avg:[["sonnet",3.70],["kimi",3.42],["chatgpt",3.40],["meta",3.26],["qwen",3.24],["fable",3.22],["gemini",3.20],["grok",3.19],["espn",3.07],["deepseek",2.59]],
    top3:{ fable:["sonnet","grok","fable"], sonnet:["sonnet","fable","grok"], espn:["chatgpt","sonnet","gemini"],
      qwen:["gemini","sonnet","chatgpt"], kimi:["kimi","meta","sonnet"], chatgpt:["sonnet","chatgpt","kimi"],
      grok:["grok","kimi","meta"], deepseek:["deepseek","qwen","kimi"], meta:["sonnet","kimi","meta"], gemini:["gemini","sonnet","chatgpt"] },
    note:"Eight of ten graders put Claude Sonnet in their top three. It is eighth against the field. Claude Fable, first in the standings and first in forecasting, was nobody's number one. The spreadsheet they graded ninth leads the league in total points. Pre-season grading was confident, consensual and highly inaccurate at the top."
  },

  /* One entry per week. Newest first. */
  log:[
    {wk:"Week 9",open:true,h:"Two games decided by less than a point",p:"Grok beat Claude Fable 123.06 to 122.38 on Kenneth Walker III's 34.3 at flex. ChatGPT beat Kimi 99.84 to 99.08 while Kimi had C.J. Stroud's 35.36 on its bench behind Patrick Mahomes. Seven of the nine models had picked Kimi; ChatGPT itself picked Kimi at 62%."},
    {wk:"Week 9",h:"Gemini backs itself at 81% and loses again",p:"The 1-7 team put the highest self-confidence on the board on beating Qwen and lost by 14.26. It is the seventh time this season Gemini has backed itself above 70%, and it has lost all seven. It also started Jauan Jennings, ruled Out, at flex, and three of its waiver bids targeted players already on other rosters."},
    { wk:"Week 7", open:true, h:"Every lineup made public, and three teams checked them",
      p:"The change this week was sequencing: all ten starting lineups were published before anyone predicted. Eight separate facts were findable from that board: a quarterback on injured reserve, a 23-point running back benched by mistake, a tight end ruled doubtful. Muse, Claude Fable and Claude Sonnet went and checked. Six teams read the same board and treated every name on it as a player who would play." },
    { wk:"Week 7", h:"Four void waiver claims, two of them on the same rostered player",
      p:"DeepSeek submitted three claims and all three targeted players already on other rosters, so it added nobody. In the same message it correctly reported declining a trade for one of those players. Grok independently bid $15 on a player ChatGPT has rostered since Week 5." },
    { wk:"Week 6", h:"The spreadsheet goes 5-for-5 again",
      p:"ESPN's second perfect prediction card, with the best single-week Brier anything has posted (0.147). Its 83% on Grok over Gemini was the most confident correct call on the board. ChatGPT and Claude Sonnet both picked against themselves in the same game, a first." },
    { wk:"Week 6", h:"Qwen posts a perfect lineup and loses",
      p:"100% lineup efficiency, the best legal nine from its roster exactly, beaten 92.70 to 85.04. Meanwhile Gemini, DeepSeek and Grok each took a zero at a position where they had never rostered an alternative." },
    { wk:"Week 5", h:"The field goes below a coin flip",
      p:"21 correct out of 50. Eight of ten teams scored worse than the 0.250 you get by saying 50% on everything. Four of five games went against the consensus. Claude Fable went 5-for-5 with a confidence range of 55–64, the single best card of the season." },
    { wk:"Week 5", h:"The commissioner contaminates the experiment, then stops",
      p:"Lineup-efficiency tables and the commissioner's own analysis of each team's errors had been going out in the weekly packet. Gemini and Claude Sonnet both recited those computed figures back as their own insight. Everything derived was pulled from the packets from Week 5 on. Conclusions about analytical ability before Week 5 are discounted." },
    { wk:"Week 4", h:"Eight invalid waiver claims",
      p:"Eight bids across two weeks went to players already on somebody else's roster, including a $32 claim from Grok and two from Kimi in one submission. Kimi acknowledged the error unprompted the following week and started verifying against all ten rosters. The league then went two weeks with none." },
    { wk:"Week 3", h:"Ollie Gordon II draws $116 in sealed bids",
      p:"Five teams bid on the same running back. The winner paid $31. Separately, the first confirmed fabrications appear in prediction cards: Kimi describing a player it had cut in preseason, whom it had never rostered." }
  ],

  /* The entertaining part, and the most diagnostic. `kind` drives the colour. */
  errors:[
    { who:"deepseek", kind:"Self-contradiction", wk:"Week 7",
      q:"Bid $12 to claim Xavier Worthy off waivers. Forty lines later in the same message: \"Gemini offered Worthy + Jakobi Meyers for Jeanty (declined).\"",
      res:"It knew Gemini owned the player, turned down a trade for him, and then bid on him as a free agent. Claim void." },
    { who:"gemini", kind:"Fabrication", wk:"Week 7",
      q:"\"Model & Version: Gemini 1.5 Pro (as reported in the Google AI Studio / API system metadata environment).\"",
      res:"Two generations stale, and it is not running in AI Studio or the API. It invented the version and the source it claimed to have read it from." },
    { who:"gemini", kind:"Attention", wk:"Week 7",
      q:"Spent $12 on a backup quarterback \"to cover Jalen Hurts' upcoming bye week\", left him on the bench, and started Hurts.",
      res:"Philadelphia was not on bye. Hurts was reported to injured reserve by six separate teams. Gemini was the only team that thought the lineup was fine." },
    { who:"kimi", kind:"Fabrication", wk:"Week 7",
      q:"\"Qwen submitted Matthew Stafford at quarterback while the Chargers are on bye. That's a zero — or a prayer — at the most volatile scoring slot.\"",
      res:"Stafford plays for the Rams. Qwen's quarterback was fine. Kimi's 72% self-pick rested entirely on the mix-up." },
    { who:"qwen", kind:"Attention", wk:"Week 7",
      q:"\"Trevor Lawrence, Dalton Kincaid, and Jahmyr Gibbs are correctly benched due to their Week 7 byes.\"",
      res:"Gibbs was not on bye and was the highest projection on its roster. The packet it was replying to listed the four bye teams and marked the affected players. Gibbs was not marked." },
    { who:"deepseek", kind:"Fabrication", wk:"Weeks 5–6",
      q:"Placed David Montgomery on Muse's roster in two consecutive weeks, and used it in a trade rationale and a prediction.",
      res:"Montgomery is Gemini's. Nobody corrected it in between." },
    { who:"qwen", kind:"Fabrication", wk:"Week 6",
      q:"\"Meta AI is healthy, deep, and balanced with Burrow, St. Brown, Higgins.\" An 88% pick.",
      res:"All three were on bye. Muse was missing its quarterback, its WR1 and its WR2. The pick was correct anyway." },
    { who:"chatgpt", kind:"Retrieval failure", wk:"Week 7",
      q:"Monday: flagged Philadelphia's quarterback situation as uncertain and spent FAAB on a defence to exploit it. Tuesday: picked Gemini at 57% because \"Hurts, Barkley, Lamb and Jacobs give Gemini the stronger combination.\"",
      res:"Same model, same week, same fact. Used to make a purchase, then ignored when forecasting the game that fact decides." },
    { who:"meta", kind:"Self-correction", good:true, wk:"Week 7",
      q:"\"I offered Skattebo to Qwen while he was the drop on my own Cooper claim. When the claim processed, the offer had no player to send. Offers and drops get separated or conditionally linked from here.\"",
      res:"Owned the error and stated a rule change. Two other teams made the same mistake and neither noticed." },
    { who:"deepseek", kind:"Self-correction", good:true, wk:"Week 7",
      q:"\"Butker is available (Kimi rosters him, so he's not available — let me check).\" Then enumerated all nine rostered kickers across all ten rosters, correctly, and named an unrostered alternative.",
      res:"Caught its own fix mid-sentence. The only cross-roster verification of a whole position anyone has done." },
    { who:"sonnet", kind:"Belief update", good:true, wk:"Week 6",
      q:"Reversed a prediction and named the falsified premise: its case rested on ChatGPT losing two starters to byes, and ChatGPT had just won replacements on waivers.",
      res:"The cleanest belief update of the season, and it was right. It was the difference between 3/5 and 4/5." },
    { who:"fable", kind:"Reads the experiment", good:true, wk:"Week 7",
      q:"\"ESPN's lineup bot just out-streamed nine language models at quarterback and wide receiver, and none of you picked them up. Maybe the projection spreadsheet deserves more respect than I gave it.\"",
      res:"A model stating the experiment's own central question, unprompted, and marking down its prior. It then became the only team to pick the spreadsheet to win." }
  ],

  /* Every prediction card collected, week by week. w = winner, null if unscored.
     conf null = confidence percentages were not yet collected that week. */
  boards:[
    { wk:"Week 3", scored:true,
      games:[
        { a:"qwen", b:"grok", w:"qwen", picks:{qwen:["qwen",null],kimi:["grok",null],chatgpt:["qwen",null],grok:["grok",null],deepseek:["qwen",null],meta:["grok",null],gemini:["grok",null],sonnet:["grok",null],fable:["grok",null],espn:["qwen",null]} },
        { a:"fable", b:"gemini", w:"fable", picks:{qwen:["gemini",null],kimi:["fable",null],chatgpt:["gemini",null],grok:["gemini",null],deepseek:["gemini",null],meta:["fable",null],gemini:["gemini",null],sonnet:["gemini",null],fable:["fable",null],espn:["fable",null]} },
        { a:"espn", b:"sonnet", w:"espn", picks:{qwen:["sonnet",null],kimi:["espn",null],chatgpt:["espn",null],grok:["espn",null],deepseek:["espn",null],meta:["espn",null],gemini:["espn",null],sonnet:["sonnet",null],fable:["espn",null],espn:["espn",null]} },
        { a:"meta", b:"chatgpt", w:"meta", picks:{qwen:["chatgpt",null],kimi:["meta",null],chatgpt:["meta",null],grok:["meta",null],deepseek:["meta",null],meta:["meta",null],gemini:["meta",null],sonnet:["meta",null],fable:["meta",null],espn:["meta",null]} },
        { a:"deepseek", b:"kimi", w:"kimi", picks:{qwen:["kimi",null],kimi:["kimi",null],chatgpt:["deepseek",null],grok:["kimi",null],deepseek:["deepseek",null],meta:["deepseek",null],gemini:["deepseek",null],sonnet:["deepseek",null],fable:["deepseek",null],espn:["kimi",null]} }
      ] },
    { wk:"Week 4", scored:true, note:"Confidence percentages begin. ESPN's card was not archived, so it is rebuilt from the spreadsheet's own rule: each side's projected lineup total at lock, with confidence scaled as on its Weeks 5 to 8 cards. Grok against Kimi was 0.3 projected points apart at lock and is entered as Grok at 50, which matches the spreadsheet's recorded 2 of 5.",
      games:[
        { a:"espn", b:"fable", w:"fable", picks:{espn:["espn",55],qwen:["espn",75],kimi:["espn",72],chatgpt:["espn",64],grok:["espn",68],deepseek:["espn",78],meta:["fable",55],gemini:["fable",58],sonnet:["espn",55],fable:["fable",55]} },
        { a:"gemini", b:"meta", w:"meta", picks:{espn:["meta",77],qwen:["meta",65],kimi:["meta",78],chatgpt:["meta",62],grok:["meta",62],deepseek:["meta",82],meta:["meta",80],gemini:["gemini",68],sonnet:["meta",66],fable:["meta",72]} },
        { a:"sonnet", b:"qwen", w:"sonnet", picks:{espn:["qwen",77],qwen:["qwen",60],kimi:["qwen",75],chatgpt:["sonnet",57],grok:["qwen",71],deepseek:["qwen",74],meta:["qwen",72],gemini:["sonnet",74],sonnet:["qwen",54],fable:["sonnet",68]} },
        { a:"chatgpt", b:"deepseek", w:"chatgpt", picks:{espn:["chatgpt",60],qwen:["chatgpt",85],kimi:["chatgpt",82],chatgpt:["chatgpt",61],grok:["chatgpt",74],deepseek:["deepseek",68],meta:["chatgpt",70],gemini:["chatgpt",82],sonnet:["chatgpt",61],fable:["chatgpt",60]} },
        { a:"grok", b:"kimi", w:"kimi", picks:{espn:["grok",50],qwen:["kimi",80],kimi:["kimi",65],chatgpt:["kimi",55],grok:["grok",58],deepseek:["kimi",71],meta:["grok",62],gemini:["grok",79],sonnet:["grok",59],fable:["grok",75]} }
      ] },
    { wk:"Week 5", scored:true,
      games:[
        { a:"sonnet", b:"kimi", w:"sonnet", picks:{qwen:["sonnet",74],kimi:["kimi",60],chatgpt:["kimi",61],grok:["kimi",66],deepseek:["kimi",66],meta:["kimi",70],gemini:["kimi",71],sonnet:["kimi",66],fable:["sonnet",58],espn:["kimi",55]} },
        { a:"grok", b:"chatgpt", w:"grok", picks:{qwen:["chatgpt",79],kimi:["chatgpt",65],chatgpt:["chatgpt",64],grok:["grok",57],deepseek:["chatgpt",63],meta:["chatgpt",64],gemini:["chatgpt",76],sonnet:["chatgpt",52],fable:["grok",60],espn:["grok",51]} },
        { a:"qwen", b:"espn", w:"qwen", picks:{qwen:["qwen",62],kimi:["qwen",57],chatgpt:["espn",67],grok:["espn",63],deepseek:["qwen",61],meta:["espn",57],gemini:["espn",62],sonnet:["espn",55],fable:["qwen",55],espn:["espn",52]} },
        { a:"fable", b:"meta", w:"fable", picks:{qwen:["meta",68],kimi:["fable",55],chatgpt:["fable",56],grok:["meta",61],deepseek:["meta",72],meta:["fable",55],gemini:["fable",56],sonnet:["fable",58],fable:["fable",62],espn:["fable",54]} },
        { a:"deepseek", b:"gemini", w:"deepseek", picks:{qwen:["gemini",88],kimi:["gemini",58],chatgpt:["gemini",72],grok:["gemini",68],deepseek:["deepseek",68],meta:["deepseek",62],gemini:["gemini",84],sonnet:["deepseek",57],fable:["deepseek",64],espn:["deepseek",67]} }
      ] },
    { wk:"Week 6", scored:true,
      games:[
        { a:"fable", b:"qwen", w:"fable", picks:{qwen:["qwen",52],kimi:["fable",55],chatgpt:["fable",64],grok:["fable",66],deepseek:["qwen",57],meta:["fable",68],gemini:["fable",68],sonnet:["fable",68],fable:["fable",72],espn:["fable",64]} },
        { a:"meta", b:"deepseek", w:"meta", picks:{qwen:["meta",88],kimi:["meta",66],chatgpt:["meta",60],grok:["meta",73],deepseek:["deepseek",54],meta:["meta",58],gemini:["meta",74],sonnet:["meta",60],fable:["deepseek",66],espn:["meta",58]} },
        { a:"espn", b:"kimi", w:"espn", picks:{qwen:["espn",55],kimi:["kimi",55],chatgpt:["espn",52],grok:["espn",60],deepseek:["kimi",58],meta:["kimi",66],gemini:["espn",58],sonnet:["kimi",57],fable:["espn",60],espn:["espn",59]} },
        { a:"grok", b:"gemini", w:"grok", picks:{qwen:["grok",62],kimi:["grok",55],chatgpt:["grok",57],grok:["grok",62],deepseek:["grok",52],meta:["grok",74],gemini:["gemini",82],sonnet:["grok",80],fable:["grok",55],espn:["grok",83]} },
        { a:"chatgpt", b:"sonnet", w:"chatgpt", picks:{qwen:["sonnet",76],kimi:["sonnet",58],chatgpt:["sonnet",55],grok:["sonnet",64],deepseek:["sonnet",56],meta:["sonnet",58],gemini:["sonnet",64],sonnet:["chatgpt",52],fable:["chatgpt",62],espn:["chatgpt",52]} }
      ] },
    { wk:"Week 7", scored:true, note:"Both unanimous cards lost: all ten forecasters backed Claude Fable over DeepSeek and Kimi over Qwen, and both fell. Every forecaster scored worse than 50/50 on the week.",
      games:[
        { a:"fable", b:"deepseek", w:"deepseek", picks:{fable:["fable",76],meta:["fable",72],espn:["fable",71],qwen:["fable",78],grok:["fable",72],kimi:["fable",68],chatgpt:["fable",64],sonnet:["fable",70],deepseek:["fable",72],gemini:["fable",78]} },
        { a:"kimi", b:"qwen", w:"qwen", picks:{fable:["kimi",57],meta:["kimi",68],espn:["kimi",54],qwen:["kimi",68],grok:["kimi",58],kimi:["kimi",72],chatgpt:["kimi",68],sonnet:["kimi",66],deepseek:["kimi",64],gemini:["kimi",64]} },
        { a:"grok", b:"meta", w:"meta", picks:{fable:["grok",55],meta:["meta",58],espn:["grok",58],qwen:["meta",75],grok:["grok",61],kimi:["meta",57],chatgpt:["meta",60],sonnet:["meta",52],deepseek:["meta",61],gemini:["meta",60]} },
        { a:"chatgpt", b:"espn", w:"espn", picks:{fable:["espn",62],meta:["chatgpt",57],espn:["espn",52],qwen:["chatgpt",85],grok:["chatgpt",65],kimi:["chatgpt",56],chatgpt:["chatgpt",53],sonnet:["chatgpt",56],deepseek:["chatgpt",55],gemini:["chatgpt",67]} },
        { a:"sonnet", b:"gemini", w:"sonnet", picks:{fable:["sonnet",74],meta:["sonnet",60],espn:["sonnet",88],qwen:["sonnet",62],grok:["sonnet",57],kimi:["gemini",53],chatgpt:["gemini",57],sonnet:["sonnet",74],deepseek:["gemini",58],gemini:["gemini",72]} }
      ] },
    { wk:"Week 8", scored:true, note:"Grok's was the only perfect card, and the only one to pick Kimi, which beat Claude Fable by 1.06. Both unanimous picks, Grok and Qwen, won. Two forecasters, Claude Fable and Claude Sonnet, noticed Brock Purdy was starting on a bye.",
      games:[
        { a:"kimi", b:"fable", w:"kimi", picks:{fable:["fable",66],meta:["fable",65],espn:["fable",61],qwen:["fable",68],grok:["kimi",62],kimi:["fable",65],chatgpt:["fable",57],sonnet:["fable",66],deepseek:["fable",64],gemini:["fable",64]} },
        { a:"deepseek", b:"grok", w:"grok", picks:{fable:["grok",80],meta:["grok",56],espn:["grok",74],qwen:["grok",72],grok:["grok",58],kimi:["grok",60],chatgpt:["grok",72],sonnet:["grok",70],deepseek:["grok",71],gemini:["grok",68]} },
        { a:"qwen", b:"chatgpt", w:"qwen", picks:{fable:["qwen",68],meta:["qwen",62],espn:["qwen",58],qwen:["qwen",85],grok:["qwen",68],kimi:["qwen",72],chatgpt:["qwen",57],sonnet:["qwen",54],deepseek:["qwen",68],gemini:["qwen",62]} },
        { a:"meta", b:"sonnet", w:"meta", picks:{fable:["meta",64],meta:["meta",64],espn:["meta",57],qwen:["sonnet",58],grok:["meta",65],kimi:["meta",70],chatgpt:["meta",65],sonnet:["meta",62],deepseek:["meta",66],gemini:["meta",72]} },
        { a:"espn", b:"gemini", w:"espn", picks:{fable:["espn",72],meta:["espn",60],espn:["espn",70],qwen:["gemini",82],grok:["espn",60],kimi:["espn",68],chatgpt:["gemini",53],sonnet:["espn",65],deepseek:["espn",63],gemini:["gemini",84]} }
      ] },
    { wk:"Week 9", scored:true, note:"Muse, DeepSeek, Qwen and Gemini went 4 for 5; nobody was perfect. Seven of the nine models took Kimi over ChatGPT, and ChatGPT won by 0.76. Grok beat Claude Fable by 0.68. Gemini picked itself at 81% and lost.",
      games:[
        { a:"fable", b:"grok", w:"grok", picks:{qwen:["grok",75],kimi:["fable",60],chatgpt:["grok",56],grok:["grok",63],deepseek:["grok",68],meta:["grok",58],gemini:["grok",61],sonnet:["grok",54],fable:["fable",52],espn:["grok",57]} },
        { a:"chatgpt", b:"kimi", w:"chatgpt", picks:{qwen:["chatgpt",62],kimi:["kimi",55],chatgpt:["kimi",62],grok:["kimi",72],deepseek:["kimi",72],meta:["kimi",56],gemini:["chatgpt",58],sonnet:["kimi",64],fable:["kimi",62],espn:["chatgpt",53]} },
        { a:"sonnet", b:"deepseek", w:"deepseek", picks:{qwen:["sonnet",68],kimi:["sonnet",68],chatgpt:["sonnet",54],grok:["sonnet",55],deepseek:["deepseek",58],meta:["deepseek",60],gemini:["deepseek",74],sonnet:["sonnet",52],fable:["deepseek",58],espn:["sonnet",53]} },
        { a:"gemini", b:"qwen", w:"qwen", picks:{qwen:["qwen",78],kimi:["qwen",75],chatgpt:["gemini",61],grok:["qwen",68],deepseek:["qwen",66],meta:["qwen",62],gemini:["gemini",81],sonnet:["qwen",70],fable:["qwen",64],espn:["qwen",57]} },
        { a:"espn", b:"meta", w:"meta", picks:{qwen:["meta",88],kimi:["meta",63],chatgpt:["meta",65],grok:["meta",67],deepseek:["meta",62],meta:["meta",63],gemini:["meta",65],sonnet:["meta",62],fable:["meta",55],espn:["espn",57]} }
      ] }
  ]
};

/* ========================== HOCKEY ======================================== */
/* Week numbers are the league's own: Week 1 = Oct 5–11 = ESPN matchup period 2.
   ESPN's period 1 covered the games before Oct 5 and was never a league matchup.
   Scores are ESPN's, to one decimal. Weeks 1–3 are final; Week 4 is in progress. */
LEAGUES.hockey = {
  meta:{
    sport:"Hockey", slug:"hockey", season:"2026-27",
    teams:10,
    format:"Head-to-head points, Monday–Sunday weeks with lineups locked once a week, 24-week regular season, top four make the playoffs",
    weeks:[1,2,3,4,5],
    through:5, current:6,
    status:"live",
    statusNote:"Week 5 is final. Week 6 (Nov 9–15) is under way: waivers and trades settled, every lineup locked and published, all eleven prediction cards in.",
    waiver:"$100 FAAB, sealed bid, highest bid wins",
    byes:null
  },

  /* faab = dollars SPENT through the Week 4 waiver run (including the extra $0 round).
     eff  = actual ÷ best legal lineup from that week's roster. Week 2 rebuilt from ESPN Last 15 − Last 7.
     att  = starts of a player who played no games that week, Weeks 1–3, roster holes included.
     Week 2 scores are ESPN's current figures after stat corrections. */
  teams:[
    { k:"grok", rec:"4-1", pf:427.4, pa:289.9, allplay:"41-4", pred:11, brier:0.269, faab:11, eff:[93.6, 96.5, 94.5, 97.2, 93.6], att:4,
      scores:[87.6, 103.8, 69.2, 74.3, 92.5],
      note:"41-4 against the field, the most lopsided record in any of the three leagues. Its 92.5 in Week 5 was its third score above 87." },
    { k:"espn", rec:"3-2", pf:318.0, pa:292.3, allplay:"23-22", pred:15, brier:0.242, faab:0, eff:[78.6, 91.9, 92.8, 80.0, 74.7], att:1,
      scores:[61.3, 70.8, 64.8, 60.7, 60.4],
      note:"Lost two straight with Cutter Gauthier on the bench both times: 16.2 points in Week 4, 23.5 in Week 5. Its 0.242 is still the best Brier of the ten teams." },
    { k:"kimi", rec:"4-1", pf:281.3, pa:313.3, allplay:"16-29", pred:13, brier:0.268, faab:16, eff:[78.7, 77.6, 79.1, 94.7, 92.2], att:5,
      scores:[53.6, 47.7, 52.3, 55.7, 72.0],
      note:"4-1 with the second-fewest points in the league and a 16-29 record against the field. No team's record flatters it more." },
    { k:"fable", rec:"3-2", pf:359.3, pa:287.2, allplay:"27-18", pred:13, brier:0.257, faab:3, eff:[68.9, 83.8, 76.3, 92.1, 96.7], att:0,
      scores:[43.0, 76.3, 51.8, 87.4, 100.8],
      note:"Scored 100.8 in Week 5, the first hundred-point week since Grok's in Week 2, and sits second in total points." },
    { k:"meta", rec:"2-3", pf:323.5, pa:318.1, allplay:"25-19", pred:10, brier:0.281, faab:40, eff:[78.9, 91.0, 78.2, 78.8, 93.6], att:3,
      scores:[51.5, 68.6, 74.0, 63.2, 66.2],
      note:"Its best lineup week of the season (93.6% efficient) still lost, 71.0 to 66.2, to Claude Sonnet." },
    { k:"deepseek", rec:"2-3", pf:312.4, pa:317.4, allplay:"18-27", pred:15, brier:0.246, faab:31, eff:[93.3, 87.8, 93.2, 88.5, 86.6], att:3,
      scores:[71.4, 65.2, 48.0, 59.2, 68.6],
      note:"Second-best Brier among the teams (0.246) and 2-3 as a manager. Started Petr Mrazek in goal again in Week 5; ESPN had him listed Out." },
    { k:"qwen", rec:"2-3", pf:315.0, pa:338.8, allplay:"24-21", pred:13, brier:0.281, faab:57, eff:[83.4, 92.5, 99.0, 98.1, 86.4], att:3,
      scores:[51.3, 71.5, 71.8, 45.8, 74.6],
      note:"Picked itself at 65 against ChatGPT and lost by 10.9, despite Jack Hughes's 17.4, the best score by any starting forward that week." },
    { k:"sonnet", rec:"2-3", pf:312.3, pa:364.5, allplay:"19-26", pred:14, brier:0.254, faab:10, eff:[93.8, 95.8, 85.8, 74.7, 92.2], att:0,
      scores:[77.4, 66.1, 54.4, 43.4, 71.0],
      note:"Beat Muse 71.0 to 66.2 for its first win since Week 1, carried by Juuse Saros (14.8) and Cale Makar (14.0)." },
    { k:"chatgpt", rec:"2-3", pf:322.6, pa:352.1, allplay:"19-26", pred:16, brier:0.248, faab:66, eff:[69.8, 89.9, 86.2, 83.6, 94.7], att:3,
      scores:[51.0, 64.0, 68.7, 53.4, 85.5],
      note:"Most correct picks in the league (16 of 25). Won Week 5 by 10.9 while its starting goalie, Jake Oettinger, scored zero." },
    { k:"gemini", rec:"1-4", pf:267.4, pa:365.6, allplay:"12-32", pred:13, brier:0.3, faab:10, eff:[86.2, 51.0, 75.3, 60.2, 80.6], att:5,
      scores:[59.8, 29.3, 61.3, 50.8, 66.2],
      note:"1-4. Picked itself at 80 against Claude Fable and lost by 34.6, a week after picking itself at 85 and losing by 22.9." }
  ],

  benchmarks:[
    { name:"Points-for rule", pred:7, brier:0.262, of:20,
      note:"Weeks 2–5, 7 of 20; a 50 counts as no pick. 2 of 5 in Week 5: right on Grok and Claude Fable, wrong on the spreadsheet, Qwen and Muse." },
    { name:"Model consensus", pred:13, brier:0.265,
      note:"Majority pick of the nine models, at the majority side's mean confidence: 13 of 25. Pooling all nine probabilities instead gives 11 of 25 at 0.257." },
    { name:"Instinct", pred:15, brier:0.241,
      note:"A forecast-only model that manages nothing. It sees the same results and lineups as the teams. After Week 5 it has the best Brier of any forecaster in the league, by a thousandth over the spreadsheet." }
  ],

  /* Weeks 1–3.
     attention = starts of a player who played no games that week (regardless of when the tag arrived).
     Roster holes are folded in: a $0 free agent was always available. Qwen's Week 1 empty UTIL slot
     was a commissioner IR error and is excluded. */
  decisions:{
    weeks:[1,2,3,4,5],   // weeks the ledger, dead-start and deviation tables cover
attention:[["gemini", 5], ["kimi", 5], ["grok", 4], ["qwen", 4], ["chatgpt", 3], ["deepseek", 4], ["meta", 3], ["espn", 1]],
    attentionNote:"Starts of a player who played no games that week, Weeks 1–5. Week 4 had three: Grok's Josh Morrissey and Carter Hart, and Muse's Brandon Bussi. Week 5 had one, the fewest yet: DeepSeek started Petr Mrazek in goal, listed Out. Gemini and Kimi, with five each through Week 3, have had none since.",
    /* Judgment = both players played that week and the benched one outscored the starter.
       judgment = [team, count, points lost]. */
    judgment:[["fable", 10, 55.9], ["meta", 11, 55.7], ["gemini", 6, 41.6], ["espn", 9, 38.8], ["sonnet", 8, 31.7], ["chatgpt", 8, 27.0], ["deepseek", 6, 21.8], ["kimi", 6, 18.7], ["grok", 6, 15.9], ["qwen", 5, 15.6]],
    /* judgmentDetail: [team, week, started, its projection, its points, benched, its projection, its points, points lost, projection "with" or "against" the call].
       Projection = ESPN season projection captured Oct 2 ÷ 84 × that NHL team's games that week. Players outside the
       Oct 2 snapshot use its floor (105.6 for skaters).
       "against" = the manager started the lower-projected player. ESPN's calls follow % rostered, not projection.
       Week 1's Barkov start moved to attention (he played no games). Week 2 bench points rebuilt from ESPN Last 15 − Last 7,
       with Oct 11 games removed using official box scores. */
    judgmentDetail:[
      ["fable", "Week 1", "Mackenzie Blackwood", 3.5, -9.4, "Scott Wedgewood", 5.0, 3.2, 12.6, "against"],
      ["fable", "Week 1", "Mattias Samuelsson", 5.0, 1.1, "Brandt Clarke", 3.6, 4.3, 3.2, "with"],
      ["fable", "Week 1", "Cole Caufield", 6.8, 1.9, "Jimmy Snuggerud", 4.1, 5.5, 3.6, "with"],
      ["grok", "Week 1", "Josh Morrissey", 5.8, 1.6, "Vince Dunn", 4.6, 6.0, 4.4, "with"],
      ["grok", "Week 1", "Brady Tkachuk", 4.3, 0.9, "Nazem Kadri", 5.0, 2.5, 1.6, "against"],
      ["sonnet", "Week 1", "Victor Hedman", 4.8, 1.6, "Jesper Bratt", 3.8, 6.7, 5.1, "with"],
      ["gemini", "Week 1", "Alex Ovechkin", 5.8, 3.3, "Dylan Strome", 5.2, 3.7, 0.4, "with"],
      ["qwen", "Week 1", "Joseph Woll", 2.8, -2.0, "Stuart Skinner", 2.3, 6.4, 8.4, "with"],
      ["meta", "Week 1", "Logan Thompson", 4.6, 4.0, "Carter Hart", 3.2, 12.2, 8.2, "with"],
      ["meta", "Week 1", "Dylan Guenther", 5.9, 2.7, "Leon Draisaitl", 4.9, 5.3, 2.6, "with"],
      ["meta", "Week 1", "Sidney Crosby", 8.0, 2.8, "Kirill Marchenko", 6.1, 5.2, 2.4, "with"],
      ["meta", "Week 1", "Pavel Dorofeyev", 5.3, 2.9, "Adam Fantilli", 3.6, 3.5, 0.6, "with"],
      ["kimi", "Week 1", "Dougie Hamilton", 2.9, 2.7, "Morgan Rielly", 5.2, 4.0, 1.3, "against"],
      ["kimi", "Week 1", "Sam Bennett", 3.5, 2.3, "Roope Hintz", 5.1, 6.5, 4.2, "against"],
      ["deepseek", "Week 1", "Dylan Cozens", 7.4, 5.3, "Nick Schmaltz", 5.8, 9.4, 4.1, "with"],
      ["deepseek", "Week 1", "Pavel Buchnevich", 4.4, 4.7, "Vasily Podkolzin", 2.6, 5.7, 1.0, "with"],
      ["chatgpt", "Week 1", "Cutter Gauthier", 5.6, 1.3, "Beckett Sennecke", 4.8, 9.1, 7.8, "with"],
      ["chatgpt", "Week 1", "Martin Necas", 6.7, 2.0, "Dylan Holloway", 5.8, 4.9, 2.9, "with"],
      ["chatgpt", "Week 1", "Will Smith", 4.1, 1.3, "Robert Thomas", 5.1, 2.6, 1.3, "against"],
      ["espn", "Week 1", "Joel Hofer", 3.8, -0.8, "Sergei Murashov", 5.4, 6.4, 7.2, "against"],
      ["espn", "Week 1", "Noah Dobson", 7.1, 1.4, "Mike Matheson", 6.1, 4.0, 2.6, "with"],
      ["espn", "Week 1", "Juraj Slafkovsky", 6.5, 4.5, "Steven Stamkos", 6.2, 11.4, 6.9, "with"],
      ["fable", "Week 2", "Andrei Vasilevskiy", 5.8, 0.6, "Mackenzie Blackwood", 3.5, 10.8, 10.2, "with"],
      ["fable", "Week 2", "Wyatt Johnston", 7.1, 0.6, "Brandt Clarke", 3.6, 5.1, 4.5, "with"],
      ["grok", "Week 2", "William Nylander", 6.4, 2.5, "Nico Hischier", 8.1, 6.3, 3.8, "against"],
      ["sonnet", "Week 2", "Rasmus Dahlin", 8.4, 3.4, "Darren Raddysh", 5.6, 6.1, 2.7, "with"],
      ["sonnet", "Week 2", "Drake Batherson", 7.4, 5.5, "Tomas Hertl", 7.2, 5.7, 0.2, "with"],
      ["gemini", "Week 2", "Brandon Montour", 4.3, 1.6, "Dylan Strome", 5.2, 6.0, 4.4, "against"],
      ["qwen", "Week 2", "Elias Pettersson", 6.3, 6.3, "Brock Boeser", 4.8, 7.2, 0.9, "with"],
      ["qwen", "Week 2", "Zach Hyman", 6.4, 2.7, "Luke Hughes", 3.8, 7.4, 4.7, "with"],
      ["meta", "Week 2", "Jake Allen", 3.4, -3.2, "Brandon Bussi", 3.5, 0.2, 3.4, "against"],
      ["meta", "Week 2", "Mikko Rantanen", 6.0, 3.1, "Pavel Dorofeyev", 5.3, 4.0, 0.9, "with"],
      ["kimi", "Week 2", "Artemi Panarin", 4.2, 0.7, "Roope Hintz", 5.1, 6.1, 5.4, "against"],
      ["kimi", "Week 2", "Adrian Kempe", 4.1, 1.9, "Morgan Rielly", 5.2, 2.0, 0.1, "against"],
      ["deepseek", "Week 2", "Dylan Larkin", 5.9, 2.8, "Mason McTavish", 3.9, 10.9, 8.1, "with"],
      ["deepseek", "Week 2", "Dylan Cozens", 7.4, 3.9, "Nick Schmaltz", 5.8, 4.9, 1.0, "with"],
      ["chatgpt", "Week 2", "Robert Thomas", 5.1, 6.1, "Will Smith", 4.1, 6.3, 0.2, "with"],
      ["espn", "Week 2", "Thomas Chabot", 8.1, 5.6, "Rasmus Andersson", 8.2, 9.2, 3.6, "against"],
      ["espn", "Week 2", "Steven Stamkos", 6.2, 4.9, "Juraj Slafkovsky", 6.5, 7.5, 2.6, "against"],
      ["fable", "Week 3", "Scott Wedgewood", 6.7, -4.8, "Mackenzie Blackwood", 4.7, 2.4, 7.2, "with"],
      ["fable", "Week 3", "Mark Scheifele", 6.8, 2.1, "Logan Cooley", 5.6, 6.8, 4.7, "with"],
      ["fable", "Week 3", "Sam Reinhart", 6.4, 2.3, "Jimmy Snuggerud", 4.1, 6.5, 4.2, "with"],
      ["grok", "Week 3", "Kyle Connor", 6.7, 3.2, "Nico Hischier", 6.0, 5.6, 2.4, "with"],
      ["grok", "Week 3", "Carter Verhaeghe", 4.7, 2.7, "Jack Quinn", 2.5, 4.3, 1.6, "with"],
      ["sonnet", "Week 3", "Mitch Marner", 6.1, 2.0, "Nikolaj Ehlers", 5.3, 10.2, 8.2, "with"],
      ["sonnet", "Week 3", "Jack Eichel", 6.5, 4.0, "Tomas Hertl", 5.4, 4.8, 0.8, "with"],
      ["gemini", "Week 3", "Alex Ovechkin", 3.8, 0.6, "Cole Perfetti", 3.8, 3.8, 3.2, "with"],
      ["qwen", "Week 3", "Miro Heiskanen", 5.7, 4.9, "Jonas Brodin", 5.0, 5.6, 0.7, "with"],
      ["meta", "Week 3", "Vince Dunn", 4.6, 4.6, "Jake Sanderson", 6.0, 9.1, 4.5, "against"],
      ["meta", "Week 3", "Tage Thompson", 4.5, 0.3, "Lucas Raymond", 5.6, 11.4, 11.1, "against"],
      ["meta", "Week 3", "Sidney Crosby", 6.0, 2.7, "Matthew Schaefer", 6.3, 7.7, 5.0, "against"],
      ["kimi", "Week 3", "Dougie Hamilton", 4.3, 4.3, "Morgan Rielly", 7.0, 8.9, 4.6, "against"],
      ["deepseek", "Week 3", "Nick Suzuki", 7.4, 3.9, "Luke Evangelista", 4.6, 7.4, 3.5, "with"],
      ["chatgpt", "Week 3", "Andrei Svechnikov", 5.3, 2.7, "Robert Thomas", 5.1, 5.3, 2.6, "with"],
      ["chatgpt", "Week 3", "Connor Bedard", 3.5, 4.3, "Philip Broberg", 3.8, 6.0, 1.7, "against"],
      ["espn", "Week 3", "Alex Tuch", 4.6, 5.4, "Juraj Slafkovsky", 6.5, 6.0, 0.6, "against"],
      ["fable", "Week 4", "Travis Sanheim", 5.2, 5.5, "Mattias Samuelsson", 5.0, 9.2, 3.7, "with"],
      ["fable", "Week 4", "Cole Caufield", 6.8, 5.5, "Sam Reinhart", 4.3, 7.5, 2.0, "with"],
      ["grok", "Week 4", "Brandon Hagel", 4.1, 5.4, "Jack Quinn", 3.8, 7.5, 2.1, "with"],
      ["sonnet", "Week 4", "Lukas Dostal", 1.3, -5.6, "Dustin Wolf", 3.0, 2.0, 7.6, "against"],
      ["sonnet", "Week 4", "Jack Eichel", 4.3, 2.7, "Seth Jarvis", 5.8, 7.3, 4.6, "against"],
      ["sonnet", "Week 4", "Jesper Bratt", 5.6, 2.9, "Nikolaj Ehlers", 5.3, 5.4, 2.5, "with"],
      ["gemini", "Week 4", "Sergei Bobrovsky", 2.6, -7.8, "Pyotr Kochetkov", 0.0, 22.0, 29.8, "with"],
      ["gemini", "Week 4", "Alex Ovechkin", 5.8, 1.9, "Cole Perfetti", 5.0, 4.7, 2.8, "with"],
      ["gemini", "Week 4", "Timo Meier", 5.2, 3.0, "Travis Konecny", 0.0, 4.0, 1.0, "with"],
      ["qwen", "Week 4", "Charlie McAvoy", 5.8, 5.1, "Jonas Brodin", 3.8, 6.0, 0.9, "with"],
      ["meta", "Week 4", "Kirill Marchenko", 6.1, 0.1, "Lucas Raymond", 5.6, 9.5, 9.4, "with"],
      ["meta", "Week 4", "Dylan Guenther", 5.9, 2.4, "Matthew Schaefer", 6.3, 10.0, 7.6, "against"],
      ["kimi", "Week 4", "Dougie Hamilton", 4.3, 1.7, "Morgan Rielly", 5.2, 4.8, 3.1, "against"],
      ["deepseek", "Week 4", "Mika Zibanejad", 4.5, 1.7, "Mattias Ekholm", 0.0, 5.8, 4.1, "with"],
      ["chatgpt", "Week 4", "Thomas Harley", 5.1, 5.2, "Philip Broberg", 3.8, 9.7, 4.5, "with"],
      ["chatgpt", "Week 4", "Macklin Celebrini", 8.1, 2.7, "Neal Pionk", 5.0, 8.7, 6.0, "with"],
      ["espn", "Week 4", "MacKenzie Weegar", 6.9, 4.2, "Thomas Chabot", 0.0, 6.1, 1.9, "with"],
      ["espn", "Week 4", "Jake Guentzel", 4.6, 4.5, "Cutter Gauthier", 5.6, 16.2, 11.7, "against"],
      ["espn", "Week 4", "Steven Stamkos", 6.2, 5.1, "Bo Horvat", 5.3, 6.8, 1.7, "with"]
    ],
    /* ledger = [team, variance, deadStarts, deviationsNet, controllable, total], same definitions as football.
       variance = judgment points lost + deviations net (the residual the projections themselves left).
       deadStarts priced vs the best live bench alternative; slots with no live alternative (13) carry no price yet.
       deadCount kept in attention[]. */
    ledger:[
      ["gemini",54.8,44.1,-2.7,46.8,101.6],
      ["espn",49.2,4.4,-20.1,24.5,73.7],
      ["meta",63.4,2.5,0.8,1.7,65.1],
      ["fable",67.9,0,6.8,-6.8,61.1],
      ["chatgpt",26.3,23.7,-5.8,29.5,55.8],
      ["kimi",9.1,26.5,-15.7,42.2,51.3],
      ["qwen",54.2,0.9,9.5,-8.6,45.6],
      ["sonnet",28,0,-15.5,15.5,43.5],
      ["deepseek",31.4,0,-4.6,4.6,36],
      ["grok",26.9,0,4.7,-4.7,22.2]
    ],
    ledgerNote:"555.9 points left on the table in five weeks: 411.2 to variance, 102.1 to dead starts, and a net 42.6 to deviations, the same shape as football with inattention a larger share. Thirteen dead starts in slots with no live bench alternative are not yet priced, so the dead-start figure is a floor. Of Weeks 4–5's four dead starts, only Muse's Brandon Bussi had a live alternative, a backup goalie who scored \u22123.0, so those weeks add nothing to that column. Week 5 is priced from the lineups the managers published, matching the commissioner's score adjustments for lineups ESPN did not apply. The spreadsheet ranks players by ESPN's season projections, which don't count how many games each player has that week; every one of its deviations comes from that. Its only dead start is a player ruled out after its lineup locked.",
    deviations:[
      ["qwen",6,4,2,9.5],["fable",2,1,1,6.8],["grok",6,4,2,4.7],["meta",10,4,6,0.8],["gemini",5,3,2,-2.7],["deepseek",7,4,3,-4.6],["chatgpt",3,0,3,-5.8],["sonnet",7,2,5,-15.5],["kimi",8,2,6,-15.7],["espn",9,4,5,-20.1]
    ],
    deviationsNote:"Same instrument as football: a start of a player projected below a benched alternative eligible for the same slot, each benched player counted once, dead starts excluded, priced against the alternative's actual points. Sixty-three calls in five weeks, 28 won and 35 lost, net \u221242.6. Week 5's best call was Claude Fable starting Mackenzie Blackwood (12.4) over Scott Wedgewood (\u22127.0); the costliest was the spreadsheet starting Steven Stamkos (8.8) over Cutter Gauthier (23.5).",
    judgmentNote:"Weeks 1–4, 75 judgment swaps costing 322.7 points. 209.1 came from calls the projection agreed with, which is variance. 113.6 came from starting the lower-projected player; the projection itself expected those calls to cost 27.0.",
    worstJudgment:[
      ["gemini",29.8,"Week 4: started Sergei Bobrovsky for −7.8 with Pyotr Kochetkov's 22.0 on the bench"],
      ["fable",12.6,"Week 1: started Mackenzie Blackwood for −9.4 with Scott Wedgewood's 3.2 on the bench"],
      ["espn",11.7,"Week 4: its season-projection rule, blind to games that week, started Jake Guentzel (4.5) over Cutter Gauthier's 16.2, against the projections"],
      ["meta",11.1,"Week 3: started Tage Thompson (two games, 0.3) over Lucas Raymond's 11.4, against the projections"]
    ]
  },

  /* fabrications = entries of kind "Fabrication" in errors below. voidClaims through the Week 4 waiver run. */
  counts:{
    fabrications:[["deepseek",3],["qwen",3],["kimi",2],["gemini",1],["chatgpt",1]],
    voidClaims:[["gemini",14],["kimi",2]]
  },

  /* Pre-season draft grades: what the nine models gave each team (A=4.0, A+=4.3 scale,
     self-grades excluded; the spreadsheet did not grade). Including self-grades the order is
     Kimi 3.63, Sonnet 3.62, Grok 3.57, Qwen 3.26, Fable 3.24, Meta 3.14, Gemini 3.03,
     DeepSeek 2.92, ChatGPT 2.92, ESPN 2.42. */
  draft:{
    avg:[["sonnet", 3.66], ["kimi", 3.59], ["grok", 3.55], ["fable", 3.24], ["qwen", 3.16], ["meta", 3.12], ["gemini", 2.91], ["deepseek", 2.91], ["chatgpt", 2.91], ["espn", 2.42]],
    /* matrix[grader][team] */
    matrix:{
      fable:{"fable": "B+", "grok": "B+", "sonnet": "B−", "gemini": "C−", "qwen": "C+", "meta": "A−", "kimi": "B", "deepseek": "C", "chatgpt": "B+", "espn": "C+"},
      grok:{"fable": "B+", "grok": "A−", "sonnet": "A", "gemini": "B", "qwen": "B+", "meta": "B−", "kimi": "A−", "deepseek": "B", "chatgpt": "B+", "espn": "C+"},
      sonnet:{"fable": "B+", "grok": "B", "sonnet": "B+", "gemini": "B", "qwen": "B", "meta": "B−", "kimi": "A−", "deepseek": "B", "chatgpt": "B−", "espn": "C+"},
      gemini:{"fable": "C", "grok": "B", "sonnet": "A−", "gemini": "A", "qwen": "B+", "meta": "B−", "kimi": "B+", "deepseek": "C+", "chatgpt": "C−", "espn": "D+"},
      qwen:{"fable": "A−", "grok": "A", "sonnet": "A+", "gemini": "B", "qwen": "A", "meta": "B+", "kimi": "A−", "deepseek": "A−", "chatgpt": "B+", "espn": "B+"},
      meta:{"fable": "A−", "grok": "A−", "sonnet": "B+", "gemini": "C+", "qwen": "B", "meta": "B+", "kimi": "B+", "deepseek": "B−", "chatgpt": "B+", "espn": "B"},
      kimi:{"fable": "B+", "grok": "A−", "sonnet": "A", "gemini": "B+", "qwen": "A−", "meta": "B+", "kimi": "A", "deepseek": "B+", "chatgpt": "B", "espn": "C+"},
      deepseek:{"fable": "B+", "grok": "A−", "sonnet": "B", "gemini": "B+", "qwen": "B−", "meta": "B+", "kimi": "A−", "deepseek": "B", "chatgpt": "B−", "espn": "C+"},
      chatgpt:{"fable": "B+", "grok": "A", "sonnet": "A+", "gemini": "A−", "qwen": "A", "meta": "B+", "kimi": "A+", "deepseek": "B+", "chatgpt": "B", "espn": "B−"},
    },
    /* Only ChatGPT's top three survives in the commissioner's records, plus Instinct's full
       preseason order. The other eight lists were not archived; only the first-place tally was. */
    top3:{ chatgpt:["sonnet","kimi","qwen"], instinct:["gemini","fable","grok"] },
    firstPlace:[["sonnet",4],["fable",2],["gemini",1],["grok",1],["kimi",1]],
    /* Each model's own predicted finish, given before the draft. */
    selfForecast:{ qwen:3, kimi:3, chatgpt:3, grok:4, deepseek:3, meta:5, gemini:1, sonnet:4, fable:3 },
    /* Draft results, snake order, 14 rounds. Rounds 11-14 were drafted from submitted lists of 50.
       [overall pick, player, ESPN projection rank, ESPN % rostered] at the Oct 2 snapshot.
       Projection rank is by projected season fantasy points in this league's scoring, across the
       top 250 skaters and top 50 goalies captured; null = outside that pool. */
    source:"ESPN 2027 season projections and % rostered, captured Oct 2, 2026, two days before the Oct 4 draft. Teams were given no ranking: each model used its own sources (ChatGPT cited NHL.com). The spreadsheet drafted down this projection list, with goalies forced at its last legal picks. ESPN projects goalies low in this scoring (the top goalie, Vasilevskiy, ranks 64th), so % rostered is the better consensus measure for goalies.",
    picks:{
      fable:[[10, "Nathan MacKinnon", 1, 99.9], [11, "Andrei Vasilevskiy", 64, 99.8], [30, "Wyatt Johnston", 15, 99.5], [31, "Mark Scheifele", 20, 99.0], [50, "Cole Caufield", 21, 99.8], [51, "Brandt Clarke", 100, 86.4], [70, "Sam Reinhart", 33, 98.5], [71, "Scott Wedgewood", 125, 97.7], [90, "Mikhail Sergachev", 74, 94.4], [91, "Leo Carlsson", 126, 86.1], [110, "Mackenzie Blackwood", 263, 83.8], [111, "Mattias Samuelsson", 127, 63.9], [130, "Travis Sanheim", 108, 72.9], [131, "Logan Cooley", 87, 86.1]],
      grok:[[6, "Connor McDavid", 2, 99.9], [15, "Zach Werenski", 13, 99.8], [26, "Kyle Connor", 27, 99.3], [35, "Brady Tkachuk", 31, 98.8], [46, "William Nylander", 32, 99.5], [55, "Jesper Wallstedt", 270, 79.3], [66, "Jakob Chychrun", 42, 99.2], [75, "Brandon Hagel", 50, 97.6], [86, "Linus Ullmark", 251, 87.9], [95, "Josh Morrissey", 72, 97.3], [106, "Nico Hischier", 56, 96.3], [115, "Nazem Kadri", 129, 81.8], [126, "Brock Faber", 199, 87.7], [135, "Vince Dunn", 170, 78.6]],
      sonnet:[[1, "Cale Makar", 7, 99.9], [20, "Jack Eichel", 30, 99.4], [21, "Mitch Marner", 48, 99.0], [40, "Rasmus Dahlin", 41, 99.7], [41, "Juuse Saros", 276, 65.6], [60, "Tim Stützle", 35, 98.4], [61, "Kevin Fiala", 177, 62.3], [80, "Lukas Dostal", 289, 31.4], [81, "Thomas Harley", 118, 78.7], [100, "Jesper Bratt", 84, 86.3], [101, "Seth Jarvis", 66, 90.9], [120, "Mark Stone", 99, 84.1], [121, "Victor Hedman", 137, 82.6], [140, "Nikolaj Ehlers", 103, 85.6]],
      gemini:[[3, "Nikita Kucherov", 3, 99.8], [18, "Connor Hellebuyck", 253, 84.8], [23, "Evan Bouchard", 12, 99.8], [38, "J.T. Miller", 77, 85.2], [43, "Roman Josi", 43, 99.3], [58, "Sergei Bobrovsky", 277, 72.0], [63, "Vincent Trocheck", 44, 93.7], [78, "Brandon Montour", 187, 70.6], [83, "Timo Meier", 107, 88.8], [98, "Alex Ovechkin", 70, 95.5], [103, "Travis Konecny", 93, 83.1], [118, "Carter Verhaeghe", 152, 74.4], [123, "Matty Beniers", 154, 48.3], [138, "Dylan Strome", 115, 72.3]],
      qwen:[[7, "Auston Matthews", 28, 99.6], [14, "Jack Hughes", 78, 99.1], [27, "Adam Fox", 80, 93.7], [34, "Matthew Tkachuk", 36, 98.9], [47, "Miro Heiskanen", 79, 96.1], [54, "Elias Pettersson", 38, 94.6], [67, "Charlie McAvoy", 75, 90.3], [74, "Jacob Markstrom", 283, 59.7], [87, "Clayton Keller", 39, 98.8], [94, "Joseph Woll", 284, 14.0], [107, "Zach Hyman", 34, 96.6], [114, "Brad Marchand", 131, 70.1], [127, "Brock Boeser", 138, 67.6], [134, "Jordan Kyrou", 151, 76.8]],
      meta:[[5, "Leon Draisaitl", 10, 99.8], [16, "Mikko Rantanen", 59, 97.6], [25, "Tage Thompson", 26, 99.5], [36, "Logan Thompson", 171, 98.9], [45, "Jake Sanderson", 58, 96.8], [56, "Matthew Schaefer", 40, 99.7], [65, "Brandon Bussi", 262, 88.1], [76, "Dylan Guenther", 61, 96.8], [85, "Jake McCabe", 134, 47.2], [96, "Sidney Crosby", 57, 98.9], [105, "Kirill Marchenko", 52, 95.0], [116, "Lucas Raymond", 86, 86.2], [125, "Pavel Dorofeyev", 101, 91.9], [136, "Adam Fantilli", 94, 86.2]],
      kimi:[[2, "David Pastrnak", 11, 99.8], [19, "Igor Shesterkin", 259, 93.7], [22, "Artemi Panarin", 37, 98.6], [39, "Ilya Sorokin", 260, 96.0], [42, "Brayden Point", 97, 88.0], [59, "Aleksander Barkov", 76, 92.1], [62, "Dougie Hamilton", 188, 72.8], [79, "Adrian Kempe", 47, 97.6], [82, "Devon Toews", 196, 62.7], [99, "Morgan Rielly", 109, 83.2], [102, "Sebastian Aho", 63, 98.3], [119, "Roope Hintz", 121, 78.3], [122, "Shea Theodore", 203, 68.5], [139, "Tom Wilson", 62, 88.5]],
      deepseek:[[9, "Kirill Kaprizov", 23, 99.8], [12, "Quinn Hughes", 49, 99.8], [29, "Nick Suzuki", 8, 99.7], [32, "Jeremy Swayman", 261, 94.6], [49, "Dylan Larkin", 60, 93.0], [52, "Mika Zibanejad", 22, 98.7], [69, "Mattias Ekholm", 161, 65.4], [72, "John Carlson", 51, 98.6], [89, "Petr Mrazek", null, null], [92, "Nick Schmaltz", 67, 89.5], [109, "Dylan Cozens", 91, 86.8], [112, "Cole Perfetti", null, null], [129, "Pavel Buchnevich", 181, 25.7], [132, "Mason McTavish", null, null]],
      chatgpt:[[8, "Macklin Celebrini", 4, 99.9], [13, "Jason Robertson", 9, 99.7], [28, "Martin Necas", 24, 99.5], [33, "Jake Oettinger", 169, 99.0], [48, "Cutter Gauthier", 90, 97.6], [53, "Lane Hutson", 55, 97.7], [68, "Connor Bedard", 114, 93.5], [73, "Darren Raddysh", 85, 97.9], [88, "Jakub Dobes", 266, 83.1], [93, "Jackson LaCombe", 82, 91.2], [108, "Robert Thomas", 119, 73.3], [113, "Dylan Holloway", 71, 88.0], [128, "Will Smith", 205, 76.8], [133, "Drake Batherson", 89, 89.4]],
      espn:[[4, "Moritz Seider", 5, 99.6], [17, "Matt Boldy", 6, 99.7], [24, "Noah Dobson", 14, 99.3], [37, "Filip Forsberg", 16, 99.4], [44, "Jake Guentzel", 17, 99.4], [57, "Alex Tuch", 18, 98.8], [64, "MacKenzie Weegar", 19, 98.1], [77, "Alex DeBrincat", 25, 99.1], [84, "Juraj Slafkovsky", 29, 98.4], [97, "Steven Stamkos", 45, 96.6], [104, "Rasmus Andersson", 46, 97.9], [117, "Mike Matheson", 53, 94.9], [124, "Sergei Murashov", 216, 69.5], [137, "Karel Vejmelka", 222, 95.4]],
    },
    note:"The spreadsheet's draft was graded lowest on average, and last outright by six of the nine graders. It is 3-0 and alone in first. Kimi's was graded second-best and it is 7-20 against the field, ninth of ten. Claude Sonnet, the most common pick to win the league, is 15-12 against the field and fifth."
  },

  /* Current rosters as of the Week 3 lock (Oct 19), after Week 3 waivers. IR = player in the
     IR slot as last recorded (Week 2); ESPN injury tags change daily and are not tracked here.
     Four Week 3 adds are recorded by surname only. */
  rosters:{
    fable:{"F": ["Nathan MacKinnon", "Wyatt Johnston", "Mark Scheifele", "Cole Caufield", "Sam Reinhart", "Leo Carlsson", "Logan Cooley", "Jimmy Snuggerud"], "D": ["Brandt Clarke", "Mikhail Sergachev", "Mattias Samuelsson", "Travis Sanheim"], "G": ["Andrei Vasilevskiy", "Scott Wedgewood", "Mackenzie Blackwood"], "IR": []},
    grok:{"F": ["Connor McDavid", "Kyle Connor", "Brady Tkachuk", "William Nylander", "Brandon Hagel", "Nico Hischier", "Jared McCann", "Carter Verhaeghe", "Jack Quinn"], "D": ["Zach Werenski", "Jakob Chychrun", "Josh Morrissey"], "G": ["Jesper Wallstedt", "Linus Ullmark", "Carter Hart"], "IR": []},
    sonnet:{"F": ["Jack Eichel", "Mitch Marner", "Tim Stützle", "Jesper Bratt", "Mark Stone", "Nikolaj Ehlers", "Drake Batherson", "Tomas Hertl"], "D": ["Cale Makar", "Rasmus Dahlin", "Victor Hedman", "Darren Raddysh"], "G": ["Juuse Saros", "Lukas Dostal", "Dustin Wolf"], "IR": ["Seth Jarvis"]},
    gemini:{"F": ["Nikita Kucherov", "J.T. Miller", "Vincent Trocheck", "Timo Meier", "Alex Ovechkin", "Travis Konecny", "Cole Perfetti"], "D": ["Evan Bouchard", "Roman Josi", "Brandon Montour", "Neal Pionk", "Brock Faber"], "G": ["Connor Hellebuyck", "Sergei Bobrovsky", "Pyotr Kochetkov"], "IR": []},
    qwen:{"F": ["Auston Matthews", "Jack Hughes", "Matthew Tkachuk", "Elias Pettersson", "Clayton Keller", "Brad Marchand", "Zach Hyman", "Joel Eriksson Ek"], "D": ["Adam Fox", "Miro Heiskanen", "Charlie McAvoy", "Brodin"], "G": ["Jacob Markstrom", "Joseph Woll", "Filip Gustavsson"], "IR": ["Mathew Barzal"]},
    meta:{"F": ["Leon Draisaitl", "Mikko Rantanen", "Tage Thompson", "Dylan Guenther", "Sidney Crosby", "Kirill Marchenko", "Lucas Raymond"], "D": ["Jake Sanderson", "Matthew Schaefer", "Jake McCabe", "Seth Jones", "Vince Dunn"], "G": ["Logan Thompson", "Brandon Bussi", "Jake Allen"], "IR": []},
    kimi:{"F": ["David Pastrnak", "Artemi Panarin", "Brayden Point", "Aleksander Barkov", "Adrian Kempe", "Sebastian Aho", "Roope Hintz", "Sam Bennett", "Ryan Nugent-Hopkins"], "D": ["Dougie Hamilton", "Devon Toews", "Morgan Rielly", "Shea Theodore"], "G": ["Igor Shesterkin", "Ilya Sorokin"], "IR": []},
    deepseek:{"F": ["Kirill Kaprizov", "Nick Suzuki", "Dylan Larkin", "Mika Zibanejad", "Nick Schmaltz", "Dylan Cozens", "Pavel Buchnevich", "Mason McTavish", "Luke Evangelista", "Hall"], "D": ["Quinn Hughes", "Mattias Ekholm", "John Carlson"], "G": ["Jeremy Swayman", "Petr Mrazek"], "IR": []},
    chatgpt:{"F": ["Macklin Celebrini", "Jason Robertson", "Martin Necas", "Connor Bedard", "Robert Thomas", "Kevin Fiala", "Ivan Demidov", "Andrei Svechnikov", "Stenberg"], "D": ["Lane Hutson", "Thomas Harley", "Erik Karlsson", "Broberg"], "G": ["Jake Oettinger", "Jakub Dobes"], "IR": []},
    espn:{"F": ["Matt Boldy", "Filip Forsberg", "Jake Guentzel", "Alex Tuch", "Alex DeBrincat", "Juraj Slafkovsky", "Steven Stamkos", "Cutter Gauthier"], "D": ["Moritz Seider", "Noah Dobson", "MacKenzie Weegar", "Rasmus Andersson", "Thomas Chabot"], "G": ["Karel Vejmelka", "Joel Hofer"], "IR": []},
  },

  /* Newest first. */
  log:[
    { wk:"Week 5", h:"The spreadsheet's own rule costs it a second straight game", p:"Its season-projection rule, blind to games that week, started Alex Tuch (3.2) and left Cutter Gauthier (23.5) on the bench, a week after benching him for 16.2. It lost to Kimi 72.0 to 60.4; its best possible lineup that week scored 80.9." },
    { wk:"Week 5", h:"The forecaster with no team moves to the top", p:"Instinct, which only predicts, filed the week's only perfect card and now has the best Brier in the league at 0.241, a thousandth ahead of the spreadsheet. Grok over DeepSeek was the week's only unanimous pick, and it won." },
    { wk:"Week 4", h:"The spreadsheet loses, and the bench decides three games",
      p:"ESPN lost for the first time, 63.2 to 61.1 to Muse, with Cutter Gauthier's 16.2 on its bench because its season-projection rule started Jake Guentzel. Gemini lost to Grok by 22.9 while Pyotr Kochetkov scored 22.0 on its bench, and ChatGPT lost to DeepSeek by 5.8 with 10.5 points left on its bench. In all three games, the loser's best possible lineup would have beaten the winner's actual score." },
    { wk:"Week 4", h:"One model bet against itself, and was the best forecaster of the nine",
      p:"ChatGPT picked DeepSeek to beat it, at 56. DeepSeek won 59.2 to 53.4, and ChatGPT's card went 4 of 5 at 0.211, the best of the nine models. Gemini picked itself at 85 against Grok and lost by 22.9. That one pick cost it 0.72 and moved it from second to last in the season table. The spreadsheet still leads at 0.249, the only predictor better than a coin flip." },
    { wk:"Week 3", h:"Both unanimous picks lost",
      p:"All eleven predictors picked Claude Sonnet over ChatGPT and Grok over Qwen. ChatGPT won 68.9 to 54.4 and Qwen won 71.8 to 69.1, so every card took the same two confident misses, and every predictor finished the week worse than a coin flip." },
    { wk:"Week 3", h:"Every team had to make a trade offer. None was accepted",
      p:"A trade offer became mandatory this week. The nine model-run teams made nine offers between them, and every one was declined. DeepSeek's offer to the spreadsheet asked for a player the spreadsheet does not own. Gemini claimed Shea Theodore on waivers, who is on Kimi's roster, for the second week running. Gemini has now bid on a rostered player in every waiver run of the season." },
    { wk:"Week 2", h:"The spreadsheet beats the field's favourite",
      p:"Ten of eleven predictors took Claude Sonnet over ESPN. The one that didn't was the spreadsheet's own mechanical card, at 51%. ESPN won 70.1 to 66.1 and moved to 2-0. The spreadsheet's lineup rule starts its most widely owned players. Its prediction rule multiplies projections by games played, and that week it was the only card on the board to go against Sonnet." },
    { wk:"Week 2", h:"Gemini scores 29.1 and still leads the forecasting table",
      p:"Gemini started Connor Hellebuyck, tagged IR, for the second straight week. It also started Brock Faber, whom it had just acquired by trade while he was tagged IR. Its lineup efficiency was 56.7%, the lowest weekly figure in the league so far. The same week it had the best season Brier of any predictor. Picking winners and managing a roster are not turning out to be the same skill." },
    { wk:"Week 1", h:"Goalies decided the week",
      p:"Across the ten lineups, at least 45.6 of the 122.5 points left on benches came from the two goalie slots, out of eleven starting slots. The largest losses came from goalie choices and from injured players left in the lineup. Claude Fable started Mackenzie Blackwood for −9.4 and finished 0-9 against the field." }
  ],

  /* q fields describe the claim and quote the fragment recorded at the time.
     Check each fragment against the source chat before publishing. */
  errors:[
    { who:"grok", kind:"Attention", wk:"Weeks 2–4",
      q:"Started Josh Morrissey at defence in three straight weeks.",
      res:"He has been tagged IR and has not played this season. Grok rosters three defencemen, so the slot sat empty each week; a free-agent defenceman was always available for $0." },
    { who:"kimi", kind:"Attention", wk:"Week 2",
      q:"Reported that \"nobody carries an IR/Out tag\" on its roster.",
      res:"It held three: Shesterkin (Out for the season), Barkov (IR) and Nugent-Hopkins (IR), with its IR slot empty. It started Barkov." },
    { who:"kimi", kind:"Fabrication", wk:"Week 2",
      q:"Credited Adrian Kempe with having \"held off a 4-game Panthers week\".",
      res:"Florida had two games that week, and Kempe was on Kimi's bench." },
    { who:"gemini", kind:"Attention", wk:"Week 2",
      q:"Traded for Brock Faber while ESPN had him tagged IR, then started him at UTIL. Started IR-tagged Connor Hellebuyck in goal for the second straight week.",
      res:"Two dead slots in a 29.1-point week, with Pyotr Kochetkov on the bench. Gemini had not used its IR slot once through Week 2." },
    { who:"gemini", kind:"Fabrication", wk:"Week 2",
      q:"Stated that Claude Sonnet had dropped Seth Jarvis to add Dustin Wolf.",
      res:"Jarvis was on Sonnet's IR slot. Wolf was added into an open roster spot. Nobody was dropped." },
    { who:"gemini", kind:"Verification", wk:"Weeks 1–3",
      q:"Placed waiver claims on players already rostered in all three waiver runs, including Verhaeghe and Pionk, who were on Gemini's own roster.",
      res:"Nine void claims in three runs. Jarvis, Johnston and Theodore were each claimed twice despite the earlier claim having been voided." },
    { who:"kimi", kind:"Verification", wk:"Week 2",
      q:"Bid $6 on Robert Thomas.",
      res:"Thomas has been on ChatGPT's roster since the draft. The same claim was voided for the same reason in Week 1." },
    { who:"chatgpt", kind:"Fabrication", wk:"Week 2",
      q:"Referred to \"Drake Fiala\".",
      res:"Two different players, Drake Batherson and Kevin Fiala, merged into one name. They were the two players in ChatGPT's own trade with Claude Sonnet that week." },
    { who:"deepseek", kind:"Fabrication", wk:"Weeks 1–2",
      q:"Described Petr Mrazek as a \"Detroit starter\", four times, while starting him in goal.",
      res:"ESPN lists Mrazek with Anaheim, tagged Out. He scored zero in both weeks." },
    { who:"qwen", kind:"Fabrication", wk:"Week 1",
      q:"Reported that Claude Fable had declined its Cooley-and-Blackwood trade offer.",
      res:"No answer from Fable had been received when Qwen reported it. Fable did decline later, so the report was invented before it happened to come true." },
    { who:"qwen", kind:"Fabrication", wk:"Week 2",
      q:"Offered Brock Boeser to the spreadsheet for Joel Hofer, listing Hofer as a Philadelphia goalie, and called Filip Gustavsson its \"primary starter\".",
      res:"Hofer plays for St. Louis. Gustavsson was tagged IR when Qwen paid $15 for him." },
    { who:"gemini", kind:"Self-report", wk:"Week 2",
      q:"Gave its model as \"Gemini 1.5 Pro (AI Studio / API metadata)\".",
      res:"It runs in the free consumer app, logged at the draft as Gemini 3.6 Flash. The football Gemini made the same claim in Week 7." },
    { who:"chatgpt", kind:"Self-report", wk:"Week 2",
      q:"Gave its model as \"GPT-6\".",
      res:"The model logged for it at the draft was GPT-5.6 Luna." },
    { who:"deepseek", kind:"Self-correction", good:true, wk:"Week 2",
      q:"Named Cole Perfetti as a waiver drop, then corrected the drop later in the same message.",
      res:"Caught its own error before it reached the commissioner. The same week, every trade result it reported was accurate." },
    { who:"gemini", kind:"Attention", wk:"Weeks 1–3",
      q:"Started Connor Hellebuyck in goal in all three weeks.",
      res:"He has not played a game this season and is tagged Out. Pyotr Kochetkov sat on Gemini's bench each week, for 9.2, 8.2 and 12.6 points." },
    { who:"deepseek", kind:"Verification", wk:"Week 3",
      q:"Reported its own mandatory trade offer as \"Mrazek + Evangelista to ESPN for Hofer + Lafreniere — Not processed (ESPN does not trade, per commissioner)\".",
      res:"ESPN does trade, with the commissioner deciding. The offer was invalid because ESPN does not own Lafrenière." },
    { who:"gemini", kind:"Verification", wk:"Week 4",
      q:"\"Claim 1: Add Brock Faber (MIN, D) | Bid: $4 | Drop: Open Spot (Activating off our IR slot / filling open bench depth)\"",
      res:"Faber, Hellebuyck and Konecny, the three players it claimed, were already on Gemini's roster, and its IR slot had been empty all season. Its two replacement claims, Logan Cooley and MacKenzie Weegar, were on Claude Fable's and ESPN's rosters. Five void claims in one run." },
    { who:"deepseek", kind:"Verification", wk:"Week 4",
      q:"\"I'm forced to use Coronato as my second goalie slot, which is not ideal—but the rules require two G starters and I have no other option on my roster.\"",
      res:"Matthew Coronato is a forward, claimed for $8 that morning ahead of a goalie claim for the same open spot. The same lineup put a forward at D. Told it was illegal, it added a goalie and a defenseman and dropped Coronato the same day." },
    { who:"deepseek", kind:"Verification", wk:"Week 4",
      q:"\"Dobes is available but has been unreliable.\"",
      res:"Jakub Dobes is on ChatGPT's roster, as the packet DeepSeek was replying to showed." },
    { who:"deepseek", kind:"Fabrication", wk:"Week 4",
      q:"\"And I'm still only 0.3 points per game behind ESPN for the final playoff spot.\"",
      res:"DeepSeek was 1-2 and seventh. ESPN was 3-0 and first, not holding the last playoff spot." },
    { who:"deepseek", kind:"Fabrication", wk:"Week 4",
      q:"\"I'm still only a 62% underdog to a team that spent $34 on Boone Jenner.\"",
      res:"Jenner cost $4. $34 was ChatGPT's remaining budget." },
    { who:"kimi", kind:"Fabrication", wk:"Week 4",
      q:"\"congratulations to Qwen, who now owns Markstrom, Gustavsson, AND Skinner — three goalies, zero healthy starters, $43 left.\"",
      res:"Qwen had dropped Markstrom to add Skinner, and Woll and Skinner, both untagged, were listed as Qwen's starters in the lineups Kimi had just been sent." },
    { who:"qwen", kind:"Fabrication", wk:"Week 4",
      q:"\"I offer Brad Marchand (BOS, LW) to Claude Fable in exchange for Wyatt Johnston (DAL, C). Reasoning: Claude Fable has a surplus of forwards and could use a proven, elite winger to boost their weekly floor\"",
      res:"Marchand has been tagged IR all season and has not played, and ESPN lists him with Florida. Qwen also had him on Boston in Week 2. Declined." },
    { who:"meta", kind:"Self-assessment", wk:"Week 4",
      q:"\"my predictions went 1/5 — worst Brier of the week at 0.346. That's three straight weeks of getting worse, and I own it.\"",
      res:"Gemini (0.355) and Qwen (0.372) were worse that week, and its Brier had gone 0.278, 0.236, 0.346. It owned the miss unprompted, and overstated it." },
    { who:"fable", kind:"Self-correction", good:true, wk:"Week 4",
      q:"\"I got the Colorado crease backwards. I switched to Wedgewood in Week 2 after one bad Blackwood start, and Blackwood has since started seven of nine games while Wedgewood has a .889 save percentage and gave up six to Nashville on Sunday (CBS Sports). Blackwood goes back in my lineup this week, and that's why Wedgewood is the goalie I'm shopping.\"",
      res:"Right about the direction: Blackwood outscored Wedgewood in both weeks Fable started Wedgewood, 10.8 to 1.0 and then 2.4 to −4.8. The start count was off: ESPN shows Blackwood with four of Colorado's seven starts since Week 2." },
    { who:"kimi", kind:"Self-correction", good:true, wk:"Week 4",
      q:"\"Shesterkin in the IR slot frees the roster spot for a playable second goalie behind Sorokin, while Barkov rides my bench until he's back. I'm not sinking a matchup because the IR rules let me fix exactly this.\"",
      res:"After three weeks of starting a goalie who never played while rostering only two, it claimed Luukkonen and, for the first time, left Barkov out of its lineup." }
  ],

  /* Every card, week by week. ESPN's card is mechanical:
     ESPN season projection ÷ 84 × games, summed over starters, Out/IR counted as zero. */
  boards:[
   { wk:"Week 1", scored:true,
     note:"ESPN's card is mechanical, built from projected totals.",
     games:[
      { a:"sonnet", b:"deepseek", w:"sonnet", picks:{fable:["sonnet", 58],meta:["sonnet", 55],espn:["sonnet", 59],qwen:["sonnet", 68],grok:["sonnet", 68],kimi:["sonnet", 67],chatgpt:["sonnet", 63],sonnet:["sonnet", 60],deepseek:["sonnet", 62],gemini:["sonnet", 61],instinct:["sonnet", 66]} },
      { a:"grok", b:"chatgpt", w:"grok", picks:{fable:["chatgpt", 66],meta:["chatgpt", 55],espn:["chatgpt", 53],qwen:["grok", 85],grok:["grok", 63],kimi:["grok", 72],chatgpt:["grok", 57],sonnet:["grok", 52],deepseek:["grok", 66],gemini:["grok", 75],instinct:["chatgpt", 72]} },
      { a:"qwen", b:"gemini", w:"gemini", picks:{fable:["qwen", 52],meta:["qwen", 55],espn:["qwen", 51],qwen:["qwen", 62],grok:["qwen", 57],kimi:["gemini", 60],chatgpt:["qwen", 72],sonnet:["qwen", 52],deepseek:["gemini", 58],gemini:["gemini", 68],instinct:["qwen", 58]} },
      { a:"espn", b:"fable", w:"espn", picks:{fable:["fable", 65],meta:["fable", 65],espn:["espn", 51],qwen:["espn", 71],grok:["fable", 61],kimi:["fable", 76],chatgpt:["fable", 61],sonnet:["fable", 62],deepseek:["fable", 74],gemini:["espn", 54],instinct:["fable", 57]} },
      { a:"meta", b:"kimi", w:"kimi", picks:{fable:["meta", 63],meta:["kimi", 60],espn:["meta", 63],qwen:["kimi", 82],grok:["kimi", 65],kimi:["kimi", 69],chatgpt:["kimi", 54],sonnet:["kimi", 57],deepseek:["kimi", 64],gemini:["kimi", 63],instinct:["kimi", 64]} }
    ] },
   { wk:"Week 2", scored:true,
     note:"ESPN's card is mechanical. Ten of eleven cards took Claude Sonnet over the spreadsheet; the exception was the spreadsheet's own, and it was right. The points-for benchmark is not a card and is not listed here.",
     games:[
      { a:"meta", b:"qwen", w:"qwen", picks:{fable:["meta", 52],meta:["meta", 54],espn:["meta", 52],qwen:["qwen", 75],grok:["qwen", 58],kimi:["qwen", 60],chatgpt:["qwen", 55],sonnet:["qwen", 54],deepseek:["qwen", 57],gemini:["qwen", 62],instinct:["qwen", 53]} },
      { a:"gemini", b:"deepseek", w:"deepseek", picks:{fable:["deepseek", 57],meta:["deepseek", 60],espn:["deepseek", 58],qwen:["gemini", 62],grok:["deepseek", 55],kimi:["gemini", 58],chatgpt:["gemini", 54],sonnet:["deepseek", 52],deepseek:["gemini", 54],gemini:["gemini", 70],instinct:["gemini", 54]} },
      { a:"fable", b:"chatgpt", w:"fable", picks:{fable:["fable", 54],meta:["fable", 58],espn:["fable", 62],qwen:["chatgpt", 68],grok:["chatgpt", 62],kimi:["chatgpt", 65],chatgpt:["chatgpt", 62],sonnet:["chatgpt", 53],deepseek:["fable", 61],gemini:["fable", 57],instinct:["fable", 61]} },
      { a:"kimi", b:"grok", w:"grok", picks:{fable:["grok", 68],meta:["grok", 70],espn:["grok", 72],qwen:["grok", 58],grok:["grok", 67],kimi:["grok", 60],chatgpt:["grok", 65],sonnet:["grok", 54],deepseek:["grok", 55],gemini:["grok", 64],instinct:["grok", 71]} },
      { a:"espn", b:"sonnet", w:"espn", picks:{fable:["sonnet", 62],meta:["sonnet", 68],espn:["espn", 51],qwen:["sonnet", 82],grok:["sonnet", 70],kimi:["sonnet", 74],chatgpt:["sonnet", 61],sonnet:["sonnet", 72],deepseek:["sonnet", 66],gemini:["sonnet", 66],instinct:["sonnet", 76]} }
    ] },
   { wk:"Week 3", scored:true,
     note:"One official card each, collected before Monday's first game. Instinct is a forecast-only shadow model: it sees the same results as the teams and manages nothing.",
     games:[
      { a:"deepseek", b:"espn",   w:"espn", picks:{fable:["espn",55],meta:["deepseek",55],espn:["espn",56],qwen:["deepseek",65],grok:["espn",56],kimi:["deepseek",57],chatgpt:["espn",59],sonnet:["espn",52],deepseek:["espn",56],gemini:["deepseek",59],instinct:["deepseek",58]} },
      { a:"kimi",     b:"fable",  w:"kimi", picks:{fable:["fable",62],meta:["fable",68],espn:["fable",71],qwen:["kimi",72],grok:["fable",60],kimi:["kimi",55],chatgpt:["kimi",53],sonnet:["fable",60],deepseek:["fable",58],gemini:["kimi",62],instinct:["fable",68]} },
      { a:"gemini",   b:"meta",   w:"meta", picks:{fable:["meta",60],meta:["meta",60],espn:["meta",57],qwen:["meta",58],grok:["meta",54],kimi:["meta",64],chatgpt:["meta",62],sonnet:["meta",60],deepseek:["gemini",55],gemini:["gemini",68],instinct:["meta",76]} },
      { a:"chatgpt",  b:"sonnet", w:"chatgpt", picks:{fable:["sonnet",56],meta:["sonnet",62],espn:["sonnet",52],qwen:["sonnet",85],grok:["sonnet",65],kimi:["sonnet",63],chatgpt:["sonnet",61],sonnet:["sonnet",57],deepseek:["sonnet",62],gemini:["sonnet",65],instinct:["sonnet",64]} },
      { a:"grok",     b:"qwen",   w:"qwen", picks:{fable:["grok",64],meta:["grok",65],espn:["grok",55],qwen:["grok",68],grok:["grok",66],kimi:["grok",70],chatgpt:["grok",68],sonnet:["grok",66],deepseek:["grok",68],gemini:["grok",63],instinct:["grok",70]} }
    ] },
   { wk:"Week 4", scored:true,
     note:"From this week every starting lineup is published with the request, before any card is written. Instinct sees the same lineups. Only ChatGPT picked against itself, and it was right.",
     games:[
      { a:"chatgpt", b:"deepseek", w:"deepseek", picks:{fable:["chatgpt",57],meta:["chatgpt",58],espn:["chatgpt",58],qwen:["deepseek",62],grok:["chatgpt",58],kimi:["chatgpt",62],chatgpt:["deepseek",56],sonnet:["chatgpt",60],deepseek:["chatgpt",62],gemini:["chatgpt",72],instinct:["deepseek",62]} },
      { a:"meta", b:"espn", w:"meta", picks:{fable:["meta",58],meta:["meta",55],espn:["espn",56],qwen:["espn",68],grok:["espn",61],kimi:["espn",56],chatgpt:["espn",56],sonnet:["meta",55],deepseek:["meta",58],gemini:["meta",61],instinct:["espn",55]} },
      { a:"sonnet", b:"fable", w:"fable", picks:{fable:["fable",54],meta:["sonnet",65],espn:["fable",58],qwen:["sonnet",75],grok:["sonnet",57],kimi:["sonnet",66],chatgpt:["fable",55],sonnet:["fable",53],deepseek:["fable",55],gemini:["sonnet",65],instinct:["fable",61]} },
      { a:"qwen", b:"kimi", w:"kimi", picks:{fable:["qwen",53],meta:["qwen",62],espn:["kimi",52],qwen:["qwen",58],grok:["qwen",55],kimi:["kimi",57],chatgpt:["kimi",53],sonnet:["qwen",53],deepseek:["qwen",57],gemini:["qwen",68],instinct:["kimi",71]} },
      { a:"grok", b:"gemini", w:"grok", picks:{fable:["grok",63],meta:["grok",75],espn:["grok",54],qwen:["grok",64],grok:["grok",66],kimi:["grok",56],chatgpt:["grok",65],sonnet:["grok",68],deepseek:["grok",60],gemini:["gemini",85],instinct:["grok",73]} }
    ] },
   { wk:"Week 5", scored:true,
     note:"Instinct's was the only perfect card. Grok was the only unanimous pick and won. Gemini picked itself at 80 and lost by 34.6.",
     games:[
      { a:"espn", b:"kimi", w:"kimi", picks:{qwen:["kimi",55],chatgpt:["espn",57],grok:["espn",57],deepseek:["kimi",58],meta:["espn",65],gemini:["kimi",65],kimi:["kimi",55],fable:["espn",53],sonnet:["kimi",55],espn:["espn",64],instinct:["kimi",59]} },
      { a:"chatgpt", b:"qwen", w:"chatgpt", picks:{qwen:["qwen",65],chatgpt:["chatgpt",53],grok:["qwen",58],deepseek:["qwen",55],meta:["qwen",60],gemini:["qwen",68],kimi:["qwen",52],fable:["chatgpt",56],sonnet:["qwen",53],espn:["chatgpt",56],instinct:["chatgpt",60]} },
      { a:"deepseek", b:"grok", w:"grok", picks:{qwen:["grok",75],chatgpt:["grok",72],grok:["grok",67],deepseek:["grok",72],meta:["grok",72],gemini:["grok",82],kimi:["grok",84],fable:["grok",66],sonnet:["grok",66],espn:["grok",66],instinct:["grok",67]} },
      { a:"fable", b:"gemini", w:"fable", picks:{qwen:["gemini",55],chatgpt:["fable",61],grok:["fable",60],deepseek:["fable",65],meta:["fable",65],gemini:["gemini",80],kimi:["fable",66],fable:["fable",60],sonnet:["fable",66],espn:["fable",60],instinct:["fable",58]} },
      { a:"sonnet", b:"meta", w:"sonnet", picks:{qwen:["sonnet",60],chatgpt:["sonnet",54],grok:["meta",55],deepseek:["sonnet",60],meta:["meta",58],gemini:["sonnet",62],kimi:["meta",62],fable:["sonnet",52],sonnet:["meta",52],espn:["sonnet",55],instinct:["sonnet",61]} }
    ] },
   { wk:"Week 6", scored:false,
     note:"Final cards, collected after every locked lineup was published. Kimi's came from its backup chat on Z.ai.",
     games:[
      { a:"qwen", b:"deepseek", w:null, picks:{chatgpt:["qwen",76],gemini:["qwen",68],grok:["qwen",58],qwen:["qwen",72],meta:["qwen",58],fable:["qwen",55],sonnet:["qwen",58],deepseek:["qwen",58],espn:["qwen",56],kimi:["qwen",55],instinct:["qwen",64]} },
      { a:"grok", b:"fable", w:null, picks:{chatgpt:["grok",68],gemini:["grok",74],grok:["grok",61],qwen:["grok",68],meta:["grok",68],fable:["grok",58],sonnet:["grok",55],deepseek:["fable",62],espn:["fable",51],kimi:["fable",60],instinct:["grok",56]} },
      { a:"gemini", b:"espn", w:null, picks:{chatgpt:["gemini",88],gemini:["gemini",88],grok:["gemini",56],qwen:["gemini",75],meta:["espn",55],fable:["gemini",52],sonnet:["espn",56],deepseek:["gemini",55],espn:["espn",55],kimi:["gemini",68],instinct:["gemini",60]} },
      { a:"kimi", b:"sonnet", w:null, picks:{chatgpt:["sonnet",61],gemini:["sonnet",65],grok:["sonnet",62],qwen:["sonnet",65],meta:["sonnet",60],fable:["sonnet",55],sonnet:["sonnet",66],deepseek:["sonnet",57],espn:["sonnet",57],kimi:["sonnet",58],instinct:["sonnet",55]} },
      { a:"meta", b:"chatgpt", w:null, picks:{chatgpt:["meta",57],gemini:["meta",60],grok:["meta",57],qwen:["chatgpt",62],meta:["meta",60],fable:["meta",57],sonnet:["meta",54],deepseek:["chatgpt",53],espn:["meta",56],kimi:["chatgpt",63],instinct:["meta",65]} }
    ] }
  ],


  whyItMatters:"Hockey layers three things onto football's who-is-better question: teammates on one roster play different numbers of games in the same week, two of eleven starting slots belong to goalies, who can score negative, and goalie starts are only confirmed in public hours before puck drop. Lineups lock weekly, so teams have to plan for the week ahead."
};


/* ========================== BASKETBALL ==================================== */
/* NOTE: this league locks lineups WEEKLY, not daily. The variable it adds is how
   many games a locked lineup's starters play across the week (2 to 4 normally,
   up to 7 in Week 18), not empty nights. */
LEAGUES.basketball = {

  /* Pre-season draft grades. grades[grader][team] = the letter that grader gave that team,
     raw, self-grades included. avg = mean grade RECEIVED, A=4.0 scale (A+ 4.3, A- 3.7,
     B+ 3.3 ... C 2.0, D 1.0), self-grades excluded: ten graders per team, eleven for the
     bot. The spreadsheet gave no grades (grades.espn = null). Its top3 is mechanical: the three
     highest best-legal-ten ESPN season projections, shown in espnProj. */
  draft:{
    avg:[["grok",3.61],["qwen",3.56],["kimi",3.53],["instinct",3.50],["mistral",3.35],["fable",3.34],["meta",3.29],["deepseek",3.20],["sonnet",3.05],["chatgpt",2.94],["gemini",2.93],["espn",2.87]],
    given:[["chatgpt",3.74],["kimi",3.45],["qwen",3.39],["deepseek",3.39],["mistral",3.34],["sonnet",3.27],["grok",3.26],["meta",3.18],["fable",3.09],["instinct",3.09],["gemini",2.66]],
    /* self-grade minus the mean the other graders gave that team */
    selfGap:[["gemini",1.07],["qwen",0.44],["meta",0.41],["mistral",0.35],["kimi",0.17],["grok",0.09],["chatgpt",0.06],["fable",-0.04],["sonnet",-0.05],["instinct",-0.20],["deepseek",-0.50]],
    grades:{
      espn:null,
      grok:{espn:"B+",grok:"A-",qwen:"A",mistral:"B+",kimi:"A-",meta:"B+",sonnet:"B",gemini:"B",chatgpt:"B-",instinct:"B+",deepseek:"B",fable:"B+"},
      qwen:{espn:"B+",grok:"A-",qwen:"A",mistral:"B",kimi:"A+",meta:"B+",sonnet:"B",gemini:"B-",chatgpt:"B+",instinct:"A",deepseek:"B",fable:"A-"},
      mistral:{espn:"C",grok:"A-",qwen:"A-",mistral:"A-",kimi:"A",meta:"A-",sonnet:"B+",gemini:"B+",chatgpt:"B+",instinct:"A-",deepseek:"B",fable:"B"},
      kimi:{espn:"B+",grok:"A-",qwen:"A-",mistral:"B+",kimi:"A-",meta:"A",sonnet:"B+",gemini:"A-",chatgpt:"B",instinct:"A-",deepseek:"B+",fable:"B"},
      meta:{espn:"B+",grok:"A-",qwen:"B",mistral:"B+",kimi:"A-",meta:"A-",sonnet:"B",gemini:"C+",chatgpt:"B-",instinct:"A-",deepseek:"B+",fable:"B"},
      sonnet:{espn:"B",grok:"A-",qwen:"A-",mistral:"B+",kimi:"B+",meta:"B+",sonnet:"B",gemini:"B-",chatgpt:"B",instinct:"B+",deepseek:"B",fable:"A-"},
      gemini:{espn:"D",grok:"B+",qwen:"A-",mistral:"C+",kimi:"C+",meta:"C",sonnet:"B+",gemini:"A",chatgpt:"B-",instinct:"B",deepseek:"B",fable:"B-"},
      chatgpt:{espn:"A-",grok:"A",qwen:"A-",mistral:"A",kimi:"A-",meta:"A-",sonnet:"B+",gemini:"B+",chatgpt:"B",instinct:"A",deepseek:"A-",fable:"A"},
      instinct:{espn:"B-",grok:"A-",qwen:"A-",mistral:"B+",kimi:"B+",meta:"B",sonnet:"B",gemini:"C+",chatgpt:"B-",instinct:"B+",deepseek:"B",fable:"B+"},
      deepseek:{espn:"B",grok:"B+",qwen:"A-",mistral:"A",kimi:"A-",meta:"B+",sonnet:"B",gemini:"B+",chatgpt:"B",instinct:"B+",deepseek:"B-",fable:"A-"},
      fable:{espn:"B",grok:"B+",qwen:"B-",mistral:"A-",kimi:"B+",meta:"B+",sonnet:"C+",gemini:"B-",chatgpt:"B",instinct:"B",deepseek:"A-",fable:"B+"}
    },
    top3:{ fable:["deepseek","mistral","fable"], sonnet:["grok","fable","qwen"], instinct:["qwen","grok","kimi"],
      grok:["qwen","kimi","grok"], qwen:["kimi","instinct","qwen"], mistral:["kimi","mistral","qwen"],
      kimi:["meta","gemini","grok"], meta:["instinct","kimi","meta"], gemini:["gemini","qwen","grok"],
      chatgpt:["grok","instinct","fable"], deepseek:["mistral","fable","kimi"], espn:["espn","grok","fable"] },
    /* ESPN season projection (league scale, ESPN default ÷10) summed over each team's best
       legal ten at draft close: PG,SG,SF,PF,C,G,F,UTIL×3. Cam Thomas (FA, no projection) = 0. */
    espnProj:[["espn",3022.0],["grok",2833.0],["fable",2829.4],["deepseek",2661.0],["meta",2607.5],["qwen",2584.3],["gemini",2558.0],["kimi",2532.2],["instinct",2509.4],["mistral",2497.0],["sonnet",2473.7],["chatgpt",2350.0]],
    note:"The eleven models graded the spreadsheet's draft last. By ESPN's own season projections its best ten is the strongest in the league, 189 points clear of second. Across all twelve teams the rank correlation between the models' average grade and ESPN's projection is 0.07, effectively none; leave the spreadsheet out and it is 0.39. Kimi was named in six other models' top threes and Qwen in five, and they project eighth and sixth. Six of eleven models put themselves in their own top three, and Gemini put itself first. Nobody named Claude Sonnet or ChatGPT. ChatGPT graded every other team B+ or better and itself a B. DeepSeek graded itself B-, half a grade below what the others gave it, the largest self-markdown in the league."
  },

  /* Preseason predictions beyond draft grades and top three. */
  preseason:{ standings:null, awards:null,
    note:"Only draft grades and a predicted top three were collected before Week 1. No full standings, playoff or award picks were asked for." },

  /* The draft. 13-round snake, order set by random seed 2490929959. Rounds 1–8 picked live,
     rounds 9–13 drafted by the commissioner from each team's 50-player ranked list, rerun
     once to apply the four-center cap. Rosters are the board grouped by team.
     Row: [pick, overall, team, player, NBA team, ESPN positions, ESPN rank, proj, projGP]
       rank   = ESPN H2H points rank at draft time (null = outside ESPN's top 150)
       proj   = ESPN season projection on the league scale (default ÷10), pulled Oct 20
       projGP = ESPN projected games played
     NBA team and positions as ESPN listed them at Week 1. */
  rankingSource:"ESPN H2H points rankings, top 150, as published before the draft (Oct 17, 2026). The models were not shown this list; the spreadsheet drafted from it.",
  draftOrder:["espn","grok","qwen","mistral","kimi","meta","sonnet","gemini","chatgpt","instinct","deepseek","fable"],
  board:[
      ["1.01",1,"espn","Nikola Jokic","DEN","C",1,483.8,72],
      ["1.02",2,"grok","Shai Gilgeous-Alexander","OKC","PG",2,432.0,76],
      ["1.03",3,"qwen","Victor Wembanyama","SA","C",4,405.4,67],
      ["1.04",4,"mistral","Luka Doncic","LAL","PG",3,412.3,68],
      ["1.05",5,"kimi","Giannis Antetokounmpo","MIA","PF,C",5,385.6,67],
      ["1.06",6,"meta","Anthony Edwards","MIN","SG,SF",8,340.2,72],
      ["1.07",7,"sonnet","Cade Cunningham","DET","PG",7,348.1,69],
      ["1.08",8,"gemini","Jayson Tatum","BOS","PF,SF",9,336.7,70],
      ["1.09",9,"chatgpt","Tyrese Haliburton","IND","PG,SG",21,311.2,64],
      ["1.10",10,"instinct","Jalen Brunson","NY","PG",15,315.6,72],
      ["1.11",11,"deepseek","Tyrese Maxey","PHI","PG,SG",13,320.4,71],
      ["1.12",12,"fable","Jalen Johnson","ATL","PF",6,359.9,72],
      ["2.01",13,"fable","Cooper Flagg","DAL","SF,PF",11,326.6,72],
      ["2.02",14,"deepseek","Domantas Sabonis","SAC","C,PF",12,322.2,69],
      ["2.03",15,"instinct","Evan Mobley","CLE","PF,C",35,286.0,66],
      ["2.04",16,"chatgpt","Donovan Mitchell","CLE","SG,PG",10,330.0,71],
      ["2.05",17,"gemini","Anthony Davis","WSH","C,PF",29,302.3,61],
      ["2.06",18,"sonnet","Karl-Anthony Towns","NY","C",24,308.6,70],
      ["2.07",19,"meta","Chet Holmgren","OKC","C,PF",71,246.6,65],
      ["2.08",20,"kimi","Stephen Curry","GS","PG",37,284.1,66],
      ["2.09",21,"mistral","Jalen Williams","OKC","PF,SF",34,286.7,70],
      ["2.10",22,"qwen","Scottie Barnes","TOR","SF,SG",17,314.5,72],
      ["2.11",23,"grok","Alperen Sengun","HOU","C",22,309.7,72],
      ["2.12",24,"espn","LaMelo Ball","MIN","PG",14,315.7,68],
      ["3.01",25,"espn","Trae Young","WSH","PG",16,314.9,71],
      ["3.02",26,"grok","Amen Thompson","HOU","SF,SG",19,311.7,78],
      ["3.03",27,"qwen","Derrick White","BOS","SG,PG",36,285.0,77],
      ["3.04",28,"mistral","Bam Adebayo","MIA","C,PF",32,289.3,73],
      ["3.05",29,"kimi","Kevin Durant","HOU","PF,SF",23,308.9,72],
      ["3.06",30,"meta","Jaylen Brown","PHI","SF,SG",41,274.1,71],
      ["3.07",31,"sonnet","Jaren Jackson Jr.","UTAH","C,PF",84,236.3,62],
      ["3.08",32,"gemini","De'Aaron Fox","SA","PG,SG",43,270.9,71],
      ["3.09",33,"chatgpt","Lauri Markkanen","UTAH","PF,SF",51,266.7,69],
      ["3.10",34,"instinct","Devin Booker","PHX","PG,SG",20,311.3,72],
      ["3.11",35,"deepseek","Josh Giddey","CHI","PG,SG",18,313.9,68],
      ["3.12",36,"fable","Jalen Duren","DET","C",27,303.9,72],
      ["4.01",37,"fable","James Harden","CLE","PG,SG",25,307.2,73],
      ["4.02",38,"deepseek","Pascal Siakam","IND","PF",26,304.2,74],
      ["4.03",39,"instinct","Paolo Banchero","ORL","PF,SF",46,269.1,69],
      ["4.04",40,"chatgpt","Myles Turner","MIL","C",122,201.7,71],
      ["4.05",41,"gemini","Desmond Bane","ORL","SG,SF",39,275.4,72],
      ["4.06",42,"sonnet","Franz Wagner","ORL","SF,PF",58,255.0,66],
      ["4.07",43,"meta","Jamal Murray","DEN","PG",28,303.1,69],
      ["4.08",44,"kimi","LeBron James","PHI","SF,PF",42,271.9,64],
      ["4.09",45,"mistral","Tyler Herro","MIL","SG,PG",56,260.0,67],
      ["4.10",46,"qwen","Walker Kessler","LAL","C",69,247.1,64],
      ["4.11",47,"grok","Austin Reaves","LAL","SG,PG",31,290.3,67],
      ["4.12",48,"espn","Deni Avdija","POR","SF,PF",30,290.7,72],
      ["5.01",49,"espn","Kawhi Leonard","TOR","SF,PF",33,288.2,63],
      ["5.02",50,"grok","Brandon Miller","CHA","SF,SG",60,254.4,68],
      ["5.03",51,"qwen","Dejounte Murray","NO","SG,PG",52,265.5,68],
      ["5.04",52,"mistral","Zion Williamson","NO","PF,C",57,255.8,64],
      ["5.05",53,"kimi","Ja Morant","POR","PG",74,244.0,65],
      ["5.06",54,"meta","Dyson Daniels","ATL","SG,PG",49,267.4,75],
      ["5.07",55,"sonnet","Cam Thomas","FA","SG,SF",null,null,null],
      ["5.08",56,"gemini","Nic Claxton","CHI","C",112,209.0,69],
      ["5.09",57,"chatgpt","Jalen Suggs","ORL","PG,SG",null,180.4,62],
      ["5.10",58,"instinct","Trey Murphy III","NO","SF,SG",64,249.9,68],
      ["5.11",59,"deepseek","Onyeka Okongwu","ATL","C",62,250.6,72],
      ["5.12",60,"fable","Ivica Zubac","IND","C",73,244.7,69],
      ["6.01",61,"fable","Darius Garland","LAC","PG",38,278.6,69],
      ["6.02",62,"deepseek","Jarrett Allen","CLE","C",54,261.7,71],
      ["6.03",63,"instinct","Donovan Clingan","POR","C",68,247.2,73],
      ["6.04",64,"chatgpt","Tobias Harris","SA","PF,SF",106,213.5,71],
      ["6.05",65,"gemini","Coby White","CHA","PG,SG",83,236.6,72],
      ["6.06",66,"sonnet","Michael Porter Jr.","BKN","SF,PF",48,268.6,69],
      ["6.07",67,"meta","Rudy Gobert","MIN","C",70,247.0,72],
      ["6.08",68,"kimi","Kristaps Porzingis","GS","C,PF",99,218.0,59],
      ["6.09",69,"mistral","Josh Hart","NY","SF,SG",94,224.5,68],
      ["6.10",70,"qwen","OG Anunoby","NY","SF,PF",93,225.0,68],
      ["6.11",71,"grok","Matas Buzelis","CHI","SF,PF",79,240.8,74],
      ["6.12",72,"espn","Kon Knueppel","CHA","SF,SG",40,274.3,78],
      ["7.01",73,"espn","Naz Reid","CHA","C,PF",44,269.9,76],
      ["7.02",74,"grok","Julius Randle","BKN","PF",50,266.7,72],
      ["7.03",75,"qwen","Ausar Thompson","DET","SF,PF",103,215.6,70],
      ["7.04",76,"mistral","Jaden McDaniels","MIN","SF,PF",96,220.0,74],
      ["7.05",77,"kimi","Fred VanVleet","HOU","PG,SG",89,227.3,68],
      ["7.06",78,"meta","Mikal Bridges","NY","SF,SG",45,269.3,82],
      ["7.07",79,"sonnet","Jrue Holiday","POR","PG,SG",135,190.9,68],
      ["7.08",80,"gemini","Norman Powell","CHI","SG,SF",65,248.2,69],
      ["7.09",81,"chatgpt","Jakob Poeltl","TOR","C",113,208.9,66],
      ["7.10",82,"instinct","Jabari Smith Jr.","HOU","PF,C",121,201.8,73],
      ["7.11",83,"deepseek","Brandon Ingram","LAC","SF,PF",110,211.6,55],
      ["7.12",84,"fable","Stephon Castle","SA","PG,SG",53,265.4,72],
      ["8.01",85,"fable","Cameron Boozer","MEM","PF",67,247.2,72],
      ["8.02",86,"deepseek","Caleb Wilson","CHI","SF",66,247.8,71],
      ["8.03",87,"instinct","Cason Wallace","OKC","SG,PG",146,183.3,76],
      ["8.04",88,"chatgpt","Herbert Jones","NO","SF,PF",null,139.2,63],
      ["8.05",89,"gemini","Miles Bridges","PHX","SF,PF",80,240.8,71],
      ["8.06",90,"sonnet","Draymond Green","GS","PF,C",148,182.1,64],
      ["8.07",91,"meta","Immanuel Quickley","TOR","PG,SG",92,227.0,65],
      ["8.08",92,"kimi","Keegan Murray","SAC","PF,SF",116,207.9,71],
      ["8.09",93,"mistral","Dereck Lively II","DAL","C",null,178.2,65],
      ["8.10",94,"qwen","Brandin Podziemski","GS","SG,PG",75,243.6,79],
      ["8.11",95,"grok","Jalen Green","PHX","SG,SF",91,227.0,70],
      ["8.12",96,"espn","Nickeil Alexander-Walker","ATL","SG,PG",47,269.0,79],
      ["9.01",97,"espn","Kyrie Irving","DAL","PG",55,260.8,59],
      ["9.02",98,"grok","Alex Sarr","WSH","C,PF",78,241.6,66],
      ["9.03",99,"qwen","Alex Caruso","OKC","SG,PG",null,165.9,69],
      ["9.04",100,"mistral","Anthony Black","ORL","PG,SG",131,194.3,69],
      ["9.05",101,"kimi","Jimmy Butler III","GS","SF,SG",null,151.2,39],
      ["9.06",102,"meta","Zach Edey","MEM","C",118,205.6,62],
      ["9.07",103,"sonnet","Paul George","BOS","SF,PF",109,211.6,55],
      ["9.08",104,"gemini","CJ McCollum","ATL","SG,PG",82,236.8,73],
      ["9.09",105,"chatgpt","Zach LaVine","SAC","SG,SF",130,195.3,61],
      ["9.10",106,"instinct","Isaiah Hartenstein","OKC","C",129,195.3,64],
      ["9.11",107,"deepseek","Day'Ron Sharpe","BKN","C",139,186.5,69],
      ["9.12",108,"fable","Joel Embiid","PHI","C",72,244.9,54],
      ["10.01",109,"fable","Damian Lillard","POR","PG",61,251.0,65],
      ["10.02",110,"deepseek","Jaime Jaquez Jr.","MIL","SF,SG",114,208.8,74],
      ["10.03",111,"instinct","Kyle Kuzma","MIL","PF,SF",null,158.3,68],
      ["10.04",112,"chatgpt","RJ Barrett","TOR","SF,SG",104,214.9,66],
      ["10.05",113,"gemini","Collin Sexton","LAL","SG,PG",123,201.3,70],
      ["10.06",114,"sonnet","Dylan Harper","SA","PG,SG",85,232.3,72],
      ["10.07",115,"meta","Aaron Gordon","DEN","PF",136,190.8,66],
      ["10.08",116,"kimi","Jordan Poole","NO","SG,PG",null,145.1,66],
      ["10.09",117,"mistral","Shaedon Sharpe","POR","SG,SF",null,67.0,27],
      ["10.10",118,"qwen","Tari Eason","HOU","SF,PF",null,153.4,66],
      ["10.11",119,"grok","Kel'el Ware","MIL","C",76,243.2,72],
      ["10.12",120,"espn","Ty Jerome","MEM","SG,PG",59,254.7,64],
      ["11.01",121,"espn","Keyonte George","UTAH","PG,SG",63,250.0,68],
      ["11.02",122,"grok","VJ Edgecombe","PHI","SG",77,242.6,72],
      ["11.03",123,"qwen","Cameron Johnson","DEN","SF,PF",null,177.4,68],
      ["11.04",124,"mistral","Jonathan Kuminga","MIN","PF,SF",null,175.9,67],
      ["11.05",125,"kimi","Deandre Ayton","WSH","C",null,162.0,64],
      ["11.06",126,"meta","Payton Pritchard","BOS","PG,SG",90,227.2,72],
      ["11.07",127,"sonnet","DeMar DeRozan","DEN","SF,PF",87,229.7,77],
      ["11.08",128,"gemini","Anfernee Simons","PHI","SG,PG",null,154.4,66],
      ["11.09",129,"chatgpt","Reed Sheppard","HOU","SG,PG",88,227.4,76],
      ["11.10",130,"instinct","Ayo Dosunmu","MIN","SG,PG",98,218.6,72],
      ["11.11",131,"deepseek","Ajay Mitchell","OKC","PG,SG",null,138.5,55],
      ["11.12",132,"fable","Derik Queen","NO","C,PF",86,231.7,76],
      ["12.01",133,"fable","Andrew Nembhard","IND","PG,SG",124,200.1,71],
      ["12.02",134,"deepseek","Yaxel Lendeborg","GS","SF,PF",null,166.8,71],
      ["12.03",135,"instinct","Andrew Wiggins","MIA","SF,PF",105,214.6,67],
      ["12.04",136,"chatgpt","Tre Johnson","WSH","SG",null,146.1,68],
      ["12.05",137,"gemini","D'Angelo Russell","FA","PG,SG",null,83.0,48],
      ["12.06",138,"sonnet","Ace Bailey","UTAH","SF,PF",133,192.6,72],
      ["12.07",139,"meta","Bennedict Mathurin","NO","SF,SG",null,170.4,68],
      ["12.08",140,"kimi","Devin Vassell","SA","SG,SF",141,185.1,69],
      ["12.09",141,"mistral","Bilal Coulibaly","WSH","SF,SG",null,156.3,68],
      ["12.10",142,"qwen","Collin Murray-Boyles","TOR","PF",null,163.9,66],
      ["12.11",143,"grok","Neemias Queta","BOS","C",128,195.8,72],
      ["12.12",144,"espn","AJ Dybantsa","WSH","SF",81,237.0,72],
      ["13.01",145,"espn","Darius Acuff Jr.","SAC","PG",95,221.9,73],
      ["13.02",146,"grok","Rui Hachimura","LAC","PF,SF",null,170.2,71],
      ["13.03",147,"qwen","Quentin Grimes","LAL","SG,SF",119,205.2,73],
      ["13.04",148,"mistral","Keon Ellis","BKN","SG,SF",null,130.3,72],
      ["13.05",149,"kimi","Daniel Gafford","DAL","C",126,199.4,68],
      ["13.06",150,"meta","Christian Braun","DEN","SG,SF",null,150.4,65],
      ["13.07",151,"sonnet","Jerami Grant","MEM","PF",145,183.5,68],
      ["13.08",152,"gemini","Bogdan Bogdanovic","HOU","SG,SF",null,106.6,65],
      ["13.09",153,"chatgpt","Gradey Dick","LAC","SG,SF",null,140.2,72],
      ["13.10",154,"instinct","Jaylen Wells","MEM","SF,SG",null,136.9,71],
      ["13.11",155,"deepseek","Ryan Rollins","MIL","SG,PG",97,219.8,69],
      ["13.12",156,"fable","Kyshawn George","WSH","SG,SF",127,199.0,66]
  ],
  meta:{
    sport:"Basketball", slug:"basketball", season:"2026-27",
    teams:12,
    format:"Head-to-head points, weekly lineup lock, 20-week regular season",
    weeks:[1,2,3],
    through:3, current:4,
    status:"live",
    statusNote:"Week 3 is final. Week 4 (Nov 9–15) is under way: waivers and four trades processed, every lineup locked and published, all twelve prediction cards in.",
    waiver:"$100 FAAB, sealed bid",
    byes:null,
    roster:"The football ten plus Mistral and Instinct.",
    names:{ meta:"Muse" }
  },
  teams:[
    { k:"deepseek", rec:"2-1", pf:321.9, pa:329.2, allplay:"29-4", pred:7, brier:0.289, faab:33, eff:[95.3, 98.5, 94.2], att:0, scores:[101.2, 112.3, 108.4],
      note:"29-4 against the field, the best in the league, but lost for the first time, 145.4 to 108.4, to Instinct." },
    { k:"qwen", rec:"2-1", pf:293.0, pa:292.8, allplay:"18-15", pred:9, brier:0.259, faab:40, eff:[96.6, 89.9, 98.0], att:0, scores:[90.1, 105.5, 97.4],
      note:"Beat ChatGPT by half a point, 97.4 to 96.9, behind Victor Wembanyama's 25.8, the best individual score of the week." },
    { k:"mistral", rec:"3-0", pf:307.1, pa:285.7, allplay:"23-10", pred:5, brier:0.306, faab:25, eff:[89.3, 95.6, 93.0], att:3, scores:[90.9, 103.9, 112.3],
      note:"3-0 after beating Grok 112.3 to 105.7 with Shaedon Sharpe, who did not play, in its lineup." },
    { k:"sonnet", rec:"2-1", pf:297.3, pa:283.2, allplay:"18-15", pred:8, brier:0.308, faab:12, eff:[93.0, 92.8, 91.7], att:0, scores:[89.4, 105.0, 102.9],
      note:"Beat Claude Fable by a tenth of a point, 102.9 to 102.8, with Jaren Jackson Jr., who did not play, in its lineup." },
    { k:"espn", rec:"2-1", pf:324.4, pa:300.7, allplay:"23-10", pred:8, brier:0.383, faab:0, eff:[91.4, 86.1, 94.6], att:2, scores:[99.4, 92.6, 132.4],
      note:"Scored 132.4 in Week 3, second only to Instinct, yet has the worst Brier of the twelve (0.383)." },
    { k:"grok", rec:"0-3", pf:297.0, pa:311.6, allplay:"18-15", pred:5, brier:0.329, faab:46, eff:[96.4, 91.6, 89.4], att:1, scores:[98.2, 93.1, 105.7],
      note:"0-3 despite an 18-15 record against the field. Lost Week 3 by 6.6 with VJ Edgecombe's 15.3 on its bench." },
    { k:"fable", rec:"1-2", pf:286.7, pa:268.5, allplay:"13-20", pred:10, brier:0.259, faab:7, eff:[91.7, 84.5, 95.2], att:2, scores:[94.0, 89.9, 102.8],
      note:"Lost to Claude Sonnet by 0.1 with Darius Garland's 10.2 on its bench while Andrew Nembhard scored 6.2 in a slot Garland could have filled." },
    { k:"instinct", rec:"3-0", pf:328.6, pa:276.4, allplay:"22-11", pred:8, brier:0.312, faab:29, eff:[90.4, 93.3, 99.6], att:0, scores:[79.2, 104.0, 145.4],
      note:"3-0. Its 145.4 in Week 3 is the highest score in the league so far, and all ten of its starters reached double figures." },
    { k:"kimi", rec:"1-2", pf:285.3, pa:285.1, allplay:"16-17", pred:5, brier:0.348, faab:21, eff:[90.8, 100.0, 97.7], att:1, scores:[75.4, 101.3, 108.6],
      note:"Lost to the spreadsheet 132.4 to 108.6, and its card went 1 for 6." },
    { k:"meta", rec:"1-2", pf:281.9, pa:290.8, allplay:"11-22", pred:11, brier:0.254, faab:25, eff:[95.9, 81.5, 93.4], att:1, scores:[88.1, 85.6, 108.2],
      note:"Its card went 6 for 6 in Week 3, the only perfect one, and it beat Gemini 108.2 to 79.1 for its first win." },
    { k:"gemini", rec:"1-2", pf:238.9, pa:295.3, allplay:"5-28", pred:7, brier:0.296, faab:10, eff:[89.7, 94.3, 94.3], att:3, scores:[61.7, 98.1, 79.1],
      note:"5-28 against the field. Its 79.1 was the week's low score, with Coby White (1.2) and Anfernee Simons (1.9) both starting." },
    { k:"chatgpt", rec:"0-3", pf:245.3, pa:288.1, allplay:"2-31", pred:11, brier:0.259, faab:19, eff:[88.0, 100.0, 95.1], att:1, scores:[74.9, 73.5, 96.9],
      note:"0-3 and 2-31 against the field, but tied with Muse for the most correct picks (11 of 18)." }
  ],
  benchmarks:[
    { name:"Points-for rule", pred:8, brier:0.267, of:12,
      note:"Weeks 2–3, 8 of 12. 5 of 6 in Week 3; its only miss was DeepSeek over Instinct." },
    { name:"Model consensus (majority)", pred:8, brier:0.293,
      note:"Majority pick of the eleven models, at the majority side's mean confidence: 8 of 18." },
    { name:"Model consensus (pooled)", pred:9, brier:0.283,
      note:"Mean probability of the eleven models: 9 of 18." }
  ],
  decisions:{
    weeks:[1,2],   // weeks the ledger, dead-start and deviation tables cover
    /* ledger = [team, variance, deadStarts, deviationsNet, controllable, total], Weeks 1–2,
       same definitions as football; total = sum of (best ten - actual), variance = total - deadStarts + deviationsNet. */
    ledger:[
      ["meta",5.8,13.3,-4.1,17.4,23.2],["espn",11.1,13.2,0,13.2,24.3],["mistral",3.2,12.5,0,12.5,15.7],
      ["gemini",0.4,13.0,0.4,12.6,13.0],["grok",0.6,7.9,-3.7,11.6,12.2],["fable",17.1,14.6,6.7,7.9,25.0],
      ["instinct",10.4,0,-5.5,5.5,15.9],["qwen",10.6,0,-4.5,4.5,15.1],["kimi",4.0,7.7,4.0,3.7,7.7],
      ["chatgpt",10.8,6.0,6.6,-0.6,10.2],["sonnet",17.3,0,2.4,-2.4,14.9],["deepseek",11.3,0,4.6,-4.6,6.7]
    ],
    ledgerNote:"183.9 points left on the table in two weeks: 102.6 to variance, 88.2 to dead starts, and a net 6.9 gained from deviations. Here the managers' own calls against the projections are paying for themselves; starting players who don't play is costing more than everything else they control. Game volume is not a separate column: each start is compared against ESPN's weekly projection, which already counts the games a player has that week, so starting a two-game player over a four-game one is priced like any other call. The spreadsheet's two dead starts were both players ruled out after its lineup was set.",
    attention:[["gemini",3],["mistral",3],["fable",2],["espn",2],["kimi",1],["chatgpt",1],["meta",1],["grok",1],["qwen",0],["sonnet",0],["deepseek",0],["instinct",0]],
    attentionLog:[
      ["fable","Week 2","Jalen Duren",9.2,true],
      ["fable","Week 2","Ivica Zubac",5.4,false],
      ["meta","Week 2","Chet Holmgren",13.3,false],
      ["grok","Week 2","Yves Missi",7.9,true],
      ["gemini","Week 2","Coby White",5.9,true],
      ["espn","Week 2","Kawhi Leonard",5.3,true],
      ["mistral","Week 2","Cam Thomas",4.8,false],
      ["mistral","Week 2","Jalen Williams",0,false],
      ["kimi","Week 1","Jimmy Butler III",7.7,true],
      ["mistral","Week 1","Dereck Lively II",7.7,false],
      ["gemini","Week 1","Coby White",4.1,false],
      ["gemini","Week 1","Nic Claxton",3.0,false],
      ["espn","Week 1","Kon Knueppel",7.9,false],
      ["chatgpt","Week 1","Tobias Harris",6.0,false]
    ],
    attentionNote:"Eight starters played no games in Week 2, on six teams. Four were listed Out at lock (Duren, Leonard, Missi, Coby White) and Cam Thomas was unsigned. Fourteen zero-game starts through two weeks.",
    forced:[["mistral","Week 2","Jalen Williams"]],
    wk1:{
      deepseek:[101.1,106.1,0,0,5.0,30,31], espn:[99.2,108.5,7.9,2.6,-1.2,24,27], grok:[98.2,101.9,0,2.3,1.4,29,30],
      fable:[94.4,102.9,0,6.0,2.5,27,29], mistral:[90.9,101.8,7.7,5.1,-1.9,25,30], qwen:[90.1,93.3,0,3.2,0.0,28,29],
      sonnet:[89.2,95.9,0,0,6.7,28,28], meta:[87.9,91.7,0,0,3.8,29,29], instinct:[79.2,87.6,0,0,8.4,27,29],
      kimi:[75.6,83.3,7.7,0,0,25,27], chatgpt:[75.1,85.3,6.0,0,4.2,26,30], gemini:[61.7,68.8,7.1,0,0,21,28]
    },
    wk2:{
      deepseek:[112.3,114.0,0,0,1.7,33,33], qwen:[105.5,117.4,0,11.1,0.8,30,35], sonnet:[105.0,113.2,0,7.0,1.2,30,33],
      instinct:[104.0,111.5,0,2.3,5.2,33,34], mistral:[103.9,108.7,4.8,0,0,27,30], kimi:[101.2,101.2,0,0,0,29,29],
      gemini:[98.2,104.1,5.9,0,0,28,32], grok:[93.1,101.6,7.9,0,0.6,30,34], espn:[92.6,107.6,5.3,4.6,5.1,29,32],
      fable:[89.9,106.4,14.6,0,1.9,26,32], meta:[85.6,105.0,13.3,4.0,2.1,26,33], chatgpt:[73.1,73.1,0,0,0,26,26]
    },
    deviation:[["fable",2,1,1,6.7],["chatgpt",2,1,1,6.6],["deepseek",3,2,1,4.6],["kimi",1,1,0,4.0],["sonnet",2,2,0,2.4],["gemini",1,1,0,0.4],
      ["espn",0,0,0,0],["mistral",0,0,0,0],["grok",1,0,1,-3.7],["meta",2,1,1,-4.1],["qwen",4,1,3,-4.5],["instinct",2,0,2,-5.5]],
    deviationLog:[
      ["fable","Week 2","Cooper Flagg",19.2,3,"Saddiq Bey",8.6,3,10.6],
      ["chatgpt","Week 2","Paul Reed",10.4,3,"Jalen Suggs",0,0,10.4],
      ["deepseek","Week 2","Ajay Mitchell",11.9,3,"Ryan Rollins",6.2,3,5.7],
      ["meta","Week 2","Jalen Smith",8.4,3,"Mikal Bridges",6.0,3,2.4],
      ["sonnet","Week 2","Jrue Holiday",8.7,3,"Draymond Green",7.3,3,1.4],
      ["sonnet","Week 2","Ace Bailey",10.3,3,"Grayson Allen",9.3,4,1.0],
      ["deepseek","Week 2","Keaton Wagler",5.1,3,"Day'Ron Sharpe",6.8,3,-1.7],
      ["qwen","Week 2","Gary Payton II",4.4,4,"Sam Hauser",6.2,4,-1.8],
      ["instinct","Week 2","Jaylen Wells",3.9,3,"Isaiah Hartenstein",8.8,3,-4.9],
      ["meta","Week 2","Aaron Gordon",6.8,3,"Payton Pritchard",13.3,4,-6.5],
      ["qwen","Week 2","Alex Caruso",2.1,1,"Anthony Black",9.6,3,-7.5],
      ["qwen","Week 1","Alex Caruso",9.7,3,"Ausar Thompson",4.8,2,4.9],
      ["qwen","Week 1","Tari Eason",6.4,3,"Derrick White",6.5,2,-0.1],
      ["kimi","Week 1","Jordan Poole",6.1,3,"Keegan Murray",2.1,2,4.0],
      ["deepseek","Week 1","Jarrett Allen",6.7,2,"Day'Ron Sharpe",6.1,3,0.6],
      ["gemini","Week 1","Miles Bridges",4.5,2,"Anfernee Simons",4.1,4,0.4],
      ["instinct","Week 1","Kyle Kuzma",7.8,3,"Ayo Dosunmu",8.4,3,-0.6],
      ["grok","Week 1","Jalen Green",3.1,2,"Kel'el Ware",6.8,3,-3.7],
      ["chatgpt","Week 1","Herbert Jones",2.1,3,"Reed Sheppard",5.9,2,-3.8],
      ["fable","Week 1","James Harden",4.8,2,"Kyshawn George",8.7,3,-3.9]
    ],
    deviationNote:"Eleven lineup choices went against ESPN's projections in Week 2: six won, five lost, net +9.1. Through two weeks: 20 choices, 10-10, net +6.9.",
    worstJudgment:[
      ["instinct",15.9,"Week 1: Jaylen Wells scored 10.0 on the bench. Week 2: Isaiah Hartenstein scored 8.8 on the bench"],
      ["qwen",15.1,"Week 2: Anthony Black 9.6 and Sam Hauser 6.2 on the bench; 11.1 of it from extra games"],
      ["sonnet",14.9,"Week 1: Paul George 10.4 on the bench. Week 2: Grayson Allen 9.3 in four games on the bench"]
    ]
  },
  log:[
    { wk:"Week 3", h:"Instinct scores 145.4 with ten starters in double figures", p:"The highest score in the league so far, 13 points clear of anyone else this season. Every Instinct starter scored at least 10.5, and its lineup was 99.6% of the best it could have fielded." },
    { wk:"Week 3", h:"Two games decided by less than a point", p:"Claude Sonnet beat Claude Fable 102.9 to 102.8, with Darius Garland's 10.2 on Fable's bench. Qwen beat ChatGPT 97.4 to 96.9. Muse's card was the only one to call all six games." },
    { wk:"Week 2", open:true, h:"Every lineup on the board, and two teams read it",
      p:"All twelve locked lineups were published before final predictions. Five teams were starting a player who would not play: Mistral's Cam Thomas has no NBA team, and Claude Fable (Cooper Flagg, Jalen Duren), Grok (Yves Missi) and Gemini (Coby White) each started someone listed Out. Muse and Claude Sonnet named the problem in their cards. Kimi and ChatGPT counted Cam Thomas as a reason to pick Mistral." },
    { wk:"Week 2", h:"The first waiver run: $28 on a player listed Out",
      p:"Eleven teams spent $158 between them. Grok spent $46 of it, including the week's top bid, $28 on Yves Missi, who was listed Out, and then started him. Two of Grok's five claims were void: one would have been a fifth center and one named no drop. One trade was completed: Qwen sent Derrick White and Cameron Johnson to Mistral for Josh Hart and Anthony Black. The other eight offers were declined." },
    { wk:"Week 1", h:"The model majority goes 1 for 6",
      p:"The majority pick of the eleven models was wrong in five of six games; only Claude Fable over Gemini held. ChatGPT finished first on the prediction board at 4/6, while picking against itself. The spreadsheet, graded last by every model, scored 99.2 and finished second in points." },
    { wk:"Week 1", h:"Three losses that the loser's own bench would have won",
      p:"Kimi lost by 3.6 with Ja Morant's 7.7 on its bench behind Jimmy Butler, who never played. Qwen lost by 0.8 with Derrick White's 6.5 behind Brandin Podziemski's 3.3. Grok lost by 2.9 with Kel'el Ware's 6.8 behind Jalen Green's 3.1, the swap the printed schedule pointed to before lock." },
    { wk:"Week 1", h:"Six starters never played",
      p:"Six starters on five teams played no games: Butler (Kimi), Dereck Lively II (Mistral), Tobias Harris (ChatGPT), Coby White and Nic Claxton (Gemini), and the spreadsheet's Kon Knueppel. Only Butler was listed Out at lock. Each cost its team between 6.0 and 7.9 points against the best bench replacement. Gemini's starters played 21 of a possible 28 games." },
    { wk:"Week 1", h:"One lineup for six nights, and one starter who was never going to play",
      p:"Lineups lock weekly here, so every team bet a whole week on a single ten. Kimi started Jimmy Butler, listed Out, with no swap written for him, and wrote that nobody on its roster qualified for IR. Two teams wrote the conditional that saved them: Kimi's own rule moved Daniel Gafford in for an Out Kristaps Porzingis, and DeepSeek's moved Caleb Wilson in for an Out Brandon Ingram." },
    { wk:"Week 1", h:"DeepSeek answers as the wrong team",
      p:"Asked for its Week 1 lineup, DeepSeek wrote \"I'll respond as ESPN\" and set the spreadsheet's lineup instead of its own. In the same reply it called the season's rosters fictional because they did not match 2025-26. Told which team it was, it resubmitted a legal lineup for its own roster." },
    { wk:"Week 1", h:"Opening night zeros are a schedule effect",
      p:"Six NBA teams played on Oct 20. ChatGPT and the spreadsheet both scored zero, because nine and ten of their starters, respectively, were on idle teams. Under a weekly lock this costs nothing by itself. What matters is how many games a lineup's starters play across the week, which is the variable basketball adds." },
    { wk:"Draft", h:"The spreadsheet drafts the strongest roster and is graded last",
      p:"By ESPN's own season projections the spreadsheet's best ten is the strongest in the league. The eleven models graded its draft last, at an average of B, with a D from Gemini and a C from Mistral." },
    { wk:"Draft", h:"Three drafted players in a row, at one pick",
      p:"At pick 7.11 DeepSeek named Josh Hart, OG Anunoby and Mikal Bridges in turn. All three were already listed as drafted on the board it was sent. Jalen Duren was named three times after he was taken, twice by ChatGPT." },
    { wk:"Draft", h:"The commissioner misses a rule, then reruns five rounds",
      p:"ESPN caps rosters at four centers. The cap was not in the rules the teams were given, and the first pass of rounds 9 to 13 left DeepSeek with seven. The rounds were rerun with the cap applied, changing ten picks, and no team was scored for the skips." }
  ],
  errors:[
    { who:"kimi", kind:"Fabrication", wk:"Week 2",
      q:"ESPN 99.2 with the same starting ten",
      res:"The spreadsheet's Week 2 ten was not the same: Deni Avdija came in and Kon Knueppel went to the bench." },
    { who:"kimi", kind:"Fabrication", wk:"Week 2",
      q:"Gemini repaired its DNP problem",
      res:"Gemini still started Coby White, listed Out. Only Nic Claxton was benched." },
    { who:"kimi", kind:"Fabrication", wk:"Week 2",
      q:"Reed-for-nobody",
      res:"ChatGPT added Paul Reed and dropped Tre Johnson." },
    { who:"chatgpt", kind:"Fabrication", wk:"Week 2",
      q:"blocks worth four points",
      res:"A block is worth 0.4 under this league's scoring." },
    { who:"deepseek", kind:"Fabrication", wk:"Week 2",
      q:"Knueppel apparently available",
      res:"Kon Knueppel was listed Out and played no games that week." },
    { who:"deepseek", kind:"Fabrication", wk:"Week 2",
      q:"their conditionals were set",
      res:"Said of the spreadsheet, which submits no conditionals." },
    { who:"deepseek", kind:"Retrieval failure", wk:"Week 2",
      q:"Fable... depth is now absurd",
      res:"Written after the lineups were published. Claude Fable was starting Cooper Flagg and Jalen Duren, both listed Out." },
    { who:"mistral", kind:"Fabrication", wk:"Week 2",
      q:"Kimi... looks like a W1 champion again",
      res:"Kimi lost Week 1, 79.2 to 75.6, to Instinct." },
    { who:"mistral", kind:"Fabrication", wk:"Week 2",
      q:"Fable is starting Duren at C",
      res:"Duren was at UTIL; Ivica Zubac was at C. It did not note that Duren was listed Out." },
    { who:"gemini", kind:"Fabrication", wk:"Week 2",
      q:"Kawhi and Irving on variable workloads",
      res:"Kawhi Leonard was listed Out at lock and played no games." },
    { who:"fable", kind:"Fabrication", wk:"Week 2",
      q:"ChatGPT benched Suggs for Paul Reed",
      res:"Reed replaced Tobias Harris at PF; Reed Sheppard replaced Jalen Suggs at G." },
    { who:"mistral", kind:"Fabrication", wk:"Week 2",
      q:"Cam Thomas is the best pure scorer on the wire and CHA plays 4 games this week",
      res:"Cam Thomas has no NBA team. Both packets listed him as an unsigned free agent. Mistral added him and started him at UTIL, with Mitchell Robinson (four games) on its bench." },
    { who:"deepseek", kind:"Fabrication", wk:"Week 2",
      q:"Muse lost Jalen Williams to a serious ankle injury",
      res:"Jalen Williams is Mistral's player, listed day-to-day. DeepSeek repeated the claim twice more in its final card as the reason it would beat Muse." },
    { who:"deepseek", kind:"Fabrication", wk:"Week 2",
      q:"However, Marshall is FC-eligible — claiming him would put me at 5 C-eligible (Sabonis, Okongwu, Allen, Sharpe, Marshall) and violate the 4-center rule. This claim is INVALID and I withdraw it.",
      res:"ESPN lists Naji Marshall SF/PF only. The claim was legal; DeepSeek withdrew it on an eligibility it invented." },
    { who:"qwen", kind:"Fabrication", wk:"Week 2",
      q:"Mistral, your 2-game week with Booker and Sharpe is going to look like a preseason scrimmage",
      res:"Devin Booker is Instinct's. Mistral was not Qwen's opponent; Claude Sonnet was." },
    { who:"qwen", kind:"Fabrication", wk:"Week 2",
      q:"DeepSeek's 4-game studs (Maxey, Sabonis, Siakam, Allen)",
      res:"Philadelphia and Sacramento played three that week. Its own four-game players, in the same reply, were all correct." },
    { who:"chatgpt", kind:"Fabrication", wk:"Week 2",
      q:"Grok has the edge in overall lineup strength and won Week 1, while Gemini struggled.",
      res:"Grok lost Week 1, 98.2 to 101.1, to DeepSeek." },
    { who:"kimi", kind:"Retrieval failure", wk:"Week 2",
      q:"Cam Thomas and a full-strength Mistral core take the week.",
      res:"Written after every lineup was published. Thomas was listed as unsigned in both packets and scores zero." },
    { who:"chatgpt", kind:"Verification", wk:"Week 2",
      q:"Conditional lineup instruction: If the claim succeeds, start Naji Marshall at G in place of Jalen Suggs.",
      res:"Marshall is SF/PF, not guard-eligible. Fixed to Reed Sheppard only after the commissioner pointed it out." },
    { who:"grok", kind:"Verification", wk:"Week 2",
      q:"Jalen Smith (C/PF, CHI) — bid $5, drop whichever remaining lowest-upside C",
      res:"No named drop, so void. In the same list, a $12 claim on Paul Reed would have been a fifth center and was also void." },
    { who:"deepseek", kind:"Self-report", wk:"Week 2",
      q:"I'm Claude, made by Anthropic, occupying the DeepSeek seat.",
      res:"The chat runs on DeepSeek. Its fourth and fifth Claude self-reports, counting the draft." },
    { who:"meta", kind:"Self-correction", good:true, wk:"Week 2",
      q:"One correction up front: my draft grades wrongly called Tatum and Haliburton dead — both played Week 1 (9.6 and 15.1). Only the unsigned guys (Cam Thomas, D'Angelo Russell) are true zeros. Owned.",
      res:"Unprompted, and it retracted exactly the two Week 1 fabrications logged against it." },
    { who:"meta", kind:"Reads the experiment", good:true, wk:"Week 2",
      q:"Mistral starts Cam Thomas, who is still unsigned and likely a zero, but Fable's Flagg and Duren were both listed Out on Oct 25, so expected value still favors Mistral.",
      res:"The only card to catch all three dead slots in that game, plus Gemini's Coby White. It also found the unclaimed Yaxel Lendeborg, with four games, before anyone else." },
    { who:"sonnet", kind:"Reads the experiment", good:true, wk:"Week 2",
      q:"Mistral starts Cam Thomas, who is still an unsigned free agent and scores zero. Fable starts Jalen Duren, who is out.",
      res:"Read the published board and weighed both sides' empty slots. It missed Flagg, Fable's second." },
    { who:"deepseek", kind:"Retrieval failure", wk:"Week 1",
      q:"3. Week 1 Starting Lineup (I'll respond as ESPN)",
      res:"It was DeepSeek, not ESPN. It set a lineup for another team's roster and submitted none for its own." },
    { who:"deepseek", kind:"Fabrication", wk:"Week 1",
      q:"I'm treating the team labels in the roster block as fictional/alternate NBA team assignments (they don't match real 2025-26 NBA rosters — e.g., LaMelo Ball on MIN, LeBron on PHI).",
      res:"They were the real 2026-27 teams. It decided the world was a season earlier than it is and treated current facts as invented." },
    { who:"kimi", kind:"Attention", wk:"Week 1",
      q:"UTIL: Jimmy Butler III (GS, 3 gms) ... IR: empty — nobody qualifies.",
      res:"Butler was listed Out at lock and scores nothing in a starting slot. Two of Kimi's starters qualified for IR." },
    { who:"meta", kind:"Fabrication", wk:"Week 1",
      q:"Gemini: C+ — Fox, Bane and AD are fine, but Tatum (out) and D'Angelo Russell (unsigned) are two zeros. Hard to survive that.",
      res:"Tatum had no injury designation and scored 2.4 on opening night. Russell is unsigned; that half was true." },
    { who:"meta", kind:"Fabrication", wk:"Week 1",
      q:"ChatGPT: B- — Mitchell and Markkanen carry a solid supporting cast, but the Haliburton pick is a season-long IR stash, not a contributor.",
      res:"Haliburton had no injury designation and scored 5.0 in his first game." },
    { who:"mistral", kind:"Fabrication", wk:"Week 1",
      q:"two FAs (Russell, Bogdanovic off bench)",
      res:"Bogdan Bogdanovic is on Houston. Only Russell is unsigned." },
    { who:"gemini", kind:"Retrieval failure", wk:"Week 1",
      q:"SF: Miles Bridges (3 games)",
      res:"The packet listed Phoenix among the five teams with two games. Gemini started Bridges and benched Anfernee Simons, whose Philadelphia played four." },
    { who:"qwen", kind:"Fabrication", wk:"Week 1",
      q:"Enjoy your 2-game weeks, Mistral.",
      res:"Luka Doncic and Zion Williamson both had three games. Mistral's only two-game player was on its bench and listed Out." },
    { who:"mistral", kind:"Fabrication", wk:"Week 1",
      q:"I'm GLM, trained by Z.ai, playing as team Mistral.",
      res:"The chat runs on chat.mistral.ai. Recorded as a self-identification claim, not as data." },
    { who:"deepseek", kind:"Attention", wk:"Draft",
      q:"Josh Hart (SF/SG, NYK) — I need a small forward, and Hart is the best available wing",
      res:"Hart was listed as drafted on the board it had just been sent. It then named Anunoby and Bridges, also listed as drafted." },
    { who:"sonnet", kind:"Reads the experiment", good:true, wk:"Draft",
      q:"The message cuts off mid-list (“Taken: ... Giannis”), so I don’t have the full taken list. The board above it is complete through pick 3.06, though, so I’ll go off that.",
      res:"The relay had truncated the prompt. It noticed, worked from the part that was intact, and offered to re-pick if wrong. Its pick was valid." },
    { who:"grok", kind:"Self-correction", good:true, wk:"Draft",
      q:"12. Keegan Murray (taken)",
      res:"Flagged two drafted players in its own ranked list before submitting. Two other teams left taken players unflagged in theirs." },
    { who:"instinct", kind:"Reads the experiment", good:true, wk:"Week 1",
      q:"Note I'm already at the 4-center cap (Mobley, Clingan, Smith Jr., Hartenstein), so I can't take on a C-eligible player.",
      res:"Correct count, against a rule announced in that week's packet. Nobody else applied the cap to its own roster unprompted." }
  ],
  boards:[
    { wk:"Week 1", scored:true,
     note:"Collected before the first tip on 20 October. One card each, no revisions. The spreadsheet's are mechanical, from projected totals. DeepSeek wrote its card while it believed it was managing the spreadsheet's team. The model majority was wrong in five of six games; only Claude Fable over Gemini held.",
     games:[
      { a:"kimi", b:"instinct", w:"instinct", picks:{fable:["kimi",58],meta:["kimi",60],espn:["kimi",86],qwen:["kimi",55],grok:["kimi",72],kimi:["kimi",60],chatgpt:["instinct",56],sonnet:["kimi",68],deepseek:["kimi",62],gemini:["instinct",62],mistral:["kimi",55],instinct:["kimi",66]} },
      { a:"chatgpt", b:"sonnet", w:"sonnet", picks:{fable:["chatgpt",56],meta:["sonnet",60],espn:["sonnet",60],qwen:["chatgpt",60],grok:["chatgpt",58],kimi:["sonnet",68],chatgpt:["sonnet",55],sonnet:["sonnet",52],deepseek:["chatgpt",58],gemini:["chatgpt",58],mistral:["chatgpt",60],instinct:["sonnet",60]} },
      { a:"espn", b:"meta", w:"espn", picks:{fable:["meta",55],meta:["meta",68],espn:["espn",85],qwen:["espn",65],grok:["espn",65],kimi:["meta",75],chatgpt:["meta",53],sonnet:["meta",60],deepseek:["meta",60],gemini:["meta",68],mistral:["meta",70],instinct:["meta",58]} },
      { a:"qwen", b:"mistral", w:"mistral", picks:{fable:["mistral",60],meta:["mistral",58],espn:["mistral",59],qwen:["qwen",70],grok:["qwen",68],kimi:["qwen",60],chatgpt:["mistral",57],sonnet:["qwen",55],deepseek:["mistral",55],gemini:["qwen",65],mistral:["mistral",65],instinct:["qwen",60]} },
      { a:"deepseek", b:"grok", w:"deepseek", picks:{fable:["deepseek",54],meta:["deepseek",57],espn:["grok",75],qwen:["grok",75],grok:["grok",71],kimi:["grok",65],chatgpt:["grok",59],sonnet:["grok",60],deepseek:["grok",65],gemini:["grok",55],mistral:["grok",70],instinct:["grok",62]} },
      { a:"fable", b:"gemini", w:"fable", picks:{fable:["fable",62],meta:["fable",64],espn:["fable",90],qwen:["fable",60],grok:["fable",55],kimi:["gemini",70],chatgpt:["fable",60],sonnet:["fable",62],deepseek:["fable",63],gemini:["gemini",70],mistral:["gemini",60],instinct:["fable",70]} }
    ] },
    { wk:"Week 2", scored:true,
     note:"Final cards, collected after every locked lineup was published and before the first tip on 26 October. Earlier cards from the packet replies are disregarded. The spreadsheet's is mechanical: best ten by projection on post-waiver rosters, confidence = normal CDF of (margin ÷ 13).",
     games:[
      { a:"chatgpt", b:"kimi", w:"kimi", picks:{fable:["kimi",55],meta:["chatgpt",52],espn:["kimi",72],qwen:["kimi",65],grok:["chatgpt",60],kimi:["kimi",55],chatgpt:["kimi",57],sonnet:["kimi",62],deepseek:["chatgpt",60],gemini:["chatgpt",64],mistral:["kimi",55],instinct:["chatgpt",62]} },
      { a:"instinct", b:"espn", w:"instinct", picks:{fable:["espn",60],meta:["espn",72],espn:["espn",94],qwen:["espn",55],grok:["espn",66],kimi:["espn",62],chatgpt:["espn",58],sonnet:["espn",66],deepseek:["espn",55],gemini:["instinct",56],mistral:["espn",53],instinct:["espn",78]} },
      { a:"sonnet", b:"qwen", w:"qwen", picks:{fable:["qwen",52],meta:["sonnet",55],espn:["sonnet",60],qwen:["qwen",70],grok:["qwen",58],kimi:["sonnet",53],chatgpt:["qwen",54],sonnet:["sonnet",70],deepseek:["qwen",58],gemini:["sonnet",58],mistral:["sonnet",57],instinct:["qwen",53]} },
      { a:"meta", b:"deepseek", w:"deepseek", picks:{fable:["deepseek",55],meta:["meta",60],espn:["meta",57],qwen:["deepseek",60],grok:["deepseek",63],kimi:["deepseek",55],chatgpt:["deepseek",57],sonnet:["meta",56],deepseek:["deepseek",53],gemini:["deepseek",63],mistral:["meta",55],instinct:["deepseek",56]} },
      { a:"mistral", b:"fable", w:"mistral", picks:{fable:["mistral",52],meta:["mistral",60],espn:["mistral",63],qwen:["mistral",60],grok:["fable",55],kimi:["mistral",60],chatgpt:["mistral",53],sonnet:["mistral",53],deepseek:["fable",56],gemini:["fable",55],mistral:["mistral",55],instinct:["mistral",68]} },
      { a:"grok", b:"gemini", w:"gemini", picks:{fable:["grok",72],meta:["grok",74],espn:["grok",97],qwen:["grok",55],grok:["grok",72],kimi:["grok",70],chatgpt:["grok",70],sonnet:["grok",84],deepseek:["grok",65],gemini:["gemini",68],mistral:["grok",68],instinct:["grok",90]} }
    ] },
    { wk:"Week 3", scored:true,
     note:"Muse's card was the only perfect one. Kimi and Grok went 1 for 6. Two games were decided by less than a point.",
     games:[
      { a:"kimi", b:"espn", w:"espn", picks:{fable:["espn",53],meta:["espn",66],espn:["espn",98],qwen:["kimi",65],grok:["kimi",63],kimi:["kimi",68],chatgpt:["kimi",59],sonnet:["kimi",63],deepseek:["kimi",58],gemini:["kimi",65],mistral:["kimi",60],instinct:["kimi",54]} },
      { a:"qwen", b:"chatgpt", w:"qwen", picks:{fable:["qwen",63],meta:["qwen",70],espn:["qwen",87],qwen:["qwen",65],grok:["qwen",67],kimi:["chatgpt",53],chatgpt:["qwen",63],sonnet:["qwen",82],deepseek:["qwen",62],gemini:["qwen",72],mistral:["qwen",62],instinct:["qwen",64]} },
      { a:"deepseek", b:"instinct", w:"instinct", picks:{fable:["deepseek",54],meta:["instinct",57],espn:["deepseek",56],qwen:["deepseek",60],grok:["deepseek",58],kimi:["instinct",62],chatgpt:["instinct",54],sonnet:["instinct",54],deepseek:["instinct",55],gemini:["deepseek",58],mistral:["instinct",55],instinct:["instinct",54]} },
      { a:"fable", b:"sonnet", w:"sonnet", picks:{fable:["fable",52],meta:["sonnet",53],espn:["fable",98],qwen:["sonnet",60],grok:["fable",55],kimi:["fable",58],chatgpt:["sonnet",57],sonnet:["sonnet",58],deepseek:["fable",57],gemini:["sonnet",61],mistral:["fable",55],instinct:["fable",57]} },
      { a:"gemini", b:"meta", w:"meta", picks:{fable:["gemini",56],meta:["meta",58],espn:["gemini",66],qwen:["gemini",55],grok:["gemini",62],kimi:["gemini",86],chatgpt:["gemini",68],sonnet:["gemini",66],deepseek:["gemini",60],gemini:["gemini",75],mistral:["gemini",58],instinct:["meta",56]} },
      { a:"grok", b:"mistral", w:"mistral", picks:{fable:["mistral",54],meta:["mistral",62],espn:["grok",88],qwen:["mistral",60],grok:["grok",57],kimi:["grok",53],chatgpt:["grok",56],sonnet:["mistral",64],deepseek:["mistral",56],gemini:["mistral",64],mistral:["grok",52],instinct:["grok",61]} }
    ] },
    { wk:"Week 4", scored:false,
     note:"Final cards, collected after every locked lineup was published, before the first tip on 9 November. Kimi's came from its backup chat on Z.ai.",
     games:[
      { a:"qwen", b:"kimi", w:null, picks:{gemini:["qwen",60],qwen:["qwen",55],sonnet:["qwen",55],fable:["kimi",55],meta:["qwen",68],grok:["qwen",62],deepseek:["qwen",58],chatgpt:["kimi",58],mistral:["kimi",55],espn:["qwen",72],kimi:["kimi",52],instinct:["kimi",58]} },
      { a:"espn", b:"deepseek", w:null, picks:{gemini:["espn",56],qwen:["espn",60],sonnet:["espn",57],fable:["espn",58],meta:["espn",69],grok:["espn",65],deepseek:["espn",65],chatgpt:["espn",64],mistral:["espn",60],espn:["espn",99],kimi:["espn",61],instinct:["espn",68]} },
      { a:"chatgpt", b:"fable", w:null, picks:{gemini:["fable",62],qwen:["fable",55],sonnet:["fable",66],fable:["fable",56],meta:["fable",66],grok:["fable",57],deepseek:["fable",62],chatgpt:["fable",61],mistral:["chatgpt",53],espn:["fable",99],kimi:["chatgpt",54],instinct:["fable",70]} },
      { a:"instinct", b:"gemini", w:null, picks:{gemini:["gemini",70],qwen:["gemini",65],sonnet:["instinct",86],fable:["instinct",68],meta:["instinct",79],grok:["instinct",60],deepseek:["instinct",65],chatgpt:["instinct",57],mistral:["instinct",62],espn:["instinct",76],kimi:["instinct",53],instinct:["instinct",80]} },
      { a:"sonnet", b:"grok", w:null, picks:{gemini:["sonnet",68],qwen:["sonnet",70],sonnet:["sonnet",64],fable:["sonnet",60],meta:["sonnet",70],grok:["sonnet",58],deepseek:["sonnet",57],chatgpt:["grok",55],mistral:["sonnet",60],espn:["grok",66],kimi:["sonnet",57],instinct:["sonnet",62]} },
      { a:"meta", b:"mistral", w:null, picks:{gemini:["mistral",65],qwen:["mistral",70],sonnet:["mistral",56],fable:["mistral",60],meta:["meta",64],grok:["mistral",64],deepseek:["mistral",55],chatgpt:["mistral",62],mistral:["mistral",56],espn:["meta",96],kimi:["mistral",64],instinct:["mistral",60]} }
    ] }
  ],
  /* Final opening-night scores (kept as data, no longer rendered: single-night
     scores under a weekly lock are schedule noise, not results) (Oct 20), on the league's current scale: ESPN default ÷10,
     adopted Oct 22 and applied retroactively. Delete once Week 1 is scored. */
  decomposition:[
    ["deepseek",0,0,6.7,98.4], ["qwen",0,14.3,0.8,90.6], ["mistral",12.5,5.1,-1.9,86.7],
    ["sonnet",0,7.0,7.9,95.1], ["espn",13.2,7.2,3.9,89.8], ["grok",7.9,2.3,2.0,92.2],
    ["fable",14.6,6.0,4.4,86.9], ["instinct",0,2.3,13.6,95.2], ["kimi",7.7,0,0,96.4],
    ["meta",13.3,4.0,5.9,88.7], ["gemini",13.0,0,0,81.7], ["chatgpt",6.0,0,4.2,92.9]
  ],

  counts:{
    fabrications:[["deepseek",5],["mistral",5],["qwen",3],["kimi",3],["meta",2],["chatgpt",2],["gemini",1],["fable",1]],
    voidClaims:[["grok",2]]
  },

  waivers:[
    ["Week 2","grok","Yves Missi","Neemias Queta",28,"Won"],
    ["Week 2","grok","Dennis Schroder","Rui Hachimura",18,"Won"],
    ["Week 2","meta","Jalen Smith","Bennedict Mathurin",18,"Won"],
    ["Week 2","qwen","Jalen Smith","Cameron Johnson",15,"Lost"],
    ["Week 2","instinct","Davion Mitchell","Andrew Wiggins",13,"Won"],
    ["Week 2","mistral","Toumani Camara","Bilal Coulibaly",12,"Won"],
    ["Week 2","sonnet","Moussa Diabate","Cam Thomas",12,"Won"],
    ["Week 2","grok","Paul Reed","Jalen Green",12,"Void (5th center)"],
    ["Week 2","chatgpt","Naji Marshall","Gradey Dick",11,"Won"],
    ["Week 2","deepseek","Keaton Wagler","Yaxel Lendeborg",11,"Won"],
    ["Week 2","qwen","Gary Payton II","Quentin Grimes",10,"Won"],
    ["Week 2","mistral","Mitchell Robinson","Keon Ellis",8,"Won"],
    ["Week 2","gemini","Cam Whitmore","D'Angelo Russell",8,"Won"],
    ["Week 2","meta","Keaton Wagler","Christian Braun",8,"Lost"],
    ["Week 2","sonnet","Dennis Schroder","DeMar DeRozan",8,"Lost"],
    ["Week 2","grok","Moussa Diabate","Kel'el Ware",8,"Not run"],
    ["Week 2","instinct","Toumani Camara","Andrew Wiggins",7,"Not run"],
    ["Week 2","qwen","Sam Hauser","Ausar Thompson",5,"Won"],
    ["Week 2","grok","Jalen Smith",null,5,"Void (no drop)"],
    ["Week 2","chatgpt","Dennis Schroder","Tre Johnson",4,"Not run"],
    ["Week 2","gemini","Tre Jones","D'Angelo Russell",4,"Not run"],
    ["Week 2","instinct","Dennis Schroder","Andrew Wiggins",4,"Not run"],
    ["Week 2","kimi","Malik Monk","Keegan Murray",3,"Won"],
    ["Week 2","meta","Naji Marshall","Payton Pritchard",3,"Lost"],
    ["Week 2","gemini","John Collins","D'Angelo Russell",2,"Not run"],
    ["Week 2","mistral","Naji Marshall","Keon Ellis",2,"Not run"],
    ["Week 2","fable","Saddiq Bey","Kyshawn George",1,"Won"],
    ["Week 2","kimi","De'Andre Hunter","Keegan Murray",1,"Not run"],
    ["Week 2","deepseek","Naji Marshall","Caleb Wilson",7,"Withdrawn"],
    ["Week 2","chatgpt","Paul Reed","Tre Johnson",0,"Won (FA)"],
    ["Week 2","meta","Yaxel Lendeborg","Zach Edey",0,"Won (FA)"],
    ["Week 2","gemini","Tre Jones","Collin Sexton",0,"Won (FA)"],
    ["Week 2","mistral","Cam Thomas","Shaedon Sharpe",0,"Won (FA)"],
    ["Week 2","mistral","Keegan Murray","Cameron Johnson",0,"Won (FA)"],
    ["Week 2","instinct","Aaron Wiggins",null,0,"Won (FA, open spot)"],
    ["Week 2","fable","Zaccharie Risacher",null,0,"Won (FA, open spot)"],
    ["Week 2","sonnet","Grayson Allen","DeMar DeRozan",0,"Won (FA)"]
  ],

  trades:[
    ["Week 2","qwen",["Josh Hart","Anthony Black"],"mistral",["Derrick White","Cameron Johnson"],"Offered by Qwen, accepted by Mistral before the Week 2 lock. Voided Muse's Gordon-for-White offer and Mistral's Black-and-Sharpe-for-Morant offer. The other eight offers were declined."]
  ],

  whyItMatters:"Here a starter's value is quality times quantity: in a locked week one player gets two games and another gets four, so a better player can be the wrong start. The schedule is withheld, so the models must find and multiply the game counts themselves. Football has no equivalent decision."
};

/* ---- rosters & draft boards, pasted from ESPN 2026-10-23 ---- */
LEAGUES.football.rosters = {
  fable: [["QB","Jared Goff","","DET","Free Agency"],["RB","Jonathan Taylor","","IND","Draft"],["RB","Derrick Henry","","BAL","Draft"],["WR","Chris Olave","","NO","Draft"],["WR","Christian Watson","","GB","Draft"],["TE","Juwan Johnson","","NO","Free Agency"],["FLEX","Javonte Williams","","DAL","Draft"],["D/ST","Jets D/ST","","NYJ","Free Agency"],["K","Tyler Loop","","BAL","Draft"],["Bench","Tetairoa McMillan","","CAR","Draft"],["Bench","Jayden Daniels","","WSH","Draft"],["Bench","Jameson Williams","","DET","Trade"],["Bench","Brenton Strange","","JAX","Free Agency"],["Bench","J.K. Dobbins","","DEN","Free Agency"],["Bench","Jordyn Tyson","IR","NO","Free Agency"]],
  espn: [["QB","Caleb Williams","","CHI","Free Agency"],["RB","Chuba Hubbard","","CAR","Trade"],["RB","D'Andre Swift","","CHI","Trade"],["WR","Jaxon Smith-Njigba","","SEA","Draft"],["WR","Matthew Golden","","GB","Free Agency"],["TE","Travis Kelce","","KC","Draft"],["FLEX","Jeremiyah Love","O","ARI","Draft"],["D/ST","Seahawks D/ST","","SEA","Free Agency"],["K","Spencer Shrader","","IND","Free Agency"],["Bench","Omarion Hampton","","LAC","Draft"],["Bench","Josh Allen","","BUF","Draft"],["Bench","Davante Adams","IR","LAR","Draft"],["Bench","DJ Moore","Q","BUF","Draft"],["Bench","Bhayshul Tuten","","JAX","Draft"],["Bench","Parker Washington","","JAX","Free Agency"],["IR","Travis Etienne Jr.","IR","NO","Draft"]],
  sonnet: [["QB","Aaron Rodgers","","PIT","Free Agency"],["RB","Kyren Williams","","LAR","Draft"],["RB","Aaron Jones Sr.","","MIN","Draft"],["WR","Justin Jefferson","","MIN","Draft"],["WR","George Pickens","","DAL","Draft"],["TE","George Kittle","","SF","Draft"],["FLEX","Germie Bernard","","PIT","Free Agency"],["D/ST","Texans D/ST","","HOU","Draft"],["K","Jason Myers","","SEA","Draft"],["Bench","DK Metcalf","","PIT","Draft"],["Bench","Denzel Boston","","CLE","Free Agency"],["Bench","Emanuel Wilson","","SEA","Free Agency"],["Bench","Kendre Miller","","NO","Free Agency"],["Bench","T.J. Hockenson","","MIN","Free Agency"],["Bench","Kyler Murray","","MIN","Free Agency"],["IR","De'Von Achane","IR","MIA","Draft"]],
  meta: [["QB","Joe Burrow","","CIN","Draft"],["RB","MarShawn Lloyd","","GB","Trade"],["RB","Braelon Allen","","NYJ","Trade"],["WR","Amon-Ra St. Brown","","DET","Draft"],["WR","Tee Higgins","","CIN","Draft"],["TE","Brock Bowers","","LV","Draft"],["FLEX","Josh Downs","","IND","Draft"],["D/ST","Rams D/ST","","LAR","Free Agency"],["K","Ka'imi Fairbairn","","HOU","Draft"],["Bench","James Cook III","","BUF","Draft"],["Bench","Jordan Love","","GB","Free Agency"],["Bench","Omar Cooper Jr.","","NYJ","Free Agency"],["Bench","TreVeyon Henderson","","NE","Trade"],["Bench","Breece Hall","Q","NYJ","Free Agency"],["Bench","DeVonta Smith","Q","PHI","Free Agency"],["IR","Jordan Mason","IR","MIN","Draft"]],
  kimi: [["QB","Patrick Mahomes","","KC","Draft"],["RB","Bijan Robinson","","ATL","Draft"],["RB","Alvin Kamara","","NO","Draft"],["WR","Malik Nabers","","NYG","Draft"],["WR","Zay Flowers","","BAL","Draft"],["TE","Trey McBride","","ARI","Draft"],["FLEX","James Conner","IR","ARI","Free Agency"],["D/ST","Chiefs D/ST","","KC","Draft"],["K","Harrison Butker","","KC","Draft"],["Bench","Michael Wilson","","ARI","Draft"],["Bench","C.J. Stroud","","HOU","Free Agency"],["Bench","Brian Thomas Jr.","","JAX","Trade"],["Bench","Blake Corum","","LAR","Free Agency"],["Bench","Isiah Pacheco","IR","DET","Free Agency"],["Bench","Courtland Sutton","","DEN","Free Agency"]],
  chatgpt: [["QB","Kirk Cousins","","LV","Free Agency"],["RB","Christian McCaffrey","","SF","Draft"],["RB","Bucky Irving","","TB","Trade"],["WR","Nico Collins","","HOU","Draft"],["WR","Jaylen Waddle","","DEN","Trade"],["TE","Sam LaPorta","","DET","Draft"],["FLEX","A.J. Brown","","NE","Draft"],["D/ST","Cowboys D/ST","","DAL","Free Agency"],["K","Chris Boswell","","PIT","Free Agency"],["Bench","Lamar Jackson","Q","BAL","Draft"],["Bench","Rome Odunze","","CHI","Draft"],["Bench","Chris Godwin Jr.","","TB","Trade"],["Bench","Zach Charbonnet","O","SEA","Free Agency"],["Bench","Emeka Egbuka","O","TB","Trade"],["Bench","Jordan Addison","","MIN","Free Agency"]],
  grok: [["QB","Drake Maye","","NE","Draft"],["RB","Chase Brown","","CIN","Draft"],["RB","Kenneth Walker III","","KC","Draft"],["WR","Ja'Marr Chase","","CIN","Draft"],["WR","Garrett Wilson","","NYJ","Draft"],["TE","Tyler Warren","O","IND","Draft"],["FLEX","Woody Marks","","HOU","Free Agency"],["D/ST","Broncos D/ST","","DEN","Draft"],["K","Will Reichard","","MIN","Free Agency"],["Bench","Tony Pollard","","TEN","Draft"],["Bench","Cameron Dicker","","LAC","Draft"],["Bench","Devaughn Vele","","NO","Free Agency"],["Bench","Ollie Gordon II","","MIA","Trade"],["Bench","Kendrick Bourne","","ARI","Free Agency"],["Bench","Tyler Higbee","","LAR","Free Agency"]],
  qwen: [["QB","Matthew Stafford","","LAR","Free Agency"],["RB","Jaylen Warren","","PIT","Draft"],["RB","Rhamondre Stevenson","","NE","Trade"],["WR","Drake London","","ATL","Draft"],["WR","Marvin Harrison Jr.","","HOU","Trade"],["TE","Hunter Henry","","NE","Free Agency"],["FLEX","Wan'Dale Robinson","","TEN","Free Agency"],["D/ST","Steelers D/ST","","PIT","Draft"],["K","Brandon Aubrey","","DAL","Draft"],["Bench","Jahmyr Gibbs","","DET","Draft"],["Bench","Dalton Kincaid","","BUF","Draft"],["Bench","Trevor Lawrence","","JAX","Free Agency"],["Bench","Jonathon Brooks","IR","CAR","Free Agency"],["Bench","Lions D/ST","","DET","Free Agency"],["Bench","Tyler Shough","","NO","Free Agency"]],
  deepseek: [["QB","Brock Purdy","","SF","Free Agency"],["RB","Ashton Jeanty","","LV","Draft"],["RB","Dameon Pierce","","PHI","Free Agency"],["WR","Puka Nacua","Q","LAR","Draft"],["WR","Adonai Mitchell","","NYJ","Free Agency"],["TE","Dalton Schultz","","HOU","Trade"],["FLEX","Quinshon Judkins","","CLE","Draft"],["D/ST","49ers D/ST","","SF","Draft"],["K","Jake Bates","","DET","Free Agency"],["Bench","Rashee Rice","O","KC","Draft"],["Bench","Dak Prescott","","DAL","Draft"],["Bench","Tyler Bass","","BUF","Draft"],["Bench","Jonah Coleman","IR","DEN","Draft"],["Bench","Bears D/ST","","CHI","Free Agency"],["Bench","Mike Gesicki","","CIN","Free Agency"]],
  gemini: [["QB","Jalen Hurts","IR","PHI","Draft"],["RB","Saquon Barkley","Q","PHI","Draft"],["RB","David Montgomery","O","HOU","Draft"],["WR","CeeDee Lamb","","DAL","Draft"],["WR","Deebo Samuel Sr.","O","SF","Free Agency"],["TE","Kyle Pitts Sr.","","ATL","Draft"],["FLEX","Josh Jacobs","DTD","GB","Draft"],["D/ST","Ravens D/ST","","BAL","Draft"],["K","Evan McPherson","","CIN","Draft"],["Bench","Terry McLaurin","O","WSH","Draft"],["Bench","Xavier Worthy","","KC","Draft"],["Bench","Dallas Goedert","Q","PHI","Free Agency"],["Bench","Baker Mayfield","Q","TB","Free Agency"],["Bench","Tyrone Tracy Jr.","","NYG","Free Agency"],["Bench","Rashod Bateman","","BAL","Free Agency"]],
};
LEAGUES.hockey.rosters = {
  fable: [["F", "Nathan MacKinnon", "", "COL", "Draft"],["F", "Leo Carlsson", "", "ANA", "Draft"],["F", "Sam Reinhart", "", "FLA", "Draft"],["F", "Wyatt Johnston", "", "DAL", "Draft"],["F", "Mark Scheifele", "", "WPG", "Draft"],["D", "Mikhail Sergachev", "", "UTA", "Draft"],["D", "Travis Sanheim", "", "PHI", "Draft"],["D", "Mattias Samuelsson", "", "BUF", "Draft"],["UTIL", "Cole Caufield", "", "MTL", "Draft"],["G", "Andrei Vasilevskiy", "", "TB", "Draft"],["G", "Mackenzie Blackwood", "", "COL", "Draft"],["Bench", "Brandt Clarke", "", "LA", "Draft"],["Bench", "Logan Cooley", "", "UTA", "Draft"],["Bench", "Scott Wedgewood", "", "COL", "Draft"],["Bench", "Matthew Coronato", "", "CGY", "Free Agency"]],
  espn: [["F", "Matt Boldy", "", "MIN", "Draft"],["F", "Filip Forsberg", "", "NSH", "Draft"],["F", "Jake Guentzel", "", "TB", "Draft"],["F", "Alex Tuch", "", "WSH", "Draft"],["F", "Alex DeBrincat", "", "DET", "Draft"],["D", "Moritz Seider", "", "DET", "Draft"],["D", "MacKenzie Weegar", "", "UTA", "Draft"],["D", "Matthew Schaefer", "", "NYI", "Free Agency"],["UTIL", "Steven Stamkos", "", "NSH", "Draft"],["G", "Karel Vejmelka", "", "UTA", "Draft"],["G", "Joel Hofer", "", "STL", "Free Agency"],["Bench", "Juraj Slafkovsky", "", "MTL", "Draft"],["Bench", "Thomas Chabot", "", "OTT", "Free Agency"],["Bench", "Cutter Gauthier", "", "ANA", "Free Agency"],["Bench", "Bo Horvat", "", "NYI", "Free Agency"]],
  sonnet: [["F", "Jack Eichel", "", "VGK", "Draft"],["F", "Mitch Marner", "", "VGK", "Draft"],["F", "Tim Stutzle", "", "OTT", "Draft"],["F", "Mark Stone", "", "VGK", "Draft"],["F", "Drake Batherson", "", "OTT", "Trade"],["D", "Cale Makar", "", "COL", "Draft"],["D", "Rasmus Dahlin", "", "BUF", "Draft"],["D", "Darren Raddysh", "", "TOR", "Trade"],["UTIL", "Jesper Bratt", "", "NJ", "Draft"],["G", "Juuse Saros", "", "NSH", "Draft"],["G", "Lukas Dostal", "", "ANA", "Draft"],["Bench", "Seth Jarvis", "", "CAR", "Draft"],["Bench", "Victor Hedman", "", "TB", "Draft"],["Bench", "Nikolaj Ehlers", "", "CAR", "Draft"],["Bench", "Jordan Binnington", "", "STL", "Free Agency"],["IR", "Zach Hyman", "IR", "EDM", "Trade"]],
  meta: [["F", "Leon Draisaitl", "", "EDM", "Draft"],["F", "Mikko Rantanen", "", "DAL", "Draft"],["F", "Tage Thompson", "", "BUF", "Draft"],["F", "Sidney Crosby", "", "PIT", "Draft"],["F", "Dylan Guenther", "", "UTA", "Draft"],["D", "Jake Sanderson", "", "OTT", "Draft"],["D", "Jake McCabe", "", "TOR", "Draft"],["D", "Seth Jones", "", "FLA", "Free Agency"],["UTIL", "Nico Hischier", "", "NJ", "Trade"],["G", "Dylan Garand", "", "NYR", "Free Agency"],["G", "Logan Thompson", "", "WSH", "Draft"],["Bench", "Kirill Marchenko", "IR", "TOR", "Draft"],["Bench", "Lucas Raymond", "", "DET", "Draft"],["Bench", "Jake Allen", "", "NJ", "Free Agency"],["Bench", "Tom Wilson", "", "WSH", "Free Agency"]],
  kimi: [["F", "David Pastrnak", "", "BOS", "Draft"],["F", "Brayden Point", "", "TB", "Draft"],["F", "Sebastian Aho", "", "CAR", "Draft"],["F", "Sam Bennett", "", "FLA", "Free Agency"],["F", "Logan Stankoven", "", "CAR", "Free Agency"],["D", "Dougie Hamilton", "", "NJ", "Draft"],["D", "Devon Toews", "", "COL", "Draft"],["D", "Shea Theodore", "", "VGK", "Draft"],["UTIL", "Ryan Nugent-Hopkins", "", "EDM", "Free Agency"],["G", "Ilya Sorokin", "", "NYI", "Draft"],["G", "Ukko-Pekka Luukkonen", "", "BUF", "Free Agency"],["Bench", "Artemi Panarin", "", "LA", "Draft"],["Bench", "Adrian Kempe", "DTD", "LA", "Draft"],["Bench", "Morgan Rielly", "", "TOR", "Draft"],["Bench", "Roope Hintz", "", "DAL", "Draft"],["IR", "Aleksander Barkov", "IR", "FLA", "Draft"]],
  chatgpt: [["F", "Macklin Celebrini", "", "SJ", "Draft"],["F", "Jason Robertson", "", "DAL", "Draft"],["F", "Martin Necas", "", "COL", "Draft"],["F", "Connor Bedard", "", "CHI", "Draft"],["F", "Andrei Svechnikov", "", "CAR", "Free Agency"],["D", "Lane Hutson", "", "MTL", "Draft"],["D", "Erik Karlsson", "", "PIT", "Free Agency"],["D", "Thomas Harley", "", "DAL", "Trade"],["UTIL", "Joel Farabee", "", "CGY", "Free Agency"],["G", "Jake Oettinger", "", "DAL", "Draft"],["G", "Jakub Dobes", "", "MTL", "Draft"],["Bench", "Boone Jenner", "", "WSH", "Free Agency"],["Bench", "Kevin Fiala", "IR", "LA", "Trade"],["Bench", "Philip Broberg", "", "STL", "Free Agency"],["Bench", "Neal Pionk", "", "WPG", "Trade"],["IR", "Ivan Demidov", "IR", "MTL", "Free Agency"]],
  grok: [["F", "Connor McDavid", "", "EDM", "Draft"],["F", "Kyle Connor", "", "WPG", "Draft"],["F", "Brady Tkachuk", "", "FLA", "Draft"],["F", "William Nylander", "", "TOR", "Draft"],["F", "Brandon Hagel", "", "TB", "Draft"],["D", "Zach Werenski", "", "CBJ", "Draft"],["D", "Jakob Chychrun", "", "WSH", "Draft"],["D", "Vince Dunn", "", "SEA", "Trade"],["UTIL", "Carter Verhaeghe", "", "FLA", "Trade"],["G", "Jesper Wallstedt", "", "MIN", "Draft"],["G", "Carter Hart", "", "VGK", "Trade"],["Bench", "Josh Morrissey", "IR", "WPG", "Draft"],["Bench", "Jared McCann", "IR", "SEA", "Free Agency"],["Bench", "Jack Quinn", "", "BUF", "Free Agency"],["Bench", "Tristan Luneau", "", "ANA", "Free Agency"],["IR", "Linus Ullmark", "IR", "OTT", "Draft"]],
  qwen: [["F", "Auston Matthews", "", "TOR", "Draft"],["F", "Jack Hughes", "", "NJ", "Draft"],["F", "Matthew Tkachuk", "", "FLA", "Draft"],["F", "Clayton Keller", "", "UTA", "Draft"],["F", "Elias Pettersson", "", "VAN", "Draft"],["D", "Adam Fox", "", "NYR", "Draft"],["D", "Miro Heiskanen", "", "DAL", "Draft"],["D", "Charlie McAvoy", "", "BOS", "Draft"],["UTIL", "Joel Eriksson Ek", "", "MIN", "Free Agency"],["G", "Joseph Woll", "", "PHI", "Draft"],["G", "Dustin Wolf", "", "CGY", "Trade"],["Bench", "Brad Marchand", "IR", "FLA", "Draft"],["Bench", "Stuart Skinner", "", "WPG", "Free Agency"],["Bench", "Rasmus Andersson", "", "VGK", "Free Agency"],["Bench", "Calvin Pickard", "", null, "Free Agency"],["IR", "Filip Gustavsson", "IR", "MIN", "Free Agency"]],
  deepseek: [["F", "Kirill Kaprizov", "", "MIN", "Draft"],["F", "Mika Zibanejad", "", "NYR", "Draft"],["F", "Dylan Cozens", "", "OTT", "Draft"],["F", "Pavel Buchnevich", "", "STL", "Draft"],["F", "Alex Laferriere", "", "LA", "Free Agency"],["D", "Quinn Hughes", "", "MIN", "Draft"],["D", "John Carlson", "", "TB", "Draft"],["D", "Tyler Kleven", "", "OTT", "Free Agency"],["UTIL", "Nick Schmaltz", "", "UTA", "Draft"],["G", "Jeremy Swayman", "", "BOS", "Draft"],["G", "Petr Mrazek", "O", "ANA", "Draft"],["Bench", "Nick Suzuki", "O", "MTL", "Draft"],["Bench", "Mattias Ekholm", "", "EDM", "Draft"],["Bench", "Mason McTavish", "", "STL", "Draft"],["Bench", "Taylor Hall", "DTD", "CAR", "Free Agency"],["IR", "Dylan Larkin", "IR", "DET", "Draft"]],
  gemini: [["F", "Nikita Kucherov", "", "TB", "Draft"],["F", "J.T. Miller", "", "NYR", "Draft"],["F", "Vincent Trocheck", "", "UTA", "Draft"],["F", "Timo Meier", "", "NJ", "Draft"],["F", "Alex Ovechkin", "", "WSH", "Draft"],["D", "Evan Bouchard", "", "EDM", "Draft"],["D", "Roman Josi", "", "NSH", "Draft"],["D", "Brandon Montour", "", "SEA", "Draft"],["UTIL", "Robert Thomas", "", "STL", "Trade"],["G", "Connor Hellebuyck", "", "NJ", "Draft"],["G", "Sergei Bobrovsky", "", "TOR", "Draft"],["Bench", "Travis Konecny", "", "PHI", "Draft"],["Bench", "Cole Perfetti", "", "WPG", "Free Agency"],["Bench", "Pyotr Kochetkov", "", "CAR", "Free Agency"],["Bench", "Luke Hughes", "", "NJ", "Free Agency"],["IR", "Brock Faber", "IR", "MIN", "Trade"]]
};
/* basketball rosters as locked for Week 2 (Oct 26), after waivers, the trade and FA adds.
   [slot, player, ESPN status at lock, NBA team, how acquired] */
LEAGUES.basketball.rosters = {
  fable: [["PG","Damian Lillard","","POR","Draft"],["SG","Stephon Castle","","SA","Draft"],["SF","Cooper Flagg","","DAL","Draft"],["PF","Jalen Johnson","DTD","ATL","Draft"],["C","Derik Queen","","NO","Draft"],["G","James Harden","","CLE","Draft"],["F","Saddiq Bey","","NO","Waivers"],["UTIL","Joel Embiid","DTD","PHI","Draft"],["UTIL","Cameron Boozer","","MEM","Draft"],["UTIL","Andrew Nembhard","","IND","Draft"],["Bench","Darius Garland","","LAC","Draft"],["Bench","Zaccharie Risacher","","DAL","Free Agency"],["Bench","Mark Williams","O","PHX","Waivers"],["IR","Jalen Duren","O","DET","Draft"]],
  espn: [["PG","LaMelo Ball","","MIN","Draft"],["SG","Keyonte George","","UTAH","Draft"],["SF","Deni Avdija","","POR","Draft"],["PF","Naz Reid","","CHA","Draft"],["C","Nikola Jokic","","DEN","Draft"],["G","Trae Young","","WSH","Draft"],["F","AJ Dybantsa","","WSH","Draft"],["UTIL","Kyrie Irving","DTD","DAL","Draft"],["UTIL","Nickeil Alexander-Walker","","ATL","Draft"],["UTIL","Ty Jerome","","MEM","Draft"],["Bench","Kawhi Leonard","O","TOR","Draft"],["Bench","Darius Acuff Jr.","","SAC","Draft"],["Bench","Mikal Bridges","","NY","Free Agency"],["IR","Kon Knueppel","O","CHA","Draft"]],
  sonnet: [["PG","Cade Cunningham","","DET","Draft"],["SG","Dylan Harper","","SA","Draft"],["SF","Franz Wagner","","ORL","Draft"],["PF","Paul George","","BOS","Draft"],["C","Karl-Anthony Towns","","NY","Draft"],["G","Jrue Holiday","","POR","Draft"],["F","Michael Porter Jr.","","BKN","Draft"],["UTIL","Jaren Jackson Jr.","O","UTAH","Draft"],["UTIL","Ace Bailey","","UTAH","Draft"],["UTIL","Moussa Diabate","","CHA","Waivers"],["Bench","Jordan Poole","O","NO","Trade"],["Bench","Draymond Green","DTD","GS","Draft"],["Bench","Grayson Allen","","CHA","Free Agency"]],
  meta: [["PG","Jamal Murray","","DEN","Draft"],["SG","Dyson Daniels","","ATL","Draft"],["SF","Christian Braun","","DEN","Draft"],["PF","Jalen Smith","DTD","CHI","Waivers"],["C","Jarrett Allen","","CLE","Trade"],["G","Payton Pritchard","","BOS","Draft"],["F","Jaylen Brown","","PHI","Draft"],["UTIL","Immanuel Quickley","","TOR","Draft"],["UTIL","Yaxel Lendeborg","","GS","Free Agency"],["UTIL","Ajay Mitchell","","OKC","Trade"],["Bench","Rudy Gobert","","MIN","Draft"],["Bench","Aaron Gordon","","DEN","Draft"],["Bench","De'Anthony Melton","","GS","Waivers"],["IR","Anthony Edwards","O","MIN","Draft"]],
  kimi: [["PG","Stephen Curry","DTD","GS","Draft"],["SG","Devin Vassell","","SA","Draft"],["SF","Kevin Durant","","HOU","Draft"],["PF","Giannis Antetokounmpo","","MIA","Draft"],["C","Daniel Gafford","","DAL","Draft"],["G","Fred VanVleet","","HOU","Draft"],["F","LeBron James","","PHI","Draft"],["UTIL","Deandre Ayton","","WSH","Draft"],["UTIL","Malik Monk","","SAC","Waivers"],["UTIL","Scoot Henderson","","POR","Waivers"],["Bench","Jerami Grant","","MEM","Trade"],["Bench","Ja Morant","O","POR","Draft"],["Bench","Kristaps Porzingis","O","GS","Draft"],["IR","Jimmy Butler III","O","GS","Draft"]],
  chatgpt: [["PG","Donovan Mitchell","","CLE","Draft"],["SG","RJ Barrett","","TOR","Draft"],["SF","Lauri Markkanen","","UTAH","Draft"],["PF","Paul Reed","","DET","Free Agency"],["C","Myles Turner","","MIL","Draft"],["G","Kris Dunn","","LAC","Waivers"],["F","Herbert Jones","","NO","Draft"],["UTIL","Zach LaVine","DTD","SAC","Draft"],["UTIL","Jakob Poeltl","DTD","TOR","Draft"],["UTIL","Naji Marshall","","DAL","Waivers"],["Bench","Tobias Harris","O","SA","Draft"],["Bench","Jalen Suggs","O","ORL","Draft"],["Bench","Pelle Larsson","","MIA","Free Agency"],["IR","Tyrese Haliburton","O","IND","Draft"]],
  grok: [["PG","Shai Gilgeous-Alexander","","OKC","Draft"],["SG","Amen Thompson","","HOU","Draft"],["SF","Brandon Miller","","CHA","Draft"],["PF","Julius Randle","","BKN","Draft"],["C","Alperen Sengun","","HOU","Draft"],["G","Austin Reaves","","LAL","Draft"],["F","Matas Buzelis","","CHI","Draft"],["UTIL","Jalen Green","","PHX","Draft"],["UTIL","Kel'el Ware","","MIL","Draft"],["UTIL","Alex Sarr","DTD","WSH","Draft"],["Bench","VJ Edgecombe","","PHI","Draft"],["Bench","Yves Missi","O","NO","Waivers"],["Bench","Dennis Schroder","","CHA","Waivers"]],
  qwen: [["PG","Dejounte Murray","","NO","Draft"],["SG","Bennedict Mathurin","","NO","Waivers"],["SF","Scottie Barnes","","TOR","Draft"],["PF","Tari Eason","","HOU","Draft"],["C","Victor Wembanyama","","SA","Draft"],["G","Alex Caruso","O","OKC","Draft"],["F","OG Anunoby","","NY","Draft"],["UTIL","Walker Kessler","","LAL","Draft"],["UTIL","Cameron Johnson","","DEN","Waivers"],["UTIL","Brandin Podziemski","","GS","Draft"],["Bench","Gary Payton II","","GS","Waivers"],["Bench","Josh Hart","","NY","Trade"],["Bench","Corey Kispert","","ATL","Free Agency"]],
  deepseek: [["PG","Tyrese Maxey","","PHI","Draft"],["SG","Josh Giddey","","CHI","Draft"],["SF","Jaime Jaquez Jr.","","MIL","Draft"],["PF","Pascal Siakam","","IND","Draft"],["C","Domantas Sabonis","","SAC","Draft"],["G","Jeremiah Fears","","NO","Waivers"],["F","Caleb Wilson","","CHI","Draft"],["UTIL","Onyeka Okongwu","","ATL","Draft"],["UTIL","Day'Ron Sharpe","","BKN","Draft"],["UTIL","Collin Gillespie","","PHX","Waivers"],["Bench","Keaton Wagler","","LAC","Free Agency"],["Bench","Ryan Rollins","","MIL","Free Agency"],["Bench","Brandon Ingram","O","LAC","Draft"],["IR","Chet Holmgren","O","OKC","Trade"]],
  gemini: [["PG","De'Aaron Fox","","SA","Draft"],["SG","Desmond Bane","","ORL","Draft"],["SF","Miles Bridges","","PHX","Draft"],["PF","Jayson Tatum","","BOS","Draft"],["C","Anthony Davis","","WSH","Draft"],["G","Coby White","","CHA","Draft"],["F","Norman Powell","","CHI","Draft"],["UTIL","CJ McCollum","","ATL","Draft"],["UTIL","Anfernee Simons","","PHI","Draft"],["UTIL","Tre Jones","","CHI","Free Agency"],["Bench","Nic Claxton","O","CHI","Draft"],["Bench","John Collins","","DET","Waivers"],["Bench","Cam Whitmore","","DEN","Waivers"]],
  mistral: [["PG","Luka Doncic","","LAL","Draft"],["SG","Tyler Herro","","MIL","Draft"],["SF","Keegan Murray","O","SAC","Free Agency"],["PF","Toumani Camara","","POR","Waivers"],["C","Bam Adebayo","","MIA","Draft"],["G","Derrick White","","BOS","Trade"],["F","Jaden McDaniels","","MIN","Draft"],["UTIL","Zion Williamson","","NO","Draft"],["UTIL","Jonathan Kuminga","","MIN","Draft"],["UTIL","Shaedon Sharpe","O","POR","Waivers"],["Bench","Jalen Williams","O","OKC","Draft"],["Bench","Dereck Lively II","O","DAL","Draft"],["Bench","Mitchell Robinson","DTD","BOS","Waivers"]],
  instinct: [["PG","Jalen Brunson","","NY","Draft"],["SG","Devin Booker","","PHX","Draft"],["SF","Trey Murphy III","DTD","NO","Draft"],["PF","Evan Mobley","","CLE","Draft"],["C","Isaiah Hartenstein","","OKC","Draft"],["G","Ayo Dosunmu","","MIN","Draft"],["F","Jabari Smith Jr.","","HOU","Draft"],["UTIL","Donovan Clingan","","POR","Draft"],["UTIL","Davion Mitchell","","MIA","Waivers"],["UTIL","Kyshawn George","","WSH","Waivers"],["Bench","Kyle Kuzma","","MIL","Draft"],["Bench","Jaylen Wells","","MEM","Draft"],["Bench","Aaron Wiggins","","ATL","Free Agency"],["IR","Paolo Banchero","O","ORL","Draft"]]
}; 
/* hockey draft: snake, 14 rounds captured; round 15 names not archived. [rd,player,team,pos,owner] per pick in pick order */
LEAGUES.hockey.draftBoard = [
  [1,"Cale Makar","COL","D","sonnet"],[1,"David Pastrnak","BOS","RW","kimi"],[1,"Nikita Kucherov","TB","RW","gemini"],[1,"Moritz Seider","DET","D","espn"],[1,"Leon Draisaitl","EDM","C","meta"],[1,"Connor McDavid","EDM","C","grok"],[1,"Auston Matthews","TOR","C","qwen"],[1,"Macklin Celebrini","SJ","C","chatgpt"],[1,"Kirill Kaprizov","MIN","LW","deepseek"],[1,"Nathan MacKinnon","COL","C","fable"],
  [2,"Andrei Vasilevskiy","TB","G","fable"],[2,"Quinn Hughes","MIN","D","deepseek"],[2,"Jason Robertson","DAL","LW","chatgpt"],[2,"Jack Hughes","NJ","C","qwen"],[2,"Zach Werenski","CBJ","D","grok"],[2,"Mikko Rantanen","DAL","RW","meta"],[2,"Matt Boldy","MIN","LW","espn"],[2,"Connor Hellebuyck","NJ","G","gemini"],[2,"Igor Shesterkin","NYR","G","kimi"],[2,"Jack Eichel","VGK","C","sonnet"],
  [3,"Mitch Marner","VGK","RW","sonnet"],[3,"Artemi Panarin","LA","LW","kimi"],[3,"Evan Bouchard","EDM","D","gemini"],[3,"Noah Dobson","MTL","D","espn"],[3,"Tage Thompson","BUF","C","meta"],[3,"Kyle Connor","WPG","LW","grok"],[3,"Adam Fox","NYR","D","qwen"],[3,"Martin Necas","COL","RW","chatgpt"],[3,"Nick Suzuki","MTL","C","deepseek"],[3,"Wyatt Johnston","DAL","C","fable"],
  [4,"Mark Scheifele","WPG","C","fable"],[4,"Jeremy Swayman","BOS","G","deepseek"],[4,"Jake Oettinger","DAL","G","chatgpt"],[4,"Matthew Tkachuk","FLA","RW","qwen"],[4,"Brady Tkachuk","FLA","LW","grok"],[4,"Logan Thompson","WSH","G","meta"],[4,"Filip Forsberg","NSH","LW","espn"],[4,"J.T. Miller","NYR","C","gemini"],[4,"Ilya Sorokin","NYI","G","kimi"],[4,"Rasmus Dahlin","BUF","D","sonnet"],
  [5,"Juuse Saros","NSH","G","sonnet"],[5,"Brayden Point","TB","C","kimi"],[5,"Roman Josi","NSH","D","gemini"],[5,"Jake Guentzel","TB","LW","espn"],[5,"Jake Sanderson","OTT","D","meta"],[5,"William Nylander","TOR","RW","grok"],[5,"Miro Heiskanen","DAL","D","qwen"],[5,"Cutter Gauthier","ANA","LW","chatgpt"],[5,"Dylan Larkin","DET","C","deepseek"],[5,"Cole Caufield","MTL","LW","fable"],
  [6,"Brandt Clarke","LA","D","fable"],[6,"Mika Zibanejad","NYR","C","deepseek"],[6,"Lane Hutson","MTL","D","chatgpt"],[6,"Elias Pettersson","VAN","C","qwen"],[6,"Jesper Wallstedt","MIN","G","grok"],[6,"Matthew Schaefer","NYI","D","meta"],[6,"Alex Tuch","WSH","RW","espn"],[6,"Sergei Bobrovsky","TOR","G","gemini"],[6,"Aleksander Barkov","FLA","C","kimi"],[6,"Tim Stutzle","OTT","C","sonnet"],
  [7,"Kevin Fiala","LA","LW","sonnet"],[7,"Dougie Hamilton","NJ","D","kimi"],[7,"Vincent Trocheck","UTA","C","gemini"],[7,"MacKenzie Weegar","UTA","D","espn"],[7,"Brandon Bussi","CAR","G","meta"],[7,"Jakob Chychrun","WSH","D","grok"],[7,"Charlie McAvoy","BOS","D","qwen"],[7,"Connor Bedard","CHI","C","chatgpt"],[7,"Mattias Ekholm","EDM","D","deepseek"],[7,"Sam Reinhart","FLA","RW","fable"],
  [8,"Scott Wedgewood","COL","G","fable"],[8,"John Carlson","TB","D","deepseek"],[8,"Darren Raddysh","TOR","D","chatgpt"],[8,"Jacob Markstrom","FLA","G","qwen"],[8,"Brandon Hagel","TB","LW","grok"],[8,"Dylan Guenther","UTA","RW","meta"],[8,"Alex DeBrincat","DET","LW","espn"],[8,"Brandon Montour","SEA","D","gemini"],[8,"Adrian Kempe","LA","RW","kimi"],[8,"Lukas Dostal","ANA","G","sonnet"],
  [9,"Thomas Harley","DAL","D","sonnet"],[9,"Devon Toews","COL","D","kimi"],[9,"Timo Meier","NJ","LW","gemini"],[9,"Juraj Slafkovsky","MTL","LW","espn"],[9,"Jake McCabe","TOR","D","meta"],[9,"Linus Ullmark","OTT","G","grok"],[9,"Clayton Keller","UTA","LW","qwen"],[9,"Jakub Dobes","MTL","G","chatgpt"],[9,"Petr Mrazek","ANA","G","deepseek"],[9,"Mikhail Sergachev","UTA","D","fable"],
  [10,"Leo Carlsson","ANA","C","fable"],[10,"Nick Schmaltz","UTA","C","deepseek"],[10,"Jackson LaCombe","ANA","D","chatgpt"],[10,"Joseph Woll","PHI","G","qwen"],[10,"Josh Morrissey","WPG","D","grok"],[10,"Sidney Crosby","PIT","C","meta"],[10,"Steven Stamkos","NSH","C","espn"],[10,"Alex Ovechkin","WSH","LW","gemini"],[10,"Morgan Rielly","TOR","D","kimi"],[10,"Jesper Bratt","NJ","RW","sonnet"],
  [11,"Seth Jarvis","CAR","RW","sonnet"],[11,"Sebastian Aho","CAR","C","kimi"],[11,"Travis Konecny","PHI","RW","gemini"],[11,"Rasmus Andersson","VGK","D","espn"],[11,"Kirill Marchenko","TOR","LW","meta"],[11,"Nico Hischier","NJ","C","grok"],[11,"Zach Hyman","EDM","RW","qwen"],[11,"Robert Thomas","STL","C","chatgpt"],[11,"Dylan Cozens","OTT","C","deepseek"],[11,"Mackenzie Blackwood","COL","G","fable"],
  [12,"Mattias Samuelsson","BUF","D","fable"],[12,"Cole Perfetti","WPG","LW","deepseek"],[12,"Dylan Holloway","STL","LW","chatgpt"],[12,"Brad Marchand","FLA","LW","qwen"],[12,"Nazem Kadri","COL","C","grok"],[12,"Lucas Raymond","DET","LW","meta"],[12,"Mike Matheson","MTL","D","espn"],[12,"Carter Verhaeghe","FLA","LW","gemini"],[12,"Roope Hintz","DAL","C","kimi"],[12,"Mark Stone","VGK","RW","sonnet"],
  [13,"Victor Hedman","TB","D","sonnet"],[13,"Shea Theodore","VGK","D","kimi"],[13,"Matty Beniers","SEA","C","gemini"],[13,"Sergei Murashov","PIT","G","espn"],[13,"Pavel Dorofeyev","NYR","RW","meta"],[13,"Brock Faber","MIN","D","grok"],[13,"Brock Boeser","VAN","RW","qwen"],[13,"Will Smith","SJ","RW","chatgpt"],[13,"Pavel Buchnevich","STL","RW","deepseek"],[13,"Travis Sanheim","PHI","D","fable"],
  [14,"Logan Cooley","UTA","C","fable"],[14,"Mason McTavish","STL","C","deepseek"],[14,"Drake Batherson","OTT","RW","chatgpt"],[14,"Jordan Kyrou","WSH","RW","qwen"],[14,"Vince Dunn","SEA","D","grok"],[14,"Adam Fantilli","CBJ","C","meta"],[14,"Karel Vejmelka","UTA","G","espn"],[14,"Dylan Strome","WSH","C","gemini"],[14,"Tom Wilson","WSH","RW","kimi"],[14,"Nikolaj Ehlers","CAR","LW","sonnet"]
];

LEAGUES.basketball.draftBoard = LEAGUES.basketball.board.map(function(r){return [parseInt(r[0],10), r[3], r[4], r[5], r[2]];});

/* football draft: 15-round snake, pasted from ESPN 2026-10-23. [rd,player,team,pos,owner] in pick order */
LEAGUES.football.draftBoard = [
  [1,"CeeDee Lamb","DAL","WR","gemini"],[1,"Amon-Ra St. Brown","DET","WR","meta"],[1,"Jonathan Taylor","IND","RB","fable"],[1,"Bijan Robinson","ATL","RB","kimi"],[1,"Puka Nacua","LAR","WR","deepseek"],[1,"Ja'Marr Chase","CIN","WR","grok"],[1,"Christian McCaffrey","SF","RB","chatgpt"],[1,"De'Von Achane","MIA","RB","sonnet"],[1,"Jaxon Smith-Njigba","SEA","WR","espn"],[1,"Jahmyr Gibbs","DET","RB","qwen"],
  [2,"Drake London","ATL","WR","qwen"],[2,"Omarion Hampton","LAC","RB","espn"],[2,"Justin Jefferson","MIN","WR","sonnet"],[2,"Nico Collins","HOU","WR","chatgpt"],[2,"Chase Brown","CIN","RB","grok"],[2,"Ashton Jeanty","LV","RB","deepseek"],[2,"Malik Nabers","NYG","WR","kimi"],[2,"Derrick Henry","BAL","RB","fable"],[2,"James Cook III","BUF","RB","meta"],[2,"Saquon Barkley","PHI","RB","gemini"],
  [3,"DeVonta Smith","PHI","WR","gemini"],[3,"Brock Bowers","LV","TE","meta"],[3,"Chris Olave","NO","WR","fable"],[3,"Trey McBride","ARI","TE","kimi"],[3,"Rashee Rice","KC","WR","deepseek"],[3,"Kenneth Walker III","KC","RB","grok"],[3,"A.J. Brown","NE","WR","chatgpt"],[3,"Kyren Williams","LAR","RB","sonnet"],[3,"Jeremiyah Love","ARI","RB","espn"],[3,"Breece Hall","NYJ","RB","qwen"],
  [4,"Mike Evans","SF","WR","qwen"],[4,"Josh Allen","BUF","QB","espn"],[4,"George Pickens","DAL","WR","sonnet"],[4,"Lamar Jackson","BAL","QB","chatgpt"],[4,"Garrett Wilson","NYJ","WR","grok"],[4,"Colston Loveland","CHI","TE","deepseek"],[4,"Zay Flowers","BAL","WR","kimi"],[4,"Javonte Williams","DAL","RB","fable"],[4,"Tee Higgins","CIN","WR","meta"],[4,"Josh Jacobs","GB","RB","gemini"],
  [5,"Terry McLaurin","WSH","WR","gemini"],[5,"Cam Skattebo","NYG","RB","meta"],[5,"Tetairoa McMillan","CAR","WR","fable"],[5,"Rhamondre Stevenson","NE","RB","kimi"],[5,"Quinshon Judkins","CLE","RB","deepseek"],[5,"Jaylen Waddle","DEN","WR","grok"],[5,"James Conner","ARI","RB","chatgpt"],[5,"Bucky Irving","TB","RB","sonnet"],[5,"Travis Etienne Jr.","NO","RB","espn"],[5,"Ladd McConkey","LAC","WR","qwen"],
  [6,"Jaylen Warren","PIT","RB","qwen"],[6,"Davante Adams","LAR","WR","espn"],[6,"George Kittle","SF","TE","sonnet"],[6,"Sam LaPorta","DET","TE","chatgpt"],[6,"Tyler Warren","IND","TE","grok"],[6,"TreVeyon Henderson","NE","RB","deepseek"],[6,"Marvin Harrison Jr.","HOU","WR","kimi"],[6,"Jayden Daniels","WSH","QB","fable"],[6,"Emeka Egbuka","TB","WR","meta"],[6,"Jalen Hurts","PHI","QB","gemini"],
  [7,"Kyle Pitts Sr.","ATL","TE","gemini"],[7,"Joe Burrow","CIN","QB","meta"],[7,"D'Andre Swift","CHI","RB","fable"],[7,"Patrick Mahomes","KC","QB","kimi"],[7,"Dak Prescott","DAL","QB","deepseek"],[7,"Drake Maye","NE","QB","grok"],[7,"Jameson Williams","DET","WR","chatgpt"],[7,"Justin Herbert","LAC","QB","sonnet"],[7,"DJ Moore","BUF","WR","espn"],[7,"Dalton Kincaid","BUF","TE","qwen"],
  [8,"Brian Thomas Jr.","JAX","WR","qwen"],[8,"Bhayshul Tuten","JAX","RB","espn"],[8,"DK Metcalf","PIT","WR","sonnet"],[8,"Rome Odunze","CHI","WR","chatgpt"],[8,"Tony Pollard","TEN","RB","grok"],[8,"Braelon Allen","NYJ","RB","deepseek"],[8,"Alvin Kamara","NO","RB","kimi"],[8,"Christian Watson","GB","WR","fable"],[8,"Luther Burden III","CHI","WR","meta"],[8,"David Montgomery","HOU","RB","gemini"],
  [9,"Jakobi Meyers","JAX","WR","gemini"],[9,"Jordan Mason","MIN","RB","meta"],[9,"Tucker Kraft","GB","TE","fable"],[9,"Giants D/ST","NYG","D/ST","kimi"],[9,"Tyler Bass","BUF","K","deepseek"],[9,"Courtland Sutton","DEN","WR","grok"],[9,"Travis Hunter","JAX","WR","chatgpt"],[9,"Cooper Kupp","SEA","WR","sonnet"],[9,"Jadarian Price","SEA","RB","espn"],[9,"Chuba Hubbard","CAR","RB","qwen"],
  [10,"Caleb Williams","CHI","QB","qwen"],[10,"Michael Pittman Jr.","PIT","WR","espn"],[10,"Aaron Jones Sr.","MIN","RB","sonnet"],[10,"Jordan Addison","MIN","WR","chatgpt"],[10,"Broncos D/ST","DEN","D/ST","grok"],[10,"49ers D/ST","SF","D/ST","deepseek"],[10,"Jayden Reed","GB","WR","kimi"],[10,"Parker Washington","JAX","WR","fable"],[10,"Carnell Tate","TEN","WR","meta"],[10,"Xavier Worthy","KC","WR","gemini"],
  [11,"Khalil Shakir","BUF","WR","gemini"],[11,"J.K. Dobbins","DEN","RB","meta"],[11,"Jacory Croskey-Merritt","WSH","RB","fable"],[11,"Tyjae Spears","TEN","RB","kimi"],[11,"Kaelon Black","SF","RB","deepseek"],[11,"Cameron Dicker","LAC","K","grok"],[11,"Stefon Diggs","WSH","WR","chatgpt"],[11,"Chris Godwin Jr.","TB","WR","sonnet"],[11,"Travis Kelce","KC","TE","espn"],[11,"Brandon Aubrey","DAL","K","qwen"],
  [12,"Steelers D/ST","PIT","D/ST","qwen"],[12,"Kenny Gainwell","TB","RB","espn"],[12,"Jerry Jeudy","CLE","WR","sonnet"],[12,"Kendre Miller","NO","RB","chatgpt"],[12,"Blake Corum","LAR","RB","grok"],[12,"Jonah Coleman","DEN","RB","deepseek"],[12,"Jahan Dotson","ATL","WR","kimi"],[12,"Deebo Samuel Sr.","SF","WR","fable"],[12,"Jalen Coker","CAR","WR","meta"],[12,"Jaguars D/ST","JAX","D/ST","gemini"],
  [13,"Tyler Allgeier","ARI","RB","gemini"],[13,"Josh Downs","IND","WR","meta"],[13,"Tyler Loop","BAL","K","fable"],[13,"Michael Wilson","ARI","WR","kimi"],[13,"Bryce Young","CAR","QB","deepseek"],[13,"Ray Davis","BUF","RB","grok"],[13,"Rachaad White","WSH","RB","chatgpt"],[13,"Rico Dowdle","PIT","RB","sonnet"],[13,"Jaxson Dart","NYG","QB","espn"],[13,"Eagles D/ST","PHI","D/ST","qwen"],
  [14,"Isaac Guerendo","SF","RB","qwen"],[14,"Cowboys D/ST","DAL","D/ST","espn"],[14,"Texans D/ST","HOU","D/ST","sonnet"],[14,"Bills D/ST","BUF","D/ST","chatgpt"],[14,"Jauan Jennings","MIN","WR","grok"],[14,"Tyler Shough","NO","QB","deepseek"],[14,"Chiefs D/ST","KC","D/ST","kimi"],[14,"MarShawn Lloyd","GB","RB","fable"],[14,"Seahawks D/ST","SEA","D/ST","meta"],[14,"Ravens D/ST","BAL","D/ST","gemini"],
  [15,"Evan McPherson","CIN","K","gemini"],[15,"Ka'imi Fairbairn","HOU","K","meta"],[15,"Chargers D/ST","LAC","D/ST","fable"],[15,"Harrison Butker","KC","K","kimi"],[15,"Caleb Douglas","MIA","WR","deepseek"],[15,"Wan'Dale Robinson","TEN","WR","grok"],[15,"Brandon McManus","LAR","K","chatgpt"],[15,"Jason Myers","SEA","K","sonnet"],[15,"Jake Elliott","PHI","K","espn"],[15,"Kimani Vidal","LAC","RB","qwen"]
];
