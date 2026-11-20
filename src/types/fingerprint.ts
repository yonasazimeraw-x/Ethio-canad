export type FingerId = 'thumb' | 'index' | 'middle' | 'ring' | 'little';

export type RidgePattern = 'whorl' | 'ulnar-loop' | 'double-loop' | 'tented-arch' | 'radial-loop';

export type SubmissionMethod = 'simulated' | 'upload';

export interface FingerDefinition {
  id: FingerId;
  order: number;
  amharicName: string;
  englishName: string;
  ridgePattern: RidgePattern;
  patternLabel: string;
  guidanceAm: string;
}

export interface FingerSubmission {
  fingerId: FingerId;
  status: 'completed';
  method: SubmissionMethod;
  submittedAt: string;
  referenceCode: string;
  fileName?: string;
  previewUrl?: string;
}

export type FingerSubmissionMap = Partial<Record<FingerId, FingerSubmission>>;
