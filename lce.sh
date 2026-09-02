#!/bin/sh
# lce.sh — ejecuta lce sin instalar nada.
#
# Descarga el binario que toca según la arquitectura y lo ejecuta desde la RAM,
# sin dejar nada en el disco. Pensado para una prueba rápida:
#
#   curl -fsSL https://lince.mibaltoalex.com/lce.sh | sh -s -- --version
#   wget -qO-  https://lince.mibaltoalex.com/lce.sh | sh -s -- --version
#
# Lo que va detrás de `--` se le pasa a lce tal cual.
#
# Solo Linux (x86_64, aarch64, armv7). No es un instalador: no toca el PATH ni
# deja el binario. Para tenerlo instalado, descarga el paquete .deb/.rpm o el
# binario suelto de las releases.
#
# Es /bin/sh a propósito (no bash): así corre con dash, busybox y demás shells
# mínimos, sin depender de que bash esté. (Ojo: Alpine no vale, no por el shell
# sino porque usa musl y los binarios son de glibc; se avisa más abajo.)
#
# (c) Miguel J. Carmona (MIBALTOALEX).

set -eu

# Colores solo si la salida es una terminal.
if [ -t 2 ]; then
  rojo=$(printf '\033[31m'); verde=$(printf '\033[32m'); tenue=$(printf '\033[2m'); fin=$(printf '\033[0m')
else
  rojo=; verde=; tenue=; fin=
fi
error() { printf '%serror%s: %s\n' "$rojo" "$fin" "$*" >&2; exit 1; }
info()  { printf '%s%s%s\n' "$tenue" "$*" "$fin" >&2; }

# --- Plataforma -----------------------------------------------------------

[ "$(uname -s)" = "Linux" ] || error "solo para Linux (x86_64, aarch64, armv7)."

# Cada arquitectura, al nombre del fichero de la release, al número de syscall
# de memfd_create (cambia por arquitectura) y al cargador dinámico de glibc que
# el binario necesita.
case "$(uname -m)" in
  x86_64 | amd64)          activo="lce_linux_x86_64";  memfd_nr=319; cargador="/lib64/ld-linux-x86-64.so.2" ;;
  aarch64 | arm64)         activo="lce_linux_aarch64"; memfd_nr=279; cargador="/lib/ld-linux-aarch64.so.1" ;;
  armv7l | armv7 | armhf)  activo="lce_linux_armv7";   memfd_nr=385; cargador="/lib/ld-linux-armhf.so.3" ;;
  *) error "arquitectura no soportada: $(uname -m). Solo x86_64, aarch64 y armv7." ;;
esac

[ -e "$cargador" ] || error "este sistema no tiene glibc (¿Alpine/musl?). lce se distribuye para glibc: usa Debian, Ubuntu, Fedora, Arch o similar."

url="https://github.com/MiBaLToALeX/LinceBlob/releases/latest/download/$activo"

# --- Descarga -------------------------------------------------------------

# curl, wget o python3, el que haya. python3 vale porque su `urllib` habla HTTPS
# de serie y sigue las redirecciones de GitHub, y en muchos sistemas está aunque
# no haya curl ni wget. Se escribe a un fichero (no a una tubería) para poder
# comprobar que la descarga fue bien antes de ejecutar nada.
if command -v curl >/dev/null 2>&1; then
  dl() { curl -fsSL "$1" -o "$2"; }
elif command -v wget >/dev/null 2>&1; then
  dl() { wget -q "$1" -O "$2"; }
elif command -v python3 >/dev/null 2>&1; then
  dl() {
    python3 -c 'import sys, shutil, urllib.request
with urllib.request.urlopen(sys.argv[1]) as r, open(sys.argv[2], "wb") as f:
    shutil.copyfileobj(r, f)' "$1" "$2"
  }
else
  error "hace falta curl, wget o python3."
fi

# Se baja primero a un fichero para poder comprobar que la descarga fue bien
# antes de ejecutar nada. Va a /dev/shm (RAM) cuando existe, así que ni siquiera
# este paso intermedio toca el disco; si no, a la carpeta temporal.
if [ -d /dev/shm ] && [ -w /dev/shm ]; then
  base="/dev/shm"
else
  base="${TMPDIR:-/tmp}"
fi

bin="$(mktemp "$base/lce.XXXXXX")" || error "no se pudo crear el fichero temporal."
# Se borra pase lo que pase: al terminar, al fallar o si se corta con Ctrl-C.
# (En el camino de memfd el propio ejecutor lo borra antes de arrancar, así que
# esto es la alternativa de seguridad para cuando no hay memfd.)
trap 'rm -f "$bin"' EXIT INT TERM

info "Descargando lce para $(uname -m)…"
dl "$url" "$bin" || error "no se pudo descargar $url"
[ -s "$bin" ] || error "la descarga quedó vacía."

# --- Ejecución ------------------------------------------------------------

run_python() {
  python3 - "$@" <<'PY' 2>/dev/null
import os, sys
ruta = sys.argv[1]
with open(ruta, "rb") as f:
    datos = f.read()
fd = os.memfd_create("lce")
os.write(fd, datos)
os.unlink(ruta)
os.execv(f"/proc/self/fd/{fd}", ["lce"] + sys.argv[2:])
PY
}

run_perl() {
  perl -e '
    my $nr = shift; my $ruta = shift;
    open(my $in, "<", $ruta) or die; binmode $in;
    my $datos = do { local $/; <$in> };
    my $fd = syscall($nr, "lce", 1);
    die "memfd\n" if $fd < 0;
    open(my $mem, ">&=$fd") or die; binmode $mem; print $mem $datos;
    unlink $ruta;
    exec { "/proc/$$/fd/$fd" } "lce", @ARGV;
    die "exec\n";
  ' "$@"
}

# Busca una carpeta que de verdad deje ejecutar, no solo escribir.
#
# /dev/shm suele estar montado `noexec` en servidores y contenedores
# endurecidos: se puede escribir pero no ejecutar.
carpeta_ejecutable() {
  for d in "${TMPDIR:-}" /tmp "$HOME" "$(pwd)"; do
    [ -n "$d" ] && [ -d "$d" ] && [ -w "$d" ] || continue
    t="$d/.lce_test_$$"
    printf '#!/bin/sh\nexit 0\n' >"$t" 2>/dev/null || continue
    chmod +x "$t" 2>/dev/null || { rm -f "$t"; continue; }
    if "$t" 2>/dev/null; then
      rm -f "$t"
      printf '%s\n' "$d"
      return 0
    fi
    rm -f "$t"
  done
  return 1
}

if command -v python3 >/dev/null 2>&1; then
  # memfd: descriptor anónimo en memoria. No le afecta que /dev/shm sea noexec,
  # porque no ejecuta un fichero montado, sino un descriptor sin montaje.
  info "Ejecutando en memoria…"
  run_python "$bin" "$@"
elif command -v perl >/dev/null 2>&1; then
  info "Ejecutando en memoria…"
  run_perl "$memfd_nr" "$bin" "$@"
else
  # Sin python ni perl hay que ejecutar el fichero, así que necesita una carpeta
  # con permiso de ejecución.
  destino="$(carpeta_ejecutable)" || error \
    "sin python3 ni perl, y ninguna carpeta temporal deja ejecutar (noexec). Instala python3 o perl, o monta /tmp con permiso de ejecución."

  ejecutable="$destino/lce_$$"
  trap 'rm -f "$bin" "$ejecutable"' EXIT INT TERM
  cp "$bin" "$ejecutable" || error "no se pudo preparar el binario en $destino."
  rm -f "$bin"
  chmod +x "$ejecutable"

  info "Ejecutando desde $destino …"
  # Sin `exec`: así la limpieza (trap) borra la copia al terminar.
  "$ejecutable" "$@"
fi
