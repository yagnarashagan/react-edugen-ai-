import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';  // new
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import staffIcon from '../assets/staff.png';
import '../styles/StaffLogin.css';

const StaffLogin = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already logged in and redirect accordingly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, check if registration details exist in Firestore
        const userDocRef = doc(db, 'staff', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // Registration details exist, go to dashboard
          navigate('/staff-dashboard');
        } else {
          // No registration details, go to registration form
          navigate('/staff-registration');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const correctEmail = 'navil@gmail.com';
    const correctPassword = 'navil6';

    if (email === correctEmail && password === correctPassword) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // User will be redirected via the useEffect hook
        })
        .catch((error) => {
          setError('Invalid email or password.');
        });
    } else {
      setError('Invalid email or password.');
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="staff-login-page">
      <div className="login-container">
        <div className="login-title">STAFF LOGIN</div>
        <img src={staffIcon} alt="Staff Icon" />
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input type="email" id="email" placeholder="Email ID" required />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input type={showPassword ? 'text' : 'password'} id="password" placeholder="Password" required />
            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`} onClick={togglePassword}></i>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;