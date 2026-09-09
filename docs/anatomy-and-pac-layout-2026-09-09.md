# PVC anatomy review and PAC layout update — 2026-09-09

The PAC section below records the initial layout update. Its preserved raster and marker positions were subsequently corrected in the [PAC-specific anatomy follow-up](pac-anatomy-audit-2026-09-09.md).

## Review scope and conclusion

Reviewed the current PVC SVG, its displayed rendering and the principal anatomical relationships against Sánchez-Quintana et al., *Anatomical Basis for the Cardiac Interventional Electrophysiologist* (2015), especially the ventricular and outflow-tract sections and figures:
https://pmc.ncbi.nlm.nih.gov/articles/PMC4668306/

No major reversal or disconnected principal structure was identified within the scope of this opened/projected teaching diagram:

- The right ventricle is represented anterior to the left ventricle.
- RVOT passes anteriorly across LVOT; the pulmonary valve is represented above the aortic valve.
- The left ventricular outflow passage lies between the mitral valve and septum.
- The tricuspid and mitral valves connect to the corresponding ventricular cavities.
- Superior/inferior caval connections belong to the right atrium.
- Posterior annular/inferior regions are projected locations, not directly exposed points in a literal anterior view.

This is not certification of a dimensionally accurate anatomical model. The drawing combines opened cavities and projected posterior regions; it is not a single physical section. Marker positions represent broad teaching regions rather than clinically mapped foci. No PVC diagram or waveform code was changed in this update.

## PAC changes

- Extracted the diagram into `PACOriginDiagram.tsx`.
- Preserved the original `pac-unfolded-heart-v9.png` without image editing. Its atria, venous structures and coronary sinus remain prominent; the whole-heart background remains pale.
- Removed the overlaid schematic four-chamber ellipses and duplicated anatomical labels that obscured the original illustration.
- Combined each of the nine origin numbers with its name in one diagram callout. Leader lines connect to the same original projected origin coordinates.
- Retained the caveat that the right pulmonary veins connect to the left atrium behind the right atrium, not to the right atrium itself.
- Kept diagram → six miniature traces → six continuous traces ordering. No extra selector row was added.
- Folded the longer explanations while preserving the always-visible representative/non-diagnostic limitation.
- No change to PAC origin data, P-wave morphology, waveform renderer, timing or original raster asset.

## Verification performed

- Browser: clicked all nine origin buttons, confirmed one pressed selection each and six miniature plus six continuous SVGs each.
- Browser: collected all 60 path definitions under the two waveform containers before and after the edit for each origin. All nine arrays were exactly identical.
- Browser: inspected the rendered diagram at the normal desktop viewport. All nine buttons were 44 px high; callout rectangles did not overlap. No document-level horizontal overflow.
- Browser: opened both new explanation disclosures and confirmed their open state.
- Narrow layouts retain a 420 px minimum diagram width with internal horizontal scrolling. A separate mobile/device viewport test was not performed in this update.
- TypeScript check: passed.
- ESLint: passed.
- Existing test suite: 52/52 passed.
- Production build: passed.

Automated checks verify implementation regressions, not anatomical validity or clinical diagnostic performance. This update is local only; no commit or push was performed.
