import { useState, useEffect } from "react";
import styled from "styled-components";
import { TrendingUp, DescriptionOutlined, PeopleOutlined, Balance } from "@mui/icons-material";
import { Box, Avatar, Chip, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { userStore } from "../stores/userStore";
import { getDashboardData, type DashboardData } from "../services/usersService";

import { BorderColors, GeneralColors } from "../constants/colors";

import { Title1, Title2, Subtitle1, Subtitle2, Subtitle3 } from "../components/typography/Titles";
import { Typography1, Typography2 } from "../components/typography/Typography";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { CardsContainer, FlexColumn, Card, CardContent, CardHeader, TwoRowsGrid } from "../styles/StyledComponents";
import { getStatusColor } from "../utils/getColors";
import { Roles } from "../utils/models";

export default function Dashboard() {
  const { user } = userStore();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCases: 0,
    activeCases: 0,
    matchedUsers: 0,
    successRate: 0,
    recentCases: [],
    recommendedUsers: [],
  });
  const isClient = user?.role === Roles.CLIENT;
  const isLawyer = user?.role === Roles.LAWYER;
  const isAdmin = user?.role === Roles.ADMIN;

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Cases",
      icon: <DescriptionOutlined sx={{ width: "16px", height: "16px" }} />,
      number: dashboardData.totalCases.toString(),
      subtitle: isAdmin ? "All cases" : "All your cases",
    },
    {
      title: "Active Cases",
      icon: <Balance sx={{ width: "16px", height: "16px" }} />,
      number: dashboardData.activeCases.toString(),
      subtitle: "Currently in progress",
    },
    {
      title: isAdmin ? "All users" : isLawyer ? "Matched Clients" : "Matched Lawyers",
      icon: <PeopleOutlined sx={{ width: "16px", height: "16px" }} />,
      number: dashboardData.matchedUsers.toString(),
      subtitle: isAdmin ? "All users on the platform" : isLawyer ? "Having their case" : "Working on their cases",
    },
    {
      title: "Success Rate",
      icon: <TrendingUp sx={{ width: "16px", height: "16px" }} />,
      number: `${dashboardData.successRate}%`,
      subtitle: "Case completion rate",
    },
  ];

  const handleNavigateToSubmitCase = () => {
    navigate("/submit-case");
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: GeneralColors.Gold }} />
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <HeaderContainer>
        <FlexColumn>
          <Title1>Welcome back, {user?.firstName || "User"}</Title1>
          <Subtitle1>Here's what's happening with your legal cases today.</Subtitle1>
        </FlexColumn>
        {isClient && (
          <PrimaryButton
            variant="filled"
            icon={<DescriptionOutlined />}
            color="gold"
            onClick={handleNavigateToSubmitCase}
          >
            Submit New Case
          </PrimaryButton>
        )}
      </HeaderContainer>

      <CardsContainer>
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <Typography2>{card.title}</Typography2>
              {card.icon}
            </CardHeader>
            <CardContent>
              <Title2 fontWeight="700">{card.number}</Title2>
              <Subtitle3>{card.subtitle}</Subtitle3>
            </CardContent>
          </Card>
        ))}
      </CardsContainer>

      {!isAdmin && (
        <TwoRowsGrid>
          <Card>
            <FlexColumn style={{ marginBottom: "16px" }}>
              <Title2>Recent Cases</Title2>
              <Subtitle2>{isLawyer ? "Your latest taken legal cases" : "Your latest legal case submissions"}</Subtitle2>
            </FlexColumn>
            {dashboardData.recentCases.length === 0 ? (
              <EmptyStateMessage>No recent cases found.</EmptyStateMessage>
            ) : (
              <FlexColumn gap="16px">
                {dashboardData.recentCases.map((caseItem) => (
                  <AdditionalInfoRow key={caseItem.id}>
                    <Box>
                      <Typography1>{caseItem.title}</Typography1>
                      <Subtitle2>{caseItem.category}</Subtitle2>
                    </Box>
                    <Chip
                      label={caseItem.status}
                      color={getStatusColor(caseItem.status)}
                      size="small"
                      variant="outlined"
                    />
                  </AdditionalInfoRow>
                ))}
              </FlexColumn>
            )}
          </Card>

          <Card>
            <FlexColumn style={{ marginBottom: "16px" }}>
              <Title2>{isLawyer ? "Matched Clients" : "Matched Lawyers"}</Title2>
              <Subtitle2>{isLawyer ? "Clients for your cases" : "Lawyers for your cases"}</Subtitle2>
            </FlexColumn>
            {dashboardData.recommendedUsers.length === 0 ? (
              <EmptyStateMessage>
                {isLawyer ? "No clients at the moment." : "No lawyers at the moment."}
              </EmptyStateMessage>
            ) : (
              <FlexColumn gap="16px">
                {dashboardData.recommendedUsers.map((user) => (
                  <AdditionalInfoRow key={user.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "transparent", color: GeneralColors.Black }}>
                        <PeopleOutlined />
                      </Avatar>
                      <Box>
                        <Typography1>{`${user.lastName} ${user.firstName}`}</Typography1>
                        {user.lawyerData && <Subtitle2>{user.lawyerData.specialty.join(", ")}</Subtitle2>}
                      </Box>
                    </Box>
                    <PrimaryButton variant="outlined" color="gold" onClick={() => navigate(`/chat/${user.id}`)}>
                      Contact
                    </PrimaryButton>
                  </AdditionalInfoRow>
                ))}
              </FlexColumn>
            )}
          </Card>
        </TwoRowsGrid>
      )}
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AdditionalInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${BorderColors.Primary};
  padding: 16px;
  border-radius: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const EmptyStateMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  color: ${GeneralColors.DarkGray};
  font-style: italic;
`;
