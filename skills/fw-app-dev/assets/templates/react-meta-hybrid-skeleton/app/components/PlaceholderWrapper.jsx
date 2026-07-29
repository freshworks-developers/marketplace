import { useEffect, useState } from 'react';

export default function PlaceholderWrapper({ children }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (typeof app !== 'undefined') {
      app.initialized().then(setClient);
    }
  }, []);

  if (!client) {
    return <div>Loading...</div>;
  }

  return children;
}
