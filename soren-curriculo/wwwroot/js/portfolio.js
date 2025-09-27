// Ano automático no rodapé
document.getElementById('year').textContent = new Date().getFullYear();


// Efeito leve de "typewriter" (sem dependências)
const tw = document.getElementById('typewriter');
const full = tw.textContent.trim();
tw.textContent = '';
let i = 0;
const tick = () => {
    tw.textContent = full.slice(0, i++);
    if (i <= full.length) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);


// Exemplo: como adicionar artigos via JS (opcional)
// Basta empurrar um objeto neste array e chamar renderArticles()
const extraArticles = [
    // { title: 'Meu artigo novo', meta: '2025 — Plataforma X', url: 'https://...' }
];
function renderArticles() {
    if (!extraArticles.length) return;
    const list = document.getElementById('articles-list');
    extraArticles.forEach(a => {
        const item = document.createElement('div');
        item.className = 'article';
        item.innerHTML = `
<div>
<div class="title">${a.title}</div>
<div class="meta">${a.meta}</div>
</div>
<a class="btn secondary" href="${a.url}" target="_blank" rel="noopener">Ler</a>
`;
        list.appendChild(item);
    });
}
renderArticles();

(function () {
    const btn = document.querySelector('.nav-toggle');
    const links = document.getElementById('main-links');
    if (!btn || !links) return;

    const closeOnNav = (e) => {
        if (e.target.closest('a')) {
            links.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    };

    btn.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('no-scroll', isOpen);
    });

    links.addEventListener('click', closeOnNav);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 920) {
            links.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    });
})();

