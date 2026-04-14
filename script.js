/* ============================================================
   MR - Circle Law | Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Particles Background ── */
    (function initParticles() {
        const bg = document.getElementById('particlesBg');
        if (!bg) return;
        const count = 28;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const duration = Math.random() * 18 + 12;
            const delay = Math.random() * 15;
            p.style.cssText = `
                width:${size}px;height:${size}px;
                left:${x}%;
                animation-duration:${duration}s;
                animation-delay:-${delay}s;
                opacity:${Math.random() * 0.4 + 0.1};
            `;
            bg.appendChild(p);
        }
    })();

    /* ── Header Scroll Effect ── */
    const header = document.getElementById('mainHeader');
    const backToTop = document.getElementById('backToTop');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Scrolled class
        if (scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        // Back to Top visibility
        if (scrollY > 400) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');

        // Hide/show header on scroll direction
        if (scrollY > lastScroll && scrollY > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = scrollY;
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── Mobile Menu ── */
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    let menuOpen = false;

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            navMenu.classList.toggle('open', menuOpen);
            mobileToggle.classList.toggle('open', menuOpen);
            document.body.style.overflow = menuOpen ? 'hidden' : '';
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (menuOpen && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                menuOpen = false;
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    /* ── Theme Toggle ── */
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('cl-theme') || 'dark';

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('cl-theme', theme);
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = body.classList.contains('light-mode') ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    /* ── Ramadan Banner ── */
    const ramadanBanner = document.getElementById('ramadanBanner');
    const closeRamadan = document.getElementById('closeRamadanBanner');
    const ramadanDismissed = sessionStorage.getItem('ramadanDismissed');

    if (ramadanBanner && ramadanDismissed) {
        ramadanBanner.style.display = 'none';
    }

    if (closeRamadan && ramadanBanner) {
        closeRamadan.addEventListener('click', () => {
            ramadanBanner.style.transition = 'all 0.5s ease';
            ramadanBanner.style.maxHeight = ramadanBanner.offsetHeight + 'px';
            requestAnimationFrame(() => {
                ramadanBanner.style.maxHeight = '0';
                ramadanBanner.style.opacity = '0';
                ramadanBanner.style.overflow = 'hidden';
                ramadanBanner.style.borderBottomWidth = '0';
                setTimeout(() => {
                    ramadanBanner.style.display = 'none';
                    sessionStorage.setItem('ramadanDismissed', '1');
                }, 500);
            });
        });
    }

    /* ── Pro Notification ── */
    const proBox = document.getElementById('proNotificationBox');
    const closeProBtn = document.getElementById('closeProNotification');
    const proDismissed = sessionStorage.getItem('proDismissed');

    if (proBox && proDismissed) proBox.classList.add('hidden');

    if (closeProBtn && proBox) {
        closeProBtn.addEventListener('click', () => {
            proBox.style.transition = 'all 0.4s ease';
            proBox.style.opacity = '0';
            proBox.style.transform = 'translateY(20px)';
            setTimeout(() => {
                proBox.classList.add('hidden');
                sessionStorage.setItem('proDismissed', '1');
            }, 400);
        });
    }

    /* ── Animated Stats Counter ── */
    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(start).toLocaleString('ar');
        }, 16);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nums = entry.target.querySelectorAll('.stat-number');
                nums.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target')) || 0;
                    animateCounter(num, target, 2200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    /* ── Feature Cards Scroll Animation ── */
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.feature-card').forEach(card => {
        cardObserver.observe(card);
    });

    /* ── Quote Section Parallax-like entrance ── */
    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                quoteObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const quoteWrapper = document.querySelector('.quote-wrapper');
    if (quoteWrapper) {
        quoteWrapper.style.opacity = '0';
        quoteWrapper.style.transform = 'translateY(30px)';
        quoteObserver.observe(quoteWrapper);
    }

    /* ── Smooth active nav link on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ── Mouse Parallax on Hero Orbs ── */
    const heroOrbs = document.querySelectorAll('.orb');
    const heroSection = document.getElementById('heroSection');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const cx = (e.clientX - rect.left) / rect.width - 0.5;
            const cy = (e.clientY - rect.top) / rect.height - 0.5;

            heroOrbs.forEach((orb, i) => {
                const factor = (i + 1) * 20;
                orb.style.transform = `translate(${cx * factor}px, ${cy * factor}px) scale(1)`;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            heroOrbs.forEach(orb => orb.style.transform = '');
        });
    }

    /* ── Ripple Effect on Buttons ── */
    document.querySelectorAll('.btn, .pro-btn, .feature-link').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            ripple.style.cssText = `
                position:absolute;
                width:${size}px;height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                border-radius:50%;
                background:rgba(255,255,255,0.2);
                transform:scale(0);
                animation:rippleAnim 0.6s ease-out forwards;
                pointer-events:none;
                z-index:10;
            `;
            const style = document.createElement('style');
            style.textContent = '@keyframes rippleAnim{to{transform:scale(1);opacity:0}}';
            document.head.appendChild(style);
            const pos = this.style.position;
            if (!pos || pos === 'static') this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ── Typing Effect on Hero Tagline (optional subtle) ── */
    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) {
        heroDesc.style.opacity = '0';
        heroDesc.style.animation = 'fadeInUp 0.8s 0.5s ease forwards';
    }

    /* ── Gold glow trail on hero ── */
    if (heroSection) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position:absolute;
            width:200px;height:200px;
            border-radius:50%;
            background:radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%);
            pointer-events:none;
            transition:transform 0.1s ease;
            z-index:1;
            transform:translate(-50%,-50%);
        `;
        heroSection.style.position = 'relative';
        heroSection.appendChild(glow);

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            glow.style.left = (e.clientX - rect.left) + 'px';
            glow.style.top = (e.clientY - rect.top) + 'px';
        });
    }

    /* ── Footer Animate ── */
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sections = entry.target.querySelectorAll('.footer-section');
                sections.forEach((s, i) => {
                    s.style.opacity = '0';
                    s.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        s.style.transition = 'all 0.5s ease';
                        s.style.opacity = '1';
                        s.style.transform = 'translateY(0)';
                    }, i * 120);
                });
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    

    const footerContent = document.querySelector('.footer-content');
    if (footerContent) footerObserver.observe(footerContent);

    console.log('%c⚖️ MR - Circle Law', 'color:#c9a84c;font-size:18px;font-weight:bold;');
    console.log('%cمنصتك القانونية المتكاملة', 'color:#888;font-size:12px;');
});
/**
 * MR - Circle Law Global Script
 * هذا الملف يحتوي على جميع الوظائف التشغيلية للموقع
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initNotificationBanner();
    initMrAssistant();
    initPdfViewer();
    initScrollEffects();
});

// 1. القائمة الجانبية للهاتف
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
        });
    }
}

// 2. إشعار الشريعة الإسلامية
function initNotificationBanner() {
    const notifBanner = document.getElementById('notificationBanner');
    const closeNotif = document.getElementById('closeNotification');
    const pageHeader = document.getElementById('pageHeaderSimple');
    
    if (!notifBanner) return;

    // التحقق مما إذا كان المستخدم قد أغلق الإشعار مسبقاً في هذه الجلسة
    if (sessionStorage.getItem('shariaNotifDismissed') === 'true') {
        notifBanner.style.display = 'none';
        if(pageHeader) pageHeader.style.marginTop = 'var(--header-height, 75px)';
    }

    if (closeNotif) {
        closeNotif.addEventListener('click', () => {
            notifBanner.style.height = notifBanner.offsetHeight + 'px';
            notifBanner.style.padding = '0';
            notifBanner.style.border = 'none';
            setTimeout(() => {
                notifBanner.style.height = '0';
                notifBanner.style.opacity = '0';
                setTimeout(() => {
                    notifBanner.style.display = 'none';
                    if(pageHeader) pageHeader.style.marginTop = 'var(--header-height, 75px)';
                    sessionStorage.setItem('shariaNotifDismissed', 'true');
                }, 400);
            }, 10);
        });
    }
}

// 3. المساعد الذكي (MR Assistant)
function initMrAssistant() {
    const mrBtn = document.getElementById('mrAssistantBtn');
    const mrMenu = document.getElementById('mrAssistantMenu');
    const mrClose = document.getElementById('mrCloseBtn');

    if(!mrBtn || !mrMenu) return;

    mrBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mrMenu.classList.toggle('active');
        const badge = mrBtn.querySelector('.mr-btn-badge');
        if(badge) badge.style.display = 'none';
    });

    if(mrClose) {
        mrClose.addEventListener('click', () => {
            mrMenu.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (mrMenu.classList.contains('active') && !mrMenu.contains(e.target) && !mrBtn.contains(e.target)) {
            mrMenu.classList.remove('active');
        }
    });
}

// 4. عارض الـ PDF والتحكم به
function initPdfViewer() {
    const fsBtn = document.getElementById('fullscreenBtn');
    const viewerWrap = document.getElementById('viewerWrap');

    if(fsBtn && viewerWrap) {
        fsBtn.addEventListener('click', () => {
            const isFS = viewerWrap.classList.toggle('is-fullscreen');
            fsBtn.innerHTML = isFS ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
            document.body.style.overflow = isFS ? 'hidden' : ''; 
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && viewerWrap.classList.contains('is-fullscreen')) {
                viewerWrap.classList.remove('is-fullscreen');
                fsBtn.innerHTML = '<i class="fas fa-expand"></i>';
                document.body.style.overflow = '';
            }
        });
    }
}

// وظيفة إخفاء اللودر عند تحميل الـ PDF
function handlePdfLoad() {
    const loader = document.getElementById('viewerLoader');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// 5. تأثيرات التمرير (Scroll) والعودة للأعلى
function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        if(backToTop) {
            if (window.scrollY > 400) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
        if(header) {
            if (window.scrollY > 50) header.classList.add('scrolled'); 
            else header.classList.remove('scrolled');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// وظيفة نسخ الرابط (عالمية)
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const toast = document.getElementById('copyToast');
        if(toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    /* ── Particles Background Logic ── */
    const bg = document.getElementById('particlesBg');
    if (bg) {
        const count = 25;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;
            p.style.cssText = `
                position: absolute; border-radius: 50%; background: var(--gold);
                width:${size}px; height:${size}px; left:${x}%;
                animation: particleFloat ${duration}s linear infinite; animation-delay:-${delay}s;
                opacity:${Math.random() * 0.4 + 0.1};
            `;
            bg.appendChild(p);
        }
    }

    /* ── Mobile Menu ── */
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
        });
    }

    /* ── MR Assistant Logic ── */
    const mrBtn = document.getElementById('mrAssistantBtn');
    const mrMenu = document.getElementById('mrAssistantMenu');
    const mrClose = document.getElementById('mrCloseBtn');

    if(mrBtn && mrMenu) {
        mrBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mrMenu.classList.toggle('active');
            const badge = mrBtn.querySelector('.mr-btn-badge');
            if(badge) badge.style.display = 'none';
        });
    }
    if(mrClose && mrMenu) {
        mrClose.addEventListener('click', () => { mrMenu.classList.remove('active'); });
    }
    document.addEventListener('click', (e) => {
        if (mrMenu && mrMenu.classList.contains('active') && !mrMenu.contains(e.target) && !mrBtn.contains(e.target)) {
            mrMenu.classList.remove('active');
        }
    });

    /* ── Header Scroll Effect ── */
    const header = document.getElementById('mainHeader');
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if(header) {
            if (window.scrollY > 50) header.classList.add('scrolled'); 
            else header.classList.remove('scrolled');
        }
        if(backToTop) {
            if (window.scrollY > 400) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    });
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
