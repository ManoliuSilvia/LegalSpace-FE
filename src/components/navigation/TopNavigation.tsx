import { useState } from "react";
import styled from "styled-components";
import { AppBar, Toolbar, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { userStore } from "../../stores/userStore";

import { BackgroundColors, BorderColors, TextColors } from "../../constants/colors";

import { Subtitle3, Title2 } from "../typography/Titles";
import { Typography1, Typography2 } from "../typography/Typography";
import { FlexColumn } from "../../styles/StyledComponents";

export function TopNavigation() {
  const { user, logout } = userStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        background: BackgroundColors.White,
        borderBottom: `1px solid ${BorderColors.Primary}`,
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Title2>Legal Case Management</Title2>

        <ActionContainer>
          <UserContainer onClick={handleClick}>
            <Avatar alt="User" sx={{ width: 32, height: 32, fontSize: "14px" }}>
              {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
            </Avatar>

            <FlexColumn>
              <Typography2>{`${user.firstName || ""} ${user.lastName || ""}`}</Typography2>
              <Subtitle3>{user.email}</Subtitle3>
            </FlexColumn>
          </UserContainer>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              width: "250px",
              "& .MuiMenuItem-root": {
                padding: "8px 16px",
                width: "250px",
              },
              "& .MuiMenuItem-root:hover": {
                backgroundColor: BackgroundColors.LightGray,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                navigate("/settings");
                handleClose();
              }}
            >
              <Typography1 fontWeight="400">Settings</Typography1>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: TextColors.Error }}>
              <Typography1 fontWeight="400" color={TextColors.Error}>
                Log out
              </Typography1>
            </MenuItem>
          </Menu>
        </ActionContainer>
      </Toolbar>
    </AppBar>
  );
}

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;
