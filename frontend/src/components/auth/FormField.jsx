import Input from "../ui/Input";

export default function FormField({
  label,
  error,
  hint,
  required,
  children,
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-orange-500 ml-0.5">*</span>}
        </label>
      )}
      {children || <Input error={!!error} {...props} />}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}