/* ============================================
   DENTALUX — Interactions
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

    /* ---------- Prices tabs ---------- */
    const tabs = document.querySelectorAll('.price-tab');
    const tables = document.querySelectorAll('.price-table');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tables.forEach(table => table.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.price-table[data-table="${target}"]`).classList.add('active');
        });
    });

    /* ---------- Appointment form ---------- */
    const form = document.getElementById('appointmentForm');
    if (form) {
        const dateInput = document.getElementById('apptDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const success = document.getElementById('apptSuccess');
            success.classList.add('show');
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = '✓ Заявка отправлена';
            setTimeout(() => form.reset(), 800);
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
