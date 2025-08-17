
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";
import React from "react";

export const BarIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faBars}  />;
};
