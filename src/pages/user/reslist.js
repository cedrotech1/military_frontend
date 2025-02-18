import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/loading';
import Menu from '../../components/customerM';
import Footer from '../../components/footer';
import { BiEnvelope, BiPhone, BiMap } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns";

const LandingPage = () => {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(""); // Filter state
  const itemsPerPage = 3; // Only 3 items per page

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/mission/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (data.success) {
          setMissions(data.data);
        } else {
          console.error('Failed to fetch missions:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching missions:', error);
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const handleView = (id) => {
    // navigate(`../one/${id}`);
  };

  // Filtered Missions
  const filteredMissions = missions.filter(mission =>
    mission.name.toLowerCase().includes(filter.toLowerCase()) ||
    mission.description.toLowerCase().includes(filter.toLowerCase()) ||
    mission.status.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMissions = filteredMissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMissions.length / itemsPerPage);

  return (
    <>
      <Menu />
      <section id="hero" className="hero" style={{ marginTop: '1cm' }}>
        <div className="container position-relative">
          <h5 style={{ fontSize: '35px', fontWeight: 'bold' }}>
            <b>LIST OF ALL <span className='apart' style={{ color: 'lightgreen' }}>MISSIONS</span> </b>
          </h5>
          <p style={{ fontFamily: 'monospace' }}>
            list of all mission Millitary created, in different times  <br/>
            with user who ctrated contact
          </p>

          {/* Filter Input */}
          <input
            type="text"
            placeholder="Search missions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: '50%',
              padding: '10px',
              // marginTop: '10px',
              // backgroundColor:'whitesmoke',
              borderRadius: '5px',
           
              border: '1px solid lightgreen', backgroundColor: 'lightgreen', color: 'green',margonTop:'-1cm' 
            }}
          
          />
        </div>
      </section>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4cm' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {currentMissions.length > 0 ? (
            <section id="team" className="team">
              <div className="container" data-aos="fade-up">
                <div className="row gy-4">
                  {currentMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="col-xl-4 col-md-6"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleView(mission.id)}
                    >
                      <div className="team member col-xl-12" style={{ padding: "0.3cm",border:'1px solid green' }}>
                        <h4>{mission.name}</h4>
                        <p>{mission.description}</p>
                        <p>Start from: {new Date(mission.start_date).toLocaleDateString()} to {new Date(mission.end_date).toLocaleDateString()}</p>
                        {/* <p>End date: {new Date(mission.end_date).toLocaleDateString()}</p> */}
                          <p style={{width:'3cm',color:'white',textAlign:'center'}} className={`badge ${mission.status === 'active' ? 'bg-success' : 'bg-warning'}`}>{mission.status}</p><br/>
                        
                        <small className="text-muted" style={{backgroundColor:'white',border:'1px solid green',padding:'4px',borderRadius:'5px'}}>
                                                {formatDistanceToNow(new Date(mission.createdAt), {
                                                  addSuffix: true,
                                                })}
                                              </small>

                        <p style={{ fontStyle: 'italic',color:'black', border:'1px solid lightgreen', backgroundColor: 'lightgreen', padding: '0.3cm', borderRadius: '6px',marginTop:'20px' }}>
                          <u>Mission Creator</u> <br />
                          <BiMap /> {mission.location} <br />
                          <BiEnvelope /> {mission.creator.email} <br />
                          <BiPhone /> {mission.creator.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="hero" style={{ height: '90vh', textAlign: 'center', paddingTop: '4cm' }}>
              <h2 style={{ fontSize: '45px' }}>404</h2>
              <p>No missions available yet! Sorry!!</p>
            </section>
          )}

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.1cm', gap: '15px', marginBottom: '1cm' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: currentPage === 1 ? '#ccc' : 'lightgreen',
                color: 'white',
                fontWeight: 'bold',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: '0.3s',
              }}
            >
              Previous
            </button>

            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
              Page {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: currentPage >= totalPages ? '#ccc' : 'lightgreen',
                color: 'white',
                fontWeight: 'bold',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                transition: '0.3s',
              }}
            >
              Next
            </button>
          </div>

        </>
      )}

      <Footer />
    </>
  );
};

export default LandingPage;
