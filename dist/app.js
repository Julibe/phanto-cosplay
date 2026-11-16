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
  '😡': 'anger', '😱': 'surprise', '👻': 'phanto'
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
const grid = node('grid');
const shareDialog = node('share-dialog');
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

async function asPng(path) {
  const image = new Image();
  image.src = path;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext('2d').drawImage(image, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not encode image')), 'image/png');
  });
}

async function copyImage(pose) {
  if (!navigator.clipboard?.write || !window.ClipboardItem) {
    notify('Image copy is unavailable here. You can download or share the WebP.');
    return;
  }
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': asPng(pose.path) })]);
    notify(pose.name + ' copied!');
  } catch {
    notify('Couldn’t copy the image. Try Download or Share.');
  }
}

function shareLink(pose) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('pose', pose.id);
  url.hash = '';
  return url.href;
}

function openShare(pose) {
  const link = shareLink(pose);
  const url = encodeURIComponent(link);
  const title = encodeURIComponent(pose.name + ' · Phanto’s Closet');
  const image = encodeURIComponent(new URL(pose.path, location.href).href);
  const options = node('share-options');
  options.replaceChildren();
  node('share-name').textContent = pose.name;
  const button = (label, action) => {
    const control = document.createElement('button');
    control.type = 'button';
    control.textContent = label;
    control.addEventListener('click', action);
    options.append(control);
    return control;
  };
  if (navigator.share && navigator.canShare) {
    const native = button('Share WebP file', async () => {
      try {
        await navigator.share({ files: [file], title: pose.name });
      } catch (error) {
        if (error.name !== 'AbortError') notify('File sharing failed. Try downloading the WebP.');
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
  if (navigator.clipboard?.writeText) button('Copy link', async () => {
    try {
      await navigator.clipboard.writeText(link);
      notify('Pose link copied!');
    } catch {
      notify('Couldn’t copy the pose link.');
    }
  });
  const links = {
    'WhatsApp': 'https://wa.me/?text=' + title + '%20' + url,
    'Facebook': 'https://www.facebook.com/sharer/sharer.php?u=' + url,
    'X': 'https://twitter.com/intent/tweet?text=' + title + '&url=' + url,
    'Telegram': 'https://t.me/share/url?url=' + url + '&text=' + title,
    'Pinterest': 'https://pinterest.com/pin/create/button/?url=' + url + '&media=' + image + '&description=' + title,
    'LinkedIn': 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
    'Reddit': 'https://www.reddit.com/submit?url=' + url + '&title=' + title,
    'Email': 'mailto:?subject=' + title + '&body=' + url
  };
  for (const [label, href] of Object.entries(links)) {
    const anchor = document.createElement('a');
    anchor.textContent = label;
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
    picture.addEventListener('click', () => copyImage(pose));
    card.querySelector('h3').textContent = pose.name;
    card.querySelector('p').textContent = pose.franchise || pose.emotion || pose.category;
    const download = card.querySelector('a');
    download.href = pose.path;
    download.download = pose.id + '.webp';
    download.setAttribute('aria-label', 'Download ' + pose.name + ' as WebP');
    const share = card.querySelector('.actions button');
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
node('more').addEventListener('click', () => {
  const firstNewIndex = shown;
  showMore();
  grid.children[firstNewIndex]?.querySelector('.picture').focus();
});
node('reset').addEventListener('click', () => {
  clearLinkedPose();
  category = categories[0];
  search.value = node('emotion').value = node('franchise').value = '';
  render();
  search.focus();
});
node('close-share').addEventListener('click', () => shareDialog.close());
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey
    && !shareDialog.open && !event.target.closest('input, select, textarea, [contenteditable]')) {
    event.preventDefault();
    search.focus();
  }
});
render();
