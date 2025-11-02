import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { RoutePath } from "@/routes/routes";

const ClientHome = () => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate(RoutePath.HOME+RoutePath.AUTH+"/"+RoutePath.CREATE_POST);
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand className="fw-bold fs-4" style={{ cursor: "pointer" }}>
            FreelanceHub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              <Button variant="primary" onClick={handleCreatePost}>
                Create Job Post
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="text-center mt-5">
        <h2 className="fw-semibold mb-3">Welcome to FreelanceHub!</h2>
        <p className="text-muted mb-4">
          Find top freelancers for your next project, manage your job posts, and
          collaborate seamlessly.
        </p>
        <Button variant="success" onClick={handleCreatePost}>
          Create Your First Job Post
        </Button>
      </Container>
    </>
  );
};

export default ClientHome;
