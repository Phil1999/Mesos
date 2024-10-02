
# Mesos

 
**Mesos** is a financial dashboard application that offers users a comprehensive overview of their transactions, income, and expenses. Built with **Next.js**, **TypeScript**, and **Tailwind CSS**, it features dynamic charts, account insights, and a customizable date range selector to provide detailed financial reports.

![Dashboard](https://github.com/user-attachments/assets/56f6f621-3ee8-45d5-af0b-03eac553420f)

## Features

-  **Financial Overview**: Get insights on remaining balances, income, and expenses.

-  **Customizable Reports**: Select date ranges and filter by account to view detailed financial summaries.

-  **Data Visualizations**: Leverage multiple graphs and charts to easily view your financial insights at a glance.

-  **Secure Authentication**: Integrated with Clerk for user authentication.

-  **Responsive Design**: Optimized for all screen sizes with a clean and intuitive UI.
-  **Bulk Delete and Bulk Imports for transactions**: Easily bulk import transaction data from a .csv file and bulk delete accounts, transactions, and categories.

  Note: As a default, the API only returns the last 30d of transactions if filters aren't set.

## Tech Stack

  -  **Frontend**: Next.js, React, TypeScript, Tailwind CSS

-  **State Management**: React Query, Zustand

-  **Backend**: Drizzle ORM, Hono, Neon Database (PostgreSQL), Clerk

-  **Charts**: Recharts


## Installation

  

1. Clone the repository:

```bash

git clone https://github.com/Phil1999/Mesos.git

cd mesos
```

Install dependencies:

  

```bash
npm install
```
Set up environment variables:
Duplicate .env.example to .env.local and fill in the required fields.

Run the development server:
```bash
npm run dev
```
Access the app at http://localhost:3000.

  
Scripts
dev: Start the development server.

```bash
npm run dev
```
build: Build the project for production.

```bash
npm run build
```
start: Start the production server.

```bash
npm start
```
Database:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed # optionally fill in db with seed script.
npm run db:studio # View the database locally at https://local.drizzle.studio
```
Screenshots

![Transaction Page](https://github.com/user-attachments/assets/bdd2e6ae-131e-4cf0-9c5c-38811456d24c)

![Mobile Dashboard](https://github.com/user-attachments/assets/28fa2a34-a692-491f-9532-2b7c954df6c6)
