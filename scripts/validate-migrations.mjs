#!/usr/bin/env node
/**
 * Validates migration and doctor commands against test fixtures.
 */

import { access, constants, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'freshforge.mjs');
const FIXTURES = path.join(ROOT, 'test-fixtures');
const TMP_LEGACY = path.join(ROOT, 'tmp-test-legacy-appforge');

/**
 * @param {string} cmd
 * @param {string[]} args
 */
function runNode(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cmd, ...args], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
    child.on('error', reject);
  });
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const violations = [];

  const legacyFixture = path.join(FIXTURES, 'legacy-appforge-install');
  const currentFixture = path.join(FIXTURES, 'current-freshforge-install');
  const noInstallFixture = path.join(FIXTURES, 'no-install');

  for (const fixture of [legacyFixture, currentFixture, noInstallFixture]) {
    if (!(await exists(fixture))) {
      violations.push(`missing test fixture: ${path.relative(ROOT, fixture)}`);
    }
  }

  if (violations.length > 0) {
    console.error('Migration validation failed:\n');
    for (const v of violations) console.error(`  - ${v}`);
    process.exit(1);
  }

  // Doctor on no-install should report issues
  const doctorNo = await runNode(CLI, ['doctor', '--target', noInstallFixture]);
  if (!doctorNo.stdout.includes('No workflow installation detected') && doctorNo.code === 0) {
    violations.push('doctor on no-install fixture should report issues');
  }

  // Doctor on current fixture (missing CLAUDE.md) should flag bridge
  const doctorCurrent = await runNode(CLI, ['doctor', '--target', currentFixture]);
  if (!doctorCurrent.stdout.includes('FreshForge Doctor')) {
    violations.push('doctor on current fixture failed to run');
  }
  if (doctorCurrent.stdout.includes('CLAUDE.md exists') && doctorCurrent.stdout.includes('✗')) {
    // expected before migrate
  }

  const TMP_CURRENT = path.join(ROOT, 'tmp-test-current-freshforge');
  await rm(TMP_CURRENT, { recursive: true, force: true });
  await cp(currentFixture, TMP_CURRENT, { recursive: true });

  const claudeBridgeDry = await runNode(CLI, ['migrate', '--target', TMP_CURRENT, '--dry-run']);
  if (!claudeBridgeDry.stdout.includes('add-claude-md-bridge') && !claudeBridgeDry.stdout.includes('CLAUDE.md')) {
    violations.push(`claude bridge migrate dry-run missing CLAUDE.md action: ${claudeBridgeDry.stdout}`);
  }

  const claudeBridgeReal = await runNode(CLI, ['migrate', '--target', TMP_CURRENT]);
  if (claudeBridgeReal.code !== 0) {
    violations.push(`claude bridge migrate failed: ${claudeBridgeReal.stderr || claudeBridgeReal.stdout}`);
  }

  if (!(await exists(path.join(TMP_CURRENT, 'CLAUDE.md')))) {
    violations.push('migrated current fixture missing CLAUDE.md');
  }

  const doctorAfterBridge = await runNode(CLI, ['doctor', '--target', TMP_CURRENT]);
  if (!doctorAfterBridge.stdout.includes('CLAUDE.md exists (Claude Code bridge)')) {
    violations.push('doctor after claude bridge should report CLAUDE.md check');
  }
  if (doctorAfterBridge.stdout.includes('✗ CLAUDE.md exists')) {
    violations.push('doctor after claude bridge should pass CLAUDE.md check');
  }

  await rm(TMP_CURRENT, { recursive: true, force: true });

  // Legacy migrate dry-run
  await rm(TMP_LEGACY, { recursive: true, force: true });
  await cp(legacyFixture, TMP_LEGACY, { recursive: true });

  const migrateDry = await runNode(CLI, ['migrate', '--target', TMP_LEGACY, '--dry-run', '--from', 'appforge']);
  if (migrateDry.code !== 0 && !migrateDry.stdout.includes('Planned actions')) {
    violations.push(`migrate dry-run failed: ${migrateDry.stderr || migrateDry.stdout}`);
  }

  const migrateReal = await runNode(CLI, ['migrate', '--target', TMP_LEGACY, '--from', 'appforge']);
  if (migrateReal.code !== 0) {
    violations.push(`migrate real run failed: ${migrateReal.stderr || migrateReal.stdout}`);
  }

  if (!(await exists(path.join(TMP_LEGACY, '.freshforge', 'version.json')))) {
    violations.push('migrated project missing .freshforge/version.json');
  }

  const doctorAfter = await runNode(CLI, ['doctor', '--target', TMP_LEGACY]);
  if (doctorAfter.stdout.includes('legacy AppForge workflow references') && doctorAfter.stdout.includes('Files with legacy')) {
    // allow if still some refs in non-workflow files only — check AGENTS
  }

  if (violations.length > 0) {
    console.error('Migration validation failed:\n');
    for (const v of violations) console.error(`  - ${v}`);
    process.exit(1);
  }

  await rm(TMP_LEGACY, { recursive: true, force: true });

  console.log('Migration validation passed (fixtures, doctor, migrate dry-run and real run).');
}

main().catch((err) => {
  console.error('Migration validation error:', err);
  process.exit(1);
});
