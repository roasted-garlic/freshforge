#!/usr/bin/env node
/**
 * FreshForge installation metadata (.freshforge/version.json).
 */

import { readFile, writeFile, access, stat, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export const VERSION_DIR = '.freshforge';
export const VERSION_JSON_REL = '.freshforge/version.json';
export const BACKUPS_DIR_REL = '.freshforge/backups';
export const SOURCE_ID = 'github:roasted-garlic/freshforge';

/** @typedef {'freshforge' | 'appforge' | 'partial' | 'none'} InstallKind */

/**
 * @typedef {Object} VersionJson
 * @property {string} name
 * @property {string} installedVersion
 * @property {string} installedAt
 * @property {string} source
 * @property {string | null} previousName
 * @property {{ id: string; ranAt: string }[]} migrationHistory
 */

/**
 * @typedef {Object} InstallState
 * @property {InstallKind} kind
 * @property {VersionJson | null} version
 * @property {boolean} hasAgentsMd
 * @property {boolean} hasCursor
 * @property {boolean} hasLegacyAppForgeRefs
 * @property {string[]} legacyDocPaths
 * @property {string[]} devOnlyPaths
 */

/**
 * @param {string} sourceRoot
 */
export async function getPackageVersion(sourceRoot) {
  const pkgPath = path.join(sourceRoot, 'package.json');
  try {
    const raw = await readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);
    return typeof pkg.version === 'string' ? pkg.version : '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * @param {string} packageVersion
 * @param {{ previousName?: string | null; migrationHistory?: { id: string; ranAt: string }[]; installedAt?: string }} [overrides]
 * @returns {VersionJson}
 */
export function createVersionJson(packageVersion, overrides = {}) {
  return {
    name: 'FreshForge',
    installedVersion: packageVersion,
    installedAt: overrides.installedAt ?? new Date().toISOString(),
    source: SOURCE_ID,
    previousName: overrides.previousName ?? null,
    migrationHistory: overrides.migrationHistory ?? [],
  };
}

/**
 * @param {string} targetRoot
 * @returns {Promise<VersionJson | null>}
 */
export async function readVersion(targetRoot) {
  const full = path.join(targetRoot, VERSION_JSON_REL);
  try {
    const raw = await readFile(full, 'utf8');
    return /** @type {VersionJson} */ (JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * @param {string} targetRoot
 * @param {VersionJson} data
 */
export async function writeVersion(targetRoot, data) {
  const full = path.join(targetRoot, VERSION_JSON_REL);
  const dir = path.dirname(full);
  await mkdir(dir, { recursive: true });
  await writeFile(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/**
 * @param {string} targetRoot
 */
async function fileExists(targetRoot, rel) {
  try {
    await access(path.join(targetRoot, rel), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} content
 */
function hasAppForgeWorkflowRef(content) {
  return /github:roasted-garlic\/appforge/i.test(content)
    || /\bnpx appforge\b/i.test(content)
    || /AppForge Entry Point/.test(content)
    || /uses the \*\*AppForge\*\* workflow/i.test(content)
    || /\bAppForge workflow starter\b/i.test(content);
}

/** Old flat doc paths that indicate legacy layout. */
export const LEGACY_DOC_PATHS = [
  'docs/PROJECT_BRIEF.md',
  'docs/ROADMAP.md',
  'docs/PROJECT_HEALTH.md',
  'docs/TECH_DEBT.md',
  'docs/DECISIONS.md',
  'docs/RISK_REGISTER.md',
  'docs/ARCHITECTURE.md',
  'docs/BACKEND.md',
  'docs/FIREBASE.md',
  'docs/DATA_MODEL.md',
  'docs/CODING_STANDARDS.md',
  'docs/STYLE_GUIDE.md',
  'docs/SECURITY.md',
  'docs/TESTING.md',
  'docs/DEPLOYMENT.md',
  'docs/INTAKE_FINDINGS.md',
];

/** @type {readonly { from: string; to: string }[]} */
export const DOC_PATH_MOVES = [
  { from: 'docs/PROJECT_BRIEF.md', to: 'docs/project/PROJECT_BRIEF.md' },
  { from: 'docs/ROADMAP.md', to: 'docs/project/ROADMAP.md' },
  { from: 'docs/PROJECT_HEALTH.md', to: 'docs/project/PROJECT_HEALTH.md' },
  { from: 'docs/TECH_DEBT.md', to: 'docs/project/TECH_DEBT.md' },
  { from: 'docs/DECISIONS.md', to: 'docs/project/DECISIONS.md' },
  { from: 'docs/RISK_REGISTER.md', to: 'docs/project/RISK_REGISTER.md' },
  { from: 'docs/ARCHITECTURE.md', to: 'docs/architecture/ARCHITECTURE.md' },
  { from: 'docs/BACKEND.md', to: 'docs/architecture/BACKEND.md' },
  { from: 'docs/FIREBASE.md', to: 'docs/architecture/FIREBASE.md' },
  { from: 'docs/DATA_MODEL.md', to: 'docs/architecture/DATA_MODEL.md' },
  { from: 'docs/CODING_STANDARDS.md', to: 'docs/standards/CODING_STANDARDS.md' },
  { from: 'docs/STYLE_GUIDE.md', to: 'docs/standards/STYLE_GUIDE.md' },
  { from: 'docs/SECURITY.md', to: 'docs/standards/SECURITY.md' },
  { from: 'docs/TESTING.md', to: 'docs/standards/TESTING.md' },
  { from: 'docs/DEPLOYMENT.md', to: 'docs/standards/DEPLOYMENT.md' },
  { from: 'docs/INTAKE_FINDINGS.md', to: 'docs/intake/INTAKE_FINDINGS.md' },
];

export const DEV_ONLY_PATH_PREFIXES = [
  'docs/freshforge-development',
  'docs/appforge-development',
  'scripts',
  'bin',
  '.github',
  'node_modules',
  'dist',
];

/**
 * @param {string} targetRoot
 * @returns {Promise<InstallState>}
 */
export async function detectInstallState(targetRoot) {
  const version = await readVersion(targetRoot);
  const hasAgentsMd = await fileExists(targetRoot, 'AGENTS.md');
  const hasCursor = await fileExists(targetRoot, '.cursor');

  const legacyDocPaths = [];
  for (const rel of LEGACY_DOC_PATHS) {
    if (await fileExists(targetRoot, rel)) {
      legacyDocPaths.push(rel);
    }
  }

  const devOnlyPaths = [];
  for (const prefix of DEV_ONLY_PATH_PREFIXES) {
    if (await fileExists(targetRoot, prefix)) {
      devOnlyPaths.push(prefix);
    }
  }

  let hasLegacyAppForgeRefs = false;
  const probeFiles = ['AGENTS.md', 'docs/AI_RULES.md', 'docs/WORKFLOWS.md'];
  for (const rel of probeFiles) {
    if (!(await fileExists(targetRoot, rel))) continue;
    try {
      const content = await readFile(path.join(targetRoot, rel), 'utf8');
      if (hasAppForgeWorkflowRef(content)) {
        hasLegacyAppForgeRefs = true;
        break;
      }
    } catch {
      // ignore
    }
  }

  /** @type {InstallKind} */
  let kind = 'none';
  if (version?.name === 'FreshForge') {
    kind = 'freshforge';
  } else if (hasLegacyAppForgeRefs || legacyDocPaths.length > 0) {
    kind = 'appforge';
  } else if (hasAgentsMd || hasCursor) {
    kind = 'partial';
  }

  return {
    kind,
    version,
    hasAgentsMd,
    hasCursor,
    hasLegacyAppForgeRefs,
    legacyDocPaths,
    devOnlyPaths,
  };
}

/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
export async function hasMeaningfulContent(filePath) {
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return false;
    const content = (await readFile(filePath, 'utf8')).trim();
    if (!content) return false;
    // Template placeholders alone are not meaningful project content
    if (/^\[TBD\]|^\[NEEDS HUMAN INPUT\]|^\[ASSUMED\]|^<!--/m.test(content) && content.length < 200) {
      return content.length > 50;
    }
    return content.length > 0;
  } catch {
    return false;
  }
}
