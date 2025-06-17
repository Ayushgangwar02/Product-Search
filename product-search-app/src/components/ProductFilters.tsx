import React, { useState } from 'react';
import { FilterOptions, SortOption } from '../App';
import './ProductFilters.css';

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  sortOption,
  onSortChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      brand: e.target.value
    });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onFilterChange({
      ...filters,
      minPrice: value
    });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 10000;
    onFilterChange({
      ...filters,
      maxPrice: value
    });
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({
      ...sortOption,
      field: e.target.value as 'price' | 'rating'
    });
  };

  const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({
      ...sortOption,
      direction: e.target.value as 'asc' | 'desc'
    });
  };

  const clearFilters = () => {
    onFilterChange({
      brand: '',
      minPrice: 0,
      maxPrice: 10000
    });
    onSortChange({
      field: 'price',
      direction: 'asc'
    });
  };

  const hasActiveFilters = filters.brand || filters.minPrice > 0 || filters.maxPrice < 10000;

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Filters & Sort</h3>
        <button 
          className="toggle-filters"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Sorting Section */}
        <div className="filter-section">
          <h4>Sort By</h4>
          <div className="sort-controls">
            <div className="form-group">
              <label htmlFor="sort-field">Sort by:</label>
              <select
                id="sort-field"
                value={sortOption.field}
                onChange={handleSortFieldChange}
                className="form-select"
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sort-direction">Order:</label>
              <select
                id="sort-direction"
                value={sortOption.direction}
                onChange={handleSortDirectionChange}
                className="form-select"
              >
                <option value="asc">
                  {sortOption.field === 'price' ? 'Low to High' : 'Low to High'}
                </option>
                <option value="desc">
                  {sortOption.field === 'price' ? 'High to Low' : 'High to Low'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="filter-section">
          <h4>Brand</h4>
          <div className="form-group">
            <input
              type="text"
              id="brand-filter"
              value={filters.brand}
              onChange={handleBrandChange}
              placeholder="Enter brand name..."
              className="form-input"
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-range">
            <div className="form-group">
              <label htmlFor="min-price">Min Price:</label>
              <input
                type="number"
                id="min-price"
                value={filters.minPrice}
                onChange={handleMinPriceChange}
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="max-price">Max Price:</label>
              <input
                type="number"
                id="max-price"
                value={filters.maxPrice}
                onChange={handleMaxPriceChange}
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
          </div>
          <div className="price-display">
            ${filters.minPrice} - ${filters.maxPrice}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="filter-section">
            <button 
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
