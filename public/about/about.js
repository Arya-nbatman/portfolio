gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Scroll
const lenis = new Lenis({ lerp: 0.05 });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Cursor
const dot = document.querySelector("#cursor-dot");
const outline = document.querySelector("#cursor-outline");
window.addEventListener("mousemove", (e) => {
  gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
  gsap.to(outline, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.4 });
});

// 3. Digital Clock
setInterval(() => {
  document.getElementById("digital-clock").innerText =
    new Date().toLocaleTimeString("en-GB");
}, 1000);

// 4. Staggered Entrance Animations
gsap.from(".main-portrait", {
  scale: 1.2,
  filter: "grayscale(1) brightness(0)",
  duration: 2,
  ease: "power4.out",
});

gsap.from(".phil-item", {
  y: 50,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: ".philosophy",
    start: "top 80%",
  },
});

gsap.from(".stack-box", {
  opacity: 0,
  y: 30,
  stagger: 0.1,
  duration: 0.8,
  scrollTrigger: {
    trigger: ".stack-grid",
    start: "top 85%",
  },
});

// 5. Bio Text Reveal
const bioSplit = new SplitType(".reveal-type", { types: "words" });
gsap.from(bioSplit.words, {
  opacity: 0.2,
  stagger: 0.05,
  duration: 1,
  ease: "power2.out",
});

// Add these to your existing about.js

// 6. Image Parallax
gsap.to(".main-portrait", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".profile-hero",
    start: "top top",
    scrub: true,
  },
});

// 7. Stack Reveal
gsap.from(".stack-item", {
  opacity: 0,
  scale: 0.9,
  y: 30,
  stagger: 0.1,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".stack-bento",
    start: "top 80%",
  },
});

// 8. Hover Interaction for Stack Items
const stackItems = document.querySelectorAll(".stack-item");
stackItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    gsap.to(outline, {
      scale: 2,
      background: "rgba(255, 60, 0, 0.1)",
      borderColor: "transparent",
      duration: 0.3,
    });
  });
  item.addEventListener("mouseleave", () => {
    gsap.to(outline, {
      scale: 1,
      background: "transparent",
      borderColor: "rgba(255,255,255,0.2)",
      duration: 0.3,
    });
  });
});
