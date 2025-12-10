import { useEffect, useState } from 'react';
import { CategoryService } from '../services/CategoryService';

export function Menu() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    CategoryService.list()
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <aside className="w-full md:w-64 p-4 bg-white rounded shadow-sm mb-5 md:mb-0 md:mr-5 h-fit">
      <div className="mb-5 pb-2.5 border-b border-gray-100">
        <h4 className="mb-2.5 text-blue-500 font-bold">Categories</h4>
        <ul className="list-none">
          {categories.map((category) => (
            <li key={category.id} className="mb-1.5">
              <a href="#" className="text-gray-600 hover:text-blue-500 text-sm no-underline">
                {category.descricao}
              </a>
            </li>
          ))}
          {categories.length === 0 && (
             <>
                <li className="mb-1.5"><a href="#" className="text-gray-600 hover:text-blue-500 text-sm no-underline">Electronics</a></li>
                <li className="mb-1.5"><a href="#" className="text-gray-600 hover:text-blue-500 text-sm no-underline">Clothing</a></li>
                <li className="mb-1.5"><a href="#" className="text-gray-600 hover:text-blue-500 text-sm no-underline">Home & Garden</a></li>
             </>
          )}
        </ul>
      </div>
      
      <div className="mb-5 pb-2.5 border-b border-gray-100">
        <h4 className="mb-2.5 text-blue-500 font-bold">Price Range</h4>
         <ul className="list-none">
            <li className="mb-1.5"><a href="#" className="text-gray-600 hover:text-blue-500 text-sm no-underline">Up to $50</a></li>
            <li className="mb-1.5"><a href="#" className="text-gray-600 hover:text-blue-500 text-sm no-underline">$50 to $100</a></li>
            <li className="mb-1.5"><a href="#" className="text-gray-600 hover:text-blue-500 text-sm no-underline">Over $100</a></li>
         </ul>
      </div>
    </aside>
  );
}
