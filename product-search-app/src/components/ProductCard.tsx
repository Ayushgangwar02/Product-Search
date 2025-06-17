import React, { useState } from 'react';
import { Product } from '../App';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
    return price - (price * discountPercentage / 100);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const discountedPrice = product.discountPercentage > 0 
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : product.price;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageLoading && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        {imageError ? (
          <div className="image-placeholder error">
            <span>📷</span>
            <p>Image not available</p>
          </div>
        ) : (
          <img
            src={product.thumbnail}
            alt={product.title}
            className={`product-image ${imageLoading ? 'loading' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {product.discountPercentage > 0 && (
          <div className="discount-badge">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-rating">
          <div className="stars">
            {renderStars(product.rating)}
          </div>
          <span className="rating-value">({product.rating})</span>
        </div>
        
        <div className="product-pricing">
          <div className="price-container">
            <span className="current-price">{formatPrice(discountedPrice)}</span>
            {product.discountPercentage > 0 && (
              <span className="original-price">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
        
        <div className="product-stock">
          <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
