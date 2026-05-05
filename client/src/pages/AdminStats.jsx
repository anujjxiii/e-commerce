import { useState, useEffect } from 'react';
import api from '../api/client';
import { Database, Users, Package, CreditCard, RefreshCw, Lock, ShieldAlert } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const AdminStats = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'anuj') {
      setIsAuthorized(true);
      fetchStats();
    } else {
      setLoginError('Invalid Admin Credentials!');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch database stats.');
    } finally {
      setLoading(false);
    }
  };

  // Login Screen
  if (!isAuthorized) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#111',
        fontFamily: 'system-ui'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '20px', 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Lock size={48} style={{ color: '#e11b23', marginBottom: '15px' }} />
            <h1 style={{ fontWeight: '950', fontSize: '24px' }}>ADMIN ACCESS</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Enter credentials to view database</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', marginBottom: '5px' }}>USERNAME</label>
              <input 
                type="text" 
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee' }}
                placeholder="Enter admin username"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', marginBottom: '5px' }}>PASSWORD</label>
              <input 
                type="password" 
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee' }}
                placeholder="••••••••"
              />
            </div>
            {loginError && <p style={{ color: '#e11b23', fontSize: '12px', fontWeight: '800', marginBottom: '15px' }}>{loginError}</p>}
            <button type="submit" style={{ 
              width: '100%', 
              padding: '15px', 
              background: '#e11b23', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '900', 
              cursor: 'pointer' 
            }}>
              AUTHORIZE ACCESS
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !data) return <div style={{ padding: '100px', textAlign: 'center', fontWeight: '900' }}>ACCESSING DATABASE...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'system-ui' }}>
      {/* Mini Admin Nav */}
      <div style={{ background: '#000', color: '#fff', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '20px', fontWeight: '950', color: '#e11b23' }}>AURA ADMIN PANEL</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#008080' }}>● DB CONNECTED</span>
          <button onClick={() => setIsAuthorized(false)} style={{ background: 'none', border: '1px solid #444', color: '#fff', padding: '5px 15px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>LOGOUT</button>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '950', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database size={32} /> LIVE DATABASE
          </h1>
          <button onClick={fetchStats} style={{ 
            padding: '10px 20px', 
            borderRadius: '8px', 
            background: '#eee', 
            border: 'none', 
            fontWeight: '900', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer'
          }}>
            <RefreshCw size={18} /> REFRESH
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          
          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '1.5px solid #eee' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} /> USERS ({data.users.length})
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

          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '1.5px solid #eee' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={20} /> PRODUCTS ({data.products.length})
            </h2>
            <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>ITEM</th>
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

          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '1.5px solid #eee', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} /> TRANSACTIONS ({data.payments.length})
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>ORDER REF</th>
                    <th style={{ padding: '10px' }}>AMOUNT</th>
                    <th style={{ padding: '10px' }}>METHOD</th>
                    <th style={{ padding: '10px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payments.map(py => (
                    <tr key={py.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontWeight: '800', fontSize: '11px' }}>{py.reference}</td>
                      <td style={{ padding: '10px', fontWeight: '900', color: '#e11b23' }}>{formatPrice(py.amount)}</td>
                      <td style={{ padding: '10px', textTransform: 'uppercase' }}>{py.method}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminStats;
