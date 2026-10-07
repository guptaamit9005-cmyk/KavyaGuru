/**
 * ==========================================================================
 * KAVYA GURU — Client-Side Hash Router
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const Router = {
  currentRoute: "home",
  routes: ["home", "poetry", "notes", "videos", "courses", "career", "community", "admin", "profile"],

  init() {
    window.addEventListener("hashchange", () => this.handleHashChange());
    this.handleHashChange();
  },

  handleHashChange() {
    const rawHash = window.location.hash.replace("#", "").trim();
    const targetRoute = this.routes.includes(rawHash) ? rawHash : "home";
    this.navigate(targetRoute, false);
  },

  navigate(routeName, updateHash = true) {
    if (!this.routes.includes(routeName)) routeName = "home";
    this.currentRoute = routeName;

    if (updateHash && window.location.hash !== `#${routeName}`) {
      window.location.hash = `#${routeName}`;
      return;
    }

    // Hide all view containers
    document.querySelectorAll(".kg-view-section").forEach(sec => {
      sec.classList.add("kg-hidden");
    });

    // Show target view container
    const activeSection = document.getElementById(`view-${routeName}`);
    if (activeSection) {
      activeSection.classList.remove("kg-hidden");
      activeSection.classList.remove("kg-animate-fade");
      // Trigger reflow to restart animation
      void activeSection.offsetWidth;
      activeSection.classList.add("kg-animate-fade");
    }

    // Update active nav links (Desktop + Mobile)
    document.querySelectorAll(".kg-nav-link").forEach(link => {
      const target = link.getAttribute("data-route");
      if (target === routeName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    document.querySelectorAll(".kg-mobile-nav-item").forEach(link => {
      const target = link.getAttribute("data-route");
      if (target === routeName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update Browser title with official branding
    const routeTitles = {
      home: "Kavya Guru — Read • Learn • Grow",
      poetry: "Kavya Manch (Poetry) — Kavya Guru",
      notes: "Educational Notes Vault — Kavya Guru",
      videos: "YouTube Learning Hub — Kavya Guru",
      courses: "Google Meet Live Courses — Kavya Guru",
      career: "Career Guidance & Roadmaps — Kavya Guru",
      community: "Kavya Guru Charcha (Community) — Kavya Guru",
      admin: "Admin Dashboard — Kavya Guru",
      profile: "Student Profile & Library — Kavya Guru"
    };

    document.title = routeTitles[routeName] || "Kavya Guru — Read • Learn • Grow";

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Render route specific dynamic views if needed
    if (window.App && typeof window.App.onRouteEnter === "function") {
      window.App.onRouteEnter(routeName);
    }
  }
};
