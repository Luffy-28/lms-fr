import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/theme.css";
import "./styles/pages.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Verification from "./pages/Verification";
import Home from "./pages/Home";
import BookBrowse from "./pages/BookBrowse";
import BookDetail from "./pages/BookDetail";
import BorrowedBooks from "./pages/BorrowedBooks";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBorrowings from "./pages/admin/AdminBorrowings";
import AdminReviews from "./pages/admin/AdminReviews";
import Auth from "./components/Auth/Auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { autoLogin } from "./features/user/userAction";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(autoLogin());
  }, []);
  return (
    <Router>
      <Routes>
        {/* Layout */}
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verification />} />
          {/* private routes */}
          <Route
            path="/dashboard"
            element={
              <Auth>
                <Dashboard />
              </Auth>
            }
          />
          <Route
            path="/books"
            element={
              <Auth>
                <BookBrowse />
              </Auth>
            }
          />
          <Route
            path="/books/:id"
            element={
              <Auth>
                <BookDetail />
              </Auth>
            }
          />
          <Route
            path="/borrowed"
            element={
              <Auth>
                <BorrowedBooks />
              </Auth>
            }
          />
          <Route
            path="/admin/books"
            element={
              <Auth>
                <AdminBooks />
              </Auth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <Auth>
                <AdminUsers />
              </Auth>
            }
          />
          <Route
            path="/admin/borrowings"
            element={
              <Auth>
                <AdminBorrowings />
              </Auth>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <Auth>
                <AdminReviews />
              </Auth>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
