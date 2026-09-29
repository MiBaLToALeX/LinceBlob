// Dos cosas pequeñas y sin dependencias: la barra de arriba y la huella.
(function () {
  var barra = document.querySelector("#avance span");
  var arriba = document.getElementById("arriba");
  if (!barra || !arriba) return;

  var pendiente = false;
  function pintar() {
    pendiente = false;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    // Una página que cabe entera en la pantalla no tiene avance que enseñar.
    var avance = alto > 0 ? window.scrollY / alto : 0;
    barra.style.transform = "scaleX(" + avance + ")";
    // La huella aparece cuando ya hay algo a lo que volver.
    arriba.classList.toggle("visible", window.scrollY > 400);
  }

  // Por `requestAnimationFrame`: el evento de scroll se dispara decenas de
  // veces por segundo y tocar el estilo en cada uno hace trabajar de más al
  // navegador justo mientras la persona se desplaza.
  addEventListener("scroll", function () {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(pintar);
  }, { passive: true });
  addEventListener("resize", pintar, { passive: true });
  pintar();

  arriba.addEventListener("click", function (e) {
    e.preventDefault();
    // Suave, salvo para quien haya pedido menos movimiento en su sistema.
    var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: 0, behavior: quieto ? "auto" : "smooth" });
  });
})();
