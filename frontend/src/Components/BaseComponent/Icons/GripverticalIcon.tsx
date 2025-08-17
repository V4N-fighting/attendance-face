
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const GripverticalIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faGripVertical}  />;
};
