import { useEffect, useState } from "react";

const HostedPage = () => {
  const url = "https://www.mod.gov.rw/";
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden"); // Cleanup when unmounting
  }, []);
  return (
    <div className="w-screen h-screen">
       <div style={{ paddingLeft: "5.5cm", textAlign: "center" }} className="position-absolute top-0 start-0 m-3">
        <a href="/login" className="btn  shadow-sm" style={{border:'1px solid green'}}>
          Login
        </a>
      </div>
      <iframe
        src={url}
        title="Hosted Page"
        className="w-full h-full border-none"
        style={{ height: "100vh", width: "100%" }}
      />
 
    </div>
  );
};

export default HostedPage;
