import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";

type FormValues = {
  userName: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};
let renderCount = 0;

function YouTubeForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      userName: "batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
    // mode: "onBlur",
    // mode: "onTouched",
    // mode: "onChange",
    // mode: "all",
    mode: "onSubmit",
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form;
  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
  } = formState;
  console.log({ isSubmitting, isSubmitted, isSubmitSuccessful, submitCount });

  console.log(touchedFields, dirtyFields, isDirty, isValid);

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  const watchUserName = watch(["userName", "email"]);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const hadleGetValues = () => {
    console.log("getValues1", getValues());
    console.log("getValues2", getValues("social.facebook"));
    console.log("getValues3", getValues(["userName", "channel"]));
  };

  const hadleSetValues = () => {
    setValue("userName", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  renderCount++;

  return (
    <div className="youtubeFormWrapper">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="innerYoutubeFormWrapper">
          <h1>YouTube Form ({renderCount / 2})</h1>
          <h2>{watchUserName}</h2>

          <div className="singleSection">
            <label htmlFor="userName">Username: </label>
            <input
              type="text"
              id="userName"
              {...register("userName", {
                required: {
                  value: true,
                  message: "Username is required",
                },
              })}
            />
            <p className="error">{errors?.userName?.message}</p>
          </div>

          <div className="singleSection">
            <label htmlFor="email">E-mail: </label>
            <input
              type="text"
              id="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
                validate: {
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "admin@example.com" ||
                      "Enter a different email address"
                    );
                  },
                  notBlackListed: (fieldValue) => {
                    return (
                      !fieldValue.endsWith("baddomain.com") ||
                      "This domain is not supported"
                    );
                  },
                  emailAvailable: async (fieldValue) => {
                    const response = await fetch(
                      `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                    );
                    const data = await response.json();
                    return data.length == 0 || "Email already exists";
                  },
                },
              })}
            />
            <p className="error">{errors?.email?.message}</p>
          </div>

          <div className="singleSection">
            <label htmlFor="channel">channel: </label>
            <input
              type="text"
              id="channel"
              {...register("channel", {
                required: {
                  value: true,
                  message: "Channel is required",
                },
              })}
            />
            <p className="error">{errors?.channel?.message}</p>
          </div>

          <div className="singleSection">
            <label htmlFor="twitter">Twitter: </label>
            <input type="text" id="twitter" {...register("social.twitter")} />
            <p></p>
          </div>

          <div className="singleSection">
            <label htmlFor="facebook">Facebook: </label>
            <input type="text" id="facebook" {...register("social.facebook")} />
            <p></p>
          </div>

          <div className="singleSection">
            <label htmlFor="primary-phone">Primary Phone Number: </label>
            <input
              type="text"
              id="primary-phone"
              {...register("phoneNumbers.0")}
            />
            <p></p>
          </div>

          <div className="singleSection">
            <label htmlFor="secondary-phone">Secondary Phone Number: </label>
            <input
              type="text"
              id="secondary-phone"
              {...register("phoneNumbers.1")}
            />
            <p></p>
          </div>

          <div className="singleSection">
            <label htmlFor="age">Age: </label>
            <input
              type="number"
              id="age"
              {...register("age", {
                required: {
                  value: true,
                  message: "age is required",
                },
              })}
            />
            <p className="error">{errors?.age?.message}</p>
          </div>

          <div className="singleSection">
            <label htmlFor="dob">Date of Birth: </label>
            <input
              type="date"
              id="dob"
              {...register("dob", {
                valueAsDate: true,
                required: {
                  value: true,
                  message: "Date of Birth is required",
                },
              })}
            />
            <p className="error">{errors?.dob?.message}</p>
          </div>

          <div className="singleSection">
            <label htmlFor="secondary-phone">List of phone number: </label>
            {fields?.map((field, index) => {
              return (
                <div className="singleSection" key={index}>
                  <div className="listField">
                    <input
                      type="text"
                      {...register(`phNumbers.${index}.number` as const)}
                    />
                    {index > 0 && (
                      <button type="button" onClick={() => remove(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add
            </button>
          </div>

          <div className="singleSection">
            <button
              type="submit"
              className="submitBtn"
              disabled={!isDirty || isSubmitting}
            >
              Submit
            </button>
            <button type="button" onClick={hadleGetValues}>
              Get values
            </button>
            <button type="button" onClick={hadleSetValues}>
              Set values
            </button>
            <button type="button" onClick={() => reset()}>
              Reset
            </button>
            <button type="button" onClick={() => trigger("channel")}>
              Validate
            </button>
          </div>

          <DevTool control={control} />
        </div>
      </form>
    </div>
  );
}

export default YouTubeForm;
