module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    // Desabilitar regras que estão causando warnings
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-anonymous-default-export': 'warn',
  },
  // Configurar para não falhar em warnings
  ignorePatterns: ['build/**/*', 'dist/**/*'],
}; 