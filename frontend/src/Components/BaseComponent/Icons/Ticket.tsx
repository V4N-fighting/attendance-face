
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const Ticket = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faTicket}  />;
};
