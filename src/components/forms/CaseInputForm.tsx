import React, { useCallback, useState } from "react";
import { DescriptionOutlined, DocumentScannerOutlined, SendOutlined } from "@mui/icons-material";
import { Card, CircularProgress, TextField } from "@mui/material";
import styled from "styled-components";

import { BackgroundColors, BorderColors, GeneralColors, TextColors } from "../../constants/colors";

import { createCase, SUBMIT_API_URL } from "../../services/casesService";

import { defaultExtractedInfo, TextProcessor, type ExtractedInfo } from "../../utils/TextProcessor";
import PrimaryButton from "../buttons/PrimaryButton";
import { FlexColumn, FlexRow, FormWrapper } from "../../styles/StyledComponents";
import { Subtitle1 } from "../typography/Titles";
import { Typography1, Typography2 } from "../typography/Typography";
import CustomInput from "../inputs/CustomInput";
import { CaseStatuses, CaseUrgency, type CaseData } from "../../utils/models";
import { validateCase, validateCaseTitle, validateCaseDescription } from "../../utils/validators";

interface CaseInputFormProps {
  onCaseSubmitted?: (caseData: any) => void;
}

export const CaseInputForm = ({ onCaseSubmitted }: CaseInputFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>(defaultExtractedInfo);
  const [suggestedCategory, setSuggestedCategory] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isTextEmpty = !validateCaseTitle(title) || !validateCaseDescription(description);
  const isSubmitDisabled = isTextEmpty || isProcessing || !suggestedCategory;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      const validateForm = (): boolean => {
        const newErrors = validateCase(title, description, suggestedCategory);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      if (!validateForm() || isSubmitDisabled) {
        return;
      }

      const caseData: CaseData = {
        title,
        description,
        category: suggestedCategory,
        urgency: (extractedInfo.urgency || CaseUrgency.LOW) as CaseUrgency,
        status: CaseStatuses.PENDING,
        createdAt: ""
      };

      await createCase(caseData);

      onCaseSubmitted?.(caseData);

      setTitle("");
      setDescription("");
      setExtractedInfo(defaultExtractedInfo);
      setSuggestedCategory("");
      setErrors({});
    },
    [ isSubmitDisabled, title, description, suggestedCategory, extractedInfo.urgency, onCaseSubmitted]
  );

  const processText = useCallback(async () => {
    setIsProcessing(true);
    try {
      const personalInfo = TextProcessor.extractPersonalInfo(description);
      setExtractedInfo(personalInfo);

      const textToSend = personalInfo.sanitizedText || description;

      const res = await fetch(SUBMIT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });
      const result = await res.json();
      const category = result.categorie || "Uncategorized";
      setSuggestedCategory(category);
    } catch (error) {
      console.error("Error processing text:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [description]);

  return (
    <Card style={{ padding: "32px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <FormWrapper onSubmit={handleSubmit}>
        <CustomInput
          label="Case Title"
          required
          placeholder="Please enter text"
          fullWidth
          gap="18px"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
        />

        <FlexColumn gap="18px">
          <Typography2>Case Description *</Typography2>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={10}
            placeholder="Please enter text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={textFileldStyle}
            error={!!errors.description}
            helperText={errors.description}
          />
        </FlexColumn>

        <FlexRow gap="16px">
          <PrimaryButton
            onClick={processText}
            disabled={isProcessing || isTextEmpty}
            variant="outlined"
            type="button"
            color="gold"
            fullWidth
          >
            {isProcessing ? (
              <>
                <CircularProgress size={20} style={{ marginRight: "5px", color: GeneralColors.Gold }} />
              </>
            ) : (
              <>
                <DocumentScannerOutlined style={{ marginRight: "5px" }} />
                Analyze Case
              </>
            )}
          </PrimaryButton>

          <PrimaryButton type="submit" disabled={isSubmitDisabled} variant="filled" fullWidth>
            <SendOutlined style={{ marginRight: "5px" }} />
            Submit Case
          </PrimaryButton>
        </FlexRow>
      </FormWrapper>

      {/* Analysis Results */}
      {(extractedInfo !== defaultExtractedInfo || suggestedCategory) && (
        <AnalysisResultsContainer>
          {isProcessing ? (
            <CircularProgress style={{ margin: "20px auto", display: "block", color: GeneralColors.Gold }} />
          ) : (
            <>
              <FlexRow alignitems="center" gap="10px">
                <DescriptionOutlined style={{ marginRight: "5px", color: GeneralColors.Gold }} />
                <Typography1>Case Analysis Results</Typography1>
              </FlexRow>

              {suggestedCategory && (
                <FlexColumn gap="5px">
                  <Subtitle1>Suggested Legal Category:</Subtitle1>
                  <Typography1>{suggestedCategory}</Typography1>
                </FlexColumn>
              )}

              {extractedInfo.extractedItems?.length > 0 && (
                <FlexColumn>
                  <Subtitle1>Extracted Information:</Subtitle1>
                  <Typography1>{extractedInfo.extractedItems.join(", ")}</Typography1>
                </FlexColumn>
              )}

              <FlexColumn>
                <Subtitle1>Sanitized Text:</Subtitle1>
                <Typography1>{extractedInfo.sanitizedText}</Typography1>
              </FlexColumn>
            </>
          )}
        </AnalysisResultsContainer>
      )}
    </Card>
  );
};

const AnalysisResultsContainer = styled.div`
  margin-top: 24px;
  padding: 24px;
  background-color: ${BackgroundColors.LightGray};
  border-radius: 8px;
  border: 1px solid ${BorderColors.Primary};
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const textFileldStyle = {
  "& .MuiOutlinedInput-root": {
    padding: "10px",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&.Mui-focused fieldset": {
      borderColor: GeneralColors.Gold,
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "14px",
    color: TextColors.Primary,
    fontFamily: "'Roboto', sans-serif",
  },
  "&::placeholder": {
    color: TextColors.Subtitle,
    opacity: 1,
    fontFamily: "'Roboto', sans-serif",
  },
  "& .MuiInputLabel-outlined.Mui-focused": {
    color: GeneralColors.Gold,
  },
};
