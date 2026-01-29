// components/client/ClientContractDetail.jsx
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

export const ClientContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Separate useAxios instances for different operations
  const fetchContract = useAxios();
  const cancelContractApi = useAxios();
  const completeContractApi = useAxios();
  const rejectSubmissionApi = useAxios();

  const [contract, setContract] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'cancel', 'complete', 'reject_submission'

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

  // Handle cancel contract response
  useEffect(() => {
    if (cancelContractApi.response) {
      Swal.fire({
        icon: "success",
        title: "Contract Cancelled",
        text: "The contract has been cancelled successfully.",
      });
      setContract({ ...contract, status: "cancelled" });
    }

    if (cancelContractApi.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: cancelContractApi.error || "Failed to cancel contract",
      });
    }
  }, [cancelContractApi.response, cancelContractApi.error]);

  // Handle complete contract response
  useEffect(() => {
    if (completeContractApi.response) {
      Swal.fire({
        icon: "success",
        title: "Contract Completed",
        text: "The contract has been marked as completed!",
      });
      setContract({ ...contract, status: "completed" });
    }

    if (completeContractApi.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: completeContractApi.error || "Failed to complete contract",
      });
    }
  }, [completeContractApi.response, completeContractApi.error]);

  // Handle reject submission response
  useEffect(() => {
    if (rejectSubmissionApi.response) {
      Swal.fire({
        icon: "info",
        title: "Submission Rejected",
        text: "The submission has been rejected. Contract is now active again.",
      });
      setContract({ ...contract, status: "active" });
    }

    if (rejectSubmissionApi.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: rejectSubmissionApi.error || "Failed to reject submission",
      });
    }
  }, [rejectSubmissionApi.response, rejectSubmissionApi.error]);

  const handleAction = (action) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setShowActionModal(false);

    try {
      switch (actionType) {
        case "cancel":
          await cancelContractApi.fetchData({
            url: `cancel-contract/${contractId}`,
            method: "PUT",
          });
          break;
        case "complete":
          await completeContractApi.fetchData({
            url: `complete-contract/${contractId}`,
            method: "PUT",
          });
          break;
        case "reject_submission":
          await rejectSubmissionApi.fetchData({
            url: `update-status/${contractId}?contractStatus="active"`,
            method: "PUT",
            data: { status: "active" },
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
          <i className="bi bi-hourglass-split me-2"></i>
          This contract is pending acceptance by the freelancer.
        </Alert>
      )}

      {contract.status === "submitted" && (
        <Alert variant="info" className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          The freelancer has submitted their work for review.
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
                    {contract.client?.user?.name || "Client"}
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
                    {contract.freelancer?.user?.name || "Freelancer"}
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
                <p className="text-muted mb-0">{contract.post.summary}</p>
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
                    {contract.client?.user?.name || "Client"}
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
                    {contract.freelancer?.user?.name || "Freelancer"}
                  </p>
                  <div className="border-top border-secondary pt-2">
                    {contract.status !== "pending" && contract.status !== "rejected" ? (
                      <small className="text-muted">
                        Signed: {formatDateTime(contract.updatedAt)}
                      </small>
                    ) : (
                      <small className="text-warning">Pending signature</small>
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

          {/* Active Status - Can Cancel */}
          {(contract.status === "active" || contract.status === "pending") && (
            <Button
              variant="danger"
              className="w-100 mb-2"
              onClick={() => handleAction("cancel")}
              disabled={cancelContractApi.loading}
            >
              {cancelContractApi.loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Cancelling...
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel Contract
                </>
              )}
            </Button>
          )}

          {/* Submitted Status - Can Complete or Reject */}
          {contract.status === "submitted" && (
            <>
              <Button
                variant="success"
                className="w-100 mb-2"
                onClick={() => handleAction("complete")}
                disabled={completeContractApi.loading}
              >
                {completeContractApi.loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Completing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Accept Submission & Complete Contract
                  </>
                )}
              </Button>

              <Button
                variant="warning"
                className="w-100"
                onClick={() => handleAction("reject_submission")}
                disabled={rejectSubmissionApi.loading}
              >
                {rejectSubmissionApi.loading ? (
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
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Request Revisions (Reject Submission)
                  </>
                )}
              </Button>
            </>
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
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>
            Confirm{" "}
            {actionType === "cancel"
              ? "Cancellation"
              : actionType === "complete"
              ? "Completion"
              : "Revision Request"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {actionType === "cancel" && (
            <p>
              Are you sure you want to cancel this contract? This action cannot be
              undone.
            </p>
          )}
          {actionType === "complete" && (
            <p>
              Are you sure you want to accept the submission and mark this contract as
              completed? Payment will be processed.
            </p>
          )}
          {actionType === "reject_submission" && (
            <p>
              Are you sure you want to reject the submission? The contract will return
              to active status and the freelancer will be notified to make revisions.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>
            Cancel
          </Button>
          <Button
            variant={
              actionType === "cancel"
                ? "danger"
                : actionType === "complete"
                ? "success"
                : "warning"
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