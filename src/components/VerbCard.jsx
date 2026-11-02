import React from 'react';

import { Icon } from './Icon.jsx';

export const VerbCard = ({
    verb,
    number,
    isLearned,
    isMeaningHidden,
    canMarkLearned,
    onPronounce,
    onReveal,
    onToggleLearned,
}) => (
    <article className={`verb-card ${isLearned ? 'is-learned' : ''}`}>
        <div className="card-top">
            <span className="verb-number">{String(number).padStart(2, '0')}</span>
            <button
                className="audio"
                aria-label={`Hear ${verb.fr} pronounced in French`}
                onClick={onPronounce}
            >
                <Icon name="sound" size={19} />
            </button>
        </div>
        <h3 lang="fr">{verb.fr}</h3>
        <div className="ipa">/{verb.ipa}/</div>
        {isMeaningHidden ? (
            <button className="reveal" onClick={onReveal}>
                Tap to reveal meaning
            </button>
        ) : (
            <p className="meaning">{verb.en}</p>
        )}
        <div className="example">
            <p lang="fr">{verb.example}</p>
            <span>{verb.translation}</span>
        </div>
        <button
            aria-pressed={isLearned}
            className="learn-button"
            onClick={onToggleLearned}
            disabled={!canMarkLearned}
        >
            <span className="checkbox">{isLearned && <Icon name="check" size={12} />}</span>
            {isLearned ? 'I know this verb' : 'Mark as learned'}
        </button>
    </article>
);
