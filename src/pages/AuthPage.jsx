import { useAuth } from "@/context/AuthContext";
import { Container, Row, Col } from "react-bootstrap";
import { Navigate, Outlet } from "react-router";

const AuthPage = () => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to={user.role === "client" ? "/client" : "/freelancer"} replace />
  ) : (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center bg-light"
    >
      <Row className="w-100 justify-content-center">
        <Col md={5} lg={4} xl={7}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;