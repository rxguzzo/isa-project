# 📱 ISA Sistema PWA - Guia de Deploy e Uso

## 🚀 Deploy no Vercel

### 1. **Preparação**
O projeto já está configurado com PWA e pronto para produção.

### 2. **Deploy no Vercel**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Configurar variáveis de ambiente no dashboard do Vercel:
# - DATABASE_URL
# - JWT_SECRET
# - NEXTAUTH_SECRET
```

### 3. **Configurações importantes no Vercel Dashboard**
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

## 📱 PWA - Progressive Web App

### ✨ Características do PWA
- ✅ **Instalável**: Pode ser adicionado à tela inicial
- ✅ **Offline**: Funciona sem internet (páginas visitadas)
- ✅ **Responsivo**: Adapta-se a qualquer dispositivo
- ✅ **Rápido**: Cache inteligente
- ✅ **Seguro**: HTTPS obrigatório

### 📲 Como instalar no celular

#### **Android (Chrome/Edge/Samsung Internet)**
1. Abra o site no navegador
2. Toque nos 3 pontos (menu)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

#### **iOS (Safari)**
1. Abra o site no Safari
2. Toque no ícone de compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme a instalação

#### **Desktop (Chrome/Edge)**
1. Clique no ícone de instalação na barra de endereços
2. Ou vá em Menu > Instalar ISA Sistema
3. Confirme a instalação

### 🔧 Funcionalidades Offline
- 📄 Páginas visitadas ficam disponíveis offline
- 💾 Cache inteligente de recursos
- 🔄 Sincronização automática quando voltar online
- 📱 Interface nativa no celular

### 🎨 Visual do PWA
- 🎨 **Tema**: Vermelho ISA (#b91c1c)
- 📱 **Nome**: ISA Sistema
- 🏷️ **Nome curto**: ISA
- 📐 **Ícones**: Disponíveis em vários tamanhos

## 🔧 Desenvolvimento

### Testar PWA localmente
```bash
# 1. Build de produção
npm run build

# 2. Start produção
npm start

# 3. Abrir https://localhost:3000
# (PWA só funciona em HTTPS)
```

### 🛠️ Arquivos PWA
- `public/manifest.json` - Configurações do PWA
- `public/sw.js` - Service Worker customizado
- `public/icons/` - Ícones do app
- `src/components/PWAInstallPrompt.tsx` - Prompt de instalação

### 📝 Próximos passos
- [ ] Ícones customizados com logo ISA
- [ ] Notificações push
- [ ] Sincronização em background
- [ ] Modo escuro
- [ ] Splash screen personalizada

## 📊 Performance
- ⚡ **First Load JS**: ~125 kB
- 📱 **Mobile-first**: Design responsivo
- 🚀 **Static Generation**: Páginas pré-renderizadas
- 💨 **Code Splitting**: Carregamento otimizado

## 🔐 Segurança
- 🔒 HTTPS obrigatório
- 🛡️ Middleware de autenticação
- 🔑 JWT tokens seguros
- 📝 Validação de dados

---

**Desenvolvido com ❤️ para ISA - Soluções Administrativas**