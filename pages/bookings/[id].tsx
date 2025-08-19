"use client";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import Image from 'next/image';
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuth from "@/context/auth-context";
import { useBookings } from "@/hooks/bookings";

export default function BookingDetailPage() {
  const auth = useAuth();
  const { getBookingById } = useBookings();
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const { data: booking, isLoading } = useQuery({
    queryKey: ["bookingDetail", id],
    queryFn: () => getBookingById(String(id)),
    enabled: !!id && auth.hydrated && !!auth.jwtToken,
  });

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {isLoading ? (
          <Typography>Loading…</Typography>
        ) : booking ? (
          <Stack gap={2}>
            <Typography variant="h5" fontWeight={600}>Booking Details</Typography>
            <Divider />
            <Box>
              <Typography><b>Booking #:</b> {booking.bookingNumber}</Typography>
              <Typography><b>Status:</b> {booking.bookingStatus}</Typography>
              <Typography><b>Customer:</b> {booking.customerName} ({booking.customerId})</Typography>
              <Typography><b>Barber:</b> {booking.barberName} ({booking.barberId})</Typography>
              <Typography><b>Date:</b> {booking.bookingDate}</Typography>
              <Typography><b>Time:</b> {booking.bookingTime}</Typography>
              <Typography><b>Location:</b> {booking.bookingLocation}</Typography>
              {booking.price !== undefined && (
                <Typography><b>Price:</b> {booking.price}</Typography>
              )}
              {booking.proofOfCompletionImg && (
                <Box mt={2}>
                  <Typography fontWeight={600} mb={1}>Proof of Completion</Typography>
                  <Image
                    src={booking.proofOfCompletionImg}
                    alt="Proof of completion"
                    width={600}
                    height={400}
                    style={{ objectFit: 'contain', borderRadius: 8, border: '1px solid #eee' }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        ) : (
          <Typography>Booking not found.</Typography>
        )}
      </Container>
    </ProtectedRoute>
  );
}


