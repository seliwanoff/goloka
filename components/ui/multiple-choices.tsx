import { useState } from "react";

interface Option {
  id: number;
  value: string;
}

interface DynamicListInputProps {
  label?: string;
  placeholder?: string;
  initialOptions?: Option[];
  onOptionsChange?: (options: Option[]) => void;
  preview?: any;
  tab?: string;
}

const MultipleChoices: React.FC<DynamicListInputProps> = ({
  label = "Options",
  placeholder = "Enter an option",
  initialOptions = [],
  onOptionsChange,
  preview,
  tab,
}) => {
  const [options, setOptions] = useState<Option[]>(initialOptions);

  const handleAddOption = () => {
    const newOption = { id: Date.now(), value: "" };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
  };

  const handleOptionChange = (id: number, value: string) => {
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, value } : option,
    );
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
  };

  const handleRemoveOption = (id: number) => {
    const updatedOptions = options.filter((option) => option.id !== id);
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === "Enter") {
      const currentOption = options.find((option) => option.id === id);
      if (currentOption?.value.trim() !== "") {
        handleAddOption();
      }
    }
  };

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center gap-4">
          {tab !== "response" && (
            <span className="text-gray-500">{index + 1}.</span>
          )}
          <input
            type="text"
            value={option.value}
            onChange={(e) => handleOptionChange(option.id, e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, option.id)}
            placeholder={placeholder}
            className="flex-grow rounded-md border-none text-gray-800 focus:border-blue-500 focus:outline-none"
          />
          {preview !== "preview" && (
            <button
              onClick={() => handleRemoveOption(option.id)}
              className="h-8 w-8 rounded-full bg-[#F8F8F8] text-[12px] text-[#828282] transition hover:text-[#828282]"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {preview !== "preview" && (
        <button
          onClick={handleAddOption}
          className="flex items-center gap-2 text-gray-600 transition hover:text-gray-600"
        >
          <span className="text-xl">+</span> Add another option
        </button>
      )}
    </div>
  );
};

export default MultipleChoices;
