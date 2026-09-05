[![Version][badge-version]](https://github.com/MiBaLToALeX/LinceBlob/releases/latest)
![Website][badge-website]
![Platforms][badge-platforms]

<p align="center">
  <img src="assets/img/icono-512.png" width="140" alt="LinceBlob">
</p>

<h1 align="center">LinceBlob</h1>

<p align="center">
  Una herramienta para enviar archivos y directorios a cualquier parte del mundo sin almacenarlos en la nube. 
</br>Gratis, rápido, seguro (cifrado E2E), sin cuentas, sin rastreo, basado en iroh
</p>

<p align="center"><strong>Idiomas:</strong> Español | English | Português | Français | Italiano | Deutsch </p>

<p align="center">
  <a href="https://lince.mibaltoalex.com/descargar/">Descargar</a> ·
  <a href="https://lince.mibaltoalex.com/documentacion/">Documentación</a> ·
  <a href="https://lince.mibaltoalex.com/">Web</a>
</p>

---

Cuando tienes que pasar un archivo grande a otro ordenador, lo normal es
subirlo a algún servicio, esperar, mandar el enlace y esperar otra vez
mientras el otro lo baja. El archivo hace dos viajes y se queda guardado en un
sitio que no controlas.

LinceBlob hace el viaje directo. Tu equipo se conecta con el otro y el archivo
pasa de uno a otro, cifrado, sin copia intermedia. No hay cuentas, no hay
registro y no hay límite de tamaño.

## Cómo funciona

Quien envía obtiene un código. Quien recibe lo pega. Ya está.

Ese código es la llave del contenido, así que conviene tratarlo como una
contraseña. Si los dos dispositivos están en la misma red, ni eso hace falta:
aparece el nombre del otro equipo, lo tocas y allí sale el aviso.

## Qué trae

- **Cifrado de extremo a extremo.** El contenido se cifra en tu dispositivo y se
  descifra en el de destino. Nadie por el camino puede leerlo.
- **Conexión directa.** Atraviesa routers y cortafuegos para unir los dos
  equipos. Cuando la red no lo permite, se pasa por un relé que reenvía datos
  ya cifrados y tampoco puede abrirlos.
- **Dispositivos cercanos.** En la misma red, enviar es elegir un nombre de
  una lista.
- **Código QR.** Del ordenador al móvil sin teclear nada: enseñas el QR, lo
  escaneas y la descarga arranca sola.
- **Reenvío de puertos.** Publica un servicio de tu equipo y ábrelo desde
  otro sitio como si estuvieras en su misma red.
- **Cifrado post-cuántico.** Para lo que tenga que seguir siendo secreto
  dentro de muchos años.
- **Cinco idiomas**: español, inglés, portugués, francés e italiano.

## Dónde funciona

| Sistema | Requisitos |
|---|---|
| Windows | Windows 10 o posterior, 64 bits |
| Linux | x86_64 y ARM. Paquetes `.deb`, `.rpm` y `.AppImage` |
| Android | Android 7 o posterior, incluido Android TV |

Las descargas están en la
[página de descargas](https://lince.mibaltoalex.com/descargar/) y en las
[releases](../../releases) de este repositorio.

## Desde la terminal

Además de la aplicación con ventana, existe `lce`, la misma herramienta pero
para la consola: enviar, recibir, reenvío de puertos, túneles por SSH... todo
sin salir de la línea de órdenes.

Para probarla en Linux sin instalar nada:

```sh
curl -fsSL https://lince.mibaltoalex.com/lce.sh | sh -s -- --version
```

Descarga el binario de tu arquitectura, lo ejecuta en memoria y no deja nada en
el equipo. Lo que pongas después de `--` se le pasa tal cual, así que en vez de
`--version` puedes escribir `add archivo.zip`, `get <código>` o lo que
necesites. Si no tienes `curl`, `wget` sirve igual:

```sh
wget -qO- https://lince.mibaltoalex.com/lce.sh | sh -s -- --version
```

Funciona en x86_64, aarch64 y armv7, sobre distribuciones con glibc (Debian,
Ubuntu, Fedora, Arch y compañía). No toca el PATH ni instala nada: es para una
prueba rápida.

Como en cualquier `curl | sh`, lo estás ejecutando directamente desde internet.

## Sobre este repositorio

Aquí encontrarás la web pública del proyecto y sus versiones disponibles. **El código fuente de la aplicación no se distribuye**: <br>
LinceBlob es software propietario; únicamente se proporcionan los programas ya compilados.

- [Términos de uso](https://lince.mibaltoalex.com/terminos/)
- [Política de privacidad](https://lince.mibaltoalex.com/privacidad/)
- [Licencias de terceros](https://lince.mibaltoalex.com/licencias/)

## Ayuda

¿Algo no va como debería? Abre una [incidencia](../../issues) contando qué
sistema usas, qué versión de LinceBlob y qué estabas haciendo. También puedes
escribir por Telegram a [@shellord_bot](https://t.me/shellord_bot).

## Créditos

Creado por [Miguel J. Carmona (MIBALTOALEX)](https://me.mibaltoalex.com/).


[badge-website]: https://img.shields.io/badge/website-lince.mibaltoalex.com-green
[badge-version]: https://img.shields.io/badge/version-2.24.0-blue
[badge-platforms]: https://img.shields.io/badge/platforms-Windows%2C%20Linux%2C%20Android%2C%20CLI%20-green
