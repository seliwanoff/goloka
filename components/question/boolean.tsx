// Import necessary React and TypeScript modules
import React from "react";

type RadioButtonProps = {
  label: string; // Label for the radio button (e.g., True or False)
  value: string; // Value for the radio button
  isSelected: boolean; // Whether the button is selected
  onChange: (value: string) => void; // Function to call when the button is selected
};

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  isSelected,
  onChange,
}) => {
  return (
    <label
      className={`${isSelected ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-500"} mx-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-[#F8F8F8] px-4 py-2 font-poppins text-[14px] font-medium transition-all duration-300`}
    >
      <input
        type="radio"
        name="radio-group"
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
      />
      {label}
    </label>
  );
};

type RadioGroupWrapperProps = {
  options: { label: string; value: string }[]; // Array of options (True/False)
  selectedValue: string; // Currently selected value
  onChange: (
    selectedValue: string,
    options: { label: string; value: string }[],
  ) => void; // Function to call when a value is selected
};

const RadioGroupWrapper: React.FC<RadioGroupWrapperProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const handleChange = (value: string) => {
    onChange(value, options);
  };

  return (
    <div className="flex justify-start gap-3">
      {options.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          value={option.value}
          isSelected={selectedValue === option.value}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default RadioGroupWrapper;

// Usage Example

{
  /***
const Boolean: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <RadioGroupWrapper
      options={[
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ]}
      selectedValue={selectedValue}
      onChange={handleSelectionChange}
    />
  );
};

export default Boolean;
*/
}
