import { useState, useRef, useEffect, ChangeEvent } from "react";
import { 
  Activity, Heart, MapPin, Phone, Users, Camera, Info, Settings, 
  ChevronRight, ArrowLeft, Send, Sparkles, Wifi, WifiOff, RefreshCw, 
  PhoneCall, Clipboard, Check, Share2, Upload, AlertTriangle, FileText, Download
} from "lucide-react";
import { downloadProjectPPTX } from "./lib/pptGenerator";
import { 
  LANGUAGES, 
  OFFLINE_SICKNESS_TEMPLATES, 
  OFFLINE_LOST_TEMPLATES, 
  OFFLINE_FAMILY_TEMPLATES, 
  HelpCardData, 
  Language 
} from "./types";
import HelpCardModal from "./components/HelpCardModal";
import ProjectPPT from "./components/ProjectPPT";

export default function App() {
  // Global settings
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[1]); // Default to Japanese (🇯🇵)
  const [isOffline, setIsOffline] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPPT, setShowPPT] = useState(false);
  
  // User profile
  const [familyPhone, setFamilyPhone] = useState("138-0013-8000");
  const [hotelAddress, setHotelAddress] = useState("东京新宿华盛顿酒店 (Shinjuku Washington Hotel, Tokyo)");
  const [userName, setUserName] = useState("张建国 (国籍: 中国, 65岁)");

  // Navigation / Tabs
  const [currentView, setCurrentView] = useState<"home" | "sickness" | "lost" | "family" | "photo">("home");

  // Load state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Help Card Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [helpCardData, setHelpCardData] = useState<HelpCardData | null>(null);

  // Symptom View State
  const [customSymptom, setCustomSymptom] = useState("");

  // Lost View State
  const [lostType, setLostType] = useState<"hotel" | "family" | "taxi">("hotel");
  const [customDestination, setCustomDestination] = useState("");
  const [currentLoc, setCurrentLoc] = useState("东京新宿中央公园附近 (GPS定位)");
  const [isLocating, setIsLocating] = useState(false);

  // Family Contact View State
  const [familyScenario, setFamilyScenario] = useState<"safe" | "lost" | "unwell" | "phone_lost">("safe");
  const [familyResult, setFamilyResult] = useState<{
    familyVersion: string;
    localVersion: string;
    suggestions: string;
  } | null>(null);
  const [familyCopied, setFamilyCopied] = useState<"family" | "local" | null>(null);

  // Photo Translation View State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [photoResult, setPhotoResult] = useState<{
    detectedTitle: string;
    meaning: string;
    action: string;
  } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sample Photos for testing Photo Translation
  const SAMPLE_PHOTOS = [
    {
      id: "medicine",
      name: "💊 日本感冒药盒",
      img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=60",
      description: "含退烧止痛成分的感冒药说明书",
      mockResult: {
        detectedTitle: "第一三共 綜合感冒藥綜合顆粒",
        meaning: "这是日本常见的感冒颗粒药。主要成分包含对乙酰氨基酚（退烧镇痛）和马来酸氯苯那敏（抗过敏、缓解流涕）。",
        action: "成人一日3次，每次1包，饭后30分钟内温水服用。15岁以下请勿服用。服药后可能会有口干、嗜睡症状，请勿驾车。"
      }
    },
    {
      id: "roadsign",
      name: "⚠️ 法语路牌警告",
      img: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400&auto=format&fit=crop&q=60",
      description: "急诊通道与禁止通行警示",
      mockResult: {
        detectedTitle: "医院急诊通道禁行标志",
        meaning: "标志牌上的法语 'ENTRÉE D'URGENT - ACCÈS INTERDIT' 意为 '急诊入口 - 禁止驶入'。下方小字说明仅限救护车和急诊患者车辆进入。",
        action: "请勿在此区域停靠车辆或长时间滞留。如果是步行求医，请沿着左侧有绿色十字标识的专用人行通道进入大厅。"
      }
    }
  ];

  // Auto locate user (real GPS with smart fallback)
  const handleAutoLocate = () => {
    setIsLocating(true);
    setErrorMsg(null);

    const fallbackCities: { [key: string]: string } = {
      en: "伦敦国王十字车站 (London King's Cross Station)",
      ja: "东京新宿车站西口附近 (Near Shinjuku Station West Exit, Tokyo)",
      ko: "首尔明洞商业街中心 (Myeongdong Street, Seoul)",
      fr: "巴黎香榭丽舍大街 42 号 (42 Av. des Champs-Élysées, Paris)",
      es: "马德里太阳门广场 (Puerta del Sol, Madrid)",
      th: "曼谷暹罗百丽宫门口 (Siam Paragon, Bangkok)",
    };

    const defaultCity = fallbackCities[selectedLang.code] || "国外当前主要街区";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          // Formulate a highly informative GPS string
          const gpsString = `当前真实GPS定位：北纬 ${lat.toFixed(5)}°, 东经 ${lon.toFixed(5)}° (精度范围: ${Math.round(accuracy)}米内，推荐展示此坐标给救援人员)`;
          
          setCurrentLoc(gpsString);
          setIsLocating(false);
        },
        async (error) => {
          console.warn("Geolocation failed or denied, trying IP-based location:", error);
          
          // High quality IP-based fallback
          try {
            const ipRes = await fetch("https://ipapi.co/json/");
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.city && ipData.country_name) {
                const timeStr = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                const latVal = typeof ipData.latitude === "number" ? ipData.latitude.toFixed(4) : ipData.latitude;
                const lonVal = typeof ipData.longitude === "number" ? ipData.longitude.toFixed(4) : ipData.longitude;
                setCurrentLoc(`当前网络IP定位：${ipData.city}, ${ipData.country_name} (纬度: ${latVal}, 经度: ${lonVal} · 已于 ${timeStr} 刷新)`);
                setIsLocating(false);
                return;
              }
            }
          } catch (ipErr) {
            console.error("IP geolocation also failed:", ipErr);
          }

          const timeStr = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          setCurrentLoc(`${defaultCity} (模拟定位 · 已于 ${timeStr} 刷新)`);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      const timeStr = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setCurrentLoc(`${defaultCity} (不支持GPS · 已于 ${timeStr} 刷新)`);
      setIsLocating(false);
    }
  };

  // Set initial position based on language
  useEffect(() => {
    handleAutoLocate();
  }, [selectedLang]);

  // Handle Medical Help Generation
  const handleSicknessHelp = async (symptomKey: string, customText?: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    const preset = OFFLINE_SICKNESS_TEMPLATES[symptomKey];
    const symptomName = preset ? preset.name : "身体极度不适";
    const details = customText || "";

    if (isOffline) {
      // Offline fallback
      setTimeout(() => {
        if (preset && preset.translations[selectedLang.code]) {
          const trans = preset.translations[selectedLang.code];
          setHelpCardData({
            title: symptomName,
            translatedHelp: trans.translatedHelp,
            pronunciation: trans.pronunciation,
            explanation: trans.explanation,
            emergencyTip: trans.emergencyTip,
            localLang: selectedLang.code,
            isOffline: true
          });
          setModalOpen(true);
        } else {
          // General offline help
          setHelpCardData({
            title: symptomName,
            translatedHelp: `Hello, I am feeling extremely unwell. Please help me contact a doctor or call an ambulance. (Language: ${selectedLang.name})`,
            explanation: "你好，我感觉非常不舒服。请帮我联系医生或拨打救护车。",
            localLang: selectedLang.code,
            isOffline: true
          });
          setModalOpen(true);
        }
        setIsLoading(false);
      }, 400);
    } else {
      // Online API call with 6-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch("/api/translate/medical", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            symptom: symptomName,
            customDetails: details,
            targetLang: selectedLang.name
          })
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error("AI生成失败，建议切换为『弱网离线预设』模式");
        }
        const data = await response.json();
        setHelpCardData({
          title: symptomName,
          translatedHelp: data.translatedHelp,
          pronunciation: data.pronunciation,
          explanation: data.explanation,
          emergencyTip: data.emergencyTip,
          localLang: selectedLang.code,
          isOffline: false
        });
        setModalOpen(true);
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error("Online Sickness Help Generation failed:", err);
        
        // Automatic high-quality offline fallback
        setIsOffline(true);
        setErrorMsg("在线AI连接超时或失败，已为您自动无缝降级至『离线预置急救词库』，保障生命应急防线不中断！");
        
        if (preset && preset.translations[selectedLang.code]) {
          const trans = preset.translations[selectedLang.code];
          setHelpCardData({
            title: symptomName,
            translatedHelp: trans.translatedHelp,
            pronunciation: trans.pronunciation,
            explanation: trans.explanation,
            emergencyTip: trans.emergencyTip,
            localLang: selectedLang.code,
            isOffline: true
          });
          setModalOpen(true);
        } else {
          setHelpCardData({
            title: symptomName,
            translatedHelp: `Hello, I am feeling extremely unwell. Please help me contact a doctor or call an ambulance. (Language: ${selectedLang.name})`,
            explanation: "你好，我感觉非常不舒服。请帮我联系医生或拨打救护车。",
            localLang: selectedLang.code,
            isOffline: true
          });
          setModalOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Lost Help Generation
  const handleLostHelp = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const helpLabel = lostType === "hotel" ? "带我去酒店" : lostType === "family" ? "联系家人" : "帮我叫出租车";
    const destinationText = lostType === "hotel" ? hotelAddress : lostType === "family" ? `家人的电话: ${familyPhone}` : "最近的出租车站/地铁站";

    if (isOffline) {
      setTimeout(() => {
        let helpText = "";
        let expText = "";
        if (lostType === "hotel") {
          helpText = `${OFFLINE_LOST_TEMPLATES.hotel.text} \n👉 "${hotelAddress}"`;
          expText = `${OFFLINE_LOST_TEMPLATES.hotel.title}: ${OFFLINE_LOST_TEMPLATES.hotel.text} (包含酒店地址)`;
        } else if (lostType === "family") {
          helpText = `${OFFLINE_LOST_TEMPLATES.family.text} \n👉 "${familyPhone}"`;
          expText = `${OFFLINE_LOST_TEMPLATES.family.title}: ${OFFLINE_LOST_TEMPLATES.family.text} (包含紧急电话)`;
        } else {
          helpText = `${OFFLINE_LOST_TEMPLATES.taxi.text}`;
          expText = `帮我叫出租车: ${OFFLINE_LOST_TEMPLATES.taxi.text}`;
        }

        setHelpCardData({
          title: helpLabel,
          translatedHelp: helpText,
          explanation: expText,
          mapPrompt: "Could you please point on the map? / 请在地图上帮我指路。",
          localLang: selectedLang.code,
          isOffline: true
        });
        setModalOpen(true);
        setIsLoading(false);
      }, 400);
    } else {
      // Online API call with 6-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch("/api/translate/lost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            helpType: helpLabel,
            destination: destinationText,
            currentLoc: currentLoc,
            targetLang: selectedLang.name,
            contactInfo: familyPhone
          })
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("AI生成失败，请切换为离线预设模式");
        const data = await response.json();
        setHelpCardData({
          title: helpLabel,
          translatedHelp: data.translatedHelp,
          explanation: data.explanation,
          mapPrompt: data.mapPrompt,
          localLang: selectedLang.code,
          isOffline: false
        });
        setModalOpen(true);
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error("Online Lost Help Generation failed:", err);
        
        // Automatic high-quality offline fallback
        setIsOffline(true);
        setErrorMsg("在线AI连接超时或失败，已为您自动无缝降级至『离线预置出行词库』，保障救急服务不中断！");
        
        let helpText = "";
        let expText = "";
        if (lostType === "hotel") {
          helpText = `${OFFLINE_LOST_TEMPLATES.hotel.text} \n👉 "${hotelAddress}"`;
          expText = `${OFFLINE_LOST_TEMPLATES.hotel.title}: ${OFFLINE_LOST_TEMPLATES.hotel.text} (包含酒店地址)`;
        } else if (lostType === "family") {
          helpText = `${OFFLINE_LOST_TEMPLATES.family.text} \n👉 "${familyPhone}"`;
          expText = `${OFFLINE_LOST_TEMPLATES.family.title}: ${OFFLINE_LOST_TEMPLATES.family.text} (包含紧急电话)`;
        } else {
          helpText = `${OFFLINE_LOST_TEMPLATES.taxi.text}`;
          expText = `帮我叫出租车: ${OFFLINE_LOST_TEMPLATES.taxi.text}`;
        }

        setHelpCardData({
          title: helpLabel,
          translatedHelp: helpText,
          explanation: expText,
          mapPrompt: "Could you please point on the map? / 请在地图上帮我指路。",
          localLang: selectedLang.code,
          isOffline: true
        });
        setModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Family Text Generation
  const handleFamilyHelp = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const scenarioText = OFFLINE_FAMILY_TEMPLATES[familyScenario]?.name || "日常沟通";

    if (isOffline) {
      setTimeout(() => {
        const preset = OFFLINE_FAMILY_TEMPLATES[familyScenario];
        setFamilyResult({
          familyVersion: `${preset.familyVersion}\n\n[紧急联系电话: ${familyPhone}]\n[我当前大概位置: ${currentLoc}]`,
          localVersion: `${preset.localVersion}\n\n[My Emergency Contact: ${familyPhone}]`,
          suggestions: "建议使用短信直接发送，或者通过微信/WhatsApp将文字复制发送。"
        });
        setIsLoading(false);
      }, 400);
    } else {
      // Online API call with 6-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch("/api/translate/family", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            situation: scenarioText + `。目前位置：${currentLoc}。紧急联系电话：${familyPhone}`,
            familyLang: "中文 (Chinese)",
            localLang: selectedLang.name,
            contactPhone: familyPhone
          })
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("AI生成失败");
        const data = await response.json();
        setFamilyResult({
          familyVersion: data.familyVersion,
          localVersion: data.localVersion,
          suggestions: data.suggestions
        });
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error("Online Family Help Generation failed:", err);
        
        // Automatic high-quality offline fallback
        setIsOffline(true);
        setErrorMsg("在线AI连接超时或失败，已为您自动无缝降级至『离线预置联络预设』，保障救急沟通不中断！");
        
        const preset = OFFLINE_FAMILY_TEMPLATES[familyScenario];
        if (preset) {
          setFamilyResult({
            familyVersion: `${preset.familyVersion}\n\n[紧急联系电话: ${familyPhone}]\n[我当前大概位置: ${currentLoc}]`,
            localVersion: `${preset.localVersion}\n\n[My Emergency Contact: ${familyPhone}]`,
            suggestions: "建议使用短信直接发送，或者通过微信/WhatsApp将文字复制发送。"
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Trigger family generation automatically on tab select
  useEffect(() => {
    if (currentView === "family") {
      handleFamilyHelp();
    }
  }, [familyScenario, currentView, selectedLang, isOffline]);

  // Handle Photo Upload & Analyze
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setCapturedImage(base64);
      analyzePhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  // Run Gemini vision analysis
  const analyzePhoto = async (base64Data: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setPhotoResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("/api/translate/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          imageBase64: base64Data,
          targetLang: selectedLang.name
        })
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error("图片识别失败。如果是弱网，请直接在下方选择『测试样张』进行一键模拟识别体验！");
      }
      const data = await response.json();
      setPhotoResult(data);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Online Photo Analysis failed:", err);
      if (err.name === 'AbortError') {
        setErrorMsg("图片分析超时。如果是弱网环境，请直接在下方点击『极速演示样张』进行一键秒级模拟识别！");
      } else {
        setErrorMsg(err.message || "图片分析出错，可能是网络问题。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Use Preset Test Photo
  const handleUsePresetPhoto = (preset: typeof SAMPLE_PHOTOS[0]) => {
    setCapturedImage(preset.img);
    setIsLoading(true);
    setErrorMsg(null);
    setPhotoResult(null);

    // Simulate instant response from local mock for smooth testing
    setTimeout(() => {
      setPhotoResult(preset.mockResult);
      setIsLoading(false);
    }, 800);
  };

  // Camera capture methods
  const startCamera = async () => {
    setCameraActive(true);
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setErrorMsg("无法调用后置摄像头。请直接使用『选择文件/上传拍照』或点击下方『极速测试样张』。");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg");
        setCapturedImage(base64);
        stopCamera();
        analyzePhoto(base64);
      }
    }
  };

  // Helper copy function for generic texts
  const copyToClipboard = (text: string, type: "family" | "local") => {
    navigator.clipboard.writeText(text);
    setFamilyCopied(type);
    setTimeout(() => setFamilyCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col antialiased">
      
      {/* 1. Header & Navigation Top bar */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white shadow-md">
        <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-yellow-500 flex items-center justify-center shadow-inner">
              <span className="text-stone-950 font-black text-xl tracking-tighter">CL</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">CareLite 求助助手</h1>
              <p className="text-[10px] text-stone-400 font-medium">弱网适老多语应急沟通系统</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* PPT Presentation Button */}
            <button
              id="btn-toggle-ppt"
              onClick={() => setShowPPT(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 border border-stone-700 text-yellow-400 flex items-center gap-1 transition-all active:scale-95"
              title="查看 CareLite 项目介绍 PPT"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>项目 PPT</span>
            </button>

            {/* Direct PPTX File Download Button */}
            <button
              id="btn-download-pptx-direct"
              onClick={downloadProjectPPTX}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 text-white flex items-center gap-1 transition-all active:scale-95"
              title="下载单独的 Microsoft PowerPoint (.pptx) 演示文件"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载 PPTX</span>
            </button>

            {/* Network Mode Status Toggle */}
            <button
              id="btn-toggle-network"
              onClick={() => setIsOffline(!isOffline)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${isOffline ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}
              title="切换联网或离线预设模式"
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>弱网离线</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>AI 联网</span>
                </>
              )}
            </button>

            {/* Config Profile Button */}
            <button
              id="btn-toggle-settings"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl border transition-all ${showSettings ? "bg-yellow-500 border-yellow-500 text-stone-950" : "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700"}`}
              title="预设紧急信息 (家人电话、酒店地址)"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Urgent Settings Banner (Draw-down settings) */}
      {showSettings && (
        <div className="bg-yellow-50 border-b-2 border-yellow-300 text-stone-900 transition-all duration-300">
          <div className="max-w-xl mx-auto p-4 space-y-3 text-left">
            <h3 className="text-sm font-bold text-yellow-900 flex items-center gap-1">
              <Info className="w-4 h-4 fill-yellow-100" />
              <span>配置老人与行程信息（求助卡将自动带入此内容）</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">使用长辈称呼及健康状况</label>
                <input
                  id="input-user-profile"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none font-medium text-stone-900"
                  placeholder="例: 张建国 (65岁, 有轻微高血压)"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">家人紧急电话</label>
                  <input
                    id="input-family-phone"
                    type="text"
                    value={familyPhone}
                    onChange={(e) => setFamilyPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-stone-900"
                    placeholder="请输入国内家人手机号"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">当前入住酒店 (中文/英文)</label>
                  <input
                    id="input-hotel-address"
                    type="text"
                    value={hotelAddress}
                    onChange={(e) => setHotelAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-stone-800 text-xs font-medium"
                    placeholder="请输入国外酒店英文地址"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-stone-500">
                💡 信息保存在本地，翻译时AI会自动用于提供最佳救援语境。
              </span>
              <button
                id="btn-save-settings"
                onClick={() => setShowSettings(false)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-stone-950 rounded-lg text-xs font-bold shadow-sm"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Container Area */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 pb-20 space-y-5">
        
        {/* Error notification banner */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2 text-left animate-shake">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">发生状况: </span>
              <span>{errorMsg}</span>
              <button
                id="btn-error-offline-switch"
                onClick={() => {
                  setIsOffline(true);
                  setErrorMsg(null);
                }}
                className="block mt-1 font-bold text-red-950 underline hover:text-red-900 text-[11px]"
              >
                🚨 一键切换为“弱网离线预设”模式（无需网络秒开）
              </button>
            </div>
          </div>
        )}

        {/* Global Travel Destination Language selector (Elderly friendly large flags) */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/80 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 tracking-wider">
              🌎 选择当前旅行目的地 / TARGET LANGUAGE
            </span>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
              一键配对当地急救
            </span>
          </div>

          {/* Large buttons with flags */}
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                id={`btn-lang-${lang.code}`}
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                className={`py-2.5 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${selectedLang.code === lang.code ? "border-yellow-500 bg-yellow-50/70 font-bold" : "border-stone-200 hover:border-stone-300"}`}
              >
                <span className="text-3xl filter drop-shadow-sm">{lang.flag}</span>
                <span className="text-xs text-stone-900 font-medium">{lang.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Quick Dial Emergency Numbers of selected country */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-stone-700">
              <PhoneCall className="w-3.5 h-3.5 text-stone-500" />
              <span>当地急救电话:</span>
              <span className="font-extrabold text-stone-900 bg-red-100 text-red-800 px-1.5 py-0.5 rounded ml-1">
                🚑 救护车: {selectedLang.ambulancePhone}
              </span>
              <span className="font-extrabold text-stone-900 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ml-1">
                👮 警察: {selectedLang.policePhone}
              </span>
            </div>
            <a
              id="link-dial-emergency"
              href={`tel:${selectedLang.emergencyPhone}`}
              className="text-[11px] font-bold text-red-600 flex items-center gap-0.5 hover:underline bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg"
            >
              📞 拨打紧急救援
            </a>
          </div>
        </section>

        {/* ----------------- VIEWS SWITCHER ----------------- */}

        {/* View 1: HOME GRID ENTRANCES */}
        {currentView === "home" && (
          <section className="space-y-4">
            <div className="text-left font-bold text-stone-500 text-xs tracking-wider uppercase">
              🚨 极速紧急求助入口 (点击大按钮)
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Path 1: Sickness */}
              <button
                id="btn-goto-sickness"
                onClick={() => setCurrentView("sickness")}
                className="aspect-[4/3] bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl shadow-md flex flex-col justify-between text-left transition-all active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute -right-3 -bottom-3 text-red-400 opacity-20 group-hover:scale-110 transition-transform">
                  <Heart className="w-24 h-24 stroke-[1.5]" />
                </div>
                <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">身体不舒服</h3>
                  <p className="text-[11px] text-red-100">头晕/胸痛/摔倒/就医</p>
                </div>
              </button>

              {/* Path 2: Lost */}
              <button
                id="btn-goto-lost"
                onClick={() => setCurrentView("lost")}
                className="aspect-[4/3] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-md flex flex-col justify-between text-left transition-all active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute -right-3 -bottom-3 text-blue-500 opacity-20 group-hover:scale-110 transition-transform">
                  <MapPin className="w-24 h-24 stroke-[1.5]" />
                </div>
                <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">我迷路了</h3>
                  <p className="text-[11px] text-blue-100">回酒店/叫出租车/问路</p>
                </div>
              </button>

              {/* Path 3: Family */}
              <button
                id="btn-goto-family"
                onClick={() => setCurrentView("family")}
                className="aspect-[4/3] bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-2xl shadow-md flex flex-col justify-between text-left transition-all active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute -right-3 -bottom-3 text-amber-500 opacity-20 group-hover:scale-110 transition-transform">
                  <Users className="w-24 h-24 stroke-[1.5]" />
                </div>
                <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">联系家人</h3>
                  <p className="text-[11px] text-amber-100">一键双语报平安/发短信</p>
                </div>
              </button>

              {/* Path 4: Photo Translate */}
              <button
                id="btn-goto-photo"
                onClick={() => setCurrentView("photo")}
                className="aspect-[4/3] bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl shadow-md flex flex-col justify-between text-left transition-all active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute -right-3 -bottom-3 text-emerald-500 opacity-20 group-hover:scale-110 transition-transform">
                  <Camera className="w-24 h-24 stroke-[1.5]" />
                </div>
                <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">拍照翻译</h3>
                  <p className="text-[11px] text-emerald-100">药盒/路牌/警示牌翻译</p>
                </div>
              </button>

            </div>

            {/* Offline quick emergency advice block */}
            <div className="bg-stone-800 text-white p-4 rounded-2xl text-left space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">长辈安全特别提醒</span>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                如遇身体严重不适，切勿惊慌强撑，<b>请当即坐在路边，点击左侧红色“身体不舒服”按钮，展示特大字求助卡给路过的任何人！</b>
              </p>
              <div className="text-[11px] text-stone-400 border-t border-stone-700/60 pt-2 flex justify-between items-center">
                <span>CareLite 始终提供离线备份保障</span>
                <span className="text-yellow-500">双向多语 · 极简救急</span>
              </div>
            </div>
          </section>
        )}

        {/* View 2: SICKNESS PANEL */}
        {currentView === "sickness" && (
          <section className="space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <button
                id="btn-sickness-back"
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1 text-sm font-bold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </button>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                身体不舒服求医
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/80 space-y-4">
              <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                请选择您最接近的症状 (点击后瞬时生成求助卡)：
              </h2>

              {/* Grid of symptoms */}
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(OFFLINE_SICKNESS_TEMPLATES).map((key) => {
                  const item = OFFLINE_SICKNESS_TEMPLATES[key];
                  return (
                    <button
                      id={`btn-symptom-${key}`}
                      key={key}
                      onClick={() => handleSicknessHelp(key)}
                      disabled={isLoading}
                      className="p-4 rounded-xl border border-stone-200 hover:border-red-400 hover:bg-red-50/30 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 text-center group"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        {key === "chest_pain" || key === "need_doctor" ? (
                          <Heart className="w-5 h-5 fill-current" />
                        ) : (
                          <Activity className="w-5 h-5" />
                        )}
                      </div>
                      <span className="font-extrabold text-stone-950 text-sm">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Symptom Box (Only fully supported in online mode, but works offline too) */}
              <div className="border-t border-stone-200 pt-4 space-y-2">
                <label className="block text-xs font-bold text-stone-500">
                  ✏️ 如果有其他具体难受细节，请在下方补充 (可选)：
                </label>
                <div className="flex gap-2">
                  <input
                    id="input-custom-symptom"
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="例：我痛了两个小时了，身上有湿疹"
                    className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-stone-900 font-medium"
                  />
                  <button
                    id="btn-submit-custom-symptom"
                    onClick={() => handleSicknessHelp("need_doctor", customSymptom)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1 transition-all"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>生成</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* View 3: LOST PANEL */}
        {currentView === "lost" && (
          <section className="space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <button
                id="btn-lost-back"
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1 text-sm font-bold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </button>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                我迷路了求助
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/80 space-y-4">
              <h2 className="text-lg font-extrabold text-stone-900">
                🗺️ 迷路场景配置与求助
              </h2>

              <div className="space-y-3">
                {/* 1. Select type of lost help */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">您的求助意图：</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      id="btn-lost-type-hotel"
                      onClick={() => setLostType("hotel")}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold text-center ${lostType === "hotel" ? "border-blue-500 bg-blue-50 text-blue-800" : "border-stone-200"}`}
                    >
                      🏨 带我去酒店
                    </button>
                    <button
                      id="btn-lost-type-family"
                      onClick={() => setLostType("family")}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold text-center ${lostType === "family" ? "border-blue-500 bg-blue-50 text-blue-800" : "border-stone-200"}`}
                    >
                      📞 帮我联系家人
                    </button>
                    <button
                      id="btn-lost-type-taxi"
                      onClick={() => setLostType("taxi")}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold text-center ${lostType === "taxi" ? "border-blue-500 bg-blue-50 text-blue-800" : "border-stone-200"}`}
                    >
                      🚕 帮我叫出租车
                    </button>
                  </div>
                </div>

                {/* 2. Destination Details */}
                {lostType === "hotel" && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-stone-600">酒店英文或本地地址/名：</label>
                      <button
                        id="btn-edit-hotel-shortcut"
                        onClick={() => setShowSettings(true)}
                        className="text-[10px] text-blue-600 font-bold"
                      >
                        (修改预设)
                      </button>
                    </div>
                    <textarea
                      id="textarea-hotel-address"
                      rows={2}
                      value={hotelAddress}
                      onChange={(e) => setHotelAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-medium"
                      placeholder="例: APA Hotel Shinjuku Kabukicho, Tokyo 160-0021"
                    />
                  </div>
                )}

                {lostType === "family" && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-stone-600">需要拨打的电话号码：</label>
                      <button
                        id="btn-edit-family-shortcut"
                        onClick={() => setShowSettings(true)}
                        className="text-[10px] text-blue-600 font-bold"
                      >
                        (修改预设)
                      </button>
                    </div>
                    <input
                      id="input-lost-family-phone"
                      type="text"
                      value={familyPhone}
                      onChange={(e) => setFamilyPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      placeholder="国内家人号码或境外导游号码"
                    />
                  </div>
                )}

                {/* 3. Current Location Helper */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      <span>我的大致当前位置：</span>
                    </span>
                    <button
                      id="btn-trigger-gps"
                      onClick={handleAutoLocate}
                      disabled={isLocating}
                      className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLocating ? "animate-spin" : ""}`} />
                      <span>{isLocating ? "自动定位中..." : "重新定位GPS"}</span>
                    </button>
                  </div>
                  <input
                    id="input-current-location"
                    type="text"
                    value={currentLoc}
                    onChange={(e) => setCurrentLoc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-800"
                    placeholder="请输入或由GPS自动载入"
                  />
                </div>
              </div>

              {/* Generate Lost Help Button */}
              <button
                id="btn-generate-lost-card"
                onClick={handleLostHelp}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 fill-current" />
                )}
                <span>瞬时生成 {selectedLang.flag} 语言求助卡</span>
              </button>
            </div>
          </section>
        )}

        {/* View 4: FAMILY TEXT PANEL */}
        {currentView === "family" && (
          <section className="space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <button
                id="btn-family-back"
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1 text-sm font-bold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </button>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                双语联系家人
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/80 space-y-4">
              <h2 className="text-lg font-extrabold text-stone-900">
                👴 选择当前状态，快速向家人发报：
              </h2>

              {/* Select scenario template */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(OFFLINE_FAMILY_TEMPLATES).map((key) => {
                  const item = OFFLINE_FAMILY_TEMPLATES[key as any];
                  return (
                    <button
                      id={`btn-family-scenario-${key}`}
                      key={key}
                      onClick={() => setFamilyScenario(key as any)}
                      className={`p-2 rounded-lg border text-xs font-bold text-center ${familyScenario === key ? "border-amber-500 bg-amber-50 text-amber-800" : "border-stone-200"}`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>

              {/* Loader */}
              {isLoading && (
                <div className="py-8 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                  <span className="text-xs text-stone-500 font-bold">正在用双语为您组织最安心的消息...</span>
                </div>
              )}

              {/* Dual Language results */}
              {!isLoading && familyResult && (
                <div className="space-y-4">
                  {/* Family Version (Chinese) */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        发送给中国家人的中文版：
                      </span>
                      <button
                        id="btn-copy-family-chinese"
                        onClick={() => copyToClipboard(familyResult.familyVersion, "family")}
                        className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 bg-white border px-2 py-1 rounded"
                      >
                        {familyCopied === "family" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                        <span>{familyCopied === "family" ? "已复制" : "复制文字"}</span>
                      </button>
                    </div>
                    <p className="text-sm text-stone-800 font-medium leading-relaxed bg-white p-2.5 rounded border border-stone-200/60 whitespace-pre-line text-left">
                      {familyResult.familyVersion}
                    </p>
                  </div>

                  {/* Local Version (Foreign Language) */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full">
                        出示或发给当地志愿者的{selectedLang.name.split(" ")[0]}版：
                      </span>
                      <button
                        id="btn-copy-family-local"
                        onClick={() => copyToClipboard(familyResult.localVersion, "local")}
                        className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 bg-white border px-2 py-1 rounded"
                      >
                        {familyCopied === "local" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                        <span>{familyCopied === "local" ? "已复制" : "复制"}</span>
                      </button>
                    </div>
                    <p className="text-sm text-stone-800 font-bold leading-relaxed bg-white p-2.5 rounded border border-stone-200/60 text-left">
                      {familyResult.localVersion}
                    </p>
                  </div>

                  {/* One-click Action Triggers */}
                  <div className="pt-2 border-t border-stone-200 space-y-2">
                    <div className="text-xs font-bold text-stone-500">
                      📲 手机一键发送方式：
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        id="link-sms-family"
                        href={`sms:${familyPhone}?body=${encodeURIComponent(familyResult.familyVersion)}`}
                        className="py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>呼出短信直接发送</span>
                      </a>
                      <a
                        id="link-whatsapp-family"
                        href={`https://wa.me/${familyPhone.replace(/-|\s/g, "")}?text=${encodeURIComponent(familyResult.familyVersion)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>通过 WhatsApp 发送</span>
                      </a>
                    </div>
                    <div className="text-[10px] text-stone-400 bg-stone-100 p-2.5 rounded-lg">
                      <b>💡 提示:</b> {familyResult.suggestions}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* View 5: PHOTO TRANSLATE PANEL */}
        {currentView === "photo" && (
          <section className="space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <button
                id="btn-photo-back"
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1 text-sm font-bold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </button>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                拍照识图求助
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/80 space-y-4">
              <h2 className="text-base font-extrabold text-stone-900">
                📷 拍下看不懂的药盒、警示牌、医院单据
              </h2>

              {/* Camera view or file selector container */}
              <div className="border-2 border-dashed border-stone-300 rounded-xl overflow-hidden bg-stone-50 min-h-[220px] flex flex-col items-center justify-center p-4 relative">
                
                {cameraActive ? (
                  <div className="w-full flex flex-col items-center gap-2">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full max-h-[300px] bg-black rounded-lg object-cover" 
                    />
                    <div className="flex gap-2">
                      <button
                        id="btn-camera-capture"
                        onClick={capturePhoto}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow"
                      >
                        📸 拍照 (CAPTURE)
                      </button>
                      <button
                        id="btn-camera-stop"
                        onClick={stopCamera}
                        className="px-4 py-2 bg-stone-500 hover:bg-stone-600 text-white rounded-xl font-bold text-sm"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : capturedImage ? (
                  <div className="w-full flex flex-col items-center gap-3">
                    <div className="relative max-h-[200px] overflow-hidden rounded-lg border border-stone-300">
                      <img 
                        src={capturedImage} 
                        alt="Captured request" 
                        className="max-h-[200px] object-contain" 
                      />
                      <button
                        id="btn-clear-photo"
                        onClick={() => {
                          setCapturedImage(null);
                          setPhotoResult(null);
                        }}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1 rounded-full text-xs font-bold"
                      >
                        ✕ 清除图片
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">当前预览图</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-stone-900">请选择照片或开启相机</p>
                      <p className="text-xs text-stone-400 mt-1">支持实时拍照或从手机相册中选择</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
                      {/* Live Camera Button */}
                      <button
                        id="btn-trigger-camera"
                        onClick={startCamera}
                        className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>开启相机实时拍照</span>
                      </button>

                      {/* File Uploader Button */}
                      <label className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer text-center">
                        <Upload className="w-4 h-4" />
                        <span>从手机相册选择</span>
                        <input
                          id="input-file-photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick sample tests specifically for weak networks or demoing offline capabilities */}
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 space-y-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                  ⚡ 极速演示样张 (点击一键模拟识别)
                </span>
                <p className="text-[11px] text-stone-500">
                  没有药盒或在室内测试时，可以点击以下预设样张进行一秒模拟分析体验：
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {SAMPLE_PHOTOS.map((preset) => (
                    <button
                      id={`btn-preset-photo-${preset.id}`}
                      key={preset.id}
                      onClick={() => handleUsePresetPhoto(preset)}
                      className="p-2 bg-white border border-stone-200 hover:border-emerald-500 rounded-lg text-left transition-all active:scale-95 flex items-center gap-2"
                    >
                      <img src={preset.img} className="w-10 h-10 object-cover rounded" alt="" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-stone-950 truncate">{preset.name}</div>
                        <div className="text-[9px] text-stone-400 truncate">{preset.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vision translation response container */}
              {isLoading && (
                <div className="py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-xs font-bold text-stone-500">Gemini 智能眼部正在识读图片中的异国文字...</p>
                </div>
              )}

              {!isLoading && photoResult && (
                <div className="p-4 bg-stone-900 text-white rounded-xl space-y-4 text-left">
                  <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-bold border-b border-stone-800 pb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span>识别结果: {photoResult.detectedTitle}</span>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block mb-1">
                        这是什么意思 / WHAT IT SAYS
                      </span>
                      <p className="text-sm text-stone-200 leading-relaxed font-medium">
                        {photoResult.meaning}
                      </p>
                    </div>

                    <div className="bg-stone-800 p-3 rounded-lg border border-stone-700">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                        长辈应该怎么做 / ACTIONABLE ADVICE
                      </span>
                      <p className="text-sm text-emerald-100 font-extrabold leading-relaxed">
                        {photoResult.action}
                      </p>
                    </div>
                  </div>

                  {/* Generate card based on photo result button */}
                  <button
                    id="btn-photo-generate-help-card"
                    onClick={() => {
                      setHelpCardData({
                        title: photoResult.detectedTitle,
                        translatedHelp: `Hello, I need help with this. (Ref: ${photoResult.detectedTitle})`,
                        explanation: `照片翻译结果：${photoResult.meaning}。行动指南：${photoResult.action}`,
                        localLang: selectedLang.code,
                        isOffline: false
                      });
                      setModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
                  >
                    <span>👉 将上述翻译制成大字求助卡以出示他人</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* 4. Bottom Tab Bar Navigation (Elderly convenient large buttons) */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg">
        <div className="max-w-xl mx-auto px-4 py-2 grid grid-cols-5 gap-1">
          <button
            id="tab-home"
            onClick={() => {
              setCurrentView("home");
              setErrorMsg(null);
            }}
            className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${currentView === "home" ? "text-yellow-600 bg-yellow-50 font-bold" : "text-stone-500 hover:text-stone-700"}`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px] mt-1">主页/急救</span>
          </button>

          <button
            id="tab-sickness"
            onClick={() => {
              setCurrentView("sickness");
              setErrorMsg(null);
            }}
            className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${currentView === "sickness" ? "text-red-600 bg-red-50 font-bold" : "text-stone-500 hover:text-stone-700"}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] mt-1">身体不适</span>
          </button>

          <button
            id="tab-lost"
            onClick={() => {
              setCurrentView("lost");
              setErrorMsg(null);
            }}
            className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${currentView === "lost" ? "text-blue-600 bg-blue-50 font-bold" : "text-stone-500 hover:text-stone-700"}`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] mt-1">我迷路了</span>
          </button>

          <button
            id="tab-family"
            onClick={() => {
              setCurrentView("family");
              setErrorMsg(null);
            }}
            className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${currentView === "family" ? "text-amber-600 bg-amber-50 font-bold" : "text-stone-500 hover:text-stone-700"}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1">联系家人</span>
          </button>

          <button
            id="tab-photo"
            onClick={() => {
              setCurrentView("photo");
              setErrorMsg(null);
            }}
            className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${currentView === "photo" ? "text-emerald-600 bg-emerald-50 font-bold" : "text-stone-500 hover:text-stone-700"}`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] mt-1">拍照翻译</span>
          </button>
        </div>
      </footer>

      {/* 5. Giant Emergency Translation Card Modal popup */}
      <HelpCardModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        data={helpCardData} 
      />

      {/* 6. Project Intro PPT Modal presentation */}
      <ProjectPPT 
        isOpen={showPPT} 
        onClose={() => setShowPPT(false)} 
      />

    </div>
  );
}
