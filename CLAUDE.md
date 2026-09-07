@AGENTS.md

# Commits & Pull Requests

- **Never add AI attribution.** Do not append `Co-Authored-By: Claude`,
  "Generated with Claude Code", or any similar trailer/line to commit messages
  or PR descriptions. Commits are authored by the repository's git user, full
  stop.
- Write commit messages that explain the *why*, not just the *what*. Follow the
  Conventional Commits prefix already used in this repo's history
  (`fix(...)`, `feat(...)`, `copy:`, etc.).
- Commit or push only when explicitly asked. If asked to commit while on the
  default branch, create a feature branch first rather than committing to it
  directly.
- Never use `--no-verify`, `--no-gpg-sign`, or otherwise skip hooks/signing
  unless the user explicitly asks. If a hook fails, fix the underlying cause.
