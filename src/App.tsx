import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './shared/components/Layout'
import { TodosPage } from './pages/TodosPage'
import { SuspenseExamplePage } from './pages/SuspenseExamplePage'
import { FE_ROUTES } from './shared/constants'

const App = () => (
  <Layout>
    <Routes>
      <Route path={FE_ROUTES.HOME} element={<TodosPage />} />
      <Route path={FE_ROUTES.SUSPENSE_EXAMPLE} element={<SuspenseExamplePage />} />
      <Route path='*' element={<Navigate to={FE_ROUTES.HOME} replace />} />
    </Routes>
  </Layout>
)

export default App
