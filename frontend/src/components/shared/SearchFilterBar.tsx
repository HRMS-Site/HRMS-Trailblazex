import { Input } from "@/components/ui/input";

export function SearchFilterBar({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4 w-full max-w-full">
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full max-w-full sm:max-w-sm"
      />
    </div>
  );
}
