import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "../hooks/useForm";
import { setUser } from "../features/user/userSlice";
import heroBanner from "../assets/hero_banner.png";
import { signupApis } from "../features/user/userApis";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function Registration() {
  const navigate = useNavigate();
  const { formData, setFormData, handleChange } = useForm(initialState);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const data = await signupApis(formData);

      console.log("Response Data", data);
      if (data.status === "success") {
        alert("Registration successful");
        dispatch(setUser({ user: data.user, token: null }))
        setFormData(initialState);
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const inputFields = [
    {
      label: "First Name",
      icon: <i className="bi bi-person"></i>,
      type: "text",
      name: "firstName",
      placeholder: "John",
      value: formData.firstName,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Last Name",
      icon: <i className="bi bi-person-badge"></i>,
      type: "text",
      name: "lastName",
      placeholder: "Doe",
      value: formData.lastName,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Email Address",
      icon: <i className="bi bi-envelope"></i>,
      type: "email",
      name: "email",
      placeholder: "name@example.com",
      value: formData.email,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Phone Number",
      icon: <i className="bi bi-telephone"></i>,
      type: "tel",
      name: "phone",
      placeholder: "0400 000 000",
      value: formData.phone,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Password",
      icon: <i className="bi bi-lock"></i>,
      type: "password",
      name: "password",
      placeholder: "••••••••",
      value: formData.password,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Confirm Password",
      icon: <i className="bi bi-shield-lock"></i>,
      type: "password",
      name: "confirmPassword",
      placeholder: "••••••••",
      value: formData.confirmPassword,
      onChange: handleChange,
      required: true,
    },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Left Side - Image */}
        <div className="col-lg-5 d-none d-lg-block">
          <div
            className="h-100 w-100 object-fit-cover"
            style={{
              backgroundImage: `url(${heroBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7)"
            }}
          >
            <div className="d-flex h-100 align-items-center justify-content-center text-white text-center p-5">
              <div>
                <h1 className="display-4 fw-bold mb-4">ACTIQUER</h1>
                <p className="fs-5 opacity-75">Join our community of readers. Create your member account to start borrowing books today.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center bg-white p-5">
          <div style={{ maxWidth: "600px", width: "100%" }}>
            <div className="text-center mb-5">
              <h2 className="fw-bold text-uppercase tracking-widest mb-2" style={{ letterSpacing: "3px" }}>Member Registration</h2>
              <p className="text-muted small">Register to become a part of the ACTIQUER library community.</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row>
                {inputFields.map((field, i) => (
                  <Col md={6} key={i} className="mb-4">
                    <label className="small fw-bold text-uppercase mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 px-0 mb-2 focus-primary"
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                      required={field.required}
                      style={{ borderBottom: "2px solid #eee", boxShadow: "none" }}
                    />
                  </Col>
                ))}
              </Row>

              <Button type="submit" className="btn-premium w-100 mb-4 mt-3">
                Create Account
              </Button>

              <div className="text-center">
                <p className="text-muted small">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none border-bottom border-primary pb-1">
                    Sign In
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
