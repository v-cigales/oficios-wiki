/* Nações - RP — interações leves (sem dependências) */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Copiar endereço do servidor ---------- */
  function copyAddr(el) {
    var addr = el.getAttribute("data-addr");
    if (!addr) return;
    var done = function () {
      var original = el.textContent;
      el.textContent = "✓ copiado!";
      setTimeout(function () { el.textContent = original; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(done).catch(done);
    } else {
      // fallback para contextos sem Clipboard API
      var t = document.createElement("textarea");
      t.value = addr; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t); done();
    }
  }
  document.querySelectorAll(".addr").forEach(function (el) {
    el.addEventListener("click", function () { copyAddr(el); });
  });

  /* ---------- Revelação ao rolar ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Parallax leve do herói (a paisagem afunda devagar) ---------- */
  var heroBg = document.getElementById("heroBg");
  if (heroBg && !reduce) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        // a paisagem afunda devagar (~10% da rolagem). O fundo tem folga de 12%
        // em cima/embaixo (CSS), então esse deslocamento nunca revela borda.
        if (y < window.innerHeight) {
          heroBg.style.transform = "translate3d(0," + (y * 0.1).toFixed(1) + "px,0)";
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
