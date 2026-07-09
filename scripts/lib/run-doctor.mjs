#!/usr/bin/env node
/**
 * FreshForge doctor command — read-only project inspection.
 */

import { access, constants, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  detectInstallState,
  DEV_ONLY_PATH_PREFIXES,
  LEGACY_DOC_PATHS,
  VERSION_JSON_REL,
} from './freshforge-version.mjs';
import { isControlledWorkflowFile, hasActionableLegacyAppForgeRef } from './freshforge-migrations.mjs';

/**
 * @param {string[]} argv
 */
export function parseDoctorArgs(argv) {
  /** @type {{ target: string; help: boolean }} */
  const options = {
    target: process.cwd(),
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--target':
        options.target = argv[++i] ?? options.target;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

export function printDoctorUsage() {
  console.log(`Usage: freshforge doctor [options]

Options:
  --target <path>         Target project directory (default: current working directory)
  --help                  Show this help

Examples:
  npx github:roasted-garlic/freshforge doctor
  npx github:roasted-garlic/freshforge doctor --target ../some-project
`);
}

/**
 * @param {string} targetRoot
 * @param {string} rel
 */
async function exists(targetRoot, rel) {
  try {
    await access(path.join(targetRoot, rel), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} targetRoot
 */
async function scanAppForgeRefs(targetRoot) {
  /** @type {string[]} */
  const files = [];
  const probeRoots = ['AGENTS.md', '.cursor', 'docs'];

  async function walk(rel) {
    const full = path.join(targetRoot, rel);
    try {
      const entries = await readdir(full, { withFileTypes: true });
      for (const entry of entries) {
        const child = rel ? `${rel}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '.git') continue;
          await walk(child);
        } else if (isControlledWorkflowFile(child)) {
          try {
            const content = await readFile(path.join(targetRoot, child), 'utf8');
            if (hasActionableLegacyAppForgeRef(content)) {
              files.push(child);
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      if (rel && isControlledWorkflowFile(rel)) {
        try {
          const content = await readFile(full, 'utf8');
          if (hasActionableLegacyAppForgeRef(content)) {
            files.push(rel);
          }
        } catch {
          // skip
        }
      }
    }
  }

  for (const root of probeRoots) {
    await walk(root);
  }

  return [...new Set(files)].sort();
}

/**
 * @param {string[]} argv
 * @param {{ sourceRoot: string }} context
 */
export async function runDoctor(argv, { sourceRoot: _sourceRoot }) {
  const options = parseDoctorArgs(argv);
  if (options.help) {
    printDoctorUsage();
    return 0;
  }

  const targetRoot = path.resolve(options.target);
  const state = await detectInstallState(targetRoot);
  const appForgeFiles = await scanAppForgeRefs(targetRoot);

  const checks = [
    { label: 'FreshForge installed', ok: state.kind === 'freshforge' || state.hasAgentsMd || state.hasCursor },
    { label: `${VERSION_JSON_REL} exists`, ok: state.version !== null },
    { label: 'AGENTS.md exists', ok: state.hasAgentsMd },
    { label: 'CLAUDE.md exists (Claude Code bridge)', ok: await exists(targetRoot, 'CLAUDE.md') },
    { label: '.cursor/ exists', ok: state.hasCursor },
    { label: 'docs/AI_RULES.md exists', ok: await exists(targetRoot, 'docs/AI_RULES.md') },
    { label: 'docs/WORKFLOWS.md exists', ok: await exists(targetRoot, 'docs/WORKFLOWS.md') },
    { label: 'docs/workflow/plans/ exists', ok: await exists(targetRoot, 'docs/workflow/plans') },
    { label: 'docs/workflow/reviews/ exists', ok: await exists(targetRoot, 'docs/workflow/reviews') },
    { label: 'docs/workflow/setup/ exists', ok: await exists(targetRoot, 'docs/workflow/setup') },
    { label: 'docs/assistants/ exists', ok: await exists(targetRoot, 'docs/assistants') },
    { label: 'No legacy AppForge refs in workflow files', ok: appForgeFiles.length === 0 },
    { label: 'No old root docs layout', ok: state.legacyDocPaths.length === 0 },
    { label: 'No development-only docs installed', ok: state.devOnlyPaths.length === 0 },
  ];

  console.log('\n--- FreshForge Doctor ---\n');
  console.log(`Target: ${targetRoot}`);
  console.log(`Detected: ${state.kind}`);
  if (state.version) {
    console.log(`Version: ${state.version.installedVersion} (installed ${state.version.installedAt})`);
    if (state.version.previousName) {
      console.log(`Previous name: ${state.version.previousName}`);
    }
    if (state.version.migrationHistory.length > 0) {
      console.log(`Migrations applied: ${state.version.migrationHistory.map((e) => e.id).join(', ')}`);
    }
  }

  console.log('\nChecks:');
  let issues = 0;
  for (const check of checks) {
    const icon = check.ok ? '✓' : '✗';
    console.log(`  ${icon} ${check.label}`);
    if (!check.ok) issues++;
  }

  if (state.legacyDocPaths.length > 0) {
    console.log('\nOld root doc paths:');
    for (const rel of state.legacyDocPaths) {
      console.log(`  - ${rel}`);
    }
  }

  if (state.devOnlyPaths.length > 0) {
    console.log('\nDevelopment-only paths (should not be in target projects):');
    for (const rel of state.devOnlyPaths) {
      console.log(`  - ${rel}`);
    }
  }

  if (appForgeFiles.length > 0) {
    console.log('\nFiles with legacy AppForge workflow references:');
    for (const rel of appForgeFiles.slice(0, 15)) {
      console.log(`  - ${rel}`);
    }
    if (appForgeFiles.length > 15) {
      console.log(`  ... and ${appForgeFiles.length - 15} more`);
    }
  }

  console.log('\n--- Recommendation ---\n');
  if (state.kind === 'none') {
    console.log('No workflow installation detected. Run:');
    console.log('  npx github:roasted-garlic/freshforge install');
  } else if (issues > 0 || appForgeFiles.length > 0 || state.legacyDocPaths.length > 0) {
    console.log('Issues found. Preview migration with:');
    console.log('  npx github:roasted-garlic/freshforge migrate --dry-run');
    console.log('Apply migration with:');
    console.log('  npx github:roasted-garlic/freshforge migrate');
    if (state.kind === 'appforge' || appForgeFiles.length > 0) {
      console.log('Or explicitly from AppForge legacy:');
      console.log('  npx github:roasted-garlic/freshforge migrate --from appforge');
    }
  } else {
    console.log('Project looks healthy. No migration required.');
  }

  console.log('');
  return issues > 0 ? 1 : 0;
}
