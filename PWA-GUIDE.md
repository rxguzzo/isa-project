# PWA - Progressive Web App

## ISA Sistema PWA

O ISA Sistema agora funciona como um Progressive Web App (PWA), permitindo que seja instalado e usado como um aplicativo nativo em dispositivos móveis e desktop.

### Funcionalidades PWA Implementadas:

#### ✅ **Instalação**
- Prompt automático de instalação em dispositivos compatíveis
- Ícones customizados para diferentes tamanhos de tela
- Instalação via menu do navegador

#### ✅ **Offline**
- Cache inteligente das páginas principais
- Funciona parcialmente sem conexão
- Service Worker para gerenciamento de cache

#### ✅ **Mobile-Friendly**
- Interface responsiva otimizada para mobile
- Meta tags para dispositivos Apple
- Configuração para Android/Chrome

#### ✅ **Performance**
- Carregamento rápido após instalação
- Cache de recursos estáticos
- Estratégia NetworkFirst para APIs

### Como Instalar:

#### **No Android (Chrome):**
1. Abra o site no Chrome
2. Toque no menu (⋮) → "Adicionar à tela inicial"
3. Ou aguarde o prompt automático de instalação

#### **No iOS (Safari):**
1. Abra o site no Safari
2. Toque no botão "Compartilhar" (□↑)
3. Selecione "Adicionar à Tela de Início"

#### **No Desktop (Chrome/Edge):**
1. Clique no ícone de instalação na barra de endereços
2. Ou vá em Menu → "Instalar ISA Sistema"

### Arquivos PWA:

- `public/manifest.json` - Configurações do app
- `public/sw.js` - Service Worker (cache)
- `public/icons/` - Ícones para diferentes tamanhos
- `src/components/PWAInstallPrompt.tsx` - Prompt de instalação
- `next.config.ts` - Configuração PWA com next-pwa

### Configuração Vercel:

O PWA está configurado para funcionar perfeitamente no Vercel. Os service workers e manifest serão automaticamente servidos.

### Cache Strategy:

- **NetworkFirst**: Tenta buscar da rede primeiro, depois do cache
- **Páginas estáticas**: Cached após primeira visita
- **APIs**: Cache com fallback para dados offline
- **Recursos**: CSS, JS, imagens cachados automaticamente

### Benefícios:

1. **Acesso Rápido**: Ícone na tela inicial
2. **Performance**: Carregamento instantâneo após cache
3. **Experiência**: Interface como app nativo
4. **Offline**: Funcionalidade básica sem internet
5. **Engajamento**: Notificações push (pode ser implementado)

O PWA melhora significativamente a experiência do usuário, especialmente em dispositivos móveis! 📱✨