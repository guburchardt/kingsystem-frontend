// Debug para verificar variáveis de ambiente
console.log('🔍 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Função para normalizar URL da API
function normalizeApiUrl(url: string): string {
  // Se não tem protocolo, adiciona HTTP para desenvolvimento
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (process.env.NODE_ENV === 'production') {
    url = 'https://' + url;
    } else {
      url = 'http://' + url;
    }
  }
  // Para produção, sempre usar HTTPS
  if (process.env.NODE_ENV === 'production') {
    return url.replace('http://', 'https://');
  }
  return url;
}

export const config = {
  API_URL: normalizeApiUrl(process.env.REACT_APP_API_URL || 'kingbackend.us-east-1.elasticbeanstalk.com'),
};

console.log('🔍 Config API_URL:', config.API_URL); 