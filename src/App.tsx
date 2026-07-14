import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/identity" element={<IdentityPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/transfer" element={<TransferPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
