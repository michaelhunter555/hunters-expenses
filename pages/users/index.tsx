"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Container, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuth from "@/context/auth-context";
import SearchBar from "@/components/Shared/Inputs/SearchBar";
import { useUsers } from "@/hooks/users";
import { useRouter } from "next/router";

export default function UsersPage() {
  const auth = useAuth();
  const router = useRouter();
  const { getUsers } = useUsers();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => getUsers(page, limit, search),
    enabled: auth.hydrated && !!auth.jwtToken,
    placeholderData: (prev) => prev,
  });

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} mb={2} gap={2}>
          <Typography variant="h5">Users</Typography>
          <SearchBar onSearch={(q) => { setPage(1); setSearch(q); }} placeholder="Search users" />
        </Stack>

        {isLoading ? (
          <Typography>Loading…</Typography>
        ) : (data?.users?.length ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Account Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>License</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.users.map((user) => (
                  <TableRow key={user._id || user.email} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1}>
                        {user.image && (
                          <Box
                            component="img"
                            src={user.image}
                            alt={user.name}
                            sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                          />
                        )}
                        <Typography>{user.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.accountType}</TableCell>
                    <TableCell>{user.accountStatus}</TableCell>
                    <TableCell>{user.userLicense ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{user.primaryLocation || user.location}</TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small" onClick={() => router.push(`/users/${(user as any)?._id}`)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Pagination
                page={page}
                count={Math.max(1, Math.ceil((data?.users?.length || 0) / limit))}
                onChange={(_e, value) => setPage(value)}
                shape="rounded"
                color="primary"
              />
            </Box>
          </TableContainer>
        ) : (
          <Typography>No users found.</Typography>
        ))}
      </Container>
    </ProtectedRoute>
  );
}
