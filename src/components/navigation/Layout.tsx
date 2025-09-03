import { Outlet } from "react-router-dom";
import styled from "styled-components";

import { BackgroundColors } from "../../constants/colors";

import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";

export function Layout() {

  return (
    <LayoutWrapper>
      <Sidebar />
      <WithNavigationWrapper>
        <TopNavigation />
        <MainContent>
          <Outlet />
        </MainContent>
      </WithNavigationWrapper>
    </LayoutWrapper>
  );
}

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const WithNavigationWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  padding: 24px;
  background-color: ${BackgroundColors.LightGray};
  height: 100%;
`;
