import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verbs } from '../verbs.js';
import {
    getDayKey,
    getLessonNumber,
    getDailyVerbs,
    getQuizOptions,
    readProgress,
    writeProgress,
    getShuffledVerbs,
} from '../learning.js';
test('five complete distinct daily sets, then review cycle', () => {
    assert.equal(verbs.length, 100);
    const lessons = Array.from({ length: 5 }, (_, index) => getDailyVerbs(verbs, index));
    assert.ok(lessons.every(lesson => lesson.length === 20));
    assert.equal(new Set(lessons.flat().map(verb => verb.fr)).size, 100);
    assert.deepEqual(getDailyVerbs(verbs, 5), lessons[0]);
});
test('calendar day boundaries and backwards clocks', () => {
    assert.equal(getDayKey(new Date(2026, 10, 2, 23)), '2026-11-02');
    assert.equal(getLessonNumber('2026-10-31', '2026-11-02'), 2);
    assert.equal(getLessonNumber('2026-11-02', '2026-11-01'), 0);
});
test('every quiz includes exactly one correct choice', () => {
    verbs.forEach((verb, index) => {
        const options = getQuizOptions({ verb: verb, pool: verbs, questionIndex: index });
        assert.equal(options.length, 4);
        assert.equal(options.filter(option => option.en === verb.en).length, 1);
        assert.equal(new Set(options.map(option => option.en)).size, 4);
    });
});
test('invalid saved data is reported rather than trusted', () => {
    const invalidValues = [
        '{invalid json',
        'null',
        JSON.stringify({ start: 'not-a-date', days: {} }),
        JSON.stringify({ start: '2026-02-30', days: {} }),
        JSON.stringify({ start: '2026-11-02', days: [] }),
        JSON.stringify({ start: '2026-11-02', days: { '2026-11-02': { learned: 'bad' } } }),
        JSON.stringify({ start: '2026-11-02', days: { '2026-11-02': { learned: [999] } } }),
        JSON.stringify({ start: '2026-11-02', days: { '2026-11-02': { learned: [1, 1] } } }),
        JSON.stringify({
            start: '2026-11-02',
            days: {
                '2026-11-02': {
                    learned: [],
                    quiz: { score: 30, total: 20, missed: [] },
                },
            },
        }),
    ];

    invalidValues.forEach(savedValue => {
        const result = readProgress({
            getStorage: () => ({ getItem: () => savedValue }),
            today: '2026-11-02',
        });

        assert.equal(result.success, false);
        assert.equal(result.error, 'invalid-progress');
        assert.deepEqual(result.progress, { start: '2026-11-02', days: {} });
    });
});

test('unavailable browser storage reports failure without crashing', () => {
    const getStorage = () => {
        throw new Error('Storage is blocked.');
    };

    const readResult = readProgress({ getStorage, today: '2026-11-02' });
    const writeResult = writeProgress({ getStorage, progress: { start: '2026-11-02', days: {} } });

    assert.equal(readResult.success, false);
    assert.equal(readResult.error, 'storage-unavailable');
    assert.equal(writeResult.success, false);
    assert.equal(writeResult.error, 'storage-unavailable');
});

test('valid progress survives a storage round trip', () => {
    let savedValue = null;
    const storage = {
        getItem: () => savedValue,
        setItem: (_key, value) => {
            savedValue = value;
        },
    };
    const getStorage = () => storage;
    const progress = {
        start: '2026-11-02',
        days: {
            '2026-11-02': { learned: [0, 1], quiz: { score: 1, total: 2, missed: [1] } },
        },
    };

    assert.deepEqual(readProgress({ getStorage, today: '2026-11-02' }), {
        success: true,
        progress: { start: '2026-11-02', days: {} },
    });
    assert.deepEqual(writeProgress({ getStorage, progress }), { success: true });
    assert.deepEqual(readProgress({ getStorage, today: '2026-11-03' }), {
        success: true,
        progress,
    });
});

test('quiz shuffle keeps every verb exactly once and leaves the lesson untouched', () => {
    const lesson = verbs.slice(0, 20);
    const shuffled = getShuffledVerbs({ verbs: lesson, getRandom: () => 0 });

    assert.deepEqual(lesson, verbs.slice(0, 20));
    assert.equal(shuffled.length, lesson.length);
    assert.deepEqual(
        [...shuffled].sort((first, second) => first.id - second.id),
        lesson,
    );
    assert.notDeepEqual(shuffled, lesson);
});
