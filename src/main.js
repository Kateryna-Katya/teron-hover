// Инициализация иконок Lucide
lucide.createIcons();

// Эффект скролла хедера
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.padding = '12px 0';
        header.style.background = 'rgba(20, 22, 24, 0.95)';
    } else {
        header.style.padding = '20px 0';
        header.style.background = 'rgba(26, 28, 30, 0.8)';
    }
});

// Плавная навигация (уже есть в CSS, но для Safari/старых браузеров)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
// Интерактивный фон Three.js
const initThree = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Создаем частицы
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({ color: 0x00f2ff, size: 2 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 1000;

    // Анимация при движении мыши
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 100;
        mouseY = (e.clientY - window.innerHeight / 2) / 100;
    });

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.x += 0.001;
        points.rotation.y += 0.001;
        
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initThree();
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    observer.observe(el);
});
// Инициализация Vanilla Tilt для карточек
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".glass-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });
}
const handleTimelineProgress = () => {
    const timeline = document.querySelector('.timeline');
    const progress = document.querySelector('.timeline__progress');
    const items = document.querySelectorAll('.timeline__item');

    if (!timeline || !progress) return;

    const timelineRect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Рассчитываем, насколько далеко мы проскроллили таймлайн
    let progressHeight = (windowHeight / 2 - timelineRect.top);
    let totalHeight = timelineRect.height;

    // Ограничиваем прогресс от 0 до 100%
    let percent = Math.max(0, Math.min(100, (progressHeight / totalHeight) * 100));
    progress.style.height = `${percent}%`;

    // Активируем точки
    items.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < windowHeight / 2) {
            item.classList.add('is-active');
        } else {
            item.classList.remove('is-active');
        }
    });
};

window.addEventListener('scroll', handleTimelineProgress);
// Генерация капчи
let captchaResult;
const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaResult = num1 + num2;
    const label = document.getElementById('captchaLabel');
    if(label) label.innerText = `Решите пример: ${num1} + ${num2} = ?`;
};

generateCaptcha();

// Обработка формы
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phoneValue = document.getElementById('userPhone').value;
        const captchaInput = parseInt(document.getElementById('captchaInput').value);
        
        // Валидация телефона (только цифры, +, -, пробелы)
        const phoneRegex = /^[\d\s\+\-]+$/;
        if (!phoneRegex.test(phoneValue)) {
            showStatus('Ошибка: Некорректный формат телефона', 'error');
            return;
        }

        // Проверка капчи
        if (captchaInput !== captchaResult) {
            showStatus('Ошибка: Неверный ответ капчи', 'error');
            generateCaptcha();
            return;
        }

        // Имитация AJAX
        const submitBtn = contactForm.querySelector('button');
        submitBtn.innerText = 'Отправка...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showStatus('Запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
            contactForm.reset();
            submitBtn.innerText = 'Отправить запрос';
            submitBtn.disabled = false;
            generateCaptcha();
        }, 1500);
    });
}

function showStatus(text, type) {
    formStatus.innerText = text;
    formStatus.className = 'form-status ' + type;
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}
// --- Мобильное меню ---
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');

const toggleMenu = () => {
    burger.classList.toggle('is-active');
    nav.classList.toggle('is-active');
    document.body.classList.toggle('no-scroll'); // Чтобы не скроллился контент под меню
};

burger.addEventListener('click', toggleMenu);

// Закрытие при клике на ссылку
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('is-active')) toggleMenu();
    });
});

// --- Cookie Popup Logic ---
const cookiePopup = document.getElementById('cookiePopup');
const acceptBtn = document.getElementById('acceptCookies');

window.addEventListener('load', () => {
    // Проверяем, принимал ли пользователь куки ранее
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('is-visible');
        }, 2000);
    }
});

acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookiePopup.classList.remove('is-visible');
});