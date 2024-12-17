export function getToken(): string | null {
  if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('jwt');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof localStorage !== 'undefined') {
      localStorage.setItem('jwt', token);
  }
}

export function clearToken(): void {
  if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('jwt');
  }
}

export function setUserRole(role: string): void {
  if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userRole', role);
  }
}

export function getUserRole(): string | null {
  if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userRole');
  }
  return null;
}