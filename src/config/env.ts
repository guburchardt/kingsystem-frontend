// Debug para verificar variáveis de ambiente
console.log('🔍 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export const config = {
  API_URL: (process.env.REACT_APP_API_URL || 'http://kingsystem-backend-env.eba-wz8dhig8.us-east-1.elasticbeanstalk.com').replace('https://', 'http://'),
};

console.log('🔍 Config API_URL:', config.API_URL); 