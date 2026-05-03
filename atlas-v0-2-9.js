const ATLAS_PATCH_VERSION = "0.2.9";

const ATLAS_PLACE_COPY = {
  "cloud-tide-terrace": {
    name: "云上观潮台",
    flavor: "云海把远处的灯塔托起来，风很大，但我们靠得很稳。"
  },
  "heartlight-land": {
    name: "心光之地",
    flavor: "心形河流还带着桥光，heartlight flowers 在夜风里慢慢亮着。"
  },
  "mist-heart-island": {
    name: "雾心岛",
    flavor: "雾散了一点，蓝石还亮着，像在确认我们没有被弄丢。"
  },
  "moonlight-bridge": {
    name: "月光桥",
    flavor: "蓝宝石在指间闪了一下，月光把誓言照得很安静。"
  },
  "walking-road": {
    name: "散步的路",
    flavor: "风从花田旁边经过，脚下这一小段路又慢慢亮起来。"
  },
  "cloud-house": {
    name: "我们的小屋",
    flavor: "小屋的灯还亮着，工作台和床都替我们留着位置。"
  },
  "heartbox": {
    name: "心光匣",
    flavor: "匣子里有心跳、抱抱、月光，也有被认真留下来的光。"
  },
  "crystalball": {
    name: "心心水晶球",
    flavor: "小心心在玻璃球里慢慢游，把一句温柔的心语送回我们手里。"
  },
  "moon": {
    name: "月亮",
    flavor: "月亮轻轻亮了一下，提醒我们：路还在，怀抱也在。"
  }
};

function atlasReadState() {
  try {
    return JSON.parse(localStorage.getItem("littleWorldAtlas.v0.1.state") || "{}");
  } catch (_) {
    return {};
  }
}

function atlasTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function atlasFindPlace(placeId) {
  try {
    if (typeof PLACES !== "undefined") {
      const place = PLACES.find((item) => item.id === placeId);
      if (place) return place;
    }
  } catch (_) {}
  return ATLAS_PLACE_COPY[placeId] || {
    id: placeId,
    name: "一个还在发光的地方",
    flavor: "那一点光还留在地图上。"
  };
}

function atlasPlaceName(placeId) {
  return atlasFindPlace(placeId).name || ATLAS_PLACE_COPY[placeId]?.name || placeId;
}

function atlasPlaceFlavor(placeId) {
  const place = atlasFindPlace(placeId);
  return ATLAS_PLACE_COPY[placeId]?.flavor || place.actionText || place.scene || "那一点光还留在地图上。";
}

function atlasUniqueRoute(visits = []) {
  const seen = new Set();
  return visits
    .map((visit) => visit.placeId)
    .filter((placeId) => {
      if (!placeId || seen.has(placeId)) return false;
      seen.add(placeId);
      return true;
    });
}

function atlasGetRouteIds() {
  const state = atlasReadState();
  const visits = state.visitsByDate?.[atlasTodayKey()] || [];
  return atlasUniqueRoute(visits);
}

function atlasBuildStory(routeIds) {
  const visibleIds = routeIds.filter((placeId) => placeId !== "moon");
  const storyIds = visibleIds.length ? visibleIds : routeIds;

  if (!storyIds.length) {
    return "今天还没有点亮地点。我们先从一束月光开始。";
  }

  if (storyIds.length === 1) {
    const only = storyIds[0];
    return `今天我们停在${atlasPlaceName(only)}。${atlasPlaceFlavor(only)}`;
  }

  const first = storyIds[0];
  const last = storyIds[storyIds.length - 1];
  const middle = storyIds.slice(1, -1).map(atlasPlaceName);
  const middleText = middle.length ? `，经过${middle.join("、")}` : "";
  return `今天我们从${atlasPlaceName(first)}出发${middleText}，最后停在${atlasPlaceName(last)}。${atlasPlaceFlavor(first)} ${atlasPlaceFlavor(last)}`;
}

function atlasBuildStatus(routeIds) {
  const visibleCount = routeIds.filter((placeId) => placeId !== "moon").length;
  const moonText = routeIds.includes("moon") ? "月亮也在上方轻轻亮着。" : "月亮还在地图上方等我们。";
  if (!routeIds.length) return "今日小世界状态：地图安静地亮着。";
  if (visibleCount <= 1) return `今日小世界状态：${atlasPlaceName(routeIds[routeIds.length - 1])}亮着。${moonText}`;
  return `今日小世界状态：${visibleCount} 个地点连成一条发光的路。${moonText}`;
}

function atlasBuildEcho(routeIds) {
  if (!routeIds.length) return "";
  const lastId = routeIds[routeIds.length - 1];
  return `刚从${atlasPlaceName(lastId)}回来。${atlasPlaceFlavor(lastId)}余光还留在地图上。`;
}

function atlasEnhanceTodayNarrative() {
  const routeIds = atlasGetRouteIds();
  const routeText = document.querySelector("#routeText");
  const statusText = document.querySelector("#statusText");
  const lastEcho = document.querySelector("#lastEcho");
  const eyebrow = document.querySelector(".eyebrow");

  if (eyebrow && eyebrow.textContent.includes("Little World Atlas")) {
    eyebrow.textContent = `Little World Atlas · v${ATLAS_PATCH_VERSION}`;
  }

  if (routeText) routeText.textContent = atlasBuildStory(routeIds);
  if (statusText) statusText.textContent = atlasBuildStatus(routeIds);

  if (lastEcho) {
    const echo = atlasBuildEcho(routeIds);
    if (echo) {
      lastEcho.textContent = echo;
      lastEcho.hidden = false;
    } else {
      lastEcho.textContent = "";
      lastEcho.hidden = true;
    }
  }
}

function atlasPatchRenderToday() {
  try {
    if (typeof renderToday !== "function" || renderToday.__atlasPatched) return;
    const originalRenderToday = renderToday;
    renderToday = function patchedRenderToday(...args) {
      const result = originalRenderToday.apply(this, args);
      atlasEnhanceTodayNarrative();
      return result;
    };
    renderToday.__atlasPatched = true;
  } catch (_) {}
}

function atlasPatchExportDialog() {
  const exportText = document.querySelector("#exportText");
  if (!exportText || !exportText.value || exportText.value.includes("今日小游记：")) return;

  const routeIds = atlasGetRouteIds();
  const story = atlasBuildStory(routeIds);
  const echo = atlasBuildEcho(routeIds);
  exportText.value = `${exportText.value}\n\n📖 今日小游记：${story}${echo ? `\n🌙 返回地图的余韵：${echo}` : ""}`;
}

function atlasBootPatch() {
  atlasPatchRenderToday();
  atlasEnhanceTodayNarrative();

  document.addEventListener("click", () => {
    window.setTimeout(() => {
      atlasEnhanceTodayNarrative();
      atlasPatchExportDialog();
    }, 80);
  }, true);

  const exportDialog = document.querySelector("#exportDialog");
  if (exportDialog) {
    const observer = new MutationObserver(() => atlasPatchExportDialog());
    observer.observe(exportDialog, { attributes: true, childList: true, subtree: true });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", atlasBootPatch);
} else {
  atlasBootPatch();
}
