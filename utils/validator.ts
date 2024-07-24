import { RULES_VALIDATION } from "~/constants/application";

export const useValidator = () => {
  return {
    required: (value: string | number, attrName: string) => {
      return !!value || attrName + ` đang để trống`;
    },

    isNumber: (value: string, attrName: string) => {
      if (value == '') {
        return useValidator().required(value, attrName);
      }

      return !value || /^\d+$/.test(value) || attrName + ' đang là định dạng số'
    },

    isLength: (value: string, attrName: string, min: number, max: number, required: boolean = false) => {
      if (value == '' && !required) {
        return useValidator().required(value, attrName);
      }

      return (
        !value ||
        (value.length <= max && value.length >= min) ||
        attrName + ` phải từ ${min} đến ${max} ký tự`
      )
    },

    isMax: (max: number) => {
      return (value: string) => {
        return (
          !value || value.length <= max || `${max}文字以下入力してください。`
        )
      }
    },

    isInvalidEmail: (email: string, required: boolean = false) => {
      const emailRegex = RULES_VALIDATION.EMAIL_FORMAT;
      if (email == '' && !required) {
        return true;
      }

      return emailRegex.test(email);
    },

    isPhoneNumber: (phone: number) => {
      var regex = RULES_VALIDATION.PHONE_FORMAT;
      return String(phone).match(regex);
    },

    isZipCode: (code: string) => {
      var regex = RULES_VALIDATION.ZIP_CODE;
      return String(code).match(regex);
    },

    isValidTime: (string: string) => {
      let res = string.match(RULES_VALIDATION.VALID_TIME);
      return !(res == null);
    },
  }
}
