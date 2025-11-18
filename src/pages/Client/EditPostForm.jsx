import CustomInput from "@/components/CustomInput";
import { Card, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
import { RoutePath } from "@/routes/routes";

const EditPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    response: updateResponse,
    fetchData: fetchUpdate,
    error: updateError,
    loading: updateLoading,
  } = useAxios();

  const {
    response: postResponse,
    fetchData: fetchPost,
    loading: postLoading,
    error: postError,
  } = useAxios();

  const [initialValues, setInitialValues] = useState({
    title: "",
    summary: "",
    price: "",
    levelOfExpertiseRequired: "",
    projectType: "",
    skillsRequired: "",
  });

  // ---------------------------
  // FETCH SINGLE POST DATA
  // ---------------------------
  useEffect(() => {
    fetchPost({
      url: `post/${id}`,
      method: "GET",
    });
  }, [id]);

  // ---------------------------
  // SET INITIAL FORM VALUES
  // ---------------------------
  useEffect(() => {
    if (postResponse) {
      const post = postResponse.post;
        console.log(postResponse)
      setInitialValues({
        title: post.title || "",
        summary: post.summary || "",
        price: post.price || "",
        levelOfExpertiseRequired: post.levelOfExpertiseRequired || "",
        projectType: post.projectType || "",
        skillsRequired: (post.skillsRequired || []).join(", "),
      });
    }
  }, [postResponse]);

  // ---------------------------
  // SHOW FETCH ERRORS
  // ---------------------------
  useEffect(() => {
    if (postError) {
      Swal.fire({
        icon: "error",
        title: "Unable to Load Data",
        text: postError,
      });
    }
  }, [postError]);

  // ---------------------------
  // EDIT VALIDATION
  // ---------------------------
  const validationSchema = Yup.object({
    title: Yup.string()
      .max(30, "Provide a shorter title")
      .required("Title is required"),
    summary: Yup.string(),
    price: Yup.string().required("Price is required"),
    levelOfExpertiseRequired: Yup.string().required("Select expertise level"),
    projectType: Yup.string().required("Select project type"),
    skillsRequired: Yup.string().required("Skills are required"),
  });
  // ---------------------------
  // FORMIK INITIALIZATION
  // ---------------------------
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        skillsRequired: values.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await fetchUpdate({
        url: `update-post/${id}`,
        method: "PUT",
        data: payload,
      });
    },
  });

  // ---------------------------
  // SUCCESS HANDLER AFTER UPDATE
  // ---------------------------
  useEffect(() => {
    if (updateResponse) {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your post has been updated successfully.",
      });
      navigate(`/${RoutePath.CLIENT}/${RoutePath.MY_POST}/${id}`);
    }
  }, [updateResponse, navigate]);

  // ---------------------------
  // ERROR HANDLER AFTER UPDATE FAILURE
  // ---------------------------
  useEffect(() => {
    if (updateError) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: updateError,
      });
    }
  }, [updateError]);

  // ---------------------------
  // SHOW LOADING SKELETON FOR FIRST RENDER
  // ---------------------------
  if (postLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading post data...</p>
      </div>
    );
  }


  return (
    <Card
      className="shadow-lg p-4 mx-auto mt-5"
      style={{ maxWidth: "750px", borderRadius: "18px" }}
    >
      <Card.Body>
        <h2 className="text-center mb-4 fw-bold text-primary">
          Edit Job Post
        </h2>

        <Form onSubmit={formik.handleSubmit}>
          {/* TITLE  */}
          <div className="mb-4">
            <CustomInput
              name="title"
              label="Job Title"
              placeholder="Enter job title"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.title}
              isInvalid={!!formik.errors.title}
              validationMsg={formik.errors.title}
            />
          </div>

          {/* SUMMARY */}
          <div className="mb-4">
            <CustomInput
              name="summary"
              label="Project Summary"
              placeholder="Write a brief description..."
              as="textarea"
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.summary}
              isInvalid={!!formik.errors.summary}
              validationMsg={formik.errors.summary}
            />
          </div>

          {/* PRICE + EXPERTISE */}
          <Row className="mb-4">
            <Col md={6}>
              <CustomInput
                name="price"
                label="Budget / Price"
                placeholder="Price"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.price}
                isInvalid={!!formik.errors.price}
                validationMsg={formik.errors.price}
              />
            </Col>

            <Col md={6}>
              <CustomInput
                name="levelOfExpertiseRequired"
                label="Expertise Level"
                as="select"
                options={[
                  { value: "", label: "Select Level" },
                  { value: "entry_level", label: "Entry Level" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "expert", label: "Expert" },
                ]}
                onChange={formik.handleChange}
                value={formik.values.levelOfExpertiseRequired}
                isInvalid={!!formik.errors.levelOfExpertiseRequired}
                validationMsg={formik.errors.levelOfExpertiseRequired}
              />
            </Col>
          </Row>

          {/* PROJECT TYPE + SKILLS */}
          <Row className="mb-3">
            <Col md={6}>
              <CustomInput
                name="projectType"
                label="Project Type"
                as="select"
                options={[
                  { value: "", label: "Select Type" },
                  { value: "one_time_project", label: "One-Time Project" },
                  { value: "ongoing_project", label: "Ongoing Project" },
                  { value: "not_sure", label: "Not Sure" },
                ]}
                onChange={formik.handleChange}
                value={formik.values.projectType}
                isInvalid={!!formik.errors.projectType}
                validationMsg={formik.errors.projectType}
              />
            </Col>

            <Col md={6}>
              <CustomInput
                name="skillsRequired"
                label="Required Skills"
                placeholder="e.g. react, node, ui design"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.skillsRequired}
                isInvalid={!!formik.errors.skillsRequired}
                validationMsg={formik.errors.skillsRequired}
              />
            </Col>
          </Row>

          {/* SUBMIT BUTTON */}
          <div className="d-grid mt-4">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={updateLoading}
            >
              {updateLoading ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditPostForm;
