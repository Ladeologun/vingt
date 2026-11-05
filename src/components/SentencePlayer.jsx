import React, { useEffect, useState } from 'react';

import { Icon } from './Icon.jsx';

export const SentencePlayer = ({ sentence, isAnswered }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
    const [audioError, setAudioError] = useState('');

    useEffect(
        () => () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        },
        [sentence],
    );

    const playSentence = rate => {
        if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
            setAudioError(
                'Audio is unavailable in this browser. You can read the French sentence instead.',
            );
            setIsTranscriptVisible(true);

            return;
        }

        window.speechSynthesis.cancel();
        setAudioError('');
        const utterance = new SpeechSynthesisUtterance(sentence);
        const voice = window.speechSynthesis
            .getVoices()
            .find(candidate => candidate.lang.startsWith('fr'));
        utterance.lang = 'fr-FR';
        utterance.rate = rate;

        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = event => {
            if (event.error === 'canceled' || event.error === 'interrupted') {
                return;
            }

            setIsPlaying(false);
            setAudioError('Audio could not play. Try again, or reveal the French sentence.');
        };
        window.speechSynthesis.speak(utterance);
    };

    const handlePlayback = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            playSentence(0.9);
        }
    };

    return (
        <div className="sentence-player">
            <div className="listening-emblem">
                <Icon name="sound" size={30} />
            </div>
            <p>Listen to an everyday situation in French.</p>
            <div className="playback-controls">
                <button className="primary quiz-listen" onClick={handlePlayback}>
                    <Icon name="sound" size={18} />
                    {isPlaying ? 'Stop audio' : 'Play sentence'}
                </button>
                <button className="quiet-button" onClick={() => playSentence(0.65)}>
                    Play slowly
                </button>
            </div>
            <p className="playback-status" role="status">
                {isPlaying ? 'Playing in French…' : 'Replay as many times as you need.'}
            </p>
            {!!audioError && (
                <p className="audio-error" role="status">
                    {audioError}
                </p>
            )}
            {!isAnswered && (
                <button
                    className="transcript-toggle"
                    aria-expanded={isTranscriptVisible}
                    onClick={() => setIsTranscriptVisible(!isTranscriptVisible)}
                >
                    {isTranscriptVisible ? 'Hide French sentence' : 'Show French sentence'}
                </button>
            )}
            {(isTranscriptVisible || isAnswered) && (
                <p className="sentence-transcript" lang="fr">
                    {sentence}
                </p>
            )}
        </div>
    );
};
