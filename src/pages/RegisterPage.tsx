import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, InputAdornment, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import { Balance as ScaleIcon, Visibility, VisibilityOff } from "@mui/icons-material";

import { register } from "../services/authService";

import { GeneralColors } from "../constants/colors";

import { AuthPageWrapper, FlexColumn, FormContainer, FormWrapper, TwoRowsGrid } from "../styles/StyledComponents";
import { Subtitle1, Subtitle2, Title1 } from "../components/typography/Titles";
import CustomInput from "../components/inputs/CustomInput";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { Typography2 } from "../components/typography/Typography";
import { validateEmail, validatePassword } from "../utils/validators";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      firstName: formData.firstName ? "" : "First name is required",
      lastName: formData.lastName ? "" : "Last name is required",
      email: formData.email
        ? validateEmail(formData.email)
          ? ""
          : "Please enter a valid email address"
        : "Email is required",
      password: formData.password
        ? validatePassword(formData.password)
          ? ""
          : "Password must be at least 8 characters with 1 uppercase letter and 1 number"
        : "Password is required",
      confirmPassword: formData.confirmPassword
        ? formData.confirmPassword === formData.password
          ? ""
          : "Passwords do not match"
        : "Please confirm your password",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    let errorMessage = "";

    switch (field) {
      case "email":
        if (value && !validateEmail(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "password":
        if (value && !validatePassword(value)) {
          errorMessage = "Password must be at least 8 characters with 1 uppercase letter and 1 number";
        }
        if (formData.confirmPassword && formData.confirmPassword !== value) {
          setErrors({
            ...errors,
            confirmPassword: "Passwords do not match",
          });
        } else if (formData.confirmPassword && formData.confirmPassword === value) {
          setErrors({
            ...errors,
            confirmPassword: "",
          });
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          errorMessage = "Passwords do not match";
        }
        break;
    }

    setErrors({
      ...errors,
      [field]: errorMessage,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.message === "Email already in use") {
        setErrors({
          ...errors,
          email: "Email already in use",
        });
      } else {
        console.log("Registration failed:", error);
      }
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName !== "" &&
      formData.lastName !== "" &&
      formData.email !== "" &&
      validateEmail(formData.email) &&
      formData.password !== "" &&
      validatePassword(formData.password) &&
      formData.confirmPassword !== "" &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms
    );
  };

  return (
    <AuthPageWrapper>
      <FormContainer onSubmit={handleSubmit}>
        <FlexColumn alignitems="center" gap="8px">
          <ScaleIcon sx={{ fontSize: 30, color: GeneralColors.Gold }} />
          <Title1>Create Account</Title1>
          <Subtitle1>Join LegalSpace to find the right lawyer for your case</Subtitle1>
        </FlexColumn>

        <FormWrapper>
          <TwoRowsGrid>
            <CustomInput
              required
              fullWidth
              id="firstName"
              label="First Name"
              placeholder="Enter your first name"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              sx={{ width: "100%" }}
            />
            <CustomInput
              required
              fullWidth
              id="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </TwoRowsGrid>

          <CustomInput
            required
            fullWidth
            id="email"
            label="Email"
            placeholder="Enter your email address"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />

          <CustomInput
            required
            fullWidth
            id="password"
            label="Password"
            placeholder="Create a password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <CustomInput
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                name="agreeToTerms"
                color="primary"
              />
            }
            label={
              <Typography2 fontWeight="400">
                I agree to the{" "}
                <Link to="/terms" style={{ color: "inherit" }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" style={{ color: "inherit" }}>
                  Privacy Policy
                </Link>
              </Typography2>
            }
            sx={{ mt: 2 }}
          />

          <PrimaryButton type="submit" fullWidth variant="filled" color="gold" disabled={!isFormValid()}>
            Create Account
          </PrimaryButton>

          <Box sx={{ textAlign: "center" }}>
            <Subtitle2>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </Subtitle2>
          </Box>
        </FormWrapper>
      </FormContainer>
    </AuthPageWrapper>
  );
}
