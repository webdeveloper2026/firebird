const initThree = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const count = 3000;
    const posArray = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.008,
        color: '#04f0c3',
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    camera.position.z = 4;

    let mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
    });

    const anim = () => {
        requestAnimationFrame(anim);
        mesh.rotation.y += 0.0008;
        mesh.rotation.x += 0.0002;
        
        mesh.position.x += (mx - mesh.position.x) * 0.05;
        mesh.position.y += (-my - mesh.position.y) * 0.05;
        
        renderer.render(scene, camera);
    };
    anim();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

const initScrollAnimation = (config = {}) => {
    const {
        canvasId = 'animation-canvas',
        triggerId = '#scroll-animation',
        folder = 'animation',
        extension = 'webp',
        specificFrames = null,
        totalFrames = 240
    } = config;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const context = canvas.getContext('2d');

    const frameCount = specificFrames ? specificFrames.length : totalFrames;
    const currentFrame = index => {
        if (specificFrames) return `${folder}/${specificFrames[index]}`;
        return `${folder}/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.${extension}`;
    };

    const images = [];
    const airpods = {
        frame: 0
    };

    let imagesLoaded = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === 1) render(); 
        };
        images.push(img);
    }

    gsap.to(airpods, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: triggerId,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1
        },
        onUpdate: render
    });

    function render() {
        const img = images[airpods.frame];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
    }

    render();
};

const initGSAP = () => {
    gsap.registerPlugin(ScrollTrigger);
    
    const heroTl = gsap.timeline();
    heroTl.from("#hero-title span", {
        x: -50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
    })
    .from("#hero-subtext", {
        opacity: 0,
        x: -30,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from("#hero-actions", {
        opacity: 0,
        x: -20,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from("#hero-mockup", {
        opacity: 0,
        x: 60,
        scale: 0.9,
        duration: 1.5,
        ease: "power2.out"
    }, "-=1");

    document.querySelectorAll('.reveal-section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        });
    });

    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                backgroundColor: '#11192d',
                duration: 0.4,
                ease: "power2.out"
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                backgroundColor: '#0F172A',
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initThree();
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            hamburgerIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            });
        });
    }

    if (window.innerWidth >= 1024) {
        initScrollAnimation({
            canvasId: 'animation-canvas',
            triggerId: '#scroll-animation',
            folder: 'old_animation',
            specificFrames: [
                "ezgif-frame-006.png", "ezgif-frame-007.png", "ezgif-frame-012.png", "ezgif-frame-013.png",
                "ezgif-frame-014.png", "ezgif-frame-015.png", "ezgif-frame-016.png", "ezgif-frame-024.png",
                "ezgif-frame-025.png", "ezgif-frame-031.png", "ezgif-frame-034.png", "ezgif-frame-035.png",
                "ezgif-frame-039.png", "ezgif-frame-040.png", "ezgif-frame-041.png", "ezgif-frame-042.png",
                "ezgif-frame-043.png", "ezgif-frame-044.png", "ezgif-frame-046.png", "ezgif-frame-047.png",
                "ezgif-frame-048.png", "ezgif-frame-049.png", "ezgif-frame-050.png", "ezgif-frame-051.png",
                "ezgif-frame-052.png", "ezgif-frame-053.png", "ezgif-frame-054.png", "ezgif-frame-055.png",
                "ezgif-frame-056.png", "ezgif-frame-057.png", "ezgif-frame-058.png", "ezgif-frame-059.png",
                "ezgif-frame-060.png", "ezgif-frame-061.png", "ezgif-frame-062.png", "ezgif-frame-063.png",
                "ezgif-frame-064.png", "ezgif-frame-065.png", "ezgif-frame-066.png", "ezgif-frame-067.png",
                "ezgif-frame-072.png", "ezgif-frame-073.png", "ezgif-frame-074.png", "ezgif-frame-075.png",
                "ezgif-frame-076.png", "ezgif-frame-077.png", "ezgif-frame-078.png", "ezgif-frame-079.png",
                "ezgif-frame-080.png", "ezgif-frame-093.png", "ezgif-frame-094.png", "ezgif-frame-095.png",
                "ezgif-frame-096.png", "ezgif-frame-097.png", "ezgif-frame-098.png", "ezgif-frame-099.png",
                "ezgif-frame-100.png", "ezgif-frame-101.png", "ezgif-frame-102.png", "ezgif-frame-103.png",
                "ezgif-frame-104.png", "ezgif-frame-105.png", "ezgif-frame-106.png", "ezgif-frame-107.png",
                "ezgif-frame-108.png", "ezgif-frame-109.png", "ezgif-frame-110.png", "ezgif-frame-111.png",
                "ezgif-frame-112.png", "ezgif-frame-113.png", "ezgif-frame-114.png", "ezgif-frame-115.png",
                "ezgif-frame-116.png", "ezgif-frame-117.png", "ezgif-frame-118.png", "ezgif-frame-119.png",
                "ezgif-frame-120.png", "ezgif-frame-121.png", "ezgif-frame-122.png", "ezgif-frame-123.png",
                "ezgif-frame-124.png", "ezgif-frame-125.png", "ezgif-frame-126.png", "ezgif-frame-127.png",
                "ezgif-frame-128.png", "ezgif-frame-129.png", "ezgif-frame-130.png", "ezgif-frame-131.png",
                "ezgif-frame-132.png"
            ]
        });
    }

    const setupGridAnim = (gridId) => {
        const grid = document.querySelector(gridId);
        if (!grid) return;
        gsap.set(grid, { transformOrigin: "center center" });
        gsap.to(grid, {
            rotate: 360,
            duration: 35,
            repeat: -1,
            ease: "none"
        });
        gsap.to(grid, {
            x: "+=60",
            y: "+=60",
            scale: 1.1,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    };

    const initRandomBeams = () => {
        const hBeam = document.getElementById('h-beam');
        const vBeam = document.getElementById('v-beam');
        const grid = document.getElementById('solutions-grid');
        if (!hBeam || !vBeam || !grid) return;

        const animateH = () => {
            const row = Math.floor(Math.random() * 3); // 0, 1, 2
            const yPos = row === 0 ? "0%" : row === 1 ? "50%" : "100%";
            
            gsap.set(hBeam, { top: yPos, left: "-10%", opacity: 0 });
            gsap.to(hBeam, {
                left: "110%",
                opacity: 0.8,
                duration: 2 + Math.random() * 2,
                ease: "power1.inOut",
                onComplete: () => {
                    gsap.set(hBeam, { opacity: 0 });
                    setTimeout(animateH, Math.random() * 3000);
                }
            });
        };

        const animateV = () => {
            const col = Math.floor(Math.random() * 4); // 0, 1, 2, 3
            const xPos = col === 0 ? "0%" : col === 1 ? "33.3%" : col === 2 ? "66.6%" : "100%";
            
            gsap.set(vBeam, { left: xPos, top: "-10%", opacity: 0 });
            gsap.to(vBeam, {
                top: "110%",
                opacity: 0.8,
                duration: 2 + Math.random() * 2,
                ease: "power1.inOut",
                onComplete: () => {
                    gsap.set(vBeam, { opacity: 0 });
                    setTimeout(animateV, Math.random() * 3000);
                }
            });
        };

        animateH();
        setTimeout(animateV, 1500);
    };

    initRandomBeams();
    setupGridAnim("#right-grid-decoration");

    gsap.to(".layer-1", {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to(".layer-2", {
        y: -12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.3
    });
    gsap.to(".layer-3", {
        y: -6,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.6
    });
    gsap.to(".layer-4", {
        y: -3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.9
    });

    document.querySelectorAll('.solve-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const isEven = Array.from(card.parentNode.children).filter(c => c.classList.contains('solve-card')).indexOf(card) % 2 !== 0;
            gsap.to(card, {
                backgroundColor: isEven ? '#f1f5f9' : '#f8fafc',
                duration: 0.4,
                ease: "power2.out"
            });
        });
        card.addEventListener('mouseleave', () => {
            const isEven = Array.from(card.parentNode.children).filter(c => c.classList.contains('solve-card')).indexOf(card) % 2 !== 0;
            gsap.to(card, {
                backgroundColor: isEven ? '#f8fafc' : '#ffffff',
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    initGSAP();
});
