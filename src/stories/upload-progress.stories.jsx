import { UploadProgress } from "@/components/ui/upload-progress";
import { useState } from "react";

const meta = {
  title: 'UI/UploadProgress',
  component: UploadProgress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Upload Progress Component Tutorial

This component provides a reusable upload progress modal that shows:
- Current progress as a progress bar and percentage
- Upload speed in appropriate units (B/s, KB/s, MB/s)
- Uploaded size vs total size
- Optional cancel button

## Implementation Guide

### 1. Required State Setup

\`\`\`jsx
const [isUploading, setIsUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadSpeed, setUploadSpeed] = useState(0);
const [lastLoaded, setLastLoaded] = useState(0);
const [lastTime, setLastTime] = useState(Date.now());
const [uploadController, setUploadController] = useState(null);
\`\`\`

### 2. Setting Up the Upload Request

First, create an AbortController to handle cancellation:

\`\`\`jsx
const handleUpload = async () => {
  const controller = new AbortController();
  setUploadController(controller);
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(url, formData, {
      signal: controller.signal,
      onUploadProgress: calculateProgress
    });
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Upload cancelled');
    }
  }
};
\`\`\`

### 3. Calculating Upload Progress and Speed

The key to accurate speed calculation is measuring the bytes transferred between time intervals:

\`\`\`jsx
const calculateProgress = (progressEvent) => {
  // Calculate progress percentage
  const progress = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  setUploadProgress(progress);
  
  // Calculate speed
  const currentTime = Date.now();
  const timeDiff = (currentTime - lastTime) / 1000; // Convert to seconds
  const loadedDiff = progressEvent.loaded - lastLoaded;
  const speed = loadedDiff / timeDiff; // bytes per second
  
  setUploadSpeed(speed);
  setLastLoaded(progressEvent.loaded);
  setLastTime(currentTime);
};
\`\`\`

### 4. Handling Cancellation

The component supports three ways to cancel:
- Cancel button (if enabled)
- Clicking outside the modal
- Pressing ESC

Implement the cancel handler:

\`\`\`jsx
const handleCancel = () => {
  if (uploadController) {
    uploadController.abort(); // Cancels the axios request
    setUploadController(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadSpeed(0);
    setLastLoaded(0);
  }
};
\`\`\`

### 5. Using the Component

\`\`\`jsx
<UploadProgress
  isOpen={isUploading}
  onOpenChange={setIsUploading}
  title="Uploading File"
  uploadedSize={lastLoaded}
  totalSize={file?.size || 0}
  uploadSpeed={uploadSpeed}
  progress={uploadProgress}
  showCancelButton={true}
  onCancel={handleCancel}
/>
\`\`\`

### Tips for Best Results

1. **Speed Calculation**: The speed calculation becomes more accurate over time as more data points are collected.
   
2. **Error Handling**: Always implement proper error handling for both regular errors and cancellation:
   \`\`\`jsx
   try {
     await uploadRequest();
   } catch (error) {
     if (axios.isCancel(error)) {
       // Handle cancellation
     } else {
       // Handle other errors
     }
   }
   \`\`\`

3. **Cleanup**: Reset all states when the upload completes or is cancelled:
   \`\`\`jsx
   const cleanup = () => {
     setIsUploading(false);
     setUploadProgress(0);
     setUploadSpeed(0);
     setLastLoaded(0);
     setUploadController(null);
   };
   \`\`\`
`,
      },
    },
  },
  args: {
    isOpen: false,
    title: "Uploading File",
    uploadedSize: 128 * 1024 * 1024,
    totalSize: 1024 * 1024 * 1024,
    uploadSpeed: 7.5 * 1024 * 1024,
    progress: 45,
    showCancelButton: false,
  },
  argTypes: {
    onOpenChange: { 
      action: 'onOpenChange',
      description: 'Called when the modal open state changes',
    },
    onCancel: { 
      action: 'onCancel',
      description: 'Called when upload is cancelled (via button, ESC, or clicking outside)',
    },
    isOpen: {
      description: 'Controls the visibility of the modal',
      control: 'boolean',
    },
    title: {
      description: 'Title shown at the top of the modal',
      control: 'text',
    },
    uploadedSize: {
      description: 'Number of bytes uploaded so far',
      control: 'number',
    },
    totalSize: {
      description: 'Total file size in bytes',
      control: 'number',
    },
    uploadSpeed: {
      description: 'Current upload speed in bytes per second',
      control: 'number',
    },
    progress: {
      description: 'Upload progress percentage (0-100)',
      control: { type: 'range', min: 0, max: 100 },
    },
    showCancelButton: {
      description: 'Whether to show the cancel button',
      control: 'boolean',
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <div>
        <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
          Open Upload Modal
        </button>
        <UploadProgress {...args} isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>
    );
  },
};

export default meta;

export const Default = {
  args: {},
};

export const WithCancelButton = {
  args: {
    showCancelButton: true,
  },
};

export const Starting = {
  args: {
    uploadedSize: 0,
    uploadSpeed: 0,
    progress: 0,
    showCancelButton: true,
  },
};

export const AlmostComplete = {
  args: {
    uploadedSize: 950 * 1024 * 1024,
    totalSize: 1024 * 1024 * 1024,
    uploadSpeed: 10 * 1024 * 1024,
    progress: 93,
    showCancelButton: true,
  },
};
