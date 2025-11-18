import { Outlet } from "react-router";
import ClientNavbar from "../pages/Client/ClientNavbar";

const ClientLayout = () => {
  return (
    <div>
      <header>
      <ClientNavbar/>
      </header>

      <main>
        <Outlet/>
      </main>
    </div>
  );
};

export default ClientLayout;
