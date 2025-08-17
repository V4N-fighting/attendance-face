
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const EnvelopeIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faEnvelope}  />;
};
