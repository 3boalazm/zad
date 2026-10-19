// Run: node --test scripts/test-profile-entry.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

for (const file of ['js/app.js', 'js/app.min.js']) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  // Exercise the actual entry function from both the source and deployed bundle.
  const init = source.match(/function initProfileSystem\(\)[\s\S]*?window\.initProfileSystem\s*=\s*initProfileSystem;/)?.[0];
  assert.ok(init, `${file}: profile entry point exists`);

  function run(profile, pathname = '/') {
    const calls = [];
    const context = {
      window: { location: { pathname } },
      getProfile: () => profile,
      injectProfileCSS: () => calls.push('css'),
      injectProfileChip: () => calls.push('chip'),
      applyProfile: value => calls.push(['apply', value]),
      injectKidsShortcut: value => calls.push(['kids', value]),
      // Fail if entry attempts to create a modal or mark setup as completed.
      document: new Proxy({}, { get() { throw new Error('Unexpected DOM access'); } }),
      localStorage: new Proxy({}, { get() { throw new Error('Unexpected storage write'); } }),
    };
    vm.runInNewContext(`${init}\ninitProfileSystem();`, context);
    return calls;
  }

  test(`${file}: new visitors enter without welcome UI or setup writes`, () => {
    assert.deepEqual(run(null), []);
    assert.deepEqual(run(null, '/adhkar.html'), []);
  });

  test(`${file}: existing adult profile remains available`, () => {
    const profile = { name: 'أحمد', type: 'adult' };
    assert.deepEqual(run(profile, '/profile.html'), ['css', 'chip', ['apply', profile]]);
  });

  test(`${file}: saved child profile keeps its home shortcuts`, () => {
    const profile = { name: 'عمر', type: 'child' };
    for (const pathname of ['/', '/index.html']) {
      assert.deepEqual(run(profile, pathname), ['css', 'chip', ['apply', profile], ['kids', profile]]);
    }
  });
}
