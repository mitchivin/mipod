/**
 * Shell-demo only: click-wheel press + rock-follow, LCD row select,
 * and top-left help menu (same idle/toggle behavior as the private shellHelp).
 * No music, library, or app modules.
 */

const PRESS_IDS = ['mid-button', 'menu', 'next', 'prev', 'play-pause'];

const BUTTON_ZONE_HALF_DEG = 26;
const BUTTON_ZONES = [
  { id: 'menu', angle: -90 },
  { id: 'next', angle: 0 },
  { id: 'play-pause', angle: 90 },
  { id: 'prev', angle: 180 },
];

const LCD_STEP_DEG = 25;

/** @type {SVGLinearGradientElement | null} */
let followGradientEl = null;
/** @type {string | null} */
let activeContactZone = null;
let wheelCx = 0;
let wheelCy = 0;
let followActive = false;
let contactRaf = 0;
/** @type {number | null} */
let pendingAngle = null;

/** @type {null | (() => void)} */
let toggleHelpFn = null;

function byId(id) {
  return document.getElementById(id);
}

function detectMobileViewport() {
  const ua = navigator.userAgent || '';
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
  const isAppleTablet = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  const isTouchPhysicalScreen =
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.screen.width <= 1024;
  if (isMobileUA || isAppleTablet || isTouchPhysicalScreen) {
    document.documentElement.classList.add('mobile-viewport');
  }
}

function shortestAngleDelta(fromDeg, toDeg) {
  return ((((toDeg - fromDeg + 180) % 360) + 360) % 360) - 180;
}

function angularDistance(a, b) {
  return Math.abs(shortestAngleDelta(a, b));
}

function zoneForAngle(angle) {
  for (const zone of BUTTON_ZONES) {
    if (angularDistance(angle, zone.angle) <= BUTTON_ZONE_HALF_DEG) return zone;
  }
  return null;
}

function cacheWheelCenter(wheel) {
  const rect = wheel.getBoundingClientRect();
  wheelCx = rect.left + rect.width / 2;
  wheelCy = rect.top + rect.height / 2;
}

function getAngle(e) {
  return Math.atan2(e.clientY - wheelCy, e.clientX - wheelCx) * (180 / Math.PI);
}

function getFollowGradient() {
  if (followGradientEl?.isConnected) return followGradientEl;
  followGradientEl = byId('wheel-rock-follow');
  return followGradientEl;
}

function clearOuterGlyphContact() {
  for (const z of BUTTON_ZONES) {
    byId(z.id)?.classList.remove('wheel-contact');
  }
  activeContactZone = null;
}

function updateWheelContactVisual(angle) {
  const wheel = byId('control-wheel');
  if (!wheel) return;

  if (angle == null) {
    wheel.classList.remove('rock-follow');
    wheel.style.removeProperty('--wheel-contact-angle');
    clearOuterGlyphContact();
    return;
  }

  wheel.classList.add('rock-follow');

  if (document.documentElement.classList.contains('mobile-viewport')) {
    wheel.style.setProperty('--wheel-contact-angle', String(angle));
  } else {
    const grad = getFollowGradient();
    if (grad) {
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      grad.setAttribute('x1', `${50 - cos * 50}%`);
      grad.setAttribute('y1', `${50 - sin * 50}%`);
      grad.setAttribute('x2', `${50 + cos * 50}%`);
      grad.setAttribute('y2', `${50 + sin * 50}%`);
    }
  }

  const nearId = zoneForAngle(angle)?.id ?? null;
  if (nearId !== activeContactZone) {
    for (const z of BUTTON_ZONES) {
      byId(z.id)?.classList.toggle('wheel-contact', z.id === nearId);
    }
    activeContactZone = nearId;
  }
}

function scheduleContactVisual(angle) {
  pendingAngle = angle;
  if (contactRaf) return;
  contactRaf = requestAnimationFrame(() => {
    contactRaf = 0;
    const next = pendingAngle;
    pendingAngle = null;
    if (next != null) updateWheelContactVisual(next);
  });
}

const LINK_CONFIRMS = {
  doodledev: {
    url: 'https://doodledev.app',
    message: 'Opens DoodleDev in a new tab. This device is available in the Preset menu.',
  },
  github: {
    url: 'https://github.com/mitchivin',
    message: "Opens Mitch's Github in a new tab.",
  },
  instagram: {
    url: 'https://www.instagram.com/mitchivin/',
    message: "Opens Mitch's Instagram in a new tab.",
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/mitchivin/',
    message: "Opens Mitch's LinkedIn in a new tab.",
  },
  author: {
    url: 'https://mitchivin.com/',
    message: "Opens Mitch's Portfolio in a new tab.",
  },
};

function initLinkConfirms(closeHelp) {
  const root = byId('shell-confirm');
  const openBtn = byId('shell-confirm-open');
  const messageEl = byId('shell-confirm-message');
  const titleEl = byId('shell-confirm-title');
  if (!root || !openBtn || !messageEl) return;

  let pendingUrl = null;
  // Ignore backdrop dismiss briefly so synthesized mobile clicks don't flash-close.
  let ignoreDismissUntil = 0;

  const setConfirmOpen = (open) => {
    root.hidden = !open;
    root.classList.toggle('is-open', open);
    if (open) {
      const isMobile = document.documentElement.classList.contains('mobile-viewport');
      if (!isMobile) openBtn.focus({ preventScroll: true });
    }
    if (!open) pendingUrl = null;
  };

  const showConfirm = (config) => {
    closeHelp?.();
    pendingUrl = config.url;
    if (titleEl) titleEl.textContent = 'Open Link';
    messageEl.textContent = config.message;
    ignoreDismissUntil = Date.now() + 450;
    setConfirmOpen(true);
  };

  const bindConfirm = (id, config) => {
    const link = byId(id);
    link?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showConfirm(config);
    });
  };

  bindConfirm('shell-help-doodledev', LINK_CONFIRMS.doodledev);
  bindConfirm('shell-help-github', LINK_CONFIRMS.github);
  bindConfirm('shell-help-instagram', LINK_CONFIRMS.instagram);
  bindConfirm('shell-help-linkedin', LINK_CONFIRMS.linkedin);
  bindConfirm('shell-help-author', LINK_CONFIRMS.author);

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = pendingUrl;
    setConfirmOpen(false);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });

  root.querySelectorAll('[data-shell-confirm-dismiss]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (Date.now() < ignoreDismissUntil) return;
      setConfirmOpen(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) {
      setConfirmOpen(false);
    }
  });
}

/** Page shell header menu — mirrors private shellHelp (no face asset). */
function setupHelpMenu() {
  const helpRoot = byId('shell-help');
  const helpToggle = byId('shell-help-toggle');
  const helpPanel = byId('shell-help-panel');
  if (!helpRoot || !helpToggle || !helpPanel) return;

  const IDLE_MS = 3000;
  let idleTimer = null;

  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  };

  const setHelpOpen = (open) => {
    helpRoot.classList.toggle('is-open', open);
    helpToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    helpPanel.hidden = !open;
    if (open) clearIdleTimer();
  };

  const toggleHelp = () => {
    setHelpOpen(!helpRoot.classList.contains('is-open'));
  };

  toggleHelpFn = toggleHelp;

  const schedulePanelClose = () => {
    clearIdleTimer();
    if (helpRoot.contains(document.activeElement)) return;
    idleTimer = setTimeout(() => {
      idleTimer = null;
      if (helpRoot.contains(document.activeElement)) return;
      setHelpOpen(false);
    }, IDLE_MS);
  };

  helpToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleHelp();
  });

  helpRoot.addEventListener('pointerleave', schedulePanelClose);
  window.addEventListener('blur', schedulePanelClose);

  document.addEventListener('click', (e) => {
    if (!helpRoot.classList.contains('is-open')) return;
    if (helpRoot.contains(e.target)) return;
    setHelpOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!helpRoot.classList.contains('is-open')) return;
    setHelpOpen(false);
    helpToggle.focus();
  });

  initLinkConfirms(() => setHelpOpen(false));
  setHelpOpen(false);
}

/**
 * Shell LCD: scroll 8 rows; middle two are labeled; center opens help on More Information.
 */
function setupShellLcdMenu() {
  const list = document.querySelector('#shell-lcd-demo .menu-list-body');
  const wheel = byId('control-wheel');
  const mid = byId('mid-button');
  if (!list || !wheel || !mid) return;

  const items = Array.from(list.querySelectorAll('.menu-item'));
  if (items.length === 0) return;

  let selectedIndex = Math.max(
    0,
    items.findIndex((el) => el.classList.contains('selected')),
  );
  let paintedIndex = -1;
  let lastAngle = 0;
  let totalRotation = 0;
  let scrolling = false;

  const paint = () => {
    if (paintedIndex === selectedIndex) return;
    if (paintedIndex >= 0) items[paintedIndex]?.classList.remove('selected');
    items[selectedIndex]?.classList.add('selected');
    paintedIndex = selectedIndex;
  };

  const step = (dir) => {
    const next = Math.max(0, Math.min(items.length - 1, selectedIndex + dir));
    if (next === selectedIndex) return;
    selectedIndex = next;
    paint();
  };

  const activate = () => {
    if (items[selectedIndex]?.dataset?.shellAction === 'more-info') {
      toggleHelpFn?.();
    }
  };

  paint();

  wheel.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#mid-button')) return;
    scrolling = true;
    cacheWheelCenter(wheel);
    lastAngle = getAngle(e);
    totalRotation = 0;
  });

  wheel.addEventListener('pointermove', (e) => {
    if (!scrolling) return;
    const angle = getAngle(e);
    const delta = shortestAngleDelta(lastAngle, angle);
    lastAngle = angle;
    totalRotation += delta;
    while (Math.abs(totalRotation) >= LCD_STEP_DEG) {
      const dir = totalRotation > 0 ? 1 : -1;
      step(dir);
      totalRotation -= dir * LCD_STEP_DEG;
    }
  });

  const endScroll = () => {
    scrolling = false;
    totalRotation = 0;
  };
  wheel.addEventListener('pointerup', endScroll);
  wheel.addEventListener('pointercancel', endScroll);

  mid.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    activate();
  });
}

function setupRockFollow() {
  const wheel = byId('control-wheel');
  if (!wheel) return;

  const endFollow = () => {
    if (!followActive) return;
    followActive = false;
    if (contactRaf) {
      cancelAnimationFrame(contactRaf);
      contactRaf = 0;
    }
    pendingAngle = null;
    updateWheelContactVisual(null);
  };

  wheel.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#mid-button')) return;
    e.preventDefault();
    followActive = true;
    cacheWheelCenter(wheel);
    updateWheelContactVisual(getAngle(e));
    try {
      wheel.setPointerCapture(e.pointerId);
    } catch (_) {
      /* ignore */
    }
  });

  wheel.addEventListener('pointermove', (e) => {
    if (!followActive) return;
    scheduleContactVisual(getAngle(e));
  });

  wheel.addEventListener('pointerup', endFollow);
  wheel.addEventListener('pointercancel', endFollow);
  window.addEventListener('pointerup', endFollow, true);
  window.addEventListener('pointercancel', endFollow, true);
}

function setupWheelPress() {
  /** @type {Map<number, HTMLElement>} */
  const activeByPointer = new Map();

  const release = (pointerId) => {
    const el = activeByPointer.get(pointerId);
    if (!el) return;
    el.classList.remove('pressed');
    activeByPointer.delete(pointerId);
  };

  for (const id of PRESS_IDS) {
    const el = byId(id);
    if (!el) continue;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.classList.add('pressed');
      activeByPointer.set(e.pointerId, el);
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    });
    el.addEventListener('pointerup', (e) => release(e.pointerId));
    el.addEventListener('pointercancel', (e) => release(e.pointerId));
  }

  window.addEventListener('pointerup', (e) => release(e.pointerId), true);
  window.addEventListener('pointercancel', (e) => release(e.pointerId), true);
}

const BOOT_MIN_MS = 480;
const BOOT_FADE_MS = 420;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hideShellLoader() {
  document.body.classList.remove('app-loading');
  const loader = byId('app-shell-loader');
  if (!loader) return;
  loader.classList.add('is-hidden');
  await wait(BOOT_FADE_MS);
  loader.remove();
}

async function bootShell() {
  const bootStartedAt = performance.now();
  detectMobileViewport();
  await customElements.whenDefined('ipod-design');
  setupHelpMenu();
  setupWheelPress();
  setupRockFollow();
  setupShellLcdMenu();
  const remaining = Math.max(0, BOOT_MIN_MS - (performance.now() - bootStartedAt));
  await wait(remaining);
  await hideShellLoader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    bootShell();
  });
} else {
  bootShell();
}
