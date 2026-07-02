import { ResponsiveStack } from '@infinibay/harbor';

// Card shell shared by every policies section. Extracted verbatim from the
// page — no behaviour change.
export const SectionCard = ({ icon, title, action, children }) => (
  <section className="rounded-sm border border-white/10 bg-surface-1 p-4 shadow-harbor-md">
    <ResponsiveStack direction="col" gap={3}>
      <ResponsiveStack direction="row" gap={2} align="center">
        {icon}
        <span className="text-sm font-medium">{title}</span>
        {action ? <div className="ml-auto">{action}</div> : null}
      </ResponsiveStack>
      {children}
    </ResponsiveStack>
  </section>
);
