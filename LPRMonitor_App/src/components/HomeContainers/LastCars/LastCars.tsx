import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { fetchLastCars, listAllCameras, fetchRegiteredCars } from './services/LastCarsService';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import useToast from '../../../hooks/useToast';
import { handleUnauthorized } from '../../../utils/authUtils';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';

interface LastCar {
  plate: string;
  last_seen: string;
  time: string;
  autorized: string;
}

interface LastCarsTableProps {
  updateTrigger?: number;
}

const columns: ColumnDef<LastCar>[] = [
  {
    header: 'Autorizado',
    accessorKey: 'autorized',
  },
  {
    header: 'Placa',
    accessorKey: 'plate',
  },
  {
    header: 'Data de Entrada',
    accessorKey: 'time',
  },
  {
    header: 'Visto Pela Última vez',
    accessorKey: 'last_seen',
  },
];

const LastCarsTable: React.FC<LastCarsTableProps> = ({ updateTrigger }) => {
  const [data, setData] = useState<LastCar[]>([]);
  const [oldData, setOldData] = useState<LastCar[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result_plates = await fetchLastCars();
        const result_cameras = await listAllCameras();
        const result_registered_cars = await fetchRegiteredCars();

        const cameraMap = new Map<number, string>(
          result_cameras.cameras.map((camera: any) => [camera.id, camera.place])
        );

        const transformed = result_plates.plates.map((item: any) => ({
          plate: item.license_plate,
          time: new Date(item.created_at).toLocaleString('pt-BR', { hour12: false }),
          last_seen: cameraMap.get(item.last_seen_in) || 'Local desconhecido',
          autorized: result_registered_cars.plates.includes(item.license_plate) ? '✅' : '❌',
        }));

        const oldPlates = new Set(oldData.map(car => car.plate));
        const newPlates = new Set(transformed.map((car: { plate: any; }) => car.plate));
        const removed = [...oldPlates].filter(plate => !newPlates.has(plate));

        if (removed.length > 0) {
          removed.forEach(plate => {
            toast.info(`Carro ${plate} saiu do monitoramento`);
          });
        }

        setOldData(transformed);
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