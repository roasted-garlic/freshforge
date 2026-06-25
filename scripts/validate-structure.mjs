#!/usr/bin/env node
/**
 * Validates required FreshForge workflow starter files and development-repo distribution tooling.
 * See README.md and docs/freshforge-development/distribution/.
 */

import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  collectStarterFiles,
  getTopLevelRoots,
  isForbiddenInDefaultOutput,
  STATE_TARGET_REL,
  STATE_TEMPLATE_REL,
  validateCleanStateContent,
  validateStateMapping,
} from './lib/starter-distribution.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** @type {readonly string[]} */
const REQUIRED_STARTER_FILES = [
  'AGENTS.md',
  '.freshforge/version.json',
  '.cursor/hooks.json',
  '.cursor/workflow/state.md',
  '.cursor/workflow/state-template.md',
  '.cursor/workflow/command-aliases.md',
  '.cursor/workflow/plan-template.md',
  'docs/AI_RULES.md',
  'docs/WORKFLOWS.md',
  'docs/project/PROJECT_BRIEF.md',
  'docs/project/ROADMAP.md',
  'docs/project/PROJECT_HEALTH.md',
  'docs/project/TECH_DEBT.md',
  'docs/project/DECISIONS.md',
  'docs/project/RISK_REGISTER.md',
  'docs/architecture/ARCHITECTURE.md',
  'docs/architecture/BACKEND.md',
  'docs/architecture/DATA_MODEL.md',
  'docs/standards/CODING_STANDARDS.md',
  'docs/standards/STYLE_GUIDE.md',
  'docs/standards/SECURITY.md',
  'docs/standards/TESTING.md',
  'docs/standards/DEPLOYMENT.md',
  'docs/intake/INTAKE_FINDINGS.md',
  'docs/workflow/plans/README.md',
  'docs/workflow/plans/.gitkeep',
  'docs/workflow/reviews/README.md',
  'docs/workflow/reviews/.gitkeep',
  'docs/workflow/setup/README.md',
  'docs/workflow/setup/.gitkeep',
];

/** @type {readonly string[]} */
const REQUIRED_DEVELOPMENT_FILES = [
  'README.md',
  'package.json',
  'scripts/validate-structure.mjs',
  'scripts/validate-links.mjs',
  'scripts/install-freshforge.mjs',
  'scripts/export-starter.mjs',
  'scripts/lib/starter-distribution.mjs',
  'scripts/lib/run-install.mjs',
  'scripts/lib/run-export.mjs',
  'scripts/lib/run-migrate.mjs',
  'scripts/lib/run-doctor.mjs',
  'scripts/lib/freshforge-version.mjs',
  'scripts/lib/freshforge-migrations.mjs',
  'scripts/validate-migrations.mjs',
  'bin/freshforge.mjs',
  '.markdownlint-cli2.jsonc',
  '.github/workflows/validate.yml',
  'docs/freshforge-development/distribution/INSTALLATION.md',
  'docs/freshforge-development/distribution/DISTRIBUTION.md',
  'docs/freshforge-development/distribution/PACKAGING.md',
  'docs/freshforge-development/distribution/STARTER_SURFACE.md',
];

/** @type {readonly string[]} */
const REQUIRED_DIRS = [
  '.cursor/rules',
  '.cursor/agents',
  '.cursor/skills',
  '.cursor/workflow',
  'docs/project',
  'docs/architecture',
  'docs/standards',
  'docs/intake',
  'docs/workflow',
  'docs/workflow/plans',
  'docs/workflow/reviews',
  'docs/workflow/setup',
  'docs/freshforge-development',
  'docs/freshforge-development/distribution',
  'scripts',
  '.github/workflows',
];

/** Old flat paths that must not exist in the dev repo or default export. */
const FORBIDDEN_LEGACY_DOC_PATHS = [
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
];

/** Old flat workflow paths that must not exist in the dev repo or default export. */
const FORBIDDEN_OLD_WORKFLOW_DIRS = [
  'docs/plans',
  'docs/reviews',
  'docs/setup',
];

/** Subfolders that must appear in default export/install output. */
const REQUIRED_EXPORT_DOC_DIRS = [
  'docs/project',
  'docs/architecture',
  'docs/standards',
  'docs/intake',
  'docs/workflow',
  'docs/workflow/plans',
  'docs/workflow/reviews',
  'docs/workflow/setup',
];

const STARTER_CLEAN_DIRS = ['docs/workflow/plans', 'docs/workflow/reviews', 'docs/workflow/setup'];
const ALLOWED_STARTER_DIR_ENTRIES = new Set(['README.md', '.gitkeep']);

const EXPECTED_DEFAULT_ROOTS = ['.cursor', '.freshforge', 'AGENTS.md', 'docs'];

async function exists(target) {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function checkForbiddenLegacyDocPaths(baseLabel, basePath) {
  const violations = [];
  for (const rel of FORBIDDEN_LEGACY_DOC_PATHS) {
    if (await exists(path.join(basePath, rel))) {
      violations.push(`${baseLabel} must not include legacy path: ${rel}`);
    }
  }
  return violations;
}

async function checkForbiddenOldWorkflowDirs(baseLabel, basePath) {
  const violations = [];
  for (const rel of FORBIDDEN_OLD_WORKFLOW_DIRS) {
    const full = path.join(basePath, rel);
    if (!(await exists(full))) continue;
    const entries = await readdir(full);
    if (entries.length > 0) {
      violations.push(`${baseLabel} must not include old workflow path: ${rel} (found: ${entries.join(', ')})`);
    }
  }
  return violations;
}

async function checkCleanStarterDirs() {
  const violations = [];

  for (const rel of STARTER_CLEAN_DIRS) {
    const full = path.join(ROOT, rel);
    const entries = await readdir(full);
    const unexpected = entries.filter((name) => !ALLOWED_STARTER_DIR_ENTRIES.has(name));
    if (unexpected.length > 0) {
      violations.push(`${rel}: unexpected ${unexpected.join(', ')}`);
    }
  }

  return violations;
}

async function checkWorkflowStateClean() {
  const statePath = path.join(ROOT, '.cursor/workflow/state.md');
  const templatePath = path.join(ROOT, '.cursor/workflow/state-template.md');
  const [stateContent, templateContent] = await Promise.all([
    readFile(statePath, 'utf8'),
    readFile(templatePath, 'utf8'),
  ]);

  const violations = validateCleanStateContent(stateContent);

  if (stateContent.replace(/\r\n/g, '\n').trim() !== templateContent.replace(/\r\n/g, '\n').trim()) {
    violations.push('state.md does not match state-template.md — reset dev state before push');
  }

  return violations;
}

async function checkDefaultDistributionOutput() {
  const violations = [];
  const items = await collectStarterFiles(ROOT, {
    includeReadme: false,
    includeValidation: false,
  });

  const copied = items.filter((item) => item.action === 'copy');
  const copiedRels = new Set(copied.map((item) => item.targetRel));
  const topRoots = getTopLevelRoots(copied).sort();

  for (const expected of EXPECTED_DEFAULT_ROOTS) {
    if (!topRoots.includes(expected)) {
      violations.push(`default output missing top-level root: ${expected}`);
    }
  }

  const unexpectedRoots = topRoots.filter((root) => !EXPECTED_DEFAULT_ROOTS.includes(root));
  if (unexpectedRoots.length > 0) {
    violations.push(`default output has unexpected top-level roots: ${unexpectedRoots.join(', ')}`);
  }

  for (const item of copied) {
    if (isForbiddenInDefaultOutput(item.targetRel)) {
      violations.push(`default output includes forbidden path: ${item.targetRel}`);
    }
  }

  const excludedMustInclude = items.some((item) => item.sourceRel.startsWith('docs/freshforge-development'));
  if (!excludedMustInclude) {
    violations.push('default output did not exclude docs/freshforge-development/');
  }

  for (const rel of REQUIRED_STARTER_FILES) {
    if (!copiedRels.has(rel)) {
      violations.push(`default output missing required starter file: ${rel}`);
    }
  }

  for (const rel of REQUIRED_EXPORT_DOC_DIRS) {
    const hasDir = copied.some(
      (item) => item.targetRel === rel || item.targetRel.startsWith(`${rel}/`),
    );
    if (!hasDir) {
      violations.push(`default output missing required doc folder: ${rel}`);
    }
  }

  violations.push(...validateStateMapping(items));

  const templateContent = await readFile(path.join(ROOT, STATE_TEMPLATE_REL), 'utf8');
  violations.push(...validateCleanStateContent(templateContent).map((v) => `state-template.md: ${v}`));

  return violations;
}

async function checkDefaultInstallDryRun() {
  const violations = [];
  const items = await collectStarterFiles(ROOT, {
    includeReadme: false,
    includeValidation: false,
    targetRoot: path.join(ROOT, 'tmp-install-test-nonexistent'),
    force: false,
  });

  const actionable = items.filter((item) => item.action === 'copy');
  const topRoots = getTopLevelRoots(actionable).sort();

  for (const expected of EXPECTED_DEFAULT_ROOTS) {
    if (!topRoots.includes(expected)) {
      violations.push(`install dry-run missing top-level root: ${expected}`);
    }
  }

  const unexpectedRoots = topRoots.filter((root) => !EXPECTED_DEFAULT_ROOTS.includes(root));
  if (unexpectedRoots.length > 0) {
    violations.push(`install dry-run has unexpected top-level roots: ${unexpectedRoots.join(', ')}`);
  }

  violations.push(...validateStateMapping(items));

  const stateMapping = items.find(
    (item) => item.sourceRel === STATE_TEMPLATE_REL && item.targetRel === STATE_TARGET_REL,
  );
  if (!stateMapping || stateMapping.action !== 'copy') {
    violations.push('install dry-run must map state-template.md → state.md as copy');
  }

  return violations;
}

async function checkExportedStarter() {
  const exportRoot = path.join(ROOT, 'dist', 'freshforge-starter');
  const exportStatePath = path.join(exportRoot, STATE_TARGET_REL);

  if (!(await exists(exportStatePath))) {
    return [
      'The starter export is missing. Run `npm run export:starter` before structure validation, or ensure CI runs export before validate.',
      'Expected: dist/freshforge-starter/.cursor/workflow/state.md',
    ];
  }

  const violations = [];

  const content = await readFile(exportStatePath, 'utf8');
  const templateContent = await readFile(path.join(ROOT, STATE_TEMPLATE_REL), 'utf8');
  violations.push(...validateCleanStateContent(content));

  if (content.replace(/\r\n/g, '\n').trim() !== templateContent.replace(/\r\n/g, '\n').trim()) {
    violations.push('exported state.md does not match state-template.md');
  }

  violations.push(...(await checkForbiddenLegacyDocPaths('exported starter', exportRoot)));

  violations.push(...(await checkForbiddenOldWorkflowDirs('exported starter', exportRoot)));

  for (const rel of FORBIDDEN_OLD_WORKFLOW_DIRS) {
    if (await exists(path.join(exportRoot, rel))) {
      violations.push(`exported starter must not include old workflow path: ${rel}`);
    }
  }

  if (await exists(path.join(exportRoot, 'docs', 'freshforge-development'))) {
    violations.push('exported starter must not include docs/freshforge-development/');
  }

  if (await exists(path.join(exportRoot, '.freshforge', 'backups'))) {
    violations.push('exported starter must not include .freshforge/backups/');
  }

  if (!(await exists(path.join(exportRoot, '.freshforge', 'version.json')))) {
    violations.push('exported starter missing .freshforge/version.json');
  }

  for (const rel of REQUIRED_EXPORT_DOC_DIRS) {
    if (!(await exists(path.join(exportRoot, rel)))) {
      violations.push(`exported starter missing folder: ${rel}`);
    }
  }

  for (const rel of ['docs/AI_RULES.md', 'docs/WORKFLOWS.md']) {
    if (!(await exists(path.join(exportRoot, rel)))) {
      violations.push(`exported starter missing: ${rel}`);
    }
  }

  return violations;
}

async function main() {
  const missing = [];

  for (const rel of [...REQUIRED_STARTER_FILES, ...REQUIRED_DEVELOPMENT_FILES]) {
    const full = path.join(ROOT, rel);
    if (!(await exists(full))) {
      missing.push(`file: ${rel}`);
    }
  }

  for (const rel of REQUIRED_DIRS) {
    const full = path.join(ROOT, rel);
    if (!(await exists(full))) {
      missing.push(`directory: ${rel}`);
    }
  }

  if (missing.length > 0) {
    console.error('Structure validation failed. Missing required paths:\n');
    for (const item of missing) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  const legacyViolations = await checkForbiddenLegacyDocPaths('development repo', ROOT);
  if (legacyViolations.length > 0) {
    console.error('Structure validation failed. Legacy doc paths must be removed:\n');
    for (const item of legacyViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  const oldWorkflowViolations = await checkForbiddenOldWorkflowDirs('development repo', ROOT);
  if (oldWorkflowViolations.length > 0) {
    console.error('Structure validation failed. Old workflow paths must be removed:\n');
    for (const item of oldWorkflowViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  const cleanViolations = await checkCleanStarterDirs();
  if (cleanViolations.length > 0) {
    console.error('Structure validation failed. Starter folders must contain only README.md and .gitkeep:\n');
    for (const item of cleanViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  const stateViolations = await checkWorkflowStateClean();
  if (stateViolations.length > 0) {
    console.error('Structure validation failed. Workflow state must match clean starter template:\n');
    for (const item of stateViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  const exportViolations = await checkDefaultDistributionOutput();
  if (exportViolations.length > 0) {
    console.error('Structure validation failed. Default export/install output checks:\n');
    for (const item of exportViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  const installViolations = await checkDefaultInstallDryRun();
  if (installViolations.length > 0) {
    console.error('Structure validation failed. Default install dry-run checks:\n');
    for (const item of installViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  const exportedViolations = await checkExportedStarter();
  if (exportedViolations.length > 0) {
    console.error('Structure validation failed. Exported starter checks:\n');
    for (const item of exportedViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  console.log(
    `Structure validation passed (${REQUIRED_STARTER_FILES.length} starter files, ${REQUIRED_DEVELOPMENT_FILES.length} development files, ${REQUIRED_DIRS.length} directories, distribution checks OK).`,
  );
  console.log('Note: docs/freshforge-development/ is expected in the development repo and excluded from install/export.');
}

main().catch((err) => {
  console.error('Structure validation error:', err);
  process.exit(1);
});
