
const $ = (id) => document.getElementById(id);

const translations = {
    en: {
        subtitle: "Make every date count.",
        countdown: "Countdown",
        age: "Age Calculator",
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
        reached: "Your special day has arrived!"
    },

    fa: {
        subtitle: "هر لحظه ارزشمند است.",
        countdown: "شمارش معکوس",
        age: "محاسبه سن",
        countdownTitle: "تا روز خاصت چقدر مانده؟",
        targetDate: "یک تاریخ انتخاب کن",
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
        reached: "روز موردنظرت فرا رسیده!"
    }
};

let language = "en";
let theme = "dark";
let activeTab = "countdown";

function applyLanguage() {
    const t = translations[language];

    document.documentElement.lang = language;
    document.documentElement.dir =
        language === "fa" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (t[key]) {
            element.textContent = t[key];
        }
    });

    $("languageBtn").textContent =
        language === "fa" ? "FA" : "EN";

    updateCountdown();
    updateAge();
}

function applyTheme() {
    document.body.classList.toggle(
        "light",
        theme === "light"
    );

    $("themeBtn").textContent =
        theme === "dark" ? "☀" : "☾";
}

function switchTab(tab) {
    activeTab = tab;

    $("countdownSection").classList.toggle(
        "hidden", tab !== "countdown"
    );

    $("ageSection").classList.toggle(
        "hidden", tab !== "age"
    );

    document.querySelectorAll(".tab").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.tab === tab
        );
    });
}

// Parse a date without timezone conversion
function parseDate(value) {
    if (!value) return null;

    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

function updateCountdown() {
    const target = parseDate($("targetDate").value);
    const t = translations[language];

    if (!target) {
        $("days").textContent = "--";
        $("hours").textContent = "--";
        $("minutes").textContent = "--";
        $("seconds").textContent = "--";
        $("countdownMessage").textContent = t.chooseDate;
        return;
    }

    const now = new Date();

    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
        $("days").textContent = "0";
        $("hours").textContent = "0";
        $("minutes").textContent = "0";
        $("seconds").textContent = "0";

        $("countdownMessage").textContent =
            difference > -86400000 ? t.reached : t.pastDate;

        return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    $("days").textContent = days;
    $("hours").textContent = hours;
    $("minutes").textContent = minutes;
    $("seconds").textContent = seconds;

    $("countdownMessage").textContent = "";
}

function updateAge() {
    const birth = parseDate($("birthDate").value);
    const t = translations[language];

    if (!birth) {
        $("ageYears").textContent = "--";
        $("ageMonths").textContent = "--";
        $("ageDays").textContent = "--";
        $("ageMessage").textContent = t.enterBirth;
        return;
    }

    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
        months--;

        const previousMonthDays =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            ).getDate();

        days += previousMonthDays;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years < 0) {
        $("ageYears").textContent = "--";
        $("ageMonths").textContent = "--";
        $("ageDays").textContent = "--";
        $("ageMessage").textContent = t.futureBirth;
        return;
    }

    $("ageYears").textContent = years;
    $("ageMonths").textContent = months;
    $("ageDays").textContent = days;
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

// Load saved settings
chrome.storage.local.get(
    ["theme", "language"],
    (settings) => {
        theme = settings.theme || "dark";
        language = settings.language || "en";

        applyTheme();
        applyLanguage();
        switchTab(activeTab);
    }
);

// Live countdown
setInterval(() => {
    updateCountdown();
}, 1000);
