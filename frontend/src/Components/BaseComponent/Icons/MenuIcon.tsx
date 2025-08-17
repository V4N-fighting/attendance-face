import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const MenuIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faTicket} />
}