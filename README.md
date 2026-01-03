# Academic Hub

A comprehensive academic management application designed for engineering students to track their academic progress, attendance, and schedules. Built with modern web technologies for a fast, responsive, and offline-capable experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Live Demo](#live-demo)
- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Overview

Academic Hub is a single-page application that provides students with tools to manage their academic life effectively. The application supports multi-semester tracking, SGPA/CGPA calculations, attendance monitoring with shortage warnings, and weekly timetable management. All data is persisted locally in the browser, ensuring privacy and offline functionality.

## Features

### Dashboard
- Real-time SGPA and CGPA calculation based on credit-weighted grade points
- Semester-wise subject management with grade tracking
- Quick overview of academic standing across all semesters
- Add, edit, and remove subjects dynamically
- Support for up to 8 semesters with customizable curriculum

### Analytics
- Visual representation of academic performance over time
- Semester-wise SGPA progression charts
- Credit distribution analysis
- Performance trend identification
- Interactive charts powered by Recharts

### Attendance Tracking
- Subject-wise attendance recording
- Real-time attendance percentage calculation
- Visual indicators for attendance status:
  - Green: 75% and above (safe)
  - Yellow: 60-74% (warning)
  - Red: Below 60% (critical)
- Classes required calculator to reach target attendance
- Semester-wise attendance segregation

### Timetable Management
- Weekly schedule display (Monday to Saturday)
- Current day highlighting
- Time-slot based class organization
- Room and location information
- Support for lab sessions and combined classes

### User Interface
- Dark and light theme support with system preference detection
- Fully responsive design for desktop, tablet, and mobile devices
- Accessible components following WAI-ARIA guidelines
- Smooth animations and transitions
- JetBrains-inspired design language

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 18.3 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 5.4 |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts 2.15 |
| Routing | React Router DOM 6.30 |
| State Management | React Query 5.83 |
| Form Handling | React Hook Form 7.61 |
| Validation | Zod 3.25 |
| Icons | Lucide React |
| Theme | next-themes |

## Live Demo

The application is deployed and available.

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/Addy-Da-Baddy/academic-navigator.git
cd academic-navigator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:8080` in your browser

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
academic-navigator/
├── public/                  # Static assets
│   └── robots.txt
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── AddSubjectDialog.tsx
│   │   ├── Analytics.tsx
│   │   ├── Attendance.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── SemesterTabs.tsx
│   │   ├── StatCard.tsx
│   │   ├── SubjectCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── Timetable.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useAcademicData.ts
│   ├── lib/                 # Utilities and store
│   │   ├── store.ts         # Data persistence layer
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── utils.ts         # Helper functions
│   ├── pages/               # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx              # Application root
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json
```

## Configuration

### Customizing Default Data

The default curriculum and timetable can be modified in `src/lib/store.ts`. The `DEFAULT_DATA` object contains:

- Semester definitions with subjects
- Credit allocations
- Timetable structure

### Theme Configuration

Theme colors and design tokens are defined in `src/index.css` using CSS custom properties. The application supports:

- Light mode
- Dark mode
- System preference detection

### Adding UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

## Contributing

Contributions are welcome. Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes
4. Run linting and ensure no errors:

```bash
npm run lint
```

5. Commit your changes with a descriptive message:

```bash
git commit -m "feat: add new feature description"
```

6. Push to your fork:

```bash
git push origin feature/your-feature-name
```

7. Open a Pull Request

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Code Guidelines

- Use TypeScript for all new code
- Follow existing code style and patterns
- Add JSDoc comments for public functions
- Ensure responsive design for all UI changes
- Test on both light and dark themes
- Maintain accessibility standards

### Reporting Issues

When reporting issues, please include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and OS information
- Screenshots if applicable

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Developed for engineering students to simplify academic management.
