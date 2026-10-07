#!/usr/bin/env node
/*
 * Point — static site build
 * Inlines the app sources and assembles the deployable dist/ folder.
 *
 *   node build.js
 *
 * Inputs  (edit these):
 *   index.html   · app markup (references styles.css + app.js)
 *   styles.css   · app styles
 *   app.js       · app logic
 *   landing.html · marketing page (self-contained)
 *
 * Output  (generated — do not hand-edit):
 *   dist/index.html · landing page, the deploy entry point
 *   dist/app.html   · full platform app, self-contained
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const r = p => path.join(root, p);

// 1. Inline styles.css + app.js into the app markup -> self-contained app
let app = fs.readFileSync(r('index.html'), 'utf8');
const css = fs.readFileSync(r('styles.css'), 'utf8');
const js  = fs.readFileSync(r('app.js'), 'utf8');
app = app.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>');
app = app.replace('<script src="app.js"></script>', '<script>\n' + js + '\n</script>');

// 2. Inline institutional.js into institutional.html -> self-contained terminal
let inst = fs.readFileSync(r('institutional.html'), 'utf8');
const instJs = fs.readFileSync(r('institutional.js'), 'utf8');
inst = inst.replace('<script src="institutional.js"></script>', '<script>\n' + instJs + '\n</script>');

// 3. Load the self-contained landing page
const landing = fs.readFileSync(r('landing.html'), 'utf8');

// 4. Assemble dist/ with the landing page as index.html (default served file)
const dist = r('dist');
fs.mkdirSync(dist, { recursive: true });

// landing -> dist/index.html; its app links (point.html) become app.html
fs.writeFileSync(path.join(dist, 'index.html'), landing.replace(/point\.html/g, 'app.html'));

// agentic app -> dist/app.html; its back-links (landing.html) become index.html
fs.writeFileSync(path.join(dist, 'app.html'), app.replace(/landing\.html/g, 'index.html'));

// institutional terminal -> dist/terminal.html; back-links (landing.html) become index.html
fs.writeFileSync(path.join(dist, 'terminal.html'), inst.replace(/landing\.html/g, 'index.html'));

// 5. Report
const kb = f => (fs.statSync(path.join(dist, f)).size / 1024).toFixed(0) + 'KB';
console.log('Built dist/');
console.log('  index.html     (landing)      ' + kb('index.html'));
console.log('  app.html       (agentic app)  ' + kb('app.html'));
console.log('  terminal.html  (institutional)' + kb('terminal.html'));
