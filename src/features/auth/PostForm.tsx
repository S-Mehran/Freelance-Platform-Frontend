import CustomInput from "@/components/CustomInput";
import {Card, Form, Button} from "react-bootstrap"
import { RoutePath } from "@/routes/routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxios from "@/hooks/useAxios";
import { useEffect } from "react";
import { useNavigate } from "react-router";


const PostForm = () => {

    const navigate = useNavigate()

    const {response, fetchData} = useAxios()


    useEffect(()=> {
        if (response) {
            console.log(response)
            navigate(RoutePath.HOME)
        }
    }, [response, navigate])

    const validationSchema = Yup.object({
        title: Yup.string().max(30, 'Provide a shorter title').required('Title is Required'),
        summary: Yup.string().optional(),
        price: Yup.string().required('Price is required'),
        levelofExpertise: Yup.string().required("Level of Expertise is Required"),
        projectType: Yup.string().required("Project Type is Required"),
        skillsRequired: Yup.string().required("Skills are required"),
    })
    const formik = useFormik({
        initialValues:{
            title: "",
            summary: "",
            price: "",
            levelofExpertise: "",
            projectType: "",
            skillsRequired: "", 
        },
        validationSchema,
        onSubmit: async(values) => { 
            const payload = {...values, skillsRequired: values.skillsRequired
                .split(',')
                .map((skill)=>{return skill.trim()})
                .filter((skill) => skill!==""),
                client : {"id": 1}
            }
            console.log(values.skillsRequired)
            console.log(payload)

            await fetchData({url: 'http://localhost:5001/api/create-post', method: "POST", data: payload})
        }
    })

    return (
        <>
   <Card className="shadow-sm p-4">
      <Card.Body>
        <h3 className="text-center mb-4">Create Account</h3>

        <Form onSubmit={formik.handleSubmit}>
          <CustomInput
            name="title"
            label="Title"
            placeholder="Enter your job title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.title}
            isInvalid={!!formik.errors.title}
            validationMsg={formik.errors.title || ""}
          />
          <CustomInput
            name="summary"
            label="Summary"
            placeholder="Enter the Summary of Project"
            as="textarea"
            onChange={formik.handleChange}
            value={formik.values.summary}
            isInvalid={!!formik.errors.summary}
            validationMsg={formik.errors.summary || ""}
          />
          <CustomInput
            name="price"
            label="Price"
            placeholder="Enter price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.price}
            validationMsg={formik.errors.price || ""}
          />
          <CustomInput
            name="levelofExpertise"
            label="Level of Expertise"
            as="select"
            options={[
            { value: "", label: "Select Level of Expertise" },
            { value: "entry_level", label: "Entry Level" },
            { value: "intermediate", label: "Intemediate" },
            { value: "expert", label: "Expert" },
        ]}
            onChange={formik.handleChange}
            value={formik.values.levelofExpertise}
            isInvalid={!!formik.errors.levelofExpertise}
            validationMsg={formik.errors.levelofExpertise || ""}
          />
          <CustomInput
          name="projectType"
          label="Project Type"
          as="select"
          options={[
            { value: "", label: "Select Project Type" },
            { value: "one_time_project", label: "One Time Project" },
            { value: "ongoing_project", label: "Ongoing Project" },
            { value: "not_sure", label: "Not Sure" },
        ]}
          onChange={formik.handleChange}
          value={formik.values.projectType}
          isInvalid={!!formik.errors.projectType}
          validationMsg={formik.errors.projectType}
          />

        <CustomInput
          name="skillsRequired"
          label="Skills Required"
          placeholder="Enter the skills desired from freelancers in form of comma-separated"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.skillsRequired}
          isInvalid={!!formik.errors.skillsRequired}
          validationMsg={formik.errors.skillsRequired}
          />

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Create Job Post
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
    </>
    )
}

export default PostForm