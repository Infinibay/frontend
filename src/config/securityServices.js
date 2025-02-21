// Well-known services configuration
export const knownServices = [
  {
    name: "Remote Desktop Protocol (RDP)",
    description: "Microsoft's protocol for remote desktop access and control",
    riskLevel: 4,
    riskReason: "High attack surface for brute force attempts and potential remote code execution. Often targeted by ransomware.",
    ports: [{ start: 3389, end: 3389, protocol: "tcp" }],
    icon: "desktop"
  },
  {
    name: "Secure Shell (SSH)",
    description: "Encrypted protocol for secure remote system administration",
    riskLevel: 3,
    riskReason: "While encrypted, it's a common target for brute force attacks and can grant full system access if compromised.",
    ports: [{ start: 22, end: 22, protocol: "tcp" }],
    icon: "terminal"
  },
  {
    name: "Web Server (HTTP/HTTPS)",
    description: "Web server protocols for serving websites and web applications",
    riskLevel: 3,
    riskReason: "Exposed to web-based attacks and vulnerabilities. HTTPS mitigates some risks but application-level vulnerabilities remain possible.",
    ports: [
      { start: 80, end: 80, protocol: "tcp" },
      { start: 443, end: 443, protocol: "tcp" }
    ],
    icon: "globe"
  },
  {
    name: "Windows Remote Procedure Call (RPC)",
    description: "Microsoft RPC for remote service management and inter-process communication",
    riskLevel: 5,
    riskReason: "Extremely high risk due to wide attack surface, history of critical vulnerabilities, and access to core system functionality.",
    ports: [
      { start: 135, end: 135, protocol: "tcp" },
      { start: 49152, end: 65535, protocol: "tcp" } // Dynamic RPC ports
    ],
    icon: "network"
  },
  {
    name: "Windows NetBIOS",
    description: "Legacy Windows networking and name resolution service",
    riskLevel: 4,
    riskReason: "Legacy protocol with known vulnerabilities. Often used in network enumeration and lateral movement attacks.",
    ports: [
      { start: 137, end: 137, protocol: "udp" }, // NetBIOS Name Service
      { start: 138, end: 138, protocol: "udp" }, // NetBIOS Datagram
      { start: 139, end: 139, protocol: "tcp" }  // NetBIOS Session
    ],
    icon: "network"
  },
  {
    name: "SMB File Sharing",
    description: "Windows file and printer sharing protocol",
    riskLevel: 5,
    riskReason: "Critical protocol frequently targeted by worms and ransomware (e.g., WannaCry). Vulnerabilities can lead to network-wide compromise.",
    ports: [
      { start: 445, end: 445, protocol: "tcp" }
    ],
    icon: "folder"
  },
  {
    name: "Active Directory",
    description: "Microsoft Active Directory domain services",
    riskLevel: 5,
    riskReason: "Core authentication service - compromise could lead to domain-wide access. Target for credential theft and privilege escalation.",
    ports: [
      { start: 389, end: 389, protocol: "tcp" },  // LDAP
      { start: 636, end: 636, protocol: "tcp" },  // LDAPS
      { start: 88, end: 88, protocol: "tcp" },    // Kerberos
      { start: 88, end: 88, protocol: "udp" },    // Kerberos
      { start: 464, end: 464, protocol: "tcp" },  // Kerberos password change
      { start: 464, end: 464, protocol: "udp" },  // Kerberos password change
      { start: 53, end: 53, protocol: "tcp" },    // DNS
      { start: 53, end: 53, protocol: "udp" }     // DNS
    ],
    icon: "network"
  },
  {
    name: "Windows Time Service (W32Time)",
    description: "Time synchronization service for Windows domain",
    riskLevel: 2,
    riskReason: "Limited attack surface, but time manipulation could affect security protocols and logging.",
    ports: [
      { start: 123, end: 123, protocol: "udp" }  // NTP
    ],
    icon: "clock"
  },
  {
    name: "Windows Remote Management (WinRM)",
    description: "Remote management protocol for Windows systems",
    riskLevel: 5,
    riskReason: "Provides extensive remote administration capabilities. Compromise could lead to full system access and lateral movement.",
    ports: [
      { start: 5985, end: 5985, protocol: "tcp" }, // HTTP
      { start: 5986, end: 5986, protocol: "tcp" }  // HTTPS
    ],
    icon: "terminal"
  },
  {
    name: "Windows Server Update Services (WSUS)",
    description: "Windows update distribution service",
    riskLevel: 3,
    riskReason: "Man-in-the-middle attacks could inject malicious updates. Generally well-protected but high-impact if compromised.",
    ports: [
      { start: 8530, end: 8530, protocol: "tcp" }, // HTTP
      { start: 8531, end: 8531, protocol: "tcp" }  // HTTPS
    ],
    icon: "download"
  },
  {
    name: "Microsoft SQL Server",
    description: "Microsoft's enterprise database management system",
    riskLevel: 4,
    riskReason: "Contains sensitive data and potential for SQL injection. Elevated privileges could lead to system compromise.",
    ports: [
      { start: 1433, end: 1433, protocol: "tcp" }, // Default instance
      { start: 1434, end: 1434, protocol: "udp" }  // SQL Browser Service
    ],
    icon: "database"
  },
  {
    name: "Exchange Server",
    description: "Microsoft Exchange email server services",
    riskLevel: 4,
    riskReason: "Complex attack surface with history of critical vulnerabilities. Contains sensitive email data and authentication capabilities.",
    ports: [
      { start: 25, end: 25, protocol: "tcp" },     // SMTP
      { start: 587, end: 587, protocol: "tcp" },   // SMTP with TLS
      { start: 143, end: 143, protocol: "tcp" },   // IMAP
      { start: 993, end: 993, protocol: "tcp" },   // IMAP over SSL
      { start: 110, end: 110, protocol: "tcp" },   // POP3
      { start: 995, end: 995, protocol: "tcp" },   // POP3 over SSL
      { start: 80, end: 80, protocol: "tcp" },     // HTTP
      { start: 443, end: 443, protocol: "tcp" },   // HTTPS
      { start: 444, end: 444, protocol: "tcp" },   // HTTPS alternative
      { start: 475, end: 475, protocol: "tcp" }    // Message transfer
    ],
    icon: "mail"
  },
  {
    name: "SMTP Mail Server",
    description: "Standard email sending protocol",
    riskLevel: 4,
    riskReason: "Often targeted for spam relay and phishing. Can expose internal network information and be used for reconnaissance.",
    ports: [
      { start: 25, end: 25, protocol: "tcp" },    // Standard SMTP
      { start: 587, end: 587, protocol: "tcp" },  // SMTP with STARTTLS
      { start: 465, end: 465, protocol: "tcp" }   // SMTP over SSL/TLS
    ],
    icon: "mail"
  },
  {
    name: "IMAP Mail Server",
    description: "Standard email receiving protocol (IMAP)",
    riskLevel: 3,
    riskReason: "Potential for credential theft and email content exposure. More secure than POP3 but still a target for attacks.",
    ports: [
      { start: 143, end: 143, protocol: "tcp" },  // Standard IMAP
      { start: 993, end: 993, protocol: "tcp" }   // IMAP over SSL/TLS
    ],
    icon: "mail"
  },
  {
    name: "POP3 Mail Server",
    description: "Standard email receiving protocol (POP3)",
    riskLevel: 3,
    riskReason: "Older protocol with basic authentication. Vulnerable to password attacks and man-in-the-middle if not using SSL/TLS.",
    ports: [
      { start: 110, end: 110, protocol: "tcp" },  // Standard POP3
      { start: 995, end: 995, protocol: "tcp" }   // POP3 over SSL/TLS
    ],
    icon: "mail"
  },
  {
    name: "Web Server (HTTP)",
    description: "Standard web server protocol",
    riskLevel: 3,
    riskReason: "Unencrypted traffic can be intercepted. Vulnerable to various web attacks and information disclosure.",
    ports: [{ start: 80, end: 80, protocol: "tcp" }],
    icon: "globe"
  },
  {
    name: "Web Server (HTTPS)",
    description: "Secure web server protocol",
    riskLevel: 3,
    riskReason: "More secure than HTTP but still vulnerable to application-level attacks and SSL/TLS vulnerabilities.",
    ports: [{ start: 443, end: 443, protocol: "tcp" }],
    icon: "lock"
  },
  {
    name: "MSSQL Analysis Services",
    description: "Microsoft SQL Server Analysis Services",
    riskLevel: 4,
    riskReason: "Access to business-critical data warehouses. Potential for data theft and resource exhaustion attacks.",
    ports: [{ start: 2383, end: 2383, protocol: "tcp" }],
    icon: "database"
  },
  {
    name: "Windows Deployment Services",
    description: "Remote Windows installation service",
    riskLevel: 4,
    riskReason: "Could be exploited for unauthorized OS deployment and boot image manipulation. Network-wide impact if compromised.",
    ports: [
      { start: 67, end: 67, protocol: "udp" },   // DHCP
      { start: 68, end: 68, protocol: "udp" },   // DHCP
      { start: 69, end: 69, protocol: "udp" },   // TFTP
      { start: 4011, end: 4011, protocol: "udp" } // PXE
    ],
    icon: "server"
  },
  {
    name: "Windows Admin Center",
    description: "Browser-based Windows management platform",
    riskLevel: 4,
    riskReason: "Centralized management interface with extensive system control. High-value target for attackers seeking administrative access.",
    ports: [{ start: 6516, end: 6516, protocol: "tcp" }],
    icon: "settings"
  },
  {
    name: "Microsoft System Center",
    description: "System Center Operations Manager (SCOM)",
    riskLevel: 4,
    riskReason: "Centralized monitoring and management. Potential for privilege escalation and access to sensitive system information.",
    ports: [
      { start: 5723, end: 5723, protocol: "tcp" },  // Operations Manager
      { start: 1433, end: 1433, protocol: "tcp" },  // SQL
      { start: 5724, end: 5724, protocol: "tcp" }   // Agent
    ],
    icon: "server"
  },
  {
    name: "Windows Event Forwarding",
    description: "Windows Event Log forwarding service",
    riskLevel: 3,
    riskReason: "Potential for information disclosure and lateral movement through event log manipulation.",
    ports: [
      { start: 5985, end: 5985, protocol: "tcp" },  // WinRM HTTP
      { start: 5986, end: 5986, protocol: "tcp" }   // WinRM HTTPS
    ],
    icon: "list"
  },
  {
    name: "File Transfer Protocol (FTP)",
    description: "Protocol for transferring files between computers",
    riskLevel: 4,
    riskReason: "Unencrypted traffic and weak authentication. Vulnerable to eavesdropping, tampering, and brute force attacks.",
    ports: [
      { start: 20, end: 20, protocol: "tcp" }, // FTP Data
      { start: 21, end: 21, protocol: "tcp" }  // FTP Control
    ],
    icon: "folder"
  },
  {
    name: "MySQL Database",
    description: "Open-source relational database management system",
    riskLevel: 4,
    riskReason: "Potential for SQL injection and data theft. Weak passwords and misconfigurations can lead to unauthorized access.",
    ports: [{ start: 3306, end: 3306, protocol: "tcp" }],
    icon: "database"
  },
  {
    name: "PostgreSQL Database",
    description: "Advanced open-source relational database",
    riskLevel: 4,
    riskReason: "Potential for SQL injection and data theft. Weak passwords and misconfigurations can lead to unauthorized access.",
    ports: [{ start: 5432, end: 5432, protocol: "tcp" }],
    icon: "database"
  },
  {
    name: "ICMP (Ping)",
    description: "Network diagnostic and management protocol",
    riskLevel: 2,
    riskReason: "Limited attack surface, but can be used for reconnaissance and network mapping.",
    ports: [], // ICMP doesn't use ports
    icon: "activity"
  },
  {
    name: "DNS Server",
    description: "Domain Name System server for hostname resolution",
    riskLevel: 3,
    riskReason: "Potential for DNS spoofing and cache poisoning. Can be used for reconnaissance and network mapping.",
    ports: [
      { start: 53, end: 53, protocol: "tcp" },
      { start: 53, end: 53, protocol: "udp" }
    ],
    icon: "globe"
  },
  {
    name: "MongoDB Database",
    description: "NoSQL document database",
    riskLevel: 4,
    riskReason: "Potential for data theft and unauthorized access. Weak passwords and misconfigurations can lead to security breaches.",
    ports: [{ start: 27017, end: 27017, protocol: "tcp" }],
    icon: "database"
  },
  {
    name: "Redis Cache",
    description: "In-memory data structure store",
    riskLevel: 3,
    riskReason: "Potential for data theft and unauthorized access. Weak passwords and misconfigurations can lead to security breaches.",
    ports: [{ start: 6379, end: 6379, protocol: "tcp" }],
    icon: "database"
  },
  {
    name: "Docker API",
    description: "Docker daemon API endpoint",
    riskLevel: 5,
    riskReason: "Potential for container escape and unauthorized access to host system. Weak passwords and misconfigurations can lead to security breaches.",
    ports: [{ start: 2375, end: 2376, protocol: "tcp" }],
    icon: "box"
  },
  {
    name: "Kubernetes API Server",
    description: "Kubernetes control plane API",
    riskLevel: 5,
    riskReason: "Potential for cluster-wide access and unauthorized control. Weak passwords and misconfigurations can lead to security breaches.",
    ports: [{ start: 6443, end: 6443, protocol: "tcp" }],
    icon: "server"
  },
  {
    name: "Steam",
    description: "Valve's gaming platform for game downloads and multiplayer gaming",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through game exploits.",
    ports: [
      { start: 27015, end: 27015, protocol: "udp" }, // Game client traffic
      { start: 27015, end: 27015, protocol: "tcp" }, // Steam downloads
      { start: 27036, end: 27036, protocol: "tcp" }, // Steam Remote Play
      { start: 27036, end: 27037, protocol: "udp" }, // Steam Remote Play
      { start: 27031, end: 27036, protocol: "udp" }, // Steam In-Home Streaming
      { start: 27014, end: 27050, protocol: "tcp" }, // Additional game servers
      { start: 3478, end: 3478, protocol: "udp" },   // Steam Friends (STUN)
      { start: 4379, end: 4380, protocol: "udp" },   // Steam Friends (P2P)
      { start: 27000, end: 27100, protocol: "udp" }  // Source Engine Games
    ],
    icon: "gamepad"
  },
  {
    name: "Epic Games",
    description: "Epic Games Store and game services",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through game exploits.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // Store and updates
      { start: 3478, end: 3479, protocol: "udp" },   // NAT connectivity
      { start: 5222, end: 5222, protocol: "tcp" },   // Epic Online Services
      { start: 5795, end: 5847, protocol: "udp" },   // Game traffic
      { start: 5222, end: 5223, protocol: "udp" },   // Voice chat
      { start: 6250, end: 6250, protocol: "tcp" },   // Epic Online Services
      { start: 12000, end: 12100, protocol: "udp" }  // Fortnite and other games
    ],
    icon: "gamepad"
  },
  {
    name: "Battle.net",
    description: "Blizzard's gaming network",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through game exploits.",
    ports: [
      { start: 1119, end: 1119, protocol: "tcp" },   // Battle.net
      { start: 3724, end: 3724, protocol: "tcp" },   // Game client
      { start: 4000, end: 4000, protocol: "tcp" },   // Game client
      { start: 6012, end: 6012, protocol: "tcp" },   // Game client
      { start: 1119, end: 1119, protocol: "udp" },   // Game traffic
      { start: 3724, end: 3724, protocol: "udp" },   // Game traffic
      { start: 6012, end: 6012, protocol: "udp" }    // Voice chat
    ],
    icon: "gamepad"
  },
  {
    name: "EA App (Origin)",
    description: "Electronic Arts gaming platform",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through game exploits.",
    ports: [
      { start: 3216, end: 3216, protocol: "tcp" },   // Game client
      { start: 9960, end: 9969, protocol: "tcp" },   // Game downloads
      { start: 18000, end: 18000, protocol: "tcp" }, // Game traffic
      { start: 18120, end: 18120, protocol: "tcp" }, // Game traffic
      { start: 27900, end: 27900, protocol: "tcp" }, // EA Online
      { start: 28910, end: 28910, protocol: "tcp" }, // EA Online
      { start: 29900, end: 29900, protocol: "tcp" }  // EA Online
    ],
    icon: "gamepad"
  },
  {
    name: "Xbox Game Pass",
    description: "Microsoft's gaming service",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through game exploits.",
    ports: [
      { start: 3074, end: 3074, protocol: "tcp" },   // Xbox Live
      { start: 3074, end: 3074, protocol: "udp" },   // Xbox Live
      { start: 500, end: 500, protocol: "udp" },     // Xbox Network
      { start: 3544, end: 3544, protocol: "udp" },   // Teredo
      { start: 4500, end: 4500, protocol: "udp" }    // Xbox Network
    ],
    icon: "gamepad"
  },
  {
    name: "PlayStation Network",
    description: "Sony's gaming network",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through game exploits.",
    ports: [
      { start: 3478, end: 3480, protocol: "tcp" },   // PSN
      { start: 3478, end: 3479, protocol: "udp" },   // PSN
      { start: 3658, end: 3658, protocol: "tcp" },   // PSN Store
      { start: 10070, end: 10080, protocol: "udp" }  // Game traffic
    ],
    icon: "gamepad"
  },
  {
    name: "WireGuard",
    description: "Modern VPN protocol",
    riskLevel: 3,
    riskReason: "Potential for unauthorized access and data exposure if not properly configured.",
    ports: [{ start: 51820, end: 51820, protocol: "udp" }],
    icon: "shield"
  },
  {
    name: "MongoDB",
    description: "NoSQL database",
    riskLevel: 4,
    riskReason: "Potential for data theft and unauthorized access. Weak passwords and misconfigurations can lead to security breaches.",
    ports: [{ start: 27017, end: 27019, protocol: "tcp" }], // Primary, Secondary, Arbiter
    icon: "database"
  },
  {
    name: "PostgreSQL",
    description: "Advanced SQL database",
    riskLevel: 4,
    riskReason: "Potential for data theft and unauthorized access. Weak passwords and misconfigurations can lead to security breaches.",
    ports: [{ start: 5432, end: 5432, protocol: "tcp" }],
    icon: "database"
  },
  {
    name: "Redis",
    description: "In-memory data structure store",
    riskLevel: 4,
    riskReason: "Potential for data theft and unauthorized access. Weak passwords and misconfigurations can lead to security breaches.",
    ports: [{ start: 6379, end: 6379, protocol: "tcp" }],
    icon: "database"
  },
  {
    name: "MQTT",
    description: "IoT messaging protocol",
    riskLevel: 3,
    riskReason: "Potential for data exposure and unauthorized access if not properly secured.",
    ports: [
      { start: 1883, end: 1883, protocol: "tcp" },   // Standard MQTT
      { start: 8883, end: 8883, protocol: "tcp" }    // MQTT over TLS
    ],
    icon: "cpu"
  },
  {
    name: "CoAP",
    description: "Constrained Application Protocol for IoT",
    riskLevel: 3,
    riskReason: "Potential for data exposure and unauthorized access if not properly secured.",
    ports: [{ start: 5683, end: 5683, protocol: "udp" }],
    icon: "cpu"
  },
  {
    name: "Zoom",
    description: "Video conferencing platform",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through meeting exploits.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // Web client
      { start: 8801, end: 8801, protocol: "tcp" },   // Meeting
      { start: 3478, end: 3479, protocol: "udp" },   // STUN/TURN
      { start: 8801, end: 8810, protocol: "udp" }    // Meeting traffic
    ],
    icon: "video"
  },
  {
    name: "Google Meet",
    description: "Google's video conferencing",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through meeting exploits.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // Web client
      { start: 19302, end: 19309, protocol: "udp" }, // STUN
      { start: 3478, end: 3478, protocol: "udp" }    // TURN
    ],
    icon: "video"
  },
  {
    name: "Microsoft Teams",
    description: "Microsoft's collaboration platform",
    riskLevel: 2,
    riskReason: "Generally well-secured but can be used for phishing and data exfiltration through file sharing features.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // Web client
      { start: 3478, end: 3481, protocol: "udp" },   // STUN/TURN
      { start: 50000, end: 50019, protocol: "udp" }  // Media traffic
    ],
    icon: "users"
  },
  {
    name: "Dropbox",
    description: "Cloud storage and synchronization",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for data exposure and unauthorized access through shared files.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // HTTPS
      { start: 17500, end: 17500, protocol: "tcp" }  // Sync service
    ],
    icon: "cloud"
  },
  {
    name: "OneDrive",
    description: "Microsoft's cloud storage",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for data exposure and unauthorized access through shared files.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // HTTPS
      { start: 8080, end: 8080, protocol: "tcp" }    // Alternative port
    ],
    icon: "cloud"
  },
  {
    name: "Google Drive",
    description: "Google's cloud storage",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for data exposure and unauthorized access through shared files.",
    ports: [{ start: 443, end: 443, protocol: "tcp" }],
    icon: "cloud"
  },
  {
    name: "Signal",
    description: "Encrypted messaging platform",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through messaging exploits.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // Primary
      { start: 8443, end: 8443, protocol: "tcp" }    // Alternative
    ],
    icon: "message-circle"
  },
  {
    name: "Telegram",
    description: "Cloud-based messaging platform",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through messaging exploits.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // HTTPS
      { start: 80, end: 80, protocol: "tcp" },       // HTTP
      { start: 5222, end: 5222, protocol: "tcp" }    // XMPP
    ],
    icon: "message-circle"
  },
  {
    name: "WhatsApp",
    description: "Messaging and voice/video calls",
    riskLevel: 2,
    riskReason: "Limited system access, but potential for social engineering and credential theft through messaging exploits.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // HTTPS
      { start: 3478, end: 3479, protocol: "udp" },   // STUN/TURN
      { start: 4244, end: 4244, protocol: "udp" },   // Voice
      { start: 5222, end: 5222, protocol: "tcp" }    // XMPP
    ],
    icon: "message-circle"
  },
  {
    name: "Slack",
    description: "Business communication platform",
    riskLevel: 2,
    riskReason: "Generally well-secured but can be used for phishing and data exfiltration through file sharing features.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // HTTPS
      { start: 3478, end: 3479, protocol: "udp" }    // Voice/Video
    ],
    icon: "message-square"
  },
  {
    name: "AnyDesk",
    description: "Remote desktop software",
    riskLevel: 3,
    riskReason: "Potential for unauthorized access and data exposure if not properly configured.",
    ports: [
      { start: 7070, end: 7070, protocol: "tcp" },   // Primary
      { start: 6568, end: 6568, protocol: "udp" }    // Discovery
    ],
    icon: "monitor"
  },
  {
    name: "Chrome Remote Desktop",
    description: "Google's remote access solution",
    riskLevel: 3,
    riskReason: "Potential for unauthorized access and data exposure if not properly configured.",
    ports: [
      { start: 443, end: 443, protocol: "tcp" },     // HTTPS
      { start: 3478, end: 3479, protocol: "udp" }    // STUN/TURN
    ],
    icon: "monitor"
  },
  {
    name: "RDP",
    description: "Microsoft Remote Desktop Protocol",
    riskLevel: 4,
    riskReason: "High attack surface for brute force attempts and potential remote code execution. Often targeted by ransomware.",
    ports: [{ start: 3389, end: 3389, protocol: "tcp" }],
    icon: "monitor"
  },
  {
    name: "NoMachine",
    description: "Remote desktop and application access",
    riskLevel: 3,
    riskReason: "Potential for unauthorized access and data exposure if not properly configured.",
    ports: [
      { start: 4000, end: 4000, protocol: "tcp" },   // Primary
      { start: 4011, end: 4011, protocol: "udp" },   // Discovery
      { start: 4010, end: 4010, protocol: "tcp" }    // Server
    ],
    icon: "monitor"
  }
];

// Helper function to find service by port and protocol
export const findServiceByPort = (port, protocol) => {
  return knownServices.find(service => 
    service.ports.some(p => 
      port >= p.start && 
      port <= p.end && 
      p.protocol === protocol
    )
  );
};

// Helper function to get risk level description
export const getRiskLevelDescription = (level) => {
  const descriptions = {
    1: "Very Low Risk",
    2: "Low Risk",
    3: "Medium Risk",
    4: "High Risk",
    5: "Very High Risk"
  };
  return descriptions[level] || "Unknown Risk";
};
