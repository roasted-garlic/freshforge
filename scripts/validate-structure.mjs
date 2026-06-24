#!/usr/bin/env node
/**
 * Validates required AppForge workflow starter files and development-repo distribution tooling.
 * See README.md, docs/PACKAGING.md, and docs/DISTRIBUTION.md.
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
  'README.md',
  '.cursor/hooks.json',
  '.cursor/workflow/state.md',
  '.cursor/workflow/state-template.md',
  '.cursor/workflow/command-aliases.md',
  '.cursor/workflow/plan-template.md',
  'docs/AI_RULES.md',
  'docs/CODING_STANDARDS.md',
  'docs/SECURITY.md',
  'docs/WORKFLOWS.md',
  'docs/TESTING.md',
  'docs/DEPLOYMENT.md',
  'docs/DECISIONS.md',
  'docs/RISK_REGISTER.md',
  'docs/PACKAGING.md',
  'docs/INSTALLATION.md',
  'docs/DISTRIBUTION.md',
  'docs/PROJECT_BRIEF.md',
  'docs/ARCHITECTURE.md',
  'docs/DATA_MODEL.md',
  'docs/BACKEND.md',
  'docs/STYLE_GUIDE.md',
  'docs/ROADMAP.md',
  'docs/PROJECT_HEALTH.md',
  'docs/INTAKE_FINDINGS.md',
  'docs/TECH_DEBT.md',
  'docs/plans/README.md',
  'docs/plans/.gitkeep',
  'docs/reviews/README.md',
  'docs/reviews/.gitkeep',
  'docs/setup/README.md',
  'docs/setup/.gitkeep',
];

/** @type {readonly string[]} */
const REQUIRED_DEVELOPMENT_FILES = [
  'package.json',
  'scripts/validate-structure.mjs',
  'scripts/validate-links.mjs',
  'scripts/install-appforge.mjs',
  'scripts/export-starter.mjs',
  'scripts/lib/starter-distribution.mjs',
  'scripts/lib/run-install.mjs',
  'scripts/lib/run-export.mjs',
  'bin/appforge.mjs',
  '.markdownlint-cli2.jsonc',
  '.github/workflows/validate.yml',
];

/** @type {readonly string[]} */
const REQUIRED_DIRS = [
  '.cursor/rules',
  '.cursor/agents',
  '.cursor/skills',
  '.cursor/workflow',
  'docs/plans',
  'docs/reviews',
  'docs/setup',
  'docs/appforge-development',
  'scripts',
  '.github/workflows',
];

const STARTER_CLEAN_DIRS = ['docs/plans', 'docs/reviews', 'docs/setup'];
const ALLOWED_STARTER_DIR_ENTRIES = new Set(['README.md', '.gitkeep']);

const EXPECTED_DEFAULT_ROOTS = ['.cursor', 'AGENTS.md', 'docs'];

async function exists(target) {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
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

  const excludedMustInclude = items.some((item) => item.sourceRel.startsWith('docs/appforge-development'));
  if (!excludedMustInclude) {
    violations.push('default output did not exclude docs/appforge-development/');
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

async function checkExportedStateClean() {
  const exportStatePath = path.join(ROOT, 'dist', 'appforge-starter', STATE_TARGET_REL);
  if (!(await exists(exportStatePath))) {
    return ['dist/appforge-starter/.cursor/workflow/state.md not found — run npm run export:starter'];
  }

  const content = await readFile(exportStatePath, 'utf8');
  const templateContent = await readFile(path.join(ROOT, STATE_TEMPLATE_REL), 'utf8');
  const violations = validateCleanStateContent(content);

  if (content.replace(/\r\n/g, '\n').trim() !== templateContent.replace(/\r\n/g, '\n').trim()) {
    violations.push('exported state.md does not match state-template.md');
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

  const exportedStateViolations = await checkExportedStateClean();
  if (exportedStateViolations.length > 0) {
    console.error('Structure validation failed. Exported starter state checks:\n');
    for (const item of exportedStateViolations) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }

  console.log(
    `Structure validation passed (${REQUIRED_STARTER_FILES.length} starter files, ${REQUIRED_DEVELOPMENT_FILES.length} development files, ${REQUIRED_DIRS.length} directories, distribution checks OK).`,
  );
  console.log('Note: docs/appforge-development/ is expected in the development repo and excluded from install/export.');
}

main().catch((err) => {
  console.error('Structure validation error:', err);
  process.exit(1);
});
