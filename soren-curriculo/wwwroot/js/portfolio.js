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

// Copiar código da credencial
// === Copiar código da credencial (delegation + fallback) ===
(function () {
    async function copyText(text) {
        // usa Clipboard API se disponível e site em HTTPS
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.copy-btn[data-copy]');
        if (!btn) return;

        const sel = btn.getAttribute('data-copy');
        const el = document.querySelector(sel);
        if (!el) return;

        const text = (btn.dataset.value ?? el.textContent).trim();

        const oldText = btn.textContent;
        try {
            await copyText(text);

            // feedback visual
            btn.classList.add('copied');
            btn.textContent = 'Copiado!';

            // comportamento opcional: esconder por 2s
            if (btn.dataset.behavior === 'hide') {
                btn.classList.add('hidden');
                setTimeout(() => {
                    btn.classList.remove('hidden', 'copied');
                    btn.textContent = oldText;
                }, 2000);
            } else {
                // voltar ao normal em 1.5s
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.textContent = oldText;
                }, 1500);
            }
        } catch (err) {
            btn.textContent = 'Erro :(';
            setTimeout(() => (btn.textContent = oldText), 1500);
        }
    });
})();

