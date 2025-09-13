// reveal.js
(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $targets = document.querySelectorAll(".reveal-up");

  // 動きを最小化するユーザー設定への配慮
  if (prefersReduced) {
    $targets.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const ioSupported = "IntersectionObserver" in window;

  // スタッガー（親内の連番で遅延）
  const applyStagger = (container) => {
    const children = container.querySelectorAll(".reveal-up");
    children.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 80, 480)}ms`;
    });
  };

  document.querySelectorAll(".plans").forEach(applyStagger);

  const reveal = (el) => {
    el.classList.add("is-visible");
  };

  if (ioSupported) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    });

    $targets.forEach((el) => io.observe(el));
  } else {
    // フォールバック：スクロール監視
    const onScroll = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      $targets.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.85) reveal(el);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
    onScroll();
  }
})();
