import React from "react";
import { OutlinedInput, FormHelperText } from "@mui/material";
import type { OutlinedInputProps } from "@mui/material";
import { FlexColumn } from "../../styles/StyledComponents";
import { Typography2 } from "../typography/Typography";
import { GeneralColors, TextColors } from "../../constants/colors";

interface CustomInputProps extends Omit<OutlinedInputProps, "label"> {
  label?: string;
  required?: boolean;
  gap?: string;
  endAdornment?: React.ReactNode;
  helperText?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  required = false,
  gap = "8px",
  endAdornment,
  helperText,
  error,
  ...props
}) => {
  return (
    <FlexColumn gap={gap}>
      {label && (
        <Typography2>
          {label} {required && "*"}
        </Typography2>
      )}
      <OutlinedInput
        {...props}
        error={error}
        endAdornment={endAdornment}
        sx={{
          "&.MuiOutlinedInput-root": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "rgb(211, 47, 47)" : "rgba(0, 0, 0, 0.23)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "rgb(211, 47, 47)" : "rgba(0, 0, 0, 0.23)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "rgb(211, 47, 47)" : GeneralColors.Gold,
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "10px",
            fontSize: "14px",
            color: TextColors.Primary,
            fontFamily: "'Roboto', sans-serif",
          },
          "&::placeholder": {
            color: TextColors.Subtitle,
            opacity: 1,
            fontFamily: "'Roboto', sans-serif",
          },
          ...(props.sx || {}),
        }}
      />
      {helperText && (
        <FormHelperText error={error} sx={{ marginTop: "-4px" }}>
          {helperText}
        </FormHelperText>
      )}
    </FlexColumn>
  );
};

export default CustomInput;
