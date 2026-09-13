#!/bin/bash
# Reject a commit whose staged content adds a git conflict marker.
#
# Why this repo needs its own copy: the workspace guard added on 2026-09-05 lives inside
# bin/queue-push, and this repo does not commit through queue-push - it commits directly.
# Q-VID-151 measured `git pull --rebase --autostash` writing "<<<<<<< / ======= / >>>>>>>"
# into another room's file and still returning rc 0, and WS then found one such commit
# already in the shared tree. The files in this repo are built into PDFs and sent to a
# client, so a marker landing in one is a defect that reaches somebody outside Gumon.
#
# Install: .git/hooks/pre-commit calls this. Reinstall after a fresh clone.
# Exit 7 matches the workspace guard's code for the same condition.

set -u
added=$(git diff --cached --unified=0 --no-color -- . \
        | grep -nE '^\+(<{7}|={7}|>{7}|\|{7})([ \t]|$)' || true)

[ -z "$added" ] && exit 0

echo "pre-commit: staged content adds git conflict markers." >&2
echo "$added" | head -20 >&2
echo >&2
echo "Files affected:" >&2
git diff --cached --name-only -- . | while read -r f; do
  [ -f "$f" ] || continue
  if grep -qE '^(<{7}|={7}|>{7}|\|{7})([ \t]|$)' "$f"; then echo "  $f" >&2; fi
done
echo >&2
echo "Resolve the conflict in the file, then commit. Do not --no-verify past this:" >&2
echo "a marker here is built into a client PDF. (Q-VID-151)" >&2
exit 7
