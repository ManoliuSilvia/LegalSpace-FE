import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Rating,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getAllLawyers } from "../services/usersService";

import { GeneralColors } from "../constants/colors";

import { type User } from "../utils/models";
import { Card, CardContent, FlexColumn } from "../styles/StyledComponents";
import { Subtitle1, Title1 } from "../components/typography/Titles";
import { Typography1, Typography2 } from "../components/typography/Typography";
import PrimaryButton from "../components/buttons/PrimaryButton";

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fetchedLawyers = await getAllLawyers();
        setLawyers(fetchedLawyers);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <FlexColumn gap="24px">
      <FlexColumn>
        <Title1>Available Lawyers</Title1>
        <Subtitle1>See all available lawyers</Subtitle1>
      </FlexColumn>

      <Card style={{ maxHeight: "calc(100vh - 250px)", display: "flex", flexDirection: "column" }}>
        <CardContent style={{ height: "100%", overflow: "hidden" }}>
          {loading ? (
            <CircularProgress size={40} sx={{ color: GeneralColors.Gold }} />
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                flexGrow: 1,
                overflow: "auto",
                maxHeight: "100%",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {herderTitles.map((title, index) => (
                      <TableCell
                        key={index}
                        align={index === herderTitles.length - 1 ? "right" : "left"}
                        sx={index === herderTitles.length - 1 ? { width: "1%" } : {}}
                      >
                        <Typography1 fontWeight="500">{title}</Typography1>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {lawyers.map((lawyer) => (
                    <TableRow
                      key={lawyer.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell>
                        <Typography2 fontWeight="400">{`${lawyer.lastName} ${lawyer.firstName}`}</Typography2>
                      </TableCell>
                      <TableCell>
                        {lawyer.lawyerData?.specialty ? (
                          <FlexColumn gap="4px">
                            {lawyer.lawyerData.specialty.map((specialty: string, index: number) => (
                              <Chip
                                key={index}
                                label={specialty.trim()}
                                variant="outlined"
                                size="small"
                                sx={{ width: "fit-content" }}
                              />
                            ))}
                          </FlexColumn>
                        ) : (
                          <Typography2 fontWeight="400">-</Typography2>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography2 fontWeight="400">{lawyer.lawyerData?.experience} years</Typography2>
                      </TableCell>
                      <TableCell>
                        <Typography2 fontWeight="400">{lawyer.lawyerData?.price} lei</Typography2>
                      </TableCell>
                      <TableCell>
                        <Rating name="read-only" value={lawyer.averageRating} precision={0.5} readOnly />
                      </TableCell>
                      <TableCell align="right" sx={{ width: "1%", whiteSpace: "nowrap" }}>
                        <PrimaryButton
                          variant="filled"
                          color="gold"
                          onClick={() => navigate(`/chat/${lawyer.id}`)}
                          disabled={lawyer.disabled}
                        >
                          Contact
                        </PrimaryButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </FlexColumn>
  );
}

const herderTitles = ["Name", "Specialty", "Experience", "Price", "Rating", "Actions"];
