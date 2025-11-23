// Move the logo by modifying its CSS `left` and `top` values.
(function () {
  const pin = document.getElementById('pinLogo');
  if (!pin) return;

  // Helper to get current numeric left/top in pixels relative to the viewport/page
  function getCurrentPos() {
    // If style left/top are set in px, use them. Otherwise use bounding rect.
    const leftStyle = pin.style.left;
    const topStyle = pin.style.top;
    const rect = pin.getBoundingClientRect();
    const left = leftStyle && leftStyle.endsWith('px') ? parseFloat(leftStyle) : rect.left + window.scrollX;
    const top = topStyle && topStyle.endsWith('px') ? parseFloat(topStyle) : rect.top + window.scrollY;
    return { left, top };
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  const step = 12; // pixels per move

  // Move by dx/dy in page pixels; clamp against viewport size so it stays visible
  function moveBy(dx, dy) {
    const { left: curLeft, top: curTop } = getCurrentPos();

    const maxLeft = window.innerWidth - pin.offsetWidth;
    const maxTop = window.innerHeight - pin.offsetHeight;

    const newLeft = clamp(curLeft + dx, 0, maxLeft);
    const newTop = clamp(curTop + dy, 0, maxTop);

    pin.style.left = newLeft + 'px';
    pin.style.top = newTop + 'px';
  }

  // Initialize pin position to its computed pixel coords so further moves use px
  (function init() {
    const rect = pin.getBoundingClientRect();
    pin.style.left = (rect.left + window.scrollX) + 'px';
    pin.style.top = (rect.top + window.scrollY) + 'px';
  })();

  // Rotate on scroll down, return on scroll up
  let prevScrollY = window.scrollY || window.pageYOffset;
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    const newY = window.scrollY || window.pageYOffset;
    if (newY === prevScrollY) return;
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        if (newY > prevScrollY) {
          // scrolled down
          pin.classList.add('rotated-scroll');
        } else if (newY < prevScrollY) {
          // scrolled up
          pin.classList.remove('rotated-scroll');
        }
        prevScrollY = newY;
        scrollTicking = false;
      });
    }
  }, { passive: true });
})();
