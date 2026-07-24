class IpodDesign extends HTMLElement {
  connectedCallback() {
    if (this.dataset.mounted === 'true') return;
    this.dataset.mounted = 'true';

    this.innerHTML = `
  <svg id="doodle-defs" aria-hidden="true" width="0" height="0"
    style="height: 1px; left: -100px; opacity: 0; overflow-x: hidden; overflow-y: hidden; pointer-events: none; position: fixed; top: -100px; width: 1px">
    <defs>
      <linearGradient id="shared-stroke-4" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#222222"></stop>
        <stop offset="100%" stop-color="#2e2e2e"></stop>
      </linearGradient>
      <linearGradient id="shared-stroke-8" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#828282"></stop>
        <stop offset="100%" stop-color="#737373"></stop>
      </linearGradient>
      <!-- Desktop rock-follow stroke; mobile uses #wheel-contact-ring instead. Soft contrast. -->
      <linearGradient id="wheel-rock-follow" x1="50%" y1="100%" x2="50%" y2="0%" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="#8a8a8a"></stop>
        <stop offset="100%" stop-color="#5c5c5c"></stop>
      </linearGradient>
      <linearGradient id="mid-rock-play" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#f0f0f0"></stop>
        <stop offset="100%" stop-color="#606060"></stop>
      </linearGradient>
      <linearGradient id="shared-fill-10" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#959595"></stop>
        <stop offset="100%" stop-color="#d4d6d7"></stop>
      </linearGradient>
      <linearGradient id="shared-stroke-11" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#f0f0f0"></stop>
        <stop offset="100%" stop-color="#919191"></stop>
      </linearGradient>
      <filter id="shared-inner-5" primitiveunits="objectBoundingBox" x="-50%" y="-50%" width="200%" height="200%">
        <feFlood flood-color="black" flood-opacity="1.00" result="df"></feFlood>
        <feComposite operator="out" in2="SourceAlpha" in="df" result="di"></feComposite>
        <feOffset dx="0.0052" dy="-0.0033" in="di" result="do"></feOffset>
        <feGaussianBlur stdDeviation="0.0128" in="do" result="db"></feGaussianBlur>
        <feComposite operator="in" in2="SourceAlpha" in="db" result="sh"></feComposite>
        <feFlood flood-color="white" flood-opacity="0.14" result="lf"></feFlood>
        <feComposite operator="out" in2="SourceAlpha" in="lf" result="li"></feComposite>
        <feOffset dx="-0.0052" dy="0.0033" in="li" result="lo"></feOffset>
        <feGaussianBlur stdDeviation="0.0128" in="lo" result="lb"></feGaussianBlur>
        <feComposite operator="in" in2="SourceAlpha" in="lb" result="gl"></feComposite>
        <feMerge>
          <feMergeNode in="SourceGraphic"></feMergeNode>
          <feMergeNode in="gl"></feMergeNode>
          <feMergeNode in="sh"></feMergeNode>
        </feMerge>
      </filter>
      <filter id="shared-inner-9" primitiveunits="objectBoundingBox" x="-50%" y="-50%" width="200%" height="200%">
        <feFlood flood-color="black" flood-opacity="1.00" result="flood"></feFlood>
        <feComposite operator="out" in="flood" in2="SourceAlpha" result="inv"></feComposite>
        <feGaussianBlur stdDeviation="0.0085" in="inv"></feGaussianBlur>
        <feComposite operator="in" in2="SourceAlpha" result="sh"></feComposite>
        <feMerge>
          <feMergeNode in="SourceGraphic"></feMergeNode>
          <feMergeNode in="sh"></feMergeNode>
        </feMerge>
      </filter>
      <filter id="shared-inner-12" primitiveunits="objectBoundingBox" x="-50%" y="-50%" width="200%" height="200%">
        <feFlood flood-color="black" flood-opacity="0.25" result="flood"></feFlood>
        <feComposite operator="out" in="flood" in2="SourceAlpha" result="inv"></feComposite>
        <feGaussianBlur stdDeviation="0.015" in="inv"></feGaussianBlur>
        <feComposite operator="in" in2="SourceAlpha" result="sh"></feComposite>
        <feMerge>
          <feMergeNode in="SourceGraphic"></feMergeNode>
          <feMergeNode in="sh"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
  </svg>
  <div id="ipod">
    <div class="item" id="base" style="height: 100%; left: 0%; opacity: 1; top: 0%; width: 100%; z-index: 2">
      <img src="public/ipod-base.webp" alt="" style="width: 100%; height: 100%; display: block; object-fit: fill" draggable="false" />
    </div>
    <section class="item" id="viewport" style="height: 42.3756%; isolation: isolate; left: 8.08625%; top: 0.321027%; width: 91.3747%; z-index: 4">
      <div class="item" id="screen" style="height: 88.6364%; left: 0%; opacity: 1; top: 11.3636%; width: 91.7404%; z-index: 2">
        <svg class="shape" viewBox="0 0 311.000000 234.000000" width="311.000000" height="234.000000" preserveAspectRatio="none">
          <defs>
            <path d="M 6 0 L 305 0 A 6 6 0 0 1 311 6 L 311 228 A 6 6 0 0 1 305 234 L 6 234 A 6 6 0 0 1 0 228 L 0 6 A 6 6 0 0 1 6 0 Z" id="path-3"></path>
          </defs>
          <g>
            <use class="fill-path" href="#path-3" fill="#2D2E2B" filter="url(#shared-inner-5)"></use>
            <use class="stroke-path" href="#path-3" fill="none" stroke="url(#shared-stroke-4)" stroke-width="3"></use>
          </g>
        </svg>
        <div id="ipod-screen-content">
          <div id="shell-lcd-demo">
            <div class="ipod-status-bar" id="ipod-header">
              <div class="header-left">MiPod</div>
              <div class="header-right">
                <svg class="battery-icon" viewBox="0 0 27 12" aria-hidden="true">
                  <defs>
                    <linearGradient id="shell-battery-shell" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#fff" />
                      <stop offset="1" stop-color="#d5d5d5" />
                    </linearGradient>
                    <linearGradient id="shell-battery-green" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#d9ffad" />
                      <stop offset="0.42" stop-color="#76c747" />
                      <stop offset="1" stop-color="#2b6b12" />
                    </linearGradient>
                  </defs>
                  <path d="M24 4h2.25v4H24z" fill="#858585" />
                  <rect x="0.5" y="0.5" width="23" height="11" rx="1.5" fill="url(#shell-battery-shell)" stroke="#7d7d7d" />
                  <rect x="1.7" y="1.7" width="20.6" height="8.6" rx="0.7" fill="url(#shell-battery-green)" />
                  <path d="M2.2 2.15h19.6v2.2H2.2z" fill="#fff" opacity="0.32" />
                </svg>
              </div>
            </div>
            <div class="menu-list-body">
              <div class="menu-item" aria-hidden="true"></div>
              <div class="menu-item" aria-hidden="true"></div>
              <div class="menu-item" aria-hidden="true"></div>
              <div class="menu-item selected">
                <span class="menu-item-label">Shell Demo</span>
              </div>
              <div class="menu-item" data-shell-action="more-info">
                <span class="menu-item-label">More Information</span>
              </div>
              <div class="menu-item" aria-hidden="true"></div>
              <div class="menu-item" aria-hidden="true"></div>
              <div class="menu-item" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="item" id="screen-bezel-overlay" style="height: 88.6364%; left: 0%; opacity: 1; top: 11.3636%; width: 91.7404%; z-index: 5; pointer-events: none">
        <svg class="shape" viewBox="0 0 311 234" width="311" height="234" preserveAspectRatio="none">
          <defs>
            <path d="M 6 0 L 305 0 A 6 6 0 0 1 311 6 L 311 228 A 6 6 0 0 1 305 234 L 6 234 A 6 6 0 0 1 0 228 L 0 6 A 6 6 0 0 1 6 0 Z" id="path-screen-bezel-overlay"></path>
          </defs>
          <g>
            <use class="fill-path" href="#path-screen-bezel-overlay" fill="none"></use>
            <use class="stroke-path" href="#path-screen-bezel-overlay" fill="none" stroke="url(#shared-stroke-4)" stroke-width="3"></use>
          </g>
        </svg>
      </div>
    </section>
    <section class="item" id="control-wheel" style="height: 37.721%; isolation: isolate; left: 18.3288%; top: 52.1669%; width: 63.3423%; z-index: 3">
      <div class="item interactive" id="wheel" style="height: 100%; left: 0%; top: 0%; width: 100%; z-index: 2">
        <svg class="shape" viewBox="0 0 236 236" preserveAspectRatio="xMidYMid meet" width="236" height="236">
          <defs>
            <path d="M 0 118 C 0 52.829 52.829 0 118 0 C 183.171 0 236 52.829 236 118 C 236 183.171 183.171 236 118 236 C 52.829 236 0 183.171 0 118 Z M 76.7 118 C 76.7 140.81 95.19 159.3 118 159.3 C 140.81 159.3 159.3 140.81 159.3 118 C 159.3 95.19 140.81 76.7 118 76.7 C 95.19 76.7 76.7 95.19 76.7 118 Z" id="path-6"></path>
          </defs>
          <g>
            <use class="fill-path" href="#path-6" fill="#FFFFFF" filter="url(#shared-inner-9)"></use>
            <use class="stroke-path" href="#path-6" fill="none" stroke="url(#shared-stroke-8)" stroke-width="1"></use>
          </g>
        </svg>
      </div>
      <div id="wheel-contact-ring" aria-hidden="true"></div>
      <div class="item interactive" id="mid-button" style="height: 35%; left: 32.5%; opacity: 1; top: 32.5%; width: 35%; z-index: 3">
        <svg class="shape" viewBox="0 0 98.000000 98.000000" width="98.000000" height="98.000000" preserveAspectRatio="none">
          <defs>
            <path d="M 49 0 L 49 0 A 49 49 0 0 1 98 49 L 98 49 A 49 49 0 0 1 49 98 L 49 98 A 49 49 0 0 1 0 49 L 0 49 A 49 49 0 0 1 49 0 Z" id="path-7"></path>
          </defs>
          <g>
            <use class="fill-path" href="#path-7" fill="url(#shared-fill-10)" filter="url(#shared-inner-12)"></use>
          </g>
        </svg>
      </div>
      <div class="item interactive" id="menu" style="height: 6.86%; left: 40.9%; opacity: 0.28; top: 5.47%; width: 18.2%; z-index: 4">
        <img class="shape" src="public/icons/menu.svg" alt="Menu" draggable="false">
      </div>
      <div class="item interactive" id="next" style="height: 4.63%; left: 84.56%; opacity: 0.28; top: 47.685%; width: 12.16%; z-index: 5">
        <img class="shape" src="public/icons/next.svg" alt="Next" draggable="false">
      </div>
      <div class="item interactive" id="prev" style="height: 4.63%; left: 3%; opacity: 0.28; top: 47.685%; width: 12.16%; z-index: 6">
        <img class="shape" src="public/icons/prev.svg" alt="Previous" draggable="false">
      </div>
      <div class="item interactive" id="play-pause" style="height: 6.77%; left: 45.53%; opacity: 0.28; top: 89.62%; width: 8.94%; z-index: 7">
        <img class="shape" src="public/icons/play-pause.svg" alt="Play/Pause" draggable="false">
      </div>
    </section>
  </div>
`;
  }
}

customElements.define('ipod-design', IpodDesign);
