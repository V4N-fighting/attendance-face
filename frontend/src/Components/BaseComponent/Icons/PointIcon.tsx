
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const PointIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faCircle}  />;
};
