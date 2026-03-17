import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
}

export default function PasswordInput({
  value,
  onChange,
  name = "password",
  autoComplete = "current-password",
  placeholder = "••••••••",
  required = true,
  minLength = 8,
  className = "",
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className={`w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 pr-10 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)] ${className}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
