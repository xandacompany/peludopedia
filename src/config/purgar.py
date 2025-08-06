
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
SCRIPT_SRC_REGEX = re.compile(r"<script[^>]+src=["']([^"']+)["']", re.IGNORECASE)

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

