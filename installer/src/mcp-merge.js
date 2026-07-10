import { readFile, writeFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';

/**
 * Safely merge mcpServers.fw-dev-mcp into an existing MCP JSON config file.
 * Never clobbers existing server entries. Always backs up before writing.
 *
 * @param {string} targetPath - Absolute path to the mcp.json to merge into
 * @param {object} serverEntry - The mcpServers.fw-dev-mcp object to merge in
 * @returns {Promise<{action: 'created'|'merged'|'unchanged', backupPath: string|null}>}
 */
export async function mergeMcpServer(targetPath, serverEntry) {
  let existing = { mcpServers: {} };
  let backupPath = null;

  if (existsSync(targetPath)) {
    const raw = await readFile(targetPath, 'utf8');
    try {
      existing = JSON.parse(raw);
      if (!existing.mcpServers || typeof existing.mcpServers !== 'object') {
        existing.mcpServers = {};
      }
    } catch {
      // Backup broken file and start fresh
      backupPath = `${targetPath}.bak.${Date.now()}`;
      await rename(targetPath, backupPath);
      existing = { mcpServers: {} };
    }
  }

  // Check if already identical — skip write if so
  const current = existing.mcpServers['fw-dev-mcp'];
  if (current && JSON.stringify(current) === JSON.stringify(serverEntry)) {
    return { action: 'unchanged', backupPath: null };
  }

  // Back up before writing
  if (existsSync(targetPath)) {
    backupPath = `${targetPath}.bak.${Date.now()}`;
    await rename(targetPath, backupPath);
  }

  existing.mcpServers['fw-dev-mcp'] = serverEntry;
  await writeFile(targetPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');

  return { action: current ? 'merged' : 'created', backupPath };
}

/**
 * Patch the Authorization bearer token in an already-merged mcp.json.
 * Only touches mcpServers.fw-dev-mcp.headers.Authorization.
 *
 * @param {string} targetPath - Absolute path to the mcp.json
 * @param {string} token - Raw token value (without "Bearer " prefix)
 */
export async function patchMcpToken(targetPath, token) {
  const raw = await readFile(targetPath, 'utf8');
  const config = JSON.parse(raw);
  config.mcpServers['fw-dev-mcp'].headers['Authorization'] = `Bearer ${token}`;
  await writeFile(targetPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

/**
 * Read the current Authorization token from mcp.json, if present.
 * Returns null if the file or key is absent.
 *
 * @param {string} targetPath
 * @returns {Promise<string|null>}
 */
export async function readMcpToken(targetPath) {
  if (!existsSync(targetPath)) return null;
  try {
    const raw = await readFile(targetPath, 'utf8');
    const config = JSON.parse(raw);
    const auth = config?.mcpServers?.['fw-dev-mcp']?.headers?.['Authorization'];
    if (!auth || auth === 'Bearer <your-api-token>') return null;
    return auth.replace(/^Bearer\s+/, '');
  } catch {
    return null;
  }
}

/**
 * Remove a server entry from an existing MCP JSON config file.
 * Preserves other server entries. Backs up before writing.
 *
 * @param {string} targetPath - Absolute path to the mcp.json
 * @param {string} [serverName='fw-dev-mcp'] - The mcpServers key to remove
 * @returns {Promise<{action: 'absent'|'unchanged'|'removed'|'skipped', backupPath: string|null}>}
 */
export async function removeMcpServer(targetPath, serverName = 'fw-dev-mcp') {
  if (!existsSync(targetPath)) {
    return { action: 'absent', backupPath: null };
  }

  const raw = await readFile(targetPath, 'utf8');
  let config;
  try {
    config = JSON.parse(raw);
  } catch {
    return { action: 'skipped', backupPath: null };
  }

  if (!config.mcpServers || typeof config.mcpServers !== 'object') {
    return { action: 'unchanged', backupPath: null };
  }

  if (!(serverName in config.mcpServers)) {
    return { action: 'unchanged', backupPath: null };
  }

  const backupPath = `${targetPath}.bak.${Date.now()}`;
  await rename(targetPath, backupPath);

  delete config.mcpServers[serverName];

  if (Object.keys(config.mcpServers).length > 0) {
    await writeFile(targetPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  }

  return { action: 'removed', backupPath };
}
