import { Link } from 'react-router-dom';
import { SeoHead } from '../components/UI/SeoHead';
import { Button } from '../components/UI/Button';
import { Card, CardTitle, CardContent } from '../components/UI/Card';

export function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <SeoHead title="Page Not Found" description="The requested page could not be found" />
      <Card variant="glass" className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <CardTitle className="text-2xl">Page Not Found</CardTitle>
        <CardContent className="mt-4 space-y-4">
          <p className="text-[#9090b0] text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
