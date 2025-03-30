// Predefined port ranges for common services
export const commonPortRanges = {
  "HTTP/HTTPS": "80,443",
  "FTP": "20-21",
  "SSH": "22",
  "Remote Desktop": "3389",
  "DNS": "53",
  "SMTP": "25,587",
  "File Sharing": "135-139,445",
};

// Mock firewall rules data
export const mockFirewallRules = {
  department: [
    {
      id: "dept-1",
      name: "Allow Remote Desktop",
      description: "Allow incoming RDP connections",
      ports: "3389",
      protocol: "tcp",
      direction: "inbound",
      action: "allow",
      priority: 100,
      enabled: true,
      scope: "department"
    },
    {
      id: "dept-2",
      name: "Block Outgoing Mail",
      description: "Prevent direct mail server connections",
      ports: "25,587",
      protocol: "tcp",
      direction: "outbound",
      action: "deny",
      priority: 200,
      enabled: true,
      scope: "department"
    }
  ],
  vms: {
    "vm1": [
      {
        id: "vm1-1",
        name: "Custom Web Access",
        description: "Allow incoming web traffic on custom port",
        ports: "8080",
        protocol: "tcp",
        direction: "inbound",
        action: "allow",
        priority: 100,
        enabled: true,
        scope: "vm"
      }
    ],
    "vm4": [
      {
        id: "vm4-1",
        name: "Allow All HTTP",
        description: "Allow all HTTP traffic",
        ports: "80,443,8080-8090",
        protocol: "tcp",
        direction: "inbound",
        action: "allow",
        priority: 100,
        enabled: true,
        scope: "vm"
      }
    ]
  }
};

export const defaultFilters = [
  {
    id: "no-arp-spoofing",
    name: "ARP Spoofing Protection",
    description: "Prevent a VM from spoofing ARP traffic",
    details: "This filter only allows ARP request and reply messages and enforces that those packets contain the MAC and IP addresses of the VM.",
    enabled: true,
    recommended: true,
    category: "security"
  },
  {
    id: "no-ip-spoofing",
    name: "IP Spoofing Protection",
    description: "Prevent IP address spoofing",
    details: "Blocks packets with a source IP address different from the one assigned to the VM.",
    enabled: true,
    recommended: true,
    category: "security"
  },
  {
    id: "allow-dhcp",
    name: "DHCP Client",
    description: "Allow DHCP address assignment",
    details: "Allows the VM to request an IP address via DHCP from any DHCP server.",
    enabled: true,
    recommended: true,
    category: "network"
  },
  {
    id: "clean-traffic",
    name: "Clean Traffic",
    description: "Comprehensive traffic filtering",
    details: "Prevents MAC, IP and ARP spoofing. This is a combination of several other security filters.",
    enabled: true,
    recommended: true,
    category: "security"
  }
];
