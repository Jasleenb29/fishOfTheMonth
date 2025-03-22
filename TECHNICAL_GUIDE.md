# Fish Fame - Technical Implementation Guide

## Core Concepts and Implementation Details

## 1. Session Management System

### A. Session Creation
#### Implementation (`Host.tsx` & `server.js`)
```typescript
// 1. Session ID Generation
import { nanoid } from 'nanoid';
const newSessionId = nanoid(); // Creates unique session ID like "V1StGXR8_Z5jdHi6B-myT"

// 2. Session Data Structure
interface Session {
  hostName: string;
  createdAt: string;
  isActive: boolean;
}

// 3. Session Storage (backend)
const sessions = {
  [sessionId]: {
    hostName: "John Doe",
    createdAt: "2024-03-22T10:30:00Z",
    isActive: true
  }
}
```

#### Process Flow
1. Host enters their name
2. Frontend generates unique session ID using `nanoid()`
3. Backend creates session entry in `db.json`
4. Returns confirmation and session URLs

### B. URL Generation System
```typescript
// 1. URL Generation in Host.tsx
const nominationUrl = `${window.location.origin}/nominate/${sessionId}`;
const resultsUrl = `${window.location.origin}/results/${sessionId}`;

// 2. URL Structure
- Nomination URL: https://fish-fame.vercel.app/nominate/[sessionId]
- Results URL: https://fish-fame.vercel.app/results/[sessionId]
```

## 2. Nomination System

### A. Nomination Form Implementation
#### Data Structure (`Nominate.tsx`)
```typescript
interface Nomination {
  nominatorName: string;
  nomineeName: string;
  reason: string;
  timestamp: string;
  sessionId: string;
}
```

#### Form Validation
```typescript
const validateNomination = (data: Nomination) => {
  if (!data.nomineeName.trim()) {
    throw new Error("Nominee name is required");
  }
  if (!data.reason.trim()) {
    throw new Error("Reason for nomination is required");
  }
};
```

### B. Storage System
#### Backend Implementation (`server.js`)
```javascript
// Nomination storage structure in db.json
{
  "sessions": { ... },
  "nominations": {
    "sessionId123": [
      {
        nominatorName: "Alice",
        nomineeName: "Bob",
        reason: "Outstanding performance",
        timestamp: "2024-03-22T10:35:00Z"
      }
    ]
  }
}
```

## 3. Results System

### A. Results Calculation
#### Implementation (`Results.tsx`)
```typescript
// 1. Nomination Counting
const nominationCounts: Record<string, number> = {};
nominations.forEach((nomination) => {
  const name = nomination.nomineeName;
  nominationCounts[name] = (nominationCounts[name] || 0) + 1;
});

// 2. Percentage Calculation
const calculatePercentage = (count: number) => {
  return ((count / totalNominations) * 100).toFixed(1);
};
```

### B. Real-time Updates
```typescript
// Results.tsx useEffect implementation
useEffect(() => {
  const fetchData = async () => {
    const [sessionData, nominationsData] = await Promise.all([
      api.getSession(sessionId),
      api.getResults(sessionId)
    ]);
    setSession(sessionData);
    setNominations(nominationsData);
  };
  
  fetchData();
}, [sessionId]);
```

## 4. API Integration System

### A. API Structure (`api.ts`)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  // 1. Session Management
  createSession: async (hostName: string, sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName, sessionId })
    });
    return response.json();
  },

  // 2. Nomination Submission
  submitNomination: async (sessionId: string, data: NominationData) => {
    const response = await fetch(`${API_BASE_URL}/nominations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, ...data })
    });
    return response.json();
  },

  // 3. Results Retrieval
  getResults: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/results/${sessionId}`);
    return response.json();
  }
};
```

## 5. UI Component System

### A. Card Component
```typescript
// Card.tsx - Glassmorphism Implementation
interface CardProps {
  children: React.ReactNode;
  glassmorphism?: boolean;
}

const Card: React.FC<CardProps> = ({ children, glassmorphism }) => {
  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-lg",
        glassmorphism && "bg-white/20 backdrop-blur-md border border-white/10"
      )}
    >
      {children}
    </div>
  );
};
```

### B. Button Component
```typescript
// Button.tsx - Reusable Button Implementation
interface ButtonProps {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  isLoading,
  icon
}) => {
  return (
    <button
      className={cn(
        "rounded-lg flex items-center justify-center",
        variantStyles[variant],
        sizeStyles[size],
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      {isLoading ? <Spinner /> : icon}
      {children}
    </button>
  );
};
```

## 6. State Management

### A. Local State Management
```typescript
// Example from Host.tsx
const [hostName, setHostName] = useState('');
const [sessionId, setSessionId] = useState<string | null>(null);
const [isCreating, setIsCreating] = useState(false);
```

### B. Form State Management
```typescript
// Example from Nominate.tsx
const [formData, setFormData] = useState<NominationForm>({
  nomineeName: '',
  reason: ''
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

## 7. Error Handling System

### A. Frontend Error Handling
```typescript
// Global Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### B. Backend Error Handling
```javascript
// Error Middleware (server.js)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error'
      : err.message
  });
});
```

## 8. Data Persistence System

### A. File-based Storage
```javascript
// File Operations (server.js)
const DB_FILE = path.join(__dirname, 'db.json');

async function readDB() {
  const data = await fs.readFile(DB_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}
```

## 9. Security Implementation

### A. CORS Configuration
```javascript
// CORS Setup (server.js)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://fish-fame-c12ytl8fr-jasleens-projects-9f78d231.vercel.app']
    : ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
```

### B. Input Sanitization
```typescript
// Input Sanitization Example
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500); // Limit length
};
```

## 10. Deployment Configuration

### A. Frontend (Vercel)
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://fish-fame-backend.onrender.com/api"
  }
}
```

### B. Backend (Render)
```yaml
# render.yaml
services:
  - type: web
    name: fish-fame-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

## Feature Implementation Examples

### 1. Creating and Managing a Session
```typescript
// Host.tsx - Session Creation Flow
const createSession = async () => {
  try {
    const sessionId = nanoid();
    await api.createSession(hostName, sessionId);
    const nominationUrl = `/nominate/${sessionId}`;
    const resultsUrl = `/results/${sessionId}`;
    // Store URLs for sharing
  } catch (error) {
    handleError(error);
  }
};
```

### 2. Submitting a Nomination
```typescript
// Nominate.tsx - Nomination Submission
const submitNomination = async () => {
  try {
    validateInput(formData);
    await api.submitNomination(sessionId, {
      ...formData,
      timestamp: new Date().toISOString()
    });
    showSuccess();
  } catch (error) {
    showError(error);
  }
};
```

### 3. Viewing Results
```typescript
// Results.tsx - Results Processing
const processResults = (nominations: Nomination[]) => {
  const counts = nominations.reduce((acc, nom) => {
    acc[nom.nomineeName] = (acc[nom.nomineeName] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / nominations.length * 100).toFixed(1)
    }));
};
```

---

This technical guide serves as a comprehensive reference for understanding the implementation details of each feature in the Fish Fame application. For specific questions or clarifications, please refer to the relevant code sections or contact the development team. 