
import { faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../styled";

export const MoneyIcon = ({ ...props }: Partial<React.ComponentProps<typeof Icon>>) => {
    return <Icon {...props} icon={faMoneyCheckDollar}  />;
};
