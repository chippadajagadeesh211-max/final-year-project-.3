# AI-Assisted Slope Stability Monitoring

A no-install, single-page academic prototype for Ch. Jagadeesh, B.Tech Civil Engineering, Ramachandra College of Engineering, Eluru.

## Run and Deploy

Open `index.html` directly in a modern browser or publish the repository with GitHub Pages. No server, build step, backend, login, external assets, or dependencies are required.

## Demonstration Workflow

1. Enter slope, soil, water, loading, and deformation inputs.
2. Choose a form demo scenario or one of six what-if cases; four quick risk-state presets are also available.
3. Click **Run Analysis** to update engineering screening, prototype risk, warnings, charts, sensitivity curves, contributions, and history.
4. Toggle **Demo Mode** to show deterministic simulated monitoring/trend samples. The interface labels these as simulated and confirms that no physical sensor telemetry is connected.
5. Save an analysis explicitly, select a 24-hour / 7-day / 30-day illustrative trend window, generate a print-ready engineering report, or clear locally saved history.

Analysis history uses browser `localStorage`; if browser storage is unavailable, history is limited to the current page session.

## Engineering Screening

- Normal stress: `gamma * H * cos²(beta)`
- Water pressure: `ru * normal stress`
- Effective normal stress: `normal stress - water pressure`
- Resisting shear: `cohesion + effective normal stress * tan(phi)`
- Driving shear: `gamma * H * sin(beta) * cos(beta) + surcharge * sin(beta) * cos(beta) + kh * gamma * H * cos²(beta)`
- Factor of Safety: `resisting shear / driving shear`

Driving surcharge/seismic components are simplified screening terms, not a selected slip-surface or limit-equilibrium solution. Rainfall and groundwater depth are monitoring/context inputs; only the entered pore-pressure ratio affects the supplied FS equations. Screening FS bands and monitor-state thresholds are configurable and illustrative, not validated site alert or design criteria.

## Prototype Risk Engine

The **Prototype AI Risk Engine** is a deterministic weighted heuristic, not a trained model or calibrated probability. It normalizes nine indicators to 0–100, then combines them with fixed weights: FS 28%, angle 10%, rainfall 10%, groundwater depth 8%, pore-pressure ratio 12%, surface displacement 12%, displacement rate 8%, crack width 7%, and seismic coefficient 5%. Displayed contribution bars are the weighted score-point contribution from each input and sum to the rounded prototype score.

Risk tiers also consider the configured FS screening bands. The risk score, tier, monitor states, warnings, and recommendations are decision-support demonstrations only. Edit prototype FS and monitoring thresholds in the dashboard; invalid threshold ordering is flagged.

## Engineering Basis and Methods

The dashboard shows the Mohr–Coulomb/effective-stress equation chain and explains each displayed term. Its primary method is an infinite-slope stress approximation for preliminary screening of approximately planar, shallow instability; it does not search for a critical slip surface. Bishop, Janbu, Spencer, and numerical methods are described as future/detailed analysis methods and are not implemented.

The what-if panel evaluates six fixed parameter sets with the same live equations. Four quick demo buttons target SAFE, MODERATE, HIGH, and CRITICAL conditions. Sensitivity plots vary slope angle, cohesion, friction angle, unit weight, pore-pressure ratio, groundwater depth, surcharge, or seismic coefficient one at a time. Groundwater sensitivity is flat by design because depth is not a direct variable in the supplied FS equation; pore pressure ratio ru is the water-related FS input.

The five monitoring trends use saved analysis snapshots or explicitly simulated series, not measured time-series telemetry. The 24-hour, 7-day, and 30-day labels select illustrative sample windows and do not imply continuous monitoring data.

## Reports and History

Run Analysis saves an analysis snapshot; **Save Analysis** adds an explicit snapshot without rerunning. History is browser-local and can be cleared. The print report contains institution/author metadata, current input values, equations, FS and risk result, weighted score contributions, warnings, recommendations, methodology, data mode, and disclaimer.

## ML and GIS Status

Random Forest, Gradient Boosting, training data, model files, and prediction API are not connected. No ML accuracy, RMSE, MAE, R², predictions, or training samples are claimed. Trained machine-learning integration is a planned next stage. The GIS graphic and initial coordinates are a clearly labeled demo location, not a surveyed slope or live map.

`upgrade.js` augments the existing `prototype.js` calculation/render path with the engineering-basis content, six-case what-if analysis, sensitivity charts, expanded warnings, full report, responsive enhancement styles, and GIS/ML architecture notes. Keep both scripts on the page; neither requires a build step.

## Limitations

Academic prototype for demonstration only. Results must not substitute for site investigation, laboratory testing, field monitoring, groundwater assessment, accepted limit-equilibrium analysis, uncertainty assessment, or qualified professional engineering design.