
const $ = (id) => document.getElementById(id);

const translations = {
    en: {
        subtitle: "Make every date count.",
        countdown: "Countdown",
        age: "Age Calculator",
        countdownLabel: "COUNTDOWN",
        ageLabel: "AGE CALCULATOR",
        countdownTitle: "Count down to your special day",
        targetDate: "Select a date",
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        chooseDate: "Choose a date to start.",
        ageTitle: "Discover your exact age",
        birthDate: "Your birth date",
        years: "Years",
        months: "Months",
        enterBirth: "Enter your birth date.",
        futureBirth: "Birth date cannot be in the future.",
        pastDate: "This date has already arrived!",
        reached: "Your special day has arrived!",
        invalidDate: "Please enter a valid date.",
        gregorian: "Gregorian",
        jalali: "Solar Hijri"
    },
    fa: {
        subtitle: "هر لحظه ارزشمند است.",
        countdown: "شمارش معکوس",
        age: "محاسبه سن",
        countdownLabel: "شمارش معکوس",
        ageLabel: "محاسبه سن",
        countdownTitle: "تا روز خاصت چقدر مانده؟",
        targetDate: "تاریخ موردنظر",
        days: "روز",
        hours: "ساعت",
        minutes: "دقیقه",
        seconds: "ثانیه",
        chooseDate: "برای شروع یک تاریخ انتخاب کن.",
        ageTitle: "سن دقیق خودت را بدان",
        birthDate: "تاریخ تولدت",
        years: "سال",
        months: "ماه",
        enterBirth: "تاریخ تولدت را وارد کن.",
        futureBirth: "تاریخ تولد نمی‌تواند در آینده باشد.",
        pastDate: "این تاریخ فرا رسیده است!",
        reached: "روز موردنظرت فرا رسیده!",
        invalidDate: "لطفاً یک تاریخ معتبر وارد کن.",
        gregorian: "میلادی",
        jalali: "شمسی"
    }
};

let language = "en";
let theme = "dark";
let activeTab = "countdown";

function getTodayParts(calendar) {
    const today = new Date();

    if (calendar === "jalali") {
        return CalensaCalendar.gregorianToJalali(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        );
    }

    return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
    };
}

function parseInput(value, calendar) {
    const match = value.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);

    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (calendar === "jalali") {
        const converted = CalensaCalendar.jalaliToGregorian(
            year, month, day
        );

        if (!converted) return null;

        return {
            parts: { year, month, day },
            date: new Date(
                converted.year,
                converted.month - 1,
                converted.day
            )
        };
    }

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return {
        parts: { year, month, day },
        date
    };
}

function getMonthLength(year, month, calendar) {
    if (calendar === "gregorian") {
        return new Date(year, month, 0).getDate();
    }

    for (let day = 31; day >= 1; day--) {
        if (CalensaCalendar.jalaliToGregorian(year, month, day)) {
            return day;
        }
    }

    return 0;
}

function calculateAge(birth, today, calendar) {
    let years = today.year - birth.year;
    let months = today.month - birth.month;
    let days = today.day - birth.day;

    if (days < 0) {
        months--;

        const previousMonth = today.month === 1 ? 12 : today.month - 1;
        const previousYear = today.month === 1
            ? today.year - 1
            : today.year;

        days += getMonthLength(previousYear, previousMonth, calendar);
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

function applyLanguage() {
    const t = translations[language];

    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        if (t[key]) element.textContent = t[key];
    });

    $("languageBtn").textContent = language === "fa" ? "FA" : "EN";

    updateCalendarLabels();
    updateCountdown();
    updateAge();
}

function updateCalendarLabels() {
    const t = translations[language];

    ["targetCalendar", "birthCalendar"].forEach(id => {
        const select = $(id);

        select.options[0].textContent = t.gregorian;
        select.options[1].textContent = t.jalali;
    });
}

function applyTheme() {
    document.body.classList.toggle("light", theme === "light");
    $("themeBtn").textContent = theme === "dark" ? "☀" : "☾";
}

function switchTab(tab) {
    activeTab = tab;

    $("countdownSection").classList.toggle("hidden", tab !== "countdown");
    $("ageSection").classList.toggle("hidden", tab !== "age");

    document.querySelectorAll(".tab").forEach(button => {
        button.classList.toggle("active", button.dataset.tab === tab);
    });
}

function updateCountdown() {
    const t = translations[language];
    const calendar = $("targetCalendar").value;
    const parsed = parseInput($("targetDate").value, calendar);

    if (!parsed) {
        ["days", "hours", "minutes", "seconds"].forEach(id => {
            $(id).textContent = "--";
        });

        $("countdownMessage").textContent =
            $("targetDate").value.trim() ? t.invalidDate : t.chooseDate;
        return;
    }

    const now = new Date();
    const difference = parsed.date.getTime() - now.getTime();

    if (difference <= 0) {
        ["days", "hours", "minutes", "seconds"].forEach(id => {
            $(id).textContent = "0";
        });

        $("countdownMessage").textContent =
            difference > -86400000 ? t.reached : t.pastDate;
        return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    $("days").textContent = Math.floor(totalSeconds / 86400);
    $("hours").textContent = Math.floor((totalSeconds % 86400) / 3600);
    $("minutes").textContent = Math.floor((totalSeconds % 3600) / 60);
    $("seconds").textContent = totalSeconds % 60;

    $("countdownMessage").textContent = "";
}

function updateAge() {
    const t = translations[language];
    const calendar = $("birthCalendar").value;
    const parsed = parseInput($("birthDate").value, calendar);

    if (!parsed) {
        $("ageYears").textContent = "--";
        $("ageMonths").textContent = "--";
        $("ageDays").textContent = "--";

        $("ageMessage").textContent =
            $("birthDate").value.trim() ? t.invalidDate : t.enterBirth;
        return;
    }

    const now = new Date();
    const todayDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    if (parsed.date > todayDate) {
        $("ageYears").textContent = "--";
        $("ageMonths").textContent = "--";
        $("ageDays").textContent = "--";
        $("ageMessage").textContent = t.futureBirth;
        return;
    }

    const today = getTodayParts(calendar);
    const age = calculateAge(parsed.parts, today, calendar);

    $("ageYears").textContent = age.years;
    $("ageMonths").textContent = age.months;
    $("ageDays").textContent = age.days;
    $("ageMessage").textContent = "";
}

// Tabs
document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        switchTab(button.dataset.tab);
    });
});

// Theme
$("themeBtn").addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme();
    chrome.storage.local.set({ theme });
});

// Language
$("languageBtn").addEventListener("click", () => {
    language = language === "en" ? "fa" : "en";
    applyLanguage();
    chrome.storage.local.set({ language });
});

// Date inputs
$("targetDate").addEventListener("input", updateCountdown);
$("birthDate").addEventListener("input", updateAge);

$("targetCalendar").addEventListener("change", updateCountdown);
$("birthCalendar").addEventListener("change", updateAge);

// Load saved settings
chrome.storage.local.get(["theme", "language"], settings => {
    theme = settings.theme || "dark";
    language = settings.language || "en";

    applyTheme();
    applyLanguage();
    switchTab(activeTab);
});

// Live countdown
setInterval(updateCountdown, 1000);
