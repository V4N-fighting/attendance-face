
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const PlusIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faPlus}  />;
};
