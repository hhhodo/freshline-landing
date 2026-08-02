(() => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- showcase: 중앙 다크 카드를 축으로 좌우 카드가 뿌려짐 — 화살표/점 없이 드래그·스크롤로 한 장씩 스냅 ----------
  const showcaseRow = document.getElementById('showcaseRow');
  if (showcaseRow) {
    const centerCard = showcaseRow.querySelector('.showcase__card--dark');
    if (centerCard) {
      const target = centerCard.offsetLeft
        - (showcaseRow.clientWidth - centerCard.offsetWidth) / 2;
      showcaseRow.scrollLeft = target;
    }
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    showcaseRow.addEventListener('mousedown', (e) => {
      isDown = true;
      showcaseRow.classList.add('is-dragging');
      startX = e.pageX;
      startScroll = showcaseRow.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; showcaseRow.classList.remove('is-dragging'); });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      showcaseRow.scrollLeft = startScroll - (e.pageX - startX);
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }
})();
