import React from 'react';

const TestStyles = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Teste de Estilos Tailwind
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Card Branco</h2>
            <p className="text-gray-600">Este é um card com fundo branco e sombra.</p>
            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              Botão Roxo
            </button>
          </div>
          
          {/* Card 2 */}
          <div className="bg-purple-600 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Card Roxo</h2>
            <p className="text-purple-100">Este é um card com fundo roxo.</p>
            <button className="mt-4 bg-white hover:bg-gray-100 text-purple-600 px-4 py-2 rounded">
              Botão Branco
            </button>
          </div>
          
          {/* Card 3 */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Card Gradiente</h2>
            <p className="text-pink-100">Este é um card com gradiente rosa para roxo.</p>
            <button className="mt-4 bg-white hover:bg-gray-100 text-purple-600 px-4 py-2 rounded">
              Botão Gradiente
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-white hover:text-purple-300 underline">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestStyles; 