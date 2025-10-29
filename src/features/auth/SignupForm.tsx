import { Card, Form, Button} from "react-bootstrap";
import CustomInput from "@components/CustomInput";
import { RoutePath } from "@/routes/routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import { useNavigate } from "react-router";

const SignupForm = () => {
  const navigate = useNavigate();

  const { response, error, fetchData } = useAxios();

  console.log("Response:", response);
  if (response) {
    navigate(RoutePath.HOME+RoutePath.AUTH + "/" + RoutePath.OTP, {state: {user: response}});
  } else {
    console.log(error);
  }

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
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
      // alert(JSON.stringify(values, null, 2));

      await fetchData({ url: "/register", method: "post", data: values });
      // navigate(RoutePath.HOME + RoutePath.AUTH + "/" + RoutePath.OTP);
    },
  });

  return (
    <Card className="shadow-sm p-4">
      <Card.Body>
        <h3 className="text-center mb-4">Create Account</h3>

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
          type="text"
          onChange={formik.handleChange}
          value={formik.values.role}
          isInvalid={!!formik.errors.role}
          validationMsg={formik.errors.role}
          />

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </div>
        </Form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <a href={RoutePath.LOGIN} className="text-decoration-none">
            Login
          </a>
        </p>
      </Card.Body>
    </Card>
  );
};

export default SignupForm;
