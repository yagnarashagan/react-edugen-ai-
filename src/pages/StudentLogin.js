import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import '../styles/StudentLogin.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu7IM06IkZliwAbRxloNV624Nq20AZ1lM",
  authDomain: "edugen-ai-d0086.firebaseapp.com",
  projectId: "edugen-ai-d0086",
  storageBucket: "edugen-ai-d0086.appspot.com",
  messagingSenderId: "874369597730",
  appId: "1:874369597730:web:a9d7c1288985232c8e657b",
  measurementId: "G-FF610BWLB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const StudentLogin = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    showPassword: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has completed registration
        const userDoc = await getDoc(doc(db, "students", user.uid));
        if (userDoc.exists()) {
          navigate('/student-dashboard');
        } else {
          navigate('/student-registration');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const togglePassword = () => {
    setLoginData(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const email = `${loginData.username}@edugenai.com`;
      await signInWithEmailAndPassword(auth, email, loginData.password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Error during Google Sign-In. Please try again.");
    }
  };

  return (
    <div className="student-login-container">
      <div className="login-container">
        <div className="login-title">STUDENT LOGIN</div>
        <img src="/student.png" alt="Student" className="login-image" />
        
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <span>👤</span>
            <input 
              type="text" 
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              placeholder="Username" 
              required 
            />
          </div>

          <div className="input-group">
            <span>🔒</span>
            <input 
              type={loginData.showPassword ? "text" : "password"} 
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Password" 
              required 
            />
            <span className="eye-icon" onClick={togglePassword}>
              {loginData.showPassword ? '👁️‍🗨️' : '👁'}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">LOGIN</button>
        </form>   

        <button 
          onClick={handleGoogleSignIn} 
          className="login-btn google-btn"
        >
          Sign in with Google
        </button>

        <p className="toggle-form-text">
          Don't have an account? 
          <button 
            className="toggle-form-link" 
            onClick={() => navigate('/student-registration')}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};
// In the useEffect of StudentLogin.js
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "students", user.uid));
        if (userDoc.exists()) {
          navigate('/student-dashboard');
        } else {
          navigate('/student-registration');
        }
      } catch (err) {
        console.error("Error checking user registration:", err);
        setError("Error verifying your account. Please try again.");
      }
    }
  });
  return () => unsubscribe();
}, [navigate]);

export default StudentLogin;