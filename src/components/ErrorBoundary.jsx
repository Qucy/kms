import * as React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      isError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    const { isError, error } = this.state;

    if (isError) {
      return <ErrorFallback error={error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }) => (
  <div>
    <p>Something went wrong</p>
    {error.message && <span>Here's the error: {error.message}</span>}
  </div>
);

const ErrorBoundaryWrapper = (WrappedComponent) => {
  return class extends ErrorBoundary {
    render() {
      const { isError, error } = this.state;

      if (isError) {
        // You can render any custom fallback UI
        return <ErrorFallback error={error} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export { ErrorBoundaryWrapper };
