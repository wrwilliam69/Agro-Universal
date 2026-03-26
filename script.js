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
    let dashboardCharts = {};

    function initCharts() {
        if (typeof Chart === 'undefined') return;

        // Common configurations
        Chart.defaults.color = '#9AABA1';
        Chart.defaults.font.family = "'Inter', sans-serif";
        const gridConfig = { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' };

        // 1. Emisiones GHG (Bar)
        const ctxGhg = document.getElementById('chartGhg');
        if (ctxGhg) {
            dashboardCharts.ghg = new Chart(ctxGhg.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['2019', '2020', '2021', '2022', 'Calculado (Ahora)'],
                    datasets: [{
                        label: 'Emisiones de CO2eq',
                        data: [75.6, 74.6, 70.9, 69.6, 65.2],
                        backgroundColor: ['#1A5C3A', '#1A5C3A', '#1A5C3A', '#1A5C3A', '#34A853'],
                        borderRadius: 4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: gridConfig, min: 0 }, x: { grid: {display: false} } }, plugins: { legend: { display: false } } }
            });
        }

        // 2. % Residuos Domésticos (Bar + Line)
        const ctxWaste = document.getElementById('chartWaste');
        if (ctxWaste) {
            dashboardCharts.waste = new Chart(ctxWaste.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4', 'Zona 5', 'Planta (Simulador)'],
                    datasets: [{
                        type: 'line',
                        label: 'Límite Objetivo',
                        data: [50, 50, 50, 50, 50, 50],
                        borderColor: '#C8A951',
                        borderWidth: 2,
                        pointRadius: 0
                    }, {
                        type: 'bar',
                        label: '% Residuo Orgánico/Doméstico',
                        data: [61, 58, 55, 45, 40, 35],
                        backgroundColor: ['#1A5C3A', '#1A5C3A', '#1A5C3A', '#1A5C3A', '#1A5C3A', '#C8A951'],
                        borderRadius: 4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: gridConfig, max: 100 }, x: { grid: {display: false} } }, plugins: { legend: { display: false } } }
            });
        }

        // 3. Energía por Combustible (Doughnut)
        const ctxEnergy = document.getElementById('chartEnergy');
        if (ctxEnergy) {
            dashboardCharts.energy = new Chart(ctxEnergy.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Renovable', 'Gas Natural', 'Gasolina Motor', 'Subproductos', 'Biomasa'],
                    datasets: [{
                        data: [35, 32, 18, 10, 5],
                        backgroundColor: ['#34A853', '#A8E6C1', '#C8A951', '#E0CB83', '#5BBC73'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: {size: 11} } } } }
            });
        }

        // 4. Camiones Recolectores (Doughnut)
        const ctxTrucks = document.getElementById('chartTrucks');
        if (ctxTrucks) {
            dashboardCharts.trucks = new Chart(ctxTrucks.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Moviendo Reciclaje', 'Moviendo Residuos', 'En Espera'],
                    datasets: [{
                        data: [45, 40, 15],
                        backgroundColor: ['#34A853', '#1A2620', '#C8A951'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: {size: 11} } } } }
            });
        }

        // 5. Residuos vs Reciclaje (Stacked Bar)
        const ctxRecycling = document.getElementById('chartRecycling');
        if (ctxRecycling) {
            dashboardCharts.recycling = new Chart(ctxRecycling.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['2019', '2020', '2021', '2022', 'Calculado (Ahora)'],
                    datasets: [{
                        label: 'Material Reciclado',
                        data: [900, 1000, 1100, 1200, 1400],
                        backgroundColor: '#34A853'
                    }, {
                        label: 'Basura Sólida',
                        data: [1600, 1400, 1500, 1300, 1200],
                        backgroundColor: '#1A2620'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, grid: {display: false} }, y: { stacked: true, grid: gridConfig } } }
            });
        }

        // 6. Disposición Final de Materiales (Doughnut)
        const ctxMaterials = document.getElementById('chartMaterials');
        if (ctxMaterials) {
            dashboardCharts.materials = new Chart(ctxMaterials.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Orgánico Compostado', 'Plástico Reciclado', 'Papel/Cartón', 'Desecho No Recuperable'],
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: ['#0F5132', '#34A853', '#C8A951', '#1A2620'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: {size: 10} } } } }
            });
        }

        setupSimulator();
    }

    // ===== LÓGICA DEL SIMULADOR =====
    function setupSimulator() {
        const simWaste = document.getElementById('simWaste');
        const simRecycled = document.getElementById('simRecycled');
        const simEnergy = document.getElementById('simEnergy');
        
        const simWasteVal = document.getElementById('simWasteVal');
        const simRecycledVal = document.getElementById('simRecycledVal');
        const simEnergyVal = document.getElementById('simEnergyVal');

        if (!simWaste || !simRecycled || !simEnergy) return;

        function updateSimulation() {
            let waste = parseInt(simWaste.value);
            let recycled = parseInt(simRecycled.value);
            let energy = parseInt(simEnergy.value);

            // Validar que no se recicle algebraicasmente más de la basura total
            if (recycled > waste) {
                recycled = waste;
                simRecycled.value = waste;
            }

            simWasteVal.textContent = waste.toLocaleString('es-CO') + ' Ton';
            simRecycledVal.textContent = recycled.toLocaleString('es-CO') + ' Ton';
            simEnergyVal.textContent = energy.toLocaleString('es-CO') + ' MWh';

            let nonRecycled = waste - recycled;

            // 1. Chart GHG (Cálculo de emisiones simuladas: energía * 0.04 + basura no reciclada * 0.08)
            if (dashboardCharts.ghg) {
                let currentGhg = parseFloat(((energy * 0.04) + (nonRecycled * 0.08)).toFixed(1));
                dashboardCharts.ghg.data.datasets[0].data[4] = currentGhg;
                dashboardCharts.ghg.update();
            }

            // 5. Chart Residuos vs Reciclaje (Última barra = calculos actuales)
            if (dashboardCharts.recycling) {
                dashboardCharts.recycling.data.datasets[0].data[4] = recycled;      // Reciclado
                dashboardCharts.recycling.data.datasets[1].data[4] = nonRecycled;   // Basura
                dashboardCharts.recycling.update();
            }

            // 2. Chart % Residuos
            if (dashboardCharts.waste) {
                // Simulamos que el % de orgánicos sube si hay más reciclaje
                let percent = 20 + ((recycled / waste) * 40);
                dashboardCharts.waste.data.datasets[1].data[5] = Math.round(percent);
                dashboardCharts.waste.update();
            }

            // 4. Camiones
            if (dashboardCharts.trucks) {
                // Entre más reciclaje, más camiones se ocupan de materiales recuperables
                let reciTrucks = Math.round((recycled / waste) * 70) + 10;
                let trashTrucks = Math.round((nonRecycled / waste) * 70) + 10;
                let idleTrucks = 100 - (reciTrucks + trashTrucks);
                dashboardCharts.trucks.data.datasets[0].data = [reciTrucks, trashTrucks, idleTrucks];
                dashboardCharts.trucks.update();
            }
        }

        // Escuchar eventos de arrastre
        simWaste.addEventListener('input', updateSimulation);
        simRecycled.addEventListener('input', updateSimulation);
        simEnergy.addEventListener('input', updateSimulation);
        
        // Ejecución Inicial
        updateSimulation();
    }

    // Initialize charts slightly after load to ensure canvas is painted
    setTimeout(initCharts, 200);

});
