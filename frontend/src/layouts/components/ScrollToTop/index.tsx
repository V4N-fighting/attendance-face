
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ScrollToTopComponent } from "../../../Components/ScrollToTop";
import Icons from "../../../Components/BaseComponent/Icons";

const ScrollToTop: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ScrollToTopButton show={showButton} onClick={ScrollToTopComponent}>
      <Icons.ArrowUpIcon white style={{padding: 0, margin: 0}}/>
    </ScrollToTopButton>
    
  );
};


const spin = keyframes`
  100% {
    transform: rotate(360deg);
}
`;


const ScrollToTopButton = styled.div<{show? :boolean}>`
    position: fixed;
    bottom: 90px;
    right: 50px;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 50px;
    height: 50px;
    line-height: 50px;
    padding: 0;
    background-color:  #37d4d9;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    z-index: 33;
    cursor: pointer;
    text-align: center;
    opacity: ${(props) => (props.show ? 1 : 0)};
    visibility: ${(props) => (props.show ? "visible" : "hidden")};
    transition: all ease 0.4s;

    &:hover {
        background-color: #FF681A;
    }

    &::before {
        content: "";
        position: absolute;
        left: var(--extra-shape, -6px);
        top: var(--extra-shape, -6px);
        right: var(--extra-shape, -6px);
        bottom: var(--extra-shape, -6px);
        background-color: transparent;
        border-radius: inherit;
        z-index: 1;
        border: 2px dashed #37d4d9;
        transition: all ease 0.4s;
        animation: ${spin} 13s infinite linear;

    }

    &:hover::before {
     border: 2px dashed #FF681A;
  }
`;

export default ScrollToTop;
