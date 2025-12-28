// 1. Kinetic Smooth Scroll
const lenis = new Lenis({ lerp: 0.04, wheelMultiplier: 0.9, smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 2. Clock Logic (The Technical Polish)
function updateClock() {
    const now = new Date();
    document.getElementById('digital-clock').innerText = now.toLocaleTimeString('en-GB');
}
setInterval(updateClock, 1000);

// 3. Magnetic Cursor with Elasticity
const dot = document.querySelector('#cursor-dot');
const ring = document.querySelector('#cursor-ring');
gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

window.addEventListener('mousemove', e => {
    gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
});

// 4. THE STAGE ZOOM (The "Boutique" effect)
gsap.to(".hero-zoom-wrap", {
    scale: 0.5,
    opacity: 0,
    scrollTrigger: {
        trigger: ".hero-stage",
        start: "top top",
        end: "bottom center",
        scrub: true
    }
});

// 5. VELOCITY-BASED SKEW (Pulling the images)
let proxy = { skew: 0 };
let skewSetter = gsap.quickSetter(".skew-img", "skewY", "deg");
let clamp = gsap.utils.clamp(-15, 15);

ScrollTrigger.create({
  onUpdate: (self) => {
    let skew = clamp(self.getVelocity() / -400);
    if (Math.abs(skew) > Math.abs(proxy.skew)) {
      proxy.skew = skew;
      gsap.to(proxy, {skew: 0, duration: 1, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
    }
  }
});

// 6. Project Text Reveal
document.querySelectorAll(".project-card-v2").forEach(card => {
    gsap.from(card.querySelector("h2"), {
        y: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
        }
    });
});

// Add this to your existing script.js

// 7. MAGNETIC CV BUTTON
const cvBtn = document.querySelector('.cv-button');
cvBtn.addEventListener('mousemove', (e) => {
    const rect = cvBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(cvBtn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
    });
});

cvBtn.addEventListener('mouseleave', () => {
    gsap.to(cvBtn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
});

// 8. FOOTER REVEAL
gsap.from(".f-col a", {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".main-footer",
        start: "top 90%"
    }
});

// 9. CURSOR SCALE ON HOVER
const interactiveElements = document.querySelectorAll('a, .project-card-v2');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(ring, { scale: 1.5, background: "rgba(255,255,255,0.1)", duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(ring, { scale: 1, background: "transparent", duration: 0.3 });
    });
});