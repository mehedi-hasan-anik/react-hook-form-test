import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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
  });
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted", data);
  };
  const watchUserName = watch(["userName", "email"]);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  renderCount++;

  return (
    <div className="youtubeFormWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <button type="submit" className="submitBtn">
              Submit
            </button>
          </div>

          <DevTool control={control} />
        </div>
      </form>
    </div>
  );
}

export default YouTubeForm;
