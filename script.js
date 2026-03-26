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
.then(async res => {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
    }
    // AWS API Gateway a veces devuelve texto o un JSON escapado
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }
    return res.text();
})
.then(data => {
    console.log("Respuesta de AWS:", data);
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');
})
.catch(error => {
    console.error("Error detallado del fetch:", error);
    submitBtn.innerHTML = '<span>Solicitar Demo Gratuita</span>';
    submitBtn.disabled = false;
    alert('Error al enviar. Intenta de nuevo. Revisa la consola para más detalles.');
});
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

    // ===== CHART.JS DASHBOARD INITIALIZATION =====
    function initCharts() {
        if (typeof Chart === 'undefined') return;

        // Common configurations
        Chart.defaults.color = '#9AABA1';
        Chart.defaults.font.family = "'Inter', sans-serif";
        const gridConfig = { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' };

        // 1. Emisiones GHG (Bar)
        const ctxGhg = document.getElementById('chartGhg');
        if (ctxGhg) {
            new Chart(ctxGhg.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['2019', '2020', '2021', '2022', '2023'],
                    datasets: [{
                        label: 'Millones de Ton CO2eq',
                        data: [75.6, 74.6, 70.9, 69.6, 65.2],
                        backgroundColor: '#34A853',
                        borderRadius: 4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: gridConfig, min: 25 }, x: { grid: {display: false} } }, plugins: { legend: { display: false } } }
            });
        }

        // 2. % Residuos Domésticos (Bar + Line)
        const ctxWaste = document.getElementById('chartWaste');
        if (ctxWaste) {
            new Chart(ctxWaste.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4', 'Zona 5', 'Zona 6'],
                    datasets: [{
                        type: 'line',
                        label: 'Límite Objetivo',
                        data: [50, 50, 50, 50, 50, 50],
                        borderColor: '#C8A951',
                        borderWidth: 2,
                        pointRadius: 0
                    }, {
                        type: 'bar',
                        label: '% Residuo Doméstico',
                        data: [61, 58, 55, 45, 40, 35],
                        backgroundColor: '#1A5C3A',
                        borderRadius: 4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: gridConfig, max: 70 }, x: { grid: {display: false} } }, plugins: { legend: { display: false } } }
            });
        }

        // 3. Energía por Combustible (Doughnut)
        const ctxEnergy = document.getElementById('chartEnergy');
        if (ctxEnergy) {
            new Chart(ctxEnergy.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Ventas', 'Gas Natural', 'Gasolina Motor', 'Aceite', 'Productos', 'Biomasa', 'Otros'],
                    datasets: [{
                        data: [20, 32, 18, 17, 10, 8, 5],
                        backgroundColor: ['#258750', '#5BBC73', '#A8E6C1', '#C8A951', '#E0CB83', '#6B7D73', '#0B3D2E'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: {size: 11} } } } }
            });
        }

        // 4. Camiones Recolectores (Doughnut)
        const ctxTrucks = document.getElementById('chartTrucks');
        if (ctxTrucks) {
            new Chart(ctxTrucks.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['En Ruta', 'En Planta', 'Reparación', 'Inactivos'],
                    datasets: [{
                        data: [60, 20, 16, 4],
                        backgroundColor: ['#34A853', '#A8E6C1', '#C8A951', '#1A2620'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: {size: 11} } } } }
            });
        }

        // 5. Residuos vs Reciclaje (Stacked Bar)
        const ctxRecycling = document.getElementById('chartRecycling');
        if (ctxRecycling) {
            new Chart(ctxRecycling.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['2019', '2020', '2021', '2022', '2023'],
                    datasets: [{
                        label: 'Residuos Sólidos',
                        data: [1600, 1400, 1500, 1300, 1200],
                        backgroundColor: '#34A853'
                    }, {
                        label: 'Material Reciclado',
                        data: [900, 1000, 1100, 1200, 1400],
                        backgroundColor: '#258750'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, grid: {display: false} }, y: { stacked: true, grid: gridConfig } } }
            });
        }

        // 6. Disposición Final de Materiales (Doughnut)
        const ctxMaterials = document.getElementById('chartMaterials');
        if (ctxMaterials) {
            new Chart(ctxMaterials.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Orgánico', 'Plástico', 'Papel', 'Textil', 'Metal', 'Madera', 'Vidrio'],
                    datasets: [{
                        data: [25, 18, 15, 12, 10, 9, 11],
                        backgroundColor: ['#0F5132', '#1A5C3A', '#258750', '#34A853', '#5BBC73', '#C8A951', '#D4BA6A'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: {size: 10} } } } }
            });
        }
    }

    // Initialize charts slightly after load to ensure canvas is painted
    setTimeout(initCharts, 200);

});
