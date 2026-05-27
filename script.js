const header = document.querySelector(".site-header");

const syncHeader = () => {
  const active = window.scrollY > 60;
  header.style.background = active
    ? "rgba(13, 19, 32, 0.92)"
    : "linear-gradient(to bottom, rgba(8, 12, 19, 0.78), rgba(8, 12, 19, 0))";
  header.style.backdropFilter = active ? "blur(16px)" : "none";
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });
