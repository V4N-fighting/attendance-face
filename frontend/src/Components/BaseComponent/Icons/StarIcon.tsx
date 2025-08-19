import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";
import React from "react";


export const StarIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faStar}  />;
};
