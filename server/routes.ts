import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertPlatformSchema,
  insertIntegrationSchema,
  insertTicketSchema,
  insertAutomationRuleSchema,
  insertManagedAccountSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Platforms
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getAllPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });

  app.post("/api/platforms", async (req, res) => {
    try {
      const platformData = insertPlatformSchema.parse(req.body);
      const platform = await storage.createPlatform(platformData);
      res.status(201).json(platform);
    } catch (error) {
      res.status(400).json({ message: "Invalid platform data" });
    }
  });

  // Integrations
  app.get("/api/integrations", async (req, res) => {
    try {
      const integrations = await storage.getAllIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.get("/api/integrations/platform/:platformId", async (req, res) => {
    try {
      const { platformId } = req.params;
      const integrations = await storage.getIntegrationsByPlatform(platformId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch platform integrations" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const integrationData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(integrationData);
      res.status(201).json(integration);
    } catch (error) {
      res.status(400).json({ message: "Invalid integration data" });
    }
  });

  app.post("/api/integrations/:id/test", async (req, res) => {
    try {
      const { id } = req.params;
      const integration = await storage.getIntegration(id);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      
      // Simulate connection test
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        await storage.updateIntegration(id, { lastSync: new Date() });
        res.json({ success: true, message: "Connection successful" });
      } else {
        res.status(400).json({ success: false, message: "Connection failed: Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Connection test failed" });
    }
  });

  // Tickets
  app.get("/api/tickets", async (req, res) => {
    try {
      const tickets = await storage.getAllTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.get("/api/tickets/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const tickets = await storage.getTicketsByStatus(status);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets by status" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Invalid ticket data" });
    }
  });

  app.patch("/api/tickets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const ticket = await storage.updateTicket(id, updates);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Failed to update ticket" });
    }
  });

  // Automation Rules
  app.get("/api/automation-rules", async (req, res) => {
    try {
      const rules = await storage.getAllAutomationRules();
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch automation rules" });
    }
  });

  app.post("/api/automation-rules", async (req, res) => {
    try {
      const ruleData = insertAutomationRuleSchema.parse(req.body);
      const rule = await storage.createAutomationRule(ruleData);
      res.status(201).json(rule);
    } catch (error) {
      res.status(400).json({ message: "Invalid automation rule data" });
    }
  });

  // Managed Accounts
  app.get("/api/managed-accounts", async (req, res) => {
    try {
      const accounts = await storage.getAllManagedAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch managed accounts" });
    }
  });

  app.post("/api/managed-accounts", async (req, res) => {
    try {
      const accountData = insertManagedAccountSchema.parse(req.body);
      const account = await storage.createManagedAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ message: "Invalid account data" });
    }
  });

  app.patch("/api/managed-accounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const account = await storage.updateManagedAccount(id, updates);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(400).json({ message: "Failed to update account" });
    }
  });

  // Dashboard metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const tickets = await storage.getAllTickets();
      const integrations = await storage.getAllIntegrations();
      
      const totalTickets = tickets.length;
      const automatedTickets = tickets.filter(t => t.isAutomated).length;
      const activeIntegrations = integrations.filter(i => i.isActive).length;
      
      // Calculate average resolution time for resolved tickets
      const resolvedTickets = tickets.filter(t => t.resolvedAt);
      const avgResolutionMs = resolvedTickets.length > 0 
        ? resolvedTickets.reduce((sum, ticket) => {
            const resolutionTime = ticket.resolvedAt!.getTime() - ticket.createdAt!.getTime();
            return sum + resolutionTime;
          }, 0) / resolvedTickets.length
        : 0;
      
      const avgResolutionHours = Math.round(avgResolutionMs / (1000 * 60 * 60) * 10) / 10;

      res.json({
        totalTickets,
        automatedTickets,
        automationRate: totalTickets > 0 ? Math.round((automatedTickets / totalTickets) * 100) : 0,
        avgResolutionHours,
        activeIntegrations,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  const STATIC_USER = {
    username: "admin",
    password: "password123",
  };

  // Static login route
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (username === STATIC_USER.username && password === STATIC_USER.password) {
      return res.json({ success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjkwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
