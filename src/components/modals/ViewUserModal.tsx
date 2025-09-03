import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { Subtitle1, Title1 } from "../typography/Titles";
import { FlexColumn } from "../../styles/StyledComponents";
import { Roles, type User } from "../../utils/models";
import { Typography2 } from "../typography/Typography";
import PrimaryButton from "../buttons/PrimaryButton";

interface ViewUserModalProps {
  open: boolean;
  onClose: () => void;
  selectedUser: User | null;
}

export const ViewUserModal = ({ open, onClose, selectedUser }: ViewUserModalProps) => {
  if (!selectedUser) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Title1>View User</Title1>
      </DialogTitle>

      <DialogContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <FlexColumn>
          <Subtitle1 style={{ marginBottom: "8px" }}>Name</Subtitle1>
          <Typography2 fontWeight="400">{`${selectedUser.lastName} ${selectedUser.firstName}`}</Typography2>
        </FlexColumn>
        <FlexColumn>
          <Subtitle1 style={{ marginBottom: "8px" }}>Email</Subtitle1>
          <Typography2 fontWeight="400">{selectedUser.email}</Typography2>
        </FlexColumn>
        <FlexColumn>
          <Subtitle1 style={{ marginBottom: "8px" }}>Role</Subtitle1>
          <Typography2 fontWeight="400">{selectedUser.role}</Typography2>
        </FlexColumn>
        {selectedUser.role === Roles.LAWYER && (
          <FlexColumn>
            <Subtitle1 style={{ marginBottom: "8px" }}>Lawyer Data</Subtitle1>
            <Typography2 fontWeight="400">{`Experience: ${
              selectedUser.lawyerData?.experience || "N/A"
            } ani`}</Typography2>
            <Typography2 fontWeight="400">{`Price: ${selectedUser.lawyerData?.price || "N/A"} lei`}</Typography2>
            <Typography2 fontWeight="400">
              Specialty:{" "}
              {selectedUser.lawyerData?.specialty && selectedUser.lawyerData.specialty.length > 0
                ? selectedUser.lawyerData.specialty.join(", ")
                : "No specialties listed"}
            </Typography2>
          </FlexColumn>
        )}
      </DialogContent>

      <DialogActions>
        <PrimaryButton
          onClick={onClose}
          variant="outlined"
          color="gold"
          style={{ margin: "0 16px 8px 0", width: "100px" }}
        >
          Close
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
