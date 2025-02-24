import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/main2.css';
import LoadingSpinner from '../../components/loading'; // Import the LoadingSpinner component


const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        const role = res.user.role;
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (role === 'user') {
          await navigate('../list');
        } else if (role === 'admin') {
          await navigate('../resto_dash');
        } else if (role === 'Commander-Officer') {
          await navigate('../resto_dash');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error creating account', error);
      setError('Failed to create an account. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when request is complete
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };


  return (
    <>

      <section id="herofm" className="herofm" style={{ marginTop: '3cm' }}>
        <div className="container position-relative">
          <div className="row gy-5" data-aos="fade-in">
            <div className="col-lg-1 order-2 order-lg-1 d-flex flex-column justify-content-center text-center text-lg-start">
            </div>
            <div className="col-lg-5 order-2 order-lg-1  flex-column justify-content-center  text-lg-start loginForm">

              <form onSubmit={handleSubmit} className="myform">
                <h4 >Login form</h4>

                <br />
                <div className="form-group mt-3">
                  <span>Email</span>

                  <input type="text" className="form-control" name="email" style={{ border: '1px solid green', backgroundColor: 'white', color: 'green',outline: 'none' }}   id="email" placeholder="umutoniwase@gmail.com" onChange={handleChange}/>
                </div>
                <br />

                <div className="form-group mt-3">
                  <span>password</span>
                  <input type="password"  oninput="maskPassword()" className="form-control" style={{ border: '1px solid green', backgroundColor: 'white', color: 'green',margonTop:'-1cm' }}  name="password" id="subject" placeholder="************" onChange={handleChange} />
                </div>
                <div className="form-group mt-3">
                  <Link to='../forgot'> <b style={{ textAlign: 'center', color: 'green' }}>forgot password</b></Link>
                  {/* <input type="password" oninput="maskPassword()" className="form-control" name="password" id="subject" placeholder="************" onChange={handleChange} /> */}
                </div>

                <div className="text-center">
                  <button type="submit" style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'green',margonTop:'1cm' }} className={`form-control ${loading ? 'loading' : ''}`} disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Login'}
                  </button>

                </div>
              </form>
            </div>
            <div className="col-lg-5 order-1 order-lg-2 d-flex align-items-center justify-content-center loginImg">
              <img src="assets/img/rdf.jpg" style={{borderRadius:'0.5cm',margin:'0.5cm'}} className="img-fluid loginImg" alt="" data-aos="zoom-out" data-aos-delay="100" />
            </div>

          </div>
        </div>
      </section>


      <a href="#" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>

      <script src="assets/js/main.js"></script>
      <ToastContainer />

    </>
  );
};

export default LandingPage;
