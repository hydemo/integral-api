import { Injectable, Global } from '@nestjs/common';

@Injectable()
@Global()
export class BankCardNoUtil {
	luhnCheck(bankno) {
		const lastNum = +bankno.substr(bankno.length - 1, 1);
		const first15Num = bankno.substr(0, bankno.length - 1);
		const newArr: any = [];
		for (let i = first15Num.length - 1; i > -1; i -= 1) {
			newArr.push(first15Num.substr(i, 1));
		}
		const arrJiShu: any = [];
		const arrJiShu2: any = [];
		const arrOuShu: any = [];
		for (let j = 0; j < newArr.length; j += 1) {
			if ((j + 1) % 2 === 1) {
				if (parseInt(newArr[j], 10) * 2 < 9) {
					arrJiShu.push(parseInt(newArr[j], 10) * 2);
				} else {
					arrJiShu2.push(parseInt(newArr[j], 10) * 2);
				}
			} else {
				arrOuShu.push(newArr[j]);
			}
		}

		const jishuChild1: any = [];
		const jishuChild2: any = [];
		for (let h = 0; h < arrJiShu2.length; h += 1) {
			jishuChild1.push(parseInt(arrJiShu2[h], 10) % 10);
			jishuChild2.push(parseInt(arrJiShu2[h], 10) / 10);
		}

		let sumJiShu = 0;
		let sumOuShu = 0;
		let sumJiShuChild1 = 0;
		let sumJiShuChild2 = 0;
		let sumTotal = 0;
		for (let m = 0; m < arrJiShu.length; m += 1) {
			sumJiShu += parseInt(arrJiShu[m], 10);
		}

		for (let n = 0; n < arrOuShu.length; n += 1) {
			sumOuShu += parseInt(arrOuShu[n], 10);
		}

		for (let p = 0; p < jishuChild1.length; p += 1) {
			sumJiShuChild1 += parseInt(jishuChild1[p], 10);
			sumJiShuChild2 += parseInt(jishuChild2[p], 10);
		}
		sumTotal =
			parseInt(sumJiShu.toString(), 10) +
			parseInt(sumOuShu.toString(), 10) +
			parseInt(sumJiShuChild1.toString(), 10) +
			parseInt(sumJiShuChild2.toString(), 10);
		const k =
			parseInt(sumTotal.toString(), 10) % 10 === 0
				? 10
				: parseInt(sumTotal.toString(), 10) % 10;
		const luhn = 10 - k;
		if (lastNum === luhn) {
			return true;
		} else {
			return false;
		}
	}

	checkBankCardNo(bankno) {
		if (bankno.length < 16 || bankno.length > 19) {
			return false;
		}
		const num = /^\d*$/; // 全数字
		if (!num.exec(bankno)) {
			return false;
		}
		// 开头6位
		const strBin =
			'10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99';
		if (strBin.indexOf(bankno.substring(0, 2)) === -1) {
			return false;
		}
		// Luhn校验
		if (!this.luhnCheck(bankno)) {
			return false;
		}
		return true;
	}
}
