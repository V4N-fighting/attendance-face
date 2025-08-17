
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const LanguageIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faLanguage}  />;
};
