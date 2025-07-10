// Debug para verificar variáveis de ambiente
console.log('🔍 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Função para normalizar URL da API
function normalizeApiUrl(url: string): string {
  // Se a URL não tem protocolo, adiciona HTTP
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  
  // Para o backend atual, sempre usar HTTP
  return url.replace('https://', 'http://');
}

export const config = {
  API_URL: normalizeApiUrl(process.env.REACT_APP_API_URL || 'kingsystem-backend-env.eba-wz8dhig8.us-east-1.elasticbeanstalk.com'),
};

console.log('🔍 Config API_URL:', config.API_URL); 