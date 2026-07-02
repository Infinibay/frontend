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
              <Skeleton circle width={44} height={44} />
              <Skeleton width="40%" height={22} />
            </ResponsiveStack>
            <Skeleton width="60%" height={14} />
            <ResponsiveStack direction="row" gap={2} wrap>
              <Skeleton width={96} height={32} />
              <Skeleton width={96} height={32} />
              <Skeleton width={96} height={32} />
            </ResponsiveStack>
          </ResponsiveStack>
        </Card>

        <Bento columns={{ base: 1, md: 2, lg: 3 }} gap={16}>
          {Array.from({ length: 6 }).map((_, index) => (
            <BentoItem key={index}>
              <Card variant="default" spotlight={false} glow={false} fullHeight>
                <ResponsiveStack direction="col" gap={3}>
                  <Skeleton width="50%" height={18} />
                  <Skeleton width="100%" height={12} />
                  <Skeleton width="80%" height={12} />
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
