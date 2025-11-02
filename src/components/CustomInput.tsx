import { Form } from "react-bootstrap";

type CustomInputProps = {
  label?: string;
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name: string;
  as?:"input"|"textarea"|"select";
  options?: {value: string; label: string}[]
  isInvalid?: boolean;
  validationMsg?: string;
};

const CustomInput = (props: CustomInputProps) => {
  const {
    type,
    name,
    label,
    value,
    placeholder,
    onChange,
    as="input",
    options=[],
    isInvalid,
    validationMsg,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
    <Form.Group className="mb-3" controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}

      {as === "select" ? (
        <Form.Control
          as="select"
          name={name}
          value={value}
          onChange={handleChange}
          isInvalid={isInvalid}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Control>
      ) : (
        <Form.Control
          as={as}
          type={as === "input" ? type : undefined}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          isInvalid={isInvalid}
        />
      )}
      <Form.Control.Feedback type="invalid">
        {validationMsg}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default CustomInput;
