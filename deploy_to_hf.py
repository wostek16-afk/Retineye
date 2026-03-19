#!/usr/bin/env python3
"""
deploy_to_hf.py — Déploie Retineye sur HuggingFace Spaces en une commande.

Usage :
    pip install huggingface_hub
    python deploy_to_hf.py --token hf_XXXXXXXXXX --username TonPseudoHF --model chemin/vers/best_model_v2.pth
"""

import argparse
import sys
from pathlib import Path

try:
    from huggingface_hub import HfApi, create_repo
except ImportError:
    print("❌ Module manquant. Lance d'abord :")
    print("   pip install huggingface_hub")
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Déploie Retineye sur HuggingFace Spaces")
    parser.add_argument("--token",      required=True,  help="Ton token HuggingFace (hf_xxx...)")
    parser.add_argument("--username",   required=True,  help="Ton pseudo HuggingFace (ex: Wostek162)")
    parser.add_argument("--space-name", default="retineye",    help="Nom du Space (défaut: retineye)")
    parser.add_argument("--model-repo", default="retineye-v2", help="Nom du repo modèle (défaut: retineye-v2)")
    parser.add_argument("--model",      default=None,   help="Chemin vers best_model_v2.pth (optionnel si déjà uploadé)")
    args = parser.parse_args()

    api        = HfApi(token=args.token)
    space_id   = f"{args.username}/{args.space_name}"
    model_id   = f"{args.username}/{args.model_repo}"
    root       = Path(__file__).parent

    # ── 1. Upload du modèle (si fourni) ─────────────────────────────────────
    if args.model:
        model_path = Path(args.model)
        if not model_path.exists():
            print(f"❌ Fichier modèle introuvable : {model_path}")
            sys.exit(1)

        print(f"\n📦 Création du repo modèle « {model_id} »...")
        create_repo(
            repo_id=model_id,
            repo_type="model",
            private=True,   # privé par défaut (le Space y accède via HF_TOKEN)
            exist_ok=True,
            token=args.token,
        )

        size_mb = model_path.stat().st_size / 1024 / 1024
        print(f"⬆️  Upload du modèle ({size_mb:.0f} MB) — patience...")
        api.upload_file(
            path_or_fileobj=str(model_path),
            path_in_repo="best_model_v2.pth",
            repo_id=model_id,
            repo_type="model",
            token=args.token,
        )
        print(f"✅ Modèle uploadé sur https://huggingface.co/{model_id}\n")
    else:
        print(f"\nℹ️  Pas de modèle fourni — le Space utilisera {model_id} (déjà uploadé).\n")

    # ── 2. Créer le Space ────────────────────────────────────────────────────
    print(f"🚀 Création du Space « {space_id} »...")
    create_repo(
        repo_id=space_id,
        repo_type="space",
        space_sdk="docker",
        private=False,
        exist_ok=True,
        token=args.token,
    )
    print("✅ Space prêt !\n")

    # ── 3. Fichiers individuels ──────────────────────────────────────────────
    files = [
        (root / "hf_space" / "README.md",     "README.md"),
        (root / "hf_space" / "Dockerfile",    "Dockerfile"),
        (root / "hf_space" / "app.py",        "app.py"),
        (root / "package.json",               "package.json"),
        (root / "index.html",                 "index.html"),
        (root / "vite.config.js",             "vite.config.js"),
        (root / "eslint.config.js",           "eslint.config.js"),
    ]
    if (root / "package-lock.json").exists():
        files.append((root / "package-lock.json", "package-lock.json"))

    for local, remote in files:
        print(f"  ⬆️  {remote}")
        api.upload_file(
            path_or_fileobj=str(local),
            path_in_repo=remote,
            repo_id=space_id,
            repo_type="space",
            token=args.token,
        )

    # ── 4. Dossier src/ ─────────────────────────────────────────────────────
    print("  ⬆️  src/ (dossier complet)...")
    api.upload_folder(
        folder_path=str(root / "src"),
        path_in_repo="src",
        repo_id=space_id,
        repo_type="space",
        token=args.token,
    )

    # ── 5. Dossier public/ si présent ───────────────────────────────────────
    if (root / "public").exists():
        print("  ⬆️  public/")
        api.upload_folder(
            folder_path=str(root / "public"),
            path_in_repo="public",
            repo_id=space_id,
            repo_type="space",
            token=args.token,
        )

    # ── 6. Ajouter HF_TOKEN comme secret du Space ───────────────────────────
    print("\n🔐 Ajout du secret HF_TOKEN dans le Space...")
    try:
        api.add_space_secret(
            repo_id=space_id,
            key="HF_TOKEN",
            value=args.token,
        )
        print("✅ Secret HF_TOKEN ajouté — le Space peut accéder au modèle privé.\n")
    except Exception as e:
        print(f"⚠️  Secret non ajouté automatiquement ({e})")
        print(f"   → Ajoute-le manuellement : https://huggingface.co/spaces/{space_id}/settings\n")

    print(f"""
╔══════════════════════════════════════════════════════════════╗
║  ✅  Tout est déployé !                                      ║
╠══════════════════════════════════════════════════════════════╣
║  🧠  Modèle  : https://huggingface.co/{model_id:<21}║
║  🌐  App     : https://huggingface.co/spaces/{space_id:<16}║
║                                                              ║
║  ⏳  Le build Docker prend ~5-10 min la première fois.       ║
║      Surveille les logs sur la page du Space.                ║
╚══════════════════════════════════════════════════════════════╝
""")

if __name__ == "__main__":
    main()
