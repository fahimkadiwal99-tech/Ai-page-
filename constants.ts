import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Executive',
    description: 'Crisp suit, grey or neutral studio background.',
    promptModifier: 'Professional corporate headshot. Wear a tailored navy or dark grey business suit. Background should be a clean, neutral grey studio backdrop. Soft, even studio lighting.',
    icon: '🏢',
    color: 'bg-slate-100 border-slate-300'
  },
  {
    id: 'tech',
    name: 'Modern Tech',
    description: 'Smart casual, modern office blur background.',
    promptModifier: 'Modern tech industry headshot. Wear a high-quality solid color t-shirt or casual blazer. Background should be a blurred modern open-plan office with glass and bokeh. Bright, natural lighting.',
    icon: '💻',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'outdoor',
    name: 'Natural Outdoor',
    description: 'Soft natural light, park or city bokeh.',
    promptModifier: 'Professional outdoor headshot. Wear smart casual attire. Background should be an out-of-focus city park or urban setting with beautiful golden hour natural lighting.',
    icon: '🌳',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    description: 'Bold colors, artistic lighting.',
    promptModifier: 'Creative professional headshot. Wear stylish, artistic clothing. Background should have a subtle colorful gradient or artistic texture. Dramatic but flattering lighting.',
    icon: '🎨',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    description: 'Grainy, nostalgic 35mm aesthetic.',
    promptModifier: 'Vintage 35mm film aesthetic photo. Apply film grain, warm nostalgic color grading, and soft focus. Wear retro-styled clothing. Background should look like an old photograph environment.',
    icon: '🎞️',
    color: 'bg-amber-50 border-amber-200'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Futuristic, neon lights, high contrast.',
    promptModifier: 'Cyberpunk futuristic style portrait. High contrast lighting with neon blue and pink accents. Wear futuristic techwear or leather. Background should be a dark, rainy neon-lit city street.',
    icon: '🌃',
    color: 'bg-indigo-50 border-indigo-200'
  },
  {
    id: 'fairytale',
    name: 'Fairy Tale Dream',
    description: 'Ethereal, magical, soft pastel colors.',
    promptModifier: 'Ethereal fairy tale style portrait. Soft, dreamy lighting with pastel colors. Wear elegant, fantasy-inspired clothing. Background should be a magical forest or dreamscape with sparkles.',
    icon: '🧚',
    color: 'bg-pink-50 border-pink-200'
  },
  {
    id: 'realistic',
    name: 'Realistic Portrait',
    description: 'High-fidelity, lifelike headshot, studio lighting.',
    promptModifier: 'Ultra-realistic professional portrait. Focus on natural skin texture and lifelike details. Clean, neutral studio background with soft, professional lighting. High resolution.',
    icon: '🧑‍🎨',
    color: 'bg-gray-50 border-gray-300'
  },
  {
    id: 'instagram',
    name: 'Instagram Influencer',
    description: 'Trendy, vibrant, and fashionable.',
    promptModifier: 'Modern fashion influencer style. Vibrant colors, slightly desaturated tones, dynamic pose. Use a trendy urban or studio background with good lighting.',
    icon: '📸',
    color: 'bg-pink-50 border-pink-200'
  },
  {
    id: 'glamorous',
    name: 'Glamorous Glow',
    description: 'Soft, radiant lighting, elegant makeup.',
    promptModifier: 'Glamorous portrait with soft, radiant studio lighting. Emphasize elegant makeup and a subtle glow. Background should be a soft, out-of-focus pastel color.',
    icon: '✨',
    color: 'bg-yellow-50 border-yellow-200'
  }
];