import { Component, type ReactNode } from 'react';

/** If WebGL/3D crashes at any point we hand control back to the classic portfolio. */
export class ErrorBoundary extends Component<{ children: ReactNode; onError: (e: Error) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) {
    console.error('[ocean] 3D scene failed, falling back to classic view:', error);
    this.props.onError(error);
  }
  render() { return this.state.failed ? null : this.props.children; }
}
