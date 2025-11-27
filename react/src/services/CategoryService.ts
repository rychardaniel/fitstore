export const CategoryService = {
  list: async () => {
    const response = await fetch('http://localhost:8080/categorias');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }
};
