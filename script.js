const root = document.documentElement;
const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const navMenuButton = document.querySelector(".nav-menu");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const themeToggle = document.querySelector("[data-theme-toggle]");
const contactSection = document.querySelector("#contact");
const currentPage = body.dataset.page || "home";

const applyTheme = (theme, persist = true) => {
  root.setAttribute("data-theme", theme);

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }

  if (persist) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Ignore storage errors and keep the current theme active.
    }
  }
};

const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const syncThemeFromSystem = () => {
  let storedTheme = null;

  try {
    storedTheme = localStorage.getItem("theme");
  } catch (error) {
    storedTheme = null;
  }

  if (storedTheme !== "light" && storedTheme !== "dark") {
    applyTheme(systemThemeQuery.matches ? "dark" : "light", false);
  }
};

applyTheme(root.getAttribute("data-theme") || "light", false);
syncThemeFromSystem();

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

if (typeof systemThemeQuery.addEventListener === "function") {
  systemThemeQuery.addEventListener("change", syncThemeFromSystem);
}

navMenuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  navMenuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    navMenuButton?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    body.classList.remove("menu-open");
    navMenuButton?.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    body.classList.remove("menu-open");
    navMenuButton?.setAttribute("aria-expanded", "false");
  }
});

const setNavState = (activePage) => {
  navLinks.forEach((link) => {
    const linkPage = link.dataset.pageLink;
    const isActive = linkPage === activePage;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

setNavState(currentPage);

if (contactSection) {
  const contactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setNavState("contact");
        } else {
          setNavState(currentPage);
        }
      });
    },
    {
      rootMargin: "-40% 0px -45% 0px",
      threshold: 0.1
    }
  );

  contactObserver.observe(contactSection);
}

const brandMark = document.querySelector(".brand-mark");
const brandIcon = document.querySelector(".brand-icon");

if (brandMark && brandIcon && finePointer && !reduceMotion) {
  const resetBrandIcon = () => {
    brandMark.style.setProperty("--logo-rx", "0deg");
    brandMark.style.setProperty("--logo-ry", "0deg");
    brandMark.style.setProperty("--logo-tx", "0px");
    brandMark.style.setProperty("--logo-ty", "0px");
  };

  brandMark.addEventListener("pointermove", (event) => {
    const rect = brandMark.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = Math.max(-12, Math.min(12, x * 24));
    const rotateX = Math.max(-12, Math.min(12, -y * 24));
    const translateX = Math.max(-4, Math.min(4, x * 8));
    const translateY = Math.max(-4, Math.min(4, y * 8));

    brandMark.style.setProperty("--logo-rx", `${rotateX}deg`);
    brandMark.style.setProperty("--logo-ry", `${rotateY}deg`);
    brandMark.style.setProperty("--logo-tx", `${translateX}px`);
    brandMark.style.setProperty("--logo-ty", `${translateY}px`);
  });

  brandMark.addEventListener("pointerleave", resetBrandIcon);
  resetBrandIcon();
}

const hoverCards = [...document.querySelectorAll(".hover-card")];

if (finePointer && !reduceMotion) {
  hoverCards.forEach((card) => {
    const media = card.querySelector(".card-media img, .feature-image img");

    const resetCard = () => {
      card.style.setProperty("--card-rotate-x", "0deg");
      card.style.setProperty("--card-rotate-y", "0deg");
      card.style.setProperty("--card-lift", "0px");
      card.style.setProperty("--card-scale", "1");
      if (media) {
        media.style.transform = "scale(1)";
        media.style.filter = "brightness(0.9) contrast(1)";
      }
    };

    resetCard();

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = Math.max(-4, Math.min(4, x * 8));
      const rotateX = Math.max(-2, Math.min(2, -y * 4));

      card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
      card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
      card.style.setProperty("--card-lift", "-4px");
      card.style.setProperty("--card-scale", "1.01");

      if (media) {
        media.style.transform = "scale(1.04)";
        media.style.filter = "brightness(1.04) contrast(1.04)";
      }
    });

    card.addEventListener("pointerleave", resetCard);
  });
}

const timeline = document.querySelector("[data-timeline]");

if (timeline) {
  const items = [...timeline.querySelectorAll("[data-timeline-item]")];
  let lockedIndex = null;

  const openTimelineItem = (index) => {
    items.forEach((item, itemIndex) => {
      const button = item.querySelector(".timeline-dot");
      const isOpen = itemIndex === index;
      item.classList.toggle("is-open", isOpen);
      button?.setAttribute("aria-expanded", String(isOpen));
    });
  };

  const previewTimelineItem = (index) => {
    if (window.innerWidth > 860 && finePointer && lockedIndex === null) {
      openTimelineItem(index);
    }
  };

  openTimelineItem(0);

  items.forEach((item, index) => {
    const button = item.querySelector(".timeline-dot");

    item.addEventListener("pointerenter", () => previewTimelineItem(index));
    item.addEventListener("pointermove", () => previewTimelineItem(index));
    button?.addEventListener("pointerenter", () => previewTimelineItem(index));
    button?.addEventListener("pointermove", () => previewTimelineItem(index));
    button?.addEventListener("focus", () => previewTimelineItem(index));

    button?.addEventListener("click", () => {
      if (lockedIndex === index) {
        lockedIndex = null;
        openTimelineItem(index);
      } else {
        lockedIndex = index;
        openTimelineItem(index);
      }
    });
  });

  timeline.addEventListener("pointerleave", () => {
    if (window.innerWidth > 860 && lockedIndex === null) {
      openTimelineItem(0);
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 860 && lockedIndex !== null && !timeline.contains(event.target)) {
      lockedIndex = null;
      openTimelineItem(0);
    }
  });
}

const soccerBall = document.querySelector("[data-soccer-ball]");

if (soccerBall) {
  const core = soccerBall.querySelector(".soccer-ball-core");
  let rotationX = -18;
  let rotationY = 26;
  let velocityX = 0;
  let velocityY = 0;
  let dragging = false;
  let hasInteracted = false;
  let pointerId = null;
  let lastX = 0;
  let lastY = 0;

  const renderBall = () => {
    core.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  };

  const animateBall = () => {
    if (!dragging) {
      if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01) {
        rotationX += velocityX;
        rotationY += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;
      } else if (!hasInteracted && !reduceMotion) {
        rotationY += 0.08;
      }

      renderBall();
    }

    window.requestAnimationFrame(animateBall);
  };

  const clampRotationX = (value) => Math.max(-45, Math.min(45, value));

  soccerBall.addEventListener("pointerdown", (event) => {
    dragging = true;
    hasInteracted = true;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    velocityX = 0;
    velocityY = 0;
    soccerBall.setPointerCapture(pointerId);
  });

  soccerBall.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;

    rotationY += deltaX * 0.45;
    rotationX = clampRotationX(rotationX - deltaY * 0.32);
    velocityY = deltaX * 0.03;
    velocityX = -deltaY * 0.02;
    lastX = event.clientX;
    lastY = event.clientY;

    renderBall();
  });

  const releaseBall = (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }

    dragging = false;
    soccerBall.releasePointerCapture(pointerId);
    pointerId = null;
  };

  soccerBall.addEventListener("pointerup", releaseBall);
  soccerBall.addEventListener("pointercancel", releaseBall);
  soccerBall.addEventListener("pointerleave", (event) => {
    if (dragging && event.pointerId === pointerId) {
      releaseBall(event);
    }
  });

  renderBall();
  animateBall();
}
