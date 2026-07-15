import { ResponsiveStack } from '@infinibay/harbor';

// Card shell shared by every policies section. Separation comes from surface +
// elevation rather than a hard outline — the stark `border-white/10` box was
// noisy once several stacked (esp. the permission groups), so it's dropped in
// favour of a soft raised panel.
export const SectionCard = ({ icon, title, action, children }) => (
  <section className="rounded-lg bg-surface-1 p-4 shadow-harbor-md">
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
