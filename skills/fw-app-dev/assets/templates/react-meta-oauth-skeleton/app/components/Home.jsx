import { TextButton } from '@freshworks/dew-components';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="app-home">
      <h1>React Meta App</h1>
      <p>DEW components recommended for Freshworks-native UI.</p>
      <Link to="/app/demo">
        <TextButton>View demo page</TextButton>
      </Link>
    </main>
  );
}
