import { 
  type User, 
  type InsertUser,
  type Platform,
  type InsertPlatform,
  type Integration,
  type InsertIntegration,
  type Ticket,
  type InsertTicket,
  type AutomationRule,
  type InsertAutomationRule,
  type ManagedAccount,
  type InsertManagedAccount
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Platforms
  getAllPlatforms(): Promise<Platform[]>;
  getPlatform(id: string): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;

  // Integrations
  getAllIntegrations(): Promise<Integration[]>;
  getIntegration(id: string): Promise<Integration | undefined>;
  getIntegrationsByPlatform(platformId: string): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, integration: Partial<Integration>): Promise<Integration | undefined>;

  // Tickets
  getAllTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  getTicketsByStatus(status: string): Promise<Ticket[]>;
  getTicketsByPlatform(platformId: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: Partial<Ticket>): Promise<Ticket | undefined>;

  // Automation Rules
  getAllAutomationRules(): Promise<AutomationRule[]>;
  getAutomationRule(id: string): Promise<AutomationRule | undefined>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: string, rule: Partial<AutomationRule>): Promise<AutomationRule | undefined>;

  // Managed Accounts
  getAllManagedAccounts(): Promise<ManagedAccount[]>;
  getManagedAccount(id: string): Promise<ManagedAccount | undefined>;
  createManagedAccount(account: InsertManagedAccount): Promise<ManagedAccount>;
  updateManagedAccount(id: string, account: Partial<ManagedAccount>): Promise<ManagedAccount | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private platforms: Map<string, Platform>;
  private integrations: Map<string, Integration>;
  private tickets: Map<string, Ticket>;
  private automationRules: Map<string, AutomationRule>;
  private managedAccounts: Map<string, ManagedAccount>;

  constructor() {
    this.users = new Map();
    this.platforms = new Map();
    this.integrations = new Map();
    this.tickets = new Map();
    this.automationRules = new Map();
    this.managedAccounts = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize default platforms
    const defaultPlatforms: Platform[] = [
      {
        id: "jira-platform",
        name: "Jira",
        type: "ticketing",
        icon: "fab fa-jira",
        color: "#0052CC",
        isActive: true,
      },
      {
        id: "servicenow-platform",
        name: "ServiceNow",
        type: "ticketing",
        icon: "fas fa-mountain",
        color: "#62D84E",
        isActive: true,
      },
      {
        id: "zoho-platform",
        name: "Zoho",
        type: "ticketing",
        icon: "fas fa-z",
        color: "#E94D36",
        isActive: true,
      }
    ];

    defaultPlatforms.forEach(platform => {
      this.platforms.set(platform.id, platform);
    });

    // Initialize sample integrations
    const sampleIntegrations: Integration[] = [
      {
        id: "jira-integration-1",
        platformId: "jira-platform",
        name: "Jira Production",
        apiEndpoint: "https://company.atlassian.net",
        username: "api@company.com",
        apiToken: "encrypted_token_123",
        config: { autoAssign: true, priorityEscalation: true },
        isActive: true,
        lastSync: new Date(),
        createdAt: new Date(),
      },
      {
        id: "servicenow-integration-1",
        platformId: "servicenow-platform",
        name: "ServiceNow Instance",
        apiEndpoint: "https://dev123456.service-now.com",
        username: "admin",
        apiToken: "encrypted_token_456",
        config: { autoAssign: true, priorityEscalation: true },
        isActive: true,
        lastSync: new Date(),
        createdAt: new Date(),
      },
      {
        id: "zoho-integration-1",
        platformId: "zoho-platform",
        name: "Zoho Desk",
        apiEndpoint: "https://desk.zoho.com",
        username: "support@company.com",
        apiToken: "encrypted_token_789",
        config: { autoAssign: true, priorityEscalation: false },
        isActive: true,
        lastSync: new Date(),
        createdAt: new Date(),
      }
    ];

    sampleIntegrations.forEach(integration => {
      this.integrations.set(integration.id, integration);
    });

    // Initialize sample tickets
    const sampleTickets: Ticket[] = [
      {
        id: "ticket-1",
        ticketNumber: "TK-2024",
        subject: "Email configuration issue",
        description: "User unable to configure email client",
        priority: "medium",
        status: "in_progress",
        assignedTo: "Auto-Bot",
        platformId: "jira-platform",
        integrationId: "jira-integration-1",
        accountId: null,
        isAutomated: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(),
        resolvedAt: null,
      },
      {
        id: "ticket-2",
        ticketNumber: "TK-2023",
        subject: "Password reset request",
        description: "User forgot password and needs reset",
        priority: "low",
        status: "resolved",
        assignedTo: "Auto-Bot",
        platformId: "servicenow-platform",
        integrationId: "servicenow-integration-1",
        accountId: null,
        isAutomated: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: "ticket-3",
        ticketNumber: "TK-2022",
        subject: "VPN connection problem",
        description: "Unable to connect to company VPN",
        priority: "high",
        status: "escalated",
        assignedTo: "Manual Review",
        platformId: "zoho-platform",
        integrationId: "zoho-integration-1",
        accountId: null,
        isAutomated: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        resolvedAt: null,
      }
    ];

    sampleTickets.forEach(ticket => {
      this.tickets.set(ticket.id, ticket);
    });

    // Initialize admin user
    const adminUser: User = {
      id: "admin-user",
      username: "admin",
      email: "admin@company.com",
      password: "hashed_password",
      role: "admin",
      firstName: "John",
      lastName: "Smith",
      createdAt: new Date(),
    };

    this.users.set(adminUser.id, adminUser);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      role: insertUser?.role || "agent",
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Platform methods
  async getAllPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async getPlatform(id: string): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = randomUUID();
    const platform: Platform = { ...insertPlatform, isActive: insertPlatform?.isActive || true, id };
    this.platforms.set(id, platform);
    return platform;
  }

  // Integration methods
  async getAllIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async getIntegration(id: string): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async getIntegrationsByPlatform(platformId: string): Promise<Integration[]> {
    return Array.from(this.integrations.values()).filter(
      integration => integration.platformId === platformId
    );
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = randomUUID();
    const integration: Integration = { 
      ...insertIntegration,
      username: insertIntegration?.username || "",
      isActive: insertIntegration?.isActive || true,
      config: insertIntegration?.config,
      id, 
      lastSync: null,
      createdAt: new Date() 
    };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: string, update: Partial<Integration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    
    const updated = { ...integration, ...update };
    this.integrations.set(id, updated);
    return updated;
  }

  // Ticket methods
  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.status === status);
  }

  async getTicketsByPlatform(platformId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.platformId === platformId);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticket: Ticket = { 
      ...insertTicket, 
      status: insertTicket?.status || "open",
      platformId: insertTicket?.platformId || "",
      description: insertTicket?.description || "",
      priority: insertTicket?.priority || "medium",
      assignedTo: insertTicket?.assignedTo || "",
      integrationId: insertTicket?.integrationId || "",
      accountId: insertTicket?.accountId || "",
      isAutomated: insertTicket?.isAutomated || false,
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: string, update: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updated = { 
      ...ticket, 
      ...update, 
      updatedAt: new Date(),
      resolvedAt: update.status === 'resolved' ? new Date() : ticket.resolvedAt
    };
    this.tickets.set(id, updated);
    return updated;
  }

  // Automation Rule methods
  async getAllAutomationRules(): Promise<AutomationRule[]> {
    return Array.from(this.automationRules.values());
  }

  async getAutomationRule(id: string): Promise<AutomationRule | undefined> {
    return this.automationRules.get(id);
  }

  async createAutomationRule(insertRule: InsertAutomationRule): Promise<AutomationRule> {
    const id = randomUUID();
    const rule: AutomationRule = { 
      ...insertRule, 
      description: insertRule?.description || "",
      isActive: insertRule?.isActive || true,
      priority: insertRule?.priority || 1,
      platformId: insertRule?.platformId || "",
      id, 
      createdAt: new Date() 
    };
    this.automationRules.set(id, rule);
    return rule;
  }

  async updateAutomationRule(id: string, update: Partial<AutomationRule>): Promise<AutomationRule | undefined> {
    const rule = this.automationRules.get(id);
    if (!rule) return undefined;
    
    const updated = { ...rule, ...update };
    this.automationRules.set(id, updated);
    return updated;
  }

  // Managed Account methods
  async getAllManagedAccounts(): Promise<ManagedAccount[]> {
    return Array.from(this.managedAccounts.values());
  }

  async getManagedAccount(id: string): Promise<ManagedAccount | undefined> {
    return this.managedAccounts.get(id);
  }

  async createManagedAccount(insertAccount: InsertManagedAccount): Promise<ManagedAccount> {
    const id = randomUUID();
    const account: ManagedAccount = { 
      ...insertAccount, 
      industry: insertAccount?.industry || "",
      contactPhone: insertAccount?.contactPhone || "",
      expectedVolume: insertAccount?.expectedVolume || "",
      currentPlatforms: insertAccount?.currentPlatforms || [],
      specialRequirements: insertAccount?.specialRequirements || "",
      onboardingStatus: insertAccount?.onboardingStatus || "pending",
      onboardingStep: insertAccount?.onboardingStep || 1,
      id, 
      createdAt: new Date() 
    };
    this.managedAccounts.set(id, account);
    return account;
  }

  async updateManagedAccount(id: string, update: Partial<ManagedAccount>): Promise<ManagedAccount | undefined> {
    const account = this.managedAccounts.get(id);
    if (!account) return undefined;
    
    const updated = { ...account, ...update };
    this.managedAccounts.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
