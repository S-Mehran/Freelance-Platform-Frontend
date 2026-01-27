import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge, Button } from "react-bootstrap";
import { FaArrowLeft, FaEdit, FaTrash, FaDollarSign, FaClock, FaTools } from "react-icons/fa";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
import { RoutePath } from "../../routes/routes";
import { Outlet } from "react-router";

const SingleMyPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { response, fetchData, error } = useAxios();
  const { response: deleteRes, fetchData: deleteRequest } = useAxios();

  const [post, setPost] = useState(null);

  // Fetch My Post
  useEffect(() => {
    fetchData({
      url: `/my-post/${id}`, // dedicated route to get authenticated client’s post
      method: "GET",
    });
  }, [id]);

  useEffect(() => {
    if (response) setPost(response.post);
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    }
  }, [error]);

  // Handle Delete Request Success
  useEffect(() => {
    if (deleteRes) {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your post has been deleted successfully.",
      });
      navigate(`/${RoutePath.CLIENT}/${RoutePath.GET_MY_POSTS}`); // redirect to list
    }
  }, [deleteRes]);

  // Delete Post Handler
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRequest({
          url: `delete-post/${id}`,
          method: "DELETE",
        });
      }
    });
  };

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
        onClick={() => navigate(`/${RoutePath.CLIENT}/${RoutePath.GET_MY_POSTS}`)}
      >
        <FaArrowLeft /> Back to My Posts
      </Button>

      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header className="bg-primary text-white rounded-top-4 p-4 d-flex justify-content-between align-items-start">
          <div>
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
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <Button
              variant="warning"
              className="d-flex align-items-center gap-1"
              onClick={() => navigate(`/client/edit-post/${id}`)}
            >
              <FaEdit />
              Edit
            </Button>

            <Button
              variant="danger"
              className="d-flex align-items-center gap-1"
              onClick={handleDelete}
            >
              <FaTrash />
              Delete
            </Button>
          </div>
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
        </Card.Body>

        <Card.Footer className="bg-transparent border-0 text-end">
                    <Button
                      variant="outline-light"
                      onClick={() => navigate(`/${RoutePath.CLIENT}/${RoutePath.GET_PROPOSALS_BY_POST}/${id}`)}
                      className="gap-2"
                    >
                      See Proposals
                    </Button>
          <Button variant="primary" onClick={() => navigate(`/${RoutePath.CLIENT}/${RoutePath.GET_MY_POSTS}`, {state: {post: post.title}})}>
            Go Back
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SingleMyPostPage;
