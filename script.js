const stats = document.querySelectorAll(".stat-num");
const revealElements = document.querySelectorAll("[data-reveal]");
const tiltCards = document.querySelectorAll("[data-tilt]");
const glow = document.querySelector(".glow");
const playDemo = document.getElementById("playDemo");
const themeToggle = document.getElementById("themeToggle");
const copyEmail = document.getElementById("copyEmail");

const accentThemes = [
  { accent: "#5ef3ff", accent2: "#7b61ff" },
  { accent: "#ff7ad9", accent2: "#ffb347" },
  { accent: "#8cff6b", accent2: "#5ef3ff" },
];

let themeIndex = 0;

const setAccent = (theme) => {
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--accent-2", theme.accent2);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => observer.observe(el));

const animateCount = (element) => {
  const target = Number(element.dataset.count || 0);
  let current = 0;
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    current = Math.floor(progress * target);
    element.textContent = current;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

stats.forEach((stat) => statsObserver.observe(stat));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const handleTilt = (event, card) => {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  const rotateX = clamp(-y * 16, -12, 12);
  const rotateY = clamp(x * 16, -12, 12);
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => handleTilt(event, card));
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});

window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 60;
  const y = (event.clientY / window.innerHeight - 0.5) * 60;
  glow.style.transform = `translate(${x}px, ${y}px)`;
});

playDemo.addEventListener("click", () => {
  document.body.classList.toggle("pulse-mode");
});

themeToggle.addEventListener("click", () => {
  themeIndex = (themeIndex + 1) % accentThemes.length;
  setAccent(accentThemes[themeIndex]);
});

copyEmail.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("hello@namakamu.com");
    copyEmail.textContent = "Tersalin!";
    setTimeout(() => (copyEmail.textContent = "Salin Email"), 1800);
  } catch (error) {
    copyEmail.textContent = "Gagal";
    setTimeout(() => (copyEmail.textContent = "Salin Email"), 1800);
  }
});

const demoInterval = setInterval(() => {
  if (document.body.classList.contains("pulse-mode")) {
    document.body.classList.toggle("pulse-glow");
  }
}, 1200);

window.addEventListener("beforeunload", () => clearInterval(demoInterval));
