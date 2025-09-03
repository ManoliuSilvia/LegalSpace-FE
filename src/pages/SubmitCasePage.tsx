import { useNavigate } from "react-router-dom";
import Balance from "@mui/icons-material/Balance";

import { GeneralColors } from "../constants/colors";

import { CaseInputForm } from "../components/forms/CaseInputForm";
import { FlexColumn, FlexRow } from "../styles/StyledComponents";
import { Subtitle1, Title1 } from "../components/typography/Titles";

const SubmitCasePage = () => {
  const navigate = useNavigate();

  const handleCaseSubmitted = () => {
    navigate("/my-cases");
  };

  return (
    <FlexColumn gap="32px">
      <FlexColumn gap="16px" alignitems="center">
        <FlexRow alignitems="center" justifycontent="center">
          <Balance style={{ marginRight: "20px", height: "32px", width: "32px", fill: GeneralColors.Gold }} />
          <Title1>Legal Case Submission</Title1>
        </FlexRow>
        <Subtitle1>Describe your legal situation and we'll match you with the right lawyer</Subtitle1>
      </FlexColumn>
      <CaseInputForm onCaseSubmitted={handleCaseSubmitted} />
    </FlexColumn>
  );
};

export default SubmitCasePage;
