
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importing components from the landing pages
import Home from "./pages/landing/home";
import Contact from "./pages/landing/contact";
import About from "./pages/landing/about";
import Login from "./pages/landing/login";
import NotFound from './pages/landing/notfound';
import Logout from './pages/landing/logout';
import Statistics1 from './components/statistics';

// Importing components from the customer pages    
import MissionsPage from "./pages/user/missions";
import Appoitments from "./pages/user/appoitments";
import Prof from "./pages/user/user-profile";



// Importing components from the Admin resto pages
import Dasha from "./pages/Admin/homePage";
import Statisticsa from "./pages/Admin/statistics";
import Setting from "./pages/Admin/user-profile";
import OurCate from "./pages/Admin/categoryPage";
import Department from "./pages/Admin/DepartmentPage";






import Missions from "./pages/Admin/missions";
import Appoitment from "./pages/Admin/appoitment";
import Notifications from "./pages/Admin/notifications";
import Mynotification from "./pages/user/notification";
import OtherProfile from "./pages/Admin/other_user-profile";
import Report from "./pages/Admin/report";
import Forgot from "./pages/landing/reset";
import Code from "./pages/landing/code";
import ResetPassword from "./pages/landing/resetPassword";
import Members from "./pages/Admin/DepartmentMembersPage";
import Country from "./pages/Admin/CountryPage";
import Upload from "./pages/Admin/uploadpage";



// Main App component
function App() {
  return (
    // Set up the BrowserRouter for handling routes
    <BrowserRouter>
      {/* Define the routes using the Routes component */}
      <Routes>
        {/* Landing Pages */}
        <Route path="/" element={<Home />} exact={true} />
        <Route path="/login" element={<Login />} exact={true} />
        <Route path="/logout" element={<Logout />} exact={true} />
        <Route path="/Statistics1" element={<Statistics1 />} exact={true} />
        <Route path="/list" element={<MissionsPage />} exact={true} />
        <Route path="/appoitments" element={<Appoitments />} exact={true} />
        <Route path="/profile" element={<Prof />} exact={true} />
        <Route path="/forgot" element={<Forgot />} exact={true} />
        <Route path="/code/:email" element={<Code/>} exact={true} />
        <Route path="/resetPassword/:email" element={<ResetPassword/>} exact={true} />
        <Route path="*" element={<NotFound />} />

        {/* Admin Resto Pages */}
        <Route path="/dashboard" element={<Dasha />} exact={true} />
        <Route path="/dashboard" element={<Statisticsa />} exact={true} />
        <Route path="/settings" element={<Setting />} exact={true} />
        <Route path="/categories" element={<OurCate/>} exact={true} />


        <Route path="/missions" element={<Missions/>} exact={true} />
        <Route path="/appointment" element={<Appoitment/>} exact={true} />
        <Route path="/notifications" element={<Notifications/>} exact={true} />
        <Route path="/mynotification" element={<Mynotification/>} exact={true} />
        <Route path="/other_user-profile/:id" element={<OtherProfile/>} exact={true} />
        <Route path="/reports" element={<Report/>} exact={true} />
        <Route path="/department" element={<Department/>} exact={true} />
        <Route path="/members/:id" element={<Members/>} exact={true} />
        <Route path="/country" element={<Country/>} exact={true} />
        <Route path="/upload" element={<Upload/>} exact={true} />

        
  
        
      </Routes>
    </BrowserRouter>
  );
}

// Export the App component as the default export    OurResto
export default App;
