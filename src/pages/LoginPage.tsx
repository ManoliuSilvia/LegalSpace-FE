import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, InputAdornment, IconButton } from "@mui/material";
import { Balance as ScaleIcon, Visibility, VisibilityOff } from "@mui/icons-material";

import { login } from "../services/authService";

import { GeneralColors, TextColors } from "../constants/colors";

import { AuthPageWrapper, FlexColumn, FormContainer, FormWrapper } from "../styles/StyledComponents";
import { Subtitle1, Subtitle2, Title1 } from "../components/typography/Titles";
import CustomInput from "../components/inputs/CustomInput";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { Typography2 } from "../components/typography/Typography";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError(""); // Clear error when input changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Redirect to dashboard on successful login
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Incorrect email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageWrapper>
      <FormContainer onSubmit={handleSubmit}>
        <FlexColumn alignitems="center" gap="8px">
          <ScaleIcon sx={{ fontSize: 32, color: GeneralColors.Gold }} />
          <Title1>Welcome Back</Title1>
          <Subtitle1>Sign in to your LegalSpace account</Subtitle1>
        </FlexColumn>

        <FormWrapper>
          {error && <Typography2 color={TextColors.Error}>{error}</Typography2>}

          <CustomInput
            required
            fullWidth
            id="email"
            label="Email"
            placeholder="Enter your email address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <CustomInput
            required
            fullWidth
            id="password"
            label="Password"
            placeholder="Enter your password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
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

          <PrimaryButton
            type="submit"
            fullWidth
            variant="filled"
            color="gold"
            disabled={!formData.email || !formData.password || isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </PrimaryButton>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Subtitle2>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign up
              </Link>
            </Subtitle2>
          </Box>
        </FormWrapper>
      </FormContainer>
    </AuthPageWrapper>
  );
}
