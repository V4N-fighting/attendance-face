import React, { JSX, ReactNode} from "react";
import ScrollToTop from "../components/ScrollToTop";
import styled from "styled-components";
import SidebarAdmin from "../components/SidebarAdmin";
import ContentAdmin from "../components/ContentAdmin";
import { Grid, GridRow } from "../../styled";



interface AdminLayoutProps {
    children: ReactNode;
}


function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
    return (
        <Wrapper>
            <Grid>
                <GridRow>
                    <SidebarAdmin />
                    <ContentAdmin children={children} />
                </GridRow>
            </Grid>
            
            <ScrollToTop />
        </Wrapper>
    );
}

const Wrapper = styled.div`
width: 100%;
overflow-x: hidden;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`

export default AdminLayout;
