import { useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { useState } from "react";
import { Card, Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router";
import { RoutePath } from "../../routes/routes";

export const MyClientPosts = () => {
    
    const {response,  error,fetchData} = useAxios()

    const [clientPosts, setClientPosts] = useState([])

    const navigate = useNavigate()

    useEffect(()=> {
        fetchData({url: "get-my-posts", method: "GET"})

    }, [])

    useEffect(()=> {
        if (response) {
            console.log(response.clientPosts)
            setClientPosts(response.clientPosts)
        }

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error,
            });
                }
    }, [response, error])


    return (
    <Container className="app-container page">
      <h2 className="text-center fw-bold mb-4">Job Posts</h2>

      {!response && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      )}

      <Row className="g-4 justify-content-center">
        {clientPosts.map((post, index) => (
          <Col md={6} lg={4} key={post.id}>
            <Card className="app-card h-100" style={{ cursor: "pointer", border: "2px solid #7c3aed" }} onClick={() => {
                console.log("Clicked")
                navigate(`/${RoutePath.CLIENT}/${RoutePath.MY_POST}/${post.id}`, { replace: true })
              }}>
              <Card.Body>
                <Card.Title className="app-card-title">{post.title}</Card.Title>
                <Card.Subtitle className="app-card-subtitle mb-3">
                  {post.levelOfExpertiseRequired?.replace("_", " ")}
                </Card.Subtitle>
                <Card.Text style={{ minHeight: "60px", color: "var(--muted)" }}>
                  {post.summary?.length > 90
                    ? post.summary.substring(0, 90) + "..."
                    : post.summary || "No summary provided."}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="fw-bold" style={{ color: "var(--accent)" }}>${post.price}</span>
                  <span className="badge bg-light text-dark">{post.projectType?.replace("_", " ")}</span>
                </div>
              </Card.Body>
              {post.skillsRequired?.length > 0 && (
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <div className="d-flex flex-wrap gap-2">
                    {post.skillsRequired.map((skill, i) => (
                      <span key={i} className="badge bg-secondary text-white px-3 py-2 rounded-pill">{skill}</span>
                    ))}
                  </div>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    )

}