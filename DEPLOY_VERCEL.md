# 🚀 Guia de Deploy HTTPS no Vercel

## 📋 Pré-requisitos

1. ✅ Backend deployado com HTTPS na AWS
2. ✅ Conta no Vercel configurada
3. ✅ Projeto conectado ao repositório

## 🔧 Configuração das Variáveis de Ambiente

### 1. Acesse o Dashboard do Vercel
- Vá para [vercel.com](https://vercel.com)
- Acesse seu projeto `kingsystem-frontend`

### 2. Configure as Variáveis de Ambiente

Vá em **Settings** → **Environment Variables** e adicione:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `REACT_APP_API_URL` | `https://kingsystem-backend-env.eba-wz8dhig8.us-east-1.elasticbeanstalk.com` | Production, Preview, Development |

**⚠️ IMPORTANTE:**
- **NÃO** use `@https://...` - remova o `@`
- Use **HTTPS** em vez de HTTP
- Marque todos os ambientes (Production, Preview, Development)

### 3. Verificar Configuração

Após configurar, faça um novo deploy:

```bash
# No diretório frontend
npm run build
```

## 🔍 Teste de Configuração

### 1. Verificar se o Backend HTTPS está funcionando:

```bash
# No diretório raiz
node check-https-status.js
```

### 2. Testar no Browser:

Abra o console do navegador e execute:

```javascript
fetch('https://kingsystem-backend-env.eba-wz8dhig8.us-east-1.elasticbeanstalk.com/health')
  .then(response => response.json())
  .then(data => console.log('✅ Backend funcionando:', data))
  .catch(error => console.error('❌ Erro:', error));
```

## 🛠️ Solução de Problemas

### Erro de CORS:
Se aparecer erro de CORS, verifique:

1. **URL correta no Vercel:**
   - Deve ser `https://kingsystem-backend-env.eba-wz8dhig8.us-east-1.elasticbeanstalk.com`
   - **NÃO** `@https://...`

2. **Backend com HTTPS:**
   - Execute: `./deploy-https-final.sh`

3. **Configuração de CORS no Backend:**
   - Já está configurado para aceitar domínios do Vercel

### Erro "Failed to fetch":
1. Verifique se o backend está rodando
2. Teste a URL diretamente no browser
3. Verifique as variáveis de ambiente no Vercel

## 📱 URLs de Teste

### Frontend (Vercel):
- https://kingsystem-frontend.vercel.app
- https://kingsystem-frontend-gustavo-burchardts-projects.vercel.app

### Backend (AWS):
- https://kingsystem-backend-env.eba-wz8dhig8.us-east-1.elasticbeanstalk.com

## 🔄 Processo de Deploy

### 1. Deploy do Backend (AWS):
```bash
./deploy-https-final.sh
```

### 2. Deploy do Frontend (Vercel):
```bash
cd frontend
npm run build
# O Vercel fará deploy automaticamente
```

### 3. Verificar:
```bash
node check-https-status.js
```

## 📞 Suporte

Se ainda houver problemas:

1. Verifique os logs do Vercel
2. Teste o backend diretamente
3. Verifique as variáveis de ambiente
4. Execute o script de verificação HTTPS 