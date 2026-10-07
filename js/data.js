/**
 * ==========================================================================
 * KAVYA GURU — Official Brand Constants & Clean Schema
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * Description: Kavya Guru is your space for poetry, knowledge, learning,
 * courses and career guidance.
 * ==========================================================================
 */

const KAVYA_GURU_BRAND = {
  name: "Kavya Guru",
  tagline: "Read • Learn • Grow",
  description: "Kavya Guru is your space for poetry, knowledge, learning, courses and career guidance.",
  established: 2026,
  supportEmail: "support@kavyaguru.com",
  socials: {
    youtube: "https://youtube.com/@KavyaGuru",
    telegram: "https://t.me/KavyaGuruOfficial",
    meet: "https://meet.google.com/kg-live-edu",
    instagram: "https://instagram.com/KavyaGuruOfficial"
  }
};

// Clean arrays: Real content is populated directly from SQLite database and Admin entries
const KAVYA_GURU_POETRY = [];
const KAVYA_GURU_NOTES = [];
const KAVYA_GURU_VIDEOS = [];
const KAVYA_GURU_MEET_COURSES = [];
const KAVYA_GURU_COMMUNITY_THREADS = [];

// Standard Career Guidance Frameworks (Bilingual Hindi & English)
const KAVYA_GURU_CAREERS = [
  {
    id: "kg-c-01",
    title: "Content Strategist & Creative Writer",
    title_hi: "कंटेंट रणनीतिकार एवं रचनात्मक लेखक",
    category: "Digital Media & Brands",
    category_hi: "डिजिटल मीडिया एवं ब्रांड्स",
    averageSalary: "₹4.5L - ₹12L PA",
    averageSalary_hi: "₹4.5 लाख - ₹12 लाख प्रति वर्ष",
    demand: "High Growth",
    demand_hi: "तीव्र विकासशील मांग",
    description: "Craft brand narratives, storytelling campaigns, podcasts, and articles across tech, media, and creative publishing sectors.",
    description_hi: "तकनीक, मीडिया, प्रकाशन और रचनात्मक ब्रांड्स के लिए प्रेरक कथाएं, पॉडकास्ट और प्रभावशाली आलेख तैयार करना।",
    roadmap: [
      "Step 1: Build a dedicated reading habit and write daily short-form pieces on Kavya Guru Charcha.",
      "Step 2: Learn SEO writing, audience persona analysis, and narrative pacing.",
      "Step 3: Publish 5-10 in-depth articles or essays to curate a verifiable portfolio.",
      "Step 4: Pitch freelance clients or apply to media, PR, and SaaS companies."
    ],
    roadmap_hi: [
      "चरण १: निरंतर अध्ययन की आदत बनाएं और काव्य गुरु चर्चा पर नियमित लघु आलेख लिखें।",
      "चरण २: एसईओ (SEO) लेखन, पाठक मनोविज्ञान और कथा प्रवाह (Pacing) की कला सीखें।",
      "चरण ३: एक मजबूत व प्रामाणिक पोर्टफोलियो बनाने के लिए 5-10 मौलिक आलेख प्रकाशित करें।",
      "चरण ४: मीडिया संस्थानों, प्रकाशन गृहों या फ्रीलांस क्लाइंट्स के साथ काम शुरू करें।"
    ],
    topSkills: ["Storytelling", "SEO Writing", "Copywriting", "Audience Empathy", "Editorial Review"],
    topSkills_hi: ["कथावाचन (Storytelling)", "एसईओ लेखन", "कॉपीराइटिंग", "संपादकीय कौशल", "रचनात्मक समीक्षा"]
  },
  {
    id: "kg-c-02",
    title: "Literature Educator & Academic Researcher",
    title_hi: "साहित्य प्राध्यापक एवं शोधकर्ता",
    category: "Academia & Higher Ed",
    category_hi: "अकादमिक एवं उच्च शिक्षा",
    averageSalary: "₹5L - ₹14L PA",
    averageSalary_hi: "₹5 लाख - ₹14 लाख प्रति वर्ष",
    demand: "Stable & Respected",
    demand_hi: "स्थायी व प्रतिष्ठित",
    description: "Teach school/college students, publish research papers in peer-reviewed journals, and foster youth literary passion.",
    description_hi: "विश्वविद्यालयों व कॉलेजों में अध्यापन, प्रतिष्ठित शोध-पत्रिकाओं में शोध-प्रबंध का प्रकाशन और युवाओं में साहित्यिक चेतना का विकास।",
    roadmap: [
      "Step 1: Complete Bachelor's degree (BA Honours in Literature / Hindi / English).",
      "Step 2: Pursue Master's degree (MA) with high academic distinction.",
      "Step 3: Clear UGC-NET / JRF for research fellowships and assistant professorship eligibility.",
      "Step 4: Pursue Ph.D. or join reputed educational institutions and universities."
    ],
    roadmap_hi: [
      "चरण १: साहित्य / हिंदी / अंग्रेजी में स्नातक (BA Honours) पूर्ण करें।",
      "चरण २: स्नातकोत्तर (MA) में उच्च अकादमिक अंकों के साथ विषय पर गहरी पकड़ बनाएं।",
      "चरण ३: शोध अध्येतावृत्ति एवं सहायक प्राध्यापक पद हेतु UGC-NET / JRF परीक्षा उत्तीर्ण करें।",
      "चरण ४: पीएचडी (Ph.D.) में शोध कार्य करें या प्रतिष्ठित विश्वविद्यालयों में अध्यापन शुरू करें।"
    ],
    topSkills: ["Critical Analysis", "Pedagogy", "Curriculum Design", "Research Methodology", "Public Speaking"],
    topSkills_hi: ["आलोचनात्मक विश्लेषण", "शिक्षण शास्त्र", "पाठ्यक्रम निर्माण", "शोध प्रविधि", "सार्वजनिक वक्तृत्व"]
  },
  {
    id: "kg-c-03",
    title: "Civil Services & Public Policy (UPSC / State PCS)",
    title_hi: "सिविल सेवा एवं लोक नीति (UPSC / राज्य PCS)",
    category: "Government & Governance",
    category_hi: "शासन एवं लोक नीति",
    averageSalary: "₹8L - ₹18L PA (Pay Commission)",
    averageSalary_hi: "₹8 लाख - ₹18 लाख प्रति वर्ष (वेतन आयोग)",
    demand: "Prestigious",
    demand_hi: "सर्वोच्च प्रतिष्ठित",
    description: "Serve the nation through policy administration, public welfare, diplomacy, and administrative leadership.",
    description_hi: "राष्ट्र सेवा, नीति प्रशासन, लोक कल्याण और प्रशासनिक नेतृत्व के माध्यम से देश के विकास में सर्वोच्च योगदान।",
    roadmap: [
      "Step 1: Thoroughly understand syllabus and exam patterns (Prelims, Mains, Interview).",
      "Step 2: Master foundational NCERTs and Kavya Guru General Studies vault.",
      "Step 3: Choose literature or humanities as high-scoring optional subject.",
      "Step 4: Rigorous daily answer writing and current affairs synthesis."
    ],
    roadmap_hi: [
      "चरण १: परीक्षा पैटर्न और विस्तृत पाठ्यक्रम (प्रारंभिक, मुख्य परीक्षा व साक्षात्कार) का गहन विश्लेषण करें।",
      "चरण २: मूलभूत एनसीईआरटी (NCERT) पुस्तकें व काव्य गुरु अध्ययन नोट्स पर पकड़ बनाएं।",
      "चरण ३: हिंदी साहित्य अथवा मानविकी विषय को उच्च-अंकदायी वैकल्पिक विषय (Optional) के रूप में चुनें।",
      "चरण ४: प्रतिदिन मुख्य परीक्षा हेतु उत्तर लेखन और समसामयिक विषयों का नियमित संश्लेषण करें।"
    ],
    topSkills: ["Analytical Reasoning", "Ethical Decision Making", "Essay Writing", "General Awareness", "Resilience"],
    topSkills_hi: ["विश्लेषणात्मक चिंतन", "नैतिक निर्णय क्षमता", "निबंध लेखन", "सामान्य अध्ययन", "धैर्य व निरंतरता"]
  }
];

const KAVYA_GURU_EMAIL_TEMPLATES = [
  {
    id: "em-01",
    subject: "Welcome to Kavya Guru — Read • Learn • Grow",
    previewText: "Your space for poetry, knowledge, learning, courses and career guidance.",
    sender: "Kavya Guru <welcome@kavyaguru.com>",
    bodyHtml: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #5925dc; margin: 0; font-size: 26px;">KAVYA GURU</h2>
          <p style="color: #f59e0b; font-weight: 600; margin: 4px 0 0; font-size: 13px; letter-spacing: 1px;">READ • LEARN • GROW</p>
        </div>
        <p style="font-size: 16px; color: #1e293b;">Namaste & Welcome!</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          Thank you for joining <strong>Kavya Guru</strong>. You have unlocked access to poetry, educational notes, YouTube lessons, live Google Meet sessions, and a student community.
        </p>
        <div style="background: #f8fafc; border-left: 4px solid #5925dc; padding: 14px 18px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Brand Philosophy:</strong><br/>Kavya Guru is your space for poetry, knowledge, learning, courses and career guidance.</p>
        </div>
        <p style="font-size: 14px; color: #64748b; margin-top: 24px; text-align: center;">Warm regards,<br/>Team Kavya Guru</p>
      </div>
    `
  }
];
