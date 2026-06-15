// Load a section HTML file into a placeholder element
async function loadSection(id, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// Boot: load all sections then init interactions
Promise.all([
  loadSection('s-navbar',   'sections/navbar.html'),
  loadSection('s-hero',     'sections/hero.html'),
  loadSection('s-brands',   'sections/brands.html'),
  loadSection('s-work',     'sections/work.html'),
  loadSection('s-services', 'sections/services.html'),
  loadSection('s-team',     'sections/team.html'),
  loadSection('s-contact',  'sections/contact.html'),
  loadSection('s-footer',   'sections/footer.html'),
]).then(() => {
  initNavScroll();
  initWorkTabs();
  initHamburger();
  initTaglineAnimation();
  initWorkAccordion();
});

function initNavScroll() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (pageYOffset >= s.offsetTop - 150) current = s.id;
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href')?.slice(1) === current);
    });
  });
}

function initTaglineAnimation() {
  var labels = ['🍔 Food', '🏥 Healthcare', '☕ Café', '💄 Beauty', '📚 Education'];
  var el = document.querySelector('.hero-tagline .emoji');
  if (!el) return;
  var i = 0;
  setInterval(function () {
    i = (i + 1) % labels.length;
    el.classList.add('tagline-fade');
    setTimeout(function () {
      el.textContent = labels[i];
      el.classList.remove('tagline-fade');
    }, 250);
  }, 2200);
}

function initWorkAccordion() {
  if (window.innerWidth > 768) return;
  var labels = {
    medical:    '🏥 Healthcare',
    restaurant: '🍽️ Restaurant',
    beauty:     '💄 Beauty',
    education:  '📚 Education',
    cafe:       '☕ Café'
  };
  document.querySelectorAll('.work-content').forEach(function (panel) {
    var key = panel.getAttribute('data-tab-panel');
    var hdr = document.createElement('div');
    hdr.className = 'work-acc-hdr';
    hdr.innerHTML = '<span>' + (labels[key] || key) + '</span><span class="work-acc-arrow">+</span>';
    panel.insertBefore(hdr, panel.firstChild);
    hdr.addEventListener('click', function () {
      var isOpen = panel.classList.contains('work-acc-open');
      document.querySelectorAll('.work-content').forEach(function (p) {
        p.classList.remove('work-acc-open');
      });
      if (!isOpen) panel.classList.add('work-acc-open');
    });
  });
}

function initHamburger() {
  var hamburger = document.querySelector('.nav-hamburger');
  var navbar = document.querySelector('.navbar');
  if (!hamburger || !navbar) return;
  hamburger.addEventListener('click', function () {
    var open = navbar.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-item, .nav-dropdown-item').forEach(function (item) {
    item.addEventListener('click', function () {
      navbar.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

function initWorkTabs() {
  // Top-level industry tabs
  document.querySelectorAll('.work-tab[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const t = tab.dataset.tab;
      document.querySelectorAll('.work-tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.work-content').forEach(x => x.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.work-content[data-tab-panel="${t}"]`)?.classList.add('active');
    });
  });

  // Sub-tabs inside each industry panel
  document.querySelectorAll('.work-menu-item[data-sub-tab]').forEach(st => {
    st.addEventListener('click', () => {
      const t = st.dataset.subTab;
      const panel = st.closest('.work-content');
      panel.querySelectorAll('.work-menu-item[data-sub-tab]').forEach(x => x.classList.remove('active'));
      panel.querySelectorAll('.work-sub-panel').forEach(x => x.classList.remove('active'));
      st.classList.add('active');
      panel.querySelector(`.work-sub-panel[data-sub-panel="${t}"]`)?.classList.add('active');
    });
  });
}
