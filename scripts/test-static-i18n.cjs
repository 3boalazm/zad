// Run: node --test scripts/test-static-i18n.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');

test('static build publishes every i18n script referenced by HTML pages', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'zad-static-'));
  try {
    fs.cpSync(path.join(root, 'i18n'), path.join(temp, 'i18n'), { recursive: true });
    const pages = fs.readdirSync(root).filter(name => /\.html$/i.test(name));
    for (const page of pages) fs.copyFileSync(path.join(root, page), path.join(temp, page));
    execFileSync(process.execPath, [path.join(root, 'build-static.mjs')], { cwd: temp });

    const scripts = new Set();
    for (const page of pages) {
      const html = fs.readFileSync(path.join(temp, page), 'utf8');
      for (const match of html.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?(i18n\/[^"']+\.js)["']/gi)) {
        scripts.add(match[1]);
      }
    }
    assert.ok(scripts.has('i18n/content.js'));
    assert.ok(scripts.has('i18n/content-pages.js'));
    for (const script of scripts) {
      assert.deepEqual(fs.readFileSync(path.join(temp, 'public', script)), fs.readFileSync(path.join(root, script)), script);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
