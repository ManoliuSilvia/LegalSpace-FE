import styled from "styled-components";
import { BackgroundColors, BorderColors, TextColors } from "../constants/colors";

export const FlexColumn = styled.div<{ gap?: string; justifycontent?: string; alignitems?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap || "0"};
  justify-content: ${(props) => props.justifycontent || "flex-start"};
  align-items: ${(props) => props.alignitems || "stretch"};
`;

export const FlexRow = styled.div<{ gap?: string; justifycontent?: string; alignitems?: string }>`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.gap || "0"};
  justify-content: ${(props) => props.justifycontent || "flex-start"};
  align-items: ${(props) => props.alignitems || "stretch"};
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
`;

export const Card = styled.div`
  background: ${BackgroundColors.White};
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid ${BorderColors.Primary};
  padding: 24px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${TextColors.Subtitle};
  margin-bottom: 16px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: fit-content;
  max-width: 500px;
  margin: auto;
  padding: 32px;
  background-color: ${BackgroundColors.White};
  border: 1px solid ${BorderColors.Primary};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 24px;
  width: 100%;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const TwoRowsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const AuthPageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${BackgroundColors.LightGray};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GridComponentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${BackgroundColors.White};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
`;