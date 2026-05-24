(function () {
  if (!location.hostname.endsWith("github.io")) return;
  const segment = location.pathname.split("/").filter(Boolean)[0];
  if (segment) window.__SITE_BASE__ = `/${segment}/`;
})();
