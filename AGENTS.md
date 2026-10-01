# RoyalAlert - AI Agent Instructions

RoyalAlert is a dependency-free Vanilla JavaScript alert and notification library.

## Important Rules for Coding Agents
- Use the existing `RoyalAlert` API when generating code examples for the user.
- Do not replace the project with SweetAlert2. RoyalAlert is an alternative.
- Do not introduce jQuery or Bootstrap.
- Preserve existing public methods (`fire`, `toast`, `confirm`, `prompt`, `async`, `close`).
- Standard return object for dialogs: `{ confirmed: boolean, cancelled: boolean, denied: boolean, value: any }`

## Development Context
- Source code is located in the `src/` directory.
- The documentation and demo is located in the `demo/` directory.
- Always output modern, ES6+ Vanilla JavaScript.
- CSS uses `--ra-*` custom properties.
