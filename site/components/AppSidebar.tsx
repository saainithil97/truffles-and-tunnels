"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  day3Parts,
  findDay3Item,
  days,
} from "@/lib/curriculum";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="px-2 py-1.5">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Workshop
          </div>
          <div className="mt-0.5 text-sm font-semibold">
            Truffles &amp; Tunnels
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Days</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {days.map((d) => {
                const href = `/days/${d.num}`;
                const active =
                  pathname === href || pathname.startsWith(href + "/");
                return (
                  <SidebarMenuItem key={d.num}>
                    <SidebarMenuButton
                      isActive={active}
                      render={
                        <Link href={href}>
                          <span className="font-mono text-xs text-muted-foreground">
                            0{d.num}
                          </span>
                          <span>{shortDayLabel(d.num)}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Day 3 demo nav — only visible while the user is in Day 3 territory. */}
        {pathname.startsWith("/days/3") &&
          day3Parts.map((part) => (
            <SidebarGroup key={part.heading}>
              <SidebarGroupLabel className="text-[10px] leading-tight">
                {part.heading}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {part.demoSlugs.map((slug) => {
                    const item = findDay3Item(slug);
                    if (!item) return null;
                    const href =
                      slug === "verbal-segments"
                        ? "/days/3/verbal-segments"
                        : `/days/3/demos/${slug}`;
                    const active = pathname === href;
                    return (
                      <SidebarMenuItem key={slug}>
                        <SidebarMenuButton
                          isActive={active}
                          size="sm"
                          render={
                            <Link href={href}>
                              <span className="truncate">
                                {item.shortTitle}
                              </span>
                            </Link>
                          }
                        />
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function shortDayLabel(num: number): string {
  switch (num) {
    case 1:
      return "Swiggy & the web";
    case 2:
      return "Git & Vercel";
    case 3:
      return "Demystifying frontend";
    default:
      return `Day ${num}`;
  }
}
