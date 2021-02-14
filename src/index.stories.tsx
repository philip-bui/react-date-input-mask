import React from "react";
import moment from "moment";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import DateInputMask, { Props } from "./index";

export default {
  title: "ReactDateInputMask",
  component: DateInputMask,
} as Meta;

const Template: Story<Props> = (args) => {
  const [momentDate, setMoment] = React.useState(moment());
  return (
    <>
      <DateInputMask
        {...args}
        onChange={(e) => setMoment(moment(e.target.value, args.mask))}
      />
      <div>This is the moment date: {momentDate.toString()}</div>
    </>
  );
};

export const DD_MM_YYYY = Template.bind({});
DD_MM_YYYY.args = {
  placeholder: "DD/MM/YYYY",
  mask: "DD/MM/YYYY",
};

export const MM_DD_YYYY = Template.bind({});
MM_DD_YYYY.args = {
  placeholder: "MM/DD/YYYY",
  mask: "MM/DD/YYYY",
  autofix: false,
};

export const YYYY_MM_DD = Template.bind({});
YYYY_MM_DD.args = {
  placeholder: "YYYY/MM/DD",
  mask: "YYYY/MM/DD",
};
