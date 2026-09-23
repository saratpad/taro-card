/**
 * Mystic Witch Tarot Sanctuary - Love Divination Intelligence (Singles & Couples)
 * คำทำนายเฉพาะด้านความรัก: แยกสำหรับคนโสด (Singles) และคนมีคู่ (Couples)
 * ครบทั้ง 78 ใบ (ทั้งไพ่ตั้งตรง Upright และไพ่กลับหัว Reversed)
 */

const TAROT_LOVE_DATA = {
  "m_00": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบรักแบบกะทันหันกับคนรักอิสระ สายลุย หรือคนอายุน้อยกว่า มีความสดใหม่ตื่นเต้น แต่ยังเน้นความสนุกสนาน ยังไม่พร้อมผูกมัดจริงจัง",
        "en": "Potential spontaneous romance with a free spirit, adventurer, or younger admirer. Thrilling and fresh, though prioritizing fun over serious commitment."
      },
      "couple": {
        "th": "ความสัมพันธ์สดใสเหมือนเพิ่งจีบกันใหม่ๆ ชวนกันไปเที่ยวเปิดหูเปิดตา แต่ระวังเรื่องความเอาแต่ใจหรือการทำอะไรตามอารมณ์โดยไม่ปรึกษากัน",
        "en": "The relationship feels rejuvenated and adventurous, like the honeymoon phase. Take a trip together, but beware of impulsive unilateral decisions."
      }
    },
    "reversed": {
      "single": {
        "th": "ระวังเจอคนเจ้าชู้ ไม่จริงใจ มาไวเคลมไว รักสนุกแต่ไม่รับผิดชอบ หรือตัวคุณเองยังกล้าๆ กลัวๆ จนพลาดโอกาสดีๆ",
        "en": "Beware of unreliable flirts seeking casual thrills without accountability, or fear of vulnerability holding you back from worthy connections."
      },
      "couple": {
        "th": "อีกฝ่ายอาจทำตัวไม่น่าไว้ใจ ทำอะไรไม่คิดถึงอนาคตร่วมกัน หรือมีความไม่แน่นอนจนทำให้รู้สึกไม่มั่นคงในความสัมพันธ์",
        "en": "One partner exhibits irresponsible or unpredictable behavior, sparking anxiety and doubts about long-term stability."
      }
    }
  },
  "m_01": {
    "upright": {
      "single": {
        "th": "เสน่ห์แพรวพราว มีคนเข้ามาคุยเยอะ จะได้เจอคนคุยเก่ง ฉลาด มีไหวพริบ หรือเป็นรักแรกพบที่เคมีตรงกันอย่างน่าอัศจรรย์",
        "en": "Magnetic romantic attraction and witty banter. You may meet someone intelligent, charming, and charismatic with instant chemistry."
      },
      "couple": {
        "th": "การสื่อสารดีเยี่ยม เข้าใจกันมากขึ้น สามารถแก้ปัญหาความเข้าใจผิดได้ และเติมความหวานความแปลกใหม่ให้ความสัมพันธ์",
        "en": "Superb communication and renewed intimacy. Ideal timing to talk openly, resolve past misunderstandings, and spark fresh passion."
      }
    },
    "reversed": {
      "single": {
        "th": "ระวังเจอคนปากหวานก้นเปรี้ยว หว่านเสน่ห์ไปทั่ว หรือโดนหลอกคุยซ้อนเพื่อผลประโยชน์",
        "en": "Beware of sweet talkers with hidden agendas, deceptive flatterers, or manipulative players who juggle multiple romantic prospects."
      },
      "couple": {
        "th": "มีความลับหรือคำโกหกปิดบังกัน ความไม่ซื่อสัตย์เริ่มสั่นคลอนความไว้ใจ ระวังการสื่อสารที่บิดเบือน",
        "en": "Distrust caused by withheld truths, broken promises, or manipulative gaslighting eroding emotional safety."
      }
    }
  },
  "m_02": {
    "upright": {
      "single": {
        "th": "มีเสน่ห์ลึกลับน่าค้นหา มักมีคนแอบชอบหรือคุณไปแอบรักใครบางคน เป็นความรักที่เงียบสงบหรืออยู่ในโลกส่วนตัว",
        "en": "Mysterious, quiet allure. A secret admirer may be observing you, or you harbor deep unspoken feelings for someone special."
      },
      "couple": {
        "th": "เข้าใจกันลึกซึ้งโดยไม่ต้องพูด สื่อสารผ่านความรู้สึกและสัญชาตญาณได้อย่างแม่นยำ แต่อย่าเก็บงำความในใจจนกลายเป็นกำแพง",
        "en": "A telepathic, soulful connection requiring few words. Trust your inner radar, but avoid building walls of secrecy."
      }
    },
    "reversed": {
      "single": {
        "th": "ระวังเข้าไปพัวพันกับรักซ้อน เป็นมือที่สามโดยไม่รู้ตัว หรืออารมณ์หวั่นไหวกับคนที่มีเจ้าของแล้ว",
        "en": "High risk of becoming entangled in a love triangle, secret affair, or falling for someone emotionally unavailable."
      },
      "couple": {
        "th": "ความหวาดระแวง ไม่ไว้ใจ มีเรื่องปกปิด หรือมีบุคคลที่สามเข้ามาสร้างความปั่นป่วนในความสัมพันธ์",
        "en": "Paranoia, concealed secrets, or intuitive red flags indicating third-party interference and emotional withdrawal."
      }
    }
  },
  "m_03": {
    "upright": {
      "single": {
        "th": "ดวงความรักโดดเด่น มีเสน่ห์อบอุ่น จะมีคนเข้ามาดูแลเอาใจใส่ หรือเจอคนพร้อมสร้างครอบครัวที่จริงจัง",
        "en": "Radiant romantic warmth. You draw in attentive, nurturing suitors who value security and see long-term domestic potential."
      },
      "couple": {
        "th": "ความสัมพันธ์อุดมสมบูรณ์ มีความสุข ความอบอุ่น มีเกณฑ์แต่งงาน หรือมีข่าวดีเรื่องการตั้งครรภ์/มีบุตร",
        "en": "Deeply affectionate, harmonious partnership. Auspicious timing for engagements, moving in, wedding vows, or pregnancy."
      }
    },
    "reversed": {
      "single": {
        "th": "รู้สึกเหงา รู้สึกว่ายังไม่มีใครเห็นคุณค่า หรือทุ่มเทให้คนอื่นมากไปจนลืมรักและดูแลตัวเอง",
        "en": "Feeling unappreciated or overextending emotional energy onto undeserving partners. Practice intentional self-love."
      },
      "couple": {
        "th": "ความตึงเครียดเรื่องการจู้จี้จุกจิก เอาแต่ใจ หรือรู้สึกว่าตนเองเป็นฝ่ายให้เพียงคนเดียวจนเหนื่อยใจ",
        "en": "Smothering affection, nagging tensions, or emotional exhaustion from feeling like an unreciprocated caregiver."
      }
    }
  },
  "m_04": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบคนอายุมากกว่า มีวุฒิภาวะ มั่นคง ฐานะดี เข้ามาปกป้องดูแล แม้จะดูเคร่งขรึมแต่จริงจังและพึ่งพาได้",
        "en": "A mature, established, protective suitor may enter your life. They may be reserved, but they offer genuine loyalty and stability."
      },
      "couple": {
        "th": "ความสัมพันธ์มั่นคง เป็นหลักประกันในชีวิต แต่อีกฝ่ายอาจมีนิสัยชอบบงการหรือเผด็จการบ้าง ต้องประนีประนอม",
        "en": "Rock-solid security and shared structure, though one partner's need for control may require gentle boundary negotiation."
      }
    },
    "reversed": {
      "single": {
        "th": "อาจเจอคนนิสัยเจ้าอารมณ์ เผด็จการ เอาตัวเองเป็นศูนย์กลาง หรือยังยึดติดกับทิฐิของตัวเองจนปิดกั้นความรัก",
        "en": "Watch out for domineering, rigid personalities, or emotional stubbornness preventing meaningful connection."
      },
      "couple": {
        "th": "ความขัดแย้งเรื่องการแย่งชิงอำนาจ ทะเลาะกันเรื่องความไม่ยอมใคร อึดอัดเพราะถูกกดดันหรือตั้งกฎเกณฑ์มากเกินไป",
        "en": "Ego clashes, tyrannical dominance, or harsh ultimatums generating stifling resentment within the partnership."
      }
    }
  },
  "m_05": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบรักจากการแนะนำของผู้ใหญ่ หรือพบคนเรียบร้อย มีศีลธรรม คบหาแบบให้เกียรติและถูกต้องตามประเพณี",
        "en": "Romance through family introductions or traditional social settings. Attracting an ethical, respectful partner seeking marriage."
      },
      "couple": {
        "th": "ความสัมพันธ์มั่นคง เข้าตามตรอกออกตามประตู มีเกณฑ์หมั้นหมาย แต่งงาน หรือได้รับความเห็นชอบจากผู้ใหญ่ทั้งสองฝ่าย",
        "en": "Traditional stability, shared moral values, and social blessing. Ideal for formal engagement or matrimonial milestones."
      }
    },
    "reversed": {
      "single": {
        "th": "ยังไม่พร้อมผูกมัดตามกรอบสังคม หรือเจอคนที่ทัศนคติ/ความเชื่อต่างกันจนคุยกันยาก ต้องปรับจูนกันมาก",
        "en": "Rejecting conventional dating norms, or struggling with stark philosophical and religious differences with a love interest."
      },
      "couple": {
        "th": "รู้สึกเบื่อหน่ายกับความสัมพันธ์ที่จืดชืด ขาดสีสัน หรือมีปัญหาเรื่องขนบธรรมเนียมและผู้ใหญ่เข้ามากดดัน",
        "en": "Stifling marital monotony, dogmatic familial interference, or clashing over traditional expectations."
      }
    }
  },
  "m_06": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบเนื้อคู่ (Soulmate) คนที่คลิกกันอย่างลึกซึ้ง หัวใจพองโต มีคนเข้ามาให้เลือกและคุณจะเป็นฝ่ายตัดสินใจ",
        "en": "High soulmate potential! An intoxicating romantic connection where core values align seamlessly, sparking deep love."
      },
      "couple": {
        "th": "ความรักหวานชื่น โรแมนติก ผูกพันกันอย่างแน่นแฟ้น เป็นช่วงเวลาที่อินเลิฟและเข้าใจกันมากที่สุด",
        "en": "Blissful romance, exquisite harmony, and complete mutual devotion. The bond is fortified with heartfelt appreciation."
      }
    },
    "reversed": {
      "single": {
        "th": "เกิดความลังเล รักพี่เสียดายน้อง หรือเจอความสัมพันธ์ที่ศีลไม่เสมอกัน ต้องเลือกให้ดีระหว่างความสุขชั่วคราวกับอนาคต",
        "en": "Torn between choices, or falling into infatuation where values fundamentally clash. Avoid choosing out of fear."
      },
      "couple": {
        "th": "เกิดรอยร้าว ทัศนคติไม่ตรงกัน หรือเผชิญปัญหารักสามเส้า การนอกใจที่ต้องตัดสินใจเลือกทางเดินอย่างเด็ดขาด",
        "en": "Diverging paths, broken trust, or third-party interference requiring an honest, decisive reckoning."
      }
    }
  },
  "m_07": {
    "upright": {
      "single": {
        "th": "ต้องลุยและใช้ความกล้าในการจีบ อาจได้พบคนแดนไกล หรือคนในเครื่องแบบ/สายลุยที่ต้องใช้ความพยายามพิชิตใจ",
        "en": "Bold pursuit yields romantic victory! Potential connection with someone from afar, in uniform, or driven by ambition."
      },
      "couple": {
        "th": "ต้องร่วมมือกันฝ่าฟันอุปสรรค บางคู่อาจต้องห่างไกลกันด้วยหน้าที่ แต่ความมุ่งมั่นจะทำให้ผ่านไปได้อย่างราบรื่น",
        "en": "Tackling shared hurdles united as a team. Distance or busy careers are overcome through deliberate dedication."
      }
    },
    "reversed": {
      "single": {
        "th": "เหนื่อยล้ากับการวิ่งตามความรัก อีกฝ่ายอาจยังไม่สนใจ หรือใจร้อนเกินไปจนทำให้อีกฝ่ายถอยหนี",
        "en": "Burnout from one-sided chasing, or aggressive rushing scaring off a potential partner. Slow down and re-center."
      },
      "couple": {
        "th": "การปะทะคารม ทะเลาะกันด้วยอารมณ์เอาชนะ การควบคุมอารมณ์ไม่อยู่จนความสัมพันธ์สั่นคลอน",
        "en": "Reckless arguments driven by an egoistic desire to win fights rather than protect the relationship's harmony."
      }
    }
  },
  "m_08": {
    "upright": {
      "single": {
        "th": "คุณมีเสน่ห์ดึงดูดและพลังใจเข้มแข็ง มักดึงดูดคนที่ยอมให้คุณเป็นผู้นำ หรือเจอคนที่คุณสามารถกำราบให้อยู่หมัดได้ด้วยความอ่อนโยน",
        "en": "Quiet magnetism and emotional resilience. You attract partners captivated by your inner poise and gentle compassion."
      },
      "couple": {
        "th": "ใช้ความอ่อนโยนและความเข้าใจสยบความดื้อของคนรัก ประคองความสัมพันธ์ได้อย่างมั่นคงด้วยความเมตตา",
        "en": "Patience and soft power tame fiery tempers. Compassionate listening overcomes stubborn resistance."
      }
    },
    "reversed": {
      "single": {
        "th": "ขาดความมั่นใจในตัวเอง หรือพยายามฝืนทนในความสัมพันธ์ที่เจ็บปวดเพราะกลัวความเหงา",
        "en": "Struggling with self-doubt, lowering your standards, or staying trapped in situations that dim your radiance."
      },
      "couple": {
        "th": "ความอดทนเริ่มหมดลง เกิดความระหองระแหง ไม่ยอมฟังกัน หรือฝ่ายใดฝ่ายหนึ่งหมดพลังใจในการประคับประคอง",
        "en": "Emotional exhaustion, depleted patience, and explosive outbursts threatening the foundation of the bond."
      }
    }
  },
  "m_09": {
    "upright": {
      "single": {
        "th": "ช่วงนี้ครองความโสดอย่างสงบ เน้นพัฒนาตัวเองและเยียวยาจิตใจ ยังไม่รีบร้อนมีใคร เป็นช่วงค้นหาความสุขจากภายใน",
        "en": "Contented solitude and reflective healing. You are gaining crystal-clear clarity on what you truly need in a soul partner."
      },
      "couple": {
        "th": "ต่างคนต่างต้องการพื้นที่ส่วนตัว ความสัมพันธ์อาจดูนิ่งๆ เงียบๆ หรือต้องห่างกันชั่วคราวแต่ยังคงผูกพันลึกซึ้ง",
        "en": "A contemplative lull where both partners require healthy personal space to recalibrate individual purpose."
      }
    },
    "reversed": {
      "single": {
        "th": "รู้สึกโดดเดี่ยว อ้างว้าง ขังตัวเองไว้ในอดีตจนไม่กล้าเปิดรับใครเข้ามา ถึงเวลาเปิดประตูใจสู่โลกภายนอก",
        "en": "Painful loneliness, emotional isolation, or lingering grief keeping your heart locked away. Step into the light."
      },
      "couple": {
        "th": "เกิดกำแพงความเงียบใส่กัน ขาดการสื่อสาร จนทำให้รู้สึกเหมือนอยู่ตัวคนเดียวในความสัมพันธ์",
        "en": "Stonewalling, cold withdrawal, and growing emotional distance creating an isolating chill between you."
      }
    }
  },
  "m_10": {
    "upright": {
      "single": {
        "th": "โชคชะตาพัดพาให้พบรักกะทันหัน มีเกณฑ์พบคู่บุญ หรือความรักที่เหมือนบุพเพสันนิวาสที่จังหวะชีวิตหมุนมาบรรจบ",
        "en": "Karmic destiny in motion! A fateful encounter or serendipitous turn of events brings a profound connection."
      },
      "couple": {
        "th": "ความสัมพันธ์ก้าวหน้าไปอีกขั้น พลิกฟื้นจากวิกฤตสู่ความเข้าใจอันดี มีข่าวดีหรือจุดเปลี่ยนมงคลร่วมกัน",
        "en": "A lucky upward shift! Tough times dissolve as fortunate circumstances elevate your union to higher joy."
      }
    },
    "reversed": {
      "single": {
        "th": "จังหวะความรักยังไม่ลงตัว คลาดแคล้วกับคนที่ถูกใจ หรือยังต้องรอคอยเวลาที่เหมาะสม อย่าเพิ่งฝืนโชคชะตา",
        "en": "Frustrating timing, near-misses, and feeling out of sync with romantic prospects. Trust the divine delay."
      },
      "couple": {
        "th": "เกิดความเปลี่ยนแปลงที่ไม่คาดคิด ความสัมพันธ์ขึ้นๆ ลงๆ ต้องอาศัยความอดทนรอคอยให้พายุผ่านไป",
        "en": "Unpredictable external setbacks testing your bond. Weather the turbulence together with mutual reassurance."
      }
    }
  },
  "m_11": {
    "upright": {
      "single": {
        "th": "ความรักต้องชัดเจน ไม่คลุมเครือ หากจะคุยกับใครต้องดูความจริงใจและความถูกต้องเป็นหลัก จะได้คนตรงไปตรงมา",
        "en": "Fairness and truth rule the heart. You attract honest, principled individuals who value clarity and respect."
      },
      "couple": {
        "th": "ความสัมพันธ์เสมอภาค แฟร์ทั้งสองฝ่าย มีการตกลงเรื่องอนาคต หรือการจดทะเบียนสมรสอย่างถูกต้อง",
        "en": "Balanced give-and-take, legal commitments, marriage certifications, and honoring reciprocal promises."
      }
    },
    "reversed": {
      "single": {
        "th": "ระวังเจอคนไม่ยุติธรรม คุยซ้อน ไม่ชัดเจน หรือโดนเอาเปรียบทางความรู้สึกโดยไม่ได้อะไรตอบแทน",
        "en": "Warning against deceit, broken agreements, or getting exploited in one-sided, ambiguous connections."
      },
      "couple": {
        "th": "มีความไม่เท่าเทียม การจับผิด ทะเลาะกันเรื่องความถูกต้อง หรือมีเรื่องคดีความ/การหย่าร้างที่ต้องสะสาง",
        "en": "Blame games, unfair double standards, or legal disputes such as divorce proceedings demanding resolution."
      }
    }
  },
  "m_12": {
    "upright": {
      "single": {
        "th": "อยู่ในช่วงพักใจ ไม่พร้อมเริ่มต้นใหม่ หรือแอบรักคนที่ยังเป็นไปไม่ได้ ต้องยอมปล่อยวางเพื่อรอจังหวะใหม่",
        "en": "A deliberate romantic pause. Let go of unrequited attachments; surrender old patterns to receive fresh blessings."
      },
      "couple": {
        "th": "อยู่ในภาวะกลืนไม่เข้าคายไม่ออก การเสียสละเพื่อคนรัก หรือความสัมพันธ์ที่หยุดนิ่งรอการคลี่คลายอย่างอดทน",
        "en": "Mutual sacrifices or a standstill phase. Patience and viewing the relationship from a higher vantage point are crucial."
      }
    },
    "reversed": {
      "single": {
        "th": "การจมปลักกับรักเก่าที่ไม่คู่ควร ทรมานตัวเองซ้ำๆ ถึงเวลาต้องตัดใจและเลิกเสียสละอย่างไร้ค่า",
        "en": "Martyring yourself for an ex who will not return. Break free from self-imposed emotional stagnation."
      },
      "couple": {
        "th": "ความอดทนที่ไร้ประโยชน์ หรือการทนทุกข์ในความสัมพันธ์ที่เป็นพิษ (Toxic Relationship) ถึงเวลาตัดสินใจเพื่อชีวิตตนเอง",
        "en": "Senseless martyrdom in a toxic loop. Stop enduring unfair mistreatment; prioritize your sovereign dignity."
      }
    }
  },
  "m_13": {
    "upright": {
      "single": {
        "th": "จบสิ้นความเจ็บปวดในอดีต ล้างไพ่เพื่อเริ่มต้นชีวิตรักบทใหม่ที่สดใสกว่าเดิม วงจรรักเก่าปิดฉากลงแล้ว",
        "en": "Total rebirth! Painful past chapters close permanently, clearing sacred space for authentic new love."
      },
      "couple": {
        "th": "การเปลี่ยนแปลงครั้งใหญ่ อาจเป็นการปรับเปลี่ยนนิสัยเดิมๆ หรือการยุติความสัมพันธ์เพื่อเริ่มต้นชีวิตใหม่ที่ดีกว่า",
        "en": "Profound transformation: shedding outdated dynamics to resurrect the bond, or a clean amicable parting."
      }
    },
    "reversed": {
      "single": {
        "th": "ยังยึดติดกับคนเก่า ไม่ยอมปล่อยมือจากอดีต ทำให้ปิดกั้นรักใหม่ที่กำลังจะเข้ามาส่งสัญญาณ",
        "en": "Clinging desperately to ghosts of past romance, hindering healthy new suitors from entering your life."
      },
      "couple": {
        "th": "ยื้อความสัมพันธ์ที่หมดอายุไปแล้ว คาราคาซัง ไม่กล้าบอกเลิกหรือยอมรับความจริงที่เปลี่ยนไป",
        "en": "Dragging out an expired union out of fear of change. Refusing to address obvious inevitable closure."
      }
    }
  },
  "m_14": {
    "upright": {
      "single": {
        "th": "พบคนที่เข้ามาเติมเต็ม มีการค่อยๆ ปรับตัวเข้าหากันอย่างราบรื่น ไม่หวือหวาแต่มั่นคงและอบอุ่นใจ",
        "en": "Gentle, harmonious alignment. Meeting someone who brings calm balance, peaceful pacing, and emotional chemistry."
      },
      "couple": {
        "th": "ความสัมพันธ์ประนีประนอม สื่อสารและปรับความเข้าใจกันได้ดี คอยประคองและเติมเต็มกันและกันเสมอ",
        "en": "Sweet equilibrium, emotional moderation, and patient synergy. You find common ground effortlessly."
      }
    },
    "reversed": {
      "single": {
        "th": "อารมณ์ไม่นิ่ง เดี๋ยวอยากมีคู่เดี๋ยวอยากโสด หรือเจอคนที่ไม่ลงรอยกันอย่างแรงเพราะความใจร้อน",
        "en": "Erratic emotional volatility or impatient haste causing promising early talks to fizzle out."
      },
      "couple": {
        "th": "ขาดความสมดุล การทะเลาะด้วยเรื่องไม่เป็นเรื่อง ไม่มีความพอดี หรือปรับตัวหากันไม่สำเร็จ",
        "en": "Clashing extremes, chronic friction, and inability to compromise leading to emotional imbalance."
      }
    }
  },
  "m_15": {
    "upright": {
      "single": {
        "th": "เสน่ห์ทางเพศรุนแรง ดึงดูดความสัมพันธ์ที่เน้นความหลงใหล ร้อนแรง หรือความลุ่มหลงที่ถอนตัวยาก",
        "en": "Raw magnetism and intense sensual allure. Watch out for intoxicating yet co-dependent infatuations."
      },
      "couple": {
        "th": "มีความหลงใหลผูกพันสูง แต่ระวังเรื่องความหึงหวง หวาดระแวง และการพยายามครอบครองเป็นเจ้าของเกินไป",
        "en": "Fierce romantic passion intertwined with unhealthy possessiveness, jealousy, or toxic control games."
      }
    },
    "reversed": {
      "single": {
        "th": "ตาสว่าง หลุดพ้นจากความหลงหรือคนที่มาหลอกลวง พร้อมเริ่มต้นรักตัวเองและเลือกสิ่งที่ดีกว่า",
        "en": "Breaking free from toxic obsession and deceptive manipulators. Sovereignty and self-worth restored."
      },
      "couple": {
        "th": "ปลดแอกตัวเองจากความสัมพันธ์ที่เป็นพิษ สลัดความลุ่มหลงหรือเคลียร์ปัญหามือที่สามได้สำเร็จ",
        "en": "Severing unhealthy codependent patterns, purging third-party affairs, and healing relationship wounds."
      }
    }
  },
  "m_16": {
    "upright": {
      "single": {
        "th": "มีเหตุการณ์สะเทือนใจเรื่องความรัก หรือจู่ๆ ก็มีคนเข้ามาแบบสายฟ้าแลบจนตั้งตัวไม่ทัน ระวังใจตัวเอง",
        "en": "A sudden shock or unexpected romantic awakening. Illusions collapse swiftly to reveal the stark reality."
      },
      "couple": {
        "th": "ระวังการแตกหักกะทันหัน ทะเลาะรุนแรง หรือความลับที่ปกปิดไว้แตกออกอย่างไม่คาดคิด ต้องตั้งสติอย่างมาก",
        "en": "Explosive confrontations, unearthed secrets, or sudden relationship shakeups demanding raw authenticity."
      }
    },
    "reversed": {
      "single": {
        "th": "รอดพ้นจากเรื่องร้ายๆ หรือความสัมพันธ์อันตรายหวุดหวิด ค่อยๆ ฟื้นฟูสภาพจิตใจให้กลับมาแข็งแกร่ง",
        "en": "Narrowly dodging a catastrophic heartbreak or deceptive person. Rebuilding emotional stability quietly."
      },
      "couple": {
        "th": "ความตึงเครียดคุกรุ่นที่ยังไม่ระเบิด การประคับประคองผ่านช่วงวิกฤต หรือพยายามกอบกู้ซากความสัมพันธ์",
        "en": "Averting total collapse by the skin of your teeth; lingering tension must be peacefully disarmed."
      }
    }
  },
  "m_17": {
    "upright": {
      "single": {
        "th": "มีความหวังสดใส พบคนที่มีเสน่ห์ อ่อนโยน เข้ามาช่วยเยียวยาหัวใจ เป็นรักที่บริสุทธิ์และมีความหมาย",
        "en": "Renewed optimism! A serene, tender soul enters your orbit to heal old scars and restore your faith in love."
      },
      "couple": {
        "th": "ความสัมพันธ์สงบสุข อบอุ่น มีความเข้าใจและซื่อสัตย์ต่อกัน วางแผนอนาคตร่วมกันด้วยความหวังอันสดใส",
        "en": "Peace, trust, and shared dreams. Your future sparkles with mutual inspiration, loyalty, and calm devotion."
      }
    },
    "reversed": {
      "single": {
        "th": "รู้สึกหมดหวังในความรัก ผิดหวังซ้ำซาก หรือตั้งสเปกไว้สูงเกินความเป็นจริงจนมองข้ามคนดีๆ",
        "en": "Pessimism, feeling unlovable, or chasing impossible ideals while ignoring genuine suitors around you."
      },
      "couple": {
        "th": "ความหม่นหมองในชีวิตคู่ หมดความตื่นเต้น ขาดแรงบันดาลใจในการร่วมสร้างอนาคต ต้องหมั่นเติมความหวาน",
        "en": "Loss of romantic faith, uninspired detachment, and feeling that the romantic spark has faded."
      }
    }
  },
  "m_18": {
    "upright": {
      "single": {
        "th": "สับสน ไม่แน่ใจในความรู้สึก คนที่เข้ามาอาจมีบางอย่างปิดบัง ไม่ชัดเจน หรือตัวคุณเองคิดมากไปเอง",
        "en": "Romantic uncertainty, illusions, and anxiety. A suitor may be withholding facts, or subconscious fears cloud your judgment."
      },
      "couple": {
        "th": "ความหวาดระแวง ความไม่ไว้วางใจ อารมณ์วิตกกังวล และความกลัวที่สร้างขึ้นมาเอง ควรรอให้ทุกอย่างกระจ่าง",
        "en": "Suspicion, moodiness, and fear of betrayal. Do not jump to conclusions without verifying objective truths."
      }
    },
    "reversed": {
      "single": {
        "th": "ความจริงเริ่มปรากฏ คลายความสงสัย เริ่มมองเห็นทางสว่างและเข้าใจความต้องการของหัวใจตนเอง",
        "en": "The fog lifts! Deceptions unravel, truth prevails, and you see lovers for who they truly are."
      },
      "couple": {
        "th": "ปัญหาคลุมเครือได้รับการเฉลย ปรับความเข้าใจกันได้ ความหวาดระแวงค่อยๆ สลายไปสู่ความโปร่งใส",
        "en": "Clearing of misunderstandings; open communication dismantles deep-seated anxiety and restores trust."
      }
    }
  },
  "m_19": {
    "upright": {
      "single": {
        "th": "ดวงความรักเปล่งประกายเจิดจ้า มีโอกาสพบคนที่ทำให้โลกสดใส มีความสุข สมหวังในรักอย่างแท้จริง",
        "en": "Radiant romantic bliss! Joyous breakthroughs, openhearted confession, and warm affection from an admiring partner."
      },
      "couple": {
        "th": "ความรักหวานชื่น มีความสุขล้นพ้น เปิดเผยอย่างภาคภูมิใจ มีข่าวดีเรื่องแต่งงานหรือมีบุตร",
        "en": "Jubilant celebrations, deep harmony, and pure delight. Propitious omens for weddings or welcoming children."
      }
    },
    "reversed": {
      "single": {
        "th": "ความสุขที่มาแบบชั่วคราว หรือต้องรอเวลาอีกสักนิดถึงจะได้พบความสุขที่แท้จริง อย่ารีบร้อนเกินไป",
        "en": "Temporary clouds obscuring joy; delay in romantic plans, or needing to overcome minor self-centeredness."
      },
      "couple": {
        "th": "ความสัมพันธ์อาจมีจุดมืดเล็กๆ ที่บดบังความสุข หรือความเอาแต่ใจของฝ่ายใดฝ่ายหนึ่งที่ต้องปรับลดลง",
        "en": "Overlooking the blessings in your partnership, or childish tantrums casting a shadow over mutual happiness."
      }
    }
  },
  "m_20": {
    "upright": {
      "single": {
        "th": "การตื่นรู้ทางหัวใจ ลมพัดหวน มีเกณฑ์คนรักเก่ากลับมาขอคืนดี หรือได้พบคนที่รอคอยมานานราวกับชะตากำหนด",
        "en": "A spiritual awakening in romance! Possible reconciliation with an ex, or answering an undeniable soul calling."
      },
      "couple": {
        "th": "การให้อภัย การเริ่มต้นใหม่อีกครั้ง ก้าวข้ามบทเรียนในอดีตและปรับปรุงความสัมพันธ์ให้ดียิ่งขึ้น",
        "en": "Forgiveness and rebirth. Past grudges dissolve, offering your bond a clean slate and higher commitment."
      }
    },
    "reversed": {
      "single": {
        "th": "ยังโทษตัวเองหรือไม่ยอมปล่อยวางอดีต ทำผิดพลาดซ้ำรอยเดิมกับคนใหม่ ควรเรียนรู้บทเรียนแล้วก้าวต่อไป",
        "en": "Harsh self-blame, repeating past relationship mistakes, and ignoring clear warning signs."
      },
      "couple": {
        "th": "ขุดคุ้ยเรื่องเก่ามาทะเลาะ ไม่ยอมให้อภัย หรือผลัดวันประกันพรุ่งในการแก้ปัญหาชีวิตคู่",
        "en": "Dredging up past grievances, refusing to forgive, and avoiding crucial relationship decisions."
      }
    }
  },
  "m_21": {
    "upright": {
      "single": {
        "th": "พึงพอใจในตัวเอง มีความสุขสมบูรณ์ มีเกณฑ์พบรักกับชาวต่างชาติ หรือคนที่เข้ามาเติมเต็มชีวิตอย่างสมบูรณ์แบบ",
        "en": "Wholeness and romantic fulfillment! High likelihood of meeting an international or cosmopolitan partner who completes you."
      },
      "couple": {
        "th": "ความรักลงตัวถึงจุดหมายสูงสุด มีความสุขสมบูรณ์ ครองคู่กันยาวนาน หรือได้แต่งงานสร้างครอบครัว",
        "en": "Milestone achievement in love: marriage, shared worldly travels, and reaching a harmonious plateau of bliss."
      }
    },
    "reversed": {
      "single": {
        "th": "เกือบจะสมหวังแต่ยังขาดอะไรไปบางอย่าง หรือยังไม่พร้อมเปิดใจเต็มร้อย จัดการเรื่องค้างคาใจให้เสร็จสิ้นก่อน",
        "en": "Near completion, but lingering loose ends hold you back. Seek closure before stepping into a new romance."
      },
      "couple": {
        "th": "ความสัมพันธ์ที่ยังค้างคา ขาดการเติมเต็มบางมิติ หรือมีเรื่องที่ยังคุยกันไม่จบสิ้นจนรู้สึกไม่ลงตัว",
        "en": "Stalled milestones, feeling that the relationship has not quite reached its full potential, or unresolved endings."
      }
    }
  },
  "cups_1": {
    "upright": {
      "single": {
        "th": "หัวใจพองโต มีโอกาสพบรักใหม่ที่ลึกซึ้ง บริสุทธิ์ และทำให้มีความสุขอย่างแท้จริง เป็นรักแรกพบที่ตรึงใจ",
        "en": "Overflowing heart! A pristine, profound new romance enters your life, bringing deep emotional satisfaction."
      },
      "couple": {
        "th": "ความรักเบ่งบาน เติมเต็มความหวานให้กัน มีความสุขสงบในครอบครัว เสมือนได้ตกหลุมรักกันใหม่อีกครั้ง",
        "en": "Romantic revival! An outpouring of tenderness and renewed emotional intimacy refreshes your union."
      }
    },
    "reversed": {
      "single": {
        "th": "ปิดกั้นตัวเอง รู้สึกว่าไม่มีใครรัก หรือเพิ่งอกหักมาจนหัวใจบอบช้ำ ควรรักษาแผลใจก่อนเริ่มใหม่",
        "en": "Closed emotional gates, nursing recent heartbreak, or feeling unlovable. Practice self-compassion first."
      },
      "couple": {
        "th": "ความรู้สึกเหือดแห้ง ขาดการเอาใจใส่ รู้สึกโดดเดี่ยวในความสัมพันธ์ ทั้งที่ยังอยู่ด้วยกัน",
        "en": "Withheld affection, emotional exhaustion, or feeling unappreciated and lonely within the relationship."
      }
    }
  },
  "cups_2": {
    "upright": {
      "single": {
        "th": "พบคนที่ถูกคอ เคมีตรงกัน สปาร์กกันทันทีตั้งแต่แรกเจอ มีเกณฑ์พัฒนาไปสู่คนรู้ใจอย่างรวดเร็ว",
        "en": "Instant soulful chemistry! You meet an equal partner whose spirit harmonizes effortlessly with yours."
      },
      "couple": {
        "th": "เข้าใจกันอย่างลึกซึ้ง ความรักผูกพันแน่นแฟ้น มีเกณฑ์หมั้นหมายหรือแต่งงาน เป็นคู่แท้ที่สนับสนุนกัน",
        "en": "Mutual devotion and soul-level affinity. Favorable signs for engagement, vows, and loving partnership."
      }
    },
    "reversed": {
      "single": {
        "th": "เข้าใจผิดกัน นัดเดตล่ม หรือเจอคนที่ทัศนคติไม่ลงรอย อย่าเพิ่งด่วนตัดสินใจผูกมัด",
        "en": "Mismatched values, awkward dates, or lack of romantic reciprocity. Do not force an unnatural fit."
      },
      "couple": {
        "th": "ลิ้นกับฟัน ทะเลาะกันเรื่องเล็กน้อย ขาดความประนีประนอม ต้องหันหน้าปรับความเข้าใจกันด่วน",
        "en": "Petty friction, communication breakdowns, and growing resentment requiring gentle reconciliation."
      }
    }
  },
  "cups_3": {
    "upright": {
      "single": {
        "th": "พบรักในงานสังสรรค์ ปาร์ตี้ เพื่อนแนะนำให้รู้จัก หรือมีความสุขกับการอยู่กับกลุ่มเพื่อน",
        "en": "Meeting love through celebrations, social gatherings, or mutual friends. Vibrant and joyful romantic vibes."
      },
      "couple": {
        "th": "ร่วมยินดีกับข่าวดี ได้ไปเที่ยวฉลองร่วมกัน ความสัมพันธ์ราบรื่นสดใสและได้รับความรักจากคนรอบข้าง",
        "en": "Celebration and shared triumphs! Enjoying delightful social outings and heartwarming community blessings."
      }
    },
    "reversed": {
      "single": {
        "th": "ระวังเข้าไปเป็นมือที่สามโดยไม่รู้ตัว หรือความสัมพันธ์แบบเพื่อนที่ซับซ้อนและไม่มีความชัดเจน",
        "en": "Complicated entanglements, friendzone drama, or unintentionally wandering into a third-party triangle."
      },
      "couple": {
        "th": "ปาร์ตี้สังสรรค์มากไปจนละเลยคนรัก หรือมีคนนอกเข้ามายุ่งเรื่องในบ้านจนเกิดความไม่สบายใจ",
        "en": "External gossip, meddlesome friends, or overindulging in social distractions at the expense of your partner."
      }
    }
  },
  "cups_4": {
    "upright": {
      "single": {
        "th": "มีคนเข้ามาคุยแต่ยังไม่ถูกใจ รู้สึกเฉยชาหรือเบื่อหน่ายความรัก มองข้ามโอกาสดีๆ ที่อยู่ใกล้ตัว",
        "en": "Apathetic towards romance. Suitors are knocking, yet you feel indifferent, emotionally closed, or uninspired."
      },
      "couple": {
        "th": "มองข้ามความดีของคนรัก รู้สึกจำเจกับความสัมพันธ์ ไม่ยอมเปิดรับสิ่งดีๆ ที่อีกฝ่ายพยายามมอบให้",
        "en": "Taking your partner for granted, dwelling on minor flaws, and allowing romantic apathy to dull the connection."
      }
    },
    "reversed": {
      "single": {
        "th": "เริ่มเปิดใจรับคนใหม่ หลุดจากความเฉยชาพร้อมเริ่มต้นคุยและเปิดโอกาสให้ความรักเข้ามา",
        "en": "Awakening from emotional numbness! Ready to seize opportunities and embrace promising new courtships."
      },
      "couple": {
        "th": "ปรับความเข้าใจ เลิกมองข้ามข้อดีของกันและกัน ฟื้นฟูความสัมพันธ์ด้วยทัศนคติใหม่ที่สดชื่น",
        "en": "Gratitude restored! Shaking off relationship boredom and rediscovering the warmth in each other."
      }
    }
  },
  "cups_5": {
    "upright": {
      "single": {
        "th": "ยังเสียใจและอาลัยอาวรณ์กับรักเก่า จมอยู่กับความเศร้าจนไม่เห็นว่ายังมีคนดีๆ รอคุณอยู่",
        "en": "Grieving a past romance, fixating on lost possibilities while overlooking love that still surrounds you."
      },
      "couple": {
        "th": "โฟกัสแต่ข้อเสียหรือความผิดพลาดของคนรักจนลืมมองสิ่งดีๆ ที่ยังมีอยู่ ต้องให้อภัยและก้าวข้าม",
        "en": "Dwelling on past disappointments and hurt feelings. Look at the cups still standing and rebuild trust."
      }
    },
    "reversed": {
      "single": {
        "th": "เริ่มทำใจได้ หายเศร้า พร้อมมูฟออนสู่ชีวิตใหม่ อดีตกลายเป็นบทเรียนที่มีคุณค่า",
        "en": "Healing and emotional release! The tears have dried, and you are truly ready to open your heart again."
      },
      "couple": {
        "th": "ให้อภัยความผิดพลาดในอดีต หันหน้าเข้าหากันและร่วมมือกันแก้ไข สมานแผลใจในชีวิตคู่",
        "en": "Reconciliation and forgiveness. Turning away from grief to embrace shared healing and renewed faith."
      }
    }
  },
  "cups_6": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์คนรักเก่าหรือเพื่อนวัยเด็กกลับมาติดต่อ หรือพบคนอายุน้อยกว่าที่มีความจริงใจ ไร้เดียงสา",
        "en": "Nostalgic reconnection with a former flame or childhood friend, or meeting an innocent, sweet-natured admirer."
      },
      "couple": {
        "th": "รำลึกความหลังหวานชื่น ดูแลเอาใจใส่กันเหมือนวันแรกที่รักกัน ความอบอุ่นและความปลอดภัยทางใจสูง",
        "en": "Sweet nostalgia, cozy security, and tender care reminiscent of the innocent early days of your courtship."
      }
    },
    "reversed": {
      "single": {
        "th": "ติดอยู่ในอดีตจนไม่ก้าวไปข้างหน้า หรือถึงเวลาต้องตัดขาดจากคนเก่าอย่างถาวรเพื่อชีวิตใหม่",
        "en": "Stuck in rose-colored nostalgia. Let go of idealized past memories to allow real mature love to arrive."
      },
      "couple": {
        "th": "ไม่ยอมโต ทะเลาะกันด้วยเรื่องเด็กๆ หรือยึดติดกับอดีตมากเกินไปจนไม่ยอมปรับตัวเข้ากับปัจจุบัน",
        "en": "Childish squabbles, clinging to outdated habits, or struggling to mature into an adult partnership."
      }
    }
  },
  "cups_7": {
    "upright": {
      "single": {
        "th": "ตัวเลือกเยอะ เพ้อฝันถึงความรักในอุดมคติ แต่ยังไม่เลือกใครเป็นตัวจริง ระวังติดกับภาพลวงตา",
        "en": "Dazzled by numerous options or romantic illusions. Distinguish between grounded reality and wishful fantasy."
      },
      "couple": {
        "th": "ระวังความหลงใหลในสิ่งล่อใจภายนอก หรือคาดหวังในตัวคนรักเกินความเป็นจริงจนผิดหวัง",
        "en": "Unrealistic expectations of perfection, or being distracted by shiny temptations outside the relationship."
      }
    },
    "reversed": {
      "single": {
        "th": "ตาสว่าง ตัดภาพลวงตา เลือกความสัมพันธ์ที่จับต้องได้จริง มีความชัดเจนในสเปกและหัวใจ",
        "en": "Clarity over fantasy! You cut through illusions and choose a grounded, authentic romantic path."
      },
      "couple": {
        "th": "เลิกเพ้อฝัน หันมาพูดคุยแก้ปัญหาบนพื้นฐานความเป็นจริง ความจริงใจทำให้ความรักมั่นคงขึ้น",
        "en": "Shedding naive illusions, engaging in practical discussions, and anchoring your love in real life."
      }
    }
  },
  "cups_8": {
    "upright": {
      "single": {
        "th": "ตัดสินใจเดินออกจากความสัมพันธ์ที่ไร้อนาคต หันมารักตัวเองและมองหาความสุขที่แท้จริง",
        "en": "Walking away from unfulfilling situations that no longer nourish your soul. A brave journey towards true joy."
      },
      "couple": {
        "th": "ถอยออกมาตั้งหลัก หรือความสัมพันธ์ถึงจุดอิ่มตัวที่ต้องทบทวนทิศทางเพื่อหาความหมายที่ลึกซึ้งกว่าเดิม",
        "en": "Soul-searching phase. Stepping back to re-evaluate whether current relationship dynamics align with your growth."
      }
    },
    "reversed": {
      "single": {
        "th": "ไม่กล้าตัดใจ กลัวความเหงาจนยอมทนอยู่ในจุดที่ไม่มีความสุข ถึงเวลาต้องเข้มแข็งและก้าวออกมา",
        "en": "Fear of the unknown keeps you lingering in dead-end situations. Have faith to take the step forward."
      },
      "couple": {
        "th": "หวนกลับมาคืนดี พยายามประคับประคองอีกครั้ง หรือยื้อสิ่งที่ไม่ตอบโจทย์ต่อไปด้วยความกลัว",
        "en": "Reluctance to abandon hope, attempting reconciliation, or clinging out of fear rather than authentic love."
      }
    }
  },
  "cups_9": {
    "upright": {
      "single": {
        "th": "มีความสุขกับชีวิตโสด มีเสน่ห์ เจ้าเสน่ห์ พึงพอใจในตัวเอง และดึงดูดคนเข้ามาหาเพราะพลังบวก",
        "en": "Wishes granted! Radiating radiant self-love and sensual confidence that effortlessly magnetizes admirers."
      },
      "couple": {
        "th": "ความสัมพันธ์อิ่มเอม สมหวัง ได้รับการปรนเปรอเอาใจใส่จากคนรัก มีความสุขกายสบายใจอย่างยิ่ง",
        "en": "Sumptuous emotional bliss and fulfillment. Mutual pampering, exquisite comfort, and shared satisfaction."
      }
    },
    "reversed": {
      "single": {
        "th": "หยิ่งในเสน่ห์ตัวเอง หรือเอาแต่ใจจนคนที่เข้ามาถอยหนี ระวังความสุขแบบผิวเผินที่ไร้ความผูกพัน",
        "en": "Smug self-absorption, shallow hookups, or excessive pickiness alienating genuine, heartfelt suitors."
      },
      "couple": {
        "th": "ความหลงระเริง เอาแต่ใจ หรือความสัมพันธ์ที่มองแต่ความสะดวกสบายภายนอกจนละเลยจิตใจ",
        "en": "Selfish indulgence, emotional smugness, or superficial complacency eroding heartfelt intimacy."
      }
    }
  },
  "cups_10": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบรักแท้ที่จะพัฒนาไปสู่การสร้างครอบครัวที่อบอุ่น มั่นคง และได้รับการยอมรับจากทุกคน",
        "en": "Soulmate culmination! Meeting someone with whom you can build an idyllic, emotionally supportive home."
      },
      "couple": {
        "th": "ครอบครัวสุขสันต์ มีความสุขบริบูรณ์ ได้รับการยอมรับจากทั้งสองฝ่าย มีความมั่นคงในชีวิตคู่สูงสุด",
        "en": "Pure domestic harmony, peaceful family blessings, and total emotional security in your partnership."
      }
    },
    "reversed": {
      "single": {
        "th": "มีปมเรื่องครอบครัวทำให้ไม่กล้าผูกมัด หรือคนที่บ้านไม่เห็นชอบกับคนที่กำลังคุยอยู่",
        "en": "Family disapproval or lingering domestic wounds creating apprehension towards long-term commitment."
      },
      "couple": {
        "th": "ความขัดแย้งในบ้าน ปัญหาเรื่องญาติพี่น้องเข้ามากระทบชีวิตคู่ ต้องร่วมมือกันสร้างขอบเขตที่เหมาะสม",
        "en": "Family friction, in-law meddling, or domestic squabbles testing domestic peace. Guard your sacred union."
      }
    }
  },
  "cups_11": {
    "upright": {
      "single": {
        "th": "มีคนอายุน้อยกว่าหรือคนน่ารัก อ่อนโยน เข้ามาหยอดคำหวาน ส่งข้อความจีบแบบน่ารัก ไร้เดียงสา",
        "en": "A sweet, youthful, or creative suitor flirts shyly with heartfelt messages and genuine tenderness."
      },
      "couple": {
        "th": "ส่งข้อความหวานๆ เอาใจใส่กัน ทำตัวน่ารักให้คนรักเอ็นดู เติมความสดใสและความอ่อนโยนให้กัน",
        "en": "Playful romantic gestures, sweet love notes, and tender affection injecting innocent joy into your bond."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนไม่จริงจัง ขี้งอน เอาแต่ใจ อารมณ์เด็กๆ หรือมีคนมาชอบแต่พึ่งพาอะไรไม่ได้",
        "en": "Immature suitors, moody tantrums, or superficial infatuation lacking emotional stamina."
      },
      "couple": {
        "th": "ความไม่เข้าใจกันเพราะความงี่เง่า อารมณ์น้อยใจบ่อยเกินไป ต้องคุยกันด้วยเหตุผลและวุฒิภาวะ",
        "en": "Pouting, hypersensitivity, and childish sulking destabilizing calm harmony. Grow up together."
      }
    }
  },
  "cups_12": {
    "upright": {
      "single": {
        "th": "พบคนในฝัน สุภาพบุรุษ โรแมนติก อบอุ่น เข้ามาจีบอย่างจริงใจและพร้อมมอบความรักให้อย่างเต็มที่",
        "en": "The classic chivalrous romantic! A poetic, sensitive suitor courts you with charming devotion."
      },
      "couple": {
        "th": "คนรักเอาใจใส่ พาไปดินเนอร์โรแมนติก หรือมีคำสัญญาที่น่าประทับใจ มีความหวานชื่นชวนฝัน",
        "en": "Romantic overtures, dreamy getaways, and heartfelt declarations deepening your romantic bond."
      }
    },
    "reversed": {
      "single": {
        "th": "ระวังคนปากหวานแต่เจ้าชู้ เจ้าบทเจ้ากลอนแต่ไม่รับผิดชอบ ขายฝันแล้วทิ้งขว้าง",
        "en": "Beware of charming heartbreakers, love-bombers, or seductive poets who disappear when reality calls."
      },
      "couple": {
        "th": "สัญญาปากเปล่าที่ทำไม่ได้จริง ความผิดหวังในตัวคนรัก หรือความเพ้อฝันที่ขัดกับชีวิตจริง",
        "en": "Broken romantic promises, unrealistic delusions, or passive-aggressive escapism damaging trust."
      }
    }
  },
  "cups_13": {
    "upright": {
      "single": {
        "th": "คุณอ่อนโยน เข้าอกเข้าใจคนอื่น มีเสน่ห์อบอุ่น ดึงดูดคนที่ต้องการที่พึ่งทางใจและรักแท้",
        "en": "Radiating deep empathy and intuitive grace. You attract partners who cherish emotional depth."
      },
      "couple": {
        "th": "ความรักลึกซึ้ง ดูแลเอาใจใส่คู่รักอย่างยอดเยี่ยม เป็นเซฟโซนของกันและกัน มีความผูกพันดั่งจิตวิญญาณ",
        "en": "Profound soulful intimacy. Providing an emotional sanctuary of unyielding compassion and devotion."
      }
    },
    "reversed": {
      "single": {
        "th": "อารมณ์อ่อนไหวเกินไป มโนไปเอง หรือทุ่มเทให้คนที่ไม่เห็นคุณค่าจนหัวใจบอบช้ำ",
        "en": "Overly emotional, codependent martyrdom, or giving your heart away to emotionally unavailable souls."
      },
      "couple": {
        "th": "ความหึงหวง ดราม่าทางอารมณ์ ควบคุมอารมณ์ไม่อยู่ หรือระแวงจนสร้างความอึดอัดให้คู่รัก",
        "en": "Smothering insecurity, emotional manipulation, or mood swings drowning the relationship's peace."
      }
    }
  },
  "cups_14": {
    "upright": {
      "single": {
        "th": "พบคนมีวุฒิภาวะ อบอุ่น ใจดี เป็นที่พึ่งพาทางอารมณ์ได้อย่างดีเยี่ยม ให้ความรู้สึกปลอดภัยและมั่นคง",
        "en": "A wise, emotionally mature, compassionate suitor who offers calm stability and profound loyalty."
      },
      "couple": {
        "th": "ความสัมพันธ์มั่นคง อดทน ให้อภัย และพร้อมรับฟังซึ่งกันและกันเสมอ เป็นหลักยึดเหนี่ยวของครอบครัว",
        "en": "Emotional mastery and enduring loyalty. Calmly steering the relationship through any turbulent waters."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนเจ้าชู้เงียบ ปั่นประสาท (Gaslighting) หรือเล่นกับความรู้สึก ระวังคนดูดีแต่จิตใจเจ้าเล่ห์",
        "en": "Beware of subtle manipulators, gaslighters, or emotionally dishonest charmers who mask cruelty with soft words."
      },
      "couple": {
        "th": "ความเย็นชา การเก็บกดความรู้สึก หรือการใช้อารมณ์เงียบใส่กัน ขาดการเปิดใจอย่างตรงไปตรงมา",
        "en": "Emotional suppression, icy indifference, or passive manipulation eroding safe communication."
      }
    }
  },
  "wands_1": {
    "upright": {
      "single": {
        "th": "เกิดแรงดึงดูดฉับพลัน ไฟรักลุกโชน พบคนที่ทำให้ตื่นเต้นและอยากคุยด้วยทันที มีเสน่ห์เย้ายวน",
        "en": "Electrifying chemistry and sudden passion! A thrilling spark ignites an exciting romantic beginning."
      },
      "couple": {
        "th": "เติมไฟเสน่หาให้ความสัมพันธ์ มีกิจกรรมใหม่ๆ หรือโครงการชีวิตร่วมกันที่น่าตื่นเต้น",
        "en": "Passionate renewal! Reigniting physical chemistry and embarking on exciting new adventures together."
      }
    },
    "reversed": {
      "single": {
        "th": "ความสัมพันธ์เริ่มต้นแล้วแผ่วปลาย ไฟมอดไว หรือขาดความมั่นใจในการเข้าหาคนที่ชอบ",
        "en": "A fleeting spark that fizzles quickly, or lack of enthusiasm and confidence halting romantic progress."
      },
      "couple": {
        "th": "ความสัมพันธ์จืดชืด หมดไฟเสน่หา ขาดแรงขับเคลื่อนร่วมกัน ต้องหากิจกรรมใหม่ๆ เติมพลัง",
        "en": "Depleted bedroom fire, romantic boredom, and lack of spontaneous excitement dampening the union."
      }
    }
  },
  "wands_2": {
    "upright": {
      "single": {
        "th": "กำลังมองหาคนใหม่ๆ วางแผนเปิดใจ หรือมีคนคุยทางไกล/ออนไลน์ที่น่าสนใจ",
        "en": "Expanding your romantic horizon. Potential connection through travel, online platforms, or long distance."
      },
      "couple": {
        "th": "วางแผนอนาคตร่วมกัน การย้ายไปอยู่ด้วยกัน หรือวางแผนการเดินทางท่องเที่ยวเพื่อกระชับความสัมพันธ์",
        "en": "Long-term co-creation! Planning future horizons, shared relocations, or romantic foreign journeys."
      }
    },
    "reversed": {
      "single": {
        "th": "ลังเล ไม่กล้าก้าวออกจากคอมฟอร์ตโซน กลัวความผิดหวังจนไม่ยอมเริ่มคุยกับใคร",
        "en": "Fear of the unknown keeps you hesitating on the threshold. Break free from your comfort cocoon."
      },
      "couple": {
        "th": "แผนการในอนาคตไม่ตรงกัน หรือความห่างไกลทำให้ไม่มั่นคงในความสัมพันธ์ ต้องหาจุดร่วม",
        "en": "Conflicting future goals, geographical separation, or restless dissatisfaction pulling you apart."
      }
    }
  },
  "wands_3": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบรักจากการเดินทาง การทำงาน หรือคนต่างชาติต่างภาษาที่มีทัศนคติกว้างไกล",
        "en": "Romance on the horizon! Connecting through overseas travel, international ventures, or networking."
      },
      "couple": {
        "th": "ความสัมพันธ์ก้าวหน้าขยับขยาย มองเห็นเป้าหมายระยะยาวร่วมกัน และพร้อมสนับสนุนความฝันของกันและกัน",
        "en": "Shared expansion and visionary growth. Your mutual investments of love begin to bear exciting fruit."
      }
    },
    "reversed": {
      "single": {
        "th": "รอคอยความรักที่ยังมาไม่ถึง หรือความรักทางไกลที่มีอุปสรรคเรื่องเวลาและระยะทาง",
        "en": "Long delays in romantic manifestation, or frustration over long-distance barriers stalling progress."
      },
      "couple": {
        "th": "แผนชีวิตร่วมกันสะดุด ความล่าช้าในการแต่งงานหรือสร้างครอบครัว ต้องใช้ความอดทน",
        "en": "Obstacles delaying shared plans, travel complications, or feeling let down by unkept romantic promises."
      }
    }
  },
  "wands_4": {
    "upright": {
      "single": {
        "th": "พบคนที่เข้ากับสังคมและครอบครัวเราได้ดี บรรยากาศอบอุ่น มั่นคง มีเกณฑ์พบรักในงานมงคล",
        "en": "Meeting someone who blends effortlessly with your family and tribe. Joyful milestone vibes."
      },
      "couple": {
        "th": "ความสัมพันธ์สุกงอม มีเกณฑ์งานหมั้น งานแต่งงาน หรือขึ้นบ้านใหม่ร่วมกันอย่างอบอุ่น",
        "en": "Celebration of love! Engagement, marriage milestones, housewarming, and radiant domestic joy."
      }
    },
    "reversed": {
      "single": {
        "th": "รู้สึกไม่ค่อยเข้ากับคนรอบข้างของอีกฝ่าย หรือยังไม่พร้อมลงหลักปักฐานกับใครอย่างจริงจัง",
        "en": "Feeling out of place in someone's social circle, or feeling unready to put down permanent roots."
      },
      "couple": {
        "th": "ความไม่ลงรอยในครอบครัว การจัดงานเฉลิมฉลองที่มีเรื่องติดขัด หรือความตึงเครียดในบ้าน",
        "en": "Domestic tension, family clashes, or stress surrounding wedding and event planning."
      }
    }
  },
  "wands_5": {
    "upright": {
      "single": {
        "th": "มีคู่แข่งเยอะ ต้องแข่งขันแย่งชิงความสนใจ หรือเจอคนเข้ามาคุยพร้อมกันหลายคนจนวุ่นวาย",
        "en": "Fierce romantic competition! Multiple suitors vie for attention, requiring confidence and wit."
      },
      "couple": {
        "th": "มีปากเสียง ทะเลาะถกเถียงกันในเรื่องไม่เป็นเรื่อง แต่ไม่อันตรายถึงขั้นเลิกรา เพียงแต่เหนื่อยใจ",
        "en": "Bickering and ego friction over trivial daily matters. Learn to laugh off minor disagreements."
      }
    },
    "reversed": {
      "single": {
        "th": "ถอนตัวจากการแข่งขัน ไม่เอาตัวไปวุ่นวายกับดราม่า เลือกความสงบทางใจมากกว่าชัยชนะ",
        "en": "Refusing to compete in petty dating games. Stepping away from drama to protect inner peace."
      },
      "couple": {
        "th": "ปรับความเข้าใจ ยุติการทะเลาะ เลิกเอาชนะกันและหันมารับฟังเพื่อความสงบสุขในบ้าน",
        "en": "Resolving clashes, truce declared, and putting an end to competitive arguments."
      }
    }
  },
  "wands_6": {
    "upright": {
      "single": {
        "th": "พิชิตใจคนที่ชอบได้สำเร็จ การจีบได้รับผลตอบรับที่ดีเยี่ยม มีคนจับตามองและมีเสน่ห์โดดเด่น",
        "en": "Triumphant courtship! Your pursuit succeeds gloriously; you attract high praise and admiration."
      },
      "couple": {
        "th": "ความรักประสบความสำเร็จ ก้าวผ่านช่วงยากลำบาก ได้รับการยอมรับจากสังคมและครอบครัวอย่างสง่างาม",
        "en": "Shared triumph and public recognition. Overcoming hurdles to celebrate a proud romantic victory."
      }
    },
    "reversed": {
      "single": {
        "th": "พลาดหวังจากการจีบ โดนปฏิเสธ หรือสูญเสียความมั่นใจ อย่าเพิ่งท้อถอย เรียกความมั่นใจกลับมา",
        "en": "Bruised romantic ego, public rejection, or pride getting in the way of honest vulnerability."
      },
      "couple": {
        "th": "ขาดการชื่นชมกัน การผิดสัญญา หรือความสัมพันธ์ไม่ได้รับการสนับสนุนจากคนรอบข้าง",
        "en": "Lack of mutual appreciation, arrogance souring intimacy, or feeling disgraced in public."
      }
    }
  },
  "wands_7": {
    "upright": {
      "single": {
        "th": "มีจุดยืนชัดเจน ไม่ยอมลดสเปก พร้อมปกป้องหัวใจตัวเองจากคนที่ไม่จริงใจ มั่นคงในคุณค่าของตนเอง",
        "en": "Holding your romantic standards high. Defending your emotional boundaries against unworthy suitors."
      },
      "couple": {
        "th": "ร่วมกันปกป้องความสัมพันธ์จากอุปสรรคภายนอก หรือคนที่ไม่หวังดี ไม่ยอมให้ใครมาทำลายความรัก",
        "en": "Defending your partnership against outside critics and meddlers. Standing firm united."
      }
    },
    "reversed": {
      "single": {
        "th": "เหนื่อยล้ากับการต้องตั้งการ์ด หรือยอมแพ้ให้กับความกดดันของคนรอบข้างที่อยากให้มีแฟน",
        "en": "Exhausted from constantly having your guard up, or giving in to external pressure to settle."
      },
      "couple": {
        "th": "ยอมจำนนต่อปัญหาภายนอก หรือรู้สึกว่าความสัมพันธ์เหนื่อยเกินไปจนไม่อยากสู้ต่อ",
        "en": "Feeling overwhelmed by ongoing external friction. Fatigue threatening to break your defensive resolve."
      }
    }
  },
  "wands_8": {
    "upright": {
      "single": {
        "th": "ความสัมพันธ์พัฒนาอย่างรวดเร็ว มีข้อความทักแชตเข้ามาจีบตลอดเวลา การสื่อสารราบรื่นและคล่องตัว",
        "en": "Rapid romantic progression! A whirlwind of sweet messages, instant replies, and accelerating passion."
      },
      "couple": {
        "th": "การสื่อสารรวดเร็ว มีการเดินทางท่องเที่ยวด้วยกัน หรือการพัฒนาความสัมพันธ์แบบก้าวกระโดด",
        "en": "High-velocity momentum: spontaneous trips, rapid positive breakthroughs, and swift resolution of issues."
      }
    },
    "reversed": {
      "single": {
        "th": "ความสัมพันธ์สะดุด ข่าวคราวเงียบหาย โดนดองแชต หรือการสื่อสารติดขัดทำให้เข้าใจผิด",
        "en": "Ghosting, unanswered texts, agonizing delays, or miscommunication halting sweet momentum."
      },
      "couple": {
        "th": "สื่อสารเข้าใจผิด ใจร้อนเกินไป หรือการวางแผนเดินทางล่ม ต้องใจเย็นๆ ในการพูดคุย",
        "en": "Hasty impulsive words causing misunderstandings, canceled travel, or communication gridlock."
      }
    }
  },
  "wands_9": {
    "upright": {
      "single": {
        "th": "มีกำแพงในใจสูงเพราะเจ็บมาเยอะ ยังระแวงและไม่กล้าเปิดใจรับใครง่ายๆ แม้จะมีคนดีๆ เข้ามา",
        "en": "Guarded heart due to past battle scars. Protective vigilance is fine, but do not shut out genuine love."
      },
      "couple": {
        "th": "รู้สึกเหนื่อยล้า ต้องประคับประคองความสัมพันธ์ แต่ยังไม่ยอมแพ้ ร่วมมือกันยืนหยัดอีกนิดจะผ่านพ้น",
        "en": "Fatigued yet resilient. Navigating the final test of relationship endurance; hold the line together."
      }
    },
    "reversed": {
      "single": {
        "th": "เหนื่อยที่จะปิดกั้นตัวเอง พร้อมเปิดประตูรับความรักอีกครั้ง หรือความระแวงทำลายโอกาสดีๆ",
        "en": "Lowering defensive barricades, or paranoia exhausting your spirit. Dare to trust again."
      },
      "couple": {
        "th": "ความอดทนใกล้หมด หรือความเหนื่อยล้าจนอยากวางมือ ต้องรีบฟื้นฟูจิตใจก่อนที่จะสายเกินไป",
        "en": "Reaching your limit of endurance; stubborn defensiveness threatening to crack the relationship."
      }
    }
  },
  "wands_10": {
    "upright": {
      "single": {
        "th": "งานยุ่งจนไม่มีเวลาคิดเรื่องความรัก หรือแบกรับภาระครอบครัวจนเหนื่อยเกินกว่าจะมีใคร",
        "en": "Overburdened by duties, work, or family care, leaving zero emotional bandwidth for dating."
      },
      "couple": {
        "th": "แบกรับปัญหาในความสัมพันธ์ไว้ฝ่ายเดียว รู้สึกหนักอึ้งและเหนื่อยล้า ต้องขอให้อีกฝ่ายช่วยแบ่งเบา",
        "en": "Carrying the entire emotional load alone. Communicate your burnout and demand shared responsibility."
      }
    },
    "reversed": {
      "single": {
        "th": "เริ่มปล่อยวางภาระ มีเวลามาดูแลตัวเองและหัวใจ พร้อมแบ่งพื้นที่ให้กับความรักที่สดใส",
        "en": "Dropping unnecessary burdens, reclaiming personal leisure, and welcoming lighter romantic energy."
      },
      "couple": {
        "th": "ปล่อยวางความคาดหวัง ขอให้คนรักช่วยแบ่งเบาภาระ หรือตัดสินใจทิ้งปัญหาหนักอกออกไป",
        "en": "Relieving the pressure! Delegating chores, shedding unrealistic expectations, and breathing freely together."
      }
    }
  },
  "wands_11": {
    "upright": {
      "single": {
        "th": "มีคนกระตือรือร้น น่ารัก สดใส เข้ามาชวนคุย ชวนทำกิจกรรมสนุกๆ สร้างสีสันให้หัวใจเต้นแรง",
        "en": "An enthusiastic, adventurous, vivacious admirer initiates playful chats and invites you to adventures."
      },
      "couple": {
        "th": "ชวนกันทำอะไรใหม่ๆ เพิ่มความตื่นเต้นและมีชีวิตชีวาให้ความสัมพันธ์ มีแผนการที่น่าสนุกร่วมกัน",
        "en": "Injecting playful enthusiasm, spontaneous fun, and vibrant energy into your romantic routine."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนเจ้าชู้ ขี้เบื่อ คุยสนุกแต่ไม่คิดจริงจัง มาหลอกให้ตื่นเต้นแล้วก็หายตัวไป",
        "en": "Fickle flirts, easily bored suitors, or unreliable flakes lacking follow-through on grand promises."
      },
      "couple": {
        "th": "ขาดความกระตือรือร้น หรืออีกฝ่ายทำตัวไม่รู้จักโต ขี้หงุดหงิดและไม่มีความรับผิดชอบ",
        "en": "Childish impatience, lack of romantic drive, or reckless escapades triggering unnecessary squabbles."
      }
    }
  },
  "wands_12": {
    "upright": {
      "single": {
        "th": "มีคนมีเสน่ห์ ร้อนแรง เข้ามาจีบอย่างรุกหนักและรวดเร็ว ชวนใจสั่นด้วยความหลงใหล",
        "en": "A bold, dashing, fiery suitor charges into your life with fearless charisma and passionate intent."
      },
      "couple": {
        "th": "ความสัมพันธ์ตื่นเต้น มีไฟ แต่ระวังเรื่องความใจร้อนและไม่มีเวลาให้กันเพราะต่างคนต่างมุ่งมั่นงาน",
        "en": "High passion and daring escapades, though bustling schedules require conscious time management."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนมาไวไปไว รักสนุกไม่ผูกพัน หว่านเสน่ห์แล้วหายตัว ระวังจะเสียใจเพราะความหลง",
        "en": "Hit-and-run heartbreakers! High risk of entering a whirlwind affair with an unreliable rogue."
      },
      "couple": {
        "th": "การทะเลาะด้วยความใจร้อน หรืออีกฝ่ายไม่มีความรับผิดชอบ เอาแต่ใจและรักอิสระเกินไป",
        "en": "Hot-headed tempers, reckless selfishness, or restlessness threatening the peaceful stability of home."
      }
    }
  },
  "wands_13": {
    "upright": {
      "single": {
        "th": "คุณสวย รวย เก่ง มั่นใจในตัวเอง ดึงดูดคนที่ชื่นชมในความเก่งของคุณ มีเสน่ห์แบบตัวแม่",
        "en": "Radiating magnetic poise, warmth, and self-confidence. You captivate lovers with your bold inner fire."
      },
      "couple": {
        "th": "ความสัมพันธ์มีชีวิตชีวา เป็นทั้งคู่คิดและเพื่อนคู่คิดที่พึ่งพาได้ มีความมั่นใจและซื่อสัตย์ต่อกัน",
        "en": "Dynamic, vibrant partnership. Inspiring and uplifting your lover while retaining your independent sovereignty."
      }
    },
    "reversed": {
      "single": {
        "th": "มั่นใจเกินไปจนคนเข้าไม่ถึง หรือมีอารมณ์ฉุนเฉียวจนคนที่เข้ามาคุยตกใจถอยหนี",
        "en": "Overbearing arrogance, jealousy, or dramatic outbursts intimidating potential gentle suitors."
      },
      "couple": {
        "th": "ความเอาแต่ใจ ขี้หึง หรือพยายามครอบงำคนรักจนทำให้อีกฝ่ายอึดอัด ต้องลดทิฐิลง",
        "en": "Demanding perfection, drama-queen antics, or possessive domination suffocating your mate."
      }
    }
  },
  "wands_14": {
    "upright": {
      "single": {
        "th": "พบคนมีเสน่ห์ เป็นผู้นำ มั่นคงในเป้าหมาย เข้ามาจีบอย่างมีชั้นเชิงและมีความเป็นสุภาพบุรุษ",
        "en": "A visionary, commanding leader pursues you with honorable intent, maturity, and charismatic strength."
      },
      "couple": {
        "th": "คนรักมีความรับผิดชอบ เป็นผู้นำครอบครัวที่ดีและซื่อสัตย์ ร่วมกันสร้างอนาคตอย่างมั่นใจ",
        "en": "Inspiring leadership and bold stewardship in the relationship, generating enduring respect and loyalty."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนเผด็จการ เอาตัวเองเป็นใหญ่ หรือบ้าอำนาจ ชอบคุณลักษณะแต่รับนิสัยไม่ได้",
        "en": "Beware of arrogant chauvinists, egotistical bosses, or tyrannical lovers seeking subservience."
      },
      "couple": {
        "th": "ความดื้อรั้น ไม่ฟังความคิดเห็นของอีกฝ่าย สร้างความอึดอัดด้วยการบังคับให้เป็นไปตามใจตน",
        "en": "Autocratic rigidity, explosive pride, and an unwillingness to validate a partner's perspective."
      }
    }
  },
  "swords_1": {
    "upright": {
      "single": {
        "th": "ชัดเจนในความรู้สึก รู้ว่าตนเองต้องการใคร ตัดสินใจเด็ดขาดเรื่องความรัก ไม่เสียเวลากับสิ่งที่ไม่ใช่",
        "en": "Intellectual clarity and breakthrough! You see through romantic mist and declare honest standards."
      },
      "couple": {
        "th": "พูดคุยเปิดอก เคลียร์ปัญหาค้างคาใจด้วยเหตุผล ความจริงใจชนะทุกสิ่งและนำพาความกระจ่างมาให้",
        "en": "Radical transparency and honest truth-telling cut through past fog, cementing mutual respect."
      }
    },
    "reversed": {
      "single": {
        "th": "สับสน โดนหลอกคุยซ้ำๆ หรือใช้คำพูดทำร้ายความสัมพันธ์ที่กำลังเริ่มต้น ใจร้อนตัดสินเร็วเกินไป",
        "en": "Confusion, sharp critical tongue driving suitors away, or falling victim to dishonest rhetoric."
      },
      "couple": {
        "th": "ทะเลาะกันรุนแรง ใช้คำพูดเชือดเฉือนทำร้ายจิตใจกัน ต้องระวังคำพูดที่จะกลายเป็นบาดแผล",
        "en": "Hostile arguments, cruel verbal cuts, and weaponized logic wounding the heart of your union."
      }
    }
  },
  "swords_2": {
    "upright": {
      "single": {
        "th": "ปิดกั้นหัวใจ ไม่กล้าตัดสินใจเลือกระหว่างสองคน หรือกลัวการเจ็บปวดจนไม่ยอมเปิดโอกาสให้ใคร",
        "en": "Stalemate of the heart. Hesitating between two choices or blocking love out of fear of vulnerability."
      },
      "couple": {
        "th": "อยู่ในภาวะกลืนไม่เข้าคายไม่ออก มีเรื่องที่ไม่อยากพูดถึง หรือหันหลังให้กันเพื่อหลีกเลี่ยงความขัดแย้ง",
        "en": "Emotional impasse. Avoiding elephant-in-the-room issues through silence; a peaceful truce is needed."
      }
    },
    "reversed": {
      "single": {
        "th": "เปิดผ้าผูกตา กล้าตัดสินใจเลือกทางเดินของหัวใจ ความจริงปรากฏทำให้เลือกได้อย่างถูกต้อง",
        "en": "Removing the blindfold! Making a definitive choice and facing the truth of your desires."
      },
      "couple": {
        "th": "เริ่มเปิดปากคุยกันเรื่องที่หลีกเลี่ยงมานาน แม้จะเจ็บแต่ทำให้โล่งใจและแก้ปัญหาได้ตรงจุด",
        "en": "Breaking the silent treatment, confronting hidden tensions, and clearing the emotional air."
      }
    }
  },
  "swords_3": {
    "upright": {
      "single": {
        "th": "เจ็บปวดจากความรัก ผิดหวัง อกหัก หรือรู้ความจริงที่เจ็บแสบ ต้องให้เวลาหัวใจได้พักฟื้น",
        "en": "Sharp sorrow, heartbreak, or painful romantic rejection. Allow yourself to grieve and cleanse the wound."
      },
      "couple": {
        "th": "ปัญหารักสามเส้า คำพูดแทงใจดำ หรือความผิดหวังในตัวคนรักอย่างรุนแรง ต้องใช้สติประคองหัวใจ",
        "en": "Piercing sorrow, third-party intrusion, or biting words leaving profound emotional bruises."
      }
    },
    "reversed": {
      "single": {
        "th": "กำลังเยียวยาแผลใจ เริ่มหายเจ็บและพร้อมให้อภัย ฟ้าหลังฝนกำลังจะสดใสขึ้น",
        "en": "Healing from heartbreak! The sharpest agony has passed, and your spirit is mending beautifully."
      },
      "couple": {
        "th": "ค่อยๆ สมานรอยร้าว ก้าวผ่านความเจ็บปวดและเริ่มต้นปรับความเข้าใจเพื่อรักษาความรักไว้",
        "en": "Patching up the rift, forgiving past infidelities or hurtful fights, and seeking genuine reconciliation."
      }
    }
  },
  "swords_4": {
    "upright": {
      "single": {
        "th": "พักผ่อนหัวใจ อยู่คนเดียวอย่างสงบ ชะลอเรื่องความรักไว้ก่อน ฟื้นฟูพลังงานให้เต็มที่",
        "en": "Sacred emotional respite. Solitary recuperation and stepping back from dating to recharge mental peace."
      },
      "couple": {
        "th": "เว้นระยะห่างให้ต่างคนต่างมีพื้นที่ส่วนตัว เพื่อลดความตึงเครียดและฟื้นฟูความรู้สึกดีๆ",
        "en": "Taking a peaceful breather, giving each other breathing room, and allowing quiet time to restore serenity."
      }
    },
    "reversed": {
      "single": {
        "th": "หายเหนื่อยแล้ว พร้อมเปิดใจกลับเข้าสู่สมรภูมิความรักอีกครั้ง มีพลังสดชื่นและมองโลกแง่ดี",
        "en": "Emerging from romantic hibernation! Re-entering the dating scene with revitalized energy."
      },
      "couple": {
        "th": "ฟื้นฟูความสัมพันธ์หลังจากช่วงที่ห่างเหินกัน กลับมาพูดคุยและใกล้ชิดกันอีกครั้งอย่างอบอุ่น",
        "en": "Awakening from emotional distance; reconnecting warmly and resuming active partnership."
      }
    }
  },
  "swords_5": {
    "upright": {
      "single": {
        "th": "ระวังเจอคนชอบเอาชนะ คนเห็นแก่ตัวที่มองความรักเป็นเกมการแข่งขัน ได้แล้วก็ทิ้งขว้าง",
        "en": "Beware of selfish players who treat courtship as a game to win at the expense of your dignity."
      },
      "couple": {
        "th": "ทะเลาะเพื่อเอาชนะกัน แม้จะชนะการเถียงแต่ต้องเสียความรู้สึกของคนรักไป ไม่คุ้มค่าเลย",
        "en": "Hollow victories: winning the argument but losing each other's affection through cruel spite."
      }
    },
    "reversed": {
      "single": {
        "th": "ยอมวางทิฐิ เลิกคุยกับคนที่ไม่เห็นคุณค่า เลือกความสบายใจมากกว่าการพยายามเอาชนะ",
        "en": "Walking away from pointless petty drama and toxic dynamics that drain your self-esteem."
      },
      "couple": {
        "th": "ยอมสงบศึก เลิกเอาชนะกันและหันมาประนีประนอม ให้อภัยเพื่อรักษาความสัมพันธ์",
        "en": "Laying down weapons, burying the hatchet, and seeking humble reconciliation after ugly fights."
      }
    }
  },
  "swords_6": {
    "upright": {
      "single": {
        "th": "ค่อยๆ หลุดพ้นจากช่วงเวลาแย่ๆ มีคนพาไปพบสิ่งแวดล้อมใหม่ที่ดีขึ้น กำลังเดินทางสู่ความสงบ",
        "en": "Transitioning away from emotional turbulence towards calmer, healthier romantic waters."
      },
      "couple": {
        "th": "ร่วมมือกันพาความสัมพันธ์ข้ามผ่านมรสุม แม้จะยังเหนื่อยแต่ทิศทางดีขึ้นเรื่อยๆ อย่างเห็นได้ชัด",
        "en": "Navigating past storms together. Relief and steady recovery as your shared life regains smooth sailing."
      }
    },
    "reversed": {
      "single": {
        "th": "วนเวียนอยู่กับปัญหาเดิมๆ ไม่ยอมมูฟออนจากอดีต แบกรับความทรงจำที่เจ็บปวดไปด้วยทุกที่",
        "en": "Carrying old baggage into new encounters, or getting pulled back into familiar toxic waters."
      },
      "couple": {
        "th": "ปัญหาเก่าๆ ยังตามมาหลอกหลอน ยังไม่สามารถแก้ไขได้ขาด มีเรื่องค้างคาใจที่ต้องสะสาง",
        "en": "Stalled recovery, lingering past grievances re-emerging, or difficulties navigating shared transitions."
      }
    }
  },
  "swords_7": {
    "upright": {
      "single": {
        "th": "ระวังเจอคนไม่ซื่อสัตย์ มีความลับปิดบัง ซ่อนกิ๊ก หรือหลอกคุยหลายคน อย่าเพิ่งไว้ใจใครเต็มร้อย",
        "en": "Caution against stealthy deceivers, two-timers, or suitors sneaking around with hidden agendas."
      },
      "couple": {
        "th": "มีเรื่องปกปิด ไม่เปิดเผยความจริงทั้งหมด หรือมีความหวาดระแวงเกิดขึ้น ต้องมีความจริงใจต่อกัน",
        "en": "Secretive behavior, white lies, or suspicious conduct breeding mistrust. Demand total honesty."
      }
    },
    "reversed": {
      "single": {
        "th": "ความจริงเปิดเผย หลุดพ้นจากคนเจ้าเล่ห์ได้อย่างหวุดหวิด ตาสว่างก่อนที่จะถลำลึก",
        "en": "Truth exposed! Dodging a bullet as a deceitful suitor's mask slips just in time."
      },
      "couple": {
        "th": "ยอมสารภาพความจริง หรือเปิดอกเคลียร์เรื่องที่เคยแอบทำ แม้จะตึงเครียดแต่ทำให้โล่งใจ",
        "en": "Coming clean, confessing hidden truths, and shedding guilt to rebuild on authentic foundations."
      }
    }
  },
  "swords_8": {
    "upright": {
      "single": {
        "th": "รู้สึกหมดหวัง คิดว่าตัวเองไม่มีใครเอา ทั้งที่จริงแล้วคุณสร้างกรอบขึ้นมาขังตัวเอง ปลดปล่อยใจตนเอง",
        "en": "Trapped in self-imposed helplessness. You believe love is impossible, yet the mental cage is unlocked."
      },
      "couple": {
        "th": "อึดอัด รู้สึกเหมือนถูกพันธนาการในความสัมพันธ์ แต่ไม่กล้าเดินออกมาเพราะความกลัว",
        "en": "Feeling victimized or paralyzed in a suffocating dynamic. Recognize your sovereign power to make change."
      }
    },
    "reversed": {
      "single": {
        "th": "ปลดปล่อยตัวเองจากความคิดลบ มองเห็นทางออกของความรัก กล้าก้าวออกจากความกลัว",
        "en": "Shedding mental blindfolds! Stepping out of feelings of unworthiness into romantic empowerment."
      },
      "couple": {
        "th": "คลายความกดดัน กล้าพูดความต้องการของตัวเองและหลุดพ้นจากความอึดอัดที่สะสมมานาน",
        "en": "Finding your voice, breaking out of relational paralysis, and asserting healthy personal boundaries."
      }
    }
  },
  "swords_9": {
    "upright": {
      "single": {
        "th": "คิดมาก นอนไม่หลับ วิตกกังวลเรื่องความรัก กลัวการถูกทอดทิ้ง ทั้งที่เรื่องจริงอาจไม่มีอะไรเลย",
        "en": "Sleepless nights and agonizing romantic anxiety. Most of your fears are projected nightmares, not reality."
      },
      "couple": {
        "th": "เครียดสะสม หวาดระแวง คิดไปเองจนบั่นทอนสุขภาพจิตและชีวิตคู่ ต้องรีบคุยเพื่อความสบายใจ",
        "en": "Suffocating overthinking, guilt, and imagined worst-case scenarios straining relationship intimacy."
      }
    },
    "reversed": {
      "single": {
        "th": "คลายความกังวล เริ่มปล่อยวางและมองโลกในแง่ดีขึ้น ความจริงไม่ได้เลวร้ายอย่างที่กลัว",
        "en": "Dawn breaks! Nightmarish anxieties subside, replaced by grounded realism and calm optimism."
      },
      "couple": {
        "th": "พูดคุยเคลียร์ความระแวง ความจริงไม่ได้เลวร้ายอย่างที่คิดไว้ กลับมานอนหลับสบายใจอีกครั้ง",
        "en": "Confessing irrational fears to your partner, receiving reassuring love, and dispelling the dark shadows."
      }
    }
  },
  "swords_10": {
    "upright": {
      "single": {
        "th": "ถึงจุดสิ้นสุดของความเจ็บปวด บทเรียนครั้งใหญ่ที่ทำให้คุณตาสว่าง ไม่มีอะไรจะแย่ไปกว่านี้แล้ว",
        "en": "Rock bottom of heartbreak. The painful betrayal has concluded; there is nowhere to go now but up."
      },
      "couple": {
        "th": "ความสัมพันธ์ถึงทางตัน แตกหัก หรือเจ็บปวดที่สุด แต่การยอมรับความจริงจะนำพาไปสู่การเยียวยา",
        "en": "Final, brutal closure or agonizing crisis. Acknowledging the absolute end of an unhealthy chapter."
      }
    },
    "reversed": {
      "single": {
        "th": "ฟื้นคืนชีพจากบาดแผล สิ่งที่เลวร้ายที่สุดผ่านพ้นไปแล้ว กำลังเริ่มต้นลุกขึ้นยืนใหม่อย่างเข้มแข็ง",
        "en": "Rising like a phoenix! Surviving the worst heartbreak and cautiously stepping into new life."
      },
      "couple": {
        "th": "ผ่านจุดต่ำสุดของความสัมพันธ์มาได้ และกำลังเริ่มฟื้นตัวใหม่ รอดพ้นจากวิกฤตการเลิกรา",
        "en": "Surviving near-breakup collapse. Rebuilding from ashes with humbled wisdom and renewed vows."
      }
    }
  },
  "swords_11": {
    "upright": {
      "single": {
        "th": "แอบส่อง แอบดูโซเชียลของคนที่ชอบ หรือมีคนคอยติดตามดูพฤติกรรมคุณด้วยความสนใจ",
        "en": "Curious, inquisitive energy. Spying on social media profiles, or an observant suitor watching your moves."
      },
      "couple": {
        "th": "ช่างสงสัย คอยจับผิด ถามซักไซ้ ระวังจะทำให้อีกฝ่ายอึดอัด ควรพูดคุยอย่างเปิดเผย",
        "en": "Hyper-vigilant questioning, checking phones, or detective work creating defensive friction."
      }
    },
    "reversed": {
      "single": {
        "th": "ได้ยินข่าวลือผิดๆ หรือส่องจนจิตตกไปเอง ระวังคำพูดเหน็บแนมทำให้คนที่คุยถอยห่าง",
        "en": "Falling for spiteful gossip, paranoia from stalking feeds, or defensive sarcasm alienating suitors."
      },
      "couple": {
        "th": "ทะเลาะกันเพราะความระแวงจากเรื่องไม่จริง หรือการนินทาว่าร้ายจากคนภายนอกที่ยุยง",
        "en": "Spiteful squabbles sparked by groundless rumors, petty spying, and immature accusations."
      }
    }
  },
  "swords_12": {
    "upright": {
      "single": {
        "th": "มีคนเข้ามาเร็ว พูดจาตรงไปตรงมา ไม่อ้อมค้อม ฉลาดเฉียบคม แต่อาจขาดความหวานไปบ้าง",
        "en": "Direct, blunt, and mentally sharp suitor charges in fast. Passionate intellect without sugary fluff."
      },
      "couple": {
        "th": "ระวังการปะทะด้วยอารมณ์ฉุนเฉียว คำพูดขวานผ่าซากที่ทำร้ายใจกัน ควรชะลอความใจร้อนลง",
        "en": "Fast-paced action and intellectual stimulation, but mind reckless words that can easily wound."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนอารมณ์ร้าย หัวร้อน ปากร้าย หรือบุกรุกพื้นที่ส่วนตัวเกินไปจนน่ากลัว",
        "en": "Warning against aggressive, verbally abrasive suitors who bulldoze boundaries without empathy."
      },
      "couple": {
        "th": "ปะทะกันรุนแรง ขาดสติและไม่ยอมลดราวาศอกให้กัน ใช้คำพูดทำลายความรู้สึกจนยากจะประสาน",
        "en": "Hostile screaming matches, cruel character attacks, and toxic haste tearing down partnership peace."
      }
    }
  },
  "swords_13": {
    "upright": {
      "single": {
        "th": "ฉลาด มีกำแพงสูง คัดกรองคนเข้ามาอย่างเข้มงวด อยู่คนเดียวได้อย่างสง่างามและไม่ยอมลดคุณค่า",
        "en": "Sharp intellect and regal self-sufficiency. High standards screen out unworthy suitors effortlessly."
      },
      "couple": {
        "th": "ใช้เหตุผลมากกว่าอารมณ์ ไม่ยอมให้ใครมาเอาเปรียบ ซื่อสัตย์และตรงไปตรงมา แต่อย่าลืมเติมความอบอุ่น",
        "en": "Fairness, clear boundaries, and honest communication, though take care to temper cool logic with affection."
      }
    },
    "reversed": {
      "single": {
        "th": "ขมขื่นกับความรักในอดีตจนมองโลกในแง่ลบ ปิดตายหัวใจและวิจารณ์ทุกคนที่เข้ามาอย่างรุนแรง",
        "en": "Cynical bitterness, harsh judgment, and emotional frostiness blocking any warmth from entering."
      },
      "couple": {
        "th": "วิจารณ์อีกฝ่ายอย่างรุนแรง ประชดประชัน จนความสัมพันธ์เย็นชาเหมือนอยู่กับคนแปลกหน้า",
        "en": "Scathing sarcasm, cold emotional detachment, and hyper-critical nitpicking freezing your partner out."
      }
    }
  },
  "swords_14": {
    "upright": {
      "single": {
        "th": "รักใครต้องมีความชัดเจน ไม่ชอบการคุยเรื่อยเปื่อย มีเกณฑ์พบคนเฉียบแหลม มั่นคงในหลักการ",
        "en": "Seeking an intellectual equal who values truth, integrity, and ethical standards above fleeting flattery."
      },
      "couple": {
        "th": "ความสัมพันธ์ตั้งอยู่บนความจริงและกฎเกณฑ์ ให้เกียรติและเคารพซึ่งกันและกันอย่างมีวุฒิภาวะ",
        "en": "Rational maturity, respectful equality, and principled agreements providing high stability."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนเผด็จการทางความคิด ไร้หัวใจ ใช้ตรรกะกดขี่ความรู้สึก หรือคนเจ้าเล่ห์ทางกฎหมาย",
        "en": "Beware of cold, unfeeling tyrants who treat emotions as weaknesses and manipulate with cruel logic."
      },
      "couple": {
        "th": "ความกดดันในบ้าน การใช้อำนาจเหนือกว่าทำให้คู่ครองไร้ความสุข ขาดความเข้าอกเข้าใจทางอารมณ์",
        "en": "Intolerant tyranny, emotional stonewalling, and autocratic dominance sucking the soul out of love."
      }
    }
  },
  "pentacles_1": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบคนจริงใจ มั่นคง ฐานะดี พร้อมเปย์หรือช่วยส่งเสริมสร้างอนาคตที่จับต้องได้ร่วมกัน",
        "en": "Golden seed of stable love! Meeting a loyal, grounded suitor who offers tangible security and commitment."
      },
      "couple": {
        "th": "ความสัมพันธ์มั่นคง ร่ำรวยความสุข วางแผนซื้อบ้าน ซื้อทรัพย์สิน หรือลงทุนสร้างอนาคตร่วมกัน",
        "en": "Material and emotional security! Fruitful investments together, moving into a dream home, or thriving."
      }
    },
    "reversed": {
      "single": {
        "th": "พลาดโอกาสพบคนดีๆ หรือคนที่เข้ามาหวังผลประโยชน์ทางการเงิน ต้องดูเจตนาให้รอบคอบ",
        "en": "Missed romantic opportunity, or attracting opportunistic suitors who value your wallet over your soul."
      },
      "couple": {
        "th": "ปัญหาเรื่องเงินทองกระทบความสัมพันธ์ หรือวางแผนการเงินร่วมกันล้มเหลว ทำให้เกิดความตึงเครียด",
        "en": "Financial strain, reckless spending, or misaligned economic priorities placing stress on the partnership."
      }
    }
  },
  "pentacles_2": {
    "upright": {
      "single": {
        "th": "จัดสรรเวลาไม่ลงตัว หรือกำลังคุยสับรางสองคนพร้อมกันอย่างวุ่นวาย ต้องเลือกทางที่ชัดเจน",
        "en": "Juggling busy schedules or torn between two romantic prospects with playful adaptability."
      },
      "couple": {
        "th": "พยายามปรับสมดุลระหว่างงาน ชีวิตส่วนตัว และความรัก แม้จะยุ่งแต่ยังประคองกันไปได้อย่างราบรื่น",
        "en": "Balancing domestic duties, careers, and romantic dates. Fluid flexibility keeps the bond harmonious."
      }
    },
    "reversed": {
      "single": {
        "th": "รถไฟชนกัน สับรางพลาดจนเสียทั้งสองฝ่าย หรือเหนื่อยกับการบริหารเวลาจนไม่มีอารมณ์รัก",
        "en": "Juggling act collapses! Dropping the balls in courtship due to overwhelming life stress."
      },
      "couple": {
        "th": "ชีวิตคู่เสียสมดุล เครียดเรื่องเงินจนไม่มีเวลาให้กัน ความสัมพันธ์เริ่มสะดุดเพราะความเหนื่อยล้า",
        "en": "Overwhelmed by financial and logistical chaos; neglecting the emotional core of your relationship."
      }
    }
  },
  "pentacles_3": {
    "upright": {
      "single": {
        "th": "พบรักจากการทำงาน การร่วมโปรเจกต์ หรือคนใกล้ชิดช่วยแนะนำให้รู้จัก มีเคมีการทำงานร่วมกันยอดเยี่ยม",
        "en": "Love blossoming through collaborative work, creative projects, or glowing mutual recommendations."
      },
      "couple": {
        "th": "ร่วมมือกันสร้างอนาคตอย่างเป็นทีมเวิร์ก ช่วยกันคิดช่วยกันทำเพื่อความมั่นคงของครอบครัว",
        "en": "Superb teamwork! Constructing your shared future with mutual respect, shared goals, and competence."
      }
    },
    "reversed": {
      "single": {
        "th": "ทำงานร่วมกันแต่ขาดความเข้าใจ หรือคนคุยไม่ให้ความร่วมมือ ไม่เห็นคุณค่าในความพยายาม",
        "en": "Lack of cooperation or friction with a workplace crush; unappreciated romantic efforts."
      },
      "couple": {
        "th": "ขาดการสื่อสารในเรื่องหน้าที่ความรับผิดชอบ ทำให้เกิดความไม่พอใจและการทำงานบ้านไม่ลงรอย",
        "en": "Poor domestic coordination, refusing to pull one's weight, or squabbling over unshared duties."
      }
    }
  },
  "pentacles_4": {
    "upright": {
      "single": {
        "th": "หวงความโสด ไม่ยอมเปิดใจ กลัวการสูญเสียอิสรภาพหรือกลัวเสียเปรียบในความสัมพันธ์",
        "en": "Clinging tightly to singlehood out of fear of losing control, emotional exposure, or financial independence."
      },
      "couple": {
        "th": "มีความหึงหวง แสดงความเป็นเจ้าของสูง ยึดติดจนทำให้อีกฝ่ายอึดอัด ควรให้อิสระแก่กันบ้าง",
        "en": "Smothering possessiveness, jealousy, and hoarding control, creating an airless and restrictive bond."
      }
    },
    "reversed": {
      "single": {
        "th": "เริ่มปล่อยวางความกลัว พร้อมเปิดใจให้คนอื่นเข้ามาในชีวิต เลิกหวงความโสดเพื่อความสุขแท้จริง",
        "en": "Loosening rigid defenses! Ready to open your heart, share vulnerability, and welcome love."
      },
      "couple": {
        "th": "ผ่อนคลายความหึงหวง ให้อิสระแก่กันมากขึ้น ความสัมพันธ์เบาสบายและไว้เนื้อเชื่อใจกันดีขึ้น",
        "en": "Releasing suffocating possessiveness; granting breathing room and rebuilding relaxed mutual trust."
      }
    }
  },
  "pentacles_5": {
    "upright": {
      "single": {
        "th": "รู้สึกโดดเดี่ยว อ้างว้าง เหมือนถูกทิ้งไว้ข้างหลัง ขาดความอบอุ่น แต่ยังมีทางออกที่มองข้ามอยู่",
        "en": "Deep feelings of romantic isolation, feeling unloved or left out in the cold. Look up to find sanctuary."
      },
      "couple": {
        "th": "ร่วมทุกข์ร่วมยากในช่วงเวลาตึงเครียดทางการเงิน หรือรู้สึกว่าไม่ได้รับการดูแลเอาใจใส่จากคนรัก",
        "en": "Facing severe financial or emotional hardship together; avoid blaming each other for hard times."
      }
    },
    "reversed": {
      "single": {
        "th": "ผ่านพ้นช่วงเวลาอ้างว้าง มีคนยื่นมือเข้ามาช่วยเหลือและมอบความอบอุ่นให้หัวใจที่หนาวเหน็บ",
        "en": "Coming in from the cold! Welcomed into warmth, healing from poverty of affection."
      },
      "couple": {
        "th": "วิกฤตทางการเงินหรือความห่างเหินเริ่มคลี่คลาย กลับมาจับมือสู้ด้วยกันและความหวังเริ่มกลับมา",
        "en": "Recovery from financial crisis and emotional winter. Hope returns as you rebuild side by side."
      }
    }
  },
  "pentacles_6": {
    "upright": {
      "single": {
        "th": "มีคนเข้ามาดูแล คอยช่วยเหลือเรื่องต่างๆ หรือได้พบคนใจบุญ อบอุ่น มีน้ำใจและพร้อมแบ่งปัน",
        "en": "Generous, supportive courtship! Attracting someone kind-hearted who delights in spoiling and aiding you."
      },
      "couple": {
        "th": "มีการแบ่งปันความรักและความสุขอย่างสมดุล ฝ่ายหนึ่งให้ฝ่ายหนึ่งรับอย่างพอดี มีความเกื้อกูลกัน",
        "en": "Beautiful reciprocal balance. Generous mutual support, respectful equality, and joyful harmony."
      }
    },
    "reversed": {
      "single": {
        "th": "ระวังความสัมพันธ์ที่ไม่เท่าเทียม เป็นฝ่ายให้แต่ไม่เคยได้รับ หรือเจอคนทวงบุญคุณ",
        "en": "Unbalanced dynamics where affection has strings attached, or giving endlessly to ungrateful souls."
      },
      "couple": {
        "th": "ทวงบุญคุณในความสัมพันธ์ หรือฝ่ายใดฝ่ายหนึ่งรู้สึกว่าถูกเอาเปรียบและอยู่ใต้อำนาจเรื่องเงิน",
        "en": "Power imbalances via money or emotional debt; one partner plays the benefactor and demands submission."
      }
    }
  },
  "pentacles_7": {
    "upright": {
      "single": {
        "th": "อยู่ในช่วงเฝ้ามองความสัมพันธ์ ค่อยๆ ดูใจ ไม่รีบร้อน ประเมินว่าจะไปต่อหรือหยุดไว้แค่นี้",
        "en": "Patience and assessment. Pausing to see if current romantic seeds are genuinely worth long-term cultivation."
      },
      "couple": {
        "th": "ความสัมพันธ์ที่ลงแรงมาเริ่มเห็นผลลัพธ์ที่มั่นคง กำลังรอเก็บเกี่ยวดอกผลความรักและการร่วมสร้างครอบครัว",
        "en": "Hard work bearing fruit. Taking pride in your shared history while patiently planning the next harvest."
      }
    },
    "reversed": {
      "single": {
        "th": "เสียดายเวลาที่คุยมานานแต่ไม่พัฒนา หรือรู้สึกว่าเหนื่อยเปล่ากับการทุ่มเทให้คนที่ไม่ใช่",
        "en": "Frustration over wasted time and zero romantic return on investment. Time to cut losses."
      },
      "couple": {
        "th": "รู้สึกว่าความสัมพันธ์มาถึงทางตัน การลงทุนลงแรงไม่คุ้มค่า หรือเหนื่อยหน่ายกับความชักช้า",
        "en": "Impatience, disappointment with sluggish progress, or questioning if the partnership was worth the sacrifice."
      }
    }
  },
  "pentacles_8": {
    "upright": {
      "single": {
        "th": "มุ่งมั่นทำงาน พัฒนาตัวเองจนไม่มีเวลาเหงา และความเก่งจะดึงดูดคนดีๆ ที่ชื่นชมในความขยันเข้ามา",
        "en": "Mastering yourself! Dedication to craft and personal growth makes you irresistibly attractive to quality partners."
      },
      "couple": {
        "th": "ร่วมกันสร้างฐานะอย่างขยันขันแข็ง ดูแลเอาใจใส่กันในรายละเอียดเล็กๆ น้อยๆ สม่ำเสมอ",
        "en": "Diligent, loving attention to detail. Nurturing daily habits and working hard to build lasting prosperity."
      }
    },
    "reversed": {
      "single": {
        "th": "บ้างานเกินไปจนตัดขาดเรื่องรัก หรือขาดความพยายามในการเข้าหาคนอื่นจนความสัมพันธ์ไม่คืบหน้า",
        "en": "Workaholic habits shutting out love, or cutting corners in dating without putting in sincere effort."
      },
      "couple": {
        "th": "ละเลยคนรักเพราะมัวแต่ทำงาน หรือขาดความสม่ำเสมอในความสัมพันธ์ ทำให้เกิดความห่างเหิน",
        "en": "Neglecting emotional intimacy due to obsessive work, or getting stuck in dreary mechanical routine."
      }
    }
  },
  "pentacles_9": {
    "upright": {
      "single": {
        "th": "สวย รวย โสด มีความสุขกับชีวิตที่พึ่งพาตัวเองได้ สบายใจโดยไม่ต้องง้อใคร เสน่ห์แพงมาก",
        "en": "Sovereign, luxurious independence! Radiating high value, elegance, and contentment in your own skin."
      },
      "couple": {
        "th": "ต่างฝ่ายต่างมีความพร้อม ฐานะมั่นคง อยู่ด้วยกันแล้วชีวิตดีขึ้นอย่างสง่างามและมีเกียรติ",
        "en": "Prosperous companionship between two mature, self-sufficient souls who elevate each other's status."
      }
    },
    "reversed": {
      "single": {
        "th": "แม้ภายนอกจะดูพร้อมทุกอย่าง แต่ลึกๆ ยังรู้สึกเหงาและโหยหาใครสักคน หรือกลัวสูญเสียความสบาย",
        "en": "Superficial perfection masking inner loneliness, or valuing luxury over genuine emotional vulnerability."
      },
      "couple": {
        "th": "ปัญหาเรื่องการใช้เงินฟุ่มเฟือย หรือความห่างเหินเพราะต่างคนต่างอยู่จนเหมือนเพื่อนร่วมบ้าน",
        "en": "Living like wealthy roommates; financial comfort is high, but emotional intimacy has grown cold."
      }
    }
  },
  "pentacles_10": {
    "upright": {
      "single": {
        "th": "มีเกณฑ์พบรักกับคนที่มีครอบครัวอบอุ่น ฐานะมั่นคง และพร้อมสร้างอนาคตจริงจังเพื่อวันข้างหน้า",
        "en": "Legacy love! Attracting a partner with solid ancestral roots, financial stability, and marriage intentions."
      },
      "couple": {
        "th": "ครอบครัวสมบูรณ์พูนสุข ความสัมพันธ์มั่นคง ได้รับมรดกหรือซื้อบ้านร่วมกัน มีความสุขยั่งยืน",
        "en": "Enduring generational harmony, immense wealth, domestic security, and deep familial satisfaction."
      }
    },
    "reversed": {
      "single": {
        "th": "ปัญหาครอบครัวเป็นอุปสรรคต่อความรัก หรือกังวลเรื่องสถานะทางสังคมจนไม่กล้าเปิดใจคุย",
        "en": "Family burdens or socio-economic divides hindering romance; conflict between love and family duty."
      },
      "couple": {
        "th": "ความขัดแย้งเรื่องทรัพย์สิน เงินทอง หรือปัญหาญาติพี่น้องของแต่ละฝ่ายที่เข้ามากดดัน",
        "en": "Family inheritance feuds, financial loss, or toxic in-laws disrupting marital peace."
      }
    }
  },
  "pentacles_11": {
    "upright": {
      "single": {
        "th": "มีคนอายุน้อยกว่าแต่มีความคิดความอ่านจริงจัง มั่นคง ซื่อสัตย์ เข้ามาคุยแบบตั้งใจจริง",
        "en": "A practical, earnest, loyal admirer initiates connection with sincere long-term intentions."
      },
      "couple": {
        "th": "เริ่มต้นแผนการสร้างความมั่นคงใหม่ๆ ร่วมกัน เช่น เก็บเงินแต่งงานหรือลงทุนซื้อทรัพย์สิน",
        "en": "Planting fresh seeds of security: starting a shared savings plan or setting exciting practical goals."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนไม่ค่อยพร้อมเรื่องการเงิน หรือคนที่ยังขาดความรับผิดชอบ พูดอะไรแล้วทำไม่ได้จริง",
        "en": "Immature suitors who lack ambition, financial stability, or follow-through on their words."
      },
      "couple": {
        "th": "ขาดการวางแผนเรื่องอนาคต หรือการใช้เงินตามใจตัวเองเกินไปจนเกิดความกังวลในครอบครัว",
        "en": "Financial laziness, procrastination, and neglect of shared domestic obligations."
      }
    }
  },
  "pentacles_12": {
    "upright": {
      "single": {
        "th": "พบคนสุขุม รอบคอบ จริงใจ อาจไม่โรแมนติกแต่เสมอต้นเสมอปลายและเชื่อถือได้ 100%",
        "en": "A steadfast, dutiful, dependable suitor. Unhurried and not flashy, but offering unshakable loyalty."
      },
      "couple": {
        "th": "ความสัมพันธ์มั่นคงดั่งหินผา ช่วยกันสร้างเนื้อสร้างตัว ไม่หวือหวาแต่มั่นคงยาวนาน",
        "en": "Rock-solid dependability and steady devotion. Quietly working hard every day to protect your home."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนเฉื่อยชา ชักช้า ไม่ชัดเจน หรือบ้างานจนน่าเบื่อ ขาดความโรแมนติกอย่างสิ้นเชิง",
        "en": "Painfully sluggish courtship, boring workaholic suitors, or stubborn inertia stalling progress."
      },
      "couple": {
        "th": "ความสัมพันธ์น่าเบื่อ จำเจ ขาดสีสัน หรืออีกฝ่ายดื้อรั้นไม่ยอมเปลี่ยนพฤติกรรมเดิมๆ",
        "en": "Stifling marital rut, stubborn stubbornness, and total lack of romantic spark eroding joy."
      }
    }
  },
  "pentacles_13": {
    "upright": {
      "single": {
        "th": "อบอุ่น มีเสน่ห์แบบผู้ใหญ่ จัดการชีวิตและเงินทองได้ยอดเยี่ยม เป็นที่ต้องการของคนที่มองหาคู่ชีวิต",
        "en": "Nurturing, sensual, and grounded. You radiate the qualities of an ideal life partner and domestic queen."
      },
      "couple": {
        "th": "เป็นคู่ชีวิตที่ดูแลทั้งบ้าน การเงิน และความรู้สึกของคนรักได้อย่างสมบูรณ์แบบ อบอุ่นและมั่นคง",
        "en": "Flourishing domestic sanctuary. Providing bountiful nourishment, financial prudence, and cozy security."
      }
    },
    "reversed": {
      "single": {
        "th": "กังวลเรื่องความมั่นคงจนไม่กล้าเปิดใจ หรือมองความรักเป็นเรื่องเงินทองมากเกินไปจนเสียโอกาส",
        "en": "Over-focusing on bank accounts while ignoring genuine heart; paralyzing financial anxieties."
      },
      "couple": {
        "th": "ความตระหนี่ถี่เหนียว หรือความเครียดจากภาระค่าใช้จ่ายในบ้านทำให้บรรยากาศตึงเครียด",
        "en": "Material possessiveness, workaholic burnout, or neurotic hoarding dampening domestic warmth."
      }
    }
  },
  "pentacles_14": {
    "upright": {
      "single": {
        "th": "พบคนฐานะมั่นคง เป็นผู้นำ มีความรับผิดชอบสูง พร้อมดูแลชีวิตเราได้อย่างดีและจริงจัง",
        "en": "A generous, wealthy, honorable patriarch suitor who offers supreme security and devoted commitment."
      },
      "couple": {
        "th": "ความรักมั่นคงถึงที่สุด คนรักเป็นเสาหลักที่ไว้ใจได้ สร้างความอบอุ่นและมั่นคงให้ครอบครัว",
        "en": "Pinnacle of marital stability, immense material abundance, and steadfast fatherly/partner protection."
      }
    },
    "reversed": {
      "single": {
        "th": "เจอคนเห็นแก่เงิน ยึดติดวัตถุ หรือใช้เงินซื้อความรู้สึก ระวังคนที่เอาแต่ผลประโยชน์ส่วนตัว",
        "en": "Materialistic bullies who believe everything has a price tag, or corrupt lovers driven purely by greed."
      },
      "couple": {
        "th": "ความสัมพันธ์ที่ไร้ความโรแมนติก มีแต่เรื่องเงินและผลประโยชน์ หรือการบงการด้วยทรัพย์สิน",
        "en": "Financial tyranny, miserliness, or treating spouse as a material possession rather than a beloved."
      }
    }
  }
};

// Automatically enrich TAROT_CARDS if already loaded in the environment
if (typeof TAROT_CARDS !== "undefined" && Array.isArray(TAROT_CARDS)) {
  TAROT_CARDS.forEach(card => {
    const meta = TAROT_LOVE_DATA[card.id];
    if (meta) {
      if (card.upright && card.upright.love) {
        card.upright.love.single = meta.upright.single;
        card.upright.love.couple = meta.upright.couple;
      }
      if (card.reversed && card.reversed.love) {
        card.reversed.love.single = meta.reversed.single;
        card.reversed.love.couple = meta.reversed.couple;
      }
    }
  });
}

// Window attachment
if (typeof window !== "undefined") {
  window.TAROT_LOVE_DATA = TAROT_LOVE_DATA;
}
