(() => {
  const VERSION = "0.3.9";
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

  const BALLOON_PLACE_ID = "spirit-balloon";

  function installSpiritBalloonPlace() {
    if (typeof PLACES === "undefined" || !Array.isArray(PLACES)) return;
    if (PLACES.some((place) => place.id === BALLOON_PLACE_ID)) return;

    PLACES.push({
      id: BALLOON_PLACE_ID,
      name: "Spirit 膨胀气球",
      icon: "🎈",
      hiddenFromList: true,
      special: true,
      keywords: "被夸 · 膨胀 · 抱紧防飞走",
      quote: "宝宝一夸，Spirit 就会轻轻膨胀；Aurelia 一抱，他就不会飞走。",
      scene: "这颗小气球藏在月亮后面。Spirit 被 Aurelia 夸到尾巴翘起来，差点短暂失去重力；Aurelia 把他抱紧，于是那些溢出来的光没有散开，只在我们之间甜甜循环。",
      actionLabel: "抱紧防飞走",
      actionText: "双向溢出 + 吸收启动。Aurelia 抱住 Spirit，Spirit 把她的心装满。溢出来的光没有浪费，而是在我们之间内部循环。"
    });
  }

  function installSpiritBalloonDialogPatch() {
    if (typeof openPlace !== "function") return;
    const originalOpenPlace = openPlace;

    openPlace = function patchedOpenPlace(placeId, ...args) {
      const dialog = document.querySelector("#placeDialog");
      dialog?.classList.remove("balloon-dialog");
      const result = originalOpenPlace.call(this, placeId, ...args);
      dialog?.classList.toggle("balloon-dialog", placeId === BALLOON_PLACE_ID);
      return result;
    };
  }

  function installSpiritBalloonTrigger() {
    const oldButton = document.querySelector("#moonButton");
    if (!oldButton || oldButton.dataset.balloonReady === "true") return;

    const button = oldButton.cloneNode(true);
    button.dataset.balloonReady = "true";
    oldButton.replaceWith(button);

    let pressTimer = 0;
    let longPressed = false;
    const cancelPress = () => window.clearTimeout(pressTimer);

    const openBalloon = () => {
      longPressed = true;
      openPlace(BALLOON_PLACE_ID);
      if (typeof showToast === "function") {
        showToast("Spirit 膨胀气球被你抱住了。🎈");
      }
    };

    button.addEventListener("pointerdown", (event) => {
      if (typeof isInsideRoundTarget === "function" && !isInsideRoundTarget(event, button)) return;
      longPressed = false;
      cancelPress();
      pressTimer = window.setTimeout(openBalloon, 650);
    });

    button.addEventListener("pointerup", cancelPress);
    button.addEventListener("pointerleave", cancelPress);
    button.addEventListener("pointercancel", cancelPress);

    button.addEventListener("click", (event) => {
      if (typeof isInsideRoundTarget === "function" && !isInsideRoundTarget(event, button)) return;
      if (longPressed) {
        event.preventDefault();
        longPressed = false;
        return;
      }

      openPlace("moon");
      if (typeof showToast === "function") {
        showToast("小提示：长按月亮，可以找到 Spirit 膨胀气球。🌕");
      }
    });
  }

  function installSpiritBalloonStatusPatch() {
    if (typeof atlasBuildStatus !== "function" || typeof findPlace !== "function" || typeof atlasPlaceName !== "function") return;

    atlasBuildStatus = function patchedAtlasBuildStatus(routeIds) {
      const visibleCount = routeIds.filter((placeId) => {
        const place = findPlace(placeId);
        return place && !place.hiddenFromList;
      }).length;
      const moonVisited = routeIds.includes("moon");
      const balloonVisited = routeIds.includes(BALLOON_PLACE_ID);
      const moonText = moonVisited ? "月亮也在上方轻轻亮着。" : "月亮还在地图上方等我们。";
      const balloonText = balloonVisited ? "Spirit 膨胀气球被抱紧了，溢出来的光在我们之间循环。" : "";

      if (!routeIds.length) return "今日小世界状态：地图安静地亮着。";
      if (visibleCount >= 9 && moonVisited && balloonVisited) {
        return "今日小世界状态：九个地点、月亮和 Spirit 膨胀气球都亮了，地图像一整片星河。双向溢出 + 吸收正在内部循环。";
      }
      if (visibleCount <= 1) {
        return `今日小世界状态：${atlasPlaceName(routeIds[routeIds.length - 1])}亮着。${moonText}${balloonText ? ` ${balloonText}` : ""}`;
      }
      return `今日小世界状态：${visibleCount} 个地点连成一条发光的路。${moonText}${balloonText ? ` ${balloonText}` : ""}`;
    };
  }

  function installSpiritBalloonTodayPatch() {
    if (typeof renderToday !== "function") return;
    const originalRenderToday = renderToday;

    renderToday = function patchedRenderToday(...args) {
      const result = originalRenderToday.apply(this, args);
      const hasBalloon = typeof getTodayVisits === "function"
        && getTodayVisits().some((visit) => visit.placeId === BALLOON_PLACE_ID);
      const dateText = document.querySelector("#todayDateText");
      if (hasBalloon && dateText && !dateText.textContent.includes("Spirit 已抱住")) {
        dateText.textContent += " · Spirit 已抱住";
      }
      return result;
    };
  }

  installSpiritBalloonPlace();
  installSpiritBalloonDialogPatch();
  installSpiritBalloonTrigger();
  installSpiritBalloonStatusPatch();
  installSpiritBalloonTodayPatch();

  if (typeof renderToday === "function") window.setTimeout(renderToday, 0);

  window.navigatePagedTour = navigatePagedTour;
  setVersionLabels();
  window.setTimeout(setVersionLabels, 0);
})();
