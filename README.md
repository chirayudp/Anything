# MoneyQuest

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/chirayudp/Anything.git
cd Anything
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure Gemini API Key:
Create a `.env` file in the root directory:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```
*Note: The platform includes a complete built-in curriculum offline fallback engine and runs 100% locally even without an API key.*

## Running the Application

### 1. Run Frontend Web Application
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port shown in the terminal).

### 2. Run Backend Proxy Engine (Optional for Live Gemini AI & Server Logging)
```bash
npm run server
```

### 3. Run Automated Integration & Engine Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
Preview production build:
```bash
npm run preview
```
