import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

import { getListeningQuestion } from '../listening.js';
import { verbs } from '../verbs.js';

const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
});
const { Quiz } = await server.ssrLoadModule('/src/components/Quiz.jsx');
after(() => server.close());

const question = getListeningQuestion(verbs.find(verb => verb.fr === 'prendre'));
const quiz = {
    mode: 'listening',
    list: [question],
    index: 0,
    selected: null,
    missed: [],
    score: 0,
    done: false,
};

test('listening starts with playback and meaning choices, without revealing the French text or explanation', () => {
    const markup = renderToStaticMarkup(React.createElement(Quiz, { quiz }));

    assert.ok(markup.includes('What does the speaker mean?'));
    assert.ok(markup.includes('Play sentence'));
    assert.ok(markup.includes('Play slowly'));
    assert.ok(markup.includes(question.meaning));
    assert.equal(markup.includes(question.sentence), false);
    assert.equal(markup.includes('THE MEANING'), false);
    assert.equal(markup.includes('is a form of'), false);
});

test('answering reveals the full sentence, meaning, and verb explanation', () => {
    const markup = renderToStaticMarkup(
        React.createElement(Quiz, {
            quiz: { ...quiz, selected: question.id, score: 1 },
        }),
    );

    assert.ok(markup.includes(question.sentence));
    assert.ok(markup.includes('THE MEANING'));
    assert.ok(markup.includes('THE VERB IN CONTEXT'));
    assert.ok(markup.includes('is a form of'));
    assert.ok(markup.includes('prendre'));
    assert.ok(markup.includes('See my results'));
});

test('listening results offer missed-sentence practice and show the score', () => {
    const markup = renderToStaticMarkup(
        React.createElement(Quiz, {
            quiz: { ...quiz, selected: -1, missed: [question], done: true },
        }),
    );

    assert.ok(markup.includes('sentences correctly.'));
    assert.ok(markup.includes('Retry missed sentences'));
    assert.ok(markup.includes(question.sentence));
    assert.equal(markup.includes('Try listening practice'), false);
});
