import {
  Bento,
  BentoItem,
  Card,
  Container,
  ResponsiveStack,
  Skeleton,
} from '@infinibay/harbor';

const LoadingState = () => {
  return (
    <Container size="xl" padded>
      <ResponsiveStack direction="col" gap={6}>
        <Card variant="default" spotlight={false} glow={false}>
          <ResponsiveStack direction="col" gap={3}>
            <ResponsiveStack direction="row" gap={3} align="center">
              <Skeleton />
              <Skeleton />
            </ResponsiveStack>
            <Skeleton />
            <ResponsiveStack direction="row" gap={2} wrap>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </ResponsiveStack>
          </ResponsiveStack>
        </Card>

        <Bento columns={{ base: 1, md: 2, lg: 3 }} gap={16}>
          {Array.from({ length: 6 }).map((_, index) => (
            <BentoItem key={index}>
              <Card variant="default" spotlight={false} glow={false} fullHeight>
                <ResponsiveStack direction="col" gap={3}>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </ResponsiveStack>
              </Card>
            </BentoItem>
          ))}
        </Bento>
      </ResponsiveStack>
    </Container>
  );
};

export default LoadingState;
