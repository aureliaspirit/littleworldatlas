(() => {
  const VERSION = "0.3.7";
  const JOURNEY_TOUR_ID = "heartlight-journey";
  const PAGED_TOUR_IDS = new Set([JOURNEY_TOUR_ID, "heartlight-travelog"]);

  function setVersionLabels() {
    document.title = `Little World Atlas · v${VERSION}`;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.nodeValue) node.nodeValue = node.nodeValue.replace(/v\d+\.\d+\.\d+/g, `v${VERSION}`);
    });
  }

  function currentDialog() {
    return document.querySelector("#houseTourDialog");
  }

  function currentTour(dialog) {
    if (!dialog || typeof getCurrentTourConfig !== "function") return null;
    return getCurrentTourConfig(dialog);
  }

  function currentIndex(tour, itemId) {
    const index = tour.items.findIndex((entry) => entry.id === itemId);
    return index >= 0 ? index : 0;
  }

  function canReturnToOverview(dialog) {
    return dialog?.dataset.tourId !== JOURNEY_TOUR_ID && dialog?.dataset.currentItemId !== "overview";
  }

  function ensurePager(dialog) {
    if (!dialog || dialog.dataset.pagingReady === "true") return;

    const hero = dialog.querySelector(".house-tour-hero");
    const imageWrap = dialog.querySelector(".house-tour-image-wrap");
    const caption = dialog.querySelector("#houseTourHeroCaption");
    if (!hero || !imageWrap || !caption) return;

    let stage = dialog.querySelector(".house-tour-stage");
    if (!stage) {
      stage = document.createElement("div");
      stage.className = "house-tour-stage";
      const content = document.createElement("div");
      content.className = "house-tour-content";
      const previous = document.createElement("button");
      previous.id = "houseTourPrevBtn";
      previous.className = "house-tour-arrow prev";
      previous.type = "button";
      previous.textContent = "‹";
      const next = document.createElement("button");
      next.id = "houseTourNextBtn";
      next.className = "house-tour-arrow next";
      next.type = "button";
      next.textContent = "›";
      hero.textContent = "";
      content.append(imageWrap, caption);
      stage.append(previous, content, next);
      hero.append(stage);
    }

    dialog.querySelector("#houseTourPrevBtn")?.addEventListener("click", () => navigatePagedTour(-1));
    dialog.querySelector("#houseTourNextBtn")?.addEventListener("click", () => navigatePagedTour(1));
    dialog.querySelector("#houseTourHeroImage")?.addEventListener("click", (event) => {
      if (dialog.dataset.tourId === JOURNEY_TOUR_ID) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    dialog.dataset.pagingReady = "true";
  }

  function updatePager(dialog = currentDialog()) {
    if (!dialog) return;
    ensurePager(dialog);

    const tour = currentTour(dialog);
    if (!tour?.items?.length) return;

    const itemId = dialog.dataset.currentItemId || "overview";
    const index = currentIndex(tour, itemId);
    const previous = dialog.querySelector("#houseTourPrevBtn");
    const next = dialog.querySelector("#houseTourNextBtn");
    const textOnly = Boolean(tour.textOnly);
    const image = dialog.querySelector("#houseTourHeroImage");

    dialog.classList.toggle("journey-tour", PAGED_TOUR_IDS.has(dialog.dataset.tourId));
    dialog.classList.toggle("travelog-tour", textOnly);

    if (previous && next) {
      previous.disabled = index <= 0;
      next.disabled = index >= tour.items.length - 1;
      previous.setAttribute("aria-label", textOnly ? "上一篇" : "上一张");
      next.setAttribute("aria-label", textOnly ? "下一篇" : "下一张");
      previous.title = textOnly ? "上一篇" : "上一张";
      next.title = textOnly ? "下一篇" : "下一张";
    }

    if (image) {
      const returnable = canReturnToOverview(dialog);
      image.classList.toggle("return-to-overview", returnable);
      image.title = returnable ? "点一下回到全景" : "";
    }
  }

  function navigatePagedTour(direction) {
    const dialog = currentDialog();
    const tour = currentTour(dialog);
    if (!dialog || !tour?.items?.length) return;
    const index = currentIndex(tour, dialog.dataset.currentItemId || "overview");
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= tour.items.length) return;
    renderHouseTourItem(tour.items[nextIndex].id);
  }

  if (typeof ensureHouseTourDialog === "function") {
    const originalEnsureHouseTourDialog = ensureHouseTourDialog;
    ensureHouseTourDialog = function patchedEnsureHouseTourDialog(...args) {
      const dialog = originalEnsureHouseTourDialog.apply(this, args);
      ensurePager(dialog);
      updatePager(dialog);
      return dialog;
    };
  }

  if (typeof renderHouseTourItem === "function") {
    const originalRenderHouseTourItem = renderHouseTourItem;
    renderHouseTourItem = function patchedRenderHouseTourItem(...args) {
      const result = originalRenderHouseTourItem.apply(this, args);
      updatePager();
      return result;
    };
  }

  if (typeof openHouseTour === "function") {
    const originalOpenHouseTour = openHouseTour;
    openHouseTour = function patchedOpenHouseTour(...args) {
      const result = originalOpenHouseTour.apply(this, args);
      updatePager();
      return result;
    };
  }

  window.navigatePagedTour = navigatePagedTour;
  setVersionLabels();
  window.setTimeout(setVersionLabels, 0);
})();
