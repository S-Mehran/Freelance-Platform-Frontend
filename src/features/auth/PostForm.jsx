import CustomInput from "@/components/CustomInput";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { RoutePath } from "@/routes/routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const PostForm = () => {
  const navigate = useNavigate();
  const { response, fetchData, error, loading } = useAxios();

  // Success Handler
  useEffect(() => {
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Post Created!",
        text: "Your job post has been successfully published.",
      });
      navigate(`/${RoutePath.CLIENT}/${RoutePath.GET_MY_POSTS}`);
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
    title: Yup.string()
      .max(30, "Provide a shorter title")
      .required("Title is required"),
    summary: Yup.string(),
    price: Yup.string().required("Price is required"),
    levelOfExpertiseRequired: Yup.string().required("Select expertise level"),
    projectType: Yup.string().required("Select project type"),
    skillsRequired: Yup.string().required("Skills are required"),
  });

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      price: "",
      levelOfExpertiseRequired: "",
      projectType: "",
      skillsRequired: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        skillsRequired: values.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await fetchData({
        url: "http://localhost:5001/api/create-post",
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
          Create a New Job Post
        </h2>

        <Form onSubmit={formik.handleSubmit}>
          {/* --- Job Title --- */}
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

          {/* --- Summary Section --- */}
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

          {/* --- Price + Expertise --- */}
          <Row className="mb-4">
            <Col md={6}>
              <CustomInput
                name="price"
                label="Budget / Price"
                placeholder="Enter price"
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
                label="Level of Expertise"
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

          {/* --- Project Type + Skills --- */}
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

          {/* --- Submit Button --- */}
          <div className="d-grid mt-4">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Job Post"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostForm;



// import CustomInput from "@/components/CustomInput";
// import { Card, Form, Button, Row, Col } from "react-bootstrap";
// import { RoutePath } from "@/routes/routes";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import useAxios from "@/hooks/useAxios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router";
// import Swal from "sweetalert2";

// const PostForm = () => {
//   const navigate = useNavigate();
//   const { response, fetchData, error } = useAxios();

//   useEffect(() => {
//     if (response) {
//       Swal.fire({
//         icon: "success",
//         title: "Done",
//         text: "Post Created Successfully",
//       });

//       navigate(`/${RoutePath.CLIENT}/${RoutePath.GET_MY_POSTS}`);
//     }
//   }, [response, navigate]);

//   useEffect(() => {
//     if (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: error,
//       });
//     }
//   }, [error]);

//   const validationSchema = Yup.object({
//     title: Yup.string().max(30, "Provide a shorter title").required("Title is Required"),
//     summary: Yup.string().optional(),
//     price: Yup.string().required("Price is required"),
//     levelOfExpertiseRequired: Yup.string().required("Level of Expertise is Required"),
//     projectType: Yup.string().required("Project Type is Required"),
//     skillsRequired: Yup.string().required("Skills are required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       summary: "",
//       price: "",
//       levelOfExpertiseRequired: "",
//       projectType: "",
//       skillsRequired: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       const payload = {
//         ...values,
//         skillsRequired: values.skillsRequired
//           .split(",")
//           .map((skill) => skill.trim())
//           .filter((skill) => skill !== "")
//       };
//       await fetchData({ url: "http://localhost:5001/api/create-post", method: "POST", data: payload });
//     },
//   });

//   return (
//     <Card className="shadow-lg p-4 mx-auto mt-5" style={{ maxWidth: "700px", borderRadius: "15px" }}>
//       <Card.Body>
//         <h2 className="text-center mb-4 fw-bold text-primary">Create Job Post</h2>

//         <Form onSubmit={formik.handleSubmit}>
//           <Row className="mb-3">
//             <Col>
//               <CustomInput
//                 name="title"
//                 label="Job Title"
//                 placeholder="Enter your job title"
//                 type="text"
//                 onChange={formik.handleChange}
//                 value={formik.values.title}
//                 isInvalid={!!formik.errors.title}
//                 validationMsg={formik.errors.title || ""}
//               />
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col>
//               <CustomInput
//                 name="summary"
//                 label="Project Summary"
//                 placeholder="Enter a brief description of the project"
//                 as="textarea"
//                 rows={3}
//                 onChange={formik.handleChange}
//                 value={formik.values.summary}
//                 isInvalid={!!formik.errors.summary}
//                 validationMsg={formik.errors.summary || ""}
//               />
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={6}>
//               <CustomInput
//                 name="price"
//                 label="Price"
//                 placeholder="Enter project price"
//                 type="number"
//                 value={formik.values.price}
//                 onChange={formik.handleChange}
//                 isInvalid={!!formik.errors.price}
//                 validationMsg={formik.errors.price || ""}
//               />
//             </Col>
//             <Col md={6}>
//               <CustomInput
//                 name="levelOfExpertiseRequired"
//                 label="Level of Expertise Required"
//                 as="select"
//                 options={[
//                   { value: "", label: "Select Level" },
//                   { value: "entry_level", label: "Entry Level" },
//                   { value: "intermediate", label: "Intermediate" },
//                   { value: "expert", label: "Expert" },
//                 ]}
//                 onChange={formik.handleChange}
//                 value={formik.values.levelOfExpertiseRequired}
//                 isInvalid={!!formik.errors.levelOfExpertiseRequired}
//                 validationMsg={formik.errors.levelOfExpertiseRequired || ""}
//               />
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={6}>
//               <CustomInput
//                 name="projectType"
//                 label="Project Type"
//                 as="select"
//                 options={[
//                   { value: "", label: "Select Type" },
//                   { value: "one_time_project", label: "One Time Project" },
//                   { value: "ongoing_project", label: "Ongoing Project" },
//                   { value: "not_sure", label: "Not Sure" },
//                 ]}
//                 onChange={formik.handleChange}
//                 value={formik.values.projectType}
//                 isInvalid={!!formik.errors.projectType}
//                 validationMsg={formik.errors.projectType || ""}
//               />
//             </Col>
//             <Col md={6}>
//               <CustomInput
//                 name="skillsRequired"
//                 label="Skills Required"
//                 placeholder="Comma-separated skills"
//                 type="text"
//                 onChange={formik.handleChange}
//                 value={formik.values.skillsRequired}
//                 isInvalid={!!formik.errors.skillsRequired}
//                 validationMsg={formik.errors.skillsRequired}
//               />
//             </Col>
//           </Row>

//           <div className="d-grid mt-4">
//             <Button variant="primary" type="submit" size="lg">
//               Create Job Post
//             </Button>
//           </div>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// };

// export default PostForm;
