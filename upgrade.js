const upgradeStyle = document.createElement("style");
upgradeStyle.textContent = `
.basis-panel,.method-panel,.whatif-panel,.sensitivity-panel,.risk-states-panel,.system-architecture-panel,.ml-validation-panel{margin-top:15px}
.basis-flow,.system-architecture{display:flex;align-items:center;gap:7px;overflow:auto;padding:12px 0 5px;white-space:nowrap;scrollbar-width:thin}
.basis-flow span,.system-architecture span{padding:8px 9px;border:1px solid #355260;background:#091b27;color:#c2d2d7;font:8px var(--mono)}
.basis-flow span:nth-of-type(2),.basis-flow span:nth-of-type(4){border-color:#52848a;color:#8ce1dd}
.basis-flow b,.system-architecture b{color:var(--cyan);font:12px var(--mono)}
.equation-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}
.equation-card{padding:11px;border:1px solid #2b4452;background:#071923}
.equation-card code{display:block;color:#e5f1f3;font:14px var(--mono);white-space:normal}
.equation-card p{margin:6px 0 0;color:#92a8b2;font-size:10px;line-height:1.45}
.method-intro{color:#b3c3ca;font-size:11px;line-height:1.55}
.method-columns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.method-list{padding:10px 12px;border:1px solid #2a4350;background:#071923}
.method-list h3{margin:0 0 7px;color:#b9cbd1;font:600 12px var(--display)}
.method-list ul{display:grid;gap:5px;margin:0;padding-left:17px;color:#93a8b2;font-size:10px}
.method-list li::marker{color:var(--cyan)}
.advanced-methods{margin-top:10px;padding:9px 11px;border-left:2px solid #547d87;background:#0a1b26;color:#93a8b2;font-size:10px;line-height:1.5}
.advanced-methods b{color:#d0dfe3}
.whatif-panel{scroll-margin-top:14px}
.whatif-demo-bar{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}
.whatif-demo-bar button,.whatif-card button{min-height:36px;padding:0 10px;border:1px solid #35515e;background:#0a202c;color:#b9cbd1;cursor:pointer;font:8px var(--mono);letter-spacing:.25px}
.whatif-demo-bar button:hover,.whatif-card button:hover{border-color:var(--cyan);color:#e4f8f8;background:#123744}
.whatif-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.whatif-card{min-width:0;padding:11px;border:1px solid #2c4654;background:#091b27}
.whatif-card[data-risk="MODERATE"]{border-top:2px solid var(--moderate)}
.whatif-card[data-risk="HIGH"]{border-top:2px solid var(--high)}
.whatif-card[data-risk="CRITICAL"]{border-top:2px solid var(--critical)}
.whatif-card[data-risk="STABLE"]{border-top:2px solid var(--stable)}
.whatif-card .case-index{color:#72909b;font:8px var(--mono)}
.whatif-card h3{margin:4px 0 8px;color:#d7e4e8;font:600 15px var(--display)}
.whatif-metrics{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:8px 0;border-block:1px solid var(--soft)}
.whatif-metrics span{color:#8199a4;font:7px var(--mono)}
.whatif-metrics b{display:block;margin-top:3px;color:#dbe8eb;font:12px var(--mono)}
.whatif-card p{min-height:30px;margin:7px 0;color:#91a7b1;font-size:9px;line-height:1.45}
.whatif-card button{width:100%;margin-top:3px}
.whatif-note{margin:9px 0 0;color:#8097a2;font-size:9px}
.sensitivity-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:11px}
.sensitivity-card{min-width:0;padding:9px;border:1px solid #29424f;background:#071923}
.sensitivity-card h3{min-height:25px;margin:0;color:#bdcdd2;font:600 11px var(--display)}
.sensitivity-chart{height:132px}
.sensitivity-chart svg{width:100%;height:100%;display:block}
.sensitivity-note{min-height:27px;margin:4px 0 0;color:#8298a2;font-size:8px;line-height:1.35}
.sens-gridline{stroke:#2a414d;stroke-width:.7}.sens-axis{fill:#849aa4;font:7px var(--mono)}.sens-line{fill:none;stroke:#62cbd0;stroke-width:2}.sens-point{fill:#9be3df;stroke:#0b202b;stroke-width:1}.sens-reference{stroke:var(--yellow);stroke-width:1;stroke-dasharray:4 3}.sens-reference-label{fill:var(--yellow);font:7px var(--mono)}
.risk-state-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:10px}
.risk-state-card{padding:10px;border:1px solid #2c4552;background:#081a26;opacity:.78}
.risk-state-card[data-state="STABLE"]{--state-color:var(--stable)}.risk-state-card[data-state="MODERATE"]{--state-color:var(--moderate)}.risk-state-card[data-state="HIGH"]{--state-color:var(--high)}.risk-state-card[data-state="CRITICAL"]{--state-color:var(--critical)}
.risk-state-card.active{opacity:1;border-color:var(--state-color);box-shadow:inset 0 2px var(--state-color)}
.risk-state-card h3{margin:0;color:var(--state-color);font:600 13px var(--mono)}
.risk-state-card p{margin:6px 0 0;color:#9aadb5;font-size:9px;line-height:1.4}
.warning-items{display:grid;gap:5px;margin:9px 0 0;padding:0;list-style:none}
.warning-items li{display:grid;grid-template-columns:68px 1fr;gap:7px;align-items:start;padding:6px 8px;border-left:2px solid #516d78;background:#071923;color:#a8bac1;font-size:9px;line-height:1.4}
.warning-items b{font:8px var(--mono);color:#95b5be}
.warning-items li[data-severity="WATCH"]{border-color:var(--moderate)}.warning-items li[data-severity="WATCH"] b{color:var(--moderate)}
.warning-items li[data-severity="WARNING"]{border-color:var(--high)}.warning-items li[data-severity="WARNING"] b{color:var(--high)}
.warning-items li[data-severity="CRITICAL"]{border-color:var(--critical)}.warning-items li[data-severity="CRITICAL"] b{color:var(--critical)}
.trend-controls{display:flex;align-items:center;gap:8px;color:#8ea5af;font:8px var(--mono)}
.trend-controls select{min-height:32px;padding:0 8px;border:1px solid #34515e;background:#081b27;color:#d4e2e7;font:9px var(--mono)}
.system-architecture-panel{margin-top:15px}.system-architecture{display:grid;justify-items:center;gap:4px;white-space:normal;overflow:visible}
.system-architecture span{width:min(100%,520px);text-align:center}
.ml-validation-panel{padding:0}.ml-validation-panel summary{padding:12px;border:1px solid var(--line);color:#bacbd1;cursor:pointer;font:9px var(--mono)}
.ml-validation-copy{margin:10px 12px;color:#91a7b1;font-size:10px}
.ml-validation-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;padding:0 12px 12px}
.ml-validation-grid span{padding:9px;border:1px dashed #344d59;color:#8298a2;font:8px var(--mono)}
.prototype-kpi-extra{color:#74c8cf!important}
.decision-stamp{margin-top:10px;padding:9px;border:1px solid #52616a;background:#111f28;color:#d7c18b;font:8px var(--mono);letter-spacing:.35px}
.history-actions{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.history-actions .button{text-decoration:none}
.future-integrations{margin:9px 0 0;padding:10px;border-left:2px solid #547d87;background:#071923;color:#91a7b1;font-size:9px;line-height:1.5}
.future-integrations b{color:#c0d0d5;font:8px var(--mono)}
.gis-future{grid-column:1/-1;display:grid;gap:5px;padding:9px;border-left:2px solid #547d87;background:#071923;color:#9eb2bb;font-size:9px;line-height:1.4}
.gis-future b{color:#c2d0d6;font:8px var(--mono)}
.gis-future span{color:#8ce1dd;font:8px var(--mono)}
@media(max-width:1050px){.sensitivity-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.whatif-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.equation-grid,.method-columns{grid-template-columns:1fr}.risk-state-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.whatif-grid{grid-template-columns:1fr 1fr}.sensitivity-grid{grid-template-columns:1fr 1fr}.trend-controls{flex-wrap:wrap}}
@media(max-width:420px){.whatif-grid,.sensitivity-grid{grid-template-columns:1fr}.risk-state-grid{grid-template-columns:1fr 1fr}.whatif-demo-bar button{flex:1 1 45%;min-height:42px}.equation-card code{font-size:12px}.ml-validation-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media print{.whatif-demo-bar,.whatif-card button,.mobile-nav{display:none!important}}
`;
document.head.append(upgradeStyle);

const currentRisk = document.querySelector("#prototype-engine");
const analysisLayout = document.querySelector("#engineering-analysis");
const conditionPanel = document.querySelector("#condition");
const contributionPanel = document.querySelector("#contributions");
const trendSection = document.querySelector("#trends");
const reportPanel = document.querySelector(".report-controls");
const modelPanel = document.querySelector(".model-status-panel");

analysisLayout.insertAdjacentHTML("afterend", `
<section class="panel basis-panel" id="basis"><div class="section-head"><div><span class="kicker">ENGINEERING LOGIC · TRANSPARENT BASIS</span><h2>GEOTECHNICAL ENGINEERING BASIS</h2></div><span class="index">01—06</span></div>
<div class="basis-flow"><span>SOIL PARAMETERS</span><b>↓</b><span>MOHR–COULOMB SHEAR STRENGTH</span><b>↓</b><span>EFFECTIVE STRESS</span><b>↓</b><span>INFINITE-SLOPE STABILITY</span><b>↓</b><span>FACTOR OF SAFETY</span><b>↓</b><span>RISK CLASSIFICATION</span><b>↓</b><span>DECISION SUPPORT</span></div>
<div class="equation-grid">
<article class="equation-card"><code>τf = c′ + σ′n tan φ′</code><p>Mohr–Coulomb shear strength: cohesion plus frictional resistance acting on the soil plane.</p></article>
<article class="equation-card"><code>σ′n = σn − u</code><p>Effective normal stress is the total stress carried by the soil skeleton after pore-water pressure is removed.</p></article>
<article class="equation-card"><code>σn = γH cos²β</code><p>Normal stress approximation from unit weight, vertical slope height, and slope angle.</p></article>
<article class="equation-card"><code>u = ru σn</code><p>Pore pressure is represented by the entered pore-pressure ratio ru multiplied by normal stress.</p></article>
<article class="equation-card"><code>τresisting = c + σ′n tan φ</code><p>Available resisting shear from cohesion and effective-stress friction using the entered effective parameters.</p></article>
<article class="equation-card"><code>τdriving = γH sinβ cosβ + q sinβ cosβ + khγH cos²β</code><p>Simplified gravity, surcharge, and horizontal seismic driving-stress components.</p></article>
<article class="equation-card"><code>FS = τresisting / τdriving</code><p>Ratio of available resisting shear to the approximated driving shear for this screening case.</p></article>
</div><p class="small-note">Primes denote effective soil strength parameters. This compact infinite-slope approximation is not a complete limit-equilibrium solution.</p></section>
<section class="panel method-panel"><div class="section-head"><div><span class="kicker">METHOD SCOPE &amp; LIMITATIONS</span><h2>STABILITY ANALYSIS METHOD</h2></div><span class="index">METHOD</span></div>
<p class="method-intro"><b>INFINITE-SLOPE STRESS APPROXIMATION.</b> This prototype uses an effective-stress and Mohr–Coulomb approximation for preliminary screening of approximately planar, shallow slope instability. It does not search for a critical slip surface or model a full 2D stratigraphic section.</p>
<div class="method-columns"><article class="method-list"><h3>SUITABLE FOR</h3><ul><li>Preliminary slope screening</li><li>Long, approximately planar slopes</li><li>Shallow potential failure concept</li><li>Academic engineering assessment</li><li>Monitoring-oriented decision support</li></ul></article><article class="method-list"><h3>NOT INTENDED FOR</h3><ul><li>Final geotechnical design or certification</li><li>Complex or circular slip surfaces</li><li>Layered/anisotropic ground without analysis</li><li>All slope geometries or groundwater conditions</li><li>Substituting for site investigation</li></ul></article></div>
<div class="advanced-methods"><b>ADVANCED METHODS:</b> Bishop simplified, Janbu, Spencer, and numerical methods can evaluate more detailed failure mechanisms and equilibrium conditions when supplied with appropriate geometry, stratigraphy, groundwater, and strength data. They are not implemented in this prototype.</div></section>
`);

currentRisk.insertAdjacentHTML("afterend", `
<section class="panel whatif-panel" id="what-if"><div class="section-head"><div><span class="kicker">INSTANT EXAMINER DEMONSTRATION · DETERMINISTIC CASES</span><h2>WHAT-IF SLOPE ANALYSIS</h2></div><span class="prototype-badge">ENGINEERING SCENARIOS</span></div><div class="whatif-demo-bar" aria-label="Instant risk-state demo scenarios"><button type="button" data-risk-demo="SAFE">STABLE SLOPE</button><button type="button" data-risk-demo="MODERATE">MODERATE CONDITION</button><button type="button" data-risk-demo="HIGH">HIGH-RISK CONDITION</button><button type="button" data-risk-demo="CRITICAL">CRITICAL CONDITION</button></div><div class="whatif-grid" id="whatif-grid"></div><p class="whatif-note">Scenario cases are explicit parameter sets evaluated with the same engineering equations and prototype weights as the main analysis. They do not represent measured site conditions.</p></section>
`);

conditionPanel.insertAdjacentHTML("afterend", `
<section class="panel risk-states-panel"><div class="section-head"><div><span class="kicker">CLASSIFICATION GUIDE · CONFIGURABLE FS BANDS</span><h2>RISK CLASSIFICATION &amp; RESPONSE</h2></div><span class="index">4 STATES</span></div><div class="risk-state-grid" id="risk-state-grid"><article class="risk-state-card" data-state="STABLE"><h3>SAFE / STABLE</h3><p>Current condition: <span>routine screening</span></p><p>Main cause: <span>indicators within prototype bands</span></p><p>Warning: <span>maintain observation</span></p><p>Action: <span>continue routine observation</span></p></article><article class="risk-state-card" data-state="MODERATE"><h3>MODERATE</h3><p>Current condition: <span>elevated indicators</span></p><p>Main cause: <span>FS near threshold or elevated inputs</span></p><p>Warning: <span>watch trends</span></p><p>Action: <span>review drainage, groundwater, loading</span></p></article><article class="risk-state-card" data-state="HIGH"><h3>HIGH</h3><p>Current condition: <span>multiple indicators</span></p><p>Main cause: <span>low FS or weighted risk</span></p><p>Warning: <span>prompt review</span></p><p>Action: <span>detailed geotechnical assessment</span></p></article><article class="risk-state-card" data-state="CRITICAL"><h3>CRITICAL</h3><p>Current condition: <span>critical screening flags</span></p><p>Main cause: <span>FS below high-risk band or score ≥ 75</span></p><p>Warning: <span>urgent assessment</span></p><p>Action: <span>immediate professional site assessment</span></p></article></div><div id="active-risk-reason" class="decision-stamp">CURRENT PROTOTYPE CLASSIFICATION: —</div></section>
`);

contributionPanel.insertAdjacentHTML("afterend", `
<section class="panel sensitivity-panel" id="sensitivity"><div class="section-head"><div><span class="kicker">ONE-PARAMETER-AT-A-TIME · OTHER INPUTS HELD FIXED</span><h2>PARAMETER SENSITIVITY ANALYSIS</h2></div><span class="index">8 PARAMETERS</span></div><p class="caption">Each curve re-runs the current engineering screening calculation while varying one input. Sensitivity is descriptive, not uncertainty or probability analysis.</p><div class="sensitivity-grid" id="sensitivity-grid"></div></section>
<section class="panel system-architecture-panel"><div class="section-head"><div><span class="kicker">END-TO-END CONCEPT</span><h2>COMPLETE SYSTEM ARCHITECTURE</h2></div><span class="index">DATA → ACTION</span></div><div class="system-architecture"><span>FIELD / SITE</span><b>↓</b><span>SENSORS + MANUAL OBSERVATIONS</span><b>↓</b><span>DATA COLLECTION → DATA VALIDATION</span><b>↓</b><span>GEOTECHNICAL ANALYSIS → FACTOR OF SAFETY</span><b>↓</b><span>PROTOTYPE RISK ENGINE → RISK CLASSIFICATION</span><b>↓</b><span>GIS VISUALIZATION → EARLY WARNING</span><b>↓</b><span>DECISION SUPPORT → ENGINEERING REPORT</span></div><p class="small-note">Only manual inputs and local demonstration simulation are active. Physical sensors, cloud storage, and ML/API services are future integrations.</p></section>
`);

trendSection.querySelector(".section-heading").insertAdjacentHTML("beforeend", `<label class="trend-controls">WINDOW <select id="trend-window" aria-label="Illustrative monitoring chart window"><option value="24h">24 HOURS</option><option value="7d">7 DAYS</option><option value="30d" selected>30 DAYS</option></select></label>`);
trendSection.querySelector(".section-caption")?.remove();
trendSection.insertAdjacentHTML("beforeend", `<p class="data-note">ILLUSTRATIVE PROTOTYPE MONITORING HISTORY · selected view filters up to 6 / 8 / 12 available analysis or simulated samples. No sensor telemetry is connected.</p>`);

modelPanel.id = "ml-readiness";
reportPanel.id = "report";
reportPanel.querySelector("h2").textContent = "GENERATE ENGINEERING REPORT";
reportPanel.querySelector("button").textContent = "GENERATE ENGINEERING REPORT";
document.querySelector(".prototype-summary").insertAdjacentHTML("beforeend", `<article class="status-card"><span>GROUNDWATER</span><strong id="kpi-groundwater" class="prototype-kpi-extra">—</strong><small>DEPTH BELOW CREST · m</small></article><article class="status-card"><span>RAINFALL</span><strong id="kpi-rainfall" class="prototype-kpi-extra">—</strong><small>mm/day · USER / DEMO DATA</small></article><article class="status-card"><span>PORE PRESSURE</span><strong id="kpi-pore" class="prototype-kpi-extra">—</strong><small>kPa · DERIVED</small></article>`);
document.querySelector(".risk-card > span").textContent = "RISK LEVEL";
const modelRows = modelPanel.querySelectorAll(".model-list div");
if (modelRows[0]) modelRows[0].lastElementChild.textContent = "NOT CONNECTED · READY FOR FUTURE INTEGRATION";
if (modelRows[1]) modelRows[1].lastElementChild.textContent = "NOT CONNECTED · READY FOR FUTURE INTEGRATION";

const warningCenter = document.querySelector("#early-warning");
warningCenter.insertAdjacentHTML("beforeend", `<ul id="warning-items" class="warning-items" aria-label="Input-specific early warning indicators"></ul>`);
const historyHead = document.querySelector("#history .section-head");
historyHead.insertAdjacentHTML("beforeend", `<div class="history-actions"><button class="button secondary" id="save-analysis" type="button">SAVE ANALYSIS</button><a class="button reset" href="#history">VIEW HISTORY</a></div>`);
document.querySelector(".disclaimer p").textContent = "This system is an academic engineering prototype intended for preliminary slope stability screening and demonstration. It does not replace detailed geotechnical investigation, field instrumentation, accepted limit-equilibrium or numerical analysis, professional engineering judgement, or statutory safety requirements.";

document.querySelectorAll("#form input[name]").forEach((input) => {
  const explanations = {
    angle: "Slope-face inclination beta from horizontal; this enters the normal and driving stress approximations.",
    height: "Vertical slope height H used in normal, gravity-driving, and seismic terms.",
    slopeLength: "Slope-face length shown for section definition; not directly used by the current infinite-slope stress equations.",
    cohesion: "Effective cohesion c in kPa used in the Mohr-Coulomb resisting shear equation.",
    friction: "Effective friction angle phi in degrees used in the Mohr-Coulomb friction component.",
    unitWeight: "Bulk unit weight gamma in kN/m3 used to calculate normal and driving stresses.",
    poreRatio: "Dimensionless pore-pressure ratio ru; water pressure is ru multiplied by normal stress.",
    rainfall: "User-entered rainfall in mm/day; informs prototype score and monitoring only, not the supplied FS equation directly.",
    groundwater: "Groundwater depth below crest in metres; informs prototype score/diagram, not the supplied FS equation directly.",
    surcharge: "Simplified crest surcharge q in kPa used in the driving shear approximation.",
    seismic: "Horizontal seismic coefficient kh used in the simplified driving shear term.",
    displacement: "Observed or demonstration surface displacement in mm; prototype monitoring input, not a direct FS term.",
    displacementRate: "Observed or demonstration movement rate in mm/day; prototype monitoring input.",
    crackWidth: "Observed or demonstration crack width in mm; prototype monitoring input."
  };
  input.title = explanations[input.name] || "Engineering screening input; verify against site-specific data.";
  input.max = ({ angle: 89, height: 500, slopeLength: 1000, cohesion: 1000, friction: 89, unitWeight: 35, poreRatio: 1, rainfall: 1000, groundwater: 500, surcharge: 1000, seismic: 1, displacement: 500, displacementRate: 100, crackWidth: 100 })[input.name] ?? 1000;
});

document.querySelectorAll(".metric").forEach((card, index) => {
  const labels = ["STEP 01 · NORMAL STRESS", "STEP 02 · WATER PRESSURE", "STEP 03 · EFFECTIVE STRESS", "STEP 04 · RESISTING SHEAR", "STEP 05 · DRIVING SHEAR", "STEP 06 · FACTOR OF SAFETY"];
  const label = card.querySelector("span");
  if (label) label.textContent = labels[index] || label.textContent;
});
document.querySelector(".threshold-note span").innerHTML = "Screening threshold <b>FS = 1.50</b> · NOT A UNIVERSAL DESIGN CRITERION";

const whatIfCases = [
  { id: "normal", title: "Normal condition", cause: "Reference inputs with modest loading and low monitoring indicators.", action: "Continue routine observation and verify parameter provenance.", values: { angle: 26, height: 7, slopeLength: 11, cohesion: 42, friction: 37, unitWeight: 18, rainfall: 4, groundwater: 5.5, poreRatio: .06, surcharge: 4, seismic: .02, displacement: .4, displacementRate: .1, crackWidth: .2 } },
  { id: "rainfall", title: "Heavy rainfall", cause: "Elevated rainfall and pore-pressure ratio; rainfall itself is not a direct FS term.", action: "Review drainage and reassess ru using site observations.", values: { angle: 30, height: 8, slopeLength: 13, cohesion: 34, friction: 34, unitWeight: 18.5, rainfall: 120, groundwater: 1.8, poreRatio: .38, surcharge: 7, seismic: .03, displacement: 4, displacementRate: .8, crackWidth: 1 } },
  { id: "groundwater", title: "Rising groundwater", cause: "Shallower groundwater is contextual; an increased ru is separately entered to represent its stress effect.", action: "Inspect groundwater conditions and update the pore-pressure basis.", values: { angle: 29, height: 8, slopeLength: 13, cohesion: 35, friction: 34, unitWeight: 18.5, rainfall: 22, groundwater: .7, poreRatio: .34, surcharge: 7, seismic: .03, displacement: 3, displacementRate: .6, crackWidth: .8 } },
  { id: "surcharge", title: "Increased surcharge", cause: "Higher crest load increases the simplified surcharge driving component.", action: "Review crest loading and obtain detailed analysis before any change.", values: { angle: 29, height: 8, slopeLength: 13, cohesion: 38, friction: 35, unitWeight: 18, rainfall: 10, groundwater: 4, poreRatio: .1, surcharge: 35, seismic: .03, displacement: 1, displacementRate: .2, crackWidth: .3 } },
  { id: "earthquake", title: "Earthquake condition", cause: "Elevated horizontal seismic coefficient increases the simplified driving component.", action: "Consider site-specific seismic stability assessment.", values: { angle: 29, height: 8, slopeLength: 13, cohesion: 38, friction: 35, unitWeight: 18, rainfall: 8, groundwater: 4, poreRatio: .1, surcharge: 6, seismic: .22, displacement: 1, displacementRate: .2, crackWidth: .3 } },
  { id: "movement", title: "Increased surface movement", cause: "Large displacement, movement rate, and crack width increase the prototype score but do not directly change calculated FS.", action: "Increase monitoring frequency and arrange engineering review.", values: { angle: 32, height: 8, slopeLength: 14, cohesion: 34, friction: 34, unitWeight: 18.5, rainfall: 30, groundwater: 3, poreRatio: .22, surcharge: 9, seismic: .04, displacement: 58, displacementRate: 11, crackWidth: 18 } }
];

const whatIfGrid = document.querySelector("#whatif-grid");
whatIfGrid.innerHTML = whatIfCases.map((scenario, index) => `<article class="whatif-card" data-case-card="${scenario.id}"><span class="case-index">SCENARIO ${String(index + 1).padStart(2, "0")}</span><h3>${scenario.title}</h3><div class="whatif-metrics"><div><span>FACTOR OF SAFETY</span><b data-case-fs>—</b></div><div><span>PROTOTYPE SCORE</span><b data-case-score>—</b></div><div><span>RISK LEVEL</span><b data-case-risk>—</b></div><div><span>METHOD</span><b>SCREENING</b></div></div><p data-case-cause>${scenario.cause}</p><p data-case-action>${scenario.action}</p><button type="button" data-load-case="${scenario.id}">LOAD &amp; RUN CASE</button></article>`).join("");

const sensitivityDefinitions = [
  { id: "angle", label: "Slope angle β", field: "angle", from: 10, to: 60, unit: "deg", count: 21 },
  { id: "cohesion", label: "Cohesion c", field: "cohesion", from: 0, to: 100, unit: "kPa", count: 21 },
  { id: "friction", label: "Friction angle φ", field: "friction", from: 10, to: 55, unit: "deg", count: 19 },
  { id: "unitWeight", label: "Unit weight γ", field: "unitWeight", from: 14, to: 24, unit: "kN/m³", count: 16 },
  { id: "poreRatio", label: "Pore-pressure ratio ru", field: "poreRatio", from: 0, to: .8, unit: "ratio", count: 17 },
  { id: "groundwater", label: "Groundwater depth", field: "groundwater", from: 0, to: 12, unit: "m", count: 17 },
  { id: "surcharge", label: "Surcharge q", field: "surcharge", from: 0, to: 60, unit: "kPa", count: 16 },
  { id: "seismic", label: "Seismic coefficient kh", field: "seismic", from: 0, to: .3, unit: "kh", count: 16 }
];
const sensitivityGrid = document.querySelector("#sensitivity-grid");
sensitivityGrid.innerHTML = sensitivityDefinitions.map((definition) => `<article class="sensitivity-card"><h3>${definition.label} vs FS</h3><div class="sensitivity-chart" id="sensitivity-${definition.id}"></div><p class="sensitivity-note" id="sensitivity-note-${definition.id}"></p></article>`).join("");

const originalRenderAssessment = renderAssessment;
renderAssessment = function (values, shouldSave, simulated = false) {
  const result = originalRenderAssessment(values, shouldSave, simulated);
  if (result) refreshEnhancements(result);
  return result;
};

const originalRenderTrends = renderTrends;
renderTrends = function (values, engineering, assessment, simulatedSeries = null) {
  const count = ({ "24h": 6, "7d": 8, "30d": 12 })[document.querySelector("#trend-window").value] || 12;
  const allSamples = trendSamples;
  trendSamples = allSamples.slice(-count);
  const selected = simulatedSeries ? simulatedSeries.slice(-count) : null;
  originalRenderTrends(values, engineering, assessment, selected);
  trendSamples = allSamples;
  const label = document.querySelector("#trend-window").selectedOptions[0].textContent;
  const sampleCount = simulatedSeries ? selected.length : Math.min(allSamples.length || 1, count);
  document.querySelector("#chart-mode").textContent = `${label} · ${sampleCount} ILLUSTRATIVE SAMPLE${sampleCount === 1 ? "" : "S"}`;
  document.querySelectorAll("#trends .trend-card small").forEach((note) => { note.textContent = `ILLUSTRATIVE PROTOTYPE MONITORING HISTORY · ${label} · NOT SENSOR TELEMETRY`; });
};

function lineChart(points, threshold, xDigits = 0) {
  const width = 300, height = 124, pad = { left: 34, right: 8, top: 9, bottom: 21 };
  const minX = points[0].x, maxX = points[points.length - 1].x;
  let minY = Math.min(...points.map((point) => point.y), threshold), maxY = Math.max(...points.map((point) => point.y), threshold);
  const margin = Math.max((maxY - minY) * .13, .12); minY -= margin; maxY += margin;
  const x = (value) => pad.left + (value - minX) / (maxX - minX || 1) * (width - pad.left - pad.right);
  const y = (value) => pad.top + (maxY - value) / (maxY - minY || 1) * (height - pad.top - pad.bottom);
  let grid = "";
  for (let index = 0; index < 4; index += 1) {
    const gy = pad.top + index * (height - pad.top - pad.bottom) / 3;
    const value = maxY - index * (maxY - minY) / 3;
    grid += `<line class="sens-gridline" x1="${pad.left}" y1="${gy}" x2="${width - pad.right}" y2="${gy}"/><text class="sens-axis" x="1" y="${gy + 2}">${value.toFixed(1)}</text>`;
  }
  const path = points.map((point, index) => `${index ? "L" : "M"}${x(point.x).toFixed(1)} ${y(point.y).toFixed(1)}`).join(" ");
  const ref = `<line class="sens-reference" x1="${pad.left}" y1="${y(threshold)}" x2="${width - pad.right}" y2="${y(threshold)}"/><text class="sens-reference-label" x="${width - 48}" y="${y(threshold) - 3}">FS ${threshold.toFixed(1)}</text>`;
  const labels = [points[0], points[Math.floor((points.length - 1) / 2)], points[points.length - 1]].map((point) => `<text class="sens-axis" text-anchor="middle" x="${x(point.x)}" y="${height - 4}">${point.x.toFixed(xDigits)}</text>`).join("");
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Input parameter sensitivity chart with current FS screening threshold">${grid}${ref}<path class="sens-line" d="${path}"/><circle class="sens-point" cx="${x(points[Math.floor(points.length / 2)].x)}" cy="${y(points[Math.floor(points.length / 2)].y)}" r="3"/>${labels}</svg>`;
}

function refreshSensitivity(values, limits) {
  for (const definition of sensitivityDefinitions) {
    const points = Array.from({ length: definition.count }, (_, index) => {
      const value = definition.from + index * (definition.to - definition.from) / (definition.count - 1);
      return { x: value, y: calculateEngineering({ ...values, [definition.field]: value }).fs };
    });
    document.querySelector(`#sensitivity-${definition.id}`).innerHTML = lineChart(points, limits.stable, definition.field === "poreRatio" || definition.field === "seismic" ? 2 : 0);
    document.querySelector(`#sensitivity-note-${definition.id}`).textContent = definition.id === "groundwater" ? "Flat by design: depth does not enter the supplied FS equations directly; update ru from site assessment." : `Current value: ${Number(values[definition.field]).toFixed(definition.field === "poreRatio" || definition.field === "seismic" ? 2 : 1)} ${definition.unit} · other inputs fixed.`;
  }
}

function severityWarnings(values, engineering, assessment) {
  const items = [];
  const state = (id) => document.querySelector(`#state-${id}`).textContent;
  for (const [id, label, measured] of [["rain", "Rainfall", `${values.rainfall.toFixed(1)} mm/day`], ["groundwater", "Groundwater depth", `${values.groundwater.toFixed(1)} m below crest`], ["pore", "Pore pressure", `ru ${values.poreRatio.toFixed(2)} / ${engineering.water.toFixed(1)} kPa`], ["displacement", "Surface displacement", `${values.displacement.toFixed(1)} mm`], ["rate", "Displacement rate", `${values.displacementRate.toFixed(1)} mm/day`], ["crack", "Crack width", `${values.crackWidth.toFixed(1)} mm`]]) {
    const level = state(id);
    if (["WATCH", "WARNING", "CRITICAL"].includes(level)) items.push({ level, text: `${label}: ${measured}; configured indicator state is ${level}.` });
  }
  if (values.seismic >= .1) items.push({ level: values.seismic >= .2 ? "CRITICAL" : "WARNING", text: `Seismic coefficient kh ${values.seismic.toFixed(2)} is elevated against illustrative prototype triggers.` });
  if (engineering.fs < assessment.limits.stable) items.push({ level: engineering.fs < assessment.limits.high ? "CRITICAL" : "WARNING", text: `FS ${engineering.fs.toFixed(2)} is below the configured screening threshold ${assessment.limits.stable.toFixed(2)}.` });
  const severity = { CRITICAL: 0, WARNING: 1, WATCH: 2 };
  return items.sort((a, b) => severity[a.level] - severity[b.level]);
}

function renderWarnings(values, engineering, assessment) {
  const list = document.querySelector("#warning-items");
  const warnings = severityWarnings(values, engineering, assessment);
  list.replaceChildren();
  if (!warnings.length) {
    const item = document.createElement("li"); item.dataset.severity = "INFO";
    const label = document.createElement("b"); label.textContent = "INFO";
    const text = document.createElement("span"); text.textContent = "No configured monitoring indicator has reached WATCH. Continue routine observation.";
    item.append(label, text); list.append(item); return;
  }
  warnings.forEach(({ level, text }) => {
    const item = document.createElement("li"); item.dataset.severity = level;
    const tag = document.createElement("b"); tag.textContent = level;
    const message = document.createElement("span"); message.textContent = text;
    item.append(tag, message); list.append(item);
  });
}

function riskCause(values, engineering, assessment) {
  const causes = [];
  if (engineering.fs < assessment.limits.stable) causes.push(`FS ${engineering.fs.toFixed(2)} below ${assessment.limits.stable.toFixed(2)}`);
  if (values.poreRatio >= .3) causes.push(`ru ${values.poreRatio.toFixed(2)}`);
  if (values.rainfall >= 50) causes.push(`rainfall ${values.rainfall.toFixed(0)} mm/day`);
  if (values.displacement >= 10 || values.displacementRate >= 2) causes.push("elevated movement indicators");
  if (values.crackWidth >= 3) causes.push("crack width trigger");
  return causes.length ? causes.join(" · ") : "No elevated configured input flags";
}

function riskAction(risk) {
  return ({
    STABLE: "Continue routine observation and verify inputs.",
    MODERATE: "Increase monitoring frequency; review drainage, groundwater, and loading.",
    HIGH: "Arrange detailed geotechnical assessment and limit-equilibrium analysis.",
    CRITICAL: "Immediate professional site assessment is recommended."
  })[risk];
}

function renderRiskStates(values, engineering, assessment) {
  document.querySelectorAll(".risk-state-card").forEach((card) => card.classList.toggle("active", card.dataset.state === assessment.risk));
  document.querySelector("#active-risk-reason").textContent = `CURRENT ${assessment.risk === "STABLE" ? "SAFE / STABLE" : assessment.risk} · MAIN CAUSE: ${riskCause(values, engineering, assessment)} · ACTION: ${riskAction(assessment.risk)}`;
}

function renderScenarioCards() {
  for (const scenario of whatIfCases) {
    const engineering = calculateEngineering(scenario.values);
    const assessment = evaluateRisk(scenario.values, engineering.fs);
    const card = document.querySelector(`[data-case-card="${scenario.id}"]`);
    card.dataset.risk = assessment.risk;
    card.querySelector("[data-case-fs]").textContent = Number.isFinite(engineering.fs) ? engineering.fs.toFixed(2) : "∞";
    card.querySelector("[data-case-score]").textContent = `${assessment.score} / 100`;
    card.querySelector("[data-case-risk]").textContent = assessment.risk === "STABLE" ? "SAFE" : assessment.risk;
    card.querySelector("[data-case-risk]").style.color = riskColor(assessment.risk);
  }
}

function applyScenario(values) {
  stopDemo(); demoToggle.checked = false; scenarioSelect.value = "";
  for (const [name, value] of Object.entries(values)) {
    const input = prototypeForm.elements.namedItem(name);
    if (input) input.value = value;
  }
  renderAssessment(values, false, false);
  document.querySelector("#condition").scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateSectionGeometry(values) {
  const svg = document.querySelector("#sectionSvg");
  const beta = Math.max(1, Math.min(89, values.angle)) * Math.PI / 180;
  const height = Math.max(.1, values.height);
  const scale = Math.min(16, 160 / height, 320 / (height / Math.tan(beta)));
  const h = height * scale, run = height / Math.tan(beta) * scale;
  const crestX = 304, crestY = 62, toeX = crestX + run, toeY = crestY + h;
  const ground = `M24 ${crestY}H${crestX}L${toeX} ${toeY}H736`;
  const soil = `M24 ${crestY}H${crestX}L${toeX} ${toeY}H736V302H24Z`;
  svg.querySelector(".soil").setAttribute("d", soil);
  svg.querySelector('path[fill^="url(#hatch)"]').setAttribute("d", soil);
  svg.querySelector(".ground").setAttribute("d", ground);
  svg.querySelector(".face").setAttribute("d", `M${crestX} ${crestY}L${toeX} ${toeY}`);
  svg.querySelector(".slip").setAttribute("d", `M${crestX - 34} ${crestY + 7}C${crestX + run * .2} ${crestY + h * .25},${crestX + run * .55} ${crestY + h * .65},${toeX - 5} ${toeY + 16}`);
  svg.querySelector(".layer").setAttribute("d", `M24 ${Math.min(crestY + h * .58,230)}H${crestX + run * .42}L${toeX + 13} ${Math.min(toeY + 35,270)}H736V302H24Z`);
  const waterY = Math.min(crestY + Math.max(0, values.groundwater) * scale, 286);
  svg.querySelector("#waterline").setAttribute("d", `M28 ${waterY}H${Math.min(crestX + run * .45,430)}L${Math.min(toeX + 18,530)} ${Math.min(waterY + h * .32,294)}H733`);
  const dim = svg.querySelector(".dim"); dim.setAttribute("d", `M${crestX - 18} ${crestY}V${toeY}m-8 0h16m-16 -${h}h16`);
  svg.querySelector(".arc").setAttribute("d", `M${crestX + 48} ${crestY}A48 48 0 0 1 ${crestX + 48 * Math.cos(beta)} ${crestY + 48 * Math.sin(beta)}`);
  const midX = crestX + run * .52, midY = crestY + h * .52;
  svg.querySelector(".drive").setAttribute("d", `M${midX - 22} ${midY - 58}l38 38`);
  svg.querySelector(".resist").setAttribute("d", `M${midX + 10} ${midY + 48}l-38 -38`);
  const arrows = svg.querySelectorAll(".arrows path");
  arrows.forEach((arrow, index) => { const x = crestX + run * (.32 + index * .18); const y = crestY + h * (.33 + index * .18); arrow.setAttribute("d", `M${x} ${y}v22`); });
  document.querySelector("#heightLabel").setAttribute("x", crestX - 52); document.querySelector("#heightLabel").setAttribute("y", crestY + h * .52); document.querySelector("#heightLabel").textContent = `H = ${height.toFixed(1)} m`;
  document.querySelector("#angleLabel").textContent = `β = ${values.angle.toFixed(1)}°`;
  document.querySelector("#gwLabel").textContent = `WATER TABLE · ${values.groundwater.toFixed(1)} m`;
}

function refreshEnhancements(state) {
  const { values, engineering, assessment } = state;
  const displayRisk = assessment.risk === "STABLE" ? "SAFE" : assessment.risk;
  document.querySelector("#prototype-risk").textContent = displayRisk;
  document.querySelector("#summary-risk").textContent = displayRisk;
  document.querySelector("#risk").textContent = displayRisk;
  document.querySelector("#condition-badge").textContent = assessment.risk === "STABLE" ? "SAFE / STABLE" : assessment.risk === "HIGH" ? "HIGH RISK" : assessment.risk;
  document.querySelector("#active-risk-reason").textContent = `CURRENT ${assessment.risk === "STABLE" ? "SAFE / STABLE" : assessment.risk} · MAIN CAUSE: ${riskCause(values, engineering, assessment)} · ACTION: ${riskAction(assessment.risk)}`;
  document.querySelector("#kpi-groundwater").textContent = `${values.groundwater.toFixed(1)} m`;
  document.querySelector("#kpi-rainfall").textContent = `${values.rainfall.toFixed(1)}`;
  document.querySelector("#kpi-pore").textContent = `${engineering.water.toFixed(1)} kPa`;
  document.querySelector("#prototype-fs").title = "ENGINEERING CALCULATION · infinite-slope stress approximation";
  document.querySelector("#risk-score").title = "PROTOTYPE RISK SCORE · fixed disclosed weights, not ML prediction";
  document.querySelector(".gauge-wrap .scale").innerHTML = "<span>0</span><span>1.0</span><span>1.5</span><span>2.0</span><span>3.0+</span>";
  refreshSensitivity(values, assessment.limits);
  renderWarnings(values, engineering, assessment);
  renderRiskStates(values, engineering, assessment);
  renderScenarioCards();
  updateSectionGeometry(values);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function generateEngineeringReport() {
  const state = currentAssessment || renderAssessment(valuesFromForm(), false);
  if (!state) return;
  const { values, engineering, assessment } = state;
  const rows = Object.entries({
    "Slope angle β": `${values.angle.toFixed(1)} deg`, "Slope height H": `${values.height.toFixed(1)} m`, "Slope length L": `${values.slopeLength.toFixed(1)} m`,
    "Cohesion c′": `${values.cohesion.toFixed(1)} kPa`, "Friction angle φ′": `${values.friction.toFixed(1)} deg`, "Unit weight γ": `${values.unitWeight.toFixed(1)} kN/m3`,
    "Pore pressure ratio ru": values.poreRatio.toFixed(2), "Rainfall": `${values.rainfall.toFixed(1)} mm/day`, "Groundwater depth": `${values.groundwater.toFixed(1)} m`,
    "Surcharge q": `${values.surcharge.toFixed(1)} kPa`, "Seismic coefficient kh": values.seismic.toFixed(3), "Surface displacement": `${values.displacement.toFixed(1)} mm`,
    "Displacement rate": `${values.displacementRate.toFixed(1)} mm/day`, "Crack width": `${values.crackWidth.toFixed(1)} mm`
  }).map(([name, value]) => `<tr><th>${escapeHtml(name)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  const contributions = Object.entries(assessment.parts).map(([name, points]) => `<tr><td>${escapeHtml(name)}</td><td>${points.toFixed(2)} risk points</td></tr>`).join("");
  const warnings = severityWarnings(values, engineering, assessment).map((entry) => `<li><b>${entry.level}:</b> ${escapeHtml(entry.text)}</li>`).join("") || "<li>No active prototype alert flags.</li>";
  const actions = recommendations(values, assessment).map((text) => `<li>${escapeHtml(text)}</li>`).join("");
  const report = document.querySelector("#print-report");
  report.innerHTML = `<h1>AI-ASSISTED SLOPE STABILITY MONITORING &amp; RISK PREDICTION</h1><p>RAMACHANDRA COLLEGE OF ENGINEERING, ELURU<br>Prepared by Ch. Jagadeesh · B.Tech Civil Engineering<br>Report date: ${escapeHtml(new Date().toLocaleString())}</p><h2>Engineering result</h2><p><b>Factor of Safety:</b> ${engineering.fs.toFixed(2)} · <b>Risk score:</b> ${assessment.score}/100 · <b>Risk:</b> ${assessment.risk}<br>Data source: ${state.simulated ? "DEMO / SIMULATED DATA" : "MANUAL INPUTS"}. Prototype weighted risk engine; trained ML is not connected.</p><h2>Inputs</h2><table>${rows}</table><h2>Engineering equations</h2><p>σn = γH cos²β; u = ru σn; σ′n = σn − u; τresisting = c′ + σ′n tan φ′; τdriving = γH sinβ cosβ + q sinβ cosβ + khγH cos²β; FS = τresisting / τdriving.</p><p>Method: infinite-slope stress approximation with simplified surcharge and seismic terms.</p><h2>Prototype risk contributions</h2><table>${contributions}</table><p>Fixed weighted heuristic; not trained ML feature importance or probability.</p><h2>Early warnings</h2><ul>${warnings}</ul><h2>Engineering decision-support recommendations</h2><ul>${actions}</ul><p>GIS coordinates are a demo location and not a surveyed site. Monitoring samples are manual or explicitly simulated.</p><p class="report-disclaimer"><b>DISCLAIMER:</b> This system is an academic engineering prototype intended for preliminary slope stability screening and demonstration. It does not replace detailed geotechnical investigation, field instrumentation, accepted limit-equilibrium or numerical analysis, professional engineering judgement, or statutory safety requirements.</p>`;
  window.print();
}

function initUpgrade() {
  document.querySelectorAll("[data-load-case]").forEach((button) => button.addEventListener("click", () => {
    const scenario = whatIfCases.find((entry) => entry.id === button.dataset.loadCase);
    if (scenario) applyScenario(scenario.values);
  }));
  document.querySelectorAll("[data-risk-demo]").forEach((button) => button.addEventListener("click", () => {
    const target = button.dataset.riskDemo;
    const choices = target === "SAFE" ? "normal" : target === "MODERATE" ? "groundwater" : target === "HIGH" ? "earthquake" : "movement";
    const scenario = whatIfCases.find((entry) => entry.id === choices);
    if (target === "HIGH") {
      const high = { ...whatIfCases.find((entry) => entry.id === "earthquake").values, angle: 32, cohesion: 40, friction: 35, rainfall: 100, groundwater: .5, poreRatio: .35, displacement: 55, displacementRate: 8, crackWidth: 18, surcharge: 15, seismic: .05 };
      applyScenario(high);
    } else if (target === "CRITICAL") {
      const critical = { ...whatIfCases.find((entry) => entry.id === "movement").values, angle: 47, cohesion: 14, friction: 22, poreRatio: .72, rainfall: 145, groundwater: .5, surcharge: 32, seismic: .22, displacement: 72, displacementRate: 14, crackWidth: 24 };
      applyScenario(critical);
    } else if (scenario) applyScenario(scenario.values);
  }));
  document.querySelector("#save-analysis").addEventListener("click", () => renderAssessment(valuesFromForm(), true, false));
  const reportButton = document.querySelector("#generate-report");
  reportButton.addEventListener("click", (event) => { event.stopImmediatePropagation(); generateEngineeringReport(); }, true);
  document.querySelector("#trend-window").addEventListener("change", () => {
    if (currentAssessment) renderTrends(currentAssessment.values, currentAssessment.engineering, currentAssessment.assessment, currentAssessment.simulated ? demoSeries(currentAssessment.values) : null);
  });
  const mlStatus = document.querySelector(".model-status-panel");
  mlStatus.insertAdjacentHTML("afterend", `<details class="panel ml-validation-panel"><summary>ML VALIDATION — FUTURE INTEGRATION</summary><p class="ml-validation-copy">AVAILABLE AFTER VALIDATED MODEL TRAINING AND TESTING. No metrics or evaluation artifacts are included in this prototype.</p><div class="ml-validation-grid"><span>R² · PENDING</span><span>MAE · PENDING</span><span>RMSE · PENDING</span><span>CROSS-VALIDATION · PENDING</span><span>ACCURACY · PENDING</span><span>CONFUSION MATRIX · PENDING</span><span>ACTUAL vs PREDICTED FS · PENDING</span><span>RESIDUALS / FEATURE IMPORTANCE · PENDING</span></div></details>`);
  document.querySelector(".gis-panel .location-data").insertAdjacentHTML("beforeend", `<div class="gis-future"><b>FUTURE GIS ARCHITECTURE</b><span>GPS → GIS → DEM → TERRAIN ANALYSIS → SLOPE PARAMETERS → RISK MAPPING</span><small>Coordinates are illustrative and not a surveyed location.</small></div>`);
  [["#latitude", -90, 90, "Latitude in decimal degrees for the illustrative demo point; not a surveyed coordinate."], ["#longitude", -180, 180, "Longitude in decimal degrees for the illustrative demo point; not a surveyed coordinate."], ["#elevation", 0, 8850, "Illustrative elevation in metres above mean sea level."]].forEach(([selector, min, max, title]) => {
    const input = document.querySelector(selector);
    input.min = min; input.max = max; input.required = true; input.title = title;
  });
  document.querySelector(".gis-panel .section-head h2").textContent = "GIS-BASED SLOPE LOCATION";
  document.querySelector("#early-warning > span").textContent = "EARLY WARNING CENTER · USER / DEMO INPUTS";
  document.querySelector("#monitoring .section-heading h2").textContent = "SLOPE MONITORING & OBSERVATION CENTER";
  document.querySelector("#monitoring .data-note").textContent = "NO PHYSICAL SENSOR TELEMETRY CURRENTLY CONNECTED. DEMO / SIMULATED DATA is generated locally and never represented as field measurement. Live sensor/API integration is future work.";
  document.querySelector("#about .about-meta").insertAdjacentHTML("afterend", `<p class="future-integrations"><b>FUTURE INTEGRATION:</b> IoT rainfall and pore-pressure sensors · inclinometers · crack monitoring · GPS/GIS/DEM · validated Random Forest / Gradient Boosting · prediction API · cloud database · automated alerts.</p>`);
  const stableRiskDemo = document.querySelector('[data-risk-demo="MODERATE"]');
  stableRiskDemo.textContent = "MODERATE CONDITION";
  const method = document.querySelector(".method-panel");
  method.querySelector(".section-head .index").textContent = "LIMITS";
  refreshEnhancements(renderAssessment(valuesFromForm(), false, false));
}

initUpgrade();

