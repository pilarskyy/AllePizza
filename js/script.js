document.addEventListener("DOMContentLoaded", () => {
  // ===== 01. FOOTER YEAR =====
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ===== 02. MOBILE NAV TOGGLE =====
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const navScrim = document.querySelector("[data-nav-scrim]");

  const closeNav = () => {
    nav.classList.remove("is-open");
    navScrim.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navScrim.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navScrim.addEventListener("click", closeNav);

    nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // ===== 03. STICKY HEADER SHADOW ON SCROLL =====
  const header = document.querySelector("[data-header]");
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle("header--scrolled", window.scrollY > 8);
    };
    toggleHeaderShadow();
    window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
  }

  // ===== 04. MENU CATEGORY TABS =====
  const tabButtons = document.querySelectorAll("[data-tab-target]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tabTarget;

      tabButtons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.tabPanel === target);
      });
    });
  });

  // ===== 05. PIZZA FILTER CHIPS =====
  const filterChips = document.querySelectorAll("[data-filter-chips] .filter-chip");
  const pizzaCards = document.querySelectorAll("[data-pizza-grid] .pizza-card");
  const filterEmpty = document.querySelector("[data-filter-empty]");

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;

      filterChips.forEach((c) => c.classList.toggle("is-active", c === chip));

      let visibleCount = 0;
      pizzaCards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        const show = filter === "wszystkie" || tags.includes(filter);
        card.hidden = !show;
        if (show) visibleCount += 1;
      });

      if (filterEmpty) {
        filterEmpty.hidden = visibleCount !== 0;
      }
    });
  });

  // ===== 06. ALLERGEN TOOLTIPS (tap-to-toggle on touch, hover/focus on desktop via CSS) =====
  const allergenWraps = document.querySelectorAll(".pizza-card__allergens-wrap");

  const closeAllergenTooltips = (except) => {
    allergenWraps.forEach((wrap) => {
      if (wrap === except) return;
      wrap.classList.remove("is-open");
      wrap.querySelector(".allergen-trigger")?.setAttribute("aria-expanded", "false");
    });
  };

  allergenWraps.forEach((wrap) => {
    const trigger = wrap.querySelector(".allergen-trigger");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = wrap.classList.contains("is-open");
      closeAllergenTooltips();
      wrap.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", () => closeAllergenTooltips());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllergenTooltips();
  });
});
