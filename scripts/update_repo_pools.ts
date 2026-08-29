import * as fs from 'fs';
import * as path from 'path';

// Let's load the existing repoStories.json to take the existing 13 stories as base,
// and cleanly expand the guiltyPool to 3 characters and innocentPool to 9 characters for each story!

const repoPath = path.join(process.cwd(), 'src/data/repoStories.json');
const raw = fs.readFileSync(repoPath, 'utf8');
const stories: any[] = JSON.parse(raw);

// Definition of the 3 guilty character names for each of the 13 stories
const GUILTY_NAMES_MAP: Record<string, string[]> = {
  dreams: ['د. فراس', 'كريم', 'ياسمين'],
  museum: ['عمر', 'منصور', 'سلمى'],
  train: ['فارس', 'بسام', 'كمال'],
  observatory: ['إياد', 'د. رؤوف', 'مايا'],
  desert_archive: ['عزام', 'د. ليلى', 'راشد'],
  drowned_village: ['فؤاد', 'د. زياد', 'ماجد'],
  arctic_station: ['د. مروان', 'ديمتري', 'كاتيا'],
  film_set: ['جلال', 'كريم', 'ريتا'],
  submarine: ['مهند', 'رامز', 'دانية'],
  court: ['عادل', 'المستشار منصور', 'سلمى'],
  greenhouse: ['د. سهيل', 'باسم', 'ديمة'],
  royal_kitchen: ['شادي', 'مروان', 'هند'],
  gala_toast: ['سامية', 'د. كريم', 'فارس']
};

console.log('Total stories in repo:', stories.length);

const updatedStories = stories.map(story => {
  const targetGuiltyNames = GUILTY_NAMES_MAP[story.id];
  if (!targetGuiltyNames) {
    console.warn('Unknown story id:', story.id);
    return story;
  }

  const allChars = [...(story.guiltyPool || []), ...(story.innocentPool || [])];
  const charMap = new Map<string, any>();
  allChars.forEach(c => {
    charMap.set(c.name.trim(), c);
  });

  const guiltyPool: any[] = [];
  targetGuiltyNames.forEach(name => {
    const found = charMap.get(name.trim());
    if (found) {
      guiltyPool.push({
        ...found,
        guilty: true
      });
      charMap.delete(name.trim());
    } else {
      console.warn(`Could not find guilty char "${name}" in story "${story.id}"`);
    }
  });

  const innocentPool: any[] = [];
  Array.from(charMap.values()).forEach(c => {
    innocentPool.push({
      ...c,
      guilty: false
    });
  });

  console.log(`Story ${story.id}: guilty=${guiltyPool.length}, innocent=${innocentPool.length}, total=${guiltyPool.length + innocentPool.length}`);

  return {
    ...story,
    guiltyPool,
    innocentPool
  };
});

fs.writeFileSync(repoPath, JSON.stringify(updatedStories, null, 2), 'utf8');
console.log('Successfully wrote updated repoStories.json');
