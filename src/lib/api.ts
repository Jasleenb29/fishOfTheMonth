const API_BASE_URL = 'http://localhost:3001/api';

export interface Session {
  hostName: string;
  createdAt: string;
  isActive: boolean;
}

export interface Nomination {
  nominatorName: string;
  nomineeName: string;
  reason: string;
  timestamp: string;
}

export const api = {
  // Create a new session
  createSession: async (hostName: string, sessionId: string): Promise<{ success: boolean; sessionId: string }> => {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName, sessionId }),
    });
    return response.json();
  },

  // Get session details
  getSession: async (sessionId: string): Promise<Session> => {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
    if (!response.ok) {
      throw new Error('Session not found');
    }
    return response.json();
  },

  // Submit nomination
  submitNomination: async (
    sessionId: string,
    nominatorName: string,
    nomineeName: string,
    reason: string
  ): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/nominations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, nominatorName, nomineeName, reason }),
    });
    return response.json();
  },

  // Get session results
  getResults: async (sessionId: string): Promise<Nomination[]> => {
    const response = await fetch(`${API_BASE_URL}/results/${sessionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch results');
    }
    return response.json();
  },

  // Close session
  closeSession: async (sessionId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/close`, {
      method: 'POST',
    });
    return response.json();
  },
}; 