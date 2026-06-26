const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);

        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    {
      rootMargin: "-48% 0px -48% 0px",
      threshold: 0.01
    }
  );

  sections.forEach((section) => observer.observe(section));
}
