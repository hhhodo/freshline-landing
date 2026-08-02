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

  // ---------- showcase: 슬롯 5개(작음-작음-큼-작음-작음)는 위치·크기가 항상 고정, 콘텐츠만 한 칸씩 순환(무한 반복).
  // 화살표/점 없이 드래그하면 5개 카드의 텍스트가 자리를 옮기며 중앙 슬롯 콘텐츠가 바뀜 ----------
  const showcaseRow = document.getElementById('showcaseRow');
  if (showcaseRow) {
    const slots = [...showcaseRow.querySelectorAll('.showcase__card')];
    const data = [
      { title: '실시간<br>재고를<br>관리해요.', sub: '재고가 줄면<br>바로 알려드려요.' },
      { title: '자동으로<br>발주까지<br>이어져요.', sub: '기준 수량 이하로<br>떨어지면 자동 발주.' },
      { title: '주문의<br>모든 순간을<br>연결해요.', sub: '신규 주문부터<br>출고까지 이어져요.' },
      { title: '매장별<br>매출을<br>한눈에.', sub: '리포트로 바로<br>확인할 수 있어요.' },
      { title: '정산까지<br>자동으로<br>처리돼요.', sub: '주문부터 정산까지<br>한 번에 끝나요.' },
    ];
    let centerData = 2; // data[]에서 현재 중앙 슬롯에 오는 콘텐츠 인덱스

    const render = () => {
      slots.forEach((slot, slotIndex) => {
        const offset = slotIndex - 2; // 슬롯 순서상 중앙(인덱스 2) 기준 -2~+2
        const i = ((centerData + offset) % data.length + data.length) % data.length;
        slot.querySelector('.showcase__card-title').innerHTML = data[i].title;
        slot.querySelector('.showcase__card-sub').innerHTML = data[i].sub;
      });
    };
    render();

    const step = (dir) => {
      centerData = ((centerData + dir) % data.length + data.length) % data.length;
      render();
    };

    let isDown = false;
    let startX = 0;
    showcaseRow.addEventListener('mousedown', (e) => {
      isDown = true;
      showcaseRow.classList.add('is-dragging');
      startX = e.pageX;
    });
    window.addEventListener('mouseup', (e) => {
      if (!isDown) return;
      isDown = false;
      showcaseRow.classList.remove('is-dragging');
      const delta = e.pageX - startX;
      const THRESHOLD = 40;
      if (delta <= -THRESHOLD) step(1);
      else if (delta >= THRESHOLD) step(-1);
    });

    let touchStartX = null;
    showcaseRow.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    showcaseRow.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      const THRESHOLD = 40;
      if (delta <= -THRESHOLD) step(1);
      else if (delta >= THRESHOLD) step(-1);
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
