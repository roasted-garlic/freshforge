#!/usr/bin/env node
/**
 * Export a clean AppForge starter copy from the development repository.
 *
 * Default: AGENTS.md, .cursor/, docs/ → dist/appforge-starter/
 * Optional: --include-readme, --include-validation
 *
 * CLI: npx github:roasted-garlic/appforge export
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runExport } from './lib/run-export.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, '..');

const exitCode = await runExport(process.argv.slice(2), { sourceRoot: SOURCE_ROOT });
process.exit(exitCode);
