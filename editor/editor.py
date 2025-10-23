import json
import re
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox
import customtkinter as ctk

# Prefer Akascape's CTkListbox if available. Fallback to tk.Listbox (stable).
try:
    from ctk_listbox import CTkListbox  # https://github.com/Akascape/CTkListbox
except Exception:
    CTkListbox = None

import sys, os

current_dir = os.path.dirname(os.path.abspath(__file__))
exec_dir = os.path.dirname(current_dir)
os.chdir(exec_dir)
sys.path.insert(0, exec_dir)

# ------------------------------
# Config
# ------------------------------
APP_TITLE = "projects-data.js Editor"
PROJECTS_JSON = "./assets/data/projects-data.js"
ASSETS_DIR = Path("./assets").resolve()

# ------------------------------
# Helpers
# ------------------------------

_JS_ASSIGN_RE = re.compile(
    r"""^\s*window\s*\.\s*PROJECTS_DATA\s*=\s*(\{.*\})\s*;?\s*$""",
    re.DOTALL,
)

def parse_projects_js(text: str) -> dict:
    """
    Extrait l'objet JSON du fichier JS `window.PROJECTS_DATA = {...};`
    et le retourne sous forme de dict Python.
    Lève ValueError si le format ne correspond pas.
    """
    m = _JS_ASSIGN_RE.match(text)
    if not m:
        raise ValueError("Le fichier ne contient pas une assignation window.PROJECTS_DATA = {...};")
    json_str = m.group(1)
    return json.loads(json_str)

def dump_projects_js(data: dict) -> str:
    """
    Sérialise le dict Python en JS avec le wrapper window.PROJECTS_DATA = ...;
    """
    return "window.PROJECTS_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"


def ensure_assets_dir():
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)


def is_in_assets(path: Path) -> bool:
    try:
        return path.resolve().is_file() and ASSETS_DIR in path.resolve().parents
    except Exception:
        return False


def to_relative_posix(path: Path) -> str:
    try:
        rel = path.resolve().relative_to(Path.cwd().resolve())
    except Exception:
        rel = path.name
    return Path(rel).as_posix()


def browse_in_assets(filetypes=(
    ("Images / Videos", "*.png *.jpg *.jpeg *.gif *.webp *.mp4 *.mov *.webm"),
    ("All files", "*.*"),
)) -> str | None:
    ensure_assets_dir()
    filename = filedialog.askopenfilename(
        title="Choisir un fichier dans ./assets",
        initialdir=str(ASSETS_DIR),
        filetypes=filetypes,
    )
    if not filename:
        return None
    p = Path(filename)
    if not is_in_assets(p):
        messagebox.showerror(
            APP_TITLE,
            "Le fichier sélectionné doit être situé dans ./assets ou l'un de ses sous-dossiers.",
        )
        return None
    return to_relative_posix(p)


# ------------------------------
# Data Model
# ------------------------------

def default_project() -> dict:
    return {
        "id": "nouveau-projet",
        "title": "Nouveau Projet",
        "category": "autre",
        "icon": "./assets/images/placeholder.png",
        "description": "",
        "media": "./assets/images/placeholder.png",
        "sections": [],
        "medias": [],
    }


def default_section() -> dict:
    return {
        "title": "Nouvelle section",
        "description": "",
        "medias": [],
    }


# ------------------------------
# Small adapters to normalize CTkListbox / tk.Listbox
# ------------------------------

def lb_delete_all(lb):
    try:
        lb.delete("all")  # CTkListbox
    except Exception:
        lb.delete(0, tk.END)  # tk.Listbox


def lb_insert_end(lb, text):
    try:
        lb.insert("end", text)  # CTkListbox
    except Exception:
        lb.insert(tk.END, text)  # tk.Listbox


def lb_size(lb) -> int:
    try:
        return lb.size()  # both support
    except Exception:
        try:
            return lb.size()
        except Exception:
            return 0


def lb_select_set(lb, index):
    try:
        lb.select_set(index)  # CTkListbox
    except Exception:
        lb.select_clear(0, tk.END)
        lb.select_set(index)  # tk.Listbox


def lb_clear_selection(lb):
    # CTkListbox has no select_clear; use deactivate("all") / deselect
    try:
        lb.deactivate("all")
    except Exception:
        lb.select_clear(0, tk.END)


def lb_curselection(lb):
    # CTkListbox returns int or None; tk.Listbox returns a tuple
    try:
        sel = lb.curselection()
    except Exception:
        return None
    if isinstance(sel, (list, tuple)):
        return sel[0] if sel else None
    try:
        return int(sel) if sel is not None else None
    except Exception:
        return None


# ------------------------------
# UI Widgets
# ------------------------------
class LabeledEntry(ctk.CTkFrame):
    def __init__(self, master, label: str, **kwargs):
        super().__init__(master, **kwargs)
        self.columnconfigure(1, weight=1)
        ctk.CTkLabel(self, text=label).grid(row=0, column=0, padx=8, pady=8, sticky="w")
        self.entry = ctk.CTkEntry(self)
        self.entry.grid(row=0, column=1, padx=8, pady=8, sticky="ew")

    def get(self):
        return self.entry.get()

    def set(self, value: str):
        self.entry.delete(0, tk.END)
        self.entry.insert(0, value or "")


class PathPicker(ctk.CTkFrame):
    def __init__(self, master, label: str, on_change=None, **kwargs):
        super().__init__(master, **kwargs)
        self.on_change = on_change
        self.columnconfigure(1, weight=1)
        ctk.CTkLabel(self, text=label).grid(row=0, column=0, padx=(8, 4), pady=8, sticky="w")
        self.entry = ctk.CTkEntry(self)
        self.entry.grid(row=0, column=1, padx=(0, 4), pady=8, sticky="ew")
        ctk.CTkButton(self, text="...", width=36, command=self._browse).grid(row=0, column=2, padx=(0, 4), pady=8)
        ctk.CTkButton(self, text="x", width=28, command=self._clear).grid(row=0, column=3, padx=(0, 8), pady=8)

    def _browse(self):
        chosen = browse_in_assets()
        if chosen:
            self.set(chosen)

    def _clear(self):
        self.set("")

    def get(self):
        return self.entry.get().strip()

    def set(self, value: str):
        self.entry.delete(0, tk.END)
        self.entry.insert(0, value or "")
        if callable(self.on_change):
            self.on_change(self.get())


class TextArea(ctk.CTkFrame):
    def __init__(self, master, label: str, **kwargs):
        super().__init__(master, **kwargs)
        self.rowconfigure(1, weight=1)
        self.columnconfigure(0, weight=1)
        ctk.CTkLabel(self, text=label).grid(row=0, column=0, padx=8, pady=(8, 4), sticky="w")
        self.text = ctk.CTkTextbox(self, wrap="word")
        self.text.grid(row=1, column=0, padx=8, pady=(0, 8), sticky="nsew")

    def get(self):
        return self.text.get("1.0", tk.END).rstrip("\n")

    def set(self, value: str):
        self.text.delete("1.0", tk.END)
        self.text.insert("1.0", value or "")


class ListWithPickers(ctk.CTkFrame):
    def __init__(self, master, title: str, **kwargs):
        super().__init__(master, **kwargs)
        self.columnconfigure(0, weight=1)
        ctk.CTkLabel(self, text=title).grid(row=0, column=0, padx=8, pady=(8, 4), sticky="w")

        self.items_frame = ctk.CTkScrollableFrame(self)
        self.items_frame.grid(row=1, column=0, padx=8, pady=(0, 8), sticky="nsew")
        self.rowconfigure(1, weight=1)

        btns = ctk.CTkFrame(self)
        btns.grid(row=2, column=0, padx=8, pady=(0, 8), sticky="ew")
        btns.columnconfigure((0, 1, 2), weight=1)
        ctk.CTkButton(btns, text="Ajouter", command=self.add_item).grid(row=0, column=0, padx=4, pady=4, sticky="ew")
        ctk.CTkButton(btns, text="Monter", command=lambda: self.move_selected(-1)).grid(row=0, column=1, padx=4, pady=4, sticky="ew")
        ctk.CTkButton(btns, text="Descendre", command=lambda: self.move_selected(1)).grid(row=0, column=2, padx=4, pady=4, sticky="ew")

        self.rows: list[dict] = []
        self.selected_index = tk.IntVar(value=-1)

    def _rebuild_indices(self):
        for i, rowd in enumerate(self.rows):
            old_rb = rowd.get("rb")
            if old_rb is not None:
                old_rb.destroy()
            rb = ctk.CTkRadioButton(rowd["frame"], text=str(i + 1), variable=self.selected_index, value=i)
            rb.grid(row=0, column=0, padx=(0, 6), pady=4)
            rowd["rb"] = rb

    def add_item(self, value: str | None = None):
        idx = len(self.rows)
        row = ctk.CTkFrame(self.items_frame)
        row.columnconfigure(1, weight=1)
        rb = ctk.CTkRadioButton(row, text=str(idx + 1), variable=self.selected_index, value=idx)
        entry = ctk.CTkEntry(row)
        ctk.CTkButton(row, text="...", width=36, command=lambda e=entry: self._browse_into(e)).grid(row=0, column=2, padx=(0, 6), pady=4)
        ctk.CTkButton(row, text="x", width=28, command=lambda r=row: self._remove_row(r)).grid(row=0, column=3, padx=(0, 0), pady=4)
        rb.grid(row=0, column=0, padx=(0, 6), pady=4)
        entry.grid(row=0, column=1, padx=(0, 6), pady=4, sticky="ew")
        if value:
            entry.insert(0, value)
        row.pack(fill="x", padx=0, pady=2)
        self.rows.append({"frame": row, "rb": rb, "entry": entry})
        self._rebuild_indices()

    def _remove_row(self, row_frame):
        for i, rowd in enumerate(self.rows):
            if rowd["frame"] is row_frame:
                rowd["frame"].destroy()
                del self.rows[i]
                break
        self._rebuild_indices()

    def _browse_into(self, entry):
        chosen = browse_in_assets()
        if chosen:
            entry.delete(0, tk.END)
            entry.insert(0, chosen)

    def move_selected(self, direction: int):
        idx = self.selected_index.get()
        if idx < 0 or idx >= len(self.rows):
            return
        new_idx = idx + direction
        if not (0 <= new_idx < len(self.rows)):
            return
        self.rows[idx], self.rows[new_idx] = self.rows[new_idx], self.rows[idx]
        for rowd in self.rows:
            rowd["frame"].pack_forget()
        for rowd in self.rows:
            rowd["frame"].pack(fill="x", padx=0, pady=2)
        self.selected_index.set(new_idx)
        self._rebuild_indices()

    def get_list(self) -> list[str]:
        values = []
        for rowd in self.rows:
            val = rowd["entry"].get().strip()
            if val:
                values.append(val)
        return values

    def set_list(self, values: list[str]):
        for rowd in self.rows:
            rowd["frame"].destroy()
        self.rows.clear()
        self.selected_index.set(-1)
        for v in values or []:
            self.add_item(v)


class SectionsPanel(ctk.CTkFrame):
    def __init__(self, master, on_change=None, **kwargs):
        super().__init__(master, **kwargs)
        self.on_change = on_change
        self.columnconfigure(0, weight=1)
        self.rowconfigure(3, weight=1)
        self._using_ctklistbox = CTkListbox is not None
        self._pending_refresh_id = None
        self._block_section_select = False

        ctk.CTkLabel(self, text="Sections").grid(row=0, column=0, padx=8, pady=(8, 4), sticky="w")
        if self._using_ctklistbox:
            self.sections_list = CTkListbox(self, command=lambda _sel: self._on_section_selected())
        else:
            self.sections_list = tk.Listbox(self, activestyle="dotbox")
            self.sections_list.bind("<<ListboxSelect>>", lambda e: self._on_section_selected())
        self.sections_list.grid(row=1, column=0, padx=8, pady=(0, 4), sticky="nsew")

        bar = ctk.CTkFrame(self)
        bar.grid(row=2, column=0, padx=8, pady=4, sticky="ew")
        bar.columnconfigure((0, 1, 2), weight=1)
        ctk.CTkButton(bar, text="Ajouter", command=self.add_section).grid(row=0, column=0, padx=4, pady=4, sticky="ew")
        ctk.CTkButton(bar, text="Dupliquer", command=self.duplicate_section).grid(row=0, column=1, padx=4, pady=4, sticky="ew")
        ctk.CTkButton(bar, text="Supprimer", command=self.delete_section).grid(row=0, column=2, padx=4, pady=4, sticky="ew")

        self.editor = ctk.CTkFrame(self)
        self.editor.grid(row=3, column=0, padx=8, pady=(0, 8), sticky="nsew")
        self.editor.columnconfigure(0, weight=1)
        self.editor.rowconfigure(2, weight=1)

        self.sec_title = LabeledEntry(self.editor, "Titre")
        self.sec_title.grid(row=0, column=0, sticky="ew")
        self.sec_desc = TextArea(self.editor, "Description")
        self.sec_desc.grid(row=1, column=0, sticky="nsew")
        self.sec_medias = ListWithPickers(self.editor, "Médias (paths relatifs depuis ./)")
        self.sec_medias.grid(row=2, column=0, sticky="nsew")

        self.sec_title.entry.bind("<KeyRelease>", lambda e: self._autosave())
        self.sec_desc.text.bind("<KeyRelease>", lambda e: self._autosave())

        self.current_sections: list[dict] = []
        self._loading = False
        self._last_selected: int | None = None

    # ---- Public API ----
    def set_sections(self, sections: list[dict]):
        self.current_sections = [json.loads(json.dumps(s)) for s in (sections or [])]

        def _do_refresh():
            if not self.winfo_exists():
                return
            self._block_section_select = True
            lb_delete_all(self.sections_list)
            for i, sec in enumerate(self.current_sections):
                lb_insert_end(self.sections_list, f"{i+1:02d} · {sec.get('title','(sans titre)')}")
            self._last_selected = None
            if self.current_sections:
                lb_select_set(self.sections_list, 0)
                self._block_section_select = False
                self._load_selected()
            else:
                self._block_section_select = False
                self._clear_editor()

        if self._using_ctklistbox:
            if self._pending_refresh_id is not None:
                try:
                    self.after_cancel(self._pending_refresh_id)
                except Exception:
                    pass
            self._pending_refresh_id = self.after(200, _do_refresh)
        else:
            _do_refresh()

    def get_sections(self) -> list[dict]:
        idx = self._selected_index()
        if idx is not None:
            self._save_editor_into(idx)
        return self.current_sections

    # ---- Buttons actions ----
    def add_section(self):
        idx = self._selected_index()
        if idx is not None:
            self._save_editor_into(idx)
        self.current_sections.append(default_section())
        self.set_sections(self.current_sections)
        if callable(self.on_change):
            self.on_change()

    def duplicate_section(self):
        idx = self._selected_index()
        if idx is None:
            return
        self._save_editor_into(idx)
        self.current_sections.insert(idx + 1, json.loads(json.dumps(self.current_sections[idx])))
        self.set_sections(self.current_sections)
        if callable(self.on_change):
            self.on_change()

    def delete_section(self):
        idx = self._selected_index()
        if idx is None:
            return
        self._save_editor_into(idx)
        del self.current_sections[idx]
        self.set_sections(self.current_sections)
        if callable(self.on_change):
            self.on_change()

    # ---- Internals ----
    def _selected_index(self):
        return lb_curselection(self.sections_list)

    def _clear_editor(self):
        self._loading = True
        self.sec_title.set("")
        self.sec_desc.set("")
        self.sec_medias.set_list([])
        self._loading = False

    def _on_section_selected(self):
        if self._block_section_select:
            return
        if self._last_selected is not None:
            self._save_editor_into(self._last_selected)
        self.after_idle(self._load_selected)

    def _load_selected(self):
        idx = self._selected_index()
        if idx is None or idx < 0 or idx >= len(self.current_sections):
            self._clear_editor()
            return
        self._loading = True
        sec = self.current_sections[idx]
        self.sec_title.set(sec.get("title", ""))
        self.sec_desc.set(sec.get("description", ""))
        self.sec_medias.set_list(sec.get("medias", []))
        self._loading = False
        self._last_selected = idx

    def _save_editor_into(self, idx: int):
        if self._loading:
            return
        if 0 <= idx < len(self.current_sections):
            self.current_sections[idx] = {
                "title": self.sec_title.get(),
                "description": self.sec_desc.get(),
                "medias": self.sec_medias.get_list(),
            }

    def _autosave(self):
        idx = self._selected_index()
        if idx is not None:
            self._save_editor_into(idx)
        if callable(self.on_change):
            self.on_change()


# ------------------------------
# Main App
# ------------------------------
class ProjectsEditor(ctk.CTk):
    def __init__(self):
        super().__init__()
        ctk.set_appearance_mode("system")
        ctk.set_default_color_theme("blue")
        self.title(APP_TITLE)
        self.geometry("1280x800")

        self.protocol("WM_DELETE_WINDOW", self.on_quit)
        self.dirty = False
        self.data = {"projects": []}
        self._current_project_index: int | None = None
        self._block_project_select = False

        # Top bar
        top = ctk.CTkFrame(self)
        top.grid(row=0, column=0, columnspan=3, sticky="ew")
        top.columnconfigure((0, 1, 2, 3, 4), weight=1)
        ctk.CTkButton(top, text="Nouveau projet", command=self.add_project).grid(row=0, column=0, padx=8, pady=8)
        ctk.CTkButton(top, text="Dupliquer", command=self.duplicate_project).grid(row=0, column=1, padx=8, pady=8)
        ctk.CTkButton(top, text="Supprimer", command=self.delete_project).grid(row=0, column=2, padx=8, pady=8)
        ctk.CTkButton(top, text="Recharger", command=self.load_json).grid(row=0, column=3, padx=8, pady=8)
        ctk.CTkButton(top, text="Enregistrer", command=self.save_json).grid(row=0, column=4, padx=8, pady=8)

        # Layout grid
        self.rowconfigure(1, weight=1)
        self.columnconfigure(0, weight=0)
        self.columnconfigure(1, weight=2)
        self.columnconfigure(2, weight=1)

        # Left: projects list
        left = ctk.CTkFrame(self)
        left.grid(row=1, column=0, sticky="nsew")
        left.rowconfigure(1, weight=1)
        left.columnconfigure(0, weight=1)
        ctk.CTkLabel(left, text="Projets").grid(row=0, column=0, padx=8, pady=(8, 4), sticky="w")
        if CTkListbox is not None:
            self.projects_list = CTkListbox(left, command=lambda _sel: self.on_project_selected())
        else:
            self.projects_list = tk.Listbox(left, activestyle="dotbox")
            self.projects_list.bind("<<ListboxSelect>>", lambda e: self.on_project_selected())
        self.projects_list.grid(row=1, column=0, padx=8, pady=(0, 8), sticky="nsew")

        # Center: project editor
        self.center = ctk.CTkFrame(self)
        self.center.grid(row=1, column=1, sticky="nsew")
        self.center.columnconfigure(0, weight=1)
        for r in (0, 1, 2, 3, 4, 5, 6):
            self.center.rowconfigure(r, weight=0)
        self.center.rowconfigure(6, weight=1)

        self.p_id = LabeledEntry(self.center, "ID")
        self.p_title = LabeledEntry(self.center, "Titre")
        self.p_category = LabeledEntry(self.center, "Catégorie")
        self.p_icon = PathPicker(self.center, "Icône (image)")
        self.p_media = PathPicker(self.center, "Média principal")
        self.p_desc = TextArea(self.center, "Description (textarea)")
        self.p_medias = ListWithPickers(self.center, "Galerie du projet (images/vidéos)")

        self.p_id.grid(row=0, column=0, sticky="ew")
        self.p_title.grid(row=1, column=0, sticky="ew")
        self.p_category.grid(row=2, column=0, sticky="ew")
        self.p_icon.grid(row=3, column=0, sticky="ew")
        self.p_media.grid(row=4, column=0, sticky="ew")
        self.p_desc.grid(row=5, column=0, sticky="nsew")
        self.p_medias.grid(row=6, column=0, sticky="nsew")

        # Right: sections
        self.sections_panel = SectionsPanel(self, on_change=self.mark_dirty)
        self.sections_panel.grid(row=1, column=2, sticky="nsew")

        for widget in [
            self.p_id.entry, self.p_title.entry, self.p_category.entry,
            self.p_icon.entry, self.p_media.entry, self.p_desc.text,
        ]:
            widget.bind("<KeyRelease>", lambda e: self._live_autosave_project())
        self.bind("<Control-s>", lambda e: self.save_json())

        self.load_json()

    # --------------------------
    # Data I/O
    # --------------------------
    def load_json(self):
        if not self._confirm_discard_changes():
            return
        try:
            # 1) On tente de charger le nouveau format JS (projects.js)
            with open(PROJECTS_JSON, "r", encoding="utf-8") as f:
                txt = f.read()
            self.data = parse_projects_js(txt)

        except FileNotFoundError:
            # 2) Si le .js n'existe pas, on tente un fallback legacy vers projects.json
            try:
                with open("projects.json", "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except FileNotFoundError:
                self.data = {"projects": []}
            except Exception as e:
                messagebox.showerror(APP_TITLE, f"Erreur de lecture JSON (legacy):\n{e}")
                return

        except Exception as e:
            # Format .js présent mais illisible
            messagebox.showerror(APP_TITLE, f"Erreur de lecture projects.js:\n{e}")
            return

        self.refresh_projects_list()
        self.dirty = False


    def save_json(self):
        idx = self._selected_project_index()
        if idx is not None:
            self._write_editor_into(idx)

        try:
            js_text = dump_projects_js(self.data)
            with open(PROJECTS_JSON, "w", encoding="utf-8") as f:
                f.write(js_text)
        except Exception as e:
            messagebox.showerror(APP_TITLE, f"Erreur d'écriture projects.js:\n{e}")
            return

        self.dirty = False
        messagebox.showinfo(APP_TITLE, "Enregistré ✔")


    # --------------------------
    # Projects operations
    # --------------------------
    def refresh_projects_list(self):
        self._block_project_select = True
        lb_delete_all(self.projects_list)
        for p in self.data.get("projects", []):
            lb_insert_end(self.projects_list, f"{p.get('title','(sans titre)')}  ·  {p.get('id','')} ")
        self._block_project_select = False
        if self.data.get("projects"):
            self.select_project_index(0)
        else:
            self._current_project_index = None
            self.clear_project_editor()

    def select_project_index(self, index: int):
        self._block_project_select = True
        lb_clear_selection(self.projects_list)
        if lb_size(self.projects_list) == 0:
            self._block_project_select = False
            return
        index = max(0, min(index, lb_size(self.projects_list) - 1))
        lb_select_set(self.projects_list, index)
        self._block_project_select = False
        # Load after idle to avoid re-entrancy and CTkListbox after()
        self.after_idle(self.on_project_selected)

    def _selected_project_index(self):
        return lb_curselection(self.projects_list)

    def on_project_selected(self):
        if self._block_project_select:
            return
        new_idx = self._selected_project_index()
        if new_idx is None:
            return
        if self._current_project_index is not None and 0 <= self._current_project_index < len(self.data.get("projects", [])):
            # Try to save current, but guard against mid-delete
            try:
                self._write_editor_into(self._current_project_index)
            except IndexError:
                pass
        self._current_project_index = new_idx
        self.load_selected_project()

    def load_selected_project(self):
        idx = self._selected_project_index()
        if idx is None or idx < 0 or idx >= len(self.data.get("projects", [])):
            return
        proj = self.data["projects"][idx]
        self.p_id.set(proj.get("id", ""))
        self.p_title.set(proj.get("title", ""))
        self.p_category.set(proj.get("category", ""))
        self.p_icon.set(proj.get("icon", ""))
        self.p_media.set(proj.get("media", ""))
        self.p_desc.set(proj.get("description", ""))
        self.p_medias.set_list(proj.get("medias", []))
        self.sections_panel.set_sections(proj.get("sections", []))
        self.dirty = False

    def clear_project_editor(self):
        self.p_id.set("")
        self.p_title.set("")
        self.p_category.set("")
        self.p_icon.set("")
        self.p_media.set("")
        self.p_desc.set("")
        self.p_medias.set_list([])
        self.sections_panel.set_sections([])

    def _write_editor_into(self, idx: int):
        if idx is None or idx < 0 or idx >= len(self.data.get("projects", [])):
            return

        def _validate_path(path_str: str) -> str:
            path_str = path_str.strip()
            if not path_str:
                return path_str
            p = Path(path_str)
            abs_p = (Path.cwd() / p).resolve()
            if not is_in_assets(abs_p):
                messagebox.showerror(APP_TITLE, f"Le chemin doit être dans ./assets : {path_str}")
                raise ValueError("invalid path")
            return to_relative_posix(abs_p)

        proj = self.data["projects"][idx]
        try:
            proj["id"] = self.p_id.get()
            proj["title"] = self.p_title.get()
            proj["category"] = self.p_category.get()
            proj["icon"] = _validate_path(self.p_icon.get()) if self.p_icon.get() else ""
            proj["media"] = _validate_path(self.p_media.get()) if self.p_media.get() else ""
            proj["description"] = self.p_desc.get()
            proj["medias"] = [_validate_path(x) for x in self.p_medias.get_list()]
            proj["sections"] = []
            for sec in self.sections_panel.get_sections():
                proj["sections"].append({
                    "title": sec.get("title", ""),
                    "description": sec.get("description", ""),
                    "medias": [_validate_path(x) for x in sec.get("medias", [])],
                })
        except ValueError:
            return

    def add_project(self):
        if self._current_project_index is not None:
            self._write_editor_into(self._current_project_index)
        self.data.setdefault("projects", []).append(default_project())
        self.refresh_projects_list()
        self.select_project_index(len(self.data["projects"]) - 1)
        self.mark_dirty()

    def duplicate_project(self):
        idx = self._selected_project_index()
        if idx is None:
            return
        self._write_editor_into(idx)
        clone = json.loads(json.dumps(self.data["projects"][idx]))
        clone["id"] = f"{clone.get('id','projet')}-copy"
        clone["title"] = f"{clone.get('title','Projet')} (copie)"
        self.data["projects"].insert(idx + 1, clone)
        self.refresh_projects_list()
        self.select_project_index(idx + 1)
        self.mark_dirty()

    def delete_project(self):
        idx = self._selected_project_index()
        if idx is None:
            return
        if not messagebox.askyesno(APP_TITLE, "Supprimer ce projet ?"):
            return
        # Remove safely
        if 0 <= idx < len(self.data.get("projects", [])):
            del self.data["projects"][idx]
        # Decide next selection
        remaining = len(self.data.get("projects", []))
        next_idx = None if remaining == 0 else min(idx, remaining - 1)
        self._current_project_index = None  # avoid saving with stale index during refresh
        self.refresh_projects_list()
        if next_idx is not None:
            self.select_project_index(next_idx)
        self.mark_dirty()

    # --------------------------
    # Misc
    # --------------------------
    def _live_autosave_project(self):
        idx = self._selected_project_index()
        if idx is not None:
            self._write_editor_into(idx)
        self.mark_dirty()

    def mark_dirty(self, *_):
        self.dirty = True

    def _confirm_discard_changes(self) -> bool:
        if not self.dirty:
            return True
        return messagebox.askyesno(APP_TITLE, "Des modifications non enregistrées seront perdues. Continuer ?")

    def on_quit(self):
        if not self._confirm_discard_changes():
            return
        self.destroy()


if __name__ == "__main__":
    ensure_assets_dir()
    app = ProjectsEditor()
    app.mainloop()
