import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
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

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <svg className="animate-spin h-8 w-8 text-[#6c5ce7]" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
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
            </Routes>
          </Suspense>
        </Layout>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
