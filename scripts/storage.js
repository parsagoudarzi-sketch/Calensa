
const CalensaStorage = (() => {
    const STORAGE_KEY = "calensaData";

    const DEFAULT_DATA = {
        countdowns: [],

        profile: {
            name: "",
            birthDate: "",
            birthCalendar: "jalali",
            showInDateBar: false
        },

        settings: {
            language: "en",
            theme: "dark",
            selectedDateBarItem: null,
            dateBarEnabled: true
        }
    };

    function createId() {
        return crypto.randomUUID();
    }

    function getData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([STORAGE_KEY], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                const saved = result[STORAGE_KEY] || {};

                resolve({
                    ...DEFAULT_DATA,
                    ...saved,

                    countdowns: Array.isArray(saved.countdowns)
                        ? saved.countdowns
                        : [],

                    profile: {
                        ...DEFAULT_DATA.profile,
                        ...(saved.profile || {})
                    },

                    settings: {
                        ...DEFAULT_DATA.settings,
                        ...(saved.settings || {})
                    }
                });
            });
        });
    }

    async function saveData(data) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(
                { [STORAGE_KEY]: data },
                () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                        return;
                    }

                    resolve(true);
                }
            );
        });
    }

    async function updateData(callback) {
        const data = await getData();
        const updatedData = callback(data);

        await saveData(updatedData);

        return updatedData;
    }

    async function addCountdown(countdown) {
        return updateData(data => {
            data.countdowns.push({
                id: createId(),
                name: countdown.name,
                targetDate: countdown.targetDate,
                calendar: countdown.calendar || "gregorian",
                showInDateBar: false,
                createdAt: new Date().toISOString()
            });

            return data;
        });
    }

    async function updateCountdown(id, changes) {
        return updateData(data => {
            data.countdowns = data.countdowns.map(item =>
                item.id === id
                    ? { ...item, ...changes, id: item.id }
                    : item
            );

            return data;
        });
    }

    async function deleteCountdown(id) {
        return updateData(data => {
            data.countdowns = data.countdowns.filter(
                item => item.id !== id
            );

            if (data.settings.selectedDateBarItem === id) {
                data.settings.selectedDateBarItem = null;
            }

            return data;
        });
    }

    async function saveProfile(profile) {
        return updateData(data => {
            data.profile = {
                ...data.profile,
                ...profile
            };

            return data;
        });
    }

    async function saveSettings(settings) {
        return updateData(data => {
            data.settings = {
                ...data.settings,
                ...settings
            };

            return data;
        });
    }

    return {
        getData,
        saveData,
        updateData,
        addCountdown,
        updateCountdown,
        deleteCountdown,
        saveProfile,
        saveSettings
    };
})();
