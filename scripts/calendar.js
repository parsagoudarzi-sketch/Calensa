
// Calensa Calendar Engine
// Supports Gregorian and Solar Hijri calendars.

const CalensaCalendar = (() => {
    const formatter = new Intl.DateTimeFormat(
        "en-US-u-ca-persian-nu-latn",
        {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            timeZone: "UTC"
        }
    );

    function getPersianParts(date) {
        const utcDate = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            12
        ));

        const parts = formatter.formatToParts(utcDate);
        const result = {};

        for (const part of parts) {
            if (part.type === "year") result.year = Number(part.value);
            if (part.type === "month") result.month = Number(part.value);
            if (part.type === "day") result.day = Number(part.value);
        }

        return result;
    }

    function jalaliToGregorian(year, month, day) {
        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day) ||
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        ) {
            return null;
        }

        const gregorianYear = year + 621;
        let newYear = null;

        // Find the first day of the Jalali year.
        for (let offset = 18; offset <= 23; offset++) {
            const candidate = new Date(Date.UTC(
                gregorianYear,
                2,
                offset,
                12
            ));

            const parts = getPersianParts(candidate);

            if (
                parts.year === year &&
                parts.month === 1 &&
                parts.day === 1
            ) {
                newYear = candidate;
                break;
            }
        }

        if (!newYear) return null;

        const monthOffset = month <= 6
            ? (month - 1) * 31
            : 186 + (month - 7) * 30;

        const result = new Date(newYear.getTime());
        result.setUTCDate(result.getUTCDate() + monthOffset + day - 1);

        const check = getPersianParts(result);

        // Reject invalid dates, including Esfand 30 in non-leap years.
        if (
            check.year !== year ||
            check.month !== month ||
            check.day !== day
        ) {
            return null;
        }

        return {
            year: result.getUTCFullYear(),
            month: result.getUTCMonth() + 1,
            day: result.getUTCDate()
        };
    }

    function gregorianToJalali(year, month, day) {
        const date = new Date(Date.UTC(year, month - 1, day, 12));

        if (
            date.getUTCFullYear() !== year ||
            date.getUTCMonth() + 1 !== month ||
            date.getUTCDate() !== day
        ) {
            return null;
        }

        return getPersianParts(date);
    }

    return {
        jalaliToGregorian,
        gregorianToJalali
    };
})();
