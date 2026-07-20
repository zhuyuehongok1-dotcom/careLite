// TypeScript Interfaces for CareLite

export interface Language {
  code: string;
  name: string;
  flag: string;
  emergencyPhone: string;
  policePhone: string;
  ambulancePhone: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "英语 (English)", flag: "🇬🇧", emergencyPhone: "911", policePhone: "911", ambulancePhone: "911" },
  { code: "ja", name: "日语 (Japanese)", flag: "🇯🇵", emergencyPhone: "119", policePhone: "110", ambulancePhone: "119" },
  { code: "ko", name: "韩语 (Korean)", flag: "🇰🇷", emergencyPhone: "119", policePhone: "112", ambulancePhone: "119" },
  { code: "fr", name: "法语 (French)", flag: "🇫🇷", emergencyPhone: "112", policePhone: "17", ambulancePhone: "15" },
  { code: "es", name: "西班牙语 (Spanish)", flag: "🇪🇸", emergencyPhone: "112", policePhone: "091", ambulancePhone: "061" },
  { code: "th", name: "泰语 (Thai)", flag: "🇹🇭", emergencyPhone: "191", policePhone: "191", ambulancePhone: "1669" },
];

export interface HelpCardData {
  title: string;
  translatedHelp: string;
  pronunciation?: string;
  explanation: string;
  emergencyTip?: string;
  mapPrompt?: string;
  localLang: string;
  isOffline?: boolean;
}

// Symptom Template for Offline Fallback
export interface SicknessOfflineTemplate {
  [key: string]: { // symptom key e.g., "dizzy"
    name: string;
    iconName: string;
    translations: {
      [langCode: string]: {
        translatedHelp: string;
        pronunciation: string;
        explanation: string;
        emergencyTip: string;
      }
    }
  }
}

export const OFFLINE_SICKNESS_TEMPLATES: SicknessOfflineTemplate = {
  dizzy: {
    name: "头晕 / 虚脱",
    iconName: "Activity",
    translations: {
      en: {
        translatedHelp: "I am feeling very dizzy and weak, and I might faint. Please help me sit down in a safe place and call a doctor.",
        pronunciation: "Ai em feeh-ling ve-ri di-zi end week, end ai mait feint. Pliz help mi sit daun in ei seif pleis end kol ei dok-ter.",
        explanation: "我感到非常头晕虚弱，可能会晕倒。请帮我在安全的地方坐下，并帮我叫医生。",
        emergencyTip: "请立即找地方坐下或躺下，避免摔伤。深呼吸，保持通风，解开领口扣子。"
      },
      ja: {
        translatedHelp: "目眩がして、体がとてもだるいです。倒れるかもしれないので、安全な場所に座らせて、医者を呼んでいただけますか。",
        pronunciation: "Me-ma-i ga shi-te, ka-ra-da ga to-te-mo da-ru-i desu. Ta-o-re-ru ka-mo shi-re-na-i no de, an-zen na ba-sho ni su-wa-ra-se-te, i-sha o yon-de i-ta-da-ke-masu ka.",
        explanation: "我感到头晕，身体非常无力。可能会晕倒，能帮我在安全的地方坐下并叫医生吗？",
        emergencyTip: "请立即就地坐下，避免跌倒。闭眼休息，不要摇晃头部。"
      },
      ko: {
        translatedHelp: "어지럽고 몸에 힘이 전혀 없습니다. 쓰러질 것 같으니 안전한 곳에 앉혀주시고 의사를 불러주세요.",
        pronunciation: "Eo-ji-reop-go mom-e him-i jeon-hyeo eop-seumnida. Sseu-reo-jil geot gat-eu-ni an-jeon-han got-e an-hyeo-ju-si-go ui-sa-reul bul-leo-ju-se-yo.",
        explanation: "我很头晕，身体完全没有力气。好像要晕倒了，请帮我坐到安全的地方并叫医生。",
        emergencyTip: "立刻坐下，双腿微抬，促进脑部血液回流。可以小口喝温水，但如果恶心则不要喝。"
      },
      fr: {
        translatedHelp: "Je me sens très étourdi et faible, je risque de m'évanouir. S'il vous plaît, aidez-moi à m'asseoir et appelez un médecin.",
        pronunciation: "Je me san tre-ze-tur-di e febl, je risk de me-va-nu-ir. Sil vu ple, e-de mwa a ma-swar e a-ple un me-dsen.",
        explanation: "我感觉非常头晕和虚弱，可能会晕倒。请帮我坐下并叫医生。",
        emergencyTip: "请坐在阴凉通风处，缓慢深呼吸，松开紧身衣物。"
      },
      es: {
        translatedHelp: "Me siento muy mareado y débil, puedo desmayarme. Por favor, ayúdeme a sentarme en un lugar seguro y llame a un médico.",
        pronunciation: "Me sien-to mui ma-rea-do i de-bil, pue-do des-ma-iar-me. Por fa-vor, a-iu-de-me a sen-tar-me en un lu-gar se-gu-ro i ia-me a un me-di-co.",
        explanation: "我感觉非常头晕和虚弱，可能会昏倒。请帮我在安全的地方坐下，并帮我联系医生。",
        emergencyTip: "避免站立，迅速坐下。解开衣领，如果是中暑，请用湿毛巾擦拭额头。"
      },
      th: {
        translatedHelp: "ฉันรู้สึกเวียนหัวมากและไม่มีแรง อาจจะหมดสติได้ โปรดช่วยฉันนั่งลงในที่ปลอดภัยและเรียกหมอให้หน่อยครับ/ค่ะ",
        pronunciation: "Chan ru-suek wian-hua mak lae mai mi raeng. At ja mot-sa-ti dai. Prot chuay chan nang long nai thi plot-phai lae riak mor hai noi krap/ka.",
        explanation: "我感觉非常头晕且没有力气，可能会晕倒。请帮我在安全的地方坐下并帮我叫医生。",
        emergencyTip: "请坐在通风避阳处，若身旁有清凉油或风油精可涂抹太阳穴，闭目休息。"
      }
    }
  },
  chest_pain: {
    name: "胸口剧痛 / 气喘",
    iconName: "Heart",
    translations: {
      en: {
        translatedHelp: "I am having severe chest pain and difficulty breathing. It feels like a heart emergency. Please call an ambulance (911) immediately!",
        pronunciation: "Ai em he-ving si-via chest pein end di-fi-kul-ti bri-dhing. It fils laik ei hart i-mer-jen-si. Pliz kol en em-biu-lens im-mi-diat-li!",
        explanation: "我感到严重的胸痛和呼吸困难。像是心脏突发状况。请立刻帮我拨打急救电话！",
        emergencyTip: "绝对不要惊慌奔跑，立即半卧位休息，松开衣领，保持呼吸道顺畅。如果有随身携带的救心丸，请立刻含服。"
      },
      ja: {
        translatedHelp: "胸が激しく痛み、息が苦しいです。心臓の急病の可能性があります。すぐに救急車（119番）を呼んでください！",
        pronunciation: "Mu-ne ga ha-ge-shi-ku i-ta-mi, i-ki ga ku-ru-shi-i desu. Shin-zo no kyu-byo no ka-no-sei ga a-ri-masu. Su-gu ni kyu-kyu-sha (Hya-ku-ju-kyu-ban) o yon-de ku-da-sa-i!",
        explanation: "我胸部剧烈疼痛，呼吸困难。可能是心脏急病。请立刻帮我叫救护车（拨打119）！",
        emergencyTip: "请平稳坐下，背部微靠，绝对不要剧烈运动或走路。保持情绪稳定。"
      },
      ko: {
        translatedHelp: "가슴이 심하게 아프고 숨쉬기가 너무 힘듭니다. 심장 마비 증상일 수 있으니 즉시 구급차(119)를 불러주세요!",
        pronunciation: "Ga-seum-i sim-ha-ge a-peu-go sum-swi-gi-ga neo-mu him-deumnida. Sim-jang ma-bi jeung-sang-il su isseu-ni jeuk-si gu-geup-cha(Il-il-gu)reul bul-leo-ju-se-yo!",
        explanation: "我的胸部疼得很厉害，呼吸非常困难。可能是心脏骤停症状，请立即拨打救护车（119）！",
        emergencyTip: "保持半坐卧姿势，不要用力。避免他人剧烈摇晃，有硝酸甘油或速效救心丸立即舌下含服。"
      },
      fr: {
        translatedHelp: "J'ai une violente douleur dans la poitrine et du mal à respirer. C'est peut-être un problème cardiaque. Veuillez appeler une ambulance (112) immédiatement !",
        pronunciation: "Je un vi-o-lant du-ler dan la pwa-trin e du mal a res-pi-re. Se pe-tetr un pro-blem kar-di-ak. Ve-ye a-ple un am-biu-lans im-me-diat-man !",
        explanation: "我的胸部有剧烈疼痛，且呼吸困难。可能是心脏问题。请立刻帮我叫救护车（拨打112）！",
        emergencyTip: "立即半坐卧位，保持安静，不要说话。解开领带、衬衫扣子和皮带。"
      },
      es: {
        translatedHelp: "Tengo un dolor muy fuerte en el pecho y me cuesta respirar. Puede ser una emergencia cardíaca. ¡Por favor, llame a una ambulancia (112) de inmediato!",
        pronunciation: "Ten-go un do-lor mui fuer-te en el pe-cho i me cues-ta res-pi-rar. Pue-de ser u-na e-mer-jen-cia car-dia-ca. Por fa-vor, ia-me a u-na am-bu-lan-cia de in-me-dia-to!",
        explanation: "我的胸口非常疼，呼吸困难。可能是心脏急症。请立即帮我叫救护车（拨打112）！",
        emergencyTip: "静坐，保持身体温暖。不要尝试走动。如有随身急救药请含服。"
      },
      th: {
        translatedHelp: "ฉันเจ็บหน้าอกอย่างรุนแรงและหายใจลำบากมาก อาจเกิดจากอาการทางหัวใจเฉียบพลัน โปรดเรียกรถพยาบาล (1669) ด่วนที่สุด!",
        pronunciation: "Chan jep-na-ok iang run-raeng lae hai-jai lam-bak mak. At koet jak a-kan thang hua-jai chiap-phlan. Prot riak rot-pha-ya-ban (Nung-hok-hok-kao) duan thi sut!",
        explanation: "我胸口剧烈疼痛，呼吸非常困难。可能是突发心脏病，请立即帮我叫救护车（1669）！",
        emergencyTip: "坐在安全阴凉处，大口缓慢呼吸。放松全身肌肉，解开紧身衣物。"
      }
    }
  },
  stomach_ache: {
    name: "肚子剧痛 / 吐血",
    iconName: "Activity",
    translations: {
      en: {
        translatedHelp: "I am experiencing severe stomach pain and vomiting, and I cannot stand up. Please help me get medical attention or call a doctor.",
        pronunciation: "Ai em eks-pi-rian-sing si-via sto-mak pein end vo-mi-ting, end ai ken-not stend ap. Pliz help mi get me-di-kal a-ten-shon or kol ei dok-ter.",
        explanation: "我感到胃部剧烈疼痛并伴有呕吐，无法站立。请帮我寻求医疗救助或联系医生。",
        emergencyTip: "请侧卧躺下（防止呕吐物引起窒息），不要吃任何东西或喝水。不要用热水袋热敷腹部。"
      },
      ja: {
        translatedHelp: "お腹が激しく痛み、吐き気がして立ち上がれません。お医者さんに見てもらうか、救急車を呼ぶのを手伝ってください。",
        pronunciation: "O-na-ka ga ha-ge-shi-ku i-ta-mi, ha-ki-ke ga shi-te ta-chi-a-ga-re-ma-sen. O-i-sha-san ni mi-te mo-ra-u ka, kyu-kyu-sha o yo-bu no o te-tsu-da-te ku-da-sa-i.",
        explanation: "我肚子剧痛，觉得恶心吐了，站不起来。请帮我找医生，或者帮我叫救护车。",
        emergencyTip: "请侧卧，膝盖弯曲贴近腹部以减轻疼痛。切勿盲目服止痛药，防止掩盖病情。"
      },
      ko: {
        translatedHelp: "배가 찢어지듯 아프고 구토가 나며 일어설 수 없습니다. 병원에 가거나 의사의 도움을 받을 수 있도록 도와주세요.",
        pronunciation: "Bae-ga jji-jeo-ji-deut a-peu-go gu-to-ga na-myeo il-eo-seol su eop-seumnida. Byeong-won-e ga-geo-na ui-sa-ui do-um-eul bat-eul su it-do-rok do-wa-ju-se-yo.",
        explanation: "我肚子撕裂般痛还呕吐，站不起来。请帮我，让我能去医院或得到医生的救助。",
        emergencyTip: "侧卧屈膝，防止呕吐物倒流。绝不要热敷、按摩或喝热水。"
      },
      fr: {
        translatedHelp: "J'ai d'intenses douleurs à l'estomac et je vomis, je ne peux pas me lever. S'il vous plaît, aidez-moi à trouver un médecin ou à appeler les secours.",
        pronunciation: "Je dan-tans du-ler a les-to-ma e je vo-mi, je ne pe pa me lve. Sil vu ple, e-de mwa a truve un me-dsen u a-ple le se-kur.",
        explanation: "我胃部剧烈疼痛且呕吐，无法站立。请帮我找医生或拨打急救电话。",
        emergencyTip: "侧卧，保持呼吸畅通，如果呕吐请彻底清理口腔。不要进食饮水。"
      },
      es: {
        translatedHelp: "Tengo un dolor de estómago muy fuerte y estoy vomitando, no puedo levantarme. Por favor, ayúdeme a conseguir asistencia médica o llamar a un doctor.",
        pronunciation: "Ten-go un do-lor de es-to-ma-go mui fuer-te i es-toi vo-mi-tan-do, no pue-do le-van-tar-me. Por fa-vor, a-iu-de-me a con-se-guir a-sis-ten-cia me-di-ca o ia-mar a un doc-tor.",
        explanation: "我肚子剧痛且呕吐，无法起立。请帮我寻求医疗救助或叫医生。",
        emergencyTip: "侧卧躺下，避免仰卧。如果持续剧痛，记下腹痛开始的时间以告知医生。"
      },
      th: {
        translatedHelp: "ฉันปวดท้องอย่างรุนแรงและอาเจียน ไม่สามารถยืนไหว โปรดช่วยนำฉันส่งโรงพยาบาลหรือเรียกหมอให้ทีครับ/ค่ะ",
        pronunciation: "Chan puat-thong iang run-raeng lae a-chian. Mai sa-mart yuen wai. Prot chuay nam chan song rong-pha-ya-ban riak mor hai thi krap/ka.",
        explanation: "我肚子疼得很厉害而且呕吐，站不稳。请帮我送医院或联系医生。",
        emergencyTip: "นอนตะแคงเพื่อความปลอดภัย หากมีอาการตัวเย็นให้ห่มผ้าอุ่นๆ ห้ามรับประทานยาทุกชนิดก่อนพบแพทย์"
      }
    }
  },
  allergy: {
    name: "严重过敏 / 窒息",
    iconName: "Activity",
    translations: {
      en: {
        translatedHelp: "I am having a severe allergic reaction (anaphylaxis) and my throat is swelling. I am having trouble breathing. Please call an ambulance immediately!",
        pronunciation: "Ai em he-ving si-via a-ler-jik ri-ak-shon end mai dhrot is swel-ling. Ai em he-ving tra-bel bri-dhing. Pliz kol en em-biu-lens im-mi-diat-li!",
        explanation: "我正在发生严重的过敏反应（过敏性休克），喉咙正在肿胀。我感到呼吸困难。请立刻帮我拨打救护车！",
        emergencyTip: "立刻寻找身上是否有随身携带的抗过敏药或肾上腺素笔（EpiPen）。如果有，请立刻在大腿外侧注射。"
      },
      ja: {
        translatedHelp: "激しいアレルギー反応（アナフィラキシー）が起き、喉が腫れて息ができません。すぐに救急車を呼んでください！",
        pronunciation: "Ha-ge-shi-i a-rer-gi han-no ga o-ki, no-do ga ha-re-te i-ki ga de-ki-ma-sen. Su-gu ni kyu-kyu-sha o yon-de ku-da-sa-i!",
        explanation: "我发生了强烈的过敏反应，喉咙肿胀无法呼吸。请立即帮我叫救护车！",
        emergencyTip: "平躺且抬高双脚以防休克。若有抗过敏急救药（如EpiPen）请立即在大腿侧面注射。"
      },
      ko: {
        translatedHelp: "심각한 알레르기 반응(아나필락시스)으로 목구멍이 부어올라 숨을 쉴 수가 없습니다. 즉시 구급차를 불러주세요!",
        pronunciation: "Sim-gak-han al-le-reu-gi ban-eung-eu-ro mok-gu-meong-i bu-eo-ol-la sum-eul swil su-ga eop-seumnida. Jeuk-si gu-geup-cha-reul bul-leo-ju-se-yo!",
        explanation: "我因为严重的过敏反应，喉咙红肿，无法呼吸。请立刻帮我叫救护车！",
        emergencyTip: "平躺，双下肢抬高。若呼吸十分困难，可微微抬高头部。有自备肾上腺素笔立即使用。"
      },
      fr: {
        translatedHelp: "Je fais une grave réaction allergique (choc anaphylactique) et ma gorge gonfle. J'ai du mal à respirer. Veuillez appeler une ambulance immédiatement !",
        pronunciation: "Je fe un grav re-ak-syon a-ler-jik e ma gorj gonfl. Je du mal a res-pi-re. Ve-ye a-ple un am-biu-lans im-me-diat-man !",
        explanation: "我正在发生严重过敏反应，喉咙肿胀。我很难呼吸。请立即叫救护车！",
        emergencyTip: "寻找是否有自备的EpiPen（肾上腺素笔），在大腿外侧垂直刺入保持10秒。"
      },
      es: {
        translatedHelp: "Tengo una reacción alérgica muy grave (anafilaxia) y se me está hinchando la garganta. No puedo respirar. ¡Por favor, llame a una ambulancia de inmediato!",
        pronunciation: "Ten-go u-na re-ac-cion a-ler-ji-ca mui gra-ve i se me es-ta in-chan-do la gar-gan-ta. No pue-do res-pi-rar. ¡Por fa-vor, ia-me a u-na am-bu-lan-cia de in-me-dia-to!",
        explanation: "我发生了极为严重的过敏反应，喉咙正在肿胀。我无法呼吸。请立刻帮我叫救护车！",
        emergencyTip: "躺下并把腿抬高。如有抗过敏注射笔，应立即透过衣物刺入大腿外侧肌肉。"
      },
      th: {
        translatedHelp: "ฉันมีอาการแพ้อย่างรุนแรง คอเริ่มบวมและหายใจไม่ออก โปรดช่วยเรียกรถพยาบาลด่วนที่สุดครับ/ค่ะ!",
        pronunciation: "Chan mi a-kan phae iang run-raeng. Khor roem buam lae hai-jai mai ok. Prot chuay riak rot-pha-ya-ban duan thi sut krap/ka!",
        explanation: "我有极为严重的过敏反应。脖子喉咙开始肿胀，无法呼吸。请立刻帮我叫急救车！",
        emergencyTip: "นอนราบยกขาขึ้นสูง หากพกปากกาฉีดอะดรีนาลีน (EpiPen) ให้ฉีดเข้าที่ต้นขาด้านนอกทันที"
      }
    }
  },
  fallen: {
    name: "摔倒骨折 / 无法动弹",
    iconName: "Activity",
    translations: {
      en: {
        translatedHelp: "I fell down and I suspect I have a broken bone. I am in extreme pain and cannot move. Please help me call medical services or an ambulance.",
        pronunciation: "Ai fol daun end ai sas-pekt ai hev ei bro-ken boun. Ai em in eks-trihm pein end ken-not muhv. Pliz help mi kol me-di-kal ser-vi-sis or en em-biu-lens.",
        explanation: "我摔倒了，怀疑发生了骨折。我感到剧烈疼痛且无法移动。请帮我联系医疗机构或救护车。",
        emergencyTip: "骨折后切勿盲目乱动或让人拉拽，防止造成二次错位和血管损伤。原位等待救援，可以用衣物垫在周围支撑。"
      },
      ja: {
        translatedHelp: "転んでしまって骨折したようです。激しい痛みがあり動けません。救急車を呼ぶか、誰か助けを呼んでもらえませんか。",
        pronunciation: "Ko-ron-de shi-mat-te kos-se-tsu shi-ta yo desu. Ha-ge-shi-i i-ta-mi ga a-ri u-go-ke-ma-sen. Kyu-kyu-sha o yo-bu ka, da-re-ka ta-su-ke o yon-de mo-ra-e-ma-sen ka.",
        explanation: "我摔倒了，好像发生了骨折。非常痛无法动弹。能帮我叫救护车，或者叫人来帮忙吗？",
        emergencyTip: "请保持原地不动。千万不要让旁人尝试帮你把骨头复位。如果有伤口流血，进行按压止血。"
      },
      ko: {
        translatedHelp: "넘어져서 뼈가 부러진 것 같습니다. 극심한 통증이 있고 움직일 수 없습니다. 의료진이나 구급차를 불러주세요.",
        pronunciation: "Neom-eo-jeo-seo pyeo-ga bu-reo-jin geot gat-seumnida. Geuk-sim-han tong-jeung-i it-go um-jik-il su eop-seumnida. Ui-ryo-jin-i-na gu-geup-cha-reul bul-leo-ju-se-yo.",
        explanation: "我摔倒了，骨头好像折了。疼得非常厉害无法挪动。请帮我叫医护人员或救护车。",
        emergencyTip: "몸을 억지로 움직이지 마세요. 손상 부위가 붓지 않도록 자극을 최소화하고 구조대를 기다립니다."
      },
      fr: {
        translatedHelp: "Je suis tombé et je pense avoir une fracture. J'ai extrêmement mal et je ne peux plus bouger. S'il vous plaît, aidez-moi à appeler une ambulance.",
        pronunciation: "Je swi ton-be e je pans a-vwar un frak-tur. Je eks-trem-man mal e je ne pe plu bu-je. Sil vu ple, e-de mwa a-ple un am-biu-lans.",
        explanation: "我摔倒了，我想我骨折了。极为疼痛且无法动弹。请帮我叫救护车。",
        emergencyTip: "Ne bougez pas. Ne laissez personne manipuler le membre blessé. Attendez patiemment les secours."
      },
      es: {
        translatedHelp: "Me caí y sospecho que tengo una fractura. Tengo un dolor extremo y no me puedo mover. Por favor, ayúdeme a llamar a emergencias o a una ambulancia.",
        pronunciation: "Me ca-i i sos-pe-cho que ten-go u-na frac-tu-ra. Ten-go un do-lor eks-tre-mo i no me pue-do mo-ver. Por fa-vor, a-iu-de-me a ia-mar a e-mer-jen-cias o a u-na am-bu-lan-cia.",
        explanation: "我摔倒了，怀疑骨折了。非常非常痛，无法挪动。请帮我联系急救中心或叫一辆救护车。",
        emergencyTip: "No intente levantarse. Evite mover la zona lesionada. Si hay sangrado, aplique presión suave alrededor."
      },
      th: {
        translatedHelp: "ฉันล้มลงและคิดว่ากระดูกหัก เจ็บปวดรุนแรงมากจนไม่สามารถขยับตัวได้ โปรดช่วยเรียกรถพยาบาลหรือเรียกคนมาช่วยทีครับ/ค่ะ",
        pronunciation: "Chan lom-long lae khit wa kra-duk hak. Jep-puat run-raeng mak jon mai sa-mart kha-yap tua dai. Prot chuay riak rot-pha-ya-ban riak khon ma chuay thi krap/ka.",
        explanation: "我摔倒了，觉得是骨折。非常痛动不了。请帮我叫救护车或者叫人来帮忙。",
        emergencyTip: "ห้ามนวดหรือขยับแขนขาที่หักเด็ดขาด อยู่นิ่งๆ และใช้เสื้อผ้าหนาๆ ช่วยหนุนรองรับบริเวณที่เจ็บ"
      }
    }
  },
  need_doctor: {
    name: "急需医生 / 突发重病",
    iconName: "Heart",
    translations: {
      en: {
        translatedHelp: "I am feeling extremely unwell and have a sudden serious illness. I urgently need to see a doctor. Can you help me go to the nearest clinic or hospital?",
        pronunciation: "Ai em feeh-ling eks-trihm-li an-wel end hev ei sa-den si-riat il-nis. Ai er-jent-li nihd tu sih ei dok-ter. Ken iu help mi gou tu dhe ni-rest kli-nik or hos-pi-tal?",
        explanation: "我感到身体极度不适，突发重病。我迫切需要看医生。你能帮我去最近的诊所或医院吗？",
        emergencyTip: "寻找身边的椅子坐下，向路人出示此卡。随身带好护照、医保卡和日常药品。"
      },
      ja: {
        translatedHelp: "急に体調が非常に悪くなり、重い病気かもしれません。至急、医者に見てもらう必要があります。近くの病院かクリニックへ連れて行っていただけませんか。",
        pronunciation: "Kyu ni tai-cho ga hi-jo ni wa-ru-ku na-ri, o-mo-i byo-ki ka-mo shi-re-ma-sen. Shi-kyu, i-sha ni mi-te mo-ra-u hi-tsu-yo ga a-ri-masu. Chi-ka-ku no byo-in ka ku-ri-nik-ku e tsu-re-te i-tte i-ta-da-ke-ma-sen ka.",
        explanation: "我的身体突然变得非常差，可能是得了重病。必须立刻看医生。能带我去最近的医院或诊所吗？",
        emergencyTip: "保持体温，深呼吸。如有高血压、糖尿病等病史，准备好药物并寻找懂中文的人员或翻译机协助。"
      },
      ko: {
        translatedHelp: "갑자기 몸 상태가 너무 안 좋아져서 중병이 의심됩니다. 급히 의사의 진찰이 필요합니다. 가장 가까운 병원이나 의원으로 갈 수 있게 도와주시겠습니까?",
        pronunciation: "Gap-ja-gi mom sang-tae-ga neo-mu an jo-a-jyeo-seo jung-byeong-i ui-sim-deumnida. Geup-hi ui-sa-ui jin-chal-i pil-yo-hamnida. Ga-jang ga-kka-un byeong-won-i-na ui-won-eu-ro gal su it-ge do-wa-ju-si-get-seumnika?",
        explanation: "我的身体状况突然变得极度不好，怀疑得了重病。急需看医生。能帮我去最近的医院或诊所吗？",
        emergencyTip: "找地方坐下休息，防止晕厥。不要乱服药。把随身携带的护照以及常备药放好。"
      },
      fr: {
        translatedHelp: "Je me sens extrêmement mal et je suis tombé gravement malade tout à coup. J'ai un besoin urgent de voir un médecin. Pouvez-vous m'aider à aller à la clinique ou à l'hôpital le plus proche ?",
        pronunciation: "Je me san-z-eks-trem-man mal e je swi ton-be grav-man ma-lad tut-a-ku. Je un be-zwan ur-jan de vwar un me-dsen. Pu-ve vu me-de a a-ler a la kli-nik u a lo-pi-tal le plu prosh ?",
        explanation: "我感到极其不适，突然生了重病。我急需看医生。您能带我去最近的诊所或医院吗？",
        emergencyTip: "深呼吸。坐下并请人帮忙。向服务台出示保险单和护照复印件。"
      },
      es: {
        translatedHelp: "Me siento extremadamente mal y he enfermado gravemente de repente. Necesito ver a un médico con urgencia. ¿Puede ayudarme a ir a la clínica u hospital más cercano?",
        pronunciation: "Me sien-to eks-tre-ma-men-te mal i e en-fer-ma-do gra-ve-men-te de re-pen-te. Ne-ce-si-to ver a un me-di-co con ur-jen-cia. ¿Pue-de a-iu-dar-me a ir a la cli-ni-ca u hos-pi-tal mas cer-ca-no?",
        explanation: "我感到极度不适，突然生了重病。我需要紧急看医生。您能帮我去最近的诊所或医院吗？",
        emergencyTip: "坐在凳子上休息，把护照及随身常备药物和说明书准备好。冷静等待医生。"
      },
      th: {
        translatedHelp: "ฉันรู้สึกไม่สบายอย่างรุนแรงและเจ็บป่วยกะทันหัน ต้องการพบแพทย์โดยด่วนที่สุด โปรดช่วยพาฉันไปคลินิกหรือโรงพยาบาลที่ใกล้ที่สุดทีครับ/ค่ะ",
        pronunciation: "Chan ru-suek mai sa-bai iang run-raeng lae jep-puat ka-than-han. Tong-kan phop phaet doy duan thi sut. Prot chuay pha chan pai khli-nik rue rong-pha-ya-ban thi klai thi sut thi krap/ka.",
        explanation: "我感到身体极度不适并突发重病。急需看医生。请带我去最近的诊所或医院。",
        emergencyTip: "นั่งพักในร่ม รักษาระดับลมหายใจให้คงที่ เตรียมพาสปอร์ตและใบเคลมประกันการเดินทาง (ถ้ามี) ไว้ให้พร้อม"
      }
    }
  }
};

export const OFFLINE_LOST_TEMPLATES = {
  hotel: {
    title: "带我去酒店",
    text: "你好，我迷路了。请问可以帮我叫辆出租车，或者带我到这个地址吗？这是我入住的酒店地址："
  },
  family: {
    title: "联系我家人",
    text: "你好，我迷路了，并且我的手机无法联系上。请问能帮我拨打这个电话号码联系我的家人吗？非常感谢！"
  },
  taxi: {
    title: "帮我叫辆出租车",
    text: "你好，我迷路了，找不到叫车的地方，而且无法使用叫车软件。请问可以帮我用本地软件打车，或者带我去最近的公交站/地铁站/出租车上下客点吗？"
  }
};

export const OFFLINE_FAMILY_TEMPLATES = {
  safe: {
    name: "报平安 (Safe)",
    familyVersion: "爸妈/家人，我已经安全到达了，这里一切顺利，网络有时不太好，不用担心！我会照顾好自己，晚点再跟你们联系。",
    localVersion: "Hello, I am a foreign visitor. I wanted to let you know that I am safe and everything is fine. Thank you for your care."
  },
  lost: {
    name: "我迷路了 (Lost)",
    familyVersion: "爸妈/家人，我现在迷路了，网络信号有点弱。不过我目前在安全的地方，请不要着急。如果方便，可以帮我拨打我留在下面的联系电话，或者把我的酒店地址再发一遍给我。",
    localVersion: "Hello, I am currently lost nearby. If you are a helper, please assist me in finding my way or contacting my emergency contacts. Thank you!"
  },
  hospital: {
    name: "我不太舒服 (Unwell)",
    familyVersion: "爸妈/家人，我身体有些不太舒服，正在寻求当地医生的帮助。不用太担心，只是跟你们提前说一声。我会听从医生的指示，有进一步情况会再发短信联系你们。",
    localVersion: "Hello, I am feeling unwell and seeking medical assistance. Please contact my emergency contact as listed if there's an emergency. Thank you."
  },
  phone_lost: {
    name: "丢东西/信号弱 (Lost Items)",
    familyVersion: "爸妈/家人，我这边的随身物品/手机丢失或网络信号很差。现在正找人借用设备或者在公共场所发短信。我已经脱离紧急情况，十分安全，请不要担心，等我连上WiFi再微信联系你们！",
    localVersion: "Hello, I have lost some personal belongings/phone. If found, please notify me or help me access a public service station."
  }
};
