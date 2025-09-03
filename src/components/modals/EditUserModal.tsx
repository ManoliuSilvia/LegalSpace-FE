import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Roles, type User } from "../../utils/models";
import PrimaryButton from "../buttons/PrimaryButton";
import EditUserForm from "../forms/EditUserForm";
import EditLawyerDetailsForm from "../forms/EditLawyerDetailsForm";
import { SettingsContainer } from "../../pages/Settings";
import { Title1 } from "../typography/Titles";
import { updateMyProfile, updateMyLawyerData } from "../../services/usersService";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  selectedUser: User | null;
  refetchUsers: () => void;
}

export const EditUserModal = ({ open, onClose, selectedUser, refetchUsers }: EditUserModalProps) => {
  if (!selectedUser) return null;
  const isLawyer = selectedUser?.role === Roles.LAWYER;

  const handleUserSubmit = async (data: { firstName: string; lastName: string; email: string }) => {
    if (!selectedUser.id) return;
    try {
      await updateMyProfile(selectedUser.id, data);
      refetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleLawyerSubmit = async (data: { specialty: string[]; experience: number; price: number }) => {
    if (!selectedUser.id) return;
    try {
      await updateMyLawyerData(selectedUser.id, data);
      refetchUsers();
    } catch (error) {
      console.error("Failed to update lawyer data:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Title1>Edit User</Title1>
      </DialogTitle>

      <DialogContent>
        <SettingsContainer>
          <EditUserForm
            initialData={{
              firstName: selectedUser.firstName,
              lastName: selectedUser.lastName,
              email: selectedUser.email,
            }}
            onSubmit={handleUserSubmit}
          />
          {isLawyer && (
            <EditLawyerDetailsForm
              initialData={{
                specialty: selectedUser.lawyerData?.specialty || [],
                experience: selectedUser.lawyerData?.experience || 0,
                price: selectedUser.lawyerData?.price || 0,
              }}
              onSubmit={handleLawyerSubmit}
            />
          )}
        </SettingsContainer>
      </DialogContent>

      <DialogActions>
        <PrimaryButton onClick={onClose} variant="outlined">
          Cancel
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
