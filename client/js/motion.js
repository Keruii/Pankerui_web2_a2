// Small, optional motion cues. Respect the operating system's reduced-motion setting.
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });

  function reveal(element) {
    if (!element || element.dataset.motionObserved) return;
    element.dataset.motionObserved = 'true';
    element.classList.add('reveal-on-scroll');
    revealObserver.observe(element);
  }

  document.querySelectorAll('.impact-strip, .intro, .events-section, .page-heading, .search-panel, .search-results, .detail-card, .closing-quote')
    .forEach(reveal);

  function animateCards(container, nodes) {
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement) || !node.classList.contains('event-card') || node.dataset.motionArrived) return;
      node.dataset.motionArrived = 'true';
      const index = Array.prototype.indexOf.call(container.children, node);
      node.style.setProperty('--card-delay', `${Math.min(index, 6) * 65}ms`);
      node.classList.add('card-arrive');
    });
  }

  document.querySelectorAll('#event-list, #search-results-list').forEach((container) => {
    const cardObserver = new MutationObserver((records) => {
      records.forEach((record) => animateCards(container, Array.from(record.addedNodes)));
    });
    cardObserver.observe(container, { childList: true });
    animateCards(container, Array.from(container.children));
  });
})();
