/**
 * BlockRoll FAQ Knowledge Base
 * Comprehensive information about BlockRoll platform
 */

export interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

export const BLOCKROLL_KNOWLEDGE_BASE: FAQCategory[] = [
  {
    category: "About BlockRoll",
    questions: [
      {
        question: "What is BlockRoll?",
        answer: "BlockRoll is a non-custodial data exchange and storage platform powered by BlockDAG. It allows you to own, encrypt, share, and control your files with complete privacy. Your files, your keys, your control.",
        keywords: ["what is", "blockroll", "about", "platform", "introduction"]
      },
      {
        question: "How does BlockRoll work?",
        answer: "BlockRoll works in 3 simple steps:\n1. Upload your file\n2. Encrypt & store on IPFS (decentralized storage)\n3. Share securely by wallet address\n\nAll files are encrypted with AES-256-GCM before storage, and only you control access.",
        keywords: ["how", "work", "process", "steps"]
      },
      {
        question: "What makes BlockRoll different?",
        answer: "BlockRoll is unique because:\n• Non-custodial (you own your data)\n• Powered by BlockDAG blockchain\n• Bank-level security (95/100 score)\n• Real-time updates via WebSocket\n• Emergency access mode\n• Team collaboration\n• AI Guardian security monitoring\n• No traditional passwords - wallet-based auth",
        keywords: ["different", "unique", "special", "features", "why"]
      }
    ]
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        question: "Is BlockRoll secure?",
        answer: "Yes! BlockRoll has bank-level security with 95/100 security rating:\n• AES-256-GCM encryption (military-grade)\n• httpOnly cookie authentication\n• Brute force protection\n• Device fingerprinting\n• Suspicious activity detection\n• Real-time security alerts\n• Multi-device session management\n• Comprehensive audit logs\n\nWe implement 20+ enterprise security features used by major banks.",
        keywords: ["secure", "security", "safe", "protection", "encryption"]
      },
      {
        question: "How are my files encrypted?",
        answer: "Your files are encrypted with AES-256-GCM (military-grade encryption) BEFORE being uploaded. The encryption happens on your device, and only you have the decryption keys. We never see your unencrypted files.",
        keywords: ["encryption", "encrypted", "aes", "security", "privacy"]
      },
      {
        question: "Can BlockRoll access my files?",
        answer: "NO! BlockRoll is non-custodial, meaning:\n• We never have access to your unencrypted files\n• You control all encryption keys\n• Files are encrypted client-side before upload\n• Only wallets you approve can decrypt files\n\nYour data is 100% yours!",
        keywords: ["access", "privacy", "custodial", "control", "own"]
      },
      {
        question: "What is the AI Guardian?",
        answer: "AI Guardian is our intelligent security monitoring system that:\n• Detects unusual access patterns\n• Identifies suspicious behavior in real-time\n• Blocks threats automatically\n• Provides security scores (0-100)\n• Sends instant alerts for incidents\n• Monitors impossible travel (login from two locations too fast)\n• Prevents brute force attacks\n\nIt's like having a security team watching your vault 24/7!",
        keywords: ["ai guardian", "security", "monitoring", "protection", "alerts"]
      }
    ]
  },
  {
    category: "Authentication",
    questions: [
      {
        question: "How do I sign up / login?",
        answer: "There's no traditional signup or login! BlockRoll uses wallet-based authentication:\n1. Click 'Connect Wallet'\n2. Connect your Web3 wallet (MetaMask, WalletConnect, etc.)\n3. Sign the transaction\n4. You're in!\n\nYour wallet IS your account. No passwords to remember!",
        keywords: ["signup", "login", "register", "account", "authentication"]
      },
      {
        question: "Do I need a password?",
        answer: "No passwords needed! BlockRoll uses wallet-based authentication powered by Reown AppKit. Your wallet is your identity and security. This is more secure than traditional passwords because:\n• No passwords to steal\n• No password databases to hack\n• Your private key stays on your device\n• Web3-native security",
        keywords: ["password", "authentication", "wallet", "login"]
      },
      {
        question: "What wallets are supported?",
        answer: "BlockRoll supports all major Web3 wallets through Reown AppKit (WalletConnect):\n• MetaMask\n• Coinbase Wallet\n• Trust Wallet\n• Rainbow Wallet\n• Ledger (hardware wallet)\n• And 300+ more wallets!\n\nAny WalletConnect-compatible wallet works!",
        keywords: ["wallet", "metamask", "supported", "connect", "walletconnect"]
      }
    ]
  },
  {
    category: "File Management",
    questions: [
      {
        question: "How do I upload a file?",
        answer: "Uploading is easy:\n1. Go to 'My Vault'\n2. Click 'Upload File'\n3. Select your file\n4. Choose encryption type (AES-256 recommended)\n5. Set access permissions (Private/Public/Restricted)\n6. Optional: Set expiry date\n7. Click 'Upload'\n\nYour file is encrypted and stored on IPFS!",
        keywords: ["upload", "add file", "store", "save"]
      },
      {
        question: "How do I share a file?",
        answer: "To share a file securely:\n1. Go to 'My Vault' or 'Shared Files'\n2. Find the file you want to share\n3. Click 'Share'\n4. Enter the recipient's wallet address\n5. Set access level (View/Edit/Download)\n6. Optional: Set expiry date\n7. Click 'Share'\n\nThe recipient will get an instant notification!",
        keywords: ["share", "send", "give access", "recipient"]
      },
      {
        question: "How do I revoke access to a file?",
        answer: "To revoke file access:\n1. Go to 'Shared Files'\n2. Find the file\n3. Click 'Revoke' next to the wallet address\n4. Confirm\n\nAccess is revoked instantly, and the user gets notified in real-time.",
        keywords: ["revoke", "remove access", "stop sharing", "cancel"]
      },
      {
        question: "What is the maximum file size?",
        answer: "Currently, you can upload files up to 100MB per file. For larger files, we recommend:\n• Splitting into smaller parts\n• Using compression\n• Contacting support for enterprise solutions\n\nStorage limits depend on your plan.",
        keywords: ["file size", "maximum", "limit", "large files"]
      }
    ]
  },
  {
    category: "Emergency Access",
    questions: [
      {
        question: "What is Emergency Access Mode?",
        answer: "Emergency Access Mode allows trusted contacts to access your files if you're inactive for a specified period. Perfect for:\n• Digital inheritance\n• Business continuity\n• Medical emergencies\n• Lost access recovery\n\nYou set:\n1. Trusted wallet addresses\n2. Inactivity period (e.g., 30 days)\n3. Access scope (full vault or specific files)\n\nYour trusted contacts can only access after the inactivity period!",
        keywords: ["emergency", "access", "inheritance", "recovery", "backup"]
      },
      {
        question: "How do I set up Emergency Access?",
        answer: "Setting up Emergency Access:\n1. Go to 'Emergency Access' page\n2. Enter trusted wallet address(es)\n3. Choose 'Full Vault' or specific files\n4. Set inactivity period (in days)\n5. Click 'Add to trusted list'\n6. Confirm setup\n\nYour trusted contacts will be notified only if you're inactive for the set period.",
        keywords: ["setup emergency", "configure", "trusted contacts"]
      }
    ]
  },
  {
    category: "Team Workspace",
    questions: [
      {
        question: "What are Team Workspaces?",
        answer: "Team Workspaces enable collaboration:\n• Create teams with multiple members\n• Share files within the team\n• Assign roles (Owner, Admin, Editor, Viewer)\n• Collaborate securely with role-based permissions\n• Track team activity\n\nPerfect for businesses, DAOs, and collaborative projects!",
        keywords: ["team", "workspace", "collaboration", "group", "organization"]
      },
      {
        question: "What are the different roles in a workspace?",
        answer: "Workspace roles:\n\n• **Owner**: Full control, can delete workspace\n• **Admin**: Manage members, edit files\n• **Editor**: Upload and edit files\n• **Viewer**: View files only\n\nOwners can change member roles anytime.",
        keywords: ["roles", "permissions", "owner", "admin", "editor", "viewer"]
      }
    ]
  },
  {
    category: "SDK & Integration",
    questions: [
      {
        question: "Does BlockRoll have an SDK?",
        answer: "Yes! BlockRoll provides multiple integration options:\n\n• **React SDK**: For React applications\n• **Vue SDK**: For Vue.js applications\n• **CDN Bundle**: Simple <script> tag integration\n• **REST API**: For any backend\n\nAll available in the BlockRoll Kit package!",
        keywords: ["sdk", "integration", "api", "developer", "code"]
      },
      {
        question: "How do I get an API key?",
        answer: "To get an API key:\n1. Go to 'SDK & Integration' page\n2. Click 'Generate API Key'\n3. Select SDK type (React/Vue/CDN/Custom)\n4. Choose permissions (upload, read, share, etc.)\n5. Copy your key (shown only once!)\n\nThen use it in your code:\n```javascript\nimport BlockRoll from '@blockroll/sdk';\nconst client = new BlockRoll('your-api-key');\n```",
        keywords: ["api key", "developer", "sdk", "integration", "code"]
      }
    ]
  },
  {
    category: "Pricing & Storage",
    questions: [
      {
        question: "Is BlockRoll free?",
        answer: "BlockRoll offers:\n• **Free Tier**: Basic features, limited storage\n• **Pro**: More storage, advanced features\n• **Enterprise**: Custom solutions, dedicated support\n\nCheck our website for current pricing details!",
        keywords: ["free", "price", "cost", "pricing", "plans"]
      },
      {
        question: "How much storage do I get?",
        answer: "Storage depends on your plan:\n• Free: 5 GB\n• Pro: 100 GB\n• Enterprise: Custom (TB scale)\n\nAll plans include:\n• Unlimited file shares\n• Real-time notifications\n• AI Guardian security\n• Emergency access mode",
        keywords: ["storage", "space", "capacity", "limit"]
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        question: "What is BlockDAG?",
        answer: "BlockDAG is the blockchain network powering BlockRoll. It's a Directed Acyclic Graph (DAG) based blockchain that provides:\n• Faster transactions than traditional blockchains\n• Lower fees\n• Higher scalability\n• Parallel processing\n\nYour file metadata is stored on BlockDAG for immutability.",
        keywords: ["blockdag", "blockchain", "dag", "network", "chain"]
      },
      {
        question: "What is IPFS?",
        answer: "IPFS (InterPlanetary File System) is where your encrypted files are stored. Benefits:\n• Decentralized storage (no single point of failure)\n• Content addressing (files verified by hash)\n• Redundant storage across network\n• Censorship resistant\n\nYour files are encrypted BEFORE being stored on IPFS!",
        keywords: ["ipfs", "storage", "decentralized", "where stored"]
      },
      {
        question: "Is my data decentralized?",
        answer: "Yes! BlockRoll is fully decentralized:\n• Files stored on IPFS (decentralized storage)\n• Metadata stored on BlockDAG (blockchain)\n• No central server can access your files\n• Non-custodial architecture\n• You control all keys\n\nEven if BlockRoll goes offline, your files remain accessible!",
        keywords: ["decentralized", "distributed", "blockchain", "ipfs"]
      }
    ]
  },
  {
    category: "Automation",
    questions: [
      {
        question: "What automation features does BlockRoll have?",
        answer: "BlockRoll offers powerful automation:\n\n• **Auto-Backup**: Automatic weekly backups\n• **Auto-Notify**: Notifications on file updates\n• **Auto-Revoke**: Automatically revoke expired shares\n• **Auto-Expire**: Files auto-expire after set date\n\nConfigure automations in the 'Automation' section!",
        keywords: ["automation", "automatic", "auto", "scheduled"]
      }
    ]
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        question: "I can't connect my wallet",
        answer: "Wallet connection troubleshooting:\n\n1. **Check wallet extension**: Ensure MetaMask/wallet is installed and unlocked\n2. **Network**: Switch to BlockDAG network in your wallet\n3. **Browser**: Try a different browser (Chrome recommended)\n4. **Clear cache**: Clear browser cache and try again\n5. **Update wallet**: Ensure wallet extension is up to date\n\nStill having issues? Contact support!",
        keywords: ["wallet", "connect", "connection", "problem", "issue", "error"]
      },
      {
        question: "Where can I get help?",
        answer: "Get help from BlockRoll:\n\n• **WhatsApp Bot**: Chat with me! (AI-powered)\n• **Discord**: Join our community server\n• **Email**: support@blockroll.io\n• **Documentation**: https://docs.blockroll.io\n• **FAQ Page**: On our website\n• **Dashboard Help**: Click the ? icon\n\nWe're here to help 24/7!",
        keywords: ["help", "support", "contact", "assistance", "question"]
      }
    ]
  },
  {
    category: "Features",
    questions: [
      {
        question: "What is SafeVault?",
        answer: "SafeVault is your private file storage area where:\n• All files are encrypted\n• Only you can access\n• Organized with tags and search\n• Track file access history\n• Set expiry dates\n• Emergency access available\n\nThink of it as your personal encrypted vault!",
        keywords: ["safevault", "vault", "storage", "private"]
      },
      {
        question: "Can I set expiry dates for files?",
        answer: "Yes! You can set expiry dates when uploading or sharing files:\n1. Upload/share file\n2. Set expiry date (calendar picker)\n3. File automatically expires on that date\n4. Access is revoked automatically\n5. Notification sent before expiry\n\nPerfect for temporary shares or time-sensitive documents!",
        keywords: ["expiry", "expire", "temporary", "time limit", "date"]
      },
      {
        question: "What notifications will I receive?",
        answer: "You'll get real-time notifications for:\n• File uploaded successfully\n• File shared with someone\n• File shared with you\n• Access granted/revoked\n• Security alerts\n• File expiring soon\n• File expired\n• Workspace invitations\n• API key created\n• System announcements\n\nAll delivered instantly via WebSocket!",
        keywords: ["notifications", "alerts", "messages", "updates"]
      }
    ]
  },
  {
    category: "Developers",
    questions: [
      {
        question: "How do I integrate BlockRoll into my app?",
        answer: "Integrate BlockRoll in your app:\n\n**Option 1: React SDK**\n```javascript\nimport BlockRoll from '@blockroll/react';\nconst client = new BlockRoll('your-api-key');\nawait client.upload(file);\n```\n\n**Option 2: CDN**\n```html\n<script src=\"https://cdn.blockroll.io/sdk.js\"></script>\n```\n\n**Option 3: REST API**\n```bash\ncurl -X POST https://api.blockroll.io/v1/file/upload \\\n  -H \"x-api-key: your-key\" \\\n  -F \"file=@document.pdf\"\n```\n\nSee developers page for full documentation!",
        keywords: ["integrate", "development", "code", "api", "sdk", "developer"]
      },
      {
        question: "What programming languages are supported?",
        answer: "BlockRoll supports:\n• **JavaScript/TypeScript**: React, Vue, Node.js\n• **Any language**: Via REST API\n• **No-code**: CDN integration\n\nSDKs available:\n• @blockroll/react\n• @blockroll/vue\n• @blockroll/js (vanilla JavaScript)\n\nREST API works with Python, Go, Java, PHP, etc.!",
        keywords: ["language", "programming", "javascript", "typescript", "python"]
      }
    ]
  },
  {
    category: "Blockchain",
    questions: [
      {
        question: "Do I need cryptocurrency?",
        answer: "You need a small amount of BlockDAG tokens for:\n• File metadata storage on blockchain\n• Transaction fees (very low!)\n\nTypical costs:\n• Upload file: ~0.0001 BDAG\n• Share file: ~0.00005 BDAG\n• Revoke access: ~0.00005 BDAG\n\nFile storage on IPFS is free!",
        keywords: ["crypto", "cryptocurrency", "cost", "fee", "tokens", "bdag"]
      },
      {
        question: "What is a wallet address?",
        answer: "A wallet address is your Web3 identity, like:\n0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\n\nIn BlockRoll:\n• Your wallet = Your account\n• Share files by wallet address\n• Receive files to your wallet\n• No email needed!\n\nWallet addresses start with '0x' and are 42 characters long.",
        keywords: ["wallet address", "0x", "ethereum", "address"]
      }
    ]
  }
];

/**
 * Get all FAQ items (flattened)
 */
export function getAllFAQs(): FAQItem[] {
  return BLOCKROLL_KNOWLEDGE_BASE.flatMap(category => category.questions);
}

/**
 * Search FAQs by keyword
 */
export function searchFAQs(query: string): FAQItem[] {
  const lowercaseQuery = query.toLowerCase();
  const allFAQs = getAllFAQs();

  return allFAQs.filter(faq => 
    faq.keywords.some(keyword => lowercaseQuery.includes(keyword)) ||
    faq.question.toLowerCase().includes(lowercaseQuery) ||
    faq.answer.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: string): FAQItem[] {
  const cat = BLOCKROLL_KNOWLEDGE_BASE.find(
    c => c.category.toLowerCase() === category.toLowerCase()
  );
  return cat ? cat.questions : [];
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return BLOCKROLL_KNOWLEDGE_BASE.map(cat => cat.category);
}

