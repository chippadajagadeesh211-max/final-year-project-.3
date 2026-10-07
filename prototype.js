const prototypeForm = document.querySelector("#form");
const historyKey = "rce-slope-analysis-history-v1";
const demoToggle = document.querySelector("#demo-toggle");
const scenarioSelect = document.querySelector("#scenario-select");
const demoScenarios = {
  stable: { angle: 26, height: 7, slopeLength: 11, cohesion: 42, friction: 37, unitWeight: 18, rainfall: 4, groundwater: 5.5, poreRatio: 0.06, surcharge: 4, seismic: 0.02, displacement: 0.4, displacementRate: 0.1, crackWidth: 0.2 },
  rain: { angle: 31, height: 9, slopeLength: 14, cohesion: 32, friction: 32, unitWeight: 19, rainfall: 115, groundwater: 1.2, poreRatio: 0.42, surcharge: 8, seismic: 0.04, displacement: 8, displacementRate: 1.8, crackWidth: 2.4 },
  pore: { angle: 33, height: 10, slopeLength: 16, cohesion: 25, friction: 30, unitWeight: 19, rainfall: 32, groundwater: 0.8, poreRatio: 0.58, surcharge: 12, seismic: 0.05, displacement: 12, displacementRate: 2.6, crackWidth: 4.2 },
  movement: { angle: 35, height: 11, slopeLength: 18, cohesion: 29, friction: 31, unitWeight: 19, rainfall: 38, groundwater: 2.2, poreRatio: 0.3, surcharge: 10, seismic: 0.06, displacement: 38, displacementRate: 7, crackWidth: 8 },
  critical: { angle: 47, height: 15, slopeLength: 23, cohesion: 14, friction: 22, unitWeight: 20, rainfall: 145, groundwater: 0.5, poreRatio: 0.72, surcharge: 32, seismic: 0.22, displacement: 72, displacementRate: 14, crackWidth: 24 }
};
let analysisHistory = loadHistory();
let demoTimer = null;
let demoTick = 0;
let currentAssessment = null;
let trendSamples = [];

function loadHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(historyKey) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveHistory() {
  try {
    localStorage.setItem(historyKey, JSON.stringify(analysisHistory.slice(0, 50)));
  } catch {
    document.querySelector("#history-body").dataset.storage = "unavailable";
  }
}

function valuesFromForm() {
  return Object.fromEntries([...new FormData(prototypeForm)].map(([key, value]) => [key, Number(value)]));
}

function calculateEngineering(values) {
  const angle = values.angle * Math.PI / 180;
  const friction = values.friction * Math.PI / 180;
  const normal = values.unitWeight * values.height * Math.cos(angle) ** 2;
  const water = values.poreRatio * normal;
  const effective = normal - water;
  const resisting = values.cohesion + effective * Math.tan(friction);
  const gravity = values.unitWeight * values.height * Math.sin(angle) * Math.cos(angle);
  const surcharge = values.surcharge * Math.sin(angle) * Math.cos(angle);
  const seismic = values.seismic * values.unitWeight * values.height * Math.cos(angle) ** 2;
  const driving = gravity + surcharge + seismic;
  return { normal, water, effective, resisting, gravity, surcharge, seismic, driving, fs: driving > 0 ? resisting / driving : Infinity };
}

function clamp(number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, number));
}

function bands() {
  const stable = Number(document.querySelector("#stable-threshold").value);
  const moderate = Number(document.querySelector("#moderate-threshold").value);
  const high = Number(document.querySelector("#high-threshold").value);
  return { stable, moderate, high, valid: stable > moderate && moderate > high && high > 0 };
}

function evaluateRisk(values, fs) {
  const limits = bands();
  const fsRisk = clamp((limits.stable - fs) / Math.max(limits.stable - limits.high, 0.1) * 100);
  const parts = {
    "Factor of Safety": fsRisk,
    "Slope angle": clamp((values.angle - 25) / 30 * 100),
    Rainfall: clamp(values.rainfall / 120 * 100),
    "Groundwater depth": clamp((values.height * 0.55 - values.groundwater) / Math.max(values.height * 0.55, 0.1) * 100),
    "Pore pressure": clamp(values.poreRatio / 0.65 * 100),
    Displacement: clamp(values.displacement / 60 * 100),
    "Displacement rate": clamp(values.displacementRate / 12 * 100),
    "Crack width": clamp(values.crackWidth / 25 * 100),
    "Seismic loading": clamp(values.seismic / 0.25 * 100)
  };
  const weights = [0.28, 0.10, 0.10, 0.08, 0.12, 0.12, 0.08, 0.07, 0.05];
  const contributions = Object.fromEntries(Object.entries(parts).map(([name, value], index) => [name, value * weights[index]]));
  const score = Math.round(Object.values(contributions).reduce((total, contribution) => total + contribution, 0));
  let risk = "STABLE";
  if (fs < limits.high || score >= 75) risk = "CRITICAL";
  else if (fs < limits.moderate || score >= 52) risk = "HIGH";
  else if (fs < limits.stable || score >= 28) risk = "MODERATE";
  return { score, risk, parts: contributions, limits };
}

function riskColor(risk) {
  return ({ STABLE: "var(--stable)", MODERATE: "var(--moderate)", HIGH: "var(--high)", CRITICAL: "var(--critical)" })[risk];
}

function monitorState(value, thresholds) {
  if (!(thresholds.watch < thresholds.warning && thresholds.warning < thresholds.critical)) return "CHECK LIMITS";
  if (value >= thresholds.critical) return "CRITICAL";
  if (value >= thresholds.warning) return "WARNING";
  if (value >= thresholds.watch) return "WATCH";
  return "NORMAL";
}

function recommendations(values, result) {
  const items = [];
  if (values.rainfall >= 50) items.push("Increase rainfall and surface-drainage monitoring.");
  if (values.poreRatio >= 0.3 || values.groundwater < values.height * 0.25) items.push("Inspect drainage and groundwater conditions with a geotechnical engineer.");
  if (values.displacement >= 10 || values.displacementRate >= 2 || values.crackWidth >= 3) items.push("Increase monitoring frequency and review deformation trends.");
  if (result.fs < result.limits.stable) items.push("Detailed geotechnical investigation and limit-equilibrium analysis are recommended.");
  if (values.seismic >= 0.1) items.push("Consider a site-specific seismic stability assessment.");
  if (!items.length) items.push("Maintain routine monitoring and verify inputs during site review.");
  return items;
}

function warningFor(risk) {
  return ({
    STABLE: ["NORMAL", "Current screening parameters are within the configured acceptable range."],
    MODERATE: ["WATCH", "Monitoring parameters show elevated instability indicators. Review trends and maintain observation."],
    HIGH: ["WARNING", "Multiple slope instability indicators detected. Prompt engineering review is recommended."],
    CRITICAL: ["CRITICAL", "Critical screening indicators detected. Immediate engineering assessment is recommended."]
  })[risk];
}

function renderContributions(parts) {
  const container = document.querySelector("#contribution-bars");
  container.replaceChildren();
  for (const [label, raw] of Object.entries(parts)) {
    const row = document.createElement("div");
    row.className = "contribution-row";
    const name = document.createElement("span");
    name.textContent = label;
    const track = document.createElement("div");
    track.className = "contribution-track";
    const fill = document.createElement("div");
    fill.className = "contribution-fill";
    fill.style.width = `${Math.min(raw / 28 * 100, 100)}%`;
    track.append(fill);
    const value = document.createElement("b");
    value.textContent = `${raw.toFixed(1)} pts`;
    row.append(name, track, value);
    container.append(row);
  }
}

function renderRecommendations(values, result) {
  const list = document.querySelector("#recs");
  list.replaceChildren();
  recommendations(values, result).slice(0, 5).forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  });
}

function setMonitor(id, value, unit, state, digits = 1) {
  document.querySelector(`#mon-${id}`).textContent = Number(value).toFixed(digits);
  const badge = document.querySelector(`#state-${id}`);
  badge.textContent = state;
  badge.className = state.toLowerCase();
}

function classifyMonitor(values, result) {
  const threshold = (prefix) => ({
    watch: Number(document.querySelector(`#${prefix}-watch`).value),
    warning: Number(document.querySelector(`#${prefix}-warning`).value),
    critical: Number(document.querySelector(`#${prefix}-critical`).value)
  });
  const groundwater = threshold("gw");
  const depthRatio = values.groundwater / Math.max(values.height, 0.1);
  const groundwaterRisk = !(groundwater.critical < groundwater.warning && groundwater.warning < groundwater.watch)
    ? "CHECK LIMITS"
    : depthRatio <= groundwater.critical ? "CRITICAL" : depthRatio <= groundwater.warning ? "WARNING" : depthRatio <= groundwater.watch ? "WATCH" : "NORMAL";
  const poreRisk = monitorState(values.poreRatio, threshold("pore"));
  return {
    rainfall: monitorState(values.rainfall, threshold("rain")),
    groundwater: groundwaterRisk,
    pore: poreRisk,
    displacement: monitorState(values.displacement, threshold("disp")),
    rate: monitorState(values.displacementRate, threshold("rate")),
    crack: monitorState(values.crackWidth, threshold("crack"))
  };
}

function explanationFor(values, result, assessment) {
  const factors = [];
  if (result.fs < assessment.limits.stable) factors.push(`FS ${result.fs.toFixed(2)} is below the configured ${assessment.limits.stable.toFixed(2)} threshold`);
  if (values.angle >= 35) factors.push(`slope angle is ${values.angle.toFixed(1)} degrees`);
  if (values.rainfall >= 50) factors.push(`rainfall is ${values.rainfall.toFixed(1)} mm/day`);
  if (values.poreRatio >= 0.3) factors.push(`pore pressure ratio is ${values.poreRatio.toFixed(2)}`);
  if (values.groundwater < values.height * 0.25) factors.push("groundwater is shallow relative to slope height");
  if (values.displacement >= 10) factors.push(`displacement is ${values.displacement.toFixed(1)} mm`);
  if (values.displacementRate >= 2) factors.push(`movement rate is ${values.displacementRate.toFixed(1)} mm/day`);
  if (values.crackWidth >= 3) factors.push(`crack width is ${values.crackWidth.toFixed(1)} mm`);
  if (values.seismic >= 0.1) factors.push(`seismic coefficient is ${values.seismic.toFixed(2)}`);
  return factors.length ? `${factors.join(" + ")} → ${assessment.risk} prototype risk. This is a transparent heuristic, not ML output.` : "No configured high-contribution indicators are active. The prototype score combines the current factor of safety and monitoring inputs; it is not a calibrated probability.";
}

function analysisRecord(values, engineering, assessment) {
  return {
    id: `RCE-${Date.now().toString().slice(-7)}`,
    date: new Date().toISOString(),
    fs: Number.isFinite(engineering.fs) ? engineering.fs : 99,
    score: assessment.score,
    risk: assessment.risk,
    rainfall: values.rainfall,
    displacement: values.displacement,
    pore: engineering.water,
    values: { ...values }
  };
}

function renderHistory() {
  const body = document.querySelector("#history-body");
  body.replaceChildren();
  if (!analysisHistory.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 8;
    cell.className = "empty";
    cell.textContent = "No saved analyses yet.";
    row.append(cell);
    body.append(row);
    return;
  }
  analysisHistory.slice(0, 20).forEach((record) => {
    const row = document.createElement("tr");
    const cells = [record.id, new Date(record.date).toLocaleString(), Number(record.fs).toFixed(2), `${record.score} / 100`, record.risk, `${Number(record.rainfall).toFixed(1)} mm/day`, `${Number(record.displacement).toFixed(1)} mm`, "SAVED"];
    cells.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    body.append(row);
  });
}

function trendSvg(container, series, label, threshold = null, simulated = false) {
  const width = 480;
  const height = 132;
  const pad = { left: 37, right: 9, top: 10, bottom: 22 };
  const values = series.map((item) => item.value);
  let min = Math.min(...values, ...(threshold === null ? [] : [threshold]));
  let max = Math.max(...values, ...(threshold === null ? [] : [threshold]));
  const range = max - min || Math.max(Math.abs(max) * 0.2, 1);
  min = Math.max(0, min - range * 0.15);
  max += range * 0.15;
  const x = (index) => pad.left + index / Math.max(series.length - 1, 1) * (width - pad.left - pad.right);
  const y = (value) => pad.top + (max - value) / (max - min || 1) * (height - pad.top - pad.bottom);
  let grid = "";
  for (let i = 0; i < 4; i += 1) {
    const gy = pad.top + i * (height - pad.top - pad.bottom) / 3;
    const value = max - i * (max - min) / 3;
    grid += `<line class="trend-gridline" x1="${pad.left}" y1="${gy}" x2="${width - pad.right}" y2="${gy}"/><text class="trend-axis" x="2" y="${gy + 3}">${value.toFixed(value < 10 ? 1 : 0)}</text>`;
  }
  const path = series.map((item, index) => `${index ? "L" : "M"}${x(index).toFixed(1)} ${y(item.value).toFixed(1)}`).join(" ");
  const dots = series.length === 1 ? `<circle class="trend-dot" cx="${x(0)}" cy="${y(series[0].value)}" r="4"/>` : "";
  const ref = threshold === null ? "" : `<line class="trend-threshold" x1="${pad.left}" y1="${y(threshold)}" x2="${width - pad.right}" y2="${y(threshold)}"/><text class="trend-threshold-label" x="${width - 64}" y="${y(threshold) - 3}">FS = ${threshold.toFixed(1)}</text>`;
  const startLabel = series.length > 1 ? "−11" : "NOW";
  const svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}${simulated ? ", simulated demo series" : ", saved analysis snapshots"}">${grid}${ref}<path class="trend-line${simulated ? " alert" : ""}" d="${path}"/>${dots}<text class="trend-axis" x="${pad.left}" y="${height - 5}">${startLabel}</text><text class="trend-axis" text-anchor="end" x="${width - pad.right}" y="${height - 5}">${series.length > 1 ? "NOW" : "ANALYSIS"}</text></svg>`;
  container.innerHTML = svg;
}

function renderTrends(values, engineering, assessment, simulatedSeries = null) {
  const manual = trendSamples.slice(-12);
  const series = simulatedSeries || (manual.length ? manual : [{ fs: engineering.fs, rainfall: values.rainfall, pore: engineering.water, displacement: values.displacement, score: assessment.score }]);
  const toPairs = (key) => series.map((sample) => ({ value: sample[key] }));
  const simulated = Boolean(simulatedSeries);
  trendSvg(document.querySelector("#trend-fs"), toPairs("fs"), "Factor of safety trend", Number(document.querySelector("#stable-threshold").value), simulated);
  trendSvg(document.querySelector("#trend-rain"), toPairs("rainfall"), "Rainfall trend", null, simulated);
  trendSvg(document.querySelector("#trend-pore"), toPairs("pore"), "Pore pressure trend", null, simulated);
  trendSvg(document.querySelector("#trend-displacement"), toPairs("displacement"), "Surface displacement trend", null, simulated);
  trendSvg(document.querySelector("#trend-risk"), toPairs("score"), "Prototype risk score trend", null, simulated);
  document.querySelector("#chart-mode").textContent = simulated ? "DEMO / SIMULATED DATA" : `${manual.length} SAVED ANALYSIS SNAPSHOT${manual.length === 1 ? "" : "S"}`;
}

function renderAssessment(values, shouldSave, simulated = false) {
  const engineering = calculateEngineering(values);
  const assessment = evaluateRisk(values, engineering.fs);
  if (!assessment.limits.valid) {
    currentAssessment = null;
    document.querySelector(".threshold-controls p").textContent = "Set thresholds in descending order: stable > moderate > high > 0.";
    ["#prototype-risk", "#engine-risk", "#condition-badge", "#warning-level", "#summary-risk", "#risk", "#status", "#summary-status"].forEach((selector) => { document.querySelector(selector).textContent = "CHECK LIMITS"; });
    ["#risk-score", "#engine-score", "#condition-score"].forEach((selector) => { document.querySelector(selector).textContent = "—"; });
    document.querySelector("#warning-text").textContent = "Correct the configured factor-of-safety thresholds before assigning a risk class.";
    document.querySelector("#risk-explanation").textContent = "Risk classification paused because screening thresholds are not in descending order.";
    return null;
  }
  document.querySelector(".threshold-controls p").textContent = "Below the high-risk threshold is critical. These are screening bands, not design criteria.";
  document.querySelector("#result .threshold-note b").textContent = `FS = ${assessment.limits.stable.toFixed(2)}`;
  document.querySelector(".band-note").textContent = `STABLE >= ${assessment.limits.stable.toFixed(2)} · MODERATE >= ${assessment.limits.moderate.toFixed(2)} · HIGH >= ${assessment.limits.high.toFixed(2)} · below high = CRITICAL`;
  const { score, risk, parts } = assessment;
  const color = riskColor(risk);
  const formattedFs = Number.isFinite(engineering.fs) ? engineering.fs.toFixed(2) : "∞";
  document.querySelector("#prototype-fs").textContent = formattedFs;
  document.querySelector("#prototype-risk").textContent = risk === "STABLE" ? "STABLE" : risk === "HIGH" ? "HIGH RISK" : risk;
  document.querySelector("#prototype-risk").style.color = color;
  document.querySelector(".risk-card").dataset.risk = risk;
  document.querySelector("#risk-score").textContent = String(score);
  document.querySelector("#engine-score").textContent = String(score);
  document.querySelector("#engine-risk").textContent = risk === "STABLE" ? "LOW / STABLE" : risk === "HIGH" ? "HIGH RISK" : risk;
  document.querySelector("#engine-risk").style.color = color;
  document.querySelector("#score-ring").style.borderColor = color;
  document.querySelector("#data-source").textContent = simulated ? "DEMO / SIMULATED DATA" : "MANUAL INPUTS";
  document.querySelector("#condition-badge").textContent = risk === "STABLE" ? "STABLE" : risk === "HIGH" ? "HIGH RISK" : risk;
  document.querySelector("#condition-badge").style.color = color;
  document.querySelector("#condition-badge").style.borderColor = color;
  document.querySelector("#condition-fs").textContent = formattedFs;
  document.querySelector("#condition-score").textContent = `${score} / 100`;
  document.querySelector("#condition-rain").textContent = `${values.rainfall.toFixed(1)} mm/day`;
  document.querySelector("#condition-pore").textContent = `${engineering.water.toFixed(2)} kPa`;
  document.querySelector("#condition-displacement").textContent = `${values.displacement.toFixed(1)} mm`;
  document.querySelector("#condition-crack").textContent = `${values.crackWidth.toFixed(1)} mm`;
  const [warning, warningText] = warningFor(risk);
  const alert = document.querySelector("#early-warning");
  alert.dataset.risk = risk;
  document.querySelector("#warning-level").textContent = warning;
  document.querySelector("#warning-text").textContent = warningText;
  document.querySelector("#risk-explanation").textContent = explanationFor(values, engineering, assessment);
  const states = classifyMonitor(values, engineering);
  setMonitor("rain", values.rainfall, "mm/day", states.rainfall);
  setMonitor("groundwater", values.groundwater, "m", states.groundwater);
  setMonitor("pore", engineering.water, "kPa", states.pore, 2);
  setMonitor("displacement", values.displacement, "mm", states.displacement);
  setMonitor("rate", values.displacementRate, "mm/day", states.rate);
  setMonitor("crack", values.crackWidth, "mm", states.crack);
  renderContributions(parts);
  renderRecommendations(values, assessment);
  document.querySelector("#result").dataset.risk = risk;
  document.querySelector("#status").textContent = risk === "STABLE" ? "STABLE" : risk === "HIGH" ? "HIGH RISK" : risk;
  document.querySelector("#summary-status").textContent = risk === "STABLE" ? "STABLE" : risk === "HIGH" ? "HIGH RISK" : risk;
  document.querySelector("#summary-risk").textContent = risk;
  document.querySelector("#risk").textContent = risk;
  document.querySelector("#summary-status").style.color = color;
  document.querySelector("#summary-dot").style.background = color;
  document.querySelector("#status").style.color = color;
  document.querySelector("#risk").style.color = color;
  document.querySelector("#summary-risk").style.color = color;
  document.querySelector("#message").textContent = `Prototype screening: FS ${formattedFs}; risk score ${score}/100; risk level ${risk}. Not a design conclusion.`;
  const statusText = warning === "NORMAL" ? "Current screening parameters are within the configured acceptable range." : warningText;
  document.querySelector("#interpret").textContent = `${statusText} Prototype engine status: active; trained ML model: not connected.`;
  const diagram = document.querySelector(".diagram");
  diagram.dataset.risk = risk;
  document.querySelector("#waterArrows").style.opacity = values.poreRatio >= 0.3 || values.rainfall >= 50 ? "1" : ".52";
  document.querySelector("#rain").style.opacity = values.rainfall >= 50 ? "1" : ".35";
  document.querySelector("#sim-badge").classList.toggle("simulated", simulated);
  document.querySelector("#sim-badge").innerHTML = simulated ? "<i></i> DEMO / SIMULATED DATA · NOT LIVE TELEMETRY" : "<i></i> MANUAL INPUT · NOT LIVE SENSOR DATA";
  currentAssessment = { values, engineering, assessment, warning, warningText, recommendations: recommendations(values, assessment), simulated };
  if (shouldSave) {
    const record = analysisRecord(values, engineering, assessment);
    analysisHistory.unshift(record);
    analysisHistory = analysisHistory.slice(0, 50);
    saveHistory();
    renderHistory();
    trendSamples.push({ fs: record.fs, rainfall: record.rainfall, pore: record.pore, displacement: record.displacement, score: record.score });
    trendSamples = trendSamples.slice(-12);
  }
  renderTrends(values, engineering, assessment, simulated ? demoSeries(values) : null);
  return currentAssessment;
}

function demoAt(base, tick) {
  const wave = Math.sin(tick / 2.3);
  const rise = clamp(tick / 20, 0, 1);
  return {
    ...base,
    rainfall: Math.max(0, base.rainfall + 12 + 22 * rise + 12 * wave),
    poreRatio: clamp(base.poreRatio + 0.06 + 0.12 * rise + 0.06 * wave, 0, 0.95),
    groundwater: Math.max(0.1, base.groundwater - 0.2 - 0.9 * rise - 0.3 * wave),
    displacement: Math.max(0, base.displacement + 0.7 * tick + 1.5 * rise + 0.5 * wave),
    displacementRate: Math.max(0, base.displacementRate + 0.25 * rise + 0.1 * Math.max(wave, 0)),
    crackWidth: Math.max(0, base.crackWidth + 0.2 * rise)
  };
}

function demoSeries(base) {
  return Array.from({ length: 12 }, (_, index) => {
    const simulatedValues = demoAt(base, demoTick - 11 + index);
    const engineering = calculateEngineering(simulatedValues);
    const assessment = evaluateRisk(simulatedValues, engineering.fs);
    return { fs: engineering.fs, rainfall: simulatedValues.rainfall, pore: engineering.water, displacement: simulatedValues.displacement, score: assessment.score };
  });
}

function setScenario(key) {
  const scenario = demoScenarios[key];
  if (!scenario) return;
  for (const [name, value] of Object.entries(scenario)) {
    const input = prototypeForm.elements.namedItem(name);
    if (input) input.value = value;
  }
}

function stopDemo() {
  if (demoTimer) window.clearInterval(demoTimer);
  demoTimer = null;
}

function startDemo() {
  stopDemo();
  demoTick = 0;
  const tick = () => {
    const simulatedValues = demoAt(valuesFromForm(), demoTick);
    renderAssessment(simulatedValues, false, true);
    demoTick += 1;
  };
  tick();
  demoTimer = window.setInterval(tick, 2500);
}

function renderReport() {
  const state = currentAssessment || renderAssessment(valuesFromForm(), false);
  if (!state) return;
  const { values, engineering, assessment } = state;
  const report = document.querySelector("#print-report");
  const inputRows = [
    ["Slope height", `${values.height} m`], ["Slope angle", `${values.angle} deg`], ["Slope length", `${values.slopeLength} m`],
    ["Cohesion", `${values.cohesion} kPa`], ["Friction angle", `${values.friction} deg`], ["Unit weight", `${values.unitWeight} kN/m3`],
    ["Rainfall", `${values.rainfall} mm/day`], ["Groundwater depth", `${values.groundwater} m`], ["Pore pressure ratio", values.poreRatio],
    ["Surcharge", `${values.surcharge} kPa`], ["Seismic coefficient", values.seismic], ["Surface displacement", `${values.displacement} mm`],
    ["Displacement rate", `${values.displacementRate} mm/day`], ["Crack width", `${values.crackWidth} mm`],
    ["FS screening bands", `stable ${assessment.limits.stable}, moderate ${assessment.limits.moderate}, high ${assessment.limits.high}`],
    ["Rainfall monitor bands", `${document.querySelector("#rain-watch").value} / ${document.querySelector("#rain-warning").value} / ${document.querySelector("#rain-critical").value} mm/day`]
  ];
  const escapedRows = inputRows.map(([name, value]) => `<tr><th>${name}</th><td>${String(value)}</td></tr>`).join("");
  const recommendationRows = state.recommendations.map((item) => `<li>${item}</li>`).join("");
  const lat = document.querySelector("#latitude").value;
  const lon = document.querySelector("#longitude").value;
  const elevation = document.querySelector("#elevation").value;
  report.innerHTML = `<h1>AI-ASSISTED REAL-TIME SLOPE STABILITY MONITORING AND RISK PREDICTION SYSTEM</h1><p>Ramachandra College of Engineering, Eluru · Prepared by Ch. Jagadeesh · B.Tech Civil Engineering</p><p>Analysis time: ${new Date().toLocaleString()}</p><h2>Engineering screening result</h2><p><b>FS:</b> ${engineering.fs.toFixed(2)} &nbsp; <b>Prototype risk score:</b> ${assessment.score}/100 &nbsp; <b>Risk:</b> ${assessment.risk}</p><h2>Input parameters</h2><table>${escapedRows}</table><h2>Monitoring and location</h2><p>Rainfall ${values.rainfall} mm/day · Groundwater depth ${values.groundwater} m · Pore pressure ${engineering.water.toFixed(2)} kPa · Displacement ${values.displacement} mm · Rate ${values.displacementRate} mm/day · Crack ${values.crackWidth} mm.</p><p>Demo location: ${lat}, ${lon} · elevation ${elevation} m. Data mode: ${state.simulated ? "DEMO / SIMULATED" : "MANUAL INPUT"}.</p><h2>Early warning</h2><p>${state.warning}: ${state.warningText}</p><h2>Prototype recommendations</h2><ul>${recommendationRows}</ul><p>Prototype AI Risk Engine active · trained Random Forest / Gradient Boosting model NOT CONNECTED · prediction confidence NOT ML VALIDATED.</p><p class="report-disclaimer"><b>Academic Prototype:</b> This system provides preliminary engineering decision support only. It is not a substitute for detailed geotechnical investigation, field monitoring, accepted limit-equilibrium analysis, or professional engineering design.</p>`;
  window.print();
}

function initPrototype() {
  renderHistory();
  trendSamples = analysisHistory.slice(0, 12).reverse().map((record) => ({ fs: record.fs, rainfall: record.rainfall, pore: record.pore, displacement: record.displacement, score: record.score }));
  document.querySelector("#clear-history").addEventListener("click", () => {
    analysisHistory = [];
    trendSamples = [];
    saveHistory();
    renderHistory();
    if (currentAssessment) renderTrends(currentAssessment.values, currentAssessment.engineering, currentAssessment.assessment);
  });
  scenarioSelect.addEventListener("change", () => setScenario(scenarioSelect.value));
  prototypeForm.addEventListener("submit", () => queueMicrotask(() => renderAssessment(valuesFromForm(), true, false)));
  prototypeForm.addEventListener("reset", () => {
    stopDemo();
    demoToggle.checked = false;
    scenarioSelect.value = "";
    window.setTimeout(() => {
      const defaults = { "rain-watch": 20, "rain-warning": 50, "rain-critical": 100, "pore-watch": .2, "pore-warning": .35, "pore-critical": .5, "gw-critical": .15, "gw-warning": .3, "gw-watch": .5, "disp-watch": 10, "disp-warning": 25, "disp-critical": 50, "rate-watch": 2, "rate-warning": 5, "rate-critical": 10, "crack-watch": 3, "crack-warning": 10, "crack-critical": 20 };
      Object.entries(defaults).forEach(([id, value]) => { document.querySelector(`#${id}`).value = value; });
      renderAssessment(valuesFromForm(), false, false);
    }, 0);
  });
  const recheckRisk = () => renderAssessment(currentAssessment?.values || valuesFromForm(), false, currentAssessment?.simulated || false);
  document.querySelector("#stable-threshold").addEventListener("input", recheckRisk);
  ["#moderate-threshold", "#high-threshold"].forEach((selector) => document.querySelector(selector).addEventListener("input", recheckRisk));
  document.querySelectorAll(".monitor-thresholds input").forEach((input) => input.addEventListener("input", () => {
    if (currentAssessment) renderAssessment(currentAssessment.values, false, currentAssessment.simulated);
  }));
  demoToggle.addEventListener("change", () => demoToggle.checked ? startDemo() : (stopDemo(), renderAssessment(valuesFromForm(), false, false)));
  document.querySelector("#predict").addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    document.querySelector("#prototype-engine").scrollIntoView({ behavior: "smooth", block: "center" });
  }, true);
  document.querySelector("#generate-report").addEventListener("click", renderReport);
  document.querySelector("#sectionSvg").setAttribute("aria-label", "Engineering slope cross section; current water and risk indicators update with analysis inputs");
  const initialValues = valuesFromForm();
  renderAssessment(initialValues, false, false);
}

initPrototype();
