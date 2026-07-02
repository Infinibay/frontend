import { useRouter } from 'next/navigation';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  Container,
  EmptyState,
  ResponsiveStack,
} from '@infinibay/harbor';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-error-state');

const ErrorState = ({ error, vmId, onRetry }) => {
  const router = useRouter();
  debug.error('VM Error State rendered', { error, vmId });

  const getErrorInfo = () => {
    if (!error) {
      return {
        title: 'Desktop not found',
        message:
          'The requested desktop does not exist or you do not have permissions to access it.',
        canRetry: false,
        isNotFound: true,
      };
    }
    // Apollo Client 4: GraphQL errors are wrapped in CombinedGraphQLErrors with the
    // individual errors on `error.errors` (the old `error.graphQLErrors` is removed).
    if (CombinedGraphQLErrors.is(error) && error.errors.length > 0) {
      const graphqlError = error.errors[0];
      if (graphqlError.extensions?.code === 'NOT_FOUND') {
        return {
          title: 'Desktop not found',
          message: `The desktop with ID '${vmId}' does not exist.`,
          canRetry: false,
          isNotFound: true,
        };
      }
      if (graphqlError.extensions?.code === 'FORBIDDEN') {
        return {
          title: 'Access denied',
          message: 'You do not have permissions to access this desktop.',
          canRetry: false,
          isNotFound: false,
        };
      }
      return {
        title: 'Server error',
        message:
          graphqlError.message ||
          'An error occurred while obtaining desktop information.',
        canRetry: true,
        isNotFound: false,
      };
    }
    // Apollo Client 4: transport/HTTP failures arrive as ServerError (the old
    // `error.networkError` is removed).
    if (ServerError.is(error)) {
      return {
        title: 'Connection error',
        message:
          'Could not connect to the server. Check your internet connection.',
        canRetry: true,
        isNotFound: false,
      };
    }
    return {
      title: 'Unexpected error',
      message: error.message || 'An unexpected error occurred. Please try again.',
      canRetry: true,
      isNotFound: false,
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <Container size="md" padded>
      <ResponsiveStack direction="col" gap={5}>
        <Alert
          tone="danger"
          icon={<AlertTriangle size={14} />}
          title={errorInfo.title}
          actions={
            <ResponsiveStack direction="row" gap={2}>
              {errorInfo.canRetry && onRetry ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<RefreshCw size={14} />}
                  onClick={() => {
                    debug.log('Retrying VM fetch');
                    onRetry();
                  }}
                >
                  Try again
                </Button>
              ) : null}
              <Button
                variant="secondary"
                size="sm"
                icon={<Home size={14} />}
                onClick={() => router.push('/departments')}
              >
                Back to departments
              </Button>
            </ResponsiveStack>
          }
        >
          {errorInfo.message}
        </Alert>

        {error && process.env.NODE_ENV === 'development' ? (
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Error details (development)"
          >
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Card>
        ) : null}

        <EmptyState
          variant="inline"
          title={
            errorInfo.isNotFound
              ? 'If you believe this desktop should exist, contact your system administrator.'
              : 'If the problem persists, contact technical support.'
          }
        />
      </ResponsiveStack>
    </Container>
  );
};

export default ErrorState;
