import { Card, Form, Button } from "react-bootstrap";
import CustomInput from "@components/CustomInput";
import { RoutePath } from "@/routes/routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Swal from "sweetalert2";

const SignupForm = () => {
  const navigate = useNavigate();
  const { response, error, fetchData } = useAxios();

  useEffect(() => {
    if (response) {
      navigate(RoutePath.HOME + RoutePath.AUTH + "/" + RoutePath.OTP, { state: { user: response } });
    }
  }, [navigate, response]);

  useEffect(()=> {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error
      })
    }
  }, [error])
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await fetchData({ url: "/register", method: "post", data: values });
    },
  });

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
            Create Account
          </h3>

          <Form onSubmit={formik.handleSubmit}>
            <CustomInput
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              isInvalid={!!formik.errors.firstName}
              validationMsg={formik.errors.firstName || ""}
            />
            <CustomInput
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              isInvalid={!!formik.errors.lastName}
              validationMsg={formik.errors.lastName || ""}
            />
            <CustomInput
              name="email"
              label="Email"
              placeholder="Enter email address"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.email}
              validationMsg={formik.errors.email || ""}
            />
            <CustomInput
              name="password"
              label="Password"
              placeholder="Create a password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              isInvalid={!!formik.errors.password}
              validationMsg={formik.errors.password || ""}
            />
            <CustomInput
              name="role"
              label="Role"
              placeholder="Select the User Role"
              as="select"
              options={[
            { value: "", label: "Role" },
            { value: "client", label: "Hire Talent as Client" },
            { value: "freelancer", label: "Find Jobs as Freelancer" },
            { value: "admin", label: "Admin" },
        ]}
              onChange={formik.handleChange}
              value={formik.values.role}
              isInvalid={!!formik.errors.role}
              validationMsg={formik.errors.role}
            />

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
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#8A2BE2")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6A0DAD")}
              >
                Sign Up
              </Button>
            </div>
          </Form>

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
            <a
              href={RoutePath.LOGIN}
              className="fw-semibold"
              style={{ color: "#32CD32", textDecoration: "none" }}
            >
              Login
            </a>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignupForm;
