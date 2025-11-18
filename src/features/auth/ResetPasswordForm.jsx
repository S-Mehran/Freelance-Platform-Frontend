import { Card, Form, Button } from "react-bootstrap";
import { RoutePath } from "@/routes/routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import { useNavigate, useLocation } from "react-router";
import CustomInput from "@components/CustomInput";
import { useEffect } from "react";
import Swal from "sweetalert2";

const ResetPasswordForm = () => {

    const navigate = useNavigate()

    const {state} = useLocation()

    const user = state.user

    const {fetchData, response, error} = useAxios()

    useEffect(()=> {
        if (response) {
            navigate(RoutePath.HOME+RoutePath.AUTH+"/"+RoutePath.LOGIN)
        }
    }, [navigate, response])

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
        email: Yup.string().email().required("Email is required"),
        newPassword: Yup.string().min(8).required(),
        confirmPassword: Yup.string().min(8).required(),
    })
    const formik = useFormik({
        initialValues: {
            email: user.email,
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async(values) => {
            await fetchData({url: "/reset-password", method: "POST", data: values})
        }
    })
    return (
    <Card className="shadow-sm p-4">
      <Card.Body>
        <h3 className="text-center mb-4">Choose a new password</h3>
      <Form onSubmit={formik.handleSubmit}>
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
            name="newPassword"
            label="New Password"
            placeholder="Create a New password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            isInvalid={!!formik.errors.newPassword}
            validationMsg={formik.errors.newPassword || ""}
          />
            <CustomInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm New password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            isInvalid={!!formik.errors.confirmPassword}
            validationMsg={formik.errors.confirmPassword || ""}
          />
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </div>
      </Form>
     </Card.Body>
    </Card>
    )
}

export default ResetPasswordForm