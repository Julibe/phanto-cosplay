'use strict';

const categories = ['All poses', 'Reactions', 'Costumes', 'Animals', 'Memes', 'Activities', 'Turnarounds'];
const shortcuts = {
  ':)': 'joy', ':-)': 'joy', ':d': 'joy', ':-d': 'joy', 'xd': 'laugh',
  ';)': 'wink', ';-)': 'wink', ':p': 'tongue', ':-p': 'tongue', ';p': 'wink tongue',
  ':(': 'sadness', ':-(': 'sadness', ":'(": 'cry', ":'-)": 'tears of joy',
  ':o': 'surprise', ':-o': 'surprise', 'o_o': 'surprise', 'd:': 'surprise',
  '<3': 'affection', ':-*': 'kiss', ':*': 'kiss', '>:(': 'anger', '>:c': 'anger',
  ':/': 'confusion', ':-/': 'confusion', ':|': 'neutral', '-_-': 'skepticism',
  'b)': 'sunglasses', 'b-)': 'sunglasses', 'zzz': 'sleepy', '^_^': 'joy',
  '😄': 'joy', '😂': 'tears of joy', '😍': 'heart eyes', '😭': 'cry',
  '😡': 'anger', '😱': 'surprise', '👻': 'phanto', spooky: 'horror'
};
const synonyms = {
  Joy: 'happy happiness excited joyful smile laugh cheerful',
  Affection: 'love heart cute adorable romantic',
  Sadness: 'sad unhappy crying tears upset',
  Anger: 'mad angry raging rage',
  Anxiety: 'afraid scared fear worried nervous',
  Calm: 'chill peaceful relaxed serene',
  Confusion: 'confused puzzled',
  Embarrassment: 'embarrassed blush shy',
  Playful: 'silly goofy wink tongue cheeky',
  Skepticism: 'skeptical unimpressed',
  Sleepy: 'sleep tired zzz',
  Surprise: 'surprised shock shocked amazed',
  Tension: 'tense stressed'
};
const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{Mark}/gu, '')
  .replace(/[^\p{Letter}\p{Number}]+/gu, ' ').trim();

const poses = window.phantoCatalog.map(pose => ({
  ...pose,
  path: 'poses/' + pose.id + '.webp',
  search: normalize(['Phanto', pose.id, pose.name, pose.category, pose.franchise, pose.tags,
    pose.emotion, synonyms[pose.emotion]].filter(Boolean).join(' '))
}));
const node = id => document.getElementById(id);
const search = node('search');
const suggestions = [...document.querySelectorAll('[data-query]')];
const filterToggle = node('filter-toggle');
const filters = node('filters');
const clearSearch = node('clear-search');
const grid = node('grid');
const shareDialog = node('share-dialog');
const editor = node('pose-editor');
const transforms = {
  left: new DOMMatrix([0, -1, 1, 0, 0, 0]),
  right: new DOMMatrix([0, 1, -1, 0, 0, 0]),
  horizontal: new DOMMatrix([-1, 0, 0, 1, 0, 0]),
  vertical: new DOMMatrix([1, 0, 0, -1, 0, 0])
};
let edit;
const pageSize = 30;
let category = categories[0];
let matches = [];
let shown = 0;
let toastTimer;

function notify(message) {
  clearTimeout(toastTimer);
  node('toast').textContent = message;
  node('toast').hidden = false;
  toastTimer = setTimeout(() => { node('toast').hidden = true; }, 3600);
}

async function encodeImage(image, type, matrix = new DOMMatrix()) {
  await image.decode();
  const { a, b, c, d } = matrix;
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = Math.abs(a) * width + Math.abs(c) * height;
  canvas.height = Math.abs(b) * width + Math.abs(d) * height;
  const context = canvas.getContext('2d');
  context.setTransform(a, b, c, d, canvas.width / 2, canvas.height / 2);
  context.drawImage(image, -width / 2, -height / 2);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob?.type === type) resolve(blob);
      else reject(new Error('Could not encode image'));
    }, type, .94);
  });
}

function poseImage(pose) {
  const image = new Image();
  image.src = pose.path;
  return image;
}

function celebrateCopy(origin) {
  if (!origin?.isConnected || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  origin.querySelector('.copy-burst')?.remove();
  const burst = document.createElement('span');
  burst.className = 'copy-burst';
  burst.setAttribute('aria-hidden', 'true');
  const colors = ['#ff85ad', '#88acff', '#d1afff', '#f3f9fe'];
  for (let index = 0; index < 14; index++) {
    const particle = document.createElement('span');
    const ribbon = index % 2 === 1;
    const angle = index * Math.PI * 2 / 14;
    const distance = 35 + index % 3 * 12;
    particle.className = 'copy-particle ' + (ribbon ? 'copy-ribbon' : 'copy-spark');
    particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
    particle.style.setProperty('--spin', (ribbon ? 170 : -65) + index * 24 + 'deg');
    particle.style.setProperty('--delay', index % 4 * 20 + 'ms');
    particle.style.color = colors[index % colors.length];
    if (!ribbon) particle.textContent = '✦';
    burst.append(particle);
  }
  origin.append(burst);
  setTimeout(() => burst.remove(), 780);
}

async function copyImage(pose, {
  origin,
  renderPng = () => encodeImage(poseImage(pose), 'image/png'),
  report = notify
} = {}) {
  if (!navigator.clipboard?.write || !window.ClipboardItem) {
    report('Image copy is unavailable here. Download the WebP instead.');
    return;
  }
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': renderPng() })]);
    report(pose.name + ' copied!');
    celebrateCopy(origin);
  } catch {
    report('Couldn’t copy the image. Try downloading it.');
  }
}

function openEditor(pose) {
  const image = poseImage(pose);
  image.alt = pose.name;
  edit = { pose, image, matrix: new DOMMatrix() };
  node('editor-name').textContent = pose.name;
  node('editor-status').textContent = '';
  node('editor-preview').replaceChildren(image);
  editor.showModal();
}

function reportEdit(current, message) {
  if (edit === current && editor.open) node('editor-status').textContent = message;
}

editor.querySelector('.editor-toolbar').addEventListener('click', event => {
  const button = event.target.closest('[data-transform]');
  if (!button) return;
  const transform = transforms[button.dataset.transform];
  edit.matrix = transform ? transform.multiply(edit.matrix) : new DOMMatrix();
  edit.image.style.transform = edit.matrix.toString();
  reportEdit(edit, transform ? button.getAttribute('aria-label') + ' applied.' : 'Orientation reset.');
});

node('close-editor').addEventListener('click', () => editor.close());
node('editor-copy').addEventListener('click', () => {
  const current = edit;
  const { image, matrix, pose } = current;
  copyImage(pose, {
    origin: node('editor-copy'),
    renderPng: () => encodeImage(image, 'image/png', matrix),
    report: message => reportEdit(current, message)
  });
});
node('editor-download').addEventListener('click', async () => {
  const current = edit;
  const { image, matrix, pose } = current;
  try {
    const blob = await encodeImage(image, 'image/webp', matrix);
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = pose.id + '-edited.webp';
    editor.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(href), 10000);
    reportEdit(current, 'WebP download started.');
  } catch {
    reportEdit(current, 'Couldn’t export a WebP in this browser.');
  }
});

function shareLink(pose) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('pose', pose.id);
  url.hash = '';
  return url.href;
}

function setShareIcon(control, label, iconClass) {
  const icon = document.createElement('i');
  icon.className = iconClass;
  icon.setAttribute('aria-hidden', 'true');
  control.setAttribute('aria-label', label);
  control.title = label;
  control.append(icon);
}

function openShare(pose) {
  const link = shareLink(pose);
  const url = encodeURIComponent(link);
  const title = encodeURIComponent(pose.name + ' · Phanto’s Closet');
  const image = encodeURIComponent(new URL(pose.path, location.href).href);
  const options = node('share-options');
  options.replaceChildren();
  node('share-name').textContent = pose.name;
  const status = node('share-status');
  status.textContent = '';
  const button = (label, icon, action) => {
    const control = document.createElement('button');
    control.type = 'button';
    setShareIcon(control, label, icon);
    control.addEventListener('click', action);
    options.append(control);
    return control;
  };
  if (navigator.share && navigator.canShare) {
    const native = button('Share WebP file', 'fa-solid fa-share-nodes', async () => {
      try {
        await navigator.share({ files: [file], title: pose.name });
      } catch (error) {
        if (error.name !== 'AbortError') status.textContent = 'File sharing failed. Try downloading the WebP.';
      }
    });
    let file;
    native.disabled = true;
    fetch(pose.path).then(response => {
      if (!response.ok) throw new Error('Image unavailable');
      return response.blob();
    }).then(blob => {
      if (!native.isConnected) return;
      file = new File([blob], pose.id + '.webp', { type: 'image/webp' });
      if (navigator.canShare({ files: [file] })) native.disabled = false;
      else native.remove();
    }).catch(() => native.remove());
  }
  if (navigator.clipboard?.writeText) button('Copy link', 'fa-solid fa-link', async () => {
    try {
      await navigator.clipboard.writeText(link);
      status.textContent = 'Pose link copied!';
    } catch {
      status.textContent = 'Couldn’t copy the pose link.';
    }
  });
  const links = [
    ['WhatsApp', 'fa-brands fa-whatsapp', 'https://wa.me/?text=' + title + '%20' + url],
    ['Facebook', 'fa-brands fa-facebook-f', 'https://www.facebook.com/sharer/sharer.php?u=' + url],
    ['X', 'fa-brands fa-x-twitter', 'https://twitter.com/intent/tweet?text=' + title + '&url=' + url],
    ['Telegram', 'fa-brands fa-telegram', 'https://t.me/share/url?url=' + url + '&text=' + title],
    ['Pinterest', 'fa-brands fa-pinterest-p', 'https://pinterest.com/pin/create/button/?url=' + url + '&media=' + image + '&description=' + title],
    ['LinkedIn', 'fa-brands fa-linkedin-in', 'https://www.linkedin.com/sharing/share-offsite/?url=' + url],
    ['Reddit', 'fa-brands fa-reddit-alien', 'https://www.reddit.com/submit?url=' + url + '&title=' + title],
    ['Email', 'fa-solid fa-envelope', 'mailto:?subject=' + title + '&body=' + url]
  ];
  for (const [label, icon, href] of links) {
    const anchor = document.createElement('a');
    setShareIcon(anchor, label, icon);
    anchor.href = href;
    if (label !== 'Email') {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    options.append(anchor);
  }
  shareDialog.showModal();
}

function showMore() {
  for (const pose of matches.slice(shown, shown + pageSize)) {
    const card = node('card').content.cloneNode(true);
    const picture = card.querySelector('.picture');
    const image = picture.querySelector('img');
    image.src = pose.path;
    image.draggable = false;
    picture.setAttribute('aria-label', 'Copy ' + pose.name + ' image');
    picture.title = 'Copy image';
    picture.addEventListener('click', () => copyImage(pose, { origin: picture }));
    card.querySelector('h3').textContent = pose.name;
    card.querySelector('p').textContent = pose.franchise || pose.emotion || pose.category;
    const download = card.querySelector('a');
    download.href = pose.path;
    download.download = pose.id + '.webp';
    download.setAttribute('aria-label', 'Download ' + pose.name + ' as WebP');
    const editButton = card.querySelector('.edit-pose');
    editButton.setAttribute('aria-label', 'Edit ' + pose.name);
    editButton.addEventListener('click', () => openEditor(pose));
    const share = card.querySelector('.actions button:not(.edit-pose)');
    share.setAttribute('aria-label', 'Share ' + pose.name);
    share.addEventListener('click', () => openShare(pose));
    grid.append(card);
  }
  shown = grid.children.length;
  node('more').hidden = shown >= matches.length;
}

let linkedPose = new URL(location.href).searchParams.get('pose');
if (!poses.some(pose => pose.id === linkedPose)) linkedPose = null;

function render() {
  const raw = search.value.trim().toLowerCase();
  const filtered = category !== categories[0] || Boolean(node('emotion').value || node('franchise').value);
  clearSearch.hidden = !search.value;
  filterToggle.toggleAttribute('data-filtered', filtered);
  filterToggle.setAttribute('aria-label', filtered ? 'Filters, active' : 'Filters');
  for (const button of suggestions) {
    button.setAttribute('aria-pressed', String(button.dataset.query === raw));
  }
  const query = shortcuts[raw] ?? raw;
  const words = normalize(query).split(' ').filter(Boolean);
  matches = poses.filter(pose => {
    if (linkedPose) return pose.id === linkedPose;
    return (category === categories[0] || pose.category === category)
      && (!node('emotion').value || pose.emotion === node('emotion').value)
      && (!node('franchise').value || pose.franchise === node('franchise').value)
      && (!raw || (words.length && words.every(word => pose.search.includes(word))));
  });
  for (const button of node('categories').children) {
    button.setAttribute('aria-pressed', String(!linkedPose && button.textContent === category));
  }
  node('heading').textContent = linkedPose ? 'Shared pose' : category;
  node('count').textContent = matches.length.toLocaleString() + (matches.length === 1 ? ' pose' : ' poses');
  node('empty').hidden = matches.length > 0;
  grid.replaceChildren();
  shown = 0;
  showMore();
}

function clearLinkedPose() {
  if (!linkedPose) return;
  linkedPose = null;
  const url = new URL(location.href);
  url.searchParams.delete('pose');
  history.replaceState(null, '', url);
}

for (const label of categories) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => {
    clearLinkedPose();
    category = label;
    if (label !== 'Reactions') node('emotion').value = '';
    if (label !== 'Costumes') node('franchise').value = '';
    render();
  });
  node('categories').append(button);
}
for (const [id, key] of [['franchise', 'franchise'], ['emotion', 'emotion']]) {
  const select = node(id);
  const values = [...new Set(poses.map(pose => pose[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  for (const value of values) select.add(new Option(value, value));
  select.addEventListener('change', () => {
    clearLinkedPose();
    if (select.value) {
      category = id === 'emotion' ? 'Reactions' : 'Costumes';
      node(id === 'emotion' ? 'franchise' : 'emotion').value = '';
    }
    render();
  });
}
search.addEventListener('input', () => { clearLinkedPose(); render(); });
clearSearch.addEventListener('click', () => {
  search.value = '';
  search.focus({ preventScroll: true });
  render();
});
for (const button of suggestions) {
  button.addEventListener('click', () => {
    clearLinkedPose();
    category = categories[0];
    node('emotion').value = node('franchise').value = '';
    search.value = search.value.trim().toLowerCase() === button.dataset.query ? '' : button.dataset.query;
    render();
  });
}

function setFiltersOpen(open) {
  filters.hidden = !open;
  filterToggle.setAttribute('aria-expanded', String(open));
}

filterToggle.addEventListener('click', () => {
  const open = filters.hidden;
  setFiltersOpen(open);
  if (open) filters.querySelector('[aria-pressed="true"], .categories button').focus({ preventScroll: true });
});
document.addEventListener('pointerdown', event => {
  if (!filters.hidden && !filters.contains(event.target) && !filterToggle.contains(event.target)) {
    setFiltersOpen(false);
  }
});
node('more').addEventListener('click', () => {
  const firstNewIndex = shown;
  showMore();
  grid.children[firstNewIndex]?.querySelector('.picture').focus({ preventScroll: true });
});
node('reset').addEventListener('click', () => {
  clearLinkedPose();
  category = categories[0];
  search.value = node('emotion').value = node('franchise').value = '';
  render();
  search.focus({ preventScroll: true });
});
node('close-share').addEventListener('click', () => shareDialog.close());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !filters.hidden && !shareDialog.open && !editor.open) {
    setFiltersOpen(false);
    filterToggle.focus({ preventScroll: true });
    return;
  }
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey
    && !shareDialog.open && !editor.open && !event.target.closest('input, select, textarea, [contenteditable]')) {
    event.preventDefault();
    search.focus({ preventScroll: true });
  }
});
render();
