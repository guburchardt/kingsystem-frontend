import React, { useState, useEffect } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface BrazilianTimeInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const BrazilianTimeInput: React.FC<BrazilianTimeInputProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Converte a hora ISO para formato brasileiro para exibição
    if (value) {
      setDisplayValue(value.slice(0, 5)); // Pega apenas HH:mm
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setDisplayValue(inputValue);

    // Valida se o formato está correto (HH:mm)
    const timeRegex = /^(\d{1,2}):(\d{2})$/;
    const match = inputValue.match(timeRegex);

    if (match) {
      const [, hours, minutes] = match;
      const hoursNum = parseInt(hours, 10);
      const minutesNum = parseInt(minutes, 10);

      // Validação de hora
      if (hoursNum >= 0 && hoursNum <= 23 && minutesNum >= 0 && minutesNum <= 59) {
        const isoTime = `${hours.padStart(2, '0')}:${minutes}`;
        onChange(isoTime);
      }
    } else if (inputValue === '') {
      onChange('');
    }
  };

  const handleBlur = () => {
    // Se o valor não estiver no formato correto, limpa o campo
    if (displayValue && !displayValue.match(/^\d{1,2}:\d{2}$/)) {
      setDisplayValue('');
      onChange('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    const key = event.key;
    
    // Permite apenas números e :
    if (!/\d|:/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'Tab') {
      event.preventDefault();
    }

    // Adiciona : automaticamente após as horas
    if (/\d/.test(key)) {
      const currentValue = displayValue;
      if (currentValue.length === 2 && !currentValue.includes(':')) {
        setTimeout(() => {
          setDisplayValue(currentValue + ':' + key);
          event.preventDefault();
        }, 0);
      }
    }
  };

  return (
    <TextField
      {...props}
      label={label}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
      error={error}
      helperText={helperText}
      placeholder="HH:mm"
      inputProps={{
        maxLength: 5,
        ...props.inputProps
      }}
    />
  );
}; 