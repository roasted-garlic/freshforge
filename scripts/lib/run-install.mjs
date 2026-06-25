#!/usr/bin/env node
/**
 * Shared install logic for FreshForge starter files.
 */

import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  collectStarterFiles,
  getTopLevelRoots,
  resolveSourceRoot,
  summarizeItems,
} from './starter-distribution.mjs';

/**
 * @param {string[]} argv
 */
export function parseInstallArgs(argv) {
  /** @type {{ target: string; includeReadme: boolean; includeValidation: boolean; force: boolean; dryRun: boolean; help: boolean }} */
  const options = {
    target: process.cwd(),
    includeReadme: false,
    includeValidation: false,
    force: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--target':
        options.target = argv[++i] ?? options.target;
        break;
      case '--include-readme':
        options.includeReadme = true;
        break;
      case '--include-validation':
        options.includeValidation = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--dry-run':
        options.dryRun = true;
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

export function printInstallUsage() {
  console.log(`Usage: freshforge install [options]

Options:
  --target <path>         Target project directory (default: current working directory)
  --include-readme        Copy README.md as FRESHFORGE_README.md (never overwrites README.md)
  --include-validation    Also copy scripts/, package.json, package-lock.json,
                          .markdownlint-cli2.jsonc, .github/workflows/validate.yml
  --force                 Overwrite existing target files
  --dry-run               Print actions without writing files
  --help                  Show this help
`);
}

/**
 * @param {import('./starter-distribution.mjs').CollectedItem} item
 * @param {string} sourceRoot
 * @param {string} targetRoot
 * @param {boolean} dryRun
 */
async function writeItem(item, sourceRoot, targetRoot, dryRun) {
  const sourcePath = path.join(sourceRoot, item.sourceRel);
  const targetPath = path.join(targetRoot, item.targetRel);
  const targetDir = path.dirname(targetPath);

  if (dryRun) {
    console.log(`  [copy] ${item.sourceRel} → ${item.targetRel}`);
    return;
  }

  await mkdir(targetDir, { recursive: true });

  const sourceStat = await stat(sourcePath);
  if (sourceStat.isDirectory()) {
    await mkdir(targetPath, { recursive: true });
    return;
  }

  await copyFile(sourcePath, targetPath);
}

function printSummary(summary, options, sourceRoot, topRoots) {
  console.log('\n--- Install Summary ---\n');

  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'install'}`);
  console.log(`Target: ${path.resolve(options.target)}`);
  console.log(`Source: ${sourceRoot}`);
  console.log(`Include README: ${options.includeReadme ? 'yes (as FRESHFORGE_README.md)' : 'no'}`);
  console.log(`Include validation: ${options.includeValidation ? 'yes' : 'no'}`);
  console.log(`Force overwrite: ${options.force ? 'yes' : 'no'}`);

  console.log(`\nTop-level roots: ${topRoots.join(', ') || '(none)'}`);

  console.log(`\nCopied (${summary.copied.length}):`);
  for (const item of summary.copied) {
    console.log(`  + ${item.targetRel}`);
  }

  if (summary.skipped.length > 0) {
    console.log(`\nSkipped (${summary.skipped.length}):`);
    for (const item of summary.skipped) {
      console.log(`  - ${item.sourceRel}${item.reason ? ` (${item.reason})` : ''}`);
    }
  }

  if (summary.conflicts.length > 0) {
    console.log(`\nConflicts (${summary.conflicts.length}) — re-run with --force to overwrite:`);
    for (const item of summary.conflicts) {
      console.log(`  ! ${item.targetRel}${item.reason ? ` (${item.reason})` : ''}`);
    }
  }

  if (summary.excluded.length > 0) {
    const shown = summary.excluded.slice(0, 20);
    console.log(`\nExcluded (${summary.excluded.length}):`);
    for (const item of shown) {
      console.log(`  x ${item.sourceRel}`);
    }
    if (summary.excluded.length > 20) {
      console.log(`  ... and ${summary.excluded.length - 20} more`);
    }
  }

  console.log('\n--- Next step in Cursor ---\n');
  console.log('  Existing codebase: type "Existing Project" or "Intake"');
  console.log('  New or blank project: type "New Project" or "Bootstrap"');
  console.log('\nSee docs/freshforge-development/distribution/INSTALLATION.md for details.\n');
}

/**
 * @param {string[]} argv
 * @param {{ sourceRoot: string }} context
 */
export async function runInstall(argv, { sourceRoot }) {
  const options = parseInstallArgs(argv);
  if (options.help) {
    printInstallUsage();
    return 0;
  }

  const root = resolveSourceRoot(sourceRoot);
  const targetRoot = path.resolve(options.target);
  const items = await collectStarterFiles(root, {
    includeReadme: options.includeReadme,
    includeValidation: options.includeValidation,
    readmeAsFreshforgeReadme: true,
    targetRoot,
    force: options.force,
  });

  const summary = summarizeItems(items);
  const actionable = items.filter((item) => item.action === 'copy' || item.action === 'conflict');

  if (summary.conflicts.length > 0 && !options.force) {
    for (const item of summary.conflicts) {
      console.error(`Conflict: ${item.targetRel} — ${item.reason ?? 'already exists'}`);
    }
    printSummary(summary, { ...options, target: targetRoot }, root, getTopLevelRoots(actionable));
    return 1;
  }

  const toWrite = items.filter((item) => item.action === 'copy' || (item.action === 'conflict' && options.force));

  if (options.dryRun) {
    console.log('Dry run — no files will be written.\n');
  }

  for (const item of toWrite) {
    await writeItem(item, root, targetRoot, options.dryRun);
  }

  const topRoots = getTopLevelRoots(toWrite);
  printSummary(
    {
      copied: toWrite.map((item) => ({ ...item, action: 'copy' })),
      skipped: summary.skipped,
      conflicts: options.force ? [] : summary.conflicts,
      excluded: summary.excluded,
    },
    { ...options, target: targetRoot },
    root,
    topRoots,
  );

  return 0;
}
