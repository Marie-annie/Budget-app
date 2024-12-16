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