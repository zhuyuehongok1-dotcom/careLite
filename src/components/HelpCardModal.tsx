import { useState, useEffect } from "react";
import { X, Volume2, Copy, Check, RotateCcw, Zap, Eye, ZoomIn, ZoomOut } from "lucide-react";
import { HelpCardData } from "../types";

interface HelpCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HelpCardData | null;
}

export default function HelpCardModal({ isOpen, onClose, data }: HelpCardModalProps) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"large" | "extra" | "giant">("extra");
  const [isFlashing, setIsFlashing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFlashing(false);
      setIsPlaying(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.translatedHelp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("您的浏览器不支持语音播放。请直接出示卡片。");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data.translatedHelp);
    
    // Attempt to match language code
    let langCode = "en-US";
    if (data.localLang === "ja") langCode = "ja-JP";
    else if (data.localLang === "ko") langCode = "ko-KR";
    else if (data.localLang === "fr") langCode = "fr-FR";
    else if (data.localLang === "es") langCode = "es-ES";
    else if (data.localLang === "th") langCode = "th-TH";

    utterance.lang = langCode;
    utterance.rate = 0.85; // Slightly slower for clarity
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "large": return "text-2xl sm:text-3xl font-bold leading-relaxed";
      case "giant": return "text-4xl sm:text-5xl font-black leading-normal";
      case "extra":
      default:
        return "text-3xl sm:text-4xl font-extrabold leading-normal";
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-all ${isFlashing ? "animate-pulse" : ""}`}>
      
      {/* Visual Flash Screen for emergency attention */}
      {isFlashing && (
        <div className="absolute inset-0 bg-yellow-400 z-50 pointer-events-none animate-flash flex items-center justify-center">
          <div className="text-black text-4xl font-extrabold flex flex-col items-center gap-4">
            <Zap className="w-20 h-20 animate-bounce fill-black" />
            <span>请帮帮我！HELP ME!</span>
          </div>
        </div>
      )}

      {/* Main card container */}
      <div 
        id="help-card-container"
        className="relative w-full sm:max-w-xl bg-white text-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden border-2 border-yellow-500"
      >
        {/* Flash banner */}
        <div className="bg-yellow-400 text-black px-4 py-3 font-bold text-center flex justify-between items-center z-10">
          <div className="flex items-center gap-1.5 text-base sm:text-lg">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span>👉 请将此屏幕展示给路人 / SHOW TO OTHERS</span>
          </div>
          {data.isOffline && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              离线预设
            </span>
          )}
        </div>

        {/* Action Bar (Font adjustment, speech, beacon) */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
          {/* Font Controls */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-300">
            <button 
              id="btn-font-smaller"
              onClick={() => setFontSize("large")}
              className={`p-1.5 rounded text-sm font-semibold flex items-center gap-0.5 ${fontSize === "large" ? "bg-yellow-100 text-yellow-800 font-bold" : "text-gray-600 hover:bg-gray-100"}`}
              title="缩放字号"
            >
              <ZoomOut className="w-4 h-4" />
              <span>大</span>
            </button>
            <button 
              id="btn-font-medium"
              onClick={() => setFontSize("extra")}
              className={`p-1.5 rounded text-sm font-semibold flex items-center gap-0.5 ${fontSize === "extra" ? "bg-yellow-100 text-yellow-800 font-bold" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <span>特大</span>
            </button>
            <button 
              id="btn-font-larger"
              onClick={() => setFontSize("giant")}
              className={`p-1.5 rounded text-sm font-semibold flex items-center gap-0.5 ${fontSize === "giant" ? "bg-yellow-100 text-yellow-800 font-bold" : "text-gray-600 hover:bg-gray-100"}`}
              title="放大字号"
            >
              <ZoomIn className="w-4 h-4" />
              <span>巨型</span>
            </button>
          </div>

          {/* Quick interactions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-flash-beacon"
              onClick={() => {
                setIsFlashing(true);
                setTimeout(() => setIsFlashing(false), 3000); // flash for 3 seconds
              }}
              className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
              title="在黑暗中闪烁屏幕吸引注意"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>爆闪呼救</span>
            </button>

            <button
              id="btn-close-modal"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Card: Local Language Translation (Giant Text) */}
          <div className="p-5 sm:p-6 bg-yellow-50/50 rounded-2xl border-2 border-dashed border-yellow-400 relative group">
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                id="btn-tts-speak"
                onClick={handleSpeak}
                className={`p-2 rounded-full border shadow-sm transition-all flex items-center justify-center ${isPlaying ? "bg-red-500 text-white border-red-500 animate-pulse" : "bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50"}`}
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <button
                id="btn-copy-card"
                onClick={handleCopy}
                className="p-2 rounded-full border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 shadow-sm"
              >
                {copied ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>

            <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-widest">
              本地语言 / LOCAL TRANSLATION
            </div>

            {/* Target Language Card Content */}
            <p className={`${getFontSizeClass()} text-gray-950 font-sans break-words pr-12 text-left`}>
              {data.translatedHelp}
            </p>

            {/* Pronunciation block */}
            {data.pronunciation && (
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <span className="text-xs font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full inline-block mb-1.5">
                  🎤 助读发音 / Pronunciation Guide
                </span>
                <p className="text-sm font-mono text-gray-700 italic text-left bg-white p-2.5 rounded-lg border border-yellow-100">
                  {data.pronunciation}
                </p>
              </div>
            )}
          </div>

          {/* Map prompt if exists */}
          {data.mapPrompt && (
            <div className="p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-left">
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mb-1">
                🗺️ 问路辅助 / Map Assistance
              </span>
              <p className="text-lg font-bold mt-1 text-blue-950">
                {data.mapPrompt}
              </p>
              <span className="text-xs text-blue-700 block mt-1">
                (请路人帮您在地图上指明或直接协助您)
              </span>
            </div>
          )}

          {/* Chinese meaning explanation */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-2">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                卡片中文含义 / CHINESE MEANING
              </span>
              <p className="text-base text-gray-800 leading-relaxed font-medium">
                {data.explanation}
              </p>
            </div>

            {data.emergencyTip && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <span className="text-xs font-bold text-red-600 flex items-center gap-1 mb-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  急救健康小贴士 / FIRST AID TIPS
                </span>
                <p className="text-sm text-gray-700 bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                  {data.emergencyTip}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info & close */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              CareLite - 适老无碍双向沟通
            </span>
            <button
              id="btn-close-footer"
              onClick={onClose}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-base font-bold shadow-md transition-all active:scale-95"
            >
              我知道了 (关闭)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
