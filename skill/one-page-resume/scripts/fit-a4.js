/*
  OnePageResume fit-a4 engine

  Purpose:
  This script performs small, rule-based density adjustments so a resume can stay
  within a single printable A4 page without immediately shrinking text or damaging hierarchy.

  This file is written for two audiences at once:
  1. the browser, which executes it
  2. future AI agents, which should read it to understand the intended adaptation order

  Core policy encoded here:
  - fix overflow by reducing spacing before reducing type size
  - keep typography within the floors and ceilings defined by the spec
  - handle underfilled pages as well as overflowing pages
  - treat the avatar as a locked top-right component rather than a normal density-control knob
  - expose a small public API instead of hiding behavior in inline anonymous code

  Expected template hooks:
  - a .resume root element
  - a .content element inside .resume
  - a .fit-end-marker at the end of .content
  - CSS variables on :root or .resume matching the variable names used below
*/

(function () {
  const PAGE_HEIGHT_MM = 297;
  const DEFAULT_MARGIN_MM = 6;
  const OVERFLOW_TOLERANCE_PX = 2;
  const DESIRED_BOTTOM_SLACK_MM = 10;
  const UNDERFILL_THRESHOLD_MM = 20;
  const MAX_ADJUSTMENT_PASSES = 48;

  const DEFAULTS = {
    '--header-pad-top': { value: 2.4, unit: 'mm' },
    '--header-pad-bottom': { value: 0.8, unit: 'mm' },
    '--section-gap': { value: 8, unit: 'px' },
    '--section-heading-gap': { value: 4, unit: 'px' },
    '--job-gap': { value: 2, unit: 'px' },
    '--company-gap': { value: 3, unit: 'px' },
    '--list-gap-top': { value: 5, unit: 'px' },
    '--list-item-gap': { value: 4, unit: 'px' },
    '--contact-gap': { value: 5, unit: 'px' },
    '--body-line-height': { value: 1.42, unit: '' },
    '--meta-line-height': { value: 1.36, unit: '' },
    '--body-font-size': { value: 9.4, unit: 'pt' },
    '--meta-font-size': { value: 8.8, unit: 'pt' },
    '--section-title-size': { value: 11.8, unit: 'pt' },
    '--job-title-size': { value: 10.8, unit: 'pt' },
    '--subtitle-size': { value: 10.8, unit: 'pt' },
    '--name-size': { value: 19.5, unit: 'pt' },
    '--avatar-width': { value: 20, unit: 'mm' },
    '--avatar-height': { value: 26, unit: 'mm' }
  };

  const LIMITS = {
    '--header-pad-top': { min: 2, max: 6, unit: 'mm' },
    '--header-pad-bottom': { min: 0.4, max: 6, unit: 'mm' },
    '--section-gap': { min: 4, max: 10, unit: 'px' },
    '--section-heading-gap': { min: 3, max: 6, unit: 'px' },
    '--job-gap': { min: 0, max: 4, unit: 'px' },
    '--company-gap': { min: 2, max: 6, unit: 'px' },
    '--list-gap-top': { min: 4, max: 8, unit: 'px' },
    '--list-item-gap': { min: 2, max: 6, unit: 'px' },
    '--contact-gap': { min: 4, max: 8, unit: 'px' },
    '--body-line-height': { min: 1.35, max: 1.5, unit: '' },
    '--meta-line-height': { min: 1.3, max: 1.45, unit: '' },
    '--body-font-size': { min: 8.7, max: 10.5, unit: 'pt' },
    '--meta-font-size': { min: 8.2, max: 9.5, unit: 'pt' },
    '--section-title-size': { min: 11, max: 13, unit: 'pt' },
    '--job-title-size': { min: 10, max: 11.5, unit: 'pt' },
    '--subtitle-size': { min: 10, max: 12, unit: 'pt' },
    '--name-size': { min: 17, max: 24, unit: 'pt' },
    '--avatar-width': { min: 20, max: 20, unit: 'mm' },
    '--avatar-height': { min: 26, max: 26, unit: 'mm' }
  };

  /*
    Overflow steps intentionally follow the policy in the layout spec:
    1. section spacing
    2. bullet spacing
    3. metadata / local spacing
    4. line-height
    5. font size

    Avatar size is intentionally omitted here. In this project the avatar is treated as a locked visual component once its top-right placement and proportion are correct.
  */
  const OVERFLOW_STEPS = [
    { name: '--section-gap', delta: -1 },
    { name: '--section-heading-gap', delta: -0.5 },
    { name: '--job-gap', delta: -1 },
    { name: '--list-gap-top', delta: -1 },
    { name: '--list-item-gap', delta: -1 },
    { name: '--company-gap', delta: -0.5 },
    { name: '--contact-gap', delta: -0.5 },
    { name: '--meta-line-height', delta: -0.02 },
    { name: '--body-line-height', delta: -0.03 },
    { name: '--header-pad-top', delta: -0.25 },
    { name: '--header-pad-bottom', delta: -0.25 },
    { name: '--meta-font-size', delta: -0.1 },
    { name: '--body-font-size', delta: -0.12 },
    { name: '--job-title-size', delta: -0.08 },
    { name: '--section-title-size', delta: -0.08 },
    { name: '--subtitle-size', delta: -0.06 },
    { name: '--name-size', delta: -0.08 }
  ];

  const UNDERFILL_STEPS = [
    { name: '--section-gap', delta: 1 },
    { name: '--header-pad-top', delta: 0.25 },
    { name: '--header-pad-bottom', delta: 0.25 },
    { name: '--list-item-gap', delta: 0.5 },
    { name: '--list-gap-top', delta: 0.5 },
    { name: '--body-line-height', delta: 0.02 },
    { name: '--meta-line-height', delta: 0.02 },
    { name: '--body-font-size', delta: 0.08 },
    { name: '--meta-font-size', delta: 0.05 },
    { name: '--job-title-size', delta: 0.05 },
    { name: '--section-title-size', delta: 0.05 },
    { name: '--subtitle-size', delta: 0.04 },
    { name: '--name-size', delta: 0.06 }
  ];

  function createUnitProbe(unit) {
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style.width = `100${unit}`;
    probe.style.height = '1px';
    probe.style.left = '-9999px';
    probe.style.top = '0';
    document.body.appendChild(probe);
    const pixels = probe.getBoundingClientRect().width / 100;
    probe.remove();
    return pixels;
  }

  const UNIT_TO_PX = {
    mm: null,
    pt: null,
    px: 1,
    '': 1
  };

  function ensureUnitCache() {
    if (!UNIT_TO_PX.mm) UNIT_TO_PX.mm = createUnitProbe('mm');
    if (!UNIT_TO_PX.pt) UNIT_TO_PX.pt = createUnitProbe('pt');
  }

  function toPixels(value, unit) {
    ensureUnitCache();
    return value * (UNIT_TO_PX[unit] || 1);
  }

  function getResume() {
    return document.querySelector('.resume');
  }

  function getContent(resume) {
    return resume?.querySelector('.content') || null;
  }

  function getMarker(resume) {
    return resume?.querySelector('.fit-end-marker') || null;
  }

  function pageMarginMm(resume) {
    const margin = Number(resume?.dataset?.pageMarginMm || DEFAULT_MARGIN_MM);
    return Number.isFinite(margin) ? margin : DEFAULT_MARGIN_MM;
  }

  function printableHeightPx(resume) {
    return toPixels(PAGE_HEIGHT_MM - (pageMarginMm(resume) * 2), 'mm');
  }

  function parseVarNumber(value) {
    const numeric = parseFloat(String(value).trim());
    return Number.isFinite(numeric) ? numeric : null;
  }

  function currentVarValue(target, name) {
    const computed = getComputedStyle(target).getPropertyValue(name);
    return parseVarNumber(computed);
  }

  const BASELINE_CACHE = new WeakMap();

  function setVar(target, name, value, unit) {
    const serialized = unit ? `${value}${unit}` : String(value);
    target.style.setProperty(name, serialized);
  }

  function variableUnit(name) {
    return LIMITS[name]?.unit ?? DEFAULTS[name]?.unit ?? '';
  }

  function snapshotBaseline(target) {
    const names = new Set([...Object.keys(DEFAULTS), ...Object.keys(LIMITS)]);
    const baseline = {};

    for (const name of names) {
      const current = currentVarValue(target, name);
      const fallback = DEFAULTS[name]?.value;
      if (current != null) baseline[name] = current;
      else if (fallback != null) baseline[name] = fallback;
    }

    return baseline;
  }

  function ensureBaseline(target) {
    if (!BASELINE_CACHE.has(target)) {
      BASELINE_CACHE.set(target, snapshotBaseline(target));
    }
    return BASELINE_CACHE.get(target);
  }

  function resetVariables(target) {
    const baseline = ensureBaseline(target);
    Object.entries(baseline).forEach(([name, value]) => {
      setVar(target, name, value, variableUnit(name));
    });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function nudgeVar(target, step) {
    const current = currentVarValue(target, step.name);
    const fallback = DEFAULTS[step.name]?.value;
    const limits = LIMITS[step.name];
    if (!limits) return false;

    const startingValue = current ?? fallback;
    if (startingValue == null) return false;

    const next = clamp(startingValue + step.delta, limits.min, limits.max);
    if (Math.abs(next - startingValue) < 0.0001) return false;

    setVar(target, step.name, next, limits.unit);
    return true;
  }

  function usedHeightPx(resume) {
    const marker = getMarker(resume);
    const content = getContent(resume);
    if (!resume || !marker || !content) return 0;

    const resumeBox = resume.getBoundingClientRect();
    const markerBox = marker.getBoundingClientRect();
    const contentStyle = getComputedStyle(content);
    const paddingBottom = parseFloat(contentStyle.paddingBottom) || 0;
    return (markerBox.bottom - resumeBox.top) + paddingBottom;
  }

  function measure(resume = getResume()) {
    if (!resume) {
      return {
        ok: false,
        reason: 'no-resume-root'
      };
    }

    const target = printableHeightPx(resume);
    const used = usedHeightPx(resume);
    const overflow = used - target;
    const spare = target - used;
    const desiredSlack = toPixels(DESIRED_BOTTOM_SLACK_MM, 'mm');
    const underfillThreshold = toPixels(UNDERFILL_THRESHOLD_MM, 'mm');

    let state = 'fit';
    if (overflow > OVERFLOW_TOLERANCE_PX) state = 'overflow';
    else if (spare > underfillThreshold) state = 'underfill';
    else if (spare > desiredSlack) state = 'fit-loose';

    return {
      ok: true,
      state,
      target,
      used,
      overflow,
      spare,
      desiredSlack,
      underfillThreshold
    };
  }

  function applyPasses(target, steps, shouldContinue) {
    let changedAny = false;

    for (let pass = 0; pass < MAX_ADJUSTMENT_PASSES; pass += 1) {
      if (!shouldContinue()) break;

      let changedThisPass = false;
      for (const step of steps) {
        if (!shouldContinue()) break;
        const changed = nudgeVar(target, step);
        if (changed) {
          changedAny = true;
          changedThisPass = true;
        }
      }

      if (!changedThisPass) break;
    }

    return changedAny;
  }

  function annotateResume(resume, info) {
    if (!resume || !info?.ok) return;
    resume.dataset.fitState = info.state;
    resume.dataset.fitUsedPx = info.used.toFixed(2);
    resume.dataset.fitTargetPx = info.target.toFixed(2);
    resume.dataset.fitOverflowPx = info.overflow.toFixed(2);
    resume.dataset.fitSparePx = info.spare.toFixed(2);
  }

  function fit(resume = getResume()) {
    if (!resume) return { ok: false, reason: 'no-resume-root' };

    resetVariables(resume);

    let info = measure(resume);
    if (!info.ok) return info;

    if (info.state === 'overflow') {
      applyPasses(resume, OVERFLOW_STEPS, function () {
        info = measure(resume);
        return info.ok && info.state === 'overflow';
      });
    } else if (info.state === 'underfill') {
      applyPasses(resume, UNDERFILL_STEPS, function () {
        info = measure(resume);
        return info.ok && info.state === 'underfill';
      });
    }

    info = measure(resume);
    annotateResume(resume, info);
    return info;
  }

  function refitAll() {
    document.querySelectorAll('.resume').forEach((resume) => fit(resume));
  }

  function installAutoHooks() {
    window.addEventListener('resize', refitAll);
    window.addEventListener('beforeprint', refitAll);
    if (document.fonts?.ready) {
      document.fonts.ready.then(refitAll).catch(function () {
        refitAll();
      });
    }
  }

  window.OnePageResumeFitA4 = {
    DEFAULTS,
    LIMITS,
    OVERFLOW_STEPS,
    UNDERFILL_STEPS,
    measure,
    fit,
    refitAll,
    reset(resume = getResume()) {
      if (!resume) return;
      resetVariables(resume);
      annotateResume(resume, measure(resume));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      installAutoHooks();
      refitAll();
    });
  } else {
    installAutoHooks();
    refitAll();
  }
})();
