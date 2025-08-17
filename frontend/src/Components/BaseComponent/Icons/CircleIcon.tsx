import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";

interface CircleIconBoxProps {
    rotate?: boolean;
    white?: boolean;
}

interface CircleIconProps {
    onClick?: () => void;
    white?: boolean;
    style?: React.CSSProperties;
    children: ReactNode;
}

const CircleIcon: React.FC<CircleIconProps> = ({ onClick, white, style, children }) => {
    return (
        <CircleIconBox onClick={onClick} white={white} style={style}>
            <IconWrapper>{children}</IconWrapper> 
        </CircleIconBox>
    );
};

const CircleIconBox = styled.div<CircleIconBoxProps>`
    margin: 0 10px 0 0;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    padding: 0;
    background-color: ${({ white }) => (white ? "white" : "var(--primary-color)")};
    color: ${({ white }) => (white ? "var(--primary-color)" : "var(--white-color)")};
    border: none;
    border-radius: 50%;
    transform: rotate(0);
    transform-origin: center;
    transition: all ease 0.4s;
    z-index: 33;
    cursor: pointer;
    text-align: center;
    overflow: hidden;

    &:hover {
        background-color: ${({ white }) => (white ? "white" : "var(--secondary-color)")};
        transform: ${({ rotate }) => (rotate ? "rotate(90deg)" : "rotate(0)")};
        color: ${({ white }) => (white ? "var(--secondary-color)" : "var(--white-color)")};
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;

    & > * {
        padding: 0;
        margin: 0;
        color: #ffffff;
    }
`;

export default CircleIcon;
