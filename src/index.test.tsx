import React from "react";
import { render, fireEvent } from "@testing-library/react";

import DateInputMask from "./index";

describe("DateInputMask", () => {
  const props = {
    placeholder: "DD/MM/YYYY",
  };

  it("renders correctly", () => {
    const { container } = render(<DateInputMask {...props} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <input
          placeholder="DD/MM/YYYY"
          value=""
        />
      </div>
    `);
  });

  it.each(["22", "01", "18", "22/07", "99", "22/99"])(
    "autofills %s/ correctly",
    (value) => {
      const onChange = jest.fn();
      const { getByPlaceholderText } = render(
        <DateInputMask {...props} onChange={onChange} />
      );
      const input: HTMLInputElement = getByPlaceholderText(
        props.placeholder
      ) as HTMLInputElement;

      expect(input).toBeTruthy();

      fireEvent.input(input, { target: { value } });
      const autofilledValue = `${value}/`;
      expect(input.value).toEqual(autofilledValue);

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][0].target?.value).toEqual(autofilledValue);
    }
  );

  it("unmounts correctly", () => {
    const { unmount } = render(<DateInputMask {...props} />);
    expect(unmount).not.toThrow();
  });
});
