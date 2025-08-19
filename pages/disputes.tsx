"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Container, Typography, Pagination, Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import SearchBar from "@/components/Shared/Inputs/SearchBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuth from "@/context/auth-context";
import { useDispute } from "@/hooks/disputes";

export default function DisputesPage() {
  const auth = useAuth();
  const { getAllDisputes } = useDispute();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["disputes", auth.id, page, limit, search],
    queryFn: () => getAllDisputes(auth.id, page, limit, -1, search),
    enabled: !!auth.id && auth.hydrated && !!auth.jwtToken,
    placeholderData: (prev) => prev,
  });

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ mb: 2 }}>Disputes</Typography>
        <Box mb={2}>
          <SearchBar onSearch={(q) => { setPage(1); setSearch(q); }} placeholder="Search disputes" />
        </Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {data?.disputes?.length ? (
              <>
              {data.disputes.map((d) => {
                const id = (d as any)?._id;
                return (
                  <Box key={id} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box>
                        <Typography fontWeight={600}>{d.category} — {d.disputeStatus}</Typography>
                        <Typography variant="body2" color="text.secondary">Booking: {d.bookingId}</Typography>
                        <Typography variant="body2" color="text.secondary">Initiator: {d.initiatorName}</Typography>
                      </Box>
                      <Button variant="outlined" onClick={() => router.push(`/disputes/${id}`)}>View Details</Button>
                    </Stack>
                  </Box>
                );
              })}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Pagination
                  page={page}
                  count={Math.max(1, Math.ceil((data?.totalDisputes || 0) / limit))}
                  onChange={(_e, value) => setPage(value)}
                  shape="rounded"
                  color="primary"
                />
              </Box>
              </>
            ) : (
              <Typography>No disputes found.</Typography>
            )}
          </Box>
        )}
      </Container>
    </ProtectedRoute>
  );
}

