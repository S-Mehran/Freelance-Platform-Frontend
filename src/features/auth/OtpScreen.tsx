import { Container, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import useAxios from "@/hooks/useAxios";
import * as Yup from "yup"
import { useNavigate, useLocation } from "react-router";
import { RoutePath } from "@/routes/routes";
import { useEffect } from "react";

const OtpForm = () => {
  const navigate = useNavigate()
  const registerApi = useAxios()
//  const {fetchData, response} =  useAxios()
  const resetPasswordApi = useAxios()

  const {state} = useLocation()

  const user = state.user

  const isResetPasswordFlow = state.isResetPasswordFlow ?? false

  useEffect(()=> {
  console.log("Response:", registerApi.response);
  if (registerApi.response) {
    navigate(RoutePath.HOME + RoutePath.AUTH + "/" + RoutePath.LOGIN, {state: {user: registerApi.response}});
  }
    if (resetPasswordApi.response) {
    navigate(RoutePath.HOME + RoutePath.AUTH + "/" + RoutePath.RESET_PASSWORD, {state: {user: resetPasswordApi.response}});
  }
},  
  [registerApi.response, resetPasswordApi.response, navigate])


  const validationSchema = Yup.object({
    otp: Yup.string().max(6).required('OTP Required'),
    email: Yup.string().email().required('Email Required'),    
  })

    const formik = useFormik({
        initialValues: {
            email: user.email,
            otp: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            //alert(JSON.stringify(values, null, 2));
            //const confirmOtp = {email: values.email, otp: Number(values.otp)}
            if (isResetPasswordFlow) {
              await resetPasswordApi.fetchData({url: '/confirm-otp', method: "POST", data:values})              
            }
            else {
            await registerApi.fetchData({url: '/confirm-otp', method: "POST", data:values})
            }
        },

    })
    return (

        <Container>
            <Form onSubmit={formik.handleSubmit}>
                <div className="input-field">
               <Form.Control type="email" placeholder="enter email" name="email" value={formik.values.email} onChange={formik.handleChange} isInvalid={!!formik.errors.email}>                
               </Form.Control>
               <Form.Control type="text" name="otp" value={formik.values.otp} onChange={formik.handleChange}
               isInvalid={!!formik.errors.otp}></Form.Control>
               </div>
            <Button variant="primary" type="submit">
              Verify OTP
            </Button>
            </Form>
        </Container>
    )
}

export default OtpForm