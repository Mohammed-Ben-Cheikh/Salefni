import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", label, error, helpText, type = "text", ...props },
    ref
  ) => {
    const inputClasses = `
      block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      ${error ? "border-red-300 focus:ring-red-500" : "border-gray-300"}
      ${className}
    `;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input ref={ref} type={type} className={inputClasses} {...props} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
