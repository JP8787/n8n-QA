import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import Comparison from './components/Comparison';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import MatrixStandard from './components/MatrixStandard';
import InteractiveTestSection from './components/InteractiveTestSection';
import TechStack from './components/TechStack';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';
import LiveSheetModal from './components/LiveSheetModal';

function App() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenDemo = () => setIsDemoOpen(true);
  const handleCloseDemo = () => setIsDemoOpen(false);

  const handleOpenSheet = () => setIsSheetOpen(true);
  const handleCloseSheet = () => setIsSheetOpen(false);

  const handleScrollToTest = () => {
    const el = document.getElementById('como-probarlo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-app">
      {/* Barra de Navegación Flotante */}
      <Navbar 
        onOpenDemo={handleOpenDemo} 
        onOpenSheet={handleOpenSheet} 
      />

      <main>
        {/* 1. Hero Section (Encabezado Principal) */}
        <Hero 
          onOpenDemo={handleOpenDemo} 
          onOpenSheet={handleOpenSheet}
          onScrollToTest={handleScrollToTest}
        />

        {/* Barra de Tecnologías y Conectores */}
        <TrustBar />

        {/* 2. El Problema vs. La Solución */}
        <Comparison />

        {/* 3. Arquitectura del Flujo (Pipeline Técnico n8n) */}
        <ArchitecturePipeline />

        {/* 4. Estándar de la Matriz QA Generada (11 Columnas Oficiales) */}
        <MatrixStandard />

        {/* 5. Sección Interactiva: ¿Cómo Probarlo? con Simulador Google Sheets */}
        <InteractiveTestSection onOpenSheet={handleOpenSheet} />

        {/* 6. Stack Tecnológico Utilizado */}
        <TechStack />

        {/* Testimonios y Validación de Liderazgo */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer 
        onOpenDemo={handleOpenDemo} 
        onOpenSheet={handleOpenSheet} 
      />

      {/* Modales */}
      <DemoModal 
        isOpen={isDemoOpen} 
        onClose={handleCloseDemo} 
      />
      
      <LiveSheetModal 
        isOpen={isSheetOpen} 
        onClose={handleCloseSheet} 
      />
    </div>
  );
}

export default App;
