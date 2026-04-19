import { Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { borrowBook } from "../features/borrow/borrowAction";
import { getReviewsByBook } from "../features/review/reviewAction";

function BookDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { publicBooks } = useSelector((state) => state.bookStore);
  const [book, setBook] = useState({});
  const { reviews } = useSelector((state) => state.reviewStore);

  const handleBorrow = (bookId) => {
    dispatch(borrowBook(bookId));
  };

  useEffect(() => {
    setBook(publicBooks.find((b) => b._id == id));
  }, [publicBooks, id]);

  // Fetch reviews for this book when the page loads
  useEffect(() => {
    if (id) {
      dispatch(getReviewsByBook(id));
    }
  }, [dispatch, id]);

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        ).toFixed(1)
      : 0.0;

  if (!book) {
    return (
      <Container className="py-5 text-center">
        <h2 className="fw-bold mb-3">Book Not Found</h2>
        <p className="text-muted mb-4">
          The book you're looking for doesn't exist in our catalog.
        </p>
        <Link to="/books" className="btn btn-dark rounded-0 px-4">
          Back to Catalog
        </Link>
      </Container>
    );
  }

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = "★".repeat(full);
    if (hasHalf) stars += "½";
    return stars;
  };

  return (
    <div>
      <div className="page-header">
        <Container>
          <Link
            to="/books"
            className="text-decoration-none text-muted small text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            ← Back to Catalog
          </Link>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-5">
          {/* Book Cover */}
          <Col lg={5}>
            <div className="book-detail-cover">
              <img src={book.thumbnail} alt={book.title} />
            </div>
          </Col>

          {/* Book Info */}
          <Col lg={7}>
            <div className="mb-2">
              <span
                className={`badge-status ${book.isAvailable ? "badge-available" : "badge-reserved"}`}
              >
                {book.isAvailable ? "Available" : "Currently Reserved"}
              </span>
            </div>

            <h1
              className="fw-bold mb-1"
              style={{ fontSize: "2.25rem", letterSpacing: "-0.02em" }}
            >
              {book.title}
            </h1>
            <p className="text-muted fs-5 mb-4">by {book.author}</p>

            <div className="mb-4">
              <span className="book-rating fs-5 me-2">
                {renderStars(book.rating)}
              </span>
              <span className="text-muted">({book.rating} / 5.0)</span>
            </div>

            <p className="mb-4" style={{ lineHeight: 1.8, color: "#374151" }}>
              {book.description}
            </p>

            <hr className="my-4" />

            <dl className="book-detail-info">
              <Row>
                <Col sm={6}>
                  <dt>ISBN</dt>
                  <dd>{book.isbn}</dd>
                </Col>
                <Col sm={6}>
                  <dt>Genre</dt>
                  <dd>{book.genre}</dd>
                </Col>
                <Col sm={6}>
                  <dt>Publication Year</dt>
                  <dd>{book.publicationYear}</dd>
                </Col>
                <Col sm={6}>
                  <dt>Average Rating</dt>
                  <dd>{book.averageRating} / 5.0</dd>
                </Col>
              </Row>
            </dl>

            <div className="d-flex gap-3 mt-4">
              {book.isAvailable ? (
                <button
                  className="btn btn-dark rounded-0 px-5 py-3 text-uppercase fw-bold"
                  style={{ letterSpacing: "2px" }}
                  onClick={() => handleBorrow(book._id)}
                >
                  Borrow This Book
                </button>
              ) : (
                <button
                  className="btn btn-outline-secondary rounded-0 px-5 py-3 text-uppercase fw-bold disabled"
                  style={{ letterSpacing: "2px" }}
                >
                  Currently Reserved
                </button>
              )}
              <Link
                to="/books"
                className="btn btn-outline-dark rounded-0 px-4 py-3 text-uppercase fw-bold"
                style={{ letterSpacing: "1px" }}
              >
                Browse More
              </Link>
            </div>

            {/* ───── Reviews Section ───── */}
            <div className="mt-5">
              <hr className="mb-4" />

              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5
                  className="fw-bold mb-0"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Reader Reviews
                </h5>
                <span className="text-muted small">
                  {reviews.length} reviews
                </span>
              </div>

              {/* Rating Summary */}
              <div
                className="d-flex align-items-center gap-4 p-4 mb-4"
                style={{ background: "#f9f9f9", borderRadius: "8px" }}
              >
                {/* Big Score */}
                <div className="text-center" style={{ minWidth: "80px" }}>
                  <div
                    className="fw-bold"
                    style={{ fontSize: "2.5rem", lineHeight: 1 }}
                  >
                    {avgRating}
                  </div>
                  <div
                    style={{
                      color: "#BA7517",
                      fontSize: "16px",
                      margin: "4px 0",
                    }}
                  >
                    {renderStars(avgRating)}
                  </div>
                  <div className="text-muted small">out of 5</div>
                </div>

                {/* Bar Breakdown */}
                <div className="flex-fill">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter(
                      (r) => r.rating === star,
                    ).length;
                    const percent =
                      reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div
                        key={star}
                        className="d-flex align-items-center gap-2 mb-1"
                      >
                        <span
                          className="text-muted small"
                          style={{ minWidth: "10px" }}
                        >
                          {star}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: "6px",
                            background: "#e5e7eb",
                            borderRadius: "99px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: "100%",
                              background: "#BA7517",
                              borderRadius: "99px",
                            }}
                          />
                        </div>
                        <span
                          className="text-muted small"
                          style={{ minWidth: "16px" }}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Cards */}
              {reviews.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <p className="mb-0">
                    No reviews yet. Be the first to review this book!
                  </p>
                </div>
              ) : (
                reviews.map((review, index) => {
                  const avatarColors = [
                    { background: "#E6F1FB", color: "#185FA5" },
                    { background: "#E1F5EE", color: "#0F6E56" },
                    { background: "#FAEEDA", color: "#854F0B" },
                    { background: "#FBEAF0", color: "#993556" },
                  ];
                  const av = avatarColors[index % avatarColors.length];

                  return (
                    <div
                      key={review._id}
                      className="p-3 mb-3"
                      style={{
                        border: "0.5px solid #e5e7eb",
                        borderRadius: "10px",
                        background: "#fff",
                      }}
                    >
                      {/* Reviewer Info */}
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          {/* Avatar */}
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: av.background,
                              color: av.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              fontWeight: "500",
                              flexShrink: 0,
                            }}
                          >
                            {review.userId?.firstName?.[0]}
                            {review.userId?.lastName?.[0]}
                          </div>
                          <div>
                            <div
                              className="fw-bold"
                              style={{ fontSize: "14px" }}
                            >
                              {review.userId?.firstName} {review.userId?.lastName}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-AU",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div
                          style={{
                            color: "#BA7517",
                            fontSize: "13px",
                            letterSpacing: "1px",
                          }}
                        >
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                      </div>

                      {/* Review Text */}
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "14px", lineHeight: 1.6 }}
                      >
                        {review.comment}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookDetail;
