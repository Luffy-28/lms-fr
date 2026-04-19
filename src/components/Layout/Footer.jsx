import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <div className="row g-4">
          <div className="col-lg-4 text-start">
            <h4 className="fw-bold mb-4">ACTIQUER</h4>
            <p className="small text-white-50">
              A curated collection of knowledge, fashion, and lifestyle.
              Elevating your learning experience with style.
            </p>
          </div>
          <div className="col-lg-2 col-md-4 text-start">
            <h6 className="text-uppercase fw-bold mb-3 small">Services</h6>
            <ul className="list-unstyled small text-white-50">
              <li>Book Borrowing</li>
              <li>Member Portal</li>
              <li>Research Support</li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-4 text-start">
            <h6 className="text-uppercase fw-bold mb-3 small">Help & Info</h6>
            <ul className="list-unstyled small text-white-50">
              <li>Library Policy</li>
              <li>FAQs</li>
              <li>Contact Librarian</li>
            </ul>
          </div>
          <div className="col-lg-4 text-start">
            <h6 className="text-uppercase fw-bold mb-3 small">Newsletter</h6>
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-0 bg-transparent border-secondary text-white"
                placeholder="Enter your email"
              />
              <button className="btn btn-outline-light rounded-0">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
        <hr className="my-5 border-secondary" />
        <p className="small text-white-50 mb-0">
          &copy; {new Date().getFullYear()} ACTIQUER LMS. All rights reserved.
          <span className="ms-3">24/7 SUPPORT</span>
          <span className="ms-3">OPEN RESOURCE ACCESS</span>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
