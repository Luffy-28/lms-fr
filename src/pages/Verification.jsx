import { Form, Button } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import heroBanner from "../assets/hero_banner.png";
import { verifyApis } from "../features/user/userApis";

const initialState = {
  email: "",
  token: "",
};

function Verification() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  initialState.email = searchParams.get("email") || "";
  initialState.token = searchParams.get("token") || "";

  const { formData, setFormData, handleChange } = useForm(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyApis(formData);
      if (data.status === "success") {
        alert("Verification successful. You can now log in.");
        setFormData(initialState);
        navigate("/login");
      } else {
        alert(data.message || "Verification failed.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
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
      label: "Verification Token",
      icon: <i className="bi bi-key"></i>,
      type: "text",
      name: "token",
      placeholder: "Enter your verification code",
      value: formData.token,
      onChange: handleChange,
      required: true,
    },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
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
                  Confirm your account and unlock full access to the library.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white p-5">
          <div style={{ maxWidth: "420px", width: "100%" }}>
            <div className="text-center mb-5">
              <h2
                className="fw-bold text-uppercase tracking-widest mb-2"
                style={{ letterSpacing: "3px" }}
              >
                Email Verification
              </h2>
              <p className="text-muted small">
                Enter the email and token you received to verify your account.
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
                Verify Account
              </Button>

              <div className="text-center">
                <p className="text-muted small">
                  Back to{" "}
                  <Link
                    to="/login"
                    className="text-primary fw-bold text-decoration-none border-bottom border-primary pb-1"
                  >
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

export default Verification;
