import { Injectable } from '@nestjs/common';
import {
	createHash,
	createCipher,
	createDecipher,
	createECDH,
	randomBytes,
} from 'crypto';
import * as bs58 from 'bs58';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';

const key = 'HZF4tlVKZ0IsS3MfQgDi';
@Injectable()
export class CryptoUtil {
	/**
	 * 加密登录密码
	 *
	 * @param password 登录密码
	 */
	encryptPassword(password: string): string {
		return createHash('sha256')
			.update(password)
			.digest('hex');
	}

	/**
	 * 检查登录密码是否正确
	 *
	 * @param password 登录密码
	 * @param encryptedPassword 加密后的密码
	 */
	checkPassword(password: string, encryptedPassword): boolean {
		const currentPass = this.encryptPassword(password);
		if (currentPass !== encryptedPassword) {
			throw new ApiException('密码有误', ApiErrorCode.NO_PERMISSION, 403);
		}
		return true;
	}

	/**
	 * aes对称加密
	 *
	 * @param str 加密字断
	 */
	aesEncrypt(str: string): string {
		const cipher = createCipher('aes-256-cbc', key);
		let crypted = cipher.update(str, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	}

	/**
	 * aes对称解密
	 *
	 * @param str 登录密码
	 */
	aesDecrypt(str: string): string {
		const decipher = createDecipher('aes-256-cbc', key);
		let decrypted = decipher.update(str, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}

	/**
	 * aes对称加密
	 *
	 * @param str 加密字断
	 */
	createBitcoinAddress() {
		/** Create Bitcoin Address */
		const ecdh = createECDH('secp256k1');
		// 0 - Having a private ECDSA key
		const privateKey = randomBytes(32);
		// 1 - Take the corresponding public key generated with it (33 bytes, 1 byte 0x02 (y-coord is even),
		// and 32 bytes corresponding to X coordinate)
		ecdh.setPrivateKey(privateKey);
		const cpublicKey = Buffer.from(
			ecdh.getPublicKey('hex', 'compressed'),
			'hex',
		);
		// 2 - Perform SHA-256 hashing on the public key
		const sha1 = createHash(`sha256`)
			.update(cpublicKey)
			.digest();
		// 3 - Perform RIPEMD-160 hashing on the result of SHA-256
		const ripemd160 = createHash(`rmd160`)
			.update(sha1)
			.digest();
		// 4 - Add version byte in front of RIPEMD-160 hash (0x00 for Main Network, 0x6f for Testnet)
		const version = Buffer.from([0x00]);
		let extendedPriKey = Buffer.alloc(ripemd160.length + version.length);
		extendedPriKey = Buffer.concat([version, ripemd160], extendedPriKey.length);
		// 5 - Perform SHA-256 hash on the extended RIPEMD-160 result
		const sha2 = createHash(`sha256`)
			.update(extendedPriKey)
			.digest();
		// 6 - Perform SHA-256 hash on the result of the previous SHA-256 hash
		const sha3 = createHash(`sha256`)
			.update(sha2)
			.digest();
		// 7 - Take the first 4 bytes of the second SHA-256 hash. This is the address checksum
		const checksum = Buffer.alloc(4);
		sha3.copy(checksum, 0, 0, checksum.length);
		// 8 - Add the 4 checksum bytes from stage 7 at the end of extended RIPEMD-160 hash from stage 4.
		// This is the 25-byte binary Bitcoin Address.
		let btcAddress = Buffer.alloc(extendedPriKey.length + checksum.length);
		btcAddress = Buffer.concat([extendedPriKey, checksum], btcAddress.length);
		// 9 - Convert the result from a byte string into a base58 string using Base58Check encoding.
		// This is the most commonly used Bitcoin Address format
		const address = bs58.encode(btcAddress);
		return address;
	}

	/**
	 * 姓名加密
	 *
	 * @param str 姓名加密
	 */
	signName(originStr: string): string {
		const str = this.aesDecrypt(originStr);
		const { length = 0 } = str;
		if (length < 2) {
			return '*';
		}
		if (length === 2) {
			return `${str[0]}*`;
		}
		return `${str[0]}${'*'.repeat(length - 2)}${str[length - 1]}`;
	}

	/**
	 * 长字符加密
	 *
	 * @param str 长字符加密
	 */
	signLongString(originStr: string): string {
		const str = this.aesDecrypt(originStr);
		const { length = 0 } = str;
		if (length < 7) {
			return '*';
		}
		return `${str.slice(0, 3)}${'*'.repeat(length - 7)}${str.slice(
			length - 4,
			length,
		)}`;
	}
}
