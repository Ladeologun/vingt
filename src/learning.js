const DAILY_VERB_COUNT = 20;
const PROGRESS_STORAGE_KEY = 'vingt-progress';

/** @returns {string} */
export const getDayKey = (date = new Date()) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** @returns {number} */
const getDayOrdinal = dateKey => {
    const [year, month, day] = dateKey.split('-').map(Number);

    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
};

/** @returns {boolean} */
const isDateKey = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

/** @returns {number} */
export const getLessonNumber = (start, today) =>
    Math.max(0, getDayOrdinal(today) - getDayOrdinal(start));

export const getDailyVerbs = (verbs, day) => {
    const lessonCount = Math.ceil(verbs.length / DAILY_VERB_COUNT);
    const startIndex = (day % lessonCount) * DAILY_VERB_COUNT;

    return verbs.slice(startIndex, startIndex + DAILY_VERB_COUNT);
};

export const getQuizOptions = ({ verb, pool, questionIndex }) => {
    const distractors = pool
        .filter(candidate => candidate.en !== verb.en)
        .sort(
            (first, second) =>
                ((first.id * 17 + questionIndex * 7) % 101) -
                ((second.id * 17 + questionIndex * 7) % 101),
        )
        .slice(0, 3);
    const choices = [...distractors];
    choices.splice(questionIndex % 4, 0, verb);

    return choices;
};

export const getShuffledVerbs = ({ verbs, getRandom = Math.random }) => {
    const shuffledVerbs = [...verbs];

    for (let index = shuffledVerbs.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(getRandom() * (index + 1));
        [shuffledVerbs[index], shuffledVerbs[swapIndex]] = [
            shuffledVerbs[swapIndex],
            shuffledVerbs[index],
        ];
    }

    return shuffledVerbs;
};

/** @returns {boolean} */
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/** @returns {boolean} */
const isVerbIDList = value =>
    Array.isArray(value) &&
    value.length <= DAILY_VERB_COUNT &&
    value.every(id => Number.isInteger(id) && id >= 0 && id < 100) &&
    new Set(value).size === value.length;

/** @returns {boolean} */
const isQuizResult = value =>
    isRecord(value) &&
    Number.isInteger(value.total) &&
    value.total >= 1 &&
    value.total <= DAILY_VERB_COUNT &&
    Number.isInteger(value.score) &&
    value.score >= 0 &&
    value.score <= value.total &&
    isVerbIDList(value.missed) &&
    value.missed.length === value.total - value.score;

/** @returns {boolean} */
const isProgress = value => {
    if (!isRecord(value) || !isDateKey(value.start) || !isRecord(value.days)) {
        return false;
    }

    return Object.entries(value.days).every(
        ([date, record]) =>
            isDateKey(date) &&
            isRecord(record) &&
            isVerbIDList(record.learned) &&
            (record.quiz === undefined || isQuizResult(record.quiz)),
    );
};

export const readProgress = ({ getStorage, today }) => {
    const emptyProgress = { start: today, days: {} };
    let savedValue;

    // Browser storage can throw when access is blocked by the browser.
    try {
        savedValue = getStorage().getItem(PROGRESS_STORAGE_KEY);
    } catch {
        return { success: false, error: 'storage-unavailable', progress: emptyProgress };
    }

    if (savedValue === null) {
        return { success: true, progress: emptyProgress };
    }

    let progress;

    // JSON from storage is untrusted and may have been edited or truncated.
    try {
        progress = JSON.parse(savedValue);
    } catch {
        return { success: false, error: 'invalid-progress', progress: emptyProgress };
    }

    if (!isProgress(progress)) {
        return { success: false, error: 'invalid-progress', progress: emptyProgress };
    }

    return { success: true, progress };
};

export const writeProgress = ({ getStorage, progress }) => {
    try {
        getStorage().setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
        return { success: false, error: 'storage-unavailable' };
    }

    return { success: true };
};
