export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string; // The specific instruction text for the AI
  icon: string;
  color: string;
}

export interface GeneratedImage {
  original: string; // Base64
  generated: string; // Base64
  styleUsed: string;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  CROP = 'CROP',
  SELECT_STYLE = 'SELECT_STYLE',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}