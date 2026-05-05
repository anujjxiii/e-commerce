import { useState, useEffect } from 'react';
import api from '../api/client';
import { Database, Users, Package, CreditCard, RefreshCw } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const AdminStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch database stats. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading live database data...</div>;
  if (error) return <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '950', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database size={32} color="#e11b23" /> LIVE DATABASE MONITOR
          </h1>
          <p style={{ color: '#666', fontWeight: '700' }}>Status: <span style={{ color: '#008080' }}>{data.db_status}</span></p>
        </div>
        <button onClick={fetchStats} className="btn-red" style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={18} /> REFRESH DATA
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* Users Section */}
        <div style={{ background: '#f8f8f8', padding: '25px', borderRadius: '15px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} /> REGISTERED USERS ({data.users.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>NAME</th>
                  <th style={{ padding: '10px' }}>EMAIL</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: '800' }}>{u.username}</td>
                    <td style={{ padding: '10px', color: '#666' }}>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Section */}
        <div style={{ background: '#f8f8f8', padding: '25px', borderRadius: '15px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={20} /> PRODUCTS IN DB ({data.products.length})
          </h2>
          <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>PRODUCT</th>
                  <th style={{ padding: '10px' }}>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: '800' }}>{p.name}</td>
                    <td style={{ padding: '10px' }}>{formatPrice(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments Section */}
        <div style={{ background: '#f8f8f8', padding: '25px', borderRadius: '15px', border: '1px solid #eee', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={20} /> RECENT PAYMENTS ({data.payments.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>REF</th>
                  <th style={{ padding: '10px' }}>AMOUNT</th>
                  <th style={{ padding: '10px' }}>METHOD</th>
                  <th style={{ padding: '10px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No payments yet</td></tr>
                ) : (
                  data.payments.map(py => (
                    <tr key={py.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontWeight: '800', fontSize: '11px' }}>{py.reference}</td>
                      <td style={{ padding: '10px', fontWeight: '900', color: '#e11b23' }}>{formatPrice(py.amount)}</td>
                      <td style={{ padding: '10px', textTransform: 'uppercase' }}>{py.method}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '10px', 
                          fontWeight: '900',
                          background: py.status === 'paid' ? '#e6f4f1' : '#fff1f1',
                          color: py.status === 'paid' ? '#008080' : '#e11b23'
                        }}>
                          {py.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStats;
