const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR = 60 * MS_MINUTE;
const MS_DAY = 24 * MS_HOUR;
const MS_WEEK = 7 * MS_DAY;
const MS_MONTH = 30 * MS_DAY;
const MS_YEAR = 365 * MS_DAY;

/**
 * Human readable elapsed or remaining time (example: 3 min. ago)
 * @param  {Date|Number|String} date A Date object, timestamp or string parsable with Date.parse()
 * @param  {Date|Number|String} [nowDate] A Date object, timestamp or string parsable with Date.parse()
 * @param  {Intl.RelativeTimeFormat} [trf] A Intl formater
 * @return {string} Human readable elapsed or remaining time
 * @author github.com/victornpb
 * @see https://stackoverflow.com/a/67338038/938822
 */
function fromNow(
    date,
    nowDate = Date.now(),
    rft = new Intl.RelativeTimeFormat(undefined, {
        style: 'long',
        numeric: 'always',
    })
) {
    const intervals = [
        { ge: MS_YEAR, divisor: MS_YEAR, unit: 'year' },
        { ge: MS_MONTH, divisor: MS_MONTH, unit: 'month' },
        { ge: MS_WEEK, divisor: MS_WEEK, unit: 'week' },
        { ge: MS_DAY, divisor: MS_DAY, unit: 'day' },
        { ge: MS_HOUR, divisor: MS_HOUR, unit: 'hour' },
        { ge: MS_MINUTE, divisor: MS_MINUTE, unit: 'minute' },
        { ge: MS_SECOND, divisor: MS_SECOND, unit: 'seconds' },
        { ge: 0, divisor: 1, text: 'just now' },
    ];
    const now = typeof nowDate === 'object' ? nowDate.getTime() : new Date(nowDate).getTime();
    const diff = now - (typeof date === 'object' ? date : new Date(date)).getTime();
    const diffAbs = Math.abs(diff);
    for (const interval of intervals) {
        if (diffAbs >= interval.ge) {
            const x = Math.round(diffAbs / interval.divisor);
            const isFuture = diff < 0;
            return interval.unit ? rft.format(isFuture ? x : -x, interval.unit) : interval.text;
        }
    }
}

/**
 * @param {string} c0 color code at 0% (without the leading #)
 * @param {string} c1 color code at 100% (without the leading #)
 * @param {number} f progression between 0 and 1 (0% and 100%)
 * 
 * @see https://stackoverflow.com/a/63775249
 */
function interpolateColor(c0, c1, f) {
    c0 = c0.match(/.{1,2}/g).map(oct => parseInt(oct, 16) * (1 - f));
    c1 = c1.match(/.{1,2}/g).map(oct => parseInt(oct, 16) * f);
    let ci = [0,1,2].map(i => Math.min(Math.round(c0[i] + c1[i]), 255));
    return ci.reduce((a, v) => ((a << 8) + v), 0).toString(16).padStart(6, '0');
}

function normalize(val, min, max) {
    return (val - min) / (max - min);
}

function getShortMassOrVolume(value, type) {
    switch (type) {
        case 'mass':
            // value in grams
            if (value > 1_000_000_000_000) {
                return Math.round(10 * value / 1_000_000_000_000) / 10 + ' Mt';
            } else if (value > 1_000_000_000) {
                return Math.round(10 * value / 1_000_000_000) / 10 + ' kt';
            } else if (value > 1_000_000) {
                return Math.round(10 * value / 1_000_000) / 10 + ' t';
            } else {
                return Math.round(value / 1_000) + ' kg';
            }
        case 'volume':
            // value in ml
            return Math.round(value / 1_000_000) + ' m³';
    }
}
