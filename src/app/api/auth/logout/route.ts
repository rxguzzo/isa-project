// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Create a response object first
  const response = NextResponse.json({ success: true, message: 'Logout bem-sucedido' });
  
  // Use the response object to delete the cookie
  response.cookies.delete('auth_token');
  
  return response;
}