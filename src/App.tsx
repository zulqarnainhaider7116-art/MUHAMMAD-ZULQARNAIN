import { useState, type FormEvent } from 'react';
import {
  ArrowRight, BookOpen, Building2, CheckCircle2, GraduationCap, Heart,
  Landmark, Laptop, LibraryBig, Menu, Moon, Send, ShieldCheck, Sun,
  Users, X, Youtube, MessageCircle, SendHorizonal, Link2, Share2, Copy, QrCode, Trophy, BookMarked,
  BrainCircuit, Sparkles, RotateCcw, Check, CircleHelp, Bookmark, BookmarkCheck, Award, Medal, BookOpenCheck
} from 'lucide-react';

const photos = {
  hero: '/resources/student-mosque-hero.png',
  mosque: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=90',
  quran: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=90',
  library: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=90',
  madina: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=90',
};

const books = [
  { title: 'Mishkat al-Masabih', arabic: 'مشكاة المصابيح', subject: 'Hadith', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85', note: 'A major collection of prophetic narrations.' },
  { title: 'Al-Hidayah', arabic: 'الهداية', subject: 'Fiqh', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=85', note: 'A renowned Hanafi jurisprudence text.' },
  { title: 'Tafsir al-Jalalayn', arabic: 'تفسير الجلالين', subject: 'Tafsir', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85', note: 'A concise classical Qur’anic commentary.' },
  { title: 'Sharh al-Aqa’id', arabic: 'شرح العقائد', subject: 'Aqeedah', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=700&q=85', note: 'A classical text in Islamic creed.' },
  { title: 'Usul al-Shashi', arabic: 'أصول الشاشي', subject: 'Usul al-Fiqh', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=85', note: 'An introductory work in principles of jurisprudence.' },
  { title: 'Nur al-Anwar', arabic: 'نور الأنوار', subject: 'Usul al-Fiqh', image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=85', note: 'A classical text associated with legal theory.' },
];
const skillItems = [
  { icon: BookOpen, title: 'Quran Recitation' },
  { icon: LibraryBig, title: 'Arabic Language' },
  { icon: BookMarked, title: 'Islamic Studies' },
  { icon: Users, title: 'Teaching & Guidance' },
  { icon: Heart, title: 'Good Character' },
];
const navItems = ['Home', 'About', 'Education', 'Skills', 'Achievements', 'Projects', 'Study Quiz', 'Contact'];
type QuizQuestion = { question: string; options: string[]; answer: number; explanation: string };

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [activeBook, setActiveBook] = useState<number | null>(null);
  const [savedBooks, setSavedBooks] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem('zxh-saved-study-books');
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter((title): title is string => typeof title === 'string') : [];
    } catch { return []; }
  });
  const [bookFilter, setBookFilter] = useState<'all' | 'saved'>('all');
  const [activeAchievement, setActiveAchievement] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  const portfolioUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://mr-zulqarnain-portfolio.vercel.app/';

  async function sharePortfolio() {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Muhammad Zulqarnain | Islamic Student Portfolio', text: 'Explore my Islamic Student Portfolio.', url: portfolioUrl });
        setShareFeedback('Thanks for sharing!');
      } else {
        await navigator.clipboard.writeText(portfolioUrl);
        setShareFeedback('Portfolio link copied!');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setShareFeedback('Sharing is unavailable. Please copy the link instead.');
    }
  }

  async function copyPortfolioLink() {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setShareFeedback('Portfolio link copied!');
    } catch {
      setShareFeedback('Copy is unavailable in this browser.');
    }
  }

  function toggleSavedBook(title: string) {
    const next = savedBooks.includes(title)
      ? savedBooks.filter(savedTitle => savedTitle !== title)
      : [...savedBooks, title];
    window.localStorage.setItem('zxh-saved-study-books', JSON.stringify(next));
    setSavedBooks(next);
  }
  const visibleBooks = books.filter(book => bookFilter === 'all' || savedBooks.includes(book.title));
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' });
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState(false);
  const [quizMaterial, setQuizMaterial] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');

  async function generateStudyQuiz() {
    if (quizMaterial.trim().length < 40) {
      setQuizError('Please paste at least a short paragraph of study material (40 characters or more).');
      return;
    }
    setQuizLoading(true); setQuizError(''); setQuizSubmitted(false); setQuizAnswers({});
    try {
      const response = await fetch('/api/study-quiz', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material: quizMaterial.trim() })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Quiz generation failed.');
      if (!Array.isArray(payload.questions) || payload.questions.length < 3) throw new Error('The quiz response was invalid. Please try again.');
      setQuizQuestions(payload.questions);
    } catch (err) {
      setQuizError(err instanceof Error ? err.message : 'Quiz generation failed. Please try again.');
    } finally { setQuizLoading(false); }
  }
  const quizScore = quizQuestions.reduce((score, question, index) => score + (quizAnswers[index] === question.answer ? 1 : 0), 0);

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) { setFormError('Please add your name and message first.'); return; }
    setFormError('');
    const body = 'Assalamu Alaikum, I am ' + form.name + '.\nEmail: ' + form.email + '\nSubject: ' + form.subject + '\n\n' + form.message;
    window.open('https://wa.me/923047116587?text=' + encodeURIComponent(body), '_blank', 'noopener,noreferrer');
  }
  async function copyMessage() {
    const body = 'Assalamu Alaikum, I am ' + form.name + '.\nEmail: ' + form.email + '\nSubject: ' + form.subject + '\n\n' + form.message;
    try { await navigator.clipboard.writeText(body); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
    catch { setFormError('Copy is not available in this browser. Please use WhatsApp.'); }
  }

  return <div className={dark ? 'site dark' : 'site'}>

<header className="topbar">
  <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
    <span className="brand-emblem"><Landmark size={32} /></span>
    <span className="brand-copy">
      <strong>Islamic Student</strong>
      <strong>Portfolio</strong>
      <small>ZXH OFFICIAL</small>
    </span>
  </a>

  <button
    className="menu-toggle"
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label="Toggle navigation"
  >
    {menuOpen ? <X /> : <Menu />}
  </button>

  <nav className={menuOpen ? 'nav open' : 'nav'}>
    {navItems.map(item => (
      <a
        key={item}
        href={'#' + item.toLowerCase().replace(/ /g, '-')}
        onClick={() => setMenuOpen(false)}
      >
        {item}
      </a>
    ))}
  </nav>

  <button
    className="theme-toggle"
    onClick={() => setDark(!dark)}
    aria-label="Toggle colour theme"
  >
    {dark ? <Sun size={18} /> : <Moon size={18} />}
    <span>الحمدللہ</span>
  </button>
</header>

    <main>
      <section className="hero" id="home">
        <div className="hero-image"><img src={photos.hero} alt="Islamic student in white attire with a Qur’an at a mosque"/></div><div className="hero-wash"/>
        <div className="hero-copy">
          <p className="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className="welcome">☘ Assalamu Alaikum! <span>👋</span></p>
          <h1>I Am <em>Muhammad ZULQARNAIN</em></h1>
          <h2>An Islamic Student <span>From Jamia Tul Madina Fazany ZAKRIYA MULTAN</span></h2>
          <p className="hero-desc">Seeking Knowledge • Spreading Islam • Building a Better Ummah</p>
          <p className="hero-identity"><Sparkles size={15}/> Hafiz-ul-Qur’an • Dars-e-Nizami — 5th Year</p>
          <div className="social-row"><a href="#contact" aria-label="WhatsApp contact"><MessageCircle/></a><a href="#contact" aria-label="Telegram contact"><SendHorizonal/></a><a href="#projects" aria-label="Video projects"><Youtube/></a><a href="#contact" aria-label="Contact links"><Link2/></a></div>
          <div className="hero-actions"><a className="green-button" href="#about">Explore My Portfolio <ArrowRight size={17}/></a><a className="light-button" href="#education"><span className="play-dot">▶</span> Watch Intro</a><button type="button" className="portfolio-share-trigger" onClick={() => { setShareOpen(open => !open); setShareFeedback(''); }} aria-expanded={shareOpen}><Share2 size={16}/> Share Portfolio</button></div>
          {shareOpen && <div className="portfolio-share-panel" aria-label="Share portfolio"><div className="portfolio-qr-wrap"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=168x168&margin=8&data=${encodeURIComponent(portfolioUrl)}`} alt="QR code to open Muhammad Zulqarnain's portfolio" loading="lazy"/><small>SCAN TO VISIT</small></div><div className="portfolio-share-copy"><b>Share my portfolio</b><p>Send this link to friends, family or anyone interested in my learning journey.</p><div className="portfolio-share-actions"><button type="button" onClick={sharePortfolio}><Share2 size={15}/> Share</button><button type="button" onClick={copyPortfolioLink}><Copy size={15}/> Copy Link</button></div>{shareFeedback && <small className="portfolio-share-feedback" role="status">{shareFeedback}</small>}</div></div>
        </div>
        <div className="hero-arabic" lang="ar" dir="rtl">طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ<small>۞ ✦ ۞</small></div>
        <div className="hero-quote"><span>🕌</span><p>“Knowledge is the light<br/>that guides to success.”</p></div><div className="hero-wave"/>
      </section>

      <section className="about-section section-shell" id="about">
        <div className="about-photo"><img src={photos.madina} alt="Grand mosque with green domes and minarets"/><span>Jamia Tul Madina</span></div>
        <div className="about-copy">
          <p className="section-kicker">🕌 ABOUT ME</p><h2>About Me <span className="ornament">✧</span></h2>
          <h3>A Dedicated Student of Islamic Knowledge</h3>
          <p>I am <strong>Muhammad ZULQARNAIN</strong>, a student of Dars-e-Nizami at <strong>Jamia Tul Madina Faizan-e-Zakariya, Multan, Pakistan</strong>. I have completed Hifz-ul-Qur’an and am currently studying in the 5th year of the 8-year Dars-e-Nizami course.</p>
          <p>My goal is to seek authentic knowledge of Deen, follow the Qur’an and Sunnah, improve my character, and contribute positively to the Ummah with wisdom, sincerity and good manners.</p>
          <div className="fact-pills"><span><Building2/><b>Institution</b><small>Jamia Tul Madina</small></span><span><BookOpen/><b>Field</b><small>Dars-e-Nizami</small></span><span><ShieldCheck/><b>Goal</b><small>Serve Islam</small></span></div>
          <a className="green-button small-button" href="#education">Learn More <ArrowRight size={16}/></a>
        </div>
        <aside className="urdu-card" lang="ur" dir="rtl"><span>۞</span><p>علم حاصل کرنا<br/>اور اس پر عمل کرنا<br/>بھی کامیابی ہے۔</p><small>✦ ۞ ✦</small></aside>
      </section>

      <section className="feature-grid section-shell" id="education">
        <article className="feature-card education-card">
          <div className="card-heading"><span className="round-icon"><BookOpen/></span><div><h2>My Education</h2><p>Dars-e-Nizami Journey</p></div></div>
          <div className="education-content"><ul className="timeline-list"><li><b>Currently Studying</b><span>Dars-e-Nizami<br/>(Jamia Tul Madina)</span></li><li><b>Hifz Completed</b><span>Memorisation of the Holy Qur’an</span></li><li><b>Seeking More Knowledge</b><span>For a Better Tomorrow</span></li></ul><img src={photos.quran} alt="Open Quran on a wooden stand"/></div>
        </article>
        <article className="feature-card skills-card" id="skills"><div className="card-heading"><span className="round-icon"><ShieldCheck/></span><div><h2>My Skills</h2><p>Islamic & Personal Skills</p></div></div><div className="skill-icons">{skillItems.map(({icon:Icon,title})=><div key={title}><span><Icon/></span><b>{title}</b></div>)}</div></article>
        <article className="feature-card achievements-card" id="achievements"><div className="card-heading"><span className="round-icon trophy"><Trophy/></span><div><h2>Achievements</h2><p>My Milestones</p></div></div><ul className="achievement-list"><li><CheckCircle2/> Currently a Student of Jamia Tul Madina</li><li><CheckCircle2/> Learning Dars-e-Nizami with Passion</li><li><CheckCircle2/> Hifz-ul-Qur’an Completed — Alhamdulillah</li><li><CheckCircle2/> Serving the Deen through Knowledge</li></ul></article>
        <article className="feature-card projects-card" id="projects"><div className="card-heading"><span className="round-icon"><Laptop/></span><div><h2>My Projects</h2><p>Islamic & Useful Projects</p></div></div><div className="mini-projects">
          <div className="project-tile"><img src="https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=600&q=85" alt="Qur’an study guide"/><span className="project-icon"><BookOpen/></span><b>Quran Study Guide</b><small>(Concept)</small></div>
          <div className="project-tile"><img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=85" alt="Islamic resources hub"/><span className="project-icon"><Landmark/></span><b>Islamic Resources Hub</b><small>(Concept)</small></div>
          <div className="project-tile"><img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=85" alt="Dawah and education platform"/><span className="project-icon"><GraduationCap/></span><b>Dawah & Education Platform</b><small>(Concept)</small></div>
        </div></article>
      </section>

      <section className="achievement-showcase section-shell" id="achievement-showcase">
        <div className="achievement-showcase-heading">
          <div><p className="section-kicker">ALHAMDULILLAH · A JOURNEY OF LEARNING</p><h2>Milestones of <em>My Journey</em></h2><p>Every step in the pursuit of beneficial knowledge is a blessing and a responsibility.</p></div>
          <span className="achievement-seal"><Award size={30}/><small>الحمدللہ</small></span>
        </div>
        <div className="milestone-grid">
          <button type="button" className="milestone-card milestone-quran" onClick={() => setActiveAchievement('Hifz-ul-Qur’an Completed')}>
            <span className="milestone-icon"><BookOpenCheck size={25}/></span><small>QUR’AN</small><h3>Hifz-ul-Qur’an</h3><p>Completed memorisation of the Holy Qur’an</p><span className="milestone-link">View milestone <ArrowRight size={15}/></span>
          </button>
          <button type="button" className="milestone-card milestone-study" onClick={() => setActiveAchievement('Dars-e-Nizami — 5th Year')}>
            <span className="milestone-icon"><GraduationCap size={25}/></span><small>ISLAMIC STUDIES</small><h3>Dars-e-Nizami</h3><p>Currently continuing the 8-year course · 5th year</p><span className="milestone-link">View milestone <ArrowRight size={15}/></span>
          </button>
          <button type="button" className="milestone-card milestone-jamia" onClick={() => setActiveAchievement('Jamia Tul Madina')}>
            <span className="milestone-icon"><Landmark size={25}/></span><small>INSTITUTION</small><h3>Jamia Tul Madina</h3><p>Studying at Faizan-e-Zakariya, Multan, Pakistan</p><span className="milestone-link">View milestone <ArrowRight size={15}/></span>
          </button>
          <button type="button" className="milestone-card milestone-purpose" onClick={() => setActiveAchievement('Seeking Beneficial Knowledge')}>
            <span className="milestone-icon"><Medal size={25}/></span><small>PERSONAL MISSION</small><h3>Seeking Knowledge</h3><p>Striving to learn, improve character and serve the Ummah</p><span className="milestone-link">View milestone <ArrowRight size={15}/></span>
          </button>
        </div>
        {activeAchievement && <div className="milestone-modal-backdrop" onClick={() => setActiveAchievement(null)}>
          <div className="milestone-modal" role="dialog" aria-modal="true" aria-labelledby="milestone-modal-title" onClick={event => event.stopPropagation()}>
            <button type="button" className="milestone-modal-close" onClick={() => setActiveAchievement(null)} aria-label="Close details"><X size={19}/></button>
            <span className="achievement-seal"><Award size={27}/></span><p className="section-kicker">A PERSONAL MILESTONE</p><h3 id="milestone-modal-title">{activeAchievement}</h3>
            <p>Alhamdulillah. This milestone is part of an ongoing journey of Islamic learning, sincerity and personal growth. May Allah grant beneficial knowledge, steadfastness and the ability to act upon it.</p>
            <button type="button" className="green-button" onClick={() => setActiveAchievement(null)}>Close <Check size={16}/></button>
          </div>
        </div>}
      </section>

      <section className="library-section section-shell" id="library">
        <div className="library-banner"><div><p className="section-kicker">MY STUDY COLLECTION</p><h2>Amd Books <em>Library</em></h2><p>Classical Islamic books and study references for my Dars-e-Nizami learning journey.</p></div><img src={photos.library} alt="Islamic study book"/></div>
        <div className="library-controls" aria-label="Filter study books">
          <button type="button" className={bookFilter === 'all' ? 'library-filter active' : 'library-filter'} onClick={() => setBookFilter('all')}>All Books <span>{books.length}</span></button>
          <button type="button" className={bookFilter === 'saved' ? 'library-filter active' : 'library-filter'} onClick={() => setBookFilter('saved')}><BookmarkCheck size={15}/> Saved for Later <span>{savedBooks.length}</span></button>
        </div>
        <div className="book-grid">
          {visibleBooks.length > 0 ? visibleBooks.map(book => {
            const index = books.findIndex(item => item.title === book.title);
            const isSaved = savedBooks.includes(book.title);
            return <div className="book-card-wrap" key={book.title}>
              <button className={activeBook===index?'book-card active':'book-card'} onClick={()=>setActiveBook(activeBook===index?null:index)} aria-expanded={activeBook===index}>
                <img className="book-cover" src={book.image} alt={'Book cover illustration for '+book.title}/>
                <span className="book-arabic" lang="ar">{book.arabic}</span><b>{book.title}</b><small>{book.subject}</small>
                <p>{activeBook===index?book.note:'Tap to view details'}</p>
              </button>
              <button type="button" className={isSaved ? 'book-save-button saved' : 'book-save-button'} onClick={() => toggleSavedBook(book.title)} aria-label={isSaved ? 'Remove '+book.title+' from saved books' : 'Save '+book.title+' for later'} title={isSaved ? 'Remove from saved books' : 'Save for later'}>
                {isSaved ? <BookmarkCheck size={18}/> : <Bookmark size={18}/>}
              </button>
            </div>;
          }) : <div className="library-empty"><Bookmark size={25}/><b>No saved books yet</b><p>Tap the bookmark on any book to keep it here for later.</p></div>}
        </div>
        <p className="library-note">The listed titles are illustrative study references, not a confirmed official fifth-year syllabus. The exact kitab list may vary by institution and academic year.</p>
      </section>

      <section className="study-quiz section-shell" id="study-quiz">
        <div className="quiz-heading"><span className="quiz-emblem"><BrainCircuit/></span><div><p className="section-kicker">SMART ISLAMIC LEARNING</p><h2>AI Study Quiz <em>& Feedback</em></h2><p>Paste your lesson, notes or a short passage from your study material. The AI will create a quiz and explain your answers.</p></div></div>
        <div className="quiz-workspace">
          <div className="quiz-input-panel"><label htmlFor="quiz-material">Your study material</label><textarea id="quiz-material" rows={8} value={quizMaterial} onChange={e=>setQuizMaterial(e.target.value)} placeholder="Paste a paragraph from your lesson, notes, Hadith, Fiqh, Tafsir or Arabic study material..."/><div className="quiz-input-footer"><small>{quizMaterial.length} characters · Minimum 40</small><button className="green-button" type="button" onClick={generateStudyQuiz} disabled={quizLoading}>{quizLoading?'Creating quiz…':<><Sparkles size={16}/> Generate Quiz <ArrowRight size={16}/></>}</button></div>{quizError&&<p className="quiz-error" role="alert">{quizError}</p>}</div>
          <div className="quiz-result-panel">{quizQuestions.length===0?<div className="quiz-empty"><CircleHelp/><h3>Your quiz will appear here</h3><p>AI-generated multiple-choice questions with instant scoring and explanations.</p><span>✦ Learn · Practice · Improve ✦</span></div>:<>
            <div className="quiz-result-title"><div><span>YOUR PRACTICE SET</span><h3>{quizQuestions.length} Questions</h3></div><button type="button" className="quiz-reset" onClick={()=>{setQuizQuestions([]);setQuizAnswers({});setQuizSubmitted(false);}} aria-label="Clear quiz"><RotateCcw/></button></div>
            {quizQuestions.map((question,index)=><article className="quiz-question" key={index}><b>{String(index+1).padStart(2,'0')} / {quizQuestions.length}</b><h4>{question.question}</h4><div className="quiz-options">{question.options.map((option,optionIndex)=><button type="button" key={optionIndex} disabled={quizSubmitted} className={quizSubmitted?(optionIndex===question.answer?'correct':quizAnswers[index]===optionIndex?'incorrect':''):quizAnswers[index]===optionIndex?'selected':''} onClick={()=>setQuizAnswers(current=>({...current,[index]:optionIndex}))}><span>{String.fromCharCode(65+optionIndex)}</span>{option}{quizSubmitted&&optionIndex===question.answer&&<Check size={16}/>}</button>)}</div>{quizSubmitted&&<p className="quiz-explanation"><strong>{quizAnswers[index]===question.answer?'Correct!':'Review this:'}</strong> {question.explanation}</p>}</article>)}
            <div className="quiz-submit-row">{quizSubmitted?<><strong className="quiz-score">Your score: {quizScore} / {quizQuestions.length}</strong><button className="green-button" type="button" onClick={()=>{setQuizAnswers({});setQuizSubmitted(false);}}>Try Again <RotateCcw size={15}/></button></>:<button className="green-button" type="button" disabled={Object.keys(quizAnswers).length!==quizQuestions.length} onClick={()=>setQuizSubmitted(true)}>Check My Answers <Check size={16}/></button>}</div>
          </>}</div>
        </div>
        <p className="quiz-disclaimer">Study support only. Always verify religious rulings and scholarly references with qualified teachers and your course texts.</p>
      </section>

      <section className="contact-section section-shell" id="contact">
        <div><p className="section-kicker">CONNECT WITH ME</p><h2>Let’s connect with <em>good intentions.</em></h2><p>For Islamic resources, learning collaboration, respectful discussion or a general enquiry.</p><p className="contact-address"><Landmark/> Jamia Tul Madina Faizan-e-Zakariya<br/>Multan, Pakistan</p></div>
        <form className="contact-form" onSubmit={submitContact}>
          <label>Your name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter your name" required/></label>
          <label>Email (optional)<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
          <label>Subject<select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}><option>General enquiry</option><option>Islamic books & resources</option><option>Learning collaboration</option><option>Website feedback</option></select></label>
          <label>Your message<textarea rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Write your message..." required/></label>
          {formError&&<p className="form-error">{formError}</p>}
          <div className="form-actions"><button className="green-button" type="submit">Send via WhatsApp <Send size={16}/></button><button type="button" className="copy-button" onClick={copyMessage}>{copied?'Copied ✓':'Copy message'}</button></div>
          <small>Your message opens in WhatsApp for you to choose a recipient. It is not sent automatically.</small>
        </form>
      </section>
    </main>
    <footer className="footer">
      <div className="footer-main section-shell"><div className="footer-brand"><span className="footer-mosque-logo"><img src={photos.madina} alt="Mosque artwork"/></span><div><h2>Islamic Student<br/>Portfolio</h2><small>ZXH OFFICIAL</small></div></div><p>“May Allah accept our knowledge,<br/>our efforts and make us among the righteous.”</p><div className="footer-social"><b>Connect With Me</b><a href="#contact"><MessageCircle/></a><a href="#contact"><SendHorizonal/></a><a href="#projects"><Youtube/></a><a href="#contact"><Link2/></a></div></div>
      <div className="footer-bottom"><span>👑 Powered by ZXH OFFICIAL</span><span>Created by <b>ZULQARNAIN X HAIDER</b></span><span>Jamia Tul Madina · Dars-e-Nizami</span><span>© {new Date().getFullYear()} All Rights Reserved. ♥</span></div>
    </footer>
  </div>;
}
export default App;
