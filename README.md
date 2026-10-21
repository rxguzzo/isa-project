# 📘 ISA — Sistema de Gestão de Empresas e Demandas

> Projeto de conclusão do curso Técnico em Desenvolvimento de Sistemas (SENAI).
> 🔗 **Demo:** https://isa-project-eight.vercel.app

ISA é uma plataforma web voltada para consultores e gestores que precisam acompanhar múltiplas empresas, registrar demandas, editar informações e manter seus dados atualizados com segurança e eficiência.

---

## 🚀 Funcionalidades

- **Dashboard de Empresas**
  - Listagem de empresas vinculadas ao usuário
  - Adição de novas empresas com CNPJ

- **Formulário de Nova Demanda**
  - Registro completo de problemas e necessidades
  - Validação de campos obrigatórios
  - Redirecionamento automático após envio

- **Configurações da Empresa**
  - Edição de dados cadastrais
  - Máscara automática para CNPJ
  - Feedback visual de salvamento

- **Perfil do Usuário**
  - Visualização dos dados pessoais
  - Edição de nome, e-mail e senha
  - Validação de senha segura:
    - Mínimo 8 caracteres
    - Letra maiúscula, minúscula, número e símbolo
    - Confirmação obrigatória

---

## 🛠️ Tecnologias Utilizadas

- ⚛️ [Next.js](https://nextjs.org/) — Framework React com suporte a App Router
- 🟦 [TypeScript](https://www.typescriptlang.org/) — Tipagem estática para JavaScript
- 🧬 [Prisma ORM](https://www.prisma.io/) — ORM moderno para bancos relacionais
- 🐘 [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional robusto
- 🎨 [Tailwind CSS](https://tailwindcss.com/) — Framework de estilos utilitários
- 💠 [Lucide Icons](https://lucide.dev/) — Biblioteca de ícones SVG open-source
- 🔁 React Hooks — Gerenciamento de estado e efeitos no React
- 🔐 JWT (`jose` / `jsonwebtoken`) + `bcryptjs` — autenticação e hash de senhas
- 📱 `next-pwa` — instalação como aplicativo

---

## 🔐 Segurança

- Senhas guardadas com hash **bcrypt**; nunca retornadas pela API.
- Sessão em cookie **httpOnly** com JWT assinado e expiração; `secure` em produção.
- Middleware valida o token em todas as rotas protegidas: páginas redirecionam para o login e rotas de API respondem **401/403 em JSON**.
- Cada usuário só acessa as próprias empresas e demandas (checagem de dono em todas as rotas).
- Edição de empresa aceita apenas uma **lista fixa de campos** (o CNPJ e o dono não podem ser alterados).
- Regra de senha forte validada no **backend**, não só no formulário.

---

## ▶️ Como rodar localmente

Pré-requisitos: Node.js 18+ e Docker.

```bash
# 1. Instalar as dependências
npm install

# 2. Criar o arquivo de ambiente e ajustar os valores
cp .env.example .env

# 3. Subir o PostgreSQL local
docker compose up -d

# 4. Criar as tabelas e o usuário administrador
npx prisma migrate dev
npx prisma db seed

# 5. Rodar o projeto
npm run dev
```

Acesse http://localhost:3000.

### Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `DATABASE_URL` | Conexão com o PostgreSQL |
| `JWT_SECRET` | Segredo usado para assinar os tokens |
| `ADMIN_EMAIL` | E-mail do administrador criado pelo seed |
| `ADMIN_PASSWORD` | Senha do administrador (mínimo 12 caracteres) |

---

## 🗺️ Próximos passos

- Testes automatizados das rotas de API
- Validação de entrada com schema (ex.: Zod)
- Invalidação de sessão no logout e na troca de perfil


