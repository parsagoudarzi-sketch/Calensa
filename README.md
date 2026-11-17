# Calensa

<p align="center">
  <strong>Make every date count.</strong>
</p>

<p align="center">
  A simple, modern Chrome extension for counting down to important dates and calculating your age — with support for both Gregorian and Solar Hijri calendars.
</p>

---

## Overview

**Calensa** helps you keep track of the dates that matter.

Whether you're waiting for a birthday, preparing for an important event, or simply curious about your exact age, Calensa provides a clean and straightforward experience.

Designed with a modern minimal interface, Calensa supports both Persian (Solar Hijri) and Gregorian calendars, making date calculations easier for everyone.

## Features

- **Countdown Timer** — Count down to any date with live days, hours, minutes, and seconds.
- **Age Calculator** — Calculate your exact age in years, months, and days.
- **Dual Calendar Support** — Use either the Gregorian or Solar Hijri calendar.
- **Persian & English Languages** — Switch between English and Persian interfaces.
- **Dark & Light Themes** — Choose the appearance you prefer.
- **Live Updates** — Countdown values update automatically.
- **Lightweight & Simple** — No complicated setup or unnecessary features.

## Screenshots

<!-- Add screenshots of the extension here -->

## Installation

Calensa is currently available as a source-code installation.

1. Download or clone this repository:

   ```bash
   git clone https://github.com/parsagoudarzi-sketch/Calensa.git
   ```

2. Open Google Chrome and navigate to:

   ```text
   chrome://extensions
   ```

3. Enable **Developer mode**.

4. Click **Load unpacked**.

5. Select the Calensa project folder.

That's it! Calensa should now appear in your Chrome extensions.

## Usage

1. Open Calensa from the Chrome extensions menu.
2. Choose between **Countdown** and **Age Calculator**.
3. Select your preferred calendar.
4. Enter a date in `YYYY/MM/DD` format.
5. Switch the language or theme whenever you like.

## Project Structure

```text
Calensa/
│
├── assets/
│   └── icons/
│
├── scripts/
│   └── calendar.js
│
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── README.md
└── .gitignore
```

## Technology

Calensa is built using:

- HTML5
- CSS3
- JavaScript
- Chrome Extension APIs
- JavaScript Internationalization API (`Intl`
