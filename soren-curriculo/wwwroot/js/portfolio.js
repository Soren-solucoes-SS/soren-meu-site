document.addEventListener("DOMContentLoaded", function () {
    const buttonToggle = document.querySelector(".nav-toggle");
    const divLinks = document.querySelector(".nav .links");
    const navElement = document.querySelector(".nav");
    const spanYear = document.getElementById("year");
    const spanTypewriter = document.getElementById("typewriter");

    // Atualiza o ano do rodapé
    if (spanYear) {
        spanYear.textContent = new Date().getFullYear();
    }

    // Typewriter sem quebrar páginas que não possuem o elemento
    if (spanTypewriter) {
        const fullText = spanTypewriter.textContent.trim();
        spanTypewriter.textContent = "";

        let indexCharacter = 0;

        function renderNextCharacter() {
            spanTypewriter.textContent = fullText.slice(0, indexCharacter);
            indexCharacter += 1;

            if (indexCharacter <= fullText.length) {
                requestAnimationFrame(renderNextCharacter);
            }
        }

        requestAnimationFrame(renderNextCharacter);
    }

    // Menu mobile
    if (!buttonToggle || !divLinks || !navElement) {
        return;
    }

    function closeMenu() {
        divLinks.classList.remove("open");
        navElement.classList.remove("menu-open");
        document.body.classList.remove("no-scroll");
        buttonToggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
        divLinks.classList.add("open");
        navElement.classList.add("menu-open");
        document.body.classList.add("no-scroll");
        buttonToggle.setAttribute("aria-expanded", "true");
    }

    function toggleMenu() {
        const menuIsOpen = divLinks.classList.contains("open");

        if (menuIsOpen) {
            closeMenu();
            return;
        }

        openMenu();
    }

    buttonToggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
    });

    divLinks.querySelectorAll("a").forEach(function (linkItem) {
        linkItem.addEventListener("click", function () {
            closeMenu();
        });
    });

    document.addEventListener("click", function (event) {
        const clickedInsideNav = navElement.contains(event.target);

        if (!clickedInsideNav) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 720) {
            closeMenu();
        }
    });
});
/* =========================================================================
   MODERNIZACAO 2026 - header com scrollspy, progresso de leitura e carrossel
   Listener proprio para nao depender do bloco acima, que faz return cedo
   quando a pagina nao tem menu mobile.
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Header: estado compacto + barra de progresso ---------- */
    const siteHeader = document.getElementById("site-header");
    const progressBar = document.querySelector(".read-progress span");

    function updateOnScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (siteHeader) {
            siteHeader.classList.toggle("is-scrolled", scrollTop > 8);
        }

        if (progressBar) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = scrollable > 0 ? scrollTop / scrollable : 0;
            progressBar.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
        }
    }

    let scrollTicking = false;

    window.addEventListener("scroll", function () {
        if (scrollTicking) {
            return;
        }

        scrollTicking = true;

        requestAnimationFrame(function () {
            updateOnScroll();
            scrollTicking = false;
        });
    }, { passive: true });

    updateOnScroll();

    /* ---------- Scrollspy: destaca o link da secao visivel ---------- */
    const spyLinks = Array.from(document.querySelectorAll(".nav .links a[data-spy]"));

    if (spyLinks.length > 0 && "IntersectionObserver" in window) {
        const linkBySection = new Map();
        const watchedSections = [];

        spyLinks.forEach(function (link) {
            const section = document.getElementById(link.dataset.spy);

            if (section) {
                linkBySection.set(section, link);
                watchedSections.push(section);
            }
        });

        // Guarda quanto de cada secao esta visivel e destaca sempre a maior.
        const visibleRatio = new Map();

        const spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visibleRatio.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
            });

            let bestSection = null;
            let bestRatio = 0;

            visibleRatio.forEach(function (ratio, section) {
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    bestSection = section;
                }
            });

            if (!bestSection) {
                return;
            }

            spyLinks.forEach(function (link) {
                link.classList.remove("is-active");
            });

            const activeLink = linkBySection.get(bestSection);

            if (activeLink) {
                activeLink.classList.add("is-active");
            }
        }, {
            // Desconta a altura do header para a secao so contar quando realmente aparece.
            rootMargin: "-72px 0px -45% 0px",
            threshold: [0, 0.15, 0.35, 0.6, 0.85]
        });

        watchedSections.forEach(function (section) {
            spyObserver.observe(section);
        });
    }

    /* ---------- Carrossel ---------- */
    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
        const track = carousel.querySelector(".carousel-track");
        const previousButton = carousel.querySelector("[data-carousel-prev]");
        const nextButton = carousel.querySelector("[data-carousel-next]");
        const dotsContainer = carousel.querySelector(".carousel-dots");
        const slides = Array.from(track ? track.children : []);

        if (!track || slides.length === 0) {
            return;
        }

        // O scroll suave nativo nao anima neste container (scroll-snap + grid),
        // entao a animacao e feita na mao escrevendo scrollLeft quadro a quadro.
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let scrollAnimationId = null;

        function scrollTrackTo(targetLeft) {
            const maxLeft = track.scrollWidth - track.clientWidth;
            const destination = Math.min(maxLeft, Math.max(0, targetLeft));

            if (scrollAnimationId !== null) {
                cancelAnimationFrame(scrollAnimationId);
                scrollAnimationId = null;
            }

            // Aba oculta nao executa requestAnimationFrame: salta direto para o destino.
            if (prefersReducedMotion || document.hidden) {
                track.scrollLeft = destination;
                syncControls();
                return;
            }

            const startLeft = track.scrollLeft;
            const distance = destination - startLeft;

            if (Math.abs(distance) < 1) {
                return;
            }

            const duration = 360;
            const startTime = performance.now();

            function step(now) {
                const progress = Math.min(1, (now - startTime) / duration);
                // easeOutCubic
                const eased = 1 - Math.pow(1 - progress, 3);

                track.scrollLeft = startLeft + distance * eased;

                if (progress < 1) {
                    scrollAnimationId = requestAnimationFrame(step);
                    return;
                }

                scrollAnimationId = null;
                syncControls();
            }

            scrollAnimationId = requestAnimationFrame(step);
        }

        // Um ponto por slide, cada um navegando direto para o seu.
        const dots = slides.map(function (slide, index) {
            if (!dotsContainer) {
                return null;
            }

            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Ir para a foto " + (index + 1) + " de " + slides.length);

            dot.addEventListener("click", function () {
                scrollTrackTo(slide.offsetLeft - track.offsetLeft);
            });


            dotsContainer.appendChild(dot);
            return dot;
        });

        function slideOffset(index) {
            return slides[index].offsetLeft - track.offsetLeft;
        }

        function currentIndex() {
            // O slide ativo e o primeiro visivel na borda esquerda: navegar avanca
            // de um em um e continua funcionando no fim do trilho, onde o scroll
            // para antes do ultimo slide alcancar o centro.
            const left = track.scrollLeft;
            let closest = 0;
            let smallestDistance = Infinity;

            slides.forEach(function (slide, index) {
                const distance = Math.abs(slideOffset(index) - left);

                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closest = index;
                }
            });

            return closest;
        }

        function syncControls() {
            const index = currentIndex();

            dots.forEach(function (dot, dotIndex) {
                if (dot) {
                    dot.classList.toggle("is-active", dotIndex === index);
                }
            });

            const atStart = track.scrollLeft <= 1;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;

            if (previousButton) {
                previousButton.disabled = atStart;
                previousButton.style.opacity = atStart ? ".4" : "";
            }

            if (nextButton) {
                nextButton.disabled = atEnd;
                nextButton.style.opacity = atEnd ? ".4" : "";
            }
        }

        function goTo(offset) {
            const maxLeft = track.scrollWidth - track.clientWidth;
            let index = currentIndex();

            // No fim do trilho varios slides compartilham a mesma posicao de scroll,
            // entao anda ate achar um destino que realmente mude o scroll.
            while (index + offset >= 0 && index + offset < slides.length) {
                index += offset;

                const destination = Math.min(maxLeft, Math.max(0, slideOffset(index)));

                if (Math.abs(destination - track.scrollLeft) >= 1) {
                    scrollTrackTo(destination);
                    return;
                }
            }
        }

        if (previousButton) {
            previousButton.addEventListener("click", function () {
                goTo(-1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                goTo(1);
            });
        }

        // Setas do teclado quando o carrossel esta focado.
        track.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(1);
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(-1);
            }
        });

        let carouselTicking = false;

        track.addEventListener("scroll", function () {
            if (carouselTicking) {
                return;
            }

            carouselTicking = true;

            requestAnimationFrame(function () {
                syncControls();
                carouselTicking = false;
            });
        }, { passive: true });

        window.addEventListener("resize", syncControls);
        syncControls();
    });
});

/* =========================================================================
   Cards de projeto: "Ler mais" em acordeao, um aberto por vez
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const projectCards = Array.from(document.querySelectorAll("[data-project]"));

    if (projectCards.length === 0) {
        return;
    }

    function closeCard(card) {
        const toggle = card.querySelector(".project-toggle");
        const more = card.querySelector(".project-more");
        const label = card.querySelector(".project-toggle-label");

        if (!toggle || !more) {
            return;
        }

        more.hidden = true;
        card.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");

        if (label) {
            label.textContent = "Ler mais";
        }
    }

    function openCard(card) {
        // Um por vez: fecha os outros antes de abrir este.
        projectCards.forEach(function (other) {
            if (other !== card) {
                closeCard(other);
            }
        });

        const toggle = card.querySelector(".project-toggle");
        const more = card.querySelector(".project-more");
        const label = card.querySelector(".project-toggle-label");

        if (!toggle || !more) {
            return;
        }

        more.hidden = false;
        card.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");

        if (label) {
            label.textContent = "Ler menos";
        }
    }

    projectCards.forEach(function (card) {
        const toggle = card.querySelector(".project-toggle");

        if (!toggle) {
            return;
        }

        toggle.addEventListener("click", function () {
            const isOpen = card.classList.contains("is-open");

            if (isOpen) {
                closeCard(card);
                return;
            }

            openCard(card);

            // Se o card subiu para fora da tela ao fechar os outros, traz de volta.
            const top = card.getBoundingClientRect().top;

            if (top < 72) {
                window.scrollBy({ top: top - 88, behavior: "smooth" });
            }
        });
    });
});
