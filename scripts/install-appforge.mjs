#!/usr/bin/env node
/**
 * Install AppForge starter files into a target project directory.
 *
 * Default: AGENTS.md, .cursor/, docs/
 * Optional: --include-readme (as APPFORGE_README.md), --include-validation
 *
 * Preferred: npx github:roasted-garlic/appforge install
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInstall } from './lib/run-install.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, '..');

const exitCode = await runInstall(process.argv.slice(2), { sourceRoot: SOURCE_ROOT });
process.exit(exitCode);
