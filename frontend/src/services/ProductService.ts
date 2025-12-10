export const ProductService = {
  list: async () => {
    const response = await fetch('http://localhost:8080/produtos');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }
};
