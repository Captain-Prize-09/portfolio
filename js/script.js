// Modern SPA implementation for Alex Carter's portfolio
// This script handles the SPA functionality, animations, and interactions

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Typed.js for hero section
  const typed = new Typed("#typed", {
    strings: [
      "Web Developer",
      "UI/UX Designer",
      "Full Stack Engineer",
      "Digital Creator",
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    backDelay: 1500,
  });

  // Initialize the SPA
  initSPA();

  // Hide the preloader after everything is loaded
  hidePreloader();
});

// Function to hide the preloader
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0"; // Fade out
    setTimeout(() => {
      preloader.style.display = "none"; // Then hide
    }, 500); // Match the transition duration
  }
}

// SPA initialization
function initSPA() {
  // Initialize navigation
  initNavigation();

  // Initialize portfolio filtering
  initPortfolioFiltering();

  // Initialize skill bars
  initSkillBars();

  // Initialize contact form
  initContactForm();

  // Initialize theme toggle
  initThemeToggle();

  // Initialize mobile menu toggle
  initMobileMenuToggle();

  // Initialize billing toggle for pricing section
  initBillingToggle();
}

// Navigation initialization
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("data-section");
      if (targetSection) {
        navigateToSection(targetSection);
      }
    });
  });
}

// Portfolio filtering initialization
function initPortfolioFiltering() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all filter buttons
      filterBtns.forEach((b) =>
        b.classList.remove("bg-primary-500", "text-white")
      );
      // Add active class to the clicked button
      this.classList.add("bg-primary-500", "text-white");
      this.classList.remove(
        "bg-gray-200",
        "",
        "hover:bg-primary-500",
        "hover:text-white"
      );

      const filter = this.getAttribute("data-filter");
      filterPortfolio(filter);
    });
  });
}

// Portfolio filtering function
function filterPortfolio(filter) {
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  portfolioItems.forEach((item) => {
    if (filter === "all" || item.getAttribute("data-category") === filter) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Skill bars initialization
function initSkillBars() {
  // This function is called on DOMContentLoaded, so the animation will run once.
  // If you want the animation to run when the section becomes visible (e.g., on scroll),
  // you'd need an Intersection Observer. For now, it animates on page load.
  const skillBars = document.querySelectorAll(".skill-bar");
  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    bar.style.width = width; // This triggers the CSS transition
  });
}

// Contact form initialization
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for your message! I will get back to you soon.");
      this.reset();
    });
  }
}

// Navigation function
function navigateToSection(targetSection) {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link");
  const transitionOverlay = document.getElementById("transition-overlay");

  // Start transition animation
  transitionOverlay.classList.remove("-translate-y-full");
  transitionOverlay.classList.add("curtain-down");

  setTimeout(() => {
    // Hide all sections
    sections.forEach((section) => {
      section.classList.remove("active", "section-fade-in");
    });

    // Show the target section
    const targetSectionEl = document.getElementById(targetSection);
    if (targetSectionEl) {
      targetSectionEl.classList.add("active", "section-fade-in");
      // Scroll to the top of the section (optional, depending on desired UX)
      targetSectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update active navigation link
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === targetSection) {
        link.classList.add("active");
      }
    });

    // End transition animation
    transitionOverlay.classList.remove("curtain-down");
    transitionOverlay.classList.add("curtain-up");
    setTimeout(() => {
      transitionOverlay.classList.remove("curtain-up");
      transitionOverlay.classList.add("-translate-y-full");
    }, 800); // Match curtainUp animation duration
  }, 400); // Half of curtainDown animation duration
}

// Smooth scrolling (currently handled by navigateToSection, but kept for potential direct use)
function smoothScroll(target) {
  const targetElement = document.getElementById(target);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth" });
  }
}

// Mobile menu toggle
function initMobileMenuToggle() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

// Theme toggle
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Set initial theme based on localStorage or system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    htmlElement.classList.add(savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.add("light"); // Default to light if no preference
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      htmlElement.classList.toggle("dark");
      htmlElement.classList.toggle("light"); // Ensure light class is also toggled for clarity
      localStorage.setItem(
        "theme",
        htmlElement.classList.contains("dark") ? "dark" : "light"
      );
    });
  }
}

// Billing toggle for pricing section
function initBillingToggle() {
  const billingToggle = document.getElementById("billing-toggle");
  const priceCards = document.querySelectorAll(".price-card");

  if (billingToggle && priceCards.length > 0) {
    billingToggle.addEventListener("change", function () {
      priceCards.forEach((card) => {
        const priceElement = card.querySelector(".text-4xl.font-bold");
        const periodElement = card.querySelector(".text-gray-500.ml-2");

        if (this.checked) {
          // Yearly selected
          // Assuming monthly prices are hardcoded in HTML: $299, $599, $999
          // Calculate yearly price (20% off)
          let currentPrice = parseInt(
            priceElement.textContent.replace("$", "")
          );
          let yearlyPrice = Math.round(currentPrice * 12 * 0.8);
          priceElement.textContent = `$${yearlyPrice}`;
          periodElement.textContent = "/year";
        } else {
          // Monthly selected
          // Reset to original monthly prices
          let originalPrice;
          if (card.querySelector("h3").textContent.includes("Basic")) {
            originalPrice = 299;
          } else if (
            card.querySelector("h3").textContent.includes("Standard")
          ) {
            originalPrice = 599;
          } else if (card.querySelector("h3").textContent.includes("Premium")) {
            originalPrice = 999;
          }
          priceElement.textContent = `$${originalPrice}`;
          periodElement.textContent = "/month";
        }
      });
    });
  }
}
