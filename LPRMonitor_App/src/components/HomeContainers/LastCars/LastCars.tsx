import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { fetchLastCars } from './services/LastCarsService';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import useToast from '../../../hooks/useToast';
import { handleUnauthorized } from '../../../utils/authUtils';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';

interface LastCar {
  plate: string;
  description: string;
  time: string;
}

interface LastCarsTableProps {
  updateTrigger?: number;
}

const columns: ColumnDef<LastCar>[] = [
  {
    header: 'Placa',
    accessorKey: 'plate',
  },
  {
    header: 'Hora da Detecção',
    accessorKey: 'time',
  },
  {
    header: 'Descrição',
    accessorKey: 'description',
  },
];

const LastCarsTable: React.FC<LastCarsTableProps> = ({ updateTrigger }) => {
  const [data, setData] = useState<LastCar[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchLastCars();
        const transformed = result.plates.map((item: any) => ({
          plate: item.license_plate,
          time: new Date(item.created_at).toLocaleString('pt-BR', {
            hour12: false,
          }),
          description: item.description,
        }));
        setData(transformed);
      } catch (error) {
        if (
          error instanceof Error &&
          (error as any).response &&
          (error as any).response.status === 401
        ) {
          handleUnauthorized(error, navigate);
        }
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateTrigger]);

  const table = useReactTable({
    data: data.length > 0 ? data : [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="absolute right-0 w-5/12 h-full bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="p-4 border-b bg-[#272932] text-center">
        <h2 className="text-lg font-semibold text-white">Últimos Carros</h2>
      </div>
      <div className="h-full overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <table className="w-full table-auto" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-[#272932] sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className="text-center px-4 py-3 border-b font-semibold text-white cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <span>
                            {isSorted === 'asc' ? (
                              <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                            ) : isSorted === 'desc' ? (
                              <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <SwapVertIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                            )}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100 hover:bg-gray-100'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="text-center px-4 py-2 border-b text-gray-800"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LastCarsTable;