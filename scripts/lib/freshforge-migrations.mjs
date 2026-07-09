#!/usr/bin/env node
/**
 * FreshForge migration registry and file classification.
 */

import { copyFile, mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  collectStarterFiles,
  STATE_TARGET_REL,
  STATE_TEMPLATE_REL,
} from './starter-distribution.mjs';
import {
  createVersionJson,
  DOC_PATH_MOVES,
  getPackageVersion,
  hasMeaningfulContent,
  readVersion,
  writeVersion,
} from './freshforge-version.mjs';

/** FreshForge-controlled workflow files (safe to update during migration). */
export const CONTROLLED_EXACT = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  '.cursor/hooks.json',
  'docs/AI_RULES.md',
  'docs/WORKFLOWS.md',
  'docs/workflow/plans/README.md',
  'docs/workflow/reviews/README.md',
  'docs/workflow/setup/README.md',
]);

export const CONTROLLED_PREFIXES = [
  '.cursor/rules/',
  '.cursor/skills/',
  '.cursor/workflow/',
  '.cursor/agents/',
];

/** Project-specific docs — never blind overwrite. */
export const PROJECT_SPECIFIC_PREFIXES = [
  'docs/project/',
  'docs/architecture/',
  'docs/standards/',
  'docs/intake/',
];

/** Paths migrate must never modify. */
export const NEVER_TOUCH_EXACT = new Set([
  'package.json',
  'package-lock.json',
  'firebase.json',
  'firestore.rules',
  'storage.rules',
  '.env',
]);

export const NEVER_TOUCH_PREFIXES = [
  'src/',
  'app/',
  'lib/',
  'public/',
  'functions/',
  'api/',
];

export const NEVER_TOUCH_PATTERNS = [
  /^\.env\./i,
  /firebase/i,
  /firestore\.rules$/i,
  /storage\.rules$/i,
];

/**
 * @param {string} relPosix
 */
export function normalizeRel(relPosix) {
  return relPosix.replace(/\\/g, '/');
}

/**
 * @param {string} relPosix
 */
export function isControlledWorkflowFile(relPosix) {
  const normalized = normalizeRel(relPosix);
  if (CONTROLLED_EXACT.has(normalized)) return true;
  return CONTROLLED_PREFIXES.some(
    (prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix),
  );
}

/**
 * @param {string} relPosix
 */
export function isProjectSpecificDoc(relPosix) {
  const normalized = normalizeRel(relPosix);
  return PROJECT_SPECIFIC_PREFIXES.some(
    (prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix),
  );
}

/**
 * @param {string} relPosix
 */
export function isNeverTouch(relPosix) {
  const normalized = normalizeRel(relPosix);
  if (NEVER_TOUCH_EXACT.has(normalized)) return true;
  if (NEVER_TOUCH_PREFIXES.some((p) => normalized.startsWith(p))) return true;
  if (NEVER_TOUCH_PATTERNS.some((re) => re.test(normalized))) return true;
  return false;
}

/** Patterns indicating legacy AppForge workflow install (not historical ADR mentions). */
export const ACTIONABLE_LEGACY_PATTERNS = [
  /github:roasted-garlic\/appforge/i,
  /\bnpx appforge\b/i,
  /bin\/appforge\.mjs/,
  /docs\/appforge-development/,
  /AppForge Entry Point/,
  /uses the \*\*AppForge\*\* workflow/i,
  /the \*\*AppForge\*\* workflow starter/i,
  /\bAppForge workflow starter\b/i,
  /— AppForge\b/,
  /\bAppForge agents\b/i,
  /\bin AppForge\b/i,
  /Managed phases.*\bAppForge\b/i,
  /\bAppForge\b.*\bnpx\b/i,
];

/**
 * @param {string} content
 */
export function hasActionableLegacyAppForgeRef(content) {
  return ACTIONABLE_LEGACY_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Replace AppForge workflow naming with FreshForge in controlled content.
 * Preserves historical phrases like "older AppForge or FreshForge".
 * @param {string} content
 */
export function renameWorkflowRefs(content) {
  let result = content;
  result = result.replace(/docs\/appforge-development/g, 'docs/freshforge-development');
  result = result.replace(/github:roasted-garlic\/appforge/gi, 'github:roasted-garlic/freshforge');
  result = result.replace(/\bnpx appforge\b/gi, 'npx freshforge');
  result = result.replace(/bin\/appforge\.mjs/g, 'bin/freshforge.mjs');
  result = result.replace(/AppForge Entry Point/g, 'FreshForge Entry Point');
  result = result.replace(/uses the \*\*AppForge\*\* workflow starter/gi, 'uses the **FreshForge** workflow starter');
  result = result.replace(/the \*\*AppForge\*\* workflow starter/gi, 'the **FreshForge** workflow starter');
  result = result.replace(/\bAppForge workflow starter\b/gi, 'FreshForge workflow starter');
  result = result.replace(/— AppForge\b/g, '— FreshForge');
  result = result.replace(/\bAppForge agents\b/gi, 'FreshForge agents');
  result = result.replace(/\bin AppForge\b/gi, 'in FreshForge');
  result = result.replace(/Managed phases follow Plan → Review → Implement → Test → Signoff in AppForge\./g,
    'Managed phases follow Plan → Review → Implement → Test → Signoff in FreshForge.');
  result = result.replace(/Run `npx github:roasted-garlic\/appforge install`/g,
    'Run `npx github:roasted-garlic/freshforge install`');
  result = result.replace(/Install with: `npx github:roasted-garlic\/appforge install`/g,
    'Install with: `npx github:roasted-garlic/freshforge install`');
  result = result.replace(/# AI Rules — AppForge/g, '# AI Rules — FreshForge');
  result = result.replace(/# Workflows — AppForge/g, '# Workflows — FreshForge');
  result = result.replace(/# AppForge workflow rules/g, '# FreshForge workflow rules');
  result = result.replace(/Use AppForge managed phase/g, 'Use FreshForge managed phase');
  return result;
}

/**
 * @typedef {Object} PlannedAction
 * @property {'write' | 'move' | 'delete' | 'sync'} type
 * @property {string} targetRel
 * @property {string} [sourceRel]
 * @property {string} [content]
 * @property {string} [reason]
 */

/**
 * @param {string} targetRoot
 * @param {string} relPosix
 */
async function walkControlledFiles(targetRoot, relPosix, results) {
  const full = path.join(targetRoot, relPosix);
  try {
    const info = await stat(full);
    if (info.isDirectory()) {
      const entries = await readdir(full);
      for (const entry of entries) {
        await walkControlledFiles(targetRoot, path.posix.join(relPosix, entry), results);
      }
      return;
    }
    if (isControlledWorkflowFile(relPosix)) {
      results.push(relPosix);
    }
  } catch {
    // missing
  }
}

/**
 * @param {string} targetRoot
 */
export async function listControlledFilesInTarget(targetRoot) {
  /** @type {string[]} */
  const files = [];
  const roots = ['AGENTS.md', '.cursor', 'docs/AI_RULES.md', 'docs/WORKFLOWS.md', 'docs/workflow'];
  for (const root of roots) {
    await walkControlledFiles(targetRoot, root, files);
  }
  return [...new Set(files.map(normalizeRel))].sort();
}

/**
 * @typedef {Object} MigrationDef
 * @property {string} id
 * @property {string} description
 * @property {string[]} from
 * @property {string} to
 * @property {(ctx: MigrationContext) => Promise<PlannedAction[]>} plan
 */

/**
 * @typedef {Object} MigrationContext
 * @property {string} sourceRoot
 * @property {string} targetRoot
 * @property {string} packageVersion
 * @property {import('./freshforge-version.mjs').InstallState} installState
 * @property {boolean} forceWorkflow
 * @property {string | null} fromFilter
 */

/**
 * @param {MigrationContext} ctx
 * @returns {Promise<PlannedAction[]>}
 */
async function planLegacyAppforgeToFreshforge(ctx) {
  /** @type {PlannedAction[]} */
  const actions = [];

  // Doc path moves (preserve content)
  for (const { from, to } of DOC_PATH_MOVES) {
    const fromPath = path.join(ctx.targetRoot, from);
    const toPath = path.join(ctx.targetRoot, to);
    try {
      await stat(fromPath);
    } catch {
      continue;
    }

    const fromHasContent = await hasMeaningfulContent(fromPath);
    let destExists = false;
    let destHasContent = false;
    try {
      await stat(toPath);
      destExists = true;
      destHasContent = await hasMeaningfulContent(toPath);
    } catch {
      // dest missing
    }

    if (destExists && destHasContent && fromHasContent) {
      actions.push({
        type: 'write',
        targetRel: from,
        reason: `CONFLICT: both ${from} and ${to} have content — manual merge required`,
      });
      continue;
    }

    if (fromHasContent || !destExists) {
      actions.push({
        type: 'move',
        sourceRel: from,
        targetRel: to,
        reason: `move legacy doc path ${from} → ${to}`,
      });
    } else {
      actions.push({
        type: 'delete',
        targetRel: from,
        reason: `remove empty legacy path ${from} (dest exists)`,
      });
    }
  }

  // Old workflow dirs → docs/workflow/
  const workflowDirMoves = [
    { from: 'docs/plans', to: 'docs/workflow/plans' },
    { from: 'docs/reviews', to: 'docs/workflow/reviews' },
    { from: 'docs/setup', to: 'docs/workflow/setup' },
  ];

  for (const { from, to } of workflowDirMoves) {
    const fromPath = path.join(ctx.targetRoot, from);
    try {
      const entries = await readdir(fromPath);
      if (entries.length === 0) continue;
      for (const entry of entries) {
        if (entry === 'README.md' || entry === '.gitkeep') continue;
        actions.push({
          type: 'move',
          sourceRel: `${from}/${entry}`,
          targetRel: `${to}/${entry}`,
          reason: `move workflow artifact ${from}/${entry} → ${to}/${entry}`,
        });
      }
    } catch {
      // missing
    }
  }

  // Rename AppForge refs in existing controlled files
  const controlledInTarget = await listControlledFilesInTarget(ctx.targetRoot);
  for (const rel of controlledInTarget) {
    const full = path.join(ctx.targetRoot, rel);
    try {
      const content = await readFile(full, 'utf8');
      const renamed = renameWorkflowRefs(content);
      if (renamed !== content) {
        actions.push({
          type: 'write',
          targetRel: rel,
          content: renamed,
          reason: 'rename AppForge workflow references',
        });
      }
    } catch {
      // skip
    }
  }

  // Sync current controlled workflow files from package source
  const starterItems = await collectStarterFiles(ctx.sourceRoot, {
    includeReadme: false,
    includeValidation: false,
  });

  for (const item of starterItems) {
    if (item.action !== 'copy') continue;
    if (!isControlledWorkflowFile(item.targetRel)) continue;
    if (item.sourceRel === STATE_TARGET_REL) continue;
    if (isProjectSpecificDoc(item.targetRel)) continue;

    const targetPath = path.join(ctx.targetRoot, item.targetRel);
    let shouldSync = ctx.forceWorkflow;
    try {
      await stat(targetPath);
      if (!ctx.forceWorkflow) {
        // Only sync if missing or has AppForge refs
        const existing = await readFile(targetPath, 'utf8');
        if (/\bAppForge\b/i.test(existing) || /\bappforge\b/.test(existing)) {
          if (hasActionableLegacyAppForgeRef(existing)) {
            shouldSync = true;
          }
        }
      }
    } catch {
      shouldSync = true;
    }

    if (shouldSync) {
      actions.push({
        type: 'sync',
        sourceRel: item.sourceRel,
        targetRel: item.targetRel,
        reason: ctx.forceWorkflow
          ? 'force sync controlled workflow file from current starter'
          : 'sync missing or AppForge-referenced controlled file',
      });
    }
  }

  // Always ensure clean state mapping
  actions.push({
    type: 'sync',
    sourceRel: STATE_TEMPLATE_REL,
    targetRel: STATE_TARGET_REL,
    reason: 'ensure clean idle workflow state from state-template.md',
  });

  // version.json
  const existingVersion = await readVersion(ctx.targetRoot);
  const previousName =
    ctx.installState.kind === 'appforge' || ctx.installState.hasLegacyAppForgeRefs
      ? 'AppForge'
      : existingVersion?.previousName ?? null;

  actions.push({
    type: 'write',
    targetRel: '.freshforge/version.json',
    reason: 'write or update installation metadata',
    content: JSON.stringify(
      createVersionJson(ctx.packageVersion, {
        previousName,
        installedAt: existingVersion?.installedAt ?? new Date().toISOString(),
        migrationHistory: [
          ...(existingVersion?.migrationHistory ?? []).filter((e) => e.id !== 'legacy-appforge-to-freshforge'),
          { id: 'legacy-appforge-to-freshforge', ranAt: new Date().toISOString() },
        ],
      }),
      null,
      2,
    ),
  });

  return actions;
}

/**
 * @param {MigrationContext} ctx
 * @returns {Promise<PlannedAction[]>}
 */
async function planAddClaudeMdBridge(ctx) {
  /** @type {PlannedAction[]} */
  const actions = [];

  if (ctx.installState.kind === 'none' && !ctx.installState.hasAgentsMd && !ctx.installState.hasCursor) {
    return actions;
  }

  const claudePath = path.join(ctx.targetRoot, 'CLAUDE.md');
  if ((await hasMeaningfulContent(claudePath)) && !ctx.forceWorkflow) {
    return actions;
  }

  actions.push({
    type: 'sync',
    sourceRel: 'CLAUDE.md',
    targetRel: 'CLAUDE.md',
    reason: 'add Claude Code bridge that imports AGENTS.md',
  });

  const existingVersion = await readVersion(ctx.targetRoot);
  const history = existingVersion?.migrationHistory ?? [];
  if (!history.some((e) => e.id === 'add-claude-md-bridge')) {
    actions.push({
      type: 'write',
      targetRel: '.freshforge/version.json',
      reason: 'record add-claude-md-bridge migration',
      content: JSON.stringify(
        createVersionJson(ctx.packageVersion, {
          previousName: existingVersion?.previousName ?? null,
          installedAt: existingVersion?.installedAt ?? new Date().toISOString(),
          migrationHistory: [
            ...history,
            { id: 'add-claude-md-bridge', ranAt: new Date().toISOString() },
          ],
        }),
        null,
        2,
      ),
    });
  }

  return actions;
}

/** Template-only assistant pack files safe to sync when missing. */
const ASSISTANT_TEMPLATE_RELS = [
  'docs/assistants/README.md',
  'docs/assistants/chatgpt/README.md',
  'docs/assistants/chatgpt/INSTRUCTIONS.md',
  'docs/assistants/chatgpt/PROJECT-OVERVIEW.md',
  'docs/assistants/chatgpt/ARCHITECTURE-AND-CODE.md',
  'docs/assistants/chatgpt/CURRENT-STATE.md',
  'docs/assistants/claude/README.md',
  'docs/assistants/claude/INSTRUCTIONS.md',
  'docs/assistants/claude/PROJECT-OVERVIEW.md',
  'docs/assistants/claude/ARCHITECTURE-AND-CODE.md',
  'docs/assistants/claude/CURRENT-STATE.md',
];

/**
 * Sync missing assistant handoff templates only — never overwrite filled packs.
 * @param {MigrationContext} ctx
 * @returns {Promise<PlannedAction[]>}
 */
async function planAddAssistantHandoffPacks(ctx) {
  /** @type {PlannedAction[]} */
  const actions = [];

  if (ctx.installState.kind === 'none' && !ctx.installState.hasAgentsMd && !ctx.installState.hasCursor) {
    return actions;
  }

  for (const rel of ASSISTANT_TEMPLATE_RELS) {
    const targetPath = path.join(ctx.targetRoot, rel);
    if ((await hasMeaningfulContent(targetPath)) && !ctx.forceWorkflow) {
      continue;
    }
    // Even with force-workflow, do not overwrite content docs that look project-filled
    // (more than placeholder-only). Force only applies to missing files or empty stubs.
    if (ctx.forceWorkflow && (await hasMeaningfulContent(targetPath))) {
      const content = await readFile(targetPath, 'utf8');
      const stillTemplate =
        content.includes('[PROJECT_NAME]') || content.includes('[TBD]') || content.includes('[ONE_LINE_SUMMARY]');
      if (!stillTemplate && /CURRENT-STATE|PROJECT-OVERVIEW|ARCHITECTURE-AND-CODE/.test(rel)) {
        continue;
      }
    }
    try {
      await stat(path.join(ctx.sourceRoot, rel));
    } catch {
      continue;
    }
    actions.push({
      type: 'sync',
      sourceRel: rel,
      targetRel: rel,
      reason: 'add missing assistant handoff template',
    });
  }

  if (actions.length === 0) return actions;

  const existingVersion = await readVersion(ctx.targetRoot);
  const history = existingVersion?.migrationHistory ?? [];
  if (!history.some((e) => e.id === 'add-assistant-handoff-packs')) {
    actions.push({
      type: 'write',
      targetRel: '.freshforge/version.json',
      reason: 'record add-assistant-handoff-packs migration',
      content: JSON.stringify(
        createVersionJson(ctx.packageVersion, {
          previousName: existingVersion?.previousName ?? null,
          installedAt: existingVersion?.installedAt ?? new Date().toISOString(),
          migrationHistory: [
            ...history,
            { id: 'add-assistant-handoff-packs', ranAt: new Date().toISOString() },
          ],
        }),
        null,
        2,
      ),
    });
  }

  return actions;
}

/** @type {MigrationDef[]} */
export const MIGRATIONS = [
  {
    id: 'legacy-appforge-to-freshforge',
    description: 'Rename AppForge workflow references and add FreshForge metadata.',
    from: ['appforge', 'unknown', 'partial', 'freshforge'],
    to: '0.2.0',
    plan: planLegacyAppforgeToFreshforge,
  },
  {
    id: 'add-claude-md-bridge',
    description: 'Add CLAUDE.md bridge for Claude Code multi-agent compatibility.',
    from: ['freshforge', 'partial', 'unknown'],
    to: '0.2.1',
    plan: planAddClaudeMdBridge,
  },
  {
    id: 'add-assistant-handoff-packs',
    description: 'Add docs/assistants ChatGPT and Claude handoff templates when missing.',
    from: ['freshforge', 'partial', 'unknown'],
    to: '0.2.2',
    plan: planAddAssistantHandoffPacks,
  },
];

/**
 * @param {MigrationContext} ctx
 * @param {MigrationDef} migration
 */
export function isMigrationApplicable(ctx, migration) {
  const completed = new Set((ctx.installState.version?.migrationHistory ?? []).map((e) => e.id));
  if (completed.has(migration.id)) {
    return false;
  }

  // Exact migration id filter (e.g. --from add-claude-md-bridge)
  if (
    ctx.fromFilter &&
    ctx.fromFilter !== 'appforge' &&
    ctx.fromFilter !== 'unknown' &&
    ctx.fromFilter !== 'partial' &&
    ctx.fromFilter !== 'freshforge' &&
    ctx.fromFilter !== migration.id
  ) {
    return false;
  }

  // --from appforge means "include legacy AppForge migration" — still run later upgrades too
  if (ctx.fromFilter === 'appforge' || ctx.fromFilter === 'unknown' || ctx.fromFilter === 'partial') {
    // allow all registered migrations that apply to this install kind
  }

  if (ctx.installState.kind === 'none' && !ctx.installState.hasAgentsMd && !ctx.installState.hasCursor) {
    return false;
  }

  // For freshforge installs, only run legacy if signals present (or --from appforge / force)
  if (migration.id === 'legacy-appforge-to-freshforge') {
    if (ctx.fromFilter === 'appforge') return true;
    if (ctx.installState.kind === 'appforge' || ctx.installState.kind === 'partial' || ctx.installState.kind === 'unknown') {
      return true;
    }
    if (ctx.installState.kind === 'freshforge') {
      return (
        ctx.installState.hasLegacyAppForgeRefs ||
        ctx.installState.legacyDocPaths.length > 0 ||
        ctx.forceWorkflow
      );
    }
    return false;
  }

  if (migration.id === 'add-claude-md-bridge' || migration.id === 'add-assistant-handoff-packs') {
    return true;
  }

  return false;
}

/**
 * @param {MigrationContext} ctx
 * @returns {Promise<{ migrations: MigrationDef[]; actions: PlannedAction[]; conflicts: PlannedAction[] }>}
 */
export async function buildMigrationPlan(ctx) {
  /** @type {PlannedAction[]} */
  const allActions = [];
  /** @type {PlannedAction[]} */
  const conflicts = [];
  /** @type {MigrationDef[]} */
  const applicable = [];

  for (const migration of MIGRATIONS) {
    if (!isMigrationApplicable(ctx, migration)) continue;
    const actions = await migration.plan(ctx);
    if (actions.length === 0) continue;
    applicable.push(migration);
    for (const action of actions) {
      if (action.reason?.startsWith('CONFLICT:')) {
        conflicts.push(action);
      } else if (!isNeverTouch(action.targetRel)) {
        allActions.push(action);
      }
    }
  }

  const merged = dedupeActions(allActions);
  return {
    migrations: applicable,
    actions: mergeVersionJsonActions(merged, ctx, applicable),
    conflicts,
  };
}

/**
 * Multiple migrations may each write version.json — keep one merged history.
 * @param {PlannedAction[]} actions
 * @param {MigrationContext} ctx
 * @param {MigrationDef[]} applicable
 */
function mergeVersionJsonActions(actions, ctx, applicable) {
  const versionWrites = actions.filter((a) => a.type === 'write' && a.targetRel === '.freshforge/version.json');
  const others = actions.filter((a) => !(a.type === 'write' && a.targetRel === '.freshforge/version.json'));
  if (versionWrites.length === 0) return actions;

  const existing = ctx.installState.version;
  /** @type {Map<string, string>} */
  const historyMap = new Map();
  for (const entry of existing?.migrationHistory ?? []) {
    historyMap.set(entry.id, entry.ranAt);
  }
  const now = new Date().toISOString();
  for (const migration of applicable) {
    historyMap.set(migration.id, now);
  }

  const previousName =
    ctx.installState.kind === 'appforge' ||
    ctx.installState.hasLegacyAppForgeRefs ||
    ctx.fromFilter === 'appforge'
      ? 'AppForge'
      : existing?.previousName ?? null;

  const content = JSON.stringify(
    createVersionJson(ctx.packageVersion, {
      previousName,
      installedAt: existing?.installedAt ?? now,
      migrationHistory: [...historyMap.entries()].map(([id, ranAt]) => ({ id, ranAt })),
    }),
    null,
    2,
  );

  others.push({
    type: 'write',
    targetRel: '.freshforge/version.json',
    reason: `record migrations: ${applicable.map((m) => m.id).join(', ')}`,
    content,
  });
  return others;
}

/**
 * @param {PlannedAction[]} actions
 */
function dedupeActions(actions) {
  /** @type {Map<string, PlannedAction>} */
  const map = new Map();
  for (const action of actions) {
    const key = `${action.type}:${action.targetRel}:${action.sourceRel ?? ''}`;
    map.set(key, action);
  }
  return [...map.values()];
}

/**
 * @param {string} targetRoot
 * @param {PlannedAction[]} actions
 * @param {string} backupDir
 * @param {boolean} dryRun
 */
export async function createBackup(targetRoot, actions, backupDir, dryRun) {
  const backupRoot = path.join(targetRoot, backupDir);
  if (dryRun) {
    console.log(`[backup] would create ${backupRoot}`);
    return backupRoot;
  }

  await mkdir(backupRoot, { recursive: true });

  for (const action of actions) {
    if (action.type === 'write' && action.targetRel === '.freshforge/version.json') {
      const src = path.join(targetRoot, action.targetRel);
      try {
        await stat(src);
        const dest = path.join(backupRoot, action.targetRel);
        await mkdir(path.dirname(dest), { recursive: true });
        await copyFile(src, dest);
      } catch {
        // new file
      }
      continue;
    }

    const rels = [];
    if (action.type === 'move' || action.type === 'write' || action.type === 'sync') {
      if (action.targetRel) rels.push(action.targetRel);
    }
    if (action.type === 'move' && action.sourceRel) rels.push(action.sourceRel);

    for (const rel of rels) {
      const src = path.join(targetRoot, rel);
      try {
        const info = await stat(src);
        const dest = path.join(backupRoot, rel);
        await mkdir(path.dirname(dest), { recursive: true });
        if (info.isFile()) {
          await copyFile(src, dest);
        }
      } catch {
        // file does not exist yet
      }
    }
  }

  return backupRoot;
}

/**
 * @param {string} sourceRoot
 * @param {string} targetRoot
 * @param {PlannedAction[]} actions
 * @param {boolean} dryRun
 */
export async function applyMigrationActions(sourceRoot, targetRoot, actions, dryRun) {
  for (const action of actions) {
    const targetPath = path.join(targetRoot, action.targetRel);

    switch (action.type) {
      case 'write': {
        if (dryRun) {
          console.log(`  [write] ${action.targetRel}${action.reason ? ` — ${action.reason}` : ''}`);
          break;
        }
        await mkdir(path.dirname(targetPath), { recursive: true });
        if (action.content !== undefined) {
          await writeFile(targetPath, action.content.endsWith('\n') ? action.content : `${action.content}\n`, 'utf8');
        }
        break;
      }
      case 'move': {
        const sourcePath = path.join(targetRoot, action.sourceRel ?? action.targetRel);
        if (dryRun) {
          console.log(`  [move] ${action.sourceRel} → ${action.targetRel}`);
          break;
        }
        await mkdir(path.dirname(targetPath), { recursive: true });
        await rename(sourcePath, targetPath);
        break;
      }
      case 'delete': {
        if (dryRun) {
          console.log(`  [delete] ${action.targetRel}`);
          break;
        }
        await rm(targetPath, { force: true });
        break;
      }
      case 'sync': {
        const srcRel = action.sourceRel ?? action.targetRel;
        const sourcePath = path.join(sourceRoot, srcRel);
        if (dryRun) {
          console.log(`  [sync] ${srcRel} → ${action.targetRel}${action.reason ? ` — ${action.reason}` : ''}`);
          break;
        }
        await mkdir(path.dirname(targetPath), { recursive: true });
        await copyFile(sourcePath, targetPath);
        break;
      }
      default:
        break;
    }
  }
}

/**
 * @param {string} sourceRoot
 * @param {import('./freshforge-version.mjs').InstallState} installState
 * @param {string} packageVersion
 * @param {{ previousName?: string | null }} [opts]
 */
export async function finalizeVersionAfterInstall(sourceRoot, installState, packageVersion, opts = {}) {
  const existing = installState.version;
  const data = createVersionJson(packageVersion, {
    previousName: opts.previousName ?? existing?.previousName ?? null,
    installedAt: existing?.installedAt ?? new Date().toISOString(),
    migrationHistory: existing?.migrationHistory ?? [],
  });
  return data;
}

/**
 * @param {string} sourceRoot
 */
export async function getMigrationPackageVersion(sourceRoot) {
  return getPackageVersion(sourceRoot);
}
