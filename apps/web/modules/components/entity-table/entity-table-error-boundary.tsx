import { Component, ReactNode } from 'react';
import { Text } from '~/modules/design-system/text';

interface State {
  hasError: boolean;
}

interface Props {
  typeId: string;
  spaceId: string;
  children: ReactNode;
}

export class EntityTableErrorBoundary extends Component<Props, State> {
  private typeId: string;
  private spaceId: string;

  constructor({ typeId, spaceId, children }: Props) {
    super({ typeId, spaceId, children });
    this.typeId = typeId;
    this.spaceId = spaceId;
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(
      `Error in EntityTableErrorBoundary in space: ${this.spaceId}, typeId: ${this.typeId}`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return <Text variant="mediumTitle">Something went wrong. Try freshing the page.</Text>;
    }

    return this.props.children;
  }
}