# Hanna LINE Bot MVP

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Ensure PostgreSQL is running.
   - Create a database (e.g., `hanna_db`).
   - Run the schema script:
     ```bash
     psql -d hanna_db -f schema.sql
     ```

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your LINE Channel credentials and Database URL.

4. **Run Server**
   ```bash
   npm start
   ```

5. **Expose to Internet (for LINE Webhook)**
   - Use ngrok:
     ```bash
     ngrok http 3000
     ```
   - Copy the HTTPS URL and set it as the Webhook URL in LINE Developers Console (e.g., `https://xxxx.ngrok-free.app/webhook`).

## Features

- **Onboarding**: 5-step flow to collect user info.
- **Payment**: PromptPay QR generation for subscription.
- **Daily Messages**:
  - 8:00 AM: Glucose check reminder.
  - 7:00 PM: Medication reminder.
