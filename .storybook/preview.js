import '../src/styles/globals.css';
import React from 'react';
import { DndContext } from '@dnd-kit/core';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    docs: {
      // Show code by default
      source: {
        state: 'open',
      },
      // Better handling of props tables
      story: {
        inline: true,
        height: '500px',
      },
      // Canvas settings
      canvas: {
        sourceState: 'shown',
      },
      // Disable the "Show code" button by default in docs
      source: {
        type: 'code',
      },
    },
    // Ensure modals don't interfere with docs
    layout: 'padded',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default preview;
