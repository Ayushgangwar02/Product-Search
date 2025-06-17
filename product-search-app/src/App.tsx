import React, { useState, useEffect } from 'react';
import ProductSearch from './components/ProductSearch';
import ProductList from './components/ProductList';
import ProductFilters from './components/ProductFilters';
import './App.css';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface FilterOptions {
  brand: string;
  minPrice: number;
  maxPrice: number;
}

export interface SortOption {
  field: 'price' | 'rating';
  direction: 'asc' | 'desc';
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    brand: '',
    minPrice: 0,
    maxPrice: 10000
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'price',
    direction: 'asc'
  });

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters and sorting when products, filters, or sort options change
  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filters, sortOption, searchQuery]);

  const fetchProducts = async (query?: string) => {
    setLoading(true);
    setError('');
    
    try {
      const url = query 
        ? `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
        : 'https://dummyjson.com/products';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      fetchProducts(query);
    } else {
      fetchProducts();
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];
      
      if (sortOption.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Search App</h1>
        <ProductSearch onSearch={handleSearch} />
      </header>
      
      <main className="app-main">
        <aside className="app-sidebar">
          <ProductFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </aside>
        
        <section className="app-content">
          {loading && <div className="loading">Loading products...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && (
            <ProductList products={filteredProducts} />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
