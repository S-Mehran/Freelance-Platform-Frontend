// components/client/ProposalDetailClient.jsx
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

export const ProposalDetailClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Separate API handlers
  const fetchProposal = useAxios();
  const acceptProposal = useAxios();
  const rejectProposal = useAxios();

  const [proposal, setProposal] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'accept' or 'reject'

  // Fetch proposal details
  useEffect(() => {
    fetchProposal.fetchData({ 
      url: `get-freelancer-proposal/${id}`, 
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

  // Handle accept proposal response
  useEffect(() => {
    if (acceptProposal.response) {
      Swal.fire({
        icon: "success",
        title: "Proposal Accepted!",
        text: "You have successfully accepted this proposal.",
      });
      setProposal({ ...proposal, status: "accepted" });
      showContractCreationPrompt();
    }

    if (acceptProposal.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: acceptProposal.error || "Failed to accept proposal",
      });
    }
  }, [acceptProposal.response, acceptProposal.error]);

  // Handle reject proposal response
  useEffect(() => {
    if (rejectProposal.response) {
      Swal.fire({
        icon: "info",
        title: "Proposal Rejected",
        text: "The proposal has been rejected.",
      });
      setProposal({ ...proposal, status: "rejected" });
    }

    if (rejectProposal.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: rejectProposal.error || "Failed to reject proposal",
      });
    }
  }, [rejectProposal.response, rejectProposal.error]);

  const handleAction = (action) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setShowActionModal(false);

    try {
      if (actionType === "accept") {
        await acceptProposal.fetchData({
          url: `accept-proposal/${id}`,
          method: "PUT",
        });
      } else if (actionType === "reject") {
        await rejectProposal.fetchData({
          url: `reject-proposal/${id}`,
          method: "PUT",
        });
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const showContractCreationPrompt = () => {
    Swal.fire({
      title: "Proposal Accepted!",
      text: "Would you like to create a contract now?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Create Contract",
      cancelButtonText: "Later",
      confirmButtonColor: "#7c3aed",
    }).then((result) => {
      if (result.isConfirmed) {
        navigateToContractCreation();
      }
    });
  };

  const navigateToContractCreation = () => {
    navigate(`/${RoutePath.CLIENT}/${RoutePath.CREATE_CONTRACT}`, {
      state: {
        proposalId: proposal.id,
        freelancerId: proposal.freelancer?.id || proposal.freelancerId,
        postId: proposal.post?.id || proposal.postId,
        bidAmount: proposal.bidAmount,
        estimatedDeliveryDays: proposal.estimatedDeliveryDays,
      },
    });
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
        <h2 className="fw-bold">Proposal Details</h2>
        <Button variant="outline-light" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      {/* Status Alert for Accepted Proposals */}
      {proposal.status === "accepted" && !proposal.contract && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>Proposal Accepted!</Alert.Heading>
          <p>
            You've accepted this proposal. Create a contract to proceed with hiring
            this freelancer.
          </p>
          <Button
            variant="success"
            onClick={navigateToContractCreation}
            className="mt-2"
          >
            Create Contract Now
          </Button>
        </Alert>
      )}

      {proposal.contract && (
        <Alert variant="info" className="mb-4">
          <Alert.Heading>Contract Created</Alert.Heading>
          <p>A contract has been created for this proposal.</p>
          <Button
            variant="info"
            onClick={() =>
              navigate(`/${RoutePath.CLIENT}/${RoutePath.CONTRACT}/${proposal.contract.id}`)
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
          {/* Cover Letter Card */}
          <Card className="app-card mb-4">
            <Card.Body>
              {/* Status */}
              <div className="mb-4">
                <h5 className="mb-2">Proposal Status</h5>
                <Badge bg={getStatusColor(proposal.status)} className="fs-6 px-3 py-2">
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>

              {/* Post Title */}
              <div className="mb-4">
                <h5 className="text-muted mb-1">For Job Post:</h5>
                <h4>{proposal.post?.title || "Post Title"}</h4>
              </div>

              {/* Cover Letter */}
              <div className="mb-4">
                <h5 className="mb-3">Cover Letter</h5>
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
                  <Card className="border-secondary">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-paperclip fs-4"></i>
                        <div>
                          <p className="mb-0">{proposal.attachment.split("/").pop()}</p>
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
          {/* Freelancer Information Card */}
          {proposal.freelancer && (
            <Card className="app-card mb-4">
              <Card.Body>
                <h5 className="mb-3">
                  <i className="bi bi-person-badge me-2"></i>
                  Freelancer Information
                </h5>

                {/* Profile Picture / Avatar */}
                <div className="text-center mb-3">
                  <div
                    className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: "80px", height: "80px" }}
                  >
                    {proposal.freelancer.user?.profilePicture ? (
                      <img
                        src={proposal.freelancer.user.profilePicture}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    ) : (
                      <i className="bi bi-person-fill text-white" style={{ fontSize: "2.5rem" }}></i>
                    )}
                  </div>
                  <h5 className="mb-0">
                    {`${proposal.freelancer?.user?.firstName} ${proposal.freelancer?.user?.lastName}` || proposal.freelancer.name || "Freelancer"}
                  </h5>
                  {proposal.freelancer.title && (
                    <p className="text-muted mb-0">{proposal.freelancer.title}</p>
                  )}
                </div>

                {/* Contact Information */}
                {proposal.freelancer.user?.email && (
                  <div className="mb-3 p-2 rounded">
                    <small className="text-muted d-block">Email</small>
                    <p className="mb-0">
                      <i className="bi bi-envelope me-2"></i>
                      {proposal.freelancer.user.email}
                    </p>
                  </div>
                )}

                {/* Bio/Description */}
                {proposal.freelancer.bio && (
                  <div className="mb-3">
                    <strong className="text-light d-block mb-2">About</strong>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      {proposal.freelancer.bio.length > 150
                        ? proposal.freelancer.bio.substring(0, 150) + "..."
                        : proposal.freelancer.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {proposal.freelancer.skills && proposal.freelancer.skills.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-light d-block mb-2">Skills</strong>
                    <div className="d-flex flex-wrap gap-2">
                      {proposal.freelancer.skills.slice(0, 6).map((skill, i) => (
                        <span key={i} className="badge bg-secondary px-2 py-1">
                          {skill}
                        </span>
                      ))}
                      {proposal.freelancer.skills.length > 6 && (
                        <span className="badge bg-dark px-2 py-1">
                          +{proposal.freelancer.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience Level */}
                {proposal.freelancer.experienceLevel && (
                  <div className="mb-3">
                    <strong className="text-light d-block mb-2">Experience</strong>
                    <Badge bg="secondary">
                      {proposal.freelancer.experienceLevel.replace("_", " ")}
                    </Badge>
                  </div>
                )}

                {/* Hourly Rate */}
                {proposal.freelancer.hourlyRate && (
                  <div className="mb-3 p-2 bg-dark rounded">
                    <small className="text-muted d-block">Hourly Rate</small>
                    <p className="mb-0 fw-bold" style={{ color: "var(--accent)" }}>
                      ${proposal.freelancer.hourlyRate}/hr
                    </p>
                  </div>
                )}

                {/* Rating/Reviews (if available) */}
                {proposal.freelancer.rating && (
                  <div className="mb-3">
                    <strong className="text-light d-block mb-2">Rating</strong>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-warning">
                        {"★".repeat(Math.floor(proposal.freelancer.rating))}
                        {"☆".repeat(5 - Math.floor(proposal.freelancer.rating))}
                      </span>
                      <span className="text-muted">
                        {proposal.freelancer.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

                {/* View Full Profile Button */}
                <Button
                  variant="outline-light"
                  size="sm"
                  className="w-100"
                  onClick={() =>
                    navigate(`/freelancer-profile/${proposal.freelancer.id}`)
                  }
                >
                  <i className="bi bi-eye me-2"></i>
                  View Full Profile
                </Button>
              </Card.Body>
            </Card>
          )}

          {/* Bid Information Card */}
          <Card className="app-card mb-4">
            <Card.Body>
              <h5 className="mb-3">Bid Information</h5>

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

              {/* Show post budget for comparison */}
              {proposal.post?.price && (
                <div className="mt-3 pt-3 border-top border-secondary">
                  <p className="text-muted mb-1">Your Budget</p>
                  <p className="mb-0">${proposal.post.price}</p>
                  {proposal.bidAmount < proposal.post.price && (
                    <small className="text-success">
                      <i className="bi bi-arrow-down me-1"></i>
                      ${(proposal.post.price - proposal.bidAmount).toFixed(2)} under budget
                    </small>
                  )}
                  {proposal.bidAmount > proposal.post.price && (
                    <small className="text-warning">
                      <i className="bi bi-arrow-up me-1"></i>
                      ${(proposal.bidAmount - proposal.post.price).toFixed(2)} over budget
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

              {/* Accept Button - Only for submitted proposals */}
              {proposal.status === "submitted" && (
                <Button
                  variant="success"
                  className="w-100 mb-2"
                  onClick={() => handleAction("accept")}
                  disabled={acceptProposal.loading}
                >
                  {acceptProposal.loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Accept Proposal
                    </>
                  )}
                </Button>
              )}

              {/* Reject Button - For submitted or accepted proposals */}
              {["submitted", "accepted"].includes(proposal.status) && (
                <Button
                  variant="danger"
                  className="w-100 mb-2"
                  onClick={() => handleAction("reject")}
                  disabled={rejectProposal.loading}
                >
                  {rejectProposal.loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle me-2"></i>
                      Reject Proposal
                    </>
                  )}
                </Button>
              )}

              {/* Create Contract Button - Only for accepted proposals without contract */}
              {proposal.status === "accepted" && !proposal.contract && (
                <Button
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={navigateToContractCreation}
                >
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Create Contract
                </Button>
              )}

              {/* View Contract Button - If contract exists */}
              {proposal.contract && (
                <Button
                  variant="info"
                  className="w-100 mb-2"
                  onClick={() =>
                    navigate(`/${RoutePath.CLIENT}/${RoutePath.CONTRACT}/${proposal.contract.id}`)
                  }
                >
                  <i className="bi bi-eye me-2"></i>
                  View Contract
                </Button>
              )}

              {/* No actions available */}
              {!["submitted", "accepted"].includes(proposal.status) && !proposal.contract && (
                <Alert variant="secondary" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  No actions available for this proposal.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        centered
      >
        <Modal.Header closeButton className="text-light border-secondary">
          <Modal.Title>
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-light">
          {actionType === "accept" && (
            <p>
              Are you sure you want to accept this proposal? You'll be able to create
              a contract after accepting.
            </p>
          )}
          {actionType === "reject" && (
            <p>
              Are you sure you want to reject this proposal? This action cannot be
              undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "accept" ? "success" : "danger"}
            onClick={confirmAction}
          >
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};