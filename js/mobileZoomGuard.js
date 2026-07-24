/**
 * Mobile browser zoom + iOS Safari text-loupe guard.
 * Load synchronously in <head> before other scripts (classic script, not module).
 *
 * Modes (set window.__MITCHIVIN_ZOOM_GUARD_MODE__ before this script):
 * - 'strict'   — Game Boy / iPod: block all touchmove; allow multi-touch
 *                (wheel rock). Pinch blocked via touch-action + gesture*.
 * - 'standard' — shell + most apps: block multi-touch only
 * - 'pan'      — image viewer: multi-touch block only; keep single-finger pan
 *
 * Site-wide (all modes): suppress iOS Safari text magnifier / callout on UI chrome.
 * - Universal user-select/touch-callout none (editables exempt)
 * - Explicit SVG / text / tspan belt (WebKit still loupes SVG text under `*`)
 * - Double-tap loupe: preventDefault on second touchstart + touchend (350ms)
 * Typing surfaces (input / textarea / contenteditable) stay selectable.
 * Native WKWebView can kill the loupe fully — the web cannot; this is best-effort.
 *
 * Shared with XP MiPod / shell chrome (same strict-mode contract).
 *
 * @module js/mobileZoomGuard
 */
(function initMobileZoomGuard(global) {
  if (global.__MITCHIVIN_ZOOM_GUARD__) return;
  global.__MITCHIVIN_ZOOM_GUARD__ = true;

  const mode = global.__MITCHIVIN_ZOOM_GUARD_MODE__ || 'standard';
  const opts = { passive: false, capture: true };
  const DOUBLE_TAP_MS = 350;
  // LOCKED for Mi Boy / MiPod: strict must allow multi-touch.
  // Pinch is blocked via touch-action:none + gesture* + touchmove preventDefault.
  // Never re-add multi-touchstart preventDefault in strict — it kills finger 2.
  const allowMultiTouch = mode === 'strict';

  /**
   * Real typing / selection surfaces — keep caret, word-select, paste callout.
   * @param {EventTarget|null|undefined} node
   * @returns {boolean}
   */
  function isEditableTarget(node) {
    const el = node instanceof Element ? node : node && /** @type {Node} */ (node).parentElement;
    if (!(el instanceof Element)) return false;
    const hit = el.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
    );
    if (!hit) return false;
    if ((hit instanceof HTMLInputElement || hit instanceof HTMLTextAreaElement) && hit.disabled) {
      return false;
    }
    return true;
  }

  /**
   * Menus / dialogs that need rapid successive taps — skip double-tap PD.
   * @param {EventTarget|null|undefined} node
   * @returns {boolean}
   */
  function isInteractiveChrome(node) {
    const t = node instanceof Element ? node : null;
    return (
      !!t &&
      !!t.closest(
        '#shell-help, #shell-confirm, .xp-context-menu, .startmenu, .all-programs-menu, .recently-used-menu, .popup-window',
      )
    );
  }

  /**
   * Double-tap → loupe / zoom path. Never steal taps in menus or text fields.
   * @param {EventTarget|null|undefined} target
   * @returns {boolean}
   */
  function shouldBlockDoubleTap(target) {
    if (isEditableTarget(target)) return false;
    if (isInteractiveChrome(target)) return false;
    return true;
  }

  ['gesturestart', 'gesturechange', 'gestureend'].forEach((type) => {
    global.document.addEventListener(type, (e) => e.preventDefault(), opts);
  });

  if (!allowMultiTouch) {
    global.document.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length > 1) e.preventDefault();
      },
      opts,
    );
  }

  let lastTouchEnd = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;
  const DOUBLE_TAP_DIST_PX = 24;

  // Loupe often starts on the second touchstart — PD here, not only on touchend.
  // Single-finger only; never interfere with strict multi-touch.
  // Distance threshold (24px) ensures rapid scrolling/flicking isn't misidentified as a double tap.
  global.document.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      if (!shouldBlockDoubleTap(e.target)) {
        if (isEditableTarget(e.target)) lastTouchEnd = 0;
        return;
      }
      const touch = e.touches[0];
      const now = Date.now();
      const dist = Math.hypot(touch.clientX - lastTouchX, touch.clientY - lastTouchY);
      if (lastTouchEnd > 0 && now - lastTouchEnd <= DOUBLE_TAP_MS && dist <= DOUBLE_TAP_DIST_PX) {
        e.preventDefault();
      }
    },
    opts,
  );

  global.document.addEventListener(
    'touchmove',
    (e) => {
      if (mode === 'strict') {
        e.preventDefault();
        return;
      }
      if (e.touches.length > 1) e.preventDefault();
    },
    opts,
  );

  global.document.addEventListener(
    'touchend',
    (e) => {
      if (isEditableTarget(e.target)) {
        lastTouchEnd = 0;
        return;
      }
      const touch = e.changedTouches?.[0];
      if (touch) {
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
      }
      const now = Date.now();
      if (
        shouldBlockDoubleTap(e.target) &&
        lastTouchEnd > 0 &&
        now - lastTouchEnd <= DOUBLE_TAP_MS
      ) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    opts,
  );

  global.document.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) e.preventDefault();
    },
    opts,
  );

  // Block long-press callout on chrome; allow native edit menu in fields.
  global.document.addEventListener(
    'contextmenu',
    (e) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    },
    opts,
  );

  // Belt: stop selection from starting on non-editable UI (feeds the loupe).
  global.document.addEventListener(
    'selectstart',
    (e) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    },
    opts,
  );

  global.document.addEventListener(
    'dragstart',
    (e) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    },
    opts,
  );

  try {
    if (!global.document.getElementById('mobile-zoom-guard-style')) {
      const style = global.document.createElement('style');
      style.id = 'mobile-zoom-guard-style';
      // strict (iPod / GBC): touch-action none — no browser pan/zoom gestures at all
      // standard/pan: manipulation — still blocks double-tap zoom, allows intentional pan where needed
      const touchAction = mode === 'strict' ? 'none' : 'manipulation';
      // Site-wide iOS text loupe / callout mitigation (all modes). Typing surfaces exempt.
      const noSelect =
        'html,body,*:not(input):not(textarea):not(select):not([contenteditable]):not([contenteditable="true"]){' +
        '-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;' +
        '-webkit-tap-highlight-color:transparent;' +
        '}' +
        'input,textarea,select,[contenteditable],[contenteditable="true"]{' +
        '-webkit-user-select:text;user-select:text;' +
        '}';
      // WebKit still loupes SVG <text>/<tspan> under the universal `*` rule alone.
      // !important beats accidental later rules; never apply to typing surfaces.
      const svgNoSelect =
        'svg,svg *,text,tspan,image,img{' +
        '-webkit-touch-callout:none!important;-webkit-user-select:none!important;' +
        'user-select:none!important;-webkit-user-drag:none!important;' +
        '}';
      const strictTouch = mode === 'strict' ? 'html,body,*{touch-action:none;}' : '';
      style.textContent =
        `html,body{touch-action:${touchAction};overscroll-behavior:none;` +
        `-webkit-text-size-adjust:100%;text-size-adjust:100%;` +
        `-webkit-tap-highlight-color:transparent;}` +
        noSelect +
        svgNoSelect +
        strictTouch;
      global.document.head.appendChild(style);
    }
  } catch (_) {
    /* ignore */
  }

  // Extra belt: block dblclick zoom paths some mobile browsers still honor
  global.document.addEventListener(
    'dblclick',
    (e) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    },
    opts,
  );

  function hardenViewportMeta() {
    const meta = global.document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    const keepWidget = /interactive-widget=resizes-content/.test(meta.content);
    let next =
      'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    if (keepWidget) next += ', interactive-widget=resizes-content';
    if (meta.content !== next) meta.content = next;
  }

  function resetPageScale() {
    const vv = global.visualViewport;
    if (!vv || vv.scale <= 1.001) return;

    hardenViewportMeta();
    try {
      global.scrollTo(0, 0);
    } catch (_) {
      /* ignore */
    }
    if (typeof global.setRealVh === 'function') {
      global.setRealVh();
    }
    if (typeof global.forceViewportRecalc === 'function') {
      try {
        global.forceViewportRecalc();
      } catch (_) {
        /* ignore */
      }
    }
  }

  hardenViewportMeta();

  if (global.visualViewport) {
    global.visualViewport.addEventListener('resize', resetPageScale);
    global.visualViewport.addEventListener('scroll', resetPageScale);
  }

  global.addEventListener('orientationchange', () => {
    setTimeout(() => {
      hardenViewportMeta();
      resetPageScale();
    }, 100);
  });

  global.__resetPageScale = resetPageScale;
})(typeof window !== 'undefined' ? window : globalThis);
