
import {  faMountainSun} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const MountainSunIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faMountainSun}  />;
};
