
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const UserIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faUsers}  />;
};
