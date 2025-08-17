
import { faHotel } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const HotelIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faHotel}  />;
};
