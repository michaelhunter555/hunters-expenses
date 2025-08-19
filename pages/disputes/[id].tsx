"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuth from "@/context/auth-context";
import { useDispute } from "@/hooks/disputes";

export default function DisputeDetailPage() {
  const auth = useAuth();
  const { getDisputeById } = useDispute();
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [response, setResponse] = useState("");

  const { data: dispute, isLoading } = useQuery({
    queryKey: ["disputeDetail", id],
    queryFn: () => getDisputeById(String(id)),
    enabled: !!id && auth.hydrated && !!auth.jwtToken,
  });

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {isLoading ? (
          <Typography>Loading…</Typography>
        ) : dispute ? (
          <Stack direction={{ xs: "column", md: "row" }} gap={3}>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={600} mb={2}>
                Dispute Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography><b>Category:</b> {dispute.category}</Typography>
              <Typography><b>Status:</b> {dispute.disputeStatus}</Typography>
              <Typography><b>Booking:</b> {dispute.bookingId}</Typography>
              <Typography><b>Initiator:</b> {dispute.initiatorName} ({dispute.initiator})</Typography>
              <Typography><b>Explanation:</b> {dispute.disputeExplanation}</Typography>
            </Box>
            <Box width={{ xs: "100%", md: 360 }}>
              <Typography variant="h6" mb={1}>Admin Response</Typography>
              <TextField
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response"
                fullWidth
                multiline
                minRows={4}
              />
              <Stack direction="row" justifyContent="flex-end" mt={1}>
                <Button variant="contained">Send Response</Button>
              </Stack>
            </Box>
          </Stack>
        ) : (
          <Typography>No dispute found.</Typography>
        )}
      </Container>
    </ProtectedRoute>
  );
}


