import { Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

class RootErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <strong>App error:</strong> {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export function mountApp() {
  createRoot(document.getElementById('root')).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}
