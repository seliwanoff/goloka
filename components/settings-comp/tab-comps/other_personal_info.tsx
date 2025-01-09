import { ethnicityOptions, genderOptions, otherInfo } from "@/utils";
import CustomSelectField from "../select_field";
import DatePicker from "../date_picker";
import { languages } from "@/components/contributor/Language";
import { ethnicities, religions } from "@/components/contributor/MoreInfo";
import { useEffect } from "react";
import CustomMultiSelect from "../multiSelect";

const getOptionsByName = (name: string) => {
  switch (name) {
    case "gender1":
      return genderOptions;
    case "religion":
      return religions;
    case "ethnicity":
      return ethnicities;
    case "primaryLanguage":
      return languages;
    case "spokenLanguage":
      return languages;
    default:
      return [];
  }
};

const OtherPersonalInfo: React.FC<any> = ({
  errors,
  register,
  control,
  reset,
  defaultValues,
}) => {
  useEffect(() => {
    console.log("OtherPersonalInfo defaultValues:", defaultValues);
  }, [defaultValues]);

  const isMultiSelect = (fieldName: string) => {
    return ["spokenLanguage"].includes(fieldName);
  };
  return (
    <div className="mt-8 rounded-2xl bg-white p-6">
      <div className="space-y-4 md:mt-8 md:grid md:grid-cols-2 md:gap-x-[18px] md:gap-y-6 md:space-y-0">
        {otherInfo.map((data, index) => {
          if (data.type === "date") {
            return (
              <DatePicker
                key={data.name}
                data={data}
                errors={errors}
                register={register}
                control={control}
                defaultValue={defaultValues?.[data.name]}
              />
            );
          }

          const SelectComponent = isMultiSelect(data.name)
            ? CustomMultiSelect
            : CustomSelectField;

          return (
            <SelectComponent
              key={data.name + index}
              data={data}
              errors={errors}
              register={register}
              control={control}
              options={getOptionsByName(data.name)}
              defaultValue={defaultValues?.[data.name]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OtherPersonalInfo;
