import React, { useState, useEffect } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { formatDateBR, parseDateBR } from '../../utils/dateUtils';

interface BrazilianDateInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const BrazilianDateInput: React.FC<BrazilianDateInputProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Converte a data ISO para formato brasileiro para exibição
    if (value) {
      const formatted = formatDateBR(value);
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    
    // Remove caracteres não numéricos e não-barras
    inputValue = inputValue.replace(/[^\d/]/g, '');
    
    // Adiciona barras automaticamente
    if (inputValue.length >= 2 && inputValue.indexOf('/') === -1) {
      inputValue = inputValue.substring(0, 2) + '/' + inputValue.substring(2);
    }
    if (inputValue.length >= 5 && inputValue.indexOf('/', 3) === -1) {
      inputValue = inputValue.substring(0, 5) + '/' + inputValue.substring(5);
    }
    
    // Limita o tamanho máximo
    if (inputValue.length > 10) {
      inputValue = inputValue.substring(0, 10);
    }
    
    setDisplayValue(inputValue);

    // Valida se o formato está correto (dd/mm/yyyy)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = inputValue.match(dateRegex);

    if (match) {
      const [, day, month, year] = match;
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      // Validação básica de data
      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
        const isoDate = parseDateBR(inputValue);
        if (isoDate) {
        onChange(isoDate);
        }
      }
    } else if (inputValue === '') {
      onChange('');
    }
  };

  const handleBlur = () => {
    // Se o valor não estiver no formato correto, limpa o campo
    if (displayValue && !displayValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      setDisplayValue('');
      onChange('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key;
    const currentValue = displayValue;
    
    // Permite teclas de navegação e controle
    if (['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      return;
    }
    
    // Permite apenas números
    if (!/\d/.test(key)) {
      event.preventDefault();
      return;
    }

    // Previne entrada além do limite
    if (currentValue.length >= 10) {
          event.preventDefault();
    }
  };

  return (
    <TextField
      {...props}
      label={label}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      error={error}
      helperText={helperText || "Formato: dd/mm/aaaa"}
      placeholder="dd/mm/aaaa"
      inputProps={{
        maxLength: 10,
        ...props.inputProps
      }}
    />
  );
}; 