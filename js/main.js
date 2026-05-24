function assetPath(path) {
  const base = window.__SITE_BASE__ || "";
  return base + path.replace(/^\//, "");
}

function renderMenu() {
  const nav = document.getElementById("menu-nav");
  const imageEl = document.getElementById("menu-category-image");
  const titleEl = document.getElementById("menu-category-title");
  const listEl = document.getElementById("menu-category-list");
  if (!nav || !imageEl || !titleEl || !listEl) return;

  const showCategory = (catId) => {
    const cat = MENU_CATEGORIES.find((c) => c.id === catId) || MENU_CATEGORIES[0];
    imageEl.classList.add("is-changing");
    const img = new Image();
    img.onload = () => {
      imageEl.src = assetPath(cat.image);
      imageEl.classList.remove("is-changing");
    };
    img.src = assetPath(cat.image);
    imageEl.alt = cat.name;
    titleEl.textContent = cat.name;
    listEl.innerHTML = cat.items
      .map(
        (item) => `
        <li class="menu-item">
          <div class="menu-item-info">
            <span class="menu-item-name">${item.name}</span>
            ${item.desc ? `<span class="menu-item-desc">${item.desc}</span>` : ""}
          </div>
          <span class="menu-item-price">${item.price}</span>
        </li>`
      )
      .join("");
    nav.querySelectorAll(".menu-pill").forEach((p) => {
      p.classList.toggle("active", p.dataset.category === cat.id);
    });
  };

  nav.innerHTML = MENU_CATEGORIES.map(
    (cat, i) =>
      `<button type="button" class="menu-pill${i === 0 ? " active" : ""}" data-category="${cat.id}">${cat.icon} ${cat.name}</button>`
  ).join("");

  const scrollPillIntoView = (pill) => {
    const wrap = nav.closest(".menu-nav-wrap");
    if (!wrap || !pill) return;
    const wrapRect = wrap.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const offset =
      pillRect.left - wrapRect.left - (wrapRect.width - pillRect.width) / 2;
    wrap.scrollBy({ left: offset, behavior: "smooth" });
  };

  nav.querySelectorAll(".menu-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      showCategory(pill.dataset.category);
      scrollPillIntoView(pill);
    });
  });

  showCategory(MENU_CATEGORIES[0].id);
}

function setupNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  const backdrop = document.querySelector(".nav-backdrop");
  const links = document.querySelectorAll(".nav-links a");

  const closeNav = () => {
    nav?.classList.remove("open");
    backdrop?.classList.remove("is-visible");
    backdrop?.setAttribute("hidden", "");
    backdrop?.setAttribute("aria-hidden", "true");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Menü öffnen");
    document.body.classList.remove("nav-open");
  };

  const openNav = () => {
    nav?.classList.add("open");
    backdrop?.classList.add("is-visible");
    backdrop?.removeAttribute("hidden");
    backdrop?.setAttribute("aria-hidden", "false");
    toggle?.setAttribute("aria-expanded", "true");
    toggle?.setAttribute("aria-label", "Menü schließen");
    document.body.classList.add("nav-open");
  };

  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (nav?.classList.contains("open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  backdrop?.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  links.forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  setupNav();
});
