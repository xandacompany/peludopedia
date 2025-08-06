import os

# Estructura a crear
structure = {
    "src": {
        "assets": {
            "images": {
                "icons": {
                    
                },
                "svg": {
                    "sprite.svg": "Aquí va el contenido SVG"
                }
            },
            "fonts": {},
            "styles": {
                "main.css": "/* Aquí va el contenido CSS principal */\nbody {\n  font-family: Arial, sans-serif;\n}\n"
            },
            "scripts": {
                "main.js": "// Aquí va el contenido JS principal\nconsole.log('Hola mundo');\n"
            }
        },
        "pages": {
            "inicio.html": "<!-- Contenido HTML para la página de inicio -->\n<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Inicio</title>\n</head>\n<body>\n  <h1>Página de Inicio</h1>\n</body>\n</html>\n",
            "contacto.html": "<!-- Contenido HTML para la página de contacto -->\n<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Contacto</title>\n</head>\n<body>\n  <h1>Contacto</h1>\n</body>\n</html>\n",
            "terminos-y-condiciones.html": "<!-- Contenido HTML para términos y condiciones -->\n<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Términos y Condiciones</title>\n</head>\n<body>\n  <h1>Términos y Condiciones</h1>\n</body>\n</html>\n"
        },
        "components": {},
        "utils": {},
        "config": {
            "sitemap.py":'''
import os
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom.minidom import parseString
from datetime import datetime

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PAGES_DIR = os.path.join(ROOT_DIR, 'src', 'pages')

BASE_URL = "https://www.tusitio.com/"

# Configuraciones por defecto para sitemap
DEFAULT_CHANGEFREQ = "daily"
DEFAULT_PRIORITY = "1.0"

def get_files():
    files = []
    print(f"Buscando archivos en: {PAGES_DIR}")
    for root, _, filenames in os.walk(PAGES_DIR):
        for f in filenames:
            if f.endswith('.html') or f.endswith('.php'):
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, ROOT_DIR).replace(os.sep, '/')
                last_mod_timestamp = os.path.getmtime(full_path)
                last_mod = datetime.utcfromtimestamp(last_mod_timestamp).strftime('%Y-%m-%d')
                print(f"Archivo encontrado: {rel_path} - LastMod: {last_mod}")
                files.append({
                    "url": rel_path,
                    "lastmod": last_mod
                })
    return files

def generate_sitemap(pages):
    urlset = Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

    for page in pages:
        url_el = SubElement(urlset, 'url')

        loc = SubElement(url_el, 'loc')
        loc.text = BASE_URL + page["url"]

        lastmod = SubElement(url_el, 'lastmod')
        lastmod.text = page["lastmod"]

        changefreq = SubElement(url_el, 'changefreq')
        changefreq.text = DEFAULT_CHANGEFREQ

        priority = SubElement(url_el, 'priority')
        priority.text = DEFAULT_PRIORITY

    rough_string = tostring(urlset, 'utf-8')
    reparsed = parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

def save_sitemap(xml_content):
    sitemap_path = os.path.join(ROOT_DIR, 'sitemap.xml')
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(xml_content)
    print(f"sitemap.xml generado en: {sitemap_path}")

if __name__ == "__main__":
    pages = get_files()
    sitemap_xml = generate_sitemap(pages)
    save_sitemap(sitemap_xml)

''',
"purgar.py":'''
import os
import re

# Detectar la raíz del proyecto (2 niveles arriba de src/config/)
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# Rutas corregidas
COMPONENTS_DIR = os.path.join(ROOT_DIR, 'src', 'components')
SCRIPTS_DIR = os.path.join(ROOT_DIR, 'src', 'assets', 'scripts')
PAGES_DIR = os.path.join(ROOT_DIR, 'src', 'pages')
INDEX_FILE = os.path.join(ROOT_DIR, 'index.html')

# Regex para <script src="...">
SCRIPT_SRC_REGEX = re.compile(r"<script[^>]+src=[\"']([^\"']+)[\"']", re.IGNORECASE)

def find_all_js_files():
    components_files = [f for f in os.listdir(COMPONENTS_DIR) if f.endswith('.js')]
    scripts_files = [f for f in os.listdir(SCRIPTS_DIR) if f.endswith('.js')]
    return components_files, scripts_files

def extract_scripts_used_in_file(filepath):
    used = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            matches = SCRIPT_SRC_REGEX.findall(content)
            for match in matches:
                filename = os.path.basename(match)
                used.add(filename)
    except Exception as e:
        print(f"[⚠️] Error leyendo {filepath}: {e}")
    return used

def gather_all_used_scripts():
    used_scripts = set()

    if os.path.exists(INDEX_FILE):
        used_scripts.update(extract_scripts_used_in_file(INDEX_FILE))

    for root, _, files in os.walk(PAGES_DIR):
        for file in files:
            if file.endswith('.html') or file.endswith('.php'):
                path = os.path.join(root, file)
                used_scripts.update(extract_scripts_used_in_file(path))

    return used_scripts

def clean_unused_files():
    components_files, scripts_files = find_all_js_files()
    used_scripts = gather_all_used_scripts()

    print("📦 JS en components:", components_files)
    print("📦 JS en assets/scripts:", scripts_files)
    print("✅ Usados:", sorted(used_scripts))

    unused_components = [f for f in components_files if f not in used_scripts]
    unused_scripts = [f for f in scripts_files if f not in used_scripts]

    print("🗑️ No usados en components:", unused_components)
    print("🗑️ No usados en scripts:", unused_scripts)

    for f in unused_components:
        path = os.path.join(COMPONENTS_DIR, f)
        print(f"❌ Eliminando {path}")
        os.remove(path)

    for f in unused_scripts:
        path = os.path.join(SCRIPTS_DIR, f)
        print(f"❌ Eliminando {path}")
        os.remove(path)

if __name__ == "__main__":
    clean_unused_files()

'''
        }
    },
    "docs": {
        "README.md": ''' 
# XandA - Generador de Sitios Web

**XandA** es un generador de sitios web de código libre desarrollador en python, cuyo propósito es generar estructuras de proyectos para facilitar el desarrollo de sitios web y así mejorar la productividad en cada proyecto. Dichas estructuras son fáciles de modificar, intuitivas y limpias, proporcionando al desarrollador un código y una jerarquía de carpetas bastante amigable.

----------------------------------------

## Estrcutura del proyecto
Se compone de tres carpetas y siete archivos en la raíz, los cuales cumplen funciones específicas dentro del proyecto, mientras que otros albergan subcarpetas como el caso de "src", cuyo contenido es alojar a "assets", "components", "config", "pages" y "utils" juntos a su respectivo contenido correspondiente:

    ├── src/ # Código fuente principal
    │ ├── assets/ # Recursos estáticos
    │ │ ├── images/
    │ │ │ ├── icons/
    │ │ │ └── svg/
    │ │ │ └── sprite.svg
    │ │ ├── styles/
    │ │ │ └── main.css # Estilos globales
    │ │ └── scripts/
    │ │ └── main.js # Scripts globales
    │ ├── components/ # Componentes reutilizables
    │ ├── config/ # Scripts de configuración
    │ │ ├── purgar.py # Limpieza de archivos JS/CSS no usados
    │ │ └── sitemap.py # Generación automática de sitemap.xml
    │ ├── pages/ # Páginas HTML/PHP del sitio
    │ │ ├── index.html
    │ │ ├── contacto.html
    │ │ ├── 404.html
    │ │ └── ...
    │ └── utils/ # Funciones auxiliares
    │
    ├── docs/ # Documentación
    │ └── README.md
    ├── test/ # Pruebas
    │
    ├── .htaccess
    ├── .gitignore
    ├── index.html
    ├── LICENSE.txt
    ├── manifest.json
    ├── robots.txt
    └── sitemap.xml

----------------------------------------

## Carpetas, usos y archivos

**config:**
Alberga dos archivos importantes que deben ser ejecutados con extremo cuidado y cada uno aporta una función crucial al proyecto:
 - *sitemap.py:* Anlaiza el contenido de la carpeta "pages" todos los archivos .html y .php los agrega al sitemap.xml. En el caso de haber eliminado un archivo y este ya había sido previamente cargado al sitemap.xml, el archivo sitemap.py es capaz de identificar si un archivo ya no se encuentra dentro de esa carpeta y lo elimina del sitemap.xml
 - *purgar.py:* Este debe ser ejecutado únicamente al final del proyecto, cuando este esté terminado y listo para ser publicado. Su objetivo es analizar los archivos .html y .php de la raíz junto a los alojados en la carpeta "pages", este detectará que archivos .css y .js fueron utilizados de las carpetas "styles", "scripts" y "components" para posteriormente eliminar los archivos que no fueron ocupados, esto con la finalidad de ahorrar espacio y evitar la cargar de archivos innecesarios y proporcionar un código más limpo.

**components:**
Los archivos de esta carpeta tienen como fin proporcionar componentes que pueden ser utilizados en páginas .html y .php, algunos de ellos son menús, secciones, formularios, etc. La forma de cargar un componente es mandarlo a llamar con un "<scripts src="./src/components/componente.js"></scripts>", porteriormente necesitarás insertar esto en tu etiquetado .html o tu código .php "". No obstante, dentro de cada componente hay un comentario que te explicará como mandarlo a llamar.

**sprite.svg**
El archivo sprite.svg está alojado dentro de la carpeta "svg" y su función es almacenar bastantes .svg en un solo archivo, con la finalidad de ser mandados a llamar a través de la sintaxis "xlink:href" y así ahorrar tiempo, redundancia y peso a los archivos que requieran de estos respectivos .svg

----------------------------------------
'''
    },
    "tests": {

    },
    "favicon.ico": ""
}

# Archivos raíz con contenido
root_files = {
    ".htaccess": "# Aquí puedes poner reglas para Apache\n",
    "robots.txt": "User-agent: *\nDisallow:\n",
    "sitemap.xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <!-- URLs del sitio -->\n</urlset>\n",
    "LICENSE.txt": " ",
    "manifest.json": "{\n  \"name\": \"Proyecto\",\n  \"shorts_name\": \"Proyecto\",\n  \"start_url\": \"/\",\n  \"display\": \"standalone\"\n}\n",
    "index.html": '''

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index</title>
    <meta name="date" content="2024-09-05">
    <link rel="canonical" href="URL">
    <meta name="theme-color" content="#ffffff">
    <link rel="alternate" hreflang="es" href="URL">
    <meta name="mobile-web-app-capable" content="yes">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="Referrer-Policy" content="no-referrer-when-downgrade">-->
    
    <!-- SEO -->
    <meta name="description" content="Descripcion">
    <meta name="keywords" content="Palabras clave">
    <meta name="author" content="Autor">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    <meta name="subject" content="Subject">
    <meta name="rating" content="General">
    
    <!-- Open Graph para Redes Sociales -->
    <meta property="og:title" content="Titulo">
    <meta property="og:type" content="website">
    <meta property="og:url" content="URL">
    <meta property="og:description" content="Descripcion">
    <meta property="og:locale" content="es_MX">
    <meta property="og:site_name" content="nombre">
    <meta property="og:image" content="assets/images/">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Titulo">
    <meta name="twitter:description" content="Descripcion">
    <meta name="twitter:site" content="nombre">
    <meta name="twitter:image" content="assets/images/">
    <meta property="og:image:alt" content="Titulo">

    <!-- Favicon -->
    <link rel="icon" href="favicon.ico">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" sizes="180x180" href="src/assets/images/icons/apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" sizes="152x152" href="src/assets/images/icons/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="120x120" href="src/assets/images/icons/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="src/assets/images/icons/apple-touch-icon-76x76.png">

    <!-- Iconos para Android -->
    <link rel="icon" sizes="192x192" href="src/assets/images/icons/android-chrome-192x192.png">
    <link rel="icon" sizes="512x512" href="src/assets/images/icons/android-chrome-512x512.png">

    <!-- Otros formatos -->
    <link rel="icon" type="image/png" sizes="32x32" href="src/assets/images/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="src/assets/images/icons/favicon-16x16.png">

    <!-- AWESOME  -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    <!-- AOS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

    <!-- CSS -->
    <link rel="stylesheet" href="src/assets/styles/main.css">

    <!-- Datos Estructurados JSON-LD -->
    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        "name": "Nombre",
        "url": "URL",
        "logo": "assets/images/logo.png",
        "sameAs": [
            "URL Redes Sociales",
            "URL Redes Sociales"
        ],
        "description": "Descripcion",
        "founder": "Nombre del fundador",
        "foundingDate": "Año",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "correo electrónico",
            "url": "URL contacto"
        }
        }
    </script>

    <!-- Fuentes -->
</head>
<body class="body">
    <!-- Header -->
    <header class="header">
    </header>

    <!-- Main -->
    <main class="main">
    </main>

    <!-- Footer -->
    <footer class="footer">
    </footer>

    <!-- Scripts -->
    <script src="src/assets/scripts/main.js"></script>
</body>
</html>
''',
    ".gitignore": "hola"
}

def create_structure(base_path, structure_dict):
    for name, content in structure_dict.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            # Es carpeta
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            # Es archivo con contenido
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)

def create_root_files(base_path, files_dict):
    for filename, content in files_dict.items():
        path = os.path.join(base_path, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    base = os.getcwd()
    print(f"Creando estructura en: {base}")
    create_structure(base, structure)
    create_root_files(base, root_files)
    print("¡Estructura creada con éxito!")