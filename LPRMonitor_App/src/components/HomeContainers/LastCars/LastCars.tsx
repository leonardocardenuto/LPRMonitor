import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import { fetchLastCars } from './services/LastCarsService';
import CircularProgress from '@mui/material/CircularProgress';

interface LastCar {
    plate: string;
    description: string;
    time: string;
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
    

const LastCarsTable: React.FC = () => {
    const [data, setData] = useState<LastCar[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchLastCars();
                const transformed = result.plates.map((item: any) => ({
                    plate: item.license_plate,
                    time: new Date(item.created_at).toLocaleString("pt-BR", { timeZone: "UTC", hour12: false }), 
                    description: item.description, 
                }));
                setData(transformed);
            } catch (error) {
                console.error('Error fetching last cars:', error);
                setData([]); 
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, []);
    
    const table = useReactTable({
        data: data.length > 0 ? data : [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

  return (
    <div className="absolute top-0 right-0 w-5/12 h-1/2 bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="p-4 border-b bg-gray-100 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Últimos Carros</h2>
      </div>
      <div className="h-full overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <table className="w-full table-auto" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const isSorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className="text-center px-4 py-3 border-b font-semibold text-gray-700 cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="ml-1 text-xs">
                          {isSorted === 'asc' ? '↑' : isSorted === 'desc' ? '↓' : ''}
                        </span>
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
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                >
                  {row.getVisibleCells().map(cell => (
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
}

export default LastCarsTable;