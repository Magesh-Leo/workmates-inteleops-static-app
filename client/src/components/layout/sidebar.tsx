import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Inbox,
  Bot,
  Plug,
  Layers,
  Building,
  Users,
  Brain,
  Share2,
  Bell,
} from "lucide-react";

const navigation = [
  {
    name: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Tickets", href: "/tickets", icon: Inbox },
      { name: "Automation Rules", href: "/automation", icon: Bot },
    ],
  },
  {
    name: "Integration",
    items: [
      { name: "API Connections", href: "/integrations", icon: Plug },
      { name: "Platforms", href: "/platforms", icon: Layers },
      { name: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    name: "Management",
    items: [
      { name: "Managed Accounts", href: "/accounts", icon: Building },
      { name: "User Management", href: "/users", icon: Users },
    ],
  }
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div
      className={cn(
        "group h-screen bg-white shadow-lg border-r border-neutral-border flex flex-col transition-all duration-300 w-20 hover:w-64"
      )}
    >
      {/* w-20 hover:w-64 */}
      {/* Logo Section */}
      {/*<div className="flex items-center p-4 bg-white">*/}{" "}
      {/* bg-gradient-to-r from-workmates-blue to-workmates-orange */}
      {/* <div className="w-32 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center overflow-hidden"> */}
      {/* <img
            src="https://cloudworkmates.com/wp-content/uploads/2025/03/Web-Main-Logo-1.png"
            alt="Workmates Logo"
            className="h-12 w-auto object-contain"
          /> */}
      {/* </div> */}
      {/* Text only shows on hover */}
      {/* <div className="ml-3 hidden group-hover:block transition-all duration-300">
          <span className="text-xl font-bold text-white block">Workmates</span>
          <span className="text-sm text-white/80 font-medium">IntelliOps</span>
        </div> */}
      {/* </div> */}
      {/* Navigation */}
      <nav className="p-3 space-y-2 flex-1 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.name} className="mb-4">
            {/* Section name hidden by default, shows on hover */}
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 hidden group-hover:block">
              {section.name}
            </p>
            {/* hidden group-hover:block */}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  // <li key={item.name}>
                  //   <Link href={item.href}>
                  //     <a
                  //       className={cn(
                  //         "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                  //         isActive
                  //           ? "bg-blue-50 text-workmates-primary"
                  //           : "text-text-secondary hover:bg-gray-50"
                  //       )}
                  //     >{/* border-l-4 border-workmates-primary */}
                  //       {/* Always visible */}
                  //       <Icon className="w-5 h-5 min-w-[20px]" />
                  //       {/* Label only on hover */}
                  //       <span className="ml-3 hidden group-hover:inline"> {/* hidden group-hover:inline */}
                  //         {item.name}
                  //       </span>
                  //     </a>
                  //   </Link>
                  // </li>
                  <li key={item.name}>
                    <Link href={item.href}>
                      <a
                        className={cn(
                          "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors group",
                          isActive
                            ? "bg-blue-50 text-workmates-primary"
                            : "text-text-secondary hover:bg-gray-50"
                        )}
                      >
                        {/* Icon wrapper */}
                        <span
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg",
                            isActive
                              ? "text-workmates-primary"
                              : " text-gray-400"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </span>

                        {/* Label only on hover */}
                        <span className="ml-3 hidden group-hover:inline">
                          {item.name}
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
