import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge, Button } from "react-bootstrap";
import { FaArrowLeft, FaDollarSign, FaClock, FaTools } from "react-icons/fa";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
import { RoutePath } from "../../routes/routes";
import { useNavigate } from "react-router";


const SinglePagePostFreelancer = () => {
    const {id} = useParams()

    const navigate = useNavigate()
    const {fetchData, response, error} = useAxios()

    const [post, setPost] = useState(null)
    useEffect(()=>{
        fetchData({url: `post/${id}`, method: "GET"})
    }, [id])

    useEffect(()=>{
        if (response) {
            setPost(response.post)
            console.log(response.post.client.user)
        }
    }, [response])

    useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  }, [error]);


    if (!post) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }


  return (
    <Container className="py-5">
      {/* Back Button */}
      <Button
        variant="outline-primary"
        className="mb-4 d-flex align-items-center gap-2"
        onClick={() => navigate(`/${RoutePath.FREELANCER}/${RoutePath.GET_POSTS}`)}
      >
        <FaArrowLeft /> Back to Posts
      </Button>

      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header className="bg-transparent text-white rounded-top-4 p-4" style={{borderBottom: '1px solid rgba(255,255,255,0.03)'}}>
          <h2 className="fw-bold mb-1">{post.title}</h2>
          <p className="mb-0">
            <span className="me-3">
              <FaDollarSign /> <strong>${post.price}</strong>
            </span>
            <span className="me-3">
              <FaClock /> {post.levelOfExpertiseRequired?.replace("_", " ")}
            </span>
            <Badge bg="light" text="dark" className="px-3 py-2">
              {post.projectType?.replace("_", " ")}
            </Badge>
          </p>
        </Card.Header>

        <Card.Body className="p-4">
          <Row className="mb-4">
            <Col md={8}>
              <h5 className="fw-semibold mb-2" style={{ color: "#e6eef8" }}>Project Description</h5>
              <p className="text-secondary" style={{ whiteSpace: "pre-line" }}>
                {post.summary || "No description provided."}
              </p>
            </Col>

            <Col md={4}>
              <h5 className="fw-semibold mb-2" style={{ color: "#e6eef8" }}>Skills Required</h5>
              <div className="d-flex flex-wrap gap-2">
                {post.skillsRequired?.map((skill, index) => (
                  <Badge
                    bg="primary-subtle"
                    text="primary"
                    className="px-3 py-2 rounded-pill"
                    key={index}
                  >
                    <FaTools className="me-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <h6 className="text-muted">Posted On:</h6>
              <p style={{ color: "#e6eef8" }}>{new Date(post.createdAt).toLocaleDateString()}</p>
            </Col>
            <Col md={6} className="mb-3">
              <h6 className="text-muted">Deadline / Duration:</h6>
              <p style={{ color: "#e6eef8" }}>{post.duration || "Not specified"}</p>
            </Col>
          </Row>

          {post.client && (
            <div className="mt-4 p-3 border rounded-3 bg-transparent" style={{borderColor: 'rgba(255,255,255,0.04)'}}>
              <h5 className="fw-semibold mb-2" style={{ color: "#e6eef8" }}>Client Information</h5>
              <p className="mb-1" style={{ color: "#e6eef8" }}>
                <strong>Name:</strong> {post.client.user || post.client.user}
              </p>
              <p className="mb-1" style={{ color: "#e6eef8" }}>
                <strong>Email:</strong> {post.client.user}
              </p>
              <p className="mb-0" style={{ color: "#e6eef8" }}>
                <strong>Rating:</strong> {post.client.rating || "N/A"} / 5
              </p>
            </div>
          )}
        </Card.Body>
          <Button variant="primary" onClick={() => navigate(`/${RoutePath.FREELANCER}/${RoutePath.SEND_PROPOSAL}`)}>
            Send Proposal
          </Button>
        <Card.Footer className="bg-transparent border-0 text-end">
          <Button variant="primary" onClick={() => navigate(`/${RoutePath.FREELANCER}/${RoutePath.GET_POSTS}`)}>
            Go Back
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );

}


export default SinglePagePostFreelancer