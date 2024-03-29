import { MESSAGES, VALIDATE } from '../constants/validate';

const validateField = (value, field) => {
  if ((!value || value.trim() === '') && value !== 0) {
    return MESSAGES.FIELD_REQUIRED;
  }

  switch (field) {
    case 'username':
      if (value.length < 3) {
        return MESSAGES.INVALID_FULL_NAME;
      } else {
        return '';
      }

    case 'email':
      if (!VALIDATE.EMAIL_VALIDATION_REGEX.test(value)) {
        return MESSAGES.INVALID_EMAIL;
      } else {
        return '';
      }

    case 'password':
      if (value.length < VALIDATE.MINIMUM_PASSWORD_LENGTH) {
        return MESSAGES.INVALID_PASSWORD;
      } else {
        return '';
      }

    case 'address':
      if (value.length < VALIDATE.MINIMUM_ADDRESS_LENGTH) {
        return MESSAGES.INVALID_ADDRESS;
      } else {
        return '';
      }

    case 'phone':
      if (!VALIDATE.PHONE_VALIDATION_REGEX.test(value)) {
        return MESSAGES.INVALID_PHONE;
      } else {
        return '';
      }

    case 'priceOdd':
    case 'priceNew':
    case 'limitProduct':
      if (value < 0 || isNaN(value)) {
        return MESSAGES.INVALID_PRICE_PRODUCT;
      } else {
        return '';
      }

    case 'categoryId':
      if (!value) {
        return MESSAGES.PRODUCT_CATEGORY_REQUIRED;
      } else {
        return '';
      }

    default:
      return '';
  }
};

export default validateField;
