# Fish of the Month Recognition Program

A web application for managing team recognition through the "Fish of the Month" program. Team members can nominate colleagues who have helped them, and the person with the most nominations is declared the "Fish of the Month."

## Features

- Create and manage recognition sessions
- Share session links with team members
- Submit nominations with reasons
- View results and statistics
- Cross-browser and cross-device compatibility
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Project Structure

```
fish-fame/
├── backend/           # Express.js backend
│   ├── server.js     # Server implementation
│   └── package.json  # Backend dependencies
├── src/              # React frontend
│   ├── components/   # Reusable UI components
│   ├── lib/         # Utilities and API client
│   └── pages/       # Application pages
└── package.json     # Frontend dependencies
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Jasleenb29/fishOfTheMonth.git
cd fish-fame
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

## Running the Application

1. Start the backend server (from the backend directory):
```bash
cd backend
npm start
```
The backend server will run on http://localhost:3001

2. In a new terminal, start the frontend development server:
```bash
# From the project root
npm run dev
```
The frontend will be available at http://localhost:5173

## Usage

1. Visit http://localhost:5173 in your browser
2. Click "Host a Session" to create a new recognition session
3. Enter your name and create the session
4. Share the generated link with your team members
5. Team members can access the link to submit their nominations
6. View results by clicking the "View Results" button in the host view

## Development

- Frontend: React + TypeScript + Vite
- Backend: Express.js
- Styling: TailwindCSS
- State Management: React Query
- Routing: React Router

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
