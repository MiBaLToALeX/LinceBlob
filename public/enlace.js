// La página /l/ de la web: un enlace https que abre LinceBlob.
//
//   https://lince.mibaltoalex.com/l/#<host>;<dato>   →   mbx://<host>/<dato>
//
// Telegram, WhatsApp y muchas otras aplicaciones no dejan pulsar un `mbx://`
// (no lo marcan como enlace, o lo quitan). Un https sí, y esta página hace el
// resto: abre la aplicación, en escritorio y en el móvil.
//
// EL DATO VA DESPUÉS DE LA ALMOHADILLA A PROPÓSITO. Lo que va detrás de «#» no
// sale del navegador: el servidor de la web nunca ve el ticket ni el texto, ni
// queda en ningún registro.
//
// Y NO SE FÍA DE LO QUE LLEGA. El enlace lo puede escribir cualquiera, así que
// cada host tiene su forma y lo que no encaja no se abre. Sobre todo en
// Android, donde el dato acaba dentro de un `intent://`: un «;» o un «#» de más
// podría colarle parámetros.

const WEB_DESCARGA = "/descargar/";
const PAQUETE_ANDROID = "com.mibaltoalex.world";

/** Qué es cada cosa, para decírselo a quien abre el enlace. */
const QUE_ES = {
  d: "Te han enviado archivos para descargar.",
  v: "Te han compartido algo para ver: un vídeo, un audio, un PDF o una pantalla.",
  c: "Te invitan a un chat directo.",
  p: "Te han publicado un servicio para que te conectes a él.",
  x: "Te prestan una conexión para usarla con un proxy.",
  s: "Te han pasado una conexión SSH.",
  k: "Te han pasado una clave pública para crear una clave compartida.",
  t: "Te han enviado un texto.",
  n: "Te han pasado un contacto de LinceBlob.",
  i: "Te han pasado una extensión de LinceBlob para instalarla.",
};

const TICKET = /^[a-z0-9]{40,4000}$/i;
const PUBLICA = /^[A-Za-z0-9+/=]{16,8000}$/;
const ID = /^[0-9a-f]{64}$/i;
/** Caracteres de control y de cambio de dirección del texto. */
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;

function descodificar(texto) {
  try {
    return decodeURIComponent(texto);
  } catch {
    return null;
  }
}

/**
 * Lee `#host;dato` y devuelve lo que va detrás de `mbx://host/`, ya limpio y
 * codificado otra vez. Null si no es un enlace válido.
 */
function leer(fragmento) {
  const m = /^#([a-z]);([\s\S]*)$/i.exec(fragmento);
  if (!m) return null;
  const host = m[1].toLowerCase();
  if (!(host in QUE_ES)) return null;
  const crudo = m[2];

  if ("dvcpxs".includes(host)) {
    const ticket = descodificar(crudo)?.trim();
    return ticket && TICKET.test(ticket) ? { host, resto: ticket, texto: ticket } : null;
  }
  if (host === "k") {
    const publica = descodificar(crudo)?.trim();
    return publica && PUBLICA.test(publica) ? { host, resto: encodeURIComponent(publica), texto: publica } : null;
  }
  if (host === "n") {
    const [id, consulta = ""] = crudo.split("?", 2);
    if (!ID.test(id)) return null;
    // Sin caracteres de control: el nombre se enseña, y un salto de línea o
    // un cambio de dirección del texto (RTL) sirven para disfrazar otra cosa.
    const nombre = (new URLSearchParams(consulta).get("nombre") ?? "")
      .replace(CONTROL, "")
      .trim()
      .slice(0, 80);
    const resto = id.toLowerCase() + (nombre ? `?nombre=${encodeURIComponent(nombre)}` : "");
    return { host, resto, nombre };
  }
  // i: una extensión, por su identificador (como en el catálogo).
  if (host === "i") {
    const id = (descodificar(crudo) ?? "").trim().replace(/\/$/, "").toLowerCase();
    return /^[a-z0-9][a-z0-9_-]{0,63}$/.test(id) ? { host, resto: id } : null;
  }
  // t: un texto, entero.
  const texto = descodificar(crudo);
  if (!texto || texto.length > 4000) return null;
  return { host, resto: encodeURIComponent(texto), texto };
}

function esAndroid() {
  return /Android/i.test(navigator.userAgent);
}

/**
 * La dirección que abre la aplicación.
 *
 * En Android, un `intent://`: Chrome lo entiende mejor que un esquema propio.
 * En escritorio, el `mbx://` de siempre.
 *
 * LA DE RESERVA SOLO PARA EL BOTÓN. Con `browser_fallback_url`, si LinceBlob no
 * está instalada Chrome lleva a la página de descarga. Pero Chrome tampoco abre
 * otra aplicación cuando nadie ha pulsado nada, y en ese caso también salta a
 * la de reserva: con ella en el intento automático, quien SÍ tenía LinceBlob
 * acababa en Descargas. Por eso el intento automático va sin reserva (y sin
 * paquete, que sin él y sin aplicación no pasa nada: se queda en esta página),
 * y la reserva va en el botón, que siempre es un toque de verdad.
 */
function direccionApp({ host, resto }, conReserva) {
  if (!esAndroid()) return `mbx://${host}/${resto}`;
  if (!conReserva) return `intent://${host}/${resto}#Intent;scheme=mbx;end`;
  const vuelta = encodeURIComponent(new URL(WEB_DESCARGA, location.origin).href);
  return `intent://${host}/${resto}#Intent;scheme=mbx;package=${PAQUETE_ANDROID};S.browser_fallback_url=${vuelta};end`;
}

const $ = (id) => document.getElementById(id);

function copiar(texto, boton) {
  navigator.clipboard?.writeText(texto).then(
    () => {
      const antes = boton.textContent;
      boton.textContent = "Copiado";
      setTimeout(() => (boton.textContent = antes), 1500);
    },
    () => {},
  );
}

const enlace = leer(location.hash);

// El ticket fuera de la barra de direcciones y del historial en cuanto se ha
// leído: quien mire el navegador después no tiene por qué encontrarlo.
history.replaceState(null, "", location.pathname);

// Dentro de un marco de otra página no se abre nada solo: sería otra web
// lanzando la aplicación sin que la persona lo haya pedido.
const enMarco = window.top !== window.self;

if (!enlace) {
  $("enlace-que").textContent = "Este enlace no es válido o está incompleto.";
  $("enlace-abrir").hidden = true;
} else {
  const { host } = enlace;
  $("enlace-que").textContent =
    host === "n" && enlace.nombre ? `Te han pasado el contacto de ${enlace.nombre} en LinceBlob.` : QUE_ES[host];

  const abrir = $("enlace-abrir");
  abrir.href = direccionApp(enlace, true);

  // Un texto se enseña aquí mismo: para leerlo no hace falta la aplicación.
  if (host === "t") {
    $("enlace-texto").textContent = enlace.texto;
    $("enlace-texto-caja").hidden = false;
  }

  // El ticket o la clave, para pegarlos a mano si hace falta.
  if (enlace.texto && host !== "t") {
    $("enlace-copiar").hidden = false;
    $("enlace-copiar").addEventListener("click", (e) => copiar(enlace.texto, e.currentTarget));
  }
  if (host === "t") {
    $("enlace-copiar").hidden = false;
    $("enlace-copiar").textContent = "Copiar el texto";
    $("enlace-copiar").addEventListener("click", (e) => copiar(enlace.texto, e.currentTarget));
  }

  // Una descarga también se puede hacer desde el navegador, sin instalar nada.
  if (host === "d") {
    const web = $("enlace-web");
    web.href = `/web/#recibir;${encodeURIComponent(enlace.texto)}`;
    web.hidden = false;
  }

  // Se intenta abrir sola. Si el navegador no deja (Android sin pulsar nada,
  // o la vista web de otra aplicación), queda el botón.
  if (!enMarco) {
    setTimeout(() => {
      location.href = direccionApp(enlace, false);
    }, 300);
  }
}

$("enlace-descargar").href = WEB_DESCARGA;
