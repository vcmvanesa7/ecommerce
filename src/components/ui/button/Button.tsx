import React from "react";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = 'button',
  ...aria
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-md border focus:outline-none focus:ring"
      {...aria}
    >
      {label}
    </button>
  );
};

export default Button;




// import styles from "@/components/ui/button/Button.module.css";

// export interface ButtonProps {
//   children: React.ReactNode;
//   onClick?: () => void;
//   variant?: "primary" | "secondary" | "danger" | "outline" | "destructive";
//   size?: "sm" | "md" | "lg";
//   type?: "button" | "submit"; 
//   disabled?: boolean;
//   className?: string;
//   "aria-disabled"?: boolean;
// }

// export const Button: React.FC<ButtonProps> = ({
//   children,
//   onClick,
//   variant = "primary",
//   size = "md",
//   type = "submit", 
//   disabled = false,
//   className = "",
//   "aria-disabled": ariaDisabled,
//   ...rest
// }) => {
//   const classNames = [
//     styles.button,
//     styles[variant],
//     styles[size],
//     disabled ? styles.disabled : "",
//     className,
//   ].join(" ");

//   return (
//     <button
//       type={type}
//       onClick={!disabled ? onClick : undefined}
//       className={classNames}
//       disabled={disabled}
//       aria-disabled={ariaDisabled}
//       {...rest}
//     >
//       {children}
//     </button>
//   );
// };
