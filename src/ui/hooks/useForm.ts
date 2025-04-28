import React from "react";

type Props = {
  [key: string]: any;
};

const useForm = (props: Props) => {
  const [values, setValues] = React.useState(props);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    },
    []
  );

  const reset = React.useCallback(() => {
    setValues(props);
  }, [props]);

  return { values, onChange, reset };
};

export default useForm;
