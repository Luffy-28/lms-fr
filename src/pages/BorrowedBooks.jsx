import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBorrow, returnBook } from "../features/borrow/borrowAction";
import { addReview } from "../features/review/reviewAction";
import bookPlaceHolder from "../assets/book_placeholder.jpg";
import { useEffect, useState } from "react";

function BorrowedBooks() {
  const dispatch = useDispatch();
  const { borrows } = useSelector((state) => state.borrowStore);
  const activeBooks = borrows.filter((b) => b.status === "borrowed");
  const returnedBooks = borrows.filter(
    (b) => b.status === "returned" || b.status === "reviewed",
  );

  // modal state
  const [modal, setModal] = useState(null); // holds the borrow object
  const [rating, setRating] = useState(3);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyBorrow());
  }, []);

  const openModal = async (borrowObj) => {
    // Return the book first — backend requires status "returned" before review
    if (borrowObj.status === "returned") {
      setModal(borrowObj);
      setRating(3);
      setReviewText("");
      return;
    } else if (borrowObj.status === "borrowed") {
      alert("Please return the book before leaving a review.");
      return;
    } else if (borrowObj.status === "reviewed") {
      alert("You have already reviewed this book. Thank you!");
      return;
    } else {
      await dispatch(returnBook({ _id: borrowObj._id, status: "returned" }));
      setModal(borrowObj);
      setRating(3);
      setReviewText("");
    }
  };

  const closeModal = () => setModal(null);

  const doReturn = (borrowObj) => {
    dispatch(returnBook({ _id: borrowObj._id, status: "returned" }));
  };

  // Cancel: just return the book, no review
  const handleCancel = () => {
    doReturn(modal);
    closeModal();
  };

  // Submit: add review first, then the backend marks borrow as "reviewed"
  const handleSubmit = async () => {
    if (!reviewText.trim())
      return alert("Please write a review before submitting.");
    setSubmitting(true);
    try {
      const data = await dispatch(addReview(modal._id, reviewText, rating));
      if (data.status === "success") {
        dispatch(fetchMyBorrow()); // refresh borrow list
      } else {
        alert(data.message || "Could not save review, book returned anyway.");
      }
    } catch {
      alert("Could not save review, book returned anyway.");
    }
    setSubmitting(false);
    closeModal();
  };

  // Book is already returned; just close the modal
  const handleSkip = () => closeModal();

  return (
    <div>
      {/* ── Review / Return Modal ── */}
      {modal && (
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
              maxWidth: "480px",
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
                Return &amp; Rate
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
              <p className="text-muted small mb-4">
                <span className="fw-semibold">{modal.bookId?.title}</span> —
                leave an optional review before returning.
              </p>

              {/* star rating */}
              <div className="mb-4">
                <label
                  className="d-block mb-2"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Rating
                </label>
                <div className="d-flex align-items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.75rem",
                        color: star <= rating ? "#000" : "#d1d5db",
                        padding: "0 0.15rem",
                        transition: "transform 0.15s ease",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      ★
                    </button>
                  ))}
                  <span
                    className="ms-2"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* review text */}
              <label
                className="d-block mb-2"
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Review
              </label>
              <textarea
                className="form-control mb-4"
                rows={4}
                placeholder="Share your thoughts about this book…"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={{
                  resize: "none",
                  fontSize: "0.9rem",
                  borderRadius: 0,
                  border: "1px solid var(--border-color)",
                }}
                required
              />
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
                className="btn btn-dark rounded-0 px-4 fw-bold text-uppercase flex-fill"
                style={{ letterSpacing: "1px", fontSize: "0.8rem" }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="page-header">
        <Container>
          <h1>My Borrowed Books</h1>
          <p>Track your currently borrowed books and borrowing history.</p>
        </Container>
      </div>

      <Container className="py-4">
        {/* Currently Borrowed */}
        {activeBooks.length > 0 && (
          <>
            <h5 className="section-title mb-4">Currently Borrowed</h5>
            <Row className="g-4 mb-5 mt-1">
              {activeBooks.map((borrow) => (
                <Col md={6} key={borrow._id}>
                  <div className="borrowed-card">
                    <div className="borrowed-cover">
                      <img
                        src={borrow.bookId.thumbnail || bookPlaceHolder}
                        alt={borrow.bookId.title}
                      />
                    </div>
                    <div className="borrowed-info">
                      <div>
                        <span className="badge-status badge-active mb-2">
                          {borrow.status}
                        </span>
                        <h6 className="fw-bold mt-2 mb-1">
                          {borrow.bookId.title}
                        </h6>
                        <p className="text-muted small mb-3">
                          by {borrow.bookId.author}
                        </p>
                        <div className="d-flex gap-4 small text-muted">
                          <div>
                            <span
                              className="d-block fw-bold text-uppercase"
                              style={{
                                fontSize: "0.65rem",
                                letterSpacing: "1px",
                              }}
                            >
                              Borrowed
                            </span>
                            {new Date(borrow.borrowDate).toLocaleDateString(
                              "en-AU",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div>
                            <span
                              className="d-block fw-bold text-uppercase"
                              style={{
                                fontSize: "0.65rem",
                                letterSpacing: "1px",
                              }}
                            >
                              Due
                            </span>
                            {new Date(borrow.dueDate).toLocaleDateString(
                              "en-AU",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          className="btn-action btn-action-return"
                          onClick={() => dispatch(returnBook(borrow))}
                        >
                          Return Book
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Returned / Reviewed History */}
        {returnedBooks.length > 0 && (
          <>
            <h5 className="section-title mb-4">Borrowing History</h5>
            <div className="admin-panel mt-4">
              <div className="table-responsive">
                <table className="lms-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Borrowed</th>
                      <th>Returned</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedBooks.map((borrow) => (
                      <tr key={borrow._id}>
                        <td>
                          <img
                            src={borrow.bookId?.thumbnail || bookPlaceHolder}
                            alt={borrow.bookId?.title}
                            className="img-fluid"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td className="fw-bold">{borrow.bookId?.title}</td>
                        <td className="text-muted">{borrow.bookId?.author}</td>
                        <td className="text-muted small">
                          {new Date(borrow.borrowDate).toLocaleDateString(
                            "en-AU",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="text-muted small">
                          {borrow.returnDate
                            ? new Date(borrow.returnDate).toLocaleDateString(
                                "en-AU",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`badge-status ${
                              borrow.status === "returned"
                                ? "badge-active"
                                : "badge-returned"
                            }`}
                            onClick={() => openModal(borrow)}
                          >
                            {borrow.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {borrows.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted mb-4">
              You haven't borrowed any books yet.
            </p>
            <Link
              to="/books"
              className="btn btn-dark rounded-0 px-4 text-uppercase fw-bold small"
              style={{ letterSpacing: "1px" }}
            >
              Browse Library
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}

export default BorrowedBooks;
