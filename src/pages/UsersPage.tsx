import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { deleteUser, getAllUsers } from "../services/usersService";

import { BackgroundColors, GeneralColors } from "../constants/colors";

import { type User } from "../utils/models";
import { Card, CardContent, FlexColumn } from "../styles/StyledComponents";
import { Subtitle1, Title1 } from "../components/typography/Titles";
import { Typography1, Typography2 } from "../components/typography/Typography";
import { ViewUserModal } from "../components/modals/ViewUserModal";
import { EditUserModal } from "../components/modals/EditUserModal";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<{ element: HTMLElement | null; user: User | null }>({
    element: null,
    user: null,
  });

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const open = Boolean(anchorEl.element);

  const handleClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl({ element: event.currentTarget, user });
  };

  const handleClose = () => {
    setAnchorEl({ element: null, user: null });
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
    handleClose();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
    handleClose();
  };

  const handleDeleteUser = async (user: User) => {
    if (!user.id) return;
    await deleteUser(user.id);
    fetchUsers();
    handleClose();
  };

  const userActions = [
    {
      label: "View",
      handler: handleViewUser,
    },
    {
      label: "Edit",
      handler: handleEditUser,
    },
    {
      label: "Delete",
      handler: handleDeleteUser,
    },
  ];

  return (
    <FlexColumn gap="24px">
      <FlexColumn>
        <Title1>All Users</Title1>
        <Subtitle1>See all users that are using this app</Subtitle1>
      </FlexColumn>

      <Card style={{ maxHeight: "calc(100vh - 250px)", display: "flex", flexDirection: "column" }}>
        <CardContent style={{ height: "100%", overflow: "hidden" }}>
          {loading ? (
            <CircularProgress size={40} sx={{ color: GeneralColors.Gold }} />
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                flexGrow: 1,
                overflow: "auto",
                maxHeight: "100%",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {headerTitles.map((title, index) => (
                      <TableCell
                        key={index}
                        align={index === headerTitles.length - 1 ? "right" : "left"}
                        sx={index === headerTitles.length - 1 ? { width: "1%" } : {}}
                      >
                        <Typography1 fontWeight="500">{title}</Typography1>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell>
                        <Typography2 fontWeight="400">{`${user.lastName} ${user.firstName}`}</Typography2>
                      </TableCell>
                      <TableCell>
                        <Typography2 fontWeight="400">{user.role}</Typography2>
                      </TableCell>
                      <TableCell>
                        <Typography2 fontWeight="400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("ro-RO", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </Typography2>
                      </TableCell>
                      <TableCell align="right" sx={{ width: "1%", whiteSpace: "nowrap" }}>
                        <IconButton onClick={(event) => handleClick(event, user)}>
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl.element}
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
                          sx={menuStyling}
                        >
                          {userActions.map((action, index) => (
                            <MenuItem
                              key={index}
                              onClick={() => {
                                action.handler(anchorEl.user!);
                                handleClose();
                              }}
                            >
                              <Typography1 fontWeight="400">{action.label}</Typography1>
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      <ViewUserModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} selectedUser={selectedUser} />
      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        selectedUser={selectedUser}
        refetchUsers={fetchUsers}
      />
    </FlexColumn>
  );
}

const headerTitles = ["Name", "Role", "Created on", "Actions"];

const menuStyling = {
  width: "250px",
  "& .MuiMenuItem-root": {
    padding: "8px 16px",
    width: "250px",
  },
  "& .MuiMenuItem-root:hover": {
    backgroundColor: BackgroundColors.LightGray,
  },
};
