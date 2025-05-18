import { useTheme } from '@mui/material';
import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useToast = () => {
  const theme = useTheme();

  const baseOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    style: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      borderRadius: 8,
    },
  };

  return {
    success: (msg: string, options?: ToastOptions) => toast.success(msg, { ...baseOptions, ...options }),
    error: (msg: string, options?: ToastOptions) => toast.error(msg, { ...baseOptions, ...options }),
    info: (msg: string, options?: ToastOptions) => toast.info(msg, { ...baseOptions, ...options }),
    warn: (msg: string, options?: ToastOptions) => toast.warn(msg, { ...baseOptions, ...options }),
  };
};

export default useToast;