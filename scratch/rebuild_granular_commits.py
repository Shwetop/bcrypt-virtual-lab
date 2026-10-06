import subprocess
import os
import shutil

repo_dir = r"c:\College\css\css-lab"

def run_git(cmd):
    p = subprocess.run(cmd, cwd=repo_dir, capture_output=True, text=True, shell=True)
    if p.returncode != 0:
        print(f"ERROR: {cmd}\n{p.stderr}")
        raise RuntimeError(f"Git command failed: {cmd}\n{p.stderr}")
    else:
        print(f"OK: {cmd}")
    return p

def sync_root_index():
    src = os.path.join(repo_dir, "experiments", "bcrypt", "index.html")
    with open(src, "r", encoding="utf-8") as f:
        content = f.read()
    root_index = content.replace('../../css/', './css/')
    root_index = root_index.replace('../../js/', './js/')
    root_index = root_index.replace('../../assets/', './assets/')
    root_index = root_index.replace('href="style.css"', 'href="./style.css"')
    root_index = root_index.replace('src="script.js"', 'src="./script.js"')
    with open(os.path.join(repo_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(root_index)

# 0. Start clean from ba6f5b4
run_git("git checkout -B standalone-bcrypt ba6f5b4")

# Commit 1: 63c75ba state
run_git("git checkout f5b697d -- assets/ css/ js/")
run_git("git checkout 63c75ba -- experiments/bcrypt/")
sync_root_index()
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "script.js"), os.path.join(repo_dir, "script.js"))
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "style.css"), os.path.join(repo_dir, "style.css"))
run_git("git add -A")
run_git('git commit -m "feat(bcrypt): implement bcrypt virtual lab experiment module with interactive tools and assessment"')

# Commit 2: 5f981ce state
run_git("git checkout 5f981ce -- experiments/bcrypt/")
sync_root_index()
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "script.js"), os.path.join(repo_dir, "script.js"))
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "style.css"), os.path.join(repo_dir, "style.css"))
run_git("git add -A")
run_git('git commit -m "feat(bcrypt): implement innovative simulation tools with edge-case handling"')

# Commit 3: af73b06 state
run_git("git checkout af73b06 -- experiments/bcrypt/")
sync_root_index()
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "script.js"), os.path.join(repo_dir, "script.js"))
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "style.css"), os.path.join(repo_dir, "style.css"))
run_git("git add -A")
run_git('git commit -m "feat(bcrypt): add enhanced theory, active-recall flashcards, modal dialogs, and learner visualizers"')

# Commit 4: 91cb898 state
run_git("git checkout 91cb898 -- experiments/bcrypt/")
sync_root_index()
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "script.js"), os.path.join(repo_dir, "script.js"))
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "style.css"), os.path.join(repo_dir, "style.css"))
run_git("git add -A")
run_git('git commit -m "fix(bcrypt): replace raw math dollar notations with HTML tags and expand quiz to 10 questions"')

# Commit 5: 3709c59 state
run_git("git checkout 3709c59 -- experiments/bcrypt/")
sync_root_index()
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "script.js"), os.path.join(repo_dir, "script.js"))
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "style.css"), os.path.join(repo_dir, "style.css"))
run_git("git add -A")
run_git('git commit -m "fix(bcrypt): harmonize buttons with dark mocha template, remove emojis, and prevent text/layout overlaps"')

# Commit 6: 221b398 state + forwarders + standalone root files
run_git("git checkout 221b398 -- experiments/bcrypt/")
sync_root_index()
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "script.js"), os.path.join(repo_dir, "script.js"))
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "style.css"), os.path.join(repo_dir, "style.css"))
shutil.copy(os.path.join(repo_dir, "experiments", "bcrypt", "README.md"), os.path.join(repo_dir, "README.md"))

redirect_pages = [
    ("theory.html", "Theory", "theory"),
    ("procedure.html", "Procedure", "procedure"),
    ("pipeline.html", "Bcrypt Flow", "pipeline"),
    ("experiment.html", "Simulation", "simulation"),
    ("quiz.html", "Quiz", "quiz"),
    ("references.html", "References", "references")
]

for filename, title, tab in redirect_pages:
    target_path = os.path.join(repo_dir, filename)
    redir_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=index.html#{tab}">
    <title>Bcrypt Virtual Lab - {title}</title>
    <script>window.location.replace("index.html#{tab}");</script>
</head>
<body style="background:#1e1e2e;color:#cdd6f4;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
    <p>Loading {title}... <a href="index.html#{tab}" style="color:#89b4fa;">Click here if not redirected</a></p>
</body>
</html>
"""
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(redir_html)

run_git("git add -A")
run_git('git commit -m "fix(bcrypt): add missing .hidden and .b-modal-overlay.hidden display: none rule and configure standalone root entrypoints"')

print("ALL 6 COMMITS BUILT SUCCESSFULLY!")
