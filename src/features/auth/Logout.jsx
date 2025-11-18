import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import useAxios from "@/hooks/useAxios";
import { RoutePath } from "../../routes/routes";
import Swal from "sweetalert2";

const Logout = () => {
  const { setUser } = useAuth();
  const { fetchData, response, error } = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // Call backend logout
        await fetchData({ url: "/logout", method: "GET" });

        // Clear user in context
        setUser(null);

        // Redirect to login page
        navigate(RoutePath.HOME + RoutePath.AUTH + "/" + RoutePath.LOGIN, { replace: true });
      } catch (err) {
        console.error("Logout failed:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message || "Logout failed",
        });
      }
    };

    doLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // render nothing
};

export default Logout;
