import { classNames } from "@/utils/classnames";

export const NeutralButton = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "block text-B0C4DB py-3 px-4 border border-B0C4DB mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9",
        className
      )}
    >
      {children}
    </button>
  );
};
