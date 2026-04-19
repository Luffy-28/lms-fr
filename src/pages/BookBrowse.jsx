import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchAllBooks, fetchAllPublicBooks } from "../features/book/bookAction";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrowedBooks, fetchMyBorrow } from "../features/borrow/borrowAction";



const genres = ["All", "Technology", "Arts", "Literature", "Mathematics", "Social Sciences"];

function BookBrowse() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const {  books } = useSelector((state) => state.bookStore);
  const {  publicBooks } = useSelector((state) => state.bookStore);
  const {  borrows } = useSelector((state) => state.borrowStore);


  const filteredBooks = publicBooks.filter((book) => {
    const matchesGenre = activeGenre === "All" || book.genre === activeGenre;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  useEffect(() =>{
    dispatch(fetchMyBorrow())
    dispatch(fetchAllPublicBooks())
  },[])

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <Container>
          <h1>Library Catalog</h1>
          <p>Browse our collection of {publicBooks.length} books across all departments.</p>
        </Container>
      </div>

      <Container className="py-4">
        <Row>
          {/* Sidebar Filters */}
          <Col lg={3} className="d-none d-lg-block">
            {/* Search */}
            <div className="mb-4">
              <label className="small fw-bold text-uppercase mb-2" style={{ letterSpacing: "1px" }}>Search</label>
              <input
                type="text"
                className="form-control rounded-0"
                placeholder="Title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "1px solid var(--border-color)" }}
              />
            </div>

            {/* Genre Filter */}
            <div className="genre-filter">
              <h5 className="section-title">Genres</h5>
              <div className="mt-4">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className={`genre-item ${activeGenre === genre ? "active" : ""}`}
                    onClick={() => setActiveGenre(genre)}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 p-4 bg-light">
              <h6 className="fw-bold mb-3 text-uppercase small" style={{ letterSpacing: "1px" }}>
                Collection Stats
              </h6>
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Available</span>
                <span className="fw-bold text-success">{publicBooks.length}</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Borrow</span>
                <span className="fw-bold text-warning">{borrows.length}</span>
              </div>
            </div>
          </Col>

          {/* Book Grid */}
          <Col lg={9}>
            {/* Mobile Search */}
            <div className="d-lg-none mb-4">
              <input
                type="text"
                className="form-control rounded-0"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Genre Pills */}
            <div className="d-lg-none d-flex flex-wrap gap-2 mb-4">
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`quick-action-btn ${activeGenre === genre ? "bg-dark text-white" : ""}`}
                  onClick={() => setActiveGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="text-muted small mb-0">
                Showing {filteredBooks.length} of {publicBooks.length} books
              </p>
            </div>

            <Row className="g-4">
              {filteredBooks.map((book) => (
                <Col md={4} sm={6} key={book.id}>
                  <Link to={`/books/${book.id}`} className="text-decoration-none">
                    <div className="book-grid-card h-100">
                      <div className="book-cover">
                        <img src={book.thumbnail || bookPlaceHolder} alt={book.title} />
                      </div>
                      <div className="book-info">
                        <p className="book-title">{book.title}</p>
                        <p className="book-author">{book.author}</p>
                        <div className="book-meta">
                          <span className={`badge-status ${book.status === "Available" ? "badge-available" : "badge-reserved"}`}>
                            {book.status}
                          </span>
                          <span className="book-rating">★ {book.rating}</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: "0.75rem" }}>{book.genre} · {book.year}</p>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>

            {filteredBooks.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No books found matching your criteria.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookBrowse;
