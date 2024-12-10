import create, { StateCreator } from "zustand";

interface PasswordFormField {
  label: string;
  type: string;
  required: boolean;
  err_message: string;
  name: string;
  placeholder: string;
}

interface PasswordFormState {
  formData: PasswordFormField[];
  formValues: { [key: string]: string }; 
  errors: { [key: string]: { message: string } };
  setFormData: (formData: PasswordFormField[]) => void;
  setFormValues: (formValues: { [key: string]: string }) => void; // New setter
  setErrors: (errors: { [key: string]: { message: string } }) => void;
  validatePasswords: () => boolean;
}

export const passwordFormInitialData: PasswordFormField[] = [
  {
    label: "Current password",
    type: "password",
    required: true,
    err_message: "Input your old password",
    name: "oldPassword",
    placeholder: "Input password",
  },
  {
    label: "New password",
    type: "password",
    required: true,
    err_message: "Input your new password",
    name: "password",
    placeholder: "Input password",
  },
  {
    label: "Confirm password",
    type: "password",
    required: true,
    err_message: "Input your confirm password",
    name: "password_confirmation",
    placeholder: "Input password",
  },
];

const passwordFormStoreSlice: StateCreator<
  PasswordFormState,
  [],
  [],
  PasswordFormState
> = (set, get) => ({
  formData: passwordFormInitialData,
  formValues: {}, // Initialize an empty form values state
  errors: {},
  setFormData: (formData) => set({ formData }),
  setFormValues: (formValues) => set({ formValues }), // New setter method
  setErrors: (errors) => set({ errors }),
  validatePasswords: () => {
    const { formValues } = get();
    const password = formValues["password"];
    const passwordAgain = formValues["password_confirmation"];

      const errors: { [key: string]: { message: string } } = {
        //@ts-ignore
      password:
        password !== passwordAgain
          ? { message: "Passwords do not match" }
          : null,
    };

    set({ errors });
    return !Object.values(errors).some(Boolean);
  },
});

export const usePasswordFormStore = create<PasswordFormState>(
  passwordFormStoreSlice,
);