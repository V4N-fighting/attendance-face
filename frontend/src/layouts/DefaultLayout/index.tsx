import React, { JSX, ReactNode, useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import styled from "styled-components";




interface DefaultLayoutProps {
    children: ReactNode;
}


function DefaultLayout({ children }: DefaultLayoutProps): JSX.Element {
    return (
        <Wrapper>
            <div className="contain">{children}</div>
            <ScrollToTop />
        </Wrapper>
    );
}

const Wrapper = styled.div`
width: 100%;
max-width: 1280px;
margin: 0 auto;
overflow-x: hidden;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`

export default DefaultLayout;
