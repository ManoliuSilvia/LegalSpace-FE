import { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, IconButton, Divider } from "@mui/material";
import {
  HomeOutlined,
  DescriptionOutlined,
  Balance,
  PeopleOutlined,
  SettingsOutlined,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

import { userStore } from "../../stores/userStore";

import { GeneralColors, TextColors } from "../../constants/colors";

import { Typography1 } from "../typography/Typography";
import { Subtitle1 } from "../typography/Titles";
import { Roles } from "../../utils/models";

const clientNavigationItems = [
  { name: "Dashboard", href: "/", icon: HomeOutlined },
  { name: "Submit Case", href: "/submit-case", icon: Balance },
  { name: "My Cases", href: "/my-cases", icon: DescriptionOutlined },
  { name: "Lawyers", href: "/lawyers", icon: PeopleOutlined },
  { name: "Chats", href: "/chats", icon: PeopleOutlined },
  { name: "Settings", href: "/settings", icon: SettingsOutlined },
];

const lawyerNavigationItems = [
  { name: "Dashboard", href: "/", icon: HomeOutlined },
  { name: "Available Cases", href: "/cases", icon: Balance },
  { name: "My Cases", href: "/my-cases", icon: DescriptionOutlined },
  { name: "Lawyers", href: "/lawyers", icon: PeopleOutlined },
  { name: "Chats", href: "/chats", icon: PeopleOutlined },
  { name: "Settings", href: "/settings", icon: SettingsOutlined },
];

const adminNavigationItems = [
  { name: "Dashboard", href: "/", icon: HomeOutlined },
  { name: "Users", href: "/users", icon: PeopleOutlined },
  { name: "Cases", href: "/my-cases", icon: DescriptionOutlined },
  { name: "Settings", href: "/settings", icon: SettingsOutlined },
];

export function Sidebar() {
  const { user } = userStore();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const drawerWidth = collapsed ? 60 : 260;

  let navigationItems;
  switch (user?.role) {
    case Roles.LAWYER:
      navigationItems = lawyerNavigationItems;
      break;
    case Roles.ADMIN:
      navigationItems = adminNavigationItems;
      break;
    default:
      navigationItems = clientNavigationItems;
      break;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.5s",
        },
      }}
    >
      <HeaderContainer collapsed={collapsed}>
        {!collapsed && (
          <LogoContainer>
            <Balance sx={{ fontSize: 32 }} />
          </LogoContainer>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </HeaderContainer>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.name} disablePadding>
              <NavLink
                to={item.href}
                style={{ textDecoration: "none", width: "100%" }}
                children={({ isActive }) => (
                  <ListItemButton
                    sx={{
                      borderRadius: 1,
                      justifyContent: collapsed ? "center" : "flex-start",
                      padding: "16px 8px",
                      transition: "all 0.3s",
                    }}
                    TouchRippleProps={{
                      style: {
                        color: GeneralColors.Gold,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? "auto" : 40,
                        justifyContent: "center",
                        color: isActive ? TextColors.Primary : TextColors.Subtitle,
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    {!collapsed &&
                      (isActive ? <Typography1>{item.name}</Typography1> : <Subtitle1>{item.name}</Subtitle1>)}
                  </ListItemButton>
                )}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

const HeaderContainer = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? "center" : "space-between")};
  height: 64px;
  padding: 0 16px;
  margin: 0;
  box-shadow: none;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
