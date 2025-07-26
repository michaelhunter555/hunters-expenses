'use client';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

interface JoinAgreement {
  _id: string;
  name: string;
  email: string;
  date: string;
  isLicensed: boolean;
  isOnDemand: boolean;
  isApproved?: boolean;
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'isLicensed', headerName: 'Licensed', flex: 0.5, type: 'boolean' },
  { field: 'isOnDemand', headerName: 'On Demand', flex: 0.5, type: 'boolean' },
  { field: 'isApproved', headerName: 'Approved', flex: 0.5, type: 'boolean' },
  { field: 'date', headerName: 'Date', flex: 1 },
];

export default function ApplicationsTable() {
  const { data = [], isLoading } = useQuery<JoinAgreement[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await axios.get('/api/join-applications');
      return res.data;
    },
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row._id}
        loading={isLoading}
      />
    </div>
  );
}
