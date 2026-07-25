const menu = document.getElementById('menuBtn');
const links = document.getElementById('navLinks');

menu.addEventListener('click', () => links.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => links.classList.remove('open'))
);

document.getElementById('year').textContent = new Date().getFullYear();

function startRevealAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

async function loadPortfolioData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Could not load data.json');

    const data = await response.json();

    const skillGrid = document.getElementById('skillGrid');
    skillGrid.innerHTML = data.skills.map(skill => `
      <div>
        <b>${skill.name}</b>
        <span>${skill.detail}</span>
      </div>
    `).join('');

    const projectGrid = document.getElementById('projectGrid');
    projectGrid.innerHTML = data.projects.map(project => `
      <article class="project-card reveal">
        <div class="project-visual ${project.visualClass}">${project.visual === '</>' ? '&lt;/&gt;' : project.visual}</div>
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <div class="tags">
          ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
        ${project.linkText ? `<a href="${project.link}">${project.linkText}</a>` : ''}
      </article>
    `).join('');

    startRevealAnimations();
  } catch (error) {
    console.error(error);
    document.getElementById('skillGrid').innerHTML =
      '<p class="muted">Run this portfolio using Live Server so the JSON data can load correctly.</p>';
  }
}

loadPortfolioData();

const sections = [...document.querySelectorAll('main section')];
const nav = [...document.querySelectorAll('.nav-links a')];

window.addEventListener('scroll', () => {
  let current = 'home';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 180) current = section.id;
  });
  nav.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current)
  );
});
