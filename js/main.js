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

  // ---------- faq: 클릭하면 아래로 답변이 열리는 아코디언 ----------
  document.querySelectorAll('.faq__item').forEach((item) => {
    const btn = item.querySelector('.faq__q-btn');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  // ---------- showcase: 카드 5장은 각자 고정된 콘텐츠를 갖고, 5개 슬롯(작음-작음-큼-작음-작음) 자리를
  // 링처럼 순환한다. 드래그하면 카드마다 자기 rank/side만 한 칸 옆으로 바뀌고, CSS transition이 각 카드의
  // width/aspect-ratio/transform을 새 슬롯 값까지 자연스럽게 움직여서 실제로 "카드가 옆으로 넘어가는"
  // 모션이 나온다 — 트랙을 밀었다 되돌리는 트릭 없이, 딱 그 변화만으로 자연스럽게 이어짐 ----------
  const showcaseRow = document.getElementById('showcaseRow');
  if (showcaseRow) {
    const cards = [...showcaseRow.querySelectorAll('.showcase__card')];
    // 슬롯 순서(링): 0=왼쪽끝(rank2) → 1=왼쪽옆(rank1) → 2=중앙(rank0) → 3=오른쪽옆(rank1) → 4=오른쪽끝(rank2) → (다시 0)
    const slotStyle = [
      { rank: 2, side: 'left' },
      { rank: 1, side: 'left' },
      { rank: 0, side: 'center' },
      { rank: 1, side: 'right' },
      { rank: 2, side: 'right' },
    ];
    let slotOf = cards.map((_, i) => i); // 카드별 현재 슬롯 인덱스(초기: DOM 순서 그대로)

    const applySlots = () => {
      cards.forEach((card, i) => {
        const s = slotStyle[slotOf[i]];
        card.setAttribute('data-rank', String(s.rank));
        card.setAttribute('data-side', s.side);
      });
    };
    applySlots();

    const LAST = slotStyle.length - 1; // 4

    const step = (dir) => {
      // 링을 도는 5장 중, 끝(0 또는 4)에서 반대쪽 끝으로 "넘어가는" 카드 하나는 화면을 가로질러 슬라이드하면
      // 이상해 보이므로, 트랜지션을 끄고 화면 밖(off-screen) 자리로 먼저 순간이동시킨 뒤 트랜지션을 복구해서
      // 정상적으로 rank2 자리까지만 미끄러져 들어오게 한다(다른 카드는 원래처럼 그대로 애니메이션).
      const wrapFrom = dir > 0 ? LAST : 0; // dir>0: 오른쪽 끝(4)이 왼쪽 끝(0)으로 넘어감
      const wrapSide = dir > 0 ? 'left' : 'right'; // 넘어간 뒤 새로 들어서는 쪽
      const wrapIndex = slotOf.indexOf(wrapFrom);
      const wrapCard = cards[wrapIndex];

      wrapCard.classList.add('no-transition');
      wrapCard.setAttribute('data-rank', 'off');
      wrapCard.setAttribute('data-side', wrapSide);
      void wrapCard.offsetWidth; // 강제 리플로우 — 트랜지션 없이 이 상태를 먼저 확정시킴
      wrapCard.classList.remove('no-transition');

      // 모든 카드의 슬롯을 링을 따라 한 칸씩 이동 — 5슬롯=5카드라 항상 꽉 차고 끝없이 반복됨
      slotOf = slotOf.map((s) => (s + dir + slotStyle.length) % slotStyle.length);
      applySlots();
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

    // ---------- showcase: 페이지를 스크롤해서 이 섹션을 지나가는 동안, 스크롤 진행도에 맞춰
    // 카드가 자동으로 한 칸씩 넘어감(드래그 없이도 스크롤만으로 카드가 넘어가는 걸 보여줌) ----------
    const showcaseSection = showcaseRow.closest('section');
    if (showcaseSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const CYCLES_PER_SCROLL = 2; // 섹션을 한 번 지나가는 동안 카드가 도는 총 칸 수(5칸×2바퀴)
      const totalScrollSteps = cards.length * CYCLES_PER_SCROLL;
      let appliedScrollSteps = 0;
      let ticking = false;

      const syncToScroll = () => {
        ticking = false;
        const rect = showcaseSection.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const total = rect.height + vh;
        const scrolled = vh - rect.top; // 섹션이 화면에 들어오기 시작한 뒤로 스크롤된 거리
        const progress = Math.min(1, Math.max(0, scrolled / total));
        const targetSteps = Math.round(progress * totalScrollSteps);
        while (appliedScrollSteps < targetSteps) { step(1); appliedScrollSteps += 1; }
        while (appliedScrollSteps > targetSteps) { step(-1); appliedScrollSteps -= 1; }
      };

      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(syncToScroll);
      }, { passive: true });
      syncToScroll();
    }
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
