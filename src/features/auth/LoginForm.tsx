import React, { useEffect, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import CustomInput from "@components/CustomInput";
import { RoutePath } from "@/routes/routes";
import { useNavigate } from "react-router";
import useAxios from "@/hooks/useAxios";

const LoginForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate()

  const {fetchData, response} = useAxios()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(()=> {
    if (response) {
      console.log(response)
      navigate(RoutePath.HOME+RoutePath.AUTH+"/"+RoutePath.CLIENT_HOME)
    }

  }, [navigate, response])


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }
    await fetchData({url: "/login", method: "POST", data: {email: form.email, password: form.password}})

   // Simulate API call
    setTimeout(() => {
      setError("");
      setSuccess("Logging In!");
      //navigate(RoutePath.HOME)
    }, 1000);
    setTimeout(()=> {
      navigate(RoutePath.HOME+RoutePath.AUTH+"/"+RoutePath.CLIENT_HOME)
    }, 2000)

  };
  return (
    <Card className="shadow-sm p-4">
      <Card.Body>
        <h3 className="text-center mb-4">Login Account</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <CustomInput
            name="email"
            label="Email"
            placeholder="Enter email address"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <CustomInput
            name="password"
            label="Password"
            placeholder="Create a password"
            type="password"
            onChange={handleChange}
            value={form.password}
          />
        {/* <p className="text-center mt-3 mb-0">
          Forgot Password?{" "} */}
          <a href={RoutePath.ENTER_EMAIL} className="text-decoration-none">
            Forgot Password
          </a>
        {/* </p> */}
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>

        <p className="text-center mt-3 mb-0">
          Dont have a account?{" "}
          <a href={RoutePath.REGISTER} className="text-decoration-none">
            Signup
          </a>
        </p>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
