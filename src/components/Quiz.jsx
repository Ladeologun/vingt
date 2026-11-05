import React, { useEffect } from 'react';

import { getQuizOptions } from '../learning.js';
import { getListeningOptions } from '../listening.js';
import { verbs } from '../verbs.js';

import { Icon } from './Icon.jsx';
import { SentencePlayer } from './SentencePlayer.jsx';

export const Quiz = ({
    quiz,
    answer: handleAnswer,
    next: handleNextQuestion,
    close: handleClose,
    retry: handleRetry,
    onStartListening,
}) => {
    useEffect(() => {
        document.querySelector('.quiz-close')?.focus();
    }, []);

    const handleFocusTrap = event => {
        if (event.key === 'Tab') {
            const focusableButtons = [
                ...event.currentTarget.querySelectorAll('button:not(:disabled)'),
            ];

            if (event.shiftKey && document.activeElement === focusableButtons[0]) {
                event.preventDefault();
                focusableButtons.at(-1).focus();
            } else if (!event.shiftKey && document.activeElement === focusableButtons.at(-1)) {
                event.preventDefault();
                focusableButtons[0].focus();
            }
        }
    };

    const verb = quiz.list[quiz.index];
    const isListening = quiz.mode === 'listening';
    const options = isListening
        ? getListeningOptions({ question: verb, questionIndex: quiz.index })
        : getQuizOptions({ verb, pool: verbs, questionIndex: quiz.index }).map(option => ({
              id: option.id,
              text: option.en,
          }));

    return (
        <div
            className="modal-backdrop"
            onClick={event => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <section
                className="quiz-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="quiz-title"
                onKeyDown={handleFocusTrap}
            >
                <button className="quiz-close" aria-label="Close practice" onClick={handleClose}>
                    <Icon name="close" />
                </button>
                {quiz.done ? (
                    <>
                        <span className="result-icon">
                            <Icon name="star" size={32} />
                        </span>
                        <span className="eyebrow">PRACTICE COMPLETE</span>
                        <h2 id="quiz-title">
                            {quiz.score === quiz.list.length
                                ? 'Très bien !'
                                : 'A little better, every day.'}
                        </h2>
                        <p>
                            {isListening ? 'You understood' : 'You matched'}{' '}
                            <strong>
                                {quiz.score} of {quiz.list.length}
                            </strong>{' '}
                            {isListening ? 'sentences correctly.' : 'meanings correctly.'}
                        </p>
                        <div className="score">
                            {Math.round((quiz.score / quiz.list.length) * 100)}
                            <span>%</span>
                        </div>
                        {quiz.missed.length > 0 && (
                            <div className="missed">
                                <strong>A few to revisit</strong>
                                {quiz.missed.map(verb => (
                                    <div key={verb.id}>
                                        <span lang="fr">
                                            {isListening ? verb.sentence : verb.fr}
                                        </span>
                                        <span>{isListening ? verb.meaning : verb.en}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!isListening && (
                            <button className="primary" onClick={onStartListening}>
                                Try listening practice <Icon name="sound" />
                            </button>
                        )}
                        <button
                            className={isListening ? 'primary' : 'quiet-button'}
                            onClick={handleRetry}
                        >
                            {quiz.missed.length > 0
                                ? isListening
                                    ? 'Retry missed sentences'
                                    : 'Practice missed verbs'
                                : 'Practice again'}
                            <Icon name="arrow" />
                        </button>
                        <button className="quiet-button" onClick={handleClose}>
                            Back to my lesson
                        </button>
                    </>
                ) : (
                    <>
                        <span className="eyebrow">
                            {isListening ? 'LISTEN & UNDERSTAND' : 'MEANING MATCH'} ·{' '}
                            {quiz.index + 1} OF {quiz.list.length}
                        </span>
                        <div className="track">
                            <span style={{ width: (quiz.index / quiz.list.length) * 100 + '%' }} />
                        </div>
                        <h2 id="quiz-title">
                            {isListening
                                ? 'What does the speaker mean?'
                                : 'What does this verb mean?'}
                        </h2>
                        {isListening ? (
                            <SentencePlayer
                                key={verb.id}
                                sentence={verb.sentence}
                                isAnswered={quiz.selected !== null}
                            />
                        ) : (
                            <div className="quiz-word" lang="fr">
                                {verb.fr}
                            </div>
                        )}
                        <div className="answers">
                            {options.map((option, index) => (
                                <button
                                    key={option.id}
                                    disabled={quiz.selected !== null}
                                    className={
                                        quiz.selected === null
                                            ? ''
                                            : option.id === verb.id
                                              ? 'correct'
                                              : option.id === quiz.selected
                                                ? 'incorrect'
                                                : ''
                                    }
                                    onClick={() => handleAnswer(option.id)}
                                >
                                    <span>{String.fromCharCode(65 + index)}</span>
                                    {option.text}
                                    {quiz.selected !== null && option.id === verb.id && (
                                        <Icon name="check" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div aria-live="polite">
                            {quiz.selected !== null && (
                                <div className="answer-feedback">
                                    <strong>
                                        {quiz.selected === verb.id
                                            ? 'Exactly. Bien joué !'
                                            : isListening
                                              ? 'Good effort. Listen again and compare the meaning below.'
                                              : `Keep going! ${verb.fr} means “${verb.en}”.`}
                                    </strong>
                                    {isListening && (
                                        <div className="sentence-explanation">
                                            <span className="eyebrow">THE MEANING</span>
                                            <p>{verb.meaning}</p>
                                            <span className="eyebrow">THE VERB IN CONTEXT</span>
                                            <p>
                                                <strong lang="fr">{verb.form}</strong> is a form of{' '}
                                                <strong lang="fr">{verb.fr}</strong> ({verb.en}) in
                                                this sentence.
                                            </p>
                                        </div>
                                    )}
                                    <button className="primary" onClick={handleNextQuestion}>
                                        {quiz.index + 1 === quiz.list.length
                                            ? 'See my results'
                                            : isListening
                                              ? 'Next sentence'
                                              : 'Next verb'}
                                        <Icon name="arrow" size={17} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};
