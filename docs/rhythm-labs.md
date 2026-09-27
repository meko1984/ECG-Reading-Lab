# 3 rhythm laboratories — 2026-09-27

## Routes and interactions

- `/labs/svt`: slow–fast AVNRT, orthodromic AVRT, illustrative high/low right atrial focal AT. Clickable, keyboard-operable cardiac sites update circuit arrows, all 12 leads, selected explanation and RP/PR timing diagram. Rate slider: 140–220/min.
- `/labs/atrial-flutter`: common counterclockwise, reverse common clockwise CTI-dependent flutter, and one perimitral atypical example. Anatomical selection updates the circuit and 12 leads; 240–340/min atrial rate and 2:1, 3:1, 4:1 AV conduction controls are independent.
- `/labs/pacemaker`: A, V, AV stimulation; normal response, noncapture, undersensing, oversensing and absent output. Direct state buttons change the illustrated condition and teaching interpretation. Timing slider moves stimuli; in undersensing it preserves intrinsic events while moving inappropriate output. AV delay and an inspection cursor are also adjustable.

All routes are linked from `/labs`. Static export uses `.html` URLs through the existing `appPath` helper.

## Medical scope

These are generated teaching examples, not calibrated clinical records or an ECG diagnostic classifier. The pacing interpretation describes the selected model conditions; it does not diagnose an uploaded or arbitrary waveform.

- Limb signals preserve Einthoven and Goldberger identities. Chest lead amplitudes, rates and timing offsets are illustrative.
- AT is represented as a focal source, not necessarily a large reentrant loop. AVNRT represents only slow–fast; AVRT only orthodromic. ECG patterns overlap and do not establish the mechanism or exact site.
- Flutter rotation is stated from the apical view of the tricuspid annulus. Atypical flutter is not a single polarity pattern and is not restricted to the left atrium. The uncertain term “anti common” is not adopted as a separate standard category.
- Native atrial activity marches independently of ventricular pacing in the V-mode example. A-mode assumes intact AV conduction. AV-mode faults target the ventricular channel; its undersensing example uses intrinsic atrial activity to isolate the ventricular problem.
- Missing output and oversensing produce comparable surface pauses; synthetic detection markers distinguish the *selected scenarios*. Surface ECG alone cannot establish that distinction.
- Undersensing can coexist with failure to respond during refractoriness. The 300 ms response boundary is explicitly an educational assumption, not a physiologic threshold.
- Spikes are enhanced for visibility. Device algorithms, fusion/pseudofusion simulation, CRT and conduction-system pacing are outside this implementation.

## Sources reviewed

- [2019 ESC SVT Guidelines](https://academic.oup.com/eurheartj/article/41/5/655/5556821) — SVT differential, AVNRT, AVRT, focal AT, typical/reverse flutter.
- [Prediction of the atrial flutter circuit location from the surface electrocardiogram](https://academic.oup.com/europace/article/10/7/786/397570) — typical polarity and circuit inference limitations.
- [Pacemaker Troubleshooting: Common Clinical Scenarios](https://pmc.ncbi.nlm.nih.gov/articles/PMC5067035/) — capture, output, sensing, fusion/pseudofusion.
- [Causes of Failure to Capture](https://pmc.ncbi.nlm.nih.gov/articles/PMC7192127/) — noncapture mechanisms.

Sources were checked online on 2026-09-27; each page also contains source links and a non-diagnostic notice. This is not external clinical validation.

## Verification

- `pnpm test`: 97 tests passed, including 8 new model tests for finite/extreme waveforms, lead identities, flutter conduction independence, SVT timing, capture failures, absent output versus oversensing, and pacing timing.
- `pnpm typecheck`, `pnpm lint`, `git diff --check` passed.
- GitHub Pages configuration: `GITHUB_PAGES_BUILD=true NEXT_PUBLIC_STATIC_EXPORT=true pnpm build`; all 17 routes prerendered, including the 3 new routes.
- Actual local static-browser interaction: all four SVT anatomical selections; rate slider and reset; common/reverse/atypical flutter and 4:1 conduction (75/min at 300/min atrial rate); all five pacing scenarios through the slider; A/V/AV selection; undersensing stimulus position changes from 120 to 400 ms with updated response explanation.
- Responsive inspection at 390×844 and 1024×768 landscape: the circuit/device diagram, primary controls, waveform grid and current interpretation fit in the initial viewport. The three new labs use the same compact workbench pattern; detailed differential tables and references remain collapsed below it. No page-level horizontal overflow was present. Browser error/warning log was empty at the inspected pacing state.
- Preview is local; no commit, push or public deployment is part of this task.
