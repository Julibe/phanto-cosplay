const franchiseTypes = {
  anime: 'bleach cardcaptor-sakura chainsaw-man dandadan demon-slayer dragon-ball evangelion frieren hunter-x-hunter jujutsu-kaisen my-hero-academia naruto one-piece reincarnated-as-a-slime sailor-moon solo-leveling',
  game: 'castlevania donkey-kong f-zero final-fantasy god-of-war halo horizon kirby mega-man metal-gear metroid minecraft pac-man persona pokemon resident-evil sonic star-fox street-fighter super-mario tomb-raider zelda',
  movie: 'aladdin beauty-and-the-beast godzilla king-kong lion-king lord-of-the-rings monsters-inc ratatouille star-wars toy-story wall-e',
  tv: 'avatar barney muppets power-rangers sesame-street star-trek transformers',
  comics: 'dc invincible marvel ninja-turtles',
  festival: 'christmas festivals halloween',
  music: 'music',
  screen: 'screen',
  style: 'cyberpunk',
  book: 'wheres-waldo'
};

const typeNames = {
  anime: 'Anime', game: 'Game', movie: 'Movie', tv: 'TV', comics: 'Comics',
  festival: 'Festival', music: 'Music', screen: 'Film & TV', style: 'Style', book: 'Book'
};

const untitledGroups = ['animal', 'classic-horror', 'classic', 'horror', 'memes', 'science-fiction'];
const typeByGroup = new Map(Object.entries(franchiseTypes)
  .flatMap(([type, list]) => list.split(' ').map(group => [group, type])));
const groups = [...typeByGroup.keys(), ...untitledGroups].sort((a, b) => b.length - a.length);
const alreadyTyped = new Set(['festivals', 'music', 'screen']);
const prefix = 'cosplay-';

export function identifyCostume(id) {
  if (!id.startsWith(prefix)) return null;
  const slug = id.slice(prefix.length);
  const candidate = slug.split('-', 1)[0];
  const rest = slug.slice(candidate.length + 1);
  const hasType = Object.hasOwn(typeNames, candidate)
    && groups.some(group => typeByGroup.get(group) === candidate && rest.startsWith(group + '-'));
  const untyped = hasType ? rest : slug;
  const group = groups.find(key => untyped === key || untyped.startsWith(key + '-'));
  if (!group) throw new Error('Unknown costume group: ' + id);
  const type = typeByGroup.get(group);
  const legacyId = prefix + untyped;
  const typedId = type && !alreadyTyped.has(group) ? prefix + type + '-' + untyped : legacyId;
  return {
    group, franchiseType: typeNames[type], legacyId, typedId,
    remainder: untyped.slice(group.length + 1).replace(/^\d+-/, ''),
    standalone: untitledGroups.includes(group)
  };
}
