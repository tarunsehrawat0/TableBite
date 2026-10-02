#!/usr/bin/env bash
set -euo pipefail

git init
git switch -c main
git add .gitignore README.md
git commit -m "chore: initialize TableBite repository"
git switch -c develop
git commit --allow-empty -m "chore: start development branch"
git switch -c feature/backend
git commit --allow-empty -m "feat: add backend service"
git switch develop
git switch -c feature/frontend
git commit --allow-empty -m "feat: add frontend service"
git switch develop

cat <<'STEPS'
Conflict exercise:
  git switch -c conflict-a && printf 'owner: kitchen\n' > conflict.txt && git add conflict.txt && git commit -m 'docs: add kitchen owner'
  git switch develop && git switch -c conflict-b && printf 'owner: platform\n' > conflict.txt && git add conflict.txt && git commit -m 'docs: add platform owner'
  git switch develop && git merge conflict-a && git merge conflict-b
  edit conflict.txt, remove <<<<<<< / ======= / >>>>>>> markers, then:
  git add conflict.txt && git commit -m 'merge: resolve ownership conflict'
STEPS