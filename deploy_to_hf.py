#!/usr/bin/env python3
"""
deploy_to_hf.py — Déploie Retineye sur HuggingFace Spaces en une commande.

Usage :
    pip install huggingface_hub
    python deploy_to_hf.py --token hf_XXXXXXXXXX --username TonPseudoHF
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
    parser.add_argument("--token",      required=True, help="Ton token HuggingFace (hf_xxx...)")
    parser.add_argument("--username",   required=True, help="Ton pseudo HuggingFace (ex: Wostek162)")
    parser.add_argument("--space-name", default="retineye", help="Nom du Space (défaut: retineye)")
    args = parser.parse_args()

    api      = HfApi(token=args.token)
    repo_id  = f"{args.username}/{args.space_name}"
    root     = Path(__file__).parent

    # ── 1. Créer le Space ────────────────────────────────────────────────────
    print(f"\n🚀 Création du Space « {repo_id} »...")
    create_repo(
        repo_id=repo_id,
        repo_type="space",
        space_sdk="docker",
        private=False,
        exist_ok=True,
        token=args.token,
    )
    print("✅ Space prêt !\n")

    # ── 2. Fichiers individuels ──────────────────────────────────────────────
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
            repo_id=repo_id,
            repo_type="space",
            token=args.token,
        )

    # ── 3. Dossier src/ ─────────────────────────────────────────────────────
    print("  ⬆️  src/ (dossier complet)...")
    api.upload_folder(
        folder_path=str(root / "src"),
        path_in_repo="src",
        repo_id=repo_id,
        repo_type="space",
        token=args.token,
    )

    # ── 4. Dossier public/ si présent ───────────────────────────────────────
    if (root / "public").exists():
        print("  ⬆️  public/")
        api.upload_folder(
            folder_path=str(root / "public"),
            path_in_repo="public",
            repo_id=repo_id,
            repo_type="space",
            token=args.token,
        )

    print(f"""
╔══════════════════════════════════════════════════════════════╗
║  ✅  Déploiement terminé !                                   ║
╠══════════════════════════════════════════════════════════════╣
║  🌐  Ton app :                                               ║
║      https://huggingface.co/spaces/{repo_id:<26}║
║                                                              ║
║  ⚙️   Si le modèle est privé, ajoute le secret HF_TOKEN :   ║
║      → https://huggingface.co/spaces/{repo_id}/settings     ║
║      → "Repository secrets" → New secret                    ║
║        Nom  : HF_TOKEN                                       ║
║        Val. : {args.token[:8]}...                            ║
║                                                              ║
║  ⏳  Le build Docker prend ~5-10 min la première fois.       ║
╚══════════════════════════════════════════════════════════════╝
""")

if __name__ == "__main__":
    main()
