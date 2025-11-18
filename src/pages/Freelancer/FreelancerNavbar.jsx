import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router";

const FreelancerNavbar = () => {
  return (
    <Navbar expand="lg" sticky="top" className="app-header">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/freelancer/home" className="app-brand">
          <span className="brand-title">FreelanceHub</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="freelancer-navbar" />
        <Navbar.Collapse id="freelancer-navbar">
          {/* Left-side navigation */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/freelancer/home">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/freelancer/jobs">
              Browse Jobs
            </Nav.Link>
            <Nav.Link as={Link} to="/freelancer/my-proposals">
              My Proposals
            </Nav.Link>
            <Nav.Link as={Link} to="/freelancer/contracts">
              Contracts
            </Nav.Link>
          </Nav>

          {/* Right-side navigation */}
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/freelancer/profile" className="text-muted me-2">
              Profile
            </Nav.Link>
            <Button as={Link} to="/freelancer/logout" size="sm" className="btn btn-ghost">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default FreelancerNavbar;
