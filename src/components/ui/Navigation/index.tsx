import type { ReactNode } from "react";
import { NavLink } from "router-kit";

interface NavigateButtonProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavigateButton = ({
  to,
  children,
  className = "",
  onClick,
}: NavigateButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    window.location.href = to;
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

// Pour les liens simples
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export const Link = ({ to, children, className = "" }: LinkProps) => {
  return (
    <NavLink to={to} className={className}>
      {children}
    </NavLink>
  );
};

export default NavigateButton;
