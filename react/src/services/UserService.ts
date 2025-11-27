export const UserService = {
  createUser: async (user: any) => {
    const response = await fetch('http://localhost:8080/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  }
};
