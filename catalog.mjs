import { readdirSync, writeFileSync } from 'node:fs';

const source = new URL('../c/', import.meta.url);
const output = new URL('./dist/catalog.js', import.meta.url);
const franchiseNames = {
  'avatar': 'Avatar: The Last Airbender / The Legend of Korra',
  'beauty-and-the-beast': 'Beauty and the Beast',
  'cardcaptor-sakura': 'Cardcaptor Sakura',
  'dc': 'DC',
  'final-fantasy': 'Final Fantasy',
  'hunter-x-hunter': 'Hunter × Hunter',
  'lord-of-the-rings': 'The Lord of the Rings',
  'mega-man': 'Mega Man',
  'ninja-turtles': 'Teenage Mutant Ninja Turtles',
  'pokemon': 'Pokémon',
  'wall-e': 'WALL-E',
  'wheres-waldo': 'Where’s Waldo?',
  'zelda': 'The Legend of Zelda'
};
const groups = ('aladdin animal avatar barney beauty-and-the-beast bleach cardcaptor-sakura castlevania classic-horror classic dc dragon-ball donkey-kong evangelion f-zero final-fantasy god-of-war godzilla halo horizon horror hunter-x-hunter invincible jujutsu-kaisen king-kong kirby lion-king lord-of-the-rings marvel mega-man memes metal-gear metroid minecraft monsters-inc muppets naruto ninja-turtles one-piece pac-man persona pokemon power-rangers ratatouille resident-evil sailor-moon science-fiction sesame-street sonic star-fox star-trek star-wars street-fighter super-mario tomb-raider toy-story transformers wall-e wheres-waldo zelda').split(' ');

function title(slug) {
  return slug.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' ');
}

const featured = [
  'emoji-joy-cheerful', 'cosplay-classic-horror-witch', 'emoji-affection-heart-eyes',
  'cosplay-pokemon-pikachu', 'emoji-playful-wink', 'cosplay-horror-vampire',
  'emoji-sadness-bawling', 'cosplay-super-mario-princess-peach',
  'emoji-joy-tears-of-joy', 'cosplay-zelda-link'
];

const poses = readdirSync(source).filter(name => name.endsWith('.png')).map(file => {
  const id = file.slice(0, -4);
  if (id.startsWith('emoji-')) {
    const [, group, ...name] = id.split('-');
    const category = {
      accessory: 'Activities', activity: 'Activities', celebration: 'Activities',
      health: 'Activities', rotation: 'Turnarounds', temperature: 'Activities'
    }[group] ?? 'Reactions';
    const emotion = category === 'Reactions' && group !== 'reaction' ? title(group) : '';
    return { id, name: title(name.join('-')), category, emotion, tags: group };
  }
  if (id.startsWith('cosplay-')) {
    const slug = id.slice(8);
    const group = groups.find(key => slug === key || slug.startsWith(key + '-'));
    if (!group) throw new Error('Unknown costume group: ' + id);
    const remainder = slug.slice(group.length + 1).replace(/^\d+-/, '');
    const category = { animal: 'Animals', memes: 'Memes' }[group] ?? 'Costumes';
    const standalone = ['animal','memes','classic','classic-horror','horror','science-fiction'].includes(group);
    const franchise = standalone ? '' : franchiseNames[group] ?? title(group);
    return { id, category, franchise, name: title(remainder || group),
      tags: standalone ? title(group) : group.replaceAll('-', ' ') };
  }
  return { id, name: title(id), category: id.startsWith('rotation-') ? 'Turnarounds' : 'Activities' };
});

function order(pose) {
  const index = featured.indexOf(pose.id);
  return index < 0 ? featured.length : index;
}
poses.sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name));
writeFileSync(output, 'window.phantoCatalog = ' + JSON.stringify(poses) + ';\n');
