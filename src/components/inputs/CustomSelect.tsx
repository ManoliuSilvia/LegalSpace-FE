import React from "react";
import { Select, MenuItem, FormControl, FormHelperText, type SelectProps } from "@mui/material";
import { FlexColumn } from "../../styles/StyledComponents";
import { Typography2 } from "../typography/Typography";
import { GeneralColors, TextColors } from "../../constants/colors";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps extends Omit<SelectProps, "label"> {
  label?: string;
  required?: boolean;
  gap?: string;
  options: SelectOption[];
  helperText?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  required = false,
  gap = "8px",
  helperText,
  error,
  options,
  ...props
}) => {
  return (
    <FlexColumn gap={gap}>
      {label && (
        <Typography2>
          {label} {required && <span style={{ color: error ? "rgb(211, 47, 47)" : undefined }}>*</span>}
        </Typography2>
      )}
      <FormControl fullWidth error={error}>
        <Select
          {...props}
          error={error}
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
            "& .MuiSelect-select": {
              padding: "10px",
              fontSize: "14px",
              color: TextColors.Primary,
              fontFamily: "'Roboto', sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            ...(props.sx || {}),
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <FormHelperText error={error} sx={{ marginTop: "-4px" }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </FlexColumn>
  );
};

export default CustomSelect;
