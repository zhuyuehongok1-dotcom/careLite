import { useState, useEffect, ReactNode } from "react";
import { 
  ChevronLeft, ChevronRight, X, Play, Pause, RefreshCw, 
  Sparkles, Smartphone, ShieldCheck, HeartPulse, MapPin, 
  Activity, Users, Camera, Mail, Layers, Landmark, Download
} from "lucide-react";
import { downloadProjectPPTX } from "../lib/pptGenerator";

interface ProjectPPTProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  icon: ReactNode;
  theme: "stone" | "emerald" | "amber" | "blue" | "red" | "indigo";
  content: ReactNode;
}

export default function ProjectPPT({ isOpen, onClose }: ProjectPPTProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      category: "项目简介 | COVER",
      title: "CareLite 弱网适老求助助手",
      subtitle: "出境长辈的“极简多语应急自救与翻译系统”",
      icon: <Sparkles className="w-10 h-10 text-yellow-400" />,
      theme: "stone",
      content: (
        <div className="space-y-6 text-center py-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold border border-yellow-500/20">
            <span>🏆 科技向善 · 银发关怀应急系统</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-stone-800/50 rounded-2xl border border-stone-700/50 text-left">
              <div className="text-2xl font-black text-white">0 门槛</div>
              <div className="text-xs text-stone-400 mt-1">
                特大号字体，全系统纯按钮交互，无任何输入干扰
              </div>
            </div>
            <div className="p-4 bg-stone-800/50 rounded-2xl border border-stone-700/50 text-left">
              <div className="text-2xl font-black text-emerald-400">双向多语</div>
              <div className="text-xs text-stone-400 mt-1">
                中文与当地语对照，一秒让外籍救援者理解长辈痛处
              </div>
            </div>
            <div className="p-4 bg-stone-800/50 rounded-2xl border border-stone-700/50 text-left">
              <div className="text-2xl font-black text-amber-400">弱网/离线</div>
              <div className="text-xs text-stone-400 mt-1">
                支持 100% 离线预置本地词库，无网络也能求助
              </div>
            </div>
          </div>
          
          <p className="text-xs text-stone-400 max-w-lg mx-auto italic mt-6 leading-relaxed">
            “帮助那些在异国他乡迷路、生病，且没有网络的中国老人们，重新与世界安全连接。”
          </p>
        </div>
      )
    },
    {
      id: 2,
      category: "痛点分析 | PAIN POINTS",
      title: "长辈异国出行的『三大致命困境』",
      subtitle: "当我们的父母身处海外，他们可能正经历：",
      icon: <Activity className="w-10 h-10 text-red-400" />,
      theme: "red",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div className="p-5 bg-stone-900/60 rounded-2xl border-l-4 border-red-500 space-y-2">
            <div className="text-red-400 font-bold text-sm">1. 沟通“聋哑”障碍</div>
            <p className="text-xs text-stone-300 leading-relaxed">
              传统的翻译软件需要输入复杂的长句、操作极其细小，或者必须输入流利的英语。长辈在紧急情况下由于紧张往往不知所措，甚至说不清自己的身体症状。
            </p>
          </div>
          <div className="p-5 bg-stone-900/60 rounded-2xl border-l-4 border-orange-500 space-y-2">
            <div className="text-orange-400 font-bold text-sm">2. 弱网/无网死角</div>
            <p className="text-xs text-stone-300 leading-relaxed">
              境外机场、地铁站、地下商场、偏远景区常伴有极差的信号。而市面上99%的AI工具高度依赖高速网络，一旦断网翻译功能完全瘫痪，直接导致失联。
            </p>
          </div>
          <div className="p-5 bg-stone-900/60 rounded-2xl border-l-4 border-yellow-500 space-y-2">
            <div className="text-yellow-400 font-bold text-sm">3. 复杂的智能鸿沟</div>
            <p className="text-xs text-stone-300 leading-relaxed">
              繁复的二级菜单、弹窗广告、繁琐的定位和输入让老人望而却步。他们需要的是一个“按一下，大字直接展示”的物理级救命道具。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      category: "核心设计 | SOLUTIONS",
      title: "CareLite 的极简适老法则",
      subtitle: "专为出境长辈度身定制的“五大安全设计”",
      icon: <Smartphone className="w-10 h-10 text-emerald-400" />,
      theme: "emerald",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="flex items-start gap-3 p-3 bg-stone-900/40 rounded-xl border border-stone-800">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              01
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-200">全屏大字求助卡</h4>
              <p className="text-[11px] text-stone-400 mt-1">一键生成双语对比的巨幅大字翻译卡，支持手机横屏出示或快速递给当地人看。</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-stone-900/40 rounded-xl border border-stone-800">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              02
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-200">一键离线备用机制</h4>
              <p className="text-[11px] text-stone-400 mt-1">顶部一键可随时切换为「弱网离线模式」，调用完全预置的本地翻译词库，零延迟极速可用。</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-stone-900/40 rounded-xl border border-stone-800">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              03
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-200">真实GPS定位 + 应急短信</h4>
              <p className="text-[11px] text-stone-400 mt-1">支持高精度GPS实时刷新，一键格式化中文说明并呼出原生短信/WhatsApp，让国内家人实时放心。</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-stone-900/40 rounded-xl border border-stone-800">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-xs shrink-0">
              04
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-200">AI 智能相机翻译（Gemini 眼）</h4>
              <p className="text-[11px] text-stone-400 mt-1">拍照一秒识读药盒、警告标识或路标。在网络通畅时提供顶尖AI解析，在离线状态下提供模拟识别。</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      category: "功能模块 | DETAILED MODULES",
      title: "五大功能场景：全方位保驾护航",
      subtitle: "覆盖老人出游所有高频痛点：",
      icon: <Layers className="w-10 h-10 text-blue-400" />,
      theme: "blue",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-2 text-center">
          <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800 space-y-1.5">
            <div className="w-8 h-8 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto text-xs font-bold">
              1
            </div>
            <div className="text-xs font-bold text-stone-200">一触即发求救</div>
            <div className="text-[10px] text-stone-400">大字直接读，双向互照</div>
          </div>

          <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800 space-y-1.5">
            <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-xs font-bold">
              2
            </div>
            <div className="text-xs font-bold text-stone-200">身体病痛定位</div>
            <div className="text-[10px] text-stone-400">痛点定位+常见症状速选</div>
          </div>

          <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800 space-y-1.5">
            <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto text-xs font-bold">
              3
            </div>
            <div className="text-xs font-bold text-stone-200">迷路GPS自救</div>
            <div className="text-[10px] text-stone-400">实时精准坐标+酒店一键呼</div>
          </div>

          <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800 space-y-1.5">
            <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto text-xs font-bold">
              4
            </div>
            <div className="text-xs font-bold text-stone-200">家人极速联络</div>
            <div className="text-[10px] text-stone-400">原生短信/社交软件双向呼</div>
          </div>

          <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800 space-y-1.5 col-span-2 md:col-span-1">
            <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xs font-bold">
              5
            </div>
            <div className="text-xs font-bold text-stone-200">智能拍照求助</div>
            <div className="text-[10px] text-stone-400">药盒指示牌一目了然</div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      category: "技术硬核 | TECHNOLOGY",
      title: "强健稳固：支持离线的“双向架构”",
      subtitle: "前端轻量，AI 兜底：",
      icon: <ShieldCheck className="w-10 h-10 text-indigo-400" />,
      theme: "indigo",
      content: (
        <div className="space-y-4 py-2">
          <div className="p-4 bg-stone-900/60 rounded-xl border border-stone-800 flex items-center gap-4 text-left">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-stone-200">在线智能：Gemini 3.5 实时翻译与行动指导</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                在线状态下，智能根据长辈填写的酒店地址、个人健康历史、目的地习俗，智能生成最贴心的双语沟通卡，包含注音、地道语法和急救提示。
              </p>
            </div>
          </div>

          <div className="p-4 bg-stone-900/60 rounded-xl border border-stone-800 flex items-center gap-4 text-left">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-stone-200">离线硬核：静态高压缩率双向卡片引擎</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                在断网瞬间，依靠本包内置的紧凑语言数据库（日语、韩语、英语、西班牙语、法语、泰语等）。哪怕是孤岛断网环境，照样秒级展现最标准的求救短句。
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      category: "社会价值 | SOCIAL VALUES",
      title: "科技向善，温暖每一个银发家庭",
      subtitle: "CareLite，让出境不再孤立无援",
      icon: <HeartPulse className="w-10 h-10 text-yellow-400" />,
      theme: "stone",
      content: (
        <div className="space-y-6 text-center py-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-stone-300 font-bold text-sm leading-relaxed">
              “当我们工作忙碌无法陪伴时，
              让这个极简的应急助手，
              成为长辈口袋里最后一道坚实的安全保障。”
            </div>
            <div className="h-px bg-stone-800 w-2/3 mx-auto" />
            <div className="grid grid-cols-3 gap-2 text-stone-400 text-[11px]">
              <div>
                <span className="block text-white font-extrabold text-sm">100%</span>
                <span>开箱即用</span>
              </div>
              <div>
                <span className="block text-white font-extrabold text-sm">0门槛</span>
                <span>纯按钮适老设计</span>
              </div>
              <div>
                <span className="block text-white font-extrabold text-sm">安全</span>
                <span>隐私不外泄</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto scroll effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  if (!isOpen) return null;

  const activeSlide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4">
      {/* PPT Window */}
      <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header bar */}
        <div className="px-6 py-4 bg-stone-950/80 border-b border-stone-800/80 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center font-black text-xs text-stone-950">
              PPT
            </div>
            <span className="text-xs text-stone-300 font-bold tracking-wider">CareLite 智能产品介绍幻灯片 (PPT 模式)</span>
          </div>

          <button 
            id="btn-close-ppt"
            onClick={onClose}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Stage Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:p-12 flex flex-col justify-between min-h-[350px]">
          
          {/* Top category, index count & icon */}
          <div className="flex justify-between items-center shrink-0">
            <span className="text-[11px] font-mono tracking-widest text-stone-500 font-bold uppercase">
              {activeSlide.category}
            </span>
            <span className="text-xs font-mono text-stone-500 font-extrabold">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>

          {/* Core slide layout */}
          <div className="my-auto space-y-6 pt-4 pb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-left">
              <div className="shrink-0 p-3.5 bg-stone-800 rounded-2xl border border-stone-700/60 shadow-lg">
                {activeSlide.icon}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {activeSlide.title}
                </h3>
                <p className="text-xs md:text-sm text-stone-400 font-medium mt-1">
                  {activeSlide.subtitle}
                </p>
              </div>
            </div>

            {/* Slide Body */}
            <div className="pt-4 border-t border-stone-800/60">
              {activeSlide.content}
            </div>
          </div>

          {/* Bottom quick dots selector */}
          <div className="flex justify-center gap-1.5 shrink-0 pt-4">
            {slides.map((_, idx) => (
              <button
                id={`btn-ppt-dot-${idx}`}
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-350 ${idx === currentSlide ? "w-8 bg-yellow-500" : "w-2 bg-stone-700 hover:bg-stone-600"}`}
                title={`跳转至第 ${idx + 1} 页`}
              />
            ))}
          </div>

        </div>

        {/* Slide Controls Footer bar */}
        <div className="px-6 py-4 bg-stone-950/80 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          
          {/* Left: Auto-play Toggle & Download */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              id="btn-ppt-play-toggle"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${isPlaying ? "bg-amber-600 text-white" : "bg-stone-800 hover:bg-stone-700 text-stone-300"}`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>暂停自动轮播</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>自动播放 PPT</span>
                </>
              )}
            </button>

            <button
              id="btn-ppt-download"
              onClick={downloadProjectPPTX}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-lg active:scale-95"
              title="下载微软 PowerPoint .pptx 原生演示文稿"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载 .pptx 演示文稿文件</span>
            </button>
          </div>

          {/* Right: Manual Slide Switchers */}
          <div className="flex items-center gap-2">
            <button
              id="btn-ppt-prev"
              onClick={() => {
                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                setIsPlaying(false);
              }}
              className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一页</span>
            </button>
            <button
              id="btn-ppt-next"
              onClick={() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setIsPlaying(false);
              }}
              className="p-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold active:scale-95"
            >
              <span>下一页</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
