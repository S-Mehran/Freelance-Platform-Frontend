import { useEffect} from "react"
import CustomInput from "@components/CustomInput";
import { RoutePath } from "@/routes/routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import { useNavigate } from "react-router";
import { Card, Form, Button } from "react-bootstrap";

const EnterEmailForm = () => {

    const navigate = useNavigate()

    const {fetchData, response} = useAxios()

    useEffect(()=>{
    console.log("Response:", response);
    if (response) {
        console.log("moving to path")
        navigate(RoutePath.HOME+RoutePath.AUTH + "/" + RoutePath.OTP, {state: {user: response, isResetPasswordFlow:true}});
    } 
    },
    [response, navigate])

    const validationSchema = Yup.object({
        email: Yup.string().email().required()
    })

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async(values) => {
            await fetchData({url: "/send-otp", method: "POST", data: values})
        }
    })
    return(
        <Card>
            <Card.Body>
                <h3>Enter your email.</h3>
                <p>We will send you otp for verification</p>
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
            <div className="d-grid">
            <Button variant="primary" type="submit">
              Send OTP
            </Button>
          </div>
          </Form>
          
          </Card.Body>
    </Card>
    )
}


export default EnterEmailForm;