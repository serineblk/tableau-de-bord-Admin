import React, { useState } from 'react';
import '../styles/Navbar.css';
import profileImage from '../assets/profile.webp';
import { 
  FaTachometerAlt, FaBed, FaCalendarAlt, FaUsers, FaEnvelope, 
  FaChartLine, FaCog, FaSignOutAlt, FaConciergeBell, 
  FaCheckCircle, FaBroom, FaChevronRight, FaChevronLeft 
} from 'react-icons/fa';
import { RiHotelLine } from 'react-icons/ri';

function Navbar({ setActiveTab, adminName }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTabState] = useState('dashboard');

  const toggleNavbar = () => setIsCollapsed(!isCollapsed);
  const handleTabClick = (tab) => {
    setActiveTabState(tab);
    setActiveTab(tab);
  };

  return (
    <nav className={isCollapsed ? 'collapsed' : ''}>
      <div className="navbar-header">
        <div className="logo-container">
          <RiHotelLine className="logo-icon" />
          {!isCollapsed && (
            <div>
              <span className="logo-text">RoyelStay</span>
              <span className="logo-subtext">Hôtel de Luxe</span>
            </div>
          )}
        </div>
        
        <button className="toggle-button" onClick={toggleNavbar}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <div className="profile-section">
        <div className="profile-image-container">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <div className="profile-status"></div>
        </div>
        {!isCollapsed && (
          <div className="profile-info">
            <h3 className="profile-name">{adminName}</h3>
            <p className="profile-role">Directeur</p>
            <p className="profile-email">admin@royelstay.com</p>
          </div>
        )}
      </div>

      <div className="nav-divider"></div>

      <div className="nav-buttons">
        {[
          { icon: <FaTachometerAlt />, label: 'Tableau de bord', tab: 'dashboard' },
          { icon: <FaBed />, label: 'Chambres', tab: 'rooms' },
          { icon: <FaCalendarAlt />, label: 'Réservations', tab: 'reservations' },
          { icon: <FaUsers />, label: 'Clients', tab: 'users' },
          { icon: <FaEnvelope />, label: 'Messages', tab: 'messages' },
          { icon: <FaChartLine />, label: 'Analytique', tab: 'reports' },
          { icon: <FaConciergeBell />, label: 'Services', tab: 'services' },
          { icon: <FaCheckCircle />, label: 'Complémentaire', tab: 'compatible' },
          { icon: <FaBroom />, label: 'Ménage', tab: 'cleaning' },
        ].map((item) => (
          <button
            key={item.tab}
            className={activeTab === item.tab ? 'active' : ''}
            onClick={() => handleTabClick(item.tab)}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="nav-footer">
        <button 
          className="logout-button"
          onClick={() => handleTabClick('logout')}
        >
          <FaSignOutAlt className="logout-icon" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;