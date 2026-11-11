# Cryptonite

Single page application with information and live reports about virtual currencies.
Built with React, TypeScript and Redux.

## Links

- GitHub: https://github.com/Rivka9893/cryptonite
- Live site: https://rivka9893.github.io/cryptonite/

## Features

- **Home** – 100 popular coins as cards, live search, "More Info" with prices in USD / EUR / ILS, and a switch to select up to 5 coins (saved in the browser).
- **Reports** – one live chart (updated every second, one request) for all selected coins in USD. Prices come from the public Binance market-data API (no key needed), because the CryptoCompare API from the assignment now requires a paid/keyed account.
- **Recommendations** – ChatGPT recommendation (buy / don't buy + explanation) for a selected coin. The OpenAI API key is entered on the page and kept only in the browser session, so no key is stored in the code.
- **About** – project description and personal details (edit `src/pages/About.tsx` and replace `public/profile.jpg` with a different photo).

## Run

```
npm install
npm run dev
```

## Build

```
npm run build
```
