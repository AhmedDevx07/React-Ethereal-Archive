# 🌌 React Ethereal Archive

> A beautiful, responsive image gallery powered by the Unsplash API — built as part of the **internee.pk React Internship Program**.

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-blueviolet?style=for-the-badge)](https://react-ethereal-archive.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/AhmedDevx07/React-Ethereal-Archive)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 📸 Preview

A dynamic, grid-based image gallery that lets users search and explore stunning photography from Unsplash — with the ability to download any image with a single click.

---

## ✨ Features

- 🔍 **Search & Filter** — Find images in real time based on any keyword
- 🖼️ **Dynamic Grid Layout** — Responsive CSS Grid that adapts to all screen sizes
- ⬇️ **Download Button** — Save any image directly to your device
- ⚡ **Live API Fetching** — Images fetched dynamically from the Unsplash API using `useEffect`
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop using CSS Grid & Flexbox

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library & component architecture |
| **Unsplash API** | Image source & search endpoint |
| **CSS Grid & Flexbox** | Responsive layout system |
| **useEffect / useState** | Data fetching & state management |
| **Vercel** | Deployment & hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v16+`
- A free [Unsplash Developer Account](https://unsplash.com/developers) for your API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AhmedDevx07/React-Ethereal-Archive.git

# 2. Navigate into the project
cd React-Ethereal-Archive

# 3. Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory and add your Unsplash API key:

```env
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### Run Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 📁 Project Structure

```
React-Ethereal-Archive/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       # Search input component
│   │   ├── ImageCard.jsx       # Individual image card with download button
│   │   └── Gallery.jsx         # CSS Grid gallery layout
│   ├── App.jsx                 # Root component, API fetching logic
│   ├── App.css                 # Global styles
│   └── index.js                # Entry point
├── .env                        # API key (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🧠 Key Concepts Practiced

### 🔹 API Fetching with `useEffect`
Images are fetched from the Unsplash API on component mount and re-fetched whenever the search query changes, using the `useEffect` hook combined with `useState` for clean async data handling.

### 🔹 CSS Grid Layout
The gallery uses a responsive CSS Grid layout that automatically adjusts column count based on the viewport width — no media queries needed for the core grid behavior.

### 🔹 User Input Handling
The search bar captures user input through a controlled component, debouncing or triggering API calls to filter results in real time without excessive requests.

### 🔹 Download Challenge
Each image card includes a **Download** button that programmatically fetches the image as a blob and triggers a browser download — demonstrating practical use of the Fetch API and `<a>` element manipulation.

---

## 🌐 Live Demo

👉 **[react-ethereal-archive.vercel.app](https://react-ethereal-archive.vercel.app/)**

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Unsplash](https://unsplash.com/) for the free, high-quality image API
- [internee.pk](https://internee.pk/) for providing this project as part of the React Internship curriculum
- [Vercel](https://vercel.com/) for seamless deployment

---

<div align="center">
  <p>Made with ❤️ as part of the <strong>internee.pk React Internship</strong></p>
</div>
