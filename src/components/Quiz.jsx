import React, { useEffect } from 'react';

import { getQuizOptions } from '../learning.js';
import { verbs } from '../verbs.js';

import { Icon } from './Icon.jsx';

export const Quiz = ({
    quiz,
    answer: handleAnswer,
    next: handleNextQuestion,
    close: handleClose,
    retry: handleRetry,
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
                            You matched{' '}
                            <strong>
                                {quiz.score} of {quiz.list.length}
                            </strong>{' '}
                            meanings correctly.
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
                                        <span lang="fr">{verb.fr}</span>
                                        <span>{verb.en}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="primary" onClick={handleRetry}>
                            {quiz.missed.length > 0 ? 'Practice missed verbs' : 'Practice again'}
                            <Icon name="arrow" />
                        </button>
                        <button className="quiet-button" onClick={handleClose}>
                            Back to my lesson
                        </button>
                    </>
                ) : (
                    <>
                        <span className="eyebrow">
                            MEANING MATCH · {quiz.index + 1} OF {quiz.list.length}
                        </span>
                        <div className="track">
                            <span style={{ width: (quiz.index / quiz.list.length) * 100 + '%' }} />
                        </div>
                        <h2 id="quiz-title">What does this verb mean?</h2>
                        <div className="quiz-word" lang="fr">
                            {verb.fr}
                        </div>
                        <div className="answers">
                            {getQuizOptions({
                                verb: verb,
                                pool: verbs,
                                questionIndex: quiz.index,
                            }).map((option, index) => (
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
                                    {option.en}
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
                                            : `Keep going! ${verb.fr} means “${verb.en}”.`}
                                    </strong>
                                    <button className="primary" onClick={handleNextQuestion}>
                                        {quiz.index + 1 === quiz.list.length
                                            ? 'See my results'
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
