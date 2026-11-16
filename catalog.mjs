import { readdirSync, writeFileSync } from 'node:fs';
import { identifyCostume } from './costume-types.mjs';

const source = new URL('../squirlce-emojis/', import.meta.url);
const output = new URL('./dist/catalog.js', import.meta.url);
const franchiseNames = {
  'demon-slayer': 'Demon Slayer',
  'frieren': 'Frieren: Beyond Journey’s End',
  'my-hero-academia': 'My Hero Academia',
  'reincarnated-as-a-slime': 'That Time I Got Reincarnated as a Slime',
  'avatar': 'Avatar: The Last Airbender / The Legend of Korra',
  'beauty-and-the-beast': 'Beauty and the Beast',
  'cardcaptor-sakura': 'Cardcaptor Sakura',
  'dc': 'DC',
  'final-fantasy': 'Final Fantasy',
  'hunter-x-hunter': 'Hunter × Hunter',
  'lord-of-the-rings': 'The Lord of the Rings',
  'mega-man': 'Mega Man',
  'festivals': 'World Festivals',
  'music': 'Music Genres',
  'ninja-turtles': 'Teenage Mutant Ninja Turtles',
  'pokemon': 'Pokémon',
  'screen': 'Screen Genres',
  'wall-e': 'WALL-E',
  'wheres-waldo': 'Where’s Waldo?',
  'zelda': 'The Legend of Zelda'
};

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
    const { group, franchiseType, legacyId, remainder, standalone } = identifyCostume(id);
    const category = { animal: 'Animals', memes: 'Memes' }[group] ?? 'Costumes';
    const franchise = standalone ? '' : franchiseNames[group] ?? title(group);
    return { id, legacyId: legacyId === id ? undefined : legacyId, category, franchise, franchiseType, name: title(remainder || group),
      tags: standalone ? title(group) : group.replaceAll('-', ' ') };
  }
  return { id, name: title(id), category: id.startsWith('rotation-') ? 'Turnarounds' : 'Activities' };
});

function order(pose) {
  const index = featured.indexOf(pose.legacyId ?? pose.id);
  return index < 0 ? featured.length : index;
}
poses.sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name));
writeFileSync(output, 'window.phantoCatalog = ' + JSON.stringify(poses) + ';\n');
