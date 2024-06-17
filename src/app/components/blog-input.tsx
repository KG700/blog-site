interface Props {
    name: string
    label?: string;
    value?: string;
    placeholder?: string;
    isboldFont?: boolean;
    onChange: any
  }

export default function BlogInput({ label, name, value, placeholder, isboldFont, onChange }: Props) {
    let inputClassName = "border-b pb-2 text-xl focus:outline-none w-full text-gray-500 placeholder:text-gray-500 placeholder:font-normal placeholder:text-base y-2";

    if (isboldFont) inputClassName += " font-bold"

    return (
        <label className="block my-4">
            <span className="text-sm font-normal">{label ?? ""}</span>
            <input
            onChange={onChange}
            name={name}
            placeholder={placeholder ?? ""}
            value={value ?? ""}
            className={inputClassName}
            />
      </label>
    )
}
