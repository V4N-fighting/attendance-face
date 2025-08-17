
import { Icon } from "../../../styled";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export const TwitterIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faTwitter}  />;
};
