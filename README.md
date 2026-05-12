# 🎬 CinePulse — Modern Movie Search Application

> A sleek, responsive Single Page Application for discovering movies, series, and TV episodes — powered by the OMDB API.

---

## 📌 What is CinePulse?

CinePulse is a lightweight web application that lets users instantly search for any movie, series, or TV episode and get back detailed information including the title, release year, genre, director, and poster image — all in real time.

No heavy frameworks. No bloat. Just clean, fast, modern web development.

---

## ✨ Features

- 🔍 **Real-time search** across movies, series, and TV episodes
- 🎛️ **Filters** by content type (Movie / Series / Episode) and release year
- 🖼️ **Rich detail cards** — poster, genre, director, year, and more
- 💾 **Search persistence** — your last search survives a page refresh
- 🔗 **Shareable URLs** — every search updates the URL so you can share it directly
- 📱 **Fully responsive** design for all screen sizes

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| **HTML5** | Semantic page structure and layout |
| **Vanilla CSS3** | Styling, dark-mode aesthetic, animations |
| **Vanilla JavaScript (ES6+)** | Core logic, API calls, DOM manipulation |
| **OMDB API** | Movie database backend service |

> Built entirely without frameworks to keep the app fast, lightweight, and easy to maintain.

---

## 🏗️ Project Structure

```
cinepulse/
├── index.html      # Main page structure
├── style.css       # Visual design system
└── script.js       # Application logic & API integration
```

---

## 💡 How It Was Built

### 1. HTML — Structuring the UI

The `index.html` sets up a clean, user-friendly interface centered around a search bar. It includes:
- A **text input** for the movie name
- A **dropdown** to filter by type (Movie / Series / Episode)
- A **year input** for further filtering
- Placeholder containers for: welcome message, loading spinner, error states, and result cards

---

### 2. CSS — Designing the Experience

The `style.css` implements a premium dark-mode design system using **Google Fonts (Inter)** with:
- **CSS Flexbox & Grid** for responsive layout
- **Glassmorphism effects** for depth and modernity
- **Smooth micro-animations** on card appearance and button hover states
- A cohesive dark theme with vibrant accent colors

---

### 3. JavaScript — Implementing the Logic

The `script.js` connects the UI to real data with three core responsibilities:

**Fetching Data**
```javascript
// Secure async call to the OMDB API
const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
const data = await response.json();
```

**State Management** — handles all UI states cleanly:
- ⏳ Loading spinner while the request is in flight
- ❌ Custom error messages when a movie isn't found
- ✅ Dynamic HTML generation to display the movie result card

**Data Persistence** — uses `localStorage` and `URLSearchParams` to:
- Save the last search so it survives a page refresh
- Update the browser URL with each search, making every result shareable

---

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/cinepulse.git
cd cinepulse
```

2. Get a free API key from [OMDB API](https://www.omdbapi.com/apikey.aspx)

3. Open `script.js` and replace the placeholder with your key:
```javascript
const API_KEY = 'your_api_key_here';
```

4. Open `index.html` in your browser — that's it, no build step needed!

---

## 🌐 Deployment

CinePulse is ready to deploy on **GitHub Pages** out of the box. Simply push to your repository and enable GitHub Pages from the repository settings.

---

## 👨‍💻 Author

AHMED MAHMOOD
