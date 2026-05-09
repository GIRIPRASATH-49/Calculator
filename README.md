# 🧮 Calculator

A sleek, fully functional calculator built with pure **HTML**, **CSS**, and **JavaScript** — no frameworks, no dependencies.

---

## 📁 Project Structure

```
calculator/
├── index.html     # Markup & layout
├── style.css      # Styling & animations
├── script.js      # Calculator logic
└── README.md      # Project documentation
```

---

## 🚀 Getting Started

1. **Clone or download** the project folder
2. Open `index.html` in any modern browser
3. Start calculating!

> No build tools, no npm install — just open and run.

---

## ✨ Features

- **Basic Operations** — Addition, Subtraction, Multiplication, Division
- **Special Functions** — Toggle sign (`+/−`), Percentage (`%`), Decimal (`.`)
- **Chained Calculations** — Evaluate multiple operations in sequence (e.g. `3 + 5 × 2`)
- **Live Expression Display** — Shows the running expression above the result
- **Keyboard Support** — Use your keyboard for full input control
- **Backspace** — Delete the last digit while typing
- **Error Handling** — Displays `Error` on division by zero
- **Animations** — Pop animation on equals, ripple hover effects on buttons
- **Active Operator Highlight** — Selected operator button stays highlighted
- **Responsive Font Sizing** — Result text shrinks automatically for long numbers

---

## ⌨️ Keyboard Shortcuts

| Key             | Action              |
|-----------------|---------------------|
| `0` – `9`       | Enter digits        |
| `.`             | Decimal point       |
| `+` `-` `*` `/` | Operators           |
| `Enter` or `=`  | Calculate result    |
| `Escape`        | Clear (AC)          |
| `Backspace`     | Delete last digit   |

---

## 🎨 Design

- **Theme** — Dark background with a warm gold accent (`#f5a623`)
- **Fonts** — [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) for the display · [DM Mono](https://fonts.google.com/specimen/DM+Mono) for buttons
- **Layout** — CSS Grid for the button pad
- **Effects** — Cursor-tracked ripple on hover, press animation, glow radial gradient

---

## 🧠 How It Works

### State Management (`script.js`)

The calculator maintains a simple state object:

```js
const state = {
  current:    '0',   // Number currently being typed
  previous:   '',    // Number before the operator
  operator:   null,  // Pending operator (+, -, *, /)
  justEvaled: false, // Whether "=" was just pressed
};
```

### Core Flow

```
User taps a number  →  handleNumber()
User taps operator  →  handleOperator()  →  chains if needed
User taps "="       →  handleEquals()    →  calculate() + animate
User taps "AC"      →  handleClear()     →  reset state
```

### `calculate(a, op, b)`

```js
function calculate(a, op, b) {
  const x = parseFloat(a), y = parseFloat(b);
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return y === 0 ? 'Error' : x / y;
  }
}
```

---

## 🌐 Browser Support

Works in all modern browsers:

| Browser | Supported |
|---------|-----------|
| Chrome  | ✅ |
| Firefox | ✅ |
| Safari  | ✅ |
| Edge    | ✅ |

---

## 📄 License

This project is open source and free to use for personal or educational purposes.

---

> Built with ❤️ using plain HTML, CSS & JavaScript.
