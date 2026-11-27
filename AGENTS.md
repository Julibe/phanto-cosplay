# Agent entry point

Read [HANDOFF.md](HANDOFF.md) before making changes. It is the single source of truth for project continuity, current implementation, user decisions and restrictions.

Update HANDOFF.md after significant implementation. Preserve established behavior and approved variants; do not treat historical backlog/review notes as authority to regenerate or delete assets. Follow the user's latest instructions over documentation.

Commits: author and committer must be the user who requested the work (Julibe, `Julibe <mail@julibe.com>`), never Claude/an agent. No `Co-Authored-By` or session attribution trailers. See HANDOFF.md section 11.

Sync: local `A:/julibe/phanto/emojis/App` and GitHub `main` must always be identical. Push local changes before working; after every push from elsewhere, sync the local App folder too (`git fetch origin && git pull --ff-only origin main`). See HANDOFF.md section 11.

Versioned continuity workflow (adopted v0.0.1): work only on main; do not create branches or PRs. Before each new update push, increment from the latest existing SemVer, update HANDOFF.md (newest entry first, persistent backlog IDs) and CHANGELOG.md, synchronize package/root lock version, use a versioned commit message and push its matching version tag. Preserve historical work, authorship and user restrictions; no force pushes or history rewrites.
