#!/usr/bin/env node
/**
 * Shared file collection and exclusion rules for FreshForge install/export.
 */

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

/** @typedef {'copy' | 'conflict' | 'skip' | 'exclude'} Action */

/**
 * @typedef {Object} CollectOptions
 * @property {boolean} includeReadme
 * @property {boolean} includeValidation
 * @property {boolean} [readmeAsFreshforgeReadme] - install copies README as FRESHFORGE_README.md
 * @property {string} [targetRoot] - set for install conflict detection
 * @property {boolean} [force]
 */

/**
 * @typedef {Object} CollectedItem
 * @property {string} sourceRel
 * @property {string} targetRel
 * @property {Action} action
 * @property {string} [reason]
 */

export const DEFAULT_ROOT_ENTRIES = ['AGENTS.md', 'CLAUDE.md', '.cursor', 'docs', '.freshforge'];

export const VALIDATION_ENTRIES = [
  'scripts',
  'package.json',
  'package-lock.json',
  '.markdownlint-cli2.jsonc',
  '.github/workflows/validate.yml',
];

export const README_SOURCE = 'README.md';
export const README_TARGET = 'FRESHFORGE_README.md';

/** Canonical clean starter state — never ship live dev state.md. */
export const STATE_TEMPLATE_REL = '.cursor/workflow/state-template.md';
export const STATE_TARGET_REL = '.cursor/workflow/state.md';

/** @type {readonly { label: string; expected: string }[]} */
export const CLEAN_STATE_FIELDS = [
  { label: 'Current Mode', expected: 'idle' },
  { label: 'Current Phase', expected: 'none' },
  { label: 'Current Goal', expected: 'none' },
  { label: 'Current Workflow Step', expected: 'idle' },
  { label: 'Plan Status', expected: 'not_started' },
  { label: 'Review Status', expected: 'not_started' },
  { label: 'Implementation Status', expected: 'not_started' },
  { label: 'Test Status', expected: 'not_started' },
  { label: 'Signoff Status', expected: 'not_started' },
  { label: 'Human Checkpoint Required', expected: 'no' },
  { label: 'Human Checkpoint Reason', expected: 'none' },
  { label: 'Last Completed Step', expected: 'none' },
  { label: 'Blocked', expected: 'no' },
  { label: 'Blocker', expected: 'none' },
  { label: 'Files Created', expected: 'none' },
  { label: 'Files Modified', expected: 'none' },
  { label: 'Tests Run', expected: 'none' },
  { label: 'Known Risks', expected: 'none' },
  { label: 'Decision Log', expected: 'none' },
  { label: 'DONE', expected: 'no' },
];

/** Dev workflow history that must never appear in installed/exported state. */
export const FORBIDDEN_STATE_STRINGS = [
  'distribution-and-installer',
  'signoff complete',
  'Plan Status: complete',
  'Review Status: approved',
  'Implementation Status: complete',
  'Test Status: passed',
  'Signoff Status: approved',
];

const STARTER_CLEAN_SUBDIRS = ['workflow/plans', 'workflow/reviews', 'workflow/setup'];
const ALLOWED_CLEAN_ENTRIES = new Set(['README.md', '.gitkeep']);

/** Legacy workflow dirs replaced by docs/workflow/ (starter-workflow-folder-cleanup). */
const FORBIDDEN_OLD_WORKFLOW_PREFIXES = ['docs/plans', 'docs/reviews', 'docs/setup'];

const EXCLUDED_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.cache',
  '.tmp',
  'temp',
  'tmp',
  'logs',
  'freshforge-temp',
  'freshforge-starter',
  'tmp-install-test',
  'reference',
]);

const EXCLUDED_FILE_PATTERNS = [
  /^\.env(\..+)?$/i,
  /\.log$/i,
  /^npm-debug\.log/i,
  /^yarn-debug\.log/i,
  /^pnpm-debug\.log/i,
  /\.(zip|tar|tgz)$/i,
  /^\.DS_Store$/i,
  /^Thumbs\.db$/i,
];

/**
 * @param {string} sourceRoot
 */
export function resolveSourceRoot(sourceRoot) {
  return path.resolve(sourceRoot);
}

/**
 * @param {string} name
 */
function isExcludedFileName(name) {
  return EXCLUDED_FILE_PATTERNS.some((pattern) => pattern.test(name));
}

/**
 * @param {string} relPosix
 */
function isExcludedDocsPath(relPosix) {
  const normalized = relPosix.replace(/\\/g, '/');

  if (normalized === '.freshforge/backups' || normalized.startsWith('.freshforge/backups/')) {
    return true;
  }

  if (normalized === 'docs/freshforge-development' || normalized.startsWith('docs/freshforge-development/')) {
    return true;
  }

  if (normalized === 'docs/appforge-development' || normalized.startsWith('docs/appforge-development/')) {
    return true;
  }

  for (const sub of STARTER_CLEAN_SUBDIRS) {
    const prefix = `docs/${sub.replace(/^\//, '')}/`;
    if (normalized.startsWith(prefix)) {
      const rest = normalized.slice(prefix.length);
      if (!rest) return false;
      const base = rest.split('/')[0];
      if (!ALLOWED_CLEAN_ENTRIES.has(base)) {
        return true;
      }
    }
  }

  return false;
}

function isForbiddenOldWorkflowPath(relPosix) {
  const normalized = relPosix.replace(/\\/g, '/');
  return FORBIDDEN_OLD_WORKFLOW_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

/**
 * @param {string} relPosix
 */
function isAlwaysExcludedRel(relPosix) {
  const normalized = relPosix.replace(/\\/g, '/');
  if (isForbiddenOldWorkflowPath(normalized)) {
    return true;
  }
  const segments = normalized.split('/');

  for (const segment of segments) {
    if (EXCLUDED_DIR_NAMES.has(segment)) {
      return true;
    }
    if (isExcludedFileName(segment)) {
      return true;
    }
  }

  if (isExcludedDocsPath(normalized)) {
    return true;
  }

  return false;
}

/**
 * @param {string} sourceRoot
 * @param {string} rel
 * @param {CollectOptions} options
 * @returns {Promise<CollectedItem[]>}
 */
async function walkSource(sourceRoot, rel, options) {
  /** @type {CollectedItem[]} */
  const items = [];
  const full = path.join(sourceRoot, rel);
  const relPosix = rel.replace(/\\/g, '/');

  if (isAlwaysExcludedRel(relPosix)) {
    items.push({
      sourceRel: relPosix,
      targetRel: relPosix,
      action: 'exclude',
      reason: 'always excluded',
    });
    return items;
  }

  // Never ship the development repo's active workflow state.
  if (relPosix === STATE_TARGET_REL) {
    items.push({
      sourceRel: relPosix,
      targetRel: relPosix,
      action: 'exclude',
      reason: 'development workflow state — replaced by state-template.md',
    });
    return items;
  }

  const info = await stat(full);

  if (info.isDirectory()) {
    const entries = await readdir(full);
    if (entries.length === 0) {
      if (isAlwaysExcludedRel(relPosix)) {
        items.push({
          sourceRel: relPosix,
          targetRel: relPosix,
          action: 'exclude',
          reason: 'legacy or excluded empty directory',
        });
        return items;
      }
      items.push({
        sourceRel: relPosix,
        targetRel: relPosix,
        action: 'copy',
      });
      return items;
    }
    for (const entry of entries) {
      const childRel = rel ? path.join(rel, entry) : entry;
      items.push(...(await walkSource(sourceRoot, childRel, options)));
    }
    return items;
  }

  let targetRel = relPosix;

  if (options.includeReadme && options.readmeAsFreshforgeReadme && relPosix === README_SOURCE) {
    targetRel = README_TARGET;
  }

  let action = /** @type {Action} */ ('copy');
  let reason;

  if (options.targetRoot) {
    const targetPath = path.join(options.targetRoot, targetRel);
    try {
      await stat(targetPath);
      if (!options.force) {
        action = 'conflict';
        reason = 'target already exists';
      }
    } catch {
      // target does not exist — copy
    }
  }

  items.push({ sourceRel: relPosix, targetRel, action, reason });
  return items;
}

/**
 * @param {string} sourceRoot
 * @param {CollectOptions} options
 * @returns {Promise<CollectedItem[]>}
 */
export async function collectStarterFiles(sourceRoot, options) {
  const root = resolveSourceRoot(sourceRoot);
  /** @type {CollectedItem[]} */
  const all = [];

  const rootEntries = [...DEFAULT_ROOT_ENTRIES];
  if (options.includeValidation) {
    rootEntries.push(...VALIDATION_ENTRIES);
  }

  for (const entry of rootEntries) {
    const entryPath = path.join(root, entry);
    try {
      await stat(entryPath);
    } catch {
      all.push({
        sourceRel: entry,
        targetRel: entry,
        action: 'skip',
        reason: 'missing in source',
      });
      continue;
    }

    if (entry.includes('/') || entry.includes('\\')) {
      all.push(...(await walkSource(root, entry, options)));
    } else if (entry === 'package.json' || entry === 'package-lock.json' || entry === '.markdownlint-cli2.jsonc') {
      all.push(...(await walkSource(root, entry, options)));
    } else {
      all.push(...(await walkSource(root, entry, options)));
    }
  }

  if (options.includeReadme) {
    const readmePath = path.join(root, README_SOURCE);
    try {
      await stat(readmePath);
      let action = /** @type {Action} */ ('copy');
      let reason;
      const targetRel = options.readmeAsFreshforgeReadme ? README_TARGET : README_SOURCE;

      if (options.targetRoot) {
        const targetPath = path.join(options.targetRoot, targetRel);
        try {
          await stat(targetPath);
          if (!options.force) {
            action = 'conflict';
            reason = 'FRESHFORGE_README.md already exists';
          }
        } catch {
          // ok
        }
      }

      all.push({
        sourceRel: README_SOURCE,
        targetRel,
        action,
        reason,
      });
    } catch {
      all.push({
        sourceRel: README_SOURCE,
        targetRel: README_TARGET,
        action: 'skip',
        reason: 'README.md missing in source',
      });
    }
  }

  await appendCleanStateMapping(root, all, options);

  return dedupeItems(all);
}

/**
 * @param {string} root
 * @param {CollectedItem[]} all
 * @param {CollectOptions} options
 */
async function appendCleanStateMapping(root, all, options) {
  const templatePath = path.join(root, STATE_TEMPLATE_REL);
  try {
    await stat(templatePath);
  } catch {
    all.push({
      sourceRel: STATE_TEMPLATE_REL,
      targetRel: STATE_TARGET_REL,
      action: 'skip',
      reason: 'state-template.md missing in source',
    });
    return;
  }

  let action = /** @type {Action} */ ('copy');
  let reason = 'clean starter state from state-template.md';

  if (options.targetRoot) {
    const targetPath = path.join(options.targetRoot, STATE_TARGET_REL);
    try {
      await stat(targetPath);
      if (!options.force) {
        action = 'conflict';
        reason = 'target already exists';
      }
    } catch {
      // target does not exist
    }
  }

  all.push({
    sourceRel: STATE_TEMPLATE_REL,
    targetRel: STATE_TARGET_REL,
    action,
    reason,
  });
}

/**
 * @param {CollectedItem[]} items
 */
function dedupeItems(items) {
  /** @type {Map<string, CollectedItem>} */
  const map = new Map();
  for (const item of items) {
    const key = `${item.sourceRel}→${item.targetRel}`;
    const existing = map.get(key);
    if (!existing || priority(item.action) > priority(existing.action)) {
      map.set(key, item);
    }
  }
  return [...map.values()].sort((a, b) => a.targetRel.localeCompare(b.targetRel));
}

/**
 * @param {Action} action
 */
function priority(action) {
  const order = { conflict: 4, copy: 3, skip: 2, exclude: 1 };
  return order[action] ?? 0;
}

/**
 * @param {CollectedItem[]} items
 */
export function summarizeItems(items) {
  return {
    copied: items.filter((i) => i.action === 'copy'),
    skipped: items.filter((i) => i.action === 'skip'),
    conflicts: items.filter((i) => i.action === 'conflict'),
    excluded: items.filter((i) => i.action === 'exclude'),
  };
}

/**
 * Top-level install/export roots for default mode (no optional flags).
 * @param {CollectedItem[]} items
 */
export function getTopLevelRoots(items) {
  const roots = new Set();
  for (const item of items) {
    if (item.action !== 'copy' && item.action !== 'conflict') continue;
    const top = item.targetRel.split('/')[0];
    roots.add(top);
  }
  return [...roots].sort();
}

/**
 * @param {string} relPosix
 */
/** Legacy flat doc paths removed by starter-docs-surface-cleanup. */
const FORBIDDEN_LEGACY_DOC_PATHS = new Set([
  'docs/INSTALLATION.md',
  'docs/DISTRIBUTION.md',
  'docs/PACKAGING.md',
  'docs/STARTER_SURFACE.md',
  'docs/PROJECT_BRIEF.md',
  'docs/ROADMAP.md',
  'docs/PROJECT_HEALTH.md',
  'docs/TECH_DEBT.md',
  'docs/DECISIONS.md',
  'docs/RISK_REGISTER.md',
  'docs/ARCHITECTURE.md',
  'docs/BACKEND.md',
  'docs/DATA_MODEL.md',
  'docs/CODING_STANDARDS.md',
  'docs/STYLE_GUIDE.md',
  'docs/SECURITY.md',
  'docs/TESTING.md',
  'docs/DEPLOYMENT.md',
  'docs/INTAKE_FINDINGS.md',
]);

export function isForbiddenInDefaultOutput(relPosix) {
  const normalized = relPosix.replace(/\\/g, '/');
  if (normalized === 'node_modules' || normalized.startsWith('node_modules/')) return true;
  if (normalized === '.git' || normalized.startsWith('.git/')) return true;
  if (normalized === 'docs/freshforge-development' || normalized.startsWith('docs/freshforge-development/')) {
    return true;
  }
  if (normalized === 'docs/appforge-development' || normalized.startsWith('docs/appforge-development/')) {
    return true;
  }
  if (normalized === '.freshforge/backups' || normalized.startsWith('.freshforge/backups/')) {
    return true;
  }
  if (FORBIDDEN_LEGACY_DOC_PATHS.has(normalized)) return true;
  if (isForbiddenOldWorkflowPath(normalized)) return true;
  if (normalized === 'README.md') return true;
  if (normalized === 'package.json' || normalized === 'package-lock.json') return true;
  if (normalized === 'scripts' || normalized.startsWith('scripts/')) return true;
  if (normalized.startsWith('.github/')) return true;
  if (normalized === '.markdownlint-cli2.jsonc') return true;
  if (/\.(log|zip|tar|tgz)$/i.test(normalized)) return true;
  if (/^\.env/i.test(path.basename(normalized))) return true;
  return false;
}

/**
 * @param {string} content
 * @returns {string[]}
 */
export function validateCleanStateContent(content) {
  const violations = [];

  for (const { label, expected } of CLEAN_STATE_FIELDS) {
    const match = content.match(new RegExp(`## ${label}\\s*\\n([^\\n#]+)`, 'i'));
    const value = match?.[1]?.trim().toLowerCase();
    if (value !== expected.toLowerCase()) {
      violations.push(`${label} is "${value ?? 'missing'}", expected "${expected}"`);
    }
  }

  for (const forbidden of FORBIDDEN_STATE_STRINGS) {
    if (content.includes(forbidden)) {
      violations.push(`contains forbidden development string: ${forbidden}`);
    }
  }

  return violations;
}

/**
 * @param {CollectedItem[]} items
 * @returns {string[]}
 */
export function validateStateMapping(items) {
  const violations = [];

  const devStateCopied = items.some(
    (item) =>
      item.sourceRel === STATE_TARGET_REL &&
      (item.action === 'copy' || item.action === 'conflict'),
  );
  if (devStateCopied) {
    violations.push('development state.md must not be copied — use state-template.md');
  }

  const templateToState = items.find(
    (item) => item.sourceRel === STATE_TEMPLATE_REL && item.targetRel === STATE_TARGET_REL,
  );
  if (!templateToState) {
    violations.push('missing state-template.md → state.md mapping');
  } else if (templateToState.action !== 'copy' && templateToState.action !== 'conflict') {
    violations.push(`state mapping action is "${templateToState.action}", expected copy`);
  }

  const devStateExcluded = items.some(
    (item) => item.sourceRel === STATE_TARGET_REL && item.action === 'exclude',
  );
  if (!devStateExcluded) {
    violations.push('development state.md was not excluded from collection');
  }

  return violations;
}
