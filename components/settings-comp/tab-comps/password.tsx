import { Button } from "@/components/ui/button";
import { passwordFormData } from "@/utils";
import PasswordInput from "../password_input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { getOTP } from "@/services/misc";
import { useState } from "react";
import { useShowPasswordOtp } from "@/stores/misc";
import {
  passwordFormInitialData,
  usePasswordFormStore,
} from "@/stores/passwordResetStore";
import { passwordOTP } from "@/services/user";
import { useUserStore } from "@/stores/currentUserStore";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required("Input your old password"),
  password: yup
    .string()
    .required("Input your new password")
    .min(5, "Password must be at least 5 characters long"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Input your confirm password"),
});

const ChangePassword: React.FC<any> = ({}) => {
  const open = useShowPasswordOtp((state) => state.showOTP);
  const setOpen = useShowPasswordOtp((state) => state.setShowOTP);
  const { user: currentUser } = useUserStore();
  const { formData, setFormData,setFormValues, setErrors, validatePasswords } =
    usePasswordFormStore();
  const [isLoading, setIsLoading] = useState(false);
  // ResetUserPassword;
  // passwordOTP;
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  console.log(currentUser, "currentUser");
  const email = currentUser?.email
const onSubmit = async (data: any) => {
  setIsLoading(true);
  try {
    validatePasswords();
    setFormData(data);
    setFormValues(data);
    const res = await passwordOTP({ email });
    //@ts-ignore
    if (res?.message) {
      console.log(res, "response");
      //@ts-ignore
      toast.success(`${res.message} to ${email}`);
      setOpen(true);
      reset();
    }
  } catch (error) {
    console.error(error);
    //@ts-ignore
    toast.error("An error occurred while changing the password");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="block max-w-4xl"
        id="password-reset"
      >
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Password
              </h3>
              <p className="text-sm text-[#475467]">
                Please enter your current password to change your password.
              </p>
            </div>
            <div className="fixed bottom-0 left-0 z-30 grid w-full grid-cols-2 items-center gap-3 bg-white p-4 md:static md:inline-flex md:w-min md:p-0">
              <Button
                onClick={() => reset()}
                type="button"
                variant="outline"
                className="rounded-full px-6"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="rounded-full bg-main-100 text-white"
              >
                {isLoading ? (
                  <Loader className="animate-spin text-[#fff]" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {passwordFormInitialData.map((data: any, index: number) => {
              return (
                <PasswordInput
                  key={data?.name + index}
                  data={data}
                  errors={errors}
                  register={register}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
