class ModernSPA {
  constructor() {
    this.currentSection = "home"; // Default active section
    this.transitionOverlay = document.getElementById("transition-overlay");
    this.isTransitioning = false;
    this.initEventListeners();
    this.initHistoryListener();
    this.initializeSections();
  }

  initializeSections() {
    let initialSection = "home";

    // 1. Check URL hash (priority for incoming links)
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      initialSection = hash;
      // Clear the hash from the URL immediately for a clean look
      history.replaceState(
        { section: initialSection },
        "",
        window.location.pathname,
      );
    }
    // 2. Check LocalStorage (restore previous session)
    else {
      const savedSection = localStorage.getItem("currentSection");
      if (savedSection && document.getElementById(savedSection)) {
        initialSection = savedSection;
      }
    }

    this.currentSection = initialSection;

    // Ensure only the initial section is active on load
    document.querySelectorAll(".section").forEach((section) => {
      if (section.id !== this.currentSection) {
        section.classList.remove("active");
      } else {
        section.classList.add("active");
      }
    });
    this.updateNavigation(this.currentSection);

    // Set initial state so back button works correctly
    if (!history.state) {
      history.replaceState(
        { section: this.currentSection },
        "",
        window.location.pathname,
      );
    }
  }

  initHistoryListener() {
    window.addEventListener("popstate", (event) => {
      let targetSection = event.state ? event.state.section : null;

      // If no state (e.g., initial page load in history), fallback to home or local storage
      if (!targetSection) {
        targetSection = "home";
      }

      // Navigate without updating history since we are already traversing it
      this.navigateToSection(targetSection, false);
    });
  }

  initEventListeners() {
    // Navigation links (buttons)
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute("data-section");
        if (
          targetSection &&
          targetSection !== this.currentSection &&
          !this.isTransitioning
        ) {
          this.navigateToSection(targetSection);
        }
      });
    });

    // Close section buttons
    document.querySelectorAll(".close-section-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const targetSection = button.getAttribute("data-target-section");
        if (
          targetSection &&
          targetSection !== this.currentSection &&
          !this.isTransitioning
        ) {
          this.navigateToSection(targetSection);
        }
      });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll("#mobile-menu .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        document.getElementById("mobile-menu").classList.add("hidden");
      });
    });

    // Dark/light theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        htmlElement.classList.toggle("dark");
        localStorage.setItem(
          "theme",
          htmlElement.classList.contains("dark") ? "dark" : "light",
        );
      });
    }

    // Check for saved theme preference
    if (localStorage.getItem("theme") === "light") {
      htmlElement.classList.remove("dark");
    }

    // Portfolio filtering
    const filterBtns = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Update active button
        filterBtns.forEach((b) => {
          b.classList.remove("bg-primary-500", "text-white");
          b.classList.add(
            "bg-gray-200",
            "",
            "hover:bg-primary-500",
            "hover:text-white",
          );
        });

        this.classList.add("bg-primary-500", "text-white");
        this.classList.remove(
          "bg-gray-200",
          "",
          "hover:bg-primary-500",
          "hover:text-white",
        );

        // Filter items
        const filter = this.getAttribute("data-filter");
        portfolioItems.forEach((item) => {
          if (
            filter === "all" ||
            item.getAttribute("data-category") === filter
          ) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });

    // Contact form submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Thank you for your message! I will get back to you soon.");
        this.reset();
      });
    }
  }

  async navigateToSection(targetSection, updateHistory = true) {
    if (this.isTransitioning) return;

    // If we are already on the target section, do nothing
    if (this.currentSection === targetSection) return;

    this.isTransitioning = true;

    // Update Browser History and Persistence
    if (updateHistory) {
      // Clean URL: just the pathname, no hash
      history.pushState(
        { section: targetSection },
        "",
        window.location.pathname,
      );
      // Save to localStorage so refresh works
      localStorage.setItem("currentSection", targetSection);
    }

    // Start curtain down animation
    this.transitionOverlay.classList.remove("curtain-up");
    this.transitionOverlay.classList.add("curtain-down");

    // Wait for curtain to cover screen
    await this.sleep(400);

    // Hide current section and show target section
    this.hideCurrentSection();
    this.showTargetSection(targetSection);
    this.updateNavigation(targetSection);

    // Wait a bit then start curtain up animation
    await this.sleep(100);

    this.transitionOverlay.classList.remove("curtain-down");
    this.transitionOverlay.classList.add("curtain-up");

    // Update current section
    this.currentSection = targetSection;

    // Trigger skill bar animation if navigating to about/skills section
    if (targetSection === "about" || targetSection === "skills") {
      this.animateSkills();
    }

    // Wait for curtain to fully retract
    await this.sleep(800);

    this.isTransitioning = false;
  }

  hideCurrentSection() {
    const currentSectionEl = document.getElementById(this.currentSection);
    if (currentSectionEl) {
      currentSectionEl.classList.remove("active", "section-fade-in");
    }
  }

  showTargetSection(targetSection) {
    const targetSectionEl = document.getElementById(targetSection);
    if (targetSectionEl) {
      targetSectionEl.classList.add("active", "section-fade-in");

      // Remove fade-in class after animation completes
      setTimeout(() => {
        targetSectionEl.classList.remove("section-fade-in");
      }, 900);
    }
  }

  updateNavigation(targetSection) {
    // Update all navigation links
    document.querySelectorAll(".nav-link").forEach((link) => {
      const section = link.getAttribute("data-section");
      if (section === targetSection) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Animate skill bars
  animateSkills() {
    const skillBars = document.querySelectorAll(".skill-bar");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute("data-width");
            // Reset width to 0 before animating to ensure re-animation
            bar.style.width = "0%";
            // A small delay to allow the reset to render before animating
            setTimeout(() => {
              bar.style.width = width;
            }, 50);
            // Unobserve after animation to prevent re-triggering
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.1 },
    );

    skillBars.forEach((bar) => {
      observer.observe(bar);
    });
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Hide preloader
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, 1000);

  // Initialize Typed.js
  const typed = new Typed("#typed", {
    strings: [
      "Backend Developer",
      "Modern Web Developer",
      "System Administrator",
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    backDelay: 1500,
  });

  // Initialize the SPA
  new ModernSPA();
});
