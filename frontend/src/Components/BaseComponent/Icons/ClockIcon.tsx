import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const ClockIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faClock} />
}