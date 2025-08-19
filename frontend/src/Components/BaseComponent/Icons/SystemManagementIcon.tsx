import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";
import React from "react";


export const SystemManagementIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faUserShield}  />;
};
