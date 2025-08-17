
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const PhoneIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faPhone}  />;
};
