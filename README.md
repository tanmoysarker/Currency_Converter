# Currency Converter (Next.js)

- A modern, responsive currency converter built with Next.js that provides real-time exchange rates and historical data visualization.
- Convert AUD → 5 currencies using Open Exchange Rates.
- Click a currency to view 14-day exchange history.

### Setup
1. `cp .env.local.example .env.local`
2. Add your OXR key.
3. `npm i`
4. `npm run dev`

### Docker

```
docker build -t currency-converter .
docker run -p 3000:3000 --env OXR_APP_ID=YOUR_APP_ID currency-converter
```

### Notes
- Free plan supports only `latest.json` and `historical/{date}.json`.
- Base currency is USD — we derive AUD→Target by `rates[target]/rates[AUD]`.


### Screenshots

<img width="1508" height="788" alt="Screenshot 2025-10-25 at 12 26 28 pm" src="https://github.com/user-attachments/assets/1503b645-f7ec-42ed-8fd2-ec2449387620" />

<img width="1510" height="795" alt="Screenshot 2025-10-25 at 12 27 06 pm" src="https://github.com/user-attachments/assets/1f22891f-0381-40cc-bf6b-eea44685fc87" />

<img width="1507" height="796" alt="Screenshot 2025-10-25 at 12 26 45 pm" src="https://github.com/user-attachments/assets/574b6163-8500-4c0a-88c8-72c46e152e95" />


