import { isNumber, isSeperator, maskDate } from "./mask";

describe("mask", () => {
  describe("isNumber", () => {
    it.each(["1", "2", "3", "4", "5", "6", "7", "8", "9"])(
      "%s is a number",
      (number) => {
        expect(isNumber(number)).toBeTruthy();
      }
    );

    it.each(["a", "A", "!", ".", "*", "-", "/"])(
      "%s is not a number",
      (number) => {
        expect(isNumber(number)).not.toBeTruthy();
      }
    );
  });

  describe("isSeperator", () => {
    it.each(["/", "-"])("%s is a seperator", (seperator) => {
      expect(isSeperator(seperator)).toBeTruthy();
    });
    it.each(["a", "A", "1", "!", "*", "."])(
      "%s is not a seperator",
      (seperator) => {
        expect(isSeperator(seperator)).not.toBeTruthy();
      }
    );
  });

  describe("maskDate", () => {
    describe("DD/MM/YYYY", () => {
      it.each([
        // Valid Day
        ["0", "0"],
        ["7", "7"],
        ["7/", "7/"],
        ["07", "07/"],
        ["22", "22/"],
        // Invalid Day
        ["99", "99/"],
        ["999", "99/"],
        ["99/", "31/"],
        ["00", "00/"],
        ["00/", "1/"],
        // Valid Month
        ["22/7/", "22/7/"],
        ["22/07", "22/07/"],
        ["22/12", "22/12/"],
        // Invalid Month
        ["22/99", "22/99/"],
        ["22/00", "22/00/"],
        ["22/0/", "22/1/"],
        ["22/00/", "22/1/"],
        // Valid Year
        ["22/07/1992", "22/07/1992"],
        // Invalid Year
        ["22/07/99999", "22/07/9999"],
      ])("%s is masked into %s", (input, output) => {
        expect(maskDate("", input, "DD/MM/YYYY")).toEqual(output);
      });

      it.each([
        // Deleting at Year.
        ["22/7/", "22/7", "22/"],
        ["22/07/", "22/07", "22/0"],
        // Deleting at Month.
        ["7/", "7", ""],
        ["07/", "07", "0"],
        ["10/", "10", "1"],
      ])("%s -> %s is deleted to %s", (previousInput, input, output) => {
        expect(maskDate(previousInput, input, "DD/MM/YYYY")).toEqual(output);
      });
    });

    describe("YYYY/MM/DD", () => {
      it.each([
        ["0000", "0000/"],
        ["99999/10", "9999/10/"],
      ])("%s is masked into %s", (input, output) => {
        expect(maskDate("", input, "YYYY/MM/DD")).toEqual(output);
      });

      it.each([
        ["99999", "99999"],
        ["99999/333", "9999/333"],
      ])("%s is masked into %s due to autofixed off", (input, output) => {
        expect(maskDate("", input, "YYYY/MM/DD", { autofix: false })).toEqual(
          output
        );
      });
    });

    it.each(["", "", "D", "M", "YYY"])("throws for invalid mask %s", (mask) => {
      expect(() => maskDate("", "22/07/1992", mask)).toThrow();
    });
  });
});
