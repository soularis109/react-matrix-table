import './App.css'
import { AppProviders } from './app/providers/AppProviders'
import { MatrixPage } from './pages/matrix/ui/MatrixPage'

function App() {
  return (
    <AppProviders>
      <MatrixPage />
    </AppProviders>
  )
}

export default App
