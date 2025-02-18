import { useEffect, useState } from "react";

const HostedPage = () => {
  const url = "https://www.mod.gov.rw/";
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden"); // Cleanup when unmounting
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setShowModal(true);
  //   }, 10000); // Show modal every 10 seconds

  //   return () => clearInterval(interval);
  // }, []);

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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">Check out this link:</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Visit Website</a>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostedPage;
