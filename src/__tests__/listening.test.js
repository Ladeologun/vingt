import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getDailyVerbs, readProgress, writeProgress } from '../learning.js';
import { getListeningOptions, getListeningQuestion, listeningSentences } from '../listening.js';
import { verbs } from '../verbs.js';

test('every daily verb has a new sentence with its verb form and a contrasting meaning', () => {
    assert.equal(listeningSentences.length, verbs.length);
    assert.equal(new Set(listeningSentences.map(sentence => sentence.verb)).size, verbs.length);

    for (let lessonIndex = 0; lessonIndex < 5; lessonIndex++) {
        const dailyVerbs = getDailyVerbs(verbs, lessonIndex);
        const questions = dailyVerbs.map(getListeningQuestion);

        assert.equal(questions.length, 20);
        assert.deepEqual(
            questions.map(question => question.id),
            dailyVerbs.map(verb => verb.id),
        );
        questions.forEach((question, index) => {
            assert.equal(typeof question.meaning, 'string');
            assert.ok(question.sentence.includes(question.form));
            assert.notEqual(question.sentence, dailyVerbs[index].example);
            assert.notEqual(question.meaning, question.nearMiss);
        });
    }
});

test('listening choices contain one correct meaning, a close distractor, and no duplicate options', () => {
    verbs.map(getListeningQuestion).forEach(question => {
        for (let questionIndex = 0; questionIndex < 20; questionIndex++) {
            const choices = getListeningOptions({ question, questionIndex });

            assert.equal(choices.length, 4);
            assert.equal(new Set(choices.map(choice => choice.text)).size, 4);
            assert.equal(new Set(choices.map(choice => choice.id)).size, 4);
            assert.equal(choices.filter(choice => choice.id === question.id).length, 1);
            assert.equal(choices.find(choice => choice.id === question.id).text, question.meaning);
            assert.ok(choices.some(choice => choice.text === question.nearMiss));
            assert.equal(choices[questionIndex % 4].id, question.id);
        }
    });
});

test('listening results and vocabulary results both survive saving and loading', () => {
    let savedValue;
    const getStorage = () => ({
        getItem: () => savedValue,
        setItem: (_key, value) => {
            savedValue = value;
        },
    });
    const progress = {
        start: '2026-11-02',
        days: {
            '2026-11-05': {
                learned: [60, 61],
                quiz: { score: 19, total: 20, missed: [60] },
                listening: { score: 18, total: 20, missed: [60, 61] },
            },
        },
    };

    assert.equal(writeProgress({ getStorage, progress }).success, true);
    assert.deepEqual(readProgress({ getStorage, today: '2026-11-05' }), {
        success: true,
        progress,
    });
});

test('malformed listening results are rejected at the storage boundary', () => {
    const progress = {
        start: '2026-11-02',
        days: {
            '2026-11-05': {
                learned: [],
                listening: { score: 21, total: 20, missed: [] },
            },
        },
    };
    const result = readProgress({
        getStorage: () => ({ getItem: () => JSON.stringify(progress) }),
        today: '2026-11-05',
    });

    assert.equal(result.success, false);
    assert.equal(result.error, 'invalid-progress');
});
