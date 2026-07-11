// ===== DOM =====
const welcomeScreen = document.getElementById('welcome-screen');
const loadingScreen = document.getElementById('loading');
const fill = document.getElementById('fill');
const pctLabel = document.getElementById('pct');
const stage = document.getElementById('mainStage');
const musicToggle = document.getElementById('musicToggle');
const giantHeart3D = document.getElementById('giantHeart3D');
const loveStep = document.getElementById('loveStep');
const finalMessage = document.getElementById('finalMessage');
const galaxy = document.getElementById('galaxy');
const butterflyContainer = document.getElementById('butterflyContainer');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const choiceResult = document.getElementById('choiceResult');

// ===== NHẠC MP3 =====
let audio = null;
let isMusicPlaying = false;

// ===== VŨ TRỤ 3D =====
const canvas3D = document.getElementById('threeCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a1a, 0.002);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

scene.add(new THREE.AmbientLight(0x404066));
const dirLight = new THREE.DirectionalLight(0xffccdd, 0.6);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);

const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 2000; i++) {
    starVertices.push((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15 - 5);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
    color: 0xffb6c9, size: 0.08, blending: THREE.AdditiveBlending, depthWrite: false
}));
scene.add(stars);

function createPlanet(color, size, distance, speed, yOff = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.arc(40, 40, 20, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(90, 80, 15, 0, Math.PI * 2); ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7 })
    );
    planet.userData = { speed, distance, yOff };
    return planet;
}
const planets = [
    createPlanet('#ff5f8f', 0.4, 3.5, 0.002, 1.0),
    createPlanet('#4a90e2', 0.6, 5.0, 0.001, -0.8),
    createPlanet('#f5a623', 0.3, 2.8, 0.003, 0.2)
];
planets.forEach(p => scene.add(p));

const nebulaCanvas = document.createElement('canvas');
nebulaCanvas.width = 256; nebulaCanvas.height = 256;
const nebCtx = nebulaCanvas.getContext('2d');
const gradient = nebCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
gradient.addColorStop(0, 'rgba(255, 100, 150, 0.3)');
gradient.addColorStop(0.5, 'rgba(100, 100, 255, 0.2)');
gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
nebCtx.fillStyle = gradient; nebCtx.fillRect(0, 0, 256, 256);
const nebula = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(nebulaCanvas), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
);
nebula.position.set(-3, 0, -4);
scene.add(nebula);

const shootingStars3D = [];
function createShootingStar3D() {
    const geom = new THREE.BufferGeometry();
    const x = (Math.random() - 0.5) * 10;
    const y = Math.random() * 5 + 2;
    const len = Math.random() * 0.5 + 0.2;
    geom.setAttribute('position', new THREE.Float32BufferAttribute([x, y, -2, x - len, y - len * 2, -2], 3));
    const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 }));
    line.userData = { life: 1.0 };
    scene.add(line);
    shootingStars3D.push(line);
}

function animateUniverse() {
    requestAnimationFrame(animateUniverse);
    stars.rotation.y += 0.0001; stars.rotation.x += 0.00005;
    const t = Date.now() * 0.001;
    planets.forEach(p => {
        const d = p.userData;
        p.position.x = Math.cos(t * d.speed * 30) * d.distance;
        p.position.z = Math.sin(t * d.speed * 30) * d.distance;
        p.position.y = Math.sin(t * d.speed * 20) * d.yOff;
        p.rotation.y += 0.01;
    });
    nebula.rotation.z += 0.0002; nebula.rotation.x += 0.0001;
    if (Math.random() < 0.025) createShootingStar3D();
    for (let i = shootingStars3D.length - 1; i >= 0; i--) {
        const s = shootingStars3D[i];
        s.position.x -= 0.02; s.position.y -= 0.08;
        s.userData.life -= 0.008;
        s.material.opacity = Math.max(0, s.userData.life);
        if (s.userData.life <= 0) { scene.remove(s); shootingStars3D.splice(i, 1); }
    }
    renderer.render(scene, camera);
}
animateUniverse();
window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

// ===== SAO CSS & BƯỚM =====
for (let i = 0; i < 80; i++) {
    const star = document.createElement('div'); star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = size + 'px'; star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%'; star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    galaxy.appendChild(star);
}
function createButterfly() {
    const b = document.createElement('div'); b.className = 'butterfly'; b.innerHTML = '🦋';
    b.style.left = Math.random() * 100 + '%'; b.style.top = Math.random() * 100 + '%';
    b.style.fontSize = (16 + Math.random() * 20) + 'px';
    b.style.animationDuration = (8 + Math.random() * 12) + 's';
    b.style.animationDelay = (Math.random() * 3) + 's';
    butterflyContainer.appendChild(b);
    setTimeout(() => b.remove(), 15000);
}
for (let i = 0; i < 8; i++) createButterfly();
setInterval(createButterfly, 4000);

// ===== ÂM THANH =====
function playTing() {
    const ting = document.getElementById('tingSound');
    if (ting) { ting.currentTime = 0; ting.play().catch(() => {}); }
    else {
        try {
            const actx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.15, actx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.15);
            osc.connect(gain); gain.connect(actx.destination);
            osc.start(); osc.stop(actx.currentTime + 0.15);
        } catch(e) {}
    }
}

// ===== NHẠC NỀN (FILE MP3) =====
// 👉 Đặt file nhạc tên "tinhyeu.mp3" cùng thư mục với index.html
function startMusic() {
    if (isMusicPlaying) return;
    if (!audio) {
        audio = new Audio('tinhyeu.mp3');
        audio.loop = true;
        audio.volume = 0.3;
    }
    audio.play().then(() => {
        isMusicPlaying = true;
        musicToggle.classList.remove('muted');
    }).catch(() => {
        musicToggle.classList.add('muted');
        console.warn('Không phát được nhạc nền — kiểm tra file tinhyeu.mp3 có cùng thư mục không.');
    });
}
function stopMusic() {
    if (!isMusicPlaying) return;
    if (audio) {
        audio.pause();
        isMusicPlaying = false;
        musicToggle.classList.add('muted');
    }
}
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isMusicPlaying ? stopMusic() : startMusic();
    playTing();
});

// ===== BẮT ĐẦU =====
document.getElementById('btnStart').addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.visibility = 'hidden';
    loadingScreen.style.visibility = 'visible';
    loadingScreen.style.opacity = '1';
    startLoading();
    startMusic();
    playTing();
});

function startLoading() {
    let pct = 0;
    const loadTimer = setInterval(() => {
        pct += Math.floor(Math.random() * 7) + 4;
        if (pct >= 100) { pct = 100; clearInterval(loadTimer);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                stage.classList.add('show');
                loveStep.classList.add('active');
                updateDayCounter();
                typeWriterMessage();
                startBubbles();
                startShootingStars();
            }, 350);
        }
        fill.style.width = pct + '%';
        pctLabel.textContent = pct + '%';
    }, 130);
}

// ===== ĐẾM NGÀY YÊU =====
// 👉 Sửa ngày bắt đầu ở đây nếu cần
function updateDayCounter() {
    const start = new Date(2025, 5, 19); // 19/06/2025
    const now = new Date();
    const diff = Math.floor((now - start) / 86400000);
    const el = document.getElementById('dayCount');
    if (el) el.textContent = Math.max(diff, 0);
}

function todayVN() {
    const d = new Date();
    return String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear();
}

// ===== LỜI NHẮN (typewriter) =====
function typeWriterMessage() {
    // 👉 Sửa nội dung lời nhắn ở đây
    const text = `Gửi My yêu dấu,\n\n1 tuần có 7 ngày, 1 ngày có 24 giờ, 1 giờ có 60 phút, 1 phút có 60 giây.\nKhông có một khoảnh khắc nào mà anh không nghĩ về em.\nAnh hy vọng mình sẽ là người yêu em nhiều nhất, trong suốt hành trình mà tụi mình cùng đi qua.\n\nĐức yêu My, từ hôm nay ${todayVN()} và mãi về sau!`;
    let i = 0;
    finalMessage.innerHTML = '<span class="typing-cursor"></span>';
    const cursor = finalMessage.querySelector('.typing-cursor');
    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            const span = document.createElement('span');
            span.textContent = char;
            finalMessage.insertBefore(span, cursor);
            i++;
            setTimeout(type, 25);
        } else {
            cursor.remove();
        }
    }
    type();
}

// ===== CÓ / KHÔNG =====
const dodgeLines = [
    'né được câu này rồi à? 😏',
    'thử lần nữa xem nào...',
    'anh không cho phép né đâu 😤',
    'trốn giỏi ghê ha 😆'
];
let yesScale = 1;
function dodgeNo() {
    const rect = btnNo.getBoundingClientRect();
    const margin = 50;
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;
    const x = margin + Math.random() * Math.max(maxX - margin, 10);
    const y = margin + Math.random() * Math.max(maxY - margin, 10);
    btnNo.classList.add('dodging');
    btnNo.style.left = x + 'px';
    btnNo.style.top = y + 'px';
    yesScale = Math.min(yesScale + 0.06, 1.7);
    btnYes.style.transform = `scale(${yesScale})`;
    choiceResult.textContent = dodgeLines[Math.floor(Math.random() * dodgeLines.length)];
}
btnNo.addEventListener('mouseenter', dodgeNo);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNo(); }, { passive: false });
btnNo.addEventListener('click', (e) => { e.preventDefault(); dodgeNo(); });

btnYes.addEventListener('click', () => {
    btnNo.style.display = 'none';
    btnYes.style.transform = `scale(${Math.min(yesScale, 1.3)})`;
    choiceResult.textContent = `chính thức từ ${todayVN()} 💫`;
    celebrate();
});

// ===== KHOẢNH KHẮC ĂN MỪNG (thay cho nút "Gửi yêu thương" cũ) =====
function celebrate() {
    burstHearts(18);
    burstConfetti(40);
    spawnPetals(20);
    startFireworks();
    createHeartWave();
    burstBubbles(12);
    giantHeart3D.classList.add('show');
    setTimeout(() => giantHeart3D.classList.remove('show'), 1500);
    playTing();
}

// ===== HIỆU ỨNG 2D =====
function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = Math.random() > 0.5 ? '❤️' : '💕';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (14 + Math.random() * 14) + 'px';
    h.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
    h.style.setProperty('--s', (0.8 + Math.random() * 0.6).toFixed(2));
    const dur = 5 + Math.random() * 3;
    h.style.animationDuration = dur + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
}
setInterval(spawnHeart, 800);

function burstHearts(n) { for (let i=0; i<n; i++) setTimeout(spawnHeart, i*50); }

function burstConfetti(n) {
    const colors = ['#ff5f8f','#ffd166','#ff9fb8','#e0397a','#fff1f5','#4a90e2'];
    for (let i=0; i<n; i++) setTimeout(() => {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.setProperty('--driftX', (Math.random() * 160 - 80) + 'px');
        const size = 6 + Math.random() * 6;
        c.style.width = size + 'px';
        c.style.height = (size * 0.4) + 'px';
        const dur = 2.5 + Math.random() * 2;
        c.style.animationDuration = dur + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), dur * 1000);
    }, i * 12);
}

function spawnPetals(n) {
    for (let i=0; i<n; i++) setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'petal';
        p.textContent = '🌸';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.fontSize = (16 + Math.random() * 14) + 'px';
        p.style.setProperty('--petalDrift', (Math.random() * 120 - 60) + 'px');
        const dur = 4 + Math.random() * 3;
        p.style.animationDuration = dur + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), dur * 1000);
    }, i * 20);
}

function createBubble() {
    const b = document.createElement('div');
    b.className = 'bubble';
    b.innerHTML = '❤️';
    b.style.left = Math.random() * 100 + 'vw';
    b.style.bottom = '-30px';
    b.style.width = (20 + Math.random() * 30) + 'px';
    b.style.height = b.style.width;
    b.style.fontSize = (12 + Math.random() * 10) + 'px';
    const dur = 4 + Math.random() * 4;
    b.style.animationDuration = dur + 's';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), dur * 1000);
}
function startBubbles() {
    setInterval(() => {
        if (document.visibilityState === 'visible') createBubble();
    }, 1200);
}
function burstBubbles(n) { for (let i=0; i<n; i++) setTimeout(createBubble, i*80); }

function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 40 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 5000);
}
function startShootingStars() {
    setInterval(() => {
        if (document.visibilityState === 'visible') createShootingStar();
    }, 2000);
}

function createHeartWave() {
    const wave = document.createElement('div');
    wave.className = 'heart-wave';
    wave.style.left = '50%';
    wave.style.top = '50%';
    wave.style.marginLeft = '-5px';
    wave.style.marginTop = '-5px';
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 1000);
}

// ===== PHÁO HOA 2D =====
const fwCanvas = document.getElementById('fireworkCanvas');
const fwCtx = fwCanvas.getContext('2d');
let particles = [];
function resizeFw() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
}
resizeFw();
window.addEventListener('resize', resizeFw);

class Particle {
    constructor(x, y, c) {
        this.x = x; this.y = y;
        this.color = c;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 2 + Math.random() * 4;
        this.life = 1;
        this.decay = 0.015 + Math.random() * 0.02;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life -= this.decay;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
function createFirework(x, y) {
    const colors = ['#ff5f8f','#ffd166','#ff9fb8','#e0397a','#ffb3c6','#f4c56b','#4a90e2'];
    for (let i=0; i<25; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    }
}
function startFireworks() {
    for (let i=0; i<4; i++) {
        setTimeout(() => {
            const x = Math.random() * fwCanvas.width;
            const y = Math.random() * fwCanvas.height * 0.5;
            createFirework(x, y);
        }, i * 250);
    }
}
function animateFw() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(fwCtx); });
    requestAnimationFrame(animateFw);
}
animateFw();

console.log('💖 Đức đã sẵn sàng yêu My');
