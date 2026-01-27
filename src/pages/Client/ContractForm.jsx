// components/client/CreateContractForm.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { RoutePath } from "../../routes/routes";

export const CreateContractForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { response, error, loading, fetchData } = useAxios();

  // Get pre-filled data from navigation state
  const proposalData = location.state || {};

  const [formData, setFormData] = useState({
    proposalId: proposalData.proposalId || "",
    freelancerId: proposalData.freelancerId || "",
    postId: proposalData.postId || "",
    agreedPrice: proposalData.bidAmount || "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});

  // Set minimum start date to today
  const today = new Date().toISOString().split("T")[0];

  // Calculate suggested end date based on estimated delivery
  useEffect(() => {
    if (proposalData.estimatedDeliveryDays && !formData.startDate) {
      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + proposalData.estimatedDeliveryDays);
      
      setFormData((prev) => ({
        ...prev,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      }));
    }
  }, [proposalData.estimatedDeliveryDays]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.agreedPrice || formData.agreedPrice <= 0) {
      newErrors.agreedPrice = "Agreed price must be greater than zero";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.startDate && new Date(formData.startDate) < new Date(today)) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await fetchData({
        url: "create-contract",
        method: "POST",
        data: {
          ...formData
//          clientId: localStorage.getItem("userId"),
        },
      });
    } catch (err) {
      console.error("Error creating contract:", err);
    }
  };

  useEffect(() => {
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Contract Created!",
        text: "The contract has been sent to the freelancer for acceptance.",
      }).then(() => {
        navigate(`/${RoutePath.CLIENT}/${RoutePath.GET_MY_POSTS}`);
      });
    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Failed to create contract",
      });
    }
  }, [response, error]);

  // If no proposal data, show error
  if (!proposalData.proposalId) {
    return (
      <Container className="app-container page">
        <Alert variant="danger">
          <Alert.Heading>Invalid Access</Alert.Heading>
          <p>No proposal data found. Please access this page from an accepted proposal.</p>
          <Button
            variant="danger"
            onClick={() => navigate(`/${RoutePath.CLIENT}/${RoutePath.MY_POSTS}`)}
          >
            Go to My Posts
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="app-container page">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="app-card">
            <Card.Body>
              <h2 className="fw-bold mb-4 text-center">Create Contract</h2>

              <Alert variant="info" className="mb-4">
                <i className="bi bi-info-circle me-2"></i>
                Review and confirm the contract details. The freelancer will need to accept
                before the contract becomes active.
              </Alert>

              <Form onSubmit={handleSubmit}>
                {/* Agreed Price */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-light fw-bold">
                    Agreed Price ($) *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="1.0"
                    name="agreedPrice"
                    value={formData.agreedPrice}
                    onChange={handleChange}
                    isInvalid={!!errors.agreedPrice}
                    className="bg-dark text-light border-secondary"
                    placeholder="Enter agreed price"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.agreedPrice}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Original bid amount: ${proposalData.bidAmount}
                  </Form.Text>
                </Form.Group>

                {/* Start Date */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-light fw-bold">
                    Start Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={today}
                    isInvalid={!!errors.startDate}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* End Date */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-light fw-bold">
                    End Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || today}
                    isInvalid={!!errors.endDate}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Suggested based on estimated delivery: {proposalData.estimatedDeliveryDays} days
                  </Form.Text>
                </Form.Group>

                {/* Duration Display */}
                {formData.startDate && formData.endDate && (
                  <Alert variant="secondary" className="mb-4">
                    <strong>Contract Duration:</strong>{" "}
                    {Math.ceil(
                      (new Date(formData.endDate) - new Date(formData.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                    className="flex-fill"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="flex-fill"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Contract
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};