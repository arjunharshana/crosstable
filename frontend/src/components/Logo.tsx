import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";

interface LogoProps {
  className?: string;
}
export function Logo({ className = "h-12" }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Light Mode Logo: */}
      <img
        src={logoLight}
        alt="CrossTable"
        className="block dark:hidden h-full w-auto"
      />

      {/* Dark Mode Logo */}
      <img
        src={logoDark}
        alt="CrossTable"
        className="hidden dark:block h-full w-auto"
      />
    </div>
  );
}
