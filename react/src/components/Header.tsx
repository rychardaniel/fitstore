import { Search, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-blue-500 text-white py-4 px-8 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-white no-underline">
          Ecommerce
        </Link>

        <div className="flex-grow max-w-lg w-full mx-5 bg-white rounded overflow-hidden flex">
          <input
            type="text"
            className="flex-grow border-none p-2.5 text-base text-gray-700 focus:outline-none"
            placeholder="Search products..."
          />
          <button className="bg-blue-700 text-white border-none p-2.5 cursor-pointer hover:bg-blue-800 transition-colors">
            <Search size={20} />
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <Link to="/register" className="text-white no-underline text-sm p-1 hover:opacity-80 flex items-center gap-1">
            <User size={18} />
            Register
          </Link>
          <Link to="/cart" className="text-white no-underline font-bold flex items-center hover:opacity-80">
            <ShoppingCart size={20} />
            <span className="bg-yellow-400 text-gray-800 rounded-full px-2 py-0.5 text-xs ml-1">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
