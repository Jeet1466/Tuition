import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const enrollmentId = searchParams.get('enrollmentId');
  const amount = searchParams.get('amount');
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error

  useEffect(() => {
    if (!enrollmentId || !amount) {
      setStatus('error');
    }
  }, [enrollmentId, amount]);

  const handlePayment = async () => {
    setStatus('processing');
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}/mock-pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        
        {status === 'idle' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>💳</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 8 }}>Secure Payment</h2>
            <p style={{ color: 'var(--color-on-surface-var)', marginBottom: 24 }}>
              Complete your pending fee payment for Educating Minds.
            </p>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: 32 }}>
              ₹{amount}
            </div>
            <button 
              onClick={handlePayment}
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Pay Now
            </button>
          </>
        )}

        {status === 'processing' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16, animation: 'spin 1s linear infinite' }}>⏳</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Processing...</h2>
            <p style={{ color: 'var(--color-on-surface-var)' }}>Please do not close this window.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#047857', marginBottom: 8 }}>Payment Successful!</h2>
            <p style={{ color: 'var(--color-on-surface-var)', marginBottom: 24 }}>
              Thank you! ₹{amount} has been received. Your admin has been notified via WhatsApp.
            </p>
            <Link to="/" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Return to Home
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#b91c1c', marginBottom: 8 }}>Payment Failed</h2>
            <p style={{ color: 'var(--color-on-surface-var)', marginBottom: 24 }}>
              There was an issue processing your request. The link might be invalid.
            </p>
            <Link to="/" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Return to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
