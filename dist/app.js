'use strict';

const categories = ['All poses', 'Reactions', 'Costumes', 'Animals', 'Holidays', 'Activities', 'Powers', 'Assets', 'Turnarounds'];
const collections = {
  turnarounds: pose => pose.category === 'Turnarounds',
  emoji: pose => pose.category === 'Reactions',
  games: pose => pose.franchiseType === 'Game',
  anime: pose => pose.franchiseType === 'Anime',
  screen: pose => pose.franchiseType === 'TV' || pose.franchiseType === 'Movie',
  holidays: pose => pose.category === 'Holidays' || pose.franchiseType === 'Festival',
  spooky: pose => /\b(?:horror|spooky|halloween|witch|vampire|dracula|skeleton|sheet ghost|jack o lantern)\b/.test(pose.text)
};
let collection = '';
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
  Anxiety: 'afraid scared fear worried worry nervous anxious uneasy apprehensive concerned panicked panicky distressed overwhelmed fretful',
  Calm: 'chill peaceful relaxed serene',
  Confusion: 'confused puzzled wondering wonder pondering thinking curious unsure uncertain bewildered questioning baffled perplexed',
  Embarrassment: 'embarrassed blush shy',
  Neutral: 'neutral expressionless blank straight faced poker face',
  Playful: 'silly goofy wink tongue cheeky mischievous',
  Skepticism: 'skeptical unimpressed doubtful suspicious unconvinced',
  Sleepy: 'sleep tired zzz',
  Surprise: 'surprised shock shocked amazed',
  Tension: 'tense stressed stress jittery pressured'
};
const poseKeywords = [
  [/\b(?:laugh\w*|tears of joy|giggl\w*)\b/, 'lol lmao haha laughing giggle cracking up funny hysterical risa carcajada'],
  [/\b(?:smil\w*|cheerful|beaming|delighted|cheering)\b/, 'grin grinning delighted upbeat sunny content sonrisa sonriendo feliz'],
  [/\b(?:cry\w*|bawl\w*|sob\w*|tearful|crying puddle)\b/, 'crying sobbing weeping tears heartbreak blue llorar llorando triste'],
  [/\b(?:kiss\w*|smooch\w*)\b/, 'blow a kiss smooch kisses xoxo beso besito'],
  [/\b(?:heart eyes|hearts|affectionate|holding rose)\b/, 'in love crush smitten adoring heart eyes valentines enamorado corazones'],
  [/\b(?:angry|annoyed|rage|swearing|frown)\b/, 'irritated grumpy frustrated mad annoyed fed up enojado molesto'],
  [/\b(?:confused|puzzled|scratching head|head scratch)\b/, 'huh what bewildered unsure puzzled thinking confused confundido'],
  [/\b(?:blush\w*|bashful|embarrass\w*)\b/, 'shy blush bashful flustered awkward embarrassed timido sonrojado'],
  [/\b(?:deadpan|blank|unimpressed|side eye|skeptic\w*)\b/, 'meh awkward deadpan unimpressed doubtful side eye not impressed suspicious'],
  [/\b(?:scared|fright\w*|terror|horror|spooky|halloween|witch|vampire|dracula|skeleton|sheet ghost|jack o lantern)\b/, 'spooky scary halloween creepy trick or treat horror miedo espeluznante'],
  [/\b(?:sleep\w*|asleep|yawn\w*|nap(?:s|ping|ped)?|blanket|nose bubble)\b/, 'tired exhausted sleepy dozing bedtime good night nap zzz dormir sueno buenas noches'],
  [/\b(?:surprise\w*|shock\w*|gasp\w*|startl\w*)\b/, 'omg wow startled shocked gasp jaw drop no way sorpresa sorprendido'],
  [/\b(?:meditat\w*|peaceful|relax\w*|zen|calm)\b/, 'breathe mindfulness zen chill peaceful relaxed tranquilo'],
  [/\b(?:doctor|sick|injur\w*|bandag\w*|thermometer|sneez\w*|cold medicine)\b/, 'ill sick unwell get well hurt ouch germ enfermo'],
  [/\b(?:birthday|party hat|blowing cake candles)\b/, 'happy birthday bday hbd cumple cumpleanos fiesta birthday party'],
  [/\b(?:christmas|santa|reindeer|poinsettia|carol\w*)\b/, 'xmas merry christmas holiday holidays navidad feliz navidad'],
  [/\b(?:sunglasses|shades|aviators)\b/, 'sunglasses shades cool glasses lentes gafas'],
  [/\b(?:food|eating|snack\w*|pizza|popcorn|ice cream|chef|cook\w*)\b/, 'food hungry eating snack yummy tasty comida hambre'],
  [/\b(?:paint\w*|draw\w*|sketch\w*|artist)\b/, 'art artist creative painting drawing arte dibujo'],
  [/\b(?:wizard|witch|sorcer\w*|magician)\b/, 'magic spellcasting magical fantasy magia'],
  [/\b(?:robot|droid|android|c 3po|r2 d2)\b/, 'robot droid android mechanical bot'],
  [/\b(?:reaction|reactions|emoji)\b/, 'reaction emoji expression emoticon sticker'],
  [/\b(?:cosplay|costumes)\b/, 'cosplay costume costumes dress up disguise outfit disfraz traje'],
  [/\b(?:teenage mutant ninja turtles|ninja turtles)\b/, 'tmnt ninja turtles tortugas ninja'],
  [/\b(?:the lord of the rings|lord of the rings)\b/, 'lotr middle earth el senor de los anillos'],
  [/\b(?:my hero academia)\b/, 'mha bnha boku no hero academia'],
  [/\b(?:demon slayer)\b/, 'kny kimetsu no yaiba'],
  [/\b(?:hunter x hunter)\b/, 'hxh hunter hunter'],
  [/\b(?:avatar the last airbender)\b/, 'atla last airbender'],
  [/\b(?:jujutsu kaisen)\b/, 'jjk'],
  [/\b(?:dragon ball)\b/, 'dbz dragonball dragon ball z'],
  [/\b(?:star wars)\b/, 'starwars sw guerra de las galaxias'],
  [/\b(?:super mario)\b/, 'mario bros nintendo'],
  [/\b(?:pokemon)\b/, 'pokémon pokemon pocket monsters'],
  [/\b(?:darth vader)\b/, 'anakin sith lord'],
  [/\b(?:grogu)\b/, 'baby yoda the child'],
  [/\b(?:bruce wayne|batman)\b/, 'dark knight bruce wayne batman'],
  [/\b(?:clark kent|superman)\b/, 'clark kent man of steel superman'],
  [/\b(?:peter parker|spider man|spiderman)\b/, 'spiderman spider man peter parker hombre arana']
];
const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{Mark}/gu, '')
  .replaceAll('×', 'x')
  .replace(/[^\p{Letter}\p{Number}]+/gu, ' ').trim();

const releaseDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
// Poses released within this many hours of the newest release get a "New" tag,
// so the tag moves to each new batch automatically when the catalog is regenerated.
const newWindowHours = 6;
const newestRelease = Math.max(0, ...window.phantoCatalog.map(pose => Date.parse(pose.released) || 0));
const newSince = newestRelease - newWindowHours * 3600e3;
const poses = window.phantoCatalog.map(pose => {
  const name = normalize(pose.name);
  const text = normalize(['Phanto', pose.id, pose.legacyId, pose.previousId, pose.name, pose.category, pose.franchise,
    pose.franchiseType, pose.tags, pose.emotion].filter(Boolean).join(' '));
  const aliases = poseKeywords.filter(([pattern]) => pattern.test(text)).map(([, words]) => words);
  const hasBerry = pose.id.startsWith('berry-');
  const hasPhanto = !hasBerry || pose.id.split('-').includes('phanto');
  const isNew = Boolean(newestRelease) && Date.parse(pose.released) >= newSince;
  const releasedAt = pose.released ? new Date(pose.released) : null;
  const releasedDay = releasedAt ? [releasedAt.getFullYear(), String(releasedAt.getMonth() + 1).padStart(2, '0'),
    String(releasedAt.getDate()).padStart(2, '0')].join('-') : '';
  return { ...pose, hasBerry, hasPhanto, isNew, releasedDay, nameSearch: name, text: isNew ? text + ' new latest' : text,
    keywordSearch: normalize([synonyms[pose.emotion], ...aliases].filter(Boolean).join(' ')) };
});

const emotionTerms = new Map();
for (const [emotion, words] of Object.entries(synonyms)) {
  emotionTerms.set(normalize(emotion), emotion);
  for (const word of words.split(' ')) {
    if (word.length > 2) emotionTerms.set(word, emotion);
  }
}
for (const [phrase, emotion] of [
  ['not sure', 'Confusion'], ['lost in thought', 'Confusion'], ['what if', 'Confusion'],
  ['on edge', 'Anxiety'], ['a little worried', 'Anxiety'], ['freaking out', 'Anxiety'],
  ['feeling blue', 'Sadness'], ['stressed out', 'Tension'], ['side eye', 'Skepticism'],
  ['poker face', 'Neutral'], ['mind blown', 'Surprise']
]) emotionTerms.set(phrase, emotion);

const searchFiller = new Set(['a', 'an', 'the', 'with', 'of', 'for', 'show', 'me', 'un', 'una', 'con', 'de']);
function searchScore(pose, phrase, words, emotion) {
  if (pose.nameSearch === phrase) return 100;
  if (emotion && pose.emotion === emotion) {
    return pose.nameSearch.startsWith(phrase) ? 55 : 40;
  }
  let score = pose.nameSearch.startsWith(phrase) ? 15 : 0;
  for (const word of words) {
    if ((' ' + pose.nameSearch + ' ').includes(' ' + word + ' ')) score += 8;
    else if ((' ' + pose.text + ' ').includes(' ' + word + ' ')) score += 5;
    else if ((' ' + pose.keywordSearch + ' ').includes(' ' + word + ' ')) score += 3;
    else if ((' ' + pose.text + ' ' + pose.keywordSearch).includes(' ' + word)) score += 2;
    else if (word.length >= 3 && (pose.text.includes(word) || pose.keywordSearch.includes(word))) score++;
    else return 0;
  }
  return score;
}
const node = id => document.getElementById(id);
const search = node('search');
const suggestions = [...document.querySelectorAll('[data-collection]')];
const filterToggle = node('filter-toggle');
const filters = node('filters');
const clearSearch = node('clear-search');
const shuffle = node('shuffle');
const portalButton = node('berry-portal');
const grid = node('grid');
const moreButton = node('more');
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
const imageReleaseTimers = new Map();
const imageWindow = typeof IntersectionObserver === 'function'
  ? new IntersectionObserver(entries => {
    for (const { target: image, isIntersecting } of entries) {
      clearTimeout(imageReleaseTimers.get(image));
      imageReleaseTimers.delete(image);
      if (!image.isConnected) continue;
      if (isIntersecting) {
        if (!image.hasAttribute('src')) image.src = image.dataset.src;
      } else if (image.hasAttribute('src')) {
        imageReleaseTimers.set(image, setTimeout(() => {
          image.removeAttribute('src');
          imageReleaseTimers.delete(image);
        }, 1800));
      }
    }
  }, { rootMargin: '400px 0px' })
  : null;
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
  const colors = ['#fff', '#ddd', '#bbb', '#eee'];
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

const viewParameters = {
  emotion: 'emotion',
  franchise: 'franchise',
  type: 'franchise-type'
};
let berryPortal = false;

function poseInPortal(pose) {
  return berryPortal ? pose.hasBerry : pose.hasPhanto;
}

function setPortal(active) {
  berryPortal = active;
  document.body.toggleAttribute('data-berry-portal', active);
  const destination = active ? 'Phanto' : 'Berry';
  const label = 'Switch to ' + destination + ' portal';
  portalButton.setAttribute('aria-label', label);
  portalButton.title = label;
  portalButton.querySelector('.portal-rest').src = active
    ? 'emoji/joy/emoji-joy-cheerful.webp'
    : 'berry/berry-stern-glare.webp';
  portalButton.querySelector('.portal-reaction').src = active
    ? 'emoji/playful/emoji-playful-cheeky-wink.webp'
    : 'berry/berry-furious-forward-lunge.webp';
  node('phanto-intro').hidden = active;
  node('berry-intro').hidden = !active;
  document.querySelector('.hero-showcase').hidden = active;
  node('berry-art').hidden = !active;
  document.dispatchEvent(new Event('portalchange'));
  const portalPoses = poses.filter(poseInPortal);
  const bannerPoses = portalPoses.filter(collections.emoji);
  shufflePoses(bannerPoses);
  const artwork = active ? node('berry-art') : document.querySelector('.hero-showcase');
  artwork.querySelectorAll('.hero-pose').forEach((button, index) => {
    const pose = bannerPoses[index];
    button.disabled = !pose;
    const image = button.querySelector('img');
    if (!pose) {
      image.removeAttribute('src');
      return;
    }
    image.src = pose.path;
    image.alt = pose.name;
    const label = 'Copy ' + pose.name + ' emoji';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.onclick = () => copyImage(pose, { origin: button });
  });
  for (const button of suggestions) {
    const key = button.dataset.collection;
    button.hidden = active ? !portalPoses.some(collections[key]) : key === 'turnarounds';
  }
  for (const button of node('categories').children) {
    button.hidden = button.textContent !== categories[0] && !portalPoses.some(pose => pose.category === button.textContent);
  }
  for (const [id, key] of [['franchise', 'franchise'], ['franchise-type', 'franchiseType'], ['emotion', 'emotion']]) {
    const select = node(id);
    const values = [...new Set(portalPoses.map(pose => pose[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    select.replaceChildren(select.options[0], ...values.map(value => new Option(value, value)));
  }
}

function currentViewParams() {
  const portal = berryPortal ? 'berry' : '';
  if (linkedPose) return { pose: linkedPose, portal };
  return {
    portal,
    q: search.value.trim(),
    collection,
    category: category === categories[0] ? '' : category,
    sort: node('sort').value,
    from: node('released-from').value,
    to: node('released-to').value,
    ...Object.fromEntries(Object.entries(viewParameters).map(([key, id]) => [key, node(id).value]))
  };
}

function makeShareLink(params) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.href;
}

function syncViewUrl() {
  clearTimeout(syncViewUrl.timer);
  syncViewUrl.timer = setTimeout(() => {
    const url = new URL(location.href);
    for (const key of ['pose', 'portal', 'q', 'collection', 'category', 'sort', 'from', 'to', ...Object.keys(viewParameters)]) url.searchParams.delete(key);
    for (const [key, value] of Object.entries(currentViewParams())) {
      if (value) url.searchParams.set(key, value);
    }
    if (url.href !== location.href) history.replaceState(history.state, '', url);
  }, 180);
}

function openViewLink(label, params) {
  node('view-link-title').textContent = label;
  node('view-address').value = makeShareLink(params);
  node('view-link-status').textContent = '';
  node('view-link-dialog').showModal();
  node('view-address').select();
}

function shareLink(pose) {
  return makeShareLink({ pose: pose.id, portal: berryPortal ? 'berry' : '' });
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
  const title = encodeURIComponent(pose.name + ' · Phanto’s Cosplay');
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
  if (pose.category === 'Costumes') button('Share character link', 'fa-solid fa-user', () => {
    shareDialog.close();
    openViewLink('Share character', {
      q: pose.name.replace(/\s+Pose\s+\d+$/i, ''),
      category: pose.category,
      franchise: pose.franchise,
      type: pose.franchiseType
    });
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

function showMore(limit = pageSize) {
  const batch = document.createDocumentFragment();
  for (const pose of matches.slice(shown, shown + limit)) {
    const card = node('card').content.cloneNode(true);
    const picture = card.querySelector('.picture');
    const image = picture.querySelector('img');
    if (imageWindow) {
      image.dataset.src = pose.path;
      imageWindow.observe(image);
    } else {
      image.src = pose.path;
    }
    image.alt = pose.name;
    image.draggable = false;
    picture.setAttribute('aria-label', 'Copy ' + pose.name + ' image');
    picture.title = 'Copy image';
    picture.addEventListener('click', () => copyImage(pose, { origin: picture }));
    card.querySelector('h3').textContent = pose.name;
    card.querySelector('.new-tag').hidden = !pose.isNew;
    const subtitle = [pose.franchiseType, pose.franchise].filter(Boolean).join(' · ') || pose.emotion || pose.category;
    const released = node('sort').value && pose.released ? releaseDate.format(new Date(pose.released)) : '';
    card.querySelector('p').textContent = released ? subtitle + ' · ' + released : subtitle;
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
    batch.append(card);
  }
  grid.append(batch);
  shown = grid.children.length;
  moreButton.hidden = shown >= matches.length;
}

function rebuildGallery(limit = pageSize) {
  imageWindow?.disconnect();
  for (const timer of imageReleaseTimers.values()) clearTimeout(timer);
  imageReleaseTimers.clear();
  grid.replaceChildren();
  shown = 0;
  showMore(limit);
}

function shufflePoses(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
}

const homeOrder = [...poses];
shufflePoses(homeOrder);

shuffle.addEventListener('click', () => {
  if (matches.length < 2) return;
  shufflePoses(matches);
  rebuildGallery(shown);
  notify('Poses shuffled.');
});

function resolvePose(sharedId) {
const currentSharedId = sharedId?.replace(/^musing-/, 'music-').replace(/^holyday-/, 'holiday-');
return poses.find(pose => pose.id === currentSharedId || pose.legacyId === sharedId || pose.previousId === sharedId || pose.aliases?.includes(sharedId)
    || (sharedId?.startsWith('screen-') && /^(movie|tv)-/.test(pose.id)
      && pose.id.replace(/^(movie|tv)-/, 'screen-') === sharedId)
    || (/^(style|costume)-cyberpunk-/.test(sharedId ?? '') && pose.id === sharedId.replace(/^(style|costume)-/, 'genre-')))?.id ?? null;
}

let linkedPose = null;
function restoreView() {
  const params = new URL(location.href).searchParams;
  linkedPose = resolvePose(params.get('pose'));
  const linked = poses.find(pose => pose.id === linkedPose);
  setPortal(linked ? linked.hasBerry && (!linked.hasPhanto || params.get('portal') === 'berry') : params.get('portal') === 'berry');
  search.value = params.get('q') ?? '';
  const requestedCollection = params.get('collection');
  collection = suggestions.some(button => !button.hidden && button.dataset.collection === requestedCollection) ? requestedCollection : '';
  const requestedCategory = params.get('category');
  category = categories.includes(requestedCategory) ? requestedCategory : categories[0];
  node('sort').value = ['newest', 'oldest'].includes(params.get('sort')) ? params.get('sort') : '';
  for (const [key, id] of [['from', 'released-from'], ['to', 'released-to']]) {
    node(id).value = /^\d{4}-\d{2}-\d{2}$/.test(params.get(key) ?? '') ? params.get(key) : '';
  }
  for (const [key, id] of Object.entries(viewParameters)) {
    const select = node(id);
    const value = params.get(key);
    select.value = [...select.options].some(option => option.value === value) ? value : '';
  }
  render();
}

function narrowFranchiseOptions(type) {
  const select = node('franchise');
  const available = new Set(poses.filter(pose => poseInPortal(pose) && (!type || pose.franchiseType === type)).map(pose => pose.franchise));
  for (const option of [...select.options].slice(1)) {
    const hidden = !available.has(option.value);
    option.hidden = hidden;
    option.disabled = hidden;
  }
  if (select.value && !available.has(select.value)) select.value = '';
}

function render() {
  const raw = search.value.trim().toLowerCase();
  const franchiseType = node('franchise-type').value;
  narrowFranchiseOptions(franchiseType);
  let releasedFrom = node('released-from').value;
  let releasedTo = node('released-to').value;
  if (releasedFrom && releasedTo && releasedFrom > releasedTo) [releasedFrom, releasedTo] = [releasedTo, releasedFrom];
  node('clear-dates').hidden = !releasedFrom && !releasedTo;
  const filtered = category !== categories[0] || Boolean(node('emotion').value || node('franchise').value || franchiseType
    || releasedFrom || releasedTo);
  clearSearch.hidden = !search.value;
  filterToggle.toggleAttribute('data-filtered', filtered);
  filterToggle.setAttribute('aria-label', filtered ? 'Filters, active' : 'Filters');
  for (const button of suggestions) {
    button.setAttribute('aria-pressed', String(!linkedPose && button.dataset.collection === collection));
  }
  const normalized = normalize(Object.hasOwn(shortcuts, raw) ? shortcuts[raw] : raw);
  const emotionPhrase = normalized.replace(/^(?:i am|i m|im|i feel|feeling) /, '');
  const emotion = emotionTerms.get(normalized) ?? emotionTerms.get(emotionPhrase);
  const phrase = emotion ? emotionPhrase : normalized;
  const terms = phrase.split(' ').filter(Boolean);
  const meaningful = terms.filter(word => !searchFiller.has(word));
  const words = meaningful.length ? meaningful : terms;
  const browseOrder = !raw && !filtered && !collection && !linkedPose ? homeOrder : poses;
  matches = browseOrder.filter(pose => {
    if (linkedPose) return pose.id === linkedPose;
    return poseInPortal(pose)
      && (!collection || collections[collection](pose))
      && (category === categories[0] || pose.category === category)
      && (!node('emotion').value || pose.emotion === node('emotion').value)
      && (!node('franchise').value || pose.franchise === node('franchise').value)
      && (!franchiseType || pose.franchiseType === franchiseType)
      && (!releasedFrom || (pose.releasedDay && pose.releasedDay >= releasedFrom))
      && (!releasedTo || (pose.releasedDay && pose.releasedDay <= releasedTo));
  });
  if (raw && !linkedPose) {
    matches = words.length ? matches
      .map(pose => ({ pose, score: searchScore(pose, phrase, words, emotion) }))
      .filter(result => result.score > 0)
      .sort((first, second) => second.score - first.score)
      .map(result => result.pose) : [];
  }
  const sortOrder = node('sort').value;
  if (sortOrder && !linkedPose) {
    const direction = sortOrder === 'oldest' ? 1 : -1;
    matches = [...matches].sort((first, second) =>
      direction * (first.released ?? '').localeCompare(second.released ?? '') || first.name.localeCompare(second.name));
  }
  for (const button of node('categories').children) {
    button.setAttribute('aria-pressed', String(!linkedPose && button.textContent === category));
  }
  const collectionLabel = suggestions.find(button => button.dataset.collection === collection)?.textContent;
  const portalLabel = berryPortal && category === categories[0] ? 'Berry poses' : category;
  node('heading').textContent = linkedPose ? 'Shared pose' : collectionLabel || portalLabel;
  node('count').textContent = matches.length.toLocaleString() + (matches.length === 1 ? ' pose' : ' poses');
  node('empty').hidden = matches.length > 0;
  shuffle.disabled = matches.length < 2;
  rebuildGallery();
  syncViewUrl();
}

function clearLinkedPose() {
  linkedPose = null;
}

for (const label of categories) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.title = label;
  button.addEventListener('click', () => {
    clearLinkedPose();
    collection = '';
    category = label;
    if (label !== 'Reactions') node('emotion').value = '';
    if (label !== 'Costumes' && label !== 'Holidays') node('franchise').value = node('franchise-type').value = '';
    render();
  });
  node('categories').append(button);
}
for (const id of Object.values(viewParameters)) {
  const select = node(id);
  select.addEventListener('change', () => {
    clearLinkedPose();
    if (select.value) {
      collection = '';
      category = id === 'emotion' ? 'Reactions' : categories[0];
      if (id === 'emotion') {
        node('franchise').value = node('franchise-type').value = '';
      } else {
        node('emotion').value = '';
        const type = node('franchise-type').value;
        const franchise = node('franchise').value;
        if (type && franchise && !poses.some(pose => pose.franchiseType === type && pose.franchise === franchise)) {
          node(id === 'franchise' ? 'franchise-type' : 'franchise').value = '';
        }
      }
    }
    render();
  });
}
node('sort').addEventListener('change', () => { clearLinkedPose(); render(); });
for (const id of ['released-from', 'released-to']) {
  node(id).addEventListener('change', () => { clearLinkedPose(); render(); });
}
node('clear-dates').addEventListener('click', () => {
  node('released-from').value = node('released-to').value = '';
  render();
});
{
  const days = poses.map(pose => pose.releasedDay).filter(Boolean).sort();
  for (const id of ['released-from', 'released-to']) {
    node(id).min = days[0] ?? '';
    node(id).max = days.at(-1) ?? '';
  }
}
let portalReactionTimer;
portalButton.addEventListener('pointerenter', event => {
  if (event.pointerType === 'mouse' || event.pointerType === 'pen') portalButton.setAttribute('data-hovering', '');
});
for (const type of ['pointerleave', 'pointercancel']) {
  portalButton.addEventListener(type, () => portalButton.removeAttribute('data-hovering'));
}
portalButton.addEventListener('click', () => {
  clearTimeout(portalReactionTimer);
  portalButton.setAttribute('data-reacting', '');
  portalReactionTimer = setTimeout(() => portalButton.removeAttribute('data-reacting'), 900);
  clearLinkedPose();
  category = categories[0];
  search.value = '';
  collection = '';
  setPortal(!berryPortal);
  render();
});
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
    node('emotion').value = node('franchise').value = node('franchise-type').value = '';
    collection = collection === button.dataset.collection ? '' : button.dataset.collection;
    search.value = '';
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
if (typeof IntersectionObserver === 'function') {
  const nextBatch = new IntersectionObserver(entries => {
    if (!moreButton.hidden && document.activeElement !== moreButton && entries.some(entry => entry.isIntersecting)) {
      showMore();
    }
  }, { rootMargin: '0px 0px 160px 0px' });
  nextBatch.observe(moreButton);
}
moreButton.addEventListener('click', () => {
  const firstNewIndex = shown;
  showMore();
  grid.children[firstNewIndex]?.querySelector('.picture').focus({ preventScroll: true });
});
node('reset').addEventListener('click', () => {
  clearLinkedPose();
  category = categories[0];
  collection = '';
  search.value = node('emotion').value = node('franchise').value = node('franchise-type').value = '';
  node('released-from').value = node('released-to').value = node('sort').value = '';
  render();
  search.focus({ preventScroll: true });
});
node('share-view').addEventListener('click', () => openViewLink('Share this view', currentViewParams()));
node('close-view-link').addEventListener('click', () => node('view-link-dialog').close());
node('copy-view-link').addEventListener('click', async () => {
  const address = node('view-address');
  try {
    await navigator.clipboard.writeText(address.value);
    node('view-link-status').textContent = 'Link copied!';
  } catch {
    address.focus({ preventScroll: true });
    address.select();
    node('view-link-status').textContent = 'Copy the selected link.';
  }
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
restoreView();
window.addEventListener('popstate', restoreView);
