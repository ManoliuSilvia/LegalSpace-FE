import styled from "styled-components";

import { userStore } from "../stores/userStore";
import { updateMyLawyerData, updateMyProfile } from "../services/usersService";

import { FlexColumn, GridComponentsWrapper } from "../styles/StyledComponents";
import { Subtitle1, Title1 } from "../components/typography/Titles";
import EditUserForm from "../components/forms/EditUserForm";
import EditLawyerDetailsForm from "../components/forms/EditLawyerDetailsForm";
import { Roles } from "../utils/models";

export default function Settings() {
  const { user, updateUser } = userStore();
  const isLawyer = user?.role === Roles.LAWYER;

  const handleUserSubmit = async (data: { firstName: string; lastName: string; email: string }) => {
    if (!user?.id) return;
    const response = await updateMyProfile(user.id, data);
    updateUser({ ...response });
  };

  const handleLawyerSubmit = async (data: { specialty: string[]; experience: number; price: number }) => {
    if (!user?.id) return;
    const response = await updateMyLawyerData(user.id, data);
    updateUser(response);
  };

  return (
    <SettingsPageContainer>
      <FlexColumn>
        <Title1>Settings</Title1>
        <Subtitle1>Manage your account settings and preferences</Subtitle1>
      </FlexColumn>

      <SettingsContainer>
        <GridComponentsWrapper>
          <EditUserForm
            initialData={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.email || "",
            }}
            onSubmit={handleUserSubmit}
          />
        </GridComponentsWrapper>

        {isLawyer && (
          <GridComponentsWrapper>
            <EditLawyerDetailsForm
              initialData={{
                specialty: user?.lawyerData?.specialty || [],
                experience: user?.lawyerData?.experience || 0,
                price: user?.lawyerData?.price || 0,
              }}
              onSubmit={handleLawyerSubmit}
            />
          </GridComponentsWrapper>
        )}
      </SettingsContainer>
    </SettingsPageContainer>
  );
}

const SettingsPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
`;
