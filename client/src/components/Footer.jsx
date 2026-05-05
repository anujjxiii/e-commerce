import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="premium-footer" style={{ background: 'var(--ss-dark)', color: 'white', padding: '80px 0 40px' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px', marginBottom: '80px' }}>
          
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 style={{ fontSize: '32px', fontWeight: '950', marginBottom: '20px', letterSpacing: '-1.5px' }}>AURA.</h2>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
              Elevating streetwear with premium fabrics and unapologetic design. 100% Cotton. 100% Drip.
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '12px', letterSpacing: '1px' }}>INSTAGRAM</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '12px', letterSpacing: '1px' }}>TWITTER</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '12px', letterSpacing: '1px' }}>TIKTOK</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 style={{ fontSize: '13px', fontWeight: '950', marginBottom: '25px', letterSpacing: '1px' }}>SHOP</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li><Link to="/?gender=Men" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>MEN'S COLLECTION</Link></li>
              <li><Link to="/?gender=Women" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>WOMEN'S COLLECTION</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>NEW ARRIVALS</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>BEST SELLERS</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4 style={{ fontSize: '13px', fontWeight: '950', marginBottom: '25px', letterSpacing: '1px' }}>SUPPORT</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li><Link to="/profile" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>TRACK ORDER</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>RETURNS & EXCHANGES</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>SHIPPING INFO</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4 style={{ fontSize: '13px', fontWeight: '950', marginBottom: '25px', letterSpacing: '1px' }}>JOIN THE REVOLUTION</h4>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
              Subscribe for early access to drops and exclusive offers.
            </p>
            <div className="newsletter-box" style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px 15px', color: 'white', fontSize: '11px', fontWeight: '800', width: '100%', borderRadius: '4px' }}
              />
              <button style={{ background: 'var(--ss-red)', border: 'none', color: 'white', padding: '12px 20px', fontWeight: '900', fontSize: '11px', cursor: 'pointer', borderRadius: '4px', letterSpacing: '1px' }}>JOIN</button>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#444', fontSize: '11px', fontWeight: '800' }}>&copy; 2026 AURA STORE. ALL RIGHTS RESERVED.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ color: '#444', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>PRIVACY</span>
            <span style={{ color: '#444', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>TERMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
