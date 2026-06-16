/* ============================================
   FORGE FITNESS — Interactions
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

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.dataset.target;
                const duration = 1600;
                const start = performance.now();
                const animate = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target).toLocaleString('ru-RU');
                    if (progress < 1) requestAnimationFrame(animate);
                    else el.textContent = target.toLocaleString('ru-RU');
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    /* ---------- Trial form ---------- */
    const form = document.getElementById('appointmentForm');
    if (form) {
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

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

    /* ---------- Highlight current day in schedule ---------- */
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const todayIdx = new Date().getDay();
    const todayLabel = days[todayIdx];
    const ths = document.querySelectorAll('.schedule-table thead th');
    ths.forEach(th => {
        if (th.textContent.trim() === todayLabel) {
            th.style.color = '#fff';
            th.style.background = 'var(--ember)';
        }
    });

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
