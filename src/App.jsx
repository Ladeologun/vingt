import React, { useEffect, useState } from 'react';

import { Icon } from './components/Icon.jsx';
import { Journal } from './components/Journal.jsx';
import { Quiz } from './components/Quiz.jsx';
import { VerbCard } from './components/VerbCard.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import {
    getDayKey,
    getLessonNumber,
    getDailyVerbs,
    getShuffledVerbs,
    readProgress,
    writeProgress,
} from './learning.js';
import { verbs } from './verbs.js';

const getBrowserStorage = () => window.localStorage;

export const App = () => {
    const [today, setToday] = useState(getDayKey());
    const [initialProgress] = useState(() =>
        readProgress({ getStorage: getBrowserStorage, today: getDayKey() }),
    );
    const [progress, setProgress] = useState(initialProgress.progress);
    const [activeTab, setActiveTab] = useState('today');
    const [areMeaningsHidden, setAreMeaningsHidden] = useState(false);
    const [revealedVerbIDs, setRevealedVerbIDs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [notice, setNotice] = useState(() => {
        if (initialProgress.success) {
            return '';
        }

        switch (initialProgress.error) {
            case 'invalid-progress':
                return 'Saved progress could not be read. A fresh study journal is ready.';
            case 'storage-unavailable':
                return 'Your browser could not load progress. Keep this tab open to continue.';
        }
    });

    const isQuizOpen = quiz !== null;

    useEffect(() => {
        const result = writeProgress({ getStorage: getBrowserStorage, progress });

        if (!result.success) {
            setNotice('Your browser could not save progress. Keep this tab open to continue.');
        }
    }, [progress]);

    useEffect(() => {
        const timer = setInterval(() => setToday(getDayKey()), 15000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setQuiz(null);
        setRevealedVerbIDs([]);
    }, [today]);

    useEffect(() => {
        if (!isQuizOpen) {
            return;
        }

        const handleEscape = event => {
            if (event.key === 'Escape') {
                setQuiz(null);
            }
        };
        const previousOverflow = document.body.style.overflow;
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [isQuizOpen]);

    const updateDayProgress = patch => {
        setProgress(progress => ({
            ...progress,
            days: { ...progress.days, [today]: { learned: [], ...progress.days[today], ...patch } },
        }));
    };

    const toggleLearnedVerb = id => {
        updateDayProgress({
            learned: learnedVerbIDs.includes(id)
                ? learnedVerbIDs.filter(learnedID => learnedID !== id)
                : [...learnedVerbIDs, id],
        });
    };

    const pronounceVerb = verb => {
        if (!('speechSynthesis' in window)) {
            setNotice(
                'Audio is unavailable in this browser. Use the pronunciation guide below each verb.',
            );

            return;
        }

        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(verb);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.8;
        const frenchVoice = speechSynthesis.getVoices().find(voice => voice.lang.startsWith('fr'));

        if (frenchVoice) {
            utterance.voice = frenchVoice;
        }

        utterance.onerror = () =>
            setNotice('Audio could not play. Check your device’s speech voices and try again.');
        speechSynthesis.speak(utterance);
    };

    const startQuiz = (list = dailyLesson) => {
        if (list.length === 0) {
            return;
        }

        setQuiz({
            list: getShuffledVerbs({ verbs: list }),
            index: 0,
            selected: null,
            missed: [],
            score: 0,
            done: false,
        });
    };

    const handleAnswer = id => {
        setQuiz(currentQuiz => {
            if (currentQuiz === null || currentQuiz.done || currentQuiz.selected !== null) {
                return currentQuiz;
            }

            const isCorrect = id === currentQuiz.list[currentQuiz.index].id;

            return {
                ...currentQuiz,
                selected: id,
                score: currentQuiz.score + (isCorrect ? 1 : 0),
                missed: isCorrect
                    ? currentQuiz.missed
                    : [...currentQuiz.missed, currentQuiz.list[currentQuiz.index]],
            };
        });
    };

    const handleNextQuestion = () => {
        if (quiz === null || quiz.done || quiz.selected === null) {
            return;
        }

        if (quiz.index + 1 === quiz.list.length) {
            updateDayProgress({
                quiz: {
                    score: quiz.score,
                    total: quiz.list.length,
                    missed: quiz.missed.map(verb => verb.id),
                },
            });
            setQuiz({ ...quiz, done: true });
        } else {
            setQuiz({ ...quiz, index: quiz.index + 1, selected: null });
        }
    };

    const lessonIndex = getLessonNumber(progress.start, today);
    const dailyLesson = getDailyVerbs(verbs, lessonIndex);
    const todayProgress = progress.days[today] ?? { learned: [] };
    const learnedVerbIDs = todayProgress.learned;
    const allLearnedVerbIDs = new Set(
        Object.values(progress.days).flatMap(dayProgress => dayProgress.learned),
    );
    const visibleVerbs =
        activeTab === 'library'
            ? verbs.filter(verb =>
                  `${verb.fr} ${verb.en}`.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : dailyLesson;

    return (
        <div className="app">
            <aside className="sidebar">
                <a
                    className="brand"
                    href="#"
                    onClick={event => {
                        event.preventDefault();
                        setActiveTab('today');
                    }}
                >
                    <span className="brand-icon">
                        <Icon name="book" size={24} />
                    </span>
                    vingt<span className="brand-dot">.</span>
                </a>
                <div className="tagline">YOUR DAILY FRENCH JOURNAL</div>
                <div className="nav-label">YOUR LEARNING SPACE</div>
                <nav>
                    {[
                        ['today', 'book', 'Today’s lesson'],
                        ['library', 'grid', 'Verb library'],
                        ['progress', 'chart', 'My progress'],
                    ].map(([key, icon, label]) => (
                        <button
                            key={key}
                            className={activeTab === key ? 'active' : ''}
                            onClick={() => setActiveTab(key)}
                        >
                            <Icon name={icon} />
                            {label}
                            {key === 'today' && <span className="nav-count">20</span>}
                        </button>
                    ))}
                </nav>
                <div className="sidebar-note">
                    <span className="tiny-flower">✳</span>
                    <p>
                        Little by little,
                        <br />
                        <em>you’ll speak French.</em>
                    </p>
                    <span>
                        One day. Twenty verbs.
                        <br />A world of possibilities.
                    </span>
                </div>
                <div className="profile">
                    <div className="avatar">B</div>
                    <div>
                        <strong>Bonjour, learner</strong>
                        <span>Your French journey starts here</span>
                    </div>
                </div>
            </aside>
            <div className="workspace">
                <header>
                    <span>
                        <span className="header-dot" /> A little French, every day.
                    </span>
                    <div className="header-right">
                        <ThemeToggle />
                        <span className="day-pill">
                            <Icon name="leaf" size={15} /> Day {lessonIndex + 1} of your journey
                        </span>
                        <span className="small-avatar">B</span>
                    </div>
                </header>
                <main>
                    {!!notice && (
                        <div className="notice" role="status">
                            {notice}
                            <button aria-label="Dismiss message" onClick={() => setNotice('')}>
                                <Icon name="close" size={16} />
                            </button>
                        </div>
                    )}
                    {activeTab === 'today' ? (
                        <>
                            <div className="page-kicker">
                                {new Date(today + 'T12:00:00').toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                                <span>LESSON {String((lessonIndex % 5) + 1).padStart(2, '0')}</span>
                            </div>
                            <section className="welcome">
                                <div>
                                    <h1>
                                        Un peu de français.
                                        <br />
                                        <em>A little more you.</em>
                                    </h1>
                                    <p>
                                        Twenty verbs today. A little more confidence tomorrow.
                                        <br />
                                        Let’s make French part of your everyday.
                                    </p>
                                    <div className="hero-meta">
                                        <span>
                                            <Icon name="book" size={16} /> 20 essential verbs
                                        </span>
                                        <i />
                                        <span>About 15 minutes</span>
                                    </div>
                                </div>
                                <Journal />
                            </section>
                            <section className="lesson-progress">
                                <div className="progress-icon">
                                    <Icon name="leaf" size={23} />
                                </div>
                                <div className="progress-copy">
                                    <div>
                                        <strong>Your daily intention</strong>
                                        <span>
                                            {learnedVerbIDs.length}{' '}
                                            <span className="muted">/ 20 verbs learned</span>
                                        </span>
                                    </div>
                                    <div className="track">
                                        <span style={{ width: learnedVerbIDs.length * 5 + '%' }} />
                                    </div>
                                    <p>
                                        {learnedVerbIDs.length === 20
                                            ? 'Beautiful work. Put your knowledge to the test below.'
                                            : 'Take your time. Listen, read, and mark the verbs you know.'}
                                    </p>
                                </div>
                                <span className="progress-percent">
                                    {learnedVerbIDs.length * 5}%
                                </span>
                            </section>
                            <div className="section-heading">
                                <div>
                                    <h2>
                                        Today’s twenty <span>LES VERBES DU JOUR</span>
                                    </h2>
                                    <p>Small words. Endless possibilities.</p>
                                </div>
                                <button
                                    className={
                                        'quiet-button ' + (areMeaningsHidden ? 'selected' : '')
                                    }
                                    onClick={() => {
                                        setAreMeaningsHidden(!areMeaningsHidden);
                                        setRevealedVerbIDs([]);
                                    }}
                                >
                                    <Icon name="eye" size={17} />
                                    {areMeaningsHidden ? 'Show meanings' : 'Hide meanings'}
                                </button>
                            </div>
                        </>
                    ) : activeTab === 'library' ? (
                        <>
                            <div className="page-kicker">YOUR PERSONAL DICTIONARY</div>
                            <h1>
                                The verb library<span className="green">.</span>
                            </h1>
                            <p className="intro">One hundred everyday verbs, ready when you are.</p>
                            <div className="library-info">
                                5 daily sets of 20 verbs. After day five, revisit the collection to
                                strengthen your memory.
                            </div>
                            <label className="search">
                                <Icon name="search" />
                                <input
                                    aria-label="Search French verbs or English meanings"
                                    placeholder="Find a French verb or English meaning…"
                                    value={searchQuery}
                                    onChange={event => setSearchQuery(event.target.value)}
                                />
                                <span>{visibleVerbs.length} verbs</span>
                            </label>
                        </>
                    ) : (
                        <>
                            <div className="page-kicker">LOOK HOW FAR YOU’VE COME</div>
                            <h1>
                                Every little step counts<span className="green">.</span>
                            </h1>
                            <p className="intro">Your French journey, one verb at a time.</p>
                            <div className="stats">
                                {[
                                    [allLearnedVerbIDs.size, 'Unique verbs marked learned'],
                                    [
                                        Object.keys(progress.days).filter(
                                            dateKey =>
                                                progress.days[dateKey].learned.length > 0 ||
                                                progress.days[dateKey].quiz,
                                        ).length,
                                        'Days practiced',
                                    ],
                                    [
                                        Object.values(progress.days).filter(
                                            dayProgress => !!dayProgress.quiz,
                                        ).length,
                                        'Days with a completed quiz',
                                    ],
                                ].map(([value, label]) => (
                                    <div key={label}>
                                        <Icon name="leaf" />
                                        <strong>{value}</strong>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                            <h2>Your study journal</h2>
                            <div className="history">
                                {Object.keys(progress.days).length > 0 ? (
                                    Object.entries(progress.days)
                                        .sort(([a], [b]) => b.localeCompare(a))
                                        .map(([date, dayProgress]) => (
                                            <div key={date}>
                                                <span>
                                                    {new Date(
                                                        date + 'T12:00:00',
                                                    ).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <span>
                                                    {dayProgress.learned.length} / 20 learned
                                                </span>
                                                <strong>
                                                    {dayProgress.quiz
                                                        ? `Quiz: ${dayProgress.quiz.score} / ${dayProgress.quiz.total}`
                                                        : 'Quiz to come'}
                                                </strong>
                                            </div>
                                        ))
                                ) : (
                                    <div>
                                        Your journal is waiting for its first word. Start today’s
                                        lesson.
                                    </div>
                                )}
                            </div>
                            <button className="primary" onClick={() => setActiveTab('today')}>
                                Back to today’s verbs <Icon name="arrow" />
                            </button>
                        </>
                    )}
                    {activeTab !== 'progress' && (
                        <>
                            <div className="verb-grid">
                                {visibleVerbs.map((verb, index) => (
                                    <VerbCard
                                        key={verb.id}
                                        verb={verb}
                                        number={activeTab === 'today' ? index + 1 : verb.id + 1}
                                        isLearned={learnedVerbIDs.includes(verb.id)}
                                        isMeaningHidden={
                                            areMeaningsHidden &&
                                            activeTab === 'today' &&
                                            !revealedVerbIDs.includes(verb.id)
                                        }
                                        canMarkLearned={
                                            activeTab === 'today' ||
                                            dailyLesson.some(dailyVerb => dailyVerb.id === verb.id)
                                        }
                                        onPronounce={() => pronounceVerb(verb.fr)}
                                        onReveal={() =>
                                            setRevealedVerbIDs(currentIDs => [
                                                ...currentIDs,
                                                verb.id,
                                            ])
                                        }
                                        onToggleLearned={() => toggleLearnedVerb(verb.id)}
                                    />
                                ))}
                            </div>
                            {visibleVerbs.length === 0 && (
                                <p className="empty">
                                    No verbs found. Try another French word or English meaning.
                                </p>
                            )}
                            {activeTab === 'today' && (
                                <section className="practice-banner">
                                    <span className="practice-symbol">
                                        <Icon name="spark" size={34} />
                                    </span>
                                    <div>
                                        <span className="eyebrow">
                                            A LITTLE PRACTICE GOES A LONG WAY
                                        </span>
                                        <h2>Ready to make them stick?</h2>
                                        <p>
                                            Match today’s verbs to their meanings. See what you
                                            remember.
                                        </p>
                                        {!!todayProgress.quiz && (
                                            <span className="last-score">
                                                Last practice: {todayProgress.quiz.score} /{' '}
                                                {todayProgress.quiz.total} correct
                                            </span>
                                        )}
                                    </div>
                                    <button className="primary" onClick={() => startQuiz()}>
                                        Let’s practice <Icon name="arrow" size={18} />
                                    </button>
                                </section>
                            )}
                        </>
                    )}
                    <footer>
                        <span>
                            vingt. <span>Twenty words closer.</span>
                        </span>
                        <span>
                            Made for the joy of learning{' '}
                            <span className="french-flag">
                                <i />
                                <i />
                                <i />
                            </span>
                        </span>
                    </footer>
                </main>
            </div>
            {isQuizOpen && (
                <Quiz
                    quiz={quiz}
                    answer={handleAnswer}
                    next={handleNextQuestion}
                    close={() => setQuiz(null)}
                    retry={() => startQuiz(quiz.missed.length > 0 ? quiz.missed : dailyLesson)}
                />
            )}
        </div>
    );
};
