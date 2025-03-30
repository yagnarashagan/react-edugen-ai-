import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';  // new
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/StaffRegistration.css';

const StaffRegistration = () => {
  const navigate = useNavigate();

  // Ensure the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user is logged in, redirect to login
        navigate('/staff-login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const validateAndSave = async () => {
    const form = document.getElementById('staffForm');
    if (!form.checkValidity()) {
      alert('Please fill all details correctly.');
      return;
    }

    const staffData = {
      staffId: document.getElementById('staffId').value,
      name: document.getElementById('name').value,
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      bloodGroup: document.getElementById('bloodGroup').value,
      contact: document.getElementById('contact').value,
      email: document.getElementById('email').value,
      aadhaar: document.getElementById('aadhaar').value,
    };

    const imageInput = document.getElementById('staffImage');
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        staffData.image = reader.result; // Store the image as a base64 string
        // Save to Firestore under the user's UID
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, 'staff', user.uid), staffData);
          navigate('/staff-dashboard');
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image.');
    }
  };

  return (
    <div className="staff-registration-page">
      <div className="container">
        <h2>Staff Registration Form</h2>
        <p>Fill out the form carefully for registration</p>
        <form id="staffForm">
          <div className="form-group">
            <div>
              <label>Staff ID:</label>
              <input type="text" id="staffId" required />
            </div>
            <div>
              <label>Name:</label>
              <input type="text" id="name" required />
            </div>
          </div>
          <div className="form-group">
            <div>
              <label>Date of Birth:</label>
              <input type="date" id="dob" required />
            </div>
            <div>
              <label>Gender:</label>
              <select id="gender" required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <div>
              <label>Blood Group:</label>
              <input type="text" id="bloodGroup" required />
            </div>
            <div>
              <label>Contact Number:</label>
              <input type="text" id="contact" pattern="[0-9]{10}" required />
            </div>
          </div>
          <div className="form-group">
            <div>
              <label>Email ID:</label>
              <input type="email" id="email" required />
            </div>
            <div>
              <label>Aadhaar No.:</label>
              <input type="text" id="aadhaar" pattern="[0-9]{12}" required />
            </div>
          </div>
          <div>
            <label>Upload Image:</label>
            <input type="file" id="staffImage" accept="image/*" required />
          </div>
          <button type="button" onClick={validateAndSave}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default StaffRegistration;