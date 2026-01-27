// components/client/PostProposals.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { Card, Container, Row, Col, Spinner, Badge, Button } from "react-bootstrap";
import { RoutePath } from "../../routes/routes";

export const PostProposals = () => {
  const { id } = useParams();
  const { response, error, fetchData } = useAxios();
  const [proposals, setProposals] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const {state} = useLocation()
  const navigate = useNavigate();

  const post = state?.post

  useEffect(() => {
    
      console.log("id", id);
    fetchData({ url: `get-post-proposals/${id}`, method: "GET" });
  }, [id]);

  useEffect(() => {
    if (response) {
      console.log(state)
      console.log(response);
      setProposals(response.postProposals || []);
      setPostTitle(response.postProposals?.[0]?.post?.title || state?.post || "Your Post");    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  }, [response, error]);

  const getStatusColor = (status) => {
    const statusColors = {
      SUBMITTED: "warning",
      UNDER_REVIEW: "info",
      ACCEPTED: "success",
      REJECTED: "danger",
      WITHDRAWN: "secondary",
    };
    return statusColors[status] || "secondary";
  };

  const getBidTypeLabel = (bidType) => {
    return bidType?.replace("_", " ") || "N/A";
  };

  const handleViewProposal = (id) => {
    navigate(
      `/${RoutePath.CLIENT}/${RoutePath.SINGE_PROPOSAL}/${id}`,
      { replace: false }
    );
  };

  return (
    <Container className="app-container page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Proposals for: {postTitle}</h2>
        <Button
          variant="outline-light"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
      </div>

      {/* Loading Spinner */}
      {!response && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      )}

      {/* No Proposals Message */}
      {response && proposals.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-muted">No proposals received yet for this post.</p>
        </div>
      )}

      {/* Proposals Count */}
      {response && proposals.length > 0 && (
        <p className="text-muted mb-4">
          {proposals.length} proposal{proposals.length !== 1 ? "s" : ""} received
        </p>
      )}

      {/* Proposals Grid */}
      <Row className="g-4">
        {proposals.map((proposal) => (
          <Col md={6} lg={4} key={proposal.id}>
            <Card
              className="app-card h-100"
              style={{ border: "2px solid #7c3aed" }}
            >
              <Card.Body>
                {/* Freelancer Name */}
                <Card.Title className="app-card-title">
                  {`${proposal.freelancer?.user?.firstName} ${proposal.freelancer?.user?.lastName}` || "Freelancer"}
                </Card.Title>

                {/* Status Badge */}
                <div className="mb-3">
                  <Badge bg={getStatusColor(proposal.status)}>
                    {proposal.status?.replace("_", " ")}
                  </Badge>
                </div>

                {/* Cover Letter Preview */}
                <Card.Text
                  style={{ minHeight: "80px", color: "var(--muted)" }}
                >
                  {proposal.coverLetter?.length > 120
                    ? proposal.coverLetter.substring(0, 120) + "..."
                    : proposal.coverLetter || "No cover letter provided."}
                </Card.Text>

                {/* Bid Information */}
                <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                  <span className="fw-bold" style={{ color: "var(--accent)" }}>
                    ${proposal.bidAmount}
                  </span>
                  <span className="badge bg-light text-dark">
                    {getBidTypeLabel(proposal.bidType)}
                  </span>
                </div>

                {/* Delivery Time */}
                <div className="mb-2">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {proposal.estimatedDeliveryDays} days delivery
                  </small>
                </div>

                {/* Submission Date */}
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </small>
                </div>

                {/* View Details Button */}
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProposal(proposal.id);
                  }}
                >
                  View Full Proposal
                </Button>
              </Card.Body>

              {/* Attachment Indicator */}
              {proposal.attachment && (
                <Card.Footer className="bg-transparent border-0">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-paperclip"></i>
                    <small className="text-muted">Has attachment</small>
                  </div>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};