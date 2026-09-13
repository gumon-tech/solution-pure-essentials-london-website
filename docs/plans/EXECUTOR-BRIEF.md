# Executor brief template (copy the whole file into the Agent prompt, fill every field)

Charter 5.5.1 contract, 4 clauses that are never dropped. The brief is self-contained: an executor
has no memory across turns and knows nothing about this room.

```
ROW            Q-nnn <title>                                   (from docs/plans/QUEUE.md)
MODEL          <haiku-4.5 | sonnet-5 | opus-5> - <why this tier: the price of being wrong, not the difficulty>
REPO           ~/dev/solution-pure-essentials-london-website    (worktree isolation for code rows)
GOAL           one sentence, what exists when this row is done
FILES TO TOUCH exact paths; nothing outside this list
FILES NOT TO TOUCH  data/services.json (content is PEL's), HANDOFF.md, docs/plans/*, .git, anything
               in another room's repo, the Wix site, the 2016 site, OneDrive originals
SOURCES        the files or URLs to read first, with the exact sections
RULES          1. No service, price or claim that is not in data/services.json (status == live only)
               2. No medicine name and no euphemism for one; no "anti-wrinkle" wording
               3. No before-and-after images, no testimonials, no needle in any image
               4. No client names (F and K only), no account numbers
               5. Arabic numerals, no pictographs in any file that a person outside may read
ACCEPTANCE     measurable, numbered; each item names the command that proves it
VERIFY         the exact commands to run before reporting (build, lint, a grep, a curl);
               paste raw output into the report
REPORT         return (a) raw data and the commands used, not conclusions; (b) anything that did
               not match this brief: stop and report, do not decide; (c) if only part is done,
               say which part; (d) the list of files changed with a one-line diffstat
COMMIT         do not commit or push. Leave changes in the worktree; the Lead commits.
```

## Model choice guide for this site (from charter 5.5.2 and PEL's executor-model-choices.md)

| Work | Model | Why |
|---|---|---|
| Mechanical: resize images, generate a sitemap list, convert JSON to a table, run a grep sweep | haiku-4.5 | spec complete, no judgement, wrong is visible by count |
| Build a page or component from a spec with the design tokens, wire data, write tests | sonnet-5 | holds several files at once, checked by build and lint |
| Copy that the clinic's customers read, compliance wording, anything where wrong is silent | opus-5 | wrong is expensive and nobody inside notices first |
| Checking another executor's work | the Lead re-runs the verify commands itself | an executor never checks its own work |
