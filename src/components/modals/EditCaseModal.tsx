import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { categoryOptions, Roles, type CaseData } from "../../utils/models";
import CustomInput from "../inputs/CustomInput";
import CustomSelect from "../inputs/CustomSelect";
import { validateCase, validateCaseTitle, validateCaseDescription, validateCaseCategory } from "../../utils/validators";
import PrimaryButton from "../buttons/PrimaryButton";
import { userStore } from "../../stores/userStore";

interface EditCaseModalProps {
  open: boolean;
  onClose: () => void;
  case: CaseData | null;
  onSave: (updatedCase: CaseData) => void;
}

export const EditCaseModal = ({ open, onClose, case: caseData, onSave }: EditCaseModalProps) => {
  const { user } = userStore();
  const isLawyer = user?.role === Roles.LAWYER;
  const isCaseCompleted = caseData?.status === "COMPLETED";
  const [formData, setFormData] = useState<CaseData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSaveDisabled = useMemo(() => {
    if (!formData) return true;

    return (
      !validateCaseTitle(formData.title || "") ||
      !validateCaseDescription(formData.description || "") ||
      !validateCaseCategory(formData.category || "")
    );
  }, [formData]);

  useEffect(() => {
    if (caseData) {
      setFormData({ ...caseData });
      setErrors({});
    }
  }, [caseData]);

  const handleChange = (field: keyof CaseData) => (event: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });

      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: "",
        });
      }
    }
  };

  const validate = (): boolean => {
    if (!formData) return false;

    const newErrors = validateCase(formData.title || "", formData.description || "", formData.category || "");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (formData && validate()) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="h2">
          Edit Case
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          <CustomInput
            label="Case Title"
            value={formData.title}
            onChange={handleChange("title")}
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title}
            disabled={isLawyer || isCaseCompleted}
          />

          <CustomInput
            label="Description"
            value={formData.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            rows={4}
            required
            error={!!errors.description}
            helperText={errors.description}
            disabled={isLawyer || isCaseCompleted}
          />

          <CustomSelect
            label="Category"
            value={formData.category}
            onChange={handleChange("category")}
            fullWidth
            required
            error={!!errors.category}
            helperText={errors.category}
            options={categoryOptions}
            disabled={isCaseCompleted}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ margin: "0 16px 8px 0" }}>
        <PrimaryButton onClick={onClose} variant="outlined">
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={handleSave} variant="filled" color="gold" disabled={isSaveDisabled}>
          Save Changes
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
