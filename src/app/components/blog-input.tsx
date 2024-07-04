interface Props {
    name: string
    label?: string;
    value?: string;
    placeholder?: string;
    width?: 'short' | 'medium' | 'full'
    isBoldFont?: boolean;
    onChange: any
  }

export default function BlogInput({ label, name, value, placeholder, width = 'full', isBoldFont, onChange }: Props) {
    let inputClassName = "border-b pb-2 text-xl focus:outline-none text-gray-500 placeholder:text-gray-500 placeholder:font-normal placeholder:text-base y-2";

    if (isBoldFont) inputClassName += " font-bold"

    switch(width) {
      case 'short':
        inputClassName += " w-1/3"
        break;
      case 'medium':
        inputClassName += " w-2/3"
        break;
      case 'full':
        inputClassName += " w-full"
        break;
    }

    return (
        <label className="block my-4">
            <span className="block text-sm font-normal">{label ?? ""}</span>
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
