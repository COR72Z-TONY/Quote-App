import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import { LoginRequest } from "../types";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const from = state?.from?.pathname || "/user";

  const handleLogin = async (credentials: LoginRequest): Promise<boolean> => {
    const success = await login(credentials.email, credentials.password);
    if (success) {
      navigate(from, { replace: true });
    }
    return success;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Sign In
        </Typography>
        <LoginForm onSubmit={handleLogin} />
      </Paper>
    </Container>
  );
};

export default Login;
