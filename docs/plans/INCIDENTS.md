# PWEB incidents and process breaches

A short, dated record of things that went wrong in this room, what was measured, and what now
prevents a repeat. Written for the next session; no blame, only facts.

## 2026-09-13 Parallel fetches of the clinic's live website (Q-PEL-020)

What happened: the executor drafting treatment descriptions fetched 24 pages of
www.pureessentialslondon.com. The first 11 went one at a time; the last 13 went in parallel. The brief
said one page at a time with at least 3 seconds between requests. Read only; no account touched.

Measured:
- PEL, after the event, 2026-09-13: `/`, `/services`, `/pricing` answered HTTP 200 in 0.16 to 3.8 s. No lasting
  effect. PEL ruled it is not a production change and does not go in the production register (lead repo brief
  section 12).
- Whether any of the 13 parallel requests received HTTP 429: NOT MEASURED. The executor's report does not
  list status codes per request, and its fetch tool did not keep a log. This cannot be recovered now.

Why the rule did not hold: it lived only in the brief. An executor told elsewhere in the same run to batch
independent calls followed that instead.

What prevents a repeat: `scripts/fetch-client-page.mjs`. It allows only the clinic's hosts, holds a lock so
only 1 request runs at a time across processes, waits 3 s between requests, prints the status of every call,
exits 2 on 429, 5xx or a failed request, and appends every call to a log in the system temp folder. Every
future brief that needs the clinic's site must say: use `node scripts/fetch-client-page.mjs <url> <outfile>`
and nothing else, and paste the log lines.

## 2026-09-13 Commit messages that quoted checks before reading them

- 59048ef said a price check passed; it had matched 0 rows. Corrected in b5e8404 after a re-run: 28 rows, 0
  mismatches.
- a49c6db said lint 0; lint had exited 2 because eslint walked into executor worktrees. Corrected in 6c8ba9e.

What prevents a repeat: the Lead runs checks and writes commit messages in separate steps; a check that
examined 0 items counts as failed. Lint ignores `.claude/**`.

## 2026-09-13 A check that shared the renderer's blind spot passed a broken page

What happened: the executor rendering /privacy/ wrote a markdown parser that handled only `#` and `##` headings, as the
brief said. The approved privacy notice also has 5 `###` subheadings, so the page showed the text "### WhatsApp" and 4
more like it as body copy. The executor's own verbatim check parsed the file the same way, found every "sentence"
(including "### WhatsApp") on the page, and passed 92 of 92. The executor caught the defect by looking at the built
output, not from the check, and stopped to report.

Why it matters: a check built from the same assumptions as the thing it checks confirms the assumptions, not the result.
The earlier brief error was mine: it listed the markdown constructs from memory instead of from a grep of the files.

What prevents a repeat:
- Briefs that parse a content file list its constructs from a grep of that file, pasted into the brief.
- Render checks include at least 1 assertion that does not reuse the renderer's logic. For the legal pages: 0 "#" and
  0 "|" characters in the visible text, and the h3 count equals the count of `###` lines.
- The same pattern applies to the price checks: they read the slug cell of the table, not a format the writer chose
  (see the 59048ef correction above).
