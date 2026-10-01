# LinceBlob

[![Version][badge-version]][releases] [![Website][badge-website]][website] [![Platforms][badge-platforms]][download]

<p align="center">
  <img src="assets/img/icono-512.png" width="140" alt="LinceBlob">
</p>

<h1 align="center">LinceBlob</h1>

<p align="center">
  Envía archivos y directorios directamente entre dispositivos, sin almacenarlos en la nube.
</p>

<p align="center">
  <strong>Gratis · Rápido · Seguro · Cifrado E2E · Sin cuentas · Sin rastreo · Basado en iroh</strong>
</p>

<p align="center">
  Español · English · Português · Français · Italiano · Deutsch
</p>

<p align="center">
  <a href="https://lince.mibaltoalex.com/descargar/">Descargar</a> ·
  <a href="https://lince.mibaltoalex.com/documentacion/">Documentación</a> ·
  <a href="https://lince.mibaltoalex.com/">Web</a> ·
  <a href="../../releases/latest">Novedades</a>
</p>

---

## ¿Qué es LinceBlob?

Cuando tienes que pasar un archivo grande a otro ordenador, lo habitual es subirlo a algún servicio, esperar, compartir un enlace y esperar otra vez mientras la otra persona lo descarga.

El archivo hace dos viajes y, además, queda almacenado en un servidor que no controlas.

**LinceBlob hace el viaje directamente entre los dispositivos.**

Tu equipo se conecta con el otro y el archivo pasa de uno a otro **cifrado de extremo a extremo**, sin una copia intermedia. No necesitas crear una cuenta, no hay registro y no existe un límite de tamaño impuesto por un servicio de almacenamiento.

Y cuando no hay una red disponible, LinceBlob ofrece otras formas de intercambiar información: **códigos QR encadenados, audio, dispositivos cercanos y NFC en Android**.

## Cómo funciona

El dispositivo que envía genera un **ticket**. El dispositivo que recibe lo introduce y la conexión comienza.

Ese ticket da acceso al contenido, así que debes tratarlo como una contraseña y compartirlo únicamente con quien deba recibirlo.

Si ambos dispositivos están en la misma red, ni siquiera necesitas introducir el ticket: **LinceBlob detecta el otro dispositivo**, muestra su nombre y puedes iniciar el intercambio directamente.

## Funciones

### 📁 Transferencia directa

- **Cifrado de extremo a extremo.** El contenido se cifra en tu dispositivo y se descifra en el dispositivo de destino.
- **Conexión directa.** LinceBlob intenta conectar ambos dispositivos atravesando routers y cortafuegos.
- **Relés cifrados.** Cuando una conexión directa no es posible, puede utilizarse un relé que reenvía los datos sin poder descifrarlos.
- **Sin límite de tamaño.** No dependes del espacio disponible en un servicio de almacenamiento.
- **Transferencias en segundo plano.** Puedes seguir utilizando la aplicación mientras una transferencia continúa.
- **Transferencias recuperables desde cualquier pantalla.** Las operaciones en curso permanecen accesibles aunque cambies de sección.
- **Navegador web.** Envía y recibe archivos sin instalar la aplicación desde [lince.mibaltoalex.com/web](https://lince.mibaltoalex.com/web/). Los códigos funcionan tanto en la web como en las aplicaciones.

### 📡 Conexión entre dispositivos

- **Dispositivos cercanos.** Si están en la misma red, selecciona el dispositivo de destino directamente desde una lista.
- **Códigos QR.** Pasa un archivo del ordenador al móvil sin escribir códigos: muestra el QR, escanéalo y comienza la transferencia.
- **NFC en Android.** Convierte el teléfono en una etiqueta NFC para compartir información con otro dispositivo simplemente acercándolos.
- **Contactos mediante NFC.** También puedes utilizar NFC para guardar dispositivos como contactos acercando los teléfonos.

### 🌐 Acceso remoto

- **Reenvío de conexiones.** Publica un servicio de tu equipo y accede a él desde otro lugar como si estuvieras en la misma red.
- **Explorador remoto.** Accede a los archivos de otro dispositivo y muévelos en ambos sentidos.
- **Terminal SSH.** Trabaja en la consola del equipo remoto sin salir de LinceBlob.

### 🖥️ Escritorio remoto

- **Compartir pantalla.** Comparte la pantalla completa, una ventana concreta o una región determinada.
- **Permisos explícitos.** Nadie puede ver la pantalla hasta que aceptes la solicitud.
- **Caducidad del acceso.** Puedes establecer cuándo deja de ser válido el acceso.
- **Control remoto — PRO.** Controla el ratón y el teclado del equipo compartido, también desde Android.
- **Permisos independientes.** El control remoto requiere una autorización adicional y puede retirarse en cualquier momento.

### ▶️ Multimedia

- **Ver sin descargar.** Reproduce vídeos, audio y documentos PDF directamente desde el otro dispositivo.
- **Control de descargas.** Quien comparte decide si el receptor puede descargar el contenido o únicamente visualizarlo dentro de LinceBlob.
- **Televisores.** Envía vídeos compatibles a televisores mediante **DLNA o Chromecast**.
- **Control desde la aplicación.** Utiliza los controles multimedia de LinceBlob para manejar la reproducción.
- **IP manual.** Si la red no permite descubrir automáticamente el televisor, puedes añadirlo mediante su dirección IP.

### 🔐 Seguridad

- **Cifrado de extremo a extremo.** Los datos se cifran antes de abandonar el dispositivo.
- **Relés sin acceso al contenido.** Un relé puede transportar los datos, pero el contenido continúa cifrado.
- **Cifrado post-cuántico.** Protección pensada para información que deba permanecer confidencial durante muchos años.

### 🌍 Otros

- **Seis idiomas.** Español, inglés, portugués, francés, italiano y alemán.
- **Aplicación multiplataforma.** Windows, Linux y Android, incluido Android TV.
- **Cliente de terminal.** `lce` permite utilizar las funciones principales desde la consola.

## Plataformas

| Plataforma | Requisitos |
|---|---|
| **Windows** | Windows 10 o posterior · 64 bits |
| **Linux** | x86_64 y ARM · `.deb`, `.rpm` y `.AppImage` |
| **Android** | Android 7 o posterior · incluido Android TV |

Puedes descargar LinceBlob desde la [página de descargas](https://lince.mibaltoalex.com/descargar/) o consultar las [releases](../../releases) de este repositorio.

## Terminal

`lce` es LinceBlob para la terminal.

Permite enviar y recibir archivos, crear reenvíos de conexiones, utilizar túneles SSH y trabajar con las funciones de LinceBlob desde la consola, sin abrir la interfaz gráfica.

### Probar sin instalar

En Linux puedes probar `lce` sin instalar nada:

```sh
curl -fsSL https://lince.mibaltoalex.com/lce.sh | sh -s -- --version
```

O, si no tienes `curl`:

```sh
wget -qO- https://lince.mibaltoalex.com/lce.sh | sh -s -- --version
```

El script descarga el binario correspondiente a tu arquitectura y lo ejecuta en memoria. **No modifica el `PATH` ni instala nada permanentemente.**

Todo lo que escribas después de `--` se pasa directamente a `lce`. Por ejemplo:

```sh
curl -fsSL https://lince.mibaltoalex.com/lce.sh | sh -s -- add archivo.zip
```

o:

```sh
curl -fsSL https://lince.mibaltoalex.com/lce.sh | sh -s -- get <código>
```

### Arquitecturas

La versión de Linux funciona en:

- `x86_64`
- `aarch64`
- `armv7`

Está disponible para distribuciones basadas en **glibc**, como Debian, Ubuntu, Fedora y Arch.

En sistemas basados en **musl**, como Alpine Linux, se proporciona actualmente un binario musl para `x86_64`.

> **Nota de seguridad:** como ocurre con cualquier comando `curl | sh`, estás ejecutando directamente un script obtenido desde Internet. Si no quieres hacerlo de esta manera, puedes descargar el binario y ejecutarlo manualmente.

## Sobre este repositorio

Este repositorio contiene la **web pública del proyecto y sus versiones disponibles**.

**El código fuente de LinceBlob no se distribuye.** LinceBlob es software propietario y únicamente se proporcionan los programas ya compilados.

- [Términos de uso](https://lince.mibaltoalex.com/terminos/)
- [Política de privacidad](https://lince.mibaltoalex.com/privacidad/)
- [Licencias de terceros](https://lince.mibaltoalex.com/licencias/)

## Ayuda y problemas

Si algo no funciona como debería, abre una [incidencia](../../issues) indicando:

- Sistema operativo.
- Versión de LinceBlob.
- Qué estabas haciendo cuando ocurrió el problema.
- El mensaje o código de error, si aparece.

Si aparece un código como `E-4F2A`, inclúyelo en la incidencia.

También puedes contactar por Telegram: [@shellord_bot](https://t.me/shellord_bot).

### Informe de errores

En **Ajustes → Otros** encontrarás el informe de errores. Contiene los últimos errores registrados junto con su hora y mensaje técnico.

Puedes copiarlo directamente con el botón correspondiente.

El informe no incluye rutas, enlaces, direcciones ni claves, por lo que puedes pegarlo directamente en una incidencia o enviarlo para facilitar el diagnóstico.

## Créditos

Creado por [Miguel J. Carmona (MIBALTOALEX)](https://me.mibaltoalex.com/).

---

[website]: https://lince.mibaltoalex.com/
[download]: https://lince.mibaltoalex.com/descargar/
[releases]: https://github.com/MiBaLToALeX/LinceBlob/releases/latest

[badge-version]: https://img.shields.io/badge/version-3.21.0-blue
[badge-website]: https://img.shields.io/badge/website-lince.mibaltoalex.com-green
[badge-platforms]: https://img.shields.io/badge/platforms-Windows%2C%20Linux%2C%20Android%2C%20CLI-green
