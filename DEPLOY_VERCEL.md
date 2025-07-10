# Deploy no Vercel - KingSystem Frontend

## Método 1: Via GitHub (Recomendado)

### 1. Fazer push para GitHub
```bash
git add .
git commit -m "Deploy frontend para Vercel"
git push origin main
```

### 2. Conectar no Vercel
1. Acesse: https://vercel.com/
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe o repositório do GitHub
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 3. Configurar Environment Variables
No Vercel, vá em Settings → Environment Variables:
- **REACT_APP_API_URL**: `http://kingsystem-backend-env.eba-wz8dhig8.us-east-1.elasticbeanstalk.com`

### 4. Deploy
Clique em "Deploy"

## Método 2: Via Vercel CLI

### 1. Login no Vercel
```bash
npx vercel login
```

### 2. Deploy
```bash
npx vercel --prod
```

## Configurações Importantes

### Environment Variables
- `REACT_APP_API_URL`: URL do backend no Elastic Beanstalk

### Build Settings
- **Framework**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Domínio
Após o deploy, o Vercel fornecerá uma URL como:
`https://kingsystem-frontend.vercel.app`

## Teste
1. Acesse a URL fornecida pelo Vercel
2. Teste o login
3. Verifique se está conectando com o backend 