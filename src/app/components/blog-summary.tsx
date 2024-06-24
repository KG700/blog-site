import { useState } from "react";

interface Props {
    value?: string
    onChange: any
}

export default function BlogSummary({ onChange, value }: Props) {
  const [count, setCount] = useState(0);

    return (
        <label className="block my-4">
        <span className="text-sm font-normal">Summary</span>
        <textarea
          className="border-b pb-2 text-l focus:outline-none w-full text-gray-500 placeholder:text-gray-500 placeholder:font-normal placeholder:text-base y-2"
          placeholder="Enter a blog summary"
          name="summary"
          value={value}
          maxLength={1000}
          rows={6}
          onChange={(e) => {
            onChange(e);
            setCount(e?.target.value.length ?? 0);
          }}
        />
        <p className="float-right">{count}/1000</p>
      </label>
    )
}
