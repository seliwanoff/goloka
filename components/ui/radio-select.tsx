import { useState } from "react";

interface Option {
  id: number;
  value: string;
  checked: boolean;
}

interface RadioSelectionProps {
  value?: string;
  initialOptions?: Option[];
  onOptionsChange?: (options: Option[]) => void;
  preview?: any;
  tab?: string;
}

const RadioSelection: React.FC<RadioSelectionProps> = ({
  value = "Options",
  initialOptions = [],
  onOptionsChange,
  preview,
  tab,
}) => {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [newOptionLabel, setNewOptionLabel] = useState<string>("");

  const handleCheckboxToggle = (id: number) => {
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, checked: !option.checked } : option,
    );
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
  };

  const handleAddOption = () => {
    if (newOptionLabel.trim() === "") return;
    const newOption: Option = {
      id: Date.now(),
      value: newOptionLabel,
      checked: false,
    };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
    setNewOptionLabel(""); // Clear the input field after adding
  };

  const handleRemoveOption = (id: number) => {
    const updatedOptions = options.filter((option) => option.id !== id);
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-3">
            {tab !== "response" && (
              <input
                type="radio"
                id={`radio-${option.id}`}
                name="radioGroup"
                checked={option.checked}
                onChange={() => handleCheckboxToggle(option.id)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            )}
            <label
              htmlFor={`radio-${option.id}`}
              className="flex-grow cursor-pointer text-gray-800"
            >
              {option.value}
            </label>
            {preview !== "preview" && (
              <button
                onClick={() => handleRemoveOption(option.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      {preview !== "preview" && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newOptionLabel}
            onChange={(e) => setNewOptionLabel(e.target.value)}
            placeholder="Enter new option"
            className="flex-grow rounded-md border-gray-300 px-2 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
          />

          <button
            onClick={handleAddOption}
            className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default RadioSelection;
