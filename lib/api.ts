const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerUser(user: { username: string; email: string; passwordHash: string; role: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register');
  }

  return response.json();
}

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (response.ok){
    const { access_token, role } = data;
    localStorage.setItem('jwt', access_token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', data.id);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  return { access_token: data.access_token, role: data.role }; // This should return the JWT token
}

export async function fetchUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function fetchUserById(id: number) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function fetchUserByEmail(email: string) {
  const response = await fetch(`${API_BASE_URL}/users/${email}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function fetchUserTransactions(token: string, userId: number) {
  const response = await fetch(`${API_BASE_URL}/transactions/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.error('Failed to fetch user transactions:', data);
    throw new Error(data.message || 'Failed to fetch user transactions');
  }
  return response.json();
}

export async function fetchUserCategories(id: number) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user categories');
  }
  return response.json();
}

export async function updateUser(id: number, user: { username: string; email: string }) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
}

export async function fetchTransactions(token: string) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.error('Failed to fetch transactions:', data);
    throw new Error(data.message || 'Failed to fetch transactions');
  }
  return response.json();
}

export async function fetchDashboardSummary(token: string) {
  const response = await fetch(`${API_BASE_URL}/transactions/summary`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Include the token correctly
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.error('Failed to fetch dashboard summary:', data); // Log response details
    throw new Error(data.message || 'Failed to fetch dashboard summary');
  }

  return response.json();
}

export async function fetchDashboardBarChart(token: string) {
  const response = await fetch(`${API_BASE_URL}/transactions/weekly-income-expense`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Include the token correctly
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.error('Failed to fetch dashboard bar chart:', data); // Log response details
    throw new Error(data.message || 'Failed to fetch dashboard bar chart');
  }

  return response.json();
}

export async function fetchDashboardPieChart(token: string) {
  const response = await fetch(`${API_BASE_URL}/transactions/category-usage-percent`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Include the token correctly
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.error('Failed to fetch dashboard pie chart:', data); // Log response details
    throw new Error(data.message || 'Failed to fetch dashboard pie chart');
  }

  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function fetchCategoryById(id: number) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }
  return response.json();
}

export async function createCategory(category: { name: string; type: string }) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  return response.json();
}

export async function createTransaction(transaction: {
  type: string;
  amount: number;
  categoryId?: number;
  userId: number;
}, token: string) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,  // Include the token correctly
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }
  return response.json();
}