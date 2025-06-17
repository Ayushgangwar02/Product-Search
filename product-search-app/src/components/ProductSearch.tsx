import React, { useState } from 'react';
import './ProductSearch.css';

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate input - ensure it's not empty
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    // Additional validation - minimum length
    if (searchQuery.trim().length < 2) {
      setError('Search term must be at least 2 characters long');
      return;
    }

    // Clear error and perform search
    setError('');
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery('');
    setError('');
    onSearch(''); // This will fetch all products
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for products (e.g., phone, laptop, shoes...)"
            className={`search-input ${error ? 'error' : ''}`}
            aria-label="Search products"
          />
          <div className="search-buttons">
            <button 
              type="submit" 
              className="search-button"
              disabled={!searchQuery.trim()}
            >
              🔍 Search
            </button>
            {searchQuery && (
              <button 
                type="button" 
                onClick={handleClear}
                className="clear-button"
                aria-label="Clear search"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
      </form>
      
      <div className="search-suggestions">
        <span className="suggestions-label">Try searching for:</span>
        <button 
          type="button" 
          onClick={() => { setSearchQuery('phone'); onSearch('phone'); }}
          className="suggestion-chip"
        >
          phone
        </button>
        <button 
          type="button" 
          onClick={() => { setSearchQuery('laptop'); onSearch('laptop'); }}
          className="suggestion-chip"
        >
          laptop
        </button>
        <button 
          type="button" 
          onClick={() => { setSearchQuery('shoes'); onSearch('shoes'); }}
          className="suggestion-chip"
        >
          shoes
        </button>
      </div>
    </div>
  );
};

export default ProductSearch;
