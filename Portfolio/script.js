/* ============================================
   ፖርትፎሊዮ - ሙሉ JavaScript
   ============================================ */

// ===== 0. TAB SYSTEM =====
(function initTabs() {
    const navLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        tabContents.forEach(tab => tab.classList.remove('active'));
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                targetTab.querySelectorAll('.reveal').forEach(el => {
                    el.classList.remove('visible');
                    setTimeout(() => el.classList.add('visible'), 100);
                });
                targetTab.querySelectorAll('.skill-fill').forEach(bar => {
                    bar.style.width = '0';
                    setTimeout(() => bar.style.width = bar.dataset.width + '%', 300);
                });
            }, 100);
        }
        document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.tab === tabId) link.classList.add('active');
        });
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const menuIcon = document.querySelector('#menu-btn i');
            if (menuIcon) {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;
            if (tabId) switchTab(tabId);
        });
    });
})();


// ===== 0.5 LANGUAGE TRANSLATOR & NOTIFICATION (አዲስ የተጨመረ) =====
(function initTranslator() {
    const langBtn = document.getElementById('lang-toggle');
    let currentLang = 'am'; // 'am' for Amharic, 'en' for English

    if (!langBtn) return;

    function showNotification(message) {
        // የማሳወቂያ ሳጥን መፍጠር
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-family: inherit;
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
            z-index: 9999;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        
        document.body.appendChild(toast);

        // አኒሜሽን ለማሳየት
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        }, 100);

        // ከ 3 ሰከንድ በኋላ ማጥፋት
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    function translatePage(lang) {
        // ጽሑፎችን መቀየር (data-en እና data-am በመጠቀም)
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });

        // የፎርም መሙያ ቦታዎችን (Placeholders) መቀየር
        document.querySelectorAll('[data-en-ph]').forEach(el => {
            el.setAttribute('placeholder', el.getAttribute(`data-${lang}-ph`));
        });

        // የሮል ሮቴተር (Role Rotator) ጽሑፎችን መቀየር
        const roles = lang === 'en' ? [
            'Full-Stack Developer 💻',
            'Mobile App Developer 📱',
            'Information Systems Student 🎓',
            'Problem Solver 🚀'
        ] : [
            'Full-Stack Developer 💻',
            'Mobile App Developer 📱',
            'Information Systems Student 🎓',
            'Problem Solver 🚀'
        ];
        
        // የቋንቋ ቁልፉን ስቴት ማደስ
        currentLang = lang;
        langBtn.innerHTML = lang === 'am' ? '<i class="fa-solid fa-language"></i>' : '<i class="fa-solid fa-language"></i>';
        
        // ማሳወቂያ ማሳየት
        showNotification(lang === 'am' ? 'ቋንቋ ወደ አማርኛ ተቀይሯል 🇪🇹' : 'Language changed to English 🇬🇧');
    }

    langBtn.addEventListener('click', () => {
        if (currentLang === 'am') {
            translatePage('en');
        } else {
            translatePage('am');
        }
    });
})();


// ===== 1. PARTICLE BACKGROUND =====
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(80, Math.floor(window.innerWidth / 18));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x += (dx / dist) * force * 2;
                    p.y += (dy / dist) * force * 2;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(129, 140, 248, ${p.opacity})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', () => { resize(); createParticles(); });

    resize();
    createParticles();
    draw();
})();


// ===== 2. CUSTOM CURSOR =====
(function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (!dot || !outline) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    function animate() {
        dotX += (mouseX - dotX) * 0.9;
        dotY += (mouseY - dotY) * 0.9;
        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    }
    animate();

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .contact-card, input, textarea, .social-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hover'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
    });
})();


// ===== 3. MOBILE MENU =====
(function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
})();


// ===== 4. THEME TOGGLE =====
(function initThemeToggle() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        html.classList.remove('dark');
        html.classList.add('light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            html.classList.add('light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
})();


// ===== 5. ROLE ROTATOR =====
(function initRoleRotator() {
    const roles = [
        'Full-Stack Developer 💻',
        'Mobile App Developer 📱',
        'Information Systems Student 🎓',
        'Problem Solver 🚀'
    ];

    const roleEl = document.getElementById('role-text');
    if (!roleEl) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
        const current = roles[roleIndex];
        if (isDeleting) {
            roleEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }
        let speed = isDeleting ? 40 : 80;
        if (!isDeleting && charIndex === current.length) {
            speed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }
        setTimeout(typeRole, speed);
    }
    setTimeout(typeRole, 800);
})();


// ===== 6. SCROLL REVEAL =====
(function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealElements.forEach(el => observer.observe(el));
})();


// ===== 7. STATS COUNTER =====
(function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    animateCount(el, target);
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    function animateCount(el, target) {
        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        function update() {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current) + '+';
                requestAnimationFrame(update);
            } else {
                el.textContent = target + '+';
            }
        }
        update();
    }
    statNumbers.forEach(num => observer.observe(num));
})();


// ===== 8. 3D TILT =====
(function initTiltEffect() {
    const card = document.querySelector('.tilt-card');
    if (!card) return;
    if (window.matchMedia('(hover: none)').matches) return;
    const wrapper = card.parentElement;
    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    wrapper.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
})();


// ===== 9. SCROLL TOP =====
(function initScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


// ===== 10. NAVBAR SCROLL =====
(function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        else navbar.style.boxShadow = 'none';
    });
})();


// ===== 11. CONTACT FORM =====
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Sent!</span>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                alert('✅ Message sent successfully!');
                form.reset();
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 800);
        }, 1500);
    });
})();

console.log('%c🚀 Portfolio by ቃለአብ', 'background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;');