import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, Rating } from "@mui/material";

import { getMyRateByLawyerId, rateLawyer } from "../../services/ratingService";

import { Subtitle2, Title1 } from "../typography/Titles";
import { type User } from "../../utils/models";
import PrimaryButton from "../buttons/PrimaryButton";
import { FlexColumn } from "../../styles/StyledComponents";
import { Typography1 } from "../typography/Typography";
import CustomInput from "../inputs/CustomInput";

export const RateLawyerModal = ({ open, onClose, lawyer }: RateLawyerModalProps) => {
  const [rate, setRate] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (open && lawyer && lawyer.id) {
      (async () => {
        try {
          const response = await getMyRateByLawyerId(lawyer.id!);

          if (response && typeof response === "object") {
            setRate(response.rate || 0); // Ensure response.rate exists and is valid
            setComment(response.comment || ""); // Ensure response.comment exists and is valid
          } else {
            console.error("Invalid response structure:", response);
          }
        } catch (error) {
          console.error("Error fetching rating:", error);
        }
      })();
    }
  }, [open, lawyer]);

  const handleSubmitRating = async () => {
    if (rate && lawyer && lawyer.id) {
      await rateLawyer(lawyer.id, rate, comment);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Title1>Rate your lawyer</Title1>
      </DialogTitle>

      <DialogContent>
        <FlexColumn>
          <Typography1>
            {lawyer?.lastName} {lawyer?.firstName}
          </Typography1>
          <Subtitle2>{lawyer?.lawyerData?.specialty.join(", ")}</Subtitle2>
        </FlexColumn>

        <Divider sx={{ margin: "16px 0" }} />

        <FlexColumn gap="8px">
          <Typography1>How was your experience?</Typography1>
          <Rating
            value={rate}
            precision={0.5}
            onChange={(_, newInput) => {
              if (newInput !== null) {
                setRate(newInput);
              }
            }}
          />
          <CustomInput
            label="Comment"
            placeholder="Leave a comment about your experience"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            error={false}
            multiline
            rows={4}
            style={{ marginTop: "16px" }}
            gap="1px"
          />
        </FlexColumn>
      </DialogContent>

      <DialogActions>
        <PrimaryButton
          onClick={onClose}
          variant="outlined"
          color="gold"
          style={{ margin: "0 16px 8px 0", width: "100px" }}
        >
          Close
        </PrimaryButton>
        <PrimaryButton
          onClick={handleSubmitRating}
          variant="filled"
          color="gold"
          style={{ margin: "0 16px 8px 0", width: "100px" }}
        >
          Submit
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

interface RateLawyerModalProps {
  open: boolean;
  onClose: () => void;
  lawyer: User | undefined;
}
