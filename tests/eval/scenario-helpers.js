import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const SKILLS_DIR = join(__dirname, '..', '..', 'skills');

export async function loadSkill(name) {
  return readFile(join(SKILLS_DIR, name, 'SKILL.md'), 'utf8');
}

export async function loadCommand(skill, cmd) {
  return readFile(join(SKILLS_DIR, skill, 'commands', `${cmd}.md`), 'utf8');
}

export async function loadSpec() {
  return readFile(join(__dirname, '..', '..', 'installer', 'src', 'specs', 'fw-dev-tools-spec.md'), 'utf8');
}

export async function loadSkillWithSpec(name) {
  const [spec, skill] = await Promise.all([loadSpec(), loadSkill(name)]);
  return `${spec}\n\n---\n\n${skill}`;
}

export async function loadRef(skill, ref) {
  return readFile(join(SKILLS_DIR, skill, `${ref}.md`), 'utf8');
}

export async function loadRule(skill, ruleName) {
  return readFile(join(SKILLS_DIR, skill, `${ruleName}.mdc`), 'utf8');
}

