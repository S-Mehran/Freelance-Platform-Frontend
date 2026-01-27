import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import { replace, useNavigate } from "react-router";
import { Outlet, Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { RoutePath } from "../../routes/routes";

//Use user context to navigate instead of creating two pages for navigation
const ClientPostsFreelancer = () => {
  const navigate = useNavigate();
  const { response, fetchData, error } = useAxios();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    fetchData({
      url: `/get-posts?pg=${page}`,
      method: "GET",
    });
  }, [page]);

  useEffect(() => {
    if (response) {
      setPosts(response.posts || []);
      setPageCount(response.totalPages || 1);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  }, [error]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setPage(newPage);
    }
  };

  return (
    <Container className="app-container page">
      <h2 className="text-center fw-bold mb-4">Job Posts</h2>

      {!response && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      )}

      <Row className="g-4 justify-content-center">
        {posts.map((post) => (
          <Col md={6} lg={4} key={post.id}>
            <Card
              className="app-card h-100"
              style={{ cursor: "pointer", border: "2px solid #7c3aed" }}
              onClick={() =>
                navigate(
                  `/${RoutePath.FREELANCER}/${RoutePath.SINGLE_POST}/${post.id}`,
                  { replace: true }
                )
              }
            >
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
                  <span className="fw-bold" style={{ color: "var(--accent)" }}>
                    ${post.price}
                  </span>
                  <span className="badge bg-light text-dark">
                    {post.projectType?.replace("_", " ")}
                  </span>
                </div>
              </Card.Body>
              {post.skillsRequired?.length > 0 && (
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <div className="d-flex flex-wrap gap-2">
                    {post.skillsRequired.map((skill, i) => (
                      <span key={i} className="badge bg-secondary text-white px-3 py-2 rounded-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {posts.length > 0 && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
            {[...Array(pageCount)].map((_, idx) => (
              <Pagination.Item key={idx + 1} active={page === idx + 1} onClick={() => handlePageChange(idx + 1)}>
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === pageCount} />
            <Pagination.Last onClick={() => handlePageChange(pageCount)} disabled={page === pageCount} />
          </Pagination>
        </div>
      )}

    </Container>
  );
};

export default ClientPostsFreelancer;

