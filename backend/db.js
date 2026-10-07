/**
 * ==========================================================================
 * KAVYA GURU — SQLite Relational Database Engine
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * Powered by: Node.js 24 Native SQLite (node:sqlite)
 * ==========================================================================
 */

const { DatabaseSync } = require('node:sqlite');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

// Detect serverless environment (Vercel, AWS Lambda)
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  process.env.NOW_REGION
);

let DB_PATH;
if (isServerless) {
  // In serverless environments, only temp dir is writable (/tmp on Linux/Vercel)
  const tmpDir = os.tmpdir();
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  DB_PATH = path.join(tmpDir, 'kavya_guru.db');
  const sourceDb = path.join(__dirname, '..', 'data', 'kavya_guru.db');
  
  if (!fs.existsSync(DB_PATH) && fs.existsSync(sourceDb)) {
    try {
      fs.copyFileSync(sourceDb, DB_PATH);
      console.log('[Kavya Guru DB] Seed database successfully copied to', DB_PATH);
    } catch (err) {
      console.warn('[Kavya Guru DB] Could not copy seed DB to temp, will initialize fresh:', err.message);
    }
  }
} else {
  DB_PATH = path.join(__dirname, '..', 'data', 'kavya_guru.db');
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

const db = new DatabaseSync(DB_PATH);

// Enable WAL or fallback journal mode & foreign keys
try {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);
} catch (e) {
  try {
    db.exec(`
      PRAGMA journal_mode = DELETE;
      PRAGMA foreign_keys = ON;
    `);
  } catch (err) {
    console.warn('[Kavya Guru DB] PRAGMA config warning:', err.message);
  }
}

function initSchema() {
  db.exec(`
    -- 1. Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'Student Member',
      avatar TEXT DEFAULT 'KG',
      streak_days INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Poetry Catalog (Clean, Real Submissions & Admin Posts)
    CREATE TABLE IF NOT EXISTS poetry (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      poet TEXT NOT NULL,
      language TEXT NOT NULL,
      category TEXT NOT NULL,
      year TEXT,
      reads INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      stanza TEXT NOT NULL,
      meaning TEXT,
      stanza_trans TEXT,
      meaning_trans TEXT,
      image_url TEXT,
      pdf_url TEXT,
      is_custom INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Educational Notes Vault
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      grade TEXT NOT NULL,
      read_time TEXT NOT NULL,
      downloads INTEGER DEFAULT 0,
      summary TEXT NOT NULL,
      chapters_json TEXT NOT NULL,
      key_points_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. YouTube Video Resources (Real Links opened on YouTube)
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      channel TEXT NOT NULL,
      duration TEXT NOT NULL,
      views TEXT DEFAULT '0',
      category TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      youtube_url TEXT NOT NULL,
      youtube_id TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. Google Meet Live Courses
    CREATE TABLE IF NOT EXISTS meet_courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      instructor TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      platform TEXT DEFAULT 'Google Meet',
      meet_link TEXT NOT NULL,
      status TEXT DEFAULT 'Registration Open',
      seats_total INTEGER NOT NULL DEFAULT 50,
      seats_booked INTEGER NOT NULL DEFAULT 0,
      badge TEXT DEFAULT 'Live Masterclass',
      fee TEXT DEFAULT 'Free for Students',
      highlights_json TEXT DEFAULT '[]',
      curriculum_json TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. Career Roadmaps
    CREATE TABLE IF NOT EXISTS career_paths (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      avg_salary TEXT NOT NULL,
      demand TEXT NOT NULL,
      description TEXT NOT NULL,
      roadmap_json TEXT NOT NULL,
      top_skills_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. Community Discussion Threads (Charcha)
    CREATE TABLE IF NOT EXISTS community_threads (
      id TEXT PRIMARY KEY,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT NOT NULL,
      tag TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. Thread Comments
    CREATE TABLE IF NOT EXISTS thread_comments (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thread_id) REFERENCES community_threads(id) ON DELETE CASCADE
    );

    -- 9. Course Enrollments (Google Meet)
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 10. Saved Library Bookmarks
    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, item_id)
    );

    -- 11. Mentorship Bookings
    CREATE TABLE IF NOT EXISTS mentorship_bookings (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      career_domain TEXT NOT NULL,
      class_degree TEXT,
      questions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 12. Admin Credentials / Settings
    CREATE TABLE IF NOT EXISTS admin_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  try {
    db.exec(`ALTER TABLE poetry ADD COLUMN stanza_trans TEXT;`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE poetry ADD COLUMN meaning_trans TEXT;`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE poetry ADD COLUMN image_url TEXT;`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE poetry ADD COLUMN pdf_url TEXT;`);
  } catch (e) {}

  // Set default Admin Password to Ashish123
  db.prepare(`
    INSERT OR REPLACE INTO admin_config (key, value)
    VALUES ('admin_password', 'Ashish123')
  `).run();

  // Seed rich bilingual catalog if empty or update translations
  seedInitialData(db);
}

function seedInitialData(database) {
  const insertPoem = database.prepare(`
    INSERT OR REPLACE INTO poetry (id, title, poet, language, category, year, reads, likes, stanza, meaning, stanza_trans, meaning_trans, is_custom)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPoem.run(
    'kg-p-01',
    'अग्निपथ (Agneepath)',
    'डॉ. हरिवंश राय बच्चन',
    'hindi',
    'inspirational',
    '1968',
    4820,
    342,
    `वृक्ष हों भले खड़े,\nहों घने हों बड़े,\nएक पत्र-छाहँ भी,\nमाँग मत, माँग मत, माँग मत,\nअग्निपथ! अग्निपथ! अग्निपथ!\n\nतू न थकेगा कभी,\nतू न थमेगा कभी,\nतू न मुड़ेगा कभी,\nकर शपथ! कर शपथ! कर शपथ!\nअग्निपथ! अग्निपथ! अग्निपथ!`,
    'अग्निपथ जीवन के कठिन संघर्षों में बिना किसी की दया या सहारे के निरंतर आगे बढ़ते रहने और कभी हार न मानने की अमर प्रेरणा देती है।',
    `Even if there stand great trees,\nThick with leaves and mighty branches,\nDo not ask for even a single leaf's shade!\nAgneepath! Agneepath! Agneepath!\n\nYou shall never tire,\nYou shall never pause,\nYou shall never turn back,\nTake this solemn oath!\nAgneepath! Agneepath! Agneepath!`,
    'Agneepath inspires unwavering perseverance, self-reliance, and fearless courage through life\'s toughest struggles without yielding.',
    0
  );

  insertPoem.run(
    'kg-p-02',
    'The Road Not Taken',
    'Robert Frost',
    'english',
    'classic',
    '1916',
    3950,
    298,
    `Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nI took the one less traveled by,\nAnd that has made all the difference.`,
    'A profound reflection on personal choices, moral courage, and choosing unconventional life paths that define destiny.',
    `पीले जंगल में दो राहें फूटती थीं,\nऔर अफ़सोस कि मैं दोनों पर नहीं चल सकता था,\nएक मुसाफ़िर बनकर देर तक मैं खड़ा रहा,\nऔर जहाँ तक निगाह गई, एक राह को देखता रहा;\n\nमैंने वह राह चुनी जिस पर कम लोग चले थे,\nऔर इसी एक फैसले ने सारी तकदीर बदल दी।`,
    'यह अमर कविता जीवन के महत्वपूर्ण व्यक्तिगत निर्णयों, नैतिक साहस और उस मार्ग को चुनने की प्रेरणा देती है जिस पर बहुत कम लोग चलने का साहस जुटा पाते हैं।',
    0
  );

  insertPoem.run(
    'kg-p-03',
    'रश्मिरथी: कृष्ण की चेतावनी',
    'रामधारी सिंह \'दिनकर\'',
    'hindi',
    'classic',
    '1952',
    5210,
    489,
    `वर्षों तक वन में घूम-घूम,\nबाधा-विघ्नों को चूम-चूम,\nसह धूप-घाम, पानी-पत्थर,\nपांडव आये कुछ और निखर।\nसौभाग्य न सब दिन सोता है,\nदेखें, आगे क्या होता है!\n\nमैत्री की राह बताने को,\nसबको सुमार्ग पर लाने को,\nदुर्योधन को समझाने को,\nभीषण विध्वंस बचाने को,\nभगवान हस्तिनापुर आये,\nपांडव का विसंदेश लाये।`,
    'दिनकर जी की ओजस्वी लेखनी से शांति, न्याय और नीति के उल्लंघन पर आने वाले विनाशकारी परिणाम का कालजयी उद्घोष।',
    `Wandering in forests year upon year,\nKissing obstacles and perils with cheer,\nEnduring scorching heat, torrential stone,\nThe Pandavas emerged in brilliance alone!\n\nTo guide all towards friendship and peace,\nTo make war's dreadful destruction cease,\nLord Krishna came to Hastinapur's court,\nWith the message of Pandavas' final resort.`,
    'Dinkar\'s iconic fiery verse delivers a timeless proclamation of peace, justice, and the catastrophic destiny awaiting those who abandon righteousness.',
    0
  );

  insertPoem.run(
    'kg-p-04',
    'Daffodils (I Wandered Lonely as a Cloud)',
    'William Wordsworth',
    'english',
    'nature',
    '1807',
    3120,
    245,
    `I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;\nBeside the lake, beneath the trees,\nFluttering and dancing in the breeze.`,
    'Celebrates the transcendental healing power of nature and how quiet memory rekindles inner joy.',
    `मैं किसी अकेले बादल की मानिंद भटकता रहा,\nजो घाटियों और पहाड़ियों के ऊपर तैरता है,\nतभी अचानक मुझे एक जमघट दिखाई दिया,\nसुनहरे डैफोडिल फूलों का एक लहराता सागर;\nझील के किनारे, पेड़ों की छाँव तले,\nमंद हवा में झूमते और थिरकते हुए।`,
    'यह कविता प्रकृति की अपार सुकूनदायी शक्ति और एकांत में संजोई गई सुंदर स्मृतियों के आनंद का उत्सव मनाती है।',
    0
  );

  insertPoem.run(
    'kg-p-05',
    'हो गई है पीर पर्वत-सी पिघलनी चाहिए',
    'दुष्यंत कुमार',
    'hindi',
    'ghazal',
    '1975',
    4410,
    376,
    `हो गई है पीर पर्वत-सी पिघलनी चाहिए,\nइस हिमालय से कोई गंगा निकलनी चाहिए।\n\nआज यह दीवार, परदों की तरह हिलने लगी,\nशर्त लेकिन थी कि ये बुनियाद हिलनी चाहिए।\n\nसिर्फ हंगामा खड़ा करना मेरा मक़सद नहीं,\nमेरी कोशिश है कि ये सूरत बदलनी चाहिए।`,
    'सामाजिक चेतना, बदलाव की ललक और युवाओं के आत्म-सम्मान को जगाने वाली हिंदी ग़ज़ल की सबसे अमर रचना।',
    `The agony that stood like a mountain must now melt away,\nFrom this Himalaya, a new holy Ganga must find its way.\n\nToday this wall began to shake like curtains in the wind,\nYet the condition was that the very foundation must be stirred!\n\nMerely creating an uproar is never my desire,\nMy only relentless pursuit is that this reality must transform.`,
    'Dushyant Kumar\'s legendary Ghazal awakens collective conscience, yearning for social reform, and the indomitable spirit of youth.',
    0
  );

  insertPoem.run(
    'kg-p-06',
    'Where the Mind is Without Fear',
    'Rabindranath Tagore',
    'english',
    'inspirational',
    '1910',
    3820,
    310,
    `Where the mind is without fear and the head is held high;\nWhere knowledge is free;\nWhere the world has not been broken up into fragments\nBy narrow domestic walls;\nWhere words come out from the depth of truth;\nInto that heaven of freedom, my Father, let my country awake.`,
    'Nobel laureate Tagore\'s universal prayer for intellectual fearlessness, open truth, and global unity.',
    `जहाँ मन भयमुक्त हो और मस्तक सदैव ऊँचा रहे;\nजहाँ ज्ञान सभी के लिए स्वतंत्र और सुलभ हो;\nजहाँ संकीर्ण दीवारों से संसार टुकड़ों में न बँटा हो;\nजहाँ शब्द सत्य की अगाध गहराइयों से निकलते हों;\nहे परमपिता! स्वतंत्रता के उसी पावन स्वर्ग में मेरे देश को जगाओ!`,
    'नोबेल पुरस्कार विजेता रवींद्रनाथ ठाकुर की बौद्धिक निडरता, सत्य और सार्वभौमिक बंधुत्व के लिए रची गई विश्वप्रसिद्ध प्रार्थना।',
    0
  );

  const noteCount = database.prepare('SELECT COUNT(*) as count FROM notes').get().count;
  if (noteCount === 0) {
    const insertNote = database.prepare(`
      INSERT INTO notes (id, title, subject, grade, read_time, downloads, summary, chapters_json, key_points_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertNote.run(
      'kg-n-01',
      'हिंदी साहित्य का काल विभाजन एवं प्रवृत्तियां',
      'हिंदी साहित्य (Hindi Literature)',
      'Class 11-12 / BA / CUET',
      '12 मिनट',
      1450,
      'आचार्य रामचंद्र शुक्ल के अनुसार हिंदी साहित्य के चारों प्रमुख कालों (आदिकाल, भक्तिकाल, रीतिकाल, आधुनिक काल) का प्रामाणिक व परीक्षा-उपयोगी अध्ययन।',
      JSON.stringify([
        '१. आदिकाल (वीरगाथा काल: संवत् 1050-1375) - रासो काव्य परंपरा व प्रवृत्तियां',
        '२. भक्तिकाल (स्वर्ण युग: संवत् 1375-1700) - निर्गुण (ज्ञानाश्रयी/प्रेमाश्रयी) व सगुण काव्य',
        '३. रीतिकाल (संवत् 1700-1900) - रीतिबद्ध, रीतिसिद्ध और रीतिमुक्त कवि',
        '४. आधुनिक काल (गद्य काल: संवत् 1900 से अब तक) - भारतेंदु युग, छायावाद व प्रगतिवाद'
      ]),
      JSON.stringify([
        'भक्तिकाल को जॉर्ज ग्रियर्सन ने हिंदी साहित्य का स्वर्ण युग (Golden Age) कहा।',
        'कबीरदास ज्ञानमार्गी तथा मलिक मोहम्मद जायसी प्रेममार्गी निर्गुण शाखा के प्रमुख कवि हैं।',
        'छायावाद के चार प्रमुख स्तंभ: जयशंकर प्रसाद, सूर्यकांत त्रिपाठी \'निराला\', सुमित्रानंदन पंत, महादेवी वर्मा।'
      ])
    );

    insertNote.run(
      'kg-n-02',
      'Essential Poetic Devices & Figures of Speech',
      'English Literature',
      'CBSE 11-12 / CUET / UG',
      '10 mins',
      1280,
      'Master high-scoring poetic techniques including Metaphor, Simile, Personification, Alliteration, Hyperbole, and Oxymoron with curated literature examples.',
      JSON.stringify([
        '1. Comparison Devices: Simile vs Metaphor vs Analogy',
        '2. Sound Devices: Alliteration, Assonance, Consonance & Onomatopoeia',
        '3. Structural Techniques: Enjambment, Caesura, Meter & Rhyme Scheme',
        '4. Figurative Imagery: Symbolism, Irony, Hyperbole & Litotes'
      ]),
      JSON.stringify([
        'A Metaphor asserts direct equation without "like" or "as" (e.g. "Time is a thief").',
        'Enjambment pulls the reader seamlessly across lines without terminal punctuation.',
        'Oxymoron joins contradictory terms for dramatic resonance ("sweet sorrow", "deafening silence").'
      ])
    );

    insertNote.run(
      'kg-n-03',
      'रस, छंद एवं अलंकार सिद्धांत — सम्पूर्ण कैप्सूल',
      'हिंदी व्याकरण एवं काव्यशास्त्र',
      'Board Exams & CUET Prep',
      '15 मिनट',
      1890,
      'रस के चार अंग (स्थायी भाव, विभाव, अनुभाव, संचारी भाव), प्रमुख 9 रस तथा शब्दालंकार व अर्थालंकार की सरल व्याख्या उदाहरणों सहित।',
      JSON.stringify([
        '१. भरतमुनि का रस सूत्र: "विभावानुभावव्यभिचारिसंयोगाद्रसनिष्पत्तिः"',
        '२. नवरस एवं उनके स्थायी भाव तालिका (श्रृंगार, वीर, करुण, हास्य आदि)',
        '३. प्रमुख अलंकार: अनुप्रास, यमक, श्लेष, उपमा, रूपक, उत्प्रेक्षा, अतिशयोक्ति',
        '४. दोहा, चौपाई, रोला एवं सोरठा छंद की मात्रा गणना सूत्र'
      ]),
      JSON.stringify([
        'श्रृंगार रस को \'रसराज\' (रसों का राजा) कहा जाता है, जिसका स्थायी भाव \'रति\' है।',
        'अनुप्रास में वर्णों की आवृत्ति होती है, जबकि यमक में एक ही शब्द भिन्न अर्थों में प्रयुक्त होता है।',
        'उत्प्रेक्षा में उपमेय में उपमान की संभावना व्यक्त की जाती है (मानो, जानो, मनहुँ, जनहुँ)।'
      ])
    );
  }

  const videoCount = database.prepare('SELECT COUNT(*) as count FROM videos').get().count;
  if (videoCount === 0) {
    const insertVideo = database.prepare(`
      INSERT INTO videos (id, title, channel, duration, views, category, thumbnail, youtube_url, youtube_id, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVideo.run(
      'kg-v-01',
      'हिंदी साहित्य का इतिहास — 1 वीडियो में संपूर्ण अवलोकन',
      'Kavya Guru Official',
      '42:15',
      '24.5K',
      'Literature',
      './assets/images/kavya_guru_hero.jpg',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'dQw4w9WgXcQ',
      'आदिकाल से आधुनिक छायावाद तक के महत्वपूर्ण कवियों, कालक्रम, और परीक्षा प्रश्नों का विस्तृत एवं सरल विश्लेषण।'
    );

    insertVideo.run(
      'kg-v-02',
      'Poetry Recitation & Voice Modulation Masterclass',
      'Kavya Guru Studio',
      '28:30',
      '18.2K',
      'Poetry',
      './assets/images/kavya_guru_hero.jpg',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'dQw4w9WgXcQ',
      'Learn breath control, tonal dynamics, emotional inflection, and microphone etiquette for live stage poetry performance.'
    );

    insertVideo.run(
      'kg-v-03',
      'CUET & Board Exam English: Complete Writing Skills',
      'Kavya Guru Academics',
      '35:10',
      '15.8K',
      'Grammar',
      './assets/images/kavya_guru_hero.jpg',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'dQw4w9WgXcQ',
      'Scoring full marks in Article writing, Report writing, Letter to Editor, and Reading comprehension passages.'
    );
  }

  const meetCount = database.prepare('SELECT COUNT(*) as count FROM meet_courses').get().count;
  if (meetCount === 0) {
    const insertMeet = database.prepare(`
      INSERT INTO meet_courses (id, title, instructor, date, time, platform, meet_link, status, seats_total, seats_booked, badge, fee, highlights_json, curriculum_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMeet.run(
      'kg-m-01',
      'सप्ताहांत लाइव काव्य गोष्ठी एवं वाचन कार्यशाला',
      'डॉ. आलोक श्रीवास्तव (प्रसिद्ध साहित्यकार)',
      'इस शनिवार (Every Saturday)',
      '06:00 PM - 07:30 PM (IST)',
      'Google Meet',
      'https://meet.google.com/kg-live-edu',
      'Registration Open',
      50,
      38,
      'लाइव मास्टरक्लास',
      'छात्रों के लिए निःशुल्क',
      JSON.stringify([
        'छात्रों की अपनी रचनाओं पर लाइव समीक्षा एवं रचनात्मक सुझाव',
        'आवाज का उतार-चढ़ाव एवं मंच प्रस्तुति की कला',
        'प्रश्नोत्तर एवं समकालीन कविता पर चर्चा'
      ]),
      JSON.stringify([
        'सत्र १: छंदबद्ध और मुक्तक काव्य रचना का शिल्प',
        'सत्र २: वाचन अभ्यास एवं माइक्रोफोन का उपयोग',
        'सत्र ३: प्रतिभागियों की कविताओं की समीक्षा'
      ])
    );

    insertMeet.run(
      'kg-m-02',
      'Creative Writing & Narrative Storytelling Masterclass',
      'Prof. Meenakshi Sharma (Oxford Alumni)',
      'Every Sunday',
      '11:00 AM - 12:30 PM (IST)',
      'Google Meet',
      'https://meet.google.com/kg-live-edu',
      'Registration Open',
      45,
      31,
      'Interactive Workshop',
      'Free for Students',
      JSON.stringify([
        'Character arc development & narrative pacing',
        'Pitching to literary agents, journals, and publishing houses',
        '1-on-1 feedback on creative writing submissions'
      ]),
      JSON.stringify([
        'Module 1: The Anatomy of an Unforgettable Story',
        'Module 2: Pacing, Dialogue & Sensory Descriptions',
        'Module 3: Portfolio Building & Getting Published'
      ])
    );
  }

  const threadCount = database.prepare('SELECT COUNT(*) as count FROM community_threads').get().count;
  if (threadCount === 0) {
    const insertThread = database.prepare(`
      INSERT INTO community_threads (id, author, role, avatar, tag, title, content, likes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertThread.run(
      'kg-t-01',
      'आदित्य नारायण',
      'छात्र सदस्य (BA साहित्य)',
      'AN',
      'Poem of the Day',
      'आपकी पसंदीदा हिंदी कविता या ग़ज़ल कौन सी है और क्यों?',
      'साथियों, जब भी मन उदास या प्रेरित होता है, मैं "अग्निपथ" या दुष्यंत कुमार की "हो गई है पीर पर्वत-सी" पढ़ता हूँ। आप सभी की वह कौन सी एक रचना है जो जीवन के हर मोड़ पर आपका हौसला बढ़ाती है? अपने विचार जरूर साझा करें।',
      24
    );

    insertThread.run(
      'kg-t-02',
      'Ananya Sen',
      'Literature Enthusiast',
      'AS',
      'Study Circle',
      'How do you analyze tone and mood in English romantic poetry?',
      'Preparing for CUET Literature and finding it tricky to distinguish subtle tonal differences between Shelley and Keats. Any recommended frameworks or key words to look for in stanzas?',
      19
    );
  }
}

initSchema();

module.exports = {
  db
};
