  import React, { useState } from 'react';
  import { Link, useNavigate, useParams } from 'react-router-dom';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import '../../css/main2.css';
  import LoadingSpinner from '../../components/loading'; // Import the LoadingSpinner component

  import rdfImage from './rdf.jpg';
  import 'react-toastify/dist/ReactToastify.css'
  function App() {
    const navigate = useNavigate();
    const { email } = useParams();
    const [formData, setFormData] = useState({
      code: 'email',
    });
    console.log()

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/code/${email}`, {
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
          await new Promise((resolve) => setTimeout(resolve, 2000));

          await navigate(`../resetPassword/${email}`);


        } else {
          const errorData = await response.json();
          toast.error(errorData.message);
        }
      } catch (error) {
        console.error('Error creating account', error);
        toast.error('Failed to create account. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
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
                  <h4 >Verification code</h4>

                  <br />
                  <div className="form-group">
                    <span>CODE</span>

                    <input type="text" className="form-control" name="code" id="code" placeholder="Ex : 00000" onChange={handleChange} style={{ outline: 'none' }} />
                  </div>





                  <div className="text-center">
                    <button type="submit" style={{ border: '1px solid green', backgroundColor: 'white', color: 'green',margonTop:'-1cm' }} className={`form-control ${loading ? 'loading' : ''}`} disabled={loading}>
                      {loading ? <LoadingSpinner /> : 'check code'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-lg-5 order-1 order-lg-2 d-flex align-items-center justify-content-center loginImg">
                <img src={rdfImage}  style={{borderRadius:'0.5cm',margin:'0.5cm'}} className="img-fluid loginImg" alt="" data-aos="zoom-out" data-aos-delay="100" />
              </div>
            </div>
          </div>
        </section>
        {/* <ToastContainer /> */}
        <ToastContainer />




      </>
    );
  }

  export default App;
