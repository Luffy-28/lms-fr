import React, { useState, useEffect, useRef } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";
import {
  fetchAllPublicBooks,
  searchBooks,
} from "../../features/book/bookAction";
import { setSearchBooks } from "../../features/book/bookSlice";

const Header = () => {
  const { user } = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const debounceTimer = useRef(null);

  const handleOnChange = (value) => {
    setQuery(value);
    if (!value.trim()) {
      dispatch(fetchAllPublicBooks(1, 5, ""));
      return;
    }
    // Debounce: auto-search 500ms after user stops typing
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      dispatch(fetchAllPublicBooks(1, 5, value.trim()));
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSearch = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (query.trim()) {
      dispatch(fetchAllPublicBooks(1, 5, query.trim()));
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="border-bottom py-3 sticky-top">
        <Container>
          <div className="d-flex w-100 justify-content-between align-items-center">
            {/* Brand */}
            <Navbar.Brand
              as={Link}
              to="/"
              className="fw-bold fs-3 text-dark mb-0 d-flex align-items-center"
            >
              ACTIQUER
            </Navbar.Brand>

            {/* Search Bar - Center */}
            <div className="d-none d-lg-flex flex-grow-1 mx-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control rounded-0 border-end-0"
                  value={query}
                  onChange={(e) => handleOnChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for Books, Authors, ISBN..."
                />
                <button
                  className="btn btn-dark rounded-0 px-4"
                  onClick={handleSearch}
                >
                  SEARCH
                </button>
              </div>
            </div>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="border-0"
            />

            <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0">
              <Nav className="ms-auto align-items-center">
                {user?._id ? (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/"
                      className="text-uppercase small fw-bold mx-2"
                    >
                      Home
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/dashboard"
                      className="text-uppercase small fw-bold mx-2"
                    >
                      Dashboard
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/borrowed"
                      className="text-uppercase small fw-bold mx-2"
                    >
                      Brrowed
                    </Nav.Link>
                    <button
                      onClick={handleSignOut}
                      className="btn btn-dark btn-sm rounded-0 text-uppercase small fw-bold px-3"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="d-flex align-items-center ms-lg-3 gap-3">
                    <Link
                      to="/login"
                      className="text-dark text-decoration-none small fw-bold d-flex align-items-center"
                    >
                      <span className="me-1">👤</span> LOGIN
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-dark btn-sm rounded-0 text-uppercase small fw-bold px-3 text-decoration-none"
                    >
                      SIGN UP
                    </Link>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
      {user?._id && user?.role === "admin" ? (
        <>
          <Navbar
            bg="white"
            expand="lg"
            className="border-bottom py-3 sticky-top"
          >
            <Container>
              <div className="d-flex w-100 justify-content-between align-items-center">
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="border-0"
                />
                <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0">
                  <Nav className="ms-auto align-items-center">
                    <Nav.Link
                      as={Link}
                      to="/admin/books"
                      className="text-uppercase small fw-bold mx-2"
                    >
                      Manage Books
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/users"
                      className="text-uppercase small fw-bold mx-2"
                    >
                      Manage Users
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/borrowings"
                      className="text-uppercase small fw-bold mx-2"
                    >
                      All Borrowings
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/reviews"
                      className="text-uppercase small fw-bold mx-2"
                    >
                      Manage Reviews
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </div>
            </Container>
          </Navbar>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Header;
