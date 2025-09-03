import { useState } from "react";
import { Balance } from "@mui/icons-material";

import CustomInput from "../inputs/CustomInput";
import CustomSelect from "../inputs/CustomSelect";
import PrimaryButton from "../buttons/PrimaryButton";
import { categoryOptions } from "../../utils/models";
import { FlexColumn, FlexRow } from "../../styles/StyledComponents";
import { Title3 } from "../typography/Titles";

interface EditLawyerDetailsFormProps {
  initialData: { specialty: string[]; experience: number; price: number };
  onSubmit: (data: { specialty: string[]; experience: number; price: number }) => void;
}

export default function EditLawyerDetailsForm({ initialData, onSubmit }: EditLawyerDetailsFormProps) {
  const [lawyerSettings, setLawyerSettings] = useState(initialData);
  const [lawyerErrors, setLawyerErrors] = useState({
    specialty: "",
    experience: "",
    price: "",
  });

  const handleLawyerInputChange = (
    e: React.ChangeEvent<{ name?: string; value: string | string[] | number }> | any
  ) => {
    const { name, value } = e.target;
    setLawyerSettings((prev) => ({
      ...prev,
      [name!]: name === "price" || name === "experience" ? Number(value) : value,
    }));
  };

  const validateLawyerSettings = () => {
    const newErrors = {
      specialty: lawyerSettings.specialty.length > 0 ? "" : "At least one specialty is required",
      experience: lawyerSettings.experience > 0 ? "" : "Experience must be greater than 0",
      price: lawyerSettings.price > 0 ? "" : "Price must be greater than 0",
    };

    setLawyerErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLawyerSettings()) {
      onSubmit(lawyerSettings);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FlexColumn gap={"32px"} style={{ padding: "24px" }}>
        <FlexRow alignitems="center">
          <Balance sx={{ mr: 1 }} />
          <Title3>Lawyer Settings</Title3>
        </FlexRow>

        <FlexColumn gap="8px">
          <CustomSelect
            label="Specialty"
            name="specialty"
            value={lawyerSettings.specialty}
            options={categoryOptions}
            multiple
            fullWidth
            onChange={handleLawyerInputChange}
            error={!!lawyerErrors.specialty}
            helperText={lawyerErrors.specialty}
            sx={{ maxWidth: "600px" }}
          />
          <CustomInput
            label="Experience (years)"
            name="experience"
            value={lawyerSettings.experience}
            fullWidth
            onChange={handleLawyerInputChange}
            error={!!lawyerErrors.experience}
            helperText={lawyerErrors.experience}
          />
          <CustomInput
            label="Price ($)"
            name="price"
            value={lawyerSettings.price}
            fullWidth
            onChange={handleLawyerInputChange}
            error={!!lawyerErrors.price}
            helperText={lawyerErrors.price}
          />
        </FlexColumn>
        <PrimaryButton type="submit" variant="filled" color="gold">
          Save Lawyer Details
        </PrimaryButton>
      </FlexColumn>
    </form>
  );
}
