/**
 * 56 Minor Arcana Comprehensive Divination Intelligence
 * Sourced according to authentic traditional Rider-Waite-Smith tarot symbolism.
 * Covers all 56 cards (Wands, Cups, Swords, Pentacles: 1-14)
 * with 100% unique, authoritative interpretations for General, Love, Career, Finance, Health, and Advice.
 */

const TAROT_MINOR_DATA = {
  "wands_1": {
    "upright": {
      "keywords": {
        "th": [
          "แรงบันดาลใจใหม่",
          "ประกายไฟแห่งการเริ่มต้น",
          "ความมุ่งมั่นล้นเปี่ยม",
          "โอกาสสร้างสรรค์",
          "พลังขับเคลื่อน"
        ],
        "en": [
          "Inspiration",
          "New Spark",
          "Creative Potential",
          "Drive",
          "Breakthrough"
        ]
      },
      "general": {
        "th": "ประกายไฟแห่งความคิดสร้างสรรค์จุดติดขึ้นแล้ว คุณกำลังได้รับแรงกระตุ้นอันแรงกล้าที่จะริเริ่มสิ่งใหม่ โครงการหรือวิสัยทัศน์ที่คุณรอคอยพร้อมจะเปิดม่าน",
        "en": "A lightning bolt of creative inspiration has struck. You are filled with vibrant vitality and bold enthusiasm to launch an exciting new chapter."
      },
      "love": {
        "th": "ไฟเสน่หาปะทุขึ้นอย่างรวดเร็ว คนโสดมีเกณฑ์พบรักแรกพบที่ทำให้หัวใจเต้นระรัว คนมีคู่เติมเต็มความเร่าร้อนและความกระตือรือร้นให้กัน",
        "en": "Fiery attraction and passionate beginnings. Singles may experience love at first sight; couples reignite spontaneous passion and adventurous intimacy."
      },
      "career": {
        "th": "ได้เริ่มโปรเจกต์ใหม่ที่ท้าทายและตรงกับความชอบ การเปิดตัวธุรกิจหรือบทบาทหน้าที่ใหม่ที่ปลุกพลังความเป็นผู้นำ",
        "en": "Launching an ambitious new venture or taking charge of a high-energy project that allows your true creative leadership to shine."
      },
      "finance": {
        "th": "โอกาสทางการเงินใหม่ๆ เริ่มงอกเงยจากการลงมือทำ โครงการใหม่มีแววสร้างรายได้งาม ควรเริ่มลงมือทันที",
        "en": "New streams of income emerging from creative initiative. Favorable time to invest energy into early-stage ventures."
      },
      "health": {
        "th": "พลังชีวิตล้นเปี่ยม ร่างกายกระปรี้กระเปร่า เหมาะแก่การเริ่มโปรแกรมออกกำลังกายใหม่เพื่อรีดพลังงาน",
        "en": "Surging life force and vitality. Ideal timing to start a dynamic athletic or wellness regimen."
      },
      "advice": {
        "th": "อย่าปล่อยให้เปลวไฟแห่งความฝันมอดดับ จงลงมือทำทันทีด้วยความกล้าหาญ โอกาสดีเช่นนี้ไม่ได้มีมาบ่อยๆ",
        "en": "Seize the spark without hesitation. Bold initiative carries its own genius, power, and destiny."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ไฟมอด",
          "ขาดแรงบันดาลใจ",
          "ความล่าช้า",
          "ขาดความมั่นใจ",
          "แผนสะดุด"
        ],
        "en": [
          "Lack of Spark",
          "Delays",
          "Creative Block",
          "Self-Doubt",
          "Hesitation"
        ]
      },
      "general": {
        "th": "รู้สึกเหมือนไฟในตัวมอดลง ชะงักงัน หรือความคิดดีๆ ยังไม่สามารถนำไปปฏิบัติจริงได้เพราะขาดพลังใจและความชัดเจน",
        "en": "Creative blocks and stalled momentum. You may feel a lack of internal drive or frustration over initial delays."
      },
      "love": {
        "th": "ความกระตือรือร้นลดลง อีกฝ่ายดูเฉยเมย หรือความสัมพันธ์ที่เริ่มต้นอย่างหวือหวาเริ่มหมดความตื่นเต้นอย่างรวดเร็ว",
        "en": "A romantic spark fizzling out prematurely, or one person holding back enthusiasm out of emotional exhaustion."
      },
      "career": {
        "th": "โปรเจกต์ใหม่ล่าช้ากว่ากำหนด ขาดแรงจูงใจในการทำงาน หรือเจ้านายยังไม่อนุมัติแผนงานที่เสนอ",
        "en": "Postponed project launches, creative burnout, or lack of direction stalling professional advancement."
      },
      "finance": {
        "th": "แผนการหาเงินใหม่ๆ ติดขัด ผลตอบแทนยังไม่มาตามเวลา ระวังเสียเงินไปกับไอเดียที่ยังไม่ตกผลึก",
        "en": "Unrealized financial promises and slow returns. Avoid pouring capital into half-baked concepts."
      },
      "health": {
        "th": "หมดเรี่ยวแรง เหนื่อยล้าสะสม พลังงานในร่างกายไม่สมดุล ควรพักผ่อนเพื่อเติมพลังใจ",
        "en": "Sluggish energy, depleted adrenal reserves, or mild exhaustion from pushing yourself before being ready."
      },
      "advice": {
        "th": "พักผ่อนเพื่อค้นหาประกายไฟดวงเดิม อย่าฝืนพายเรือทวนน้ำเมื่อพลังใจยังไม่พร้อมสมบูรณ์",
        "en": "Step back and rekindle your inner fire quietly. Do not force creative birth before gestation is complete."
      }
    }
  },
  "wands_2": {
    "upright": {
      "keywords": {
        "th": [
          "การวางแผนอนาคต",
          "การตัดสินใจก้าวหน้า",
          "ก้าวข้ามแดนเดิม",
          "การขยายวิสัยทัศน์",
          "การรอคอยจังหวะ"
        ],
        "en": [
          "Future Planning",
          "Progress",
          "Vision",
          "Expansion",
          "Strategic Choice"
        ]
      },
      "general": {
        "th": "คุณกำลังยืนอยู่บนจุดที่มองเห็นโลกกว้าง ถึงเวลาวางแผนระยะยาวและตัดสินใจเลือกทิศทางเพื่อก้าวออกจากเขตความคุ้นเคยเดิม",
        "en": "Standing at the parapet looking out at the horizon, you hold the world in your hands. It is time to formulate a strategic long-range blueprint."
      },
      "love": {
        "th": "วางแผนอนาคตร่วมกันในระยะยาว สำหรับคนโสด มีเกณฑ์พบรักกับคนต่างถิ่น ต่างแดน หรือคนที่มีวิสัยทัศน์กว้างไกล",
        "en": "Discussing future trajectory and shared horizons. Singles may connect with someone from afar or an ambitious worldly partner."
      },
      "career": {
        "th": "การขยายงานไปสู่ระดับสากลหรือตลาดใหม่ การวางกลยุทธ์ธุรกิจและเตรียมพร้อมสำหรับการก้าวกระโดดครั้งสำคัญ",
        "en": "Strategic expansion, cross-border partnerships, or deciding whether to stay in safe territory or venture into bigger arenas."
      },
      "finance": {
        "th": "การเงินมั่นคงและมีศักยภาพเติบโต วางแผนการลงทุนระยะยาวอย่างรอบคอบเพื่ออนาคตที่มั่งคั่ง",
        "en": "Financial stability allowing strategic investments. Planning for long-term dividends rather than quick spending."
      },
      "health": {
        "th": "สุขภาพดี ทัศนคติเปิดกว้าง การเดินทางเปลี่ยนบรรยากาศจะช่วยฟื้นฟูจิตใจและพลังงานได้ดีเยี่ยม",
        "en": "Good physical equilibrium. Travel and fresh environments will invigorate your mental clarity and stamina."
      },
      "advice": {
        "th": "อย่ากลัวที่จะก้าวออกจากคอมฟอร์ตโซน วิสัยทัศน์ที่กว้างไกลจะนำคุณไปสู่ดินแดนแห่งความสำเร็จที่ยิ่งใหญ่กว่า",
        "en": "Look beyond current confines. Bold foresight and structured preparation will turn ambition into empire."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "กลัวความไม่แน่นอน",
          "แผนการผิดพลาด",
          "ลังเลไม่กล้าก้าว",
          "ติดอยู่ในกรอบ",
          "ขาดวิสัยทัศน์"
        ],
        "en": [
          "Fear of Unknown",
          "Bad Planning",
          "Hesitation",
          "Playing Small",
          "Stagnation"
        ]
      },
      "general": {
        "th": "ความกลัวการเปลี่ยนแปลงทำให้คุณลังเลไม่ยอมก้าวเดิน หรือแผนงานที่วางไว้ติดขัดเพราะประเมินสถานการณ์คลาดเคลื่อน",
        "en": "Fear of stepping into the unknown keeps you bound to comfort zones, or poor contingency planning causes friction."
      },
      "love": {
        "th": "ความสัมพันธ์ไม่คืบหน้าเพราะไม่กล้าตัดสินใจเรื่องอนาคต หรือมีความคิดเห็นไม่ตรงกันเรื่องที่อยู่อาศัยและการใช้ชีวิต",
        "en": "Diverging long-term goals or reluctance to commit to a shared future due to unaddressed insecurities."
      },
      "career": {
        "th": "การขยายงานสะดุด แผนงานเดินทางหรือติดต่อต่างประเทศถูกเลื่อน ลังเลที่จะเปลี่ยนงานจนเสียโอกาส",
        "en": "Stalled expansion plans, travel complications, or anxiety holding you back from a lucrative international opening."
      },
      "finance": {
        "th": "การลงทุนติดขัด ไม่เป็นไปตามการคาดการณ์ ควรชะลอการขยายธุรกิจและการใช้เงินก้อนใหญ่",
        "en": "Investment timelines delayed; avoid risky speculative overseas ventures until terms are transparent."
      },
      "health": {
        "th": "ความกังวลเรื่องอนาคตทำให้นอนไม่ค่อยหลับ หรือมีอาการเมื่อยล้าจากการนั่งทำงานวางแผนนานเกินไป",
        "en": "Restlessness, travel fatigue, or tension headaches from obsessive over-analyzing."
      },
      "advice": {
        "th": "ประเมินความเสี่ยงด้วยสติ แต่อย่าปล่อยให้ความกลัวมาเป็นกรงขังศักยภาพที่แท้จริงของคุณ",
        "en": "Break free from the paralysis of overthinking. Calculated courage is better than stagnant safety."
      }
    }
  },
  "wands_3": {
    "upright": {
      "keywords": {
        "th": [
          "เรือขนทองเข้าท่า",
          "การขยายตัว",
          "ความสำเร็จแรก",
          "การมองการณ์ไกล",
          "ความก้าวหน้าอย่างมั่นใจ"
        ],
        "en": [
          "Expansion",
          "Foresight",
          "Ships Arriving",
          "Progress",
          "Enterprise"
        ]
      },
      "general": {
        "th": "สิ่งที่คุณได้หว่านพืชและวางแผนไว้กำลังออกผล เรือแห่งโอกาสเริ่มแล่นเข้าเทียบท่า การเติบโตและการขยับขยายกำลังเกิดขึ้นจริง",
        "en": "Your efforts are bearing tangible momentum. Ships set to sea are returning with rewards, heralding expansion and validated foresight."
      },
      "love": {
        "th": "ความสัมพันธ์ก้าวหน้าไปอีกขั้นอย่างมั่นคง อาจมีเรื่องการเดินทางร่วมกัน คนโสดมีเกณฑ์พบรักจากการเดินทางหรือการทำงานร่วมกัน",
        "en": "Steadfast relationship growth and shared milestones. Singles may encounter love during travel or expanding professional circles."
      },
      "career": {
        "th": "ธุรกิจหรือโปรเจกต์เติบโตขึ้นอย่างเห็นได้ชัด ได้รับผลตอบรับยอดเยี่ยม มีโอกาสขยายสาขาหรือร่วมงานกับต่างชาติ",
        "en": "Career momentum accelerating; positive fruits of past groundwork, trade opportunities, and fruitful commercial ventures."
      },
      "finance": {
        "th": "ผลกำไรเริ่มไหลเข้ามา การลงทุนเริ่มคืนทุนและให้ดอกผลที่งดงาม สภาพคล่องทางการเงินขยายตัว",
        "en": "Returns on investments materializing; healthy cash flow and expanding earning horizons."
      },
      "health": {
        "th": "ร่างกายแข็งแรง ฟื้นฟูสมบูรณ์ จิตใจปลอดโปร่งพร้อมลุยกับความท้าทายใหม่ๆ",
        "en": "Robust health, high resilience, and positive mental horizons empowering physical strength."
      },
      "advice": {
        "th": "จงมองให้ไกลและเตรียมพร้อมรองรับการเติบโตที่กำลังมาถึง อย่าย่อท้อในจังหวะที่คลื่นลมกำลังเป็นใจ",
        "en": "Maintain long-term vision. Welcome incoming opportunities with prepared hands and an expansive mindset."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "เรือดีเลย์",
          "ความล่าช้าของผลลัพธ์",
          "อุปสรรคการขนส่ง",
          "ความผิดหวังในแผน",
          "ขาดการเกื้อหนุน"
        ],
        "en": [
          "Delays",
          "Obstacles",
          "Frustrated Ambition",
          "Logistical Blocks",
          "Disappointment"
        ]
      },
      "general": {
        "th": "ผลตอบแทนที่คุณเฝ้ารอล่าช้ากว่ากำหนด มีอุปสรรคที่ไม่คาดคิดเข้ามาขัดขวางจังหวะความก้าวหน้า",
        "en": "Delays in anticipated returns and logistical obstacles. Your ships feel stalled in turbulent waters."
      },
      "love": {
        "th": "ระยะทางหรือตารางเวลาทำให้ห่างเหิน ความสัมพันธ์ทางไกลต้องเผชิญบททดสอบความอดทน",
        "en": "Long-distance strain, communication lag, or disappointment over postponed shared travels."
      },
      "career": {
        "th": "การส่งมอบงานสะดุด คู่ค้าต่างแดนหรือฝ่ายประสานงานทำงานล่าช้า โครงการขยายงานต้องเลื่อนออกไป",
        "en": "Stalled negotiations, supply-chain delays, or difficulties breaking into new markets."
      },
      "finance": {
        "th": "เงินที่คาดหวังว่าจะได้เกิดการเลื่อนจ่าย ต้องวางแผนการเงินสำรองเพื่อประคองสภาพคล่อง",
        "en": "Delayed receivables or cash flow hiccups. Keep tight control over operational expenses."
      },
      "health": {
        "th": "อาการอ่อนเพลียจากการเดินทาง หรือความหงุดหงิดใจจากสิ่งที่ไม่ได้ดั่งใจส่งผลต่อระบบย่อยอาหาร",
        "en": "Travel exhaustion, jet lag, or stress-induced digestive discomfort from waiting anxiously."
      },
      "advice": {
        "th": "อดทนและปรับแผนการตามสถานการณ์จริง อย่าท้อถอยเพราะความล่าช้าเพียงชั่วคราว",
        "en": "Exercise patient resolve. Tides shift; use this lull to reinforce logistical foundations."
      }
    }
  },
  "wands_4": {
    "upright": {
      "keywords": {
        "th": [
          "การเฉลิมฉลอง",
          "ความสุขในบ้าน",
          "การลงหลักปักฐาน",
          "งานมงคล",
          "ความมั่นคงรื่นเริง"
        ],
        "en": [
          "Celebration",
          "Homecoming",
          "Harmony",
          "Milestone",
          "Domestic Joy"
        ]
      },
      "general": {
        "th": "ช่วงเวลาแห่งความสุข ความสำเร็จ และการเฉลิมฉลอง บรรยากาศอบอุ่นมั่นคงทั้งในครอบครัวและที่ทำงาน ได้พบความสงบใจ",
        "en": "A joyful milestone of harmony, homecoming, and community celebration. A solid sanctuary built on shared triumphs."
      },
      "love": {
        "th": "ความรักสุกงอม มีเกณฑ์หมั้นหมาย แต่งงาน หรือย้ายเข้าอยู่บ้านร่วมกัน บรรยากาศครอบครัวทั้งสองฝ่ายชื่นมื่น",
        "en": "Deep relationship harmony, wedding bells, cohabitation, or celebratory romantic milestones surrounded by loving supporters."
      },
      "career": {
        "th": "โปรเจกต์บรรลุเป้าหมายสำคัญ ได้รับการฉลองความสำเร็จ บรรยากาศในที่ทำงานกลมเกลียวและมีความสุข",
        "en": "Successful completion of a major work phase; office celebrations, team cohesion, and proud recognition."
      },
      "finance": {
        "th": "การเงินมั่นคง มีเงินเพียงพอสำหรับจัดงานเลี้ยง ฉลอง หรือซื้ออสังหาริมทรัพย์และตกแต่งบ้าน",
        "en": "Financial stability enabling domestic investments, property upgrades, and celebratory festivities."
      },
      "health": {
        "th": "สุขภาพแข็งแรงทั้งกายและใจ การฟื้นตัวจากอาการป่วยอย่างสมบูรณ์ อารมณ์แจ่มใสเบิกบาน",
        "en": "Radiant well-being, peaceful recovery, and a nourishing living environment promoting vitality."
      },
      "advice": {
        "th": "ชื่นชมกับความสำเร็จและแบ่งปันความสุขร่วมกับคนที่คุณรัก เติมพลังบวกให้ชีวิตอย่างเต็มที่",
        "en": "Pause and savor your achievements. Honor your community, your home, and the sanctuary you have created."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "บรรยากาศตึงเครียดในบ้าน",
          "งานฉลองสะดุด",
          "ความไม่ลงรอยของคนใกล้ชิด",
          "ความไม่สงบใจ",
          "ขาดความอบอุ่น"
        ],
        "en": [
          "Domestic Tension",
          "Postponed Event",
          "Family Discord",
          "Unstable Home",
          "Friction"
        ]
      },
      "general": {
        "th": "ความขัดแย้งเล็กๆ น้อยๆ ภายในครอบครัวหรือกลุ่มเพื่อนร่วมงาน งานเฉลิมฉลองอาจมีเรื่องสะดุดหรือไม่ราบรื่น",
        "en": "Mild domestic discord, postponed celebrations, or feeling out of place within family and social circles."
      },
      "love": {
        "th": "เรื่องในบ้านหรือญาติผู้ใหญ่สร้างแรงกดดันให้คู่รัก หรือมีความเห็นไม่ตรงกันเกี่ยวกับการจัดงานหรือการอยู่อาศัย",
        "en": "Family interference, differing ideas on living arrangements, or wedding planning stress testing the union."
      },
      "career": {
        "th": "ทีมงานมีความตึงเครียด การฉลองปิดโปรเจกต์อาจไม่สนุกเท่าที่ควรเพราะมีปัญหาตกค้าง",
        "en": "Tense workplace atmosphere, disagreements over shared credits, or underwhelming team celebrations."
      },
      "finance": {
        "th": "ค่าใช้จ่ายเรื่องบ้านหรือการจัดงานบานปลายเกินงบประมาณ ระวังรายจ่ายจุกจิกภายในครอบครัว",
        "en": "Overspending on parties, renovations, or unexpected home maintenance expenses causing friction."
      },
      "health": {
        "th": "ความเครียดจากคนในครอบครัวส่งผลต่อสุขภาพจิต ควรหาพื้นที่สงบส่วนตัวเพื่อพักผ่อน",
        "en": "Emotional fatigue from household demands; prioritize quiet personal space for recuperation."
      },
      "advice": {
        "th": "สื่อสารด้วยความเข้าอกเข้าใจและประนีประนอม บ้านที่แท้จริงคือความสงบในจิตใจของคุณเอง",
        "en": "Cultivate inner peace rather than obsessing over external perfection. Address domestic grievances with gentle patience."
      }
    }
  },
  "wands_5": {
    "upright": {
      "keywords": {
        "th": [
          "การแข่งขัน",
          "ความขัดแย้งทางความคิด",
          "การระดมสมอง",
          "การช่วงชิงจังหวะ",
          "ความวุ่นวายสร้างสรรค์"
        ],
        "en": [
          "Competition",
          "Conflict",
          "Rivalry",
          "Brainstorming",
          "Ego Clashes"
        ]
      },
      "general": {
        "th": "สถานการณ์ที่มีการแข่งขันสูง ความคิดเห็นไม่ลงรอย ทุกคนต่างพยายามแสดงความสามารถ อาจมีความวุ่นวายแต่ช่วยผลักดันให้เกิดการพัฒนา",
        "en": "A fiery arena of friendly rivalry, conflicting perspectives, and spirited debate. Challenging, but sharpening your skills."
      },
      "love": {
        "th": "มีคู่แข่งเข้ามาจีบคนที่เราชอบ หรือคู่รักมีเรื่องขัดแย้งเถียงกันเรื่องไม่เป็นเรื่องเพราะต่างฝ่ายต่างมีอีโก้",
        "en": "Rival suitors vying for attention, or petty spats within the couple driven by stubborn egos and competing desires."
      },
      "career": {
        "th": "การแข่งขันดุเดือดในที่ทำงาน การนำเสนอไอเดียที่ต้องฟาดฟันเพื่อแย่งชิงความโดดเด่นและการยอมรับ",
        "en": "Heated workplace competition, dynamic brainstorming sessions, and fighting to make your voice heard."
      },
      "finance": {
        "th": "การเงินมีการแข่งขันสูง แย่งชิงยอดขายหรือส่วนแบ่งตลาด ระวังการใช้จ่ายเพื่อประชันหน้าตาทางสังคม",
        "en": "Market friction and aggressive bidding; avoid vanity spending just to compete with peers."
      },
      "health": {
        "th": "ความตึงเครียด ปวดเมื่อยกล้ามเนื้อจากการออกกำลังกายหนัก หรืออาการร้อนในจากความเครียดสะสม",
        "en": "Muscle soreness, sports injuries, or elevated stress levels from constant competition."
      },
      "advice": {
        "th": "มีสติในทุกการปะทะ เปลี่ยนความขัดแย้งให้เป็นการเรียนรู้ อย่าให้อีโก้บังตาจนลืมเป้าหมายหลัก",
        "en": "Channel competitive fire into sharpening your edge. Rise above petty squabbles with sportsmanship and focus."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ยุติข้อขัดแย้ง",
          "การประนีประนอม",
          "หลีกเลี่ยงการปะทะ",
          "ความเหนื่อยหน่ายจากการต่อสู้",
          "ความปรองดอง"
        ],
        "en": [
          "Harmony",
          "End of Conflict",
          "Compromise",
          "Avoiding Drama",
          "Truce"
        ]
      },
      "general": {
        "th": "ความขัดแย้งเริ่มคลี่คลาย ทุกคนพร้อมหันหน้ามาเจรจาประนีประนอม หรือเป็นการถอยห่างออกมาจากเรื่องวุ่นวายไร้สาระ",
        "en": "Dissipating conflicts, negotiated truces, and relief from exhausting competition. Stepping back from drama."
      },
      "love": {
        "th": "คู่รักปรับความเข้าใจกันได้ ยุติการทะเลาะเบาะแว้ง คนโสดเลือกที่จะไม่ยุ่งเกี่ยวกับความสัมพันธ์ที่ซับซ้อน",
        "en": "Putting down the gloves to restore peace; singles walk away from love triangles to honor their peace of mind."
      },
      "career": {
        "th": "ข้อพิพาทในที่ทำงานได้รับการแก้ไข บรรยากาศการทำงานร่วมกันราบรื่นขึ้น มีการประนีประนอมเพื่อเป้าหมายรวม",
        "en": "Constructive resolutions to workplace rivalries; team members align and pool strengths toward shared targets."
      },
      "finance": {
        "th": "ปัญหาข้อพิพาทเรื่องเงินทองคลี่คลาย การเจรจาต่อรองหนี้สินหรือสัญญาเป็นผลสำเร็จ",
        "en": "Settlement of disputed financial matters; calmer budgetary conditions."
      },
      "health": {
        "th": "ร่างกายเริ่มฟื้นฟูหลังจากผ่านพ้นช่วงตึงเครียด อาการปวดเมื่อยบรรเทาลง",
        "en": "Tension headaches and adrenaline fatigue subsiding as relaxation returns."
      },
      "advice": {
        "th": "เลือกความสงบในใจมากกว่าการเอาชนะ การประนีประนอมอย่างชาญฉลาดคือชัยชนะที่แท้จริง",
        "en": "Choose peace over being right. Harmony allows energy to be directed into genuine accomplishment."
      }
    }
  },
  "wands_6": {
    "upright": {
      "keywords": {
        "th": [
          "ชัยชนะอันยิ่งใหญ่",
          "การยกย่องสรรเสริญ",
          "ความสำเร็จประจักษ์",
          "ชื่อเสียงเกียรติยศ",
          "ความภาคภูมิใจ"
        ],
        "en": [
          "Victory",
          "Public Acclaim",
          "Success",
          "Recognition",
          "Pride"
        ]
      },
      "general": {
        "th": "ไพ่แห่งชัยชนะอันเจิดจรัส ผลงานและความทุ่มเทของคุณได้รับการยอมรับอย่างเปิดเผย เป็นช่วงเวลาที่ได้รับเกียรติยศและเสียงปรบมือ",
        "en": "Riding in triumphant procession with the laurel wreath. Public acclaim, acknowledged leadership, and hard-earned victory."
      },
      "love": {
        "th": "ความรักสดใส เป็นคู่รักที่ใครๆ ก็น่าอิจฉาและชื่นชม คนโสดมีเสน่ห์โดดเด่นสะดุดตา เป็นที่หมายปองของหลายคน",
        "en": "Mutual pride and celebrated love; singles radiate magnetic self-confidence that attracts high-caliber suitors effortlessly."
      },
      "career": {
        "th": "ประสบความสำเร็จอย่างสูงในหน้าที่การงาน ได้รับการเลื่อนขั้น ปิดดีลใหญ่ หรือได้รับรางวัลเกียรติยศในสายอาชีพ",
        "en": "Triumphant career milestones: promotions, industry awards, smashing targets, and inspiring public respect."
      },
      "finance": {
        "th": "การเงินงอกงาม ได้รับโบนัส ผลกำไร หรือค่าตอบแทนที่สมน้ำสมเนื้อกับความทุ่มเท",
        "en": "Financial rewards reflecting your victory; lucrative bonuses, profitable contract closures, and wealth appreciation."
      },
      "health": {
        "th": "สุขภาพแข็งแรง มีพลังบวกเต็มเปี่ยม ร่างกายตอบสนองดีต่อการฟื้นฟูและการออกกำลังกาย",
        "en": "Peak physical condition, high morale, and radiant vitality powering daily triumphs."
      },
      "advice": {
        "th": "ภาคภูมิใจในความสำเร็จของคุณ แต่อย่าหลงระเริงไปกับคำสรรเสริญ จงก้าวต่อไปด้วยความอ่อนน้อมถ่อมตน",
        "en": "Celebrate your victory with grace. Humility keeps the crown firmly and honorably on your head."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ล้มเหลวในการได้รับการยอมรับ",
          "ชื่อเสียงมัวหมอง",
          "ความหยิ่งยโส",
          "ชัยชนะที่ถูกขโมย",
          "ความผิดหวังในผลลัพธ์"
        ],
        "en": [
          "Fall from Grace",
          "Lack of Recognition",
          "Ego Tripping",
          "Disappointment",
          "Shame"
        ]
      },
      "general": {
        "th": "ผลงานอาจไม่ได้รับคำชมอย่างที่คาดหวัง หรือความมั่นใจที่มากเกินไปจนกลายเป็นความหยิ่งยโสทำให้คนรอบข้างเริ่มถอยห่าง",
        "en": "Stolen thunder, overlooked accomplishments, or vanity sparking resentment from peers."
      },
      "love": {
        "th": "ความรักมีปัญหาเรื่องการรักษาหน้า หรือฝ่ายใดฝ่ายหนึ่งชอบโอ้อวดจนทำให้อีกฝ่ายอึดอัด",
        "en": "Superficial showmanship masking romantic insecurity, or feeling unappreciated by your partner."
      },
      "career": {
        "th": "โครงการที่คิดว่าจะสำเร็จกลับมีจุดบกพร่อง ไม่ได้รับการเลื่อนขั้น หรือเครดิตถูกผู้อื่นแย่งชิงไป",
        "en": "Denied promotion, delayed recognition, or taking public heat for an unexpected blunder."
      },
      "finance": {
        "th": "รายได้ไม่เข้าเป้าตามที่ประเมินไว้ หรือมีรายจ่ายฟุ่มเฟือยเพื่อรักษาภาพลักษณ์ภายนอก",
        "en": "Financial shortfall against expectations; reckless vanity spending draining cash reserves."
      },
      "health": {
        "th": "ความเครียดจากความกดดันเรื่องภาพลักษณ์ หรืออาการบาดเจ็บจากการพยายามโชว์ความสามารถเกินตัว",
        "en": "Exhaustion from keeping up appearances; nervous anxiety about public reputation."
      },
      "advice": {
        "th": "คุณค่าของคุณไม่ได้ขึ้นอยู่กับเสียงปรบมือของคนอื่น ทบทวนข้อผิดพลาดและปรับปรุงอย่างจริงใจ",
        "en": "Rebuild quietly from within. True self-worth does not require the applause of the crowd."
      }
    }
  },
  "wands_7": {
    "upright": {
      "keywords": {
        "th": [
          "การยืนหยัดสู้",
          "การปกป้องจุดยืน",
          "ความอดทนไม่ยอมแพ้",
          "การรักษาตำแหน่ง",
          "ความกล้าหาญฝ่าอุปสรรค"
        ],
        "en": [
          "Standing Ground",
          "Perseverance",
          "Defending Position",
          "Courage",
          "Overcoming Odds"
        ]
      },
      "general": {
        "th": "คุณกำลังยืนอยู่บนจุดที่ได้เปรียบแม้จะมีแรงกดดันรอบด้าน จงยืนหยัดในหลักการและความถูกต้อง อย่าหวั่นไหวต่อแรงต้าน",
        "en": "Holding the high ground against overwhelming odds. Unyielding resolve, courageous integrity, and defending your territory."
      },
      "love": {
        "th": "ต้องต่อสู้เพื่อความรัก อาจมีผู้ใหญ่หรือคนรอบข้างไม่เห็นด้วย แต่ถ้าจับมือกันแน่นจะผ่านไปได้ คนโสดต้องปกป้องหัวใจตัวเอง",
        "en": "Fighting for love against external disapproval; singles establish strong healthy boundaries and refuse to settle."
      },
      "career": {
        "th": "ต้องรับมือกับความกดดันสูงในที่ทำงาน การปกป้องไอเดียหรือผลงานจากการถูกคุกคาม แต่คุณจะสามารถรักษาเก้าอี้ไว้ได้",
        "en": "Standing firm in negotiations, defending your turf against aggressive competition, and holding your ground brilliantly."
      },
      "finance": {
        "th": "ต้องควบคุมการเงินอย่างเข้มงวด ปกป้องทรัพย์สินจากผู้ที่จ้องจะเอาเปรียบหรือการถูกเรียกร้องผลประโยชน์",
        "en": "Protecting financial assets and resisting predatory demands or unfair financial pressures."
      },
      "health": {
        "th": "ระบบภูมิคุ้มกันต้องทำงานหนัก ระวังอาการอ่อนเพลียจากการต่อสู้กับแรงกดดัน ควรเสริมวิตามินและพักผ่อน",
        "en": "Adrenal strain from standing vigilant; support immune defenses and maintain emotional resilience."
      },
      "advice": {
        "th": "จงเชื่อมั่นในจุดยืนที่ถูกต้องของคุณ อย่าถอยแม้ก้าวเดียวเมื่อรู้ว่าตนเองกำลังทำในสิ่งที่ถูกต้อง",
        "en": "Hold your ground fearlessly. Your vantage point is stronger than the noise beneath you."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ยอมจำนน",
          "เหนื่อยล้าจนต้านไม่ไหว",
          "ถูกโจมตีรอบด้าน",
          "สูญเสียจุดยืน",
          "ความท้อแท้"
        ],
        "en": [
          "Giving Up",
          "Overwhelmed",
          "Surrender",
          "Defeat",
          "Vulnerability"
        ]
      },
      "general": {
        "th": "รู้สึกว่าแรงกดดันมีมากเกินไปจนรับไม่ไหว สูญเสียความมั่นใจ หรือยอมสละจุดยืนเพราะความเหนื่อยล้า",
        "en": "Feeling overwhelmed by constant onslaughts; defensive walls crumbling under sustained fatigue."
      },
      "love": {
        "th": "ความสัมพันธ์เหนื่อยล้า ท้อแท้ที่จะต้องสู้กับอุปสรรคหรือความไม่เข้าใจจนอยากยอมแพ้",
        "en": "Exhausted from fighting external obstacles; despair threatening to derail the partnership."
      },
      "career": {
        "th": "ถูกกดดันให้ยอมรับข้อตกลงที่ไม่เป็นธรรม หรือรู้สึกว่าสู้แรงเสียดทานในที่ทำงานไม่ไหว",
        "en": "Buckling under workplace demands, conceding advantageous positions, or yielding to toxic politics."
      },
      "finance": {
        "th": "ไม่สามารถรักษาทรัพย์สินไว้ได้ หรือถูกบีบให้ต้องจ่ายเงินในสิ่งที่ไม่ต้องการจ่าย",
        "en": "Financial concessions, inability to hold financial boundaries, or yielding under debt pressure."
      },
      "health": {
        "th": "ร่างกายหมดสภาพ ภูมิคุ้มกันตก ป่วยง่ายเพราะความเครียดเรื้อรังที่ไม่ได้ผ่อนคลาย",
        "en": "Burnout, chronic fatigue syndrome, and physical vulnerability from relentless defense mode."
      },
      "advice": {
        "th": "หากสู้ต่อไปไม่ไหว การถอยออกมาตั้งหลักไม่ใช่ความพ่ายแพ้ จงรักษาพลังงานเพื่อวันข้างหน้า",
        "en": "Recognize when to retreat and regroup. Preserving your sanity is far wiser than martyrdom."
      }
    }
  },
  "wands_8": {
    "upright": {
      "keywords": {
        "th": [
          "ความรวดเร็ว",
          "ข่าวสารด่วน",
          "การเดินทางไกล",
          "ความคืบหน้าฉับไว",
          "คลื่นพลังงานพุ่งทะยาน"
        ],
        "en": [
          "Speed",
          "Rapid Action",
          "Swift Movement",
          "Incoming News",
          "Travel"
        ]
      },
      "general": {
        "th": "สิ่งต่างๆ กำลังเคลื่อนที่ไปข้างหน้าด้วยความเร็วสูงมาก อุปสรรคสลายตัว ข่าวสารและการเปลี่ยนแปลงดีๆ กำลังพุ่งตรงเข้ามาหาคุณ",
        "en": "Eight wands flying swiftly through clear skies. Accelerated progress, rapid communication, and swift breakthroughs."
      },
      "love": {
        "th": "ความสัมพันธ์พัฒนาอย่างรวดเร็ว ก้าวกระโดด คนโสดมีคนเข้ามาคุยอย่างรวดเร็ว แชตไม่เคยว่าง มีโอกาสสปาร์กติดทันที",
        "en": "Rapidly escalating romance, spontaneous trips, and exciting romantic messages arriving without delay."
      },
      "career": {
        "th": "งานเดินหน้าอย่างรวดเร็ว โปรเจกต์ได้รับการอนุมัติฉับไว การเดินทางเพื่อติดต่องาน การสื่อสารไร้รอยต่อ",
        "en": "Fast-paced progress, instant approvals, sudden travel opportunities, and high-velocity workflow."
      },
      "finance": {
        "th": "เงินหมุนเวียนเร็วมาก มีรายได้เข้ามาจากหลายทางอย่างรวดเร็ว การตัดสินใจทางการเงินต้องรวดเร็วและแม่นยำ",
        "en": "Fast cash flows, rapid transactions, and quick returns on timely financial decisions."
      },
      "health": {
        "th": "กระปรี้กระเปร่า พลังงานขับเคลื่อนสูง แต่ระวังความรีบร้อนทำให้เกิดอุบัติเหตุเล็กๆ น้อยๆ เช่น หกล้ม",
        "en": "High kinetic energy; beware of minor mishaps born of rushing or frantic multitasking."
      },
      "advice": {
        "th": "จงเตรียมตัวให้พร้อมและคว้าโอกาสที่พุ่งเข้ามาทันที ในจังหวะนี้ความเร็วและความเด็ดขาดคือหัวใจสำคัญ",
        "en": "Ride the momentum. Align your arrows of intent and strike swiftly while skies are clear."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความล่าช้า",
          "ข่าวสารคลาดเคลื่อน",
          "ความสับสนวุ่นวาย",
          "การลงมืออย่างหุนหันพลันแล่น",
          "พลังงานกระจาย"
        ],
        "en": [
          "Delays",
          "Miscommunication",
          "Haste",
          "Panic",
          "Frustration"
        ]
      },
      "general": {
        "th": "ความเร่งรีบจนเกิดความผิดพลาด ข่าวสารล่าช้าหรือตกหล่น แผนการเดินทางสะดุดเพราะการจัดการที่ไม่รัดกุม",
        "en": "Arrows scattered in the wind: misdirected speed, communication delays, or panic-induced errors."
      },
      "love": {
        "th": "ความสัมพันธ์ติดขัดเรื่องการสื่อสาร เข้าใจผิดเพราะความใจร้อน หรือการรุกจีบที่เร็วเกินไปจนอีกฝ่ายตกใจ",
        "en": "Impulsive texts causing misunderstandings, or rushing intimacy before emotional rapport is established."
      },
      "career": {
        "th": "งานสะดุดเพราะการสื่อสารผิดพลาด ข้อมูลตกหล่น หรือส่งงานล่าช้ากว่ากำหนดเพราะความเร่งรีบจนงานเสีย",
        "en": "Project bottlenecks, missed deadlines, botched dispatches, or chaotic work pace breeding errors."
      },
      "finance": {
        "th": "การใช้จ่ายเงินอย่างวู่วาม ตัดสินใจทางการเงินเร็วเกินไปจนเสียรู้ หรือเงินสะดุดเพราะความล่าช้าของระบบ",
        "en": "Impulsive online shopping, botched wire transfers, or financial delays causing cash crunches."
      },
      "health": {
        "th": "อาการตื่นตระหนก หัวใจเต้นเร็ว นอนไม่หลับ หรืออาการเหนื่อยหอบจากความรีบร้อนตลอดเวลา",
        "en": "Nervous restlessness, adrenaline spikes, and fatigue from rushing around chaotically."
      },
      "advice": {
        "th": "ชะลอความเร็วลงและตรวจสอบรายละเอียดอย่างมีสติ ความเร็วที่ไร้ทิศทางมีแต่จะพาไปสู่ความเสียหาย",
        "en": "Slow down and breathe. Precision matters far more than blind, chaotic speed."
      }
    }
  },
  "wands_9": {
    "upright": {
      "keywords": {
        "th": [
          "ความทรหดอดทน",
          "การตั้งรับรอบคอบ",
          "นักรบผู้มีบาดแผล",
          "ความมุ่งมั่นใกล้เส้นชัย",
          "ความระแวดระวัง"
        ],
        "en": [
          "Resilience",
          "Grit",
          "Guardedness",
          "Near the Finish Line",
          "Perseverance"
        ]
      },
      "general": {
        "th": "แม้จะมีบาดแผลและความเหนื่อยล้าจากการต่อสู้ที่ผ่านมา แต่คุณยังคงยืนหยัดอย่างกล้าหาญ อีกเพียงก้าวเดียวจะถึงเส้นชัยแล้ว",
        "en": "The wounded warrior standing vigilant at the final palisade. Battled-tested resilience and unyielding courage near the finish line."
      },
      "love": {
        "th": "มีความระแวดระวังในความรักเนื่องจากเคยเจ็บปวดในอดีต แต่ความรักครั้งนี้ต้องการความอดทนและการเปิดใจอีกนิด",
        "en": "Past heartbreak creates defensive walls; learning to trust again while practicing mindful boundary protection."
      },
      "career": {
        "th": "งานหนักหน่วงและใกล้ถึงบทสรุป ต้องใช้ความอดทนเฮือกสุดท้ายในการฝ่าฟันปัญหา อย่าเพิ่งถอดใจตอนนี้",
        "en": "Final stretch of an exhausting challenge; summon your deep reserves to push the project across the line."
      },
      "finance": {
        "th": "การเงินต้องรัดเข็มขัดและเฝ้าระวังอย่างเข้มงวด มีภาระค่าใช้จ่ายที่ต้องแบกรับแต่คุณจะผ่านพ้นไปได้อย่างแน่นอน",
        "en": "Vigilant budget defense; managing financial fatigue while guarding against unexpected expenses."
      },
      "health": {
        "th": "เหนื่อยล้าสะสม มีรอยฟกช้ำหรือปวดเมื่อยตามร่างกายจากการทำงานหนัก ต้องการเวลาพักฟื้นแต่จิตใจยังเข้มแข็ง",
        "en": "Physical fatigue and lingering battle scars; prioritize restorative sleep to replenish depleted vigor."
      },
      "advice": {
        "th": "อย่าเพิ่งยอมแพ้ในจังหวะสุดท้าย ความเข้มแข็งที่คุณสั่งสมมาจะนำพาคุณข้ามผ่านจุดนี้ไปสู่ชัยชนะ",
        "en": "You are far stronger than your exhaustion. Stand tall for this final push—deliverance is near."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "หมดพลังต้านทาน",
          "ความหวาดระแวงเกินเหตุ",
          "ถอดใจยอมแพ้",
          "ความดื้อรั้น",
          "กำแพงสูงเกินไป"
        ],
        "en": [
          "Exhaustion",
          "Paranoia",
          "Giving Up",
          "Defensive Walls",
          "Stubborn Refusal"
        ]
      },
      "general": {
        "th": "เหนื่อยล้าจนแทบหมดแรงใจที่จะสู้ต่อ ความหวาดระแวงทำให้มองทุกคนเป็นศัตรู หรือการปิดกั้นตัวเองจนไม่ได้รับความช่วยเหลือ",
        "en": "Extreme burnout, hyper-vigilance turning into paranoia, or stubbornly refusing needed help."
      },
      "love": {
        "th": "ความหวาดระแวงทำให้คนรักอึดอัด กลัวการถูกหักหลังจนไม่ยอมเปิดใจ หรือหมดความอดทนกับความสัมพันธ์",
        "en": "Paranoid accusations suffocating the relationship, or chronic emotional fatigue leading to surrender."
      },
      "career": {
        "th": "ถอดใจทิ้งงานกลางคันเพราะความเหนื่อยล้า หรือการไม่ยอมรับความช่วยเหลือจากเพื่อนร่วมงานทำให้งานคั่งค้าง",
        "en": "Dropping the baton at the finish line, refusing helpful reinforcements, or succumbing to burnout."
      },
      "finance": {
        "th": "การเงินตึงมือจนรับไม่ไหว เริ่มท้อแท้กับการจัดการหนี้สิน ควรปรึกษาผู้เชี่ยวชาญทางการเงิน",
        "en": "Feeling overwhelmed by persistent financial burdens; desperate need for debt restructuring or assistance."
      },
      "health": {
        "th": "ร่างกายทรุดโทรมจากการโหมงานหนัก ภูมิคุ้มกันตกต่ำอย่างรุนแรง จำเป็นต้องหยุดพักทันที",
        "en": "Immune breakdown, chronic fatigue syndrome, and utter exhaustion demanding immediate rest."
      },
      "advice": {
        "th": "ลดกำแพงในใจลงบ้างและยอมรับความช่วยเหลือจากผู้อื่น คุณไม่จำเป็นต้องแบกรับทุกอย่างไว้คนเดียว",
        "en": "Lower your defensive shield and accept offered hands. Solitary stubbornness is not strength."
      }
    }
  },
  "wands_10": {
    "upright": {
      "keywords": {
        "th": [
          "ภาระหนักอึ้ง",
          "ความรับผิดชอบล้นมือ",
          "การโหมงานหนัก",
          "ความเหนื่อยล้าแสนสาหัส",
          "ใกล้ถึงจุดหมาย"
        ],
        "en": [
          "Heavy Burden",
          "Overloaded",
          "Exhaustion",
          "Responsibility",
          "Nearing the Goal"
        ]
      },
      "general": {
        "th": "คุณกำลังแบกรับภาระและความรับผิดชอบที่หนักเกินกำลัง แม้จุดหมายปลายทางจะอยู่ข้างหน้า แต่ถึงเวลาต้องจัดสรรและปล่อยวางสิ่งที่ไม่จำเป็น",
        "en": "Carrying a heavy bundle of ten wands toward the distant town. Overwhelmed by excessive duties, yet near the finish."
      },
      "love": {
        "th": "ความสัมพันธ์รู้สึกเหนื่อยเหมือนต้องพยายามอยู่ฝ่ายเดียว มีภาระครอบครัวหรือเรื่องส่วนตัวเข้ามาบั่นทอนความโรแมนติก",
        "en": "Carrying the full weight of the relationship alone; domestic and external stress smothering romantic joy."
      },
      "career": {
        "th": "งานล้นมือ แบกรับหน้าที่ของคนอื่นไว้จนทำงานไม่ทัน โหมงานจนแทบไม่มีเวลาหายใจ แต่ผลงานจะสำเร็จในที่สุด",
        "en": "Crushing workload, taking on far too many obligations, and working overtime to meet strenuous demands."
      },
      "finance": {
        "th": "ภาระหนี้สินหรือค่าใช้จ่ายรอบตัวรัดตัว ต้องแบกรับค่าใช้จ่ายของหลายคนในครอบครัว แต่มีวินัยพอจะประคองได้",
        "en": "Heavy financial responsibilities, supporting dependents, or feeling weighed down by debt obligations."
      },
      "health": {
        "th": "ปวดหลัง ปวดไหล่ ออฟฟิศซินโดรมอย่างรุนแรง ร่างกายส่งสัญญาณเตือนว่าต้องการการพักผ่อนและการยืดหยุ่น",
        "en": "Severe back, neck, and shoulder strain; postural fatigue from carrying literal or figurative weight."
      },
      "advice": {
        "th": "เรียนรู้ที่จะปฏิเสธและกระจายงานให้ผู้อื่น อย่าแบกโลกทั้งใบไว้บนบ่าของคุณเพียงลำพัง",
        "en": "Learn to delegate and drop unnecessary sticks. You do not have to prove your worth through suffering."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การปล่อยวางภาระ",
          "การกระจายงาน",
          "ความโล่งอก",
          "การปลดแอกตัวเอง",
          "การหมดไฟสิ้นเชิง"
        ],
        "en": [
          "Relief",
          "Dropping the Burden",
          "Delegating",
          "Burnout Collapse",
          "Letting Go"
        ]
      },
      "general": {
        "th": "ถึงเวลาทิ้งสิ่งที่ไม่จำเป็นลงเพื่อปลดปล่อยตัวเอง หรือหากไม่ยอมปล่อย ร่างกายและจิตใจอาจพังทลายลงจากความเครียด",
        "en": "Dropping the crushing load and breathing free at last, or collapsing completely from sheer refusal to set boundaries."
      },
      "love": {
        "th": "ตัดสินใจปล่อยวางความสัมพันธ์ที่เป็นภาระ หรือหันมาเปิดใจคุยกันเพื่อแบ่งเบาภาระในชีวิตคู่",
        "en": "Relinquishing one-sided emotional labor, breaking free of toxic dynamics, or sharing household duties equitably."
      },
      "career": {
        "th": "ปฏิเสธงานส่วนเกิน กระจายงานให้ทีมทำ ลาพักร้อนเพื่อฟื้นฟูสภาพจิตใจจากการหมดไฟ",
        "en": "Learning to say no, successfully delegating tasks, or walking away from exploitative overwork."
      },
      "finance": {
        "th": "ปลดหนี้ก้อนโตสำเร็จ หรือขายทรัพย์สินที่ไม่จำเป็นเพื่อลดภาระค่าใช้จ่ายและดอกเบี้ย",
        "en": "Clearing substantial liabilities, liquidating burdensome overhead, and restoring financial freedom."
      },
      "health": {
        "th": "อาการปวดเมื่อยเริ่มทุเลาลงหลังจากได้พักผ่อนอย่างเต็มที่ สุขภาพจิตกลับมาแจ่มใส",
        "en": "Spinal decompression, muscle relaxation, and mental rejuvenation after relinquishing heavy stress."
      },
      "advice": {
        "th": "จงกล้าที่จะวางภาระลง การปล่อยวางไม่ได้แปลว่าคุณล้มเหลว แต่มันคือการถนอมชีวิตไว้เพื่อสิ่งสำคัญจริงๆ",
        "en": "Release what does not serve your soul. Lightness of being is the ultimate form of wisdom."
      }
    }
  },
  "wands_11": {
    "upright": {
      "keywords": {
        "th": [
          "ผู้ส่งสารแห่งไฟ",
          "ความกระตือรือร้น",
          "การค้นพบความชอบ",
          "ความคิดสร้างสรรค์วัยเยาว์",
          "ข่าวดีเรื่องงาน"
        ],
        "en": [
          "Enthusiastic Messenger",
          "Creative Spark",
          "Curiosity",
          "Bold Exploration",
          "Good News"
        ]
      },
      "general": {
        "th": "เด็กหนุ่มผู้เปี่ยมด้วยความฝันและไฟสร้างสรรค์ คุณกำลังได้รับข่าวสารที่น่าตื่นเต้น หรือค้นพบสิ่งที่ทำให้หัวใจพองโตพร้อมจะเรียนรู้",
        "en": "The passionate youth gazing up at his budding wand. Eager curiosity, creative discoveries, and inspiring incoming news."
      },
      "love": {
        "th": "การจีบกันแบบสดใส ตื่นเต้น หยอดคำหวานชวนยิ้ม คนโสดมีคนอายุน้อยกว่าหรือมีบุคลิกร่าเริงเข้ามาสนใจ",
        "en": "Flirtatious, playful banter and youthful romantic excitement. Singles attract an adventurous admirer."
      },
      "career": {
        "th": "ได้รับโอกาสฝึกงาน เรียนรู้ทักษะใหม่ หรือมีข้อเสนอโปรเจกต์ใหม่ที่น่าตื่นเต้น ได้รับคำชมจากความกระตือรือร้น",
        "en": "Exciting entry-level openings, creative apprenticeships, or fresh pitch opportunities praised for enthusiasm."
      },
      "finance": {
        "th": "มีลู่ทางหาเงินเล็กๆ น้อยๆ จากสิ่งที่ชอบ หรือได้รับเงินรางวัลจากการประกวดความคิดสร้างสรรค์",
        "en": "Small supplementary income streams born of passion projects or hobby monetization."
      },
      "health": {
        "th": "ร่างกายสดชื่น คล่องแคล่ว มีพลังงานมาก เหมาะกับการทำกิจกรรมกลางแจ้งหรือการเต้น",
        "en": "Brisk vitality and youthful agility; high energy suited for sports and active exploration."
      },
      "advice": {
        "th": "เปิดรับสิ่งใหม่อย่างกระตือรือร้นเหมือนเด็กที่เพิ่งค้นพบโลกกว้าง ความใฝ่รู้คือเข็มทิศที่ดีที่สุดของคุณ",
        "en": "Embrace curiosity with childlike audacity. Explore uncharted hobbies and let your heart guide your learning."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความใจร้อนไร้ทิศทาง",
          "ข่าวที่น่าหงุดหงิด",
          "ทำอะไรไม่เป็นชิ้นเป็นอัน",
          "ความขี้เกียจ",
          "ขาดความอดทน"
        ],
        "en": [
          "Lack of Direction",
          "Bad News",
          "Procrastination",
          "Immaturity",
          "Impatience"
        ]
      },
      "general": {
        "th": "มีความกระตือรือร้นแต่ขาดความอดทน ทำอะไรจับจด เห่อเป็นพักๆ หรือได้รับข่าวสารที่ทำให้หงุดหงิดใจ",
        "en": "Scattered focus, starting projects without finishing them, or receiving annoying, disruptive messages."
      },
      "love": {
        "th": "ความสัมพันธ์แบบเด็กๆ อารมณ์แปรปรวน เอาแต่ใจ หรือคนที่เข้ามาคุยด้วยยังไม่มีความพร้อมและไม่จริงจัง",
        "en": "Immature tantrums, unreliable texting habits, or dealing with an emotionally flighty partner."
      },
      "career": {
        "th": "ขาดวินัยในการทำงาน ขี้เบื่อ ทำงานไม่เสร็จตามกำหนด ระวังถูกตำหนิเรื่องความไม่รอบคอบ",
        "en": "Procrastination, impatience with routine tasks, or unpolished work suffering harsh critiques."
      },
      "finance": {
        "th": "ใช้เงินตามใจชอบ หมดเงินไปกับของเล่น แฟชั่น หรือความอยากชั่วคราว ขาดการออมเงิน",
        "en": "Impulsive novelty spending; squandering petty cash on transient gadgets or fads."
      },
      "health": {
        "th": "นอนดึก พักผ่อนไม่เป็นเวลาจากการติดโซเชียลมีเดีย มีอาการอ่อนเพลียในตอนเช้า",
        "en": "Irregular sleep rhythms from late-night screen time; restlessness and lack of physical discipline."
      },
      "advice": {
        "th": "บ่มเพาะความอดทนและทำสิ่งที่เริ่มไว้ให้สำเร็จ ความตั้งใจจริงต้องมาพร้อมกับวินัยที่ต่อเนื่อง",
        "en": "Harness your scattered embers into a focused flame. Commitment transforms mere whims into mastery."
      }
    }
  },
  "wands_12": {
    "upright": {
      "keywords": {
        "th": [
          "อัศวินผู้กล้าหาญ",
          "การลุยไปข้างหน้า",
          "ความมั่นใจเต็มร้อย",
          "การเดินทางผจญภัย",
          "การกระทำอันรวดเร็ว"
        ],
        "en": [
          "Bold Action",
          "Passion",
          "Fearless Pursuit",
          "Adventure",
          "Charisma"
        ]
      },
      "general": {
        "th": "อัศวินบนหลังม้าสีส้มกำลังพุ่งทะยาน คุณมีพลังขับเคลื่อนสูงมาก พร้อมบุกตะลุยฝ่าทุกอุปสรรคเพื่อเป้าหมายอย่างไม่กลัวเกรง",
        "en": "The fiery knight charging boldly across the desert dunes. Dynamic charisma, unstoppable momentum, and fierce daring."
      },
      "love": {
        "th": "ความรักที่เร่าร้อน น่าตื่นเต้น การรุกจีบอย่างรวดเร็วและมีเสน่ห์ดึงดูดใจ คนรักพร้อมพาคุณไปผจญภัย",
        "en": "Whirlwind romance, passionate sweeps, and charismatic courtship. Thrilling, adventurous dates."
      },
      "career": {
        "th": "การทำงานเชิงรุก เดินหน้าลุยโปรเจกต์ใหญ่ด้วยความมั่นใจ ชนะใจลูกค้าด้วยความกระตือรือร้นและการลงมือทำจริง",
        "en": "Charging through ambitious career objectives; leading sales crusades, pitching boldly, and executing fast."
      },
      "finance": {
        "th": "กล้าได้กล้าเสีย การลงทุนในโอกาสที่มีการเติบโตรวดเร็ว มีเงินหมุนเวียนคล่องตัวสูง",
        "en": "Bold speculative investments yielding rapid turns; dynamic cash movements fueled by confidence."
      },
      "health": {
        "th": "กล้ามเนื้อแข็งแรง หัวใจสูบฉีดดี มีพลังงานเหลือเฟือ แต่อย่าลืมวอร์มอัพก่อนออกกำลังกายหนัก",
        "en": "High cardiovascular endurance and athletic vitality; take care to warm up thoroughly to avoid strains."
      },
      "advice": {
        "th": "ลุยไปข้างหน้าด้วยความมั่นใจ อย่าให้ความลังเลมาหยุดยั้งจังหวะแห่งการก้าวกระโดดของคุณ",
        "en": "Ride your passion forward fearlessly. When confidence and purposeful action unite, victory follows."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความใจร้อนวู่วาม",
          "ความบุ่มบ่าม",
          "ความก้าวร้าว",
          "งานสะดุดล้มกลางคัน",
          "ไฟไหม้ฟาง"
        ],
        "en": [
          "Recklessness",
          "Impulsiveness",
          "Aggression",
          "Burnout",
          "Haste"
        ]
      },
      "general": {
        "th": "ความใจร้อนเกินไปทำให้เสียเรื่อง ขาดความรอบคอบ บุ่มบ่ามจนเกิดความเสียหาย หรือมีอารมณ์ฉุนเฉียวง่าย",
        "en": "Reckless haste leading to crashes; arrogant posturing, hot-headed tempers, or sudden project cancellations."
      },
      "love": {
        "th": "คนรักใจร้อน หงุดหงิดง่าย เอาแต่อารมณ์ หรือคนที่เข้ามาจีบมาไวไปไว รักเร็วหน่ายเร็ว",
        "en": "Stormy arguments, impatient courtship, or a volatile partner who bolts the moment things get serious."
      },
      "career": {
        "th": "การตัดสินใจหุนหันพลันแล่นจนเกิดข้อผิดพลาด ทะเลาะกับเพื่อนร่วมงานเพราะความดื้อรั้นเอาแต่ใจ",
        "en": "Hot-headed office collisions, blundering into unvetted contracts, or projects derailed by arrogance."
      },
      "finance": {
        "th": "เสียเงินเพราะความใจร้อน รีบลงทุนโดยไม่ศึกษาข้อมูล หรือการพนันและการเสี่ยงโชคที่ผิดพลาด",
        "en": "Heavy losses from reckless speculative gambles, impatience with orderly compound growth."
      },
      "health": {
        "th": "ระวังอุบัติเหตุจากการขับขี่เร็ว การบาดเจ็บจากการเล่นกีฬา หรืออาการอักเสบเฉียบพลัน",
        "en": "Acute athletic injuries, road-traffic mishaps, or inflammatory conditions from over-exertion."
      },
      "advice": {
        "th": "ดึงสติและควบคุมความใจร้อนของคุณให้ได้ ความกล้าหาญที่ไร้ปัญญาคือบ่อเกิดของความพินาศ",
        "en": "Rein in your steed. Fire without control consumes the rider; temper your blazing passion with patience."
      }
    }
  },
  "wands_13": {
    "upright": {
      "keywords": {
        "th": [
          "ราชินีแห่งเสน่ห์",
          "ความมั่นใจในตนเอง",
          "ความอบอุ่นสง่างาม",
          "พลังบวกเปี่ยมล้น",
          "ความเป็นผู้นำใจดี"
        ],
        "en": [
          "Radiant Confidence",
          "Charisma",
          "Warmth",
          "Independence",
          "Vibrant Leadership"
        ]
      },
      "general": {
        "th": "ราชินีผู้สง่างามนั่งบนบัลลังก์สิงโต ดอกทานตะวันและแมวดำสื่อถึงเสน่ห์และความมั่นใจในคุณค่าของตนเอง คุณเป็นที่รักและน่านับถือ",
        "en": "The regal queen holding her sunflower with the black cat at her feet. Radiant magnetic charm, warm generosity, and majestic self-assurance."
      },
      "love": {
        "th": "ความรักที่เต็มไปด้วยความอบอุ่นและมีชีวิตชีวา คุณมีเสน่ห์ดึงดูดใจอย่างล้นเหลือ คนรักหลงใหลในความมั่นใจและความเป็นตัวของตัวเอง",
        "en": "Basking in affectionate, passionate adoration. Your sovereign confidence and vibrant warmth captivate hearts easily."
      },
      "career": {
        "th": "ความเป็นผู้นำที่โดดเด่น จัดการงานได้อย่างมีประสิทธิภาพ สร้างแรงบันดาลใจให้ลูกทีมและได้รับการสนับสนุนจากผู้ใหญ่",
        "en": "Commanding organizational leadership, motivating teams with uplifting warmth, and succeeding with natural flair."
      },
      "finance": {
        "th": "บริหารจัดการเงินได้อย่างชาญฉลาด มีรายได้มั่นคงและสามารถใช้จ่ายเพื่อสร้างความสุขให้ตนเองและคนรอบข้าง",
        "en": "Financial independence and prosperous resourcefulness; managing wealth with both style and prudence."
      },
      "health": {
        "th": "สุขภาพเปล่งปลั่ง ผิวพรรณสดใส จิตใจเบิกบาน มีพลังดึงดูดสิ่งดีๆ เข้ามาสู่ชีวิต",
        "en": "Glowing vitality, strong immune resilience, and buoyant radiant health from head to toe."
      },
      "advice": {
        "th": "จงเปล่งประกายความเป็นตัวเองออกมาอย่างภาคภูมิใจ ความมั่นใจและรอยยิ้มของคุณคือพลังเวทมนตร์ที่ยิ่งใหญ่ที่สุด",
        "en": "Own your throne with unshakeable grace. Radiate your light boldly and never shrink to fit small spaces."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความไม่มั่นใจในตนเอง",
          "ความอิจฉาริษยา",
          "การเรียกร้องความสนใจ",
          "อารมณ์ฉุนเฉียว",
          "การบงการ"
        ],
        "en": [
          "Insecurity",
          "Jealousy",
          "Demanding",
          "Temperamental",
          "Self-Doubt"
        ]
      },
      "general": {
        "th": "สูญเสียความมั่นใจในคุณค่าของตนเอง หรือมีพฤติกรรมเรียกร้องความสนใจ ขี้หงุดหงิด และมองคนอื่นในแง่ร้าย",
        "en": "Dimmed light, biting insecurity, passive-aggressive dramatics, or letting jealousy cloud inner majesty."
      },
      "love": {
        "th": "ความหึงหวงและหวาดระแวงบั่นทอนความสัมพันธ์ พยายามบงการชีวิตคนรักเพราะกลัวการสูญเสีย",
        "en": "Suffocating jealousy, theatrical confrontations, or seeking external validation to fill an inner void."
      },
      "career": {
        "th": "ใช้อารมณ์ในการตัดสินใจในที่ทำงาน มีปัญหากับลูกน้องหรือเพื่อนร่วมงานหญิงเพราะความเอาแต่ใจ",
        "en": "Tyrannical micromanagement, moody outbursts, or feeling intimidated by rising peers in the workplace."
      },
      "finance": {
        "th": "ใช้เงินช้อปปิ้งเพื่อบำบัดอารมณ์ ซื้อของฟุ่มเฟือยเพื่อเอาชนะผู้อื่นจนเงินเก็บร่อยหรอ",
        "en": "Retail therapy spiraling out of control; excessive luxury spending to keep up appearances."
      },
      "health": {
        "th": "ฮอร์โมนแปรปรวน อารมณ์สวิง ปัญหาเกี่ยวกับระบบเผาผลาญหรือต่อมไทรอยด์",
        "en": "Hormonal imbalances, emotional exhaustion, or adrenal fatigue from chronic inner turmoil."
      },
      "advice": {
        "th": "กลับมารักและเห็นคุณค่าในตัวเองโดยไม่ต้องเปรียบเทียบกับใคร แสงสว่างของคุณไม่มีใครพรากไปได้นอกจากตัวคุณเอง",
        "en": "Recenter your heart. Stop seeking crowns from external praise; true royalty begins with self-love."
      }
    }
  },
  "wands_14": {
    "upright": {
      "keywords": {
        "th": [
          "ราชาแห่งวิสัยทัศน์",
          "ผู้นำผู้ยิ่งใหญ่",
          "เกียรติยศชื่อเสียง",
          "การบริหารจัดการขั้นสูง",
          "ความสำเร็จระดับตำนาน"
        ],
        "en": [
          "Visionary Leader",
          "Mastery",
          "Inspirational Authority",
          "Entrepreneur",
          "Honor"
        ]
      },
      "general": {
        "th": "ราชาแห่งไม้เท้าผู้กุมพลังเพลิงอย่างสมบูรณ์แบบ คุณมีวิสัยทัศน์กว้างไกล อำนาจการตัดสินใจเฉียบขาด และสามารถนำพาผู้คนไปสู่ความสำเร็จที่ยิ่งใหญ่",
        "en": "The sovereign monarch of fire seated on his throne adorned with salamanders. Visionary mastery, charismatic authority, and epochal accomplishment."
      },
      "love": {
        "th": "เป็นผู้นำที่อบอุ่นและปกป้องคนรักได้ดีเยี่ยม ความสัมพันธ์มั่นคงและมีเกียรติ คนโสดจะพบคนที่มีบารมี มีความเป็นผู้ใหญ่และประสบความสำเร็จ",
        "en": "A mature, dedicated, and protective partner who inspires respect. Singles attract an accomplished, charismatic leader."
      },
      "career": {
        "th": "ตำแหน่งผู้บริหารระดับสูง การนำทัพธุรกิจสู่ความสำเร็จสูงสุด ได้รับการยกย่องในฐานะผู้นำที่มีวิสัยทัศน์และการลงมือทำที่ยอดเยี่ยม",
        "en": "Executive brilliance, founding enduring companies, spearheading triumphant transformations, and respected authority."
      },
      "finance": {
        "th": "ความมั่งคั่งที่สร้างขึ้นจากวิสัยทัศน์และความเป็นผู้นำ การลงทุนขนาดใหญ่ให้ผลกำไรมหาศาล",
        "en": "Substantial commercial wealth, visionary capital allocation, and generating enduring prosperity."
      },
      "health": {
        "th": "ร่างกายแข็งแกร่ง มีความอึดและหัวใจที่แข็งแรง จิตใจหนักแน่นไม่หวั่นไหวต่อแรงกดดัน",
        "en": "Sturdy constitution, robust cardiovascular health, and commanding physical presence."
      },
      "advice": {
        "th": "จงนำพาผู้อื่นด้วยวิสัยทัศน์และคุณธรรม ความเด็ดขาดที่เปี่ยมด้วยความเมตตาจะสร้างความสำเร็จที่ยั่งยืน",
        "en": "Lead boldly from the front. Transform grand visions into reality through decisive, principled execution."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ผู้นำเผด็จการ",
          "ความดื้อรั้น",
          "ความหยิ่งยโส",
          "การใช้อำนาจกดขี่",
          "ความล้มเหลวในการนำ"
        ],
        "en": [
          "Tyranny",
          "Arrogance",
          "Authoritarian",
          "Impatience",
          "Failed Leadership"
        ]
      },
      "general": {
        "th": "การใช้อำนาจในทางที่ผิด เอาแต่ใจ ไม่ยอมฟังความคิดเห็นของใคร หรือเป็นผู้นำที่สร้างความกดดันให้คนรอบข้างจนเกิดความขัดแย้ง",
        "en": "Autocratic bullying, hot-headed intolerance of opposition, and blind obstinacy sabotaging noble plans."
      },
      "love": {
        "th": "คนรักมีนิสัยชอบบงการ เจ้าอารมณ์ ต้องเป็นที่หนึ่งเสมอ หรือไม่ให้เกียรติอีกฝ่าย",
        "en": "Domineering behavior, emotional bullying, or demanding absolute subservience from your partner."
      },
      "career": {
        "th": "ความล้มเหลวในการบริหารงาน ลูกน้องหมดศรัทธา โครงการสะดุดเพราะการตัดสินใจแบบเผด็จการ",
        "en": "Workplace mutiny against tyrannical directives, micromanagement paralysis, or ego-driven ruinous blunders."
      },
      "finance": {
        "th": "สูญเสียเงินก้อนใหญ่เพราะความดื้อรั้นไม่ฟังคำเตือนของผู้เชี่ยวชาญ การลงทุนในโปรเจกต์ที่เกินกำลัง",
        "en": "Massive financial setbacks caused by stubborn refusal to heed expert counsel or cut losses."
      },
      "health": {
        "th": "ความดันโลหิตสูง โรคหัวใจ หรือความเครียดจากความบ้าอำนาจที่ไม่ได้ดั่งใจ",
        "en": "Hypertension, cardiovascular strain, and severe anger-induced stress reactions."
      },
      "advice": {
        "th": "เปิดใจรับฟังผู้อื่นและลดอัตตาลง ความยิ่งใหญ่ที่แท้จริงไม่ได้วัดจากอำนาจที่ใช้บังคับ แต่เกิดจากความเคารพที่ผู้คนมอบให้",
        "en": "True strength does not require tyranny. Soften your grip, listen humbly, and lead with empathy."
      }
    }
  },
  "cups_1": {
    "upright": {
      "keywords": {
        "th": [
          "ความรักล้นปรี่",
          "การตื่นรู้ทางจิตวิญญาณ",
          "ความสุขสมบูรณ์ทางใจ",
          "มิตรภาพบริสุทธิ์",
          "การเริ่มต้นแห่งความรัก"
        ],
        "en": [
          "Overflowing Love",
          "Emotional Awakening",
          "Spiritual Peace",
          "Pure Joy",
          "Compassion"
        ]
      },
      "general": {
        "th": "ถ้วยแห่งความรักอันศักดิ์สิทธิ์กำลังล้นปรี่ด้วยน้ำแห่งชีวิต หัวใจของคุณกำลังเปิดรับความรัก ความเมตตา และความสุขทางอารมณ์อย่างลึกซึ้ง",
        "en": "The sacred chalice overflowing with five streams of living water. Emotional rebirth, profound love, and spiritual grace entering your life."
      },
      "love": {
        "th": "การเริ่มต้นความรักที่แสนหวานและบริสุทธิ์ คนโสดมีเกณฑ์พบรักแท้ที่สัมผัสถึงก้นบึ้งหัวใจ คนมีคู่ความรักหวานชื่นลึกซึ้งยิ่งขึ้น",
        "en": "The purest dawn of true love and deep emotional reciprocity. Singles welcome a soul-touching connection; couples experience romantic renewal."
      },
      "career": {
        "th": "ได้ทำงานที่รักและเติมเต็มจิตวิญญาณ มีความสัมพันธ์ที่อบอุ่นกับเพื่อนร่วมงาน บรรยากาศการทำงานเต็มไปด้วยความเอื้ออาทร",
        "en": "Finding true vocation that nourishes your soul; harmonious team dynamics and empathetic collaboration."
      },
      "finance": {
        "th": "การเงินหลั่งไหลเข้ามาอย่างราบรื่น ใช้จ่ายเพื่อสร้างความสุขให้ตนเองและคนที่รักด้วยความเต็มใจ",
        "en": "Generous financial ease; abundance flowing effortlessly and joyfully shared with loved ones."
      },
      "health": {
        "th": "สุขภาพจิตผ่องใส สันติสุขในใจช่วยบำบัดร่างกายให้ฟื้นฟูอย่างน่าอัศจรรย์ ความสมดุลของของเหลวในร่างกายดีเยี่ยม",
        "en": "Deep emotional harmony fostering cellular healing, sound sleep, and radiant wellness."
      },
      "advice": {
        "th": "เปิดหัวใจของคุณให้กว้างเพื่อรับและมอบความรัก ความเมตตาคือพลังเยียวยาที่ทรงอานุภาพที่สุดในจักรวาล",
        "en": "Open your heart unconditionally. Let love flow freely without fear, for love is the master healer."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ถ้วยคว่ำ",
          "ความเสียใจ",
          "การปิดกั้นหัวใจ",
          "ความเหงาเคว้งคว้าง",
          "อารมณ์แห้งแล้ง"
        ],
        "en": [
          "Blocked Love",
          "Emotional Drain",
          "Empty Heart",
          "Repressed Feelings",
          "Sorrow"
        ]
      },
      "general": {
        "th": "ความรู้สึกเหมือนถ้วยถูกคว่ำลง อารมณ์แห้งแล้ง หรือการปิดกั้นตัวเองจากความรักเพราะความเจ็บปวดในอดีต",
        "en": "The overturned chalice: emotional drought, repressed feelings, or withholding love out of fear of heartbreak."
      },
      "love": {
        "th": "ความรักไม่สมหวัง รู้สึกว่าให้ความรักไปแต่ไม่ได้คืน หรือความไม่พร้อมที่จะเปิดใจรับใครเข้ามาใหม่",
        "en": "Unrequited affection, feeling emotionally depleted by a partner, or refusing vulnerability due to old wounds."
      },
      "career": {
        "th": "หมดใจกับงาน รู้สึกไร้ความสุขในการทำงาน บรรยากาศในที่ทำงานเย็นชาและขาดความเข้าอกเข้าใจ",
        "en": "Apathetic disconnection from your work, uninspired routines, or an emotionally toxic corporate environment."
      },
      "finance": {
        "th": "การเงินตึงมืออันเนื่องมาจากการใช้จ่ายตามอารมณ์เพื่อชดเชยความเหงา หรือเสียเงินเพราะความใจอ่อนเกินไป",
        "en": "Emotional overspending to soothe inner emptiness, or regret over financially bailing out untrustworthy associates."
      },
      "health": {
        "th": "ภาวะซึมเศร้า อารมณ์ดิ่ง ร้องไห้ง่าย หรือปัญหาเกี่ยวกับระบบน้ำเหลืองและไต",
        "en": "Emotional exhaustion, psychosomatic lethargy, fluid retention, or depressive mood dips."
      },
      "advice": {
        "th": "กลับมารักและเติมเต็มถ้วยของตนเองให้เต็มก่อน อย่าคาดหวังให้ผู้อื่นมาเติมความสุขให้คุณ",
        "en": "Nourish your own vessel first. You cannot pour love from an empty cup; practice tender self-compassion."
      }
    }
  },
  "cups_2": {
    "upright": {
      "keywords": {
        "th": [
          "คู่แท้แห่งจิตวิญญาณ",
          "ความเข้าใจลึกซึ้ง",
          "การร่วมใจเป็นหนึ่ง",
          "พันธมิตรที่จริงใจ",
          "ความรักที่เสมอภาค"
        ],
        "en": [
          "Soulmate Union",
          "Mutual Love",
          "Partnership",
          "Harmonious Bond",
          "Deep Respect"
        ]
      },
      "general": {
        "th": "ไพ่แห่งคู่แท้และการผสานพลังของคนสองคน สัญลักษณ์คาดูเซียสแห่งเฮอร์มีสยืนยันถึงความเข้าใจและการยอมรับซึ่งกันและกันอย่างสมบูรณ์",
        "en": "The sacred caduceus blessing the union of two souls exchanging golden cups. Deep mutual love, equal partnership, and spiritual affinity."
      },
      "love": {
        "th": "พบรักแท้ที่เป็นคู่แท้ (Soulmate) เข้าใจกันโดยไม่ต้องพูดมาก มีความเสมอภาคและเคารพซึ่งกันและกันอย่างลึกซึ้ง",
        "en": "A blissful soul connection based on mutual devotion, magnetic attraction, and tender emotional harmony."
      },
      "career": {
        "th": "การจับคู่ทำงานหรือพาร์ตเนอร์ธุรกิจที่ยอดเยี่ยม เสริมพลังซึ่งกันและกัน สัญญาและการเจรจาราบรื่นเป็นธรรม",
        "en": "A flawless business alliance, mutually beneficial contracts, and fruitful one-on-one collaboration."
      },
      "finance": {
        "th": "การเงินราบรื่นร่วมกัน การวางแผนงบประมาณคู่หรือการลงทุนร่วมกับคนรู้ใจให้ผลตอบแทนงดงาม",
        "en": "Balanced shared finances; joint financial ventures founded on trust and mutual prosperity."
      },
      "health": {
        "th": "สุขภาพสมดุลทั้งกายและใจ การมีคนคอยดูแลเอาใจใส่ทำให้จิตใจมีความสุข ร่างกายแข็งแรง",
        "en": "Holistic mind-body harmony supported by affectionate companionship and healthy emotional exchange."
      },
      "advice": {
        "th": "ทะนุถนอมความสัมพันธ์อันงดงามนี้ไว้ การสื่อสารด้วยความจริงใจและความเข้าใจจะทำให้รักยั่งยืน",
        "en": "Honor your sacred bond with honest vulnerability. True partnership thrives on mutual respect and shared joy."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความไม่เข้าใจกัน",
          "รอยร้าวในความสัมพันธ์",
          "การไม่ลงรอย",
          "ความสัมพันธ์ไม่สมดุล",
          "การแยกทางชั่วคราว"
        ],
        "en": [
          "Misunderstanding",
          "Breakdown of Trust",
          "Imbalance",
          "Friction",
          "Divergence"
        ]
      },
      "general": {
        "th": "เกิดความไม่ลงรอยกัน ความเข้าใจผิด หรือการที่ฝ่ายใดฝ่ายหนึ่งให้ความสำคัญมากกว่าจนเสียสมดุล",
        "en": "Friction between partners, breakdown of genuine communication, and feeling out of sync with your counterpart."
      },
      "love": {
        "th": "การทะเลาะเบาะแว้งจากความไม่เข้าใจ อีกฝ่ายไม่ให้ความสำคัญเท่าที่ควร หรือความรักเริ่มมีความไม่เท่าเทียม",
        "en": "Codependency, mismatched expectations, cooling intimacy, or arguing over neglected emotional needs."
      },
      "career": {
        "th": "พาร์ตเนอร์ธุรกิจมีความเห็นไม่ตรงกัน ข้อตกลงสัญญาเกิดปัญหา หรือความไม่ลงรอยกับเพื่อนร่วมงานคู่หู",
        "en": "Strained partnerships, contractual disputes, or broken promises sabotaging joint commercial projects."
      },
      "finance": {
        "th": "ขัดแย้งเรื่องเงินทองระหว่างคู่ครองหรือหุ้นส่วน การแบ่งผลประโยชน์ไม่ลงตัว",
        "en": "Disagreements over shared money, secret spending, or disputes regarding mutual account allocations."
      },
      "health": {
        "th": "ความเครียดจากปัญหาความสัมพันธ์ส่งผลกระทบต่อการนอนหลับและความดันโลหิต",
        "en": "Emotional heartache causing physical tension, chest tightness, or insomnia from unresolved quarrels."
      },
      "advice": {
        "th": "หันหน้ามาคุยกันด้วยความใจเย็น รับฟังมุมมองของอีกฝ่ายก่อนที่รอยร้าวเล็กๆ จะกลายเป็นรอยแยกใหญ่",
        "en": "Bridge the divide with open-hearted listening. Put down pride and seek reconciliation through empathy."
      }
    }
  },
  "cups_3": {
    "upright": {
      "keywords": {
        "th": [
          "การเฉลิมฉลองมิตรภาพ",
          "การรวมตัวอย่างยินดี",
          "ความสุขร่วมกัน",
          "กลุ่มเพื่อนที่เกื้อกูล",
          "ความสำเร็จร่วม"
        ],
        "en": [
          "Joyful Celebration",
          "Friendship",
          "Reunion",
          "Community",
          "Sisterhood"
        ]
      },
      "general": {
        "th": "หญิงสาวทั้งสามชูถ้วยเฉลิมฉลองท่ามกลางสวนแห่งความอุดมสมบูรณ์ ช่วงเวลาแห่งมิตรภาพ ความรื่นเริง และการสนับสนุนซึ่งกันและกัน",
        "en": "Three maidens raising golden chalices in a joyful dance among fruits and flowers. Festive reunions, vibrant sisterhood, and communal bliss."
      },
      "love": {
        "th": "ความรักที่สดใส การแนะนำคนรักให้เพื่อนๆ และครอบครัวรู้จักอย่างภาคภูมิใจ คนโสดมีเกณฑ์พบรักในงานสังสรรค์หรือผ่านเพื่อน",
        "en": "Joyous social romance, mingling freely; singles meet charming suitors at parties, weddings, or through mutual friends."
      },
      "career": {
        "th": "การทำงานเป็นทีมที่ประสบความสำเร็จอย่างสูง ฉลองปิดยอดขายหรือโปรเจกต์ใหญ่ มีมิตรภาพที่ดีเยี่ยมในออฟฟิศ",
        "en": "Triumphant team accomplishments, harmonious collaborative spirits, and joyful office milestone celebrations."
      },
      "finance": {
        "th": "การเงินคล่องตัว มีเงินสำหรับงานเลี้ยง งานแต่งงาน หรือการสังสรรค์กับมิตรสหายโดยไม่เดือดร้อน",
        "en": "Financial sufficiency allowing generous hospitality, entertainment, and shared celebratory treats."
      },
      "health": {
        "th": "สุขภาพดี มีความสุขทางสังคม การได้อยู่ท่ามกลางเพื่อนฝูงช่วยลดความเครียดและเสริมพลังบวก",
        "en": "High emotional vitality, laughter therapy, and the restorative health benefits of supportive social bonds."
      },
      "advice": {
        "th": "แบ่งปันรอยยิ้มและร่วมยินดีกับความสำเร็จของคนรอบข้าง พลังแห่งมิตรภาพคือของขวัญล้ำค่า",
        "en": "Gather with your tribe and celebrate life. Shared joy is multiplied, and friendship is sacred medicine."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "บุคคลที่สาม",
          "งานเลี้ยงเลิกรา",
          "การนินทาว่าร้าย",
          "มิตรภาพสั่นคลอน",
          "การสังสรรค์เกินพอดี"
        ],
        "en": [
          "Third Party Intrusion",
          "Gossip",
          "Overindulgence",
          "Social Friction",
          "Exclusion"
        ]
      },
      "general": {
        "th": "ระวังเรื่องมือที่สาม ความอิจฉาริษยาในกลุ่มเพื่อน การนินทาลับหลัง หรือการดื่มกินสังสรรค์จนเสียสุขภาพและเสียงาน",
        "en": "Gossip, superficial friendships, feeling excluded from social circles, or third-party interference complicating love."
      },
      "love": {
        "th": "ระวังบุคคลที่สามเข้ามาแทรกแซงความสัมพันธ์ หรือเพื่อนของคนรักมีอิทธิพลในทางลบต่อชีวิตคู่",
        "en": "Third-party meddling, triangular entanglements, or prioritizing party friends over domestic intimacy."
      },
      "career": {
        "th": "การแบ่งพรรคแบ่งพวกในที่ทำงาน การนินทาและใส่ร้ายที่บ่อนทำลายความสามัคคีในทีม",
        "en": "Toxic office cliquishness, backbiting, and unprofessional socializing undermining collaborative work."
      },
      "finance": {
        "th": "เสียเงินไปกับการเข้าสังคม งานเลี้ยง หรือการพนันสุรุ่ยสุร่ายจนกระทบเงินเก็บ",
        "en": "Excessive entertainment expenditures, splurging on bar tabs, and financial carelessness born of hedonism."
      },
      "health": {
        "th": "อาการเมาค้าง อ่อนเพลียจากการพักผ่อนน้อย หรือปัญหาตับและระบบย่อยอาหารจากการดื่มกินเกินตัว",
        "en": "Hangovers, sleep deprivation, alcohol-related liver strain, or burnout from a chaotic nightlife schedule."
      },
      "advice": {
        "th": "เลือกคบเพื่อนที่จริงใจและรู้จักรักษาระยะห่าง ความสุขที่แท้จริงไม่จำเป็นต้องพึ่งพาแสงสีตลอดเวลา",
        "en": "Disengage from drama and false companions. Seek depth and quiet authenticity over noisy applause."
      }
    }
  },
  "cups_4": {
    "upright": {
      "keywords": {
        "th": [
          "ความเฉยชา",
          "การมองข้ามโอกาส",
          "ความเบื่อหน่าย",
          "การถอนตัวทบทวน",
          "ความไม่พึงพอใจ"
        ],
        "en": [
          "Apathy",
          "Contemplation",
          "Missed Blessing",
          "Boredom",
          "Introspection"
        ]
      },
      "general": {
        "th": "ชายนั่งกอดอกใต้ต้นไม้ มองถ้วยทั้งสามอย่างเบื่อหน่าย โดยไม่สังเกตเห็นถ้วยทองใบที่สี่ที่ยื่นออกมาจากเมฆา เตือนให้ระวังการพลาดสิ่งดีๆ",
        "en": "Sitting under a tree with folded arms, fixated on three cups while ignoring the divine hand offering the fourth. Apathy and overlooked gifts."
      },
      "love": {
        "th": "รู้สึกเบื่อหน่ายในความสัมพันธ์ ขาดความตื่นเต้น หรือคนโสดปิดกั้นตัวเองจนมองไม่เห็นคนดีๆ ที่พยายามเข้ามาคุย",
        "en": "Romantic discontent and emotional apathy; feeling uninspired by options or taking your devoted partner for granted."
      },
      "career": {
        "th": "หมดไฟในการทำงาน รู้สึกว่างานซ้ำซากจำเจ ขาดความท้าทาย หรือมองข้ามโอกาสใหม่ที่เสนอเข้ามา",
        "en": "Professional stagnation, boredom with routine tasks, or declining promising invitations out of cynicism."
      },
      "finance": {
        "th": "การเงินนิ่งสนิท ไม่ได้เดือดร้อนแต่ก็รู้สึกไม่พอใจในสิ่งที่มี มองข้ามช่องทางการสร้างรายได้ใหม่",
        "en": "Financial complacency; feeling unenthusiastic about investments or ignoring feasible revenue ideas."
      },
      "health": {
        "th": "อาการเฉื่อยชา ขาดแรงกระตุ้นในการออกกำลังกาย หรืออาการซึมเศร้าเล็กๆ จากความเบื่อหน่ายชีวิต",
        "en": "Lethargy, low motivation, sedentary blues, and feeling emotionally stuck in a rut."
      },
      "advice": {
        "th": "เงยหน้าขึ้นมองรอบตัวและขอบคุณสิ่งที่มี โอกาสอันงดงามกำลังลอยอยู่ตรงหน้าคุณ เพียงแต่คุณต้องยอมเอื้อมมือไปรับ",
        "en": "Look up and notice the gifts surrounding you. Shake off melancholy and reach for the offered cup of grace."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การตื่นจากความเฉยชา",
          "การเปิดใจรับโอกาส",
          "แรงบันดาลใจใหม่",
          "การก้าวออกจากมุมมืด",
          "ความกระตือรือร้นฟื้นคืน"
        ],
        "en": [
          "Renewed Motivation",
          "Awakening",
          "Accepting Offers",
          "Fresh Outlook",
          "Action"
        ]
      },
      "general": {
        "th": "ตื่นจากความเบื่อหน่าย เริ่มมองเห็นคุณค่าในชีวิตและพร้อมเปิดรับโอกาสใหม่ๆ ที่เคยปฏิเสธไป",
        "en": "Snapping out of a funk, opening your eyes to new possibilities, and embracing life with renewed hunger."
      },
      "love": {
        "th": "เริ่มเปิดใจให้ความรักอีกครั้ง ก้าวออกจากความโดดเดี่ยว คนมีคู่หันมาดูแลเอาใจใส่กันเพื่อจุดไฟรักใหม่",
        "en": "Willingness to date again, accepting romantic advances, and breaking the chill in long-term relationships."
      },
      "career": {
        "th": "ไฟในการทำงานกลับมาอีกครั้ง พร้อมลุยกับโปรเจกต์ใหม่และตอบรับโอกาสที่ผู้ใหญ่มอบให้",
        "en": "Re-energized career enthusiasm, embracing proactive solutions, and saying yes to exciting projects."
      },
      "finance": {
        "th": "เริ่มมองเห็นลู่ทางการลงทุนที่สร้างผลกำไร จัดการงบประมาณด้วยทัศนคติที่เป็นบวก",
        "en": "Actively seeking profitable financial pathways and investing with fresh optimism."
      },
      "health": {
        "th": "ลุกขึ้นมาออกกำลังกายและดูแลตัวเอง สุขภาพจิตดีขึ้น มีความสดชื่นกระปรี้กระเปร่า",
        "en": "Overcoming depressive slumps, adopting healthy active habits, and revitalizing overall wellness."
      },
      "advice": {
        "th": "จงคว้าโอกาสที่ผ่านเข้ามาด้วยความกระตือรือร้น โลกนี้ยังมีสิ่งสวยงามรอให้คุณสัมผัสอีกมากมาย",
        "en": "Seize the day. The fog has lifted; step forth with an eager heart and embrace the banquet of life."
      }
    }
  },
  "cups_5": {
    "upright": {
      "keywords": {
        "th": [
          "ความเสียใจต่อสิ่งที่สูญเสีย",
          "การจมอยู่กับอดีต",
          "ความผิดหวัง",
          "ถ้วยที่คว่ำสามใบ",
          "ความเศร้าโศก"
        ],
        "en": [
          "Grief",
          "Heartbreak",
          "Regret",
          "Focus on Loss",
          "Disappointment"
        ]
      },
      "general": {
        "th": "ร่างในชุดดำก้มมองถ้วยสามใบที่คว่ำและหกรดพื้นด้วยความเศร้า โดยลืมมองว่าข้างหลังยังมีถ้วยอีกสองใบที่ยังตั้งตระหง่านอยู่",
        "en": "The cloaked figure mourning three spilled cups while turning a blind eye to the two standing upright behind him. Sorrow, grief, and regret."
      },
      "love": {
        "th": "ความผิดหวังในความรัก การเลิกราหรือการสูญเสียคนรัก จมอยู่กับความทรงจำอันเจ็บปวดในอดีต",
        "en": "Mourning past heartbreak, lingering grief over an ended relationship, or lamenting unmet emotional dreams."
      },
      "career": {
        "th": "โปรเจกต์ล้มเหลวหรือไม่เป็นไปตามเป้า เสียใจกับความผิดพลาดในอดีตจนไม่กล้าก้าวต่อไปข้างหน้า",
        "en": "Disappointment over botched deals, missed promotions, or dwelling on workplace failures."
      },
      "finance": {
        "th": "ขาดทุนจากการลงทุน เสียเงินไปกับสิ่งที่ไม่คุ้มค่า แต่ยังมีทรัพย์สินสำรองที่พอจะช่วยให้ตั้งหลักใหม่ได้",
        "en": "Financial losses, bad investments, and regret over spilled capital; preserve the remaining reserves."
      },
      "health": {
        "th": "ความเครียด ความโศกเศร้าส่งผลต่อระบบภูมิคุ้มกัน น้ำหนักลด หรือมีอาการนอนไม่หลับจากความทุกข์ใจ",
        "en": "Depressive exhaustion, weeping spells, compromised immunity, and physical toll of intense sorrow."
      },
      "advice": {
        "th": "ยอมรับความจริงและหันหลังกลับมาดูสิ่งที่คุณยังมีอยู่ อดีตผ่านไปแล้ว อนาคตยังคงรอคอยคุณอยู่",
        "en": "Honor your tears, but turn around. What was lost cannot be undone, but two precious cups remain full."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การเยียวยาจิตใจ",
          "การให้อภัยและก้าวต่อ",
          "การมองเห็นความหวัง",
          "การฟื้นตัวจากความสูญเสีย",
          "การยอมรับ"
        ],
        "en": [
          "Healing",
          "Acceptance",
          "Moving On",
          "Emotional Recovery",
          "Forgiveness"
        ]
      },
      "general": {
        "th": "เริ่มทำใจได้และก้าวข้ามผ่านความเศร้าโศก หันกลับมามองถ้วยสองใบที่เหลือและพร้อมจะข้ามสะพานไปสู่วันใหม่",
        "en": "Emotional convalescence; letting go of old regrets, accepting reality with gentle peace, and crossing the river."
      },
      "love": {
        "th": "บาดแผลในใจได้รับการเยียวยา ให้อภัยคนรักเก่าและพร้อมเปิดรับความรักครั้งใหม่ที่จะเข้ามา",
        "en": "Releasing old heartbreaks, forgiving past lovers, and restoring optimism for future romance."
      },
      "career": {
        "th": "เรียนรู้จากความล้มเหลวและเริ่มวางแผนใหม่ ความเสียหายได้รับการแก้ไขจนงานเริ่มกลับมาเดินหน้าได้",
        "en": "Bouncing back from setbacks, rebuilding professional confidence, and pursuing new opportunities."
      },
      "finance": {
        "th": "เริ่มควบคุมความเสียหายทางการเงินได้ และพบช่องทางใหม่ในการชดเชยเงินที่สูญเสียไป",
        "en": "Halting financial bleeding, learning pragmatic money management, and recovering from losses."
      },
      "health": {
        "th": "สภาพจิตใจฟื้นตัวอย่างเห็นได้ชัด เริ่มกลับมาทานอาหารและนอนหลับได้ดีขึ้น ร่างกายแข็งแรงขึ้น",
        "en": "Substantial emotional recovery, returning appetite, brighter spirits, and restored inner peace."
      },
      "advice": {
        "th": "จงให้อภัยตนเองและอดีต ปล่อยให้น้ำตาชะล้างความเจ็บปวดเพื่อเปิดทางให้แสงตะวันส่องเข้ามา",
        "en": "Forgive yourself and step across the bridge. A magnificent new horizon awaits your healed heart."
      }
    }
  },
  "cups_6": {
    "upright": {
      "keywords": {
        "th": [
          "ความทรงจำในอดีต",
          "ความไร้เดียงสา",
          "การหวนคืนของคนเก่า",
          "ความสุขในวัยเด็ก",
          "ความอบอุ่นบริสุทธิ์"
        ],
        "en": [
          "Nostalgia",
          "Childhood Innocence",
          "Past Reunion",
          "Sweet Memories",
          "Pure Kindness"
        ]
      },
      "general": {
        "th": "เด็กชายมอบถ้วยดอกไม้ให้เด็กหญิงในลานปราสาทโบราณ สื่อถึงความทรงจำที่อบอุ่น มิตรภาพอันบริสุทธิ์ หรือการกลับมาพบกันของคนในอดีต",
        "en": "Children sharing white flowers in golden chalices outside an ancient fortress. Sweet nostalgia, innocent affection, and gifts from the past."
      },
      "love": {
        "th": "คนรักเก่าติดต่อกลับมา ถ่านไฟเก่าปะทุ หรือความรักที่มีความบริสุทธิ์ใจเหมือนความรักในวัยเยาว์",
        "en": "A romantic reunion with a past flame, sweet nostalgic courtship, or innocent, unconditional affection."
      },
      "career": {
        "th": "ได้กลับไปร่วมงานกับเพื่อนร่วมงานเก่า หรือนำทักษะและความฝันในวัยเด็กมาต่อยอดในงานปัจจุบันจนประสบความสำเร็จ",
        "en": "Reconnecting with past colleagues, returning to a former company, or monetizing a childhood passion."
      },
      "finance": {
        "th": "ได้รับมรดก ของขวัญ หรือความช่วยเหลือทางการเงินจากคนในครอบครัวหรือมิตรเก่า",
        "en": "Financial gifts, family inheritances, or unexpected financial blessings from past connections."
      },
      "health": {
        "th": "สุขภาพดี มีความสุขสงบทางใจ การได้กลับไปเยี่ยมบ้านเกิดจะช่วยฟื้นฟูพลังชีวิตได้อย่างล้ำลึก",
        "en": "Gentle, balanced health; inner child healing releasing long-held physical tensions."
      },
      "advice": {
        "th": "เก็บความทรงจำที่ดีไว้เป็นพลังใจ แต่อย่าลืมนำความบริสุทธิ์ใจในอดีตมาสร้างความสุขในปัจจุบัน",
        "en": "Cherish sweet memories, but remember to live fully in the present. Nurture your inner child with kindness."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ยึดติดกับอดีต",
          "โตเป็นผู้ใหญ่",
          "การละทิ้งวัยเยาว์",
          "ก้าวข้ามวันวาน",
          "ความเพ้อฝันในอดีต"
        ],
        "en": [
          "Stuck in the Past",
          "Growing Up",
          "Moving Forward",
          "Releasing Nostalgia",
          "Maturing"
        ]
      },
      "general": {
        "th": "การยึดติดกับอดีตจนไม่ยอมเติบโต หรือถึงเวลาต้องยอมรับความเป็นจริงและก้าวออกจากเงาของวันวาน",
        "en": "Living in the rearview mirror, idealizing the past, or conversely, successfully maturing and breaking free from childhood conditioning."
      },
      "love": {
        "th": "ติดอยู่ในวังวนของคนรักเก่าจนไม่สามารถเริ่มต้นกับใครใหม่ได้ หรือตระหนักได้ว่าคนเก่าไม่เหมือนเดิมอีกต่อไป",
        "en": "Clinging to an ex who has moved on, or finally breaking nostalgic illusions to seek a mature partner."
      },
      "career": {
        "th": "วิธีการทำงานเดิมๆ ล้าสมัย ไม่ตอบโจทย์โลกปัจจุบัน ถึงเวลาต้องปรับตัวและเรียนรู้สิ่งใหม่",
        "en": "Outdated business models, clinging to obsolete practices, or outgrowing a restrictive familial firm."
      },
      "finance": {
        "th": "ปัญหาทรัพย์สินมรดกในครอบครัว หรือการพึ่งพาเงินจากครอบครัวมากเกินไปจนขาดความอิสระ",
        "en": "Family inheritance squabbles, or ending childish financial dependency to stand on your own feet."
      },
      "health": {
        "th": "โรคเก่ากำเริบ หรือบาดแผลในวัยเด็กส่งผลต่อสภาพจิตใจ ควรเข้ารับการบำบัดรักษา",
        "en": "Relapse of childhood ailments, or working through unresolved developmental trauma."
      },
      "advice": {
        "th": "อดีตคือบทเรียน ไม่ใช่ที่อยู่อาศัย จงก้าวไปข้างหน้าเพื่อสร้างอนาคตใหม่ของคุณเอง",
        "en": "Leave the nursery behind. Wisdom lies in creating new triumphs today, not re-living yesterday's glory."
      }
    }
  },
  "cups_7": {
    "upright": {
      "keywords": {
        "th": [
          "ภาพลวงตา",
          "ทางเลือกมากมาย",
          "ความเพ้อฝัน",
          "การติดกับดักความคิด",
          "ความปรารถนาซ่อนเร้น"
        ],
        "en": [
          "Illusion",
          "Choices",
          "Daydreaming",
          "Wishful Thinking",
          "Temptation"
        ]
      },
      "general": {
        "th": "ถ้วยทั้งเจ็ดยกลอยอยู่บนมวลเมฆ บรรจุทั้งเพชรนิลจินดา ปราสาท สัตว์ร้าย และเวทมนตร์ เตือนถึงภาพลวงตาและทางเลือกที่หลากหลายที่ต้องใช้สติคัดกรอง",
        "en": "Seven chalices floating in mystical clouds offering wealth, dragons, castles, and illusions. Beware of seductive daydreams and ground your choices."
      },
      "love": {
        "th": "คนคุยเยอะแต่ยังหาคนจริงใจไม่ได้ หรือสร้างภาพคนรักไว้ในฝันจนมองข้ามความจริงในชีวิตคู่",
        "en": "Infatuation with fantasy ideals, juggling too many confusing suitors, or projecting unrealistic fairy tales."
      },
      "career": {
        "th": "มีไอเดียมากมายแต่ยังไม่ลงมือทำจริง ระวังข้อเสนอที่ดูดีเกินจริง หรือโปรเจกต์ที่ยังขาดแผนงานที่เป็นรูปธรรม",
        "en": "Analysis paralysis among multiple shiny projects; beware of speculative get-rich schemes lacking substance."
      },
      "finance": {
        "th": "ระวังการถูกหลอกลงทุนด้วยภาพฝันผลตอบแทนสูง การใช้จ่ายเงินไปกับสิ่งของที่ไม่จำเป็นเพราะความหลงใหลชั่ววูบ",
        "en": "Illusions of quick wealth, crypto traps, or squandering funds on superficial temptations."
      },
      "health": {
        "th": "อาการมึนงง สมาธิสั้น นอนไม่ค่อยหลับเพราะความคิดเพ้อฝัน หรือผลข้างเคียงจากการใช้ยาหรือสารเสพติด",
        "en": "Brain fog, escapist habits, sensory overload, or neglecting real physical symptoms for wishful thinking."
      },
      "advice": {
        "th": "ดึงสติกลับมาสู่โลกแห่งความเป็นจริง เลือกสิ่งที่มีคุณค่าแท้จริงและลงมือทำให้จับต้องได้",
        "en": "Dispel the mirage with clear-eyed reality. Pick one grounded path and commit to disciplined action."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ตาสว่าง",
          "การตัดสินใจชัดเจน",
          "การหลุดพ้นจากภาพลวงตา",
          "การลงมือทำจริง",
          "การจัดลำดับความสำคัญ"
        ],
        "en": [
          "Clarity",
          "Decisiveness",
          "Reality Check",
          "Shattered Illusions",
          "Grounding"
        ]
      },
      "general": {
        "th": "หมอกควันแห่งภาพลวงตาสลายไป คุณเริ่มมองเห็นความจริงอย่างชัดเจน สามารถตัดสินใจเลือกทิศทางที่ถูกต้องได้",
        "en": "The veil of delusion lifts; waking up from romanticized fantasies to make clear, grounded, and decisive choices."
      },
      "love": {
        "th": "มองเห็นตัวตนที่แท้จริงของอีกฝ่าย เลิกหลอกตัวเองในความสัมพันธ์ และตัดสินใจก้าวต่อไป",
        "en": "Seeing a partner without rosy filters, breaking free of toxic illusions, and choosing honest, genuine love."
      },
      "career": {
        "th": "ตัดสิ่งที่ไม่จำเป็นออก โฟกัสเป้าหมายเดียวที่ทำได้จริง แผนงานมีความชัดเจนและนำไปปฏิบัติได้ทันที",
        "en": "Cutting through distraction to execute one high-impact project with sharp, practical focus."
      },
      "finance": {
        "th": "ตาสว่างจากข้อเสนอหลอกลวง จัดการการเงินบนพื้นฐานตัวเลขจริงและความเป็นไปได้",
        "en": "Dodging predatory financial schemes and organizing budgets strictly according to tangible income."
      },
      "health": {
        "th": "จิตใจแจ่มใส เลิกพฤติกรรมหนีปัญหา สุขภาพร่างกายและจิตใจกลับมาสมดุล",
        "en": "Clearing brain fog, breaking escapist dependencies, and restoring sober physical vitality."
      },
      "advice": {
        "th": "ความจริงอาจไม่สวยหรูเหมือนความฝัน แต่มันคือผืนดินที่มั่นคงที่สุดที่คุณจะใช้สร้างอนาคต",
        "en": "Embrace reality with open arms. Truth, even when plain, is the bedrock upon which genuine empires are built."
      }
    }
  },
  "cups_8": {
    "upright": {
      "keywords": {
        "th": [
          "การเดินจากไป",
          "การค้นหาความหมายลึกซึ้ง",
          "การปล่อยวางสิ่งเดิม",
          "การเดินทางของจิตวิญญาณ",
          "ความเหนื่อยหน่ายในความสำเร็จตื้นเขิน"
        ],
        "en": [
          "Walking Away",
          "Searching for Meaning",
          "Letting Go",
          "Spiritual Quest",
          "Abandoning Shallow"
        ]
      },
      "general": {
        "th": "ร่างผู้เดินทางหันหลังให้ถ้วยทั้งแปดที่วางเรียงไว้อย่างเป็นระเบียบ ก้าวเดินขึ้นสู่ภูเขาสูงภายใต้แสงจันทร์เพื่อค้นหาความหมายที่แท้จริงของชีวิต",
        "en": "Turning your back on eight neatly stacked cups to trek into the moonlit mountains. Leaving behind what no longer fulfills the soul."
      },
      "love": {
        "th": "ตัดสินใจเดินออกจากความสัมพันธ์ที่ไม่เติมเต็มจิตใจ แม้จะยังมีความผูกพันแต่รู้ว่าอยู่ต่อไปก็ไม่มีความสุข",
        "en": "Bravely walking away from a relationship that looks fine outwardly but is hollow within; seeking genuine soul depth."
      },
      "career": {
        "th": "ลาออกจากงานที่มั่นคงแต่ไร้จิตวิญญาณ เพื่อไปตามหาความฝันหรือเส้นทางอาชีพที่มีคุณค่าต่อชีวิต",
        "en": "Leaving a comfortable but uninspiring career to pursue a higher calling, deeper purpose, or creative quest."
      },
      "finance": {
        "th": "สละทรัพย์สินหรือผลประโยชน์ทางวัตถุบางส่วน เพื่อแลกกับความสงบสุขทางใจและอิสรภาพ",
        "en": "De-cluttering material attachments, simplifying lifestyle, and prioritizing peace over relentless accumulation."
      },
      "health": {
        "th": "การเดินทางไปพักผ่อนเพื่อฟื้นฟูจิตใจ การปฏิบัติธรรมหรือดีท็อกซ์เพื่อล้างความเครียดสะสม",
        "en": "Spiritual retreat, hiking in nature, and fasting or cleansing therapies to purge toxic emotional residues."
      },
      "advice": {
        "th": "กล้าที่จะเดินออกจากสิ่งที่ไม่คู่ควรกับจิตวิญญาณของคุณ การเดินทางที่แท้จริงเพิ่งเริ่มต้นขึ้น",
        "en": "Have the courage to walk away. What lies ahead in the quiet mountains is infinitely richer than hollow comfort."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความกลัวที่จะเดินจากไป",
          "การติดหล่มอยู่ในที่เดิม",
          "การวนกลับมา",
          "ความลังเล",
          "การยึดติด"
        ],
        "en": [
          "Fear of Leaving",
          "Stagnation",
          "Reluctance",
          "Returning to Old Patterns",
          "Clinging"
        ]
      },
      "general": {
        "th": "รู้ว่าสิ่งที่มีอยู่ไม่ตอบโจทย์แต่ยังไม่กล้าเดินจากไป กลัวความไม่แน่นอน หรือวนกลับไปหาสิ่งเดิมๆ ที่เคยทำร้ายใจ",
        "en": "Hesitating on the threshold, turning back out of fear of the unknown, or remaining trapped in unsatisfying situations."
      },
      "love": {
        "th": "ทนอยู่ในความสัมพันธ์ที่ไร้ความสุขเพราะความกลัวความเหงา หรือกลับไปคืนดีกับคนที่เคยทำให้เจ็บซ้ำซาก",
        "en": "Staying in a dead-end relationship out of comfort or fear of loneliness, repeating painful romantic cycles."
      },
      "career": {
        "th": "ทนทำงานที่เกลียดเพราะกลัวการตกงาน ขาดความกล้าที่จะเปลี่ยนสายงานแม้รู้ว่าหมดอนาคต",
        "en": "Enduring soul-crushing employment out of sheer inertia and terror of financial insecurity."
      },
      "finance": {
        "th": "ไม่กล้าตัดขาดทุน (Cut loss) ในการลงทุน ยึดติดกับทรัพย์สินที่เสื่อมค่าจนสูญเสียโอกาสใหม่",
        "en": "Clinging to depreciating assets out of sunk-cost fallacy; paralysis preventing needed portfolio reallocation."
      },
      "health": {
        "th": "ความเครียดสะสมจากการทนอยู่ในสภาพแวดล้อมที่เป็นพิษ ร่างกายอ่อนเพลียเรื้อรัง",
        "en": "Chronic psychosomatic fatigue from remaining in toxic, unfulfilling environments; emotional drainage."
      },
      "advice": {
        "th": "อย่าปล่อยให้ความกลัวความไม่แน่นอนมากักขังคุณไว้ในกรงทองที่ไร้ความสุข ก้าวออกมาด้วยความศรัทธา",
        "en": "Release your trembling grip on the past. The wilderness may be cold, but it leads to the dawn."
      }
    }
  },
  "cups_9": {
    "upright": {
      "keywords": {
        "th": [
          "ไพ่แห่งความสมหวัง",
          "ความสุขสมบูรณ์",
          "ความพึงพอใจสูงสุด",
          "ความอุดมสมบูรณ์",
          "ความอิ่มเอมใจ"
        ],
        "en": [
          "Wish Fulfillment",
          "Satisfaction",
          "Contentment",
          "Luxury",
          "Joy"
        ]
      },
      "general": {
        "th": "ชายผู้มีรอยยิ้มอิ่มเอมนั่งกอดอกหน้าถ้วยทองทั้งเก้าใบที่เรียงราย ไพ่ใบนี้คือไพ่ขอพร (Wish Card) บ่งบอกถึงความสมปรารถนาและความสุขสมบูรณ์",
        "en": "The prosperous figure smiling proudly before his arc of nine golden chalices. The legendary Wish Card: emotional abundance, luxury, and deep satisfaction."
      },
      "love": {
        "th": "ความรักสมหวังตามที่ปรารถนา มีความสุขและพึงพอใจในคู่ครองอย่างเต็มที่ คนโสดมีความสุขในตัวเองจนเปล่งประกาย",
        "en": "Wishes granted in romance! Emotional bliss, deep mutual pleasure, and celebrating satisfying love."
      },
      "career": {
        "th": "ผลงานสำเร็จลุล่วงด้วยดี ได้รับการยกย่องและผลตอบแทนที่น่าพึงพอใจ บรรลุเป้าหมายที่ตั้งใจไว้",
        "en": "Culmination of career ambitions; standing in proud fulfillment of your professional goals and enjoying industry respect."
      },
      "finance": {
        "th": "การเงินมั่งคั่ง มีกินมีใช้เหลือเฟือ สามารถปรนเปรอความสุขให้ตนเองได้ตามใจปรารถนา",
        "en": "Financial prosperity, comfort, and luxury; rewarding yourself generously for hard work well done."
      },
      "health": {
        "th": "สุขภาพแข็งแรง อารมณ์เบิกบาน มีความสุขกายสบายใจ แต่อาจต้องระวังเรื่องน้ำหนักขึ้นจากการกินของอร่อย",
        "en": "Radiant vitality and high spirits; watch out for mild overindulgence in gourmet food and fine wines."
      },
      "advice": {
        "th": "ชื่นชมและดื่มด่ำกับความสุขที่คุณสมควรได้รับ แต่จงแบ่งปันความอุดมสมบูรณ์นี้ให้แก่ผู้อื่นด้วย",
        "en": "Count your blessings and savor your triumph. True abundance expands even further when shared generously."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความโลภไม่รู้จักพอ",
          "ความสุขจอมปลอม",
          "การตามใจตนเองเกินควร",
          "ความผิดหวังในสิ่งที่ได้",
          "ความหลงตัวเอง"
        ],
        "en": [
          "Greed",
          "Smugness",
          "Overindulgence",
          "Unfulfilled Desires",
          "Shallow Satisfaction"
        ]
      },
      "general": {
        "th": "แม้จะได้ในสิ่งที่ต้องการแต่กลับรู้สึกว่างเปล่าในใจ หรือการตามใจกิเลสตนเองจนเกินพอดีทำให้เกิดปัญหาตามมา",
        "en": "Getting what you wished for only to find it hollow; gluttony, smug complacency, or inner dissatisfaction."
      },
      "love": {
        "th": "ความสัมพันธ์ที่เน้นแต่ความพึงพอใจทางกายแต่ขาดความผูกพันทางจิตวิญญาณ หรือการเอาแต่ใจตัวเองจนคนรักอึดอัด",
        "en": "Selfish, hedonistic dynamics; seeking physical gratification without emotional depth, or self-centered vanity."
      },
      "career": {
        "th": "หลงตัวเองกับความสำเร็จเดิมๆ จนประมาท หรือผลงานที่ได้ไม่สร้างความภูมิใจที่แท้จริง",
        "en": "Resting lazily on past laurels; arrogance leading to sloppy output or hollow professional accolades."
      },
      "finance": {
        "th": "ใช้จ่ายฟุ่มเฟือยเกินตัวเพื่ออวดความร่ำรวย หนี้สินจากการกินหรูอยู่สบายเกินฐานะ",
        "en": "Financial extravagance and vanity spending resulting in bloated bills; superficial materialism."
      },
      "health": {
        "th": "ปัญหาสุขภาพจากการกิน ดื่ม หรือเสพสุขเกินพอดี เช่น โรคอ้วน ไขมันในเลือดสูง หรือกรดไหลย้อน",
        "en": "Digestive disorders, weight gain, gout, or metabolic sluggishness from chronic overindulgence."
      },
      "advice": {
        "th": "ความสุขที่แท้จริงไม่ได้อยู่ที่การครอบครองวัตถุ แต่อยู่ที่ความสงบและความกตัญญูในหัวใจ",
        "en": "Search beneath the surface. Real joy is an internal state of peace, not a mountain of consumed pleasures."
      }
    }
  },
  "cups_10": {
    "upright": {
      "keywords": {
        "th": [
          "ครอบครัวสุขสันต์",
          "ความรักนิรันดร์",
          "สายรุ้งแห่งพร",
          "ความสุขสมบูรณ์พร้อม",
          "ความสามัคคีปรองดอง"
        ],
        "en": [
          "Family Bliss",
          "Lasting Harmony",
          "Divine Rainbow",
          "Domestic Fulfillment",
          "Everlasting Peace"
        ]
      },
      "general": {
        "th": "ครอบครัวยืนมองสายรุ้งที่ประดับด้วยถ้วยทองทั้งสิบเหนือบ้านอันแสนอบอุ่น สัญลักษณ์สูงสุดแห่งความสุข ความสงบ และความสมบูรณ์แบบในชีวิต",
        "en": "Ten golden cups arched in a radiant rainbow over a blessed family dancing outside their idyllic cottage. The pinnacle of emotional joy and domestic peace."
      },
      "love": {
        "th": "ความรักที่สมบูรณ์แบบ ได้แต่งงาน สร้างครอบครัวที่อบอุ่นและมั่นคง มีความรักที่ยืนยาวและเข้าใจกันอย่างแท้จริง",
        "en": "Soulmate bliss, fairy-tale commitment, happy marriage, and loving family bonds that stand the test of time."
      },
      "career": {
        "th": "บรรยากาศในที่ทำงานอบอุ่นเหมือนครอบครัว องค์กรมีความสุขและมั่นคง ผลงานสร้างประโยชน์ให้สังคม",
        "en": "Harmonious workplace community, ethical corporate values, and thriving collective success."
      },
      "finance": {
        "th": "ความมั่นคงทางการเงินในครอบครัว มีบ้าน ทรัพย์สิน และความปลอดภัยทางการเงินสำหรับทุกคนในบ้าน",
        "en": "Enduring family security, prosperous domestic investments, and financial peace of mind."
      },
      "health": {
        "th": "สุขภาพร่างกายและจิตใจสมบูรณ์แบบ มีพลังชีวิตที่สดชื่นและมีอายุยืนยาวด้วยความสุขในบ้าน",
        "en": "Flourishing holistic health, longevity, emotional serenity, and loving support fostering physical wellness."
      },
      "advice": {
        "th": "โอบกอดความสุขและความรักในครอบครัวไว้ด้วยความกตัญญู นี่คือพรสูงสุดที่มนุษย์จะได้รับ",
        "en": "Celebrate your blessings. The greatest wealth on earth is a home filled with genuine love, laughter, and peace."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความแตกแยกในบ้าน",
          "ปัญหาครอบครัว",
          "ภาพลวงตาแห่งความสุข",
          "ความไม่ลงรอย",
          "ความบาดหมาง"
        ],
        "en": [
          "Domestic Discord",
          "Broken Home",
          "Shattered Peace",
          "Family Feud",
          "Disillusionment"
        ]
      },
      "general": {
        "th": "ความตึงเครียดหรือความแตกแยกภายในครอบครัว ภาพลักษณ์ภายนอกที่ดูอบอุ่นแต่ภายในเต็มไปด้วยความขัดแย้ง",
        "en": "Rainbow dissolving into storm clouds; family strife, domestic friction, and shattered idyllic illusions."
      },
      "love": {
        "th": "ปัญหาครอบครัวแทรกแซงความรัก การไม่ยอมรับจากญาติผู้ใหญ่ หรือชีวิตคู่เริ่มระหองระแหง",
        "en": "Marital bickering, differing values on raising children, or in-law meddling fracturing the marital sanctuary."
      },
      "career": {
        "th": "ความขัดแย้งรุนแรงในทีมงาน บรรยากาศที่เป็นพิษทำลายความสุขในการทำงาน",
        "en": "Discord within company ranks, culture clashes, or broken communal trust destabilizing workflow."
      },
      "finance": {
        "th": "ข้อพิพาทเรื่องทรัพย์สินในครอบครัว ค่าใช้จ่ายในบ้านบานปลายทำให้เกิดความตึงเครียดเรื่องเงิน",
        "en": "Family money squabbles, contentious divorce settlements, or domestic overhead draining bank accounts."
      },
      "health": {
        "th": "ความเครียดจากปัญหาในบ้านส่งผลกระทบต่อสุขภาพจิตและระบบหัวใจ",
        "en": "Emotional distress from domestic tension manifesting as anxiety, high blood pressure, or depression."
      },
      "advice": {
        "th": "หันหน้าเข้าหากันและเปิดใจรับฟังอย่างจริงใจ ความรักในครอบครัวต้องรดน้ำด้วยความอดทนและการให้อภัย",
        "en": "Rebuild harmony brick by brick. Forgive old slights and prioritize healing relationships over nursing pride."
      }
    }
  },
  "cups_11": {
    "upright": {
      "keywords": {
        "th": [
          "ข่าวดีแห่งความรัก",
          "สัญชาตญาณอ่อนไหว",
          "จิตวิญญาณแห่งกวี",
          "ความอ่อนโยนสร้างสรรค์",
          "ปลาในถ้วยทอง"
        ],
        "en": [
          "Gentle Dreamer",
          "Sweet Message",
          "Creative Intuition",
          "Poetic Romance",
          "Gentle Heart"
        ]
      },
      "general": {
        "th": "เด็กหนุ่มถือถ้วยทองที่มีปลาโผล่ขึ้นมาทักทาย สื่อถึงข่าวดีเรื่องความรัก จินตนาการทางศิลปะ และสัญชาตญาณอันบริสุทธิ์",
        "en": "A poetic youth holding a golden chalice from which a curious fish emerges. Gentle intuition, sweet incoming messages, and creative innocence."
      },
      "love": {
        "th": "ได้รับข้อความหวานซึ้งหรือคำบอกรัก คนโสดมีคนอายุน้อยกว่าหรือคนที่มีหัวใจอ่อนโยนน่ารักเข้ามาจีบ",
        "en": "Tender romantic overtures, sweet confessions, and innocent courtship. Singles attract a dreamy, creative admirer."
      },
      "career": {
        "th": "ได้รับโอกาสทำงานด้านศิลปะ ดนตรี การเขียน หรือโปรเจกต์ที่ต้องใช้จินตนาการและความเข้าอกเข้าใจ",
        "en": "Inspirational breakthroughs in arts, creative writing, design, or supportive counseling roles."
      },
      "finance": {
        "th": "มีโชคลาภเล็กๆ น้อยๆ จากการทำสิ่งที่รัก หรือได้รับของขวัญที่สร้างความประทับใจทางใจ",
        "en": "Modest intuitive financial gains, thoughtful gifts, or monetizing an artistic pastime."
      },
      "health": {
        "th": "สุขภาพดี มีความละเอียดอ่อนทางอารมณ์ ควรระวังการแพ้น้ำ หรือแพ้อาหารทะเลเล็กน้อย",
        "en": "Gentle vitality; heightened sensitivity to foods, cosmetics, or environmental toxins—choose natural remedies."
      },
      "advice": {
        "th": "เชื่อมั่นในเสียงกระซิบของหัวใจและสัญชาตญาณ ความอ่อนโยนไม่ใช่ความอ่อนแอแต่คือพลังบริสุทธิ์",
        "en": "Trust your intuitive nudges. Approach life with gentle curiosity and let your imagination weave poetry."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความอ่อนไหวเกินเหตุ",
          "ข่าวที่น่าผิดหวัง",
          "ความเพ้อเจ้อไร้เดียงสา",
          "อารมณ์งอแง",
          "การหลอกลวงทางใจ"
        ],
        "en": [
          "Emotional Immaturity",
          "Bad News",
          "Daydreaming Paralysis",
          "Tantrums",
          "Deceit"
        ]
      },
      "general": {
        "th": "อารมณ์อ่อนไหวเกินไป งอแง เอาแต่ใจ หรือได้รับข่าวสารเรื่องความรักที่ทำให้เสียความรู้สึก",
        "en": "Emotional mood swings, childish sulking, seductive emotional deception, or receiving disappointing romantic news."
      },
      "love": {
        "th": "เจอคนไม่จริงใจ มาหยอดคำหวานแล้วหายตัวไป หรือคนรักทำตัวเป็นเด็กไม่ยอมโตและขาดความรับผิดชอบ",
        "en": "Superficial flattery hiding fickle motives, romantic ghosting, or dealing with an emotionally volatile partner."
      },
      "career": {
        "th": "งานศิลปะหรือความคิดสร้างสรรค์ติดขัด ขาดวินัยในการทำงาน ขี้เกียจจนทำงานไม่เสร็จตามกำหนด",
        "en": "Creative blocks, procrastination, indulging in lazy daydreams instead of doing the actual legwork."
      },
      "finance": {
        "th": "เสียเงินไปกับสิ่งของน่ารักที่ไร้ประโยชน์ หรือถูกหลอกให้สงสารจนต้องเสียเงินช่วยเหลือคนอื่น",
        "en": "Impulsive emotional spending on transient trinkets, or falling for sob stories and lending money unwisely."
      },
      "health": {
        "th": "ภาวะอารมณ์แปรปรวน โรควิตกกังวล หรือปัญหาเกี่ยวกับระบบต่อมน้ำเหลืองและฮอร์โมน",
        "en": "Psychosomatic moodiness, hypersensitivity to stress, or hormonal fluctuations causing tears."
      },
      "advice": {
        "th": "ควบคุมอารมณ์ของตนเองและมองโลกตามความเป็นจริง ความฝันจะงดงามได้ก็ต่อเมื่อมีวินัยกำกับ",
        "en": "Anchor your emotions with grounded discipline. Do not let sensitivity degenerate into childish fragility."
      }
    }
  },
  "cups_12": {
    "upright": {
      "keywords": {
        "th": [
          "อัศวินแห่งความโรแมนติก",
          "การตามหาหัวใจ",
          "ข้อเสนออันอบอุ่น",
          "เสน่ห์ดึงดูดใจ",
          "การเดินทางด้วยรัก"
        ],
        "en": [
          "Romantic Knight",
          "Charming Suitor",
          "Heartfelt Proposal",
          "Idealism",
          "Poetic Grace"
        ]
      },
      "general": {
        "th": "อัศวินบนม้าสีขาวก้าวเดินอย่างสง่างาม ถือถ้วยทองแห่งความรักมามอบให้ สื่อถึงข้อเสนอที่ดี คำสัญญาที่จริงใจ และความโรแมนติก",
        "en": "The gentle knight riding a stately steed, holding forth the sacred cup of love. Romantic proposals, diplomatic overtures, and idealistic quests."
      },
      "love": {
        "th": "การขอแต่งงาน ข้อตกลงความสัมพันธ์ที่จริงจัง คนโสดมีคนในฝัน รูปหล่อ สุภาพ อบอุ่น เข้ามาจีบอย่างโรแมนติก",
        "en": "Chivalrous romantic courtship, earnest proposals, and meeting a graceful, emotionally mature admirer."
      },
      "career": {
        "th": "ได้รับข้อเสนองานที่ถูกใจ การเจรจาทางการทูตที่ประสบความสำเร็จ การทำงานด้วยความปรองดองและเสน่ห์ส่วนตัว",
        "en": "Diplomatic triumphs, lucrative creative proposals, and winning over clients through heartfelt charm and empathy."
      },
      "finance": {
        "th": "การเงินราบรื่น มีโอกาสได้เงินจากข้อเสนอที่ดี หรือการลงทุนในงานศิลปะและของสะสมที่มีคุณค่า",
        "en": "Favorable financial offers, profitable creative negotiations, and wise acquisitions of fine art."
      },
      "health": {
        "th": "สุขภาพแข็งแรง ผ่อนคลาย จิตใจที่เปี่ยมด้วยความหวังทำให้ระบบไหลเวียนโลหิตและผิวพรรณดีเยี่ยม",
        "en": "Serene physical health, harmonious cardiovascular balance, and radiant calm vitality."
      },
      "advice": {
        "th": "ทำตามเสียงเรียกร้องของหัวใจด้วยความสง่างามและความจริงใจ นำเสนอสิ่งที่ดีที่สุดในตัวคุณออกมา",
        "en": "Follow the compass of your heart. Present your gifts with elegance, sincerity, and poetic honor."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "เสน่ห์ลวงตา",
          "คนเจ้าชู้ปากหวาน",
          "คำสัญญาที่ไม่เป็นจริง",
          "ความเพ้อฝันขาดสติ",
          "การผิดหวังในรัก"
        ],
        "en": [
          "Deceptive Charm",
          "Unreliable Lover",
          "Broken Promises",
          "Manipulation",
          "Disillusionment"
        ]
      },
      "general": {
        "th": "ระวังคนปากหวานก้นเปรี้ยว สร้างภาพเป็นคนดีแต่มุ่งหวังผลประโยชน์ หรือคำสัญญาที่สวยหรูแต่ทำไม่ได้จริง",
        "en": "A charming deceiver, hollow flattery, seductive gaslighting, and unfulfilled romantic vows."
      },
      "love": {
        "th": "เจอคนเจ้าชู้ หลอกให้รักแล้วเท หรือคนรักไม่รักษาสัญญาที่เคยให้ไว้ สร้างความผิดหวังอย่างแรง",
        "en": "A smooth-talking player who vanishes when reality sets in, broken engagements, or emotional infidelity."
      },
      "career": {
        "th": "ระวังข้อเสนอทางธุรกิจที่ดูดีเกินจริง หรือเพื่อนร่วมงานที่ชอบสร้างภาพแต่ทำงานไม่เป็นชิ้นเป็นอัน",
        "en": "Fraudulent business overtures, untrustworthy partners masking incompetence behind sweet talk."
      },
      "finance": {
        "th": "เสียเงินเพราะหลงเชื่อคำพูดชักชวนที่ดูน่าเชื่อถือ อย่าเซ็นสัญญาโดยไม่ได้ตรวจสอบรายละเอียดอย่างถี่ถ้วน",
        "en": "Financial deception, investing based on sentimental flattery, and losses from fraudulent schemes."
      },
      "health": {
        "th": "ความเครียดจากความผิดหวังในคนรักส่งผลต่อหัวใจและระบบทางเดินอาหาร ระวังการเสพติดสิ่งมึนเมา",
        "en": "Heartbreak-induced malaise, escapist substance abuse, or nervous stomach ailments."
      },
      "advice": {
        "th": "อย่าตัดสินคนจากคำพูดหวานหูเพียงอย่างเดียว จงดูที่การกระทำจริงและความซื่อสัตย์ในระยะยาว",
        "en": "Look beyond honeyed words to actual actions. Integrity is proven by consistent deeds, not flowery promises."
      }
    }
  },
  "cups_13": {
    "upright": {
      "keywords": {
        "th": [
          "ราชินีแห่งความเมตตา",
          "สัญชาตญาณหยั่งรู้",
          "ผู้เยียวยาจิตวิญญาณ",
          "ความรักอันไร้เงื่อนไข",
          "ความสงบแห่งหัวใจ"
        ],
        "en": [
          "Compassionate Queen",
          "Intuitive Wisdom",
          "Emotional Healer",
          "Unconditional Love",
          "Empathy"
        ]
      },
      "general": {
        "th": "ราชินีผู้สงบนั่งริมมหาสมุทร ประคองถ้วยที่วิจิตรบรรจงด้วยความทะนุถนอม สื่อถึงความเข้าอกเข้าใจ สัญชาตญาณแม่นยำ และพลังแห่งการบำบัดรักษา",
        "en": "The loving queen seated by the ocean gazing into her ornate chalice. Deep emotional wisdom, empathic intuition, and healing grace."
      },
      "love": {
        "th": "ความรักที่อบอุ่น ลึกซึ้ง และเกื้อกูลกันอย่างไม่มีเงื่อนไข เป็นที่พักพิงใจที่ปลอดภัยที่สุดสำหรับคนรัก",
        "en": "Profound, devoted emotional intimacy; a nurturing sanctuary where vulnerabilities are held with holy tenderness."
      },
      "career": {
        "th": "ประสบความสำเร็จในงานด้านการดูแล การบำบัด ให้คำปรึกษา ศิลปะ หรือการเป็นผู้นำที่ลูกน้องรักใคร่",
        "en": "Thriving in healthcare, counseling, psychology, fine arts, and empathetic leadership that inspires loyalty."
      },
      "finance": {
        "th": "การเงินมั่นคง ใช้เงินด้วยความรอบคอบและมีสัญชาตญาณการลงทุนที่ดีเยี่ยม ชอบช่วยเหลือคนยากไร้",
        "en": "Financially secure and generous; using intuitive insight to guide ethical, sustainable financial choices."
      },
      "health": {
        "th": "สุขภาพแข็งแรง มีพลังจิตที่สงบนิ่ง ช่วยปรับสมดุลธาตุน้ำและฮอร์โมนในร่างกายได้อย่างยอดเยี่ยม",
        "en": "Superb holistic well-being, balanced endocrine system, and powerful self-healing capabilities."
      },
      "advice": {
        "th": "เชื่อมั่นในสัญชาตญาณและความเมตตาของคุณ จงเป็นประทีปแห่งความอบอุ่นให้แก่ผู้ที่กำลังเหน็บหนาว",
        "en": "Lead with your heart's intuitive compass. Empathy and loving kindness are your greatest superpowers."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "อารมณ์ดิ่งแปรปรวน",
          "การบงการด้วยความสงสาร",
          "การแบกรับอารมณ์คนอื่น",
          "ความไม่มั่นคงในใจ",
          "หมดพลังใจ"
        ],
        "en": [
          "Emotional Instability",
          "Codependency",
          "Guilt Tripping",
          "Martyr Complex",
          "Overwhelmed"
        ]
      },
      "general": {
        "th": "อารมณ์แปรปรวนเหมือนพายุในทะเล แบกรับปัญหาและความทุกข์ของคนอื่นจนหมดพลัง หรือใช้ความอ่อนไหวมาบงการผู้อื่น",
        "en": "Drowning in emotional storms, toxic codependency, martyrdom, and manipulation through playing the victim."
      },
      "love": {
        "th": "ความสัมพันธ์ที่เป็นพิษ เรียกร้องความรักมากเกินไป ขี้ระแวง หรืองอนโดยไม่มีเหตุผลจนคนรักเหนื่อยล้า",
        "en": "Suffocating emotional neediness, passive-aggressive guilt trips, and drowning the partnership in melodrama."
      },
      "career": {
        "th": "นำอารมณ์ส่วนตัวมาปะปนกับงาน ไม่สามารถรับคำวิจารณ์ได้ หรือหมดพลังจากการเป็นที่ปรึกษาให้คนอื่นมากเกินไป",
        "en": "Taking workplace critique personally, emotional burnout in caring professions, or toxic office moodiness."
      },
      "finance": {
        "th": "เสียเงินเพราะความใจอ่อน ถูกคนที่ไว้ใจหลอกเอาเงินไป หรือใช้เงินประชดอารมณ์เศร้า",
        "en": "Financial exploitation due to poor emotional boundaries, lending to guilt-tripping relatives, or retail therapy."
      },
      "health": {
        "th": "ภาวะซึมเศร้า อารมณ์แปรปรวนตามรอบเดือน หรือปัญหาเกี่ยวกับระบบน้ำเหลืองและไต",
        "en": "Severe mood swings, psychosomatic exhaustion, water retention, and severe empathetic burnout."
      },
      "advice": {
        "th": "สร้างขอบเขตทางอารมณ์ให้ชัดเจน คุณไม่สามารถช่วยทุกคนได้หากตัวคุณเองกำลังจะจมน้ำ",
        "en": "Establish firm emotional boundaries. You cannot save others by drowning yourself; step out of the storm."
      }
    }
  },
  "cups_14": {
    "upright": {
      "keywords": {
        "th": [
          "ราชาแห่งความเยือกเย็น",
          "ผู้มีวุฒิภาวะทางอารมณ์",
          "ที่ปรึกษาผู้ทรงปัญญา",
          "ความมั่นคงทางใจ",
          "ผู้นำผู้เปี่ยมเมตตา"
        ],
        "en": [
          "Emotional Master",
          "Wise Counselor",
          "Calm Balance",
          "Compassionate Leader",
          "Maturity"
        ]
      },
      "general": {
        "th": "ราชาประทับบนบัลลังก์กลางเกลียวคลื่นอย่างสงบนิ่ง สื่อถึงผู้ที่สามารถควบคุมอารมณ์และความรู้สึกได้อย่างสมบูรณ์แบบ มีปัญญาและความเมตตา",
        "en": "The sovereign king seated serenely upon his throne floating in the turbulent sea. Supreme emotional mastery, balanced judgment, and wise counsel."
      },
      "love": {
        "th": "คนรักที่เป็นผู้ใหญ่ อบอุ่น หนักแน่น รับฟังและเข้าใจคุณในทุกเรื่อง เป็นเสาหลักที่พึ่งพาได้อย่างแท้จริง",
        "en": "A deeply loving, faithful, and emotionally supportive partner who provides unshakeable emotional security."
      },
      "career": {
        "th": "ผู้บริหารหรือหัวหน้าที่ลูกน้องให้ความเคารพรัก จัดการข้อพิพาทในที่ทำงานด้วยความยุติธรรมและเมตตาธรรม",
        "en": "Masterful executive management, resolving diplomatic crises with calm poise, and earning profound workplace respect."
      },
      "finance": {
        "th": "การเงินมั่นคงและมีเสถียรภาพสูง บริหารจัดการเงินอย่างรอบคอบ ไม่ตื่นตระหนกต่อความผันผวนของตลาด",
        "en": "Sound, balanced wealth management; weathering market fluctuations with calm strategic wisdom."
      },
      "health": {
        "th": "สุขภาพแข็งแรงทั้งกายและใจ การควบคุมอารมณ์ได้ดีช่วยป้องกันโรคหัวใจและความดันได้อย่างยอดเยี่ยม",
        "en": "Superb cardiovascular and emotional health, excellent stress tolerance, and deep physical calm."
      },
      "advice": {
        "th": "รักษาความเยือกเย็นและใช้สติในการนำทาง อย่าให้อารมณ์ชั่ววูบมาสั่นคลอนความสงบภายในของคุณ",
        "en": "Anchor yourself in calm emotional sovereignty. When storms rage, let your quiet wisdom be the steady anchor."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "อารมณ์ร้ายเงียบ",
          "ความเย็นชาบงการ",
          "การเก็บกดอารมณ์",
          "พฤติกรรมเสพติด",
          "ความไม่ซื่อสัตย์"
        ],
        "en": [
          "Emotional Manipulation",
          "Coldness",
          "Volatile Temper",
          "Addiction",
          "Tyranny"
        ]
      },
      "general": {
        "th": "การใช้ความเงียบหรือการบงการทางอารมณ์ทำร้ายผู้อื่น การเก็บกดความโกรธไว้จนระเบิด หรือการพึ่งพาสิ่งมึนเมาเพื่อกลบความเจ็บปวด",
        "en": "The dark side of emotional power: gaslighting, vindictive coldness, repressed rage, or seeking refuge in substance addictions."
      },
      "love": {
        "th": "คนรักเย็นชา ไม่สื่อสาร ใช้สงครามเย็นทำร้ายจิตใจ หรือมีความลับและการไม่ซื่อสัตย์ซ่อนอยู่",
        "en": "Emotional cruelty, giving the cold shoulder, gaslighting, or passive-aggressive manipulation in romance."
      },
      "career": {
        "th": "หัวหน้างานที่เอาแต่อารมณ์ ลำเอียง หรือใช้อำนาจกดขี่ลูกน้องด้วยคำพูดเสียดสีและไร้ความเมตตา",
        "en": "Toxic boss engaging in subtle emotional sabotage, deceitful corporate politics, or erratic leadership."
      },
      "finance": {
        "th": "การตัดสินใจทางการเงินที่ผิดพลาดเพราะอารมณ์ หรือเสียเงินไปกับพฤติกรรมเสพติดและการพนัน",
        "en": "Financial instability caused by emotional gambling, alcoholism, or falling for corrupt financial back-channels."
      },
      "health": {
        "th": "ความดันสูง โรคหัวใจ หรือตับมีปัญหาจากการดื่มแอลกอฮอล์เพื่อหนีความเครียด",
        "en": "Alcohol or substance-related liver strain, cardiovascular stress from repressed fury, or deep depression."
      },
      "advice": {
        "th": "ปลดปล่อยความรู้สึกที่แท้จริงออกมาและเผชิญหน้ากับมัน ความเงียบและการเก็บกดไม่ได้ช่วยแก้ปัญหา",
        "en": "Break free from emotional suppression. Face your true feelings honestly and stop punishing others for your pain."
      }
    }
  },
  "swords_1": {
    "upright": {
      "keywords": {
        "th": [
          "ปัญญาเฉียบแหลม",
          "ความจริงประจักษ์",
          "การตัดสิ่งลวงตา",
          "ชัยชนะแห่งความคิด",
          "ความชัดเจนเด็ดขาด"
        ],
        "en": [
          "Mental Clarity",
          "Raw Truth",
          "Breakthrough",
          "Cutting Illusions",
          "Decisiveness"
        ]
      },
      "general": {
        "th": "ดาบสองคมแห่งความจริงชูขึ้นเหนือมงกุฎแห่งชัยชนะ สื่อถึงความกระจ่างแจ้งทางปัญญา การตัดความลังเลและสิ่งลวงตาออกจากชีวิตอย่างเด็ดขาด",
        "en": "The single upright sword crowned with laurel and olive branches. Piercing mental clarity, breakthrough insight, and triumph of objective truth."
      },
      "love": {
        "th": "ความสัมพันธ์ที่ชัดเจน พูดคุยกันด้วยความจริงใจโดยไม่มีอะไรปิดบัง ตัดสินใจอย่างเด็ดขาดว่าจะไปต่อหรือหยุดไว้แค่นี้",
        "en": "Radical transparency and honest communication in love. Cutting through misunderstandings with fearless truth and clarity."
      },
      "career": {
        "th": "การค้นพบทางออกของปัญหาที่ซับซ้อน ชนะการโต้เถียงหรือการเจรจาด้วยข้อเท็จจริง แผนกลยุทธ์เฉียบคมที่นำไปสู่ความสำเร็จ",
        "en": "Intellectual breakthroughs, triumphant presentations, winning debates with factual precision, and decisive execution."
      },
      "finance": {
        "th": "วางแผนการเงินอย่างมีเหตุผล ตัดรายจ่ายที่ไม่จำเป็นทิ้งอย่างเด็ดขาด การตัดสินใจลงทุนบนพื้นฐานข้อมูลจริง",
        "en": "Prudent, calculated financial reorganization; ruthlessly trimming waste and making decisions based on cold facts."
      },
      "health": {
        "th": "สมองปลอดโปร่ง มีสมาธิและสติสัมปชัญญะดีเยี่ยม การผ่าตัดหรือการรักษาทางการแพทย์เป็นไปอย่างราบรื่นและได้ผลดี",
        "en": "Sharp mental acuity, successful medical or surgical interventions, and swift recovery through clinical precision."
      },
      "advice": {
        "th": "ใช้ดาบแห่งสติปัญญาฟันฝ่าความหลงผิด พูดความจริงด้วยความกล้าหาญ แต่อย่าลืมผสานความเมตตาไว้ด้วย",
        "en": "Wield the sword of truth cleanly. Cut through excuses and illusions; clarity is your ultimate power."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความคิดสับสน",
          "การใช้คำพูดทำร้าย",
          "ความอยุติธรรม",
          "การตัดสินใจผิดพลาด",
          "ข้อมูลบิดเบือน"
        ],
        "en": [
          "Confusion",
          "Harsh Words",
          "Misinformation",
          "Poor Judgment",
          "Cruelty"
        ]
      },
      "general": {
        "th": "ความสับสนวุ่นวายในสมอง ข้อมูลที่ได้รับอาจบิดเบือน หรือการใช้ปัญญาและคำพูดเพื่อทำร้ายและเอาเปรียบผู้อื่น",
        "en": "Clouded judgment, intellectual arrogance, cutting sarcasm wounding others, or falling victim to deceit and misinformation."
      },
      "love": {
        "th": "ใช้คำพูดที่เฉียบคมประชดประชันทำร้ายจิตใจกัน หรือมีความลับและการโกหกที่สร้างความแตกแยกในชีวิตคู่",
        "en": "Acidic arguments, hurtful insults, lying, or emotional cruelty poisoning the relationship."
      },
      "career": {
        "th": "การตัดสินใจทางธุรกิจผิดพลาด ข้อมูลวิเคราะห์คลาดเคลื่อน หรือถูกตำหนิอย่างรุนแรงจากความผิดพลาดในการสื่อสาร",
        "en": "Flawed strategic decisions, misinformation derailing projects, or harsh workplace confrontations."
      },
      "finance": {
        "th": "ระวังข้อพิพาททางสัญญา ปัญหาทางกฎหมาย หรือถูกหลอกลวงด้วยข้อมูลตัวเลขที่ไม่เป็นความจริง",
        "en": "Contractual disputes, deceptive terms in loans, and financial loss caused by poorly verified agreements."
      },
      "health": {
        "th": "ปวดหัว ไมเกรนรุนแรง ความเครียดสะสมจนส่งผลต่อระบบประสาท ระวังอุบัติเหตุจากของมีคม",
        "en": "Severe migraines, neural tension, mental fatigue, or minor cuts and surgical complications."
      },
      "advice": {
        "th": "วางดาบลงและสงบสติอารมณ์ อย่าตัดสินใจเรื่องสำคัญในขณะที่จิตใจยังเต็มไปด้วยความโกรธและความสับสน",
        "en": "Sheathe your blade until the red mist clears. Hasty words spoken in wrath cannot be recalled."
      }
    }
  },
  "swords_2": {
    "upright": {
      "keywords": {
        "th": [
          "ทางสองแพร่ง",
          "การชั่งใจอย่างหนัก",
          "การปิดตาสงบศึก",
          "การรักษาสมดุลทางใจ",
          "การตัดสินใจยากลำบาก"
        ],
        "en": [
          "Difficult Choice",
          "Stalemate",
          "Blindfolded Logic",
          "Truce",
          "Crossroads"
        ]
      },
      "general": {
        "th": "หญิงสาวผูกตาถือดาบคู่ไขว้หน้าอกนั่งริมทะเล สะท้อนถึงการอยู่ตรงทางแยกที่ตัดสินใจยาก จำเป็นต้องปิดรับสิ่งรบกวนภายนอกและใช้ปัญญาภายในไตร่ตรอง",
        "en": "Blindfolded figure balancing two crossed swords beneath the crescent moon. A tense stalemate, difficult crossroads, and blocking outer noise to decide."
      },
      "love": {
        "th": "ลังเลระหว่างคนสองคน หรืออยู่ในช่วงพักรบ หลีกเลี่ยงการปะทะชั่วคราวเพื่อรอให้จิตใจสงบลง",
        "en": "Torn between two paths or suitors, avoiding difficult conversations, or maintaining a temporary truce to prevent conflict."
      },
      "career": {
        "th": "การต้องเลือกระหว่างสองทางเลือกที่สำคัญพอๆ กัน ข้อตกลงที่ยังหาข้อสรุปไม่ได้ ต้องใช้เวลาพิจารณาอย่างรอบคอบ",
        "en": "Stalemate in negotiations, deadlocked boards, or weighing two compelling career offers with intense caution."
      },
      "finance": {
        "th": "การเงินอยู่ในภาวะทรงตัว ชะลอการตัดสินใจใช้เงินก้อนใหญ่หรือการลงทุนจนกว่าจะมีข้อมูลครบถ้วน",
        "en": "Financial holding pattern; delaying major expenditures until economic clarity emerges."
      },
      "health": {
        "th": "ปัญหาเกี่ยวกับสายตา ความเครียดจากการเก็บกดความรู้สึก หรืออาการปวดตึงบริเวณลำคอและหัวไหล่",
        "en": "Eye strain, sensory overload, tension headaches, or somatic repression of intense emotions."
      },
      "advice": {
        "th": "เปิดผ้าผูกตาออกและกล้าเผชิญหน้ากับความจริง การหลีกเลี่ยงการตัดสินใจจะยิ่งทำให้สถานการณ์ยืดเยื้อ",
        "en": "Remove the blindfold. Postponing a decision is itself a choice; face reality and make your move."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความจริงปรากฏ",
          "ทางออกเปิดกว้าง",
          "การตัดสินใจได้ในที่สุด",
          "ความกระจ่างหลังความมืด",
          "การพังทลายของข้อตกลง"
        ],
        "en": [
          "Breakthrough",
          "Decision Made",
          "Blindfold Removed",
          "Clarity Returns",
          "Shattered Truce"
        ]
      },
      "general": {
        "th": "ผ้าผูกตาหลุดออก คุณมองเห็นทางออกอย่างชัดเจนและตัดสินใจได้ในที่สุด หรือสงครามเย็นที่เก็บกดไว้ปะทุขึ้นมา",
        "en": "The blindfold falls away: forced realization, breaking the stalemate, and stepping forward despite discomfort."
      },
      "love": {
        "th": "ตัดสินใจเลือกทางเดินได้ในที่สุด ยุติความสัมพันธ์ที่ค้างคา หรือเผชิญหน้ากับปัญหาที่เคยหลบเลี่ยงมานาน",
        "en": "Breaking emotional deadlocks; finally having the hard talk, choosing your partner decisively, or parting ways cleanly."
      },
      "career": {
        "th": "การเจรจาที่ติดหล่มสามารถหาข้อสรุปได้ มีการลงมติชี้ขาดและเดินหน้าโครงการต่อไป",
        "en": "Resolving corporate gridlock, signing stalled contracts, and moving forward with strategic action."
      },
      "finance": {
        "th": "ข้อพิพาทเรื่องเงินได้ข้อยุติ การเงินเริ่มหมุนเวียนได้ดีขึ้นหลังจากชะงักงันมานาน",
        "en": "Unfreezing stalled funds, finalizing contested transactions, and restoring cash flow."
      },
      "health": {
        "th": "อาการปวดตึงเริ่มผ่อนคลาย สุขภาพสายตาดีขึ้น ความโล่งใจช่วยลดความดันโลหิต",
        "en": "Relief of neck tension, reduced anxiety, and improved clarity of vision both literally and figuratively."
      },
      "advice": {
        "th": "เมื่อเห็นความจริงแล้วจงก้าวเดินต่อไปด้วยความมั่นใจ อย่าหันกลับไปหาความลังเลเดิมอีก",
        "en": "Walk boldly toward the truth. Indecision is behind you; trust your discernment and execute."
      }
    }
  },
  "swords_3": {
    "upright": {
      "keywords": {
        "th": [
          "หัวใจถูกทิ่มแทง",
          "ความเจ็บปวดเสียใจ",
          "การพลัดพราก",
          "ความจริงอันเจ็บแสบ",
          "แผลใจที่ต้องเยียวยา"
        ],
        "en": [
          "Heartbreak",
          "Grief",
          "Emotional Piercing",
          "Painful Truth",
          "Sorrow"
        ]
      },
      "general": {
        "th": "หัวใจสีแดงถูกดาบสามเล่มแทงทะลุท่ามกลางเมฆฝนและพายุ สัญลักษณ์แห่งความเจ็บปวดทางอารมณ์ การอกหัก หรือการได้รับรู้ความจริงที่บาดลึกในใจ",
        "en": "Three swords piercing a crimson heart beneath weeping storm clouds. Raw emotional sorrow, heartbreak, painful betrayals, and deep grief."
      },
      "love": {
        "th": "การอกหัก เลิกรา ถูกหักหลัง หรือการมีมือที่สามเข้ามาทำร้ายจิตใจ ความสัมพันธ์เจ็บปวดแสนสาหัส",
        "en": "Heartbreak, bitter separation, infidelity revealed, or acute sorrow from a shattered romance."
      },
      "career": {
        "th": "ถูกยกเลิกสัญญา ถูกไล่ออก หรือถูกปฏิเสธข้อเสนออย่างไม่ทันตั้งตัว ความผิดหวังในเพื่อนร่วมงาน",
        "en": "Harsh termination, sudden contract cancellation, betrayal by colleagues, or devastating workplace rejections."
      },
      "finance": {
        "th": "ความสูญเสียทางการเงินอย่างรุนแรง การถูกโกง การผิดนัดชำระหนี้ที่สร้างความเสียหายอย่างมาก",
        "en": "Painful financial losses, broken loan agreements, fraud, or catastrophic market drops."
      },
      "health": {
        "th": "โรคหัวใจ อาการเจ็บแน่นหน้าอก อาการซึมเศร้าเฉียบพลัน หรือบาดแผลทางใจที่ส่งผลกระทบต่อร่างกาย",
        "en": "Broken heart syndrome, acute chest tightness, grief-induced depression, and emotional shock."
      },
      "advice": {
        "th": "ยอมรับความเจ็บปวดและปล่อยให้น้ำตาไหลออกมา บาดแผลนี้จะทำให้คุณเติบโตและแข็งแกร่งขึ้นในอนาคต",
        "en": "Allow yourself to grieve fully. Rain cleanses the soil; acknowledge the pain so the healing can begin."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การฟื้นตัวจากแผลใจ",
          "การให้อภัย",
          "พายุเริ่มสงบ",
          "การเยียวยาหัวใจ",
          "การปล่อยวางความแค้น"
        ],
        "en": [
          "Healing Heart",
          "Forgiveness",
          "Recovery from Grief",
          "Releasing Sorrow",
          "Peace Returning"
        ]
      },
      "general": {
        "th": "ดาบทั้งสามค่อยๆ หลุดออกจากหัวใจ พายุฝนเริ่มซาลง การเยียวยาและความหวังกำลังกลับคืนมาสู่ชีวิตของคุณ",
        "en": "Swords sliding gently out of the heart; storm clouds parting, emotional healing taking root, and light returning."
      },
      "love": {
        "th": "เริ่มทำใจได้จากการเลิกรา ให้อภัยอดีตคนรัก และเปิดโอกาสให้หัวใจได้พักฟื้นเพื่อความรักครั้งใหม่",
        "en": "Mending a broken heart, releasing bitterness toward an ex, and welcoming the gentle dawn of romantic recovery."
      },
      "career": {
        "th": "ฟื้นตัวจากความล้มเหลวในงาน เริ่มต้นมองหางานใหม่หรือฟื้นฟูความสัมพันธ์ในที่ทำงานให้ดีขึ้น",
        "en": "Overcoming career disappointment, learning vital lessons from professional pain, and moving on to better pastures."
      },
      "finance": {
        "th": "ความเสียหายทางการเงินเริ่มหยุดนิ่ง สามารถควบคุมและวางแผนฟื้นฟูสภาพคล่องได้ใหม่",
        "en": "Stemming financial losses, settling debts, and taking the first cautious steps toward rebuilding capital."
      },
      "health": {
        "th": "อาการเจ็บป่วยเริ่มทุเลาลง สภาพจิตใจดีขึ้น การนอนหลับเป็นปกติมากขึ้น",
        "en": "Cardiovascular stability returning, relief from deep melancholy, and renewed physical stamina."
      },
      "advice": {
        "th": "จงให้อภัยตนเองและผู้อื่น การยึดติดกับความแค้นมีแต่จะทำให้แผลใจไม่ยอมหาย ปล่อยวางเพื่อเป็นอิสระ",
        "en": "Forgive and release. You are not defined by the scars on your heart, but by your courage to heal."
      }
    }
  },
  "swords_4": {
    "upright": {
      "keywords": {
        "th": [
          "การพักผ่อนฟื้นฟู",
          "การสงบจิตใจ",
          "ที่หลบภัยอันเงียบสงบ",
          "การถอยมาตั้งหลัก",
          "การทำสมาธิ"
        ],
        "en": [
          "Rest",
          "Sanctuary",
          "Convalescence",
          "Meditation",
          "Recharging"
        ]
      },
      "general": {
        "th": "อัศวินนอนพนมมืออย่างสงบบนแท่นหินในวิหาร มีดาบสามเล่มแขวนบนผนังและอีกหนึ่งเล่มอยู่ข้างกาย สื่อถึงการหยุดพักผ่อนเพื่อฟื้นฟูกายและใจอย่างลึกซึ้ง",
        "en": "The knight resting in peaceful contemplation upon a carved tomb within a quiet sanctuary. Essential convalescence, retreat, and mental recharging."
      },
      "love": {
        "th": "พักเรื่องความรักไว้ก่อน ถอยออกมาทบทวนความรู้สึกของตนเอง หรือคู่รักให้พื้นที่ส่วนตัวแก่กันเพื่อคลายความตึงเครียด",
        "en": "Taking a temporary breathing space in love, stepping back from relationship drama to regain inner equilibrium."
      },
      "career": {
        "th": "การลาพักร้อน การหยุดพักผ่อนหลังจากกรำงานหนัก ไม่ควรเริ่มต้นโปรเจกต์ใหม่ในช่วงนี้ ควรสะสมพลังงาน",
        "en": "Essential sabbatical, taking vacation, and pausing corporate battles to restore sharp intellectual vitality."
      },
      "finance": {
        "th": "การเงินนิ่งสงบ ไม่มีความเคลื่อนไหวหวือหวา ควรรักษาเงินสดและชะลอการลงทุนใหม่ไว้ก่อน",
        "en": "Financial stasis; keeping reserves in conservative accounts and avoiding hasty market gambles."
      },
      "health": {
        "th": "การพักฟื้นจากการเจ็บป่วย การนอนหลับลึกเพื่อซ่อมแซมร่างกาย การทำสมาธิและฝึกจิตช่วยบำบัดโรคได้ดีเยี่ยม",
        "en": "Crucial convalescence, restorative deep sleep, meditation therapy, and rebuilding depleted immune reserves."
      },
      "advice": {
        "th": "หยุดพักและถอยออกมาจากสนามรบชั่วคราว การพักผ่อนอย่างมีสติไม่ใช่ความเกียจคร้าน แต่คือการเตรียมพร้อมเพื่อชัยชนะ",
        "en": "Rest your weary mind. Solitude and silence are your sanctuary; recharge so you can return invincible."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การฟื้นคืนสู่สนามรบ",
          "การกลับมาลุยงาน",
          "ความกระสับกระส่าย",
          "การพักผ่อนไม่เพียงพอ",
          "การหมดเวลาพัก"
        ],
        "en": [
          "Re-entering the Fray",
          "Restlessness",
          "Awakening from Rest",
          "Burnout Warning",
          "Ready to Act"
        ]
      },
      "general": {
        "th": "ถึงเวลาลุกขึ้นจากแท่นพักผ่อนและกลับมาลุยต่อ หรือในทางตรงข้ามคือความกระสับกระส่ายจนพักผ่อนไม่ได้",
        "en": "Awakening from necessary retreat with restored strength, or restlessness driving you back to work before fully healed."
      },
      "love": {
        "th": "พร้อมกลับมาพูดคุยและปรับความเข้าใจกับคนรักอีกครั้ง สิ้นสุดช่วงเวลาห่างเหินและกลับมาใกล้ชิด",
        "en": "Ending the silent treatment, stepping out of romantic seclusion, and re-engaging with your partner warmly."
      },
      "career": {
        "th": "สิ้นสุดการพักร้อน กลับมาลุยงานด้วยพลังใจที่เต็มเปี่ยม พร้อมรับมือกับความท้าทายใหม่ๆ",
        "en": "Returning to work with renewed vigor, ready to tackle postponed deadlines with clear focus."
      },
      "finance": {
        "th": "เริ่มกลับมาเคลื่อนไหวทางการเงินอีกครั้ง หลังจากชะลอตัวมาระยะหนึ่ง เริ่มมองหาการลงทุนใหม่",
        "en": "Reactivating financial strategies, re-entering investment markets with refreshed analytical clarity."
      },
      "health": {
        "th": "ระวังการกลับไปทำงานเร็วเกินไปจนโรคเก่ากำเริบ ควรตรวจเช็กว่าร่างกายพร้อมลุยจริงหรือไม่",
        "en": "Risk of relapse if returning to high stress too quickly; pace yourself cautiously."
      },
      "advice": {
        "th": "ลุกขึ้นด้วยพลังที่ฟื้นคืนสมบูรณ์แล้ว แต่อย่าลืมจัดสรรเวลาพักผ่อนในชีวิตประจำวันเพื่อความสมดุลระยะยาว",
        "en": "Step back into the world renewed. Carry the peaceful sanctuary of your quiet mind into the noise of daily life."
      }
    }
  },
  "swords_5": {
    "upright": {
      "keywords": {
        "th": [
          "ชัยชนะที่ไร้ค่า",
          "ความขัดแย้งรุนแรง",
          "การหักหลังเอาเปรียบ",
          "การพ่ายแพ้สูญเสีย",
          "อีโก้ทำลายล้าง"
        ],
        "en": [
          "Hollow Victory",
          "Conflict",
          "Betrayal",
          "Cutthroat Defeat",
          "Toxic Ego"
        ]
      },
      "general": {
        "th": "ชายหนุ่มถือดาบสามเล่มด้วยรอยยิ้มเย้ยหยัน มองดูคู่ต่อสู้ที่เดินก้มหน้าจากไปด้วยความพ่ายแพ้ สื่อถึงชัยชนะที่ได้มาด้วยวิธีสกปรก หรือความขัดแย้งที่ไม่มีใครชนะอย่างแท้จริง",
        "en": "A gloating victor gathering fallen swords while his defeated opponents walk away in shame. Hollow victory, toxic ego battles, and bitter betrayal."
      },
      "love": {
        "th": "การทะเลาะที่เอาชนะกันด้วยคำพูดเจ็บแสบ แม้จะเถียงชนะแต่ต้องสูญเสียความรู้สึกของคนรักไป",
        "en": "Winning the argument but losing the lover. Cruel, cutting words, betrayal, infidelity, or toxic score-keeping."
      },
      "career": {
        "th": "การเมืองในที่ทำงานที่สกปรก การหักหลังและเลื่อยขาเก้าอี้ ชัยชนะที่แลกมาด้วยการสูญเสียเพื่อนร่วมงานและความไว้วางใจ",
        "en": "Cutthroat office sabotage, unethical victories, hostile takeovers, and feeling betrayed by ruthless peers."
      },
      "finance": {
        "th": "การถูกเอารัดเอาเปรียบในสัญญา ข้อพิพาทเรื่องมรดกหรือผลประโยชน์ที่เต็มไปด้วยความโลภและความเคียดแค้น",
        "en": "Unfair financial settlements, predatory contracts, being swindled by cutthroat rivals, and legal friction."
      },
      "health": {
        "th": "ความเครียดสูงจากความโกรธและความแค้น อาการเกร็งตามกล้ามเนื้อ ปวดศีรษะ และความดันโลหิตพุ่งสูง",
        "en": "Adrenaline exhaustion, toxic anger poisoning internal organs, and severe stress-induced migraines."
      },
      "advice": {
        "th": "ถอยออกมาจากการต่อสู้ที่ไร้สาระ ชัยชนะที่ได้มาจากการเหยียบย่ำผู้อื่นไม่ใช่ความสำเร็จที่แท้จริง",
        "en": "Walk away from toxic battles. Winning an argument at the expense of honor and peace is the ultimate loss."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การยุติความบาดหมาง",
          "การให้อภัยและชดใช้",
          "การปล่อยวางความแค้น",
          "การเยียวยาหลังสงคราม",
          "การยอมรับความจริง"
        ],
        "en": [
          "Ending Feuds",
          "Remorse",
          "Forgiveness",
          "Moving Beyond Spite",
          "Reconciliation"
        ]
      },
      "general": {
        "th": "ความขัดแย้งเริ่มคลี่คลาย ตระหนักถึงผลเสียของความเคียดแค้นและพร้อมจะยุติสงครามเพื่อความสงบสุข",
        "en": "Laying down swords, acknowledging mutual damage, regretting cruel words, and seeking reconciliation."
      },
      "love": {
        "th": "สำนึกผิดในคำพูดที่รุนแรง ขอโทษคนรักและพยายามฟื้นฟูความสัมพันธ์ หรือตัดสินใจแยกทางกันด้วยดีโดยไม่ผูกแค้น",
        "en": "Apologizing for spiteful behavior, dropping defenses to heal the bond, or parting amicably without lawsuits."
      },
      "career": {
        "th": "บรรยากาศในที่ทำงานเริ่มดีขึ้นหลังจากผ่านพ้นวิกฤตความขัดแย้ง หันมาร่วมมือกันเพื่อฟื้นฟูงาน",
        "en": "Dismantling toxic office politics, resolving union disputes, and rebuilding fractured professional trust."
      },
      "finance": {
        "th": "ยอมประนีประนอมในข้อพิพาททางการเงินเพื่อจบปัญหา ไม่ต้องเสียเงินและเวลาไปกับการฟ้องร้องยืดเยื้อ",
        "en": "Settling legal disputes out of court; cutting losses to save immense future emotional and financial capital."
      },
      "health": {
        "th": "ความดันโลหิตและระดับฮอร์โมนความเครียดเริ่มลดลง ร่างกายฟื้นตัวหลังจากละทิ้งความโกรธแค้น",
        "en": "Nervous system downshifting from fight-or-flight mode, restoring restful sleep and digestive health."
      },
      "advice": {
        "th": "วางดาบลงและยื่นมือแห่งสันติภาพ การให้อภัยคือชัยชนะอันยิ่งใหญ่ที่สุดเหนืออัตตาของตนเอง",
        "en": "Swallow your pride and seek reconciliation. True nobility lies in seeking peace rather than vengeance."
      }
    }
  },
  "swords_6": {
    "upright": {
      "keywords": {
        "th": [
          "การเดินทางข้ามผ่านปัญหา",
          "การมุ่งสู่ความสงบ",
          "การก้าวพ้นวิกฤต",
          "การเริ่มต้นใหม่ที่ราบรื่น",
          "การเยียวยาจิตวิญญาณ"
        ],
        "en": [
          "Transition",
          "Moving to Calmer Waters",
          "Leaving Trouble Behind",
          "Healing Journey",
          "Relief"
        ]
      },
      "general": {
        "th": "คนพายเรือพาผู้โดยสารสองคนข้ามจากผืนน้ำที่เชี่ยวกรากไปสู่ผืนน้ำที่ราบเรียบ ดาบทั้งหกปักอยู่บนเรือ สื่อถึงการผ่านพ้นช่วงเวลาที่เลวร้ายและกำลังเดินทางสู่ความสงบสุข",
        "en": "A ferryman guiding a cloaked mother and child across turbulent waters toward peaceful shores. Transitioning away from pain into quiet healing."
      },
      "love": {
        "th": "ความสัมพันธ์ผ่านพ้นวิกฤตการณ์ที่ตึงเครียดและเริ่มเข้าสู่ช่วงเวลาที่สงบเข้าใจกันมากขึ้น คนโสดกำลังก้าวข้ามความเจ็บปวดในอดีต",
        "en": "Moving together past a severe relationship storm into peaceful waters; singles gently leaving past trauma behind."
      },
      "career": {
        "th": "การย้ายงาน เปลี่ยนแผนก หรือเปลี่ยนสภาพแวดล้อมการทำงานที่ดีขึ้น ปัญหาที่เคยติดขัดเริ่มได้รับการคลี่คลายอย่างราบรื่น",
        "en": "Leaving a toxic workplace, smooth job transitions, and moving projects into stabilized phases."
      },
      "finance": {
        "th": "การเงินค่อยๆ ฟื้นตัวหลังจากผ่านช่วงวิกฤต เริ่มจัดการหนี้สินได้และมีสภาพคล่องที่มั่นคงขึ้น",
        "en": "Gradual financial recovery; moving past debt emergencies into steady, predictable budgeting."
      },
      "health": {
        "th": "การฟื้นฟูสุขภาพร่างกายและจิตใจอย่างต่อเนื่อง อาการป่วยเรื้อรังเริ่มดีขึ้น การเดินทางไปพักผ่อนช่วยเยียวยาได้ดี",
        "en": "Convalescent recovery, reducing inflammation, travel for health retreats, and emotional stabilization."
      },
      "advice": {
        "th": "มุ่งหน้าต่อไปอย่างสงบและอดทน สิ่งเลวร้ายที่สุดได้ผ่านพ้นไปแล้ว ผืนน้ำอันสงบเงียบกำลังรอต้อนรับคุณ",
        "en": "Keep rowing toward the quiet shore. The worst is behind you; trust the gentle journey of recovery."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ปัญหาตามหลอกหลอน",
          "การเดินทางสะดุด",
          "การติดหล่มในอดีต",
          "น้ำวนแห่งความทุกข์",
          "ความล่าช้าในการฟื้นตัว"
        ],
        "en": [
          "Turbulence",
          "Stuck in Past",
          "Delayed Transition",
          "Unresolved Baggage",
          "Rough Waters"
        ]
      },
      "general": {
        "th": "พยายามจะก้าวข้ามปัญหาแต่ยังถูกอดีตดึงรั้งไว้ การเดินทางอาจมีอุปสรรค หรือปัญหาเก่ายังตามมาหลอกหลอน",
        "en": "Rocking the boat in transit; bringing old psychological baggage into new harbors, or delayed relocations."
      },
      "love": {
        "th": "ยังนำเรื่องในอดีตมาทะเลาะกันซ้ำๆ ไม่ยอมปล่อยวางความผิดพลาดเก่า หรือยังตัดใจจากคนรักเก่าไม่ได้",
        "en": "Dragging ex-partner drama into a new relationship, or reopening healed wounds during fights."
      },
      "career": {
        "th": "การเปลี่ยนงานไม่ราบรื่นอย่างที่คิด พบปัญหาใหม่ในที่ทำงานใหม่ หรือโครงการสะดุดเพราะการจัดการที่ไม่รัดกุม",
        "en": "Rocky career transition, unexpected hurdles at a new job, or carrying burnout into a fresh role."
      },
      "finance": {
        "th": "ภาระหนี้เก่าตามมาทวงถาม การฟื้นตัวทางการเงินล่าช้ากว่าที่คาดการณ์ไว้",
        "en": "Old debts resurfacing to disrupt budgets; slow, sluggish recovery from past financial blunders."
      },
      "health": {
        "th": "การฟื้นตัวจากอาการป่วยสะดุด มีอาการแทรกซ้อน หรือมีอาการเมาคลื่นเมาเรือจากการเดินทาง",
        "en": "Setbacks during physical therapy, lingering viral fatigue, or motion sickness during travel."
      },
      "advice": {
        "th": "ทิ้งสัมภาระทางอารมณ์ที่ไม่จำเป็นลงน้ำเสียก่อน อย่าแบกความทุกข์เดิมๆ ไปเริ่มต้นชีวิตใหม่",
        "en": "Do not carry the stones of your past into your new sanctuary. Throw unnecessary baggage overboard."
      }
    }
  },
  "swords_7": {
    "upright": {
      "keywords": {
        "th": [
          "กลยุทธ์แยบยล",
          "การเอาตัวรอด",
          "ความลับและการปกปิด",
          "การทำงานเบื้องหลัง",
          "การหลบเลี่ยงการปะทะ"
        ],
        "en": [
          "Stealth",
          "Strategy",
          "Tactical Wit",
          "Secrecy",
          "Outsmarting Opponents"
        ]
      },
      "general": {
        "th": "ชายหนุ่มย่องออกมาจากค่ายทหารพร้อมดาบห้าเล่มในอ้อมแขน ทิ้งไว้เพียงสองเล่ม สื่อถึงการใช้ไหวพริบและกลยุทธ์อันแยบยลเพื่อเอาตัวรอด หรือการทำสิ่งต่างๆ อย่างลับๆ",
        "en": "A figure tiptoeing away from enemy tents carrying five stolen swords. Cunning strategy, stealth, tactical maneuvering, and avoiding direct confrontation."
      },
      "love": {
        "th": "ระวังการมีความลับหรือการไม่ซื่อสัตย์ในความสัมพันธ์ มีเรื่องปิดบังซ่อนเร้น หรือการแอบคุยกับคนอื่น",
        "en": "Sneaky behavior, hidden texts, emotional dishonesty, or avoiding difficult relationship confrontation through evasion."
      },
      "career": {
        "th": "การใช้กลยุทธ์ที่แยบยลเพื่อชิงความได้เปรียบทางการค้า การทำงานอย่างเงียบๆ ไม่กระโตกกระตากเพื่อความสำเร็จ",
        "en": "Solo strategy, clever competitive workarounds, protecting intellectual property, and keeping your cards close."
      },
      "finance": {
        "th": "ระวังการถูกขโมย ถูกโกง หรือถูกเอาเปรียบทางการเงิน ควรตรวจสอบบัญชีและเอกสารอย่างรอบคอบ",
        "en": "Beware of pickpockets, intellectual theft, hidden fees, and deceptive contractual fine print."
      },
      "health": {
        "th": "อาการป่วยที่ซ่อนเร้น ตรวจหาสาเหตุได้ยาก หรือการละเลยอาการป่วยเล็กๆ น้อยๆ จนอาจกลายเป็นเรื่องใหญ่",
        "en": "Subtle, masked health symptoms; get a second medical opinion and do not conceal lifestyle habits from doctors."
      },
      "advice": {
        "th": "ใช้สติปัญญาและไหวพริบในการปกป้องตนเอง แต่จงรักษาระดับศีลธรรม อย่าใช้อุบายที่ทำร้ายผู้อื่น",
        "en": "Act with strategic discretion. Be clever as a serpent, yet keep your core integrity intact."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความลับถูกเปิดเผย",
          "การสารภาพความจริง",
          "แผนการแตก",
          "การถูกจับได้",
          "การหันกลับมาซื่อสัตย์"
        ],
        "en": [
          "Confession",
          "Truth Revealed",
          "Cover Blown",
          "Coming Clean",
          "Return of Conscience"
        ]
      },
      "general": {
        "th": "ความลับที่ซ่อนไว้ถูกเปิดเผย แผนการที่ทำไว้ลับๆ แตก หรือความรู้สึกผิดในใจผลักดันให้ยอมรับความจริง",
        "en": "The thief caught in the act; secrets laid bare, coming clean to clear one's conscience, or changing shady tactics."
      },
      "love": {
        "th": "ความจริงเกี่ยวกับความสัมพันธ์ถูกเปิดโปง การสารภาพความจริงกับคนรักเพื่อเริ่มต้นใหม่ด้วยความซื่อสัตย์",
        "en": "Lies uncovered, confessions made, emotional infidelity brought into the open, demanding radical honesty."
      },
      "career": {
        "th": "การทุจริตหรือข้อผิดพลาดในที่ทำงานถูกตรวจพบ ถึงเวลาต้องรับผิดชอบและแก้ไขอย่างตรงไปตรงมา",
        "en": "Whistleblowing, audits uncovering errors, or discarding failed underhanded strategies for legitimate methods."
      },
      "finance": {
        "th": "จับคนโกงหรือผู้ที่ยักยอกเงินได้ หรือได้รับทรัพย์สินที่เคยถูกขโมยกลับคืนมา",
        "en": "Recovering stolen goods, catching fraudsters, or settling compromised financial accounts."
      },
      "health": {
        "th": "ค้นพบสาเหตุที่แท้จริงของอาการป่วยที่เคยหาสาเหตุไม่ได้ และเริ่มการรักษาที่ตรงจุด",
        "en": "Accurate diagnosis finally revealed, unmasking underlying causes of elusive physical symptoms."
      },
      "advice": {
        "th": "ความจริงใจคือเกราะคุ้มกันที่ดีที่สุด สารภาพความจริงและแก้ไขความผิดพลาดก่อนที่ทุกอย่างจะสายเกินไป",
        "en": "Step into the light. A clean conscience is the softest pillow; confess, make amends, and walk in truth."
      }
    }
  },
  "swords_8": {
    "upright": {
      "keywords": {
        "th": [
          "ความรู้สึกติดกับดัก",
          "การถูกผูกมัดทางความคิด",
          "ความสิ้นหวังลวงตา",
          "การจำกัดตนเอง",
          "ดาบล้อมรอบแปดเล่ม"
        ],
        "en": [
          "Feeling Trapped",
          "Self-Imposed Limitation",
          "Mental Blindfold",
          "Victim Mentality",
          "Helplessness"
        ]
      },
      "general": {
        "th": "หญิงสาวถูกมัดและผูกตาอยู่ท่ามกลางดาบแปดเล่มที่ปักล้อมรอบ แต่เชือกที่มัดไว้หลวมและมีช่องทางเดินออกได้ สื่อถึงความรู้สึกติดกับดักที่เกิดจากความคิดลบของตนเอง",
        "en": "A woman bound and blindfolded, surrounded by eight swords in muddy ground. Feeling powerless, trapped by limiting beliefs when freedom is within reach."
      },
      "love": {
        "th": "รู้สึกอึดอัดในความสัมพันธ์เหมือนตกเป็นเบลี้ยล่าง แต่ไม่กล้าเดินจากไปเพราะความกลัว",
        "en": "Feeling trapped in a toxic relationship, paralyzed by fear of independence, and overlooking your own power to leave."
      },
      "career": {
        "th": "รู้สึกตันในที่ทำงาน ไม่มีทางเลือกหรือหมดหนทางเติบโตก้าวหน้า แท้จริงแล้วเป็นเพราะความกลัวการเปลี่ยนแปลง",
        "en": "Career paralysis, feeling trapped in an unfulfilling job, and blinded by perceived lack of options."
      },
      "finance": {
        "th": "หนี้สินรัดตัวจนรู้สึกมืดแปดด้าน แต่หากตั้งสติจะพบว่ายังมีช่องทางปรับโครงสร้างหนี้และลดรายจ่ายได้",
        "en": "Financial anxiety creating mental paralysis; consult an advisor to see clear pathways out of debt."
      },
      "health": {
        "th": "โรคแพนิค ความวิตกกังวล อาการกลัวที่แคบ หรือปัญหาสายตาที่ทำให้รู้สึกไม่ปลอดภัย",
        "en": "Panic attacks, claustrophobia, psychosomatic paralysis, and anxiety-induced tension."
      },
      "advice": {
        "th": "ถอดผ้าผูกตาแห่งความกลัวออก เชือกที่มัดคุณไว้เป็นเพียงภาพลวงตา ก้าวเท้าออกมา คุณมีอิสรภาพเสมอ",
        "en": "Wiggle free from your loose bonds and remove the blindfold. You are not a victim; your freedom awaits."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การปลดปล่อยตนเอง",
          "การหลุดพ้นจากกรงขัง",
          "ความกระจ่างในทางออก",
          "การฟื้นคืนอำนาจ",
          "การก้าวสู่อิสรภาพ"
        ],
        "en": [
          "Freedom",
          "Breaking Free",
          "Empowerment",
          "Releasing Limiting Beliefs",
          "Overcoming Fear"
        ]
      },
      "general": {
        "th": "เชือกหลุดออกและผ้าผูกตาถูกทิ้งลง คุณตระหนักรู้ถึงพลังของตนเองและก้าวข้ามขีดจำกัดทางความคิดสู่อิสรภาพ",
        "en": "Slipping out of the ropes, casting off mental shackles, taking charge of your destiny, and finding the open gate."
      },
      "love": {
        "th": "กล้าที่จะพูดเพื่อปกป้องสิทธิของตนเองในชีวิตคู่ หรือตัดสินใจเดินออกจากความสัมพันธ์ที่เป็นพิษได้อย่างเด็ดขาด",
        "en": "Breaking free from codependent or abusive dynamics; regaining self-respect and stepping into autonomy."
      },
      "career": {
        "th": "ค้นพบทางออกของปัญหาในการทำงาน กล้าลาออกจากงานที่กดขี่เพื่อไปเริ่มต้นเส้นทางใหม่ที่สดใส",
        "en": "Finding creative loopholes, escaping toxic work environments, and claiming professional sovereignty."
      },
      "finance": {
        "th": "เริ่มปลดภาระหนี้สินได้ ค้นพบทางออกวิกฤตการเงินและมีแผนการจัดการเงินที่ชัดเจน",
        "en": "Breaking free from debt traps, negotiating successful debt relief, and regaining financial agency."
      },
      "health": {
        "th": "หายจากอาการแพนิค สุขภาพจิตดีขึ้นอย่างเห็นได้ชัด ความมั่นใจในตนเองช่วยฟื้นฟูร่างกาย",
        "en": "Overcoming chronic phobias, breathing freely, breaking panic cycles, and restoring inner strength."
      },
      "advice": {
        "th": "จงเชื่อมั่นในพลังและปัญญาของคุณ ไม่มีกรงขังใดสามารถกักขังวิญญาณที่ปรารถนาอิสรภาพได้อย่างแท้จริง",
        "en": "Embrace your sovereign power. You have broken the chains of illusion; walk forward into the open sun."
      }
    }
  },
  "swords_9": {
    "upright": {
      "keywords": {
        "th": [
          "ฝันร้ายนอนไม่หลับ",
          "ความวิตกกังวลรุนแรง",
          "ความรู้สึกผิดในใจ",
          "ความทรมานทางจิต",
          "ดาบเก้าเล่มในความมืด"
        ],
        "en": [
          "Nightmares",
          "Severe Anxiety",
          "Insomnia",
          "Guilt",
          "Mental Anguish"
        ]
      },
      "general": {
        "th": "ร่างผู้หนึ่งสะดุ้งตื่นขึ้นมาเอามือปิดหน้าบนเตียงท่ามกลางความมืด มีดาบเก้าเล่มแขวนอยู่เหนือศีรษะ สื่อถึงความเครียด ความวิตกกังวล และฝันร้ายที่รุมเร้าจิตใจ",
        "en": "A figure waking up weeping into their hands on a bed beneath nine dark swords. Intense mental torment, sleepless nights, guilt, and terror of the mind."
      },
      "love": {
        "th": "ความกังวลและหวาดระแวงในคนรักจนนอนไม่หลับ กลัวการสูญเสียหรือความลับในอดีตสร้างความทุกข์ใจ",
        "en": "Paralyzing relationship anxiety, dread of betrayal, morbid fear of abandonment, and tearful nights."
      },
      "career": {
        "th": "ความเครียดสะสมจากแรงกดดันในที่ทำงาน กลัวความผิดพลาดจนไม่สามารถนอนหลับได้เต็มอิ่ม",
        "en": "Extreme work stress, dreading catastrophic failures, deadline insomnia, and psychological burnout."
      },
      "finance": {
        "th": "วิตกกังวลเรื่องเงินทองและหนี้สินจนเกินเหตุ ความกลัวความล้มเหลวสร้างความทรมานใจมากกว่าความจริง",
        "en": "Catastrophizing financial situations, midnight panic over bills, and dread outstripping reality."
      },
      "health": {
        "th": "โรคนอนไม่หลับ ไมเกรนกำเริบ อาการซึมเศร้า หรือภาพหลอนจากความเครียดเรื้อรัง",
        "en": "Severe insomnia, panic attacks, stress migraines, chronic exhaustion, and depressive spirals."
      },
      "advice": {
        "th": "จำไว้ว่าความกลัวส่วนใหญ่เกิดขึ้นในความคิดของคุณเอง เปิดไฟและพูดคุยกับคนที่คุณไว้ใจ ความมืดจะสลายไปเมื่อเผชิญหน้ากับความจริง",
        "en": "Most of your nightmares exist only in your mind. Turn on the light, speak your fears aloud, and watch them shrink."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "รุ่งอรุณหลังฝันร้าย",
          "ความหวังกลับคืน",
          "การก้าวผ่านความกลัว",
          "การยอมรับความจริง",
          "การนอนหลับอย่างสงบ"
        ],
        "en": [
          "Hope Returning",
          "Nightmare Ending",
          "Recovery from Anxiety",
          "Seeking Help",
          "Light Dawning"
        ]
      },
      "general": {
        "th": "ฝันร้ายเริ่มสิ้นสุดลง แสงแรกของวันใหม่กำลังสาดส่องเข้ามา คุณเริ่มตระหนักว่าสถานการณ์ไม่ได้เลวร้ายอย่างที่กลัว",
        "en": "Dawn breaking through the bedroom window; the fever of anxiety breaks, and practical coping mechanisms restore calm."
      },
      "love": {
        "th": "เปิดใจพูดคุยกับคนรักเพื่อคลายความกังวล พบว่าสิ่งที่กลัวไม่ได้เกิดขึ้นจริง ความสัมพันธ์กลับมาอบอุ่น",
        "en": "Reassurance from your partner dissolves paranoia; ending silent suffering and restoring emotional safety."
      },
      "career": {
        "th": "ปัญหาในการทำงานได้รับการแก้ไข ความกังวลคลี่คลาย สามารถจัดการภาระงานได้อย่างมีสติ",
        "en": "Workplace crisis averted, regaining perspective on professional challenges, and stress subsiding."
      },
      "finance": {
        "th": "พบทางออกเรื่องเงินที่ทำให้สบายใจขึ้น เลิกวิตกกังวลเกินเหตุและเริ่มจัดการงบประมาณอย่างเป็นระบบ",
        "en": "Discovering financial remedies that alleviate panic; realistic budgeting replacing irrational dread."
      },
      "health": {
        "th": "เริ่มนอนหลับได้ดีขึ้น อาการปวดหัวลดลง การได้รับการบำบัดรักษาทางจิตวิทยาเริ่มเห็นผลดี",
        "en": "Restorative sleep returning, cortisol levels dropping, and successful recovery from nervous breakdowns."
      },
      "advice": {
        "th": "ปล่อยวางความกังวลที่ไร้ประโยชน์ สูดลมหายใจลึกๆ และก้าวสู่วันใหม่ด้วยความหวังและพลังบวก",
        "en": "Step out of bed and greet the morning. The phantom terrors of the night have vanished in the sunrise."
      }
    }
  },
  "swords_10": {
    "upright": {
      "keywords": {
        "th": [
          "จุดต่ำสุดของชีวิต",
          "การสิ้นสุดอันเจ็บปวด",
          "การถูกหักหลังแทงข้างหลัง",
          "มืดมิดที่สุดก่อนรุ่งสาง",
          "การยุติอย่างถาวร"
        ],
        "en": [
          "Rock Bottom",
          "Painful Ending",
          "Betrayal",
          "Darkest Before Dawn",
          "Complete Defeat"
        ]
      },
      "general": {
        "th": "ร่างนอนคว่ำริมทะเลถูกดาบสิบเล่มปักอยู่บนแผ่นหลัง แต่ที่ขอบฟ้าเริ่มมีแสงสีทองแห่งรุ่งอรุณปรากฏขึ้น สื่อถึงจุดต่ำสุดที่ไม่อาจแย่ไปกว่านี้ได้อีกแล้ว การสิ้นสุดเพื่อเริ่มต้นใหม่",
        "en": "A fallen figure pierced by ten swords beneath a pitch-black sky with a golden dawn breaking on the horizon. Rock bottom, total exhaustion, and the absolute end of a painful cycle."
      },
      "love": {
        "th": "การเลิกราที่เจ็บปวดถึงที่สุด ถูกหักหลังอย่างไม่น่าให้อภัย แต่เป็นสัญญาณว่าความทุกข์ทรมานได้สิ้นสุดลงแล้ว",
        "en": "Devastating breakup, betrayal laid bare, hitting rock bottom in romance; the painful chapter is definitively over."
      },
      "career": {
        "th": "โปรเจกต์ล้มเหลวโดยสิ้นเชิง การถูกเลิกจ้างหรือถูกแทงข้างหลังในที่ทำงาน แต่ประตูแห่งโอกาสใหม่กำลังจะเปิดออก",
        "en": "Total collapse of a venture, severe betrayal by colleagues, catastrophic redundancy, but clearing the slate clean."
      },
      "finance": {
        "th": "ล้มละลายหรือสูญเสียเงินทองอย่างหนัก จุดต่ำสุดทางการเงินที่ต้องยอมรับความจริงและเริ่มต้นสร้างใหม่",
        "en": "Hitting financial rock bottom, bankruptcy, or absolute liquidation; no further down to go than up."
      },
      "health": {
        "th": "ปัญหากระดูกสันหลัง อาการบาดเจ็บรุนแรง หรือความเหนื่อยล้าทางร่างกายและจิตใจถึงขีดสุด จำเป็นต้องได้รับการดูแลเร่งด่วน",
        "en": "Spinal back injuries, physical collapse from extreme strain, or hitting the absolute nadir of exhaustion."
      },
      "advice": {
        "th": "ยอมรับการสิ้นสุดนี้โดยไม่ขัดขืน เมื่อถึงจุดต่ำสุดแล้ว หนทางเดียวที่เหลืออยู่คือการก้าวขึ้นสู่แสงสว่าง",
        "en": "Surrender to the ending. The worst has already happened; look to the horizon where the new dawn begins."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การฟื้นคืนชีพ",
          "การรอดชีวิตหวุดหวิด",
          "การลุกขึ้นใหม่อีกครั้ง",
          "การเริ่มฟื้นตัวจากซากปรัก",
          "ความหวังใหม่"
        ],
        "en": [
          "Resurrection",
          "Near-Death Survival",
          "Rising Again",
          "Recovery from Ruin",
          "Fresh Start"
        ]
      },
      "general": {
        "th": "คุณกำลังดึงดาบออกจากหลังและลุกขึ้นยืนใหม่ แม้จะมีบาดแผลแต่คุณรอดชีวิตมาได้และพร้อมจะสร้างชีวิตใหม่อย่างเข้มแข็ง",
        "en": "Rising from the ashes; pulling the swords from your back, surviving the catastrophe, and beginning the miraculous climb back."
      },
      "love": {
        "th": "เริ่มทำใจได้และลุกขึ้นยืนใหม่หลังจากผ่านการเลิกราที่สาหัส หรือคู่รักปรับความเข้าใจกันได้หลังจากผ่านวิกฤตเกือบแตกหัก",
        "en": "Miraculous romantic resurrection after near-divorce, or picking oneself up after heartbreak with hardened resilience."
      },
      "career": {
        "th": "เริ่มสร้างธุรกิจหรือหน้าที่การงานใหม่หลังจากล้มเหลว ประสบการณ์อันเจ็บปวดกลายเป็นบทเรียนที่มีค่ายิ่ง",
        "en": "Rebuilding career from scratch, surviving corporate liquidation, and turning failure into an invaluable masterclass."
      },
      "finance": {
        "th": "เริ่มฟื้นฟูสถานะทางการเงินหลังจากผ่านพ้นวิกฤตล้มละลายหรือหนี้สิน เริ่มเห็นแสงสว่างที่ปลายอุโมงค์",
        "en": "Emerging from bankruptcy, restructuring liabilities, and taking the first solid steps toward wealth rebuilding."
      },
      "health": {
        "th": "รอดพ้นจากอาการโคม่าหรือโรคร้ายแรงได้อย่างปาฏิหาริย์ ร่างกายเริ่มตอบสนองต่อการฟื้นฟู",
        "en": "Miraculous health turnaround, surviving critical medical emergencies, and slow, determined regeneration."
      },
      "advice": {
        "th": "จงภูมิใจที่คุณรอดชีวิตมาได้ บาดแผลที่คุณมีคือเหรียญกล้าหาญ จงก้าวไปข้างหน้าด้วยหัวใจที่ไม่ยอมแพ้",
        "en": "Rise, phoenix. You have survived the darkest night; now rebuild your empire with the indestructible gold of wisdom."
      }
    }
  },
  "swords_11": {
    "upright": {
      "keywords": {
        "th": [
          "ผู้สอดส่องหาความจริง",
          "สติปัญญาวัยเยาว์",
          "ความตื่นตัวรอบด้าน",
          "การสืบหาข้อมูล",
          "ความกล้าคิดกล้าพูด"
        ],
        "en": [
          "Inquisitive Watcher",
          "Sharp Student",
          "Truth Seeker",
          "Vigilance",
          "Mental Agility"
        ]
      },
      "general": {
        "th": "เด็กหนุ่มยืนถือดาบสองมือบนเนินดิน สายตาตื่นตัวมองไปรอบข้าง สื่อถึงความกระหายใคร่รู้ สติปัญญาที่เฉียบแหลม และการเฝ้าระวังเพื่อค้นหาความจริง",
        "en": "An agile youth standing on windy cliffs holding an upright sword, glancing vigilantly over his shoulder. Sharp curiosity, keen intellect, and seeking truth."
      },
      "love": {
        "th": "การสืบเรื่องของคนที่ชอบในโซเชียลมีเดีย หรือการพูดคุยที่เน้นการแลกเปลี่ยนทางความคิดมากกว่าอารมณ์",
        "en": "Snooping on crushes online, intellectual banter, or feeling guarded while probing someone's true motives."
      },
      "career": {
        "th": "การค้นคว้าข้อมูล วิจัยตลาด หรือการเป็นผู้สังเกตการณ์ที่จับตามองแนวโน้มใหม่ๆ การเริ่มต้นเรียนรู้ทักษะเฉพาะทาง",
        "en": "Market research, investigative analysis, competitive intelligence, and junior roles demanding sharp wits."
      },
      "finance": {
        "th": "การสืบค้นข้อมูลก่อนการลงทุน ตรวจสอบสัญญาและรายละเอียดตัวเลขอย่างถี่ถ้วนเพื่อป้องกันการถูกเอาเปรียบ",
        "en": "Vigilant financial auditing, researching consumer rights, and sniffing out fine-print traps."
      },
      "health": {
        "th": "ระบบประสาทตื่นตัวสูง ความคิดแล่นเร็ว ระวังความเครียดที่เกิดจากการคิดวิเคราะห์มากเกินไป",
        "en": "Hyperactive nervous system, eye strain from research, and minor sprains from agile sports."
      },
      "advice": {
        "th": "จงสงสัยและค้นหาความจริงด้วยสติปัญญา แต่อย่าปล่อยให้ความอยากรู้กลายเป็นการสอดรู้สอดเห็นหรือความหวาดระแวง",
        "en": "Stay curious and vigilant. Question assumptions, gather intel, and speak truth with sharp clarity."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การสอดรู้สอดเห็น",
          "การปล่อยข่าวลือ",
          "คำพูดก้าวร้าวไร้กาลเทศะ",
          "คนปากสว่าง",
          "ความหวาดระแวงไร้เหตุผล"
        ],
        "en": [
          "Gossip",
          "Paranoia",
          "Spiteful Words",
          "Blabbermouth",
          "Snooping"
        ]
      },
      "general": {
        "th": "การใช้ความฉลาดในทางที่ผิด การปล่อยข่าวลือ นินทาว่าร้าย หรือพฤติกรรมสอดรู้สอดเห็นเรื่องของคนอื่นจนสร้างความเดือดร้อน",
        "en": "Malicious gossip, cyber-stalking, spiteful tongues, indiscretion, and weaponized petty intelligence."
      },
      "love": {
        "th": "แอบเช็กโทรศัพท์หรือแชตของคนรักด้วยความหวาดระแวง การประชดประชันหรือคำพูดทำร้ายความรู้สึก",
        "en": "Jealous phone snooping, toxic distrust, spreading rumors about an ex, or immature defensive bickering."
      },
      "career": {
        "th": "การรั่วไหลของข้อมูลความลับ การนินทาในที่ทำงานที่บั่นทอนบรรยากาศ หรือการแสดงความคิดเห็นที่ไม่รอบคอบ",
        "en": "Office gossip, leaky confidentiality, immature insubordination, or biting critiques backfiring."
      },
      "finance": {
        "th": "หลงเชื่อข่าวลือหรือข้อมูลเท็จในตลาดหุ้นจนเกิดความเสียหายทางการเงิน",
        "en": "Acting on unverified insider gossip, falling for fraudulent financial tips on social media."
      },
      "health": {
        "th": "โรควิตกกังวลจากการเสพข่าวสารมากเกินไป (Doomscrolling) ปวดตาและปวดขมับ",
        "en": "Doomscrolling addiction, sensory exhaustion, vocal strain, and nervous twitches."
      },
      "advice": {
        "th": "ควบคุมลิ้นและคำพูดของคุณ ข้อมูลที่ขาดความเมตตามีแต่จะสร้างศัตรูและความหายนะ",
        "en": "Hold your tongue. Words are weapons; do not use intelligence to wound when silence would heal."
      }
    }
  },
  "swords_12": {
    "upright": {
      "keywords": {
        "th": [
          "อัศวินผู้พุ่งทะยาน",
          "ความเด็ดเดี่ยวกล้าหาญ",
          "การบุกทะลวงด้วยปัญญา",
          "ความรวดเร็วเฉียบคม",
          "ความตรงไปตรงมา"
        ],
        "en": [
          "Fierce Charge",
          "Ambition",
          "Intellectual Fury",
          "Blunt Honesty",
          "Swift Action"
        ]
      },
      "general": {
        "th": "อัศวินควบม้าพุ่งทะยานไปข้างหน้าท่ามกลางพายุ ชูดาบฟาดฟันอย่างไม่กลัวเกรง สื่อถึงความมุ่งมั่นเด็ดเดี่ยว การลงมือทำอย่างรวดเร็วและตรงไปตรงมา",
        "en": "The ferocious knight charging headlong into the howling gale with sword drawn high. Relentless intellectual ambition, decisive speed, and blunt force."
      },
      "love": {
        "th": "การรุกจีบอย่างตรงไปตรงมาไม่อ้อมค้อม แต่อาจขาดความอ่อนหวานและโรแมนติก ควรระวังคำพูดขวานผ่าซาก",
        "en": "Direct, aggressive courtship; honest declarations, but watch out for unintentional emotional tactlessness."
      },
      "career": {
        "th": "การแก้ปัญหาเฉพาะหน้าด้วยความรวดเร็วและเฉียบขาด การบุกเบิกโครงการที่ท้าทาย ชนะการแข่งขันด้วยความกล้าหาญ",
        "en": "Storming professional hurdles, assertive executive action, rapid turnaround times, and fearless ambition."
      },
      "finance": {
        "th": "การตัดสินใจทางการเงินที่รวดเร็วและเด็ดขาด กล้าตัดขายหรือซื้อในจังหวะที่คนอื่นลังเล",
        "en": "Decisive, aggressive market moves; cutting through red tape to secure profitable positions."
      },
      "health": {
        "th": "พลังงานร่างกายสูงมาก อะดรีนาลีนสูบฉีด ระวังอุบัติเหตุจากการเร่งรีบหรือการขับขี่รถเร็ว",
        "en": "Surging adrenaline, fast reflexes; caution against speeding, collisions, or impact injuries."
      },
      "advice": {
        "th": "มุ่งมั่นสู่เป้าหมายด้วยความกล้าหาญ แต่อย่าลืมมองสภาพแวดล้อมและระวังไม่ให้ความตรงไปตรงมาไปทำร้ายใคร",
        "en": "Charge forward with clear aim. Combine fierce speed with strategic wisdom, and do not trample innocence."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความบ้าคลั่งหุนหัน",
          "การทำลายล้างไร้ทิศทาง",
          "คำพูดก้าวร้าวรุนแรง",
          "ความหยิ่งยโส",
          "การพุ่งชนความพินาศ"
        ],
        "en": [
          "Recklessness",
          "Aggression",
          "Blunt Cruelty",
          "Hasty Ruin",
          "Arrogant Blunder"
        ]
      },
      "general": {
        "th": "ความใจร้อนบุ่มบ่ามจนกลายเป็นการทำลายล้าง การพุ่งชนอุปสรรคโดยไม่วางแผนจนบาดเจ็บสาหัส หรือการใช้ความรุนแรงทางวาจา",
        "en": "A reckless berserker rushing blindly into an ambush. Arrogant posturing, verbal cruelty, and chaotic haste."
      },
      "love": {
        "th": "การทะเลาะวิวาทอย่างรุนแรง ใช้คำพูดที่หยาบคายทำร้ายจิตใจ หรือการบังคับข่มขู่คนรัก",
        "en": "Volatile arguments, verbal abuse, arrogant dismissal of partner's feelings, or aggressive confrontations."
      },
      "career": {
        "th": "โครงการพังพินาศเพราะการตัดสินใจที่บุ่มบ่าม ทะเลาะกับผู้ใหญ่หรือลูกค้าจนเสียงานใหญ่",
        "en": "Alienating clients with abrasive arrogance, reckless business blunders, and disastrous tactical errors."
      },
      "finance": {
        "th": "สูญเสียเงินก้อนโตเพราะความใจร้อนรีบเก็งกำไรโดยไม่รอบคอบ หรือการฟ้องร้องทางกฎหมายที่แพ้คดี",
        "en": "Disastrous speculative losses, lawsuits born of abrasive conduct, and financial wreckage from hasty choices."
      },
      "health": {
        "th": "อุบัติเหตุรุนแรงจากการขับขี่เร็วหรือการทะเลาะวิวาท บาดเจ็บที่กระดูกหรือศีรษะ",
        "en": "High risk of car crashes, sports concussions, fracture injuries, and acute exhaustion from anger."
      },
      "advice": {
        "th": "หยุดม้าของคุณเดี๋ยวนี้! ความเร็วที่ไร้สติปัญญาจะนำพาคุณไปสู่หน้าผา ดึงสติและควบคุมตนเองให้ได้",
        "en": "Pull back the reins immediately! Blind speed without foresight is suicidal; calm your mind."
      }
    }
  },
  "swords_13": {
    "upright": {
      "keywords": {
        "th": [
          "ราชินีแห่งความเฉียบคม",
          "ปัญญาบริสุทธิ์",
          "การแยกแยะถูกผิด",
          "ความยุติธรรมเป็นกลาง",
          "ความเป็นอิสระเด็ดเดี่ยว"
        ],
        "en": [
          "Astute Discernment",
          "Impartial Truth",
          "Sharp Intellect",
          "Clear Boundaries",
          "Independence"
        ]
      },
      "general": {
        "th": "ราชินีนั่งบนบัลลังก์สูงตระหง่าน มือขวาถือดาบตรง มือซ้ายผายออกเพื่อรับความจริง สื่อถึงปัญญาที่เฉียบแหลม ความเป็นกลาง และการมีขอบเขตที่ชัดเจน",
        "en": "The solemn queen seated on her high stone throne holding her sword aloft, extending a welcoming hand to truth. Sharp discernment, impartial judgment, and fearless independence."
      },
      "love": {
        "th": "ความรักที่อยู่บนพื้นฐานของความเคารพและความเป็นจริง ไม่ยอมทนกับความไม่ซื่อสัตย์ คนโสดรักความอิสระและเลือกคนที่จะเข้ามาในชีวิตอย่างพิถีพิถัน",
        "en": "Mature love based on mutual truth, sharp wit, and clear boundaries. Singles enjoy empowered independence and tolerate no nonsense."
      },
      "career": {
        "th": "ความเฉียบขาดในการบริหารงาน การวิเคราะห์และตัดสินใจที่เที่ยงธรรม ได้รับความเคารพนับถือในฐานะผู้เชี่ยวชาญที่มีมาตรฐานสูง",
        "en": "Masterful analysis, editorial excellence, legal acumen, and commanding respect for unyielding competence."
      },
      "finance": {
        "th": "จัดการการเงินอย่างมีระเบียบวินัยและโปร่งใส ไม่ใช้จ่ายตามอารมณ์ ตัดสินใจด้วยตัวเลขจริง",
        "en": "Meticulous fiscal discipline, rigorous audits, and sound long-term budgeting stripped of emotional bias."
      },
      "health": {
        "th": "สุขภาพแข็งแรง ระบบทางเดินหายใจและสมองทำงานได้ดี การรักษาสุขอนามัยอย่างเคร่งครัด",
        "en": "Good respiratory health, sharp cognitive clarity, and disciplined adherence to wellness protocols."
      },
      "advice": {
        "th": "ใช้ปัญญาและเหตุผลในการตัดสินใจ รักษาระเบียบและขอบเขตของคุณไว้อย่างเข้มแข็ง ความจริงจะปกป้องคุณเสมอ",
        "en": "Cut through emotional fog with razor-sharp truth. Maintain firm boundaries and let discernment be your crown."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความเย็นชาโหดร้าย",
          "คำพูดเชือดเฉือน",
          "ความขมขื่นใจ",
          "ความมีอคติ",
          "การแก้แค้น"
        ],
        "en": [
          "Cold Cruelty",
          "Bitter Sarcasm",
          "Resentment",
          "Biased Judgment",
          "Malice"
        ]
      },
      "general": {
        "th": "ความเจ็บปวดในอดีตเปลี่ยนเป็นความเย็นชาและเคียดแค้น การใช้คำพูดประชดประชันเชือดเฉือนทำร้ายคนอื่น หรือการตัดสินผู้อื่นอย่างอยุติธรรม",
        "en": "Wounded intellect turning into icy cynicism, bitter score-keeping, cutting sarcasm, and emotionally closed-off cruelty."
      },
      "love": {
        "th": "ความสัมพันธ์ที่เย็นชา ขาดความอบอุ่น จับผิดและใช้วาจาเชือดเฉือนคนรักตลอดเวลาเพราะความแค้นฝังใจ",
        "en": "Icy aloofness, passive-aggressive criticism, weaponizing intellect against a partner, or refusing intimacy."
      },
      "career": {
        "th": "การเป็นหัวหน้าที่เผด็จการและไร้ความเมตตา บรรยากาศการทำงานเต็มไปด้วยความหวาดกลัวและคำตำหนิที่รุนแรง",
        "en": "Hyper-critical management style, vindictive office politics, and destroying morale through relentless fault-finding."
      },
      "finance": {
        "th": "ปัญหาข้อพิพาททางกฎหมายที่เต็มไปด้วยความแค้น หรือการถูกลงโทษทางการเงินจากความเข้มงวดเกินไป",
        "en": "Spiteful legal litigation draining resources, petty financial penalties, or cold-hearted contractual maneuvers."
      },
      "health": {
        "th": "ความเครียดสะสมส่งผลให้กล้ามเนื้อใบหน้าและขากรรไกรเกร็ง โรคเกี่ยวกับระบบประสาทและทางเดินหายใจ",
        "en": "Chronic jaw clenching (TMJ), respiratory constriction from repressed grief, and neuro-muscular tension."
      },
      "advice": {
        "th": "ละลายความเย็นชาในหัวใจด้วยความเมตตา ความเฉียบคมที่ไร้ความรักจะกลายเป็นยาพิษที่ทำลายตัวคุณเอง",
        "en": "Lower your icy defenses. Sharpness without compassion becomes cruelty; allow your heart to soften."
      }
    }
  },
  "swords_14": {
    "upright": {
      "keywords": {
        "th": [
          "ราชาแห่งความยุติธรรม",
          "ผู้นำทางปัญญาขั้นสูง",
          "อำนาจแห่งกฎหมาย",
          "การตัดสินใจเด็ดขาดเที่ยงธรรม",
          "ผู้เชี่ยวชาญทรงอิทธิพล"
        ],
        "en": [
          "Intellectual Authority",
          "Impartial Justice",
          "Analytical Mastery",
          "Truth and Law",
          "Sovereign Mind"
        ]
      },
      "general": {
        "th": "ราชาประทับบนบัลลังก์อย่างสง่างาม ถือพระแสงดาบตรง สื่อถึงผู้นำที่มีสติปัญญาสูงสุด ยึดมั่นในความจริง ความยุติธรรม และกฎเกณฑ์อันเที่ยงตรง",
        "en": "The sovereign monarch of swords seated upon his stone throne with blade held upright. Supreme intellectual authority, impartial justice, analytical mastery, and unwavering truth."
      },
      "love": {
        "th": "คนรักที่เป็นผู้ใหญ่ มีเหตุผล ยึดมั่นในความซื่อสัตย์ ให้คำปรึกษาและเป็นที่พึ่งพาทางความคิดได้ยอดเยี่ยม",
        "en": "An articulate, principled, and fair-minded partner; communicating with profound intellectual clarity and deep integrity."
      },
      "career": {
        "th": "ตำแหน่งผู้พิพากษา ที่ปรึกษากฎหมาย ผู้บริหารระดับสูง หรือนักวิเคราะห์ระดับชาติ คำตัดสินของคุณมีอำนาจและได้รับการยอมรับ",
        "en": "Distinguished leadership in law, government, executive analysis, and strategic governance commanding undisputed authority."
      },
      "finance": {
        "th": "บริหารจัดการทรัพย์สินด้วยหลักการที่รัดกุม การตัดสินใจทางการเงินถูกต้องตามกฎหมายและสร้างผลตอบแทนที่มั่นคง",
        "en": "Impeccable fiscal governance, legally sound commercial contracts, and strategic asset allocation."
      },
      "health": {
        "th": "ระบบประสาทและสมองยอดเยี่ยม มีวินัยในการดูแลสุขภาพและปฏิบัติตามคำสั่งแพทย์อย่างเคร่งครัด",
        "en": "Sound mental health, balanced neurological functions, and disciplined adherence to medical advice."
      },
      "advice": {
        "th": "ตัดสินใจบนพื้นฐานของข้อเท็จจริงและความยุติธรรม จงใช้สติปัญญาและอำนาจเพื่อปกป้องความถูกต้อง",
        "en": "Stand firmly upon absolute truth. Let logic, justice, and unyielding integrity govern your every decree."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การใช้อำนาจกดขี่",
          "การบิดเบือนกฎหมาย",
          "ความฉลาดแกมโกง",
          "ความโหดเหี้ยมเผด็จการ",
          "การตัดสินที่ไม่เป็นธรรม"
        ],
        "en": [
          "Tyranny",
          "Abuse of Power",
          "Cruel Intellect",
          "Legal Manipulation",
          "Authoritarianism"
        ]
      },
      "general": {
        "th": "การใช้ความฉลาดและอำนาจในทางที่ผิด บิดเบือนความจริงเพื่อประโยชน์ตนเอง หรือการเป็นเผด็จการที่ไร้ความปรานี",
        "en": "Corrupt abuse of authority, weaponized bureaucracy, ruthless legal tyranny, and cold manipulation of facts."
      },
      "love": {
        "th": "คนรักชอบบงการ ใช้ตรรกะวิบัติกดขี่อีกฝ่าย ไม่ยอมรับฟังความรู้สึกและทำให้รู้สึกว่าตนเองผิดเสมอ",
        "en": "Gaslighting, emotional dictatorship, treating a partner like a defendant in a courtroom, and zero empathy."
      },
      "career": {
        "th": "การตัดสินใจที่อยุติธรรมในที่ทำงาน การใช้อำนาจกลั่นแกล้ง หรือข้อพิพาททางกฎหมายที่เต็มไปด้วยเล่ห์เหลี่ยม",
        "en": "Hostile corporate bullying, corrupt legal maneuvers, and dictatorial leadership sparking mutiny."
      },
      "finance": {
        "th": "ระวังการถูกเอาเปรียบทางกฎหมาย คดีความที่ไม่เป็นธรรม หรือการถูกปรับเงินก้อนโตจากสัญญาที่ไม่โปร่งใส",
        "en": "Heavy fines from regulatory violations, losing predatory court battles, and corrupt fiscal exploitation."
      },
      "health": {
        "th": "ความดันโลหิตสูง โรคหลอดเลือดสมอง หรือความเครียดรุนแรงจากความขัดแย้งและคดีความ",
        "en": "Cerebrovascular strain, severe hypertension, and nervous exhaustion from chronic adversarial conflict."
      },
      "advice": {
        "th": "หยุดใช้อำนาจและสติปัญญาเพื่อกดขี่ผู้อื่น ความยุติธรรมที่แท้จริงต้องมาพร้อมกับความเมตตาธรรม",
        "en": "Lay down tyranny. Intellect divorced from conscience leads only to ruin; rule with honor and mercy."
      }
    }
  },
  "pentacles_1": {
    "upright": {
      "keywords": {
        "th": [
          "เมล็ดพันธุ์แห่งความมั่งคั่ง",
          "โอกาสทางการเงินใหม่",
          "ความมั่นคงจับต้องได้",
          "โชคลาภเป็นรูปธรรม",
          "ความอุดมสมบูรณ์แรก"
        ],
        "en": [
          "Tangible Opportunity",
          "Financial Seed",
          "Material Manifestation",
          "Abundance",
          "Prosperity"
        ]
      },
      "general": {
        "th": "มือแห่งสวรรค์ยื่นเหรียญทองคำเปล่งประกายเหนือสวนดอกลิลลี่ สื่อถึงโอกาสอันล้ำค่าในการสร้างความมั่งคั่ง ความมั่นคงในโลกวัตถุ และการเริ่มต้นที่มีรากฐานแข็งแกร่ง",
        "en": "The divine hand extending a shining golden pentacle over a lush garden of lilies and roses. A golden seed of tangible wealth, prosperity, and solid material beginnings."
      },
      "love": {
        "th": "ความรักที่มั่นคงและจริงจัง มีความพร้อมทั้งทางอารมณ์และฐานะทางการเงิน คนโสดมีเกณฑ์พบคนที่มีฐานะมั่นคง น่าเชื่อถือ",
        "en": "A stable, grounded love offering security and tangible commitment. Singles meet a dependable partner with solid prospects."
      },
      "career": {
        "th": "ได้รับข้อเสนองานใหม่ที่ให้ผลตอบแทนสูง โอกาสเริ่มต้นธุรกิจหรือการลงทุนที่ให้ผลกำไรงามในระยะยาว",
        "en": "Lucrative job offers, solid promotions with pay raises, and launching ventures built upon practical feasibility."
      },
      "finance": {
        "th": "โอกาสทางการเงินที่ยอดเยี่ยม ได้รับเงินก้อน มรดก โบนัส หรือการลงทุนที่เริ่มงอกเงยเป็นกำไรจริง",
        "en": "Tangible windfalls, capital injections, high-return investments, and solid financial security materializing."
      },
      "health": {
        "th": "สุขภาพร่างกายสมบูรณ์แข็งแรง ร่างกายตอบสนองดีต่ออาหารและยาที่มีคุณภาพ การดูแลสุขภาพให้ผลลัพธ์ประจักษ์",
        "en": "Robust physical health, strong stamina, fertile vitality, and excellent response to nourishing care."
      },
      "advice": {
        "th": "คว้าโอกาสทองนี้ไว้และปลูกมันลงบนดินที่อุดมสมบูรณ์ วางแผนทางการเงินอย่างรอบคอบเพื่ออนาคตที่ยั่งยืน",
        "en": "Plant this golden seed in fertile soil. Nurture tangible goals with patience, practicality, and steady discipline."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "โอกาสทางการเงินหลุดลอย",
          "การลงทุนผิดพลาด",
          "การขาดแคลนเงินทุน",
          "ความโลภ",
          "รากฐานไม่มั่นคง"
        ],
        "en": [
          "Missed Financial Opportunity",
          "Bad Investment",
          "Scarcity",
          "Greed",
          "Shaky Foundation"
        ]
      },
      "general": {
        "th": "โอกาสทองอาจหลุดลอยไปเพราะความลังเล หรือการเริ่มต้นธุรกิจที่มีรากฐานไม่มั่นคง ระวังการสูญเสียเงินทองจากความประมาท",
        "en": "The coin slipping through fingers: missed financial chances, bad investment timing, or starting projects on fragile financial foundations."
      },
      "love": {
        "th": "ปัญหาเรื่องเงินทองหรือความไม่พร้อมทางฐานะสร้างอุปสรรคให้ความรัก หรือมองความสัมพันธ์เป็นเรื่องผลประโยชน์",
        "en": "Financial strain eroding romantic harmony, materialism overshadowing affection, or broken commitments over money."
      },
      "career": {
        "th": "ข้อเสนองานถูกยกเลิก โครงการไม่ผ่านการอนุมัติงบประมาณ หรือธุรกิจสะดุดเพราะขาดสภาพคล่องทางการเงิน",
        "en": "Lost job offers, slashed project budgets, supply chain disruptions, and shaky career prospects."
      },
      "finance": {
        "th": "การลงทุนขาดทุน รายจ่ายมากกว่ารายรับ เสียเงินไปกับการซื้อของราคาแพงแต่ไร้ประโยชน์",
        "en": "Financial setbacks, plummeting asset values, delayed payments, and wasteful spending draining savings."
      },
      "health": {
        "th": "ละเลยการดูแลสุขภาพทางกาย ขาดการออกกำลังกาย หรือมีปัญหาเกี่ยวกับระบบโภชนาการและน้ำหนักตัว",
        "en": "Neglecting physical wellness, poor dietary habits leading to nutritional deficiencies, and low vitality."
      },
      "advice": {
        "th": "ตรวจสอบสถานะทางการเงินอย่างละเอียด รัดเข็มขัดและหลีกเลี่ยงการลงทุนที่มีความเสี่ยงสูงในช่วงนี้",
        "en": "Reassess your material foundations. Avoid speculative risks, live within your means, and rebuild savings."
      }
    }
  },
  "pentacles_2": {
    "upright": {
      "keywords": {
        "th": [
          "การจัดสรรเวลาและเงิน",
          "การหมุนเงินอย่างคล่องแคล่ว",
          "ความยืดหยุ่นปรับตัว",
          "การรับมือหลายด้าน",
          "สมดุลท่ามกลางคลื่นลม"
        ],
        "en": [
          "Juggling Priorities",
          "Financial Balance",
          "Adaptability",
          "Multitasking",
          "Flexibility"
        ]
      },
      "general": {
        "th": "ชายหนุ่มร่ายรำถือเหรียญสองเหรียญที่ล้อมรอบด้วยสัญลักษณ์อินฟินิตี้ เบื้องหลังมีเรือแล่นบนเกลียวคลื่น สื่อถึงความสามารถในการปรับตัวและจัดสรรทรัพยากรหลายอย่างพร้อมกันได้อย่างยอดเยี่ยม",
        "en": "A nimble figure juggling two golden pentacles looped in the infinity symbol against rolling sea waves. Dynamic multitasking, financial flexibility, and balancing priorities."
      },
      "love": {
        "th": "ต้องจัดสรรเวลาให้ดีระหว่างงานกับความรัก อย่าให้ความยุ่งทำให้คนรักรู้สึกถูกทอดทิ้ง ปรับตัวเข้าหากันอย่างยืดหยุ่น",
        "en": "Balancing romantic intimacy with hectic work schedules; maintaining a playful, flexible attitude in love."
      },
      "career": {
        "th": "การทำงานหลายโปรเจกต์พร้อมกันได้อย่างมีประสิทธิภาพ การเป็นฟรีแลนซ์หรือมีอาชีพเสริมที่สร้างรายได้ดี",
        "en": "Mastering dynamic multitasking, juggling multiple client accounts, and thriving in agile modern roles."
      },
      "finance": {
        "th": "เงินหมุนเวียนได้ดี สามารถบริหารรายรับรายจ่ายได้อย่างคล่องตัว มีช่องทางรายได้หลายทางเข้ามาช่วยพยุง",
        "en": "Active cash flow management; skillfully balancing incomings and outgoings through diverse revenue streams."
      },
      "health": {
        "th": "ร่างกายต้องการความสมดุลระหว่างการทำงานและการพักผ่อน การฝึกโยคะหรือพิลาทิสช่วยปรับสมดุลกายใจได้ดี",
        "en": "Maintaining physical equilibrium; incorporating stretching, balanced nutrition, and moderation in all things."
      },
      "advice": {
        "th": "ปรับตัวอย่างยืดหยุ่นไปตามคลื่นลมของชีวิต มีสติในการจัดสรรเวลาและทรัพยากร อย่าเครียดจนเกินไป",
        "en": "Stay nimble and ride the waves. Balance is not a static state, but a continuous, graceful dance."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การเงินติดขัดหมุนไม่ทัน",
          "ภาระล้นมือจนเสียสมดุล",
          "ความเหนื่อยล้าจากการทำงานหนัก",
          "การตัดสินใจผิดพลาด",
          "ความวุ่นวาย"
        ],
        "en": [
          "Financial Imbalance",
          "Overextended",
          "Dropped Ball",
          "Cash Crunch",
          "Disorganization"
        ]
      },
      "general": {
        "th": "ภาระงานหรือหนี้สินล้นมือจนหมุนไม่ทัน เหรียญหลุดมือเกิดความวุ่นวาย สูญเสียสมดุลในชีวิตและรู้สึกเหนื่อยล้า",
        "en": "Dropping the balls: overextending resources, financial chaos, overwhelming demands, and losing your balance."
      },
      "love": {
        "th": "ทำงานหนักจนไม่มีเวลาให้ความรัก หรือปัญหาเรื่องการเงินเข้ามาสร้างความตึงเครียดให้ชีวิตคู่จนทะเลาะกัน",
        "en": "Neglecting your partner due to workaholism, or financial stress sparking arguments and instability."
      },
      "career": {
        "th": "รับงานมากเกินไปจนส่งงานไม่ทัน คุณภาพงานตกต่ำ เสียความน่าเชื่อถือจากความไม่รอบคอบ",
        "en": "Overpromising and underdelivering, missed deadlines, chaotic scheduling, and professional burnout."
      },
      "finance": {
        "th": "ชักหน้าไม่ถึงหลัง หมุนเงินไม่ทัน หนี้บัตรเครดิตพอกพูน ควรทำบัญชีรายรับรายจ่ายเร่งด่วน",
        "en": "Severe cash crunch, maxed-out credit cards, struggling to pay bills, and dangerous overdrafts."
      },
      "health": {
        "th": "วิงเวียนศีรษะ ร่างกายเสียสมดุล ความเครียดสะสมจากการนอนดึกและโหมงานหนักเกินไป",
        "en": "Vertigo, physical exhaustion, adrenal burnout, and nervous tension from frantic over-commitment."
      },
      "advice": {
        "th": "ตัดภาระที่ไม่จำเป็นออกทันทีและจัดลำดับความสำคัญใหม่ อย่าพยายามจับปลาสองมือในเวลาเดียวกัน",
        "en": "Drop the non-essentials immediately. Simplify your life; focusing deeply on one priority will save the rest."
      }
    }
  },
  "pentacles_3": {
    "upright": {
      "keywords": {
        "th": [
          "ความเชี่ยวชาญในงาน",
          "การทำงานร่วมกันอย่างมืออาชีพ",
          "การสร้างสรรค์อันประณีต",
          "การได้รับการยอมรับในฝีมือ",
          "ความร่วมมือทีม"
        ],
        "en": [
          "Master Craftsmanship",
          "Teamwork",
          "Architectural Skill",
          "Professional Acclaim",
          "Collaboration"
        ]
      },
      "general": {
        "th": "ช่างฝีมือกำลังแกะสลักมหาวิหารร่วมกับสถาปนิกและพระสงฆ์ สื่อถึงความร่วมมือของมืออาชีพ ความประณีตในผลงาน และการได้รับการยอมรับในทักษะความสามารถ",
        "en": "The artisan carving stone arches in a cathedral alongside an architect and a monk. Collaborative excellence, master craftsmanship, and professional recognition."
      },
      "love": {
        "th": "สร้างอนาคตร่วมกันทีละก้าวอย่างมั่นคง คู่รักช่วยกันสร้างเนื้อสร้างตัว คนโสดอาจพบรักผ่านการทำงานร่วมกัน",
        "en": "Building a solid foundation together; mutual respect, constructive teamwork in love, and shared life goals."
      },
      "career": {
        "th": "ผลงานได้รับการยกย่องจากผู้เชี่ยวชาญ การทำงานเป็นทีมที่ราบรื่นและมีประสิทธิภาพ ได้รับมอบหมายงานสำคัญ",
        "en": "Stellar team synergy, professional certification, praised craftsmanship, and advancing through recognized skill."
      },
      "finance": {
        "th": "รายได้เพิ่มขึ้นจากความเชี่ยวชาญเฉพาะทาง การลงทุนร่วมกันในโครงการที่ผ่านการวางแผนอย่างรอบคอบ",
        "en": "Remuneration matching specialized expertise; profitable contracts earned through verified technical excellence."
      },
      "health": {
        "th": "สุขภาพดีขึ้นตามลำดับจากการมีวินัยในการดูแลตนเอง การร่วมมือกับแพทย์และผู้เชี่ยวชาญได้ผลดีเยี่ยม",
        "en": "Steady physical improvement through disciplined wellness routines and guidance from qualified practitioners."
      },
      "advice": {
        "th": "มุ่งมั่นพัฒนาทักษะและฝีมือของคุณต่อไปอย่างประณีต ความเป็นมืออาชีพของคุณจะนำพาความสำเร็จที่มั่นคงมาให้",
        "en": "Hone your craft with meticulous dedication. Collaborate with other masters to construct enduring greatness."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ขาดความสามัคคี",
          "งานฝีมือไม่ได้มาตรฐาน",
          "การไม่ยอมรับฟังความคิดเห็น",
          "ความขัดแย้งในทีม",
          "การทำงานชุ่ย"
        ],
        "en": [
          "Lack of Teamwork",
          "Poor Craftsmanship",
          "Ego Clashes",
          "Sloppy Work",
          "Disorganization"
        ]
      },
      "general": {
        "th": "การทำงานร่วมกันมีปัญหา ต่างคนต่างทำไม่ประสานกัน หรือผลงานออกมาไม่ได้มาตรฐานเพราะขาดความใส่ใจ",
        "en": "Sloppy execution, team friction, refusal to learn, and unprofessional squabbles undermining an important project."
      },
      "love": {
        "th": "ไม่ช่วยกันสร้างอนาคต ต่างคนต่างอยู่ หรือมีทัศนคติไม่ตรงกันเรื่องการสร้างครอบครัวและการใช้ชีวิต",
        "en": "Failing to build a shared future; bickering over petty domestic responsibilities, or lack of commitment."
      },
      "career": {
        "th": "ความขัดแย้งในทีมงาน ถูกตำหนิเรื่องงานไม่ได้คุณภาพ การสื่อสารผิดพลาดทำให้โปรเจกต์ล่าช้า",
        "en": "Team discord, shoddy workmanship, missed design specifications, and harsh criticism from clients or bosses."
      },
      "finance": {
        "th": "เสียเงินไปกับการจ้างช่างหรือผู้รับเหมาที่ทำงานไม่ได้มาตรฐาน โครงการก่อสร้างหรือตกแต่งบานปลาย",
        "en": "Wasted capital on subpar contractors, repair bills for shoddy work, or disputes over service fees."
      },
      "health": {
        "th": "ขาดวินัยในการฟื้นฟูร่างกาย หรือไม่ปฏิบัติตามคำแนะนำของแพทย์ทำให้การรักษาไม่ได้ผลเต็มที่",
        "en": "Inconsistent adherence to medical protocols, neglecting physical therapy, and delayed recovery."
      },
      "advice": {
        "th": "เปิดใจรับฟังคำแนะนำและปรับปรุงคุณภาพงาน ความสำเร็จอันยิ่งใหญ่ไม่สามารถสร้างได้ด้วยความประมาท",
        "en": "Put away petty ego and listen to constructive critique. True masters continually refine their basics."
      }
    }
  },
  "pentacles_4": {
    "upright": {
      "keywords": {
        "th": [
          "การยึดติดในทรัพย์สิน",
          "ความตระหนี่ถี่เหนียว",
          "การรักษาความมั่นคง",
          "ความกลัวสูญเสีย",
          "การสร้างกำแพงปกป้อง"
        ],
        "en": [
          "Holding On Tight",
          "Financial Security",
          "Hoarding",
          "Fear of Loss",
          "Frugality"
        ]
      },
      "general": {
        "th": "ชายนั่งกอดเหรียญทองแน่นบนมงกุฎ ในอ้อมอก และใต้ฝ่าเท้า สื่อถึงการหวงแหนทรัพย์สิน ความประหยัดมัธยัสถ์ แต่ต้องระวังความตระหนี่จนปิดกั้นการไหลเวียนของพลังงาน",
        "en": "A crowned figure clinging tightly to four pentacles on his head, heart, and feet. Financial prudence, clinging to material assets, and fear of change."
      },
      "love": {
        "th": "ความหึงหวงและต้องการครอบครองคนรัก กลัวการสูญเสียจนทำให้คนรักรู้สึกอึดอัด ขาดอิสระในความสัมพันธ์",
        "en": "Possessiveness, jealousy, emotional stinginess, or clinging to a partner out of deep-seated fear of abandonment."
      },
      "career": {
        "th": "การรักษาตำแหน่งและผลประโยชน์ของตนเองอย่างเหนียวแน่น ไม่กล้าเสี่ยงเปลี่ยนแปลงหรือขยับขยาย",
        "en": "Guarding your position fiercely, defensive corporate maneuvers, and staying in a safe job out of fear of risk."
      },
      "finance": {
        "th": "เก็บเงินเก่ง มีวินัยในการออมสูงมาก การเงินมั่นคงปลอดภัย แต่อาจตระหนี่จนไม่กล้าใช้จ่ายสิ่งที่จำเป็น",
        "en": "Excellent savings discipline, rock-solid capital retention, but beware of a restrictive scarcity mindset."
      },
      "health": {
        "th": "อาการท้องผูก กล้ามเนื้อตึงเกร็งบริเวณหน้าอกและไหล่จากการเก็บกดความกังวลเรื่องความมั่นคง",
        "en": "Constipation, physical rigidity, tense shoulders, and stress-related tight chest from holding on too tightly."
      },
      "advice": {
        "th": "ความประหยัดเป็นสิ่งที่ดี แต่จงเปิดฝ่ามือออกบ้าง การหมุนเวียนและการแบ่งปันจะดึงดูดความมั่งคั่งใหม่ๆ เข้ามา",
        "en": "Loosen your grip. Hoarding stems from fear; true abundance flows in an open, generous circulation."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การปล่อยวางทรัพย์สิน",
          "การสูญเสียเงินทอง",
          "การใช้จ่ายมือเติบ",
          "การเปิดใจแบ่งปัน",
          "ความโลภที่ย้อนกลับมาทำร้าย"
        ],
        "en": [
          "Letting Go",
          "Financial Loss",
          "Reckless Spending",
          "Generosity",
          "Insecurity"
        ]
      },
      "general": {
        "th": "เหรียญหลุดลอยออกจากมือ อาจเป็นการปล่อยวางความตระหนี่และเริ่มแบ่งปัน หรือการสูญเสียเงินทองจากการใช้จ่ายสุรุ่ยสุร่าย",
        "en": "Dropping the coins: either opening your heart to healthy generosity, or losing control over budgets through careless splurging."
      },
      "love": {
        "th": "ลดความหึงหวงและให้อิสระแก่กันมากขึ้น หรือในทางตรงข้ามคือความสัมพันธ์พังทลายเพราะความเห็นแก่ตัว",
        "en": "Releasing suffocating control to allow love to breathe, or a partner breaking free from possessive bondage."
      },
      "career": {
        "th": "สูญเสียตำแหน่งหรือผลประโยชน์ที่เคยหวงแหนไว้ หรือตัดสินใจสละความมั่นคงเดิมเพื่อไปหาความท้าทายใหม่",
        "en": "Loss of a protected position, corporate downsizing, or finally quitting a golden handcuffs job."
      },
      "finance": {
        "th": "เงินรั่วไหล ใช้จ่ายเกินตัว หรือขาดทุนจากการพนันและการเก็งกำไร ควรระวังการถูกขโมยทรัพย์สิน",
        "en": "Financial hemorrhaging, wasteful luxury splurging, theft, or gambling losses; regain fiscal discipline."
      },
      "health": {
        "th": "ระบบขับถ่ายเริ่มดีขึ้นหลังจากคลายความเครียด กล้ามเนื้อที่เคยตึงเกร็งเริ่มผ่อนคลาย",
        "en": "Relief from gastrointestinal tension, easing muscle stiffness as psychological control softens."
      },
      "advice": {
        "th": "สร้างสมดุลระหว่างการเก็บออมและการใช้จ่าย อย่าปล่อยให้เงินทองเป็นนายคอยบงการชีวิตของคุณ",
        "en": "Find the golden mean between hoarding and squandering. Money is a tool for living, not a god to worship."
      }
    }
  },
  "pentacles_5": {
    "upright": {
      "keywords": {
        "th": [
          "ความยากลำบากขัดสน",
          "การตกยากกลางหิมะ",
          "ความรู้สึกถูกทอดทิ้ง",
          "วิกฤตทางการเงิน",
          "การมองข้ามความช่วยเหลือ"
        ],
        "en": [
          "Hardship",
          "Out in the Cold",
          "Financial Strain",
          "Feeling Abandoned",
          "Poverty Mindset"
        ]
      },
      "general": {
        "th": "คนยากจนสองคนเดินฝ่าหิมะที่หนาวเหน็บผ่านหน้าต่างกระจกสีของโบสถ์ที่มีแสงทองอบอุ่น สื่อถึงช่วงเวลาแห่งความยากลำบาก แต่ความช่วยเหลืออยู่ใกล้แค่เอื้อมหากยอมเปิดใจ",
        "en": "Two impoverished wanderers limping through freezing snow beneath illuminated church windows. Material hardship, feeling ostracized, and overlooked sanctuary."
      },
      "love": {
        "th": "เผชิญความยากลำบากร่วมกันในชีวิตคู่ หรือคนโสดรู้สึกเหงาจับใจ รู้สึกว่าไม่มีใครรักและมองข้ามตนเอง",
        "en": "Weathering lean times together, or intense feelings of loneliness and unworthiness in single life."
      },
      "career": {
        "th": "ตกงาน ขาดรายได้ โครงการล้มเหลว หรือรู้สึกโดดเดี่ยวไม่ได้รับการสนับสนุนในที่ทำงาน",
        "en": "Job loss, business insolvency, demotion, or feeling isolated and frozen out by colleagues."
      },
      "finance": {
        "th": "การเงินฝืดเคืองอย่างหนัก มีหนี้สินรุมเร้า รายได้หดหาย ต้องประหยัดถึงขีดสุดเพื่อประคองตัว",
        "en": "Severe financial distress, depleted bank accounts, looming debt collectors, and economic coldness."
      },
      "health": {
        "th": "ร่างกายอ่อนแอ ป่วยจากอากาศหนาวเย็น ขาดสารอาหาร หรือมีปัญหาเกี่ยวกับกระดูกและข้อต่อ",
        "en": "Malnutrition, hypothermia, chronic illness flare-ups, and the physical toll of grinding poverty and stress."
      },
      "advice": {
        "th": "เงยหน้าขึ้นมองแสงสว่างจากหน้าต่างโบสถ์ อย่าปล่อยให้ความหยิ่งทะนงขัดขวางการขอความช่วยเหลือจากผู้อื่น",
        "en": "Look up at the warm light of the stained-glass window. Sanctuary and help are near; swallow pride and ask."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "พายุเริ่มสงบ",
          "การฟื้นตัวจากวิกฤต",
          "การได้รับความช่วยเหลือ",
          "แสงสว่างที่ปลายอุโมงค์",
          "การพบที่พักพิง"
        ],
        "en": [
          "Recovery from Ruin",
          "Warmth Returning",
          "Financial Relief",
          "Hope",
          "Overcoming Hardship"
        ]
      },
      "general": {
        "th": "ความหนาวเหน็บเริ่มคลี่คลาย คุณได้รับการช่วยเหลือและได้พบที่พักพิงที่อบอุ่น วิกฤตการณ์เลวร้ายที่สุดได้ผ่านพ้นไปแล้ว",
        "en": "Stepping inside from the snow; finding sanctuary, financial relief, returning warmth, and light at the end of the tunnel."
      },
      "love": {
        "th": "ความสัมพันธ์ที่เคยเผชิญความลำบากเริ่มกลับมาอบอุ่นและมั่นคงขึ้น คนโสดเริ่มหลุดพ้นจากความเหงาและเปิดรับรักใหม่",
        "en": "Rebuilding romance after severe hardship, forgiving financial grievances, and finding emotional warmth."
      },
      "career": {
        "th": "ได้งานใหม่หลังจากตกงานมานาน หรือธุรกิจที่เกือบล้มละลายเริ่มได้รับการสนับสนุนจนฟื้นตัวได้",
        "en": "Securing employment after protracted joblessness, securing business lifelines, and returning to stability."
      },
      "finance": {
        "th": "เริ่มปลดหนี้สินได้ มีคนยื่นมือเข้ามาช่วยเหลือเรื่องเงิน หรือเริ่มมีรายได้ใหม่เข้ามาจุนเจือ",
        "en": "Financial turnaround, debt relief approvals, returning cash flow, and lifting of crushing fiscal panic."
      },
      "health": {
        "th": "ร่างกายเริ่มฟื้นตัวจากอาการป่วยเรื้อรัง ได้รับการรักษาที่เหมาะสมและมีโภชนาการที่ดีขึ้น",
        "en": "Gradual physical recovery, warm shelter aiding healing, and replenishing depleted biological reserves."
      },
      "advice": {
        "th": "ก้าวเข้าไปในที่พักพิงและรับความอบอุ่น ขอบคุณบทเรียนแห่งความยากลำบากที่ทำให้คุณแข็งแกร่งขึ้น",
        "en": "Welcome the warmth. You have survived the bitter blizzard; step into the sanctuary and rebuild with gratitude."
      }
    }
  },
  "pentacles_6": {
    "upright": {
      "keywords": {
        "th": [
          "การแบ่งปันความมั่งคั่ง",
          "การให้และรับอย่างสมดุล",
          "การเกื้อกูลผู้ยากไร้",
          "การได้รับความเมตตา",
          "ความเอื้อเฟื้อเผื่อแผ่"
        ],
        "en": [
          "Generosity",
          "Charity",
          "Balance of Giving and Receiving",
          "Fair Patronage",
          "Sharing Wealth"
        ]
      },
      "general": {
        "th": "พ่อค้าผู้มั่งคั่งถือตราชูวัดความสมดุลในมือซ้าย ขณะที่มือขวามอบเหรียญทองให้แก่ผู้ยากไร้ สื่อถึงความเอื้อเฟื้อเผื่อแผ่ การให้และรับที่เป็นธรรม และการแบ่งปันความอุดมสมบูรณ์",
        "en": "A prosperous merchant weighing gold coins in a scale, dispensing charity to the kneeling poor. Benevolent generosity, reciprocal fairness, and balanced resource sharing."
      },
      "love": {
        "th": "ความสัมพันธ์ที่ดูแลเอาใจใส่ซึ่งกันและกันอย่างเท่าเทียม ฝ่ายหนึ่งอาจคอยเกื้อหนุนอีกฝ่ายด้วยความเต็มใจ",
        "en": "Generous, supportive partnership; sharing emotional and material blessings equitably with deep devotion."
      },
      "career": {
        "th": "ได้รับทุนการศึกษา ทุนสนับสนุนธุรกิจ หรือมีผู้ใหญ่ใจดีคอยสนับสนุนให้โอกาสเติบโตในสายอาชีพ",
        "en": "Receiving lucrative grants, mentorship from respected seniors, fair wage bonuses, and investor patronage."
      },
      "finance": {
        "th": "การเงินคล่องตัว มีเงินพอที่จะทำบุญ ช่วยเหลือผู้อื่น หรือได้รับความช่วยเหลือทางการเงินที่ตรงจังหวะพอดี",
        "en": "Balanced financial health; generous charitable contributions and timely financial aid or loans granted."
      },
      "health": {
        "th": "สุขภาพแข็งแรงดีเยี่ยม การได้รับการรักษาพยาบาลที่ดีและการดูแลเอาใจใส่จากแพทย์ผู้เชี่ยวชาญ",
        "en": "Excellent vitality supported by quality medical care and balanced holistic wellness routines."
      },
      "advice": {
        "th": "เมื่อคุณมีมากพอ จงแบ่งปันด้วยใจบริสุทธิ์ และเมื่อคุณต้องการความช่วยเหลือ จงยอมรับมันด้วยความกตัญญู",
        "en": "Give generously without condescension, and receive humbly without shame. Keep the scales of life in balance."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การให้ที่มีเงื่อนไข",
          "ความไม่เท่าเทียม",
          "หนี้สินผูกมัด",
          "การเอารัดเอาเปรียบ",
          "การทุจริตเงินบริจาค"
        ],
        "en": [
          "Conditional Giving",
          "Imbalance",
          "Strings Attached",
          "Exploitation",
          "Debt Trap"
        ]
      },
      "general": {
        "th": "การให้ที่มีผลประโยชน์แอบแฝง การสร้างหนี้บุญคุณเพื่อกดขี่ หรือการตกเป็นหนี้สินที่ไม่เป็นธรรม",
        "en": "Charity with heavy strings attached; patronage turning into servitude, bribery, financial manipulation, and bad debt."
      },
      "love": {
        "th": "ความรักที่มีการทวงบุญคุณ อีกฝ่ายใช้เงินบงการชีวิต หรือรู้สึกว่าตนเองเป็นฝ่ายให้แต่ไม่เคยได้รับความจริงใจ",
        "en": "Financial power dynamics poisoning romance; one partner weaponizing money to control the other."
      },
      "career": {
        "th": "เจ้านายหรือคู่ค้าเอาเปรียบ สัญญาจ้างงานไม่เป็นธรรม หรือการถูกหักหลังเรื่องผลประโยชน์ที่ตกลงกันไว้",
        "en": "Unfair compensation, unpaid internships, exploitation of junior staff, or broken bonus promises."
      },
      "finance": {
        "th": "ระวังการถูกหลอกยืมเงินแล้วไม่คืน หนี้สินนอกระบบ หรือการเสียเงินไปกับการบริจาคที่ไม่โปร่งใส",
        "en": "Predatory loans with extortionate interest, bad debts that won't be repaid, and financial embezzlement."
      },
      "health": {
        "th": "การละเลยสุขภาพของตนเองเพราะมัวแต่ไปดูแลคนอื่น หรือการรักษาที่เสียเงินแพงแต่ไม่ได้มาตรฐาน",
        "en": "Exhaustion from serving others while neglecting personal health; costly but ineffective treatments."
      },
      "advice": {
        "th": "อย่าให้ใครใช้เงินหรือความช่วยเหลือมาเป็นโซ่ล่ามเสรีภาพของคุณ ปฏิเสธข้อเสนอที่มีเงื่อนไขแอบแฝงอย่างเด็ดขาด",
        "en": "Beware of gifts with hidden hooks. True generosity expects nothing in return; protect your autonomy."
      }
    }
  },
  "pentacles_7": {
    "upright": {
      "keywords": {
        "th": [
          "การเฝ้ารอผลผลิต",
          "การประเมินผลงาน",
          "ความอดทนระยะยาว",
          "ผลตอบแทนจากการลงทุน",
          "การวางแผนอนาคต"
        ],
        "en": [
          "Patience",
          "Assessing Harvest",
          "Long-Term ROI",
          "Evaluation",
          "Sustainable Investment"
        ]
      },
      "general": {
        "th": "ชาวสวนยืนพิงจอบมองดูเหรียญทองทั้งเจ็ดที่ผลิดอกบนเถาวัลย์ สื่อถึงการหยุดพักเพื่อประเมินสิ่งที่ได้ลงแรงไป การรอคอยผลเก็บเกี่ยวด้วยความอดทน",
        "en": "A gardener leaning on his hoe, patiently inspecting the seven pentacles blossoming upon his vine. Assessing steady progress, long-term investments, and patient cultivation."
      },
      "love": {
        "th": "ความสัมพันธ์ที่บ่มเพาะมานานเริ่มเห็นอนาคต ทบทวนความสัมพันธ์เพื่อวางแผนก้าวต่อไปอย่างมั่นคง",
        "en": "Evaluating relationship progress; patient dedication yielding deep, lasting companionship and shared stability."
      },
      "career": {
        "th": "งานที่ทุ่มเทมานานเริ่มออกผล เป็นช่วงเวลาประเมินผลงานเพื่อปรับปรุงกลยุทธ์ในการขยายงานระยะยาว",
        "en": "Assessing project milestones; seeing steady returns on long-term labor, performance reviews, and strategic patience."
      },
      "finance": {
        "th": "การลงทุนระยะยาวเริ่มให้ผลตอบแทน เงินปันผลหรือมูลค่าสินทรัพย์เติบโตขึ้นอย่างมั่นคง",
        "en": "Solid returns on real estate, pensions, or compound interest portfolios; rewarding patient investors."
      },
      "health": {
        "th": "ผลลัพธ์ของการดูแลสุขภาพเริ่มปรากฏ ร่างกายแข็งแรงขึ้นตามลำดับจากการมีวินัยอย่างต่อเนื่อง",
        "en": "Gradual, lasting health improvements from consistent clean diet, exercise, and sustainable lifestyle habits."
      },
      "advice": {
        "th": "จงอดทนรอคอยจังหวะที่เหมาะสม สิ่งมีค่าต้องใช้เวลาในการเติบโต ผลลัพธ์ที่งดงามกำลังรอคุณอยู่ข้างหน้า",
        "en": "Trust the slow magic of growth. Do not pluck the fruit while still green; patience guarantees sweetness."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความใจร้อนรอไม่ไหว",
          "ผลผลิตไม่คุ้มค่าเหนื่อย",
          "การลงทุนที่สูญเปล่า",
          "ความขี้เกียจท้อแท้",
          "การละทิ้งแปลงปลูก"
        ],
        "en": [
          "Impatience",
          "Poor Return on Investment",
          "Wasted Effort",
          "Frustration",
          "Quitting Early"
        ]
      },
      "general": {
        "th": "ความหงุดหงิดใจที่ผลงานโตช้ากว่าที่คิด หรือรู้สึกว่าทุ่มเทไปมากมายแต่ได้ผลตอบแทนไม่คุ้มค่าเหนื่อย",
        "en": "Frustration with slow returns, abandoning efforts right before harvest, or realizing you poured labor into barren soil."
      },
      "love": {
        "th": "เหนื่อยล้ากับการประคองความสัมพันธ์ที่ไม่มีความคืบหน้า รู้สึกว่าตนเองพยายามอยู่ฝ่ายเดียวจนอยากล้มเลิก",
        "en": "Feeling your romantic devotion is unappreciated; wondering if the relationship is worth the exhausting labor."
      },
      "career": {
        "th": "โปรเจกต์ล่าช้า ผลลัพธ์ไม่เป็นไปตามเป้าหมาย หรือหมดกำลังใจในการทำงานเพราะเหนื่อยฟรี",
        "en": "Unprofitable business ventures, stalled promotions despite hard work, and burnout from thankless toil."
      },
      "finance": {
        "th": "ผลตอบแทนจากการลงทุนขาดทุนหรือไม่คุ้มค่าเงินเฟ้อ การถอนเงินออกก่อนเวลาอันควรจนเสียสิทธิประโยชน์",
        "en": "Poor investment yields, pulling out prematurely at a loss, or cash locked up in non-performing assets."
      },
      "health": {
        "th": "ท้อแท้กับการลดน้ำหนักหรือการออกกำลังกายที่ยังไม่เห็นผลเร็วทันใจ หรืออาการป่วยเรื้อรังที่ฟื้นตัวช้า",
        "en": "Impatience with slow rehabilitation, quitting fitness routines prematurely, or persistent lethargy."
      },
      "advice": {
        "th": "ประเมินสถานการณ์อย่างตรงไปตรงมา หากสิ่งนี้คุ้มค่าจงอดทนต่อ แต่หากเป็นแปลงดินที่ไร้แร่ธาตุ จงกล้าที่จะเปลี่ยนแปลง",
        "en": "Honestly assess your investments. If the soil is barren, cut your losses and plant where seeds can truly thrive."
      }
    }
  },
  "pentacles_8": {
    "upright": {
      "keywords": {
        "th": [
          "ช่างฝีมือผู้ขยันขันแข็ง",
          "การฝึกฝนความเชี่ยวชาญ",
          "ความใส่ใจในรายละเอียด",
          "การสร้างผลงานประณีต",
          "ความเพียรพยายาม"
        ],
        "en": [
          "Diligence",
          "Mastery of Craft",
          "Apprenticeship",
          "Detail-Oriented",
          "Repetitive Discipline"
        ]
      },
      "general": {
        "th": "ช่างฝีมือกำลังตั้งอกตั้งใจสลักเหรียญทองทีละเหรียญอย่างประณีต เหรียญที่เสร็จแล้วแขวนเรียงราย สื่อถึงความขยันหมั่นเพียร การฝึกฝนเพื่อก้าวสู่ความเป็นเลิศ",
        "en": "An artisan seated at his bench meticulously hammering pentacles into perfection, with completed coins hung in a row. Diligent apprenticeship, pride in craft, and building mastery."
      },
      "love": {
        "th": "ความรักที่ต้องอาศัยความใส่ใจในรายละเอียดเล็กๆ น้อยๆ การปรับตัวและสร้างความเข้าใจกันทุกวันอย่างสม่ำเสมอ",
        "en": "Consistent, everyday dedication in love; putting in thoughtful effort to make the relationship work beautifully."
      },
      "career": {
        "th": "การยกระดับทักษะฝีมือ เรียนคอร์สเพิ่มเพื่อความเชี่ยวชาญ ทำงานด้วยความละเอียดรอบคอบจนได้รับคำชม",
        "en": "Professional skill mastery, dedication to quality, upskilling, and producing exceptional work that commands high fees."
      },
      "finance": {
        "th": "รายได้เพิ่มขึ้นจากหยาดเหงื่อและฝีมือ ความขยันขันแข็งทำให้การเงินมั่นคงและมีเงินเก็บเพิ่มขึ้นเรื่อยๆ",
        "en": "Honest wealth built through hard work; steady income expansion driven by superior craft and reputation."
      },
      "health": {
        "th": "มีวินัยในการออกกำลังกายและควบคุมอาหารอย่างเคร่งครัด ร่างกายมีกล้ามเนื้อที่กระชับและแข็งแรง",
        "en": "Disciplined daily fitness habits, meticulous attention to bodily nutrition, and steady physical conditioning."
      },
      "advice": {
        "th": "โฟกัสที่การพัฒนาตนเองและความประณีตในทุกสิ่งที่ทำ ความเชี่ยวชาญที่แท้จริงเกิดจากความเพียรที่ต่อเนื่อง",
        "en": "Apply yourself with humble dedication. Repetition and devotion to details turn ordinary work into priceless art."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การทำงานชุ่ยไร้คุณภาพ",
          "ความขี้เกียจขาดวินัย",
          "การหมดไฟในงานซ้ำซาก",
          "การขาดความทะเยอทะยาน",
          "การโกงฝีมือ"
        ],
        "en": [
          "Sloppy Work",
          "Lack of Ambition",
          "Monotony Burnout",
          "Shortcuts",
          "Perfectionism Paralysis"
        ]
      },
      "general": {
        "th": "การทำงานแบบขอไปที ขาดความประณีต หรือเบื่อหน่ายกับงานประจำที่ซ้ำซากจำเจจนขาดแรงผลักดัน",
        "en": "Cutting corners, sloppy execution, neglecting details, or suffering crushing boredom from repetitive, joyless routine."
      },
      "love": {
        "th": "ละเลยคนรัก ไม่ใส่ใจในความรู้สึก ปล่อยให้ความสัมพันธ์เหี่ยวเฉาเพราะไม่ยอมลงแรงดูแล",
        "en": "Taking a partner for granted, zero romantic effort, or letting daily monotony extinguish the passion."
      },
      "career": {
        "th": "ผลงานตกต่ำเพราะความไม่รอบคอบ ถูกตักเตือนเรื่องคุณภาพงาน หรือความเหนื่อยหน่ายในงานรูทีน",
        "en": "Careless mistakes damaging reputation, producing inferior goods, or quitting vocational training halfway."
      },
      "finance": {
        "th": "สูญเสียรายได้เพราะงานไม่ได้มาตรฐาน หรือพยายามหาทางลัดรวยเร็วด้วยวิธีที่ไม่สุจริตจนเสียเงิน",
        "en": "Loss of income due to botched work, or falling for get-rich-quick shortcuts that bypass honest effort."
      },
      "health": {
        "th": "การบาดเจ็บจากการเคลื่อนไหวซ้ำๆ (Repetitive Strain Injury) ปวดข้อมือ ออฟฟิศซินโดรมจากการนั่งทำงานนาน",
        "en": "Carpal tunnel syndrome, posture strain from desk work, or burnout from mechanical, joyless routines."
      },
      "advice": {
        "th": "ดึงสติและกลับมาใส่ใจในคุณภาพ อย่ามองข้ามขั้นตอนพื้นฐาน ความสำเร็จที่แท้จริงไม่มีทางลัด",
        "en": "Do not compromise on quality. There are no shortcuts to greatness; recommit your hands and heart to excellence."
      }
    }
  },
  "pentacles_9": {
    "upright": {
      "keywords": {
        "th": [
          "ความมั่งคั่งด้วยลำแข้งตนเอง",
          "ความสุขสงบในสวนสวรรค์",
          "อิสรภาพทางการเงิน",
          "รสนิยมอันสง่างาม",
          "ความภาคภูมิใจในความสำเร็จ"
        ],
        "en": [
          "Self-Made Abundance",
          "Luxury",
          "Solitary Refinement",
          "Financial Independence",
          "Harvest"
        ]
      },
      "general": {
        "th": "สตรีผู้สง่างามสวมชุดปักลายองุ่นยืนอยู่ในสวนเหรียญทองอันอุดมสมบูรณ์ มีเหยี่ยวเกาะที่มือ สื่อถึงความสำเร็จ ความเป็นอิสระทางการเงิน และความสุขในชีวิตที่สร้างขึ้นด้วยตนเอง",
        "en": "An aristocratic lady in luxurious robes standing proudly in her fruitful vineyard, a hooded falcon perched on her hand. Self-made wealth, refinement, and serene independence."
      },
      "love": {
        "th": "คนโสดมีความสุขและภาคภูมิใจในชีวิตโสด มีเสน่ห์แบบคนเก่งและมั่นคง คนมีคู่ให้อิสระแก่กันและสนับสนุนความสำเร็จของกันและกัน",
        "en": "Thriving in elegant independence; singles love their own company, while couples celebrate mutual self-reliance and luxury."
      },
      "career": {
        "th": "ประสบความสำเร็จสูงสุดในสายงาน การเป็นเจ้าของธุรกิจที่มั่นคง ผลงานสร้างชื่อเสียงและผลตอบแทนมหาศาล",
        "en": "Reaching peak career autonomy, operating thriving independent enterprises, and enjoying the fruits of hard labor."
      },
      "finance": {
        "th": "ความมั่งคั่งอย่างแท้จริง มีอิสรภาพทางการเงิน สามารถซื้อความสุขและชีวิตที่สะดวกสบายได้อย่างเต็มที่",
        "en": "Substantial personal wealth, lucrative passive income, luxury living, and undisputed financial freedom."
      },
      "health": {
        "th": "สุขภาพร่างกายและจิตใจยอดเยี่ยม ได้รับการบำรุงด้วยอาหารและสิ่งแวดล้อมชั้นเลิศ ผิวพรรณเปล่งปลั่ง",
        "en": "Radiant physical vitality, pampering wellness routines, nourishing organic food, and inner serenity."
      },
      "advice": {
        "th": "ชื่นชมและดื่มด่ำกับความสำเร็จที่คุณสร้างมาด้วยตนเอง จงใช้ชีวิตอย่างสง่างามและภาคภูมิใจในคุณค่าของคุณ",
        "en": "Enjoy the magnificent sanctuary you have cultivated. Relish your independence, peace, and hard-earned harvest."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "การใช้จ่ายเกินตัว",
          "ภาพลักษณ์จอมปลอม",
          "ความเหงาในกรงทอง",
          "การสูญเสียทรัพย์สิน",
          "ความไม่มั่นคงทางการเงิน"
        ],
        "en": [
          "Financial Insecurity",
          "Living Beyond Means",
          "Golden Cage",
          "Superficiality",
          "Property Losses"
        ]
      },
      "general": {
        "th": "ความร่ำรวยแต่เปลือกนอกแต่ภายในมีหนี้สินล้นพ้นตัว หรือความรู้สึกโดดเดี่ยวอ้างว้างในกรงทองที่สร้างขึ้นมา",
        "en": "Living beyond your means to fake an elite lifestyle, isolation in a golden cage, or property disputes threatening security."
      },
      "love": {
        "th": "ความสัมพันธ์ที่ผูกติดอยู่กับเงินทองและภาพลักษณ์แต่ไร้ความรัก หรือความรู้สึกเหงาแม้จะมีคนรักรวย",
        "en": "A gilded cage romance, staying for material luxury without affection, or financial dependence breeding resentment."
      },
      "career": {
        "th": "ธุรกิจหรือหน้าที่การงานสะดุดเพราะการบริหารจัดการที่ผิดพลาด ระวังการสูญเสียความน่าเชื่อถือ",
        "en": "Threats to business autonomy, financial mismanagement catching up, or setbacks to prestigious reputations."
      },
      "finance": {
        "th": "วิกฤตทางการเงินจากการใช้จ่ายฟุ่มเฟือยเพื่อสร้างภาพลักษณ์ หนี้สินจากบัตรเครดิตและสินค้าแบรนด์เนม",
        "en": "Mounting debts behind a facade of luxury, reckless spending, or sudden drops in property valuations."
      },
      "health": {
        "th": "ความเครียดจากการรักษาภาพลักษณ์ทางสังคม โรคเกี่ยวกับการกินผิดปกติ หรืออาการหมดไฟในการใช้ชีวิต",
        "en": "Stress from maintaining appearances, eating disorders, or neglecting health while chasing superficial status."
      },
      "advice": {
        "th": "หันกลับมามองความจริงและลดการใช้จ่ายที่ไร้สาระ ความมั่งคั่งที่แท้จริงวัดจากความสงบใจไม่ใช่สิ่งของภายนอก",
        "en": "Step down from the pedestal of pretense. Authentic richness is measured by peace of mind, not expensive labels."
      }
    }
  },
  "pentacles_10": {
    "upright": {
      "keywords": {
        "th": [
          "ความมั่งคั่งข้ามรุ่น",
          "มรดกวงศ์ตระกูล",
          "ความมั่นคงถาวร",
          "ครอบครัวปึกแผ่น",
          "ความสำเร็จสูงสุดในชีวิต"
        ],
        "en": [
          "Generational Wealth",
          "Family Legacy",
          "Enduring Security",
          "Inheritance",
          "Ancestral Blessing"
        ]
      },
      "general": {
        "th": "ครอบครัวสามรุ่นพร้อมสุนัขคู่ใจอยู่ใต้ซุ้มประตูเมืองโบราณที่มีเหรียญทองสิบเหรียญเรียงเป็นรูปผังพฤกษาแห่งชีวิต (Tree of Life) สื่อถึงความมั่งคั่งถาวร มรดก และความมั่นคงสูงสุดของวงศ์ตระกูล",
        "en": "Three generations gathered with family hounds under the stone archway adorned with ten pentacles forming the Tree of Life. Generational prosperity, lasting legacy, and total security."
      },
      "love": {
        "th": "ความรักที่นำไปสู่การแต่งงานที่มั่นคง ครอบครัวทั้งสองฝ่ายสนับสนุนและมีฐานะมั่งคั่ง มีอนาคตที่ปลอดภัยร่วมกัน",
        "en": "Enduring marriage, deep family harmony, building an empire together, and creating a prosperous dynasty."
      },
      "career": {
        "th": "ธุรกิจครอบครัวที่มั่นคงและสืบทอดกันมายาวนาน การบรรลุเป้าหมายสูงสุดในอาชีพการงานจนสามารถเกษียณอย่างสุขสบาย",
        "en": "Thriving family businesses, reaching the pinnacle of corporate stability, and establishing an enduring institution."
      },
      "finance": {
        "th": "ความมั่งคั่งระดับมหาเศรษฐี การได้รับมรดกที่ดิน อสังหาริมทรัพย์ หรือเงินปันผลที่เลี้ยงดูครอบครัวได้ตลอดชีวิต",
        "en": "Generational wealth, substantial inheritances, lucrative real estate portfolios, and complete financial peace."
      },
      "health": {
        "th": "สุขภาพแข็งแรงตามวัย ยีนส์และสุขภาพทางพันธุกรรมดี มีการดูแลรักษาพยาบาลระดับพรีเมียม อายุยืนยาว",
        "en": "Robust longevity, genetically favored vitality, and access to the finest healthcare and wellness resources."
      },
      "advice": {
        "th": "รักษาและต่อยอดมรดกอันล้ำค่านี้เพื่อคนรุ่นหลัง ดูแลเอาใจใส่ครอบครัวซึ่งเป็นรากฐานที่สำคัญที่สุดของชีวิต",
        "en": "Honor your ancestors and build for future generations. True wealth is an enduring legacy of wisdom, love, and security."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ข้อพิพาทเรื่องมรดก",
          "ความขัดแย้งในครอบครัว",
          "ความสูญเสียทรัพย์สินตระกูล",
          "ธุรกิจครอบครัวสั่นคลอน",
          "ภาระหนี้สินมรดก"
        ],
        "en": [
          "Inheritance Feuds",
          "Family Discord",
          "Loss of Wealth",
          "Broken Dynasty",
          "Disinherited"
        ]
      },
      "general": {
        "th": "ปัญหาความขัดแย้งเรื่องมรดกและทรัพย์สินในครอบครัว ธุรกิจกงสีสั่นคลอน หรือการสูญเสียทรัพย์สมบัติของตระกูล",
        "en": "Bitter squabbles over wills, family estate battles, loss of ancestral property, and crumbling of family traditions."
      },
      "love": {
        "th": "ปัญหาครอบครัวของอีกฝ่ายเข้ามาสร้างความแตกแยก เรื่องเงินทองและทรัพย์สินทำลายความรัก",
        "en": "Family disapproval tearing couples apart, fighting over prenuptial agreements, or marriage ruined by greed."
      },
      "career": {
        "th": "ความขัดแย้งในการบริหารธุรกิจครอบครัว การเมืองภายในตระกูลที่ทำให้ธุรกิจเสื่อมถอย",
        "en": "Hostile family business disputes, succession crises, and financial instability threatening corporate survival."
      },
      "finance": {
        "th": "สูญเสียมรดก ถูกตัดออกจากพินัยกรรม หรือต้องแบกรับหนี้สินที่คนในครอบครัวก่อไว้",
        "en": "Contested wills, heavy inheritance taxes, bankruptcy of family firms, and bitter litigation over wealth."
      },
      "health": {
        "th": "โรคทางพันธุกรรมที่ถ่ายทอดในครอบครัว หรือความเครียดรุนแรงจากปัญหาความขัดแย้งเรื่องทรัพย์สิน",
        "en": "Genetic health conditions flaring up, chronic stress from family feuds, and elderly care disputes."
      },
      "advice": {
        "th": "อย่าให้เงินทองมาทำลายความสัมพันธ์ในครอบครัว หันหน้ามาพูดคุยและประนีประนอมเพื่อรักษาความสามัคคีไว้",
        "en": "Do not sacrifice family bonds on the altar of money. Wealth comes and goes, but kin and integrity are irreplaceable."
      }
    }
  },
  "pentacles_11": {
    "upright": {
      "keywords": {
        "th": [
          "นักเรียนรู้ผู้ใฝ่ดี",
          "โอกาสทางการเงินใหม่",
          "ความมุ่งมั่นเริ่มต้น",
          "ข่าวดีเรื่องเงินและงาน",
          "ความอดทนจริงจัง"
        ],
        "en": [
          "Practical Student",
          "Financial Opportunity",
          "Eager Apprentice",
          "Tangible News",
          "Grounded Ambition"
        ]
      },
      "general": {
        "th": "เด็กหนุ่มยืนประคองเหรียญทองด้วยความทะนุถนอมในทุ่งหญ้า สื่อถึงความตั้งใจจริงในการเรียนรู้ การเริ่มต้นศึกษาหาความรู้เพื่อสร้างความมั่งคั่งและอนาคตที่มั่นคง",
        "en": "A young scholar holding a golden pentacle aloft with reverent concentration amidst blooming fields. Studious ambition, practical goals, and eager learning."
      },
      "love": {
        "th": "ความรักที่จริงใจ หนักแน่น และมองการณ์ไกล คนโสดมีเกณฑ์พบคนที่ซื่อสัตย์ ขยันขันแข็ง และพร้อมจะสร้างอนาคตร่วมกัน",
        "en": "A sweet, grounded romance with practical dedication. Singles attract a reliable, hardworking, and sincere admirer."
      },
      "career": {
        "th": "การเริ่มต้นงานใหม่ การฝึกอบรมหรือศึกษาต่อเพื่อเพิ่มทักษะ ได้รับข่าวดีเรื่องงานหรือการอนุมัติโครงการ",
        "en": "Exciting entry-level positions, successful vocational training, apprenticeships, and promising professional offers."
      },
      "finance": {
        "th": "มีลู่ทางหาเงินใหม่ๆ การเริ่มต้นออมเงินและการลงทุนอย่างมีวินัย ได้รับเงินพิเศษจากการเรียนหรือทำงานพิเศษ",
        "en": "New financial learning curves, setting up sensible savings plans, and modest initial returns on early investments."
      },
      "health": {
        "th": "สุขภาพดี ร่างกายกระปรี้กระเปร่า เหมาะแก่การเริ่มต้นโปรแกรมดูแลสุขภาพแบบค่อยเป็นค่อยไป",
        "en": "Grounded vitality; establishing foundational healthy lifestyle routines that pay lifelong dividends."
      },
      "advice": {
        "th": "ตั้งใจเรียนรู้และเก็บเกี่ยวประสบการณ์ ความอดทนและความมุ่งมั่นในวันนี้จะผลิดอกออกผลเป็นความมั่งคั่งในวันข้างหน้า",
        "en": "Study your craft with humble patience. Ground your big dreams in small, disciplined, daily actions."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความขี้เกียจขาดสมาธิ",
          "การมองข้ามโอกาสดี",
          "การใช้จ่ายฟุ่มเฟือย",
          "การเรียนสะดุด",
          "ความไม่รับผิดชอบ"
        ],
        "en": [
          "Procrastination",
          "Lack of Discipline",
          "Missed Opportunity",
          "Lazy Habits",
          "Irresponsibility"
        ]
      },
      "general": {
        "th": "ขาดสมาธิในการเรียนรู้ เบื่อง่าย ทำอะไรไม่ต่อเนื่อง หรือมองข้ามโอกาสทางการเงินเพราะความเกียจคร้าน",
        "en": "Slacking off, daydreaming without practical execution, failed exams, or wasting valuable educational opportunities."
      },
      "love": {
        "th": "ความสัมพันธ์ไม่คืบหน้าเพราะอีกฝ่ายไม่กระตือรือร้น หรือทำตัวเรื่อยเปื่อยไม่มีเป้าหมายในชีวิต",
        "en": "Immature lack of romantic initiative, financial unreliability in courtship, or failing to make long-term plans."
      },
      "career": {
        "th": "ขาดความกระตือรือร้นในการทำงาน ทำงานผิดพลาดบ่อยเพราะไม่ใส่ใจในรายละเอียด ขาดวินัย",
        "en": "Missed career opportunities due to laziness, sloppy work habits, and failure to fulfill apprentice duties."
      },
      "finance": {
        "th": "ใช้เงินเก็บไปกับสิ่งของที่ไม่จำเป็น ขาดการวางแผนทางการเงิน หรือมีปัญหาหนี้สินจากการใช้จ่ายตามใจ",
        "en": "Frivolous spending of hard-earned savings, irresponsible loans, and failing to budget sensibly."
      },
      "health": {
        "th": "ละเลยการออกกำลังกาย กินอาหารตามใจปาก น้ำหนักขึ้นหรือร่างกายไม่แข็งแรงเพราะความเกียจคร้าน",
        "en": "Sedentary sluggishness, abandoning diet plans, poor posture, and neglect of basic physical conditioning."
      },
      "advice": {
        "th": "ลุกขึ้นมาสร้างวินัยให้แก่ตนเอง ความฝันจะไม่มีวันเป็นจริงได้หากปราศจากการลงมือทำอย่างต่อเนื่อง",
        "en": "Shake off apathy. Discipline is the bridge between goals and accomplishment; recommit to steady effort."
      }
    }
  },
  "pentacles_12": {
    "upright": {
      "keywords": {
        "th": [
          "อัศวินผู้ซื่อสัตย์มั่นคง",
          "ความเพียรพยายามไม่ย่อท้อ",
          "ความรับผิดชอบสูง",
          "การทำงานตามแผนอย่างมีวินัย",
          "ความน่าเชื่อถือ"
        ],
        "en": [
          "Methodical Worker",
          "Steadfast Reliability",
          "Patient Routine",
          "Unyielding Duty",
          "Loyalty"
        ]
      },
      "general": {
        "th": "อัศวินบนหลังม้าสีดำร่างกำยำยืนนิ่งอยู่ในทุ่งข้าวสาลี ถือเหรียญทองด้วยความหนักแน่น สื่อถึงความซื่อสัตย์ ความอดทน การทำงานอย่างเป็นระบบ และความรับผิดชอบที่ไม่สั่นคลอน",
        "en": "The steadfast knight astride his heavy draft horse in a ripe wheatfield, holding his pentacle securely. Methodical diligence, unwavering reliability, and tireless commitment."
      },
      "love": {
        "th": "คนรักที่ซื่อสัตย์ มั่นคง และพึ่งพาได้เสมอ แม้จะไม่โรแมนติกหวานแหววแต่การกระทำแสดงถึงความรักที่แท้จริง",
        "en": "A deeply dependable, honest, and loyal partner; proving devotion through consistent daily actions rather than flashy words."
      },
      "career": {
        "th": "การทำงานอย่างเป็นระบบและมีวินัย ได้รับความไว้วางใจให้ดูแลงานสำคัญ การทำงานหนักอย่างต่อเนื่องจะนำไปสู่ความสำเร็จที่ยิ่งใหญ่",
        "en": "Exemplary work ethic, trusted with vital operations, executing plans flawlessly through patient persistence."
      },
      "finance": {
        "th": "การเงินมั่นคง ปลอดภัย มีการเก็บออมและการลงทุนระยะยาวที่ไม่หวือหวาแต่ให้ผลตอบแทนแน่นอน",
        "en": "Steady, conservative wealth accumulation; reliable investment yields and impeccable debt repayment records."
      },
      "health": {
        "th": "ร่างกายแข็งแรง มีความอึดและทนทานสูง สุขภาพดีจากการมีวินัยในการใช้ชีวิตและการพักผ่อนสม่ำเสมอ",
        "en": "Superb physical stamina, steady endurance, and solid wellness built upon unshakeable daily habits."
      },
      "advice": {
        "th": "ก้าวต่อไปอย่างมั่นคงตามแผนการ ความอดทนและความซื่อสัตย์คืออาวุธที่ทรงพลังที่สุดที่จะนำพาคุณสู่เส้นชัย",
        "en": "Keep plowing the field with steady resolve. Slow, methodical persistence will outpace flashy haste every time."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความดื้อรั้นหัวชนฝา",
          "ความเฉื่อยชาเบื่อหน่าย",
          "การติดหล่มในกิจวัตรเดิม",
          "ความเกียจคร้าน",
          "ความตระหนี่ถี่เหนียว"
        ],
        "en": [
          "Stubborn Rigidity",
          "Boredom",
          "Stagnation",
          "Laziness",
          "Obsessive Micromanagement"
        ]
      },
      "general": {
        "th": "ความดื้อรั้นไม่ยอมเปลี่ยนแปลง หรือกลายเป็นคนเฉื่อยชา ขี้เกียจ และติดอยู่ในความคุ้นเคยเดิมๆ จนไม่ยอมพัฒนา",
        "en": "Stubborn refusal to adapt, bogged down in soul-killing routine, petty perfectionism, or utter laziness."
      },
      "love": {
        "th": "ความสัมพันธ์จืดชืด ไร้ความตื่นเต้น คนรักดื้อรั้นไม่ยอมรับฟัง หรือความตระหนี่ทำให้ความรักหมดความหวาน",
        "en": "Deadening routine choking romance, stinginess, emotional stubbornness, or refusing to spice up the partnership."
      },
      "career": {
        "th": "ทำงานแบบหุ่นยนต์ ขาดความคิดสร้างสรรค์ ต่อต้านการเปลี่ยนแปลงในที่ทำงานจนกลายเป็นอุปสรรคของทีม",
        "en": "Bureaucratic inertia, resisting modern methods, becoming a workplace bottleneck due to stubborn pedantry."
      },
      "finance": {
        "th": "การเงินหยุดนิ่งไม่เติบโต หรือสูญเสียโอกาสทางการเงินเพราะความกลัวเกินเหตุจนไม่กล้าขยับตัว",
        "en": "Financial stagnation from excessive conservatism, or hoarding cash under the mattress while inflation eats it."
      },
      "health": {
        "th": "กล้ามเนื้อยึดตึง ขาดความยืดหยุ่น เหนื่อยล้าจากการทำงานหนักซ้ำๆ โดยไม่มีการเปลี่ยนอิริยาบถ",
        "en": "Stiff joints, chronic muscular rigidity, lethargy from lack of dynamic movement, and postural fatigue."
      },
      "advice": {
        "th": "เปิดใจรับการเปลี่ยนแปลงและเพิ่มความยืดหยุ่นในชีวิต อย่าปล่อยให้ความมั่นคงกลายเป็นกรงขังจิตวิญญาณของคุณ",
        "en": "Break free from rigid stubbornness. Shake up your routine and introduce fresh flexibility into your daily walk."
      }
    }
  },
  "pentacles_13": {
    "upright": {
      "keywords": {
        "th": [
          "ราชินีแห่งความอุดมสมบูรณ์",
          "ความอบอุ่นเอื้ออารี",
          "แม่ผู้ดูแลทุกสรรพสิ่ง",
          "ความมั่งคั่งในเรือนใจ",
          "ความเป็นอยู่สุขสบาย"
        ],
        "en": [
          "Earthy Nurturer",
          "Domestic Abundance",
          "Practical Prosperity",
          "Generosity",
          "Sensible Care"
        ]
      },
      "general": {
        "th": "ราชินีนั่งบนบัลลังก์แกะสลักผลไม้ท่ามกลางธรรมชาติอันงดงาม โอบอุ้มเหรียญทองด้วยความทะนุถนอม สื่อถึงความอบอุ่น ความอุดมสมบูรณ์ การดูแลเอาใจใส่ และความมั่งคั่งที่สร้างความสุขให้ทุกคน",
        "en": "The sovereign queen seated amidst blossoming gardens and wildlife, cradling a golden pentacle. Warm maternal nurturing, practical abundance, and domestic grace."
      },
      "love": {
        "th": "ความรักที่อบอุ่น มั่นคง และดูแลกันอย่างดีเลิศ เป็นแม่บ้านแม่เรือนหรือคู่ชีวิตที่คอยเกื้อหนุนให้ครอบครัวเจริญรุ่งเรือง",
        "en": "A deeply loving, grounded, and generous partner; creating a warm, comfortable, and prosperous domestic haven."
      },
      "career": {
        "th": "การบริหารงานด้วยความเข้าอกเข้าใจและมีประสิทธิภาพสูง ประสบความสำเร็จในธุรกิจบริการ อาหาร อสังหาริมทรัพย์ หรือการดูแลผู้คน",
        "en": "Thriving in hospitality, interior design, agriculture, culinary arts, healthcare, and pragmatic executive roles."
      },
      "finance": {
        "th": "ความมั่งคั่งที่มั่นคง บริหารเงินได้อย่างชาญฉลาด มีบ้านที่อบอุ่นและอาหารบริบูรณ์สำหรับทุกคนในครอบครัว",
        "en": "Prosperous domestic wealth, wise household budgeting, profitable property investments, and loving generosity."
      },
      "health": {
        "th": "สุขภาพร่างกายและจิตใจแข็งแรง อุดมสมบูรณ์ ผิวพรรณสดใส ได้รับการบำรุงด้วยอาหารที่ดีและมีคุณภาพ",
        "en": "Flourishing holistic vitality, glowing skin, balanced nutrition, and grounding connection to mother earth."
      },
      "advice": {
        "th": "ดูแลตนเองและคนที่คุณรักด้วยความอบอุ่นและเอื้ออาทร ความมั่งคั่งที่แท้จริงคือการมีชีวิตที่เปี่ยมด้วยความสุขและความอบอุ่น",
        "en": "Nurture your home and nourish your body. True prosperity is creating warmth, comfort, and safety for those you love."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความวิตกกังวลเรื่องเงิน",
          "การละเลยครอบครัว",
          "ความตระหนี่เห็นแก่ตัว",
          "ความไม่มั่นคงในบ้าน",
          "การบำรุงบำเรอตนเองเกินตัว"
        ],
        "en": [
          "Financial Anxiety",
          "Domestic Neglect",
          "Smothering",
          "Materialism",
          "Work-Life Imbalance"
        ]
      },
      "general": {
        "th": "ความเครียดเรื่องเงินทองจนละเลยความสุขในครอบครัว หรือการปรนเปรอตนเองด้วยวัตถุเพื่อชดเชยความว่างเปล่าในใจ",
        "en": "Obsessive worry over money poisoning domestic peace, neglecting self-care, smothering loved ones, or superficial vanity."
      },
      "love": {
        "th": "ความสัมพันธ์ที่ให้ความสำคัญกับเงินทองมากกว่าความรู้สึก หรือการเป็นแม่บ้านที่คอยควบคุมและบงการทุกคนในบ้าน",
        "en": "Smothering control in romance, measuring love strictly by material gifts, or domestic friction over expenses."
      },
      "career": {
        "th": "ขาดความสมดุลระหว่างงานกับชีวิตครอบครัว โหมงานหนักจนไม่มีเวลาให้บ้าน หรือการบริหารงานที่จู้จี้จุกจิกเกินไป",
        "en": "Work-life imbalance causing domestic breakdown, micromanaging subordinates, and professional exhaustion."
      },
      "finance": {
        "th": "วิตกกังวลเรื่องเงินมากเกินไปจนกลายเป็นคนตระหนี่ หรือในทางตรงข้ามคือการใช้เงินช้อปปิ้งของแต่งบ้านจนเกินงบ",
        "en": "Financial panic hoarding, compulsive spending on interior luxury to compensate for anxiety, and budget leaks."
      },
      "health": {
        "th": "ปัญหาเกี่ยวกับระบบย่อยอาหาร น้ำหนักตัวเพิ่มขึ้นจากความเครียด หรือการละเลยสุขอนามัยของตนเอง",
        "en": "Stress-induced eating disorders, metabolic sluggishness, neglecting physical wellness, and exhaustion."
      },
      "advice": {
        "th": "ผ่อนคลายและกลับมาดูแลจิตใจของตนเอง ความสุขในบ้านไม่ได้สร้างขึ้นจากเงินทองเพียงอย่างเดียวแต่เกิดจากความรักและความอบอุ่น",
        "en": "Breathe and ground yourself. Step out into nature and remember that peace in the heart is the greatest treasure."
      }
    }
  },
  "pentacles_14": {
    "upright": {
      "keywords": {
        "th": [
          "ราชาแห่งความมั่งคั่ง",
          "จักรพรรดิแห่งธุรกิจ",
          "ความสำเร็จทางการเงินสูงสุด",
          "ความมั่นคงดั่งขุนเขา",
          "ผู้อุปถัมภ์ที่ยิ่งใหญ่"
        ],
        "en": [
          "Financial Empire",
          "Business Tycoon",
          "Supreme Prosperity",
          "Steadfast Provider",
          "Master of Wealth"
        ]
      },
      "general": {
        "th": "ราชาประทับบนบัลลังก์ที่ประดับด้วยวัวกระทิง สวมเสื้อคลุมลายเถาองุ่นอันวิจิตร สื่อถึงผู้ที่ประสบความสำเร็จสูงสุดในโลกธุรกิจ ความมั่งคั่งระดับมหาเศรษฐี และความมั่นคงถาวร",
        "en": "The sovereign monarch of earth seated upon his throne carved with bulls, his castle standing proud behind him. Supreme business empire, tycoon wealth, and steadfast patronage."
      },
      "love": {
        "th": "คนรักที่เป็นผู้ใหญ่ อบอุ่น มีฐานะมั่นคงระดับแนวหน้า คอยดูแลและให้ความปลอดภัยในชีวิตแก่คุณได้อย่างสมบูรณ์แบบ",
        "en": "An accomplished, generous, and steadfast partner who provides complete material luxury and unshakeable security."
      },
      "career": {
        "th": "ตำแหน่งประธานกรรมการ เจ้าของธุรกิจพันล้าน หรือผู้นำระดับสูงในวงการการเงินและการลงทุน ประสบความสำเร็จอย่างยิ่งใหญ่",
        "en": "Reaching the absolute pinnacle of commerce, industrial leadership, lucrative enterprise, and undisputed corporate authority."
      },
      "finance": {
        "th": "ความมั่งคั่งระดับสูงสุด มีทรัพย์สินมหาศาล การลงทุนในอสังหาริมทรัพย์และธุรกิจให้ผลตอบแทนมหาศาลตลอดเวลา",
        "en": "Empire-level wealth, vast property assets, effortless cash flow generation, and complete financial mastery."
      },
      "health": {
        "th": "สุขภาพร่างกายแข็งแรงสมบูรณ์ มีชีวิตที่สุขสบาย อายุยืนยาวและได้รับการดูแลสุขภาพในระดับพรีเมียม",
        "en": "Robust constitution, longevity, luxurious wellness retreats, and excellent holistic physical health."
      },
      "advice": {
        "th": "บริหารจัดการความมั่งคั่งด้วยปัญญาและคุณธรรม จงใช้ความสำเร็จของคุณเพื่อสร้างความเจริญรุ่งเรืองและเกื้อกูลสังคม",
        "en": "Govern your material realm with steady wisdom and honorable generosity. True kings build enduring abundance for all."
      }
    },
    "reversed": {
      "keywords": {
        "th": [
          "ความโลภครอบงำ",
          "ความตระหนี่เห็นแก่ตัว",
          "ความล้มเหลวทางธุรกิจ",
          "การใช้เงินซื้อทุกสิ่ง",
          "การล้มละลายของจักรวรรดิ"
        ],
        "en": [
          "Greed",
          "Financial Tyranny",
          "Bankruptcy",
          "Materialism",
          "Corrupt Power"
        ]
      },
      "general": {
        "th": "ความโลภและความหลงใหลในเงินตราจนทำลายคุณธรรม การล่มสลายของธุรกิจเพราะการตัดสินใจที่ผิดพลาด หรือการมองทุกอย่างเป็นเรื่องผลประโยชน์",
        "en": "Greedy materialism, ruthless corporate exploitation, bankruptcy of an empire, and measuring human worth strictly by bank accounts."
      },
      "love": {
        "th": "คนรักที่เห็นแก่เงิน ใช้เงินบงการหรือมองความรักเป็นเพียงการซื้อขาย ขาดความจริงใจและไร้ความอบอุ่น",
        "en": "Treating a lover like a trophy possession, cold materialism destroying emotional intimacy, or financial blackmail."
      },
      "career": {
        "th": "ธุรกิจประสบปัญหาขาดทุนอย่างหนัก การตัดสินใจลงทุนที่ผิดพลาด หรือการทุจริตคอร์รัปชันที่ถูกเปิดโปง",
        "en": "Corporate bankruptcy, disastrous financial mismanagement, white-collar scandals, and falling from the heights of commerce."
      },
      "finance": {
        "th": "สูญเสียทรัพย์สินก้อนโต หนี้สินธุรกิจรุมเร้า วิกฤตสภาพคล่องทางการเงินที่คุกคามความมั่นคง",
        "en": "Catastrophic financial losses, collapsing stock portfolios, bad debts, and destruction of wealth through recklessness."
      },
      "health": {
        "th": "โรคที่เกิดจากความเครียดเรื่องเงินและธุรกิจ โรคหัวใจ ความดันโลหิตสูง หรือโรคเกาต์จากการกินดื่มหรูหราเกินตัว",
        "en": "Gout, cardiovascular stress from corporate pressures, high cholesterol, and health breakdown from relentless greed."
      },
      "advice": {
        "th": "เงินทองไม่สามารถซื้อความสุขและความจริงใจได้ จงหยุดความโลภและหันกลับมารักษาคุณธรรมและคนที่รักคุณจริงๆ",
        "en": "Remember that you cannot take gold into the grave. Shed ruthless greed and realign with genuine spiritual values."
      }
    }
  }
};

// Automatically enrich TAROT_CARDS if already loaded in the environment
if (typeof TAROT_CARDS !== "undefined" && Array.isArray(TAROT_CARDS)) {
  TAROT_CARDS.forEach(card => {
    const meta = TAROT_MINOR_DATA[card.id];
    if (meta) {
      if (meta.upright) {
        if (meta.upright.keywords) card.upright.keywords = meta.upright.keywords;
        if (meta.upright.general) card.upright.general = meta.upright.general;
        if (meta.upright.career) card.upright.career = meta.upright.career;
        if (meta.upright.finance) card.upright.finance = meta.upright.finance;
        if (meta.upright.health) card.upright.health = meta.upright.health;
        if (meta.upright.advice) card.upright.advice = meta.upright.advice;
        if (meta.upright.love) {
          card.upright.love = {
            th: meta.upright.love.th,
            en: meta.upright.love.en,
            single: card.upright.love ? card.upright.love.single : undefined,
            couple: card.upright.love ? card.upright.love.couple : undefined
          };
        }
      }
      if (meta.reversed) {
        if (meta.reversed.keywords) card.reversed.keywords = meta.reversed.keywords;
        if (meta.reversed.general) card.reversed.general = meta.reversed.general;
        if (meta.reversed.career) card.reversed.career = meta.reversed.career;
        if (meta.reversed.finance) card.reversed.finance = meta.reversed.finance;
        if (meta.reversed.health) card.reversed.health = meta.reversed.health;
        if (meta.reversed.advice) card.reversed.advice = meta.reversed.advice;
        if (meta.reversed.love) {
          card.reversed.love = {
            th: meta.reversed.love.th,
            en: meta.reversed.love.en,
            single: card.reversed.love ? card.reversed.love.single : undefined,
            couple: card.reversed.love ? card.reversed.love.couple : undefined
          };
        }
      }
    }
  });
  console.log("[Tarot Sanctuary] Minor Arcana 56 cards enriched with unique authentic readings.");
}

// Window attachment
if (typeof window !== "undefined") {
  window.TAROT_MINOR_DATA = TAROT_MINOR_DATA;
}
