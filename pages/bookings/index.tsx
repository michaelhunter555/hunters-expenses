"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Container, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuth from "@/context/auth-context";
import SearchBar from "@/components/Shared/Inputs/SearchBar";
import { useBookings } from "@/hooks/bookings";
import { useRouter } from "next/router";

export default function BookingsPage() {
  const auth = useAuth();
  const router = useRouter();
  const { getBookings } = useBookings();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", page, limit, status, search],
    queryFn: () => getBookings(page, limit, status as any, search),
    enabled: auth.hydrated && !!auth.jwtToken,
    placeholderData: (prev) => prev,
  });

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} mb={2} gap={2}>
          <Typography variant="h5">Bookings</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems={{ xs: 'stretch', md: 'center' }}>
            <SearchBar onSearch={(q) => { setPage(1); setSearch(q); }} placeholder="Search bookings" />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status ?? ''}
                label="Status"
                onChange={(e) => { setPage(1); setStatus(e.target.value ? String(e.target.value) : undefined); }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
                <MenuItem value="reschedule">Reschedule</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {isLoading ? (
          <Typography>Loading…</Typography>
        ) : (data?.bookings?.length ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Barber</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.bookings.map((b) => (
                  <TableRow key={b.bookingNumber} hover>
                    <TableCell>{b.bookingNumber}</TableCell>
                    <TableCell>{b.customerName}</TableCell>
                    <TableCell>{b.barberName}</TableCell>
                    <TableCell>{b.bookingDate}</TableCell>
                    <TableCell>{b.bookingTime}</TableCell>
                    <TableCell>{b.bookingStatus}</TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small" onClick={() => router.push(`/bookings/${(b as any)?._id}`)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Pagination
                page={page}
                count={Math.max(1, Math.ceil((data?.totalBookings || 0) / limit))}
                onChange={(_e, value) => setPage(value)}
                shape="rounded"
                color="primary"
              />
            </Box>
          </TableContainer>
        ) : (
          <Typography>No bookings found.</Typography>
        ))}
      </Container>
    </ProtectedRoute>
  );
}


