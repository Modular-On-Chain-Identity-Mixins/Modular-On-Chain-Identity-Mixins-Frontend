import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { PageErrorBoundary } from './components/UI/PageErrorBoundary';
import { CardSkeleton } from './components/UI/Skeleton';
import { ToastContainer } from './components/UI/Toast';

const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const IdentityPage = lazy(() =>
  import('./pages/IdentityPage').then((m) => ({ default: m.IdentityPage })),
);
const CompliancePage = lazy(() =>
  import('./pages/CompliancePage').then((m) => ({ default: m.CompliancePage })),
);
const TransferPage = lazy(() =>
  import('./pages/TransferPage').then((m) => ({ default: m.TransferPage })),
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageLoader() {
  return (
    <div className="space-y-6 p-4">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<PageErrorBoundary name="Dashboard"><Dashboard /></PageErrorBoundary>} />
              <Route path="/identity" element={<PageErrorBoundary name="Identity"><IdentityPage /></PageErrorBoundary>} />
              <Route path="/compliance" element={<PageErrorBoundary name="Compliance"><CompliancePage /></PageErrorBoundary>} />
              <Route path="/transfer" element={<PageErrorBoundary name="Transfer"><TransferPage /></PageErrorBoundary>} />
              <Route path="/admin" element={<PageErrorBoundary name="Admin"><AdminPage /></PageErrorBoundary>} />
              <Route path="*" element={<PageErrorBoundary name="NotFound"><NotFoundPage /></PageErrorBoundary>} />
            </Routes>
          </Suspense>
        </Layout>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
