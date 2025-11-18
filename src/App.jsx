import useCounter from "@hooks/useCounter";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { RoutePath } from "./routes/routes";
const App = () => {
  const { count, increment, decrement, reset } = useCounter();
  const {user, isAuthenticated, loading} = useAuth()
  const navigate = useNavigate()

    useEffect(()=> {
    if (loading) return;
    if (!user) return;
    if (user.role === "client") {
      navigate(RoutePath.CLIENT);
    } else if (user.role === "freelancer") {
      navigate(RoutePath.FREELANCER, {replace: true});
    }

    }, [navigate, user, loading])
 
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    {!user && <p>No user logged in</p>}
    {loading && <p>Loading...</p>}
    </>

    //   <div>
    //   <p>User: {user ? user.email : "No user logged in"}</p>
    // </div>
    // <div>
    //   <p>Count: {count}</p>
    //   <button onClick={increment}>Increment</button>
    //   <button onClick={decrement}>Decrement</button>
    //   <button onClick={reset}>Reset</button>
    // </div>
  );
};

export default App;
