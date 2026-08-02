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

  // ---------- showcase: 중앙 다크 카드를 축으로 좌우 카드가 뿌려짐 — 화살표/점 없이 드래그·스크롤로 한 장씩 넘기면
  // 중앙에 온 카드가 커지고 평평해짐(중앙 포커스), 스크롤 중 실시간으로 갱신됨 ----------
  const showcaseRow = document.getElementById('showcaseRow');
  if (showcaseRow) {
    const cards = [...showcaseRow.querySelectorAll('.showcase__card')];

    // 뷰포트 좌표 기준으로 계산 — scrollLeft/offsetParent 보정이 필요 없어 훨씬 안전함
    const diffFromCenter = (card) => {
      const rowRect = showcaseRow.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return (cardRect.left + cardRect.width / 2) - (rowRect.left + rowRect.width / 2);
    };

    const nearestCard = () => cards.reduce((closest, card) =>
      Math.abs(diffFromCenter(card)) < Math.abs(diffFromCenter(closest)) ? card : closest
    );

    const snapTo = (card) => {
      showcaseRow.scrollTo({ left: showcaseRow.scrollLeft + diffFromCenter(card), behavior: 'smooth' });
    };

    let updateQueued = false;
    const updateCenterClass = () => {
      updateQueued = false;
      const center = nearestCard();
      cards.forEach((card) => card.classList.toggle('is-center', card === center));
    };
    const scheduleUpdate = () => {
      if (!updateQueued) {
        updateQueued = true;
        requestAnimationFrame(updateCenterClass);
      }
    };

    const centerCard = showcaseRow.querySelector('.showcase__card--dark');
    if (centerCard) {
      showcaseRow.scrollLeft += diffFromCenter(centerCard);
      centerCard.classList.add('is-center');
    }

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
      scheduleUpdate();
    });

    // 터치/트랙패드 네이티브 스크롤: 실시간으로 중앙 카드 갱신 + 멈추면 스냅
    let scrollEndTimer = null;
    showcaseRow.addEventListener('scroll', () => {
      scheduleUpdate();
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
