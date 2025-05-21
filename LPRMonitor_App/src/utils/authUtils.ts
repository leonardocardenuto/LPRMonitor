import { toast } from 'react-toastify';

let sessionExpiredHandled = false;

export function resetSessionExpiredFlag() {
  sessionExpiredHandled = false;
}

export function handleUnauthorized(error: any, navigate: any) {
  if (
    !sessionExpiredHandled &&
    error?.response?.status === 401
  ) {
    sessionExpiredHandled = true;
    localStorage.removeItem('token');
    toast.error('Sessão expirada. Faça login novamente.');
    navigate('/login', { replace: true });
  }
}
