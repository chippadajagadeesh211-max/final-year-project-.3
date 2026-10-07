# Slope Stability Analysis Control Room

A static, browser-run engineering screening dashboard for the Civil Engineering Department at Ramachandra College of Engineering (RCE), Eluru.

## Run

Open `index.html` in a modern browser. No build step, server, external asset, or dependency installation is required.

## Calculation model

The displayed calculation follows the requested screening equations:

- Normal stress: `gamma * H * cos²(beta)`
- Water pressure: `ru * normal stress`
- Effective normal stress: `normal stress - water pressure`
- Resisting shear: `cohesion + effective normal stress * tan(phi)`
- Driving shear: `gamma * H * sin(beta) * cos(beta) + surcharge * sin(beta) * cos(beta) + kh * gamma * H * cos²(beta)`
- Factor of Safety: `resisting shear / driving shear`

The surcharge and seismic terms are explicitly simplified screening components. They do not represent a selected slip-surface or limit-equilibrium analysis. Rainfall and groundwater depth are contextual inputs for visualization and review prompts; they do not directly change FS because the supplied equations use the entered pore-pressure ratio. Reassess that ratio using a site-specific hydrogeologic basis. The displayed STABLE screening label uses FS >= 1.5; this is not a determination of site safety. Risk bands and input-trigger flags are illustrative and are not calibrated design criteria.

## AI and model evaluation

No Python notebook, trained models, training dataset, or model evaluation outputs were present in the supplied workspace. The Random Forest and Gradient Boosting prediction values, metrics, feature importance, confusion matrices, and best-model ranking are therefore shown as unavailable rather than fabricated. Connect the trained artifacts and their matching preprocessing/feature pipeline before reporting predictions.

Four engineering plots are computed deterministically from the current inputs. The Factor of Safety scenario sweep is a parameter sweep, not a probability distribution. Model-dependent plots remain unavailable until genuine model outputs are connected.

## Limitations

This is an educational screening prototype. It does not replace investigation, laboratory testing, groundwater assessment, accepted limit-equilibrium methods, numerical analysis, uncertainty assessment, or qualified geotechnical review. Confirm the calculation assumptions and applicability before using results in any engineering context.