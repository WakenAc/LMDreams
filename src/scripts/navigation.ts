const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const panel = document.querySelector<HTMLElement>('[data-nav-panel]');

if (toggle && panel) {
  const header = toggle.closest('header');

  const closePanel = () => {
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanel();
    }
  });

  document.addEventListener('click', (event) => {
    if (!header) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!header.contains(target)) {
      closePanel();
    }
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closePanel());
  });
}
