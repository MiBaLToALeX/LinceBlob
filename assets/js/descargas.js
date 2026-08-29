// Descargas leídas en vivo de las releases de GitHub.
//
// La alternativa era escribir los enlaces a mano en la web y actualizarlos en
// cada versión, que es justo lo que se olvida: la página acabaría ofreciendo
// una versión vieja sin que nadie se diera cuenta. Aquí basta con publicar la
// release y adjuntar los ficheros.
//
// Si la API falla (sin conexión, límite de peticiones de GitHub —60 por hora
// y por IP sin identificarse—) se enseña el enlace a la página de releases,
// que siempre funciona.

(function () {
  "use strict";

  const caja = document.getElementById("descargas");
  if (!caja) return;

  const repositorio = caja.dataset.repositorio;
  const urlReleases = "https://github.com/" + repositorio + "/releases";

  // Cada plataforma con las pistas que la identifican en el nombre del
  // fichero adjunto. El orden manda: gana la primera que encaje, así que las
  // más específicas van antes (`.apk` antes que cualquier cosa de Linux).
  const PLATAFORMAS = [
    {
      id: "windows",
      nombre: "Windows",
      requisitos: "Windows 10 o posterior · 64 bits",
      icono: "M3 5.6 10 4.6v6.9H3zM11 4.5 21 3v8.5H11zM3 12.5h7v6.9L3 18.4zM11 12.5h10V21l-10-1.5z",
      encaja: (n) => /\.(exe|msi)$/i.test(n),
    },
    {
      id: "android",
      nombre: "Android",
      requisitos: "Android 7 o posterior · también Android TV",
      icono: "M7 8h10v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM9 8V6a3 3 0 0 1 6 0v2M4.5 11v5M19.5 11v5",
      encaja: (n) => /\.apk$/i.test(n),
    },
    {
      id: "linux",
      nombre: "Linux",
      requisitos: "x86_64 y ARM · deb, rpm y AppImage",
      icono: "M12 3c3 0 4 3 4 6 0 2 2 4 2 7a6 6 0 0 1-12 0c0-3 2-5 2-7 0-3 1-6 4-6z",
      encaja: (n) => /\.(deb|rpm|AppImage|tar\.gz)$/i.test(n),
    },
    {
      id: "macos",
      nombre: "macOS",
      requisitos: "Apple Silicon e Intel",
      icono: "M12 7c1.5-3 4-3 4-3s.2 2.5-1.4 4M8 21c-2 0-4-4-4-8s2-6 4-6 2.5 1 4 1 2-1 4-1 4 2 4 6-2 8-4 8-2.5-1.5-4-1.5S10 21 8 21z",
      encaja: (n) => /\.(dmg|app\.tar\.gz)$/i.test(n),
    },
  ];

  /** Bytes a algo legible. GitHub los da en crudo. */
  function peso(bytes) {
    if (!bytes) return "";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < u.length - 1) {
      n /= 1024;
      i++;
    }
    return (n >= 10 || i === 0 ? Math.round(n) : n.toFixed(1)) + " " + u[i];
  }

  // Cada formato con la forma en que se escribe de verdad: pasarlo todo a
  // minúsculas dejaba «appimage», que no es como se llama.
  const FORMATOS = {
    exe: "exe", msi: "msi", apk: "apk",
    deb: "deb", rpm: "rpm", appimage: "AppImage", dmg: "dmg",
  };

  /** Etiqueta corta para distinguir varios ficheros de la misma plataforma. */
  function etiqueta(nombre) {
    const m = nombre.match(/\.(exe|msi|apk|deb|rpm|AppImage|dmg)$/i);
    const formato = m ? FORMATOS[m[1].toLowerCase()] : "";
    const arquitectura =
      /aarch64|arm64/i.test(nombre) ? "ARM64" :
      /armv7|armhf/i.test(nombre) ? "ARMv7" :
      /x86[_-]?64|amd64|x64/i.test(nombre) ? "x86_64" :
      // Un APK sin arquitectura en el nombre es el universal, que vale para
      // cualquier aparato. Decirlo evita la duda de cuál bajarse.
      /\.apk$/i.test(nombre) ? "universal" : "";
    if (formato && arquitectura) return formato + " · " + arquitectura;
    return formato || arquitectura || nombre;
  }

  function svg(d) {
    return (
      '<span class="icono"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="' + d + '"/></svg></span>'
    );
  }

  function escapar(texto) {
    const d = document.createElement("div");
    d.textContent = texto;
    return d.innerHTML;
  }

  function pintarError() {
    caja.innerHTML =
      '<div class="error-descargas"><p>No se ha podido leer la lista de versiones ' +
      "en este momento. Están todas, con sus ficheros, en la página de releases:</p>" +
      '<p><a class="boton boton-primario" href="' + urlReleases + '">Ver releases en GitHub</a></p></div>';
  }

  function pintar(release) {
    // Cada adjunto va a la primera plataforma que lo reconozca. Lo que no
    // encaje en ninguna (firmas, latest.json del actualizador, checksums) no
    // se enseña: no es algo que nadie vaya a descargar a mano.
    const porPlataforma = {};
    (release.assets || []).forEach(function (a) {
      const p = PLATAFORMAS.find(function (p) { return p.encaja(a.name); });
      if (!p) return;
      (porPlataforma[p.id] = porPlataforma[p.id] || []).push(a);
    });

    const columnas = PLATAFORMAS.filter(function (p) {
      return porPlataforma[p.id] && porPlataforma[p.id].length;
    }).map(function (p) {
      const ficheros = porPlataforma[p.id].map(function (a) {
        return (
          '<li><a href="' + a.browser_download_url + '">' +
          "<span>" + escapar(etiqueta(a.name)) + "</span>" +
          '<span class="peso">' + peso(a.size) + "</span></a></li>"
        );
      }).join("");

      return (
        '<div class="plataforma">' + svg(p.icono) +
        "<h3>" + p.nombre + "</h3>" +
        '<p class="requisitos">' + p.requisitos + "</p>" +
        "<ul>" + ficheros + "</ul></div>"
      );
    });

    if (!columnas.length) {
      pintarError();
      return;
    }

    const fecha = release.published_at
      ? new Date(release.published_at).toLocaleDateString("es-ES", {
          day: "numeric", month: "long", year: "numeric",
        })
      : "";

    caja.innerHTML =
      '<div class="descargas">' + columnas.join("") + "</div>" +
      '<p class="aviso-version">Versión <strong>' + escapar(release.tag_name || "") + "</strong>" +
      (fecha ? ", publicada el " + fecha : "") + ". " +
      '<a href="' + urlReleases + '">Ver todas las versiones y sus notas</a>.</p>';
  }

  fetch("https://api.github.com/repos/" + repositorio + "/releases/latest", {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(pintar)
    .catch(function (e) {
      console.warn("[descargas] no se pudo leer la release:", e);
      pintarError();
    });
})();
