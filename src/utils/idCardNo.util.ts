import { Injectable, Global } from '@nestjs/common';

/*省,直辖市代码表*/
const provinceAndCitys = {
	11: '北京',
	12: '天津',
	13: '河北',
	14: '山西',
	15: '内蒙古',
	21: '辽宁',
	22: '吉林',
	23: '黑龙江',
	31: '上海',
	32: '江苏',
	33: '浙江',
	34: '安徽',
	35: '福建',
	36: '江西',
	37: '山东',
	41: '河南',
	42: '湖北',
	43: '湖南',
	44: '广东',
	45: '广西',
	46: '海南',
	50: '重庆',
	51: '四川',
	52: '贵州',
	53: '云南',
	54: '西藏',
	61: '陕西',
	62: '甘肃',
	63: '青海',
	64: '宁夏',
	65: '新疆',
	71: '台湾',
	81: '香港',
	82: '澳门',
	91: '国外',
};

/*每位加权因子*/
const powers = [
	'7',
	'9',
	'10',
	'5',
	'8',
	'4',
	'2',
	'1',
	'6',
	'3',
	'7',
	'9',
	'10',
	'5',
	'8',
	'4',
	'2',
];

/*第18位校检码*/
const parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

/*性别*/
const genders = { male: '男', female: '女' };
@Injectable()
@Global()
export class IdCardNoUtil {
	constructor() {}

	/*校验地址码*/
	checkAddressCode(addressCode) {
		const check = /^[1-9]\d{5}$/.test(addressCode);
		if (!check) return false;
		if (provinceAndCitys[parseInt(addressCode.substring(0, 2), 10)]) {
			return true;
		} else {
			return false;
		}
	}

	/*校验日期码*/
	checkBirthDayCode(birDayCode) {
		const check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(
			birDayCode,
		);
		if (!check) return false;
		const yyyy = parseInt(birDayCode.substring(0, 4), 10);
		const mm = parseInt(birDayCode.substring(4, 6), 10);
		const dd = parseInt(birDayCode.substring(6), 10);
		const xdata = new Date(yyyy, mm - 1, dd);
		if (xdata > new Date()) {
			return false; // 生日不能大于当前日期
		} else if (
			xdata.getFullYear() === yyyy &&
			xdata.getMonth() === mm - 1 &&
			xdata.getDate() === dd
		) {
			return true;
		} else {
			return false;
		}
	}

	/*计算校检码*/
	getParityBit(idCardNo) {
		const id17 = idCardNo.substring(0, 17);
		/*加权 */
		let power = 0;
		for (let i = 0; i < 17; i++) {
			power += parseInt(id17.charAt(i), 10) * parseInt(powers[i], 10);
		}
		/*取模*/
		const mod = power % 11;
		return parityBit[mod];
	}

	/*验证校检码*/
	checkParityBit(idCardNo) {
		const parityBi = idCardNo.charAt(17).toUpperCase();
		if (this.getParityBit(idCardNo) === parityBi) {
			return true;
		} else {
			return false;
		}
	}

	/* 校验15位或18位的身份证号码 */
	checkIdCardNo(idCardNo) {
		// 15位和18位身份证号码的基本校验
		const check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
		if (!check) return false;
		// 判断长度为15位或18位
		if (idCardNo.length === 15) {
			return this.check15IdCardNo(idCardNo);
		} else if (idCardNo.length === 18) {
			return this.check18IdCardNo(idCardNo);
		} else {
			return false;
		}
	}

	// 校验15位的身份证号码
	check15IdCardNo(idCardNo) {
		// 15位身份证号码的基本校验
		let check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(
			idCardNo,
		);
		if (!check) return false;
		// 校验地址码
		const addressCode = idCardNo.substring(0, 6);
		check = this.checkAddressCode(addressCode);
		if (!check) return false;
		const birDayCode = '19' + idCardNo.substring(6, 12);
		// 校验日期码
		return this.checkBirthDayCode(birDayCode);
	}

	// 校验18位的身份证号码
	check18IdCardNo(idCardNo) {
		// 18位身份证号码的基本格式校验
		let check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(
			idCardNo,
		);
		if (!check) return false;
		// 校验地址码
		const addressCode = idCardNo.substring(0, 6);
		check = this.checkAddressCode(addressCode);
		if (!check) return false;
		// 校验日期码
		const birDayCode = idCardNo.substring(6, 14);
		check = this.checkBirthDayCode(birDayCode);
		if (!check) return false;
		// 验证校检码
		return this.checkParityBit(idCardNo);
	}

	formateDateCN(day) {
		const yyyy = day.substring(0, 4);
		const mm = day.substring(4, 6);
		const dd = day.substring(6);
		return yyyy + '-' + mm + '-' + dd;
	}

	// 获取信息
	getIdCardInfo(idCardNo) {
		const idCardInfo = {
			gender: '', // 性别
			birthday: '', // 出生日期(yyyy-mm-dd)
		};
		if (idCardNo.length === 15) {
			const aday = '19' + idCardNo.substring(6, 12);
			idCardInfo.birthday = this.formateDateCN(aday);
			if (parseInt(idCardNo.charAt(14), 10) % 2 === 0) {
				idCardInfo.gender = genders.female;
			} else {
				idCardInfo.gender = genders.male;
			}
		} else if (idCardNo.length === 18) {
			const aday = idCardNo.substring(6, 14);
			idCardInfo.birthday = this.formateDateCN(aday);
			if (parseInt(idCardNo.charAt(16), 10) % 2 === 0) {
				idCardInfo.gender = genders.female;
			} else {
				idCardInfo.gender = genders.male;
			}
		}
		return idCardInfo;
	}

	/*18位转15位*/
	getId15(idCardNo) {
		if (idCardNo.length === 15) {
			return idCardNo;
		} else if (idCardNo.length === 18) {
			return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
		} else {
			return null;
		}
	}

	/*15位转18位*/
	getId18(idCardNo) {
		if (idCardNo.length === 15) {
			const id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
			const parityBi = this.getParityBit(id17);
			return id17 + parityBi;
		} else if (idCardNo.length === 18) {
			return idCardNo;
		} else {
			return null;
		}
	}
}
