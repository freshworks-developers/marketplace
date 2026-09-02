import { Badge } from '@freshworks/dew-components';
import { Link } from 'react-router-dom';

export default function DemoPage() {
  return (
    <main className="app-demo">
      <Badge variant="success">Demo route</Badge>
      <p>Feature routes use the /app/... prefix per Meta framework conventions.</p>
      <Link to="/">Back home</Link>
    </main>
  );
}
