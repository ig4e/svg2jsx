# SVG to JSX Converter

A free, fast, and feature-rich online tool to convert SVG code into React JSX components. Built with Next.js and designed for developers who need quick and reliable SVG-to-React conversions.

🌐 **Live Demo:** [svg2jsx.ahmedmohamed.dev](https://svg2jsx.ahmedmohamed.dev)

## ✨ Features

- **🚀 Instant Conversion**: Real-time SVG to JSX conversion with debounced input
- **🎯 SVGO Optimization**: Built-in SVG optimization using SVGO for cleaner output
- **📝 TypeScript Support**: Generate TypeScript (.tsx) or JavaScript (.jsx) components
- **💅 Prettier Formatting**: Automatically format output code with configurable Prettier settings
- **⚡ Component Customization**: 
  - Custom component names
  - Export styles (const, function, default)
  - React.memo wrapping
  - Props forwarding
  - Quote style preferences
- **📱 Responsive Design**: Split-pane editor that works on desktop and mobile
- **💾 Persistent Settings**: Your preferences are saved locally
- **📋 Easy Export**: Copy to clipboard or download as files
- **🌙 Dark Mode**: Beautiful dark theme optimized for coding

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom components
- **Code Editor**: Monaco Editor (VS Code editor in the browser)
- **SVG Optimization**: [SVGO](https://github.com/svg/svgo)
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Type Safety**: Full TypeScript support
- **State Management**: React hooks with localStorage persistence
- **UI Components**: Custom component library built with Radix UI primitives

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Bun or pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/svg2jsx.git
cd svg2jsx
```

2. Install dependencies:
```bash
bun install
# or
pnpm install
```

3. Start the development server:
```bash
bun dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. **Paste SVG Code**: Copy your SVG code into the left panel
2. **Configure Options**: Adjust settings like component name, TypeScript/JavaScript, export style, etc.
3. **Get JSX Output**: The converted JSX component appears instantly in the right panel
4. **Copy or Download**: Use the copy button or download the component as a file

### Example

**Input SVG:**
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
</svg>
```

**Output JSX:**
```tsx
import React from "react";

export const MyIcon = React.memo<React.SVGProps<SVGSVGElement>>((props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
  </svg>
));

MyIcon.displayName = "MyIcon";
```

## ⚙️ Configuration Options

- **Component Name**: Set custom component names
- **Language**: Choose between TypeScript (.tsx) or JavaScript (.jsx)
- **Export Style**: const, function, or default exports
- **React.memo**: Wrap components in React.memo for performance
- **Props Forwarding**: Pass through SVG props to the component
- **Quote Style**: Single or double quotes
- **SVGO Optimization**: Enable/disable SVG optimization
- **Prettier Formatting**: Customize code formatting options

## 🌟 Why Use This Tool?

- **No Subscriptions**: Completely free forever
- **Privacy Focused**: All processing happens in your browser
- **Developer Friendly**: Built by developers, for developers
- **Fast & Reliable**: Optimized for speed and accuracy
- **Modern Standards**: Follows React and TypeScript best practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ahmed Mohamed**
- Website: [ahmedmohamed.dev](https://ahmedmohamed.dev)
- GitHub: [@yourusername](https://github.com/yourusername)

---

Made with ❤️ for the React community
