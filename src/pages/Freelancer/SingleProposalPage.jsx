// components/freelancer/ProposalDetailFreelancer.jsx
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

export const ProposalDetailFreelancer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Separate API handlers
  const fetchProposal = useAxios();
  const withdrawProposal = useAxios();

  const [proposal, setProposal] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Fetch proposal details
  useEffect(() => {
    fetchProposal.fetchData({ 
      url: `my-proposal/${id}`, 
      method: "GET" 
    });
  }, [id]);

  // Handle fetch response
  useEffect(() => {
    if (fetchProposal.response) {
      console.log(fetchProposal.response);
      setProposal(fetchProposal.response.proposal);
    }

    if (fetchProposal.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: fetchProposal.error,
      });
    }
  }, [fetchProposal.response, fetchProposal.error]);

  // Handle withdraw proposal response
  useEffect(() => {
    if (withdrawProposal.response) {
      Swal.fire({
        icon: "success",
        title: "Proposal Withdrawn",
        text: "Your proposal has been withdrawn successfully.",
      });
      setProposal({ ...proposal, status: "withdrawn" });
    }

    if (withdrawProposal.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: withdrawProposal.error || "Failed to withdraw proposal",
      });
    }
  }, [withdrawProposal.response, withdrawProposal.error]);

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = async () => {
    setShowWithdrawModal(false);

    try {
      await withdrawProposal.fetchData({
        url: `withdraw-proposal/${id}`,
        method: "PUT",
      });
    } catch (err) {
      console.error("Withdraw failed:", err);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      submitted: "warning",
      accepted: "success",
      rejected: "danger",
      withdrawn: "secondary",
      archived: "dark",
    };
    return statusColors[status] || "secondary";
  };

  if (fetchProposal.loading || !proposal) {
    return (
      <Container className="app-container page">
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="app-container page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Proposal</h2>
        <Button variant="outline-light" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      {/* Status Alerts */}
      {proposal.status === "accepted" && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>
            <i className="bi bi-check-circle me-2"></i>
            Proposal Accepted!
          </Alert.Heading>
          <p className="mb-0">
            Great news! The client has accepted your proposal. They will create a
            contract soon.
          </p>
        </Alert>
      )}

      {proposal.status === "rejected" && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-x-circle me-2"></i>
          This proposal was rejected by the client.
        </Alert>
      )}

      {proposal.status === "withdrawn" && (
        <Alert variant="secondary" className="mb-4">
          <i className="bi bi-arrow-counterclockwise me-2"></i>
          You have withdrawn this proposal.
        </Alert>
      )}

      {proposal.contract && (
        <Alert variant="info" className="mb-4">
          <Alert.Heading>Contract Created</Alert.Heading>
          <p>A contract has been created for this proposal.</p>
          <Button
            variant="info"
            onClick={() =>
              navigate(`/${RoutePath.FREELANCER}/${RoutePath.CONTRACT}/${proposal.contract.id}`)
            }
            className="mt-2"
          >
            View Contract
          </Button>
        </Alert>
      )}

      <Row>
        {/* Main Content */}
        <Col lg={8}>
          {/* Post Information Card */}
          {proposal.post && (
            <Card className="app-card mb-4">
              <Card.Body>
                <h5 className="mb-3">
                  <i className="bi bi-briefcase me-2"></i>
                  Job Post Details
                </h5>

                <div className="mb-3">
                  <h3 className="app-card-title">{proposal.post.title}</h3>
                </div>

                {proposal.post.summary && (
                  <div className="mb-3">
                    <p className="text-muted mb-0">{proposal.post.summary}</p>
                  </div>
                )}

                <Row className="mb-3">
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="text-light">Client's Budget:</strong>
                      <span className="ms-2" style={{ color: "var(--accent)" }}>
                        ${proposal.post.price}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="text-light">Project Type:</strong>
                      <Badge bg="light" text="dark" className="ms-2">
                        {proposal.post.projectType?.replace("_", " ")}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <strong className="text-light">Experience Level Required:</strong>
                  <Badge bg="secondary" className="ms-2">
                    {proposal.post.levelOfExpertiseRequired?.replace("_", " ")}
                  </Badge>
                </div>

                {proposal.post.skillsRequired &&
                  proposal.post.skillsRequired.length > 0 && (
                    <div className="mb-3">
                      <strong className="text-light d-block mb-2">
                        Skills Required:
                      </strong>
                      <div className="d-flex flex-wrap gap-2">
                        {proposal.post.skillsRequired.map((skill, i) => (
                          <span key={i} className="badge bg-secondary px-3 py-2">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Client Info */}
                {proposal.post.client && (
                  <div className="mt-4 pt-3 border-top border-secondary">
                    <strong className="text-light d-block mb-2">Posted By:</strong>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <i className="bi bi-person-fill text-white fs-5"></i>
                      </div>
                      <div>
                        <p className="mb-0 fw-bold">
                          {proposal.post.client.user?.name ||
                            proposal.post.client.name ||
                            "Client"}
                        </p>
                        {proposal.post.client.company && (
                          <small className="text-muted">
                            {proposal.post.client.company}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    Posted on:{" "}
                    {new Date(proposal.post.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Proposal Details Card */}
          <Card className="app-card mb-4">
            <Card.Body>
              {/* Status */}
              <div className="mb-4">
                <h5 className="mb-2">Proposal Status</h5>
                <Badge bg={getStatusColor(proposal.status)} className="fs-6 px-3 py-2">
                  {proposal.status.charAt(0).toUpperCase() +
                    proposal.status.slice(1)}
                </Badge>
              </div>

              {/* Cover Letter */}
              <div className="mb-4">
                <h5 className="mb-3">Your Cover Letter</h5>
                <Card className="border-secondary">
                  <Card.Body>
                    <p style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>
                      {proposal.coverLetter}
                    </p>
                  </Card.Body>
                </Card>
              </div>

              {/* Attachment */}
              {proposal.attachment && (
                <div className="mb-4">
                  <h5 className="mb-3">Attachment</h5>
                  <Card className="bg-dark border-secondary">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-paperclip fs-4"></i>
                        <div>
                          <p className="mb-0">
                            {proposal.attachment.split("/").pop()}
                          </p>
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none"
                            onClick={() => window.open(proposal.attachment, "_blank")}
                          >
                            Download Attachment
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Submission Date */}
              <div className="mb-0">
                <small className="text-muted">
                  <i className="bi bi-calendar me-2"></i>
                  Submitted on:{" "}
                  {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Bid Information Card */}
          <Card className="app-card mb-4">
            <Card.Body>
              <h5 className="mb-3">Your Bid</h5>

              <div className="mb-3">
                <p className="text-muted mb-1">Bid Amount</p>
                <h3 className="mb-0" style={{ color: "var(--accent)" }}>
                  ${proposal.bidAmount}
                </h3>
              </div>

              <div className="mb-3">
                <p className="text-muted mb-1">Bid Type</p>
                <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                  {proposal.bidType?.replace("_", " ")}
                </Badge>
              </div>

              <div className="mb-3">
                <p className="text-muted mb-1">Estimated Delivery</p>
                <p className="mb-0 fw-bold">
                  <i className="bi bi-clock me-2"></i>
                  {proposal.estimatedDeliveryDays} days
                </p>
              </div>

              {/* Show comparison with client budget */}
              {proposal.post?.price && (
                <div className="mt-3 pt-3 border-top border-secondary">
                  <p className="text-muted mb-1">Client's Budget</p>
                  <p className="mb-0">${proposal.post.price}</p>
                  {proposal.bidAmount < proposal.post.price && (
                    <small className="text-success">
                      <i className="bi bi-arrow-down me-1"></i>
                      Your bid is ${(proposal.post.price - proposal.bidAmount).toFixed(2)}{" "}
                      under budget
                    </small>
                  )}
                  {proposal.bidAmount > proposal.post.price && (
                    <small className="text-warning">
                      <i className="bi bi-arrow-up me-1"></i>
                      Your bid is ${(proposal.bidAmount - proposal.post.price).toFixed(2)}{" "}
                      over budget
                    </small>
                  )}
                  {proposal.bidAmount === proposal.post.price && (
                    <small className="text-info">
                      <i className="bi bi-check me-1"></i>
                      Matches client's budget
                    </small>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Action Buttons Card */}
          <Card className="app-card">
            <Card.Body>
              <h5 className="mb-3">Actions</h5>

              {/* Withdraw Button - Only for submitted proposals */}
              {proposal.status === "submitted" && (
                <Button
                  variant="warning"
                  className="w-100 mb-2"
                  onClick={handleWithdraw}
                  disabled={withdrawProposal.loading}
                >
                  {withdrawProposal.loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-counterclockwise me-2"></i>
                      Withdraw Proposal
                    </>
                  )}
                </Button>
              )}

              {/* View Contract Button - If contract exists */}
              {proposal.contract && (
                <Button
                  variant="info"
                  className="w-100 mb-2"
                  onClick={() =>
                    navigate(
                      `/${RoutePath.FREELANCER}/${RoutePath.CONTRACT}/${proposal.contract.id}`
                    )
                  }
                >
                  <i className="bi bi-eye me-2"></i>
                  View Contract
                </Button>
              )}

              {/* Status Messages */}
              {proposal.status === "accepted" && !proposal.contract && (
                <Alert variant="success" className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Your proposal has been accepted! Wait for the client to create a
                  contract.
                </Alert>
              )}

              {proposal.status === "rejected" && (
                <Alert variant="danger" className="mb-0">
                  <i className="bi bi-x-circle me-2"></i>
                  This proposal was rejected.
                </Alert>
              )}

              {proposal.status === "withdrawn" && (
                <Alert variant="secondary" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  You have withdrawn this proposal.
                </Alert>
              )}

              {/* No actions available */}
              {proposal.status === "submitted" && !proposal.contract && (
                <Alert variant="info" className="mb-0 mt-2">
                  <i className="bi bi-hourglass-split me-2"></i>
                  Waiting for client's response...
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Withdraw Confirmation Modal */}
      <Modal
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Confirm Withdrawal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>
            Are you sure you want to withdraw this proposal? You won't be able to
            resubmit it.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={confirmWithdraw}>
            Confirm Withdrawal
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};