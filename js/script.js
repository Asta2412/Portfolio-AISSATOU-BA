// =========================================
// MENU MOBILE
// =========================================

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav a");

function closeMenu() {
    if (!nav) return;
    nav.classList.remove("active");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });
}

// Fermer le menu après un clic sur un lien, avec la touche Échap
// ou en cliquant en dehors du menu
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", (event) => {
    if (nav && menuToggle && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
    }
});


// =========================================
// ANIMATION AU SCROLL (apparition échelonnée)
// =========================================

const revealElements = document.querySelectorAll(".reveal");

// Petit décalage entre les cartes d'une même grille
revealElements.forEach((element) => {
    const siblings = element.parentElement
        ? [...element.parentElement.children].filter((el) => el.classList.contains("reveal"))
        : [];
    const index = siblings.indexOf(element);
    if (index > 0) {
        element.style.transitionDelay = `${Math.min(index, 4) * 0.12}s`;
    }
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));


// =========================================
// LIEN DU MENU ACTIF SELON LA SECTION
// =========================================

const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            }
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));


// =========================================
// ANNÉE AUTOMATIQUE
// =========================================

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();


// =========================================
// HEADER AU SCROLL
// =========================================

const header = document.getElementById("header");

function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();


// =========================================
// BARRE DE PROGRESSION DU SCROLL
// =========================================

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();


// =========================================
// BOUTON "RETOUR EN HAUT"
// =========================================

const toTop = document.createElement("button");
toTop.className = "back-to-top";
toTop.type = "button";
toTop.setAttribute("aria-label", "Retour en haut de la page");
toTop.textContent = "↑";
document.body.appendChild(toTop);

toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener(
    "scroll",
    () => toTop.classList.toggle("show", window.scrollY > 600),
    { passive: true }
);


// =========================================
// LUEUR QUI SUIT LA SOURIS SUR LES CARTES
// =========================================

const glowCards = document.querySelectorAll(
    ".skill-card, .project-card, .highlight-card, .experience-card"
);

glowCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
});


// =========================================
// TEXTE QUI S'ÉCRIT TOUT SEUL (ACCUEIL)
// Le JS crée la ligne : aucune modification du HTML nécessaire
// =========================================

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const typedRoles = [
    "Webmaster",
    "Intégratrice Web",
    "Community Manager",
    "Créatrice de contenus"
];

const heroTitle = document.querySelector(".hero h2");

if (heroTitle) {

    const typedLine = document.createElement("p");
    typedLine.className = "typed-line";
    typedLine.setAttribute("aria-hidden", "true"); // le h2 porte déjà l'information
    typedLine.innerHTML =
        '<span class="typed-prefix">&gt; </span>' +
        '<span class="typed-text"></span>' +
        '<span class="typed-cursor"></span>';

    heroTitle.insertAdjacentElement("afterend", typedLine);

    const typedText = typedLine.querySelector(".typed-text");

    if (prefersReducedMotion) {

        typedText.textContent = typedRoles[0];

    } else {

        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const typeStep = () => {

            const word = typedRoles[roleIndex];

            charIndex += deleting ? -1 : 1;
            typedText.textContent = word.slice(0, charIndex);

            let delay = deleting ? 45 : 85;

            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 1600;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % typedRoles.length;
                delay = 400;
            }

            setTimeout(typeStep, delay);

        };

        setTimeout(typeStep, 600);

    }

}


// =========================================
// CHIFFRES QUI S'INCRÉMENTENT (RÉSULTATS SONAGOO)
// Détecte les nombres du type "4,4K" dans .project-result
// =========================================

const resultBlocks = document.querySelectorAll(".project-result");

resultBlocks.forEach((block) => {

    // Entoure chaque nombre suivi de K d'un <span class="count">
    block.innerHTML = block.innerHTML.replace(
        /(\d+(?:[.,]\d+)?)K/g,
        (match, number) => {
            const value = parseFloat(number.replace(",", "."));
            const decimals = /[.,]/.test(number) ? number.split(/[.,]/)[1].length : 0;
            return `<span class="count" data-value="${value}" data-decimals="${decimals}">${number}</span>K`;
        }
    );

    if (prefersReducedMotion) return;

    const counters = block.querySelectorAll(".count");

    counters.forEach((counter) => {
        counter.textContent = (0).toFixed(Number(counter.dataset.decimals)).replace(".", ",");
    });

    const countObserver = new IntersectionObserver(
        (entries, obs) => {

            if (!entries[0].isIntersecting) return;

            counters.forEach((counter) => {

                const target = Number(counter.dataset.value);
                const decimals = Number(counter.dataset.decimals);
                const duration = 1800;
                const start = performance.now();

                const update = (now) => {

                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ralentit à la fin
                    const current = target * eased;

                    counter.textContent = current.toFixed(decimals).replace(".", ",");

                    if (progress < 1) requestAnimationFrame(update);

                };

                requestAnimationFrame(update);

            });

            obs.disconnect();

        },
        { threshold: 0.4 }
    );

    countObserver.observe(block);

});
