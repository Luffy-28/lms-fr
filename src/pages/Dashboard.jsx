import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBorrow } from "../features/borrow/borrowAction";
import { fetchAllPublicBooks } from "../features/book/bookAction";

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userStore);
  const { borrows } = useSelector((state) => state.borrowStore);
  const { publicBooks } = useSelector((state) => state.bookStore);

  const isAdmin = user?.role === "admin";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    dispatch(fetchMyBorrow());
    dispatch(fetchAllPublicBooks());
  }, [dispatch]);

  // Compute real stats
  const dynamicStats = useMemo(() => {
    if (isAdmin) {
      const activeBorrows = borrows.filter(
        (b) => b.status === "borrowed",
      ).length;
      const overdue = borrows.filter(
        (b) => b.status === "borrowed" && new Date(b.dueDate) < new Date(),
      ).length;
      return [
        {
          icon: "📚",
          number: publicBooks.length.toLocaleString(),
          label: "Total Books",
        },
        {
          icon: "📖",
          number: activeBorrows.toLocaleString(),
          label: "Active Borrowings",
        },
        {
          icon: "✅",
          number: borrows
            .filter((b) => b.status === "returned")
            .length.toLocaleString(),
          label: "Returned",
        },
        { icon: "⚠️", number: overdue.toLocaleString(), label: "Overdue" },
      ];
    } else {
      const myActive = borrows.filter((b) => b.status === "borrowed").length;
      const myReturned = borrows.filter((b) => b.status === "returned").length;
      const overdue = borrows.filter(
        (b) => b.status === "borrowed" && new Date(b.dueDate) < new Date(),
      ).length;
      return [
        {
          icon: "📖",
          number: myActive.toLocaleString(),
          label: "Currently Borrowed",
        },
        {
          icon: "✅",
          number: myReturned.toLocaleString(),
          label: "Books Returned",
        },
        {
          icon: "📚",
          number: borrows.length.toLocaleString(),
          label: "Total Borrows",
        },
        { icon: "⚠️", number: overdue.toLocaleString(), label: "Overdue" },
      ];
    }
  }, [borrows, publicBooks, isAdmin]);

  // Sort borrows by most recent first
  const sortedBorrows = useMemo(() => {
    return [...borrows].sort(
      (a, b) => new Date(b.borrowDate) - new Date(a.borrowDate),
    );
  }, [borrows]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedBorrows.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBorrows = sortedBorrows.slice(
    startIndex,
    startIndex + booksPerPage,
  );

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [borrows.length]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusInfo = (borrow) => {
    if (borrow.status === "returned")
      return { label: "Returned", className: "badge-returned" };
    else if (borrow.status === "reviewed")
      return { label: "Reviewed", className: "badge-review" };
    if (new Date(borrow.dueDate) < new Date())
      return { label: "Overdue", className: "badge-overdue" };
    return { label: "Active", className: "badge-active" };
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <Container>
          <h1>{isAdmin ? "Admin Dashboard" : "My Dashboard"}</h1>
          <p>
            Welcome back, {user?.firstName || "User"}. Here's your overview.
          </p>
        </Container>
      </div>

      <Container className="py-4">
        {/* Stat Cards */}
        <Row className="g-4 mb-5">
          {dynamicStats.map((stat, i) => (
            <Col md={3} sm={6} key={i}>
              <div className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <div className="d-flex gap-2 flex-wrap mb-5">
          {isAdmin ? (
            <>
              <Link
                to="/admin/books"
                className="quick-action-btn text-decoration-none text-dark"
              >
                + Add New Book
              </Link>
              <Link
                to="/admin/users"
                className="quick-action-btn text-decoration-none text-dark"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/borrowings"
                className="quick-action-btn text-decoration-none text-dark"
              >
                View All Borrowings
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="quick-action-btn text-decoration-none text-dark"
              >
                Browse Books
              </Link>
              <Link
                to="/borrowed"
                className="quick-action-btn text-decoration-none text-dark"
              >
                My Borrowed Books
              </Link>
            </>
          )}
        </div>

        {/* Borrowings Table */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h5>
              {isAdmin ? "Recent Borrowings" : "My Borrowing History"} (
              {sortedBorrows.length})
              {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
            </h5>
          </div>
          <div className="table-responsive">
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  {isAdmin && <th>Borrower</th>}
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBorrows.length > 0 ? (
                  paginatedBorrows.map((item) => {
                    const statusInfo = getStatusInfo(item);
                    return (
                      <tr key={item._id}>
                        <td className="fw-bold">
                          {item.bookId?.title || "Unknown Book"}
                        </td>
                        {isAdmin && (
                          <td>
                            {item.userId
                              ? `${item.userId.firstName} ${item.userId.lastName}`
                              : "Unknown"}
                          </td>
                        )}
                        <td>{formatDate(item.borrowDate)}</td>
                        <td>{formatDate(item.dueDate)}</td>
                        <td>
                          <span
                            className={`badge-status ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={isAdmin ? 5 : 4}
                      className="text-center text-muted py-4"
                    >
                      No borrowing records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3 mb-2">
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  ),
                )}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link rounded-0"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next →
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
