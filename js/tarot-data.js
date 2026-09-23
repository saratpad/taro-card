/**
 * 78 Tarot Cards Comprehensive Bilingual Database
 * Sourced & structured according to authentic Tarot divination & shitsuren-tarot.com principles.
 */

const TAROT_CARDS = [
  // =========================================================================
  // MAJOR ARCANA (0 - 21)
  // =========================================================================
  {
    id: "m_00",
    number: 0,
    suite: "major",
    name_en: "The Fool",
    name_th: "เดอะ ฟูล (The Fool)",
    image: "01_Major_Arcana/00_0. The Fool.png",
    element: { en: "Air / Uranus", th: "ธาตุลม / ดาวยูเรนัส (มฤตยู)" },
    quote: {
      th: "เด็กหนุ่มผู้มีอิสระ ไร้เดียงสา พร้อมจะผจญภัยสู่โลกกว้าง ก้าวเดินไปยังหน้าผาอย่างไม่หวั่นเกรง",
      en: "The innocent wanderer stepping toward the unknown cliff edge with fearless optimism and untamed freedom."
    },
    upright: {
      keywords: {
        th: ["การเริ่มต้นใหม่", "อิสรภาพ", "ความกล้าเสี่ยง", "ทำตามหัวใจ", "ไร้เดียงสา"],
        en: ["New Beginnings", "Freedom", "Spontaneity", "Taking Risks", "Innocence"]
      },
      general: {
        th: "ไพ่แห่งการเริ่มต้นใหม่ ความกล้าที่จะก้าวออกจากกรอบเดิมๆ การผจญภัยที่ไร้ความกลัว แม้เบื้องหน้าจะมีอุปสรรคแต่จิตวิญญาณพร้อมลุยด้วยความบริสุทธิ์ใจ",
        en: "A card of brand new beginnings, unlimited potential, and leaping into the unknown with an open heart and spontaneous trust in the universe."
      },
      love: {
        th: "ความรักที่อิสระ สดใหม่ เริ่มต้นความสัมพันธ์ที่ตื่นเต้น หรือการเปิดใจรักโดยไม่เอาอดีตมาผูกมัด คนโสดมีเกณฑ์พบคนที่มีเสน่ห์รักอิสระ",
        en: "An exciting, spontaneous new romance full of adventure. Free of old baggage, open to exploration. Singles may meet a carefree spirit."
      },
      career: {
        th: "โอกาสใหม่ในสายงาน โปรเจกต์ใหม่ที่ท้าทาย หรือการกล้าลาออกมาทำสิ่งที่รัก ทำงานอิสระ (Freelance) หรือเริ่มธุรกิจส่วนตัว",
        en: "A fresh venture, freelance opportunities, or daring to take an unconventional career leap into what you genuinely love."
      },
      finance: {
        th: "การเงินหมุนเวียน ใช้จ่ายตามอารมณ์และความพอใจ การลงทุนในสิ่งใหม่ๆ มีความเสี่ยงสูงแต่มีโอกาสเติบโต ควรบริหารเงินสำรอง",
        en: "Optimistic but impulsive spending. High-risk, high-reward new investments. Ensure you keep an emergency cushion."
      },
      health: {
        th: "สุขภาพมีพลังงานล้นเหลือ แต่ต้องระวังอุบัติเหตุจากการเล่นกีฬาโลดโผน หรือความประมาทเลินเล่อ",
        en: "Vibrant vitality and youthfulness. Watch out for accidents from carelessness or extreme physical pursuits."
      },
      advice: {
        th: "จงกล้าก้าวออกจากคอมฟอร์ตโซน เชื่อมั่นในสัญชาตญาณ แต่อย่าลืมมองพื้นใต้เท้าเพื่อไม่ให้สะดุดล้ม",
        en: "Trust the journey and take the leap of faith, but stay mindful of the ground beneath your feet."
      }
    },
    reversed: {
      keywords: {
        th: ["ความประมาท", "ความเสี่ยงอันตราย", "ความไม่รอบคอบ", "ความลังเล", "การทำตามใจเกินไป"],
        en: ["Recklessness", "Carelessness", "Risk-taking", "Hesitation", "Naivety"]
      },
      general: {
        th: "การกระทำที่ขาดสติ ความใจร้อนวู่วามจนนำพาไปสู่ความเสียหาย หรือในทางตรงข้ามคือความกลัวจนไม่กล้าเริ่มต้นอะไรใหม่",
        en: "Foolish risks, negligence, or being paralyzed by fear of the unknown. Acting without foresight leads to avoidable pitfalls."
      },
      love: {
        th: "ความสัมพันธ์ที่ไม่แน่นอน อีกฝ่ายอาจยังไม่อยากผูกมัด รักสนุกแต่ไม่รับผิดชอบ หรือการเสี่ยงใจกับคนที่ไม่เห็นคุณค่า",
        en: "Lack of commitment, unreliable partner, or entering a relationship blindly without noticing major red flags."
      },
      career: {
        th: "การตัดสินใจเปลี่ยนงานอย่างหุนหันพลันแล่น ขาดการวางแผนทำให้ตกที่นั่งลำบาก ระวังความผิดพลาดจากความไม่รอบคอบในงาน",
        en: "Impulsive job quitting, lack of direction, or chaotic carelessness jeopardizing professional reputation."
      },
      finance: {
        th: "การใช้จ่ายเกินตัว หนี้สินจากบัตรเครดิต หรือการลงทุนในสิ่งหลอกลวงเพราะความโลภ ระวังเงินรั่วไหล",
        en: "Severe financial recklessness, living beyond means, gambling, or falling for dubious get-rich-quick schemes."
      },
      health: {
        th: "ระวังอุบัติเหตุจากการตกจากที่สูง เคล็ดขัดยอก และควรระวังอันตรายจากเครื่องใช้ไฟฟ้า",
        en: "Heightened risk of falls, clumsy injuries, or neglecting symptoms until they become problematic."
      },
      advice: {
        th: "หยุดคิดทบทวนก่อนลงมือทำ อย่าปล่อยให้อารมณ์ชั่ววูบทำลายความมั่นคงที่คุณสร้างมา",
        en: "Pause and calculate the consequences before leaping. Enthusiasm without discipline breeds chaos."
      }
    }
  },
  {
    id: "m_01",
    number: 1,
    suite: "major",
    name_en: "The Magician",
    name_th: "เดอะ เมจิเชียน (The Magician)",
    image: "01_Major_Arcana/01_1. The Magician.png",
    element: { en: "Mercury", th: "ดาวพุธ (สติปัญญาและการสื่อสาร)" },
    quote: {
      th: "ผู้ร่ายมนตร์แห่งจักรวาล ผู้เปลี่ยนความคิดให้กลายเป็นความจริงด้วยพลังแห่งธาตุทั้งสี่",
      en: "The divine alchemist who manifests spiritual vision into earthly reality through willpower and skill."
    },
    upright: {
      keywords: {
        th: ["ความสามารถรอบด้าน", "การเสกสร้าง", "วาทศิลป์", "สติปัญญา", "ความมั่นใจ"],
        en: ["Manifestation", "Resourcefulness", "Power", "Inspired Action", "Skill"]
      },
      general: {
        th: "คุณมีเครื่องมือ ทรัพยากร และสติปัญญาครบถ้วนในมือ สิ่งที่คุณมุ่งมั่นจะสามารถเนรมิตให้เป็นจริงได้ด้วยความสามารถของคุณเอง",
        en: "You possess all elements (fire, water, air, earth) needed to manifest your intentions into reality. Peak potential and focus."
      },
      love: {
        th: "เสน่ห์ล้นเหลือ การสื่อสารที่เข้าใจลึกซึ้ง หากโสดจะเจอคนฉลาด พูดเก่ง น่าหลงใหล หากมีคู่จะสามารถฟื้นฟูไฟรักให้หวานชื่น",
        en: "Magnetic attraction, witty communication, and mutual fascination. Manifesting the romance you deeply desire."
      },
      career: {
        th: "ความสำเร็จในงานที่ต้องใช้ทักษะเฉพาะทาง การเจรจาต่อรอง การนำเสนอ หรือการเริ่มต้นโปรเจกต์ที่ใช้ความคิดสร้างสรรค์",
        en: "Mastery of your craft, triumphant negotiations, brilliant presentations, and breakthrough ideas turning into profit."
      },
      finance: {
        th: "โอกาสทางการเงินหลั่งไหลเข้ามาจากความรู้ความสามารถ การหารายได้จากหลายช่องทาง การลงทุนให้ผลตอบแทนดี",
        en: "Financial abundance generated through talent and innovation. Great timing to monetize skills."
      },
      health: {
        th: "สุขภาพแข็งแรงทั้งกายและใจ การฟื้นตัวจากอาการป่วยอย่างรวดเร็ว มีพลังบำบัดตนเองสูง",
        en: "Excellent vitality, rapid recovery from ailments, mental agility, and mind-body harmony."
      },
      advice: {
        th: "จงเชื่อมั่นในพลังแห่งตน โลกกำลังรอคอยความสามารถของคุณ ลงมือทำทันทีด้วยความตั้งใจจริง",
        en: "Harness your innate magic and declare your intent. You hold all the tools to succeed."
      }
    },
    reversed: {
      keywords: {
        th: ["การล่อลวง", "ความสามารถแฝงเล่ห์", "ขาดสมาธิ", "เสียดายโอกาส", "การหลอกลวง"],
        en: ["Illusion", "Manipulation", "Untapped Talents", "Trickery", "Wasted Potential"]
      },
      general: {
        th: "การใช้ความฉลาดในทางที่ผิด การหลอกลวง ปลิ้นปล้อน หรือความรู้สึกว่าตนเองมีของแต่ไม่ยอมดึงออกมาใช้",
        en: "Misuse of intellect, cunning deception, unkept promises, or self-doubt blocking innate talents from shining."
      },
      love: {
        th: "ระวังคนปากหวานแต่ไม่จริงใจ การปกปิดความลับ การสร้างภาพเพื่อผลประโยชน์ในความสัมพันธ์",
        en: "Superficial sweet talk concealing deceitful motives. Being sweet-talked or manipulated in love."
      },
      career: {
        th: "ระวังเพื่อนร่วมงานหรือคู่ค้าที่ไม่ซื่อสัตย์ การขายฝัน โครงการที่สัญญาไว้แต่ทำไม่ได้จริง",
        en: "Dishonest sales pitches, fraudulent deals, toxic workplace gaslighting, or imposter syndrome paralyzing your output."
      },
      finance: {
        th: "ระวังการถูกหลอกลงทุน คอลเซ็นเตอร์ หรือสัญญาที่ไม่โปร่งใส อย่าหลงเชื่อผลกำไรที่ดูเกินจริง",
        en: "Scams, predatory schemes, hidden contractual traps, and illusions of quick wealth."
      },
      health: {
        th: "ความเครียดส่งผลต่อระบบประสาท อาการปวดหัว ไมเกรน หรือการวินิจฉัยโรคที่ยังไม่ตรงจุด",
        en: "Nervous strain, mental burnout, psychosomatic symptoms, or misleading medical remedies."
      },
      advice: {
        th: "ตรวจสอบความจริงเบื้องหลังคำพูด อย่าหลงกลภาพลวงตา และใช้ความรู้ด้วยความซื่อสัตย์สุจริต",
        en: "Scrutinize motives—both your own and others'. Align ambition with moral integrity."
      }
    }
  },
  {
    id: "m_02",
    number: 2,
    suite: "major",
    name_en: "The High Priestess",
    name_th: "เดอะ ไฮพรีสเตส (The High Priestess)",
    image: "01_Major_Arcana/02_2. The High Priestess.png",
    element: { en: "Moon", th: "ดวงจันทร์ (จิตใต้สำนึกและญาณหยั่งรู้)" },
    quote: {
      th: "ผู้พิทักษ์ม่านแห่งความเร้นลับ นั่งอยู่ระหว่างเสาดำและขาว หยั่งรู้ความจริงอันซ่อนเร้น",
      en: "The silent keeper of divine mysteries seated between darkness and light, attuned to inner wisdom."
    },
    upright: {
      keywords: {
        th: ["ญาณหยั่งรู้", "ความลึกลับ", "จิตใต้สำนึก", "ความสงบนิ่ง", "สัญชาตญาณ"],
        en: ["Intuition", "Sacred Knowledge", "Divine Feminine", "Subconscious", "Mystery"]
      },
      general: {
        th: "ช่วงเวลาแห่งการฟังเสียงกระซิบจากภายในจิตใจ ความลับกำลังจะเปิดเผย สิ่งที่ตามองไม่เห็นสำคัญกว่าสิ่งภายนอก",
        en: "Listen to your intuition above external chatter. Deep spiritual wisdom, esoteric secrets, and latent psychic insight."
      },
      love: {
        th: "ความรักที่ซ่อนเร้น ความรู้สึกที่ลึกซึ้งแต่ไม่เปิดเผย หรือเสน่ห์ดึงดูดที่น่าค้นหา คนมีคู่จะเข้าใจกันโดยไม่ต้องเอ่ยปาก",
        en: "Profound soul connection, unspoken intimacy, or a secret unspoken longing. Magnetic, quiet allure."
      },
      career: {
        th: "เหมาะกับงานวิจัย จิตวิทยา การศึกษา วางกลยุทธ์ลับ หรือศาสตร์พยากรณ์ ใช้สัญชาตญาณในการตัดสินใจมากกว่าตัวเลขภายนอก",
        en: "Excellence in research, psychology, advisory, esoteric arts, and backstage strategic planning."
      },
      finance: {
        th: "ควรเก็บรักษาข้อมูลการเงินไว้เป็นความลับ อย่าเพิ่งลงทุนตามกระแส ให้รอจังหวะที่ข้อมูลชัดเจน",
        en: "Keep financial maneuvers discreet. Trust gut feelings regarding contracts; hold investments until fog clears."
      },
      health: {
        th: "เกี่ยวข้องกับฮอร์โมน รอบเดือน อารมณ์แปรปรวน ควรพักผ่อนและทำสมาธิบำบัดจิตใจ",
        en: "Hormonal equilibrium, menstrual cycle awareness, sleep restoration, and meditative healing."
      },
      advice: {
        th: "จงนิ่งสงบ ดำดิ่งลงสู่ความเงียบ แล้วคำตอบที่คุณค้นหาจะผุดขึ้นมาจากหัวใจของคุณเอง",
        en: "Be still and observe. Silence holds the sacred answer that rational argument cannot yield."
      }
    },
    reversed: {
      keywords: {
        th: ["ความลับแตก", "การเพิกเฉยสัญชาตญาณ", "อารมณ์แปรปรวน", "ความซุบซิบนินทา", "ความเย็นชา"],
        en: ["Secrets Revealed", "Ignored Intuition", "Emotional Coldness", "Gossip", "Repressed Feelings"]
      },
      general: {
        th: "การมองข้ามเสียงเตือนในใจ ความลับที่ถูกปิดบังไว้ถูกเปิดเผย หรืออารมณ์ที่แปรปรวนจนตัดสินใจผิดพลาด",
        en: "Hidden agendas exposed, rejecting your gut instinct, surface-level superficiality, or emotional withdrawal."
      },
      love: {
        th: "มีเรื่องปิดบัง ซ่อนความรู้สึก หรือมีมือที่สามเข้ามาเกี่ยวพัน ความไม่เชื่อใจกันกัดกร่อนความสัมพันธ์",
        en: "Infidelity suspicions, emotional dishonesty, suppressed resentments, or cold detachment between partners."
      },
      career: {
        th: "การเมืองในที่ทำงาน การแทงข้างหลัง ข้อมูลบิดเบือน หรือถูกกีดกันไม่ให้รู้ข้อมูลสำคัญ",
        en: "Office rumors, hidden backstabbing, suppressed truths, or feeling disconnected from your workplace purpose."
      },
      finance: {
        th: "มีค่าใช้จ่ายแอบแฝงที่ไม่ได้คาดคิด บัญชีที่ไม่โปร่งใส หรือการเซ็นสัญญาโดยไม่ได้อ่านเงื่อนไขลับ",
        en: "Hidden fees, concealed financial burdens, or deceitful contractual clauses suddenly surfacing."
      },
      health: {
        th: "ความเครียดสะสม นอนไม่หลับ ภาวะฮอร์โมนไม่สมดุล หรือความแปรปรวนทางอารมณ์รุนแรง",
        en: "Severe insomnia, hormonal disruption, reproductive strain, or anxiety from repressed emotions."
      },
      advice: {
        th: "อย่าหลอกตัวเอง เผชิญหน้ากับความจริงที่อยู่เบื้องหลังม่าน และกลับมาซื่อสัตย์กับหัวใจตนเอง",
        en: "Stop suppressing what you already know to be true. Confront reality with gentle honesty."
      }
    }
  },
  {
    id: "m_03",
    number: 3,
    suite: "major",
    name_en: "The Empress",
    name_th: "ดิ เอ็มเพรส (The Empress)",
    image: "01_Major_Arcana/03_3. The Empress.png",
    element: { en: "Venus", th: "ดาวศุกร์ (ความอุดมสมบูรณ์และความงาม)" },
    quote: {
      th: "มารดาแห่งผืนพิภพ ผู้โอบอุ้มสรรพสิ่งด้วยความอุดมสมบูรณ์ ความรัก และความคิดสร้างสรรค์อันไร้ขอบเขต",
      en: "The divine mother radiating maternal warmth, creative fertility, sensual luxury, and bountiful harvest."
    },
    upright: {
      keywords: {
        th: ["ความอุดมสมบูรณ์", "การให้กำเนิด", "ความงาม", "ความสะดวกสบาย", "ความรักอันอบอุ่น"],
        en: ["Abundance", "Fertility", "Nurturing", "Creativity", "Sensuality"]
      },
      general: {
        th: "ช่วงเวลาแห่งการเก็บเกี่ยวความสุข ความสมบูรณ์พูนสุขในชีวิต ผลิดอกออกผลทั้งในความคิดสร้างสรรค์และครอบครัว",
        en: "Flourishing abundance in all aspects. Creative projects bloom, home life feels comforting, and prosperity thrives."
      },
      love: {
        th: "ความรักที่อบอุ่น มั่นคง เอาใจใส่ดูแลกันอย่างดี มีโอกาสแต่งงาน มีบุตร หรือพัฒนาความสัมพันธ์ไปสู่ระดับครอบครัว",
        en: "Unconditional love, harmonious partnership, pregnancy/motherhood, and deep emotional security."
      },
      career: {
        th: "โปรเจกต์เติบโตงอกงาม ได้รับการสนับสนุนจากผู้ใหญ่ โดยเฉพาะผู้หญิง งานศิลปะ ความงาม หรือธุรกิจบริการโดดเด่น",
        en: "Bountiful business growth, nurturing mentorship, artistic acclaim, and high customer satisfaction."
      },
      finance: {
        th: "การเงินมั่งคั่ง มีกินมีใช้ไม่ขาดมือ ผลตอบแทนจากการลงทุนงอกเงย ได้ของขวัญหรือมรดก",
        en: "Financial prosperity, comfort, successful harvests from investments, and luxury living within means."
      },
      health: {
        th: "สุขภาพแข็งแรง ผิวพรรณเปล่งปลั่ง เป็นช่วงเวลาที่ดีสำหรับการมีบุตรและการฟื้นฟูร่างกาย",
        en: "Radiant physical health, vitality, pregnancy wellness, and restorative natural nourishment."
      },
      advice: {
        th: "โอบกอดตัวเองและคนรอบข้างด้วยความเมตตา บ่มเพาะเมล็ดพันธุ์แห่งความหวังแล้วเฝ้ารอวันเก็บเกี่ยว",
        en: "Nurture yourself and those you love. Generosity and patience will bring forth abundant blessings."
      }
    },
    reversed: {
      keywords: {
        th: ["การละเลยตนเอง", "ความตระหนี่", "ความคิดสร้างสรรค์ตีบตัน", "ความขึ้นต่อผู้อื่น", "การควบคุมเกินไป"],
        en: ["Creative Block", "Depletion", "Overbearing", "Neglect", "Financial Insecurity"]
      },
      general: {
        th: "การสูญเสียพลังงาน ความรู้สึกเหนื่อยล้าจากการทุ่มเทให้คนอื่นจนลืมดูแลตนเอง หรือปัญหาในครอบครัว",
        en: "Creative drought, burnout from excessive caretaking, smothering codependency, or neglecting personal needs."
      },
      love: {
        th: "การจู้จี้จุกจิก เอาแต่ใจ หรือรู้สึกว่าตนเองเป็นฝ่ายให้แต่ไม่เคยได้รับความรักตอบแทน",
        en: "Smothering affection, conditional love, feeling unappreciated, or possessive insecurity damaging the bond."
      },
      career: {
        th: "งานไม่คืบหน้า ขาดแรงบันดาลใจ ความขัดแย้งกับเจ้านายหรือผู้ใหญ่ผู้หญิงในที่ทำงาน",
        en: "Creative block, stagnant business growth, hostile domestic disruptions spilling into work life."
      },
      finance: {
        th: "การใช้จ่ายฟุ่มเฟือยเพื่อชดเชยความเหงา หรือความกังวลเรื่องการเงินจนตระหนี่เกินไป",
        en: "Overspending on sensory comfort, wasteful splurges, or hoarded scarcity mindset causing stress."
      },
      health: {
        th: "ปัญหาเกี่ยวกับระบบสืบพันธุ์ ความไม่สมดุลของน้ำหนัก ฮอร์โมน หรือความเครียดทางกายภาพ",
        en: "Exhaustion, hormonal imbalance, fertility complications, or neglected self-care taking a toll."
      },
      advice: {
        th: "กลับมาเติมพลังให้หัวใจตนเองก่อน อย่าปล่อยให้พลังงานของคุณเหือดแห้งไปกับการแบกรับความต้องการของคนอื่น",
        en: "You cannot pour from an empty cup. Replenish your own garden before tending to others."
      }
    }
  },
  {
    id: "m_04",
    number: 4,
    suite: "major",
    name_en: "The Emperor",
    name_th: "ดิ เอ็มเพอเรอร์ (The Emperor)",
    image: "01_Major_Arcana/04_4. The Emperor.png",
    element: { en: "Aries / Mars", th: "ราศีเมษ / ดาวอังคาร (ผู้นำและความเด็ดขาด)" },
    quote: {
      th: "องค์จักรพรรดิผู้ประทับบนบัลลังก์หิน ผู้สถาปนากฎเกณฑ์ ความมั่นคง และอำนาจการปกครองอันศักดิ์สิทธิ์",
      en: "The sovereign ruler upon the granite throne, forging order out of chaos through discipline and unbending authority."
    },
    upright: {
      keywords: {
        th: ["อำนาจ", "ความเป็นผู้นำ", "โครงสร้าง", "ความมั่นคง", "วินัย"],
        en: ["Authority", "Structure", "Leadership", "Discipline", "Stability"]
      },
      general: {
        th: "พลังแห่งการควบคุม การจัดระเบียบชีวิต การใช้เหตุผลและตรรกะเหนืออารมณ์ สร้างรากฐานที่แข็งแกร่งให้ชีวิต",
        en: "Commanding leadership, strategic organization, firm boundaries, and building enduring empires."
      },
      love: {
        th: "ความรักที่จริงจัง มั่นคง ปกป้องดูแลได้ดี แต่อาจขาดความหวานแหวว คู่ครองเป็นคนมีความรับผิดชอบสูงหรือเป็นผู้นำ",
        en: "Protective, dependable, and highly committed partnership. Traditional values, though occasionally stern."
      },
      career: {
        th: "ความก้าวหน้าในตำแหน่งผู้บริหาร การคุมคน การบริหารจัดการองค์กรขนาดใหญ่ ได้รับความไว้วางใจจากผู้ใหญ่",
        en: "Executive promotion, entrepreneurial authority, commanding respect, and establishing orderly business systems."
      },
      finance: {
        th: "การเงินมั่นคงสูง บริหารจัดการอย่างมีแบบแผน การลงทุนในอสังหาริมทรัพย์หรือสินทรัพย์ที่จับต้องได้",
        en: "Rock-solid financial stability, disciplined budgeting, wise long-term property or structural investments."
      },
      health: {
        th: "สุขภาพแข็งแกร่ง อดทน แต่ควรระวังความดันโลหิต ความเครียดจากการทำงานหนัก และกล้ามเนื้อเกร็ง",
        en: "Robust constitution and stamina. Keep blood pressure and workaholic stress under check."
      },
      advice: {
        th: "ตั้งเป้าหมายให้ชัดเจน วางแผนอย่างเป็นขั้นตอน และลงมือทำด้วยวินัยเหล็กที่คุณมี",
        en: "Stand firm in your sovereignty. Bring order to your kingdom through decisive action and self-discipline."
      }
    },
    reversed: {
      keywords: {
        th: ["เผด็จการ", "ใช้อำนาจในทางที่ผิด", "ขาดวินัย", "ดื้อรั้น", "ความอ่อนแอ"],
        en: ["Tyranny", "Rigidity", "Lack of Discipline", "Abuse of Power", "Stubbornness"]
      },
      general: {
        th: "การยึดติดกับความคิดตนเองจนเป็นเผด็จการ หรือในทางกลับกันคือความล้มเหลวในการควบคุมชีวิตตนเอง ขาดระเบียบวินัย",
        en: "Micromanaging tyranny, unyielding dogmatism, or completely chaotic collapse of personal control."
      },
      love: {
        th: "คนรักบงการ ควบคุมชีวิต หึงหวงจนอึดอัด หรือความสัมพันธ์ที่ตึงเครียดจากความถือดีในอีโก้",
        en: "Domineering partner, toxic control tactics, emotional inflexibility, or power struggles stifling intimacy."
      },
      career: {
        th: "ปัญหากับหัวหน้าที่ใช้อารมณ์บ้าอำนาจ ระบบงานที่ล้าหลังไร้ความยืดหยุ่น หรือการบริหารงานที่ล้มเหลว",
        en: "Clashes with tyrannical bosses, bureaucratic stagnation, loss of authority, or poor organizational management."
      },
      finance: {
        th: "การควบคุมการเงินล้มเหลว ปัญหาภาษี คดีความ หรือการลงทุนในระบบที่ไม่ปลอดภัย",
        en: "Financial chaos from poor oversight, legal/tax penalties, or overbearing debtors applying pressure."
      },
      health: {
        th: "อาการปวดหัว ปวดหลัง และความดันขึ้นจากความเครียดสะสม ควรพักผ่อนและผ่อนคลายกล้ามเนื้อ",
        en: "Hypertension, migraines, back tension, and physical ailments caused by suppressed rage or stubborn stress."
      },
      advice: {
        th: "ลดทิฐิและอีโก้ลงบ้าง ความยืดหยุ่นไม่ใช่ความอ่อนแอ แต่คือปัญญาที่จะช่วยรักษาความสัมพันธ์ไว้",
        en: "Soften your grip. True strength is adaptable and just, not coercive and rigid."
      }
    }
  },
  {
    id: "m_05",
    number: 5,
    suite: "major",
    name_en: "The Hierophant",
    name_th: "เดอะ ไฮโรแฟนท์ (The Hierophant)",
    image: "01_Major_Arcana/05_5. The Hierophant.png",
    element: { en: "Taurus", th: "ราศีพฤษภ (ขนบธรรมเนียมและศีลธรรม)" },
    quote: {
      th: "สังฆราชผู้ถือครองกุญแจสองดอก ชี้ทางสว่างด้วยคำสอน จารีตประเพณี และปัญญาแห่งจิตวิญญาณ",
      en: "The spiritual bridge connecting divine decree with earthly tradition, morality, and structured wisdom."
    },
    upright: {
      keywords: {
        th: ["คำสอน", "ศีลธรรม", "ธรรมเนียมประเพณี", "การศึกษา", "ผู้ให้คำปรึกษา"],
        en: ["Tradition", "Spiritual Wisdom", "Conformity", "Institutions", "Mentorship"]
      },
      general: {
        th: "การยึดถือความถูกต้อง ศีลธรรม ขนบธรรมเนียม การขอคำปรึกษาจากผู้ใหญ่ หรือการศึกษาหาความรู้ในสถาบัน",
        en: "Adhering to proven traditions, seeking spiritual mentorship, educational advancement, and social integrity."
      },
      love: {
        th: "ความรักที่ถูกต้องตามทำนองคลองธรรม การหมั้นหมาย งานแต่งงานตามประเพณี หรือการมีผู้ใหญ่ช่วยเป็นสื่อรัก",
        en: "Traditional marriage, courtship with noble intentions, mutual spiritual values, and family blessing."
      },
      career: {
        th: "การทำงานในองค์กรขนาดใหญ่ สถาบันการศึกษา รัฐวิสาหกิจ หรือการได้รับความเมตตาจากครูบาอาจารย์/ที่ปรึกษา",
        en: "Success within structured institutions, corporate bureaucracies, academia, or ethical consulting."
      },
      finance: {
        th: "การเงินที่ได้มาจากความสุจริต ควรเก็บออมในสถาบันการเงินที่มั่นคง หลีกเลี่ยงการเก็งกำไรแปลกใหม่",
        en: "Conservative wealth accumulation, banking with reputable institutions, avoiding risky speculative schemes."
      },
      health: {
        th: "ควรปฏิบัติตามคำแนะนำของแพทย์แผนปัจจุบันอย่างเคร่งครัด การรักษาโรคด้วยวิธีมาตรฐาน",
        en: "Following prescribed conventional medical treatments, healthy traditional diets, and mental peace."
      },
      advice: {
        th: "ปฏิบัติตนตามครรลองที่ถูกต้อง ขอคำแนะนำจากผู้มีประสบการณ์ แล้วคุณจะผ่านพ้นทุกปัญหาได้",
        en: "Seek counsel from wise mentors. Honor proven principles rather than reinventing the wheel recklessly."
      }
    },
    reversed: {
      keywords: {
        th: ["การแหกคอก", "ความเชื่อที่งมงาย", "ลัทธิหลอกลวง", "การต่อต้านประเพณี", "ความคับแคบ"],
        en: ["Rebellion", "Unconventional", "Dogmatism", "Challenging Status Quo", "Hypocrisy"]
      },
      general: {
        th: "การตั้งคำถามกับความเชื่อเก่าๆ การฉีกกฎเกณฑ์เพื่อหาเส้นทางตนเอง หรือการระวังตกเป็นเหยื่อของคนหน้าซื่อใจคด",
        en: "Breaking free from suffocating orthodoxy, exposing moral hypocrisy, or forging your own spiritual path."
      },
      love: {
        th: "ความรักที่ไม่ตรงตามขนบธรรมเนียม ความรักต่างวัย หรือการถูกครอบครัวและสังคมต่อต้าน",
        en: "Unconventional romance, clashes with conservative family expectations, or realizing values don't align."
      },
      career: {
        th: "ความเบื่อหน่ายกฎระเบียบที่เข้มงวด การถูกจำกัดความคิดสร้างสรรค์ หรือการตัดสินใจออกมาเป็นเจ้านายตนเอง",
        en: "Chafing under stifling corporate bureaucracy, resisting outdated policies, or striking out as an independent."
      },
      finance: {
        th: "ระวังการถูกหลอกทำบุญ หรือการบริจาคเงินให้กับกลุ่มคนที่ใช้ศาสนาบังหน้า",
        en: "Beware of predatory cults, fraudulent charlatans posing as spiritual guides, or unorthodox fiscal traps."
      },
      health: {
        th: "การลองวิธีรักษาทางเลือกหรือแพทย์ทางเลือก ควรศึกษาข้อมูลให้ดีก่อนหลงเชื่อคำอวดอ้าง",
        en: "Exploring holistic or alternative therapies, but beware of unverified pseudoscience."
      },
      advice: {
        th: "อย่ากลัวที่จะคิดต่าง หากกรอบเดิมไม่ได้ตอบโจทย์จิตวิญญาณของคุณ แต่จงรับผิดชอบต่อผลลัพธ์ด้วย",
        en: "Question dogma courageously. Walk your own authentic truth while staying accountable."
      }
    }
  },
  {
    id: "m_06",
    number: 6,
    suite: "major",
    name_en: "The Lovers",
    name_th: "เดอะ เลิฟเวอร์ส (The Lovers)",
    image: "01_Major_Arcana/06_6. The Lovers.png",
    element: { en: "Gemini", th: "ราศีเมถุน (ความสัมพันธ์และการเลือก)" },
    quote: {
      th: "ชายหญิงผู้อยู่ใต้ปีกแห่งทูตสวรรค์ราฟาเอล ตัวแทนแห่งความรักอันบริสุทธิ์และทางแยกแห่งการตัดสินใจ",
      en: "Souls united beneath Archangel Raphael's blessing, embodying sacred love, harmony, and moral choices."
    },
    upright: {
      keywords: {
        th: ["ความรักแท้", "เนื้อคู่", "การเลือกที่สำคัญ", "ความปรองดอง", "ความลงตัว"],
        en: ["Soulmate Love", "Harmony", "Values Alignment", "Crucial Choice", "Union"]
      },
      general: {
        th: "ไพ่แห่งความรักที่งดงาม ความกลมเกลียว การพบเจอคู่แท้ และยังหมายถึงการมาถึงของทางแยกสำคัญในชีวิตที่คุณต้องเลือกด้วยหัวใจ",
        en: "Profound romantic union, soul connections, harmony of dualities, and a moral crossroads demanding integrity."
      },
      love: {
        th: "ความรักหวานชื่น มีเสน่ห์แรง คนโสดมีเกณฑ์เจอเนื้อคู่ที่คลิกกันทันที คนมีคู่ความสัมพันธ์ลึกซึ้งและเข้าใจกันดียิ่งขึ้น",
        en: "Deep romantic intimacy, soulmate attraction, falling in love, and exquisite emotional balance."
      },
      career: {
        th: "การเป็นพาร์ตเนอร์ทางธุรกิจที่ยอดเยี่ยม การทำงานร่วมกันเป็นทีมที่ลงตัว การตัดสินใจเลือกเส้นทางอาชีพที่ตรงกับตัวตน",
        en: "Fruitful business partnerships, effortless teamwork, and choosing career paths aligned with personal values."
      },
      finance: {
        th: "การเงินร่วมกันดี การลงทุนแบบมีหุ้นส่วนให้ผลตอบแทนน่าพอใจ แต่ต้องตัดสินใจเรื่องการใช้จ่ายอย่างมีสติ",
        en: "Shared financial harmony, beneficial joint ventures, and making balanced choices between luxury and savings."
      },
      health: {
        th: "สุขภาพกายและใจสมดุล การมีคนรักคอยดูแลเคียงข้างช่วยให้ฟื้นตัวได้รวดเร็ว",
        en: "Holistic mind-body alignment, emotional well-being promoting physical vitality."
      },
      advice: {
        th: "เลือกเส้นทางที่สอดคล้องกับคุณค่าในหัวใจของคุณ ไม่ใช่สิ่งที่สังคมบงการ ความซื่อสัตย์ต่อตนเองคือคำตอบ",
        en: "Choose the path aligned with your deepest moral truth. Let love and integrity guide your decision."
      }
    },
    reversed: {
      keywords: {
        th: ["ความไม่ลงรอย", "การเลือกที่ผิดพลาด", "รักสามเส้า", "ความขัดแย้งในใจ", "ศีลธรรมสั่นคลอน"],
        en: ["Disharmony", "Poor Choices", "Value Conflict", "Infidelity", "Inner Division"]
      },
      general: {
        th: "ความแตกแยก การตัดสินใจที่ผิดพลาดเพราะอารมณ์ชั่ววูบ หรือการขัดแย้งระหว่างสิ่งที่อยากทำกับสิ่งที่ควรกระทำ",
        en: "Internal misalignment, communication breakdown in partnerships, regretful decisions, or toxic entanglements."
      },
      love: {
        th: "รักสามเส้า ความลังเลระหว่างคนสองคน การทะเลาะเบาะแว้ง หรือการค้นพบว่าทัศนคติไม่ตรงกันจนยากจะปรับ",
        en: "Love triangles, emotional incompatibility, breach of trust, or painful realization that values diverge."
      },
      career: {
        th: "ความขัดแย้งกับหุ้นส่วน การแบ่งผลประโยชน์ไม่ลงตัว หรือการตัดสินใจเรื่องงานที่นำไปสู่ผลเสียในระยะยาว",
        en: "Partner disputes, toxic corporate politics, regretful contract signatures, or lack of team cooperation."
      },
      finance: {
        th: "ปัญหาการเงินที่เกิดจากคู่ครอง หรือการตกลงเรื่องผลประโยชน์กับหุ้นส่วนไม่ชัดเจนจนเกิดข้อพิพาท",
        en: "Financial friction with partners, disputes over joint assets, or spending driven by emotional distress."
      },
      health: {
        th: "ความเครียดจากความสัมพันธ์บั่นทอนร่างกาย การนอนไม่หลับ ปวดศีรษะ และภาวะซึมเศร้า",
        en: "Emotional heartbreak causing physical fatigue, appetite loss, and heightened anxiety."
      },
      advice: {
        th: "กลับมาทบทวนสิ่งที่ตัวคุณต้องการจริงๆ อย่าประนีประนอมในสิ่งที่ทำลายเกียรติและคุณค่าในตนเอง",
        en: "Re-align with your personal compass. Do not compromise your soul to maintain an illusion of harmony."
      }
    }
  },
  {
    id: "m_07",
    number: 7,
    suite: "major",
    name_en: "The Chariot",
    name_th: "เดอะ แชริออต (The Chariot)",
    image: "01_Major_Arcana/07_7. The Chariot.png",
    element: { en: "Cancer", th: "ราศีกรกฎ (ความมุ่งมั่นและการควบคุมอารมณ์)" },
    quote: {
      th: "นักรบบนราชรถ ผู้ควบคุมสฟิงซ์ขาวและดำ มุ่งทะยานไปข้างหน้าด้วยจิตใจที่แน่วแน่และพลังขับเคลื่อน",
      en: "The armored warrior steering the dual sphinxes through sheer willpower, triumphing over opposing forces."
    },
    upright: {
      keywords: {
        th: ["ชัยชนะ", "ความมุ่งมั่น", "การควบคุม", "การเดินทาง", "การฟันฝ่าอุปสรรค"],
        en: ["Triumph", "Willpower", "Determination", "Overcoming Obstacles", "Control"]
      },
      general: {
        th: "ชัยชนะที่ได้มาจากหยาดเหงื่อและการต่อสู้ การควบคุมพลังงานที่ขัดแย้งให้มุ่งไปข้างหน้า การเดินทางไกลหรือโยกย้าย",
        en: "Victory achieved through iron determination, self-discipline, and conquering challenges through focused momentum."
      },
      love: {
        th: "ความรักที่ต้องเอาชนะอุปสรรค เช่น ระยะทาง หรือความแตกต่าง ต้องใช้ความพยายามและความอดทนสูงจึงจะสำเร็จ",
        en: "Long-distance relationships overcoming hurdles, taking the lead in courtship, and shared ambitious goals."
      },
      career: {
        th: "การพุ่งชนเป้าหมาย การเลื่อนขั้น ชนะการแข่งขัน ชนะการประมูล งานที่ต้องเดินทางหรือติดต่อต่างประเทศ",
        en: "Crushing career targets, competitive victory, high-octane travel, leadership, and relentless ambition."
      },
      finance: {
        th: "เงินได้มาจากความเหน็ดเหนื่อยและการต่อสู้ การซื้อยานพาหนะใหม่ หรือมีค่าใช้จ่ายเกี่ยวกับการเดินทาง",
        en: "Financial wins earned through hard labor and grit. Investments in vehicles, travel, or logistics."
      },
      health: {
        th: "ร่างกายมีเรี่ยวแรงดี ควบคุมตนเองในการออกกำลังกายได้ดี แต่ระวังอุบัติเหตุจากการเดินทางหรือขับรถ",
        en: "High physical stamina and athletic drive. Be cautious while driving or engaging in intense sports."
      },
      advice: {
        th: "อย่าถอดใจ ควบคุมบังเหียนชีวิตของคุณให้มั่นคง ชัยชนะอยู่ไม่ไกลเกินเอื้อมหากคุณไม่ยอมแพ้",
        en: "Take the reins with firm hands. Maintain laser focus on your goal; victory belongs to the persistent."
      }
    },
    reversed: {
      keywords: {
        th: ["สูญเสียการควบคุม", "ความก้าวร้าว", "อุปสรรคขัดขวาง", "ความล้มเหลว", "อุบัติเหตุ"],
        en: ["Lack of Control", "Aggression", "Loss of Direction", "Obstacles", "Burnout"]
      },
      general: {
        th: "การสูญเสียการควบคุมสถานการณ์ ความใจร้อนมุทะลุจนชนกำแพง หรือการถูกอุปสรรคฉุดรั้งจนหมดแรง",
        en: "Veering off course, reckless aggression, being overpowered by circumstances, or running on empty."
      },
      love: {
        th: "การใช้อารมณ์บังคับอีกฝ่าย ความสัมพันธ์เร่งรีบจนพังลง หรือปัญหาจากระยะทางที่ทำให้เหินห่าง",
        en: "Rushing intimacy aggressively, bulldozing partner's boundaries, or relationship derailed by distance."
      },
      career: {
        th: "โปรเจกต์สะดุด แผนงานล่าช้า การเผชิญหน้ากับคู่แข่งที่รับมือได้ยาก หรือความขัดแย้งรุนแรงในทีม",
        en: "Missed deadlines, botched logistics, aggressive office rivalries, or projects spinning out of control."
      },
      finance: {
        th: "เสียเงินกับค่าซ่อมรถ ยานพาหนะ หรือค่าเดินทางที่บานปลาย การลงทุนที่ควบคุมความเสี่ยงไม่ได้",
        en: "Vehicle breakdown expenses, travel cancellation fees, or impulsive investments crashing hard."
      },
      health: {
        th: "เหนื่อยล้าสะสม หมดไฟ (Burnout) หรือมีเกณฑ์เจ็บป่วยจากความประมาทและอุบัติเหตุจากการเดินทาง",
        en: "Exhaustion, burnout from pushing too hard, travel-related sickness, or road mishaps."
      },
      advice: {
        th: "แตะเบรก ชะลอความเร็วลงบ้าง ทบทวนทิศทางก่อนที่ทุกอย่างจะพังทลายเพราะความดันทุรัง",
        en: "Hit the brakes. Forcefulness will only cause a crash; recalibrate your direction with patience."
      }
    }
  },
  {
    id: "m_08",
    number: 8,
    suite: "major",
    name_en: "Strength",
    name_th: "สเตร็งธ์ (Strength)",
    image: "01_Major_Arcana/08_8. Strength.png",
    element: { en: "Leo", th: "ราศีสิงห์ (พลังแห่งความเมตตาและความกล้าหาญ)" },
    quote: {
      th: "สตรีผู้สง่างามลูบหัวสิงโตดุร้ายด้วยความอ่อนโยน เอาชนะสัญชาตญาณดิบด้วยพลังแห่งความเมตตาและสติ",
      en: "The gentle maiden calming the roaring lion with grace and compassion, proving soft power conquers raw force."
    },
    upright: {
      keywords: {
        th: ["ความอดทน", "ความกล้าหาญ", "พลังแห่งความอ่อนโยน", "การควบคุมอารมณ์", "เมตตาธรรม"],
        en: ["Inner Strength", "Courage", "Compassion", "Patience", "Grace under Pressure"]
      },
      general: {
        th: "การเอาชนะอุปสรรคใหญ่หลวงด้วยจิตใจที่เข้มแข็ง ความอ่อนโยนที่สยบความแข็งกร้าว การควบคุมกิเลสและอารมณ์โกรธ",
        en: "Inner fortitude, conquering fears not through brutal force but through patience, compassion, and emotional poise."
      },
      love: {
        th: "ความรักที่เข้าใจ อดทน และให้อภัย ผู้หญิงมีอิทธิพลเหนือคนรัก สามารถประคับประคองความสัมพันธ์ให้ผ่านมรสุม",
        en: "Patient, loving devotion that calms fierce temperaments. Mutual respect, compassion, and enduring loyalty."
      },
      career: {
        th: "การจัดการกับปัญหาหรือเจ้านายที่อารมณ์ร้อนได้อยู่หมัด งานที่ต้องใช้ความอดทนสูงและความสัมพันธ์อันประนีประนอม",
        en: "Taming difficult clients or aggressive bosses through tact, diplomacy, resilience, and quiet confidence."
      },
      finance: {
        th: "มีวินัยในการควบคุมรายจ่าย ไม่ปล่อยให้อารมณ์นำพาเงิน สามารถฟื้นฟูสถานะการเงินที่เคยติดขัดได้",
        en: "Disciplined impulse control, steady financial recovery, and mastering your financial temptations."
      },
      health: {
        th: "สุขภาพแข็งแรง ระบบภูมิคุ้มกันดี สามารถเอาชนะโรคเรื้อรังได้ด้วยวินัยและการดูแลตัวเอง",
        en: "Vibrant vitality, strong immune resilience, and successfully healing through mindful lifestyle regimens."
      },
      advice: {
        th: "ใช้ความนุ่มนวลและน้ำเย็นเข้าลูบ ความแข็งแกร่งที่แท้จริงไม่ได้อยู่ที่กำลัง แต่อยู่ที่หัวใจอันนิ่งสงบ",
        en: "Lead with kindness and unwavering patience. You will tame the fiercest storms with gentle grace."
      }
    },
    reversed: {
      keywords: {
        th: ["ความท้อแท้", "ขาดความมั่นใจ", "อารมณ์ครอบงำ", "ความอ่อนแอ", "การยอมจำนน"],
        en: ["Self-Doubt", "Weakness", "Raw Emotion", "Insecurity", "Impatience"]
      },
      general: {
        th: "ความรู้สึกหมดเรี่ยวแรง สัญชาตญาณดิบและอารมณ์โกรธเข้าครอบงำ หรือความไม่มั่นใจในคุณค่าของตนเอง",
        en: "Self-doubt crippling your resolve, explosive temper outbursts, feeling helpless, or yielding to base impulses."
      },
      love: {
        th: "ความสัมพันธ์ที่มีการใช้อารมณ์ใส่กัน ความรู้สึกว่าตนเองด้อยกว่า หรือยอมทนอยู่เพราะกลัวการอยู่คนเดียว",
        en: "Toxic emotional outbursts, insecurity poisoning trust, or feeling powerless in the presence of an overbearing partner."
      },
      career: {
        th: "ยอมแพ้ต่อแรงกดดันในที่ทำงาน ขาดความกล้าหาญในการยืนหยัดเพื่อตนเอง หรือทำลายโอกาสเพราะอารมณ์ชั่ววูบ",
        en: "Crumbling under workplace stress, self-sabotaging through anger, or feeling totally overwhelmed by duties."
      },
      finance: {
        th: "ขาดวินัยทางการเงิน ซื้อของสนองตัณหาจนกระเป๋าฉีก หรือเกิดความตื่นตระหนกจนตัดสินใจผิดพลาด",
        en: "Impulsive emotional spending, panic selling investments, or feeling utterly out of financial control."
      },
      health: {
        th: "เหนื่อยล้า ภูมิคุ้มกันตก ปัญหาเกี่ยวกับระบบหัวใจหรือกระดูกสันหลัง ควรพักผ่อนและฟื้นฟูจิตใจ",
        en: "Depleted immune system, chronic lethargy, cardiac stress, and emotional exhaustion."
      },
      advice: {
        th: "ให้อภัยตนเองและค่อยๆ ดึงสติกลับมา คุณไม่ได้อ่อนแอ เพียงแค่ต้องการการพักฟื้นเพื่อลุกขึ้นสู้อีกครั้ง",
        en: "Reclaim your inner light. Acknowledge your vulnerability without letting fear command your actions."
      }
    }
  },
  {
    id: "m_09",
    number: 9,
    suite: "major",
    name_en: "The Hermit",
    name_th: "เดอะ เฮอร์มิท (The Hermit)",
    image: "01_Major_Arcana/09_9. The Hermit.png",
    element: { en: "Virgo", th: "ราศีกันย์ (การค้นหาความจริงและการวิเคราะห์)" },
    quote: {
      th: "นักพรตชราบนยอดเขาหิมะ ถือตะเกียงแห่งปัญญา ส่องสว่างนำทางตนเองและผู้แสวงหาสัจธรรม",
      en: "The solitary sage atop the snowy peak, holding the lantern of truth to illuminate the seeker's inner journey."
    },
    upright: {
      keywords: {
        th: ["การแสวงหาตัวตน", "ความสงบ", "สัจธรรม", "การศึกษาลึกซึ้ง", "ผู้ชี้ทาง"],
        en: ["Soul Searching", "Introspection", "Solitude", "Inner Guidance", "Wisdom"]
      },
      general: {
        th: "การปลีกวิเวกเพื่อค้นหาคำตอบในจิตใจ ช่วงเวลาแห่งการศึกษา ค้นคว้า ปัญญาญาณที่เกิดจากการตกผลึกด้วยตนเอง",
        en: "Stepping back from external noise to find inner illumination. Deep study, contemplation, and spiritual retreat."
      },
      love: {
        th: "ชอบความสันโดษ โสดและมีความสุขกับตัวเอง หากมีคู่อาจเป็นช่วงที่ต่างคนต่างต้องการพื้นที่ส่วนตัว",
        en: "Valuing peaceful solitude, singlehood for self-discovery, or needing sacred space within a relationship."
      },
      career: {
        th: "งานวิชาการ การวิจัย งานที่ต้องใช้สมาธิคนเดียว ที่ปรึกษาผู้เชี่ยวชาญเฉพาะทาง การเป็นครูอาจารย์",
        en: "Academic research, solitary deep work, specialized expertise, and mentoring from a place of mastery."
      },
      finance: {
        th: "การใช้ชีวิตแบบเรียบง่าย ไม่ฟุ้งเฟ้อ การเงินมั่นคงเพราะมีความมัธยัสถ์ ไม่สนใจวัตถุนิยม",
        en: "Frugal simplicity, financial prudence, saving quietly, and low desire for ostentatious materialism."
      },
      health: {
        th: "ควรระวังอาการของผู้สูงอายุ ปวดข้อ กระดูก สายตา ควรฟื้นฟูสุขภาพด้วยการทำสมาธิและความสงบ",
        en: "Aging wellness, joint/bone stiffness, eye strain, and replenishing energy through silence and mindfulness."
      },
      advice: {
        th: "ถอยออกมาหนึ่งก้าวเพื่อมองภาพรวม ฟังเสียงในความเงียบ ตะเกียงในมือคุณมีแสงสว่างพอที่จะนำทางก้าวต่อไปเสมอ",
        en: "Withdraw from the crowd. The lantern of your soul will show the exact next step when you listen in stillness."
      }
    },
    reversed: {
      keywords: {
        th: ["ความโดดเดี่ยว", "การตัดขาดสังคม", "ความเหงาจับใจ", "ความดื้อรั้น", "การไม่เปิดรับใคร"],
        en: ["Isolation", "Loneliness", "Withdrawal", "Anti-social", "Paranoia"]
      },
      general: {
        th: "การแยกตัวออกจากโลกจนกลายเป็นความเหงาและขมขื่น การปฏิเสธความช่วยเหลือจากผู้อื่นเพราะความทระนง",
        en: "Unhealthy isolation, painful loneliness, alienating loved ones, or stubborn refusal to accept sound advice."
      },
      love: {
        th: "ความรู้สึกอ้างว้างแม้จะอยู่ด้วยกัน การปิดกั้นหัวใจจนไม่มีใครเข้าถึง หรือการขังตัวเองไว้กับอดีต",
        en: "Cold emotional walling, feeling invisible in partnership, or clinging to painful solitude out of fear of hurt."
      },
      career: {
        th: "การทำงานร่วมกับผู้อื่นไม่ได้ ปัญหากับทีมงาน การเก็บตัวจนพลาดโอกาสสำคัญในหน้าที่การงาน",
        en: "Difficulty collaborating, becoming a workplace outcast, or stagnating by refusing new methodologies."
      },
      finance: {
        th: "ความหวาดระแวงเรื่องเงินจนไม่กล้าใช้จ่าย หรือการปฏิเสธคำปรึกษาทางการเงินจากผู้เชี่ยวชาญ",
        en: "Excessive miserliness born of fear, or losing money due to stubborn refusal to seek professional counsel."
      },
      health: {
        th: "ภาวะซึมเศร้า ความเครียดจากการอยู่คนเดียว วิตกกังวล และการละเลยสุขภาพตนเอง",
        en: "Depression, social anxiety, vitamin D deficiency from lack of sunlight, and depressive rumination."
      },
      advice: {
        th: "เปิดประตูหัวใจออกมาสู่โลกภายนอกบ้าง มนุษย์ไม่ได้ถูกสร้างมาให้อยู่อย่างโดดเดี่ยว ขอความช่วยเหลือเมื่อคุณต้องการ",
        en: "Step out of your cave. Reconnecting with compassionate human beings is the balm your spirit needs."
      }
    }
  },
  {
    id: "m_10",
    number: 10,
    suite: "major",
    name_en: "Wheel of Fortune",
    name_th: "วีล ออฟ ฟอร์จูน (Wheel of Fortune)",
    image: "01_Major_Arcana/10_10. Wheel of Fortune.png",
    element: { en: "Jupiter", th: "ดาวพฤหัสบดี (โชคชะตาและการเปลี่ยนแปลง)" },
    quote: {
      th: "กงล้อแห่งโชคชะตาที่หมุนเวียนไม่มีวันหยุด เตือนให้รู้ว่าทุกสิ่งย่อมเปลี่ยนแปลงตามวัฏจักรแห่งจักรวาล",
      en: "The celestial wheel of karma and cycles, turning inexorably, lifting destinies and reminding us of constant flux."
    },
    upright: {
      keywords: {
        th: ["โชคลาภ", "จุดเปลี่ยนชีวิต", "วัฏจักร", "โอกาสทอง", "พรหมลิขิต"],
        en: ["Good Luck", "Destiny", "Life Cycles", "Turning Point", "Karma"]
      },
      general: {
        th: "กระแสแห่งโชคชะตากำลังหมุนเข้าข้างคุณ สิ่งเลวร้ายจะผ่านพ้นไป สิ่งดีๆ กำลังหลั่งไหลเข้ามาอย่างไม่คาดฝัน",
        en: "A momentous turning point in your favor. Destiny aligns, luck smiles, and a fresh fortunate cycle commences."
      },
      love: {
        th: "พรหมลิขิตนำพาคนรักเข้ามา การพบกันโดยบังเอิญแต่รู้สึกผูกพันลึกซึ้ง คนมีคู่ความสัมพันธ์ก้าวสู่บทใหม่ที่ดีขึ้น",
        en: "Karmic soulmate rendezvous, serendipitous romance, and a dramatic upswing in relationship happiness."
      },
      career: {
        th: "โอกาสดีๆ เข้ามาอย่างไม่คาดฝัน ได้รับข้อเสนอใหม่ การเลื่อนตำแหน่ง จังหวะเวลาที่เอื้ออำนวยให้สำเร็จ",
        en: "A lucky career break, sudden promotions, lucrative opportunities, and destiny rewarding past hard work."
      },
      finance: {
        th: "โชคลาภทางการเงิน ได้เงินก้อน ฟลุกถูกรางวัล การลงทุนได้ผลกำไรเกินคาด สภาพคล่องดีขึ้นอย่างเห็นได้ชัด",
        en: "Windfalls, lucky breaks, flourishing investments, and a sudden relief from prior financial burdens."
      },
      health: {
        th: "การฟื้นตัวจากความเจ็บป่วย สุขภาพดีขึ้นอย่างน่าอัศจรรย์ พลังงานชีวิตกลับมาสดใส",
        en: "Rapid convalescence, positive medical turnarounds, and rejuvenated energy."
      },
      advice: {
        th: "จงคว้าโอกาสที่จักรวาลมอบให้อย่างรวดเร็ว และตระหนักว่าทุกสิ่งมีขึ้นมีลง จงใช้ชีวิตด้วยความไม่ประมาท",
        en: "Ride the ascending crest of the wheel. Seize open doors with gratitude, knowing cycles continually turn."
      }
    },
    reversed: {
      keywords: {
        th: ["โชคไม่เข้าข้าง", "ความผันผวน", "ความล่าช้า", "ต่อต้านการเปลี่ยนแปลง", "เคราะห์ซ้ำกรรมซัด"],
        en: ["Bad Luck", "Resistance to Change", "Setbacks", "Unwelcome Turns", "Karma Balance"]
      },
      general: {
        th: "ช่วงเวลาที่จังหวะชีวิตสะดุด สิ่งต่างๆ ไม่เป็นไปตามแผน การพยายามฝืนกระแสชะตากรรมมีแต่จะเหนื่อยเปล่า",
        en: "Unlucky downturn, unexpected setbacks, and feeling victimized by bad timing. A reminder to adapt."
      },
      love: {
        th: "จังหวะความรักไม่ลงตัว คลาดเคลื่อนกัน การทะเลาะเบาะแว้งจากเรื่องไม่เป็นเรื่อง หรืออุปสรรคที่ไม่คาดคิด",
        en: "Mismatched timing, external disruptions rattling the partnership, or clinging to a relationship past its expiry."
      },
      career: {
        th: "โครงการสะดุด ถูกเลื่อน ถูกยกเลิก หรือได้รับผลกระทบจากปัจจัยภายนอกที่ไม่สามารถควบคุมได้",
        en: "Market downturns, project cancellations, frustrating delays, and feeling helpless against systemic shifts."
      },
      finance: {
        th: "ระวังการสูญเสียเงินกะทันหัน อย่าเพิ่งเสี่ยงโชคหรือลงทุนเก็งกำไรในระยะนี้ รัดเข็มขัดให้แน่น",
        en: "Unexpected expenses, financial downturns, risky bets backfiring; exercise strict fiscal damage control."
      },
      health: {
        th: "โรคประจำตัวกำเริบ อ่อนเพลียจากการเปลี่ยนแปลงของสภาพอากาศ ควรดูแลตนเองให้มากขึ้น",
        en: "Relapse of old health issues, seasonal fatigue, or minor accidents due to distraction."
      },
      advice: {
        th: "อย่าวิตกจนเกินไป เมื่อกงล้อลงสู่จุดต่ำสุด มันย่อมหมุนกลับขึ้นมาใหม่ได้เสมอ จงอดทนและเรียนรู้บทเรียน",
        en: "Do not resist the storm. When the wheel hits the valley, remember the only place left to go is up."
      }
    }
  },
  {
    id: "m_11",
    number: 11,
    suite: "major",
    name_en: "Justice",
    name_th: "จัสติซ (Justice)",
    image: "01_Major_Arcana/11_11. Justice.png",
    element: { en: "Libra", th: "ราศีตุลย์ (ความยุติธรรมและความสมดุล)" },
    quote: {
      th: "เทพีแห่งความยุติธรรม ถือตาชั่งชั่งความจริงและดาบตัดความลวง ให้ผลตามเหตุแห่งการกระทำอย่างเที่ยงตรง",
      en: "The impartial sovereign holding the scales of truth and the sword of consequence, judging with absolute clarity."
    },
    upright: {
      keywords: {
        th: ["ความยุติธรรม", "ความจริง", "กฎแห่งกรรม", "ความสมดุล", "การตัดสินใจ"],
        en: ["Justice", "Fairness", "Truth", "Cause and Effect", "Law"]
      },
      general: {
        th: "ความจริงจะปรากฏ การตัดสินที่เที่ยงธรรม สิ่งที่คุณทำไว้ในอดีตจะส่งผลลัพธ์ที่สอดคล้องกันในเวลานี้",
        en: "Fair outcomes, truth prevailing, legal victories, karmic balance restored, and making objective decisions."
      },
      love: {
        th: "ความสัมพันธ์ที่เสมอภาค ให้เกียรติซึ่งกันและกัน มีการตกลงเรื่องการแต่งงานหรือการจดทะเบียนสมรสอย่างเป็นทางการ",
        en: "Balanced partnership built on mutual respect and honesty. Formal marriage contracts or fair relationship terms."
      },
      career: {
        th: "การเซ็นสัญญาที่เป็นธรรม การตรวจสอบความถูกต้อง ชัยชนะในคดีความหรือข้อพิพาททางธุรกิจ",
        en: "Favorable contract signings, ethical business practices, legal clarity, and fair performance reviews."
      },
      finance: {
        th: "การเงินได้รับความคุ้มครอง ได้เงินชดเชยที่สมควรได้รับ บัญชีโปร่งใส ชำระหนี้สินตามกำหนด",
        en: "Fair financial settlements, debt settlements, balanced accounts, and transparent audits."
      },
      health: {
        th: "ความสมดุลของร่างกาย อาหารการกิน และการใช้ชีวิต การตรวจสุขภาพจะได้ผลที่ตรงไปตรงมา",
        en: "Physical equilibrium restored through balanced nutrition, moderation, and regular medical check-ups."
      },
      advice: {
        th: "ยืนหยัดในความจริงและความถูกต้อง ตัดสินใจด้วยเหตุผลไม่ใช่อารมณ์ ผลลัพธ์จะยุติธรรมต่อคุณ",
        en: "Weigh your choices dispassionately. Stand firm in truth and integrity; justice will vindicate you."
      }
    },
    reversed: {
      keywords: {
        th: ["ความอยุติธรรม", "ความลำเอียง", "การโกง", "การปฏิเสธความจริง", "คดีความยืดเยื้อ"],
        en: ["Injustice", "Bias", "Dishonesty", "Lack of Accountability", "Legal Complications"]
      },
      general: {
        th: "การได้รับการปฏิบัติที่ไม่เป็นธรรม การถูกใส่ร้าย ปัดความรับผิดชอบ หรือการตัดสินใจที่เอนเอียงเพราะอคติ",
        en: "Unfair treatment, dishonesty, harsh blame games, avoiding personal accountability, or legal entanglements."
      },
      love: {
        th: "ความสัมพันธ์ที่ไม่เท่าเทียม ถูกเอาเปรียบ มีการปิดบังโกหก หรือการฟ้องร้องหย่าร้างที่มีปัญหาเรื่องการแบ่งทรัพย์สิน",
        en: "One-sided imbalance, broken vows, deceit, or acrimonious divorce battles over assets."
      },
      career: {
        th: "ถูกเอารัดเอาเปรียบในสัญญา การตัดสินที่ไม่เป็นธรรมจากเจ้านาย หรือการถูกดึงเข้าไปพัวพันกับการทุจริต",
        en: "Unfair workplace evaluations, contract breaches, shady internal politics, or harsh disciplinary actions."
      },
      finance: {
        th: "ระวังการถูกโกง การทำสัญญาเสียเปรียบ ถูกปรับเงิน หรือมีคดีความทางแพ่งที่เสียเปรียบ",
        en: "Fines, legal penalties, contract traps, or being cheated out of rightful earnings."
      },
      health: {
        th: "ร่างกายเสียสมดุลจากการใช้ชีวิตหนักเกินไป โรคเกี่ยวกับไต ต่อมหมวกไต หรือความดันผิดปกติ",
        en: "Metabolic imbalance, kidney/urinary strain, or physical ailments resulting from chronic moral stress."
      },
      advice: {
        th: "ยอมรับความจริงและรับผิดชอบต่อการกระทำตนเอง ตรวจสอบเอกสารสัญญาทุกตัวอักษรอย่างรอบคอบ",
        en: "Own your mistakes honestly. Double-check all legal fine print and refuse to engage in deceitful games."
      }
    }
  },
  {
    id: "m_12",
    number: 12,
    suite: "major",
    name_en: "The Hanged Man",
    name_th: "เดอะ แฮงค์แมน (The Hanged Man)",
    image: "01_Major_Arcana/12_12. The Hanged Man.png",
    element: { en: "Water / Neptune", th: "ธาตุน้ำ / ดาวเนปจูน (การเสียสละและมุมมองใหม่)" },
    quote: {
      th: "ชายผู้ถูกแขวนห้อยหัวแต่ใบหน้าเปี่ยมสุข ยอมหยุดนิ่งและสละสิ่งชั่วคราวเพื่อแลกกับปัญญาอันลึกซึ้ง",
      en: "The suspended martyr hanging serenely between realms, gaining profound enlightenment through surrender and shift of perspective."
    },
    upright: {
      keywords: {
        th: ["การหยุดนิ่ง", "การสละ", "มุมมองใหม่", "การยอมรับ", "การรอคอย"],
        en: ["Surrender", "New Perspective", "Letting Go", "Pause", "Enlightenment"]
      },
      general: {
        th: "สถานการณ์ที่ต้องหยุดนิ่งเพื่อทบทวน การยอมสละสิ่งหนึ่งเพื่อสิ่งที่ดีกว่า การมองโลกในมุมกลับที่ไม่มีใครเคยคิดถึง",
        en: "Voluntary suspension, letting go of control, seeing life from an inverted perspective, and spiritual breakthrough."
      },
      love: {
        th: "ความสัมพันธ์อยู่ในช่วงหยุดนิ่ง ไม่คืบหน้า ต้องใช้ความอดทนและเสียสละ ยอมถอยเพื่อเข้าใจมุมมองของคนรัก",
        en: "Relationship in limbo. Sacrificing ego for mutual healing, or learning to see your partner's viewpoint."
      },
      career: {
        th: "งานหยุดชะงัก การรอคอยผลลัพธ์ ช่วงเวลาที่ดีในการศึกษาพัฒนาตนเอง หรือเปลี่ยนกลยุทธ์การทำงานแบบแหวกแนว",
        en: "Career pause, pending approvals, reassessing career ambitions, and innovating unorthodox solutions."
      },
      finance: {
        th: "การเงินหยุดนิ่ง เงินชะลอตัว ต้องรัดเข็มขัด ไม่ควรรีบร้อนลงทุน ให้รอจังหวะเวลาที่เหมาะสม",
        en: "Stagnant cash flow; frozen investments. Practice patience and avoid desperate moves."
      },
      health: {
        th: "ควรพักผ่อนอย่างจริงจัง ระวังอาการปวดหลัง คอ ข้อเท้า หรือปัญหาเกี่ยวกับระบบไหลเวียนโลหิต",
        en: "Mandatory rest, circulatory issues, leg or neck tension. Recuperate rather than forcing physical exertion."
      },
      advice: {
        th: "หยุดดิ้นรน ยอมปล่อยวางการควบคุม แล้วมองสถานการณ์จากมุมมองใหม่ คำตอบจะปรากฏในความนิ่ง",
        en: "Surrender your need to force outcomes. When you stop fighting the current, profound clarity emerges."
      }
    },
    reversed: {
      keywords: {
        th: ["การเสียสละที่ไร้ค่า", "ความดื้อดึง", "ติดหล่ม", "ความล่าช้าเรื้อรัง", "การไม่ยอมปล่อยวาง"],
        en: ["Martyr Complex", "Stalling", "Resistance", "Futile Sacrifice", "Indecision"]
      },
      general: {
        th: "การยอมทนทุกข์อย่างเปล่าประโยชน์ ติดกับดักความคิดเดิมๆ ไม่ยอมปล่อยวาง หรือความล่าช้าที่บั่นทอนจิตใจ",
        en: "Needless self-martyrdom, stubborn resistance to moving forward, or dragging out an agonizing state of stagnation."
      },
      love: {
        th: "ทนอยู่ในความสัมพันธ์ที่เป็นพิษเพราะเสียดายเวลา เป็นฝ่ายยอมอยู่ฝ่ายเดียวจนหมดคุณค่าในตนเอง",
        en: "Playing the victim, clinging to a dying romance, or enduring emotional exploitation without speaking up."
      },
      career: {
        th: "ทนทำงานที่ไม่เติบโตเพราะกลัวการเปลี่ยนแปลง หรือการเสียสละเวลาส่วนตัวให้งานโดยไม่ได้รับผลตอบแทน",
        en: "Staying in a dead-end job out of fear, unrewarded overtime, or making useless sacrifices that go unnoticed."
      },
      finance: {
        th: "ยอมเสียเงินช่วยเหลือคนอื่นจนตนเองเดือดร้อน การผูกมัดทางการเงินที่ไม่สามารถถอนตัวได้",
        en: "Bailing out ungrateful relatives at your own expense, financial paralysis, or continuing to fund failing ventures."
      },
      health: {
        th: "ความเครียดเรื้อรัง อาการเจ็บป่วยที่ไม่ได้รับการรักษาจนเรื้อรัง ควรพบแพทย์เพื่อหาทางรักษาที่ตรงจุด",
        en: "Chronic fatigue, psychosomatic pain from unresolved grief, and prolonged immobility affecting muscles."
      },
      advice: {
        th: "ตัดเชือกที่มัดคุณไว้ได้แล้ว การเป็นผู้เสียสละไม่ได้ทำให้คุณเป็นคนดีขึ้นหากมันทำลายชีวิตของคุณเอง",
        en: "Cut yourself down from the tree. Stop enduring needless suffering; choose active liberation."
      }
    }
  },
  {
    id: "m_13",
    number: 13,
    suite: "major",
    name_en: "Death",
    name_th: "เดธ (Death)",
    image: "01_Major_Arcana/13_13. Death.png",
    element: { en: "Scorpio", th: "ราศีพิจิก (การสิ้นสุดและการกำเนิดใหม่)" },
    quote: {
      th: "อัศวินกระดูกบนม้าขาว ชูธงกุหลาบขาว สัญลักษณ์แห่งการดับสูญของสิ่งเก่า เพื่อเปิดทางให้ชีวิตใหม่ได้เริ่มต้น",
      en: "The dark knight carrying the white mystic rose, clearing the withered past so the dawn of rebirth can rise."
    },
    upright: {
      keywords: {
        th: ["การสิ้นสุด", "การเปลี่ยนแปลงครั้งใหญ่", "การเกิดใหม่", "การทิ้งสิ่งเก่า", "การผลัดใบ"],
        en: ["Transformation", "Endings", "Rebirth", "Transition", "Letting Go"]
      },
      general: {
        th: "ไม่ใช่ความตายทางกายภาพ แต่เป็นการปิดฉากของบทชีวิตเดิม เพื่อเปิดรับสิ่งใหม่ที่ดีกว่าอย่างหลีกเลี่ยงไม่ได้",
        en: "Major profound transformation. The necessary closing of an old chapter, allowing fresh revitalized life to take root."
      },
      love: {
        th: "การสิ้นสุดความสัมพันธ์ที่ไม่ใช่ การตัดใจจากคนเก่า เพื่อเตรียมพบกับความรักครั้งใหม่ที่เหมาะสมกว่า",
        en: "The closure of an expired relationship, clearing toxic patterns, or total radical transformation of your partnership dynamic."
      },
      career: {
        th: "การเปลี่ยนงาน การยุบโปรเจกต์ การลาออกจากองค์กรเดิม เพื่อก้าวสู่เส้นทางอาชีพใหม่ที่ตอบโจทย์ชีวิต",
        en: "Career metamorphosis: leaving an obsolete industry, company restructuring, or shedding old professional identities."
      },
      finance: {
        th: "การตัดรายจ่ายที่ไม่จำเป็นทิ้ง การปรับโครงสร้างหนี้สิน หรือการสิ้นสุดภาระหนี้ก้อนใหญ่",
        en: "Radical budget overhaul, writing off bad debts, ending financial dependencies, and building on fresh foundations."
      },
      health: {
        th: "การฟื้นฟูหลังการผ่าตัดหรือการรักษา การเลิกพฤติกรรมทำร้ายสุขภาพ เช่น เลิกบุหรี่ เลิกสุรา",
        en: "Shedding toxic habits, cellular detox, post-surgery recovery, and complete lifestyle rejuvenation."
      },
      advice: {
        th: "อย่าฝืนยึดติดกับสิ่งที่ตายไปแล้ว ปล่อยให้อดีตผ่านพ้นไป แล้วอ้าแขนรับรุ่งอรุณแห่งชีวิตใหม่",
        en: "Release what is already gone. Do not mourn the withered leaf; make fertile ground for the spring blossom."
      }
    },
    reversed: {
      keywords: {
        th: ["การยึดติด", "กลัวการเปลี่ยนแปลง", "การยืดเยื้อ", "การไม่ยอมปล่อย", "ความซึมเศร้า"],
        en: ["Resistance to Change", "Stagnation", "Fear of the Unknown", "Holding on to Past", "Decay"]
      },
      general: {
        th: "การพยายามยื้อสิ่งที่จบสิ้นไปแล้ว ความกลัวต่อความเปลี่ยนแปลงทำให้ต้องทนทรมานกับความเสื่อมสลาย",
        en: "Clinging desperately to a rotting situation, agonizing fear of transition, and prolonged suffering through denial."
      },
      love: {
        th: "ไม่ยอมรับความจริงว่าความรักจบลงแล้ว การจมอยู่กับอดีต หรือการยื้อความสัมพันธ์ที่ตายซาก",
        en: "Zombie relationship dragging on, refusing to finalize divorce/breakup, and self-torment over lost loves."
      },
      career: {
        th: "ทนอยู่ในองค์กรที่กำลังล่มสลาย การปฏิเสธเทคโนโลยีหรือทักษะใหม่ ทำให้ล้าหลังและถูกทิ้งไว้ข้างหลัง",
        en: "Clinging to obsolete roles, working in a sinking ship, or resisting unavoidable career transitions."
      },
      finance: {
        th: "การเพิกเฉยต่อปัญหาหนี้สินจนบานปลาย การไม่ยอมปรับเปลี่ยนพฤติกรรมการเงิน",
        en: "Ignoring escalating financial ruin, refusing bankruptcy restructuring, or compounding bad debts."
      },
      health: {
        th: "อาการเจ็บป่วยเรื้อรังจากการไม่ยอมปรับเปลี่ยนพฤติกรรม การปฏิเสธการรักษาที่จำเป็น",
        en: "Prolonged chronic ailments exacerbated by stubborn refusal to change destructive dietary or lifestyle habits."
      },
      advice: {
        th: "ความเจ็บปวดจากการปล่อยวางนั้นสั้น แต่ความเจ็บปวดจากการยึดติดนั้นยาวนาน จงกล้าเผชิญหน้ากับความจริง",
        en: "The pain of letting go is momentary; the agony of clinging to decay is endless. Surrender to rebirth."
      }
    }
  },
  {
    id: "m_14",
    number: 14,
    suite: "major",
    name_en: "Temperance",
    name_th: "เทมเพอแรนซ์ (Temperance)",
    image: "01_Major_Arcana/14_14. Temperance.png",
    element: { en: "Sagittarius", th: "ราศีธนู (ความสมดุลและการผสมผสาน)" },
    quote: {
      th: "ทูตสวรรค์ผู้ถ่ายเทน้ำระหว่างถ้วยทองสองใบอย่างไม่หกหยด ตัวแทนแห่งความพอดีและการปรับสมดุลชีวิต",
      en: "The winged angel pouring living waters between golden chalices, mastering alchemy, moderation, and patient harmony."
    },
    upright: {
      keywords: {
        th: ["ความสมดุล", "การประนีประนอม", "ความพอดี", "การปรับตัว", "การเยียวยา"],
        en: ["Balance", "Moderation", "Patience", "Alchemy", "Healing"]
      },
      general: {
        th: "การเดินทางสายกลาง การผสมผสานความแตกต่างอย่างลงตัว ความสงบสุขในจิตใจ และการเยียวยารักษาบาดแผล",
        en: "Harmonious blending of opposites, emotional equilibrium, quiet patience, and spiritual healing."
      },
      love: {
        th: "ความรักที่เข้าใจกัน ปรับตัวเข้าหากันได้ดี การประนีประนอมที่นำไปสู่ความสัมพันธ์ที่ยั่งยืนและราบรื่น",
        en: "Peaceful, emotionally mature romance. Harmonizing differences with grace, patience, and mutual healing."
      },
      career: {
        th: "การประสานงานที่ยอดเยี่ยม การเจรจาไกล่เกลี่ยข้อพิพาท งานที่เกี่ยวข้องกับการเดินทาง การสื่อสารต่างประเทศ",
        en: "Diplomatic triumph, cross-cultural collaboration, balancing diverse viewpoints, and smooth workflow."
      },
      finance: {
        th: "การเงินมีความสมดุล รายรับรายจ่ายลงตัว ไม่ติดขัด การวางแผนการเงินระยะยาวที่มั่นคง",
        en: "Balanced financial flow, steady savings, moderate spending, and reliable financial health."
      },
      health: {
        th: "สุขภาพฟื้นตัวดีเยี่ยม ร่างกายปรับสมดุลได้ดี การรักษาโรคด้วยวิธีธรรมชาติบำบัด",
        en: "Homeostasis restored, detoxification, physical recovery, and holistic well-being."
      },
      advice: {
        th: "ยึดทางสายกลางเป็นหลัก อย่าตึงหรือหย่อนจนเกินไป ความใจเย็นและประนีประนอมจะนำพาสิ่งดีๆ มาให้",
        en: "Practice calm moderation. Blend diverse viewpoints and let time distill the perfect outcome."
      }
    },
    reversed: {
      keywords: {
        th: ["ความไม่สมดุล", "ความสุดโต่ง", "ขาดความอดทน", "ความขัดแย้ง", "การปรับตัวไม่ทัน"],
        en: ["Imbalance", "Excess", "Lack of Patience", "Discord", "Extremes"]
      },
      general: {
        th: "การทำอะไรสุดโต่ง ขาดความพอดี อารมณ์แปรปรวน หรือการปะทะกันของขั้วตรงข้ามจนหาจุดลงตัวไม่ได้",
        en: "Living in chaotic extremes, volatile mood swings, impatient outbursts, and friction between opposing demands."
      },
      love: {
        th: "ความไม่เข้าใจกัน ไม่ยอมปรับตัว การทะเลาะกันเรื่องเล็กๆ น้อยๆ ที่บานปลายเพราะไม่มีใครยอมใคร",
        en: "Clashing egos, emotional drama, lack of compromise, and feeling drained by unpredictable relationship volatility."
      },
      career: {
        th: "ความขัดแย้งในทีมงาน การบริหารเวลาล้มเหลว การทำงานหนักเกินไปจนร่างกายพัง",
        en: "Workplace friction, burned bridges through harsh words, blown deadlines, and catastrophic work-life imbalance."
      },
      finance: {
        th: "รายจ่ายแซงหน้ารายรับ การใช้จ่ายตามอารมณ์แบบสุดโต่ง ชักหน้าไม่ถึงหลัง",
        en: "Erratic spending sprees alternating with panic, financial disarray, and depleted liquid savings."
      },
      health: {
        th: "การกินดื่มเกินพอดี ดื่มแอลกอฮอล์หนัก พักผ่อนไม่เพียงพอ หรือระบบเผาผลาญในร่างกายแปรปรวน",
        en: "Binge behaviors, digestive and liver strain, hormonal swings, and physical exhaustion from excessive living."
      },
      advice: {
        th: "ดึงสติตนเองกลับมาสู่จุดสมดุล ลดความอยากและพฤติกรรมสุดโต่งลงก่อนที่ร่างกายและชีวิตจะพังทลาย",
        en: "Step back from the edge of excess. Restore equilibrium to your habits before total burnout ensues."
      }
    }
  },
  {
    id: "m_15",
    number: 15,
    suite: "major",
    name_en: "The Devil",
    name_th: "เดอะ เดวิล (The Devil)",
    image: "01_Major_Arcana/15_15. The Devil.png",
    element: { en: "Capricorn", th: "ราศีมังกร (กิเลส ตัณหา และพันธนาการ)" },
    quote: {
      th: "ซาตานบนแท่นหิน ล่ามโซ่ชายหญิงไว้หลวมๆ เตือนให้รู้ว่าโซ่ที่แท้จริงคือความลุ่มหลงในใจเราเอง",
      en: "The horned titan holding chained souls with loose collars, illustrating that our deepest bondage is self-imposed."
    },
    upright: {
      keywords: {
        th: ["กิเลสตัณหา", "การเสพติด", "พันธนาการ", "ความลุ่มหลง", "วัตถุนิยม"],
        en: ["Addiction", "Bondage", "Materialism", "Obsession", "Shadow Self"]
      },
      general: {
        th: "การตกเป็นทาสของตัณหา เงินทอง อำนาจ หรือความสัมพันธ์ที่เป็นพิษ ความรู้สึกว่าติดกับดักทั้งที่กุญแจอยู่ในมือคุณเอง",
        en: "Entrapment in toxic habits, obsessive materialism, shadow illusions, and feeling bound by circumstances you allow."
      },
      love: {
        th: "ความรักที่เต็มไปด้วยตัณหา ความหึงหวงครอบครอง รักสามเส้า ความสัมพันธ์ที่เป็นพิษ (Toxic Relationship) แต่ตัดไม่ขาด",
        en: "Intense sexual chemistry coupled with toxic codependency, obsession, jealousy, and controlling entrapment."
      },
      career: {
        th: "ทำงานเพื่อเงินจนลืมคุณค่าชีวิต ตกอยู่ภายใต้สัญญาทาส หรือการทำธุรกิจสีเทาที่ต้องแลกด้วยความเสี่ยง",
        en: "Golden handcuffs, cutthroat unethical corporate behavior, feeling trapped in a soul-crushing job for money."
      },
      finance: {
        th: "หนี้สินท่วมหัว การพนัน การใช้เงินสนองกิเลส ระวังการถูกหลอกกู้เงินนอกระบบหรือแชร์ลูกโซ่",
        en: "Crippling debts, compulsive gambling, predatory loan agreements, and financial enslavement to lifestyle creep."
      },
      health: {
        th: "การเสพติดแอลกอฮอล์ ยาเสพติด อาหาร หรือพฤติกรรมทำลายสุขภาพ โรคติดต่อทางเพศสัมพันธ์",
        en: "Substance dependency, behavioral addictions, severe chronic stress, and sexually transmitted vulnerabilities."
      },
      advice: {
        th: "มองดูโซ่ที่คอคุณ มันหลวมพอที่จะถอดออกได้ทุกเมื่อ จงใช้สติปลดแอกตนเองจากความลุ่มหลง",
        en: "Recognize that you hold the power to slip the chains off your neck. Face your shadow and claim your freedom."
      }
    },
    reversed: {
      keywords: {
        th: ["การหลุดพ้น", "การตื่นรู้", "การตัดพันธนาการ", "เลิกสิ่งเสพติด", "อิสรภาพทางจิตวิญญาณ"],
        en: ["Breaking Free", "Empowerment", "Reclaiming Control", "Detox", "Liberation"]
      },
      general: {
        th: "การหลุดพ้นจากพันธนาการ การตื่นรู้จากภาพลวงตา การตัดสินใจตัดขาดจากสิ่งที่เป็นพิษในชีวิตเพื่อเริ่มต้นใหม่",
        en: "Shattering the chains of bondage, overcoming self-destructive vices, and stepping into sovereign freedom."
      },
      love: {
        th: "กล้าเดินออกจากความสัมพันธ์ที่เป็นพิษ ตาสว่างจากคนหลอกลวง การฟื้นฟูหัวใจและคุณค่าในตนเอง",
        en: "Leaving a toxic or abusive lover, overcoming obsessive heartbreak, and reclaiming romantic autonomy."
      },
      career: {
        th: "การลาออกจากงานที่กดขี่ การปฏิเสธข้อเสนอที่ไม่ถูกต้องตามศีลธรรม ก้าวสู่อิสรภาพในการทำงาน",
        en: "Escaping a toxic workplace, refusing unethical demands, and breaking free from corporate exploitation."
      },
      finance: {
        th: "การปลดหนี้สินสำเร็จ การหยุดเล่นการพนัน เริ่มต้นสร้างวินัยทางการเงินที่โปร่งใสและยั่งยืน",
        en: "Paying off predatory debts, breaking free from financial scams, and establishing healthy budgeting habits."
      },
      health: {
        th: "การฟื้นตัวจากการติดสารเสพติด การดีท็อกซ์ร่างกายและจิตใจ สุขภาพกลับมาสดใสอีกครั้ง",
        en: "Successful addiction recovery, physical detox, breaking harmful habits, and mental healing."
      },
      advice: {
        th: "อย่าหันหลังกลับไปมองหลุมพรางเดิม ก้าวเดินไปข้างหน้าด้วยเสรีภาพที่คุณทวงคืนมาได้",
        en: "Walk forward and never look back at the cage. Your liberation is real; honor your newfound sovereignty."
      }
    }
  },
  {
    id: "m_16",
    number: 16,
    suite: "major",
    name_en: "The Tower",
    name_th: "เดอะ ทาวเวอร์ (The Tower)",
    image: "01_Major_Arcana/16_16. The Tower.png",
    element: { en: "Mars", th: "ดาวอังคาร (การพังทลายและการเปลี่ยนแปลงฉับพลัน)" },
    quote: {
      th: "สายฟ้าฟาดลงบนหอคอยสูงเสียดฟ้า พังทลายภาพลวงตาที่สร้างบนรากฐานอันสั่นคลอนลงในพริบตา",
      en: "Lightning shatters the arrogant citadel, demolishing false structures so genuine truth can be built upon solid rock."
    },
    upright: {
      keywords: {
        th: ["การพังทลายฉับพลัน", "วิกฤตการณ์", "ความจริงปรากฏ", "การเปลี่ยนแปลงกะทันหัน", "ตาสว่าง"],
        en: ["Sudden Shock", "Collapse", "Crisis", "Awakening", "Unavoidable Upheaval"]
      },
      general: {
        th: "เหตุการณ์ไม่คาดฝันที่สั่นคลอนความมั่นคง สิ่งที่สร้างขึ้นบนความหลอกลวงจะพังลง เพื่อให้คุณได้สร้างใหม่บนรากฐานที่แท้จริง",
        en: "Cataclysmic disruption shattering false security. Although painful, it cleanses illusions and demands radical truth."
      },
      love: {
        th: "การเลิกราแบบสายฟ้าแลบ ความลับแตกจนแตกหัก หรือการทะเลาะกันรุนแรงที่เปลี่ยนความสัมพันธ์ไปตลอดกาล",
        en: "Sudden explosive breakup, shocking revelations of betrayal, or seismic truths clearing out built-up pretenses."
      },
      career: {
        th: "การตกงานกะทันหัน บริษัทปิดตัว โปรเจกต์ล้มเหลว หรือเกิดวิกฤตที่ต้องแก้ไขอย่างเร่งด่วน",
        en: "Sudden job loss, corporate insolvency, catastrophic project failure, or public reckoning of bad leadership."
      },
      finance: {
        th: "การสูญเสียเงินก้อนใหญ่กะทันหัน ตลาดหุ้นดิ่ง ระวังอุบัติเหตุหรือภัยพิบัติที่ทำให้เสียทรัพย์",
        en: "Severe financial crash, sudden asset devaluation, costly emergency damage, and urgent fiscal triage."
      },
      health: {
        th: "ระวังอุบัติเหตุรุนแรง การเจ็บป่วยฉับพลัน ผ่าตัดด่วน หรือความดันโลหิตพุ่งสูง ควรมีสติและไม่ประมาท",
        en: "Accident alert, sudden acute illness, emergency medical interventions, or physical shock."
      },
      advice: {
        th: "อย่าพยายามกอดซากปรักหักพัง ปล่อยให้สิ่งที่ไม่มั่นคงพังลงไป แล้วใช้เศษอิฐเหล่านั้นสร้างวิมานใหม่ที่แข็งแรงกว่าเดิม",
        en: "Do not mourn the collapse of a prison disguised as a palace. Let the debris clear; build anew on rock."
      }
    },
    reversed: {
      keywords: {
        th: ["การรอดหวุดหวิด", "การผัดผ่อนวิกฤต", "ความกลัวการเปลี่ยนแปลง", "การฟื้นตัวช้าๆ", "สัญญาณเตือน"],
        en: ["Narrow Escape", "Averting Disaster", "Delaying the Inevitable", "Fear of Pain", "Internal Reconstruction"]
      },
      general: {
        th: "การรอดพ้นจากภัยพิบัติอย่างเฉียดฉิว หรือการพยายามยื้อสถานการณ์ที่กำลังจะพัง ทั้งที่รู้ว่าสุดท้ายก็ต้องเปลี่ยนแปลง",
        en: "Dodging a major bullet, internal seismic restructuring, or obstinately delaying an inevitable reckoning."
      },
      love: {
        th: "รู้ว่าไปกันไม่รอดแต่ยังยื้อไว้ ทะเลาะกันแบบเรื้อรัง หรือการพยายามประคับประคองความสัมพันธ์ที่ร้าวลึก",
        en: "Sweeping major red flags under the rug, delaying an inevitable breakup, or quietly healing after an emotional crisis."
      },
      career: {
        th: "รอดพ้นจากการถูกเลิกจ้างอย่างหวุดหวิด แต่องค์กรยังคงไม่มั่นคง ต้องเตรียมแผนสำรองไว้เสมอ",
        en: "Barely escaping layoffs, lingering corporate instability, or quietly restructuring business models before disaster."
      },
      finance: {
        th: "เกือบสูญเสียเงินแต่ไหวตัวทัน การจัดการหนี้สินก่อนที่จะเกิดการฟ้องร้อง",
        en: "Narrowly avoiding bankruptcy, catching financial fraud in time, or mitigating heavy losses."
      },
      health: {
        th: "รอดพ้นจากอุบัติเหตุเฉียดตาย การฟื้นตัวจากโรคร้ายช้าๆ ควรดูแลตนเองอย่างใกล้ชิด",
        en: "Near-miss accidents, slow recuperation from traumatic shock, and prioritizing nervous system calm."
      },
      advice: {
        th: "บทเรียนได้เตือนคุณแล้ว อย่ากลับไปทำความผิดพลาดเดิม จงรีบแก้ไขจุดอ่อนก่อนที่สายฟ้าจะฟาดลงมาอีกครั้ง",
        en: "Heed the warning siren. Fix the structural flaws in your life before the next lightning bolt strikes."
      }
    }
  },
  {
    id: "m_17",
    number: 17,
    suite: "major",
    name_en: "The Star",
    name_th: "เดอะ สตาร์ (The Star)",
    image: "01_Major_Arcana/17_17. The Star.png",
    element: { en: "Aquarius", th: "ราศีกุมภ์ (ความหวังและแรงบันดาลใจ)" },
    quote: {
      th: "สตรีเปลือยกายรินน้ำอมฤตใต้แสงดวงดาวแปดแฉก สัญลักษณ์แห่งความหวัง การเยียวยา และอนาคตที่สดใส",
      en: "The maiden pouring starlight into water and earth, renewing faith, hope, and cosmic serenity after the storm."
    },
    upright: {
      keywords: {
        th: ["ความหวัง", "แรงบันดาลใจ", "การเยียวยาจิตใจ", "ความศรัทธา", "ความสงบสุข"],
        en: ["Hope", "Faith", "Inspiration", "Healing", "Serenity"]
      },
      general: {
        th: "หลังจากพายุร้ายผ่านพ้นไป แสงดาวแห่งความหวังจะส่องสว่างนำทาง ความสุข ความสงบ และความฝันจะกลายเป็นจริง",
        en: "Renewed optimism, divine spiritual blessing, boundless inspiration, and peaceful faith in the dawn."
      },
      love: {
        th: "ความรักที่บริสุทธิ์ จริงใจ เข้าใจกันอย่างลึกซึ้ง คนโสดจะพบคนที่ทำให้หัวใจพองโต คนมีคู่ความสัมพันธ์อบอุ่นและมีอนาคต",
        en: "Pure, revitalizing romance. Healing from old wounds, deep spiritual compatibility, and trusting in love again."
      },
      career: {
        th: "แรงบันดาลใจในการทำงานพุ่งสูง ผลงานได้รับการยอมรับ มีชื่อเสียง โดดเด่นในสายงานศิลปะ สื่อสารมวลชน หรือดิจิทัล",
        en: "Artistic brilliance, stellar public recognition, creative flow, and visionary projects bearing radiant fruit."
      },
      finance: {
        th: "การเงินคลี่คลาย มีช่องทางรายได้ใหม่ๆ มองเห็นอนาคตทางการเงินที่สดใส การลงทุนมีแนวโน้มที่ดีมาก",
        en: "Financial relief, optimistic long-term growth, prosperous new revenue avenues, and peace of mind."
      },
      health: {
        th: "สุขภาพกายและใจได้รับการฟื้นฟูอย่างสมบูรณ์ ผิวพรรณสดใส จิตใจผ่องใส สงบเย็น",
        en: "Profound cellular regeneration, mental serenity, radiant skin, and total recovery from chronic fatigue."
      },
      advice: {
        th: "รักษาความศรัทธาและความหวังในหัวใจไว้ จักรวาลกำลังจัดสรรสิ่งที่ดีที่สุดให้กับคุณ จงเปิดรับแสงสว่าง",
        en: "Keep your gaze on the starlight. The universe is conspiring in your favor; breathe in peaceful trust."
      }
    },
    reversed: {
      keywords: {
        th: ["ความสิ้นหวัง", "หมดไฟ", "ขาดศรัทธา", "การมองโลกในแง่ร้าย", "ความฝันลมๆ แล้งๆ"],
        en: ["Despair", "Hopelessness", "Lack of Faith", "Pessimism", "Disillusionment"]
      },
      general: {
        th: "ความรู้สึกหมดหวัง ท้อแท้ มองไม่เห็นทางออกในชีวิต การสูญเสียศรัทธาในตนเองและโชคชะตา",
        en: "Spiritual exhaustion, cynicism, feeling abandoned by the universe, and dwelling in melancholic defeatism."
      },
      love: {
        th: "ความหวาดระแวง ไม่กล้าเปิดใจเพราะกลัวเจ็บอีก ความผิดหวังในตัวคนรัก หรือความรู้สึกว่าความสัมพันธ์ไปไม่รอด",
        en: "Loss of romantic hope, bitter disillusionment, feeling disconnected, or nursing unhealed emotional scars."
      },
      career: {
        th: "หมดไฟในการทำงาน ขาดความคิดสร้างสรรค์ รู้สึกว่าผลงานไม่ได้รับการเหลียวแล หรือเป้าหมายเลือนราง",
        en: "Creative drought, demotivation, feeling unappreciated, or pursuing impractical daydreams without grounding."
      },
      finance: {
        th: "ความกังวลเรื่องการเงินจนมองไม่เห็นโอกาส การใช้เงินเพื่อระบายความเศร้า",
        en: "Hopelessness regarding debts, missing financial solutions due to anxiety, or emotional spending."
      },
      health: {
        th: "ภาวะซึมเศร้า ขาดพลังชีวิต นอนไม่หลับ ร่างกายอ่อนแอเพราะจิตใจไม่สดใส",
        en: "Depression, emotional lethargy, psychosomatic sluggishness, and disconnection from physical well-being."
      },
      advice: {
        th: "ดาวบนฟ้ายังคงส่องแสงอยู่เสมอ แม้เมฆหมอกจะบดบัง จงเริ่มจากการรักและเมตตาตนเองในวันที่มืดมิด",
        en: "The star still shines behind the fog. Rekindle faith one small breath at a time; your story is not over."
      }
    }
  },
  {
    id: "m_18",
    number: 18,
    suite: "major",
    name_en: "The Moon",
    name_th: "เดอะ มูน (The Moon)",
    image: "01_Major_Arcana/18_18. The Moon.png",
    element: { en: "Pisces", th: "ราศีมีน (ภาพลวงตา ความกลัว และจิตใต้สำนึก)" },
    quote: {
      th: "ดวงจันทร์ส่องแสงสลัวเหนือสุนัขบ้าน สุนัขจิ้งจอก และกุ้งมังกรที่คลานขึ้นมาจากสายน้ำแห่งความลี้ลับ",
      en: "The weeping moon illuminating barking beasts and ancient waters, awakening deep primal fears and illusions."
    },
    upright: {
      keywords: {
        th: ["ความคลุมเครือ", "ความกลัวในจิตใจ", "ภาพลวงตา", "ความวิตกกังวล", "สิ่งที่ซ่อนเร้น"],
        en: ["Illusion", "Anxiety", "Fear", "Subconscious", "Deception"]
      },
      general: {
        th: "สถานการณ์ที่ยังไม่ชัดเจน สิ่งต่างๆ อาจไม่ได้เป็นอย่างที่ตาเห็น มีความกลัวและความวิตกกังวลครอบงำจิตใจ",
        en: "Walking through dense fog where shadows distort reality. Deep psychological fears, illusions, and hidden truths."
      },
      love: {
        th: "ความสัมพันธ์ที่ไม่ชัดเจน ระแวง หึงหวง หรือมีเรื่องปิดบังซ่อนเร้น ระวังความเข้าใจผิดจากจินตนาการเกินจริง",
        en: "Ambiguous relationship status, paranoia, deceit, or letting irrational fears fabricate non-existent problems."
      },
      career: {
        th: "ความไม่แน่นอนในที่ทำงาน ข้อมูลไม่ครบถ้วน ระวังการถูกแทงข้างหลัง หรือการตัดสินใจบนความคลุมเครือ",
        en: "Corporate misinformation, unstable working conditions, hidden agendas, or confusing career directions."
      },
      finance: {
        th: "ความเสี่ยงเรื่องการถูกหลอกลวง การลงทุนที่ไม่โปร่งใส เอกสารสัญญาคลุมเครือ ไม่ควรทำธุรกรรมใหญ่ช่วงนี้",
        en: "Financial deception, hidden fees, fraudulent schemes, and precarious investments shrouded in uncertainty."
      },
      health: {
        th: "สุขภาพจิต อาการแพนิค วิตกกังวล นอนไม่หลับ ฝันร้าย ระบบน้ำเหลืองหรือของเหลวในร่างกายแปรปรวน",
        en: "Insomnia, nightmares, psychological distress, anxiety attacks, or hormonal/lymphatic irregularities."
      },
      advice: {
        th: "อย่าเพิ่งด่วนตัดสินใจในขณะที่หมอกยังหนาทึบ รอให้แสงอาทิตย์ส่องสว่างความจริงก่อนลงมือทำ",
        en: "Do not trust shadowy surface appearances. Wait for the mist to clear before taking consequential steps."
      }
    },
    reversed: {
      keywords: {
        th: ["ความจริงเปิดเผย", "คลี่คลายความกลัว", "ตาสว่าง", "จิตใจสงบขึ้น", "พ้นจากภาพลวงตา"],
        en: ["Clarity Emerges", "Overcoming Fear", "Truth Revealed", "Dispelling Illusions", "Relief"]
      },
      general: {
        th: "หมอกควันเริ่มจางหาย ความจริงที่เคยซ่อนเร้นปรากฏชัดเจน การเอาชนะความกลัวและความวิตกกังวลในจิตใจได้สำเร็จ",
        en: "The fog lifts. Hidden secrets come to light, clarity replaces paralyzing fear, and peace returns."
      },
      love: {
        th: "เรื่องที่เคยระแวงสงสัยได้รับการเฉลย ความสัมพันธ์คลี่คลาย หรือหากมีคนหลอกลวงก็จะได้เห็นธาตุแท้",
        en: "Suspicions clarified, honest conversations dispelling paranoia, or freeing yourself from a deceitful lover."
      },
      career: {
        th: "ปัญหาในที่ทำงานเริ่มมองเห็นทางออก ข้อตกลงที่เคยคลุมเครือมีความชัดเจนมากขึ้น",
        en: "Misunderstandings resolved, transparency restored in projects, and seeing through deceptive workplace games."
      },
      finance: {
        th: "ตรวจพบข้อผิดพลาดทางบัญชีหรือคนโกงได้ทันเวลา การเงินเริ่มกลับมาควบคุมได้",
        en: "Uncovering hidden financial leaks, escaping predatory schemes, and regaining budget clarity."
      },
      health: {
        th: "อาการวิตกกังวลลดลง หลับสบายขึ้น การวินิจฉัยโรคพบสาเหตุที่แท้จริงและได้รับการรักษาที่ถูกต้อง",
        en: "Easing of panic and anxiety, restful sleep returns, and accurate medical diagnoses resolving confusion."
      },
      advice: {
        th: "เผชิญหน้ากับความจริงด้วยความกล้าหาญ สิ่งที่คุณกลัวไม่ได้น่ากลัวอย่างที่จิตใจปรุงแต่งไว้เลย",
        en: "Walk boldly into the dawn. The monsters of the night were merely shadows magnified by your mind."
      }
    }
  },
  {
    id: "m_19",
    number: 19,
    suite: "major",
    name_en: "The Sun",
    name_th: "เดอะ ซัน (The Sun)",
    image: "01_Major_Arcana/19_19. The Sun.png",
    element: { en: "Sun", th: "ดวงอาทิตย์ (ความสำเร็จ ความสุข และพลังชีวิต)" },
    quote: {
      th: "ดวงตะวันอันเจิดจ้าส่องสว่างเหนือเด็กน้อยบนม้าเผือก ตัวแทนแห่งความสุข ความสำเร็จ และพลังชีวิตอันเปี่ยมล้น",
      en: "The radiant sun showering golden warmth upon the joyous child riding free, declaring absolute triumph and joy."
    },
    upright: {
      keywords: {
        th: ["ความสำเร็จสูงสุด", "ความสุขล้นพ้น", "พลังชีวิต", "ความชัดเจน", "การเฉลิมฉลอง"],
        en: ["Joy", "Success", "Radiance", "Vitality", "Enlightenment"]
      },
      general: {
        th: "ไพ่ที่ดีที่สุดใบหนึ่งในสำรับ ความสว่างไสว ชัยชนะ ความจริงใจ ความสำเร็จในทุกสิ่งที่มุ่งหวังอย่างไร้ข้อกังขา",
        en: "Supreme triumph, unadulterated happiness, brilliant clarity, warm fellowship, and total abundance."
      },
      love: {
        th: "ความรักที่สดใส เปิดเผย อบอุ่น มีความสุขอย่างยิ่ง มีเกณฑ์แต่งงาน มีบุตร หรือได้พบรักแท้ที่บริสุทธิ์ใจ",
        en: "Radiant, joyful partnership filled with genuine warmth, playful romance, wedding bells, or child conception."
      },
      career: {
        th: "ความสำเร็จอันยิ่งใหญ่ ได้รับการยกย่องสรรเสริญ เลื่อนขั้น เลื่อนตำแหน่ง ธุรกิจเจริญรุ่งเรืองอย่างสูงสุด",
        en: "Grand professional achievement, public accolades, prestigious awards, and glowing business prosperity."
      },
      finance: {
        th: "การเงินมั่งคั่ง ผลกำไรมหาศาล โชคลาภหลั่งไหลเข้ามา มีความสุขกับความมั่นคงทางทรัพย์สิน",
        en: "Financial abundance, thriving profits, lucrative outcomes, and generous economic prosperity."
      },
      health: {
        th: "สุขภาพแข็งแรงสมบูรณ์ มีพลังงานเต็มเปี่ยม หายจากโรคภัยไข้เจ็บ ร่างกายสดชื่นกระปรี้กระเปร่า",
        en: "Peak physical vitality, robust health, total recovery from illness, and infectious radiant energy."
      },
      advice: {
        th: "จงแบ่งปันความสุขและรอยยิ้มของคุณให้แก่โลก แสงสว่างของคุณกำลังสร้างแรงบันดาลใจให้แก่ผู้คนรอบข้าง",
        en: "Shine brightly without apology. Your warmth and authenticity bless everyone in your orbit."
      }
    },
    reversed: {
      keywords: {
        th: ["ความสุขที่ถูกบดบัง", "ความล่าช้าชั่วคราว", "การมองโลกแง่ดีเกินไป", "ความถือดี", "ความหม่นหมอง"],
        en: ["Diminished Joy", "Temporary Clouds", "Over-Optimism", "Ego Pride", "Slight Delay"]
      },
      general: {
        th: "ความสำเร็จที่ยังมีเมฆหมอกบังไว้ชั่วคราว หรือความสุขที่ยังไม่เต็มร้อย ระวังการมองโลกในแง่ดีจนขาดความรอบคอบ",
        en: "Success delayed or joy temporarily dimmed by minor clouds. Overconfidence, or struggling to see the bright side."
      },
      love: {
        th: "ยังคงมีความรักที่ดี แต่อาจมีเรื่องงอนกัน หรือการเรียกร้องความสนใจมากเกินไปจนอีกฝ่ายอึดอัด",
        en: "Affection exists but is obscured by petty misunderstandings, bruised egos, or unrealistic expectations."
      },
      career: {
        th: "ผลงานดีแต่ยังไม่ได้รับคำชมอย่างที่คาดหวัง หรือความล่าช้าในการประกาศผลรางวัล",
        en: "Success is incoming but delayed, or excessive pride causing minor friction with colleagues."
      },
      finance: {
        th: "การเงินยังดีอยู่แต่อาจได้น้อยกว่าที่หวังไว้เล็กน้อย ระวังการใช้จ่ายเพื่อโอ้อวดหน้าตา",
        en: "Good cash flow, but profits are slightly under projections; avoid flashy show-off purchases."
      },
      health: {
        th: "อาการเพลียแดด ผิวไหม้ หรือความเหนื่อยล้าจากการใช้พลังงานมากเกินไป ควรพักผ่อนในที่ร่ม",
        en: "Sunburn, dehydration, heat exhaustion, or minor physical fatigue from overworking."
      },
      advice: {
        th: "แม้จะมีเมฆบดบัง แต่ดวงอาทิตย์ไม่เคยหายไปไหน อดทนรอสักนิดแล้วความสว่างจะกลับมาเต็มดวงอีกครั้ง",
        en: "Clouds only conceal the sun temporarily. Maintain gratitude and let your inner warmth shine through."
      }
    }
  },
  {
    id: "m_20",
    number: 20,
    suite: "major",
    name_en: "Judgement",
    name_th: "จัดจ์เมนต์ (Judgement)",
    image: "01_Major_Arcana/20_20. Judgement.png",
    element: { en: "Fire / Pluto", th: "ธาตุไฟ / ดาวพลูโต (การฟื้นคืนชีพและการตัดสินครั้งสุดท้าย)" },
    quote: {
      th: "เสียงแตรแห่งทูตสวรรค์กาเบรียล ปลุกวิญญาณให้ตื่นจากหลุม สู่การชำระล้างและการเริ่มต้นชีวิตใหม่ที่แท้จริง",
      en: "Archangel Gabriel sounding the cosmic trumpet, awakening souls from the grave to receive ultimate redemption and rebirth."
    },
    upright: {
      keywords: {
        th: ["การฟื้นคืนชีพ", "การตัดสินชี้ขาด", "การตื่นรู้", "โอกาสครั้งที่สอง", "การให้อภัย"],
        en: ["Rebirth", "Inner Calling", "Absolution", "Awakening", "Second Chance"]
      },
      general: {
        th: "เสียงเรียกแห่งโชคชะตา การชำระสะสางอดีตเพื่อเริ่มต้นชีวิตใหม่ โอกาสครั้งที่สองในการแก้ไขสิ่งผิดพลาด",
        en: "A spiritual awakening and profound realization of your true vocation. Karma resolved, absolution granted."
      },
      love: {
        th: "คนรักเก่ากลับมาขอโอกาส การปรับความเข้าใจและการให้อภัย หรือการตัดสินใจขั้นเด็ดขาดในความสัมพันธ์",
        en: "Reconciliation with an ex-partner, mutual forgiveness of deep wounds, or definitive clarity on long-term commitment."
      },
      career: {
        th: "การค้นพบงานที่เป็นตัวตนที่แท้จริง (Calling) ผลงานในอดีตได้รับการประเมินและปูนบำเหน็จรางวัล",
        en: "Answering your true career calling, passing critical audits with flying colors, and monumental turning points."
      },
      finance: {
        th: "ได้รับเงินคืนจากหนี้เก่า ชนะคดีความทางการเงิน การจัดระเบียบโครงสร้างการเงินใหม่จนฟื้นตัวได้",
        en: "Recovery of long-lost funds, resolving old debts, and financial rebirth through responsible choices."
      },
      health: {
        th: "การหายป่วยราวกับปาฏิหาริย์ ฟื้นตัวจากโรคร้าย ร่างกายและจิตใจได้รับการชำระล้างใหม่หมดจด",
        en: "Miraculous physical turnaround, cellular rebirth, and shedding long-held psychosomatic burdens."
      },
      advice: {
        th: "ตอบรับเสียงเรียกของหัวใจ ให้อภัยอดีต ปล่อยวางความผิดพลาด แล้วก้าวสู่ร่างใหม่ที่คุณภาคภูมิใจ",
        en: "Hear your higher calling. Forgive the past, release regret, and step boldly into your resurrected life."
      }
    },
    reversed: {
      keywords: {
        th: ["การจมปลักกับอดีต", "การโทษตนเอง", "เพิกเฉยต่อเสียงเตือน", "ความลังเล", "การตัดสินที่ผิดพลาด"],
        en: ["Self-Doubt", "Harsh Judgment", "Ignoring the Call", "Regret", "Stagnation"]
      },
      general: {
        th: "การตอกย้ำซ้ำเติมตนเองด้วยความผิดพลาดในอดีต การไม่ยอมตื่นขึ้นมารับโอกาสใหม่เพราะกลัวการตัดสิน",
        en: "Crippling self-recrimination, ignoring your higher calling out of fear, and refusing to forgive yourself."
      },
      love: {
        th: "การขุดคุ้ยเรื่องเก่ามาทะเลาะ ไม่ยอมให้อภัย หรือการกลับไปหาคนรักเก่าที่ทำร้ายซ้ำแล้วซ้ำเล่า",
        en: "Holding grudges, repeatedly rehashing past mistakes, or going back to a toxic ex out of guilt."
      },
      career: {
        th: "การพลาดโอกาสสำคัญเพราะความลังเลไม่มั่นใจ การถูกวิพากษ์วิจารณ์ในแง่ลบ หรือการกลัวการสอบ/การประเมิน",
        en: "Ignoring career opportunities through imposter syndrome, harsh critical reprimands, or failing to learn work lessons."
      },
      finance: {
        th: "ปัญหาหนี้เก่าตามมาหลอกหลอน การตัดสินใจทางการเงินผิดพลาดซ้ำรอยเดิม",
        en: "Past reckless financial blunders catching up with you, legal penalties, or failure to heed budget warnings."
      },
      health: {
        th: "โรคเก่ากำเริบจากการไม่ดูแลตนเอง ความเครียดจากความรู้สึกผิดทำลายระบบภูมิคุ้มกัน",
        en: "Relapse of old health issues caused by lingering guilt, self-neglect, or resisting necessary medical advice."
      },
      advice: {
        th: "หยุดลงโทษตัวเอง ไม่มีใครสมบูรณ์แบบ จงให้อภัยตนเองเพื่อปลดปล่อยวิญญาณของคุณให้เป็นอิสระ",
        en: "Silence the harsh internal judge. Forgiveness is not a weakness; it is the only key that unlocks the future."
      }
    }
  },
  {
    id: "m_21",
    number: 21,
    suite: "major",
    name_en: "The World",
    name_th: "เดอะ เวิลด์ (The World)",
    image: "01_Major_Arcana/21_21. The World.png",
    element: { en: "Saturn / Earth", th: "ดาวเสาร์ / ธาตุดิน (ความสมบูรณ์แบบและการบรรลุเป้าหมาย)" },
    quote: {
      th: "สตรีเริงระบำในพวงหรีดลอเรล ล้อมรอบด้วยสัญลักษณ์แห่งจักรวาล จุดสิ้นสุดของการเดินทางอันยิ่งใหญ่สู่ความสมบูรณ์แบบ",
      en: "The divine dancer encircled in laurel victory, harmonizing cosmos, spirit, and earth in complete wholeness."
    },
    upright: {
      keywords: {
        th: ["ความสำเร็จสมบูรณ์", "การบรรลุเป้าหมาย", "การเดินทางรอบโลก", "ความสมบูรณ์แบบ", "การปิดฉากอย่างงดงาม"],
        en: ["Completion", "Wholeness", "Accomplishment", "Global Travel", "Fulfillment"]
      },
      general: {
        th: "การเดินทางของ The Fool มาถึงจุดหมายปลายทางอันสมบูรณ์แบบ ประสบความสำเร็จในระดับสูงสุด มีความสุขอิ่มเอมในจิตใจ",
        en: "The ultimate culmination of a long cycle. Wholeness, triumphant closure, cosmic harmony, and boundless joy."
      },
      love: {
        th: "ความรักที่สมบูรณ์แบบ เข้ากันได้ทุกมิติ การแต่งงานสร้างครอบครัวอันอบอุ่น หรือการพบรักกับชาวต่างชาติต่างภาษา",
        en: "Fulfilling lifelong partnership, marriage, international romances, and feeling completely whole in love."
      },
      career: {
        th: "ประสบความสำเร็จระดับนานาชาติ โครงการเสร็จสมบูรณ์อย่างงดงาม ได้รับเกียรติยศและชื่อเสียงสูงสุดในสายงาน",
        en: "Reaching the pinnacle of your career, international acclaim, successfully finishing monumental projects."
      },
      finance: {
        th: "ความมั่งคั่งที่มั่นคงและไร้กังวล ได้รับผลตอบแทนเต็มเม็ดเต็มหน่วย การลงทุนต่างประเทศหรือค้าขายระดับสากลรุ่งเรือง",
        en: "Complete financial security, lucrative international endeavors, and attaining lasting material freedom."
      },
      health: {
        th: "สุขภาพแข็งแรงสมบูรณ์สูงสุด ทั้งกาย จิตใจ และจิตวิญญาณมีความสมดุลอย่างแท้จริง",
        en: "Optimal holistic health, total vitality, peace of mind, and harmonious mind-body-spirit integration."
      },
      advice: {
        th: "เฉลิมฉลองให้กับความสำเร็จของคุณ ภาคภูมิใจในทุกก้าวที่ผ่านมา และเตรียมพร้อมเปิดประตูสู่จักรวาลใหม่",
        en: "Rejoice in your triumph. You have mastered this cycle; step forward into the world as a whole soul."
      }
    },
    reversed: {
      keywords: {
        th: ["งานไม่เสร็จ", "ขาดชิ้นส่วนสุดท้าย", "ความล่าช้า", "ยังไม่สมบูรณ์", "ความว่างเปล่าในใจ"],
        en: ["Incompletion", "Lack of Closure", "Shortcuts", "Stagnation", "Unfinished Business"]
      },
      general: {
        th: "เกือบจะสำเร็จแต่ขาดอะไรบางอย่าง การค้างคาใจที่ยังปิดฉากไม่ลง หรือความรู้สึกว่าได้ทุกอย่างแต่ข้างในยังว่างเปล่า",
        en: "Falling just inches short of the finish line, lack of closure, lingering loose ends, or feeling unfulfilled despite achievements."
      },
      love: {
        th: "ความสัมพันธ์ที่ยังค้างคา เลิกกันไม่ขาด หรือการแต่งงานที่ยังติดปัญหาเรื่องเอกสาร/ระยะทาง",
        en: "Lack of closure from a past breakup, long-distance strain, or feeling an elusive emotional distance."
      },
      career: {
        th: "โปรเจกต์ติดขัดในขั้นตอนสุดท้าย การอนุมัติล่าช้า หรือยังไม่ได้รับการยอมรับในระดับที่ควรจะได้",
        en: "Projects stalled on final deliverables, missed international opportunities, or taking sloppy shortcuts."
      },
      finance: {
        th: "ยังไม่บรรลุเป้าหมายทางการเงินที่ตั้งไว้ มีเงินค้างจ่ายที่ยังตามเก็บไม่ได้ หรือการลงทุนต่างแดนล่าช้า",
        en: "Financial goals delayed, overseas payment friction, or failing to finalize crucial fiscal settlements."
      },
      health: {
        th: "การฟื้นตัวที่ยังไม่เต็มร้อย อาการป่วยเรื้อรังที่ยังไม่หายขาด ต้องดูแลต่อเนื่องอีกสักระยะ",
        en: "Nearly healed but requiring follow-up therapy, lingering fatigue, or neglecting mental rest."
      },
      advice: {
        th: "อย่าเพิ่งยอมแพ้เมื่อเดินมาถึงหน้าเส้นชัย รวบรวมพลังก้าวผ่านจุดสะดุดสุดท้ายนี้ไปให้ได้",
        en: "Do not abandon the quest at the final hurdle. Tie up the loose ends patiently; completion is within reach."
      }
    }
  }
];

// Helper to generate Minor Arcana dynamically with full accurate meanings
const SUIT_INFO = {
  pentacles: {
    folder: "02_Pentacles_เหรียญ",
    name_th: "เหรียญ",
    name_en: "Pentacles",
    element_th: "ธาตุดิน (การเงิน ความมั่นคง การงาน ร่างกาย วัตถุ)",
    element_en: "Earth (Wealth, career, material realm, stability)"
  },
  cups: {
    folder: "03_Cups_ถ้วย",
    name_th: "ถ้วย",
    name_en: "Cups",
    element_th: "ธาตุน้ำ (ความรัก อารมณ์ ความรู้สึก จิตใจ ความสัมพันธ์)",
    element_en: "Water (Love, feelings, intuition, relationships)"
  },
  swords: {
    folder: "04_Swords_ดาบ",
    name_th: "ดาบ",
    name_en: "Swords",
    element_th: "ธาตุลม (ความคิด สติปัญญา อุปสรรค การตัดสินใจ ปัญหา)",
    element_en: "Air (Intellect, thoughts, challenges, conflict, truth)"
  },
  wands: {
    folder: "05_Wands_ไม้",
    name_th: "ไม้",
    name_en: "Wands",
    element_th: "ธาตุไฟ (ความมุ่งมั่น แรงบันดาลใจ การกระทำ พลังงาน ความก้าวหน้า)",
    element_en: "Fire (Passion, inspiration, willpower, career drive, action)"
  }
};

const NUMBER_NAMES = {
  1: { en: "Ace", th: "1" },
  2: { en: "Two", th: "2" },
  3: { en: "Three", th: "3" },
  4: { en: "Four", th: "4" },
  5: { en: "Five", th: "5" },
  6: { en: "Six", th: "6" },
  7: { en: "Seven", th: "7" },
  8: { en: "Eight", th: "8" },
  9: { en: "Nine", th: "9" },
  10: { en: "Ten", th: "10" },
  11: { en: "Page", th: "เด็ก" },
  12: { en: "Knight", th: "อัศวิน" },
  13: { en: "Queen", th: "ราชินี" },
  14: { en: "King", th: "ราชา" }
};

// Generate and attach all 56 Minor Arcana
const SUITS = ["pentacles", "cups", "swords", "wands"];

SUITS.forEach(suitKey => {
  const suit = SUIT_INFO[suitKey];
  for (let num = 1; num <= 14; num++) {
    const numMeta = NUMBER_NAMES[num];
    const prefix = num <= 9 ? `0${num}` : `${num}`;
    
    // Exact file name matching with actual files on disk
    // For Court cards (11, 12, 13, 14), there is NO space between the Thai rank and suit name (e.g. เด็กเหรียญ, อัศวินถ้วย)
    // For Number cards (1-10), there IS a space (e.g. 1 เหรียญ, 10 ดาบ)
    const thRankSuit = num >= 11 
      ? `${numMeta.th}${suit.name_th}` 
      : `${numMeta.th} ${suit.name_th}`;

    let filename = "";
    if (suitKey === "pentacles") {
      filename = `${prefix}_${numMeta.en} of Pentacles (${thRankSuit}).png`;
    } else if (suitKey === "cups") {
      filename = `${prefix}_${numMeta.en} of Cups (${thRankSuit}).png`;
    } else if (suitKey === "swords") {
      filename = `${prefix}_${numMeta.en} of Swords (${thRankSuit}).png`;
    } else if (suitKey === "wands") {
      filename = `${prefix}_${numMeta.en} of Wands (${thRankSuit}).png`;
    }

    const name_en = `${numMeta.en} of ${suit.name_en}`;
    const name_th = `${numMeta.en} of ${suit.name_en} (${numMeta.th} ${suit.name_th})`;

    // Generate tailored meaning based on suit and number
    let upright_kw_th = [];
    let upright_kw_en = [];
    let rev_kw_th = [];
    let rev_kw_en = [];

    let quote_th = "";
    let quote_en = "";
    let general_upright_th = "";
    let general_upright_en = "";
    let general_rev_th = "";
    let general_rev_en = "";

    let love_up_th = "", love_up_en = "", love_rev_th = "", love_rev_en = "";
    let career_up_th = "", career_up_en = "", career_rev_th = "", career_rev_en = "";
    let finance_up_th = "", finance_up_en = "", finance_rev_th = "", finance_rev_en = "";
    let health_up_th = "", health_up_en = "", health_rev_th = "", health_rev_en = "";
    let advice_up_th = "", advice_up_en = "", advice_rev_th = "", advice_rev_en = "";

    if (num === 1) { // Ace
      quote_th = `มือแห่งสวรรค์ยื่น${suit.name_th}อันศักดิ์สิทธิ์ สัญลักษณ์แห่งโอกาสใหม่และการเริ่มต้นอันรุ่งโรจน์`;
      quote_en = `The divine hand extending the sacred ${suit.name_en}, bestowing pure potential and breakthrough.`;
      upright_kw_th = ["การเริ่มต้นใหม่", "โอกาสทอง", "พลังบริสุทธิ์", "โชคลาภ", "ความสำเร็จแรก"];
      upright_kw_en = ["New Opportunity", "Pure Potential", "Manifestation", "Breakthrough", "Victory"];
      rev_kw_th = ["โอกาสหลุดลอย", "การเริ่มต้นที่ติดขัด", "การขาดพลังใจ", "ความล่าช้า", "การพลาดจังหวะ"];
      rev_kw_en = ["Missed Opportunity", "False Start", "Blocked Energy", "Delay", "Frustration"];
      
      general_upright_th = `โอกาสใหม่ในด้าน${suit.name_th}กำลังมาถึง เป็นจังหวะเริ่มต้นที่สมบูรณ์แบบด้วยพลังงานด้านบวก`;
      general_upright_en = `A golden seed of potential in the realm of ${suit.name_en}. Seize this fresh dawn with enthusiasm.`;
      general_rev_th = `โอกาสที่ดีอาจหลุดลอยเพราะความลังเล หรือการเริ่มต้นที่ยังไม่พร้อม`;
      general_rev_en = `Hesitation or unreadiness causes this prime opportunity to slip through your fingers.`;
    } else if (num === 2) {
      quote_th = `การชั่งน้ำหนัก การเลือก และการจับคู่เพื่อสร้างความสมดุลในพลังของ${suit.name_th}`;
      quote_en = `Weighing paths, forming partnerships, and balancing dual forces of ${suit.name_en}.`;
      upright_kw_th = ["การตัดสินใจ", "การร่วมมือ", "ความสมดุล", "การวางแผน", "พันธมิตร"];
      upright_kw_en = ["Partnership", "Dual Choice", "Balance", "Planning", "Cooperation"];
      rev_kw_th = ["ความไม่ลงรอย", "การลังเล", "การตัดสินใจผิดพลาด", "ความขัดแย้ง", "ความไม่สมดุล"];
      rev_kw_en = ["Indecision", "Imbalance", "Disconnection", "Conflict", "Poor Choice"];
      
      general_upright_th = `การผสานพลังร่วมกับผู้อื่น หรือการมีทางเลือกที่ดีสองทางที่ต้องวางแผนอย่างรอบคอบ`;
      general_upright_en = `Mutual harmony, collaborative agreements, and strategic planning for the immediate future.`;
      general_rev_th = `ความขัดแย้งทางความคิด หรือการลังเลไม่กล้าเลือกจนเสียโอกาสทั้งสองทาง`;
      general_rev_en = `Diverging goals, friction between partners, or paralyzing indecision causing stagnation.`;
    } else if (num === 3) {
      quote_th = `การขยับขยาย ผลิดอกออกผล และการรวมกลุ่มเพื่อสร้างสรรค์ความสำเร็จ`;
      quote_en = `Expansion, initial harvest, and creative collaboration yielding tangible success.`;
      upright_kw_th = ["การเติบโต", "ความร่วมมือทีม", "การเฉลิมฉลอง", "การขยายตัว", "ความคืบหน้า"];
      upright_kw_en = ["Expansion", "Teamwork", "Progress", "Celebration", "Momentum"];
      rev_kw_th = ["ความล่าช้า", "ขาดความร่วมมือ", "งานสะดุด", "ความไม่ลงรอยในทีม", "ความผิดหวัง"];
      rev_kw_en = ["Delays", "Team Discord", "Stunted Growth", "Creative Block", "Disappointment"];

      general_upright_th = `สิ่งที่คุณลงมือทำเริ่มเห็นผลลัพธ์ที่น่ายินดี มีความร่วมมือและแรงหนุนที่ดีจากคนรอบข้าง`;
      general_upright_en = `Your efforts are gaining noticeable momentum. Collaboration and community amplify results.`;
      general_rev_th = `งานหรือโปรเจกต์อาจล่าช้าเพราะคนในทีมไม่ไปในทิศทางเดียวกัน`;
      general_rev_en = `Lack of team cohesion, miscommunication, or delays hindering the anticipated harvest.`;
    } else if (num >= 4 && num <= 10) {
      // Numerical progressions
      upright_kw_th = ["ความมั่นคง", "การพัฒนา", "ความพยายาม", "การเอาชนะอุปสรรค", "ผลลัพธ์"];
      upright_kw_en = ["Stability", "Persistence", "Effort", "Overcoming Challenges", "Fulfillment"];
      rev_kw_th = ["ความตึงเครียด", "การเปลี่ยนแปลง", "ความเหนื่อยล้า", "การปล่อยวาง", "การฟื้นตัว"];
      rev_kw_en = ["Tension", "Fatigue", "Letting Go", "Shakeup", "Recovery"];

      quote_th = `บทเรียนแห่งชีวิตในมิติของ${suit.name_th} สะท้อนถึงการเติบโตผ่านประสบการณ์จริง`;
      quote_en = `A pivotal lesson of the ${suit.name_en} path, navigating earthly tests toward maturity.`;

      general_upright_th = `พลังของ${suit.name_th}กำลังส่งผลชัดเจนในชีวิตของคุณ ใช้สติและปัญญาในการขับเคลื่อน`;
      general_upright_en = `The energy of ${suit.name_en} is actively manifesting. Apply focus and diligence to succeed.`;
      general_rev_th = `ถึงเวลาทบทวนและปรับเปลี่ยนมุมมองเดิมๆ เพื่อก้าวข้ามข้อจำกัด`;
      general_rev_en = `Time to release rigid habits and embrace flexibility to transcend current limitations.`;
    } else {
      // Court cards (11: Page, 12: Knight, 13: Queen, 14: King)
      const rank = numMeta.en;
      quote_th = `${numMeta.th}${suit.name_th} ตัวแทนแห่งบุคลิกภาพ ปัญญา และการเชี่ยวชาญในวิถีของ${suit.name_th}`;
      quote_en = `The ${rank} of ${suit.name_en}, embodying mastery, personality, and leadership in this realm.`;

      if (num === 11) { // Page
        upright_kw_th = ["ข่าวสารใหม่", "การเรียนรู้", "ความกระตือรือร้น", "โอกาสเริ่มต้น", "ผู้เยาว์"];
        upright_kw_en = ["New Messages", "Curiosity", "Youthful Energy", "Study", "Fresh Inspiration"];
        rev_kw_th = ["ข่าวร้าย", "ความไม่รอบคอบ", "ความขี้เกียจ", "การไม่ใส่ใจ", "ความไร้วุฒิภาวะ"];
        rev_kw_en = ["Bad News", "Immaturity", "Lack of Discipline", "Laziness", "Gossip"];
      } else if (num === 12) { // Knight
        upright_kw_th = ["การรุกคืบ", "ความมุ่งมั่น", "ความเร็ว", "การเดินทาง", "การลงมือทำทันที"];
        upright_kw_en = ["Action", "Momentum", "Ambition", "Speed", "Pursuit of Goals"];
        rev_kw_th = ["ความใจร้อน", "ความก้าวร้าว", "การกระทำบุ่มบ่าม", "อุบัติเหตุ", "ความล่าช้า"];
        rev_kw_en = ["Impulsiveness", "Recklessness", "Aggression", "Delays", "Burnout"];
      } else if (num === 13) { // Queen
        upright_kw_th = ["ความเฉลียวฉลาด", "ความเมตตา", "ความมั่นคงทางอารมณ์", "การดูแลเอาใจใส่", "เสน่ห์ลึกซึ้ง"];
        upright_kw_en = ["Nurturing Wisdom", "Emotional Security", "Intuitive Mastery", "Grace", "Generosity"];
        rev_kw_th = ["อารมณ์หงุดหงิด", "ความอิจฉาริษยา", "การบงการ", "ความเย็นชา", "การละเลย"];
        rev_kw_en = ["Insecurity", "Jealousy", "Manipulative", "Coldness", "Neglect"];
      } else { // King
        upright_kw_th = ["ความเป็นผู้นำสูงสุด", "อำนาจการตัดสินใจ", "ความสำเร็จอันยิ่งใหญ่", "ความรับผิดชอบ", "ความเชี่ยวชาญ"];
        upright_kw_en = ["Supreme Leadership", "Mastery", "Authority", "Maturity", "Wealth/Honor"];
        rev_kw_th = ["การใช้อำนาจเผด็จการ", "ความดื้อรั้น", "ความหยิ่งยะโส", "ความล้มเหลวในการนำ", "ความโลภ"];
        rev_kw_en = ["Tyranny", "Arrogance", "Poor Leadership", "Greed", "Stubbornness"];
      }

      general_upright_th = `บุคคลที่มีลักษณะของ${numMeta.th}${suit.name_th} จะเข้ามาช่วยเหลือ หรือตัวคุณเองต้องนำคุณสมบัตินี้มาใช้`;
      general_upright_en = `A person embodying the ${rank} of ${suit.name_en} enters your life, or you must step into this archetype.`;
      general_rev_th = `ระวังด้านลบของ${numMeta.th}${suit.name_th} เช่น ความใจร้อน เอาแต่ใจ หรือการใช้อำนาจในทางที่ผิด`;
      general_rev_en = `Beware the shadow traits of the ${rank}: emotional volatility, stubbornness, or manipulative authority.`;
    }

    // Suit-specific context
    if (suitKey === "pentacles") {
      love_up_th = "ความรักที่มั่นคง จับต้องได้ ดูแลกันทั้งทางกายและการเงิน มีอนาคตที่มั่งคั่งร่วมกัน";
      love_up_en = "Grounded, dependable love with financial and emotional stability. Building a secure home together.";
      love_rev_th = "ปัญหาเรื่องเงินทองกระทบความสัมพันธ์ หรือการมองความรักเป็นเรื่องผลประโยชน์";
      love_rev_en = "Financial stress straining the relationship, materialism, or emotional stinginess.";
      career_up_th = "การงานก้าวหน้า ได้ผลตอบแทนคุ้มค่า ผลงานเป็นรูปธรรมและได้รับการยอมรับอย่างสูง";
      career_up_en = "Tangible professional success, lucrative contracts, hard work paying off handsomely.";
      career_rev_th = "งานสะดุด รายได้ไม่ตามเป้า ระวังความผิดพลาดทางเอกสารการเงิน";
      career_rev_en = "Job insecurity, financial setbacks, or lack of discipline causing missed deadlines.";
      finance_up_th = "การเงินมั่งคั่ง มีโชคจากทรัพย์สิน การลงทุนงอกเงย สภาพคล่องยอดเยี่ยม";
      finance_up_en = "Prosperous cash flow, sound asset appreciation, fruitful returns on investment.";
      finance_rev_th = "เงินตึงมือ รายจ่ายเกินตัว ระวังการขาดทุนจากการเก็งกำไร";
      finance_rev_en = "Financial losses, tight budget constraints, or wasteful expenditures.";
      health_up_th = "สุขภาพกายแข็งแรง อุดมสมบูรณ์ ควรออกกำลังกายสม่ำเสมอ";
      health_up_en = "Sturdy physical constitution, good stamina, and grounded physical well-being.";
      health_rev_th = "ระวังน้ำหนักเกิน ปัญหาทางกระดูก ข้อต่อ หรือความเครียดจากเรื่องเงิน";
      health_rev_en = "Sedentary sluggishness, joint or back pains, or stress-related weight fluctuations.";
      advice_up_th = "สร้างรากฐานที่มั่นคง บริหารทรัพยากรด้วยความรอบคอบและมุ่งมั่น";
      advice_up_en = "Build upon solid ground. Value patience, practical wisdom, and sustainable discipline.";
      advice_rev_th = "อย่าเอาคุณค่าในชีวิตไปผูกติดกับเงินทองเพียงอย่างเดียว ปรับสมดุลการใช้จ่ายด่วน";
      advice_rev_en = "Do not mistake wealth for worth. Re-evaluate your priorities and stop hoarding or overspending.";
    } else if (suitKey === "cups") {
      love_up_th = "ความรักหวานชื่น เข้าใจลึกซึ้งในอารมณ์ ความผูกพันทางจิตวิญญาณอันอบอุ่น";
      love_up_en = "Deep emotional intimacy, heartfelt romance, compassion, and affectionate connection.";
      love_rev_th = "ความเข้าใจผิดทางอารมณ์ อาการน้อยใจ เรียกร้องความสนใจ หรือความผิดหวังในความรัก";
      love_rev_en = "Emotional moodiness, feeling unloved, heartbreak, or suffocating codependency.";
      career_up_th = "ทำงานด้วยใจรัก บรรยากาศในที่ทำงานอบอุ่น มีมิตรภาพที่ดีกับเพื่อนร่วมงาน";
      career_up_en = "Fulfilling vocation aligned with your passion, harmonious teamwork, and artistic inspiration.";
      career_rev_th = "หมดใจกับงาน อารมณ์แปรปรวนในที่ทำงาน รู้สึกว่าเพื่อนร่วมงานไม่จริงใจ";
      career_rev_en = "Emotional burnout, lack of workplace inspiration, or toxic office drama draining your focus.";
      finance_up_th = "การเงินราบรื่น ใช้จ่ายกับสิ่งที่สร้างความสุขให้ครอบครัวและคนที่รัก";
      finance_up_en = "Comfortable financial flow; sharing abundance generously with loved ones.";
      finance_rev_th = "ใช้เงินตามอารมณ์เพื่อชดเชยความเหงา หรือเสียเงินเพราะความใจอ่อน";
      finance_rev_en = "Emotional retail therapy, losing money due to gullibility, or financial guilt.";
      health_up_th = "จิตใจผ่องใส สุขภาพจิตดี ส่งผลให้ร่างกายแข็งแรงและสดชื่น";
      health_up_en = "Emotional peace fostering robust holistic health, restful sleep, and vitality.";
      health_rev_th = "ความเครียด อารมณ์ดิ่ง ซึมเศร้า หรือปัญหาเกี่ยวกับระบบของเหลวในร่างกาย";
      health_rev_en = "Emotional exhaustion, psychosomatic ailments, fluid retention, or mood swings.";
      advice_up_th = "เปิดหัวใจรับฟังความรู้สึกของตนเองและคนรอบข้างด้วยความเมตตา";
      advice_up_en = "Trust your heart's intuitive guidance. Lead with empathy and gentle understanding.";
      advice_rev_th = "อย่าให้อารมณ์อยู่เหนือเหตุผล ดึงสติตนเองออกมาจากความดราม่า";
      advice_rev_en = "Do not drown in emotional storms. Anchor yourself in objective reality and clear boundaries.";
    } else if (suitKey === "swords") {
      love_up_th = "ความรักที่ใช้เหตุผล สื่อสารกันตรงไปตรงมา ไม่มีความลับต่อกัน";
      love_up_en = "Clear, articulate communication in love, intellectual rapport, and transparent honesty.";
      love_rev_th = "คำพูดทำร้ายจิตใจ ทะเลาะเบาะแว้ง ใช้ตรรกะห้ำหั่นกันจนลืมความรู้สึก";
      love_rev_en = "Sharp, cutting words, bitter arguments, cynicism, and mental cruelty poisoning the bond.";
      career_up_th = "การแก้ปัญหาด้วยสติปัญญาเฉียบแหลม ชนะการเจรจา การวางกลยุทธ์ที่แม่นยำ";
      career_up_en = "Brilliant strategic breakthroughs, sharp intellect winning debates, decisive executive action.";
      career_rev_th = "ความขัดแย้งในที่ทำงาน ข้อมูลบิดเบือน ความเครียดสะสมจากแรงกดดันสูง";
      career_rev_en = "Office backstabbing, harsh reprimands, intellectual arrogance, or analysis paralysis.";
      finance_up_th = "วางแผนการเงินอย่างรัดกุม ตัดสินใจด้วยตัวเลขจริง ไม่เสี่ยงโดยไร้เหตุผล";
      finance_up_en = "Prudent rational budgeting, cutting unnecessary expenses, and sharp fiscal vigilance.";
      finance_rev_th = "ระวังข้อพิพาททางสัญญา หนี้สินที่เป็นคดีความ หรือการถูกเอาเปรียบทางกฎหมาย";
      finance_rev_en = "Legal battles over money, contractual disputes, or poor decisions born of stress.";
      health_up_th = "ระบบประสาทและสมองทำงานได้ดี มีสมาธิแน่วแน่";
      health_up_en = "Sharp mental acuity, clear focus, and disciplined physical habits.";
      health_rev_th = "ปวดหัว ไมเกรน นอนไม่หลับ ความเครียดสะสมรุนแรง";
      health_rev_en = "Severe migraines, insomnia from racing thoughts, and chronic mental exhaustion.";
      advice_up_th = "ใช้ความจริงและความเฉียบคมในการตัดสิ่งไร้สาระออกจากชีวิตอย่างเด็ดขาด";
      advice_up_en = "Wield the sword of truth cleanly. Cut through illusion and speak with fearless clarity.";
      advice_rev_th = "ระวังคำพูดและการใช้อารมณ์ประชดประชัน ความจริงใจไม่ต้องแลกด้วยความโหดร้าย";
      advice_rev_en = "Lower your defenses. Sharp intellect becomes destructive when stripped of basic compassion.";
    } else if (suitKey === "wands") {
      love_up_th = "ความรักที่เปี่ยมด้วยไฟเสน่หา ตื่นเต้น กระตือรือร้น พร้อมผจญภัยไปด้วยกัน";
      love_up_en = "Passionate, fiery attraction, energetic romance, and shared adventures.";
      love_rev_th = "ไฟรักมอดลง ความใจร้อนเอาแต่ใจ หรือความสัมพันธ์ที่เร่งรีบจนเกิดปัญหา";
      love_rev_en = "Fading passion, impatience, aggressive courtship, or selfishness exhausting the flame.";
      career_up_th = "ไฟในการทำงานลุกโชน ความคิดสร้างสรรค์พุ่ง มีความมุ่งมั่นสู่เป้าหมายอย่างแรงกล้า";
      career_up_en = "High creative drive, entrepreneurial fire, rapid career advancement, and visionary action.";
      career_rev_th = "หมดไฟ (Burnout) งานล้นมือจนรับไม่ไหว หรือการแข่งขันที่ดุเดือดจนท้อแท้";
      career_rev_en = "Burnout, depleted creative fire, unrealistic expectations, or projects fizzling out.";
      finance_up_th = "การเงินได้มาจากความสามารถและโครงการใหม่ๆ มีไฟในการสร้างรายได้เพิ่ม";
      finance_up_en = "Dynamic revenue growth from creative side-ventures, active business expansions.";
      finance_rev_th = "ใจร้อนลงทุนเร็วเกินไปจนเงินสะดุด หรือรายจ่ายจากการทำตามอารมณ์ชั่ววูบ";
      finance_rev_en = "Impulsive startup losses, overextending resources, or financial fatigue.";
      health_up_th = "พลังงานล้นเหลือ ร่างกายกระฉับกระเฉง ฟื้นตัวเร็ว";
      health_up_en = "Abundant physical stamina, active lifestyle vitality, and strong life force.";
      health_rev_th = "ระวังอาการอักเสบ ไข้ขึ้น กล้ามเนื้อฉีกขาด หรือความเหนื่อยล้าจากการโหมงาน";
      health_rev_en = "Inflammatory flare-ups, fever, muscle strain from overexertion, and adrenal exhaustion.";
      advice_up_th = "ลงมือทำทันทีด้วยไฟในใจ ความกระตือรือร้นของคุณคือพลังที่จะเปิดทุกประตู";
      advice_up_en = "Channel your passion into decisive action. Boldness carries magic and destiny within it.";
      advice_rev_th = "พักผ่อนเพื่อเติมเชื้อเพลิงให้กองไฟ อย่าฝืนวิ่งต่อไปเมื่อร่างกายและจิตใจส่งสัญญาณเตือน";
      advice_rev_en = "Rest and refuel your spark. Forcing progress when burnt out will only extinguish your fire.";
    }

    TAROT_CARDS.push({
      id: `${suitKey}_${num}`,
      number: num,
      suite: suitKey,
      name_en: name_en,
      name_th: name_th,
      image: `${suit.folder}/${filename}`,
      element: { en: suit.element_en, th: suit.element_th },
      quote: { th: quote_th, en: quote_en },
      upright: {
        keywords: { th: upright_kw_th, en: upright_kw_en },
        general: { th: general_upright_th, en: general_upright_en },
        love: { th: love_up_th, en: love_up_en },
        career: { th: career_up_th, en: career_up_en },
        finance: { th: finance_up_th, en: finance_up_en },
        health: { th: health_up_th, en: health_up_en },
        advice: { th: advice_up_th, en: advice_up_en }
      },
      reversed: {
        keywords: { th: rev_kw_th, en: rev_kw_en },
        general: { th: general_rev_th, en: general_rev_en },
        love: { th: love_rev_th, en: love_rev_en },
        career: { th: career_rev_th, en: career_rev_en },
        finance: { th: finance_rev_th, en: finance_rev_en },
        health: { th: health_rev_th, en: health_rev_en },
        advice: { th: advice_rev_th, en: advice_rev_en }
      }
    });
  }
});

// Verify cards count
if (typeof window !== "undefined") {
  window.TAROT_CARDS = TAROT_CARDS;
  console.log(`[Tarot Grimoire] Loaded ${TAROT_CARDS.length} sacred cards.`);
}
