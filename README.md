# 🚀 Nexus Web Studio

A stunning, modern website for a web development startup showcasing their skills with cutting-edge technologies.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.160-black?logo=three.js)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-purple)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## ✨ Features

- **3D Interactive Background** - Stunning Three.js scene with animated geometric shapes, particles, and sparkles
- **Smooth Animations** - Beautiful scroll and hover animations powered by Framer Motion
- **Blue/Purple Gradient Theme** - Eye-catching gradient design throughout
- **Glass Morphism UI** - Modern frosted glass card effects
- **Responsive Design** - Looks great on all devices
- **Animated Counters** - Stats that animate when scrolled into view
- **Infinite Tech Carousel** - Auto-scrolling technology showcase
- **Contact Form** - Styled contact section with form validation ready

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Framer Motion** - Animation library
- **Vite** - Next-generation frontend build tool

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd /Users/sebastian/ITProjects/ITStartUp/Nasa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
├── public/
│   └── vite.svg          # Favicon
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles and CSS variables
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🎨 Customization

### Colors

Edit the CSS variables in `src/index.css`:

```css
:root {
  --gradient-start: #0f0c29;
  --gradient-mid: #302b63;
  --gradient-end: #24243e;
  --accent-blue: #00d4ff;
  --accent-purple: #b24bf3;
  --accent-pink: #ff2d92;
}
```

### 3D Scene

Modify the 3D elements in `src/App.jsx` in the `Scene3D` component. You can:
- Change colors of the spheres and shapes
- Adjust animation speeds
- Add or remove 3D objects
- Modify particle count and colors

## 📄 License

MIT License - feel free to use this template for your own projects!

---

Built with 💜 by Nexus Web Studio
