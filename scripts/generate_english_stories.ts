import * as fs from 'fs';
import * as path from 'path';

const repoPath = path.join(process.cwd(), 'src/data/repoStories.json');
const arStories: any[] = JSON.parse(fs.readFileSync(repoPath, 'utf8'));

// Name translations dictionary
const NAME_EN_MAP: Record<string, { name: string; profession: string; publicIdentity?: string }> = {
  // Common names
  'د. فراس': { name: 'Dr. Firas', profession: 'Lead Neuroscientist' },
  'د. مريم': { name: 'Dr. Maryam', profession: 'Clinical Neurophysiologist' },
  'كريم': { name: 'Karim', profession: 'Systems & Network Engineer' },
  'طارق': { name: 'Tariq', profession: 'EEG Systems Technician' },
  'ياسمين': { name: 'Yasmine', profession: 'AI Research Assistant' },
  'سامي': { name: 'Sami', profession: 'Volunteer Coordinator' },
  'لبنى': { name: 'Lubna', profession: 'Lab Safety & Security Officer' },
  'نادر': { name: 'Nader', profession: 'HVAC & Climate Tech' },
  'هند': { name: 'Hind', profession: 'Legal & Intellectual Property Director' },
  'باسم': { name: 'Bassem', profession: 'Night Reception & Gate Guard' },
  'لمى': { name: 'Lama', profession: 'Medical Data Analyst' },
  'عمر': { name: 'Omar', profession: 'Equipment & Vault Custodian' },

  // Museum
  'منصور': { name: 'Mansour', profession: 'Night Security Supervisor' },
  'سلمى': { name: 'Salma', profession: 'Restoration & Relics Specialist' },
  'خالد': { name: 'Khaled', profession: 'Archive & Documentation Assistant' },
  'فاطمة': { name: 'Fatima', profession: 'Exhibition Coordinator' },
  'رامي': { name: 'Rami', profession: 'Electrical & Backup Power Tech' },
  'نادية': { name: 'Nadia', profession: 'Museum Educator & Docent' },
  'زينب': { name: 'Zeinab', profession: 'Gift Shop & Inventory Manager' },
  'سعيد': { name: 'Said', profession: 'Loading Dock & Delivery Guard' },
  'منى': { name: 'Mona', profession: 'Executive Administrative Secretary' },
  'زياد': { name: 'Ziad', profession: 'Display Lighting Tech' },

  // Train
  'فارس': { name: 'Faris', profession: 'Assistant Train Engineer' },
  'بسام': { name: 'Bassam', profession: 'First-Class Dining Steward' },
  'كمال': { name: 'Kamal', profession: 'Freight Baggage Inspector' },
  'نبيل': { name: 'Nabil', profession: 'Chief Train Conductor' },
  'درة': { name: 'Dorra', profession: 'Diplomatic Passenger' },
  'رانيا': { name: 'Rania', profession: 'Investigative Journalist' },
  'يوسف': { name: 'Youssef', profession: 'Locomotive Mechanic' },
  'ليلى': { name: 'Layla', profession: 'Passenger Concert Pianist' },
  'ماجد': { name: 'Majid', profession: 'Luggage Porter' },
  'سلوى': { name: 'Salwa', profession: 'First-Class Cabin Attendant' },
  'حسام': { name: 'Hossam', profession: 'Railway Mail Courier' },
  'أمينة': { name: 'Amina', profession: 'Dining Car Executive Chef' },

  // Observatory
  'إياد': { name: 'Eyad', profession: 'Telescope Operations Tech' },
  'د. رؤوف': { name: 'Dr. Raouf', profession: 'Senior Astrophysicist' },
  'مايا': { name: 'Maya', profession: 'Optics & Laser Specialist' },
  'ديمة': { name: 'Deema', profession: 'Astrophotography Data Logger' },
  'سامر': { name: 'Samer', profession: 'Mountain Supply Driver' },
  'حنان': { name: 'Hanan', profession: 'Graduate Research Assistant' },
  'وفاء': { name: 'Wafaa', profession: 'Communications & Telemetry Officer' },
  'عاصم': { name: 'Assem', profession: 'Observatory Caretaker' },

  // Desert Archive
  'عزام': { name: 'Azzam', profession: 'Expedition Scout & Desert Navigator' },
  'د. ليلى': { name: 'Dr. Layla', profession: 'Lead Epigrapher & Historian' },
  'راشد': { name: 'Rashed', profession: 'Archive Vault Custodian' },
  'خديجة': { name: 'Khadija', profession: 'Expedition Field Photographer' },
  'بلال': { name: 'Bilal', profession: 'Water Supply Coordinator' },
  'سالم': { name: 'Salem', profession: 'Caravan Security Guard' },
  'فيصل': { name: 'Faisal', profession: 'Excavation Foreman' },

  // Drowned Village
  'فؤاد': { name: 'Fouad', profession: 'Lead Deep-Sea Diver' },
  'د. زياد': { name: 'Dr. Ziad', profession: 'Marine Archaeologist' },
  'سارة': { name: 'Sarah', profession: 'Marine Biologist' },
  'ريما': { name: 'Rima', profession: 'Sonar & Depth Profiler' },
  'ندى': { name: 'Nada', profession: 'Research Vessel Captain' },

  // Arctic Station
  'د. مروان': { name: 'Dr. Marwan', profession: 'Chief Paleoclimatologist' },
  'ديمتري': { name: 'Dimitri', profession: 'Cold-Storage & Power Engineer' },
  'كاتيا': { name: 'Katia', profession: 'Communications & Radar Officer' },
  'د. إيلينا': { name: 'Dr. Elena', profession: 'Microbiologist' },
  'بوريس': { name: 'Boris', profession: 'Station Commander' },
  'لينا': { name: 'Lina', profession: 'Field Medic' },
  'أندريه': { name: 'Andrei', profession: 'Diesel Systems Mechanic' },
  'ميشيل': { name: 'Michel', profession: 'Chef & Provisions Keeper' },

  // Film Set
  'جلال': { name: 'Jalal', profession: 'Master Prop Decorator' },
  'ريتا': { name: 'Rita', profession: 'Costume & Wardrobe Supervisor' },
  'ميا': { name: 'Mia', profession: 'Lead Actress' },
  'نادين': { name: 'Nadine', profession: 'Script Supervisor' },
  'هاني': { name: 'Hani', profession: 'Production Key Grip' },

  // Submarine
  'مهند': { name: 'Mohanad', profession: 'Sonar & Navigation Officer' },
  'رامز': { name: 'Ramez', profession: 'Chief Propulsion Engineer' },
  'دانية': { name: 'Dania', profession: 'Oceanographic Data Specialist' },
  'نور': { name: 'Nour', profession: 'Marine Geologist' },

  // Court
  'عادل': { name: 'Adel', profession: 'Court Records Clerk' },
  'المستشار منصور': { name: 'Counselor Mansour', profession: 'Senior Judicial Assistant' },
  'هدى': { name: 'Huda', profession: 'Defense Attorney' },
  'ريم': { name: 'Reem', profession: 'Court Stenographer' },
  'سمير': { name: 'Samir', profession: 'Courthouse Facilities Manager' },

  // Greenhouse
  'د. سهيل': { name: 'Dr. Souhail', profession: 'Lead Genetic Botanist' },
  'حسان': { name: 'Hassan', profession: 'Dome Glass Maintenance Tech' },

  // Royal Kitchen
  'شادي': { name: 'Shadi', profession: 'Royal Head Butler' },
  'مروان': { name: 'Marwan', profession: 'Executive Pastry Chef' },
  'جميلة': { name: 'Jamila', profession: 'Royal Food Taster & Quality Inspector' },

  // Gala Toast
  'سامية': { name: 'Samia', profession: 'Family Estate Lawyer' },
  'د. كريم': { name: 'Dr. Kareem', profession: 'Personal Physician' }
};

// Existing English stories
import { ENGLISH_STORIES as OLD_EN } from '../src/data/englishStories';

const englishExport: Record<string, any> = {};

arStories.forEach(arStory => {
  const oldStory = OLD_EN[arStory.id] || {};

  const mapChar = (charAr: any, isGuilty: boolean) => {
    const nameMap = NAME_EN_MAP[charAr.name.trim()] || {
      name: charAr.name,
      profession: charAr.profession
    };

    return {
      name: nameMap.name,
      profession: nameMap.profession,
      publicIdentity: `You are ${nameMap.name}, serving as the ${nameMap.profession}.`,
      knowledge: `In-universe testimony regarding the incident: ${charAr.knowledge}`,
      guilty: isGuilty
    };
  };

  const guiltyPool = (arStory.guiltyPool || []).map((c: any) => mapChar(c, true));
  const innocentPool = (arStory.innocentPool || []).map((c: any) => mapChar(c, false));

  englishExport[arStory.id] = {
    title: oldStory.title || arStory.title,
    description: oldStory.description || arStory.description,
    introduction: oldStory.introduction || arStory.introduction,
    solution: oldStory.solution || arStory.solution,
    guiltyPool,
    innocentPool,
    clues: oldStory.clues || arStory.clues
  };
});

const enFileContent = `// Complete English Localized Story Data for Secret Killer
// Provides full English translations for all 13 built-in cases,
// matching the 3 guilty and 9 innocent characters 1-to-1 with the Arabic source of truth.

import { StoryData } from '../types';

export const ENGLISH_STORIES: Record<string, Partial<StoryData>> = ${JSON.stringify(englishExport, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/englishStories.ts'), enFileContent, 'utf8');
console.log('Successfully generated unified src/data/englishStories.ts');
