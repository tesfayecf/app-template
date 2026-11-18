#!/usr/bin/env node
// Documentation hygiene for the agent context system (decision 0007 in _agents/decisions/):
// relative links and images in the context docs resolve, requirements documents are named only
// inside _agents/ and AGENTS.md, archive and decision files follow their rules, and every _agents/
// file is listed in the AGENTS.md context index. No dependencies; run `node cmd/check-docs.mjs`.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT_FILES = ["AGENTS.md", "CLAUDE.md", "DEVELOP.md", "ARCHITECTURE.md", "_agents/README.md"];
const ROOT_DOCS = ["README.md", ...ROOT_FILES];
const DOC_DIRS = ["_agents", "app/docs", "docker"];
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".cache", ".tmp", ".build", "coverage"]);
const TEXT_SUFFIXES = new Set([".md", ".go", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".yaml",
  ".yml", ".toml", ".sh", ".css", ".html", ".conf", ".txt", ".example", ".mod", ""]);
// The only places that may name requirements documents.
const PRD_ALLOWED = ["_agents/", "AGENTS.md", "cmd/check-docs.mjs"];

const LINK = /(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)|!\[[^\]]*\]\(([^)\s]+)\)/g;
const FENCE = /^(```|~~~)/;
const problems = [];

const rel = (path) => relative(ROOT, path).split(sep).join("/");

function* walk(base) {
  if (!existsSync(base)) return;
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(base, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile()) yield path;
  }
}

function docFiles() {
  const files = ROOT_DOCS.map((name) => join(ROOT, name)).filter(existsSync);
  for (const dir of DOC_DIRS) {
    for (const path of walk(join(ROOT, dir))) if (path.endsWith(".md")) files.push(path);
  }
  return [...new Set(files)].sort();
}

// Lines outside fenced code blocks, with inline code removed.
function* proseLines(path) {
  let inFence = false;
  const lines = readFileSync(path, "utf8").split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    if (FENCE.test(lines[i])) inFence = !inFence;
    if (!inFence) yield [i + 1, lines[i]];
  }
}

// GitHub-style heading anchor.
function slug(heading) {
  return heading.trim().toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[^\p{L}\p{N}\- ]/gu, "")
    .replace(/ /g, "-");
}

const anchorCache = new Map();
function anchors(path) {
  if (!anchorCache.has(path)) {
    const found = new Set();
    const counts = new Map();
    for (const [, line] of proseLines(path)) {
      const match = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
      if (!match) continue;
      const s = slug(match[1]);
      const n = counts.get(s) ?? 0;
      counts.set(s, n + 1);
      found.add(n === 0 ? s : `${s}-${n}`);
    }
    anchorCache.set(path, found);
  }
  return anchorCache.get(path);
}

function checkLinks() {
  for (const doc of docFiles()) {
    for (const [number, raw] of proseLines(doc)) {
      const line = raw.replace(/`[^`]*`/g, "");
      for (const match of line.matchAll(LINK)) {
        const target = match[1] ?? match[2];
        if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//")) continue;
        const [filePart, fragment] = target.split("#", 2);
        const dest = filePart ? resolve(dirname(doc), decodeURIComponent(filePart)) : doc;
        const where = `${rel(doc)}:${number}`;
        if (!existsSync(dest)) {
          problems.push(`${where}: ${target} does not exist`);
        } else if (fragment && dest.endsWith(".md") && !anchors(dest).has(fragment)) {
          problems.push(`${where}: ${target} has no such heading`);
        }
      }
    }
  }
}

function checkPrdReferences() {
  const prdDir = join(ROOT, "_agents", "prds");
  const names = existsSync(prdDir)
    ? readdirSync(prdDir).filter((n) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(n)).map((n) => n.slice(11, -3))
    : [];
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Case-sensitive on purpose: lowercase "prds" is a folder or file name, not a mention.
  const alternatives = ["\\bPRDs?\\b", "[Pp]roduct requirements?", "[Rr]equirements? document"];
  if (names.length) alternatives.push(`\\d{4}-\\d{2}-\\d{2}-(${names.map(escape).join("|")})`);
  const pattern = new RegExp(alternatives.join("|"));

  for (const path of walk(ROOT)) {
    const name = rel(path);
    if (PRD_ALLOWED.some((allowed) => name === allowed || name.startsWith(allowed))) continue;
    const suffix = name.endsWith(".env.example") ? ".example" : extname(path);
    if (!TEXT_SUFFIXES.has(suffix) || statSync(path).size > 2_000_000) continue;
    readFileSync(path, "utf8").split("\n").forEach((line, i) => {
      if (pattern.test(line)) problems.push(`${name}:${i + 1}: names a requirements document: ${line.trim().slice(0, 100)}`);
    });
  }
}

function checkArchives() {
  for (const name of readdirSync(join(ROOT, "_agents", "prds"))) {
    if (name !== "README.md" && !/^\d{4}-\d{2}-\d{2}(-[a-z0-9]+){3,5}\.md$/.test(name)) {
      problems.push(`_agents/prds/${name}: PRD names must be YYYY-MM-DD-<3 to 5 words>.md`);
    }
  }
  const decisions = join(ROOT, "_agents", "decisions");
  const index = readFileSync(join(decisions, "README.md"), "utf8");
  for (const name of readdirSync(decisions)) {
    if (/^\d{4}-.+\.md$/.test(name) && !index.includes(`(${name})`)) {
      problems.push(`_agents/decisions/${name}: not in _agents/decisions/README.md`);
    }
  }
}

function checkContextIndex() {
  const agents = readFileSync(join(ROOT, "AGENTS.md"), "utf8");
  for (const path of walk(join(ROOT, "_agents"))) {
    const name = rel(path);
    if (!name.endsWith(".md") || name.endsWith("README.md") || name.endsWith("TEMPLATE.md")) continue;
    if (!agents.includes(`(${name})`)) problems.push(`${name}: not in the AGENTS.md context index`);
  }
}

for (const name of ROOT_FILES) {
  if (!existsSync(join(ROOT, name))) problems.push(`${name}: missing`);
}
if (problems.length === 0) {
  checkLinks();
  checkPrdReferences();
  checkArchives();
  checkContextIndex();
}

if (problems.length > 0) {
  console.error(`check-docs: ${problems.length} problem(s)\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("check-docs: ok");
