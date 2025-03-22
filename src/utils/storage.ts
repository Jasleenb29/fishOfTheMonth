// Type definition for session data
export interface SessionData {
  id: string;
  hostName: string;
  createdAt: string;
  nominations: Nomination[];
}

// Type definition for a nomination
export interface Nomination {
  id: string;
  nomineeName: string;
  reason: string;
  timestamp: string;
  submitterInfo: string; // Store some basic info to help prevent duplicates
}

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Create a new session
export const createSession = (hostName: string): SessionData => {
  const session: SessionData = {
    id: generateId(),
    hostName,
    createdAt: new Date().toISOString(),
    nominations: []
  };
  
  saveSession(session);
  return session;
};

// Save session to local storage
export const saveSession = (session: SessionData): void => {
  localStorage.setItem(`fish-session-${session.id}`, JSON.stringify(session));
};

// Get session from local storage
export const getSession = (sessionId: string): SessionData | null => {
  const data = localStorage.getItem(`fish-session-${sessionId}`);
  return data ? JSON.parse(data) : null;
};

// Add a nomination to a session
export const addNomination = (
  sessionId: string, 
  nomineeName: string, 
  reason: string
): boolean => {
  const session = getSession(sessionId);
  
  if (!session) return false;
  
  // Generate a simple submitter fingerprint to help identify unique submissions
  // This will be based on user agent + timestamp to be unique enough
  const submitterInfo = `${navigator.userAgent}-${Date.now()}`;
  
  // Check if we can detect a duplicate nomination by the same person
  const possibleDuplicate = session.nominations.some(
    nomination => nomination.nomineeName === nomineeName && 
                  nomination.submitterInfo.split('-')[0] === submitterInfo.split('-')[0]
  );
  
  if (possibleDuplicate) {
    // We found a likely duplicate, but we'll still allow it since we're now using URL params
    console.log('Note: Possible duplicate nomination detected');
  }
  
  const nomination: Nomination = {
    id: generateId(),
    nomineeName,
    reason,
    timestamp: new Date().toISOString(),
    submitterInfo
  };
  
  session.nominations.push(nomination);
  saveSession(session);
  
  return true;
};

// We no longer use these functions since we're moving to URL parameters
// but keeping them for backward compatibility
export const hasNominated = (sessionId: string): boolean => {
  // We'll now rely on server-side or fingerprinting for this
  return false;
};

export const markAsNominated = (sessionId: string): void => {
  // No longer needed with URL parameter approach
};

// Create a shareable URL for nominations
export const createShareableUrl = (sessionId: string): string => {
  return `${window.location.origin}/nominate/${sessionId}`;
};

// Create a host URL with admin access
export const createHostUrl = (sessionId: string): string => {
  return `${window.location.origin}/results/${sessionId}`;
};
