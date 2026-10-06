import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  useMediaQuery,
  IconButton,
  InputAdornment,
  InputBase,
  Modal, Alert, Snackbar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import LoginBackground from "../../assets/images/loginbackground.jpg";
import SigninIcon from "../../assets/images/signinimage.png";
import Colors from "../libs/Colors";
import { hosturl } from "../libs/Constant";
import { useModal } from "../../context/ModalContext";
import axios from "axios";

const LoginForm = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const { setIsLogiden } = useModal()
  const navigate = useNavigate();
  const [openForgotModal, setOpenForgotModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: "user"
      };
      const response = await fetch(`${hosturl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("LOGIN_FAILED");
      }

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("token", data.result.token);
        localStorage.setItem("role", data.result.role);
        setIsLogiden(true);
        showSnackbar("Login successful", "success");
        navigate("/");
      } else {
        showSnackbar("Invalid email or password", "error");
      }
    } catch (err) {
      try {
        const response = err?.response;
        const data = response ? await response.json() : null;
        showSnackbar(data?.displayMessage || "Invalid email or password", "error");
      } catch {
        showSnackbar("Invalid email or password", "error");
      }
    }
  };


  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      height="100vh"
      width="100vw"
      m={0}
      p={0}
      bgcolor="white"
    >
      <Box
        flex={isMobile ? "none" : 7}
        sx={{
          backgroundImage: `url(${LoginBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: isMobile ? 2 : 0,
        }}
      >
        <Card
          sx={{
            backgroundColor: "white",
            p: 3,
            width: isMobile ? "100%" : 400,
            maxWidth: 400,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom fontWeight="600" textAlign="center" fontFamily='poppins'>
              Login to Your Account
            </Typography>

            <Typography variant="body2" fontWeight="bold" mt={2}>
              Email:
            </Typography>
            <InputBase
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                px: 1,
                py: 1,
                mt: 0.5,
              }}
            />

            <Typography variant="body2" fontWeight="bold" mt={2}>
              Password:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: 1,
                px: 1,
                py: 0.5,
                mt: 0.5,
              }}
            >
              <InputBase
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              color="primary"
              mt={1}
              textAlign={'end'}
              sx={{ cursor: "pointer", fontWeight: 500 }}
              onClick={() => setOpenForgotModal(true)}
            >
              Forgot Password?
            </Typography>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                height: 45,
                backgroundColor: Colors.secondary,
                border: "none",
                color: "white",
                fontWeight: "500", fontFamily: 'poppins',
                fontSize: 16,

              }}
            >
              Submit
            </Button>

            <Typography variant="body2" textAlign="center" mt={2}>
              Don’t have an account?{" "}
              <Link to="/signup" style={{ color: Colors.primary, fontWeight: "bold" }}>
                Sign up
              </Link>
            </Typography>
          </form>
        </Card>
      </Box>

      {/* Illustration */}
      <Box
        flex={isMobile ? "none" : 5}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#ffffff"
        p={isMobile ? 2 : 0}
      >
        <img
          src={SigninIcon}
          alt="Sign In Illustration"
          style={{
            width: isMobile ? "100%" : "80%",
            maxWidth: "750px",
            objectFit: "contain",
          }}
        />
      </Box>
      <ForgotPasswordModal
        open={openForgotModal}
        handleClose={() => setOpenForgotModal(false)}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default LoginForm;


const ForgotPasswordModal = ({ open, handleClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (!open) {
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setUserId(null);
    }
  }, [open]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${hosturl}/email/code`,
        {
          email,
          tag: "password",
          role:"user"
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.status) {
        showSnackbar("OTP sent to your email", "success");
        setStep(2);
      } else {
        showSnackbar(
          (response.data && response.data.displayMessage) ||
          "Error sending OTP",
          "error"
        );
      }
    } catch (err) {
      showSnackbar(
        (err.response &&
          err.response.data &&
          err.response.data.displayMessage) ||
        "Error sending OTP",
        "error"
      );
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${hosturl}/email/verify`,
        {
          email,
          code: Number(otp),
          tag: "password",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.status) {
        const id = response.data.result;

        if (id) {
          setUserId(id);
          showSnackbar("OTP verified successfully", "success");
          setStep(3);
        } else {
          showSnackbar("User ID missing in response", "error");
        }
      } else {
        showSnackbar(
          (response.data && response.data.displayMessage) ||
          "Invalid OTP",
          "error"
        );
      }
    } catch (err) {
      showSnackbar(
        (err.response &&
          err.response.data &&
          err.response.data.displayMessage) ||
        "Error verifying OTP",
        "error"
      );
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return showSnackbar("Passwords do not match", "warning");
    }

    if (!userId) {
      return showSnackbar("User verification missing", "error");
    }

    try {
      const response = await axios.post(
        `${hosturl}/forgot/password`,
        {
          userId,
          password: newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.status) {
        showSnackbar("Password reset successfully", "success");
        handleClose();
      } else {
        showSnackbar(
          (response.data && response.data.displayMessage) ||
          "Failed to reset password",
          "error"
        );
      }
    } catch (err) {
      showSnackbar(
        (err.response &&
          err.response.data &&
          err.response.data.displayMessage) ||
        "Error resetting password",
        "error"
      );
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 350,
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            mx: "auto",
            mt: "15vh",
            position: "relative",
            boxShadow: 24,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="600" mb={2}>
            Forgot Password
          </Typography>

          {step === 1 && (
            <>
              <Typography variant="body2" mb={1}>
                Enter your registered email
              </Typography>
              <InputBase
                fullWidth
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  mb: 2,
                }}
              />
              <Button variant="contained" fullWidth onClick={handleSendOtp}>
                Send OTP
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Typography variant="body2" mb={1}>
                Enter the OTP sent to your email
              </Typography>
              <InputBase
                fullWidth
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  mb: 2,
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={async (e) => {
                  e.preventDefault(); // stop form submit reload if any
                  await handleVerifyOtp();
                }}
              >
                Verify OTP
              </Button>

            </>
          )}

          {step === 3 && (
            <>
              <Typography variant="body2" mb={1}>
                Reset your password
              </Typography>
              <InputBase
                fullWidth
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  mb: 2,
                }}
              />
              <InputBase
                fullWidth
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  mb: 2,
                }}
              />
              <Button variant="contained" fullWidth onClick={handleResetPassword}>
                Submit
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

