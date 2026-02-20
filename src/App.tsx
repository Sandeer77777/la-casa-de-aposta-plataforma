import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ArbiProPage from './pages/ArbiProPage'
import FreeProPage from './pages/FreeProPage'
import DutchingPage from './pages/DutchingPage'
import DoubleGreenPage from './pages/DoubleGreenPage'
import LacasasLandingPage from './pages/LacasasLandingPage'

function App() {
  return (
    <Routes>
      {/* Rota Principal agora usa o design customizado */}
      <Route path="/" element={<LacasasLandingPage />} />
      
      {/* Rotas de Ferramentas com Layout Padrão */}
      <Route path="/arbipro" element={<Layout><ArbiProPage /></Layout>} />
      <Route path="/freepro" element={<Layout><FreeProPage /></Layout>} />
      <Route path="/dutching" element={<Layout><DutchingPage /></Layout>} />
      <Route path="/double-green" element={<Layout><DoubleGreenPage /></Layout>} />
      
      {/* Navegação Padrão para rotas não encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
