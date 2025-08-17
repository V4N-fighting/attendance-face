
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const MinusIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faMinus}  />;
};
