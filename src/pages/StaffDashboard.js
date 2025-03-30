import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';  // new
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/StaffDashboard.css';

const StaffDashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeContainer, setActiveContainer] = useState(null);
  const [staffData, setStaffData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'staff', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setStaffData(userDoc.data());
        } else {
          navigate('/staff-registration');
        }
      } else {
        navigate('/staff-login');
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
    <div className="staff-dashboard-page">
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="profile" onClick={redirectToProfile}>
          <img src={staffData.image || '/staff.png'} alt="Profile" />
          <h3>{staffData.name || 'Staff'}</h3>
        </div>
        <ul>
          <li onClick={() => toggleContainer('tasks-container')}>
            <i className="fas fa-tasks"></i> <span>Tasks</span>
          </li>
          <li onClick={() => toggleContainer('assignments-container')}>
            <i className="fas fa-file-alt"></i> <span>Assignments</span>
          </li>
          <li onClick={() => toggleContainer('results-container')}>
            <i className="fas fa-list-ol"></i> <span>Results</span>
          </li>
        </ul>
      </div>

      <div className={`main-content ${sidebarActive ? 'active' : ''}`}>
        <div className="header">
          <button className="menu-btn" onClick={toggleSidebar}>☰</button>
          <input type="text" className="search-bar" placeholder="Search students, assignments..." />
        </div>

        <div id="main-content-section">
          <div id="default-content" style={{ display: activeContainer ? 'none' : 'block' }}>
            <div className="quick-stats">
              <h2>Quick Stats</h2>
              <div className="stats-container">
                <div className="stat-box">
                  <i className="fas fa-users"></i>
                  <h3>Total Students</h3>
                  <p>250</p>
                </div>
                <div className="stat-box">
                  <i className="fas fa-user-check"></i>
                  <h3>Active Students</h3>
                  <p>180</p>
                </div>
                <div className="stat-box" onClick={() => toggleContainer('tasks-container')}>
                  <i className="fas fa-tasks"></i>
                  <h3>Tasks</h3>
                  <p>View</p>
                </div>
                <div className="stat-box">
                  <i className="fas fa-chart-line"></i>
                  <h3>Overall Performance</h3>
                  <p>85%</p>
                </div>
              </div>
            </div>
          </div>

          <div id="tasks-container" className={`toggle-container ${activeContainer === 'tasks-container' ? 'active' : ''}`}>
            <div className="container-header">Posted Topics</div>
            <div className="container-body">
              <div id="task-list">
                <p className="empty-message">No topics posted yet.</p>
              </div>
            </div>
          </div>

          <div id="assignments-container" className={`toggle-container ${activeContainer === 'assignments-container' ? 'active' : ''}`}>
            <div className="container-header">Assignments</div>
            <div className="container-body">
              <p className="empty-message">No assignments yet.</p>
            </div>
          </div>

          <div id="results-container" className={`toggle-container ${activeContainer === 'results-container' ? 'active' : ''}`}>
            <div className="container-header">Results</div>
            <div className="container-body">
              <p className="empty-message">No results available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;