// components/proposals/ProposalDetail.jsx
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

export const ProposalDetail = ({ userRole }) => {
  const { proposalId } = useParams();
  const { response, error, loading, fetchData } = useAxios();
  const [proposal, setProposal] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'accept', 'reject', 'withdraw'
  const navigate = useNavigate();

  // Fetch proposal details
  useEffect(() => {
    if (userRole === "CLIENT") {
      fetchData({ url: `proposal/${proposalId}`, method: "GET" });
    } else if (userRole === "FREELANCER") {
      fetchData({ url: `my-proposal/${proposalId}`, method: "GET" });
    }
  }, [proposalId, userRole]);

  useEffect(() => {
    if (response) {
      console.log(response);
      setProposal(response.proposal);
    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    }
  }, [response, error]);

  // Handle status change
  const handleStatusChange = (action) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmStatusChange = async () => {
    setShowActionModal(false);

    const statusMap = {
      accept: "accepted",
      reject: "rejected",
      withdraw: "withdrawn",
    };

    try {
      const result = await fetchData({
        url: `update-proposal/${proposalId}`,
        method: "PUT",
        data: { status: statusMap[actionType] },
      });

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Proposal ${actionType}ed successfully!`,
        });

        // Refresh proposal data
        setProposal({ ...proposal, status: statusMap[actionType] });

        // If accepted by client, show contract creation option
        if (actionType === "accept" && userRole === "CLIENT") {
          showContractCreationPrompt();
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update proposal status",
      });
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

  const canAccept = () => {
    return (
      userRole === "CLIENT" &&
      proposal?.status === "submitted"
    );
  };

  const canReject = () => {
    return (
      userRole === "CLIENT" &&
      ["submitted", "accepted"].includes(proposal?.status)
    );
  };

  const canWithdraw = () => {
    return (
      userRole === "FREELANCER" &&
      proposal?.status === "submitted"
    );
  };

  const canCreateContract = () => {
    return (
      userRole === "CLIENT" &&
      proposal?.status === "accepted" &&
      !proposal?.contract // No contract exists yet
    );
  };

  if (loading || !proposal) {
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
      {proposal.status === "accepted" && userRole === "CLIENT" && !proposal.contract && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>Proposal Accepted!</Alert.Heading>
          <p>You've accepted this proposal. Create a contract to proceed with hiring this freelancer.</p>
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
              navigate(`/${userRole.toLowerCase()}/${RoutePath.CONTRACT}/${proposal.contract.id}`)
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
          <Card className="app-card mb-4">
            <Card.Body>
              {/* Post Title */}
              <div className="mb-3">
                <h5 className="text-muted mb-1">For Post:</h5>
                <h3 className="app-card-title">
                  {proposal.post?.title || "Post Title"}
                </h3>
              </div>

              {/* Freelancer Info (Client View) */}
              {userRole === "CLIENT" && proposal.freelancer && (
                <div className="mb-4 p-3 bg-dark rounded">
                  <h5 className="mb-3">Freelancer Information</h5>
                  <p className="mb-1">
                    <strong>Name:</strong> {proposal.freelancer.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {proposal.freelancer.email}
                  </p>
                  {proposal.freelancer.skills && (
                    <div className="mt-2">
                      <strong>Skills:</strong>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {proposal.freelancer.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="badge bg-secondary px-3 py-2"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status */}
              <div className="mb-4">
                <h5 className="mb-2">Status</h5>
                <Badge bg={getStatusColor(proposal.status)} className="fs-6 px-3 py-2">
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>

              {/* Cover Letter */}
              <div className="mb-4">
                <h5 className="mb-3">Cover Letter</h5>
                <Card className="bg-dark border-secondary">
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
              <div className="mb-3">
                <small className="text-muted">
                  <i className="bi bi-calendar me-2"></i>
                  Submitted on: {new Date(proposal.createdAt).toLocaleDateString("en-US", {
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
            </Card.Body>
          </Card>

          {/* Action Buttons Card */}
          <Card className="app-card">
            <Card.Body>
              <h5 className="mb-3">Actions</h5>

              {/* Client Actions */}
              {userRole === "CLIENT" && (
                <>
                  {canAccept() && (
                    <Button
                      variant="success"
                      className="w-100 mb-2"
                      onClick={() => handleStatusChange("accept")}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Accept Proposal
                    </Button>
                  )}

                  {canReject() && (
                    <Button
                      variant="danger"
                      className="w-100 mb-2"
                      onClick={() => handleStatusChange("reject")}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Reject Proposal
                    </Button>
                  )}

                  {canCreateContract() && (
                    <Button
                      variant="primary"
                      className="w-100 mb-2"
                      onClick={navigateToContractCreation}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      Create Contract
                    </Button>
                  )}

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
                </>
              )}

              {/* Freelancer Actions */}
              {userRole === "FREELANCER" && (
                <>
                  {canWithdraw() && (
                    <Button
                      variant="warning"
                      className="w-100 mb-2"
                      onClick={() => handleStatusChange("withdraw")}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2"></i>
                      Withdraw Proposal
                    </Button>
                  )}

                  {proposal.status === "accepted" && (
                    <Alert variant="success" className="mb-0">
                      <i className="bi bi-check-circle me-2"></i>
                      Your proposal has been accepted! Wait for the client to create a contract.
                    </Alert>
                  )}

                  {proposal.status === "rejected" && (
                    <Alert variant="danger" className="mb-0">
                      <i className="bi bi-x-circle me-2"></i>
                      This proposal was rejected.
                    </Alert>
                  )}

                  {proposal.contract && (
                    <Button
                      variant="info"
                      className="w-100 mb-2"
                      onClick={() =>
                        navigate(`/${RoutePath.FREELANCER}/${RoutePath.CONTRACT}/${proposal.contract.id}`)
                      }
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Contract
                    </Button>
                  )}
                </>
              )}

              {/* No actions available */}
              {!canAccept() &&
                !canReject() &&
                !canWithdraw() &&
                !canCreateContract() &&
                !proposal.contract && (
                  <p className="text-muted mb-0 text-center">
                    No actions available for this proposal.
                  </p>
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
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {actionType === "accept" && (
            <p>
              Are you sure you want to accept this proposal? You'll be able to
              create a contract after accepting.
            </p>
          )}
          {actionType === "reject" && (
            <p>
              Are you sure you want to reject this proposal? This action cannot
              be undone.
            </p>
          )}
          {actionType === "withdraw" && (
            <p>
              Are you sure you want to withdraw this proposal? You won't be able
              to resubmit it.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button
            variant="secondary"
            onClick={() => setShowActionModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant={
              actionType === "accept"
                ? "success"
                : actionType === "reject"
                ? "danger"
                : "warning"
            }
            onClick={confirmStatusChange}
          >
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};