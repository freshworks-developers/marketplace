'use strict';

const fs = require('fs/promises');
const path = require('path');
const { createRuleResult, runCli } = require('./common');

const RULE_ID = 'FFS-05L';

const IGNORED_DIRECTORIES = new Set([
  '.cache',
  '.cursor',
  '.fdk',
  '.git',
  '.next',
  'build',
  'coverage',
  'dist',
  'node_modules'
]);

const ACCEPTED_IMAGE_EXTENSIONS = new Set(['.jpeg', '.jpg', '.png']);
const IMAGE_EXTENSIONS = new Set(['.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const MIN_COVER_ART_DIMENSION = 400;
const MIN_SCREENSHOT_DIMENSION = 850;
const MAX_COVER_ART_COUNT = 1;
const MAX_SCREENSHOT_COUNT = 5;
const MAX_MODULE_SCREENSHOT_COUNT = 2;
const S3_SAFE_FILE_NAME_PATTERN = /^[A-Za-z0-9!_.\-*'()]+$/;

// Walk the app root for image files so DevPortal upload constraints can be checked.
async function walkImageFiles(rootDir) {
  const files = [];

  async function visit(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name) && !entry.name.startsWith('.')) {
          await visit(fullPath);
        }
        continue;
      }

      if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }

  await visit(rootDir);
  return files;
}

function createDetail(file, message) {
  return { file, message };
}

function createResult(passed, summary, details = []) {
  return createRuleResult(RULE_ID, passed, summary, details);
}

function isPng(buffer) {
  return buffer.length >= 24 && buffer.toString('hex', 0, 8) === '89504e470d0a1a0a';
}

function getPngDimensions(buffer) {
  if (!isPng(buffer)) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function isJpeg(buffer) {
  return buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8;
}

function getJpegDimensions(buffer) {
  if (!isJpeg(buffer)) {
    return null;
  }

  let offset = 2;
  while (offset < buffer.length) {
    if (offset + 3 >= buffer.length) {
      return null;
    }

    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame && offset + 8 < buffer.length) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }

    offset += 2 + length;
  }

  return null;
}

async function getImageDimensions(filePath) {
  const buffer = await fs.readFile(filePath).catch(() => null);
  if (!buffer) {
    return null;
  }

  return getPngDimensions(buffer) || getJpegDimensions(buffer);
}

function getImageRole(relativePath) {
  const normalizedPath = relativePath.toLowerCase();
  const baseName = path.basename(normalizedPath);

  if (normalizedPath.includes('cover_arts/') || normalizedPath.includes('cover-art') || /cover[_-]?art/.test(baseName)) {
    return 'coverArt';
  }

  if (normalizedPath.includes('screenshot') || normalizedPath.includes('screenshots/')) {
    return normalizedPath.includes('module') ? 'moduleScreenshot' : 'screenshot';
  }

  return 'image';
}

function getModuleKey(relativePath) {
  const segments = relativePath.split('/');
  const moduleIndex = segments.findIndex((segment) => /^modules?$/i.test(segment));
  if (moduleIndex >= 0 && segments[moduleIndex + 1]) {
    return segments[moduleIndex + 1];
  }

  const screenshotIndex = segments.findIndex((segment) => /screenshots?/i.test(segment));
  if (screenshotIndex > 0) {
    return segments[screenshotIndex - 1];
  }

  return 'unknown-module';
}

async function run(targetDir) {
  const details = [];
  const imageFiles = await walkImageFiles(targetDir);
  const coverArtFiles = [];
  const screenshotFiles = [];
  const moduleScreenshots = new Map();

  for (const filePath of imageFiles) {
    const stats = await fs.stat(filePath).catch(() => null);
    if (!stats) {
      continue;
    }

    const relativePath = path.relative(targetDir, filePath).split(path.sep).join('/');
    const extension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    const role = getImageRole(relativePath);

    if (!ACCEPTED_IMAGE_EXTENSIONS.has(extension)) {
      details.push(
        createDetail(relativePath, `Image upload type must be .jpeg, .jpg, or .png, but found "${extension}".`)
      );
    }

    if (stats.size > MAX_IMAGE_SIZE_BYTES) {
      details.push(createDetail(relativePath, `Image upload size must be at most 2 MB, but found ${stats.size} bytes.`));
    }

    if (!S3_SAFE_FILE_NAME_PATTERN.test(fileName)) {
      details.push(createDetail(relativePath, `Image filename "${fileName}" is not S3-safe.`));
    }

    if (role === 'coverArt') {
      coverArtFiles.push(relativePath);
    } else if (role === 'moduleScreenshot') {
      const moduleKey = getModuleKey(relativePath);
      const current = moduleScreenshots.get(moduleKey) || [];
      current.push(relativePath);
      moduleScreenshots.set(moduleKey, current);
    } else if (role === 'screenshot') {
      screenshotFiles.push(relativePath);
    }

    if (!ACCEPTED_IMAGE_EXTENSIONS.has(extension)) {
      continue;
    }

    const dimensions = await getImageDimensions(filePath);
    if (!dimensions) {
      details.push(createDetail(relativePath, 'Image dimensions could not be read from the uploaded asset.'));
      continue;
    }

    if (role === 'coverArt') {
      if (dimensions.width < MIN_COVER_ART_DIMENSION || dimensions.height < MIN_COVER_ART_DIMENSION) {
        details.push(
          createDetail(
            relativePath,
            `App icon cover art must be at least 400x400, but found ${dimensions.width}x${dimensions.height}.`
          )
        );
      }

      if (dimensions.width !== dimensions.height) {
        details.push(
          createDetail(
            relativePath,
            `App icon cover art must use a 1:1 square aspect ratio, but found ${dimensions.width}x${dimensions.height}.`
          )
        );
      }
    } else if (role === 'screenshot' || role === 'moduleScreenshot') {
      if (dimensions.width < MIN_SCREENSHOT_DIMENSION || dimensions.height < MIN_SCREENSHOT_DIMENSION) {
        details.push(
          createDetail(
            relativePath,
            `Screenshots must be at least 850x850, but found ${dimensions.width}x${dimensions.height}.`
          )
        );
      }
    }
  }

  if (coverArtFiles.length > MAX_COVER_ART_COUNT) {
    details.push(createDetail('cover_arts', `App icon cover art allows max 1 image, but found ${coverArtFiles.length}.`));
  }

  if (screenshotFiles.length > MAX_SCREENSHOT_COUNT) {
    details.push(createDetail('screenshots', `Screenshots allow max 5 images, but found ${screenshotFiles.length}.`));
  }

  for (const [moduleKey, files] of moduleScreenshots) {
    if (files.length > MAX_MODULE_SCREENSHOT_COUNT) {
      details.push(createDetail(`module screenshots: ${moduleKey}`, `Module screenshots allow max 2 images, but found ${files.length}.`));
    }
  }

  return details.length === 0
    ? createResult(true, 'Image uploads match DevPortal validation constraints.')
    : createResult(false, 'Some image uploads do not match DevPortal validation constraints.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
