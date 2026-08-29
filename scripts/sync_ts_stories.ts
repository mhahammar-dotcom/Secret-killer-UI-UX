import * as fs from 'fs';
import * as path from 'path';

const repoPath = path.join(process.cwd(), 'src/data/repoStories.json');
const stories: any[] = JSON.parse(fs.readFileSync(repoPath, 'utf8'));

const STORY_CONFIG: Record<string, { varName: string; files: string[] }> = {
  dreams: { varName: 'dreamsStory', files: ['dreams.ts'] },
  museum: { varName: 'museumStory', files: ['museum.ts'] },
  train: { varName: 'trainStory', files: ['train.ts'] },
  observatory: { varName: 'observatoryStory', files: ['observatory.ts'] },
  desert_archive: { varName: 'desertArchiveStory', files: ['desertArchive.ts', 'desert_archive.ts'] },
  drowned_village: { varName: 'drownedVillageStory', files: ['drownedVillage.ts', 'drowned_village.ts'] },
  arctic_station: { varName: 'arcticStationStory', files: ['arcticStation.ts', 'arctic_station.ts'] },
  film_set: { varName: 'filmSetStory', files: ['filmSet.ts', 'film_set.ts'] },
  submarine: { varName: 'submarineStory', files: ['submarine.ts'] },
  court: { varName: 'courtStory', files: ['court.ts'] },
  greenhouse: { varName: 'greenhouseStory', files: ['greenhouse.ts'] },
  royal_kitchen: { varName: 'royalKitchenStory', files: ['royalKitchen.ts', 'royal_kitchen.ts'] },
  gala_toast: { varName: 'galaToastStory', files: ['galaToast.ts', 'gala_toast.ts'] }
};

stories.forEach(story => {
  const cfg = STORY_CONFIG[story.id];
  if (!cfg) {
    console.error('Unknown story id:', story.id);
    return;
  }

  const content = `import { Story } from '../../game/types';

export const ${cfg.varName}: Story = ${JSON.stringify(story, null, 2)};
`;

  cfg.files.forEach(fileName => {
    const filePath = path.join(process.cwd(), `src/data/stories/${fileName}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Wrote src/data/stories/${fileName}`);
  });
});

console.log('All individual story TypeScript files synchronized with 3 guilty pool members.');
