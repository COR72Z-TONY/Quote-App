import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import { getAuthor, getQuote } from "../services/api";
import { Author, Quote } from "../types";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (author: Author, quote: Quote) => void;
}

type RequestStatus = "idle" | "loading" | "completed" | "error";

const QuoteModal: React.FC<QuoteModalProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [authorStatus, setAuthorStatus] = useState<RequestStatus>("idle");
  const [quoteStatus, setQuoteStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset state when modal opens
    if (open) {
      setAuthor(null);
      setQuote(null);
      setAuthorStatus("loading");
      setQuoteStatus("idle");
      setError(null);

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Start fetching author
      fetchAuthor();
    }

    // Cleanup on modal close
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [open]);

  const fetchAuthor = async () => {
    if (!abortControllerRef.current) return;

    try {
      setAuthorStatus("loading");
      const authorData = await getAuthor(abortControllerRef.current);
      setAuthor(authorData);
      setAuthorStatus("completed");

      // Start fetching quote after author is loaded
      fetchQuote(authorData.authorId);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Failed to fetch author");
        setAuthorStatus("error");
      }
    }
  };

  const fetchQuote = async (authorId: number) => {
    if (!abortControllerRef.current) return;

    try {
      setQuoteStatus("loading");
      const quoteData = await getQuote(authorId, abortControllerRef.current);
      setQuote(quoteData);
      setQuoteStatus("completed");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Failed to fetch quote");
        setQuoteStatus("error");
      }
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    onClose();
  };

  const handleComplete = () => {
    if (author && quote) {
      onComplete(author, quote);
      onClose();
    }
  };

  const isLoadingComplete =
    authorStatus === "completed" && quoteStatus === "completed";

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" && !isLoadingComplete) {
          return; // Prevent closing by backdrop click while loading
        }
        handleCancel();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Fetching Quote</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            Author
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: 60,
              mb: 2,
            }}
          >
            {authorStatus === "loading" && (
              <>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography>Loading author...</Typography>
              </>
            )}
            {authorStatus === "completed" && author && (
              <Typography variant="body1" color="success.main">
                Completed: {author.name}
              </Typography>
            )}
            {authorStatus === "error" && (
              <Typography color="error">Failed to load author</Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Quote
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: 60,
            }}
          >
            {quoteStatus === "idle" && (
              <Typography color="text.secondary">
                Waiting for author...
              </Typography>
            )}
            {quoteStatus === "loading" && (
              <>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography>Loading quote...</Typography>
              </>
            )}
            {quoteStatus === "completed" && quote && (
              <Typography variant="body1" color="success.main">
                Completed
              </Typography>
            )}
            {quoteStatus === "error" && (
              <Typography color="error">Failed to load quote</Typography>
            )}
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {!isLoadingComplete ? (
          <Button onClick={handleCancel} color="error">
            Cancel
          </Button>
        ) : (
          <Button onClick={handleComplete} color="primary" variant="contained">
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuoteModal;
