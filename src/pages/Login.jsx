import { Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import heroBanner from "../assets/hero_banner.png";
import { getUserDetailApis, loginApis } from "../features/user/userApis";
import { login } from "../features/user/userAction";

const initialState = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { formData, setFormData, handleChange } = useForm(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (await dispatch(login(formData))) {
        if (location.pathname.includes("login")) {
          navigate("/dashboard");
        }
        setFormData(initialState);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const inputFields = [
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
      label: "Password",
      icon: <i className="bi bi-lock"></i>,
      type: "password",
      name: "password",
      placeholder: "••••••••",
      value: formData.password,
      onChange: handleChange,
      required: true,
    },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Left Side - Image */}
        <div className="col-lg-6 d-none d-lg-block">
          <div
            className="h-100 w-100 object-fit-cover"
            style={{
              backgroundImage: `url(${heroBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.8)",
            }}
          >
            <div className="d-flex h-100 align-items-center justify-content-center text-white text-center p-5">
              <div>
                <h1 className="display-3 fw-bold mb-4">ACTIQUER</h1>
                <p className="fs-5 opacity-75">
                  Your Knowledge Hub. Sign in to manage your borrowed books and
                  records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white p-5">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div className="text-center mb-5">
              <h2
                className="fw-bold text-uppercase tracking-widest mb-2"
                style={{ letterSpacing: "3px" }}
              >
                Member Sign In
              </h2>
              <p className="text-muted small">
                Access your personal library collection and dashboard.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              {inputFields.map((field, i) => (
                <div key={i} className="mb-4">
                  <label className="small fw-bold text-uppercase mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 px-0 mb-2 focus-primary"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                    required={field.required}
                    style={{
                      borderBottom: "2px solid #eee",
                      boxShadow: "none",
                    }}
                  />
                </div>
              ))}

              <Button type="submit" className="btn-premium w-100 mb-4 mt-3">
                Log In
              </Button>

              <div className="text-center">
                <p className="text-muted small">
                  New to ACTIQUER?{" "}
                  <Link
                    to="/register"
                    className="text-primary fw-bold text-decoration-none border-bottom border-primary pb-1"
                  >
                    Create Account
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

export default Login;
