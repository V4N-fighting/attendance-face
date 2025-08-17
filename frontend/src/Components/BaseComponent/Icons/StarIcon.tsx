import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";


export const StarIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faStar}  />;
};
