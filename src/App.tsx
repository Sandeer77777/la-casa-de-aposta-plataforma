
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ArbiProPage from './pages/ArbiProPage'
import FreeProPage from './pages/FreeProPage'
import DutchingPage from './pages/DutchingPage'
import RegulatedHousesPage from './pages/RegulatedHousesPage'
import DoubleGreenPage from './pages/DoubleGreenPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/arbipro" replace />} />
        <Route path="/arbipro" element={<ArbiProPage />} />
        <Route path="/freepro" element={<FreeProPage />} />
        <Route path="/dutching" element={<DutchingPage />} />
        <Route path="/double-green" element={<DoubleGreenPage />} />
        <Route path="/casas-regulamentadas" element={<RegulatedHousesPage />} />
      </Routes>
    </Layout>
  )
}

export default App
