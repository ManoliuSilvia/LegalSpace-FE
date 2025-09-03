import { useState } from "react";
import { Chip, TableCell, TableRow, Menu, MenuItem, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { userStore } from "../../stores/userStore";

import { BackgroundColors } from "../../constants/colors";

import { Typography1, Typography2 } from "../typography/Typography";
import { getStatusColor } from "../../utils/getColors";
import { CaseStatuses, Roles, type Case } from "../../utils/models";
import PrimaryButton from "../buttons/PrimaryButton";
import { RateLawyerModal } from "../modals/RateLawyerModal";

interface Action {
  label: string;
  handler: (caseItem: Case) => void;
}

interface CaseRowProps {
  caseItem: Case;
  actions: Action[];
}

export const CaseRow = ({ caseItem, actions }: CaseRowProps) => {
  const { user } = userStore();
  const isClient = user?.role === Roles.CLIENT;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rateLawyerModalOpen, setRateLawyerModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRateLawyer = () => {
    setRateLawyerModalOpen(true);
  };

  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": {
            border: 0,
          },
        }}
      >
        <TableCell>
          <Typography2 fontWeight="400">{caseItem.title}</Typography2>
        </TableCell>
        <TableCell>
          <Typography2 fontWeight="400">{caseItem.category}</Typography2>
        </TableCell>
        <TableCell>
          <Typography2 fontWeight="400">
            {caseItem.lawyer ? `${caseItem.lawyer.lastName} ${caseItem.lawyer.firstName}` : "-"}
          </Typography2>
        </TableCell>
        <TableCell>
          <Chip label={caseItem.status} color={getStatusColor(caseItem.status)} size="small" variant="outlined" />
        </TableCell>
        <TableCell>
          <Typography2 fontWeight="400">
            {new Date(caseItem.createdAt).toLocaleDateString("ro-RO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography2>
        </TableCell>
        <TableCell align="right" sx={{ width: "1%", whiteSpace: "nowrap" }}>
          {isClient && caseItem.status === CaseStatuses.COMPLETED && (
            <PrimaryButton onClick={handleRateLawyer} color="gold" sx={{ width: "80px" }}>
              Rate
            </PrimaryButton>
          )}
          {isClient && caseItem.status === CaseStatuses.TAKEN && (
            <PrimaryButton onClick={handleClick} color="gold" sx={{ width: "80px" }}>
              Contact
            </PrimaryButton>
          )}
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
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
            sx={menuStyling}
          >
            {actions.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  action.handler(caseItem);
                  handleClose();
                }}
                disabled={action.label === "Complete Case" && caseItem.status !== CaseStatuses.TAKEN}
              >
                <Typography1 fontWeight="400">{action.label}</Typography1>
              </MenuItem>
            ))}
          </Menu>
        </TableCell>
      </TableRow>
      <RateLawyerModal
        open={rateLawyerModalOpen}
        onClose={() => setRateLawyerModalOpen(false)}
        lawyer={caseItem.lawyer}
      />
    </>
  );
};

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
