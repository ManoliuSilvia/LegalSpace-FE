import React from "react";
import { Button, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BorderColors, GeneralColors, TextColors } from "../../constants/colors";

export type PrimaryButtonVariant = "filled" | "outlined" | "transparent";
export type PrimaryButtonSize = "extrasmall" | "small" | "medium" | "large";
export type PrimaryButtonColor = "black" | "gold";

interface PrimaryButtonProps extends Omit<ButtonProps, "variant" | "size" | "color"> {
  variant?: PrimaryButtonVariant;
  size?: PrimaryButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  color?: PrimaryButtonColor;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "buttonVariant" && prop !== "buttonSize" && prop !== "buttonColor",
})<{
  buttonVariant: PrimaryButtonVariant;
  buttonSize: PrimaryButtonSize;
  buttonColor: PrimaryButtonColor;
}>(({ buttonVariant, buttonSize, buttonColor }) => ({
  borderRadius: "8px",
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",

  ...(buttonSize === "extrasmall" && {
    padding: "4px 12px",
    fontSize: "10px",
    fontWeight: 400,
  }),

  ...(buttonSize === "small" && {
    padding: "6px 16px",
    fontSize: "12px",
    fontWeight: 400,
  }),

  ...(buttonSize === "medium" && {
    padding: "8px 20px",
    fontSize: "14px",
    fontWeight: 500,
  }),

  ...(buttonSize === "large" && {
    padding: "10px 24px",
    fontSize: "16px",
    fontWeight: 500,
  }),

  ...(buttonVariant === "filled" && {
    backgroundColor: GeneralColors.DarkGray,
    color: GeneralColors.White,
    "&:hover": {
      backgroundColor: buttonColor === "gold" ? GeneralColors.Gold : GeneralColors.Black,
      boxShadow: `0px 4px 8px ${BorderColors.Primary}`,
    },
  }),

  ...(buttonVariant === "outlined" && {
    backgroundColor: "transparent",
    color: TextColors.Primary,
    border: `1px solid ${BorderColors.Primary}`,
    "&:hover": {
      backgroundColor: buttonColor === "gold" ? GeneralColors.Gold : GeneralColors.LightGray,
      color: buttonColor === "gold" ? GeneralColors.White : TextColors.Primary,
    },
  }),

  ...(buttonVariant === "transparent" && {
    backgroundColor: "transparent",
    color: TextColors.Primary,
    border: "none",
    "&:hover": {
      backgroundColor: buttonColor === "gold" ? GeneralColors.Gold : GeneralColors.LightGray,
      color: buttonColor === "gold" ? GeneralColors.White : TextColors.Primary,
    },
  }),

  "&.Mui-disabled": {
    backgroundColor: buttonVariant === "filled" ? GeneralColors.Gray : "transparent",
    color: buttonVariant === "filled" ? GeneralColors.White : TextColors.Subtitle,
    border: buttonVariant === "outlined" ? `1px solid ${BorderColors.Primary}` : "none",
  },
}));

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  variant = "filled",
  size = "medium",
  children,
  disabled = false,
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "start",
  color = "black",
  ...props
}) => {
  const getIconSize = () => {
    switch (size) {
      case "extrasmall":
        return 12;
      case "small":
        return 14;
      case "medium":
        return 16;
      case "large":
        return 20;
      default:
        return 16;
    }
  };

  return (
    <StyledButton
      buttonVariant={variant}
      buttonSize={size}
      buttonColor={color}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={
        loading ? (
          <CircularProgress size={getIconSize()} sx={{color: GeneralColors.Gold}} />
        ) : iconPosition === "start" ? (
          icon
        ) : undefined
      }
      endIcon={iconPosition === "end" && !loading ? icon : undefined}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default PrimaryButton;
