import React, { useState } from 'react';
import { AppState, GeneratedImage } from './types';
import { HEADSHOT_STYLES } from './constants';
import { generateHeadshot } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ImageCropper } from './components/ImageCropper';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [blurIntensity, setBlurIntensity] = useState<number>(50);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTips, setShowTips] = useState<boolean>(false);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setAppState(AppState.CROP);
  };

  const handleCropComplete = (croppedBase64: string) => {
    setOriginalImage(croppedBase64);
    setAppState(AppState.SELECT_STYLE);
  };

  const handleCropCancel = () => {
    setOriginalImage(null);
    setAppState(AppState.UPLOAD);
  };

  const toggleStyle = (id: string) => {
    setCustomPrompt('');
    setSelectedStyleIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(s => s !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    // Determine prompt based on selection or custom input
    let stylePrompt = '';
    let styleName = 'Custom';

    if (selectedStyleIds.length > 0) {
      const selectedStyles = HEADSHOT_STYLES.filter(s => selectedStyleIds.includes(s.id));
      
      // Combine names for display
      styleName = selectedStyles.map(s => s.name).join(' + ');
      
      // Combine prompt modifiers
      const combinedModifiers = selectedStyles.map(s => s.promptModifier).join(' ');
      stylePrompt = `Mix the following styles: ${styleName}. ${combinedModifiers}`;
      
    } else if (customPrompt.trim().length > 0) {
        // Allow raw prompt for generic editing (e.g., "Add a retro filter")
        stylePrompt = customPrompt;
        styleName = "Custom Edit";
    } else {
        alert("Please select at least one style or enter a custom prompt.");
        return;
    }

    setAppState(AppState.GENERATING);
    setErrorMsg(null);

    try {
      const resultBase64 = await generateHeadshot(originalImage, stylePrompt, blurIntensity);
      
      setGeneratedImage({
        original: originalImage,
        generated: resultBase64,
        styleUsed: styleName
      });
      setAppState(AppState.RESULT);
    } catch (err) {
      setAppState(AppState.ERROR);
      setErrorMsg("Failed to generate image. Please try again. " + (err instanceof Error ? err.message : ''));
    }
  };

  const resetApp = () => {
    setAppState(AppState.UPLOAD);
    setOriginalImage(null);
    setGeneratedImage(null);
    setSelectedStyleIds([]);
    setCustomPrompt('');
    setBlurIntensity(50);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h1 className="font-bold text-xl tracking-tight">AI Headshot & Edit Pro</h1>
          </div>
          {appState !== AppState.UPLOAD && (
            <button 
              onClick={resetApp}
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-10 flex flex-col items-center">
        
        {/* Step 1: Upload */}
        {appState === AppState.UPLOAD && (
          <div className="flex flex-col items-center animate-fade-in w-full">
            <div className="text-center mb-10 max-w-lg">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Professional Headshots<br/>& AI Edits.</h2>
              <p className="text-lg text-slate-600">
                Upload a photo and let Gemini 2.5 Flash transform it. Choose a professional style or describe your own edit.
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} />
            
            <div className="mt-8 max-w-md w-full">
                <button
                    onClick={() => setShowTips(!showTips)}
                    className="flex items-center justify-center gap-2 w-full text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors focus:outline-none"
                >
                    <span>💡 Tips for the best results</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${showTips ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                {showTips && (
                    <div className="mt-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-left animate-pulse-fade-in">
                        <h4 className="font-bold text-slate-800 mb-3 text-sm">How to get a great headshot:</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5 font-bold">✓</span>
                                <div>
                                    <strong className="block text-slate-700">Good Lighting</strong> 
                                    Use soft, natural light facing you (e.g., a window). Avoid harsh shadows.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5 font-bold">✓</span>
                                <div>
                                    <strong className="block text-slate-700">Eye Level</strong>
                                    Hold the camera at eye level, not looking up or down.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5 font-bold">✓</span>
                                <div>
                                    <strong className="block text-slate-700">Clean Background</strong>
                                    A simple wall or uncluttered space works best for AI processing.
                                </div>
                            </li>
                             <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5 font-bold">✓</span>
                                <div>
                                    <strong className="block text-slate-700">Clear Face</strong>
                                    Ensure your face is unobstructed by hair, hands, or accessories.
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
          </div>
        )}

        {/* Step 1.5: Crop */}
        {appState === AppState.CROP && originalImage && (
          <div className="w-full flex justify-center animate-fade-in">
             <ImageCropper 
                imageSrc={originalImage} 
                onCropComplete={handleCropComplete} 
                onCancel={handleCropCancel}
             />
          </div>
        )}

        {/* Step 2: Select Style */}
        {appState === AppState.SELECT_STYLE && originalImage && (
          <div className="w-full max-w-3xl animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Preview of uploaded image */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={() => setAppState(AppState.CROP)} 
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Adjust Crop
                  </button>
                </div>
              </div>

              {/* Style Selection Grid */}
              <div className="w-full md:w-2/3">
                <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-2xl font-bold">Choose Styles</h2>
                    {selectedStyleIds.length > 0 && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                            {selectedStyleIds.length} Selected
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 mb-6">Select multiple styles to create a unique mix.</p>
                
                {/* Active Mix Indicator */}
                {selectedStyleIds.length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50 animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Style Mix Recipe</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                          {selectedStyleIds.map((id, idx) => {
                              const style = HEADSHOT_STYLES.find(s => s.id === id);
                              if (!style) return null;
                              return (
                                  <div key={id} className="flex items-center group animate-bounce-in">
                                      {idx > 0 && (
                                          <div className="mx-2 text-slate-300 font-medium text-lg">+</div>
                                      )}
                                      <div 
                                          className="bg-white pl-2 pr-3 py-1.5 rounded-full border border-blue-100 shadow-sm flex items-center gap-2 hover:border-red-200 hover:shadow-md transition-all cursor-pointer"
                                          onClick={() => toggleStyle(id)}
                                          title="Remove style"
                                      >
                                          <span className="text-xl leading-none">{style.icon}</span>
                                          <span className="text-sm font-semibold text-slate-700">{style.name}</span>
                                          <div className="w-5 h-5 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-500 transition-colors ml-1">
                                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {HEADSHOT_STYLES.map((style) => {
                    const isSelected = selectedStyleIds.includes(style.id);
                    return (
                      <div 
                        key={style.id}
                        onClick={() => toggleStyle(style.id)}
                        className={`p-4 rounded-xl cursor-pointer border-2 transition-all relative overflow-hidden select-none
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500' 
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                      >
                        <div className="text-3xl mb-2">{style.icon}</div>
                        <h3 className="font-bold text-slate-900">{style.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{style.description}</p>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center animate-bounce-in">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-50 text-slate-500">Or describe a custom edit</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 transition-all mb-6 ${customPrompt ? 'border-blue-500 bg-white ring-1 ring-blue-500' : 'border-slate-200 bg-white'}`}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Custom Prompt</label>
                    <textarea 
                        className="w-full p-2 text-slate-800 outline-none resize-none bg-transparent placeholder-slate-400"
                        rows={3}
                        placeholder="e.g., 'Add a retro filter', 'Remove the background person', or 'Cyberpunk style headshot'"
                        value={customPrompt}
                        onChange={(e) => {
                            setCustomPrompt(e.target.value);
                            setSelectedStyleIds([]); // Clear selection if typing custom prompt
                        }}
                    />
                </div>

                <div className="mb-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                           💧 Background Blur Intensity
                        </label>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {blurIntensity}%
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={blurIntensity} 
                        onChange={(e) => setBlurIntensity(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                        <span>Sharp</span>
                        <span>Balanced</span>
                        <span>Creamy</span>
                    </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  fullWidth 
                  disabled={selectedStyleIds.length === 0 && !customPrompt}
                >
                  Generate Image ✨
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {appState === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
            <div className="relative w-24 h-24 mb-8">
               <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
               <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing your image...</h2>
            <p className="text-slate-500 max-w-sm">
              Gemini 2.5 is applying your edits. This may take a few seconds.
            </p>
          </div>
        )}

        {/* Step 4: Result */}
        {appState === AppState.RESULT && generatedImage && (
          <div className="w-full max-w-4xl animate-fade-in flex flex-col items-center">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 w-full">
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    {/* Before */}
                    <div className="flex flex-col gap-2">
                         <span className="text-xs font-bold tracking-wider text-slate-400 uppercase text-center">Original</span>
                         <div className="relative w-64 h-80 rounded-xl overflow-hidden border border-slate-100">
                             <img src={generatedImage.original} className="w-full h-full object-cover opacity-80" alt="Original" />
                         </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="text-slate-300">
                        <svg className="w-8 h-8 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>

                    {/* After */}
                    <div className="flex flex-col gap-2 relative group">
                        <span className="text-xs font-bold tracking-wider text-blue-600 uppercase text-center">
                             AI Generated • {generatedImage.styleUsed}
                        </span>
                        <div className="relative w-80 h-[25rem] rounded-xl overflow-hidden shadow-2xl ring-4 ring-blue-100 bg-slate-100">
                            <img src={generatedImage.generated} className="w-full h-full object-cover" alt="Generated Image" />
                            
                            {/* Download Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a 
                                    href={generatedImage.generated} 
                                    download={`edited-image-${Date.now()}.png`}
                                    className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-4 flex-wrap justify-center">
                <a 
                    href={generatedImage.generated} 
                    download={`headshot-pro-${Date.now()}.png`}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download HD
                </a>
                <Button variant="secondary" onClick={() => setAppState(AppState.SELECT_STYLE)}>
                    Edit Another Way
                </Button>
                <Button variant="outline" onClick={resetApp}>
                    New Upload
                </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
           <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">😔</div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h3>
              <p className="text-red-600 mb-6 text-sm">{errorMsg}</p>
              <Button onClick={() => setAppState(AppState.SELECT_STYLE)}>Try Again</Button>
           </div>
        )}

      </main>
    </div>
  );
};

export default App;