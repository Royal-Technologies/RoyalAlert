# Contributing to RoyalAlert

Thank you for your interest in contributing to RoyalAlert!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mehdi/royal-alert.git
   cd royal-alert
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server (loads the demo page):
   ```bash
   npm run dev
   ```

## Project Structure

- `src/` - Source code for the library.
- `styles/` - CSS files.
- `demo/` - Demo HTML and JS.
- `tests/` - Vitest test files.

## Running Tests

```bash
npm test
```

## Building the Library

```bash
npm run build
```

This will generate the `dist/` directory containing ESM, UMD, and minified IIFE builds along with the merged CSS.

## Pull Requests

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

Please ensure all tests pass and no unnecessary dependencies are introduced. RoyalAlert must remain a zero-dependency library.
