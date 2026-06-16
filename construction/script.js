/* ============================================
   КУБАНЬСТРОЙ — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Navbar ---------- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* ---------- Mobile menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    /* ---------- Reveal on scroll ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ---------- Project filters ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });

    /* ---------- Calculator ---------- */
    const areaRange = document.getElementById('areaRange');
    const areaValue = document.getElementById('areaValue');
    const techRadios = document.querySelectorAll('input[name="tech"]');
    const floorsSelect = document.getElementById('floors');
    const totalPrice = document.getElementById('totalPrice');
    const calcForm = document.getElementById('calcForm');

    function formatPrice(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
    }

    function recalc() {
        const area = +areaRange.value;
        const price = +document.querySelector('input[name="tech"]:checked').value;
        const floors = +floorsSelect.value;
        const total = Math.round(area * price * floors);
        areaValue.textContent = area;
        totalPrice.textContent = formatPrice(total);
    }

    if (areaRange) {
        areaRange.addEventListener('input', recalc);
        techRadios.forEach(r => r.addEventListener('change', recalc));
        floorsSelect.addEventListener('change', recalc);
        recalc();

        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const success = document.getElementById('calcSuccess');
            success.classList.add('show');
            const btn = calcForm.querySelector('button[type="submit"]');
            btn.textContent = '✓ Заявка отправлена';
            setTimeout(() => calcForm.reset(), 800);
            setTimeout(recalc, 900);
        });
    }

    /* ---------- Smooth scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    const offset = 70;
                    const pos = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            }
        });
    });

});
