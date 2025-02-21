// Service categories with their icons
export const serviceCategories = {
  remoteManagement: {
    name: "Remote Management",
    icon: "MonitorController",
    description: "Services for remote access and system administration"
  },
  fileSharing: {
    name: "File Sharing",
    icon: "FolderNetwork",
    description: "File and printer sharing services"
  },
  directoryServices: {
    name: "Directory Services",
    icon: "Network",
    description: "Domain and authentication services"
  },
  webServices: {
    name: "Web Services",
    icon: "Globe",
    description: "HTTP/HTTPS and web-related services"
  },
  gaming: {
    name: "Gaming Services",
    icon: "Gamepad2",
    description: "Game-related network services"
  },
  database: {
    name: "Database Services",
    icon: "Database",
    description: "Database and data management services"
  },
  messaging: {
    name: "Messaging & Communication",
    icon: "MessageSquare",
    description: "Email and communication services"
  },
  monitoring: {
    name: "Monitoring & Management",
    icon: "ActivitySquare",
    description: "System monitoring and management services"
  },
  networkServices: {
    name: "Network Services",
    icon: "Network",
    description: "Core network and infrastructure services"
  },
  systemServices: {
    name: "System Services",
    icon: "Settings",
    description: "Core Windows and system services"
  },
  iot: {
    name: "IoT & Devices",
    icon: "Cpu",
    description: "Internet of Things and device communication services"
  }
};

// Well-known services configuration
export const knownServices = [
  {
    name: "Remote Desktop Protocol (RDP)",
    description: "Microsoft's protocol for remote desktop access and control",
    category: "remoteManagement",
    riskLevel: 4,
    riskReason: "High attack surface for brute force attempts and potential remote code execution. Often targeted by ransomware.",
    ports: [{ start: 3389, end: 3389, protocol: "tcp" }]
  },
  {
    name: "Secure Shell (SSH)",
    description: "Encrypted protocol for secure remote system administration",
    category: "remoteManagement",
    riskLevel: 3,
    riskReason: "While encrypted, it's a common target for brute force attacks and can grant full system access if compromised.",
    ports: [{ start: 22, end: 22, protocol: "tcp" }]
  },
  {
    name: "Web Server (HTTP/HTTPS)",
    description: "Web server protocols for serving websites and web applications",
    category: "webServices",
    riskLevel: 3,
    riskReason: "Exposed to web-based attacks and vulnerabilities. HTTPS mitigates some risks but application-level vulnerabilities remain possible.",
    ports: [
      { start: 80, end: 80, protocol: "tcp" },
      { start: 443, end: 443, protocol: "tcp" }
    ]
  },
  {
    name: "Windows Remote Management (WinRM)",
    description: "Remote management protocol for Windows systems",
    category: "remoteManagement",
    riskLevel: 5,
    riskReason: "Provides extensive remote administration capabilities. Compromise could lead to full system access and lateral movement.",
    ports: [
      { start: 5985, end: 5985, protocol: "tcp" },
      { start: 5986, end: 5986, protocol: "tcp" }
    ]
  },
  {
    name: "Windows Remote Procedure Call (RPC)",
    description: "Microsoft RPC for remote service management and inter-process communication",
    category: "systemServices",
    riskLevel: 5,
    riskReason: "Extremely high risk due to wide attack surface, history of critical vulnerabilities, and access to core system functionality.",
    ports: [
      { start: 135, end: 135, protocol: "tcp" },
      { start: 49152, end: 65535, protocol: "tcp" }
    ]
  },
  {
    name: "Windows NetBIOS",
    description: "Legacy Windows networking and name resolution service",
    category: "networkServices",
    riskLevel: 4,
    riskReason: "Legacy protocol with known vulnerabilities. Often used in network enumeration and lateral movement attacks.",
    ports: [
      { start: 137, end: 137, protocol: "udp" },
      { start: 138, end: 138, protocol: "udp" },
      { start: 139, end: 139, protocol: "tcp" }
    ]
  },
  {
    name: "SMB File Sharing",
    description: "Windows file and printer sharing protocol",
    category: "fileSharing",
    riskLevel: 5,
    riskReason: "Critical protocol frequently targeted by worms and ransomware (e.g., WannaCry). Vulnerabilities can lead to network-wide compromise.",
    ports: [{ start: 445, end: 445, protocol: "tcp" }]
  },
  {
    name: "Active Directory",
    description: "Microsoft Active Directory domain services",
    category: "directoryServices",
    riskLevel: 5,
    riskReason: "Core authentication service - compromise could lead to domain-wide access. Target for credential theft and privilege escalation.",
    ports: [
      { start: 389, end: 389, protocol: "tcp" },
      { start: 636, end: 636, protocol: "tcp" },
      { start: 88, end: 88, protocol: "tcp" },
      { start: 88, end: 88, protocol: "udp" },
      { start: 464, end: 464, protocol: "tcp" },
      { start: 464, end: 464, protocol: "udp" },
      { start: 53, end: 53, protocol: "tcp" },
      { start: 53, end: 53, protocol: "udp" }
    ]
  },
  {
    name: "Windows Time Service (W32Time)",
    description: "Time synchronization service for Windows domain",
    category: "systemServices",
    riskLevel: 2,
    riskReason: "Limited attack surface, but time manipulation could affect security protocols and logging.",
    ports: [{ start: 123, end: 123, protocol: "udp" }]
  },
  {
    name: "Windows Server Update Services (WSUS)",
    description: "Windows update distribution service",
    category: "systemServices",
    riskLevel: 3,
    riskReason: "Man-in-the-middle attacks could inject malicious updates. Generally well-protected but high-impact if compromised.",
    ports: [
      { start: 8530, end: 8530, protocol: "tcp" },
      { start: 8531, end: 8531, protocol: "tcp" }
    ]
  },
  {
    name: "SQL Server",
    description: "Microsoft SQL Server database service",
    category: "database",
    riskLevel: 4,
    riskReason: "Contains sensitive data and potential for SQL injection. Elevated privileges could lead to system compromise.",
    ports: [
      { start: 1433, end: 1433, protocol: "tcp" },
      { start: 1434, end: 1434, protocol: "udp" }
    ]
  },
  {
    name: "Exchange Server",
    description: "Microsoft Exchange email server",
    category: "messaging",
    riskLevel: 4,
    riskReason: "Email servers are common targets for attacks. Contains sensitive data and often has complex configurations.",
    ports: [
      { start: 25, end: 25, protocol: "tcp" },
      { start: 587, end: 587, protocol: "tcp" },
      { start: 993, end: 993, protocol: "tcp" }
    ]
  },
  {
    name: "SMTP Mail Server",
    description: "Standard email sending protocol",
    category: "messaging",
    riskLevel: 4,
    riskReason: "Often targeted for spam relay and phishing. Can expose internal network information and be used for reconnaissance.",
    ports: [
      { start: 25, end: 25, protocol: "tcp" },
      { start: 587, end: 587, protocol: "tcp" },
      { start: 465, end: 465, protocol: "tcp" }
    ]
  },
  {
    name: "IMAP Mail Server",
    description: "Standard email receiving protocol (IMAP)",
    category: "messaging",
    riskLevel: 3,
    riskReason: "Potential for credential theft and email content exposure. More secure than POP3 but still a target for attacks.",
    ports: [
      { start: 143, end: 143, protocol: "tcp" },
      { start: 993, end: 993, protocol: "tcp" }
    ]
  },
  {
    name: "Steam Gaming",
    description: "Steam game client and server",
    category: "gaming",
    riskLevel: 2,
    riskReason: "Generally lower risk, but could be used for social engineering or credential theft.",
    ports: [
      { start: 27015, end: 27015, protocol: "udp" },
      { start: 27015, end: 27015, protocol: "tcp" }
    ]
  },
  {
    name: "Epic Games",
    description: "Epic Games Store and services",
    category: "gaming",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through game exploits.",
    ports: [{ start: 27020, end: 27020, protocol: "tcp" }]
  },
  {
    name: "Windows Event Forwarding",
    description: "Windows Event Log forwarding service",
    category: "monitoring",
    riskLevel: 3,
    riskReason: "Potential for information disclosure and lateral movement through event log manipulation.",
    ports: [
      { start: 5985, end: 5985, protocol: "tcp" },
      { start: 5986, end: 5986, protocol: "tcp" }
    ]
  },
  {
    name: "MQTT",
    description: "IoT messaging protocol",
    category: "iot",
    riskLevel: 3,
    riskReason: "Potential for data exposure and unauthorized access if not properly secured.",
    ports: [
      { start: 1883, end: 1883, protocol: "tcp" },
      { start: 8883, end: 8883, protocol: "tcp" }
    ]
  },
  {
    name: "AnyDesk",
    description: "Remote desktop software",
    category: "remoteManagement",
    riskLevel: 4,
    riskReason: "Third-party remote access tool that could be exploited for unauthorized access.",
    ports: [{ start: 7070, end: 7070, protocol: "tcp" }]
  }
];

// Helper function to find service by port and protocol
export const findServiceByPort = (port, protocol) => {
  return knownServices.find(service => 
    service.ports.some(p => 
      port >= p.start && port <= p.end && p.protocol === protocol
    )
  );
};

// Helper function to get risk level description
export const getRiskLevelDescription = (level) => {
  switch (level) {
    case 5: return "Critical Risk";
    case 4: return "High Risk";
    case 3: return "Medium Risk";
    case 2: return "Low Risk";
    case 1: return "Minimal Risk";
    default: return "Unknown Risk";
  }
};
