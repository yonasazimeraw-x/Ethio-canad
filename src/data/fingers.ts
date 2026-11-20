import { FingerDefinition } from '../types/fingerprint';

export const FINGER_DEFINITIONS: FingerDefinition[] = [
  {
    id: 'thumb',
    order: 1,
    amharicName: 'አውራ ጣት',
    englishName: 'Thumb',
    ridgePattern: 'whorl',
    patternLabel: 'Whorl Ridge Pattern',
    guidanceAm: 'የቀኝ እጅ አውራ ጣትዎን መሃል ላይ በቀስታ ያስቀምጡ',
  },
  {
    id: 'index',
    order: 2,
    amharicName: 'ጠቋሚ ጣት',
    englishName: 'Index Finger',
    ridgePattern: 'ulnar-loop',
    patternLabel: 'Ulnar Loop Pattern',
    guidanceAm: 'የቀኝ እጅ ጠቋሚ ጣትዎን በትክክለኛው ቦታ ያስተካክሉ',
  },
  {
    id: 'middle',
    order: 3,
    amharicName: 'መካከለኛ ጣት',
    englishName: 'Middle Finger',
    ridgePattern: 'double-loop',
    patternLabel: 'Double Loop Pattern',
    guidanceAm: 'የቀኝ እጅ መካከለኛ ጣትዎን በተረጋጋ ሁኔታ ያስገቡ',
  },
  {
    id: 'ring',
    order: 4,
    amharicName: 'ቀለበት ጣት',
    englishName: 'Ring Finger',
    ridgePattern: 'tented-arch',
    patternLabel: 'Tented Arch Pattern',
    guidanceAm: 'የቀኝ እጅ ቀለበት ጣትዎን ሙሉ በሙሉ ያስቀምጡ',
  },
  {
    id: 'little',
    order: 5,
    amharicName: 'ትንሹ ጣት',
    englishName: 'Little Finger',
    ridgePattern: 'radial-loop',
    patternLabel: 'Radial Loop Pattern',
    guidanceAm: 'የቀኝ እጅ ትንሹ ጣትዎን በመጨረሻው ደረጃ ያስገቡ',
  },
];

export const TOTAL_FINGERS = FINGER_DEFINITIONS.length;
