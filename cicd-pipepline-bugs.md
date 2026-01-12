2s
Run npm run lint

> utang-tracker@1.0.0 lint
> eslint .

/home/runner/work/payment-calculator/payment-calculator/playwright.config.js
Error: 6:17 error 'process' is not defined no-undef
Error: 7:12 error 'process' is not defined no-undef
Error: 8:12 error 'process' is not defined no-undef
Error: 27:27 error 'process' is not defined no-undef

/home/runner/work/payment-calculator/payment-calculator/public/sw.js
Error: 4:35 error 'event' is defined but never used no-unused-vars

/home/runner/work/payment-calculator/payment-calculator/src/components/ui/button.jsx
Error: 44:18 error Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components react-refresh/only-export-components

/home/runner/work/payment-calculator/payment-calculator/src/hooks/useAuth.jsx
Error: 58:17 error Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components react-refresh/only-export-components

/home/runner/work/payment-calculator/payment-calculator/vite.config.js
Error: 11:25 error '\_\_dirname' is not defined no-undef

/home/runner/work/payment-calculator/payment-calculator/vitest.config.js
Error: 15:25 error '\_\_dirname' is not defined no-undef

✖ 9 problems (9 errors, 0 warnings)

Error: Process completed with exit code 1.
Run npm run lint

> utang-tracker@1.0.0 lint
> eslint .

/home/runner/work/payment-calculator/payment-calculator/playwright.config.js
Error: 6:17 error 'process' is not defined no-undef
Error: 7:12 error 'process' is not defined no-undef
Error: 8:12 error 'process' is not defined no-undef
Error: 27:27 error 'process' is not defined no-undef

/home/runner/work/payment-calculator/payment-calculator/public/sw.js
Error: 4:35 error 'event' is defined but never used no-unused-vars

/home/runner/work/payment-calculator/payment-calculator/src/components/ui/button.jsx
Error: 44:18 error Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components react-refresh/only-export-components

/home/runner/work/payment-calculator/payment-calculator/src/hooks/useAuth.jsx
Error: 58:17 error Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components react-refresh/only-export-components

/home/runner/work/payment-calculator/payment-calculator/vite.config.js
Error: 11:25 error '\_\_dirname' is not defined no-undef

/home/runner/work/payment-calculator/payment-calculator/vitest.config.js
Error: 15:25 error '\_\_dirname' is not defined no-undef

✖ 9 problems (9 errors, 0 warnings)

Error: Process completed with exit code 1.

Nexxt:

Run Tests: vite.config.js#L11
'\_\_dirname' is not defined
Run Tests: src/hooks/useTheme.jsx#L40
Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
Run Tests: src/hooks/useAuth.jsx#L58
Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
Run Tests: src/components/ui/button.jsx#L44
Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
Run Tests: src/components/ui/badge.jsx#L34
Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
Run Tests: public/sw.js#L4
'event' is defined but never used
Run Tests: playwright.config.js#L27
'process' is not defined
Run Tests: playwright.config.js#L8
'process' is not defined
Run Tests: playwright.config.js#L7
'process' is not defined
Run Tests: playwright.config.js#L6
'process' is not defined
Run Tests
No files were found with the provided path: playwright-report/. No artifacts will be uploaded.

(somewhat similar to the previous error)
