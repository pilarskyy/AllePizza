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
      const showAll = target === "wszystko";

      tabButtons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });

      tabPanels.forEach((panel) => {
        const isMatch = showAll || panel.dataset.tabPanel === target;
        panel.classList.toggle("is-active", isMatch);
        panel.classList.toggle("is-all-view", showAll);
      });
    });
  });

  // ===== 05. PIZZA FILTER CHIPS + SEARCH =====
  const filterChips = document.querySelectorAll("[data-filter-chips] .filter-chip");
  const pizzaCards = document.querySelectorAll("[data-pizza-grid] .pizza-card");
  const filterEmpty = document.querySelector("[data-filter-empty]");
  const pizzaSearchInput = document.querySelector("[data-pizza-search]");
  const SEARCH_MIN_LENGTH = 4;

  let activeTagFilter = "wszystkie";

  // Cache each card's searchable text (name + ingredients) once up front
  // instead of re-reading the DOM on every keystroke.
  const pizzaSearchIndex = Array.from(pizzaCards).map((card) => {
    const name = card.querySelector(".pizza-card__name")?.textContent || "";
    const ingredients = card.querySelector(".pizza-card__ingredients")?.textContent || "";
    return { card, text: (name + " " + ingredients).toLowerCase() };
  });

  const applyPizzaVisibility = () => {
    const query = pizzaSearchInput ? pizzaSearchInput.value.trim().toLowerCase() : "";
    const terms = query.length >= SEARCH_MIN_LENGTH ? query.split(/[\s,]+/).filter(Boolean) : [];

    let visibleCount = 0;

    pizzaSearchIndex.forEach(({ card, text }) => {
      const tags = card.dataset.tags.split(" ");
      const matchesTag = activeTagFilter === "wszystkie" || tags.includes(activeTagFilter);

      // Every typed term must appear somewhere in the name/ingredients —
      // a pizza matching only some of them isn't shown at all.
      const matchesSearch = terms.length === 0 || terms.every((term) => text.includes(term));

      const show = matchesTag && matchesSearch;
      card.hidden = !show;
      // All visible matches satisfy every term equally, so rank the
      // closest ones first: shorter ingredient text means fewer "extra"
      // ingredients beyond what was searched for.
      card.style.order = show && terms.length ? String(text.length) : "";
      if (show) visibleCount += 1;
    });

    if (filterEmpty) {
      filterEmpty.hidden = visibleCount !== 0;
    }
  };

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeTagFilter = chip.dataset.filter;
      filterChips.forEach((c) => c.classList.toggle("is-active", c === chip));
      applyPizzaVisibility();
    });
  });

  if (pizzaSearchInput) {
    pizzaSearchInput.addEventListener("input", applyPizzaVisibility);
  }

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
