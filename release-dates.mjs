import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// Release dates live in release-dates.json as { "<pose id>": "<ISO 8601 UTC time>" }.
// Edit a value by hand to change when a look counts as released.
const file = new URL('./release-dates.json', import.meta.url);

export function readReleaseDates() {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
}

function writeReleaseDates(dates) {
  const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n');
}

// The first time each WebP stem was added to the repository, from git history.
function gitFirstSeen() {
  const log = execFileSync('git', ['log', '--reverse', '--diff-filter=A', '--name-only', '--format=@%aI', '--', 'dist'],
    { cwd: new URL('./', import.meta.url), encoding: 'utf8', maxBuffer: 1 << 28 });
  const seen = new Map();
  let when;
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) { when = new Date(line.slice(1)).toISOString(); continue; }
    const match = /([a-z0-9-]+)\.webp$/.exec(line);
    if (match && !seen.has(match[1])) seen.set(match[1], when);
  }
  return seen;
}

// Adds a `released` time to each pose. Poses without a recorded date get one from
// git history (via their current, previous or legacy ID) or, if brand new, now.
export function assignReleaseDates(poses, { now = new Date().toISOString() } = {}) {
  const dates = readReleaseDates();
  let history;
  let changed = false;
  const dated = poses.map(pose => {
    let released = dates[pose.id];
    if (!released) {
      history ??= gitFirstSeen();
      released = [pose.id, pose.previousId, pose.legacyId].filter(Boolean)
        .map(id => dates[id] ?? history.get(id)).filter(Boolean).sort()[0] ?? now;
      dates[pose.id] = released;
      changed = true;
    }
    return { ...pose, released };
  });
  if (changed) writeReleaseDates(dates);
  return dated;
}
