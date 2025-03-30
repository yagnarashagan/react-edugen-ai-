import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';  // new
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeContainer, setActiveContainer] = useState(null);
  const [studentData, setStudentData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'students', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setStudentData(userDoc.data());
        } else {
          navigate('/student-registration');
        }
      } else {
        navigate('/student-login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const toggleContainer = (containerId) => {
    if (activeContainer === containerId) {
      setActiveContainer(null);
    } else {
      setActiveContainer(containerId);
    }
  };

  const redirectToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="student-dashboard-page">
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="profile" onClick={redirectToProfile}>
          <img src={studentData.image || '/profile.jpg'} alt="Profile" />
          <h3>{studentData.name || 'Student'}</h3>
        </div>
        <ul>
          <li onClick={() => toggleContainer('tasks-container')}>
            <i className="fas fa-tasks"></i> <span>Tasks</span>
          </li>
          <li onClick={() => toggleContainer('assignments-container')}>
            <i className="fas fa-file-alt"></i> <span>Assignments</span>
          </li>
          <li onClick={() => toggleContainer('circular-container')}>
            <i className="fas fa-bullhorn"></i> <span>Circular</span>
          </li>
        </ul>
      </div>

      <div className={`main-content ${sidebarActive ? 'active' : ''}`}>
        <div className="header">
          <button className="menu-btn" onClick={toggleSidebar}>☰</button>
          <input type="text" className="search-bar" placeholder="What do you want to learn today?" />
        </div>

        <div id="main-content-section">
          <div id="default-content" style={{ display: activeContainer ? 'none' : 'block' }}>
            <div className="profile-content" onClick={redirectToProfile}>
              <h3>Your Profile</h3>
              <p>
                <strong>Hi {studentData.name || 'Student'}</strong>, you have completed <b>70%</b> of your weekly targets. Keep learning!
              </p>
            </div>
            <h3>Your Subjects</h3>
            <div className="assignments">
              <div className="assignment-box">Cyber Security</div>
              <div className="assignment-box">Embedded System & IOT</div>
              <div className="assignment-box">Software Testing</div>
            </div>
            <h3>Your Assignments</h3>
            <div className="lessons">
              <div className="lesson-box" style={{ backgroundColor: '#ffd700' }}>Food And Nutrition</div>
              <div className="lesson-box" style={{ backgroundColor: '#ff6347' }}>Image And Video Analytics</div>
            </div>
          </div>

          <div id="tasks-container" className={`toggle-container ${activeContainer === 'tasks-container' ? 'active' : ''}`}>
            <div className="container-header">Posted Tasks</div>
            <div className="container-body">
              <div id="task-list">
                <p className="empty-message">No topics posted yet.</p>
              </div>
            </div>
          </div>

          <div id="assignments-container" className={`toggle-container ${activeContainer === 'assignments-container' ? 'active' : ''}`}>
            <div className="container-header">Your Assignments</div>
            <div className="container-body">
              <p className="empty-message">No assignments yet.</p>
            </div>
          </div>

          <div id="circular-container" className={`toggle-container ${activeContainer === 'circular-container' ? 'active' : ''}`}>
            <div className="container-header">Important Circulars</div>
            <div className="container-body">
              <p className="empty-message">No new circulars.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;