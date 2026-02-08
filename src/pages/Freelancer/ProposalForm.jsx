import CustomInput from "@/components/CustomInput";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { RoutePath } from "@/routes/routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useLocation } from "react-router";

//to do retrieve id state from single page when navigating
//Retrieve it here and send it with post data. 
const ProposalForm = () => {
  const navigate = useNavigate();
  const { response, fetchData, error, loading } = useAxios();


  const location = useLocation()

  const postId = location.state?.postId
  // Success Handler
  useEffect(() => {
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Proposal Created!",
        text: "Your job proposal has been successfully sent to the client.",
      });
      navigate(`/${RoutePath.FREELANCER}/${RoutePath.GET_POSTS}`);
    }
  }, [response, navigate]);

  // Error Handler
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    }
  }, [error]);

  // Validation Schema
  const validationSchema = Yup.object({
    coverLetter: Yup.string(),
    bidAmount: Yup.string().required("Price is required"),
    bidType: Yup.string().required("Select Bid Type"),
    estimatedDeliveryDays: Yup.string().required("Number is required"),
  });

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      coverLetter: "",
      bidAmount: "",
      bidType: "",
      estimatedDeliveryDays: "",
    },
    validationSchema,
    onSubmit: async (values) => {
    //   const payload = {
    //     ...values,
    //     skillsRequired: values.skillsRequired
    //       .split(",")
    //       .map((skill) => skill.trim())
    //       .filter((skill) => skill !== ""),
    //   };
    const payload = {
      ...values,
      postId: postId
    }

      await fetchData({
        url: "/create-proposal",
        method: "POST",
        data: payload,
      });
    },
  });

  return (
    <Card
      className="app-card shadow-lg p-4 mx-auto mt-5"
      style={{
        maxWidth: "750px",
        borderRadius: "18px"
      }}
    >
      <Card.Body>
        <h2 className="text-center mb-4 fw-bold text-primary">
          Create New Proposal
        </h2>

        <Form onSubmit={formik.handleSubmit}>

          {/* --- Summary Section --- */}
          <div className="mb-4">
            <CustomInput
              name="coverLetter"
              label="Cover Letter"
              placeholder="Describe why the client should hire you..."
              as="textarea"
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.coverLetter}
              isInvalid={!!formik.errors.coverLetter}
              validationMsg={formik.errors.coverLetter}
            />
          </div>

          {/* --- Price + Expertise --- */}
          <Row className="mb-4">
            <Col md={6}>
              <CustomInput
                name="bidAmount"
                label="Bid Amount"
                placeholder="Enter amount"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.bidAmount}
                isInvalid={!!formik.errors.bidAmount}
                validationMsg={formik.errors.bidAmount}
              />
            </Col>

            <Col md={6}>
              <CustomInput
                name="bidType"
                label="Bid Type"
                as="select"
                options={[
                  { value: "", label: "Select Level" },
                  { value: "hourly", label: "Hourly" },
                  { value: "fixed", label: "Fixed" },
                ]}
                onChange={formik.handleChange}
                value={formik.values.levelOfExpertiseRequired}
                isInvalid={!!formik.errors.levelOfExpertiseRequired}
                validationMsg={formik.errors.levelOfExpertiseRequired}
              />
            </Col>
          </Row>

          {/* --- Project Type + Skills --- */}
          <Row className="mb-3">
            <Col md={6}>
              <CustomInput
                name="estimatedDeliveryDays"
                label="Estimated Delivery Days (Duration)"
                placeholder="Enter the Number of Days"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.estimatedDeliveryDays}
                isInvalid={!!formik.errors.estimatedDeliveryDays}
                validationMsg={formik.errors.estimatedDeliveryDays}
              />
            </Col>
          </Row>

          {/* --- Submit Button --- */}
          <div className="d-grid mt-4">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Job Proposal"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProposalForm;


