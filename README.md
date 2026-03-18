# Simple Mail Merge

A lightweight hobby project built to help students efficiently send **multiple personalized application emails** to companies listed in the **OJT Companies List** provided by our school.

This tool removes the repetitive work of manually editing and sending emails—while still keeping each message personalized.

## ✅ 1. Project Overview

**Simple Mail Merge** is a web-based application designed to:
- Send personalized application letters to multiple companies
- Use your **own email account** for sending messages
- Track delivery results through a summary report

This project was built mainly to help students applying for OJT / internships streamline their application process.


---

## ✅ 2. Features

### Application Features

1. Light Mode / Dark Mode 
2. Fully mobile responsive
3. OTP-based authentication
4. Send multiple personalized emails using your **own email** (via Google App Password)
5. Recipient file parsing and validation
6. Email summary report (success rate and list of successful and failed email sends)


---

### Database Tables

#### `tbl_user`

| Name                | Data Type      | Description                                  |
|---------------------|---------------|----------------------------------------------|
| `user_id`           | UUID          | Primary key, auto-generated user ID          |
| `email`             | TEXT          | User email address (unique)                  |
| `otp_hash`          | TEXT          | Hashed OTP for verification                  |
| `expires_at`        | TIMESTAMPTZ   | OTP expiration timestamp                    |
| `attempts`          | INTEGER       | Number of OTP attempts                      |
| `last_login`        | TIMESTAMPTZ   | Last successful login time                  |
| `last_login_attempt`| TIMESTAMPTZ   | Last login attempt timestamp                |
| `created_at`        | TIMESTAMPTZ   | Record creation timestamp                   |
---

## ✅ 3. Business Logic & Validation

### Sender email ownership

- Users must have access to the sender email to complete OTP verification 

### Google App Password

- Required to allow the app to send emails using the user's account

### Recipient import validation

- Invalid email formats are detected before sending

### Security

- OTP expiration handling
- Limited OTP attempts to prevent abuse

---

## ✅ 4. Tech Stack

### Frontend
- React (TypeScript)
- Bootstrap

### Backend
- Express (TypeScript)
- Resend (Email service)
- Supabase Postgres

### Deployment
- AWS Lambda + API Gateway
- Vercel
- Supabase

---

## ✅ 5. Installation / Setup

### Requirements
- Node.js (v18+)
- npm (v9+)
- Supabase account
- Google account (for App Password)
- Resend account

### 1. Clone the repository
```bash
git clone https://github.com/MarcLawrenceKing/mail-merge.git
cd mail-merge
```
### 2. Install Dependencies
Frontend
```bash
cd client
npm install
```
Backend
```bash
cd server
npm install
```

### 3. Create environment file
```bash
cd server
cp .env.example .env
```

### 4. Configure `.env`
Update the following lines with your local database credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres.your-project-ref:your_password@aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require

RESEND_API_KEY=your_resend_api_key

PORT=3000 # or other
JWT_SECRET=secret_to_encrypt_session_token
```

### 5. Run database migrations (Drizzle ORM)
Apply the committed migration to your Supabase project:
```bash
cd server
npm run db:migrate
```

When you change the schema in `server/src/db/schema.ts`, generate a new migration:
```bash
cd server
npm run db:generate
```

`db:migrate` is written to be idempotent for `tbl_user`, so existing data is not deleted.

### 6. Start the development server
Frontend
```bash
cd client
npm run dev
```
Backend
```bash
cd server
npm run dev
```
