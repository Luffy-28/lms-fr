import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingReviews,
  approveReview,
  deleteReview,
  getAllReviewsAdmin,
} from "../../features/review/reviewAction";

function AdminReviews() {
  // TODO: Replace dummy data with Redux store
  // const { pendingReviews } = useSelector((store) => store.reviewStore);
  // const pendingReviews = dummyPendingReviews;
  // const allReviews = dummyAllReviews;
  const { allReviews, pendingReviews } = useSelector((store) => store.reviewStore);

  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPendingReviews());
    dispatch(getAllReviewsAdmin());
  }, [dispatch]);

  const handleApprove = async (reviewId) => {
    const result = await dispatch(
      approveReview(reviewId, { isApproved: true }),
    );
    if (result.status === "success") {
      setShowModal(false);
      setSelectedReview(null);
    }
  };

  const handleReject = async (reviewId) => {
    const result = await dispatch(
      approveReview(reviewId, { isApproved: false, status: "rejected" }),
    );
    if (result.status === "success") {
      setShowModal(false);
      setSelectedReview(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const result = await dispatch(deleteReview(reviewId));
      if (result.status === "success") {
        setShowModal(false);
        setSelectedReview(null);
      }
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  // Counts for stat cards
  const approvedCount = allReviews.filter((r) => r.status === "approved").length;
  const rejectedCount = allReviews.filter((r) => r.status === "rejected").length;

  // Badge class helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "badge-active";
      case "rejected":
        return "badge-overdue";
      default:
        return "badge-returned";
    }
  };

  return (
    <div>
      {/* ── Review Detail Modal ── */}
      {showModal && selectedReview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "0",
              width: "100%",
              maxWidth: "540px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <h5
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: 700,
                }}
              >
                Review Details
              </h5>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: 1,
                  color: "#6B7280",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem" }}>
              {/* Book Info */}
              <div className="mb-3">
                <label
                  className="d-block mb-1"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--secondary)",
                    fontWeight: 600,
                  }}
                >
                  Book
                </label>
                <span className="fw-bold">{selectedReview.bookId.title}</span>
                <span className="text-muted ms-2">
                  by {selectedReview.bookId.author}
                </span>
              </div>

              {/* Reviewer */}
              <div className="mb-3">
                <label
                  className="d-block mb-1"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--secondary)",
                    fontWeight: 600,
                  }}
                >
                  Reviewer
                </label>
                <span>
                  {selectedReview.userId.firstName}{" "}
                  {selectedReview.userId.lastName}
                </span>
                <span className="text-muted ms-2 small">
                  {selectedReview.userId.email}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <label
                  className="d-block mb-1"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--secondary)",
                    fontWeight: 600,
                  }}
                >
                  Rating
                </label>
                <span className="badge-status badge-active">
                  {"★".repeat(selectedReview.rating)}
                  {"☆".repeat(5 - selectedReview.rating)}{" "}
                  {selectedReview.rating}/5
                </span>
              </div>

              {/* Review Text */}
              <div className="mb-3">
                <label
                  className="d-block mb-1"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--secondary)",
                    fontWeight: 600,
                  }}
                >
                  Review
                </label>
                <p
                  style={{
                    background: "#f9fafb",
                    border: "1px solid var(--border-color)",
                    padding: "1rem",
                    margin: 0,
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedReview.review}
                </p>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label
                  className="d-block mb-1"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--secondary)",
                    fontWeight: 600,
                  }}
                >
                  Status
                </label>
                <span
                  className={`badge-status ${getStatusBadge(selectedReview.status)}`}
                >
                  {selectedReview.status}
                </span>
              </div>

              {/* Date */}
              <div className="mb-0">
                <label
                  className="d-block mb-1"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--secondary)",
                    fontWeight: 600,
                  }}
                >
                  Submitted
                </label>
                <span className="text-muted small">
                  {new Date(selectedReview.createdAt).toLocaleDateString(
                    "en-AU",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                padding: "1.25rem 1.5rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <button
                className="btn-action btn-action-delete"
                onClick={() => handleDelete(selectedReview._id)}
              >
                Delete
              </button>
              <button
                className="btn-action btn-action-edit"
                onClick={() => handleReject(selectedReview._id)}
              >
                Reject
              </button>
              <button
                className="btn-action btn-action-return"
                onClick={() => handleApprove(selectedReview._id)}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <Container>
          <h1>Manage Reviews</h1>
          <p>Review and approve/reject book reviews from users.</p>
        </Container>
      </div>

      <Container className="py-4">
        {/* Summary Stats */}
        <div className="d-flex gap-4 mb-4 flex-wrap">
          <div className="stat-card flex-fill">
            <div className="stat-number">{allReviews.length}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
          <div className="stat-card flex-fill">
            <div className="stat-number">{pendingReviews.length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card flex-fill">
            <div className="stat-number">{approvedCount}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card flex-fill">
            <div className="stat-number">{rejectedCount}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        {/* ── Pending Reviews Table ── */}
        <div className="admin-panel mb-4">
          <div className="admin-panel-header">
            <h5>Pending Reviews ({pendingReviews.length})</h5>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <p>No pending reviews at the moment.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReviews.map((review) => (
                    <tr key={review._id}>
                      <td className="fw-bold">{review.bookId.title}</td>
                      <td>
                        {review.userId.firstName} {review.userId.lastName}
                      </td>
                      <td>
                        <span className="badge-status badge-active">
                          {"★".repeat(review.rating)} {review.rating}/5
                        </span>
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {review.review}
                      </td>
                      <td className="text-muted small">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-AU",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn-action btn-action-edit"
                            onClick={() => handleViewReview(review)}
                          >
                            View
                          </button>
                          <button
                            className="btn-action btn-action-return"
                            onClick={() => handleApprove(review._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-action btn-action-delete"
                            onClick={() => handleReject(review._id)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── All Reviews Table ── */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h5>All Reviews ({allReviews.length})</h5>
          </div>

          {allReviews.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <p>No reviews found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allReviews.map((review) => (
                    <tr key={review._id}>
                      <td className="fw-bold">{review.bookId.title}</td>
                      <td>
                        {review.userId.firstName} {review.userId.lastName}
                      </td>
                      <td>
                        <span className="badge-status badge-active">
                          {"★".repeat(review.rating)} {review.rating}/5
                        </span>
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {review.review}
                      </td>
                      <td className="text-muted small">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-AU",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge-status ${getStatusBadge(review.status)}`}
                        >
                          {review.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn-action btn-action-edit"
                            onClick={() => handleViewReview(review)}
                          >
                            View
                          </button>
                          <button
                            className="btn-action btn-action-delete"
                            onClick={() => handleDelete(review._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AdminReviews;
