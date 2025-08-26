import styled from "styled-components";
import React from "react";


export const Button = styled.button<{ primary?: boolean }>`
display: inline-flex;
align-items: center;
gap: 8px;
background: ${(p) => (p.primary ? "#2563eb" : "#f3f4f6")};
color: ${(p) => (p.primary ? "#fff" : "#374151")};
padding: 8px 12px;
border: none;
border-radius: 8px;
cursor: pointer;
&:hover { background: ${(p) => (p.primary ? "#1d4ed8" : "#e5e7eb")}; }
`;


export default Button as unknown as React.FC<any>;