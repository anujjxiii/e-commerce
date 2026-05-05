import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Check, ShieldCheck, Truck, Plus, Minus, Share2, Ruler, X } from 'lucide-react';
import BackButton from '../components/BackButton';
import Preloader from '../components/Preloader';
import PageTitle from '../components/PageTitle';
import ProductCard from '../components/ProductCard';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { FALLBACK_IMAGE, formatPrice, getOriginalPrice } from '../utils/formatters';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [stockWarning] = useState(() => Math.floor(Math.random() * 5) + 1);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`, { signal: controller.signal });
        const data = response.data;
        setProduct(data);
        
        // Save to Recently Viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const updated = [data, ...recentlyViewed.filter(p => p.id !== data.id)].slice(0, 4);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));

        // Fetch Related
        const relatedRes = await api.get(`/products?category=${data.category}`, { signal: controller.signal });
        setRelatedProducts(relatedRes.data.filter(p => p.id !== data.id).slice(0, 4));
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.userMessage || 'Failed to load product details. Please try again.');
        }
      }
    };
    
    fetchProduct();
    window.scrollTo(0, 0);

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`, { signal: controller.signal });
        setProduct(response.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.userMessage || 'Failed to load product details. Please try again.');
        }
      }
    };
    
    fetchProduct();
    window.scrollTo(0, 0);

    return () => controller.abort();
  }, [id]);

  if (error) return <div className="container" style={{ padding: '100px', textAlign: 'center', color: '#e11b23', fontWeight: 'bold' }}>{error}</div>;
  if (!product) return <Preloader />;

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, quantity });
    setIsAdded(true);
    showToast(`${product.name} added to bag!`, 'success');
    setTimeout(() => setIsAdded(false), 2000);
  };

  const updateQuantity = (val) => {
    setQuantity(prev => Math.max(1, prev + val));
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <PageTitle title={product.name} />
      <div className="breadcrumbs">
        <Link to="/">HOME</Link>
        <span>/</span>
        <Link to={`/?gender=${product.gender || 'Men'}`}>{product.gender ? product.gender.toUpperCase() : 'UNISEX'}</Link>
        <span>/</span>
        <Link to={`/?gender=${product.gender || 'Men'}&category=${product.category}`}>{product.category ? product.category.toUpperCase() : 'APPAREL'}</Link>
        <span>/</span>
        <span>{product.name.toUpperCase()}</span>
      </div>

      <BackButton label="Back to Shop" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }} className="pdp-grid">
        
          {/* Left: Product Image */}
        <div style={{ borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
          <div className="product-image-container">
            <img 
              src={product.image || FALLBACK_IMAGE} 
              alt={product.name} 
              loading="lazy"
              onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }}
              className="zoom-image"
              style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover', aspectRatio: '4/5', transition: 'transform 0.5s' }} 
            />
          </div>
          <button 
            onClick={() => toggleWishlist(product)}
            className="product-card-icon-button"
            style={{ position: 'absolute', top: '20px', right: '20px', width: '45px', height: '45px', zIndex: 10 }}
          >
            <Heart size={20} fill={isInWishlist(product.id) ? '#e11b23' : 'none'} color={isInWishlist(product.id) ? '#e11b23' : '#333'} />
          </button>
        </div>

        {/* Right: Product Info */}
        <div style={{ padding: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', background: 'var(--ss-light-grey)', padding: '4px 10px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
              {product.gender ? product.gender.toUpperCase() : 'UNISEX'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {product.category ? product.category.toUpperCase() : 'APPAREL'}
            </span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '900', lineHeight: '1.2', marginBottom: '15px', letterSpacing: '-1px' }}>
            {product.name.toUpperCase()}
          </h1>

          {/* Scarcity / Inventory Warning */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff9800', animation: 'pulse 1.5s infinite' }}></div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#ff9800' }}>ONLY {stockWarning} LEFT IN STOCK - ACT FAST!</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <p style={{ fontSize: '28px', fontWeight: '900', color: '#e11b23' }}>{formatPrice(product.price)}</p>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#999', textDecoration: 'line-through' }}>{formatPrice(getOriginalPrice(product.price))}</p>
            <span style={{ background: '#e11b23', color: 'white', padding: '4px 8px', fontSize: '11px', fontWeight: '900', borderRadius: '4px' }}>SAVE 30%</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' }}>
            {product.description || "Premium quality streetwear designed for maximum comfort and an unmistakable aesthetic. Elevate your daily rotation with this exclusive piece."}
          </p>

          {/* Qty and Size Selector */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {/* Size Selector */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: '900' }}>SELECT SIZE</div>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--ss-red)', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Ruler size={14} /> SIZE GUIDE
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '50px', height: '50px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s',
                      background: selectedSize === size ? 'var(--ss-dark)' : 'transparent',
                      color: selectedSize === size ? 'white' : 'var(--text-primary)',
                      border: selectedSize === size ? '2px solid var(--ss-dark)' : '2px solid var(--border-color)'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty Selector */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: '900', marginBottom: '15px' }}>QUANTITY</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '2px solid var(--border-color)', borderRadius: '8px', padding: '8px 15px', width: 'fit-content' }}>
                <button onClick={() => updateQuantity(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-primary)' }}><Minus size={18} /></button>
                <span style={{ fontSize: '16px', fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => updateQuantity(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-primary)' }}><Plus size={18} /></button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            style={{ width: '100%', padding: '20px', background: isAdded ? '#008080' : '#e11b23', color: 'white', fontSize: '16px', fontWeight: '800', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: '0.3s', marginBottom: '20px' }}
          >
            {isAdded ? <><Check size={20} /> ADDED TO BAG</> : <><ShoppingBag size={20} /> ADD TO BAG</>}
          </button>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!', 'success');
              }}
              style={{ flex: 1, padding: '12px 20px', background: 'var(--ss-light-grey)', color: 'var(--text-primary)', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Share2 size={18} /> COPY PRODUCT LINK
            </button>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', background: 'var(--ss-light-grey)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={20} color="var(--ss-red)" />
              <div>
                <p style={{ fontSize: '12px', fontWeight: '900' }}>FREE SHIPPING</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>On all orders</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--ss-red)" />
              <div>
                <p style={{ fontSize: '12px', fontWeight: '900' }}>100% AUTHENTIC</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '950', marginBottom: '30px', borderLeft: '5px solid #e11b23', paddingLeft: '15px' }}>YOU MAY ALSO LIKE</h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onWishlistToggle={toggleWishlist} isWishlisted={isInWishlist(p.id)} />
            ))}
          </div>
        </section>
      )}

      {/* RECENTLY VIEWED */}
      <section style={{ marginTop: '80px', padding: '40px', background: 'var(--ss-light-grey)', borderRadius: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '950', marginBottom: '30px' }}>RECENTLY VIEWED</h2>
        <div className="product-grid">
          {JSON.parse(localStorage.getItem('recentlyViewed') || '[]').filter(p => p.id !== product.id).map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} onWishlistToggle={toggleWishlist} isWishlisted={isInWishlist(p.id)} />
          ))}
        </div>
      </section>

      {/* SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="search-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '40px', borderRadius: '16px', maxWidth: '500px', width: '90%', position: 'relative' }}>
            <button onClick={() => setIsSizeGuideOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={24} /></button>
            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>SIZE GUIDE</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ background: 'var(--ss-light-grey)' }}>
                  <th style={{ padding: '12px' }}>SIZE</th>
                  <th style={{ padding: '12px' }}>CHEST (IN)</th>
                  <th style={{ padding: '12px' }}>LENGTH (IN)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>S</td><td>38</td><td>27</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>M</td><td>40</td><td>28</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>L</td><td>42</td><td>29</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>XL</td><td>44</td><td>30</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>* measurements are approximate and may vary slightly by product style.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
