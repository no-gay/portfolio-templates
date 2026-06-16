/* ============================================
   АВТОПРОФ — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Navbar scroll ---------- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    /* ---------- Mobile menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
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

    /* ---------- Appointment form ---------- */
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const success = document.getElementById('formSuccess');
            success.classList.add('show');
            form.querySelector('button[type="submit"]').textContent = '✓ Заявка отправлена';
            setTimeout(() => {
                form.reset();
            }, 800);
        });
    }

    /* ---------- Smooth anchor links (with offset) ---------- */
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
