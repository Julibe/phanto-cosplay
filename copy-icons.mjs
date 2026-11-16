import { copyFileSync, mkdirSync } from 'node:fs';

const assets = './node_modules/@fortawesome/fontawesome-free/';
mkdirSync('./dist/vendor', { recursive: true });
mkdirSync('./dist/webfonts', { recursive: true });
for (const name of ['fontawesome', 'solid', 'brands']) {
  copyFileSync(assets + 'css/' + name + '.min.css', './dist/vendor/' + name + '.css');
}
copyFileSync(assets + 'webfonts/fa-solid-900.woff2', './dist/webfonts/fa-solid-900.woff2');
copyFileSync(assets + 'webfonts/fa-brands-400.woff2', './dist/webfonts/fa-brands-400.woff2');
copyFileSync(assets + 'LICENSE.txt', './dist/vendor/Font-Awesome-LICENSE.txt');
