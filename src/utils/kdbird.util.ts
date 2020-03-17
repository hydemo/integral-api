import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs'
import * as md5 from 'md5';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class KDBirdUtil {
  constructor(
    private readonly config: ConfigService,
  ) { }

  /**
   * 生成加密数据
   *
   */
  generateDataSign(requestData: string): any {
    return encodeURI(Buffer.from(md5(requestData + this.config.kdBirdApiKey)).toString('base64'));
    // return encodeURI(buffer);

  }
  /**
   * 生成应用级参数
   *
   */
  generateRequestData(shipperCode, logisticCode, orderCode = '') {
    // 参数验证
    const requestData = {
      OrderCode: orderCode,
      ShipperCode: shipperCode,
      LogisticCode: logisticCode
    };
    return JSON.stringify(requestData);
  }

  /**
   * 生成系统级参数
   *
   */
  generateFromData(requestData: string, RequestType: string) {
    const fromData = {
      RequestData: encodeURI(requestData),
      EBusinessID: this.config.kdBirdEBusiness,
      RequestType,
      DataSign: this.generateDataSign(requestData),
      DataType: '2'
    };
    return fromData;
  }

  /**
   * 发起请求
   *
   */
  async queryExpress(shipperCode, logisticCode, orderCode = '') {
    let expressInfo = {
      success: false,
      shipperCode: shipperCode,
      shipperName: '',
      logisticCode: logisticCode,
      isFinish: 0,
      traces: []
    };
    const requestData = this.generateRequestData(shipperCode, logisticCode, orderCode)
    const fromData = this.generateFromData(requestData, '1002')
    try {
      const result = await axios({
        method: 'POST',
        url: this.config.kdBirdUrl,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        params: fromData
      });
      if (!result) {
        return expressInfo;
      }
      expressInfo = this.parseExpressResult(result.data);
      expressInfo.shipperCode = shipperCode;
      expressInfo.logisticCode = logisticCode;
      return expressInfo;
    } catch (err) {
      return expressInfo;
    }
  }

  /**
   * 处理返回
   *
   */
  parseExpressResult(requestResult) {
    const expressInfo = {
      success: false,
      shipperCode: '',
      shipperName: '',
      logisticCode: '',
      isFinish: 0,
      traces: []
    };
    try {
      if (!requestResult.Success) {
        return expressInfo;
      }
      // 判断是否已签收
      if (Number.parseInt(requestResult.State) === 3) {
        expressInfo.isFinish = 1;
      }
      expressInfo.success = true;
      if (requestResult.Traces && Array.isArray(requestResult.Traces)) {
        expressInfo.traces = requestResult.Traces.map(item => {
          return { datetime: item.AcceptTime, content: item.AcceptStation };
        });
        expressInfo.traces.reverse()
      }
      return expressInfo;
    } catch (err) {
      return expressInfo;
    }
  }

  /**
  * 发起请求
  *
  */
  async queryShipperCode(LogisticCode) {
    const requestData = JSON.stringify({ LogisticCode })
    const fromData = this.generateFromData(requestData, '2002');
    try {
      const result = await axios({
        method: 'POST',
        url: this.config.kdBirdUrl,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        params: fromData
      });
      // console.log(result.data, 'result')
      return result.data
      // if (!result) {
      //   return expressInfo;
      // }
      // expressInfo = this.parseExpressResult(result.data);
      // expressInfo.shipperCode = shipperCode;
      // expressInfo.logisticCode = logisticCode;
      // return expressInfo;
    } catch (err) {
      return []
      // console.log(err, 'err')
      // return expressInfo;
    }
  }

  /**
  * 发起请求
  *
  */
  async genOrder() {
    const Receiver = {
      "Company": "GCCUI",
      "Name": "Yann",
      "Mobile": "15018442396",
      "ProvinceName": "北京",
      "CityName": "北京市",
      "ExpAreaName": "朝阳区",
      "Address": "三里屯街道"
    }
    const Sender = {
      "Company": "LV",
      "Name": "Taylor",
      "Mobile": "15018442396",
      "ProvinceName": "上海",
      "CityName": "上海市",
      "ExpAreaName": "青浦区",
      "Address": "明珠路"
    }
    const Commodity = [
      {
        "GoodsName": "鞋子",
        "GoodsQuantity": 1,
        "GoodsWeight": 1.0
      },
      {
        "GoodsName": "衣服",
        "GoodsQuantity": 1,
        "GoodsWeight": 1.0
      },
    ]
    const data = {
      "OrderCode": "012657018199",
      "ShipperCode": "SF",
      "PayType": 1,
      "ExpType": 1,
      "Quantity": 1,
      Receiver,
      Sender,
      Commodity,
      " CustomerID ": "1234567890",
      IsReturnPrintTemplate: 1,
    }
    const requestData = JSON.stringify(data)
    const fromData = this.generateFromData(requestData, '1007')
    try {
      const result = await axios({
        method: 'POST',
        url: this.config.kdBirdUrl,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        params: fromData
      });
      fs.writeFileSync('./a.html', result.data.PrintTemplate)
      // if (!result) {
      //   return expressInfo;
      // }
      // expressInfo = this.parseExpressResult(result.data);
      // expressInfo.shipperCode = shipperCode;
      // expressInfo.logisticCode = logisticCode;
      // return expressInfo;
    } catch (err) {
      // return expressInfo;
    }
  }



}

