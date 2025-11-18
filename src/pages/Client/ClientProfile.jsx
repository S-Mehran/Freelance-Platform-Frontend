import { useEffect, useState } from "react";
import { Card, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { FaUserCircle, FaEnvelope, FaGlobe, FaMoneyBillWave, FaUserTie, FaCalendarAlt } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const ClientProfile = () => {
  const { response, fetchData, loading, error } = useAxios();
  const {
    response: updateResponse,
    fetchData: updateProfile,
    loading: updateLoading,
    error: updateError,
  } = useAxios();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchData({ url: "profile", method: "GET" });
  }, []);

  useEffect(() => {
    if (response) {
        console.log(response)
      setProfile({
        firstName: response.message.firstName || "",
        lastName: response.message.lastName || "",
        email: response.message.email,
        role: response.message.role,
        country: response.message.country,
        amountSpent: response.message.client.amountSpent,
        numberOfHires: response.message.client.numberOfHires,
        createdAt: response.createdAt,
      });
    }
  }, [response]);

  useEffect(()=> {
    console.log(profile)
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateProfile({
      url: "profile",
      method: "PUT",
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        country: profile.country,
      },
    });
    setEditing(false);
  };

  if (loading || !profile) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Row className="justify-content-center mt-5">
      <Col md={7}>
        <Card className="app-card p-4 rounded-4">
          <div className="center mb-3">
            <FaUserCircle size={80} color="#7c3aed" style={{marginBottom: 8}} />
          </div>
          <h3 className="mb-2 text-center app-card-title" style={{color: '#fb923c'}}>My Profile</h3>
          <div className="center mb-3" style={{color: 'var(--muted)'}}>
            <FaEnvelope className="me-2" />{profile.email}
          </div>
          <hr style={{borderColor: 'rgba(124,58,237,0.18)'}} />

          {error && (
            <Alert variant="danger" className="py-2">
              Failed to load profile.
            </Alert>
          )}
          {updateError && (
            <Alert variant="danger" className="py-2">
              Failed to update profile.
            </Alert>
          )}
          {updateResponse && (
            <Alert variant="success" className="py-2">
              Profile updated successfully!
            </Alert>
          )}

          <Form className="mt-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{color: 'var(--accent)'}}>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!editing}
                    style={{ color: "#181616ff" }} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{color: 'var(--accent)'}}>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!editing}
                    style={{ color: "#181616ff" }} 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label style={{color: 'var(--accent)'}}><FaGlobe className="me-2" />Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
                disabled={!editing}
                style={{ color: "#181616ff" }} 
              />
            </Form.Group>
            <hr style={{borderColor: 'rgba(124,58,237,0.12)'}} />
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{color: 'var(--accent-2)'}}><FaUserTie className="me-2" />Role</Form.Label>
                  <Form.Control type="text" value={profile.role} style={{ color: "#181616ff" }}  disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{color: 'var(--accent-2)'}}><FaMoneyBillWave className="me-2" />Amount Spent</Form.Label>
                  <Form.Control type="text" value={`$${profile.amountSpent}`} style={{ color: "#181616ff" }} disabled />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{color: 'var(--accent-2)'}}>Number of Hires</Form.Label>
                  <Form.Control type="text" value={profile.numberOfHires} disabled style={{ color: "#181616ff" }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{color: 'var(--accent-2)'}}><FaCalendarAlt className="me-2" />Member Since</Form.Label>
                  <Form.Control type="text" value={new Date(profile.createdAt).toDateString()} style={{ color: "#181616ff" }} disabled />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-4 d-flex justify-content-end">
              {!editing ? (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => setEditing(false)}
                    disabled={updateLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ClientProfile;
