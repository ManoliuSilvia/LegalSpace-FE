import { useCallback, useEffect, useState } from "react";
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

import { userStore } from "../stores/userStore";
import { completeCase, deleteCase, getMyCases, updateCase } from "../services/casesService";

import { GeneralColors } from "../constants/colors";

import { Roles, statusOptions, type Case } from "../utils/models";
import { Card, CardContent, FlexColumn } from "../styles/StyledComponents";
import { Subtitle1, Title1 } from "../components/typography/Titles";
import { Typography1 } from "../components/typography/Typography";
import { ViewCaseModal } from "../components/modals/ViewCaseModal";
import { EditCaseModal } from "../components/modals/EditCaseModal";
import { CaseRow } from "../components/cases/CaseRow";
import CustomSelect from "../components/inputs/CustomSelect";
import CustomSearchBar from "../components/inputs/CustomSearchBar";

export default function MyCases() {
  const { user } = userStore();
  const isClient = user?.role === Roles.CLIENT;
  const isLawyer = user?.role === Roles.LAWYER;
  const isAdmin = user?.role === Roles.ADMIN;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCases = await getMyCases();
      setCases(fetchedCases);
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleDelete = async (caseId: string) => {
    await deleteCase(caseId);
    setCases((prevCases) => prevCases.filter((case_) => case_.id !== caseId));
  };

  const handleViewCase = (caseData: any) => {
    setSelectedCase(caseData);
    setViewModalOpen(true);
  };

  const handleEditCase = (caseData: any) => {
    setSelectedCase(caseData);
    setEditModalOpen(true);
  };

  const handleSaveCase = async (updatedCase: any) => {
    setLoading(true);
    await updateCase(updatedCase.id, updatedCase);
    setCases((prevCases) => prevCases.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    setLoading(false);
  };

  const handleCompleteCase = async (caseData: Case) => {
    setLoading(true);
    try {
      await completeCase(caseData.id);
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
      label: "Edit",
      handler: handleEditCase,
    },
    ...(isClient || isAdmin
      ? [
          {
            label: "Delete",
            handler: (caseItem: Case) => handleDelete(caseItem.id),
          },
        ]
      : []),
    ...(isLawyer
      ? [
          {
            label: "Complete Case",
            handler: (caseItem: Case) => handleCompleteCase(caseItem),
          },
        ]
      : []),
  ];

  const filteredCases = cases.filter((caseItem) => {
    // Status filter
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;

    // Search filter (case insensitive)
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      caseItem.title?.toLowerCase().includes(searchLower) ||
      caseItem.description?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <MyCasesContainer>
      <FlexColumn>
        <Title1>{isAdmin ? "All Cases" : "My Cases"}</Title1>
        <Subtitle1>{isAdmin ? "Keep up with all the cases added" : "Track the progress of your legal cases"}</Subtitle1>
      </FlexColumn>

      <Card style={{ maxHeight: "calc(100vh - 250px)", display: "flex", flexDirection: "column" }}>
        <CardContent style={{ height: "100%", overflow: "hidden" }}>
          <FilterContainer>
            <div style={{ minWidth: "300px" }}>
              <CustomSearchBar
                placeholder="Search by title or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ bgcolor: "white" }}
                size="small"
              />
            </div>

            {isClient && (
              <div style={{ minWidth: "200px" }}>
                <CustomSelect
                  label="Filter by Status"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as string)}
                  sx={{ bgcolor: "white" }}
                  size="small"
                />
              </div>
            )}
          </FilterContainer>

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
                  {filteredCases.map((caseItem) => (
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
        onCaseCompleted={fetchCases}
      />

      <EditCaseModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        case={selectedCase}
        onSave={handleSaveCase}
      />
    </MyCasesContainer>
  );
}

const herderTitles = ["Case", "Category", "Lawyer", "Status", "Date", "Actions"];

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
`;

const MyCasesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
