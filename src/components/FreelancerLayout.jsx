import { Outlet } from "react-router";
import FreelancerNavbar from "../pages/Freelancer/FreelancerNavbar";

const FreelancerLayout = () => {
  return (
    <div>
      <FreelancerNavbar/>
      <div className="container mt-4">
        <Outlet /> {/* This is where nested routes appear */}
      </div>
    </div>
  );
};

export default FreelancerLayout;
