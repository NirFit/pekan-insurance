document.addEventListener('DOMContentLoaded', () => {

    // === עוגיות - הסכמה והטענת GA ===
    const COOKIE_KEY = 'pekan_cookie_consent';
    const cookieBanner = document.getElementById('cookieBanner');

    function loadGoogleAnalytics() {
        if (typeof CONFIG !== 'undefined' && CONFIG.GA_ID && CONFIG.GA_ID !== '') {
            const s = document.createElement('script');
            s.async = 1;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA_ID;
            document.head.appendChild(s);
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', CONFIG.GA_ID);
        }
    }

    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
        cookieBanner?.removeAttribute('hidden');
    } else if (consent === 'all') {
        loadGoogleAnalytics();
    }

    document.getElementById('cookieAccept')?.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'all');
        loadGoogleAnalytics();
        cookieBanner?.setAttribute('hidden', '');
    });
    document.getElementById('cookieDecline')?.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'essential');
        cookieBanner?.setAttribute('hidden', '');
    });
    document.getElementById('changeCookiePref')?.addEventListener('click', () => {
        localStorage.removeItem(COOKIE_KEY);
        document.getElementById('privacy-policy')?.close();
        cookieBanner?.removeAttribute('hidden');
    });

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader?.classList.add('hidden'), 2000);
    });
    setTimeout(() => preloader?.classList.add('hidden'), 3500);

    // === Navbar ===
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    function updateNav() {
        if (window.scrollY > 120) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNav);
    updateNav();

    const navOverlay = document.getElementById('navOverlay');
    function closeNav() {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        navOverlay?.classList.remove('active');
        document.body.style.overflow = '';
        navToggle?.setAttribute('aria-expanded', 'false');
    }
    navToggle?.addEventListener('click', () => {
        const isOpen = navMenu?.classList.toggle('active');
        navToggle?.classList.toggle('active', isOpen);
        navOverlay?.classList.toggle('active', isOpen);
        navToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navOverlay?.addEventListener('click', closeNav);
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => closeNav());
    });

    // === כפתור נגישות ===
    document.getElementById('a11yFloat')?.addEventListener('click', () => {
        document.getElementById('a11y-statement')?.showModal();
    });

    // === Chat Bot Widget ===
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotTrigger = document.getElementById('chatbotTrigger');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotClose = document.getElementById('chatbotClose');

    function openChatbot() {
        chatbotWidget?.classList.add('open');
        chatbotPanel?.setAttribute('aria-hidden', 'false');
        chatbotTrigger?.setAttribute('aria-expanded', 'true');
    }
    function closeChatbot() {
        chatbotWidget?.classList.remove('open');
        chatbotPanel?.setAttribute('aria-hidden', 'true');
        chatbotTrigger?.setAttribute('aria-expanded', 'false');
    }

    chatbotTrigger?.addEventListener('click', () => {
        if (chatbotWidget?.classList.contains('open')) closeChatbot();
        else openChatbot();
    });
    chatbotClose?.addEventListener('click', closeChatbot);

    document.addEventListener('click', (e) => {
        if (chatbotWidget?.classList.contains('open') && !chatbotWidget.contains(e.target)) {
            closeChatbot();
        }
    });

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            e.preventDefault();
            if (href === '#a11y-statement') {
                document.getElementById('a11y-statement')?.showModal();
                return;
            }
            if (href === '#privacy-policy') {
                document.getElementById('privacy-policy')?.showModal();
                return;
            }
            if (href === '#' || href === '') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(href);
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // === Reveal on Scroll ===
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = (parseInt(entry.target.dataset.delay, 10) || 0) * 150;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => revealObserver.observe(el));

    // === Counter Animation ===
    const counters = document.querySelectorAll('[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.target, 10) || 0);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el, target) {
        if (!Number.isFinite(target) || target < 0) return;
        const duration = 2200;
        const start = performance.now();
        const formatShort = el.dataset.format === 'short';
        function fmt(n) {
            if (formatShort && n >= 1000000) return (n / 1000000).toFixed(0);
            return n.toLocaleString('he-IL');
        }
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = fmt(Math.floor(target * ease));
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = fmt(target);
        }
        requestAnimationFrame(tick);
    }

    // === FAQ Accordion ===
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item?.querySelector('.faq-answer');
            const isOpen = item?.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                openItem.classList.remove('active');
                const ans = openItem.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = '0';
                const q = openItem.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen && answer) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // === Contact Form (Formspree) ===
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> שולח...';
        btn.disabled = true;

        const formId = typeof CONFIG !== 'undefined' && CONFIG.FORMSPREE_ID && CONFIG.FORMSPREE_ID !== 'YOUR_FORMSPREE_ID'
            ? CONFIG.FORMSPREE_ID
            : null;

        const consentCheck = document.getElementById('privacyConsent');
        if (consentCheck && !consentCheck.checked) {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            return;
        }

        if (formId) {
            try {
                const formData = new FormData(contactForm);
                // Sanitize: trim and limit length to prevent abuse
                ['name', 'phone', 'email', 'branch', 'message'].forEach(field => {
                    const val = formData.get(field);
                    if (typeof val === 'string') formData.set(field, val.trim().slice(0, 2000));
                });
                const res = await fetch(`https://formspree.io/f/${formId}`, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    btn.innerHTML = '<i class="fas fa-check"></i> נשלח בהצלחה!';
                    btn.style.background = 'linear-gradient(135deg, #c0c0c0, #909090)';
                    contactForm.reset();
                } else {
                    throw new Error('שגיאה בשליחה');
                }
            } catch (err) {
                btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> שגיאה - נסה שוב';
                btn.style.background = 'linear-gradient(135deg, #606060, #404040)';
            }
        } else {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> טופס לא מוגדר';
            btn.style.background = 'linear-gradient(135deg, #909090, #606060)';
            console.warn('Formspree לא מוגדר ב-config.js - הוסף FORMSPREE_ID לקבלת פניות');
        }
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });

    // === Particles ===
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(192, 192, 192, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(192, 192, 192, ${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }
});
