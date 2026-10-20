// Run: node --test scripts/test-mobile-navigation.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function classList() {
  const values = new Set();
  return {
    add: name => values.add(name),
    remove: name => values.delete(name),
    contains: name => values.has(name),
    toggle(name, force) {
      const shouldAdd = force === undefined ? !values.has(name) : Boolean(force);
      if (shouldAdd) values.add(name);
      else values.delete(name);
      return shouldAdd;
    },
  };
}

function runSidebarInit(source, file) {
  const hamburger = {
    attributes: {},
    classList: classList(),
    type: '',
    onclick: null,
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    hasAttribute(name) { return Object.hasOwn(this.attributes, name); },
  };
  const sidebar = { id: '', classList: classList() };
  const overlay = { classList: classList(), onclick: null };
  const listeners = {};
  const document = {
    querySelectorAll(selector) { return selector === '.hamburger' ? [hamburger] : []; },
    querySelector(selector) {
      if (selector === '.sidebar') return sidebar;
      if (selector === '.sidebar-overlay') return overlay;
      return null;
    },
    addEventListener(type, callback) { listeners[type] = callback; },
  };

  const start = source.indexOf('function initSidebar()');
  const end = source.indexOf('let toastTimer;', start);
  assert.notEqual(start, -1, `${file}: initSidebar exists`);
  assert.notEqual(end, -1, `${file}: initSidebar boundary exists`);
  const definition = source.slice(start, end);
  vm.runInNewContext(`${definition}\ninitSidebar();`, { document });

  assert.equal(sidebar.id, 'main-sidebar');
  assert.equal(hamburger.type, 'button');
  assert.equal(hamburger.getAttribute('aria-controls'), 'main-sidebar');
  assert.equal(hamburger.getAttribute('aria-expanded'), 'false');

  hamburger.onclick();
  assert.equal(sidebar.classList.contains('open'), true);
  assert.equal(overlay.classList.contains('active'), true);
  assert.equal(hamburger.getAttribute('aria-expanded'), 'true');

  overlay.onclick();
  assert.equal(sidebar.classList.contains('open'), false);
  assert.equal(overlay.classList.contains('active'), false);
  assert.equal(hamburger.getAttribute('aria-expanded'), 'false');

  hamburger.onclick();
  listeners.keydown({ key: 'Escape' });
  assert.equal(sidebar.classList.contains('open'), false);
  assert.equal(hamburger.getAttribute('aria-expanded'), 'false');
}

for (const file of ['js/app.js', 'js/app.min.js']) {
  test(`${file}: hamburger reliably opens and closes the sidebar`, () => {
    runSidebarInit(read(file), file);
  });
}

test('mobile header stays pinned at the top and is not hidden when the drawer opens', () => {
  const styles = [read('css/style.css'), read('css/style.min.css')];
  const menus = [read('menu.js'), read('menu.min.js')];
  for (const css of styles) {
    assert.match(css, /position:fixed\s*!important/);
    assert.match(css, /top:calc\(6px\s*\+\s*env\(safe-area-inset-top,\s*0px\)\)\s*!important/);
    assert.match(css, /\.topbar\s+\.hamburger\{display:flex\s*!important/);
  }
  for (const menu of menus) {
    assert.match(menu, /top:calc\(6px \+ env\(safe-area-inset-top, 0px\)\) !important/);
    assert.doesNotMatch(menu, /body:has\(\.sidebar\.open\) \.main \.topbar/);
    assert.doesNotMatch(menu, /body\.zad-menu-open \.main \.topbar/);
    assert.match(menu, /\.main \.topbar \.hamburger\s*\{[\s\S]*?display:flex !important/);
  }
});

test('reduced-motion mode never pauses GSAP before hiding navigation elements', () => {
  const designSystems = [read('js/design-system.js'), read('js/design-system.min.js')];
  const animations = [read('animations.js'), read('animations.min.js')];
  for (const designSystem of designSystems) {
    assert.doesNotMatch(designSystem, /gsap\.globalTimeline\.pause\(\)/);
  }
  for (const source of animations) {
    assert.match(source, /reduceMotion/);
    assert.doesNotMatch(source, /globalTimeline\.pause/);
  }
  assert.match(animations[0], /if \(!reduceMotion\)\s*\{[\s\S]*?initPageEnter\(\)/);
});
