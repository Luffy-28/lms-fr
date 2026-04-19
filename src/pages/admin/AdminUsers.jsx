import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  getAllUser,
  updateUserRole,
} from "../../features/user/userAction";
import { useForm } from "../../hooks/useForm";

const emptyUser = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  role: "student",
};

function AdminUsers() {
  const { allUsers, user: currentUser } = useSelector(
    (store) => store.userStore,
  );
  const displayUsers = allUsers.filter((u) => u._id !== currentUser?._id);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const { formData, setFormData, handleChange } = useForm(emptyUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));
    setFormData(emptyUser);
    setShowForm(false);
  };

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    if (
      window.confirm(
        `Are you sure you want to change this user's role from ${currentRole} to ${newRole}?`,
      )
    ) {
      dispatch(updateUserRole({ _id: userId, role: newRole }));
    }
  };

  useEffect(() => {
    dispatch(getAllUser());
  }, []);

  return (
    <div>
      <div className="page-header">
        <Container>
          <h1>Manage Users</h1>
          <p>View and manage all registered library members.</p>
        </Container>
      </div>

      <Container className="py-4">
        {/* Add User Form Toggle */}
        <div className="mb-4">
          <button
            className="btn btn-dark rounded-0 px-4 text-uppercase fw-bold small"
            style={{ letterSpacing: "1px" }}
            onClick={() => {
              setShowForm(!showForm);
              setFormData(emptyUser);
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add New User"}
          </button>
        </div>

        {/* Inline Add Form */}
        {showForm && (
          <div className="inline-form mb-4">
            <h6
              className="fw-bold text-uppercase mb-4"
              style={{ letterSpacing: "2px", fontSize: "0.8rem" }}
            >
              New User Details
            </h6>
            <form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="0400 000 000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <label>Role</label>
                  <select
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </Col>
                <Col xs={12} className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-dark rounded-0 px-5 text-uppercase fw-bold small"
                    style={{ letterSpacing: "1px" }}
                  >
                    Save User
                  </button>
                </Col>
              </Row>
            </form>
          </div>
        )}

        {/* Summary */}
        <div className="d-flex gap-4 mb-4">
          <div className="stat-card flex-fill">
            <div className="stat-number">{allUsers.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card flex-fill">
            <div className="stat-number">
              {allUsers.filter((u) => u.role === "admin").length}
            </div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-card flex-fill">
            <div className="stat-number">
              {allUsers.filter((u) => u.role === "student").length}
            </div>
            <div className="stat-label">Students</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h5>All Users ({allUsers.length})</h5>
          </div>
          <div className="table-responsive">
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-bold">
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td className="text-muted">{user.phone}</td>
                    <td>
                      <button
                        className={`badge-status p-0 text-decoration-none ${user.role === "admin" ? "badge-active" : "badge-returned"}`}
                        onClick={() => handleRoleChange(user._id, user.role)}
                        style={{ border: "none" }}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td className="text-muted small">
                      {new Date(user.createdAt).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AdminUsers;
