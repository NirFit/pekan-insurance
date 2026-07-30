// === Preloader - חייב לרוץ ראשון ובנפרד מכל השאר ===
// אם קוד אחר נכשל (למשל localStorage חסום בדפדפן נייד), האתר לא ייתקע על מסך הפתיחה.
(function () {
    function hidePreloader() {
        document.getElementById('preloader')?.classList.add('hidden');
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(hidePreloader, 1200));
    } else {
        setTimeout(hidePreloader, 1200);
    }
    window.addEventListener('load', () => setTimeout(hidePreloader, 800));
    // רשת ביטחון אחרונה - נסגר בכל מקרה
    setTimeout(hidePreloader, 3500);
})();

// === אחסון מקומי בטוח ===
// דפדפני נייד מסוימים (Safari עם חסימת עוגיות, Samsung Internet, דפדפנים מוטמעים
// באפליקציות) זורקים SecurityError בגישה ל-localStorage. בלי העטיפה הזאת שגיאה
// אחת כזאת מפילה את כל הסקריפט.
const safeStorage = {
    get(key) {
        try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
        try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
    },
    remove(key) {
        try { window.localStorage.removeItem(key); return true; } catch (e) { return false; }
    }
};

// מריץ בלוק אתחול בתוך try/catch כדי שכשל בפיצ'ר אחד לא יפיל את כל האתר
function initSafely(name, fn) {
    try {
        fn();
    } catch (err) {
        console.error('[pekan] כשל באתחול "' + name + '":', err);
    }
}

// === הסרת כפתורי קרוסלה - רץ מיד לפני DOMContentLoaded ===
(function(){ function hide(){ var s='.reviews-carousel-btn,.reviews-carousel-prev,.reviews-carousel-next,.reviews-carousel-dots,#reviewsPrev,#reviewsNext,#reviewsDots,.reviews-carousel-wrap>button'; document.querySelectorAll(s).forEach(function(el){ el.remove(); }); } hide(); if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',hide); } setTimeout(hide,100); setTimeout(hide,500); setTimeout(hide,1500); })();

document.addEventListener('DOMContentLoaded', () => {

    // === עוגיות - הסכמה והטענת GA ===
    initSafely('cookies', () => {
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

        const consent = safeStorage.get(COOKIE_KEY);
        if (!consent) {
            cookieBanner?.removeAttribute('hidden');
        } else if (consent === 'all') {
            loadGoogleAnalytics();
        }

        document.getElementById('cookieAccept')?.addEventListener('click', () => {
            safeStorage.set(COOKIE_KEY, 'all');
            loadGoogleAnalytics();
            cookieBanner?.setAttribute('hidden', '');
        });
        document.getElementById('cookieDecline')?.addEventListener('click', () => {
            safeStorage.set(COOKIE_KEY, 'essential');
            cookieBanner?.setAttribute('hidden', '');
        });
        document.getElementById('changeCookiePref')?.addEventListener('click', () => {
            safeStorage.remove(COOKIE_KEY);
            document.getElementById('privacy-policy')?.close();
            cookieBanner?.removeAttribute('hidden');
        });
    });

    // הפרילודר מטופל בראש הקובץ, מחוץ ל-DOMContentLoaded ובנפרד מכל בלוק אחר

    // === Navbar ===
    initSafely('navbar', () => {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        function updateNav() {
            if (!navbar) return;
            navbar.classList.toggle('scrolled', window.scrollY > 120);
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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu?.classList.contains('active')) closeNav();
        });

    });

    // === כפתור נגישות ===
    initSafely('a11y', () => {
        document.getElementById('a11yFloat')?.addEventListener('click', () => {
            document.getElementById('a11y-statement')?.showModal();
        });

    });

    // === Chat Bot Widget ===
    initSafely('chatbot', () => {
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

    });

    // === Smooth Scroll ===
    initSafely('smooth-scroll', () => {
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



    });

    // === Partners - הסתרת כפתור הבא, הסרת פריטים ללא תמונה ===
    initSafely('partners', () => {
        function removeCarouselButtons() {
            const sel = '.reviews-carousel-btn, .reviews-carousel-prev, .reviews-carousel-next, .reviews-carousel-dots, #reviewsPrev, #reviewsNext, #reviewsDots, .reviews-carousel-wrap > button';
            document.querySelectorAll(sel).forEach(el => el.remove());
        }
        function cleanPartnersLogos() {
            const grid = document.querySelector('.partners-logos-grid');
            if (!grid) return;
            grid.querySelectorAll('.partner-logo-item').forEach(item => {
                const img = item.querySelector('img');
                if (!img) item.remove();
                else img.addEventListener('error', () => item.remove());
            });
            removeCarouselButtons();
        }
        removeCarouselButtons();
        cleanPartnersLogos();
        window.addEventListener('load', () => {
            removeCarouselButtons();
            cleanPartnersLogos();
            document.querySelectorAll('.partners-logos-grid .partner-logo-item').forEach(item => {
                const img = item.querySelector('img');
                if (img && (img.naturalWidth === 0 || img.naturalHeight === 0)) item.remove();
            });
        });
        // MutationObserver - מחכה לכפתורים שנוספים דינמית
        const reviewsWrap = document.querySelector('.reviews-carousel-wrap');
        if (reviewsWrap) {
            const obs = new MutationObserver(() => removeCarouselButtons());
            obs.observe(reviewsWrap, { childList: true, subtree: true });
        }

    });

    // === Reviews Carousel ===
    initSafely('reviews', () => {
        const reviewsTrack = document.getElementById('reviewsTrack');
        if (reviewsTrack) {
            const cards = reviewsTrack.querySelectorAll('.review-card');
            const total = cards.length;
            let currentIndex = 0;

            function goTo(index) {
                currentIndex = (index + total) % total;
                const offset = (window.innerWidth >= 900) ? 0 : -currentIndex * 100;
                reviewsTrack.style.transform = 'translateX(' + offset + '%)';
            }

            let autoInterval = setInterval(() => goTo(currentIndex + 1), 5000);
            reviewsTrack.closest('.reviews-carousel-wrap')?.addEventListener('mouseenter', () => clearInterval(autoInterval));
            reviewsTrack.closest('.reviews-carousel-wrap')?.addEventListener('mouseleave', () => {
                autoInterval = setInterval(() => goTo(currentIndex + 1), 5000);
            });
        }

    });

    // === Reveal on Scroll ===
    initSafely('reveal', () => {
        const reveals = document.querySelectorAll('.reveal');
        const isMobile = window.innerWidth <= 768;
        const showAll = () => reveals.forEach(el => el.classList.add('visible'));

        // בלי IntersectionObserver (או אם הוא נכשל) מציגים את הכל מיד,
        // אחרת התוכן היה נשאר שקוף והאתר היה נראה ריק.
        if (typeof IntersectionObserver === 'undefined') {
            showAll();
            return;
        }
        try {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // במובייל – ללא עיכוב כדי למנוע ריקים
                        const delay = isMobile ? 0 : (parseInt(entry.target.dataset.delay, 10) || 0) * 150;
                        setTimeout(() => entry.target.classList.add('visible'), delay);
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08 });
            reveals.forEach(el => revealObserver.observe(el));
        } catch (err) {
            showAll();
        }
    });

    // === Counter Animation ===
    initSafely('counters', () => {
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
            const suffix = el.dataset.suffix || '';
            function fmt(n, addSuffix) {
                let s = formatShort && n >= 1000000 ? (n / 1000000).toFixed(0) : n.toLocaleString('he-IL');
                return s + (addSuffix ? suffix : '');
            }
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * ease);
                el.textContent = fmt(current, progress >= 1);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = fmt(target, true);
            }
            requestAnimationFrame(tick);
        }

    });

    // === FAQ Accordion ===
    initSafely('faq', () => {
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

    });

    // === Contact Form (Formspree) ===
    initSafely('contact-form', () => {
        const contactForm = document.getElementById('contactForm');
        let lastSubmitTime = 0;
        contactForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            // Honeypot check - בוטים ממלאים שדות נסתרים
            const hpField = contactForm.querySelector('input[name="website"]');
            if (hpField && hpField.value) return;

            // Rate limiting - מניעת שליחות חוזרות (30 שניות)
            const now = Date.now();
            if (now - lastSubmitTime < 30000) {
                btn.innerHTML = '<i class="fas fa-clock"></i> נא להמתין לפני שליחה נוספת';
                btn.disabled = true;
                setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; }, 3000);
                return;
            }
            lastSubmitTime = now;

            const consentCheck = document.getElementById('privacyConsent');
            if (consentCheck && !consentCheck.checked) {
                consentCheck.focus();
                consentCheck.closest('.form-consent')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            const emailInput = contactForm.querySelector('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                emailInput.setCustomValidity('נא להזין כתובת אימייל תקינה');
                emailInput.reportValidity();
                emailInput.setCustomValidity('');
                emailInput.focus();
                return;
            }

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> שולח...';
            btn.disabled = true;

            const formId = typeof CONFIG !== 'undefined' && CONFIG.FORMSPREE_ID && CONFIG.FORMSPREE_ID !== 'YOUR_FORMSPREE_ID'
                ? CONFIG.FORMSPREE_ID
                : null;

            if (formId) {
                try {
                    const formData = new FormData(contactForm);
                    // Sanitize: trim, limit length, strip HTML/script to prevent XSS
                    const sanitize = (str) => {
                        if (typeof str !== 'string') return '';
                        return str
                            .trim()
                            .replace(/<[^>]*>/g, '')
                            .replace(/javascript:/gi, '')
                            .replace(/on\w+=/gi, '')
                            .slice(0, 2000);
                    };
                    formData.delete('website'); // הסרת שדה honeypot
                    ['name', 'phone', 'email', 'branch', 'message'].forEach(field => {
                        const val = formData.get(field);
                        formData.set(field, sanitize(String(val || '')));
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
                // אין FORMSPREE_ID ב-config.js - במקום לאבד את הפנייה, שולחים אותה ב-WhatsApp
                const val = (sel) => (contactForm.querySelector(sel)?.value || '').trim();
                const lines = [
                    'פנייה חדשה מהאתר',
                    'שם: ' + (val('#name') || '-'),
                    'טלפון: ' + (val('#phone') || '-'),
                    'אימייל: ' + (val('#email') || '-'),
                    'סניף: ' + (val('#branch') || '-'),
                    'הודעה: ' + (val('#message') || '-')
                ];
                const waUrl = 'https://wa.me/972547151450?text=' + encodeURIComponent(lines.join('\n'));
                btn.innerHTML = '<i class="fab fa-whatsapp"></i> ממשיכים ב-WhatsApp...';
                if (!window.open(waUrl, '_blank', 'noopener')) window.location.href = waUrl;
                console.warn('Formspree לא מוגדר ב-config.js - הפנייה הופנתה ל-WhatsApp. הוסף FORMSPREE_ID לקבלת פניות במייל');
            }
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });

    });

    // === Particles ===
    initSafely('particles', () => {
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
});
