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

    // ---------- showcase: 섹션이 화면에 고정(sticky pin)된 채로 스크롤 진행도에 맞춰
    // 카드가 자동으로 한 칸씩 넘어감 — pin-spacer를 다 지나가야 고정이 풀리고 다음 섹션으로 넘어감.
    // 빨리 스크롤해도 step()을 한꺼번에 몰아서 호출하면 카드가 순간이동하듯 정신없이 넘어가므로,
    // 목표 칸(targetSteps)만 계속 갱신해두고 실제 step()은 일정 간격(STEP_INTERVAL)마다 딱 한 칸씩만
    // 실행해서, 스크롤 속도와 무관하게 항상 카드 하나가 부드럽게 슬라이드하는 것처럼 보이게 함 ----------
    const pinSpacer = document.getElementById('showcasePinSpacer');
    if (pinSpacer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const CYCLES_PER_SCROLL = 1; // pin이 유지되는 동안 카드가 도는 총 칸 수(5칸×1바퀴) — 너무 잘게 쪼개면
      // 스크롤 한 번(휠 한 칸/트랙패드 스와이프 한 번)에도 여러 칸이 한꺼번에 넘어가 버려서 1바퀴로 줄이고
      // 아래 pin-spacer 높이도 늘려 한 칸당 스크롤 거리를 넉넉하게 뒀다(스크롤 한 번 = 카드 한 칸)
      const totalScrollSteps = cards.length * CYCLES_PER_SCROLL;
      const STEP_INTERVAL = 420; // 카드 전환 트랜지션(.45s)이 대부분 끝난 뒤에 다음 칸으로 넘어가도록
      let appliedScrollSteps = 0;
      let targetSteps = 0;
      let lastStepAt = 0;
      // spacer의 문서상 절대 위치는 매 프레임 getBoundingClientRect()로 다시 재는 대신 한 번만 측정해서
      // 고정값으로 둔다 — 모바일에서 스크롤 중 주소창이 접히며 vh(뷰포트 높이)가 실시간으로 바뀌면
      // 매 프레임 재계산 시 진행도가 흔들려 카드가 앞으로 갔다 갑자기 왕창 뒤로 튀는 문제가 있었음.
      // window.scrollY는 그런 흔들림 없이 항상 실제 스크롤량만큼만 단조 증가/감소하므로 이걸 기준으로 삼음
      let spacerTop = 0;
      let scrollableDistance = 1;

      const measure = () => {
        const rect = pinSpacer.getBoundingClientRect();
        spacerTop = rect.top + window.scrollY;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        scrollableDistance = Math.max(1, rect.height - vh);
      };
      measure();
      window.addEventListener('resize', measure);

      const computeTarget = () => {
        const progress = Math.min(1, Math.max(0, (window.scrollY - spacerTop) / scrollableDistance));
        targetSteps = Math.round(progress * totalScrollSteps);
      };

      // 페이지가 이미 스크롤된 채로 열리는 경우(새로고침 등) appliedScrollSteps를 0부터 시작하면
      // 진짜 위치까지 카드가 한 바퀴 도는 애니메이션으로 "따라잡아서" 처음 보자마자 카드가 정신없이
      // 넘어가는 것처럼 보인다. 그래서 최초 1회는 애니메이션 없이 곧바로 현재 위치에 맞는 칸으로 맞춰둔다.
      computeTarget();
      appliedScrollSteps = targetSteps;

      const tick = (now) => {
        computeTarget();
        if (appliedScrollSteps !== targetSteps && now - lastStepAt >= STEP_INTERVAL) {
          if (appliedScrollSteps < targetSteps) { step(1); appliedScrollSteps += 1; }
          else { step(-1); appliedScrollSteps -= 1; }
          lastStepAt = now;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
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
