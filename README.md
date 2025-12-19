# Supabase Admin Interface

A React + TypeScript admin interface for managing Events and Opportunities in a Supabase database, with AI-powered URL scraping capabilities.

## Features

- **Events Management**: Full CRUD interface for managing events with fields like title, date, location, provider, cost, and more
- **Opportunities Management**: Full CRUD interface for managing job and volunteer opportunities
- **AI-Powered Scraping**: Automatically extract and fill form data from URLs using Claude AI
- **Clean UI**: Simple, responsive interface built with React and TypeScript
- **Type Safety**: Full TypeScript support with Supabase type definitions

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account with a project set up
- Anthropic API key (for Claude AI scraping feature)

## Setup Instructions

### 1. Database Setup

First, create the tables in your Supabase database by running the SQL from these files:

**Events table**: Already provided in your schema

**Opportunities table**: Run the SQL from `opportunities-schema.sql`:
```bash
# In your Supabase SQL editor, run the contents of:
cat opportunities-schema.sql
```

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Where to find these values:**

- **Supabase URL & Anon Key**:
  1. Go to your Supabase project dashboard
  2. Click on "Settings" (gear icon)
  3. Click on "API"
  4. Copy "Project URL" and "anon public" key

- **Anthropic API Key**:
  1. Go to https://console.anthropic.com/
  2. Create an account or log in
  3. Go to "API Keys"
  4. Create a new API key

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

The application consists of two servers that run concurrently:
- **Vite dev server** (port 5174): Serves the React frontend
- **Express API server** (port 3001): Handles URL scraping with Claude AI

Start both servers with:

```bash
npm run dev
```

The app will be available at: **http://localhost:5174**

## Usage

### Managing Events

1. Click "Events" in the navigation
2. View all events in a table format
3. Click "Create New Event" to add an event
4. Use the "Auto-fill from URL" tool to scrape event data from a webpage
5. Click "Edit" to modify an event or "Delete" to remove it

### Managing Opportunities

1. Click "Opportunities" in the navigation
2. View all opportunities (jobs/volunteer positions) in a table format
3. Click "Create New Opportunity" to add a new listing
4. Use the "Auto-fill from URL" tool to scrape opportunity data from a webpage
5. Click "Edit" to modify or "Delete" to remove an opportunity

### AI Scraping Feature

The scraping tool at the top of each form allows you to:

1. Paste a URL for an event or opportunity listing
2. Click "Scrape & Fill"
3. Claude AI will fetch the page, analyze it, and extract relevant information
4. The form fields will be automatically populated with the extracted data
5. Review and adjust the data before saving

## Project Structure

```
aw-admin/
├── src/
│   ├── components/
│   │   ├── EventsList.tsx        # Events list view
│   │   ├── EventForm.tsx         # Event create/edit form
│   │   ├── OpportunitiesList.tsx # Opportunities list view
│   │   ├── OpportunityForm.tsx   # Opportunity create/edit form
│   │   └── ScraperTool.tsx       # URL scraping component
│   ├── lib/
│   │   └── supabase.ts           # Supabase client & types
│   ├── App.tsx                   # Main app with routing
│   └── main.tsx                  # App entry point
├── server.js                     # Express API for scraping
├── opportunities-schema.sql      # SQL for Opportunities table
├── .env                          # Environment variables (create this)
├── .env.example                  # Environment template
└── package.json
```

## Available Scripts

- `npm run dev` - Start both frontend and API servers
- `npm run dev:vite` - Start only the Vite dev server
- `npm run dev:api` - Start only the API server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Supabase** - Database and backend
- **Anthropic Claude** - AI-powered web scraping
- **Express** - API server for scraping

## Troubleshooting

### Port conflicts
If port 5174 or 3001 is already in use, you can:
- Stop the conflicting process
- Change the port in `vite.config.ts` (for Vite) or `server.js` (for API)

### Supabase connection errors
- Verify your `.env` file has the correct credentials
- Check that your Supabase project is active
- Ensure your tables are created with the correct schema

### Scraping not working
- Verify your Anthropic API key is correct
- Check that the API server is running on port 3001
- Make sure the URL you're scraping is publicly accessible
- Check browser console and terminal for error messages

## Security Notes

- The `.env` file contains sensitive credentials and should never be committed to git
- The Supabase anon key is safe to expose in the frontend
- For production, implement proper authentication and Row Level Security (RLS) in Supabase
- Consider using environment-specific API keys for development vs production

## License

MIT
