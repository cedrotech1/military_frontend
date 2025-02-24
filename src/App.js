
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importing components from the landing pages
import Home from "./pages/landing/home";
import Contact from "./pages/landing/contact";
import About from "./pages/landing/about";
import Login from "./pages/landing/login";
import CustomerRegister from "./pages/landing/customer_register";
import RestRegister from "./pages/landing/restaurent_admin";
import NotFound from './pages/landing/notfound';
import Logout from './pages/landing/logout';
import Statistics1 from './components/statistics';

// Importing components from the customer pages    
import List from "./pages/user/reslist";
import Details from "./pages/user/RestoDetails";
import OneRes from "./pages/user/oneres";
import Confirm from "./pages/user/confirms";
import Mycards from "./pages/user/mycards";
import History from "./pages/user/cardHistory";
import Prof from "./pages/user/user-profile";



// Importing components from the Admin resto pages
import Dasha from "./pages/Admin/homePage";
import Card from "./pages/Admin/Card-category";
import Statisticsa from "./pages/Admin/statistics";
import Onecard from "./pages/Admin/oneResto";
import Rcustomer from "./pages/Admin/customers";
import Setting from "./pages/Admin/user-profile";
import OurResto from "./pages/Admin/restaurentPage";
import OurCate from "./pages/Admin/categoryPage";
import OurReport from "./pages/Admin/report";
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
        <Route path="/contact" element={<Contact />} exact={true} />
        <Route path="/about" element={<About />} exact={true} />
        <Route path="/login" element={<Login />} exact={true} />
        <Route path="/register" element={<CustomerRegister />} exact={true} />
        <Route path="/restoAdmin" element={<RestRegister />} exact={true} />
        <Route path="/logout" element={<Logout />} exact={true} />
        <Route path="/Statistics1" element={<Statistics1 />} exact={true} />
        

        {/* Customer Pages */}
        <Route path="/list" element={<List />} exact={true} />
        <Route path="/details/:id" element={<Details />} exact={true} />
        <Route path="/one/:id" element={<OneRes />} exact={true} />
        <Route path="/confirm" element={<Confirm />} exact={true} />
        <Route path="/mycards" element={<Mycards />} exact={true} />
        <Route path="/history/:id" element={<History />} exact={true} />
        <Route path="/profile" element={<Prof />} exact={true} />
        <Route path="/forgot" element={<Forgot />} exact={true} />
        <Route path="/code/:email" element={<Code/>} exact={true} />
        <Route path="/resetPassword/:email" element={<ResetPassword/>} exact={true} />
        <Route path="*" element={<NotFound />} />

    
        {/* resetPassword/cedrotech1@gmail.com */}

        
        {/* Admin Resto Pages */}
        <Route path="/resto_dash" element={<Dasha />} exact={true} />
        <Route path="/resto_card/" element={<Card />} exact={true} />
        <Route path="/resto_statistics" element={<Statisticsa />} exact={true} />
        <Route path="/resto_one_card" element={<Onecard />} exact={true} />
        <Route path="/resto_customers" element={<Rcustomer />} exact={true} />
        <Route path="/settings" element={<Setting />} exact={true} />
  
        <Route path="/resto_view" element={<OurResto/>} exact={true} />
        <Route path="/categories" element={<OurCate/>} exact={true} />
        <Route path="/resto_report_view" element={<OurReport/>} exact={true} />


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
