import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import bookPlaceHolder from "../../assets/book_placeholder.jpg";
import { fetchAllBorrowedBooks } from "../../features/borrow/borrowAction";

function AdminBorrowings() {
  const { borrows } = useSelector((state) => state.borrowStore);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, []);
  const activeCount = borrows.filter((b) => b.status === "borrowed").length;
  const returnedCount = borrows.filter((b) => b.status === "returned").length;
  return (
    <div>
      <div className="page-header">
        <Container>
          <h1>All Borrowings</h1>
          <p>Track all book borrowing records across the library.</p>
        </Container>
      </div>

      <Container className="py-4">
        {/* Summary */}
        <div className="d-flex gap-4 mb-4 flex-wrap">
          <div className="stat-card flex-fill">
            <div className="stat-number">{borrows.length}</div>
            <div className="stat-label">Total Records</div>
          </div>
          <div className="stat-card flex-fill">
            <div className="stat-number">{activeCount}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card flex-fill">
            <div className="stat-number">{returnedCount}</div>
            <div className="stat-label">Returned</div>
          </div>
        </div>

        {/* Borrowings Table */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h5>Borrowing Records</h5>
          </div>
          <div className="table-responsive">
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Book Title</th>
                  <th>Borrower</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <img
                        src={record.bookId?.thumbnail || bookPlaceHolder}
                        alt={record.bookId?.title}
                        className="img-fluid"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td className="fw-bold">{record.bookId?.title}</td>
                    <td>
                      {record.userId.firstName + " " + record.userId.lastName}
                    </td>
                    <td className="text-muted small">
                      {new Date(record.borrowDate).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-muted small">
                      {new Date(record.returnDate).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-muted small">
                      {new Date(record.dueDate).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <span
                        className={`badge-status ${
                          record.status === "borrowed"
                            ? "badge-active"
                            : "badge-returned"
                        }`}
                      >
                        {record.status === "borrowed" ? "Active" : "Returned"}
                      </span>
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

export default AdminBorrowings;
