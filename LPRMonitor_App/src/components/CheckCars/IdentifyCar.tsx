import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import ProtectedLayout from '../ProtectedLayout';
import { useAuth } from '../../contexts/AuthContext';

const statusOptions = [
  { value: 'student', label: 'Aluno' },
  { value: 'familiars', label: 'Parente' },
  { value: 'professor', label: 'Professor' },
  { value: 'banned', label: 'Perigo' },
];

const IdentifyCar: React.FC = () => {
  const [plateName, setPlateName] = useState('');
  const [status, setStatus] = useState('');
  const [expireDate, setExpireDate] = useState<Dayjs | null>(null);
  const [extraInfo, setExtraInfo] = useState('');
  const [justification, setJustification] = useState('');

  const { logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      plateName,
      status,
      expireDate: expireDate?.format('DD/MM/YYYY'),
      extraInfo: (status === 'student' || status === 'familiars') ? extraInfo : null,
      justification,
    });
  };

  return (
    <ProtectedLayout onLogout={logout}>
      <form
        onSubmit={handleSubmit}
        className="w-auto mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Identificar Veículo Não Autorizado</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Plate Name *</label>
          <input
            type="text"
            value={plateName}
            onChange={(e) => setPlateName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#272932]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#272932]"
          >
            <option value="">Select status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {(status === 'student' || status === 'familiars') && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Extra Info *</label>
            <input
              type="text"
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#272932]"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Expire Date *</label>
          <DatePicker
            value={expireDate}
            onChange={setExpireDate}
            format="DD/MM/YYYY"
            disablePast
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              } as any,
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Justification *</label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#272932]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#272932] hover:bg-[#5c6176] text-white py-2 rounded-md transition duration-200"
        >
          Submit
        </button>
      </form>
    </ProtectedLayout>
  );
};

export default IdentifyCar;