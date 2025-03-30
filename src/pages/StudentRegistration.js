import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';  // new
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/StudentRegistration.css';

const StudentRegistration = () => {
  const navigate = useNavigate();

  // Ensure the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user is logged in, redirect to login
        navigate('/student-login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const validateAndSave = async () => {
    const form = document.getElementById('studentForm');
    if (!form.checkValidity()) {
      alert('Please fill all details correctly.');
      return;
    }

    const studentData = {
      regNumber: document.getElementById('regNumber').value,
      rollNumber: document.getElementById('rollNumber').value,
      course: document.getElementById('course').value,
      name: document.getElementById('name').value,
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      bloodGroup: document.getElementById('bloodGroup').value,
      studentContact: document.getElementById('studentContact').value,
      email: document.getElementById('email').value,
      aadhaar: document.getElementById('aadhaar').value,
    };

    const imageInput = document.getElementById('studentImage');
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        studentData.image = reader.result; // Store the image as a base64 string
        // Save to Firestore under the user's UID
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, 'students', user.uid), studentData);
          navigate('/student-dashboard');
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image.');
    }
  };

  return (
    <div className="student-registration-page">
      <div className="container">
        <h2>Registration Form</h2>
        <p>Fill out the form carefully for registration</p>
        <form id="studentForm">
          <div className="form-group">
            <div>
              <label>Register Number:</label>
              <input type="text" id="regNumber" pattern="[0-9]{11}" required />
            </div>
            <div>
              <label>Roll Number:</label>
              <input type="text" id="rollNumber" required />
            </div>
          </div>
          <div className="form-group">
            <div>
              <label>Course:</label>
              <input type="text" id="course" required />
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
              <label>Student Contact Number:</label>
              <input type="text" id="studentContact" pattern="[0-9]{10}" required />
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
            <input type="file" id="studentImage" accept="image/*" required />
          </div>
          <button type="button" onClick={validateAndSave}>Submit</button>
        </form>
      </div>
    </div>
  );
};
// In the useEffect of StudentRegistration.js
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      navigate('/student-login');
    } else {
      // Check if user is already registered
      const userDoc = await getDoc(doc(db, "students", user.uid));
      if (userDoc.exists()) {
        navigate('/student-dashboard');
      }
    }
  });
  return () => unsubscribe();
}, [navigate]);
export default StudentRegistration;