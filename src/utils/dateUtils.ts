// Utilitários para formatação de datas e horários no formato brasileiro

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 */
export const formatDateBR = (date: string | Date): string => {
  if (!date) return '';
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // Se for uma string ISO completa (YYYY-MM-DDTHH:mm:ss.sssZ) ou simples (YYYY-MM-DD)
    if (date.includes('-')) {
      // Remove a parte de tempo se existir (T e depois)
      const datePart = date.includes('T') ? date.split('T')[0] : date;
      const [year, month, day] = datePart.split('-');
      
      // Cria data local (sem conversão de timezone)
      dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }
  
  // Garante que a data seja tratada como local, não UTC
  const localDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  return localDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy) - alias para formatDateBR
 */
export const formatDate = (date: string | Date): string => {
  return formatDateBR(date);
};

/**
 * Formata um horário para o formato brasileiro (HH:mm)
 */
export const formatTimeBR = (time: string): string => {
  if (!time) return '';
  return time;
};

/**
 * Converte uma data do formato brasileiro (dd/mm/yyyy) para ISO
 */
export const parseDateBR = (dateStr: string): string => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('/');
  
  // Validação dos valores
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Garante que os valores são válidos
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
    return '';
  }
  
  // Formata diretamente como YYYY-MM-DD sem usar Date para evitar timezone
  const yearStr = yearNum.toString();
  const monthStr = monthNum.toString().padStart(2, '0');
  const dayStr = dayNum.toString().padStart(2, '0');
  
  return `${yearStr}-${monthStr}-${dayStr}`;
};

/**
 * Formata uma data e hora para o formato brasileiro
 */
export const formatDateTimeBR = (dateTime: string | Date): string => {
  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Obtém o dia da semana em português
 */
export const getDayOfWeekBR = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[dateObj.getDay()];
};

/**
 * Formata um valor monetário para o formato brasileiro
 */
export const formatCurrencyBR = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}; 

/**
 * Formata um valor monetário para o formato brasileiro - alias para formatCurrencyBR
 */
export const formatCurrency = (value: number): string => {
  return formatCurrencyBR(value);
}; 