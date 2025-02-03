// Well-known services configuration
export const knownServices = {
  "3389/tcp": {
    name: "Remote Desktop",
    description: "Allows you to connect to this computer from another device and control it remotely",
    riskLevel: "medium",
    riskDescription: "Enabling this service lets authorized users access this computer remotely. Only enable if needed.",
    icon: "desktop",
  },
  "22/tcp": {
    name: "Secure Shell (SSH)",
    description: "Technical service for remote computer management",
    riskLevel: "medium",
    riskDescription: "This is a technical service usually used by IT administrators. Enable only if advised by your IT team.",
    icon: "terminal",
  },
  "80/tcp": {
    name: "Web Server",
    description: "Makes websites hosted on this computer available to others",
    riskLevel: "medium",
    riskDescription: "This allows others to access web content from this computer. Enable only if this computer hosts a website.",
    icon: "globe",
  },
  "443/tcp": {
    name: "Secure Web Server",
    description: "Makes secure websites hosted on this computer available to others",
    riskLevel: "medium",
    riskDescription: "This allows others to access secure web content from this computer. Enable only if this computer hosts a secure website.",
    icon: "lock",
  },
};

// Mock detected services data
export const mockDetectedServices = [
  {
    vmId: "vm1",
    vmName: "Reception PC",
    services: [
      {
        port: 3389,
        protocol: "tcp",
        status: "listening",
        enabled: true,
      }
    ]
  },
  {
    vmId: "vm2",
    vmName: "Accounting PC",
    services: [
      {
        port: 3389,
        protocol: "tcp",
        status: "listening",
        enabled: true,
      },
      {
        port: 8080,
        protocol: "tcp",
        status: "listening",
        enabled: false,
        unknown: true
      }
    ]
  },
  {
    vmId: "vm3",
    vmName: "HR PC",
    services: [
      {
        port: 3389,
        protocol: "tcp",
        status: "listening",
        enabled: false,
      },
      {
        port: 22,
        protocol: "tcp",
        status: "listening",
        enabled: true,
      }
    ]
  },
  {
    vmId: "vm4",
    vmName: "IT Support PC",
    services: [
      {
        port: 3389,
        protocol: "tcp",
        status: "listening",
        enabled: true,
      },
      {
        port: 22,
        protocol: "tcp",
        status: "listening",
        enabled: true,
      },
      {
        port: 80,
        protocol: "tcp",
        status: "listening",
        enabled: true,
      }
    ]
  }
];
