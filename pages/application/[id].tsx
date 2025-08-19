// src/app/admin/applications/[id]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useApi } from "@/hooks/useHttp";
import useAuth from "@/context/auth-context";

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const user = useAuth()

  const { id } = router.query;
  const { request } = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["applicationDetail", id],
    queryFn: () => request(
        `admin/get-application-by-id?userId=${id}`,
        'GET',
        null,
        { Authorization: `Bearer ${user.jwtToken}`}
    ),
    enabled: !!id && user.hydrated && !!user.jwtToken,
  });


  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const license = data?.licenseInfo;
  const app = data?.application;

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Application Details</Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={1}>
        <Typography><strong>Name:</strong> {app?.name}</Typography>
        <Typography><strong>Email:</strong> {app?.email}</Typography>
        <Typography><strong>Location:</strong> {app?.location}</Typography>
        <Typography><strong>Licensed?</strong> {app?.isLicensed ? "Yes" : "No"}</Typography>
        <Typography><strong>Terms Approved?</strong> {app?.termsApproved ? "Yes" : "No"}</Typography>
      </Stack>

      <Divider sx={{ mt: 3, mb: 2 }} />

      <Typography variant="h6" mb={1}>License Info</Typography>
      {license ? (
        <Stack spacing={1}>
          <Typography>Registration #: {license.registrationNumber}</Typography>
          <Typography>Category: {license.category}</Typography>
          <Typography>City: {license.city}</Typography>
          <Typography>State: {license.state}</Typography>
          <Typography>Expires: {String(license.expiration)}</Typography>
        </Stack>
      ) : (
        <Typography>No license info found</Typography>
      )}

      <Divider sx={{ mt: 3, mb: 2 }} />

      <Typography variant="h6">Government IDs</Typography>
      <Stack direction="row" spacing={2} sx={{ mt:1 }}>
        <img src={data?.idFront} width={200} />
        <img src={data?.idBack} width={200} />
      </Stack>
    </Box>
  );
}
