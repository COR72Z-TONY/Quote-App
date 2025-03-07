import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { getInfo } from "../services/api";

const Info: React.FC = () => {
  const [info, setInfo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const infoData = await getInfo();
        setInfo(infoData);
      } catch (err) {
        setError("Failed to load company information");
        console.error("Error fetching info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Company Information
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Typography
            variant="body1"
            component="div"
            dangerouslySetInnerHTML={{ __html: info }}
            sx={{ mt: 2 }}
          />
        )}
      </Paper>
    </Container>
  );
};

export default Info;
