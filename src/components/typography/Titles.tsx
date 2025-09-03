import styled from "styled-components";
import { TextColors } from "../../constants/colors";

interface HeadingProps {
  fontWeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  color?: string;
  whiteSpace?: string;
  lineHeight?: string;
}

const BaseHeading = styled.div`
  font-family: "Roboto", serif;
  font-style: normal;
  font-weight: 500;
  color: ${TextColors.Primary};
`;

const BaseSubtitle = styled.div`
  font-family: "Roboto", serif;
  font-style: normal;
  font-weight: normal;
  color: ${TextColors.Subtitle};
`;

export const Title1 = styled(BaseHeading)<HeadingProps>`
  font-size: 30px;
  line-height: 36px;
  font-weight: ${(props) => props.fontWeight || "700"};
`;

export const Title2 = styled(BaseHeading)<HeadingProps>`
  font-size: 24px;
  line-height: 30px;
  font-weight: ${(props) => props.fontWeight || "500"};
`;

export const Title3 = styled(BaseHeading)<HeadingProps>`
  font-size: 20px;
  line-height: 24px;
  font-weight: ${(props) => props.fontWeight || "500"};
`;

export const Subtitle1 = styled(BaseSubtitle)<HeadingProps>`
  font-size: 16px;
`;

export const Subtitle2 = styled(BaseSubtitle)<HeadingProps>`
  font-size: 14px;
  line-height: 20px;
`;

export const Subtitle3 = styled(BaseSubtitle)<HeadingProps>`
  font-size: 12px;
  line-height: 16px;
`;
