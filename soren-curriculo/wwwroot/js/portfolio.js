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