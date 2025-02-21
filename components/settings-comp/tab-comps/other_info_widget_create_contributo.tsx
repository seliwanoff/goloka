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

const OtherContributorWidget: React.FC<any> = ({
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
    //  console.log(fieldName);
    return ["spokenLanguage"].includes(fieldName);
  };
  return (
    <div className="">
      <div className="flex flex-col gap-2">
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

export default OtherContributorWidget;
