import { Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider } from "@mui/material";
import { Subtitle1, Title1 } from "../typography/Titles";
import { FlexColumn, FlexRow } from "../../styles/StyledComponents";
import { getStatusColor } from "../../utils/getColors";
import { CaseStatuses, Roles, type CaseData } from "../../utils/models";
import { Typography2 } from "../typography/Typography";
import PrimaryButton from "../buttons/PrimaryButton";
import { userStore } from "../../stores/userStore";
import { completeCase, takeCase } from "../../services/casesService";

interface ViewCaseModalProps {
  open: boolean;
  onClose: () => void;
  case: CaseData | null;
  onCaseTaken?: () => void;
  onCaseCompleted?: () => void;
}

export const ViewCaseModal = ({ open, onClose, case: caseData, onCaseTaken, onCaseCompleted }: ViewCaseModalProps) => {
  const { user } = userStore();
  const isLawyer = user?.role === Roles.LAWYER;

  if (!caseData) return null;

  const isCaseTaken = caseData.status === CaseStatuses.TAKEN;

  const handleTakeCase = async () => {
    if (caseData.id) {
      await takeCase(caseData.id);
      if (onCaseTaken) {
        onCaseTaken();
      }
      onClose();
    }
  };

  const handleCompleteCase = async () => {
    if (caseData.id) {
      await completeCase(caseData.id);
      if (onCaseCompleted) {
        onCaseCompleted();
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Title1>{caseData.title}</Title1>
      </DialogTitle>

      <DialogContent>
        <FlexRow justifycontent="space-between" style={{ marginBottom: "16px" }}>
          <Chip label={caseData.status} color={getStatusColor(caseData.status)} size="small" variant="outlined" />
          <Chip label={caseData.category} variant="outlined" size="small" />
        </FlexRow>

        <Divider sx={{ mb: 2 }} />

        <FlexColumn>
          <Subtitle1 style={{ marginBottom: "8px" }}>Description</Subtitle1>
          <Typography2 fontWeight="400">{caseData.description}</Typography2>
        </FlexColumn>

        <FlexRow justifycontent="space-between" style={{ marginTop: "16px" }}>
          <FlexColumn>
            <Subtitle1>Assigned Lawyer</Subtitle1>
            <Typography2 fontWeight="400">
              {caseData.lawyer ? `${caseData.lawyer.lastName} ${caseData.lawyer.firstName}` : "Unassigned"}
            </Typography2>
          </FlexColumn>
          <FlexColumn>
            <Subtitle1>Date Created</Subtitle1>
            <Typography2 fontWeight="400">
              {new Date(caseData.createdAt).toLocaleDateString("ro-RO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography2>
          </FlexColumn>
        </FlexRow>
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
        {isLawyer && (
          <>
            {onCaseTaken && (
              <PrimaryButton onClick={handleTakeCase} variant="filled" color="gold">
                Take Case
              </PrimaryButton>
            )}
            {onCaseCompleted && (
              <PrimaryButton onClick={handleCompleteCase} variant="filled" color="gold" disabled={!isCaseTaken}>
                Complete Case
              </PrimaryButton>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
