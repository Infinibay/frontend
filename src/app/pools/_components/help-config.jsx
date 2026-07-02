import { Layers, Move3d, Pause } from 'lucide-react';

// ---------------------------------------------------------------------------
// Contextual help (matches the house pattern used across the app).
// Extracted verbatim from the page so the page body stays focused on data flow.
// ---------------------------------------------------------------------------

export const HELP_CONFIG = {
  title: 'Pools',
  description: 'Keep a set of desktops warm and ready so users connect instantly.',
  icon: <Layers size={20} />,
  sections: [
    {
      id: 'types',
      title: 'Persistent vs non-persistent',
      icon: <Layers size={16} />,
      content: (
        <p>
          <strong>Persistent</strong> pools assign each user their own desktop that keeps its state
          across logoffs. <strong>Non-persistent</strong> pools hand out any idle desktop and reset it
          to the golden image on logoff, so every session starts clean.
        </p>
      )
    },
    {
      id: 'sizing',
      title: 'Sizing & refill',
      icon: <Move3d size={16} />,
      content: (
        <p>
          <strong>Min</strong> is the number of desktops kept warm in the background; the refill job
          tops the pool up automatically. <strong>Max</strong> caps how large the pool can grow under
          on-demand load.
        </p>
      )
    },
    {
      id: 'draining',
      title: 'Draining',
      icon: <Pause size={16} />,
      content: (
        <p>
          Draining stops new check-outs while letting current sessions finish — use it before
          maintenance, then Resume to bring the pool back online.
        </p>
      )
    }
  ],
  quickTips: [
    'Click a pool to open its desktops and settings',
    'Drain a pool before maintenance to avoid cutting off users',
    'Min keeps desktops warm; Max caps on-demand growth'
  ]
};
