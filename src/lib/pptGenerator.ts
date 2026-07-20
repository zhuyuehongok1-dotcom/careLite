import pptxgen from "pptxgenjs";

export function downloadProjectPPTX() {
  const pptx = new pptxgen();
  const shapes = (pptx as any).shapes;
  
  // Set widescreen layout (16:9)
  pptx.layout = "LAYOUT_16x9";

  const fontTitle = "Microsoft YaHei";
  const fontBody = "Microsoft YaHei";
  
  // Slide 1: Cover (项目封面)
  const slide1 = pptx.addSlide();
  slide1.background = { color: "1C1917" }; // Stone-900

  // Category Tag
  slide1.addText("PROJECT OVERVIEW | 🏆 科技向善 · 银发关怀应急系统", {
    x: 0.8,
    y: 1.2,
    w: 10.0,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: "F59E0B", // Amber-500
    fontFace: fontTitle
  });

  // Main Title
  slide1.addText("CareLite 弱网适老求助助手", {
    x: 0.8,
    y: 1.8,
    w: 11.5,
    h: 1.0,
    fontSize: 38,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  // Subtitle
  slide1.addText("出境长辈的“极简多语应急自救与翻译系统”", {
    x: 0.8,
    y: 2.9,
    w: 11.5,
    h: 0.6,
    fontSize: 18,
    color: "A8A29E", // Stone-400
    fontFace: fontBody
  });

  // Three Core Pillars (Grid)
  // Pillar 1: 0门槛
  slide1.addShape(shapes.RECTANGLE, {
    x: 0.8,
    y: 3.8,
    w: 3.6,
    h: 1.8,
    fill: { color: "292524" }, // Stone-800
    line: { color: "44403C", width: 1 }
  });
  slide1.addText("⚡ 0 门槛纯按钮适老", {
    x: 1.0,
    y: 4.0,
    w: 3.2,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });
  slide1.addText("特大号字体，全系统纯物理按钮交互，无任何输入法和繁琐二级菜单干扰，上手即用。", {
    x: 1.0,
    y: 4.5,
    w: 3.2,
    h: 0.9,
    fontSize: 11,
    color: "D6D3D1",
    fontFace: fontBody
  });

  // Pillar 2: 双向多语对照
  slide1.addShape(shapes.RECTANGLE, {
    x: 4.7,
    y: 3.8,
    w: 3.6,
    h: 1.8,
    fill: { color: "292524" },
    line: { color: "44403C", width: 1 }
  });
  slide1.addText("🌐 双向多语种对照", {
    x: 4.9,
    y: 4.0,
    w: 3.2,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: "10B981", // Emerald-500
    fontFace: fontTitle
  });
  slide1.addText("中文与目的地语言（英/日/韩/法/意/泰）一秒对照，大字横屏，让外籍救援人员瞬间读懂。", {
    x: 4.9,
    y: 4.5,
    w: 3.2,
    h: 0.9,
    fontSize: 11,
    color: "D6D3D1",
    fontFace: fontBody
  });

  // Pillar 3: 100%离线兜底
  slide1.addShape(shapes.RECTANGLE, {
    x: 8.6,
    y: 3.8,
    w: 3.6,
    h: 1.8,
    fill: { color: "292524" },
    line: { color: "44403C", width: 1 }
  });
  slide1.addText("🔌 弱网与100%离线兜底", {
    x: 8.8,
    y: 4.0,
    w: 3.2,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: "EF4444", // Red-500
    fontFace: fontTitle
  });
  slide1.addText("无网/弱网自动降级至内置紧凑预置词库。无网环境依然能精准求助、精确定位与自救。", {
    x: 8.8,
    y: 4.5,
    w: 3.2,
    h: 0.9,
    fontSize: 11,
    color: "D6D3D1",
    fontFace: fontBody
  });


  // Slide 2: Pain Points (长辈出行的三大致命困境)
  const slide2 = pptx.addSlide();
  slide2.background = { color: "1C1917" };

  slide2.addText("PAIN POINTS | 痛点分析", {
    x: 0.8,
    y: 0.5,
    w: 10.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: "EF4444",
    fontFace: fontTitle
  });

  slide2.addText("长辈境外应急出行的“三大痛点死角”", {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 26,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  // Grid for Pain Points
  const painPoints = [
    {
      num: "01",
      title: "境外“聋哑”困境 · 难以自述",
      desc: "面对陌生的当地语言和极其紧张的紧急环境，长辈常常失语。常规翻译软件操作过细，无法准确传递突发疾病（如心绞痛、严重创伤）或迷路的危急状态。",
      color: "F59E0B"
    },
    {
      num: "02",
      title: "境外机场与地下 “弱网/无网”",
      desc: "出境第一站的边检通道、地铁站、偏远景区常处于无信号死角。市面上99%的在线AI模型遇到网络不畅即刻报错，让毫无离线准备的长辈陷入无援险境。",
      color: "EF4444"
    },
    {
      num: "03",
      title: "“智能鸿沟” · 紧急时刻用不来",
      desc: "主流软件塞满弹窗、需要滑屏定位或打字输入。但在遭遇身体突发异样时，老人的手部颤抖、视力受限。他们急需的是简单、字大、无任何阻碍的“物理防线”。",
      color: "3B82F6"
    }
  ];

  painPoints.forEach((p, i) => {
    const xPos = 0.8 + i * 3.9;
    
    // Background card
    slide2.addShape(shapes.RECTANGLE, {
      x: xPos,
      y: 1.8,
      w: 3.6,
      h: 4.2,
      fill: { color: "141212" },
      line: { color: "EF4444", width: 1.5 }
    });

    // Number Badge
    slide2.addText(p.num, {
      x: xPos + 0.3,
      y: 2.1,
      w: 1.0,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: p.color,
      fontFace: fontTitle
    });

    // Title
    slide2.addText(p.title, {
      x: xPos + 0.3,
      y: 2.8,
      w: 3.0,
      h: 0.5,
      fontSize: 15,
      bold: true,
      color: "FFFFFF",
      fontFace: fontTitle
    });

    // Description
    slide2.addText(p.desc, {
      x: xPos + 0.3,
      y: 3.5,
      w: 3.0,
      h: 2.2,
      fontSize: 11,
      color: "A8A29E",
      fontFace: fontBody,
      lineSpacing: 18
    });
  });


  // Slide 3: Core Solutions (极简适老法则)
  const slide3 = pptx.addSlide();
  slide3.background = { color: "1C1917" };

  slide3.addText("SOLUTIONS | 核心设计", {
    x: 0.8,
    y: 0.5,
    w: 10.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: "10B981",
    fontFace: fontTitle
  });

  slide3.addText("专为出境长辈度身定制的“五大安全设计”", {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 26,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  const solutions = [
    { title: "📢 全屏大字求助卡", desc: "点击对应痛点即可瞬间生成铺满整个屏幕的双语对比字样，大号字体不费眼，支持横屏出示或一键递给路人。" },
    { title: "🔌 一键弱网离线备用", desc: "在地铁或无网环境，顶部一键切入“离线备用”，所有高频自救词库完全在本地计算，做到绝对安全零延迟。" },
    { title: "📍 实时高精度GPS定位", desc: "真实GPS坐标一键呼出，即使老人在国外无法看懂当地街景，也能将高精度GPS直接格式化输出给施救人员。" },
    { title: "👁️ AI智能相机（Gemini眼）", desc: "一键拍照极速识别药盒说明、禁行标识或危险指示牌。智能在“云端高级解析”和“本地经典解析”间无缝切换。" },
    { title: "📞 紧急联系人快速通知", desc: "自动一键生成中英文对照的求助短信包（包含地址、现状、求助词），方便直接呼出手机短信或主流社媒发送给家人。" }
  ];

  solutions.forEach((s, i) => {
    const xPos = i < 3 ? 0.8 + i * 3.9 : 0.8 + (i - 3) * 5.9;
    const yPos = i < 3 ? 1.8 : 4.0;
    const wWidth = i < 3 ? 3.6 : 5.6;
    const hHeight = i < 3 ? 1.9 : 1.9;

    slide3.addShape(shapes.RECTANGLE, {
      x: xPos,
      y: yPos,
      w: wWidth,
      h: hHeight,
      fill: { color: "292524" },
      line: { color: "44403C", width: 1 }
    });

    slide3.addText(s.title, {
      x: xPos + 0.2,
      y: yPos + 0.2,
      w: wWidth - 0.4,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: "F59E0B",
      fontFace: fontTitle
    });

    slide3.addText(s.desc, {
      x: xPos + 0.2,
      y: yPos + 0.7,
      w: wWidth - 0.4,
      h: 1.0,
      fontSize: 11,
      color: "E7E5E4",
      fontFace: fontBody,
      lineSpacing: 16
    });
  });


  // Slide 4: Modules (五大场景功能)
  const slide4 = pptx.addSlide();
  slide4.background = { color: "1C1917" };

  slide4.addText("DETAILED MODULES | 五大功能场景", {
    x: 0.8,
    y: 0.5,
    w: 10.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: "3B82F6",
    fontFace: fontTitle
  });

  slide4.addText("全场景深度适老覆盖：让自救触手可得", {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 26,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  const modules = [
    { step: "1", title: "一触即发求救", desc: "内置迷路、买药、求医等一键高频求救短语。" },
    { step: "2", title: "身体病痛定位", desc: "独创三维红黄绿人体部位点选与病痛症状多语对照。" },
    { step: "3", title: "迷路GPS自救", desc: "实时GPS坐标精准获取，一键呼出导航或返回酒店路径。" },
    { step: "4", title: "家人极速联络", desc: "预置手机短信和WhatsApp模板，长辈位置直发，让家人安心。" },
    { step: "5", title: "智能拍照识别", desc: "药盒、公共警告等通过智能相机双向快速阅读，扫除异国路障。" }
  ];

  modules.forEach((m, i) => {
    const xPos = 0.8 + i * 2.3;
    
    slide4.addShape(shapes.RECTANGLE, {
      x: xPos,
      y: 1.8,
      w: 2.1,
      h: 4.2,
      fill: { color: "292524" },
      line: { color: "3B82F6", width: 1 }
    });

    // Badge
    slide4.addShape(shapes.OVAL, {
      x: xPos + 0.65,
      y: 2.1,
      w: 0.8,
      h: 0.8,
      fill: { color: "3B82F6" }
    });
    slide4.addText(m.step, {
      x: xPos + 0.65,
      y: 2.1,
      w: 0.8,
      h: 0.8,
      align: "center",
      valign: "middle",
      fontSize: 18,
      bold: true,
      color: "FFFFFF",
      fontFace: fontTitle
    });

    // Title
    slide4.addText(m.title, {
      x: xPos + 0.1,
      y: 3.1,
      w: 1.9,
      h: 0.4,
      align: "center",
      fontSize: 13,
      bold: true,
      color: "FFFFFF",
      fontFace: fontTitle
    });

    // Desc
    slide4.addText(m.desc, {
      x: xPos + 0.1,
      y: 3.6,
      w: 1.9,
      h: 2.2,
      align: "center",
      fontSize: 10.5,
      color: "A8A29E",
      fontFace: fontBody,
      lineSpacing: 15
    });
  });


  // Slide 5: Tech Architecture (技术架构)
  const slide5 = pptx.addSlide();
  slide5.background = { color: "1C1917" };

  slide5.addText("TECHNOLOGY | 技术架构", {
    x: 0.8,
    y: 0.5,
    w: 10.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: "6366F1",
    fontFace: fontTitle
  });

  slide5.addText("在线AI智能与本地静态离线“双剑合璧”", {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 26,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  // Online Tech Card
  slide5.addShape(shapes.RECTANGLE, {
    x: 0.8,
    y: 1.8,
    w: 5.6,
    h: 4.2,
    fill: { color: "1E1B4B" }, // Indigo shade
    line: { color: "6366F1", width: 1.5 }
  });
  slide5.addText("⚡ 在线极智：Gemini AI 求助模型", {
    x: 1.1,
    y: 2.1,
    w: 5.0,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });
  slide5.addText([
    { text: "• 深度语义翻译：", options: { bold: true, color: "818CF8" } },
    { text: "不仅仅是硬套词，能根据老人填写的本地酒店位置、个人健康基础背景等，生成逻辑精密、带有礼貌用语的当地救急表达。\n" },
    { text: "• 实时图像 analysis：", options: { bold: true, color: "818CF8" } },
    { text: "调用 Gemini 高精度多模态分析拍照图片，瞬时将海外难懂的医药说明书提炼出中文服用方法和警示危险。" }
  ], {
    x: 1.1,
    y: 2.7,
    w: 5.0,
    h: 3.1,
    fontSize: 11.5,
    color: "E2E8F0",
    fontFace: fontBody,
    lineSpacing: 18
  });

  // Offline Tech Card
  slide5.addShape(shapes.RECTANGLE, {
    x: 6.8,
    y: 1.8,
    w: 5.6,
    h: 4.2,
    fill: { color: "064E3B" }, // Emerald shade
    line: { color: "10B981", width: 1.5 }
  });
  slide5.addText("🔋 离线硬核：静态高压缩率双向卡片", {
    x: 7.1,
    y: 2.1,
    w: 5.0,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });
  slide5.addText([
    { text: "• 零网络强悍可用：", options: { bold: true, color: "34D399" } },
    { text: "将长辈出行可能遇到的高频紧急词条（疼痛表现、突发自救、迷路求指引）压缩进本地静态代码库，不加载一张图片，大小不到 2MB，离线无网秒开。\n" },
    { text: "• 物理级可靠性：", options: { bold: true, color: "34D399" } },
    { text: "不存储个人行踪，本地化GPS计算，即使遭遇极端网络瘫痪，该救命防线依然100%全功能流畅展现。" }
  ], {
    x: 7.1,
    y: 2.7,
    w: 5.0,
    h: 3.1,
    fontSize: 11.5,
    color: "ECFDF5",
    fontFace: fontBody,
    lineSpacing: 18
  });


  // Slide 6: Social Value (社会价值与结语)
  const slide6 = pptx.addSlide();
  slide6.background = { color: "1C1917" };

  slide6.addText("SOCIAL VALUE | 社会价值", {
    x: 0.8,
    y: 1.2,
    w: 10.0,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: "F59E0B",
    fontFace: fontTitle
  });

  slide6.addText("科技向善，温暖每一个银发家庭", {
    x: 0.8,
    y: 1.8,
    w: 11.5,
    h: 0.9,
    fontSize: 32,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  slide6.addText("“当我们工作忙碌，无法随时陪在出境长辈身边时，”", {
    x: 0.8,
    y: 3.0,
    w: 11.5,
    h: 0.5,
    fontSize: 16,
    color: "E7E5E4",
    fontFace: fontBody,
    italic: true
  });

  slide6.addText("“让这个极简的应急小助手，成为老人口袋里最后一道坚实的安全保障，让关怀无远弗届。”", {
    x: 0.8,
    y: 3.5,
    w: 11.5,
    h: 0.8,
    fontSize: 16,
    color: "F59E0B",
    bold: true,
    fontFace: fontBody,
    italic: true
  });

  // Footer Stats
  slide6.addShape(shapes.RECTANGLE, {
    x: 0.8,
    y: 4.8,
    w: 3.6,
    h: 1.0,
    fill: { color: "292524" }
  });
  slide6.addText("100% 适老纯物理按钮", {
    x: 0.8,
    y: 5.1,
    w: 3.6,
    h: 0.4,
    align: "center",
    fontSize: 13,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  slide6.addShape(shapes.RECTANGLE, {
    x: 4.7,
    y: 4.8,
    w: 3.6,
    h: 1.0,
    fill: { color: "292524" }
  });
  slide6.addText("2MB 离线高保真自愈库", {
    x: 4.7,
    y: 5.1,
    w: 3.6,
    h: 0.4,
    align: "center",
    fontSize: 13,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  slide6.addShape(shapes.RECTANGLE, {
    x: 8.6,
    y: 4.8,
    w: 3.6,
    h: 1.0,
    fill: { color: "292524" }
  });
  slide6.addText("隐私安全·一键触达家属", {
    x: 8.6,
    y: 5.1,
    w: 3.6,
    h: 0.4,
    align: "center",
    fontSize: 13,
    bold: true,
    color: "FFFFFF",
    fontFace: fontTitle
  });

  // Save the PPTX file
  pptx.writeFile({ fileName: "CareLite_项目介绍PPT.pptx" })
    .then(() => {
      console.log("PPTX successfully generated and downloading started.");
    })
    .catch((err) => {
      console.error("Error generating PPTX:", err);
    });
}
