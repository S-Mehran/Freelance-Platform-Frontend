// components/freelancer/MyFreelancerProposals.jsx
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { Card, Container, Row, Col, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { RoutePath } from "../../routes/routes";

export const MyFreelancerProposals = () => {
  const { response, error, fetchData } = useAxios();
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData({ url: "get-my-proposals", method: "GET" });
  }, []);

  useEffect(() => {
    if (response) {
      console.log(response);
      setProposals(response.freelancerProposals);
    }

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
      ARCHIVED: "info",
      ACCEPTED: "success",
      REJECTED: "danger",
      WITHDRAWN: "secondary",
    };
    return statusColors[status] || "secondary";
  };

  const getBidTypeLabel = (bidType) => {
    return bidType?.replace("_", " ") || "N/A";
  };

  return (
    <Container className="app-container page">
      <h2 className="text-center fw-bold mb-4">My Proposals</h2>

      {!response && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      )}

      {response && proposals.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-muted">You haven't submitted any proposals yet.</p>
        </div>
      )}

      <Row className="g-4 justify-content-center">
        {proposals.map((proposal) => (
          <Col md={6} lg={4} key={proposal.id}>
            <Card
              className="app-card h-100"
              style={{ cursor: "pointer", border: "2px solid #7c3aed" }}
              onClick={() => {
                navigate(
                  `/${RoutePath.FREELANCER}/${RoutePath.MY_PROPOSAL}/${proposal.id}`,
                  { replace: true }
                );
              }}
            >
              <Card.Body>
                {/* Post Title */}
                <Card.Title className="app-card-title">
                  {proposal.post?.title || "Post Title"}
                </Card.Title>

                {/* Status Badge */}
                <div className="mb-3">
                  <Badge bg={getStatusColor(proposal.status)}>
                    {proposal.status?.replace("_", " ")}
                  </Badge>
                </div>

                {/* Cover Letter Preview */}
                <Card.Text
                  style={{ minHeight: "60px", color: "var(--muted)" }}
                >
                  {proposal.coverLetter?.length > 100
                    ? proposal.coverLetter.substring(0, 100) + "..."
                    : proposal.coverLetter || "No cover letter provided."}
                </Card.Text>

                {/* Bid Amount and Type */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="fw-bold" style={{ color: "var(--accent)" }}>
                    ${proposal.bidAmount}
                  </span>
                  <span className="badge bg-light text-dark">
                    {getBidTypeLabel(proposal.bidType)}
                  </span>
                </div>

                {/* Delivery Time */}
                <div className="mt-2">
                  <small className="text-muted">
                    Delivery: {proposal.estimatedDeliveryDays} days
                  </small>
                </div>

                {/* Submission Date */}
                <div className="mt-2">
                  <small className="text-muted">
                    Submitted: {new Date(proposal.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </Card.Body>

              {/* Attachment Indicator */}
              {proposal.attachment && (
                <Card.Footer className="bg-transparent border-0 pt-0">
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