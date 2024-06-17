interface Props {
    label: string
    type: "primary" | "secondary" | "warning"
    onClickFn: any
  }

export default function BlogButton({ label, type, onClickFn }: Props) {
    let className = "w-40 text-blog-blue hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mt-5 me-2 mb-2"

    switch(type) {
        case "primary":
            className = `${className} bg-gradient-to-br from-yellow to-green`
            break;
        case "secondary":
            className = `${className} bg-gradient-to-br from-light-blue to-purple`
            break;
        case "warning":
            className = `${className} bg-gradient-to-br from-light-blue to-red`
            break;
    }

    return (
    <button
        className={className}
        onClick={onClickFn}
      >
        { label }
      </button>
    )

}
