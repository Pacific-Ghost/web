import { LinkProps } from "react-router-dom";
import { Link as RRLink } from "react-router-dom";
import { PropsWithChildren } from "react";
import cx from "classnames";

export function Link({ children, ...rest }: PropsWithChildren<LinkProps>) {
  const css = cx(rest.className, "text-gray-900 no-underline");
  return (
    <RRLink className={css} {...rest}>
      {children}
    </RRLink>
  );
}

export default Link;
