// Authentic cinematic crime case evidence covers generated for Secret Killer
import detectiveEvidenceBoard from './images/detective_evidence_board_1787831405991.jpg';
import forensicPhysicalItem from './images/forensic_evidence_item_1787831424553.jpg';
import caseDossierFiles from './images/case_dossier_files_1787831443168.jpg';
import crimeTimelineClock from './images/crime_timeline_clock_1787831459916.jpg';
import witnessTestimonyTape from './images/witness_testimony_tape_1787831476672.jpg';
import { STORY_COVERS, DEFAULT_STORY_COVER } from './covers';

export const EVIDENCE_COVERS = {
  detectiveBoard: detectiveEvidenceBoard,
  physical: forensicPhysicalItem,
  document: caseDossierFiles,
  timeline: crimeTimelineClock,
  witness: witnessTestimonyTape,
  location: detectiveEvidenceBoard,
  contradiction: caseDossierFiles,
  motive: detectiveEvidenceBoard,
  relationship: witnessTestimonyTape,
};

/**
 * Returns an authentic, cinematic evidence cover image matching the evidence item's category,
 * index, and story context.
 */
export function getEvidenceCoverImage(
  category?: string,
  index = 0,
  storyId?: string
): string {
  // 1. Check if category matches a specific evidence asset
  if (category) {
    const cat = category.toLowerCase();
    if (cat === 'timeline') return EVIDENCE_COVERS.timeline;
    if (cat === 'physical') return EVIDENCE_COVERS.physical;
    if (cat === 'document' || cat === 'digital') return EVIDENCE_COVERS.document;
    if (cat === 'witness' || cat === 'testimony') return EVIDENCE_COVERS.witness;
    if (cat === 'contradiction') return EVIDENCE_COVERS.contradiction;
    if (cat === 'motive') return EVIDENCE_COVERS.motive;
    if (cat === 'relationship') return EVIDENCE_COVERS.relationship;
  }

  // 2. Sequential fallback cycling through authentic crime case assets
  const sequence = [
    EVIDENCE_COVERS.detectiveBoard,
    EVIDENCE_COVERS.physical,
    EVIDENCE_COVERS.timeline,
    EVIDENCE_COVERS.document,
    EVIDENCE_COVERS.witness,
  ];

  return sequence[index % sequence.length];
}

export {
  detectiveEvidenceBoard,
  forensicPhysicalItem,
  caseDossierFiles,
  crimeTimelineClock,
  witnessTestimonyTape,
};
