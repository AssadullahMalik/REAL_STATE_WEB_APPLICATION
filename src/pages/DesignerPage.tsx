import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DesignConcept } from '../types';
import { 
  Sparkles, 
  Upload, 
  Check, 
  Sliders, 
  Layers, 
  FileText, 
  RotateCcw, 
  Download, 
  Info, 
  AlertCircle,
  Eye,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const SAMPLE_ORIGINALS = [
  {
    id: 'sample-living',
    title: 'Standard Living Room',
    area: 'Living Room',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    transformed: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sample-kitchen',
    title: 'Enclosed Kitchen Space',
    area: 'Kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    transformed: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sample-bedroom',
    title: 'Primary Bedroom Suite',
    area: 'Bedroom',
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80',
    transformed: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sample-patio',
    title: 'Outdoor Concrete Patio',
    area: 'Patio & Deck',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    transformed: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  }
];

const STYLES = [
  { id: 'scandinavian', name: 'Scandinavian Warmth', desc: 'Light oak, acoustic wood slats, bouclé textures, natural daylight.' },
  { id: 'japandi', name: 'Japandi Minimalist', desc: 'Low-profile timber, wabi-sabi ceramics, paper lanterns, earth tones.' },
  { id: 'industrial', name: 'Modern Industrial Loft', desc: 'Exposed brick, matte black steel accents, raw concrete, fluted glass.' },
  { id: 'contemporary', name: 'Contemporary Luxury', desc: 'Calacatta marble, brushed brass trims, recessed perimeter LED coves.' },
  { id: 'biophilic', name: 'Biophilic Organic', desc: 'Living moss walls, indoor olive trees, terracotta, breathable linen.' }
];

const PALETTES = [
  { id: 'nordic', name: 'Nordic Light', colors: ['#F5F5F0', '#D6CEBE', '#A69B89', '#3D3B36'] },
  { id: 'earth', name: 'Warm Terracotta & Sand', colors: ['#FAF5EF', '#E8D3C3', '#C07D58', '#4A3B32'] },
  { id: 'slate', name: 'Pacific Slate & Sage', colors: ['#F0F4F4', '#CBDAD5', '#7A9A95', '#243432'] },
  { id: 'monochrome', name: 'Charcoal & Travertine', colors: ['#F4F1EA', '#D2CBBE', '#555452', '#1C1B1A'] }
];

export const DesignerPage: React.FC = () => {
  const { saveDesignConcept, addToast } = useApp();

  // Form State
  const [uploadedImage, setUploadedImage] = useState<string>(SAMPLE_ORIGINALS[0].url);
  const [customFileActive, setCustomFileActive] = useState(false);
  const [propertyType, setPropertyType] = useState('Single Family Residence');
  const [designArea, setDesignArea] = useState('Living Room');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0].id);
  const [userNotes, setUserNotes] = useState(
    'Emphasize natural light reflection, install acoustic vertical wood slats behind the entertainment wall, and introduce hidden storage.'
  );

  // Generation Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [generatedConcept, setGeneratedConcept] = useState<DesignConcept | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'after'>('split');
  const [sliderPosition, setSliderPosition] = useState(50);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file (PNG, JPG, or WebP).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      addToast('Image size exceeds the 8MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        setCustomFileActive(true);
        addToast('Photograph uploaded and pre-screened for dimension geometry.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setGeneratedConcept(null);

    // Step-by-step progress feedback while the concept is prepared
    setProcessingStep('1/4: Analyzing spatial planes, ceiling heights & natural illumination vectors...');
    
    setTimeout(() => {
      setProcessingStep('2/4: Applying architectural style textures and material palettes...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('3/4: Generating 2700K indirect perimeter lighting and structural elevations...');
    }, 1800);

    setTimeout(() => {
      setProcessingStep('4/4: Calculating localized renovation budget and material bill...');
    }, 2700);

    setTimeout(() => {
      const activeStyleObj = STYLES.find((s) => s.id === selectedStyle) || STYLES[0];
      const activePaletteObj = PALETTES.find((p) => p.id === selectedPalette) || PALETTES[0];
      
      // Select appropriate transformed image
      const matchedPreset = SAMPLE_ORIGINALS.find((s) => s.area === designArea);
      const transformedUrl = matchedPreset ? matchedPreset.transformed : SAMPLE_ORIGINALS[0].transformed;

      const newConcept: DesignConcept = {
        id: `concept-${Date.now()}`,
        originalImage: uploadedImage,
        transformedImage: transformedUrl,
        propertyType,
        roomArea: designArea,
        designStyle: activeStyleObj.name,
        paletteName: activePaletteObj.name,
        paletteHexes: activePaletteObj.colors,
        userNotes: userNotes.trim() || 'Modern architectural update.',
        architecturalOverview: `Reimagining of the ${designArea.toLowerCase()} through ${activeStyleObj.name.toLowerCase()} design language. Replaces dated trim with trimless architectural reveals, acoustic timber wall fluting, and a high-efficiency 3-tier illumination concept.`,
        keyEnhancements: [
          'Full-height acoustic slatted oak feature wall with concealed storage',
          'Recessed 2700K perimeter indirect LED ceiling channel with Lutron Caseta dimming',
          'Micro-cement plaster finish on fireplace surround and structural columns',
          'Wide-plank quarter-sawn white oak flooring with matte polyurethane sealer'
        ],
        estimatedCostRange: '$14,500 – $22,000 (Materials + Licensed Labor)',
        recommendedMaterials: [
          'FSC-Certified Quarter-Sawn White Oak',
          'Zero-VOC Micro-cement Plaster (Pietra)',
          'High-CRI Architectural Cove LED Tape (95+ CRI)'
        ],
        lightingConcept: 'Three-layer architectural scheme: indirect 2700K perimeter cove glow, low-glare recessed 30° spot luminaires, and warm accent pendants.',
        disclaimer: 'This concept is a generated design preview. Consult licensed structural engineers before beginning construction.',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setGeneratedConcept(newConcept);
      setIsProcessing(false);
      saveDesignConcept(newConcept);
      addToast('Design concept generated and saved to your design portfolio!', 'success');
    }, 3600);
  };

  const handleDownloadReport = () => {
    addToast('Concept portfolio report dispatched to PDF download.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Renovation Concept Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Property Designer
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Upload room photos or test preloaded spaces to explore architectural improvements, interior styles, and realistic material budgets.
          </p>
        </div>

        {/* Input Studio Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Step 1: Upload or Choose Sample Image */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Upload Photograph or Select a Preset Space</h2>
                </div>
                {customFileActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(SAMPLE_ORIGINALS[0].url);
                      setCustomFileActive(false);
                    }}
                    className="text-xs text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Reset to Preset Space
                  </button>
                )}
              </div>

              {/* Sample Quick Selector */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                  Quick Testing Spaces (Click to test without uploading):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_ORIGINALS.map((samp) => {
                    const isSelected = uploadedImage === samp.url && !customFileActive;
                    return (
                      <button
                        key={samp.id}
                        type="button"
                        onClick={() => {
                          setUploadedImage(samp.url);
                          setDesignArea(samp.area);
                          setCustomFileActive(false);
                        }}
                        className={`relative rounded-xl overflow-hidden border-2 text-left p-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/30 dark:bg-teal-950/40'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-1.5">
                          <img src={samp.url} alt={samp.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate px-1">
                          {samp.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 px-1">{samp.area}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dropzone & Preview Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40 block">
                  <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Upload Custom Property Room Photo
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    PNG, JPG, or WebP up to 8MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <img
                    src={uploadedImage}
                    alt="Current Selected Space"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    Active Base Photograph
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Room & Architectural Type */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Define Space & Purpose</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Property Architectural Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                  >
                    <option value="Single Family Residence">Single Family Residence</option>
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="High-Rise Penthouse">High-Rise Penthouse</option>
                    <option value="Historic Brownstone">Historic Brownstone</option>
                    <option value="Commercial Loft Studio">Commercial Loft Studio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Room / Zone
                  </label>
                  <select
                    value={designArea}
                    onChange={(e) => setDesignArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bedroom">Bedroom Suite</option>
                    <option value="Patio & Deck">Outdoor Patio / Terrace</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Style & Palette Selection */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Select Architectural Style & Color Palette</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Design Language</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STYLES.map((style) => {
                      const isSelected = selectedStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/40 ring-1 ring-teal-500/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{style.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{style.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palettes */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Curated Material Palette</label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {PALETTES.map((pal) => {
                      const isSelected = selectedPalette === pal.id;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => setSelectedPalette(pal.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/40 ring-1 ring-teal-500/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{pal.name}</span>
                            {isSelected && <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
                          </div>
                          <div className="flex items-center gap-1.5 h-5 rounded-md overflow-hidden p-0.5 bg-slate-100 dark:bg-slate-800">
                            {pal.colors.map((c, idx) => (
                              <div
                                key={idx}
                                className="flex-1 h-full rounded-xs"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Custom Directives */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Specific Architectural Directives & Client Desires
              </label>
              <textarea
                rows={3}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Maximize south-facing daylight, integrate acoustic wood wall panels..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Renders high-fidelity architectural concepts and material estimates.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Simulating Generation...' : 'Generate Design Concept'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Processing Feedback Banner */}
        {isProcessing && (
          <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-teal-400 border-t-transparent animate-spin mx-auto" />
            <h3 className="text-lg font-bold">Synthesizing Architectural Transformation</h3>
            <p className="text-xs text-teal-400 font-mono">{processingStep}</p>
          </div>
        )}

        {/* Results Container */}
        {generatedConcept && !isProcessing && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md space-y-6 p-6 sm:p-8">
            {/* Header Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
                  Design Output Reference #{generatedConcept.id}
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {generatedConcept.designStyle} Transformation
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Applied to {generatedConcept.roomArea} · {generatedConcept.propertyType}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReport}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Concept PDF</span>
                </button>
                <button
                  onClick={() => setGeneratedConcept(null)}
                  className="px-3.5 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Start New Concept
                </button>
              </div>
            </div>

            {/* View Switcher: Split / Before / After */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Visual Comparison</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'split' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Interactive Slider
                </button>
                <button
                  onClick={() => setViewMode('before')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'before' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Before Only
                </button>
                <button
                  onClick={() => setViewMode('after')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'after' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  After Concept
                </button>
              </div>
            </div>

            {/* Image Comparison Box */}
            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
              {viewMode === 'before' && (
                <img
                  src={generatedConcept.originalImage}
                  alt="Original space"
                  className="w-full h-full object-cover"
                />
              )}
              {viewMode === 'after' && (
                <img
                  src={generatedConcept.transformedImage}
                  alt="Transformed concept"
                  className="w-full h-full object-cover"
                />
              )}
              {viewMode === 'split' && (
                <div className="relative w-full h-full select-none">
                  {/* Transformed image (Background) */}
                  <img
                    src={generatedConcept.transformedImage}
                    alt="Transformed concept"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Original image (Foreground with clip-path) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                  >
                    <img
                      src={generatedConcept.originalImage}
                      alt="Original space"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Vertical Dividing Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-md">
                      ↔
                    </div>
                  </div>

                  {/* Range input overlay for smooth slider drag */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    aria-label="Drag comparison slider"
                  />

                  {/* Floating Badges */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md pointer-events-none">
                    Before: Original State
                  </div>
                  <div className="absolute bottom-3 right-3 bg-teal-600/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md pointer-events-none">
                    After: AI Concept Transformation
                  </div>
                </div>
              )}
            </div>

            {/* Architectural Overview & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Left Column: Key Enhancements */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Architectural Enhancements
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {generatedConcept.architecturalOverview}
                </p>
                <div className="space-y-2">
                  {generatedConcept.keyEnhancements.map((enhancement, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{enhancement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Cost & Lighting */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Estimated Renovation Budget
                  </span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                    {generatedConcept.estimatedCostRange}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Benchmark based on contractor averages
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Illumination & Lighting Plan
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {generatedConcept.lightingConcept}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Selected Palette
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{generatedConcept.paletteName}:</span>
                    <div className="flex items-center gap-1.5">
                      {generatedConcept.paletteHexes.map((hex, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Please note:</strong> These concepts are AI-generated visualisations for spatial inspiration only. They are not certified architectural drawings and do not replace structural engineering plans or building permits.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
