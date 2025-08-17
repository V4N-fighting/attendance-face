
import { Icon } from "../../../styled";
import { faPinterestP } from "@fortawesome/free-brands-svg-icons";

export const PinterestIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faPinterestP}  />;
};
