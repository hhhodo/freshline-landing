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
    const cards = [...showcaseRow.querySelectorAll('.showcase__card')];

    // offsetLeft는 가장 가까운 position 조상 기준이라 카드마다 값이 어긋날 수 있어 getBoundingClientRect로 계산
    const cardCenter = (card) => {
      const rowRect = showcaseRow.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return (cardRect.left - rowRect.left) + cardRect.width / 2 + showcaseRow.scrollLeft;
    };

    const snapTo = (card) => {
      const target = cardCenter(card) - showcaseRow.clientWidth / 2;
      showcaseRow.scrollTo({ left: target, behavior: 'smooth' });
    };

    const nearestCard = () => {
      const viewportCenter = showcaseRow.scrollLeft + showcaseRow.clientWidth / 2;
      return cards.reduce((closest, card) => {
        const dist = Math.abs(cardCenter(card) - viewportCenter);
        const closestDist = Math.abs(cardCenter(closest) - viewportCenter);
        return dist < closestDist ? card : closest;
      });
    };

    const centerCard = showcaseRow.querySelector('.showcase__card--dark');
    if (centerCard) showcaseRow.scrollLeft = cardCenter(centerCard) - showcaseRow.clientWidth / 2;

    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScroll = 0;
    showcaseRow.addEventListener('mousedown', (e) => {
      isDown = true;
      dragged = false;
      showcaseRow.classList.add('is-dragging');
      startX = e.pageX;
      startScroll = showcaseRow.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      showcaseRow.classList.remove('is-dragging');
      if (dragged) snapTo(nearestCard());
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      dragged = true;
      showcaseRow.scrollLeft = startScroll - (e.pageX - startX);
    });

    // 터치/트랙패드 네이티브 스크롤이 멈추면 가장 가까운 카드로 스냅
    let scrollEndTimer = null;
    showcaseRow.addEventListener('scroll', () => {
      if (isDown) return;
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => snapTo(nearestCard()), 120);
    }, { passive: true });
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
