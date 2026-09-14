import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import Comparison from './components/Comparison';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import MatrixStandard from './components/MatrixStandard';
import InteractiveTestSection from './components/InteractiveTestSection';
import TechStack from './components/TechStack';
import Footer from './components/Footer';

function App() {
  const [generatedCases, setGeneratedCases] = React.useState(null);
  const [generatedModule, setGeneratedModule] = React.useState('');

  const handleScrollToTest = () => {
    const el = document.getElementById('como-probarlo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToMatrix = () => {
    const el = document.getElementById('estandar-11-col');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCasesGenerated = (cases, moduleName) => {
    setGeneratedCases(cases);
    if (moduleName) setGeneratedModule(moduleName);
  };

  const handleResetToSample = () => {
    setGeneratedCases(null);
    setGeneratedModule('');
  };

  return (
    <div className="landing-app">
      {/* Barra de Navegación */}
      <Navbar onScrollToTest={handleScrollToTest} />

      <main>
        {/* 1. Hero Section */}
        <Hero onScrollToTest={handleScrollToTest} />

        {/* Ecosistema de Automatización Integrado */}
        <TrustBar />

        {/* 2. El Problema vs. La Solución */}
        <Comparison />

        {/* 3. Arquitectura del Flujo (Pipeline en n8n) */}
        <ArchitecturePipeline />

        {/* 4. Estándar de la Matriz QA Generada (11 Columnas Oficiales) */}
        <MatrixStandard 
          externalCases={generatedCases}
          moduleName={generatedModule}
          onResetSample={handleResetToSample}
        />

        {/* 5. Sección Interactiva: Envío Real al Webhook de n8n */}
        <InteractiveTestSection 
          onCasesGenerated={handleCasesGenerated}
          onScrollToMatrix={handleScrollToMatrix}
        />

        {/* 6. Stack Tecnológico Utilizado */}
        <TechStack />
      </main>

      {/* Footer */}
      <Footer onScrollToTest={handleScrollToTest} />
    </div>
  );
}

export default App;
