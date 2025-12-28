gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Scroll (Lenis)
const lenis = new Lenis({ lerp: 0.05 });
lenis.on('scroll', ScrollTrigger.update);
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 2. Custom Cursor
const dot = document.querySelector('#cursor-dot');
const outline = document.querySelector('#cursor-outline');
window.addEventListener("mousemove", e => {
    gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(outline, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.4, ease: "power2.out" });
});

// 3. Digital Clock
function updateClock() {
    const clock = document.getElementById('digital-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString('en-GB');
}
setInterval(updateClock, 1000);

// 4. Bento Card Reveal Animation
gsap.from(".reveal-card", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.1,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 80%",
    }
});

// 5. Header Text Reveal
const split = new SplitType('.reveal-type', { types: 'chars' });
gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    stagger: 0.05,
    duration: 1,
    ease: "back.out(1.7)"
});

// 6. Sidebar active state logic (Visual only)
const vNavLinks = document.querySelectorAll('.v-nav a');
vNavLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(outline, { scale: 1.5, borderColor: "rgba(255, 60, 0, 0.5)", duration: 0.3 });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(outline, { scale: 1, borderColor: "rgba(255, 255, 255, 0.2)", duration: 0.3 });
    });
});