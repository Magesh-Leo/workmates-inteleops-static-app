import { useState } from "react";

const integrations = [
  {
    name: "Slack",
    icon: "fab fa-slack",
    color: "#4A154B",
    description: "Send campaign notifications directly to Slack channels.",
    button: "Connect now",
  },
  {
    name: "Gmail",
    icon: "fab fa-google",
    color: "#EA4335",
    description: "Integrate with Gmail for seamless email management.",
    button: "Connect now",
  },
  {
    name: "Microsoft Teams",
    icon: "fab fa-microsoft",
    color: "#6264A7",
    description: "Connect with Teams for collaboration and notifications.",
    button: "Connect now",
  },
  {
    name: "Zoho Desk",
    icon: "fas fa-ticket-alt",
    color: "#C83E2D",
    description: "Manage support tickets and customer queries with Zoho Desk.",
    button: "Connect now",
  },
  {
    name: "Jira",
    icon: "fab fa-atlassian",
    color: "#0052CC",
    description: "Track issues and manage projects with Jira integration.",
    button: "Connect now",
  },
  {
    name: "Webhook",
    icon: "fas fa-link",
    color: "#2563eb",
    description:
      "Notify external services when an event occurs in your workspace.",
    button: "Connect now",
  },
  {
    name: "HeyReach API",
    icon: "fas fa-code",
    color: "#16a34a",
    description: "Connect HeyReach with your outbound stack in seconds.",
    button: "Get API key",
  },
  {
    name: "Clay",
    icon: "fas fa-database",
    color: "#9333ea",
    description: "Get enriched leads from Clay into HeyReach.",
    button: "Connect now",
  },
  {
    name: "RB2B",
    icon: "fas fa-users",
    color: "#f59e0b",
    description: "Get leads from RB2B into HeyReach.",
    button: "Connect now",
  },
  {
    name: "Zapier",
    icon: "fas fa-bolt",
    color: "#e11d48",
    description: "Automate workflows by connecting HeyReach with Zapier.",
    button: "Connect now",
  },
  {
    name: "Hubspot",
    icon: "fas fa-hubspot",
    color: "#ea580c",
    description: "Sync contacts and data seamlessly with Hubspot.",
    button: "Connect now",
  },
  {
    name: "Salesforce",
    icon: "fas fa-cloud",
    color: "#3b82f6",
    description: "Push leads and sync CRM data with Salesforce.",
    button: "Connect now",
  },
];

export default function NotificationPage() {
  const [query, setQuery] = useState("");

  const filtered = integrations.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">Integrations</h1>
      <p className="text-gray-600 mb-6">
        Seamlessly connect your tools in one place.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search integrations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((platform) => (
          <div
            key={platform.name}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex items-center mb-3">
              <i
                className={platform.icon}
                style={{ color: platform.color, fontSize: "20px" }}
              ></i>
              <h2 className="ml-3 font-semibold text-gray-800">
                {platform.name}
              </h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {platform.description}
            </p>
            <button className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              {platform.button}
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 col-span-full">
            No integrations found.
          </p>
        )}
      </div>
    </div>
  );
}
