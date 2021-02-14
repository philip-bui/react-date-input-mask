export const isNumber = (number: string): boolean => /[0-9]/.test(number);

export const isSeperator = (seperator: string): boolean =>
  /(\/|-)/.test(seperator);

export const removeNonMaskCharacters = (input: string): string =>
  input.replace(/[a-zA-Z]/, "");

export const maskDate = (
  previousInput: string,
  input: string,
  mask = "DD/MM/YYYY",
  options = {
    autofix: true,
  }
): string => {
  if (
    input.length + 1 === previousInput.length &&
    input === previousInput.substring(0, input.length) &&
    isSeperator(previousInput.charAt(previousInput.length - 1))
  ) {
    return input.substring(0, input.length - 1);
  }
  const { autofix = true } = options;
  input = removeNonMaskCharacters(input);
  const stringBuilder: string[] = [];

  let isLastSectionValid = false;
  for (let i = 0, maskI = 0; i < input.length; i += 1) {
    let maskEnd = maskI;
    while (
      maskEnd < mask.length &&
      !isSeperator(mask.substring(maskEnd, maskEnd + 1))
    ) {
      maskEnd += 1;
    }
    const subMask = mask.substring(maskI, maskEnd);
    maskI = maskEnd;

    let end = i;
    while (end < input.length && isNumber(input.substring(end, end + 1))) {
      end += 1;
    }
    let numberString = input.substring(i, end);
    if (autofix) {
      numberString = numberString.substring(0, subMask.length);
    }
    const number = parseInt(numberString, 10);
    i = end;

    const hasNext = i < input.length;

    switch (subMask) {
      case "DD":
        if (hasNext && (number > 31 || number < 1)) {
          stringBuilder.push(`${Math.min(31, Math.max(1, number))}`);
        } else {
          isLastSectionValid = number >= 1 && number <= 31;
          stringBuilder.push(numberString);
        }
        break;
      case "MM":
        if (hasNext && (number > 12 || number < 1)) {
          stringBuilder.push(`${Math.min(12, Math.max(1, number))}`);
        } else {
          isLastSectionValid = number >= 1 && number <= 12;
          stringBuilder.push(numberString);
        }
        break;
      case "YYYY":
        if (hasNext && (number > 9999 || number < 0)) {
          stringBuilder.push(`${Math.min(9999, Math.abs(number))}`);
        } else {
          isLastSectionValid = number >= 0 && number <= 9999;
          stringBuilder.push(numberString);
        }
        break;
      default:
        throw new Error(`Invalid mask ${mask}`);
    }

    if (i >= input.length || maskI >= mask.length) {
      break;
    }

    stringBuilder.push(mask.charAt(maskI));
    maskI += 1;
  }

  const output = stringBuilder.join("");
  if (!autofix && !isLastSectionValid) {
    return output;
  }

  const isNextCharASeperator: boolean =
    output.length < mask.length && isSeperator(mask.charAt(output.length));
  const isLastCharASeperator: boolean =
    output.length > 0 && !isNumber(output.charAt(output.length - 1));

  // Pre-fill seperator
  if (
    isNextCharASeperator &&
    !isLastCharASeperator &&
    previousInput.length <= output.length
  ) {
    return `${output}${mask.charAt(output.length)}`;
  }

  return output;
};
