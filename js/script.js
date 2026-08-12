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

  const pizzaSearchClear = document.querySelector("[data-pizza-search-clear]");

  const toggleSearchClear = () => {
    if (pizzaSearchClear) pizzaSearchClear.hidden = !pizzaSearchInput.value;
  };

  if (pizzaSearchInput) {
    pizzaSearchInput.addEventListener("input", () => {
      applyPizzaVisibility();
      toggleSearchClear();
    });
  }

  if (pizzaSearchClear) {
    pizzaSearchClear.addEventListener("click", () => {
      pizzaSearchInput.value = "";
      applyPizzaVisibility();
      toggleSearchClear();
      pizzaSearchInput.focus();
    });
  }

  const filterReset = document.querySelector("[data-filter-reset]");
  if (filterReset) {
    filterReset.addEventListener("click", () => {
      activeTagFilter = "wszystkie";
      filterChips.forEach((c) => c.classList.toggle("is-active", c.dataset.filter === "wszystkie"));
      if (pizzaSearchInput) pizzaSearchInput.value = "";
      applyPizzaVisibility();
      toggleSearchClear();
    });
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

  // ===== 07. CALL MODAL (choose phone number) =====
  const callToggles = document.querySelectorAll("[data-call-toggle]");
  const callModal = document.querySelector("[data-call-modal]");
  const callModalPanel = document.querySelector(".call-modal__panel");
  const callModalScrim = document.querySelector("[data-call-modal-scrim]");
  const callModalClose = document.querySelector("[data-call-modal-close]");
  let callModalLastFocused = null;

  const getCallModalFocusable = () =>
    Array.from(callModalPanel.querySelectorAll("a[href], button:not([disabled])"));

  const openCallModal = () => {
    callModalLastFocused = document.activeElement;
    callModal.classList.add("is-open");
    callToggles.forEach((toggle) => toggle.setAttribute("aria-expanded", "true"));
    const focusable = getCallModalFocusable();
    if (focusable.length) focusable[0].focus();
  };

  const closeCallModal = () => {
    callModal.classList.remove("is-open");
    callToggles.forEach((toggle) => toggle.setAttribute("aria-expanded", "false"));
    if (callModalLastFocused) callModalLastFocused.focus();
  };

  if (callToggles.length && callModal) {
    callToggles.forEach((toggle) => toggle.addEventListener("click", openCallModal));

    callModalScrim.addEventListener("click", closeCallModal);
    callModalClose.addEventListener("click", closeCallModal);

    document.addEventListener("keydown", (e) => {
      if (!callModal.classList.contains("is-open")) return;

      if (e.key === "Escape") {
        closeCallModal();
        return;
      }

      // Trap Tab focus inside the dialog while it's open.
      if (e.key === "Tab") {
        const focusable = getCallModalFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ===== 08. BACK TO TOP =====
  const backToTopBtn = document.querySelector("[data-back-to-top]");
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      backToTopBtn.classList.toggle("is-visible", window.scrollY > 600);
    };
    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener("click", () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  // ===== 09. CATERING PACKAGE CAROUSEL (mobile, looping) =====
  const packageGrid = document.querySelector("[data-package-grid]");
  const packagePrev = document.querySelector("[data-package-prev]");
  const packageNext = document.querySelector("[data-package-next]");

  if (packageGrid && packagePrev && packageNext) {
    const carouselQuery = window.matchMedia("(max-width: 640px)");
    const originalCards = Array.from(packageGrid.children);
    let clonesAdded = false;

    const addClones = () => {
      if (clonesAdded || originalCards.length < 2) return;
      const firstClone = originalCards[0].cloneNode(true);
      const lastClone = originalCards[originalCards.length - 1].cloneNode(true);
      [firstClone, lastClone].forEach((clone) => {
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
      });
      packageGrid.insertBefore(lastClone, originalCards[0]);
      packageGrid.appendChild(firstClone);
      clonesAdded = true;
    };

    const removeClones = () => {
      if (!clonesAdded) return;
      packageGrid.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
      clonesAdded = false;
    };

    const scrollToIndex = (index, smooth = true) => {
      const card = packageGrid.children[index];
      if (!card) return;
      packageGrid.scrollTo({
        left: card.offsetLeft - (packageGrid.clientWidth - card.clientWidth) / 2,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    const currentIndex = () => {
      const children = Array.from(packageGrid.children);
      const center = packageGrid.scrollLeft + packageGrid.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(childCenter - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      return closest;
    };

    // When a swipe/scroll settles on a clone (index 0 or the last child),
    // jump instantly to the matching real card so it feels like an
    // endless loop instead of hitting a wall.
    const handleLoopEdge = () => {
      const idx = currentIndex();
      const lastRealIndex = packageGrid.children.length - 2;
      if (idx === 0) {
        scrollToIndex(lastRealIndex, false);
      } else if (idx === packageGrid.children.length - 1) {
        scrollToIndex(1, false);
      }
    };

    let scrollEndTimer;
    packageGrid.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(handleLoopEdge, 150);
      },
      { passive: true }
    );

    packagePrev.addEventListener("click", () => scrollToIndex(currentIndex() - 1));
    packageNext.addEventListener("click", () => scrollToIndex(currentIndex() + 1));

    const syncCarouselMode = () => {
      if (carouselQuery.matches) {
        addClones();
        scrollToIndex(1, false);
      } else {
        removeClones();
      }
    };

    syncCarouselMode();
    carouselQuery.addEventListener("change", syncCarouselMode);
  }
});
