from __future__ import annotations

import argparse
import json
import re
import tempfile
import tkinter as tk
from tkinter import filedialog
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
PROJECTS_FILE = ROOT_DIR / "assets" / "data" / "projects-data.js"
PROJECTS_RE = re.compile(
    r"^\s*window\s*\.\s*PROJECTS_DATA\s*=\s*(\{.*\})\s*;?\s*$",
    re.DOTALL,
)


def read_projects_data() -> dict:
    text = PROJECTS_FILE.read_text(encoding="utf-8")
    match = PROJECTS_RE.match(text)
    if not match:
        raise ValueError("Format invalide : window.PROJECTS_DATA = {...}; introuvable.")

    data = json.loads(match.group(1))
    validate_projects_data(data)
    return data


def validate_projects_data(data: object) -> None:
    if not isinstance(data, dict):
        raise ValueError("Le payload doit être un objet JSON.")

    projects = data.get("projects")
    if not isinstance(projects, list):
        raise ValueError("Le payload doit contenir une liste 'projects'.")

    seen_ids: set[str] = set()
    for index, project in enumerate(projects):
        if not isinstance(project, dict):
            raise ValueError(f"Le projet #{index} n'est pas un objet.")

        project_id = project.get("id")
        if not isinstance(project_id, str) or not project_id.strip():
            raise ValueError(f"Le projet #{index} n'a pas d'id valide.")

        if project_id in seen_ids:
            raise ValueError(f"ID de projet dupliqué : {project_id}")
        seen_ids.add(project_id)

        if "category" in project and not isinstance(project["category"], list):
            raise ValueError(f"Le champ category de {project_id} doit être une liste.")

        if "sections" in project and not isinstance(project["sections"], list):
            raise ValueError(f"Le champ sections de {project_id} doit être une liste.")

        if "medias" in project and not isinstance(project["medias"], list):
            raise ValueError(f"Le champ medias de {project_id} doit être une liste.")


def write_projects_data(data: dict) -> None:
    validate_projects_data(data)
    content = "window.PROJECTS_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"

    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        newline="\n",
        dir=PROJECTS_FILE.parent,
        delete=False,
    ) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)

    tmp_path.replace(PROJECTS_FILE)


def pick_media_file() -> dict:
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)

    try:
        filename = filedialog.askopenfilename(
            title="Choisir un média du portfolio",
            initialdir=str(ROOT_DIR / "assets" / "projects"),
            filetypes=(
                ("Images / vidéos", "*.png *.jpg *.jpeg *.gif *.webp *.mp4 *.mov *.webm *.ogg"),
                ("Images", "*.png *.jpg *.jpeg *.gif *.webp"),
                ("Vidéos", "*.mp4 *.mov *.webm *.ogg"),
                ("Tous les fichiers", "*.*"),
            ),
        )
    finally:
        root.destroy()

    if not filename:
        return {"ok": False, "cancelled": True}

    selected = Path(filename).resolve()
    portfolio_root = ROOT_DIR.resolve()

    try:
        relative = selected.relative_to(portfolio_root)
    except ValueError as exc:
        raise ValueError("Le fichier choisi doit se trouver dans le dossier du portfolio.") from exc

    if not selected.is_file():
        raise ValueError("Le chemin choisi n'est pas un fichier.")

    return {
        "ok": True,
        "path": relative.as_posix(),
    }


class PortfolioEditorHandler(SimpleHTTPRequestHandler):
    server_version = "PortfolioEditor/1.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def handle(self) -> None:
        try:
            super().handle()
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            pass

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path.split("?", 1)[0] == "/api/projects":
            self.send_json(read_projects_data())
            return

        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            # Le navigateur coupe parfois les requêtes média en cours
            # (miniatures vidéo, seek, changement de page). Ce n'est pas une
            # erreur côté serveur, donc on évite juste le traceback énorme.
            pass

    def do_POST(self) -> None:
        endpoint = self.path.split("?", 1)[0]

        if endpoint == "/api/pick-media":
            try:
                self.send_json(pick_media_file())
            except Exception as error:
                self.send_json({"ok": False, "error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return

        if endpoint != "/api/projects":
            self.send_error(HTTPStatus.NOT_FOUND, "Endpoint inconnu.")
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)
            data = json.loads(raw_body.decode("utf-8"))
            write_projects_data(data)
        except Exception as error:
            self.send_json({"ok": False, "error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return

        self.send_json({"ok": True})

    def send_json(self, payload: object, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            pass

    def log_message(self, format: str, *args) -> None:
        print(f"[server] {self.address_string()} - {format % args}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Serveur local du mode édition du portfolio.")
    parser.add_argument("--host", default="127.0.0.1", help="Host d'écoute. Défaut : 127.0.0.1")
    parser.add_argument("--port", type=int, default=8000, help="Port d'écoute. Défaut : 8000")
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), PortfolioEditorHandler)
    url = f"http://{args.host}:{args.port}/?edit=1#portfolio"

    print("Serveur local du portfolio lancé.")
    print(f"Racine : {ROOT_DIR}")
    print(f"Éditeur : {url}")
    print("Ctrl+C pour arrêter.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt du serveur.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
