import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewBoook,
  deleteBook,
  fetchAllBooks,
  updateBook,
} from "../../features/book/bookAction";
import { useForm } from "../../hooks/useForm";

const initialState = {
  title: "",
  author: "",
  isbn: "",
  genre: "",
  publicationYear: "",
  status: "active",
};

function AdminBooks() {
  const { books } = useSelector((store) => store.bookStore);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const dispatch = useDispatch();

  // Pagination calculations
  const totalPages = Math.ceil(books.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = books.slice(startIndex, startIndex + booksPerPage);

  // Reset page when books list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [books.length]);

  // const [formData, setFormData] = useState(emptyBook);
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const { formData, setFormData, handleChange } = useForm(initialState);

  const handleEdit = (bookId) => {
    if (window.confirm("Are you sure you want to edit the book?")) {
      const book = books.find((b) => b._id === bookId);
      if (book) {
        setFormData(book);
        setShowForm(true);
      }
    } else {
      const book = books.find((b) => b._id === bookId);
      if (book) {
        setFormData(initialState);
        setShowForm(false);
      }
    }
  };
  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to remove the book?")) {
      dispatch(deleteBook(bookId));
    }
  };

  const handleSubmit = (e) => {
    if (
      window.confirm(
        formData._id
          ? "Are you sure you want to update the book?"
          : "Are you sure you want to add the book?",
      )
    ) {
      e.preventDefault();

      console.log(2222, formData);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      console.log(333, data);

      if (formData._id) {
        // Update existing book
        dispatch(updateBook(formData._id, data));
      } else {
        // Add new book
        dispatch(addNewBoook(data));
      }

      setFormData(initialState);
      setShowForm(false);
    } else {
      setFormData(initialState);
      setShowForm(false);
    }
  };

  // handle status change

  const handleStatusChange = (bookId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    if (
      window.confirm(
        `Are you sure you want to change the status of the book from ${currentStatus} to ${newStatus}`,
      )
    ) {
      dispatch(updateBook(bookId, { status: newStatus }));
    }
  };

  useEffect(() => {
    // Actions
    // fetch all books
    // load the component
    dispatch(fetchAllBooks());
  }, []);

  return (
    <div>
      <div className="page-header">
        <Container>
          <h1>Manage Books</h1>
          <p>Add, edit, and manage the library's book collection.</p>
        </Container>
      </div>

      <Container className="py-4">
        {/* Add Book Form Toggle */}
        <div className="mb-4">
          <button
            className="btn btn-dark rounded-0 px-4 text-uppercase fw-bold small"
            style={{ letterSpacing: "1px" }}
            onClick={() => {
              setShowForm(!showForm);
              setFormData(initialState);
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add New Book"}
          </button>
        </div>

        {/* Inline Add Form */}
        {showForm && (
          <div className="inline-form mb-4">
            <h6
              className="fw-bold text-uppercase mb-4"
              style={{ letterSpacing: "2px", fontSize: "0.8rem" }}
            >
              {formData._id ? "Edit Book Details" : "New Book Details"}
            </h6>
            <form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Book title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <label>Author</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <label>ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    className="form-control"
                    placeholder="978-XXXXXXXXXX"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    className="form-control"
                    placeholder="e.g. Technology"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <label>Publication Year</label>
                  <input
                    type="number"
                    name="publicationYear"
                    className="form-control"
                    placeholder="2024"
                    value={formData.publicationYear}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={8}>
                  <label>Thumbnail URL</label>
                  <input type="file" name="image" onChange={handleChange} />
                </Col>
                <Col md={4}>
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </Col>
                <Col xs={12} className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-dark rounded-0 px-5 text-uppercase fw-bold small"
                    style={{ letterSpacing: "1px" }}
                  >
                    {formData._id ? "Update Book" : "Save Book"}
                  </button>
                </Col>
              </Row>
            </form>
          </div>
        )}

        {/* Books Table */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h5>
              All Books ({books.length})
              {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
            </h5>
          </div>
          <div className="table-responsive">
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.map((book) => (
                  <tr key={book._id}>
                    <td className="fw-bold">{book.title}</td>
                    <td>{book.author}</td>
                    <td className="text-muted small">{book.isbn}</td>
                    <td>{book.genre}</td>
                    <td>{book.publicationYear}</td>
                    <td>
                      <button
                        className={`badge-status ${book.status === "active" ? "badge-active" : "badge-returned"}`}
                        onClick={() => {
                          handleStatusChange(book._id, book.status);
                        }}
                      >
                        {book.status}
                      </button>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-action btn-action-edit"
                          onClick={() => handleEdit(book._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-action-delete"
                          onClick={() => handleDelete(book._id)}
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

export default AdminBooks;
