/* ============================================
   TRATTORIA DEL SOLE — Interactions
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
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(animate);
                    else el.textContent = target;
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    /* ---------- Menu filters ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            menuItems.forEach(item => {
                const show = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('hidden', !show);
            });
        });
    });

    /* ---------- Reviews carousel ---------- */
    const track = document.getElementById('reviewsTrack');
    const cards = track ? track.children.length : 0;
    const dotsContainer = document.getElementById('reviewDots');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    let current = 0;

    if (track) {
        // Create dots
        for (let i = 0; i < cards; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.dot');

        function goTo(index) {
            current = (index + cards) % cards;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        // Auto-play
        let autoplay = setInterval(() => goTo(current + 1), 6000);

        // Pause on hover
        const carousel = document.querySelector('.reviews-carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
        carousel.addEventListener('mouseleave', () => {
            autoplay = setInterval(() => goTo(current + 1), 6000);
        });
    }

    /* ---------- Reservation form ---------- */
    const form = document.getElementById('reservationForm');
    if (form) {
        // Set min date to today
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

    /* ---------- Newsletter ---------- */
    const newsletter = document.getElementById('newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletter.querySelector('input');
            const btn = newsletter.querySelector('button');
            btn.textContent = '✓';
            input.value = '';
            input.placeholder = 'Спасибо за подписку!';
            setTimeout(() => {
                btn.textContent = '→';
                input.placeholder = 'email@example.com';
            }, 3000);
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
