interface Props {
    onChange: any
}

export default function blogSummary({ onChange }: Props) {
    return (
        <label className="block my-4">
        <span className="text-sm font-normal">Summary</span>
        <textarea
          className="border-b pb-2 text-l focus:outline-none w-full text-gray-500 placeholder:text-gray-500 placeholder:font-normal placeholder:text-base y-2"
          placeholder="Enter a blog summary"
          name="summary"
          onChange={onChange}
        />
      </label>
    )
}
