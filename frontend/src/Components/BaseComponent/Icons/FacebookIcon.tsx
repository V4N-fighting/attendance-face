
import { Icon } from "../../../styled";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export const FacebookIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faFacebookF}  />;
};
