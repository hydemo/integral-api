import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';
import { Inject } from '@nestjs/common';
import { IdCardNoUtil } from 'src/utils/idCardNo.util';
import { BankCardNoUtil } from 'src/utils/bankCardNo.util';

const idCardNoUtil = new IdCardNoUtil();
const bankCardNoUtil = new BankCardNoUtil();

@ValidatorConstraint({ name: 'cardNumber', async: false })
export class CardNumberValidator implements ValidatorConstraintInterface {
	validate(text: string) {
		return idCardNoUtil.checkIdCardNo(text);
		// return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
	}

	defaultMessage(args: ValidationArguments) {
		// here you can provide default error message if validation failed
		return '身份证号($value)有误';
	}
}

@ValidatorConstraint({ name: 'bank', async: false })
export class BankCardNoValidator implements ValidatorConstraintInterface {
	validate(text: string) {
		return bankCardNoUtil.checkBankCardNo(text);
		// return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
	}

	defaultMessage(args: ValidationArguments) {
		// here you can provide default error message if validation failed
		return '银行卡号($value)有误';
	}
}
