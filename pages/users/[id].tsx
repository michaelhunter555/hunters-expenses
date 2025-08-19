"use client";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuth from "@/context/auth-context";
import { useUsers } from "@/hooks/users";

export default function UserDetailPage() {
  const auth = useAuth();
  const { getUserById } = useUsers();
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const { data: user, isLoading } = useQuery({
    queryKey: ["userDetail", id],
    queryFn: () => getUserById(String(id)),
    enabled: !!id && auth.hydrated && !!auth.jwtToken,
  });

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {isLoading ? (
          <Typography>Loading…</Typography>
        ) : user ? (
          <Stack gap={2}>
            <Stack direction="row" alignItems="center" gap={2}>
              {user.image && (
                <Box
                  component="img"
                  src={user.image}
                  alt={user.name}
                  sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <Box>
                <Typography variant="h5" fontWeight={600}>{user.name}</Typography>
                <Typography color="text.secondary">{user.email}</Typography>
              </Box>
            </Stack>
            <Divider />
            <Box>
              <Typography><b>Account Type:</b> {user.accountType}</Typography>
              <Typography><b>Status:</b> {user.accountStatus}</Typography>
              <Typography><b>Location:</b> {user.primaryLocation || user.location}</Typography>
              {user.bio && <Typography><b>Bio:</b> {user.bio}</Typography>}
              {user.shopName && <Typography><b>Shop Name:</b> {user.shopName}</Typography>}
              {user.userLicense && (
                <Box mt={1}>
                  <Typography fontWeight={600}>License Information:</Typography>
                  <Typography variant="body2">Name: {user.userLicense.name}</Typography>
                  <Typography variant="body2">City: {user.userLicense.city}</Typography>
                  <Typography variant="body2">State: {user.userLicense.state}</Typography>
                  <Typography variant="body2">Category: {user.userLicense.category}</Typography>
                  <Typography variant="body2">Registration #: {user.userLicense.registrationNumber}</Typography>
                </Box>
              )}
              {user.startingPrice && <Typography><b>Starting Price:</b> ${user.startingPrice}</Typography>}
              {user.avgReviewScore && <Typography><b>Average Rating:</b> {user.avgReviewScore}/5 ({user.totalReviews} reviews)</Typography>}
            </Box>
          </Stack>
        ) : (
          <Typography>User not found.</Typography>
        )}
      </Container>
    </ProtectedRoute>
  );
}
