#!/usr/bin/env node
/**
 * Run AppForge validation checks from the CLI.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');

/**
 * @param {string} command
 * @param {string[]} args
 */
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: PACKAGE_ROOT,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

export function printValidateUsage() {
  console.log(`Usage: appforge validate

Runs structure, markdown, and link validation for the AppForge package.
`);
}

/**
 * @param {string[]} argv
 * @param {{ sourceRoot: string }} context
 */
export async function runValidate(argv, { sourceRoot }) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printValidateUsage();
    return 0;
  }

  if (argv.length > 0) {
    throw new Error(`Unknown validate arguments: ${argv.join(' ')}`);
  }

  await runCommand('npm', ['run', 'validate']);
  return 0;
}
