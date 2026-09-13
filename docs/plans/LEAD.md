# LEAD: who holds this repo's queue

Lock by file, not by message. Two leads cannot be prevented by talking because cross-machine
messages do not exist. Whoever pushes this file last holds the queue. Rule: charter section 5.5 and
5.5.1 of gumon-workspace, standing order A1 and A8.

## Current holder

```
session   [PWEB] Pure Essentials London Website Lead
machine   komphet-mac
since     2026-09-13T04:4xZ (first resume of the room, repo head ab15aa9 at the time)
model     Fable 5.1 (the owner opened the room on it; HANDOFF asked for Sonnet 5, PEL told)
state     research and structure phase. No site code yet, by the owner's order of 2026-09-13.
```

## How this room works (Lead and Executor)

The owner's order of 2026-08-14 applies here: the Lead is a manager. All hands-on work goes to
executors by default. The Lead does only these 5 things itself:

1. decide, coordinate, negotiate, and carry the result of an action
2. write git on main (commit, push); executors never write git
3. one-command measurements needed to decide right now (under 1 minute)
4. check every executor result by re-running its verification commands
5. anything irreversible that the public can see (deploy, publish, set the custom domain)

Executors are background agents spawned by this session (Agent tool, `run_in_background: true`,
`isolation: "worktree"` when they edit code). They have no name in the workspace queue, answer no
tickets, hold no lease, and send no cross-room messages. A result the Lead has not re-run is not
a measurement.

Every executor brief carries the 4-clause contract (charter 5.5.1) and one line
`executor: <model> - <reason>` recorded on the queue row. Template: `docs/plans/EXECUTOR-BRIEF.md`.

## Handover

A new session that resumes this room replaces the block above, commits, and pushes before doing
anything else. If the push is rejected, someone else holds the queue: pull, read, and ask PEL.
