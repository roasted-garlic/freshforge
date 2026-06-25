#!/usr/bin/env node
/**
 * FreshForge migrate command.
 */

import path from 'node:path';
import { detectInstallState } from './freshforge-version.mjs';
import {
  applyMigrationActions,
  buildMigrationPlan,
  createBackup,
  getMigrationPackageVersion,
} from './freshforge-migrations.mjs';

/**
 * @param {string[]} argv
 */
export function parseMigrateArgs(argv) {
  /** @type {{ target: string; dryRun: boolean; from: string | null; forceWorkflow: boolean; help: boolean }} */
  const options = {
    target: process.cwd(),
    dryRun: false,
    from: null,
    forceWorkflow: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--target':
        options.target = argv[++i] ?? options.target;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--from':
        options.from = argv[++i] ?? null;
        break;
      case '--force-workflow':
        options.forceWorkflow = true;
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

export function printMigrateUsage() {
  console.log(`Usage: freshforge migrate [options]

Options:
  --target <path>         Target project directory (default: current working directory)
  --dry-run               Preview planned changes without writing files
  --from <source>         Limit migration source hint (e.g. appforge)
  --force-workflow        Overwrite FreshForge-controlled workflow files from current starter
  --help                  Show this help

Examples:
  npx github:roasted-garlic/freshforge migrate
  npx github:roasted-garlic/freshforge migrate --dry-run
  npx github:roasted-garlic/freshforge migrate --target ../some-project
  npx github:roasted-garlic/freshforge migrate --from appforge
  npx github:roasted-garlic/freshforge migrate --force-workflow
`);
}

function printMigrationSummary(summary, options, installState, backupDir) {
  console.log('\n--- Migration Summary ---\n');
  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'migrate'}`);
  console.log(`Target: ${path.resolve(options.target)}`);
  console.log(`Detected install: ${installState.kind}`);
  if (installState.version?.installedVersion) {
    console.log(`Installed version: ${installState.version.installedVersion}`);
  }
  if (options.from) console.log(`From filter: ${options.from}`);
  console.log(`Force workflow: ${options.forceWorkflow ? 'yes' : 'no'}`);

  if (summary.migrations.length > 0) {
    console.log(`\nMigrations (${summary.migrations.length}):`);
    for (const m of summary.migrations) {
      console.log(`  • ${m.id} — ${m.description}`);
    }
  } else {
    console.log('\nMigrations: none pending');
  }

  if (summary.conflicts.length > 0) {
    console.log(`\nConflicts (${summary.conflicts.length}) — resolve manually or adjust files:`);
    for (const c of summary.conflicts) {
      console.log(`  ! ${c.targetRel}: ${c.reason}`);
    }
  }

  if (summary.actions.length > 0) {
    console.log(`\nPlanned actions (${summary.actions.length}):`);
    for (const a of summary.actions) {
      const label =
        a.type === 'move'
          ? `move ${a.sourceRel} → ${a.targetRel}`
          : `${a.type} ${a.targetRel}`;
      console.log(`  ${options.dryRun ? '[preview]' : '[apply]'} ${label}${a.reason ? ` — ${a.reason}` : ''}`);
    }
  }

  if (!options.dryRun && backupDir) {
    console.log(`\nBackup: ${backupDir}`);
  }

  console.log('\nProject-specific docs under docs/project/, docs/architecture/, docs/standards/, docs/intake/ are preserved.');
  console.log('Application source, .env, Firebase config, and package.json are never modified.\n');
}

/**
 * @param {string[]} argv
 * @param {{ sourceRoot: string }} context
 */
export async function runMigrate(argv, { sourceRoot }) {
  const options = parseMigrateArgs(argv);
  if (options.help) {
    printMigrateUsage();
    return 0;
  }

  const targetRoot = path.resolve(options.target);
  const packageVersion = await getMigrationPackageVersion(sourceRoot);
  const installState = await detectInstallState(targetRoot);

  if (installState.kind === 'none' && !options.from) {
    console.error('No FreshForge or AppForge workflow installation detected.');
    console.error('Run `freshforge install` for a new installation.');
    return 1;
  }

  const ctx = {
    sourceRoot,
    targetRoot,
    packageVersion,
    installState,
    forceWorkflow: options.forceWorkflow,
    fromFilter: options.from,
  };

  const summary = await buildMigrationPlan(ctx);

  if (summary.migrations.length === 0 && summary.actions.length === 0) {
    console.log('No pending migrations. Project is up to date.');
    printMigrationSummary(summary, options, installState, null);
    return 0;
  }

  if (summary.conflicts.length > 0 && !options.forceWorkflow) {
    printMigrationSummary(summary, options, installState, null);
    console.error('Migration stopped due to conflicts. Resolve conflicts or use --force-workflow for controlled files only.');
    return 1;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRel = `.freshforge/backups/${timestamp}`;

  if (!options.dryRun && summary.actions.length > 0) {
    try {
      await createBackup(targetRoot, summary.actions, backupRel, false);
    } catch (err) {
      console.error('Backup creation failed — migration aborted:', err.message ?? err);
      return 1;
    }
  } else if (options.dryRun && summary.actions.length > 0) {
    await createBackup(targetRoot, summary.actions, backupRel, true);
  }

  if (options.dryRun) {
    console.log('Dry run — applying planned actions in preview only:\n');
  }

  await applyMigrationActions(sourceRoot, targetRoot, summary.actions, options.dryRun);

  const backupDir = options.dryRun ? null : path.join(targetRoot, backupRel);
  printMigrationSummary(summary, options, installState, backupDir);

  return summary.conflicts.length > 0 ? 1 : 0;
}
