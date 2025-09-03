import { useState } from "react";
import { validateEmail } from "../../utils/validators";
import CustomInput from "../inputs/CustomInput";
import PrimaryButton from "../buttons/PrimaryButton";
import { FlexColumn, FlexRow } from "../../styles/StyledComponents";
import { Person } from "@mui/icons-material";
import { Title3 } from "../typography/Titles";

interface EditUserFormProps {
  initialData: { firstName: string; lastName: string; email: string };
  onSubmit: (data: { firstName: string; lastName: string; email: string }) => void;
}

export default function EditUserForm({ initialData, onSubmit }: EditUserFormProps) {
  const [userSettings, setUserSettings] = useState(initialData);
  const [userErrors, setUserErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSettings((prev) => ({ ...prev, [name]: value }));
  };

  const validateUserSettings = () => {
    const newErrors = {
      firstName: userSettings.firstName ? "" : "First name is required",
      lastName: userSettings.lastName ? "" : "Last name is required",
      email: userSettings.email
        ? validateEmail(userSettings.email)
          ? ""
          : "Please enter a valid email address"
        : "Email is required",
    };

    setUserErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserSettings()) {
      onSubmit(userSettings);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <FlexColumn gap={"32px"} style={{ padding: "24px" }}>
          <FlexRow alignitems="center">
            <Person sx={{ mr: 1 }} />
            <Title3>Profile Information</Title3>
          </FlexRow>

          <FlexColumn gap="8px">
            <CustomInput
              label="First Name"
              name="firstName"
              value={userSettings.firstName}
              fullWidth
              onChange={handleUserInputChange}
              error={!!userErrors.firstName}
              helperText={userErrors.firstName}
            />
            <CustomInput
              label="Last Name"
              name="lastName"
              value={userSettings.lastName}
              fullWidth
              onChange={handleUserInputChange}
              error={!!userErrors.lastName}
              helperText={userErrors.lastName}
            />
            <CustomInput
              label="Email"
              name="email"
              value={userSettings.email}
              fullWidth
              onChange={handleUserInputChange}
              error={!!userErrors.email}
              helperText={userErrors.email}
            />
          </FlexColumn>

          <PrimaryButton type="submit" variant="filled" color="gold">
            Save User Settings
          </PrimaryButton>
        </FlexColumn>
    </form>
  );
}
