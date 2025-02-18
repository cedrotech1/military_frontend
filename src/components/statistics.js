import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/loading'; // Import the LoadingSpinner component
import { Bar } from 'react-chartjs-2'; // Import Bar chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null); // Initialize with null
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/statistics/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setStatistics(data.data);
          console.log(data.data);
        } else {
          console.error('Failed to fetch Statistics:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Statistics:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4cm', // Use 100% of the viewport height
        }}
      >
        <div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const { role } = user;

  // Prepare data for different bar charts
  const totalUsersVsActiveUsersChart = {
    labels: ['Total Users', 'Active Users'],
    datasets: [
      {
        label: 'Users',
        data: [statistics.totalUsers, statistics.activeUsers],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const totalMissionsVsActiveMissionsChart = {
    labels: ['Total Missions', 'Active Missions'],
    datasets: [
      {
        label: 'Missions',
        data: [statistics.totalMissions, statistics.activeMissions],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const totalAppointmentsVsActiveAppointmentsChart = {
    labels: ['Total Appointments', 'Active Appointments'],
    datasets: [
      {
        label: 'Appointments',
        data: [statistics.totalAppointments, statistics.activeAppointments],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {statistics && (
        <div className="row">
          {/* User Card */}
          <div
            className="col-xl-4"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ paddingLeft: '0.7cm', marginTop: '0.5cm' }}
          >
            <div className="row member" style={{ padding: '0.2cm',border:'1px solid lightgreen' }}>
              <div className="col-xl-4 col-md-6" style={{ backgroundColor: 'whitesmoke',border:'1px solid lightgreen', borderRadius: '3px' }}>
                <h1 style={{ fontSize: '73px',color:'green', fontFamily: 'cursive', textAlign: 'center' }}>
                  {statistics.totalUsers}
                </h1>
              </div>
              <div className="col-xl-7 col-md-6 statistic-info">
                <h5>Total Users</h5>
                <p>Number of users in our system</p>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div
            className="col-xl-4"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ paddingLeft: '0.7cm', marginTop: '0.5cm' }}
          >
             <div className="row member" style={{ padding: '0.2cm',border:'1px solid lightgreen' }}>
              <div className="col-xl-4 col-md-6" style={{ backgroundColor: 'whitesmoke',border:'1px solid lightgreen', borderRadius: '3px' }}>
                <h1 style={{ fontSize: '73px',color:'green', fontFamily: 'cursive', textAlign: 'center' }}>
                  {statistics.activeUsers}
                </h1>
              </div>
              <div className="col-xl-7 col-md-6 statistic-info">
                <h5>Active Users</h5>
                <p>Number of active users in our system</p>
              </div>
            </div>
          </div>

          {/* Missions Card */}
          <div
            className="col-xl-4"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ paddingLeft: '0.7cm', marginTop: '0.5cm' }}
          >
             <div className="row member" style={{ padding: '0.2cm',border:'1px solid lightgreen' }}>
              <div className="col-xl-4 col-md-6" style={{ backgroundColor: 'whitesmoke',border:'1px solid lightgreen', borderRadius: '3px' }}>
                <h1 style={{ fontSize: '73px',color:'green', fontFamily: 'cursive', textAlign: 'center' }}>
                  {statistics.totalMissions}
                </h1>
              </div>
              <div className="col-xl-7 col-md-6 statistic-info">
                <h5>Total Missions</h5>
                <p>Number of total missions in the system</p>
              </div>
            </div>
          </div>

          {/* Active Missions Card */}
          <div
            className="col-xl-4"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ paddingLeft: '0.7cm', marginTop: '0.5cm' }}
          >
             <div className="row member" style={{ padding: '0.2cm',border:'1px solid lightgreen' }}>
              <div className="col-xl-4 col-md-6" style={{ backgroundColor: 'whitesmoke',border:'1px solid lightgreen', borderRadius: '3px' }}>
                <h1 style={{ fontSize: '73px',color:'green', fontFamily: 'cursive', textAlign: 'center' }}>
                  {statistics.activeMissions}
                </h1>
              </div>
              <div className="col-xl-7 col-md-6 statistic-info">
                <h5>Active Missions</h5>
                <p>Number of active missions in the system</p>
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div
            className="col-xl-4"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ paddingLeft: '0.7cm', marginTop: '0.5cm' }}
          >
            <div className="row member" style={{ padding: '0.2cm',border:'1px solid lightgreen' }}>
              <div className="col-xl-4 col-md-6" style={{ backgroundColor: 'whitesmoke',border:'1px solid lightgreen', borderRadius: '3px' }}>
                <h1 style={{ fontSize: '73px',color:'green', fontFamily: 'cursive', textAlign: 'center' }}>
                  {statistics.totalAppointments}
                </h1>
              </div>
              <div className="col-xl-7 col-md-6 statistic-info">
                <h5>Total Appointments</h5>
                <p> total appointments</p>
              </div>
            </div>
          </div>

          {/* Active Appointments Card */}
          <div
            className="col-xl-4"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ paddingLeft: '0.7cm', marginTop: '0.5cm' }}
          >
             <div className="row member" style={{ padding: '0.2cm',border:'1px solid lightgreen' }}>
              <div className="col-xl-4 col-md-6" style={{ backgroundColor: 'whitesmoke',border:'1px solid lightgreen', borderRadius: '3px' }}>
                <h1 style={{ fontSize: '73px',color:'green', fontFamily: 'cursive', textAlign: 'center' }}>
                  {statistics.activeAppointments}
                </h1>
              </div>
              <div className="col-xl-7 col-md-6 statistic-info">
                <h5>Active Appointments</h5>
                <p> active appointments </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bar Charts */}
      <br />
      <div className="row member m-3">
        <div className="col-12 col-md-4 mb-3">
          <Bar data={totalUsersVsActiveUsersChart} />
        </div>
        <div className="col-12 col-md-4 mb-3">
          <Bar data={totalMissionsVsActiveMissionsChart} />
        </div>
        <div className="col-12 col-md-4 mb-3">
          <Bar data={totalAppointmentsVsActiveAppointmentsChart} />
        </div>
      </div>

    </div>
  );
};

export default App;
