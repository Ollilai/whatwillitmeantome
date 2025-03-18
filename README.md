# WhatWillItMeanToMe

A web application that helps users understand the potential impact of AI and AGI on their careers and lives.

## About

WhatWillItMeanToMe is an open-source project designed to raise conversation about the effect of AI and the imminent arrival of AGI. The application provides personalized insights based on your profession, experience, and location.

## Tech Stack

- Frontend: Next.js, Tailwind, Shadcn, Framer Motion
- Backend: Postgres, Supabase, Drizzle ORM, Server Actions
- AI: Mistral AI

## Getting Started

### Prerequisites

You will need:
- Node.js and npm
- A Supabase account for the database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ollilai/whatwillitmeantome.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy the `.env.example` file to `.env.local` and fill in the required values.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is open source and available under the [MIT License](LICENSE).

## Environment Setup

This project requires several environment variables to function properly. These are stored in a `.env.local` file that should never be committed to version control.

1. Create a `.env.local` file in the root of the project
2. Copy the variables from `.env.example` and add your own values:

```
# Database Connection
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]

# AI API Keys
MISTRAL_API_KEY=your_mistral_api_key_here
```

### Required Services

To run this project, you'll need:
- A PostgreSQL database (we use Supabase)
- A Mistral AI API key (available from [Mistral AI Console](https://console.mistral.ai/))

### Security Notice

⚠️ **Important**: Never commit sensitive credentials to Git! See our [Security Policy](SECURITY.md) for more information on handling credentials securely.
