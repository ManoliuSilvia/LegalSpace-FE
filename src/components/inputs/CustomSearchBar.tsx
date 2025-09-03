import React from "react";
import { OutlinedInput, InputAdornment } from "@mui/material";
import type { OutlinedInputProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { GeneralColors, TextColors } from "../../constants/colors";

import { FlexColumn } from "../../styles/StyledComponents";

interface CustomSearchBarProps extends Omit<OutlinedInputProps, "label"> {
  gap?: string;
  showIcon?: boolean;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  gap = "8px",
  showIcon = true,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <FlexColumn gap={gap}>
      <OutlinedInput
        {...props}
        placeholder={placeholder}
        startAdornment={
          showIcon ? (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: TextColors.Subtitle }} />
            </InputAdornment>
          ) : null
        }
        sx={{
          "&.MuiOutlinedInput-root": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: GeneralColors.Gold,
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
    </FlexColumn>
  );
};

export default CustomSearchBar;
