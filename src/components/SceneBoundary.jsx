import { Component } from 'react';

/**
 * WebGL is not guaranteed. If the context fails to come up, the section falls
 * back to a readable message and the repository link rather than a blank box.
 */
export default class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
