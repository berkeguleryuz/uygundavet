import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join, extname, relative } from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "out",
  "coverage",
  "public",
  "scripts",
]);
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const PRESERVE_PREFIXES = [
  "eslint-",
  "@ts-",
  "ts-",
  "biome-",
  "prettier-",
  "@jsxImportSource",
  "@jsx",
  "#!",
  "<reference",
  "/ <reference",
];

function shouldPreserve(text) {
  const inner = text.startsWith("//")
    ? text.slice(2).trim()
    : text.startsWith("/*")
      ? text.slice(2, -2).trim()
      : text.trim();
  return PRESERVE_PREFIXES.some((p) => inner.startsWith(p));
}

function lineBoundsAround(src, pos) {
  const lineStart = src.lastIndexOf("\n", pos - 1) + 1;
  return { lineStart };
}

function isLeadingWhitespaceOnly(src, pos) {
  const { lineStart } = lineBoundsAround(src, pos);
  return src.slice(lineStart, pos).trim() === "";
}

function collectRanges(src, sf) {
  const set = new Set();
  const ranges = [];

  function add(r) {
    const key = `${r.pos}-${r.end}`;
    if (set.has(key)) return;
    set.add(key);
    ranges.push(r);
  }

  function visit(node) {
    if (node.pos !== node.end) {
      const leading = ts.getLeadingCommentRanges(src, node.pos) || [];
      const trailing = ts.getTrailingCommentRanges(src, node.end) || [];
      leading.forEach(add);
      trailing.forEach(add);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  return ranges.sort((a, b) => a.pos - b.pos);
}

function stripComments(src, filepath) {
  const ext = extname(filepath);
  const scriptKind =
    ext === ".tsx"
      ? ts.ScriptKind.TSX
      : ext === ".jsx"
        ? ts.ScriptKind.JSX
        : ext === ".ts"
          ? ts.ScriptKind.TS
          : ts.ScriptKind.JS;

  const sf = ts.createSourceFile(
    filepath,
    src,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );

  const ranges = collectRanges(src, sf);

  let out = "";
  let last = 0;
  for (const r of ranges) {
    const content = src.slice(r.pos, r.end);
    if (shouldPreserve(content)) continue;

    const ownLine = isLeadingWhitespaceOnly(src, r.pos);
    const { lineStart } = lineBoundsAround(src, r.pos);

    const sliceEnd = ownLine ? lineStart : r.pos;
    out += src.slice(last, sliceEnd);

    let newEnd = r.end;
    if (ownLine) {
      while (newEnd < src.length && (src[newEnd] === " " || src[newEnd] === "\t")) {
        newEnd++;
      }
      if (src[newEnd] === "\n") newEnd++;
      else if (src[newEnd] === "\r" && src[newEnd + 1] === "\n") newEnd += 2;
    }
    last = newEnd;
  }
  out += src.slice(last);
  return out;
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".") && entry !== ".well-known") continue;
    if (EXCLUDE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, acc);
    } else if (EXTS.has(extname(entry))) {
      acc.push(full);
    }
  }
  return acc;
}

const DRY = process.argv.includes("--dry");
const ONLY = process.argv.find((a) => a.startsWith("--only="));
const onlyPath = ONLY ? ONLY.slice("--only=".length) : null;

const files = onlyPath ? [onlyPath] : walk(ROOT);

let changed = 0;
for (const file of files) {
  const original = readFileSync(file, "utf8");
  let stripped;
  try {
    stripped = stripComments(original, file);
  } catch (e) {
    console.error(`SKIP (parse error): ${relative(ROOT, file)} — ${e.message}`);
    continue;
  }
  if (stripped !== original) {
    changed++;
    if (!DRY) writeFileSync(file, stripped);
    console.log(`${DRY ? "[dry]" : "[strip]"} ${relative(ROOT, file)}`);
  }
}

console.log(`\n${changed} / ${files.length} files ${DRY ? "would be " : ""}changed`);
