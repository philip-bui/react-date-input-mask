import React from "react";
import { maskDate } from "./mask";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string;
  autofix?: boolean;
}

export default class DateInputMask extends React.PureComponent<Props> {
  state = {
    value: "",
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange, mask, autofix = true } = this.props;
    const { value } = this.state;
    const nextValue = e.target.value;

    const maskedDate = maskDate(value, nextValue, mask, { autofix });
    this.setState({ value: maskedDate });

    if (onChange) {
      onChange(e);
    }
  };

  render(): React.ReactNode {
    const { props } = this;
    const { value } = this.state;
    return <input value={value} {...props} onChange={this.onChange} />;
  }
}
