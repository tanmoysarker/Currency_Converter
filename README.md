# Currency Converter (Next.js)

Convert AUD → 5 currencies using Open Exchange Rates.
Click a currency to view 14-day exchange history.

### Setup
1. `cp .env.local.example .env.local`
2. Add your OXR key.
3. `npm i`
4. `npm run dev`

### Docker
docker build -t currency-converter .
docker run -p 3000:3000 --env OXR_APP_ID=YOUR_APP_ID currency-converter

### Notes
- Free plan supports only `latest.json` and `historical/{date}.json`.
- Base currency is USD — we derive AUD→Target by `rates[target]/rates[AUD]`.


