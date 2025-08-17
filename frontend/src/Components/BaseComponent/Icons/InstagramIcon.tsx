
import { Icon } from "../../../styled";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export const InstagramIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faInstagram}  />;
};
