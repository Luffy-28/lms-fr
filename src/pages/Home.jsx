import React, { useEffect, useMemo, useState } from "react";
import heroBanner from "../assets/hero_banner.png";
import book1 from "../assets/book1.png";
import book2 from "../assets/book2.png";
import bookPlaceHolder from "../assets/book_placeholder.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPublicBooks } from "../features/book/bookAction";
import { borrowBook } from "../features/borrow/borrowAction";
import { setSearchBooks } from "../features/book/bookSlice";
import { Link, useSearchParams } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get("limit");
  const [currentPage, setCurrentPage] = useState(searchParams.get("page"));
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const {
    publicBooks,
    publicBooksTotalPage,
    searchBooks: searchResults,
  } = useSelector((state) => state.bookStore);
  const { user } = useSelector((state) => state.userStore);

  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    dispatch(fetchAllPublicBooks(currentPage, limit, search));
  }, [dispatch, currentPage, search]);

  const genres = useMemo(() => {
    return [
      "All",
      ...new Set(publicBooks.map((book) => book.genre).filter(Boolean)),
    ];
  }, [publicBooks]);

  const isSearching = searchResults !== null;

  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    setFilteredBooks(publicBooks);
  }, [publicBooks]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, searchResults]);

  const handleClearSearch = () => {
    dispatch(setSearchBooks(null));
  };

  const handleBorrow = (bookId) => {
    dispatch(borrowBook(bookId));
  };

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div
        className="position-relative overflow-hidden mb-5"
        style={{ height: "600px" }}
      >
        <img
          src={heroBanner}
          className="w-100 h-100 object-fit-cover"
          alt="Hero Banner"
        />

        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <p className="text-uppercase mb-2" style={{ letterSpacing: "4px" }}>
            Virtual Library 2026
          </p>
          <h1 className="display-3 fw-bold mb-4">EXPAND YOUR HORIZONS</h1>
          <button className="btn btn-premium px-5 py-3">Explore Library</button>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row">
          {/* Sidebar */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="mb-5">
              <h5 className="section-title">Genres</h5>
              <ul className="list-unstyled">
                {genres.map((genre) => (
                  <li className="mb-2" key={genre}>
                    <button
                      type="button"
                      onClick={() => setSelectedGenre(genre)}
                      className={`btn btn-link text-decoration-none p-0 border-0 ${
                        selectedGenre === genre
                          ? "fw-bold text-primary"
                          : "text-dark"
                      }`}
                    >
                      {genre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-5 p-4 bg-light">
              <h5 className="fw-bold mb-3">LIBRARY ALERTS</h5>
              <p className="small text-muted mb-3">
                Stay updated with new arrivals and library news.
              </p>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control rounded-0"
                  placeholder="Email Address"
                />
                <button className="btn btn-dark rounded-0">JOIN</button>
              </div>
            </div>

            <div className="mb-5">
              <h5 className="section-title">Bestsellers</h5>
              {[1, 2].map((i) => (
                <div key={i} className="d-flex mb-3 align-items-center">
                  <img
                    src={i === 1 ? book1 : book2}
                    style={{
                      width: "60px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    className="me-3"
                    alt="Book"
                  />
                  <div>
                    <p className="mb-0 fw-bold small">Latest Journal</p>
                    <p className="mb-0 text-primary small italic">Available</p>
                    <div className="text-warning small">★★★★★</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="section-title mb-1">
                  {isSearching ? "Search Results" : "Trending Now"}
                </h5>
                <p className="text-muted mb-0 small">
                  {isSearching
                    ? `Found ${filteredBooks.length} book(s)`
                    : `Showing: ${selectedGenre === "All" ? "All Books" : selectedGenre}`}
                </p>
              </div>

              <div className="nav-arrows">
                {isSearching ? (
                  <button
                    className="btn btn-outline-dark btn-sm rounded-0"
                    onClick={handleClearSearch}
                  >
                    ✕ Clear Search
                  </button>
                ) : (
                  <>
                    <span className="me-2 cursor-pointer">←</span>
                    <span className="cursor-pointer">→</span>
                  </>
                )}
              </div>
            </div>

            <div className="row g-4">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div key={book._id || book.id} className="col-md-4 col-sm-6">
                    <div className="premium-card position-relative h-100 p-3">
                      {book.tag && (
                        <span className="position-absolute top-0 start-0 bg-primary text-white px-2 py-1 small m-2">
                          {book.tag}
                        </span>
                      )}

                      <div
                        className="mb-3 overflow-hidden"
                        style={{ height: "300px" }}
                      >
                        <img
                          src={book.thumbnail || bookPlaceHolder}
                          className="w-100 h-100 object-fit-cover transition-transform hover-scale"
                          alt={book.title}
                        />
                      </div>

                      <div className="text-center">
                        <Link to={`/books/${book._id}`}>
                          <p className="fw-bold mb-1">{book.title}</p>
                        </Link>
                        <p
                          className={`small mb-2 ${
                            book.genre ? "text-muted" : ""
                          }`}
                        >
                          {book.genre || "Unknown Genre"}
                        </p>

                        <p
                          className={`small mb-3 ${
                            book.isAvailable ? "text-success" : "text-danger"
                          }`}
                        >
                          {book.isAvailable
                            ? "Available"
                            : book.expectedDate
                              ? `Expected: ${book.expectedDate.split("T")[0]}`
                              : "Not Available"}
                        </p>

                        {user?._id ? (
                          <button
                            className={`btn w-100 rounded-0 ${
                              book.isAvailable
                                ? "btn-dark"
                                : "btn-outline-secondary disabled"
                            }`}
                            onClick={() => handleBorrow(book._id)}
                            disabled={!book.isAvailable}
                          >
                            {book.isAvailable
                              ? "BORROW FOR FREE"
                              : "NOT AVAILABLE"}
                          </button>
                        ) : (
                          <span>Login to borrow</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-5 bg-light">
                    <h5 className="fw-bold">No books found</h5>
                    <p className="text-muted mb-0">
                      {isSearching
                        ? "No books match your search. Try a different keyword."
                        : "There are no books available in this genre."}
                    </p>
                    {isSearching && (
                      <button
                        className="btn btn-outline-dark btn-sm rounded-0 mt-3"
                        onClick={handleClearSearch}
                      >
                        ✕ Clear Search
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <nav className="mt-4 d-flex justify-content-center">
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link rounded-0"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    ← Previous
                  </button>
                </li>
                {Array.from(
                  { length: publicBooksTotalPage },
                  (_, i) => i + 1,
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${currentPage === page ? "active" : ""}`}
                  >
                    <button
                      className="page-link rounded-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${false ? "disabled" : ""}`}>
                  <button
                    className="page-link rounded-0"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(publicBooksTotalPage, p + 1),
                      )
                    }
                  >
                    Next →
                  </button>
                </li>
              </ul>
            </nav>

            {/* Middle Banner */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="bg-dark text-white p-5 text-center position-relative overflow-hidden">
                  <div className="z-1 position-relative">
                    <h2 className="display-5 fw-bold mb-3">
                      ACADEMIC EXCELLENCE
                    </h2>
                    <p className="mb-4">
                      Access our collection of peer-reviewed research papers.
                    </p>
                    <button className="btn btn-outline-light rounded-0 px-4">
                      Browse Journals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
