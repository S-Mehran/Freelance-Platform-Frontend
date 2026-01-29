// components/freelancer/FreelancerContracts.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import {
  Container,
  Card,
  Spinner,
  Badge,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
} from "react-bootstrap";
import { RoutePath } from "../../routes/routes";

export const FreelancerContracts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { response, error, loading, fetchData } = useAxios();
  const [contracts, setContracts] = useState([]);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("status") || "pending"
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchData({
      url: `get-freelancer-contracts-with-status?contractStatus=${activeTab}`,
      method: "GET",
    });
  }, [activeTab]);

  useEffect(() => {
    if (response) {
      console.log(response);
      setContracts(response.contracts || []);
    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    }
  }, [response, error]);

  const handleTabChange = (status) => {
    setActiveTab(status);
    setSearchParams({ status });
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
      month: "short",
      day: "numeric",
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

  return (
    <Container className="app-container page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Contracts</h2>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={handleTabChange}
        className="mb-4 custom-tabs"
        variant="pills"
      >
        <Tab
          eventKey="pending"
          title={
            <span>
              <i className="bi bi-hourglass-split me-2"></i>
              Pending
            </span>
          }
        />
        <Tab
          eventKey="active"
          title={
            <span>
              <i className="bi bi-check-circle me-2"></i>
              Active
            </span>
          }
        />
        <Tab
          eventKey="completed"
          title={
            <span>
              <i className="bi bi-check-all me-2"></i>
              Completed
            </span>
          }
        />
        <Tab
          eventKey="submitted"
          title={
            <span>
              <i className="bi bi-check-all me-2"></i>
              Submitted
            </span>
          }
        />

        <Tab
          eventKey="cancelled"
          title={
            <span>
              <i className="bi bi-x-circle me-2"></i>
              Cancelled
            </span>
          }
        />
        <Tab
          eventKey="rejected"
          title={
            <span>
              <i className="bi bi-slash-circle me-2"></i>
              Rejected
            </span>
          }
        />
      </Tabs>

      {/* Loading State */}
      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      )}

      {/* Empty State */}
      {!loading && contracts.length === 0 && (
        <div className="text-center mt-5">
          <i
            className="bi bi-folder2-open text-muted mb-3"
            style={{ fontSize: "4rem" }}
          ></i>
          <p className="text-muted">No {activeTab} contracts found.</p>
          {activeTab === "pending" && (
            <Button
              variant="outline-light"
              onClick={() => navigate(`/${RoutePath.FREELANCER}/${RoutePath.BROWSE_JOBS}`)}
            >
              Browse Jobs
            </Button>
          )}
        </div>
      )}

      {/* Contracts Grid */}
      {!loading && contracts.length > 0 && (
        <>
          <p className="text-muted mb-4">
            Showing {contracts.length} {activeTab} contract
            {contracts.length !== 1 ? "s" : ""}
          </p>

          <Row className="g-4">
            {contracts.map((contract) => (
              <Col md={6} lg={4} key={contract.id}>
                <Card
                  className="app-card h-100"
                  style={{ cursor: "pointer", border: "2px solid #7c3aed" }}
                  onClick={() =>
                    navigate(
                      `/${RoutePath.FREELANCER}/${RoutePath.CONTRACT}/${contract.id}`
                    )
                  }
                >
                  <Card.Body>
                    {/* Post Title */}
                    <Card.Title className="app-card-title">
                      {contract.post?.title || "Contract"}
                    </Card.Title>

                    {/* Client Name */}
                    <Card.Subtitle className="app-card-subtitle mb-3">
                      <i className="bi bi-building me-2"></i>
                      {`${contract.client?.user?.firstName} ${contract.client?.user?.lastName}` ||
                        contract.client?.company ||
                        "Client"}
                    </Card.Subtitle>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <Badge bg={getStatusColor(contract.status)} className="px-3 py-2">
                        {contract.status.charAt(0).toUpperCase() +
                          contract.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Contract Details */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">
                          <i className="bi bi-currency-dollar me-1"></i>
                          Amount:
                        </span>
                        <span className="fw-bold" style={{ color: "var(--accent)" }}>
                          ${contract.agreedPrice}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">
                          <i className="bi bi-calendar-range me-1"></i>
                          Duration:
                        </span>
                        <span>
                          {calculateDuration(contract.startDate, contract.endDate)} days
                        </span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span className="text-muted">
                          <i className="bi bi-calendar-event me-1"></i>
                          Start Date:
                        </span>
                        <span>{formatDate(contract.startDate)}</span>
                      </div>
                    </div>

                    {/* Pending Action Alert */}
                    {contract.status === "pending" && (
                      <div className="alert alert-warning py-2 px-3 mb-3" role="alert">
                        <small>
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          Action required: Accept or reject this contract
                        </small>
                      </div>
                    )}

                    {/* Active Contract - Days Remaining */}
                    {contract.status === "active" && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">Days Remaining</small>
                          <Badge bg="info" className="px-2">
                            {getDaysRemaining(contract.endDate)} days
                          </Badge>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{
                              width: `${Math.min(
                                100,
                                ((new Date() - new Date(contract.startDate)) /
                                  (new Date(contract.endDate) -
                                    new Date(contract.startDate))) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* End Date */}
                    <div className="mt-3">
                      <small className="text-muted">
                        <i className="bi bi-calendar-check me-1"></i>
                        End Date: {formatDate(contract.endDate)}
                      </small>
                    </div>
                  </Card.Body>

                  {/* Footer Actions */}
                  <Card.Footer className="bg-transparent border-0">
                    {contract.status === "pending" ? (
                      <Button
                        variant="success"
                        size="sm"
                        className="w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/${RoutePath.FREELANCER}/${RoutePath.CONTRACT}/${contract.id}`
                          );
                        }}
                      >
                        Review Contract
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    ) : (
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/${RoutePath.FREELANCER}/${RoutePath.CONTRACT}/${contract.id}`
                          );
                        }}
                      >
                        View Details
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};