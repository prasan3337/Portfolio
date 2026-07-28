// --- CONSTANTS & STATE ---
const TYPEWRITER_PHRASES = [
  "Machine Learning",
  "Deep Learning",
  "Cloud Computing",
  "Data Structures & Algorithms"
];

let typewriterIndex = 0;
let phraseIndex = 0;
let isDeleting = false;
let typewriterTimeout = null;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
  initParticles();
  initStickyHeader();
  initMobileMenu();
  initSkillProgressAnimation();
  initProjectFilters();
  initScrollSpy();
});

// --- TYPEWRITER EFFECT ---
function initTypewriter() {
  const target = document.getElementById("typewriterText");
  if (!target) return;

  const currentPhrase = TYPEWRITER_PHRASES[typewriterIndex];
  
  if (isDeleting) {
    target.textContent = currentPhrase.substring(0, phraseIndex - 1);
    phraseIndex--;
  } else {
    target.textContent = currentPhrase.substring(0, phraseIndex + 1);
    phraseIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && phraseIndex === currentPhrase.length) {
    speed = 1800; // pause at the end of the phrase
    isDeleting = true;
  } else if (isDeleting && phraseIndex === 0) {
    isDeleting = false;
    typewriterIndex = (typewriterIndex + 1) % TYPEWRITER_PHRASES.length;
    speed = 400; // pause before starting next word
  }

  typewriterTimeout = setTimeout(initTypewriter, speed);
}

// --- PARTICLE BACKGROUND ---
function initParticles() {
  const canvas = document.getElementById("particlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  const numberOfParticles = 65;

  // Set canvas size
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasSize();
  window.addEventListener("resize", () => {
    setCanvasSize();
    createParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.color = Math.random() > 0.5 ? "rgba(0, 242, 254, 0.45)" : "rgba(127, 0, 255, 0.35)";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
          + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        
        if (distance < (canvas.width / 8) * (canvas.height / 8)) {
          opacityValue = 1 - (distance / 20000);
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.08})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

// --- STICKY NAV HEADER ---
function initStickyHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// --- MOBILE MENU TOGGLE ---
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = menuToggle.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.className = "fa-solid fa-xmark";
    } else {
      icon.className = "fa-solid fa-bars";
    }
  });

  // Close menu when clicking link
  const links = navLinks.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const icon = menuToggle.querySelector("i");
      icon.className = "fa-solid fa-bars";
    });
  });
}

// --- SKILLS TAB INTERACTION ---
function switchSkillTab(event, tabId) {
  // Hide all panels
  const panels = document.querySelectorAll(".skills-panel");
  panels.forEach(panel => panel.classList.remove("active"));

  // Deactivate all buttons
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Show active panel & button
  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");

  // Re-trigger bar animation on switch
  triggerBarAnimation(document.getElementById(tabId));
}

function triggerBarAnimation(panel) {
  const bars = panel.querySelectorAll(".skill-progress-fill");
  bars.forEach(bar => {
    bar.style.width = "0"; // reset
    setTimeout(() => {
      const targetWidth = bar.getAttribute("data-width");
      bar.style.width = targetWidth;
    }, 100);
  });
}

function initSkillProgressAnimation() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activePanel = document.querySelector(".skills-panel.active");
        if (activePanel) {
          triggerBarAnimation(activePanel);
        }
        observer.unobserve(skillsSection); // animate only once initially
      }
    });
  }, { threshold: 0.15 });

  observer.observe(skillsSection);
}

// --- PROJECT GRID FILTERS ---
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle active classes
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        
        if (filterValue === "all" || cardCategory === filterValue) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 350);
        }
      });
    });
  });
}

// --- SCROLL SPY ACTIVE NAV LINK ---
function initScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let currentId = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  });
}

// --- SCROLL TO TOP ---
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// --- CONTACT FORM HANDLER ---
function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const submitBtn = form.querySelector(".submit-btn");

  // Visual submission effect
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  formMessage.className = "form-message";
  formMessage.style.display = "none";

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';

    // Simulate success
    formMessage.textContent = "Thank you for reaching out! Your message was submitted successfully.";
    formMessage.classList.add("success");
    form.reset();
  }, 1500);
}
