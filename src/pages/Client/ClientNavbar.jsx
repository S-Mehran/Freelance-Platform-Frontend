import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router";
import { RoutePath } from "../../routes/routes";

const ClientNavbar = () => {
  return (
    <Navbar expand="lg" sticky="top" className="app-header">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/client/home" className="app-brand">
          <span className="brand-title">FreelanceHub</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="client-navbar" />
        <Navbar.Collapse id="client-navbar">
          {/* Left-side navigation */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/client/get-posts">
              See Posts
            </Nav.Link>
            <Nav.Link as={Link} to="/client">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/client/create-job">
              Post a Job
            </Nav.Link>
            <Nav.Link as={Link} to={`/client/${RoutePath.GET_MY_POSTS}`}>
              My Jobs
            </Nav.Link>
            <Nav.Link as={Link} to="/client">
              Messages
            </Nav.Link>
          </Nav>

          {/* Right-side navigation */}
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/client/profile" className="text-muted me-2">
              Profile
            </Nav.Link>
            <Button as={Link} to="/client/logout" size="sm" className="btn btn-ghost">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ClientNavbar;
