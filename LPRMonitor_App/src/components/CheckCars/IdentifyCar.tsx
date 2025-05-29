import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import ProtectedLayout from '../ProtectedLayout';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { fetchUnverifiedPlates } from './fetchIdentifyCars';
import { postIdentifyCar } from './services/IdentifyCarService';
import useToast from '../../hooks/useToast';
import { Button, CircularProgress } from '@mui/material';
import { handleUnauthorized } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  { value: 'student', label: 'Aluno' },
  { value: 'familiars', label: 'Parente' },
  { value: 'professor', label: 'Professor' },
  { value: 'banned', label: 'Perigo' },
];

const IdentifyCar: React.FC = () => {
  const [plateName, setPlateName] = useState('');
  const [availablePlates, setPlates] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [expireDate, setExpireDate] = useState<Dayjs | null>(null);
  const [extraInfo, setExtraInfo] = useState('');
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast(); 
  const navigate = useNavigate();
  
  const { logout } = useAuth();

    useEffect(() => {
      async function loadPlates() {
        try {
          const data = await fetchUnverifiedPlates();
          if (data && data.plates) {
            setPlates(data.plates);
          }
        } catch (error: any) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
            handleUnauthorized(error, navigate);
          }
        }
      }
      loadPlates();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
      setLoading(true);
      e.preventDefault();
    
      try {
        const payload = {
          license_plate: plateName,
          status,
          extra_info: (status === 'student' || status === 'familiars') ? extraInfo : null,
          expire_date: expireDate?.format('YYYY-MM-DD') || '', 
          justification,
        };
    
        await postIdentifyCar(payload);
        
        toast.success('Autorização gerada com sucesso!');
        setPlateName('');
        setStatus('');
        setExpireDate(null);
        setExtraInfo('');
        setJustification('');
        setLoading(false);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          handleUnauthorized(error, navigate);
        }
        toast.error('Erro ao identificar veículo.');
        setLoading(false);
      }
    };

  return (
    <ProtectedLayout onLogout={logout}>
      <form
        onSubmit={handleSubmit}
        className="w-auto mx-auto mt-10 p-6 rounded-2xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Identificar Veículo Não Autorizado</h2>

        <div className="mb-4 shadow-md bg-white rounded-md p-4">
          <label className="block text-gray-700 mb-1">Plate Name *</label>
          <select
            value={plateName}
            onChange={(e) => setPlateName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#272932]"
          >
            <option value="">Selecione uma placa</option>
            {availablePlates.map((plate, index) => (
              <option key={index} value={plate}>
                {plate}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 shadow-md bg-white rounded-md p-4">
          <label className="block text-gray-700 mb-1">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#272932]"
          >
            <option value="">Selecione o status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {(status === 'student' || status === 'familiars') && (
          <div className="mb-4 shadow-md bg-white rounded-md p-4">
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

        <div className="mb-4 shadow-md bg-white rounded-md p-4">
          <label className="block text-gray-700 mb-1 ">Expire Date *</label>
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

        <div className="mb-4 shadow-md bg-white rounded-md p-4">
          <label className="block text-gray-700 mb-1">Justification *</label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#272932]"
          />
        </div>

        <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: '#1e40af',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#1e3a8a' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Autorização'}
        </Button>
      </form>
    </ProtectedLayout>
  );
};

export default IdentifyCar;
