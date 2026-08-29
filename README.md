# Web de LinceBlob

Página pública del proyecto: descargas, documentación y textos legales.
Se publica con GitHub Pages (Jekyll) desde este mismo repositorio.

**Aquí no va el código de la aplicación.** LinceBlob es software propietario y
solo se distribuyen los binarios, que viajan como adjuntos de las *releases*.

## Publicarla

1. Copia el contenido de esta carpeta a la raíz del repositorio
   `MiBaLToALeX/LinceBlob` y haz *push* a `main`.
2. En GitHub: **Settings → Pages → Source: Deploy from a branch**, rama `main`,
   carpeta `/ (root)`.
3. En **Settings → Pages → Custom domain**, escribe `lince.mibaltoalex.com`
   y marca **Enforce HTTPS** cuando GitHub lo permita (tarda unos minutos en
   emitir el certificado).

### DNS

En el proveedor del dominio, un registro `CNAME`:

```
lince   CNAME   mibaltoalex.github.io.
```

El fichero `CNAME` de la raíz de este repositorio ya lleva el dominio dentro;
no lo borres, GitHub lo lee en cada publicación.

En `_config.yml`, `baseurl` va **vacío** justamente por esto. Si algún día
vuelves a publicar sin dominio propio, hay que devolverle el valor
`"/LinceBlob"` o la web saldrá sin estilos.

## Cómo se actualizan las descargas

**No hay que tocar la web al sacar una versión.** La página de descargas lee la
última *release* de la API de GitHub y agrupa los ficheros adjuntos por
plataforma según su nombre:

| Termina en | Se muestra bajo |
|---|---|
| `.exe`, `.msi` | Windows |
| `.apk` | Android |
| `.deb`, `.rpm`, `.AppImage`, `.tar.gz` | Linux |
| `.dmg`, `.app.tar.gz` | macOS |

Lo que no encaje en ninguna (firmas, `latest.json` del actualizador, ficheros
de resúmenes) no se enseña, que es lo que se quiere: nadie los descarga a mano.

Si en el nombre aparece `arm64`/`aarch64`, `armv7` o `x86_64`, se usa como
etiqueta para distinguir varios ficheros de la misma plataforma. Por eso
conviene nombrarlos de forma consistente, por ejemplo:

```
LinceBlob_2.13.0_x64-setup.exe
LinceBlob_2.13.0_amd64.deb
LinceBlob_2.13.0_aarch64.AppImage
LinceBlob_v2.13.0.apk
```

Si la API falla o se agota el límite de peticiones de GitHub (60 por hora y
por IP para quien no se identifica), la página enseña el enlace a
`/releases/latest`, que siempre funciona.

## Ver la web en local

```bash
bundle install
bundle exec jekyll serve --livereload
```

En <http://127.0.0.1:4000/LinceBlob/>. Hace falta Ruby.

## Qué hay aquí

| Fichero | Qué es |
|---|---|
| `_config.yml` | Configuración: repositorio, URL, datos de contacto |
| `_layouts/default.html` | Plantilla común (cabecera, menú, pie) |
| `assets/css/estilo.css` | Todos los estilos, con modo claro y oscuro |
| `assets/js/descargas.js` | Lee las releases y pinta las descargas |
| `index.html` | Portada |
| `descargar.html` | Descargas y guía de instalación |
| `documentacion.html` | Guía de uso |
| `privacidad.html` | Política de privacidad |
| `terminos.html` | Términos de uso |
| `licencias.html` | Licencia propia y resumen de componentes de terceros |
| `terceros.html` | **Generado.** Lista completa de dependencias con su licencia |

## Regenerar la lista de terceros

`terceros.html` no se edita a mano: lo escribe un script del proyecto de la
aplicación, leyendo las dependencias de verdad.

```bash
cd ruta/al/proyecto/sobapp
node scripts/generar-licencias.mjs ruta/a/esta/carpeta
```

Hay que volver a ejecutarlo cada vez que se añada o actualice una dependencia.
El script avisa por pantalla si aparece algún componente sin licencia
declarada o alguno nuevo bajo MPL-2.0, que son los dos casos que piden
atención.

> El sidecar `mar` (compresión) no entra en el recuento: su código vive fuera
> de este árbol. Si se incorpora, basta con añadir su ruta a `RAICES_CARGO`
> dentro del script.

Los textos legales vienen de `docs/legal/*.html` del proyecto de la
aplicación. Si allí se cambian, hay que traerlos otra vez aquí: son la misma
redacción con la plantilla de la web alrededor.
