#!/usr/bin/env node
/**
 * Export a clean AppForge starter copy from the development repository.
 *
 * Default: AGENTS.md, .cursor/, docs/ → dist/appforge-starter/
 * Optional: --include-readme, --include-validation
 */

import { copyFile, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  collectStarterFiles,
  getTopLevelRoots,
  resolveSourceRoot,
  summarizeItems,
} from './lib/starter-distribution.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = resolveSourceRoot(path.join(__dirname, '..'));
const DEFAULT_OUT = path.join(SOURCE_ROOT, 'dist', 'appforge-starter');

function printUsage() {
  console.log(`Usage: node scripts/export-starter.mjs [options]

Options:
  --out <path>            Output directory (default: dist/appforge-starter)
  --include-readme        Export README.md
  --include-validation    Also export scripts/, package.json, package-lock.json,
                          .markdownlint-cli2.jsonc, .github/workflows/validate.yml
  --clean                 Remove existing output directory before export
  --dry-run               Print actions without writing files
  --help                  Show this help
`);
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  /** @type {{ out: string; includeReadme: boolean; includeValidation: boolean; clean: boolean; dryRun: boolean; help: boolean }} */
  const options = {
    out: DEFAULT_OUT,
    includeReadme: false,
    includeValidation: false,
    clean: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--out':
        options.out = argv[++i] ?? options.out;
        break;
      case '--include-readme':
        options.includeReadme = true;
        break;
      case '--include-validation':
        options.includeValidation = true;
        break;
      case '--clean':
        options.clean = true;
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

/**
 * @param {import('./lib/starter-distribution.mjs').CollectedItem} item
 * @param {string} sourceRoot
 * @param {string} outRoot
 * @param {boolean} dryRun
 */
async function writeItem(item, sourceRoot, outRoot, dryRun) {
  const sourcePath = path.join(sourceRoot, item.sourceRel);
  const targetPath = path.join(outRoot, item.targetRel);
  const targetDir = path.dirname(targetPath);

  if (dryRun) {
    console.log(`  [export] ${item.sourceRel} → ${item.targetRel}`);
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

function printSummary(summary, options, topRoots) {
  console.log('\n--- Export Summary ---\n');

  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'export'}`);
  console.log(`Output: ${path.resolve(options.out)}`);
  console.log(`Source: ${SOURCE_ROOT}`);
  console.log(`Include README: ${options.includeReadme ? 'yes' : 'no'}`);
  console.log(`Include validation: ${options.includeValidation ? 'yes' : 'no'}`);

  console.log(`\nTop-level roots: ${topRoots.join(', ') || '(none)'}`);

  console.log(`\nExported (${summary.copied.length}):`);
  for (const item of summary.copied) {
    console.log(`  + ${item.targetRel}`);
  }

  if (summary.skipped.length > 0) {
    console.log(`\nSkipped (${summary.skipped.length}):`);
    for (const item of summary.skipped) {
      console.log(`  - ${item.sourceRel}${item.reason ? ` (${item.reason})` : ''}`);
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

  console.log('\nVerify with: npm run validate:structure (in development repo)');
  console.log('See docs/DISTRIBUTION.md for packaging details.\n');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  const outRoot = path.resolve(options.out);

  if (options.clean && !options.dryRun) {
    await rm(outRoot, { recursive: true, force: true });
  } else if (options.clean && options.dryRun) {
    console.log(`[clean] would remove ${outRoot}`);
  }

  const items = await collectStarterFiles(SOURCE_ROOT, {
    includeReadme: options.includeReadme,
    includeValidation: options.includeValidation,
  });

  const summary = summarizeItems(items);
  const toWrite = summary.copied;

  if (options.dryRun) {
    console.log('Dry run — no files will be written.\n');
  } else if (!options.clean) {
    await mkdir(outRoot, { recursive: true });
  } else {
    await mkdir(outRoot, { recursive: true });
  }

  for (const item of toWrite) {
    await writeItem(item, SOURCE_ROOT, outRoot, options.dryRun);
  }

  const topRoots = getTopLevelRoots(toWrite);
  printSummary(
    {
      copied: toWrite,
      skipped: summary.skipped,
      conflicts: [],
      excluded: summary.excluded,
    },
    { ...options, out: outRoot },
    topRoots,
  );
}

main().catch((err) => {
  console.error('Export failed:', err.message ?? err);
  process.exit(1);
});
