/**
 * =========================================================================
 * MYSTIC WITCH PALMISTRY - PALM READING DATA
 * Based strictly on The Street Ratchada: "วิธีดูเส้นลายมือ ทำนายโชคชะตาด้วยตัวเองแบบง่ายๆ"
 * Features 4 Major Lines (Life, Head, Heart, Fate) + Marriage Line + Gender Hand Rules
 * Bilingual Support: Thai (th) & English (en)
 * =========================================================================
 */

const PALM_HAND_RULES = {
  th: {
    female: {
      right: {
        title: "มือขวา (มือชะตาปัจจุบัน / อนาคต)",
        desc: "ตามตำราของ The Street Ratchada ผู้หญิงให้ดู 'มือขวา' เพื่อดูสิ่งที่เกิดขึ้นกับตัวคุณในปัจจุบันและอนาคต สิ่งที่คุณสร้างและสั่งสมขึ้นมาด้วยตนเอง",
        type: "current"
      },
      left: {
        title: "มือซ้าย (มือพื้นดวงเดิม / อดีต)",
        desc: "ตามตำราของ The Street Ratchada ผู้หญิง 'มือซ้าย' บ่งบอกถึงสิ่งที่สั่งสมมาแต่อดีต โชคชะตาและพรสวรรค์ที่ติดตัวมาแต่กำเนิด",
        type: "birth"
      }
    },
    male: {
      left: {
        title: "มือซ้าย (มือชะตาปัจจุบัน / อนาคต)",
        desc: "ตามตำราของ The Street Ratchada ผู้ชายให้ดู 'มือซ้าย' เพื่อดูสิ่งที่เกิดขึ้นกับตัวคุณในปัจจุบันและอนาคต ผลลัพธ์จากการกระทำที่คุณเลือกสร้างขึ้นเอง",
        type: "current"
      },
      right: {
        title: "มือขวา (มือพื้นดวงเดิม / อดีต)",
        desc: "ตามตำราของ The Street Ratchada ผู้ชาย 'มือขวา' บ่งบอกถึงสิ่งที่สั่งสมมาแต่อดีต โชคชะตาและพื้นฐานชีวิตที่ติดตัวมาแต่กำเนิด",
        type: "birth"
      }
    },
    general: {
      dominant: {
        title: "มือข้างที่ถนัด (Active Hand)",
        desc: "สะท้อนโชคชะตาปัจจุบัน สิ่งที่คุณเลือกทำ ความคิด และแนวโน้มในอนาคต",
        type: "current"
      },
      passive: {
        title: "มือข้างที่ไม่ถนัด (Passive Hand)",
        desc: "สะท้อนพื้นเพดวงเดิม สัญชาตญาณ พรสวรรค์ที่ซ่อนอยู่แต่กำเนิด",
        type: "birth"
      }
    }
  },
  en: {
    female: {
      right: {
        title: "Right Hand (Present / Future Destiny)",
        desc: "According to The Street Ratchada, for women, the Right Hand reflects your present reality, future destiny, and what you build with your own choices.",
        type: "current"
      },
      left: {
        title: "Left Hand (Innate Destiny / Past Karma)",
        desc: "According to The Street Ratchada, for women, the Left Hand indicates accumulated past karma, inborn talents, and destiny from birth.",
        type: "birth"
      }
    },
    male: {
      left: {
        title: "Left Hand (Present / Future Destiny)",
        desc: "According to The Street Ratchada, for men, the Left Hand reflects present actions, future trajectory, and accomplishments crafted by yourself.",
        type: "current"
      },
      right: {
        title: "Right Hand (Innate Destiny / Past Karma)",
        desc: "According to The Street Ratchada, for men, the Right Hand reveals innate fortune, roots, and foundations bestowed at birth.",
        type: "birth"
      }
    },
    general: {
      dominant: {
        title: "Dominant Hand (Active)",
        desc: "Reflects your present life, decisions, current trajectory, and conscious actions.",
        type: "current"
      },
      passive: {
        title: "Non-Dominant Hand (Passive)",
        desc: "Reflects innate gifts, subconscious instincts, and life foundations from birth.",
        type: "birth"
      }
    }
  }
};

const PALM_LINES_DATA = {
  // 1. เส้นชีวิต (Life Line)
  life: {
    id: "life",
    name_th: "เส้นชีวิต (Life Line)",
    name_en: "Life Line",
    color: "#10b981", // Emerald Green
    icon: "🌱",
    definition_th: "เส้นที่โค้งโอบล้อมโคนนิ้วหัวแม่มือ บ่งบอกถึงพลังชีวิต พละกำลัง สุขภาพร่างกาย ความเป็นอยู่ และการเปลี่ยนแปลงครั้งสำคัญในชีวิต (ไม่ได้หมายถึงอายุขัยสั้นยาวเพียงอย่างเดียว)",
    definition_en: "The line curving around the base of the thumb. Governs vitality, physical health, well-being, and major life transitions (not strictly life expectancy).",
    variations: [
      {
        id: "life_long_deep",
        name_th: "เส้นยาว ลึก และคมชัด",
        name_en: "Long, Deep & Clear",
        summary_th: "สุขภาพแข็งแรงสมบูรณ์ มีพละกำลังชีวิตสูง ภูมิคุ้มกันดีเยี่ยม",
        summary_en: "Robust health, high vitality, strong immune resilience, and boundless energy.",
        prediction_th: "ตามตำราของ The Street Ratchada ผู้ที่มีเส้นชีวิตยาว ลึก และชัดเจน บ่งบอกถึงสุขภาพร่างกายที่แข็งแรง มีพลังชีวิตสูง จิตใจหนักแน่น มีความอดทนต่ออุปสรรคได้อย่างดีเยี่ยม เมื่อเจ็บป่วยจะฟื้นตัวได้รวดเร็ว มักมีชีวิตที่มั่นคงและราบรื่น มีพลังงานในการสร้างสรรค์สิ่งใหม่ๆ อยู่เสมอ",
        prediction_en: "Indicates excellent physical vitality and enduring stamina. You recover quickly from illnesses, possess steady mental determination, and maintain abundant energy to pursue ambitious life goals.",
        advice_th: "แม้จะมีร่างกายที่แข็งแรงตามธรรมชาติ อย่าประมาทในการใช้ชีวิต หักโหมงานหนักจนลืมการพักผ่อนที่มีคุณภาพ",
        advice_en: "Do not take your natural vitality for granted; preserve your energy by balancing hard work with restorative rest."
      },
      {
        id: "life_wide_curve",
        name_th: "เส้นโค้งกว้าง ล้อมรอบเนินศุกร์อย่างสมบูรณ์",
        name_en: "Broad Curve Around Venus",
        summary_th: "มีชีวิตชีวา อบอุ่น มีเสน่ห์ รักความสนุกสนาน สังคมดี",
        summary_en: "Vibrant enthusiasm, magnetic warmth, generous spirit, and abundant joie de vivre.",
        prediction_th: "เส้นชีวิตที่โค้งกว้างกินพื้นที่เข้ามากลางฝ่ามือ บ่งบอกถึงคนที่มีชีวิตชีวา เปี่ยมล้นด้วยพลังงานบวกและอารมณ์ขัน ชอบพบปะผู้คน มีความกระตือรือร้นในการใช้ชีวิต เข้ากับคนง่าย เป็นที่รักของคนรอบตัว และมีความปรารถนาในการใช้ชีวิตอย่างมีความสุขและเต็มที่",
        prediction_en: "Shows an exuberant, warm-hearted personality with great social vitality. You approach life with passion, enjoy people's company, and spread radiant positive energy wherever you go.",
        advice_th: "เปิดรับมิตรภาพใหม่ๆ เสมอ แต่ระวังเรื่องการใช้จ่ายตามอารมณ์หรือการตามใจตัวเองมากเกินไป",
        advice_en: "Embrace joyful connections while guarding against impulsive indulgence or overextending your resources."
      },
      {
        id: "life_short_clear",
        name_th: "เส้นสั้นแต่คมชัด",
        name_en: "Short but Deep & Clear",
        summary_th: "ทำอะไรรวดเร็ว ฉับไว ไม่ยืดเยื้อ รักอิสระ",
        summary_en: "Decisive action, fast-paced living, self-reliance, and independent spirit.",
        prediction_th: "ตามตำรา The Street Ratchada เส้นชีวิตสั้นไม่ได้หมายถึงอายุสั้น แต่หมายถึงคนที่มีจังหวะชีวิตรวดเร็ว ทำอะไรกระฉับกระเฉง ฉับไว ไม่ชอบความล่าช้า รักอิสระ มีความมุ่งมั่นสูง สามารถผ่านพ้นอุปสรรคได้ด้วยความเด็ดเดี่ยว",
        prediction_en: "A short life line does NOT signify a short lifespan; rather, it indicates a high-tempo, independent lifestyle, brisk decision-making, and an urge to accomplish goals without delay.",
        advice_th: "หมั่นฝึกผ่อนคลายความตึงเครียด ออกกำลังกายแบบยืดหยุ่น และไม่ควรตัดสินใจเรื่องสำคัญอย่างเร่งรีบเกินไป",
        advice_en: "Cultivate patience and mindfulness; allow time for deep reflection rather than rushing through critical decisions."
      },
      {
        id: "life_broken",
        name_th: "เส้นขาดช่วง หรือมีรอยแยก",
        name_en: "Broken or Overlapping Segments",
        summary_th: "มีจุดเปลี่ยนผันครั้งใหญ่ในชีวิต หรือมีบททดสอบด้านสุขภาพ",
        summary_en: "Major pivotal turning points, career/location shifts, or health wakeup calls.",
        prediction_th: "เส้นชีวิตที่มีรอยขาดหรือช่วงเหลื่อม บ่งบอกถึงช่วงเวลาที่มีการเปลี่ยนแปลงครั้งสำคัญในชีวิต เช่น การย้ายที่อยู่อาศัย การเปลี่ยนสายอาชีพ หรือมีช่วงเวลาที่ต้องฟื้นฟูสุขภาพเป็นพิเศษ แต่หากมีเส้นขนานหรือเส้นต่อ แสดงว่าสามารถก้าวข้ามผ่านวิกฤตินั้นมาได้อย่างเข้มแข็งยิ่งขึ้น",
        prediction_en: "Points to transformative life shifts such as relocating, shifting career trajectories, or overcoming health vulnerabilities. The gap represents rebirth and newfound resilience.",
        advice_th: "ตรวจสุขภาพประจำปีสม่ำเสมอ เปิดใจรับการเปลี่ยนแปลง และมองวิกฤติให้เป็นโอกาสแห่งการเริ่มต้นใหม่",
        advice_en: "Schedule regular wellness checkups and embrace life transitions with an adaptable, fearless mindset."
      },
      {
        id: "life_double_mars",
        name_th: "มีเส้นซ้อนคู่ขนาน (เส้นอังคาร / เส้นคุ้มครอง)",
        name_en: "Sister / Mars Protection Line",
        summary_th: "มีผู้ใหญ่อุปถัมภ์ สิ่งศักดิ์สิทธิ์คุ้มครอง แคล้วคลาดปลอดภัย",
        summary_en: "Angelic protection, influential mentors, remarkable survival instincts, and good luck.",
        prediction_th: "เส้นชีวิตที่มีเส้นเล็กๆ วิ่งขนานด้านในใกล้หัวแม่มือ เรียกว่า 'เส้นพี่น้อง' หรือ 'เส้นอังคาร' แสดงว่ามีพลังคุ้มครองที่มองไม่เห็น มักแคล้วคลาดจากภยันตราย มีผู้ใหญ่หรือกัลยาณมิตรคอยช่วยเหลือในยามคับขัน สุขภาพฟื้นตัวได้อย่างอัศจรรย์",
        prediction_en: "Possesses a protective aura and strong ancestral blessings. Whenever hardship strikes, unseen help, benevolent mentors, or sheer good fortune arrive just in time to rescue you.",
        advice_th: "หมั่นกตัญญู ทำบุญแบ่งปัน และระลึกถึงผู้มีพระคุณ จะช่วยเสริมพลังคุ้มครองให้ทวีคูณยิ่งขึ้น",
        advice_en: "Express gratitude to mentors and practice charitable generosity to continually reinforce your protective blessings."
      },
      {
        id: "life_chained",
        name_th: "เส้นเป็นลูกโซ่หรือมีเกาะช่วงต้น",
        name_en: "Chained or Islanded Line",
        summary_th: "วัยเด็กอาจสุขภาพเปราะบาง หรือเป็นคนคิดมาก เครียดง่าย",
        summary_en: "Sensory sensitivity, vulnerable youth health, or prone to overthinking and stress.",
        prediction_th: "เส้นชีวิตที่มีลักษณะเป็นโซ่หรือเกาะเล็กๆ บ่งบอกถึงคนที่ไวต่อสิ่งแวดล้อม ในวัยเด็กอาจมีปัญหาสุขภาพหรือภูมิแพ้ และมักมีความวิตกกังวลสะสมได้ง่าย อารมณ์อ่อนไหว แต่เมื่อเติบโตและปรับสมดุลได้จะกลายเป็นคนที่มีสัญชาตญาณระวังภัยที่ดีเยี่ยม",
        prediction_en: "Reflects delicate constitution in early years or high emotional sensitivity to environmental stress. As you mature, this evolves into keen intuition and protective instincts.",
        advice_th: "ฝึกสมาธิ ผ่อนคลายกล้ามเนื้อ หลีกเลี่ยงสภาพแวดล้อมที่เป็นพิษ และทานอาหารที่มีประโยชน์ต่อระบบทางเดินอาหารและประสาท",
        advice_en: "Prioritize nervous system recovery through meditation, clean nutrition, and boundaries against toxic environments."
      }
    ]
  },

  // 2. เส้นสมอง (Head Line)
  head: {
    id: "head",
    name_th: "เส้นสมอง (Head Line)",
    name_en: "Head Line",
    color: "#3b82f6", // Sapphire Blue
    icon: "🧠",
    definition_th: "เส้นที่พาดขวางกลางฝ่ามือ บ่งบอกถึงวิธีคิด สติปัญญา สไตล์การเรียนรู้ ความสามารถในการวิเคราะห์ และการตัดสินใจแก้ปัญหาในชีวิต",
    definition_en: "The line traversing horizontally across the palm. Dictates intellect, mental focus, analytical depth, problem-solving style, and psychological perspective.",
    variations: [
      {
        id: "head_straight_long",
        name_th: "เส้นยาวตรง พาดขวางฝ่ามือ",
        name_en: "Long & Straight across Palm",
        summary_th: "นักคิดเชิงตรรกะ มีเหตุผล มีวินัย วางแผนเป็นระบบ รอบคอบ",
        summary_en: "Logical, analytical, pragmatic, highly structured, and grounded in objective facts.",
        prediction_th: "ตามตำรา The Street Ratchada เส้นสมองที่ยาวและตรง บ่งบอกถึงผู้ที่มีความสามารถในการคิดวิเคราะห์สูงมาก เป็นคนมีเหตุผล ช่างสังเกต มองโลกตามความเป็นจริง ไม่ชอบเรื่องเพ้อฝัน วางแผนชีวิตอย่างรอบคอบ ทำงานกับตัวเลข ตรรกะ หรือการบริหารจัดการได้อย่างดีเยี่ยม",
        prediction_en: "Exhibits exceptional mental clarity, objective reasoning, and structured strategic thinking. You value facts over speculation and excel in administration, science, finance, or analytical disciplines.",
        advice_th: "อย่าตึงเครียดกับความสมบูรณ์แบบมากเกินไป และเปิดใจรับฟังความคิดเห็นจากมุมมองด้านอารมณ์ของผู้อื่น",
        advice_en: "Balance clinical logic with emotional empathy; allow flexibility when collaborating with creative or feeling-oriented peers."
      },
      {
        id: "head_curved_down",
        name_th: "เส้นโค้งลาดลง สู่เนินจันทร์",
        name_en: "Gently Curved towards Mount of Moon",
        summary_th: "จินตนาการล้ำเลิศ มีความคิดสร้างสรรค์ ศิลปิน นักออกแบบ",
        summary_en: "Creative visionary, artistic intuition, lateral thinker, and empathetic imagination.",
        prediction_th: "เส้นสมองที่โค้งลาดลงสู่เนินจันทร์ บ่งบอกถึงคนที่มีจินตนาการสูง มีความคิดสร้างสรรค์ มีเซนส์ด้านศิลปะ ดนตรี วรรณกรรม หรือการออกแบบ สามารถมองเห็นทางออกที่คนอื่นมองข้าม เป็นคนช่างฝัน มีความเข้าใจในอารมณ์ความรู้สึกของมนุษย์อย่างลึกซึ้ง",
        prediction_en: "Gifted with profound creative imagination, aesthetic sensibility, and lateral intuition. You shine in design, creative writing, arts, consulting, and inventing unconventional solutions.",
        advice_th: "ดึงไอเดียในหัวออกมาลงมือทำให้เกิดขึ้นจริงในโลกแห่งความเป็นจริง อย่าปล่อยให้ความคิดสร้างสรรค์ลอยอยู่ในจินตนาการ",
        advice_en: "Anchor your brilliant visions into concrete actionable blueprints; do not let your dreams remain purely theoretical."
      },
      {
        id: "head_forked",
        name_th: "ปลายแตกสองแฉก (Writer's Fork / กิ่งนักเขียน)",
        name_en: "Forked at the End (Writer's Fork)",
        summary_th: "ไหวพริบปฏิภาณสูง แก้ปัญหาเฉพาะหน้าเก่ง วาทศิลป์ยอดเยี่ยม ค้าขายเก่ง",
        summary_en: "Versatile intellect, persuasive communication, commercial acumen, and mental adaptability.",
        prediction_th: "เส้นสมองที่ปลายแยกเป็นสองแฉกเป็นลักษณะยอดเยี่ยมมาก เรียกว่า 'Writer's Fork' รวมพลังของตรรกะและจินตนาการไว้ด้วยกัน มีไหวพริบปฏิภาณสูง ปรับตัวเก่ง พูดจาโน้มน้าวใจเก่ง มีทักษะการเจรจาต่อรอง ค้าขายเก่ง และสามารถทำงานหลายอย่างพร้อมกันได้ดี",
        prediction_en: "A rare and auspicious sign merging practical logic with imaginative flair. You possess extraordinary eloquence, rapid adaptability, witty negotiation skills, and lucrative business acumen.",
        advice_th: "โฟกัสเป้าหมายหลักให้สำเร็จทีละอย่าง ระวังความสามารถที่หลากหลายจะทำให้จับปลาหลายมือจนเหนื่อยเกินไป",
        advice_en: "Harness your multifaceted talents through disciplined focus; avoid spreading your mental bandwidth too thinly across too many projects."
      },
      {
        id: "head_short",
        name_th: "เส้นสั้นและตรง",
        name_en: "Short & Direct",
        summary_th: "คิดไว ทำไว ตรงไปตรงมา ชัดเจน ไม่ชอบความซับซ้อน",
        summary_en: "Pragmatic, direct, rapid-fire thinker, zero patience for fluff, action-oriented.",
        prediction_th: "ตามตำรา The Street Ratchada เส้นสมองสั้นมักเป็นคนคิดอะไรเรียบง่าย ตรงไปตรงมา มุ่งเน้นที่ผลลัพธ์เป็นหลัก ไม่ชอบคิดซับซ้อนหรือเยิ่นเย้อ ตัดสินใจเร็ว ลงมือทำทันที เหมาะกับงานที่ต้องการความรวดเร็วและความเด็ดขาด",
        prediction_en: "Indicates an action-oriented mind with zero tolerance for unnecessary complications. You grasp the core premise instantly, discard trivialities, and cut straight to the bottom line.",
        advice_th: "ในเรื่องที่สำคัญหรือเกี่ยวกับอนาคตระยะยาว ควรให้เวลาตัวเองคิดทบทวนผลกระทบรอบด้านก่อนตัดสินใจ",
        advice_en: "For major life decisions, pause to evaluate long-term secondary consequences before pulling the trigger."
      },
      {
        id: "head_separated",
        name_th: "จุดเริ่มต้นแยกห่างจากเส้นชีวิต",
        name_en: "Separated Origin from Life Line",
        summary_th: "รักอิสระ มั่นใจในตัวเองสูง กล้าได้กล้าเสีย ไม่ชอบถูกตีกรอบ",
        summary_en: "Fiercely independent, courageous, pioneering risk-taker, bold self-confidence.",
        prediction_th: "เส้นสมองที่เริ่มต้นโดยมีช่องว่างแยกออกจากเส้นชีวิต แสดงถึงความเป็นตัวของตัวเองสูงมาก รักอิสระ กล้าคิดกล้าทำ ชอบความท้าทาย ไม่ชอบให้ใครมาตีกรอบ มีภาวะผู้นำโดยกำเนิด พร้อมจะบุกเบิกเส้นทางใหม่ด้วยความมั่นใจ",
        prediction_en: "Reveals a fiercely autonomous pioneer who refuses to be constrained by traditional boundaries. You dare to take bold initiatives and thrive when captaining your own destiny.",
        advice_th: "รับฟังความคิดเห็นและคำเตือนจากผู้หวังดีรอบข้าง เพื่อลดความเสี่ยงจากการตัดสินใจที่ใจร้อนเกินไป",
        advice_en: "Temper your fiery courage with patient counsel from seasoned advisors to prevent costly missteps."
      },
      {
        id: "head_joined",
        name_th: "จุดเริ่มต้นติดกับเส้นชีวิตเป็นแนวยาว",
        name_en: "Joined Deeply with Life Line",
        summary_th: "รอบคอบ สุขุม ระมัดระวังตัวสูง กตัญญู ให้เกียรติครอบครัว",
        summary_en: "Cautious, deeply loyal, methodical, values family roots, and risk-averse.",
        prediction_th: "เส้นสมองที่เริ่มต้นแนบชิดกับเส้นชีวิตเป็นระยะยาว บ่งบอกถึงคนที่ระมัดระวังตัวสูง คิดหน้าคิดหลังอย่างละเอียด ไม่ชอบความเสี่ยง ให้ความสำคัญกับความมั่นคงและครอบครัว มีความรับผิดชอบสูงและกตัญญู",
        prediction_en: "Demonstrates deep deliberation, thorough risk assessment, and strong reverence for familial heritage. You build success steadily upon safe, rock-solid foundations.",
        advice_th: "กล้าก้าวออกจาก Comfort Zone ลองเชื่อมั่นในศักยภาพของตัวเองและคว้าโอกาสใหม่ๆ ที่เข้ามา",
        advice_en: "Dare to step beyond your comfort perimeter; trust your proven competence to seize thrilling opportunities."
      }
    ]
  },

  // 3. เส้นหัวใจ (Heart Line)
  heart: {
    id: "heart",
    name_th: "เส้นหัวใจ (Heart Line)",
    name_en: "Heart Line",
    color: "#ec4899", // Ruby Rose / Pink
    icon: "💖",
    definition_th: "เส้นด้านบนสุดของฝ่ามือ พาดจากใต้โคนนิ้วก้อยไปทางนิ้วชี้ บ่งบอกถึงอารมณ์ ความรัก ความสัมพันธ์ ความมั่นคงทางจิตใจ และทัศนคติต่อคนรัก",
    definition_en: "The uppermost horizontal line spanning from below the pinky finger toward the index finger. Governs romantic disposition, emotional depth, empathy, and relationships.",
    variations: [
      {
        id: "heart_under_index",
        name_th: "ทอดยาวไปสิ้นสุดใต้โคนนิ้วชี้ (เนินพฤหัส)",
        name_en: "Extends to Base of Index Finger (Jupiter)",
        summary_th: "รักเดียวใจเดียว อุดมคติในความรักสูง โรแมนติก ให้เกียรติคนรัก",
        summary_en: "Devoted romantic, high relational ideals, faithful, giving, and chivalrous in love.",
        prediction_th: "ตามตำราของ The Street Ratchada เส้นหัวใจที่ยาวไปถึงใต้นิ้วชี้ แสดงว่าเป็นคนที่ให้ความสำคัญกับความรักเป็นอันดับต้นๆ มองความรักในแง่ดี มีอุดมคติสูง ซื่อสัตย์ รักใครรักจริง พร้อมทุ่มเทดูแลคนรักอย่างดีที่สุด และคาดหวังความสัมพันธ์ที่ให้เกียรติซึ่งกันและกัน",
        prediction_en: "Represents noble devotion and soaring relational ideals. You invest wholeheartedly into love, cherish romantic loyalty, treat partners with profound respect, and believe in soulmates.",
        advice_th: "ยอมรับความไม่สมบูรณ์แบบของมนุษย์ อย่าตั้งมาตรฐานของคนรักไว้สูงจนกลายเป็นความกดดันในชีวิตคู่",
        advice_en: "Allow room for human flaws; do not let unrealistic romantic ideals suffocate everyday genuine affection."
      },
      {
        id: "heart_between_fingers",
        name_th: "สิ้นสุดระหว่างนิ้วชี้และนิ้วกลาง",
        name_en: "Terminates between Index & Middle Fingers",
        summary_th: "สมดุลระหว่างอารมณ์และเหตุผล อบอุ่น มีเสน่ห์ เข้าใจคนรักดี",
        summary_en: "Golden emotional balance, grounded warmth, realistic affection, and harmonious partner.",
        prediction_th: "นี่คือลักษณะเส้นหัวใจในอุดมคติที่สุด! แสดงถึงคนที่สามารถรักษาสมดุลระหว่างความรักและเหตุผลได้อย่างยอดเยี่ยม ไม่รักจนตาบอดและไม่เย็นชาจนเกินไป มีความอบอุ่น มั่นคงทางอารมณ์ เข้าอกเข้าใจคนอื่น เป็นคู่ชีวิตที่พึ่งพาได้",
        prediction_en: "Considered the healthiest heart line geometry. You balance emotional tenderness with clearheaded sensibility, creating enduring, stable, and deeply satisfying partnerships.",
        advice_th: "รักษาพลังแห่งความเข้าใจและความอบอุ่นนี้ไว้ คุณคือคู่ชีวิตในฝันของใครหลายคน",
        advice_en: "Continue nurturing transparent, open communication; your balanced emotional maturity is your greatest relationship asset."
      },
      {
        id: "heart_under_middle",
        name_th: "สิ้นสุดใต้โคนนิ้วกลาง (เนินเสาร์)",
        name_en: "Terminates under Middle Finger (Saturn)",
        summary_th: "มองความรักด้วยความเป็นจริง เน้นความมั่นคง ปฏิบัติมากกว่าคำพูด",
        summary_en: "Pragmatic, reserved, values security and tangible devotion over grand romantic declarations.",
        prediction_th: "เส้นหัวใจที่หยุดอยู่ใต้นิ้วกลาง บ่งบอกถึงคนที่มองความรักบนพื้นฐานของความเป็นจริง ไม่ชอบเรื่องเพ้อฝัน แสดงออกด้วยการกระทำและการสร้างความมั่นคงในชีวิตมากกว่าคำพูดหวานซึ้ง มักมีความต้องการส่วนตัวที่ชัดเจน และรักตัวเองเป็น",
        prediction_en: "Approaches intimacy through realistic lenses. You express love through financial responsibility, practical assistance, and tangible stability rather than dramatic emotional poetry.",
        advice_th: "หมั่นแสดงออกทางความรู้สึก คำชม และการกอดปลอบโยน เพื่อให้คนรักรับรู้ถึงความอบอุ่นในใจคุณ",
        advice_en: "Practice verbalizing affectionate appreciation; partners crave loving words alongside practical support."
      },
      {
        id: "heart_straight_parallel",
        name_th: "เส้นตรงและขนานกับเส้นสมอง",
        name_en: "Straight & Parallel to Head Line",
        summary_th: "ควบคุมอารมณ์เก่ง สุขุม เก็บความรู้สึกได้ดี ไม่วู่วาม",
        summary_en: "Master of emotional composure, calm under pressure, steady heart, and measured feelings.",
        prediction_th: "เส้นหัวใจที่ตรงเรียบขนานกับเส้นสมอง บ่งบอกถึงคนที่ควบคุมอารมณ์ความรู้สึกได้ดีเยี่ยม สุขุม ไม่หวั่นไหวง่าย มักเก็บความในใจไว้กับตัวเอง ไม่ชอบการทะเลาะเบาะแว้ง ใช้เหตุผลนำทางความรู้สึกเสมอ",
        prediction_en: "Possesses remarkable emotional self-discipline. You remain cool-headed in disputes and refuse to allow sudden emotional surges to hijack your rational judgment.",
        advice_th: "เปิดใจระบายความรู้สึกกับคนที่ไว้ใจบ้าง การเก็บกดอารมณ์ไว้คนเดียวอาจกลายเป็นความตึงเครียดสะสม",
        advice_en: "Share vulnerabilities with trusted confidants; keeping every emotional storm bottled up breeds silent internal stress."
      },
      {
        id: "heart_curved_up",
        name_th: "เส้นโค้งขึ้นอย่างเด่นชัด",
        name_en: "Warmly Curved Upward",
        summary_th: "เปิดเผยความรู้สึกเก่ง มีเสน่ห์ดึงดูด โรแมนติก อารมณ์สดใส",
        summary_en: "Expressive passion, magnetic warmth, demonstrative lover, wearing heart on sleeve.",
        prediction_th: "เส้นหัวใจที่โค้งขึ้นด้านบนอย่างชัดเจน บ่งบอกถึงคนที่มีเสน่ห์ดึงดูดใจเพศตรงข้ามอย่างมาก เปิดเผยความรู้สึกเก่ง รักใครบอกตรงๆ ไม่อ้อมค้อม แสดงความรักผ่านสัมผัสและการดูแลอย่างอบอุ่น มีชีวิตชีวาในความสัมพันธ์",
        prediction_en: "Radiates vivid charisma and romantic enthusiasm. You express love boldly, lavish your partner with physical affection and warmth, and bring intoxicating energy to partnerships.",
        advice_th: "ระวังอารมณ์ขึ้นลงง่ายตามสถานการณ์ และควรสังเกตความรู้สึกของอีกฝ่ายด้วยความใจเย็น",
        advice_en: "Guard against mood fluctuations driven by immediate whims; ensure your partner has breathing space to reciprocate."
      },
      {
        id: "heart_wavy_or_branched",
        name_th: "เส้นเป็นคลื่น หรือมีกิ่งก้านแตกออก",
        name_en: "Wavy or Branching Clusters",
        summary_th: "มีเสน่ห์ มีคนเข้ามารักใคร่มากมาย ความรู้สึกหลากหลาย",
        summary_en: "Charismatic romantic allure, multiple admirers, complex and colorful emotional tapestry.",
        prediction_th: "ตามตำรา The Street Ratchada เส้นหัวใจที่มีลักษณะเป็นคลื่นหรือมีกิ่งก้านแตกออก แสดงว่าเป็นคนมีเสน่ห์ทางอารมณ์สูงมาก มีคนเข้ามาสนใจในชีวิตรักหลายรูปแบบ ความรู้สึกเปลี่ยนแปลงได้ง่าย หรือเคยผ่านประสบการณ์ความรักที่หลากหลายเพื่อเรียนรู้ตัวตน",
        prediction_en: "Signifies rich romantic magnetism and multiple courting prospects throughout life. Your emotional experiences are colorful, multifaceted, and offer profound soul lessons.",
        advice_th: "เมื่อพบคนที่ใช่ ควรรักษาความหนักแน่นและชัดเจนในความสัมพันธ์เพื่อสร้างอนาคตร่วมกัน",
        advice_en: "Once true compatibility is found, cultivate steadfast loyalty and clear boundaries to build a lasting union."
      }
    ]
  },

  // 4. เส้นวาสนา (Fate Line / Line of Destiny)
  fate: {
    id: "fate",
    name_th: "เส้นวาสนา (Fate Line)",
    name_en: "Fate Line",
    color: "#f59e0b", // Radiant Gold
    icon: "👑",
    definition_th: "เส้นที่ลากจากด้านล่างของฝ่ามือขึ้นสู่ใต้นิ้วกลาง บ่งบอกถึงหน้าที่การงาน โชคลาภ ความสำเร็จ และทิศทางความมั่นคงในชีวิต",
    definition_en: "The vertical line running from the base of the palm upward toward the middle finger (Saturn). Governs career direction, career success, fortune, and external destiny.",
    variations: [
      {
        id: "fate_deep_straight",
        name_th: "เส้นตรง ลึก ชัดเจน จากข้อมือถึงใต้นิ้วกลาง",
        name_en: "Long, Deep & Unbroken from Wrist to Saturn",
        summary_th: "วาสนาสูง มีเป้าหมายชีวิตชัดเจน การงานมั่นคง ประสบความสำเร็จต่อเนื่อง",
        summary_en: "Steadfast destiny, early career purpose, relentless ambition, and durable success.",
        prediction_th: "ตามตำราของ The Street Ratchada ผู้ที่มีเส้นวาสนาลึกและยาวตรง บ่งบอกถึงคนที่มีเป้าหมายชีวิตชัดเจนตั้งแต่เยาว์วัย มีเส้นทางอาชีพที่มั่นคง ก้าวหน้าอย่างต่อเนื่อง มีโอกาสประสบความสำเร็จสูง มีวินัยในตัวเอง และมักได้รับการยอมรับในสายงานอย่างสง่างาม",
        prediction_en: "Marks a resolute individual with lifelong career focus and enviable stability. You forge ahead with discipline, overcome market fluctuations, and climb toward prominent vocational success.",
        advice_th: "อย่าปล่อยให้งานกลืนกินชีวิตทั้งหมด จัดสรรเวลาให้ความสุขส่วนตัวและคนที่คุณรัก",
        advice_en: "Do not let professional ambitions cannibalize your personal happiness; schedule time for love and soul nourishment."
      },
      {
        id: "fate_from_life",
        name_th: "เส้นเริ่มต้นแยกออกมาจากเส้นชีวิต",
        name_en: "Originates from the Life Line",
        summary_th: "สร้างเนื้อสร้างตัวด้วยหยาดเหงื่อแรงกายตนเอง ภูมิใจในความสำเร็จ",
        summary_en: "Self-made pioneer, triumphs earned through grit and unyielding perseverance.",
        prediction_th: "ตามตำรา The Street Ratchada เส้นวาสนาที่เชื่อมติดหรือแยกออกจากเส้นชีวิต บ่งบอกถึง 'คนสร้างเนื้อสร้างตัวด้วยตัวเอง' (Self-made) ความสำเร็จทั้งหมดไม่ได้มาจากโชคช่วยหรือมรดก แต่มาจากหยาดเหงื่อ ความพยายาม และความสามารถที่แท้จริงของคุณ",
        prediction_en: "The hallmark of the true self-made hero. Your achievements are earned purely through personal sweat, tenacity, and relentless grit rather than inherited privilege.",
        advice_th: "ภาคภูมิใจในทุกก้าวที่ผ่านมา และเรียนรู้การกระจายงานให้ผู้อื่นช่วยแบ่งเบาเพื่อการเติบโตที่ยั่งยืน",
        advice_en: "Take pride in your self-made milestones, and learn to delegate so your empire can scale sustainably without burning out."
      },
      {
        id: "fate_from_moon",
        name_th: "เส้นเริ่มต้นจากเนินพระจันทร์ (สันมือฝั่งนิ้วก้อย)",
        name_en: "Originates from Mount of Moon",
        summary_th: "มีโชคลาภที่ไม่คาดฝัน ลาภลอย ผู้ใหญ่อุปถัมภ์ เมตตามหานิยมสูง",
        summary_en: "Windfall fortune, magnetic public favor, patron support, and unexpected windfalls.",
        prediction_th: "ตามตำรา The Street Ratchada หากเส้นวาสนาเริ่มจากเนินพระจันทร์ มักทำนายว่ามีดวงลาภลอย หรือโชคลาภที่ไม่คาดฝัน! มีเสน่ห์เมตตามหานิยม ได้รับการสนับสนุนจากผู้ใหญ่ เพศตรงข้าม หรือคนรอบตัว ทำงานที่เกี่ยวข้องกับประชาชน สื่อ หรือการบริการจะรุ่งเรืองมาก",
        prediction_en: "According to The Street Ratchada, originating from the Mount of the Moon heralds unexpected windfalls and magnetic charisma! You enjoy royal favors, patron backing, and thrive in public-facing careers.",
        advice_th: "รักษาความจริงใจและน้ำใจที่มีต่อผู้อื่น พลังแห่งความเมตตาจะเป็นสะพานนำโชคลาภมาให้คุณไม่ขาดสาย",
        advice_en: "Cultivate sincere humility and generosity; the goodwill of others will continuously funnel extraordinary opportunities to your doorstep."
      },
      {
        id: "fate_broken_segmented",
        name_th: "เส้นขาดตอนแล้วต่อใหม่ หรือซ้อนกันเป็นช่วงๆ",
        name_en: "Segmented or Shifting Path",
        summary_th: "มีการเปลี่ยนสายงาน โยกย้ายถิ่นฐาน ยิ่งเปลี่ยนยิ่งดีขึ้น",
        summary_en: "Career pivot master, reinvention cycles, geographic shifts leading to upward breakthroughs.",
        prediction_th: "เส้นวาสนาที่มีรอยต่อหรือขยับเปลี่ยนแนว แสดงถึงการเปลี่ยนแปลงสายอาชีพครั้งใหญ่ การย้ายถิ่นฐาน หรือการเริ่มต้นธุรกิจใหม่ ทุกครั้งที่มีการเปลี่ยนแปลงจะนำพาไปสู่ขั้นบันไดชีวิตที่สูงขึ้นและตรงกับตัวตนมากขึ้น",
        prediction_en: "Points to pivotal career transformations, industry reinventions, or geographic relocations. Every transition acts as an upgraded launching pad toward greater personal alignment.",
        advice_th: "อย่ากลัวการเริ่มต้นใหม่ ทุกประสบการณ์ในอดีตคือวัตถุดิบชั้นดีสำหรับความสำเร็จในบทต่อไป",
        advice_en: "Never fear career transitions; past expertise serves as high-octane fuel for your next triumphant chapter."
      },
      {
        id: "fate_fork_to_sun",
        name_th: "แตกกิ่งขึ้นไปสู่นิ้วนาง (เส้นอาทิตย์/ชื่อเสียง)",
        name_en: "Branches toward Ring Finger (Sun/Apollo)",
        summary_th: "มีชื่อเสียง เกียรติยศ ร่ำรวย ได้รับการยกย่องในสังคม",
        summary_en: "Prominence, fame, social acclaim, financial affluence, and glowing reputation.",
        prediction_th: "เส้นวาสนาที่มีกิ่งก้านแยกพุ่งขึ้นไปสู่นิ้วนาง (เนินสุริยะ) เป็นสัญลักษณ์ของความมีชื่อเสียง เกียรติยศ และความมั่งคั่ง ผลงานของคุณจะโดดเด่น เป็นที่ประจักษ์ต่อสาธารณชน และสร้างฐานะทางการเงินได้อย่างงดงาม",
        prediction_en: "An extraordinarily auspicious marker guaranteeing public acclaim, financial prosperity, and enduring prestige. Your talents capture the spotlight and earn generous financial rewards.",
        advice_th: "ใช้ชื่อเสียงและฐานะเพื่อสร้างคุณประโยชน์ให้สังคม จะช่วยเสริมบารมีให้ยืนยาวสืบไป",
        advice_en: "Leverage your fame and wealth to uplift others; benevolent generosity immortalizes your legacy."
      },
      {
        id: "fate_absent_or_faint",
        name_th: "เส้นเลือนราง หรือไม่มีเส้นวาสนาเด่นชัด",
        name_en: "Faint or Absent Line",
        summary_th: "ชีวิตอิสระ ไร้กรอบ กำหนดชะตาชีวิตด้วยตนเองอย่างแท้จริง",
        summary_en: "Free agent, adaptable, unchained by corporate dogmas, author of your own destiny.",
        prediction_th: "ตามตำราของ The Street Ratchada การไม่มีเส้นวาสนาหรือเส้นจาง 'ไม่ได้แปลว่าชีวิตไม่ดี' แต่อย่างใด! หากแต่หมายถึงชีวิตที่รักอิสระ ไม่ชอบทำงานที่จำเจ ไม่ถูกผูกมัดด้วยกฎเกณฑ์ และคุณมีอิสระในการออกแบบชะตากรรมของตนเองได้ตามใจปรารถนา",
        prediction_en: "The Street Ratchada explicitly clarifies that an absent fate line does NOT mean bad luck! Rather, you are an unbound free spirit, unbound by rigid corporate rat-races, free to author your own reality.",
        advice_th: "กำหนดเป้าหมายที่คุณรักด้วยตนเอง และใช้ชีวิตตามเสียงหัวใจโดยไม่ต้องเปรียบเทียบกับใคร",
        advice_en: "Chart your personal compass according to your authentic passions without measuring yourself against conventional expectations."
      }
    ]
  },

  // 5. เส้นสมรส / เส้นเนื้อคู่ (Marriage Line)
  marriage: {
    id: "marriage",
    name_th: "เส้นสมรส / เส้นเนื้อคู่ (Marriage Line)",
    name_en: "Marriage Line",
    color: "#a855f7", // Mystic Purple
    icon: "💍",
    definition_th: "เส้นแนวนอนสั้นๆ บริเวณสันมือใต้โคนนิ้วก้อย บ่งบอกถึงความสัมพันธ์กับคู่ครอง โอกาสการแต่งงาน และความราบรื่นในชีวิตคู่",
    definition_en: "Short horizontal lines on the edge of the palm below the little finger. Dictates significant romantic bonds, marriage timing, and spousal harmony.",
    variations: [
      {
        id: "marriage_single_clear",
        name_th: "เส้นเดี่ยว ลึก ยาว ตรงสวยงาม",
        name_en: "Single, Deep & Straight Line",
        summary_th: "คู่แท้ มีความสุขในชีวิตแต่งงาน คู่ครองเกื้อหนุนส่งเสริม",
        summary_en: "True soulmate bond, marital harmony, mutual spousal elevation, and faithful devotion.",
        prediction_th: "ตามตำรา The Street Ratchada เส้นสมรสที่ลึก ชัด และตรงเพียงเส้นเดียว เป็นสัญลักษณ์ของความรักที่มั่นคง คุณจะได้พบกับคู่แท้ที่เกื้อหนุนซึ่งกันและกัน มีชีวิตคู่ที่ราบรื่น อบอุ่น และยืนยาวด้วยความซื่อสัตย์",
        prediction_en: "The quintessential soulmate hallmark. Indicates finding a deeply devoted lifelong partner who enriches your happiness, offers unshakeable emotional security, and shares mutual respect.",
        advice_th: "หมั่นดูแลเอาใจใส่ความรู้สึกของกันและกัน เพื่อให้ความสัมพันธ์หวานชื่นตลอดไป",
        advice_en: "Nurture everyday gestures of affection to keep the romantic flame vibrant across the decades."
      },
      {
        id: "marriage_curve_up",
        name_th: "ปลายเส้นโค้งชี้ขึ้นสู่นิ้วก้อย",
        name_en: "Curving Gently Upward",
        summary_th: "ชีวิตคู่สมบูรณ์พูนสุข นำพาโชคลาภและความเจริญรุ่งเรืองมาให้",
        summary_en: "Auspicious marriage bringing wealth, joy, social status, and flourishing prosperity.",
        prediction_th: "เส้นสมรสที่ปลายโค้งขึ้นอย่างอ่อนหวาน บ่งบอกถึงการแต่งงานที่นำพาความโชคดี ความเจริญรุ่งเรือง และฐานะที่ดีขึ้นมาสู่ครอบครัว คู่ครองมีบุคลิกภาพที่ดีและช่วยหนุนดวงชะตาให้ประสบความสำเร็จ",
        prediction_en: "An auspicious upward curve signaling a marriage that accelerates your financial, social, and spiritual prosperity. Your spouse acts as a lucky star in your destiny.",
        advice_th: "ร่วมมือกันวางแผนการเงินและอนาคต จะช่วยสร้างความมั่นคงให้ครอบครัวได้อย่างรวดเร็ว",
        advice_en: "Pool your collective ambitions together; joint ventures with your partner yield tremendous dividends."
      },
      {
        id: "marriage_multiple_lines",
        name_th: "มี 2-3 เส้นขนานกัน",
        name_en: "Multiple Parallel Lines",
        summary_th: "มีคนเข้ามาผูกพันหลายคน หรือมีรักแท้เกิดขึ้นหลังผ่านบทเรียน",
        summary_en: "Rich romantic history, deep emotional lessons, culminating in mature lasting love.",
        prediction_th: "การมีเส้นสมรสหลายเส้น บ่งบอกถึงการเป็นคนมีเสน่ห์ มีความรักที่ลึกซึ้งหลายช่วงเวลาในชีวิต เส้นที่เด่นและลึกที่สุดคือคู่ครองตัวจริงที่จะอยู่ด้วยกันอย่างยั่งยืน มักพบคู่แท้หลังจากได้เรียนรู้และเติบโตทางอารมณ์แล้ว",
        prediction_en: "Reveals multiple significant romantic chapters. The deepest, most prominent line represents the definitive life partner, typically discovered once emotional maturity is reached.",
        advice_th: "นำบทเรียนจากอดีตมาพัฒนาตนเอง เมื่อเจอคนที่ใช่จงเลือกความสบายใจและความจริงใจเป็นหลัก",
        advice_en: "Harvest wisdom from past relationships to recognize and cherish the partner who brings peace to your soul."
      },
      {
        id: "marriage_curve_down_or_forked",
        name_th: "ปลายเส้นโค้งลง หรือแตกเป็นง่ามเล็กน้อย",
        name_en: "Curving Downward or Forked",
        summary_th: "ต้องประคับประคองความสัมพันธ์ มีความคิดเห็นต่างกันบ้างแต่ปรับจูนได้",
        summary_en: "Requires conscious relational maintenance; differences in communication bridged through patience.",
        prediction_th: "เส้นสมรสที่ปลายโค้งลงหรือแตกสองแฉก บ่งบอกว่าในชีวิตคู่อาจมีช่วงเวลาที่ความคิดเห็นไม่ตรงกัน มีระยะห่าง หรือต้องประคับประคองความรู้สึกซึ่งกันและกัน แต่หากใช้ความเข้าใจและการเปิดใจคุยกัน ก็จะสามารถครองคู่กันได้อย่างยั่งยืน",
        prediction_en: "Suggests periods of divergent viewpoints or circumstantial distance. With patient communication, compromise, and mutual empathy, challenges transform into deeper connection.",
        advice_th: "หมั่นเปิดอกคุยกันด้วยเหตุผลและน้ำเสียงที่นุ่มนวล หลีกเลี่ยงการใช้อารมณ์ตัดสินปัญหาในชีวิตคู่",
        advice_en: "Cultivate proactive active listening; calm diplomacy resolves relational friction before it festers."
      }
    ]
  }
};

if (typeof window !== "undefined") {
  window.PALM_HAND_RULES = PALM_HAND_RULES;
  window.PALM_LINES_DATA = PALM_LINES_DATA;
}
