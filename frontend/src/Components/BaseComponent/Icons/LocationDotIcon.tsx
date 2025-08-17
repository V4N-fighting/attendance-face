import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const LocationDotIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faLocationDot} />
}