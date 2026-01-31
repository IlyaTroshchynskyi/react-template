import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@shared/components/Layout'
import { LoadingFallback } from '@shared/components'
import { FE_ROUTES } from '@shared/constants'
import { TodosPage } from '@pages/TodosPage'
import { SuspenseExamplePage } from '@pages/SuspenseExamplePage'
import { NotFoundPage } from '@pages/NotFoundPage'

const LazyExamplePage = lazy(() => import('@pages/LazyExamplePage'))

const App = () => (
  <Layout>
    <Routes>
      <Route path={FE_ROUTES.HOME} element={<TodosPage />} />
      <Route path={FE_ROUTES.SUSPENSE_EXAMPLE} element={<SuspenseExamplePage />} />
      <Route
        path={FE_ROUTES.LAZY_EXAMPLE}
        element={
          <Suspense fallback={<LoadingFallback />}>
            <LazyExamplePage />
          </Suspense>
        }
      />
      <Route path={FE_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      <Route path='*' element={<Navigate to={FE_ROUTES.NOT_FOUND} replace />} />
    </Routes>
  </Layout>
)

export default App
