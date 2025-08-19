
import { Icon } from "../../../styled";
import { faFaceMehBlank } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const FaceIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faFaceMehBlank}  />;
};
