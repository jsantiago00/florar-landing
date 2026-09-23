(function () {
  var API_BASE = (window.FLORAR_CONFIG && window.FLORAR_CONFIG.ADMIN_API_URL) || "";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(data) {
    var profile = data.profile || {};
    document.title = profile.title || "Florar";
    document.getElementById("title").textContent = profile.title || "";
    document.getElementById("subtitle").textContent = profile.subtitle || "";

    var logoEl = document.getElementById("logo");
    if (profile.logoUrl) {
      logoEl.innerHTML = '<img src="' + escapeHtml(profile.logoUrl) + '" alt="Logo" />';
    } else {
      logoEl.textContent = profile.logoText || "FLORAR";
    }

    var itemsEl = document.getElementById("items");
    itemsEl.innerHTML = "";
    (data.items || []).forEach(function (item) {
      if (item.type === "header") {
        var h = document.createElement("div");
        h.className = "section-header";
        h.textContent = item.label;
        itemsEl.appendChild(h);
      } else {
        var a = document.createElement("a");
        a.className = "link-btn";
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = escapeHtml(item.label) + '<span class="arrow">→</span>';
        itemsEl.appendChild(a);
      }
    });
  }

  function loadLocalFallback() {
    fetch("data.json", { cache: "no-store" })
      .then(function (res) { return res.json(); })
      .then(render)
      .catch(function () {
        document.getElementById("items").innerHTML =
          '<div class="error">No se pudieron cargar los links.</div>';
      });
  }

  if (API_BASE) {
    fetch(API_BASE.replace(/\/$/, "") + "/api/links", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then(render)
      .catch(loadLocalFallback);
  } else {
    loadLocalFallback();
  }

  document.getElementById("shareBtn").addEventListener("click", function () {
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href }).catch(function () {});
    } else {
      navigator.clipboard.writeText(location.href).then(function () {
        alert("Link copiado");
      });
    }
  });
})();
