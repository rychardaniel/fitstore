import { useEffect, useState } from 'react';
import { ProductService } from '../services/ProductService';
import { Menu } from '../components/Menu';

export function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    ProductService.list()
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-5 py-5 flex-grow">
      <Menu />
      
      <section className="flex-grow pl-0 md:pl-5">
        <h1 className="text-2xl font-bold mb-4 pb-2.5 border-b-2 border-gray-100">Featured Products</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-start">
          {products.map((product) => (
            <article key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 text-center transition-shadow hover:shadow-lg">
              <div className="bg-gray-100 h-36 flex justify-center items-center mb-2.5 text-gray-400 rounded">
                {/* Image placeholder or actual image */}
                <img 
                  src={`http://localhost:8080/produtos/${product.id}/image`} 
                  alt={product.nome} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerText = 'No Image';
                  }}
                />
              </div>
              <h2 className="text-lg font-semibold mb-1 text-blue-500">{product.nome}</h2>
              <p className="text-sm text-gray-500 mb-2.5">{product.marca?.descricao}</p>
              <p className="text-xl font-bold text-green-600 mb-4">R$ {product.preco?.toFixed(2)}</p>
              <button className="bg-yellow-400 text-gray-800 border-none py-2.5 px-5 rounded cursor-pointer font-bold hover:bg-yellow-500 transition-colors w-full">
                Buy Now
              </button>
            </article>
          ))}
          
          {products.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">Loading products...</p>
          )}
        </div>
      </section>
    </div>
  );
}
