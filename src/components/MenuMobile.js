import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav } from 'react-bootstrap';
import { BsHouseDoor, BsFileBarGraph } from "react-icons/bs";
import { BiUser, BiCategory, BiCalendarCheck, BiCog, BiWorld, BiBuilding, BiTargetLock } from "react-icons/bi";

import '../css/main2.css';
import { Link, useNavigate } from 'react-router-dom';

import { FaBell } from 'react-icons/fa';
import Badge from 'react-bootstrap/Badge';

const LandingPage = () => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const [obj, setObj] = useState('');
  const [rest, SetResto] = useState('');
  const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // Initialize with 0
    

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
      setStatus(parsedUser.status);
      setImage(parsedUser.image);
      SetResto(parsedUser.restaurents);
    } else {
      console.error('User information not found in local storage');
    }
  }, []);

  // Fetch notifications
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
          setUnreadCount(data.unreadCount || 0); // Update unread notification count
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Poll every 30 seconds to update notifications
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

     const adminMenu = [
       { name: 'Dashboard', icon: <BsHouseDoor />, to: '/dashboard' },
       { name: 'Users', icon: <BiUser />, to: '/resto_dash' },
       { name: 'Categories', icon: <BiCategory />, to: '/categories' }, 
       { name: 'Country', icon: <BiWorld />, to: '/country' }, 
       { name: 'Department', icon: <BiBuilding />, to: '/department' }, 
       { name: 'Settings', icon: <BiCog />, to: '/settings' },
     ];
   
     const officerMenu = [
       { name: 'Dashboard', icon: <BsHouseDoor />, to: '/dashboard' },
       { name: 'Missions', icon: <BiTargetLock />, to: '/missions' }, 
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
    <>
      <div>
        <div className="membery">
          <center>
            <Link to="/settings">
              {obj.image && obj.image !== 'null' ? (
                <img 
                  src={obj.image} 
                  className="img-fluid" 
                  alt="" 
                  style={{ borderRadius: '100%', marginBottom: '0.5cm', height: '3.2cm', width: '3cm' }} 
                />
              ) : (
                <img 
                  src="/assets/img/images (3).png" 
                  className="img-fluid" 
                  alt="Default Image" 
                  style={{ borderRadius: '100%', marginBottom: '0.5cm', height: '3cm', width: '3cm' }} 
                />
              )}
            </Link>
            <h5>{obj.firstname} {obj.lastname}</h5>
            <p className='titlex' style={{ fontStyle: 'italic', fontSize: '14px' }}>{obj.role}</p>

            <div className="position-relative" style={{ marginTop: '0 cm', marginBottom: '0.5cm' }}>
              <Link to="/notifications" style={{ textDecoration: 'none', color: 'inherit' }}>
                <FaBell size={24} style={{ cursor: 'pointer' }} />
                {unreadCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute translate-middle">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            </div>
          </center>
        </div>

        <Nav className="flex-column">
          <center>
            {getMenu().map((menuItem, index) => (
              <Link key={index} to={menuItem.to} className="nav-link" style={{ textTransform: 'capitalize', fontFamily: 'monospace', fontStyle: 'italic', textAlign: 'center' }}>
                {menuItem.icon} {menuItem.name}
                {menuItem.badge && (
                  <span className="badge bg-danger ms-2" style={{ borderRadius: '50%', padding: '3px 7px' }}>
                    {menuItem.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="d-flex justify-content-center">
              <a 
                href="/logout" 
                className="btn-get-started" 
                style={{ backgroundColor: '#b6b5b5', borderRadius: '6px', fontFamily: 'monospace', textDecoration: 'none', padding: '0.2cm', width: '4cm', marginTop: '1.5cm', color: 'black' }}
              >
                Logout
              </a>
            </div>
          </center>
        </Nav>
      </div>
    </>
  );
};

export default LandingPage;
