
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const SearchIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faMagnifyingGlass}  />;
};
