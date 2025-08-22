import React, { JSX, ReactNode, useState} from "react";
import styled from "styled-components";
import SidebarAdmin from "./SidebarAdmin";
import ContentAdmin from "./ContentAdmin";
import { Grid, GridCol, GridRow } from "../../styled";
import HeaderAdmin from "./HeaderAdmin";
import Students from "../components/Students";
import Classes from "../components/Classes";
import Attendance from "../components/Attendance";
import FacialData from "../components/FacialData";
import Reports from "../components/Reports";
import SystemManagement from "../components/SystemManagement";
import Dashboard from "../components/Dashboard";
import { DashboardIcon } from "../../Components/BaseComponent/Icons/DashboardIcon";
import { StudentIcon } from "../../Components/BaseComponent/Icons/StudentIcon";
import { ClassIcon } from "../../Components/BaseComponent/Icons/ClassIcon";
import { FaceIcon } from "../../Components/BaseComponent/Icons/FaceIcon";
import { ReportIcon } from "../../Components/BaseComponent/Icons/ReportIcon";
import { SystemManagementIcon } from "../../Components/BaseComponent/Icons/SystemManagementIcon";
import { AttendanceIcon } from "../../Components/BaseComponent/Icons/AttendanceIcon";

interface AdminLayoutProps {
  children: ReactNode;
}


const sidebar: {title: string, path: string, icon: ReactNode}[] = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />
  },
  {
    title: 'Students',
    path: '/admin/students',
    icon: <StudentIcon />
  },
  {
    title: 'Classes',
    path: '/admin/classes',
    icon: <ClassIcon />
  },
  {
    title: 'Attendance',
    path: '/admin/attendance',
    icon: <AttendanceIcon />
  },
  {
    title: 'Facial Data',
    path: '/admin/facial-data',
    icon: <FaceIcon />
  },
  {
    title: 'Reports',
    path: '/admin/reports',
    icon: <ReportIcon />
  },
  {
    title: 'System Management',
    path: '/admin/system-management',
    icon: <SystemManagementIcon />
  },
]


function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <Wrapper>
            <Header><HeaderAdmin curTitle={sidebar[currentIndex].title}/></Header>
            <Main>
                <Grid style={{ display: 'flex' }}>
                    <GridRow margin="10px">
                        <GridCol col={3} >
                            <SidebarAdmin sidebar={sidebar} setCurrentIndex={setCurrentIndex}/>
                        </GridCol>
                        <GridCol col={9}>
                            <ContentAdmin>
                                {children}
                            </ContentAdmin>
                        </GridCol>
                    </GridRow>
                </Grid>
            </Main> 
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`

const Header = styled.div`
    height: 110px;
    margin: 20px 0;
    border: 2px solid #000000;
    border-radius: 8px;
    padding: 20px;
`
const Main = styled.div`
    display: flex;
    flex: 1;
    border: 2px solid #000000;
    border-radius: 8px;
    padding: 20px;
    margin: 0 0 20px;
`

export default AdminLayout;
