import React, { useEffect, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import CustomInput from "@components/CustomInput";
import { RoutePath } from "@/routes/routes";
import { useNavigate } from "react-router";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
//  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {user, setUser} = useAuth()
  const navigate = useNavigate();
//  const { fetchData, response, error } = useAxios();
const loginApi = useAxios()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (loginApi.response) {
      console.log("Login response:", loginApi.response);
      // Normalize response shape: some APIs return { message: user } while others return user directly
      const userData = loginApi.response;
      
      // Update auth context
      setUser(userData);
      
      // const timer = setTimeout(() => {
      //   if (userData.role === "client") {
      //     console.log('navigating to client', userData);
      //     navigate("/client", { replace: true });
      //   } else if (userData.role === "freelancer") {
      //     console.log('navigating to freelancer');
      //     navigate("/freelancer", { replace: true });
      //   }
      // }, 100);
      
      // return () => clearTimeout(timer);


    }
  }, [loginApi.response, setUser]);

  useEffect(()=> {
    if (!user || !user.role) return;
       if (user.role==="client") {
        console.log("navigating to client", user);
        navigate("/client", {replace:true}) 
      }   
  }, [user])

  useEffect(()=> {
    if (loginApi.error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: loginApi.error
      })
    }
  }, [loginApi.error])


  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!form.email || !form.password) {
    //   setError("All fields are required.");
    //   setSuccess("");
    //   return;
    // }

    await loginApi.fetchData({
      url: "/login",
      method: "POST",
      data: { email: form.email, password: form.password },
    });

    // setTimeout(() => {
    //   setSuccess("Logging In!");
    // }, 1000);
    // setTimeout(() => {
    //   navigate(RoutePath.HOME + RoutePath.AUTH + "/" + RoutePath.CLIENT_HOME);
    // }, 2000);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)",
      }}
    >
      <Card
        className="shadow-lg p-4 border-0"
        style={{
          width: "400px",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <Card.Body>
          <h3
            className="text-center mb-4 fw-bold"
            style={{ color: "#6A0DAD", letterSpacing: "0.5px" }}
          >
            Welcome Back
          </h3>

          {loginApi.error && (
            <Alert
              variant="danger"
              className="text-center py-2"
              style={{
                borderRadius: "10px",
                backgroundColor: "#f8d7da",
                color: "#842029",
              }}
            >
              {loginApi.error}
            </Alert>
          )}
          {success && (
            <Alert
              variant="success"
              className="text-center py-2"
              style={{
                borderRadius: "10px",
                backgroundColor: "#d1e7dd",
                color: "#0f5132",
              }}
            >
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <CustomInput
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <CustomInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              onChange={handleChange}
              value={form.password}
            />

            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
              <a
                href={RoutePath.ENTER_EMAIL}
                className="fw-semibold"
                style={{
                  color: "#32CD32",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </a>
            </div>

            <div className="d-grid mt-3">
              <Button
                variant="primary"
                type="submit"
                style={{
                  backgroundColor: "#6A0DAD",
                  border: "none",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  borderRadius: "10px",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8A2BE2")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6A0DAD")
                }
              >
                Login
              </Button>
            </div>
          </Form>

          <p className="text-center mt-4 mb-0">
            Don’t have an account?{" "}
            <a
              href={RoutePath.REGISTER}
              className="fw-semibold"
              style={{
                color: "#32CD32",
                textDecoration: "none",
              }}
            >
              Sign Up
            </a>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
