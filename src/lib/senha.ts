// Regra única de senha forte, usada no cadastro e na troca de senha.
// Mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo.
export const REGRA_SENHA = 'A senha deve ter pelo menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.';

export function senhaForte(senha: unknown): boolean {
  return (
    typeof senha === 'string' &&
    senha.length >= 8 &&
    /[a-z]/.test(senha) &&
    /[A-Z]/.test(senha) &&
    /[0-9]/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha)
  );
}
