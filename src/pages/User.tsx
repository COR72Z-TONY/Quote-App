import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import QuoteModal from "../components/QuoteModal";
import { Author, Quote } from "../types";

const User: React.FC = () => {
  const { user, getProfile, currentAuthor, currentQuote, setQuoteData } =
    useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        await getProfile();
      } catch (err) {
        setError("Failed to load user profile");
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []); //getProfile

  const handleUpdate = () => {
    setModalOpen(true);
  };

  const handleQuoteComplete = (author: Author, quote: Quote) => {
    setQuoteData(author, quote);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Information
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {user?.fullname}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email}
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>

            {currentAuthor && currentQuote && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quote of the Day
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {currentAuthor.name}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                    "{currentQuote.quote}"
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Paper>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={handleQuoteComplete}
      />
    </Container>
  );
};

export default User;
