# PAC anatomy follow-up — 2026-09-09

## Findings and corrections

This is a deeper PAC-specific review after the previous layout-only update. That update preserved the old raster anatomy and marker coordinates; it did not establish that those coordinates or the underlying drawing were anatomically adequate.

| Finding in the previous display | Correction |
| --- | --- |
| No distinct right atrial appendage; its marker pointed into the central right atrial body. | Drew a broad-rooted anterior/superior appendage attached to RA and placed marker 2 within it. |
| Left inferior pulmonary-vein marker fell below its vessel. | Defined separate vessel outlines and placed every vein marker on its corresponding vessel. |
| Right pulmonary veins visually stopped at RA; only prose explained their posterior course to LA. | Drew their paths through to LA, with the RA-hidden segments shown as dashed projections. These are not RA ostia. |
| Sinus-node location and CS ostium had little anatomical context. | Showed the sinus region at the lateral SVC–RA junction as a surface projection; clarified the low posteroseptal CS opening relative to IVC and the tricuspid orifice. |

The normal anatomical relationships are supported by the authors' dissection/histology material in [Sánchez-Quintana et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4668306/), the atrial and appendage descriptions in [Barbero and Ho](https://pmc.ncbi.nlm.nih.gov/articles/PMC5705746/), and the autoptic study of the CS in [Peculiarities in coronary sinus anatomy](https://pmc.ncbi.nlm.nih.gov/articles/PMC8576278/).

## Implementation and limits

- Replaced the rendered raster with repository-native SVG geometry in `pac-anatomy.ts` / `PACOriginDiagram.tsx`. The original PNG remains unchanged on disk.
- Both appendages attach to their own atrium. SVC/IVC and CS connect to RA; all four pulmonary veins connect to LA.
- The lateral CS segment remains outside LA and continues into faint cardiac venous tributaries; it does not end as an opening in the left atrial wall.
- Retained normal-strength origin anatomy and a pale whole-heart/valve context. Anterior and posterior structures are intentionally unfolded/projected; this is not a true single section, scaled 3D model, or map of precise clinical foci. Four pulmonary veins represent the common arrangement, not every variant.
- Updated only anatomical location prose in the PAC domain. Did not change the origin IDs, waveform groups, polarities, amplitudes, morphology functions, renderer or timing. No PVC files were edited during this follow-up.

## Verification

- Added four tests: all nine marker centers lie on their designated geometry; vessel junctions intersect the appropriate atrium; appendage roots join their own atrium while tips project beyond it; callout spacing clears 44 px at the existing minimum diagram width.
- Geometry tests flatten the paths for regression checks. They do not independently prove anatomical or clinical correctness.
- Actual browser: exercised all nine selections; each selected exactly one origin and displayed six miniatures plus six continuous traces.
- Compared all 60 waveform-container SVG path definitions per origin with the pre-edit capture. All nine sets matched exactly.
- Final browser screenshot inspected. Nine callouts, minimum height 44 px, no callout rectangle overlap, no document-level horizontal overflow, no captured warning/error logs. Separate mobile viewport testing was not performed.
- 56/56 tests passed; TypeScript, ESLint and production build passed.
- Local only. No commit, push or publication.
