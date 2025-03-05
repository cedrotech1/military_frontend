import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav } from 'react-bootstrap';
import { BsHouseDoor, BsFileBarGraph } from "react-icons/bs";
import { BiUser, BiCategory, BiCalendarCheck, BiCog, BiWorld, BiBuilding, BiTargetLock } from "react-icons/bi";

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { FaBell } from 'react-icons/fa';
import Badge from 'react-bootstrap/Badge';

const LandingPage = () => {
  const [obj, setObj] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token') || !localStorage.getItem('user')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setObj(parsedUser);
    } else {
      console.error('User information not found in local storage');
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/notification/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminMenu = [
    { name: 'Overview', icon: <BsHouseDoor />, to: '/dashboard' },
    { name: 'Manage Users', icon: <BsHouseDoor />, to: '/users' },
    { name: 'Manage Soldier', icon: <BsHouseDoor />, to: '/soldier' },
    { name: 'Manage Skills', icon: <BiWorld />, to: '/skills' }, 
    { name: 'Manage Departments', icon: <BiBuilding />, to: '/department' }, 
    { name: 'Manage Batarians', icon: <BiBuilding />, to: '/batarians' }, 
    { name: 'Settings', icon: <BiCog />, to: '/settings' },

    { name: 'Missions', icon: <BiTargetLock />, to: '/missions' },
    { name: 'Country Missions', icon: <BiWorld />, to: '/country' }, 
    { name: 'Appointment', icon: <BiCalendarCheck />, to: '/appointment' },
  ];

  const officerMenu = [
    { name: 'Dashboard', icon: <BsHouseDoor />, to: '/dashboard' },
    { name: 'Missions', icon: <BiTargetLock />, to: '/missions' },
    { name: 'Country Missions', icon: <BiWorld />, to: '/country' }, 
    { name: 'Appointment', icon: <BiCalendarCheck />, to: '/appointment' },
    { name: 'Settings', icon: <BiCog />, to: '/settings' },
    { name: 'Report', icon: <BsFileBarGraph />, to: '/reports' }
  ];

  const getMenu = () => {
    switch (obj.role) {
      case 'admin':
        return adminMenu;
      case 'Commander-Officer':
        return officerMenu;
      default:
        return [];
    }
  };

  return (
    <div style={{ border: '0px solid green', backgroundColor: 'white', color: 'green', marginTop: '-2cm',marginLeft:'-0.5cm' }} 
         className="col-md-2 d-none d-md-block sidebar border-end position-fixed vh-100">
      
      <div className="text-center">
        <Link to="/settings">
          <img 
            src={obj.image && obj.image !== 'null' ? obj.image : "/assets/img/images (3).png"} 
            className="rounded-circle mb-3" 
            alt="User" 
            style={{ height: '3cm', width: '3cm', marginTop: '0.5cm' }} 
          />
        </Link>
        <h6 className="fw-bold">{obj.firstname} {obj.lastname}</h6>
        <p className="text-muted" style={{ fontSize: '14px', fontStyle: 'italic' }}>{obj.role}</p>
      </div>

      <div className="position-relative text-center">
        <Link to="/notifications" className="text-dark text-decoration-none">
          <FaBell size={24} />
          {unreadCount > 0 && (
            <Badge pill bg="danger" className="position-absolute translate-middle">
              {unreadCount}
            </Badge>
          )}
        </Link>
      </div>

      <Nav className="flex-column mt-2">
        <ul className="list-unstyled">
          {getMenu().map((menuItem, index) => (
            <li key={index}>
              <Link to={menuItem.to} className="nav-link d-flex align-items-center text-dark">
                <span className="me-2">{menuItem.icon}</span> {menuItem.name}
              </Link>
            </li>
          ))}
        </ul>
      </Nav>

      <div className="text-center mt-3">
        <Link to="/logout" className="btn btn-sm" 
              style={{ border: '1px solid lightgreen', backgroundColor: 'lightgreen', color: 'black', marginTop: '', width: '80%' }}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
