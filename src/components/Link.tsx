import { LinkProps } from "react-router-dom";
import { Link as RRLink } from "react-router-dom";
import { PropsWithChildren } from "react";

export function Link({ children, ...rest }: PropsWithChildren<LinkProps>) {
  return (
    <RRLink className={"text-gray-900 no-underline"} {...rest}>
      {children}
    </RRLink>
  );
}

export default Link;
