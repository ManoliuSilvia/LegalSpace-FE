import styled from "styled-components";
import { TextColors } from "../../constants/colors";

interface TypographyProps {
  fontWeight?: string;
  color?: string;
  letterSpacing?: string;
  testTransform?: string;
  lineHeight?: string;
  fontStyle?: string;
  cursor?: string;
  textAlign?: string;
}

const TypographyBase = styled.div`
  font-family: "Roboto", serif;
  font-style: normal;
  font-weight: normal;
  color: ${TextColors.Primary};
`;

export const Typography1 = styled(TypographyBase)<TypographyProps>`
  font-size: 16px;
  line-height: 24px;
  font-weight: ${(props) => props.fontWeight || "500"};
  color: ${(props) => props.color || TextColors.Primary};
  letter-spacing: ${(props) => props.letterSpacing || "0.5px"};
  line-height: ${(props) => props.lineHeight || "20px"};
  font-style: ${(props) => props.fontStyle || "normal"};
  cursor: ${(props) => props.cursor || "inherit"};
  text-align: ${(props) => props.textAlign || "left"};
`;

export const Typography2 = styled(TypographyBase)<TypographyProps>`
  font-size: 14px;
  line-height: 20px;
  font-weight: ${(props) => props.fontWeight || "500"};
  color: ${(props) => props.color || TextColors.Primary};
  letter-spacing: ${(props) => props.letterSpacing || "0.5px"};
  line-height: ${(props) => props.lineHeight || "20px"};
  font-style: ${(props) => props.fontStyle || "normal"};
  cursor: ${(props) => props.cursor || "inherit"};
  text-align: ${(props) => props.textAlign || "left"};
`;

export const Typography3 = styled(TypographyBase)<TypographyProps>`
  font-size: 12px;
  line-height: 16px;
  font-weight: ${(props) => props.fontWeight || "400"};
  color: ${(props) => props.color || TextColors.Primary};
  letter-spacing: ${(props) => props.letterSpacing || "0.5px"};
  line-height: ${(props) => props.lineHeight || "16px"};
  font-style: ${(props) => props.fontStyle || "normal"};
  cursor: ${(props) => props.cursor || "inherit"};
  text-align: ${(props) => props.textAlign || "left"};
`;
