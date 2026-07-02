import { HelpCircle, Info } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Card,
  ResponsiveStack,
} from '@infinibay/harbor';

export const RecommendationsGeneralHelp = () => (
  <Accordion>
    <AccordionItem
      value="general"
      title="What are recommendations?"
      icon={<HelpCircle size={14} />}
    >
      <ResponsiveStack direction="col" gap={4}>
        <span>
          Recommendations are automatic suggestions to keep your desktop running
          optimally, securely and efficiently.
        </span>

        <ResponsiveStack direction={{ base: 'col', md: 'row' }} gap={4}>
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Recommendation types"
          >
            <ResponsiveStack direction="col" gap={2}>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="danger">Critical</Badge>
                <span>Require immediate attention</span>
              </ResponsiveStack>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="warning">High</Badge>
                <span>Should be resolved soon</span>
              </ResponsiveStack>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="info">Medium</Badge>
                <span>Improve performance</span>
              </ResponsiveStack>
              <ResponsiveStack direction="row" gap={2} align="center">
                <Badge tone="neutral">Low</Badge>
                <span>Optional optimizations</span>
              </ResponsiveStack>
            </ResponsiveStack>
          </Card>

          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Categories"
          >
            <ResponsiveStack direction="col" gap={1}>
              <span>Security — protection and antivirus</span>
              <span>Performance — system speed</span>
              <span>Storage — disk space</span>
              <span>Updates — software updates</span>
              <span>Maintenance — preventive care</span>
            </ResponsiveStack>
          </Card>
        </ResponsiveStack>

        <Alert tone="info" icon={<Info size={14} />} title="Tip">
          Recommendations are updated automatically. Check this section regularly
          to keep your VM in optimal condition.
        </Alert>
      </ResponsiveStack>
    </AccordionItem>
  </Accordion>
);

export default RecommendationsGeneralHelp;
