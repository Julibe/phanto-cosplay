import { readFileSync, readdirSync } from 'node:fs';
import { writeOrganizedPoses } from './pose-assets.mjs';
import { identifyCostume } from './costume-types.mjs';

const source = new URL('../squirlce-emojis/', import.meta.url);
const franchiseNames = {
  'studio-ghibli': 'Studio Ghibli',
  'el-chavo-del-ocho': 'El Chavo del Ocho',
  'dr-seuss': 'Dr. Seuss',
  'gears-of-war': 'Gears of War',
  'k-da': 'K/DA',
  'league-of-legends': 'League of Legends',
  'starcraft': 'StarCraft',
  'world-of-warcraft': 'World of Warcraft',
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

const renamedPoses = JSON.parse(readFileSync(new URL('./pose-renames.json', import.meta.url), 'utf8'));
const holidayNames = ['barranquilla-carnival', 'pasto-carnival', 'dia-de-muertos',
  'lunar-new-year', 'mid-autumn', 'new-year', 'christmas', 'halloween', 'birthday',
  'carnival', 'diwali', 'eid', 'hanukkah', 'holi', 'nowruz'];

const poses = readdirSync(source).filter(name => name.endsWith('.png')
  && !/^(meme-|cosplay-memes-)/.test(name)).map(file => {
  const id = file.slice(0, -4);
  if (id.startsWith('holiday-')) {
    const slug = id.slice('holiday-'.length);
    const holiday = holidayNames.find(name => slug.startsWith(name + '-'));
    if (!holiday) throw new Error('Unknown holiday: ' + id);
    const franchise = { 'dia-de-muertos': 'Día de Muertos' }[holiday] ?? title(holiday);
    const previousId = renamedPoses[id];
    const legacyId = previousId && identifyCostume(previousId)?.legacyId;
    return { id, previousId, legacyId, category: 'Holidays', franchise, franchiseType: 'Festival',
      name: title(slug.slice(holiday.length + 1)), tags: franchise };
  }
  const genreMatch = /^(music|movie|tv)-(hip-hop|rnb-and-soul|sci-fi|action|adventure|comedy|crime|documentary|drama|fantasy|horror|mystery|romance|thriller|western)-(.+)$/.exec(id)
    ?? /^(music)-([^-]+)-(.+)$/.exec(id);
  if (genreMatch) {
    const [, prefix, genre, action] = genreMatch;
    const previousId = renamedPoses[id];
    const franchise = { 'rnb-and-soul': 'R&B and Soul', 'sci-fi': 'Sci-Fi', 'hip-hop': 'Hip-Hop' }[genre] ?? title(genre);
    const franchiseType = { music: 'Music', movie: 'Movie', tv: 'TV' }[prefix];
    const category = action.startsWith('wearing-') ? 'Costumes' : 'Activities';
    return { id, previousId, category, franchise, franchiseType, name: title(action), tags: franchise };
  }
  if (id.startsWith('genre-cyberpunk-')) {
    const previousId = renamedPoses[id];
    const slug = id.slice('genre-cyberpunk-'.length);
    const activity = slug.startsWith('phanto-');
    const name = title(activity ? slug.slice('phanto-'.length) : slug.replace(/-posing$/, ''));
    return { id, previousId, category: activity ? 'Activities' : 'Costumes',
      franchise: 'Cyberpunk', franchiseType: 'Genre', name, tags: 'cyberpunk' };
  }
  if (/^(animal|meme|costume)-/.test(id)) {
    const [prefix] = id.split('-');
    const previousId = renamedPoses[id];
    const costume = previousId && identifyCostume(previousId);
    const name = costume?.remainder ?? id.slice(prefix.length + 1).replace(/-posing$/, '');
    const category = { animal: 'Animals', meme: 'Memes', costume: 'Costumes' }[prefix];
    return { id, previousId, category, name: title(name), tags: costume?.group };
  }
  if (/^(anime|movie|tv|game|comics|book)-/.test(id)) {
    const previousId = renamedPoses[id];
    const { group, franchiseType, legacyId, remainder, standalone } =
      identifyCostume(previousId ?? 'cosplay-' + id);
    const franchise = standalone ? '' : franchiseNames[group] ?? title(group);
    const name = previousId ? remainder : remainder.replace(/-posing(?:-([0-9]+))?$/, (_, variant) => variant ? ' pose ' + variant : '');
    return { id, previousId, legacyId: previousId ? legacyId : undefined, category: 'Costumes',
      franchise, franchiseType, name: title(name), tags: franchise };
  }
  if (id.startsWith('berry-')) {
    const action = id.slice('berry-'.length);
    const rotation = action.startsWith('rotation-');
    return { id, name: title(rotation ? action.slice('rotation-'.length) : action),
      category: rotation ? 'Turnarounds' : 'Reactions', franchise: 'Berry Angry',
      emotion: rotation ? '' : 'Berry Angry', tags: 'berry strawberry' };
  }
  if (id.startsWith('emoji-')) {
    const [, group, ...name] = id.split('-');
    const category = {
      accessory: 'Activities', activity: 'Activities', celebration: 'Activities',
      health: 'Activities', baking: 'Activities', cooking: 'Activities', eating: 'Activities', rotation: 'Turnarounds', temperature: 'Activities'
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
  const index = featured.indexOf(pose.legacyId ?? pose.previousId ?? pose.id);
  return index < 0 ? featured.length : index;
}
poses.sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name));
const approvedMemeNames = {
  'animal-cat-playing-keyboard': 'Keyboard Cat',
  'emoji-confusion-is-this-a-pigeon': 'Is This a Pigeon?',
  'emoji-surprise-pikachu-gasp': 'Surprised Pikachu',
  'emoji-calm-sipping-coffee-amid-flames': 'This Is Fine',
  'emoji-confidence-smug-bearded-glance': 'Gigachad',
  'emoji-anger-clenching-in-yellow-sweater': 'Arthur Fist',
  'emoji-mischief-smirking-by-a-burning-house': 'Disaster Girl'
};
writeOrganizedPoses(poses.map(pose => {
  const approvedName = Object.hasOwn(approvedMemeNames, pose.id) && approvedMemeNames[pose.id];
  if (approvedName) {
    return { ...pose, name: approvedName, tags: [pose.tags, 'meme'].filter(Boolean).join(' ') };
  }
  if (pose.id === 'costume-food-maki-roll') return { ...pose, name: 'Maki Sushi Roll' };
  return pose;
}));
