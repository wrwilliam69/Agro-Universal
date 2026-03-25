/* ========== AGRO UNIVERSAL - Control de Residuos ========== */
document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ===== MOBILE MENU =====
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link:not(.nav-cta)');

    function setActiveNav() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinksAll.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', setActiveNav);

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
	// Forzar visibilidad de elementos en el hero al cargar
	document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
    el.classList.add('visible');
	});

    // ===== NUMBER COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.dataset.target);
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // EaseOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.round(eased * target);
                    num.textContent = current.toLocaleString('es-CO');
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }
                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load

    // ===== HERO PARTICLES =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        const colors = [
            'rgba(37, 135, 80, 0.3)',
            'rgba(200, 169, 81, 0.2)',
            'rgba(91, 188, 115, 0.2)',
            'rgba(255, 255, 255, 0.05)'
        ];

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 6 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            const nombre = document.getElementById('nombre').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const email = document.getElementById('email').value.trim();

            if (!nombre || !empresa || !email) {
                shakeButton(submitBtn);
                return;
            }

            if (!validateEmail(email)) {
                shakeButton(submitBtn);
                return;
            }

            // Simulate sending
         submitBtn.innerHTML = '<span>Enviando...</span><div class="spinner"></div>';
submitBtn.disabled = true;

const telefono = document.getElementById('telefono').value.trim();
const tipoResiduo = document.getElementById('mensaje').value;

fetch('https://vx45elu3qb.execute-api.us-east-1.amazonaws.com/Prod/contactos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, empresa, email, telefono, tipo_residuo: tipoResiduo })
})
.then(res => res.json())
.then(() => {
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');
})
.catch(() => {
    submitBtn.innerHTML = '<span>Solicitar Demo Gratuita</span>';
    submitBtn.disabled = false;
    alert('Error al enviar. Intenta de nuevo.');
});
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function shakeButton(btn) {
        btn.style.animation = 'shake 0.5s ease';
        setTimeout(() => { btn.style.animation = ''; }, 500);
    }

    // Add shake keyframes dynamically
    const shakeStyles = document.createElement('style');
    shakeStyles.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
        }
        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(shakeStyles);

    // ===== INPUT FOCUS ANIMATIONS =====
    document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // ===== PARALLAX EFFECT ON HERO =====
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.3;
            heroContent.style.transform = `translateY(${offset}px)`;
            heroContent.style.opacity = 1 - (window.scrollY / window.innerHeight) * 0.6;
        }
    });

});
