#!/usr/bin/env node
/**
 * Validates relative markdown link targets across the repository.
 * Skips external URLs, mailto, and same-document anchors (#...).
 */

import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const LINK_PATTERN = /\[([^\]]*)\]\(([^)]+)\)/g;
const SKIP_PREFIXES = ['http://', 'https://', 'mailto:', '#'];

function stripCode(content) {
  let result = content.replace(/```[\s\S]*?```/g, '');
  result = result.replace(/`[^`]*`/g, '');
  return result;
}

async function walkMdFiles(dir, results = []) {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkMdFiles(full, results);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }

  return results;
}

function shouldSkip(target) {
  const trimmed = target.trim();
  return SKIP_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

function stripAnchor(target) {
  const hash = target.indexOf('#');
  return hash === -1 ? target : target.slice(0, hash);
}

async function pathExists(fullPath) {
  try {
    await access(fullPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveLink(fromFile, rawTarget) {
  const target = stripAnchor(rawTarget.trim());
  if (!target) return null;

  const resolved = path.normalize(path.resolve(path.dirname(fromFile), target));
  return resolved;
}

async function main() {
  const files = await walkMdFiles(ROOT);
  const broken = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const scannable = stripCode(content);
    LINK_PATTERN.lastIndex = 0;
    let match;

    while ((match = LINK_PATTERN.exec(scannable)) !== null) {
      const [, , rawTarget] = match;
      if (shouldSkip(rawTarget)) continue;

      const resolved = await resolveLink(file, rawTarget);
      if (!resolved) continue;

      if (!(await pathExists(resolved))) {
        broken.push({
          from: path.relative(ROOT, file),
          target: rawTarget,
          resolved: path.relative(ROOT, resolved),
        });
      }
    }
  }

  if (broken.length > 0) {
    console.error('Link validation failed. Broken relative links:\n');
    for (const item of broken) {
      console.error(`  - ${item.from}: (${item.target}) -> ${item.resolved}`);
    }
    process.exit(1);
  }

  console.log(`Link validation passed (${files.length} markdown files checked).`);
}

main().catch((err) => {
  console.error('Link validation error:', err);
  process.exit(1);
});
