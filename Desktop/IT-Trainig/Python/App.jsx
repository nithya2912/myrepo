
import { useEffect, useState } from "react";
import "./index.css";

const lessons = [
  {
    id: 1,
    level: "Beginner",
    title: "Introduce yourself",
    tamil: "உங்களை அறிமுகப்படுத்துவது",
    description: "Learn to tell people your name and where you live.",
    sentences: [
      ["My name is Nithya.", "என் பெயர் நித்யா."],
      ["I am from Tamil Nadu.", "நான் தமிழ்நாட்டைச் சேர்ந்தவள்."],
      ["I am learning English.", "நான் ஆங்கிலம் கற்றுக்கொண்டு இருக்கிறேன்."],
    ],
  },
  {
    id: 2,
    level: "Beginner",
    title: "Everyday sentences",
    tamil: "அன்றாட வாக்கியங்கள்",
    description: "Use simple English in daily conversations.",
    sentences: [
      ["How are you?", "நீங்கள் எப்படி இருக்கிறீர்கள்?"],
      ["I am fine, thank you.", "நான் நன்றாக இருக்கிறேன், நன்றி."],
      ["Could you help me?", "நீங்கள் எனக்கு உதவ முடியுமா?"],
    ],
  },
  {
    id: 3,
    level: "Elementary",
    title: "Simple present tense",
    tamil: "நிகழ்கால வாக்கியங்கள்",
    description: "Talk about habits and regular activities.",
    sentences: [
      ["I go to work every day.", "நான் தினமும் வேலைக்குச் செல்கிறேன்."],
      ["She studies English.", "அவள் ஆங்கிலம் படிக்கிறாள்."],
      ["They play cricket.", "அவர்கள் கிரிக்கெட் விளையாடுகிறார்கள்."],
    ],
  },
  {
    id: 4,
    level: "Elementary",
    title: "At a job interview",
    tamil: "வேலை நேர்காணலில்",
    description: "Practise introducing yourself to an interviewer.",
    sentences: [
      ["I am a quick learner.", "நான் விரைவாகக் கற்றுக்கொள்வேன்."],
      ["I am willing to learn new skills.", "புதிய திறன்களைக் கற்கத் தயாராக இருக்கிறேன்."],
      ["Thank you for this opportunity.", "இந்த வாய்ப்புக்கு நன்றி."],
    ],
  },
];

const words = [
  { word: "Confident", tamil: "தன்னம்பிக்கையுடன்", example: "I feel confident today." },
  { word: "Improve", tamil: "மேம்படுத்து", example: "I want to improve my English." },
  { word: "Opportunity", tamil: "வாய்ப்பு", example: "Thank you for this opportunity." },
  { word: "Practice", tamil: "பயிற்சி", example: "I practise English every day." },
  { word: "Usually", tamil: "வழக்கமாக", example: "I usually wake up early." },
  { word: "Achieve", tamil: "சாதித்தல்", example: "I want to achieve my goal." },
];

const questions = [
  {
    question: 'Choose the correct sentence.',
    options: ["I is happy.", "I am happy.", "I are happy."],
    answer: 1,
    explanation: 'Use "am" with "I": I am happy.',
  },
  {
    question: 'Fill in the blank: She ___ to school every day.',
    options: ["go", "going", "goes"],
    answer: 2,
    explanation: 'With "he", "she", or "it", use "goes" in the simple present.',
  },
  {
    question: 'What is the English meaning of "நன்றி"?',
    options: ["Sorry", "Thank you", "Welcome"],
    answer: 1,
    explanation: '"நன்றி" means "Thank you".',
  },
  {
    question: "Choose the correct past-tense sentence.",
    options: ["I visited my friend yesterday.", "I visit my friend yesterday.", "I visiting my friend yesterday."],
    answer: 0,
    explanation: '"Yesterday" refers to the past. The past tense of "visit" is "visited".',
  },
  {
    question: "Choose the polite request.",
    options: ["Give me water now!", "Water me!", "Could I have some water, please?"],
    answer: 2,
    explanation: '"Could I have some water, please?" is a polite request.',
  },
];

const navItems = [
  ["dashboard", "⌂", "Dashboard"],
  ["lessons", "▤", "Lessons"],
  ["vocabulary", "Aa", "Vocabulary"],
  ["quiz", "✓", "Quiz"],
  ["speaking", "◖", "Speaking"],
];

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem("speaksmart-progress")) || {
      completed: [],
      learnedWords: [],
      bestScore: 0,
    };
  } catch {
    return { completed: [], learnedWords: [], bestScore: 0 };
  }
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [progress, setProgress] = useState(readProgress);
  const [lessonId, setLessonId] = useState(1);
  const [wordIndex, setWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [listening, setListening] = useState(false);
  const [dark, setDark] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("speaksmart-progress", JSON.stringify(progress));
  }, [progress]);

  const currentLesson = lessons.find((lesson) => lesson.id === lessonId) || lessons[0];
  const currentWord = words[wordIndex];
  const currentQuestion = questions[quizIndex];

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function completeLesson(id) {
    setProgress((old) => ({
      ...old,
      completed: old.completed.includes(id) ? old.completed : [...old.completed, id],
    }));
    notify("Lesson progress saved!");
  }

  function markWordLearned(word) {
    setProgress((old) => ({
      ...old,
      learnedWords: old.learnedWords.includes(word)
        ? old.learnedWords.filter((item) => item !== word)
        : [...old.learnedWords, word],
    }));
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      notify("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify("Speech recognition is unavailable. Please type your sentence below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      setSpeechText(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
      notify("Could not recognise speech. Please try again or type your answer.");
    };
    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch {
      setListening(false);
      notify("Microphone could not start. Please try again.");
    }
  }

  function chooseAnswer(index) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === currentQuestion.answer) setScore((old) => old + 1);
  }

  function nextQuestion() {
    if (quizIndex < questions.length - 1) {
      setQuizIndex((old) => old + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = score;
      setQuizFinished(true);
      setProgress((old) => ({ ...old, bestScore: Math.max(old.bestScore, finalScore) }));
    }
  }

  function restartQuiz() {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }

  const completedPercent = Math.round((progress.completed.length / lessons.length) * 100);

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <strong>SpeakSmart</strong>
            <small>Learn a little every day</small>
          </div>
        </div>

        <p className="menu-label">LEARNING MENU</p>
        <nav>
          {navItems.map(([id, icon, label]) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="daily-goal">
            <span>✦ Daily reminder</span>
            <p>Small steps lead to big progress.</p>
          </div>
          <button className="nav-item" onClick={() => setDark((old) => !old)}>
            <span className="nav-icon">{dark ? "☀" : "☾"}</span>
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR ENGLISH JOURNEY</p>
            <h1>{navItems.find((item) => item[0] === page)?.[2] || "Dashboard"}</h1>
          </div>
          <div className="user-chip">
            <div className="avatar">N</div>
            <div><strong>Learner</strong><small>Beginner level</small></div>
          </div>
        </header>

        {notice && <div className="notice" role="status">{notice}</div>}

        {page === "dashboard" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="pill">✦ YOUR NEXT CHAPTER STARTS HERE</span>
                <h2>Every word brings you<br />one step closer.</h2>
                <p>Learn practical English, practise speaking, and grow your confidence every day.</p>
                <button className="primary-btn" onClick={() => setPage("lessons")}>
                  Continue learning <span>→</span>
                </button>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orbit orbit-one"></div>
                <div className="orbit orbit-two"></div>
                <div className="book-art">Aa</div>
                <span className="float-word word-one">Hello!</span>
                <span className="float-word word-two">You can do it.</span>
                <span className="spark">✦</span>
              </div>
            </section>

            <section className="stats-grid">
              <Stat icon="▤" label="Lessons completed" value={`${progress.completed.length}/${lessons.length}`} />
              <Stat icon="Aa" label="Words learned" value={progress.learnedWords.length} />
              <Stat icon="✓" label="Best quiz score" value={`${progress.bestScore}/${questions.length}`} />
            </section>

            <section className="section-block">
              <div className="section-heading">
                <div><h2>Your learning path</h2><p>Keep going. You are making progress.</p></div>
                <span className="percent">{completedPercent}% complete</span>
              </div>
              <div className="progress-track"><div style={{ width: `${completedPercent}%` }} /></div>
              <div className="lesson-grid">
                {lessons.slice(0, 3).map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    completed={progress.completed.includes(lesson.id)}
                    onClick={() => { setLessonId(lesson.id); setPage("lessons"); }}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {page === "lessons" && (
          <section className="content-card">
            <div className="section-heading">
              <div><h2>Learn English step by step</h2><p>English sentences with simple Tamil meanings.</p></div>
              <span className="pill">{currentLesson.level}</span>
            </div>
            <div className="lesson-layout">
              <div className="lesson-list">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className={`lesson-select ${lessonId === lesson.id ? "selected" : ""}`}
                    onClick={() => setLessonId(lesson.id)}
                  >
                    <span>{progress.completed.includes(lesson.id) ? "✓" : lesson.id}</span>
                    <div><strong>{lesson.title}</strong><small>{lesson.level}</small></div>
                  </button>
                ))}
              </div>
              <article className="lesson-detail">
                <span className="pill">{currentLesson.tamil}</span>
                <h2>{currentLesson.title}</h2>
                <p>{currentLesson.description}</p>
                <div className="sentence-list">
                  {currentLesson.sentences.map(([english, tamil]) => (
                    <div className="sentence" key={english}>
                      <div><strong>{english}</strong><p>{tamil}</p></div>
                      <button className="icon-btn" onClick={() => speak(english)} aria-label={`Listen to ${english}`}>🔊</button>
                    </div>
                  ))}
                </div>
                <button className="primary-btn" onClick={() => completeLesson(currentLesson.id)}>
                  {progress.completed.includes(currentLesson.id) ? "Completed ✓" : "Mark lesson complete"}
                </button>
              </article>
            </div>
          </section>
        )}

        {page === "vocabulary" && (
          <section className="content-card vocab-page">
            <span className="pill">DAILY VOCABULARY</span>
            <h2>Build your word power</h2>
            <p>Learn useful English words with Tamil meanings and example sentences.</p>
            <div className="flashcard">
              <span className="eyebrow">WORD {wordIndex + 1} OF {words.length}</span>
              <h2>{currentWord.word}</h2>
              {showMeaning ? (
                <div className="meaning">
                  <h3>{currentWord.tamil}</h3>
                  <p>{currentWord.example}</p>
                  <button className="icon-btn" onClick={() => speak(currentWord.example)}>🔊 Listen to example</button>
                </div>
              ) : <p>Think of the meaning, then reveal the answer.</p>}
              <button className="primary-btn" onClick={() => setShowMeaning((old) => !old)}>
                {showMeaning ? "Hide meaning" : "Reveal Tamil meaning"}
              </button>
              <button
                className={`secondary-btn ${progress.learnedWords.includes(currentWord.word) ? "learned" : ""}`}
                onClick={() => markWordLearned(currentWord.word)}
              >
                {progress.learnedWords.includes(currentWord.word) ? "✓ Learned" : "Mark as learned"}
              </button>
              <div className="flashcard-controls">
                <button className="secondary-btn" onClick={() => { setWordIndex((old) => (old - 1 + words.length) % words.length); setShowMeaning(false); }}>← Previous</button>
                <button className="secondary-btn" onClick={() => { setWordIndex((old) => (old + 1) % words.length); setShowMeaning(false); }}>Next →</button>
              </div>
            </div>
          </section>
        )}

        {page === "quiz" && (
          <section className="content-card quiz-page">
            <span className="pill">QUICK KNOWLEDGE CHECK</span>
            <h2>Test your English</h2>
            {quizFinished ? (
              <div className="result-box">
                <div className="result-icon">{score >= 4 ? "🏆" : "🌱"}</div>
                <h2>You scored {score} out of {questions.length}</h2>
                <p>{score >= 4 ? "Excellent work! Keep practising." : "Good start! Review the lessons and try again."}</p>
                <button className="primary-btn" onClick={restartQuiz}>Try again</button>
              </div>
            ) : (
              <div className="quiz-box">
                <div className="quiz-meta"><span>Question {quizIndex + 1} of {questions.length}</span><span>Score: {score}</span></div>
                <div className="progress-track"><div style={{ width: `${((quizIndex + 1) / questions.length) * 100}%` }} /></div>
                <h3>{currentQuestion.question}</h3>
                <div className="answer-list">
                  {currentQuestion.options.map((option, index) => {
                    let state = "";
                    if (selectedAnswer !== null && index === currentQuestion.answer) state = "correct";
                    else if (selectedAnswer === index) state = "incorrect";
                    return (
                      <button key={option} className={`answer-option ${state}`} onClick={() => chooseAnswer(index)} disabled={selectedAnswer !== null}>
                        <span>{String.fromCharCode(65 + index)}</span>{option}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <div className="explanation" role="status">
                    <strong>{selectedAnswer === currentQuestion.answer ? "Correct! ✓" : "Not quite — let's learn."}</strong>
                    <p>{currentQuestion.explanation}</p>
                    <button className="primary-btn" onClick={nextQuestion}>
                      {quizIndex === questions.length - 1 ? "See results" : "Next question →"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {page === "speaking" && (
          <section className="content-card speaking-page">
            <span className="pill">SPEAKING PRACTICE</span>
            <h2>Speak a little every day</h2>
            <p>Read the sentence, listen to it, and practise saying it aloud.</p>
            <div className="speaking-prompt">
              <div className="mic-circle">🎙</div>
              <span className="eyebrow">TODAY'S PRACTICE</span>
              <h2>Tell me about yourself.</h2>
              <p>Hello! My name is Nithya. I am from Tamil Nadu. I am learning English.</p>
              <button className="secondary-btn" onClick={() => speak("Hello! My name is Nithya. I am from Tamil Nadu. I am learning English.")}>🔊 Listen to example</button>
              <button className="primary-btn" onClick={startListening} disabled={listening}>
                {listening ? "Listening... Speak now" : "🎙 Start speaking"}
              </button>
              <label className="field-label" htmlFor="speech-answer">Or type your practice sentence</label>
              <textarea id="speech-answer" value={speechText} onChange={(event) => setSpeechText(event.target.value)} placeholder="Type what you want to practise..." />
              <p className="helper-text">Microphone support depends on your browser and permissions. Typed practice is always available.</p>
              {speechText.trim() && (
                <div className="explanation">
                  <strong>Your practice text</strong>
                  <p>{speechText}</p>
                  <button className="secondary-btn" onClick={() => speak(speechText)}>Listen to my text</button>
                </div>
              )}
            </div>
          </section>
        )}

        <footer>SpeakSmart · Learn at your own pace · Practice makes progress</footer>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div><p>{label}</p><h2>{value}</h2></div>
    </div>
  );
}

function LessonCard({ lesson, completed, onClick }) {
  return (
    <button className="lesson-card" onClick={onClick}>
      <div className="lesson-card-top"><span className="pill">{lesson.level}</span><span>{completed ? "✓" : "→"}</span></div>
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <span className="card-link">{completed ? "Review lesson" : "Start lesson"} →</span>
    </button>
  );
}
