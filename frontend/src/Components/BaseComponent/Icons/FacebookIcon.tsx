
import { Icon } from "../../../styled";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import React from "react";

export const FacebookIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faFacebookF}  />;
};
