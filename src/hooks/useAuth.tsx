// src/hooks/useAuth.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('isa-token');
    if (!token) {
      router.push('/login');
    } else {
      // Aqui você poderia adicionar uma verificação extra para ver se o token é válido
      // Ex: decodificar o token e checar a data de expiração.
      setIsAuth(true);
    }
  }, [router]);

  return isAuth;
}