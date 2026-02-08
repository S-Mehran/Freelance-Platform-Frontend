// components/freelancer/FreelancerContractDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import {
  Container,
  Card,
  Button,
  Spinner,
  Badge,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import { RoutePath } from "../../routes/routes";

export const FreelancerContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Separate useAxios instances for different operations
  const fetchContract = useAxios();
  const acceptContractApi = useAxios();
  const rejectContractApi = useAxios();
  const submitContractApi = useAxios();

  const [contract, setContract] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'accept', 'reject', 'submit'
 const contractId = id
  // Fetch contract details
  useEffect(() => {
    fetchContract.fetchData({
      url: `get-contract-info/${contractId}`,
      method: "GET",
    });
  }, [contractId]);

  // Handle fetch response
  useEffect(() => {
    if (fetchContract.response) {
      console.log(fetchContract.response);
      setContract(fetchContract.response);
    }

    if (fetchContract.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: fetchContract.error,
      });
    }
  }, [fetchContract.response, fetchContract.error]);

  // Handle accept contract response
  useEffect(() => {
    if (acceptContractApi.response) {
      Swal.fire({
        icon: "success",
        title: "Contract Accepted",
        text: "You have successfully accepted this contract. Let's get to work!",
      });
      setContract({ ...contract, status: "active" });
    }

    if (acceptContractApi.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: acceptContractApi.error || "Failed to accept contract",
      });
    }
  }, [acceptContractApi.response, acceptContractApi.error]);

  // Handle reject contract response
  useEffect(() => {
    if (rejectContractApi.response) {
      Swal.fire({
        icon: "info",
        title: "Contract Rejected",
        text: "You have declined this contract.",
      });
      setContract({ ...contract, status: "rejected" });
    }

    if (rejectContractApi.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: rejectContractApi.error || "Failed to reject contract",
      });
    }
  }, [rejectContractApi.response, rejectContractApi.error]);

  // Handle submit contract response
  useEffect(() => {
    if (submitContractApi.response) {
      Swal.fire({
        icon: "success",
        title: "Work Submitted",
        text: "Your work has been submitted for client review!",
      });
      setContract({ ...contract, status: "submitted" });
    }

    if (submitContractApi.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: submitContractApi.error || "Failed to submit work",
      });
    }
  }, [submitContractApi.response, submitContractApi.error]);

  const handleAction = (action) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setShowActionModal(false);

    try {
      switch (actionType) {
        case "accept":
          await acceptContractApi.fetchData({
            url: `accept-contract/${contractId}`,
            method: "PUT",
          });
          break;
        case "reject":
          await rejectContractApi.fetchData({
            url: `reject-contract/${contractId}`,
            method: "PUT",
          });
          break;
        case "submit":
          await submitContractApi.fetchData({
            url: `submit-contract/${contractId}`,
            method: "PUT",
          });
          break;
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "warning",
      active: "success",
      rejected: "danger",
      cancelled: "secondary",
      submitted: "info",
      completed: "primary",
    };
    return statusColors[status] || "secondary";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const days = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (fetchContract.loading || !contract) {
    return (
      <Container className="app-container page">
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="app-container page" style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-light" onClick={() => navigate(-1)}>
          ← Back to Contracts
        </Button>
        <Badge bg={getStatusColor(contract.status)} className="fs-6 px-3 py-2">
          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
        </Badge>
      </div>

      {/* Status Alerts */}
      {contract.status === "pending" && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Action Required
          </Alert.Heading>
          <p className="mb-0">
            Please review this contract and either accept or reject it.
          </p>
        </Alert>
      )}

      {contract.status === "active" && (
        <Alert variant="success" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-check-circle me-2"></i>
              Contract is active. You have{" "}
              <strong>{getDaysRemaining(contract.endDate)} days</strong> remaining.
            </div>
            <Badge bg="info">{formatDate(contract.endDate)}</Badge>
          </div>
        </Alert>
      )}

      {contract.status === "submitted" && (
        <Alert variant="info" className="mb-4">
          <i className="bi bi-hourglass-split me-2"></i>
          Your work has been submitted and is awaiting client review.
        </Alert>
      )}

      {/* Main Contract Document */}
      <Card className="app-card mb-4 contract-document">
        <Card.Body className="p-5">
          {/* Contract Header */}
          <div className="text-center mb-5 pb-4 border-bottom border-secondary">
            <h1 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
              FREELANCE SERVICE CONTRACT
            </h1>
            <p className="text-muted mb-1">Contract ID: #{contract.id}</p>
            <p className="text-muted mb-0">
              Created on {formatDateTime(contract.createdAt)}
            </p>
          </div>

          {/* Parties Section */}
          <div className="mb-5">
            <h4 className="fw-bold mb-4 text-uppercase" style={{ letterSpacing: "1px" }}>
              Parties to this Agreement
            </h4>

            <Row>
              <Col md={6} className="mb-3">
                <div className="p-3 bg-dark rounded">
                  <h6 className="text-muted mb-2">CLIENT (First Party)</h6>
                  <p className="fw-bold mb-1">
                    {`${contract.client?.user?.firstName} ${contract.client?.user?.lastName}` || "Client"}
                  </p>
                  {contract.client?.company && (
                    <p className="mb-1">{contract.client.company}</p>
                  )}
                  <p className="text-muted mb-0">
                    <i className="bi bi-envelope me-2"></i>
                    {contract.client?.user?.email}
                  </p>
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div className="p-3 bg-dark rounded">
                  <h6 className="text-muted mb-2">FREELANCER (Second Party)</h6>
                  <p className="fw-bold mb-1">
                    {`${contract.freelancer?.user?.firstName} ${contract.freelancer?.user?.lastName}` || "Freelancer"}
                  </p>
                  {contract.freelancer?.title && (
                    <p className="mb-1">{contract.freelancer.title}</p>
                  )}
                  <p className="text-muted mb-0">
                    <i className="bi bi-envelope me-2"></i>
                    {contract.freelancer?.user?.email}
                  </p>
                </div>
              </Col>
            </Row>
          </div>

          {/* Project Details */}
          <div className="mb-5">
            <h4 className="fw-bold mb-4 text-uppercase" style={{ letterSpacing: "1px" }}>
              Project Details
            </h4>

            <div className="p-4 bg-dark rounded">
              <h5 className="mb-3">{contract.post?.title}</h5>
              {contract.post?.summary && (
                <p className="text-muted mb-3">{contract.post.summary}</p>
              )}
              
              {contract.post?.skillsRequired && contract.post.skillsRequired.length > 0 && (
                <div>
                  <strong className="d-block mb-2">Required Skills:</strong>
                  <div className="d-flex flex-wrap gap-2">
                    {contract.post.skillsRequired.map((skill, i) => (
                      <span key={i} className="badge bg-secondary px-3 py-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-5">
            <h4 className="fw-bold mb-4 text-uppercase" style={{ letterSpacing: "1px" }}>
              Terms and Conditions
            </h4>

            <div className="contract-terms">
              <div className="mb-4">
                <h6 className="fw-bold mb-2">1. Compensation</h6>
                <p className="ps-3 mb-0">
                  The Client agrees to pay the Freelancer a total amount of{" "}
                  <span className="fw-bold" style={{ color: "var(--accent)" }}>
                    ${contract.agreedPrice} USD
                  </span>{" "}
                  for the successful completion of the project as described above.
                </p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2">2. Project Timeline</h6>
                <div className="ps-3">
                  <p className="mb-2">
                    <strong>Commencement Date:</strong> {formatDate(contract.startDate)}
                  </p>
                  <p className="mb-2">
                    <strong>Delivery Date:</strong> {formatDate(contract.endDate)}
                  </p>
                  <p className="mb-0">
                    <strong>Duration:</strong>{" "}
                    {calculateDuration(contract.startDate, contract.endDate)} days
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2">3. Deliverables</h6>
                <p className="ps-3 mb-0">
                  The Freelancer agrees to deliver the project as specified in the
                  proposal and project description. All deliverables must meet the
                  quality standards and specifications outlined in the project details.
                </p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2">4. Payment Terms</h6>
                <p className="ps-3 mb-0">
                  Payment shall be released upon successful completion and acceptance of
                  the project by the Client. The Client agrees to review submitted work
                  within a reasonable timeframe and provide clear feedback if revisions
                  are required.
                </p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2">5. Intellectual Property</h6>
                <p className="ps-3 mb-0">
                  Upon full payment, all intellectual property rights related to the
                  deliverables shall be transferred to the Client. The Freelancer
                  retains the right to use the work in their portfolio unless otherwise
                  agreed.
                </p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2">6. Confidentiality</h6>
                <p className="ps-3 mb-0">
                  Both parties agree to maintain confidentiality regarding any
                  proprietary information shared during the course of this project.
                </p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2">7. Termination</h6>
                <p className="ps-3 mb-0">
                  Either party may terminate this agreement with written notice. In the
                  event of termination, the Client shall pay for work completed up to
                  the termination date.
                </p>
              </div>
            </div>
          </div>

          {/* Pledge Statement */}
          <div className="mb-5 p-4 bg-dark rounded border border-secondary">
            <h5 className="fw-bold mb-3 text-center">
              <i className="bi bi-shield-check me-2"></i>
              Agreement Pledge
            </h5>
            <p className="text-center mb-0" style={{ fontStyle: "italic" }}>
              By accepting this contract, both parties acknowledge that they have read,
              understood, and agree to be bound by all terms and conditions outlined
              herein. This contract represents a legally binding agreement between the
              Client and the Freelancer for the provision of services as described.
            </p>
          </div>

          {/* Signatures Section */}
          <div className="mb-4">
            <h4 className="fw-bold mb-4 text-uppercase" style={{ letterSpacing: "1px" }}>
              Signatures
            </h4>

            <Row>
              <Col md={6} className="mb-3">
                <div className="p-3 bg-dark rounded">
                  <p className="text-muted mb-2">Client</p>
                  <p className="fw-bold mb-2">
                    {`${contract.client?.user?.firstName} ${contract.client?.user?.lastName}` || "Client"}
                  </p>
                  <div className="border-top border-secondary pt-2">
                    <small className="text-muted">
                      Signed: {formatDateTime(contract.createdAt)}
                    </small>
                  </div>
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div className="p-3 bg-dark rounded">
                  <p className="text-muted mb-2">Freelancer</p>
                  <p className="fw-bold mb-2">
                    {`${contract.freelancer?.user?.firstName} ${contract.freelancer?.user?.lastName}` || "Freelancer"}
                  </p>
                  <div className="border-top border-secondary pt-2">
                    {contract.status !== "pending" && contract.status !== "rejected" ? (
                      <small className="text-muted">
                        Signed: {formatDateTime(contract.updatedAt)}
                      </small>
                    ) : (
                      <small className="text-warning">
                        {contract.status === "pending"
                          ? "Awaiting your signature"
                          : "Not signed"}
                      </small>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <Card className="app-card">
        <Card.Body>
          <h5 className="mb-3">Contract Actions</h5>

          {/* Pending Status - Can Accept or Reject */}
          {contract.status === "pending" && (
            <>
              <Button
                variant="success"
                className="w-100 mb-2"
                onClick={() => handleAction("accept")}
                disabled={acceptContractApi.loading}
              >
                {acceptContractApi.loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Accepting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Accept Contract
                  </>
                )}
              </Button>

              <Button
                variant="danger"
                className="w-100"
                onClick={() => handleAction("reject")}
                disabled={rejectContractApi.loading}
              >
                {rejectContractApi.loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle me-2"></i>
                    Reject Contract
                  </>
                )}
              </Button>
            </>
          )}

          {/* Active Status - Can Submit */}
          {contract.status === "active" && (
            <Button
              variant="primary"
              className="w-100"
              onClick={() => handleAction("submit")}
              disabled={submitContractApi.loading}
            >
              {submitContractApi.loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Submit Completed Work
                </>
              )}
            </Button>
          )}

          {/* Submitted Status - Waiting for Client */}
          {contract.status === "submitted" && (
            <Alert variant="info" className="mb-0">
              <i className="bi bi-hourglass-split me-2"></i>
              Your submission is under review by the client.
            </Alert>
          )}

          {/* No Actions Available */}
          {["completed", "rejected", "cancelled"].includes(contract.status) && (
            <Alert variant="secondary" className="mb-0">
              <i className="bi bi-info-circle me-2"></i>
              No actions available. This contract is {contract.status}.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)} centered>
        <Modal.Header closeButton className="text-light border-secondary">
          <Modal.Title>
            Confirm{" "}
            {actionType === "accept"
              ? "Acceptance"
              : actionType === "reject"
              ? "Rejection"
              : "Submission"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-light">
          {actionType === "accept" && (
            <p>
              By accepting this contract, you agree to complete the project as
              described and deliver it by {formatDate(contract.endDate)}. Are you sure
              you want to proceed?
            </p>
          )}
          {actionType === "reject" && (
            <p>
              Are you sure you want to reject this contract? This action cannot be
              undone and the client will be notified.
            </p>
          )}
          {actionType === "submit" && (
            <p>
              Are you sure you want to submit your completed work? Make sure all
              deliverables meet the project requirements before submitting.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>
            Cancel
          </Button>
          <Button
            variant={
              actionType === "accept"
                ? "success"
                : actionType === "reject"
                ? "danger"
                : "primary"
            }
            onClick={confirmAction}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};