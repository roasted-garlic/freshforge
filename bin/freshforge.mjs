#!/usr/bin/env node
/**
 * FreshForge CLI — install, export, and validate the workflow starter.
 *
 * Recommended: npx github:roasted-garlic/freshforge install
 * Future:      npx freshforge install
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { printInstallUsage, runInstall } from '../scripts/lib/run-install.mjs';
import { runExport } from '../scripts/lib/run-export.mjs';
import { runValidate } from '../scripts/lib/run-validate.mjs';
import { printMigrateUsage, runMigrate } from '../scripts/lib/run-migrate.mjs';
import { printDoctorUsage, runDoctor } from '../scripts/lib/run-doctor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');

function printRootUsage() {
  console.log(`FreshForge — Cursor AI workflow starter CLI

Usage:
  freshforge install [options]    Install starter into a project (default: current directory)
  freshforge export [options]     Export a clean starter copy
  freshforge migrate [options]    Upgrade an existing workflow installation safely
  freshforge doctor [options]     Inspect workflow installation health (read-only)
  freshforge validate             Run package validation checks

Recommended install:
  npx github:roasted-garlic/freshforge install

Future npm install:
  npx freshforge install

Install options:
  --target <path>         Target project directory
  --include-readme        Copy README as FRESHFORGE_README.md
  --include-validation    Include validation scripts and CI
  --force                 Overwrite existing files
  --dry-run               Preview without writing

Export options:
  --out <path>            Output directory
  --include-readme        Include README.md
  --include-validation    Include validation tooling
  --clean                 Remove output directory first
  --dry-run               Preview without writing

Examples:
  npx github:roasted-garlic/freshforge install
  npx github:roasted-garlic/freshforge install --dry-run
  npx github:roasted-garlic/freshforge install --target ../my-app --include-readme
  npx github:roasted-garlic/freshforge migrate --dry-run
  npx github:roasted-garlic/freshforge doctor

See docs/freshforge-development/distribution/INSTALLATION.md for more.
`);
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    printRootUsage();
    return;
  }

  const [command, ...rest] = argv;
  const context = { sourceRoot: PACKAGE_ROOT };

  let exitCode = 0;

  switch (command) {
    case 'install':
      exitCode = await runInstall(rest, context);
      break;
    case 'export':
      exitCode = await runExport(rest, context);
      break;
    case 'migrate':
      exitCode = await runMigrate(rest, context);
      break;
    case 'doctor':
      exitCode = await runDoctor(rest, context);
      break;
    case 'validate':
      exitCode = await runValidate(rest, context);
      break;
    case 'help':
      printRootUsage();
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      printRootUsage();
      exitCode = 1;
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error('FreshForge CLI failed:', err.message ?? err);
  process.exit(1);
});
