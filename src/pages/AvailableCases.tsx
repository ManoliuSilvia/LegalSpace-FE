import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import styled from "styled-components";

import { GeneralColors } from "../constants/colors";

import { type Case } from "../utils/models";
import { Card, CardContent, FlexColumn } from "../styles/StyledComponents";
import { Subtitle1, Title1 } from "../components/typography/Titles";
import { Typography1 } from "../components/typography/Typography";
import { CaseRow } from "../components/cases/CaseRow";
import { ViewCaseModal } from "../components/modals/ViewCaseModal";
import { getAvailableCases, takeCase } from "../services/casesService";

export default function AvailableCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCases = await getAvailableCases();
      setCases(fetchedCases);
    } catch (error) {
      console.error("Failed to fetch available cases:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleViewCase = (caseData: any) => {
    setSelectedCase(caseData);
    setViewModalOpen(true);
  };

  const handleTakeCase = async (caseData: Case) => {
    setLoading(true);
    try {
      await takeCase(caseData.id);
      await fetchCases();
    } catch (error) {
      console.log("Failed to take case:", error);
      setLoading(false);
    }
  };

  const caseActions = [
    {
      label: "View",
      handler: handleViewCase,
    },
    {
      label: "Take Case",
      handler: handleTakeCase,
    },
  ];

  return (
    <AvailableCasesContainer>
      <FlexColumn>
        <Title1>Available Cases</Title1>
        <Subtitle1>Browse and take new cases</Subtitle1>
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
                    {headerTitles.map((title, index) => (
                      <TableCell
                        key={index}
                        align={index === headerTitles.length - 1 ? "right" : "left"}
                        sx={index === headerTitles.length - 1 ? { width: "1%" } : {}}
                      >
                        <Typography1 fontWeight="500">{title}</Typography1>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cases.map((caseItem) => (
                    <CaseRow key={caseItem.id} caseItem={caseItem} actions={caseActions} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <ViewCaseModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        case={selectedCase}
        onCaseTaken={fetchCases}
      />
    </AvailableCasesContainer>
  );
}

const headerTitles = ["Case", "Category", "Lawyer", "Status", "Date", "Actions"];

const AvailableCasesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
