import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import * as moment from 'moment'
import * as XLSX from "xlsx";
import * as fs from 'fs'
import * as uuid from 'uuid/v4'
import { IOrder, IOrderProduct } from './order.interfaces'
import { ApiErrorCode } from '@common/enum/api-error-code.enum'
import { ApiException } from '@common/expection/api.exception'
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { ProductService } from '../product/product.service';
import { IProduct } from '../product/product.interfaces';
import { CreateOrderByProductDTO, OrderProductDTO, OrderDTO, CreateOrderByCartDTO, ConfirmOrderDTO, UpdatePriceDTO } from './order.dto';
import { AddressService } from '../address/address.service';
import { IAddress } from '../address/address.interfaces';
import { CartService } from '../cart/cart.service';
import { ICart } from '../cart/cart.interfaces';
import { IUser } from '../user/user.interfaces';
import { IPayInfo } from 'src/common/interface/payInfo.interface';
import { WeixinUtil } from 'src/utils/weixin.util';
import { CreateCommentDTO } from '../comment/comment.dto';
import { CommentService } from '../comment/comment.service';
import { CreateShipperDTO } from '../shipper/shipper.dto';
import { ShipperService } from '../shipper/shipper.service';
import { CreateAddressDTO } from '../address/address.dto';
import { GoodService } from '../good/good.service';
import { IGood } from '../good/good.interfaces';
import { PaginationUtil } from 'src/utils/pagination.util';
import { PhoneUtil } from 'src/utils/phone.util';
import { ApplicationDTO } from 'src/common/dto/Message.dto';
import { NoticeService } from '../notice/notice.service';
import { UserCouponService } from '../userCoupon/userCoupon.service';
import { CreateIntegrationDTO } from '../integration/integration.dto';
import { IntegrationService } from '../integration/integration.service';
import { CreateUserBalanceDTO } from '../userBalance/userBalance.dto';
import { UserBalanceService } from '../userBalance/userBalance.service';
import { ShipFeeService } from '../shipFee/shipFee.service';
import { VipService } from '../vip/vip.service';
import { IVip } from '../vip/vip.interfaces';
import { MerchantService } from '../merchant/merchant.service';
import { RedisService } from 'nestjs-redis';
import { GoodRecordService } from '../goodRecord/goodRecord.service';
import { UserRecordService } from '../userRecord/userRecord.service';
import { INotice } from '../notice/notice.interfaces';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderModelToken') private readonly orderModel: Model<IOrder>,
    @Inject(ProductService) private readonly productServicee: ProductService,
    @Inject(CartService) private readonly cartService: CartService,
    @Inject(AddressService) private readonly addressService: AddressService,
    @Inject(WeixinUtil) private readonly weixinUtil: WeixinUtil,
    @Inject(PhoneUtil) private readonly phoneUtil: PhoneUtil,
    @Inject(CommentService) private readonly commentService: CommentService,
    @Inject(ShipperService) private readonly shipperService: ShipperService,
    @Inject(GoodService) private readonly goodService: GoodService,
    @Inject(NoticeService) private readonly noticeService: NoticeService,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
    @Inject(UserCouponService) private readonly userCouponService: UserCouponService,
    @Inject(UserBalanceService) private readonly userBalanceService: UserBalanceService,
    @Inject(IntegrationService) private readonly integrationService: IntegrationService,
    @Inject(ShipFeeService) private readonly shipFeeService: ShipFeeService,
    @Inject(VipService) private readonly vipService: VipService,
    @Inject(MerchantService) private readonly merchantService: MerchantService,
    @Inject(GoodRecordService) private readonly goodRecordService: GoodRecordService,
    @Inject(UserRecordService) private readonly userRecordService: UserRecordService,
    private readonly redis: RedisService,
  ) { }

  /**
  * 生成订单号
  */
  getOrderSn(): string {
    const length = 10
    const time = moment().format('HHmmss')
    const random = Math.floor(Math.random() * Math.pow(8, length - 1) + 1)
    const randomLenght = random.toString().length
    const fixLength = length - randomLenght
    if (fixLength > 0) {
      return `60000000${time}${'0'.repeat(fixLength)}${random}`
    }
    return `60000000${time}${random}`
  }



  promoteMinus(product: IProduct): number {
    const promotionPrice = product.promotionPrice || product.realPrice
    return Number((product.realPrice - promotionPrice).toFixed(2))
  }

  preSaleMinus(product: IProduct): number {
    const preSalePrice = product.preSalePrice || product.realPrice
    return Number((product.realPrice - preSalePrice).toFixed(2))
  }

  vipMinus(vip: IVip, price: number) {
    return Number((price * (100 - vip.promote) / 100).toFixed(2))
  }


  async genPromote(id: string, count: number, vip: IVip): Promise<OrderProductDTO> {
    const product: IProduct | null = await this.productServicee.findById(id)
    if (!product) {
      throw new ApiException('商品不存在', ApiErrorCode.NO_EXIST, 406)
    }
    const good = await this.goodService.findById(product.good)
    if (!good) {
      throw new ApiException('商品不存在', ApiErrorCode.NO_EXIST, 406)
    }
    const orderProduct: OrderProductDTO = {
      product: id,
      count: count,
      realPrice: product.realPrice,
      good: good._id,
      promoteMinus: 0,
      refundCount: 0,
      preSaleMinus: 0,
      discountMinus: 0,
      vipMinus: 0,
    }
    const now = Date.now()
    const limitStart = new Date(good.limitStartTime).getTime()
    const limitEnd = new Date(good.limitEndTime).getTime()
    const preSaleEnd = new Date(good.preSaleEndTime).getTime()

    if (vip && good.canVipPromote) {
      const vipMinus = this.vipMinus(vip, orderProduct.realPrice)
      return { ...orderProduct, vipMinus }
    }
    if (good.preSale && now <= preSaleEnd) {
      const preSaleMinus = this.preSaleMinus(product)
      return { ...orderProduct, preSaleMinus }
    }
    if (good.isLimit && now >= limitStart && now <= limitEnd) {
      const promoteMinus = this.promoteMinus(product)
      return { ...orderProduct, promoteMinus }
    }
    const discountPrice = product.discountPrice || product.realPrice
    const discountMinus = product.discountPrice ? Number((product.realPrice - discountPrice).toFixed(2)) : 0
    return { ...orderProduct, discountMinus }
  }

  // 统计数量
  async countByCondition(condition: any) {
    return await this.orderModel.countDocuments(condition)
  }

  // 商品生成订单
  async createByProduct(order: CreateOrderByProductDTO, user: IUser): Promise<IOrder> {
    let vip: any = null
    if (user.vip) {
      vip = await this.vipService.findOne({ level: user.vip })
    }
    const product = await this.productServicee.findById(order.product)
    if (!product) {
      throw new ApiException('商品已下架', ApiErrorCode.NO_EXIST, 404)
    }
    const good = await this.goodService.findById(product.good)
    if (!good || !good.onSale) {
      throw new ApiException('商品已下架', ApiErrorCode.NO_EXIST, 404)
    }
    const productDTO: OrderProductDTO = await this.genPromote(order.product, order.count, vip)

    return await this.createOrder(user, [productDTO])
  }


  // 购物车生成订单
  async createByCart(order: CreateOrderByCartDTO, user: IUser): Promise<IOrder> {
    const products: OrderProductDTO[] = []
    let vip: any = null
    if (user.vip) {
      vip = await this.vipService.findOne({ level: user.vip })
    }
    for (let orderCart of order.carts) {
      const cart: ICart | null = await this.cartService.findById(orderCart.cart)
      if (!cart) {
        throw new ApiException('购物清单不存在', ApiErrorCode.NO_EXIST, 406)
      }
      const good = await this.goodService.findById(cart.good)
      if (!good || !good.onSale) {
        throw new ApiException('商品已下架', ApiErrorCode.NO_EXIST, 404)
      }
      const product: OrderProductDTO = await this.genPromote(cart.product, orderCart.count, vip)
      products.push(product)
    }
    const cartIds = order.carts.map(cart => cart.cart)
    await this.cartService.deleteMany({ _id: { $in: cartIds } })
    return await this.createOrder(user._id, products)
  }

  async checkCoupon(coupon: string, order: IOrder, type: number) {
    const userCoupon = await this.userCouponService.findById(coupon)
    if (!userCoupon || userCoupon.type !== type) {
      throw new ApiException('红包/优惠券有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (userCoupon.isLimit && userCoupon.limit > order.orderPrice) {
      throw new ApiException('订单金额未达到红包/优惠券门槛', ApiErrorCode.NO_PERMISSION, 403)
    }
    const categories: string[] = []
    const goods = order.products.map(product => {
      if (product.good.category && Array.isArray(product.good.category)) {
        categories.push(...product.good.category)
      }
      return product.good._id
    })
    switch (userCoupon.useType) {
      case 1:
        return userCoupon.amount
      case 2: {
        let hasGood = false
        goods.map(good => {
          userCoupon.goods.map(go => {
            if (String(go) === String(good)) {
              hasGood = true
            }
          })
        })
        if (!hasGood) {
          throw new ApiException('红包/优惠券有误', ApiErrorCode.NO_PERMISSION, 403)
        }
        return userCoupon.amount
      }
      case 3: {
        let hasCategory = false
        categories.map(category => {
          userCoupon.categories.map(ca => {
            if (String(ca) === String(category)) {
              hasCategory = true
            }
          })
        })
        if (!hasCategory) {
          throw new ApiException('红包/优惠券有误', ApiErrorCode.NO_PERMISSION, 403)
        }
        return userCoupon.amount
      }
      default:
        return false
    }

  }

  // 购物车生成订单
  async confirmOrder(id: string, confirm: ConfirmOrderDTO, user: IUser) {
    const order: IOrder | null = await this.orderModel
      .findById(id)
      .populate({ path: 'products.good', model: 'good' })
      .lean()
      .exec()
    if (!order) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406)
    }
    if (!confirm.address && !order.consignee) {
      throw new ApiException('收获地址不能为空', ApiErrorCode.NO_EXIST, 406)
    }
    if (order.checkResult !== 0 || String(order.user) !== String(user._id)) {
      throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    await Promise.all(order.products.map(async product => {
      await this.productServicee.incStock(product.product, -product.count)
    }))
    let shippingFee = order.orderPrice < 29 ? 12 : 0
    let update: any = {
      checkResult: 1,
      actualPrice: order.actualPrice,
      postscript: confirm.postscript,
      confirmTime: Date.now(),
      shipType: confirm.shipType
    }
    if (confirm.shipType === 2) {
      if (!confirm.shop) {
        throw new ApiException('无自提点', ApiErrorCode.INPUT_ERROR, 406)
      }
      const shop = await this.merchantService.findById(confirm.shop)
      if (!shop) {
        throw new ApiException('自提点有误', ApiErrorCode.INPUT_ERROR, 406)
      }
      update.shop = confirm.shop
      update.actualPrice = order.orderPrice
      update.shippingFee = 0
    }
    if (confirm.address) {
      const address: IAddress | null = await this.addressService.findByUser(user._id)
      if (!address) {
        throw new ApiException('地址不对', ApiErrorCode.NO_EXIST, 406)
      }
      if (confirm.shipType === 1) {
        shippingFee = await this.shipFeeService.getShipFee(address.province, order.orderPrice)
        update.actualPrice = Number((order.orderPrice + shippingFee).toFixed(2))
        update.shippingFee = shippingFee

      }
      update = {
        ...update,
        // 收货人
        consignee: address ? address.consignee : '',
        // 手机号
        phone: address ? address.phone : '',
        // 国家
        country: address ? address.country : '',
        // 省份
        province: address ? address.province : '',
        // 市
        city: address ? address.city : '',
        // 地区
        district: address ? address.district : '',
        // 地址
        address: address ? address.address : '',

      }
    }
    const coupons: any = []
    if (confirm.redBag) {
      const redBagPrice = await this.checkCoupon(confirm.redBag, order, 2)
      if (redBagPrice) {
        update.redBagId = confirm.redBag
        update.redBagPrice = redBagPrice
        update.actualPrice = update.actualPrice > redBagPrice ? Number((update.actualPrice - redBagPrice).toFixed(2)) : 0
        coupons.push(confirm.redBag)
      }
    }
    if (confirm.coupon) {
      const couponPrice = await this.checkCoupon(confirm.coupon, order, 1)
      if (couponPrice) {
        update.couponId = confirm.coupon
        update.couponPrice = couponPrice
        update.actualPrice = update.actualPrice > couponPrice ? Number((update.actualPrice - couponPrice).toFixed(2)) : 0
        coupons.push(confirm.coupon)
      }
    }
    if (confirm.integration) {
      if (user.integration < confirm.integration) {
        throw new ApiException('积分不足', ApiErrorCode.INPUT_ERROR, 403)
      }
      update.integration = confirm.integration
      update.actualPrice = update.actualPrice > confirm.integration / 100 ? Number((update.actualPrice - confirm.integration / 100).toFixed(2)) : 0
      const newIntegration: CreateIntegrationDTO = {
        user: order.user,
        count: confirm.integration,
        type: 'minus',
        sourceType: 1,
        sourceId: order._id
      }
      await this.integrationService.create(newIntegration)
    }
    await this.userCouponService.used(coupons)
    return await this.orderModel.findByIdAndUpdate(id, update, { new: true })
  }


  // 微信支付订单
  async payOrder(id: string, user: IUser) {
    const order: IOrder | null = await this.orderModel.findById(id).lean().exec()
    if (!order) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406)
    }
    if (order.checkResult !== 1) {
      throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    const payInfo: IPayInfo = {
      orderId: order.paySn,
      openId: user.weixinOpenid,
      fee: order.actualPrice,
    }
    return await this.weixinUtil.createUnifiedOrder(payInfo)
  }

  // 微信支付订单
  async payOrderByBalance(id: string, user: IUser) {
    const order: IOrder | null = await this.orderModel.findById(id).lean().exec()
    if (!order) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406)
    }
    if (order.checkResult !== 1) {
      throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (user.balance < order.actualPrice) {
      throw new ApiException('余额不足', ApiErrorCode.NO_PERMISSION, 403)
    }
    const balance: CreateUserBalanceDTO = {
      amount: order.actualPrice,
      user: user._id,
      type: 'minus',
      sourceId: order._id,
      sourceType: 3,
    }
    await this.userBalanceService.create(balance)
    await this.paySuccess(order, '', 2)
  }

  // 确认收货
  async receive(id: string, user: IUser) {
    const order: IOrder | null = await this.orderModel.findById(id).lean().exec()
    if (!order) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406)
    }
    if (String(order.user) !== String(user._id)) {
      throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (order.checkResult !== 3) {
      throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    return await this.orderModel.findByIdAndUpdate(id, { checkResult: 4, receiveTime: Date.now() })
  }

  // 订单发货
  async sendOrder(id: string, shipper: CreateShipperDTO) {
    const order: IOrder | null = await this.orderModel.findById(id).lean().exec()
    if (!order) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406)
    }
    if (order.checkResult !== 2) {
      throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (shipper.shipType === 1) {
      await this.shipperService.create(shipper, id)
    }
    await this.orderModel.findByIdAndUpdate(id, { sendTime: Date.now(), checkResult: 3, shipType: shipper.shipType, shipAddress: shipper.shipAddress || '' })
    return true
  }



  // 生成订单
  async createOrder(user: IUser, products: OrderProductDTO[]): Promise<IOrder> {
    let goodsPrice = 0
    let promoteMinus = 0
    let preSaleMinus = 0
    let vipMinus = 0
    let discountMinus = 0
    for (let product of products) {
      goodsPrice += Number(((product.realPrice) * product.count).toFixed(2))
      promoteMinus += Number(((product.promoteMinus) * product.count).toFixed(2))
      preSaleMinus += Number(((product.preSaleMinus) * product.count).toFixed(2))
      discountMinus += Number(((product.discountMinus) * product.count).toFixed(2))
      vipMinus += Number(((product.vipMinus) * product.count).toFixed(2))
    }
    const orderPrice = Number((goodsPrice - vipMinus - promoteMinus - preSaleMinus - discountMinus).toFixed(2))
    const address: IAddress | null = await this.addressService.findByUser(user._id)
    let shippingFee = orderPrice < 29 ? 12 : 0
    if (address) {
      shippingFee = await this.shipFeeService.getShipFee(address.province, orderPrice)
    }
    const newOrder: OrderDTO = {
      // 订单号
      orderSn: this.getOrderSn(),
      // 支付号
      paySn: this.getOrderSn(),
      // 用户
      user: user._id,
      // 商品列表
      products,
      // 状态 0:待确认 1:待付款 2:待发货 3：待收货 4:待评价 5:完成 6:退款
      checkResult: 0,
      // 收货人
      consignee: address ? address.consignee : '',
      // 手机号
      phone: address ? address.phone : '',
      // 国家
      country: address ? address.country : '',
      // 省份
      province: address ? address.province : '',
      // 市
      city: address ? address.city : '',
      // 地区
      district: address ? address.district : '',
      // 地址
      address: address ? address.address : '',
      // 备注
      postscript: '',
      // 物流费用
      shippingFee,
      // 订单总价
      orderPrice: orderPrice,
      // 商品总价
      goodsPrice,
      // 实际价格
      actualPrice: orderPrice + shippingFee,
      // 添加时间
      addTime: Date.now(),
      // 折扣扣减
      discountMinus,
      // 促销折扣
      promoteMinus,
      // vip折扣
      vipMinus,
      // 预售折扣
      preSaleMinus,
      // 配送方式
      shipType: 1,
    }
    return await this.orderModel.create(newOrder)
  }

  async count(user: string) {
    const total = await this.orderModel.countDocuments({ isDelete: false, user, checkResult: { $gt: 0 } })
    const confirm = await this.orderModel.countDocuments({ isDelete: false, user, checkResult: 1 })
    const send = await this.orderModel.countDocuments({ isDelete: false, user, checkResult: 2 })
    const receive = await this.orderModel.countDocuments({ isDelete: false, user, checkResult: 3 })
    const comment = await this.orderModel.countDocuments({ isDelete: false, user, checkResult: 4 })
    return { total, confirm, send, receive, comment }
  }

  // 列表
  async listByUser(pagination: Pagination, user: string, checkResult?: number): Promise<IList<IOrder>> {
    const condition: any = { user, isDelete: false };
    if (checkResult) {
      condition.checkResult = checkResult
    }
    if (!checkResult) {
      condition.checkResult = { $gt: 0 }
    }
    const list = await this.orderModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: - 1 })
      .populate({
        path: 'products.product', model: 'product',
        populate: {
          path: 'specifications', model: 'goodSpecification',
        }
      })
      .populate({ path: 'products.good', model: 'good' })
      .lean()
      .exec();
    const total = await this.orderModel.countDocuments(condition);
    return { list, total };
  }

  // 订单详情
  async detail(id: string, user: string): Promise<IOrder | null> {
    const data = await this.orderModel
      .findById(id)

      .populate({
        path: 'products.product', model: 'product',
        populate: {
          path: 'specifications', model: 'goodSpecification',
        }
      })
      .populate({ path: 'products.good', model: 'good' })
      .populate({ path: 'shop', model: 'merchant' })
      .lean()
      .exec();
    if (!data) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404)
    }
    if (String(data.user) !== String(user)) {
      throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403)
    }
    return data
  }


  // 取消订单
  async cancel(id: string, user: string): Promise<IOrder | null> {
    const order: IOrder | null = await this.orderModel
      .findById(id)
      .lean()
      .exec();
    if (!order) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404)
    }
    if (String(order.user) !== String(user)) {
      throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (order.checkResult !== 5 && order.checkResult !== 1) {
      throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (order.checkResult === 1) {
      await Promise.all(order.products.map(async product => {
        await this.productServicee.incStock(product.product, product.count)
      }))
      await this.orderModel.findByIdAndDelete(id)
    }
    if (order.checkResult === 5) {
      await this.orderModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    }
    if (order.couponId) {
      await this.userCouponService.updateById(order.couponId, { isUsed: false, $unset: { useTime: 1 } })
    }
    if (order.redBagId) {
      await this.userCouponService.updateById(order.redBagId, { isUsed: false, $unset: { useTime: 1 } })
    }
    if (order.integration && order.integration > 0) {
      const newIntegration: CreateIntegrationDTO = {
        user: order.user,
        count: order.integration,
        type: 'add',
        sourceType: 4,
        sourceId: order._id
      }
      await this.integrationService.refund(newIntegration)
    }
    return null
  }

  async clearOrder() {
    await this.orderModel.deleteMany({ addTime: { $lte: moment().add(-15, 'm') }, checkResult: 0, isDelete: false })
    const orders = await this.orderModel.find({ confirmTime: { $lte: moment().add(-15, 'm') }, checkResult: 1, isDelete: false })
    await Promise.all(orders.map(async order => {
      await Promise.all(order.products.map(async product => {
        await this.productServicee.incStock(product.product, product.count)
      }))
      await this.orderModel.findByIdAndDelete(order._id)
      if (order.couponId) {
        await this.userCouponService.updateById(order.couponId, { isUsed: false, $unset: { useTime: 1 } })
      }
      if (order.redBagId) {
        await this.userCouponService.updateById(order.redBagId, { isUsed: false, $unset: { useTime: 1 } })
      }
      if (order.integration && order.integration > 0) {
        const newIntegration: CreateIntegrationDTO = {
          user: order.user,
          count: order.integration,
          type: 'add',
          sourceType: 4,
          sourceId: order._id
        }
        await this.integrationService.refund(newIntegration)
      }
    }))
    return
  }

  async completeOrder() {
    await this.orderModel.updateMany(
      { sendTime: { $lte: moment().add(-7, 'd') }, checkResult: 3, isDelete: false },
      { checkResult: 4, receiveTime: Date.now() })

    await this.orderModel.updateMany(
      { receiveTime: { $lte: moment().add(-7, 'd') }, checkResult: 7, isDelete: false },
      { checkResult: 5, completeTime: Date.now() })
  }


  // 列表
  async list(pagination: Pagination): Promise<IList<IOrder>> {
    const condition = this.paginationUtil.genCondition(pagination, ['orderSn', 'paySn', 'transactionId'], 'confirmTime')
    if (!condition.checkResult) {
      condition.checkResult = { $ne: 0 }
    }
    const list = await this.orderModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: - 1 })
      .populate({
        path: 'products.product', model: 'product',
        populate: {
          path: 'specifications', model: 'goodSpecification',
        }
      })
      .populate({ path: 'products.good', model: 'good' })
      .populate({ path: 'shop', model: 'merchant' })
      .populate({ path: 'user', model: 'user', select: 'avatar nickname phone _id' })
      .lean()
      .exec();
    const total = await this.orderModel.countDocuments(condition);
    return { list, total };
  }

  // 根据id查找
  async getRecord(id: string): Promise<IOrder | null> {
    return await this.orderModel
      .findById(id)
      .populate({
        path: 'products.product', model: 'product',
        populate: {
          path: 'specifications', model: 'goodSpecification',
        }
      })
      .populate({ path: 'products.good', model: 'good' })
      .populate({ path: 'user', model: 'user', select: 'avatar nickname phone _id' })
      .lean()
      .exec();
  }

  // 根据id查找
  async findById(id: string): Promise<IOrder | null> {
    return await this.orderModel.findById(id).lean().exec()
  }

  // 根据id查找
  async findByPaySn(paySn: string): Promise<IOrder | null> {
    return await this.orderModel.findOne({ paySn }).lean().exec()
  }
  // 根据id查找
  async findByIdWithUser(id: string): Promise<IOrder | null> {
    return await this.orderModel.findById(id).populate({ path: 'user', model: 'user' }).lean().exec()
  }

  // 根据id查找
  async updateProduct(id: string, products: IOrderProduct[]): Promise<IOrder | null> {
    let isRefund = true
    products.map(product => {
      if (product.count > product.refundCount) {
        isRefund = false
      }
    })
    return await this.orderModel.findByIdAndUpdate(id, { products, isRefund }).lean().exec()
  }

  // 根据id查找
  async refund(id: string, products: IOrderProduct[]): Promise<IOrder | null> {
    await Promise.all(products.map(async product => {
      await this.productServicee.incStock(product.product, product.count)
    }))
    return await this.orderModel.findByIdAndUpdate(id, { products, isRefund: true, checkResult: 5, completeTime: Date.now() }).lean().exec()
  }

  async updateCheckResult(id: string, checkResult: number) {
    return await this.orderModel.findByIdAndUpdate(id, { completeTime: Date.now(), checkResult }).lean().exec()
  }

  // 根据id查找
  async changePrice(id: string, price: UpdatePriceDTO): Promise<IOrder | null> {
    return await this.orderModel.findByIdAndUpdate(id, { ...price, paySn: this.getOrderSn() }).lean().exec()
  }


  // 根据id查找
  async changeAddress(id: string, address: CreateAddressDTO): Promise<IOrder | null> {
    return await this.orderModel.findByIdAndUpdate(id, address).lean().exec()
  }

  // 发送消息通知
  async sendNotice(order: IOrder, payTime: number) {
    const notice: INotice[] = await this.noticeService.all()
    const application: ApplicationDTO = {
      first: {
        value: `您有一个新的订单待处理`,
        color: "#173177"
      },
      keyword1: {
        value: order.orderSn,
        color: "#173177"
      },
      keyword2: {
        value: moment(payTime).format('YYYY-MM-DD HH:mm:ss'),
        color: "#173177"
      },
      keyword3: {
        value: '待发货',
        color: "#173177"
      },
      keyword4: {
        value: `支付金额：${order.actualPrice.toFixed(2)}`,
        color: "#173177"
      },
      remark: {
        value: '请尽快到管理后台进行处理',
        color: "#173177"
      },
    }
    await Promise.all(notice.map(async  not => {
      if (not.isPhoneNotice) {
        await this.phoneUtil.sendNotify(not.phone, order.actualPrice)
      }
      if (not.openId && not.isWeixinNotice) {
        await this.weixinUtil.sendNoticeMessage(not.openId, application)
      }
    }))

  }

  // 根据id查找
  async paySuccess(order: IOrder, transactionId: string, payType: number) {
    const client = this.redis.getClient()
    await client.hincrby('dataRecord', 'orders', 1)
    const exist = await client.hget('dataRecord', 'sale')
    const price = order.actualPrice
    if (exist) {
      await client.hset('dataRecord', 'sale', (Number(exist) + price).toFixed(2))
    } else {
      await client.hset('dataRecord', 'sale', price.toFixed(2))
    }
    await Promise.all(order.products.map(async product => {
      await this.goodService.incSellVolumn(product.good, product.count)
      await this.productServicee.incSellVolumn(product.product, product.count)
      await this.goodRecordService.genRecord(product.good, product)
    }))
    await this.userRecordService.genRecord(order.user, order)
    const payTime = Date.now()
    await this.orderModel.findByIdAndUpdate(order._id, { checkResult: 2, payTime, transactionId, payType }).lean().exec()
    await this.sendNotice(order, payTime)
    const newIntegration: CreateIntegrationDTO = {
      user: order.user,
      count: order.actualPrice,
      type: 'add',
      sourceType: 1,
      sourceId: order._id
    }
    await this.integrationService.create(newIntegration)
    return order
  }

  // 评论
  async comment(id: string, goodId: string, user: string, comment: CreateCommentDTO) {
    const order: IOrder | null = await this.orderModel.findById(id).lean().exec()
    if (!order) {
      throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404)
    }
    if (order.checkResult !== 4) {
      throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403)
    }
    let goodExist = false
    for (let product of order.products) {
      if (String(product.good) === goodId) {
        goodExist = true
      }
    }
    if (!goodExist) {
      throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (order.commentGoods && order.commentGoods.includes(goodId)) {
      throw new ApiException('商品已评价', ApiErrorCode.NO_PERMISSION, 403)
    }
    const checkResult = order.commentGoods && order.commentGoods.length === order.products.length - 1 ? 5 : 4
    await this.orderModel.findByIdAndUpdate(id, { $addToSet: { commentGoods: goodId }, checkResult, commentTime: Date.now() })
    await this.commentService.createComment(comment, user, goodId, 'good')
    return
  }

  // 获取订单可用红包/优惠券
  async orderCoupon(id: string, type: number, user: string) {
    const order = await this.orderModel.findById(id).populate({ path: 'products.good', model: 'good' })
    if (!order) {
      return []
    }
    const categories: string[] = []

    const goods = order.products.map(product => {
      categories.push(...product.good.category)
      return product.good._id
    })
    const condition = {
      type,
      user,
      isUsed: false,
      expire: { $gte: Date.now() },
      $or: [
        { useType: 1, isLimit: false, },
        { useType: 1, isLimit: true, limit: { $gte: order.orderPrice } },
        { useType: 2, goods: { $in: goods }, isLimit: false },
        { useType: 2, goods: { $in: goods }, isLimit: true, limit: { $lte: order.orderPrice } },
        { useType: 3, categories: { $in: categories }, isLimit: false },
        { useType: 3, categories: { $in: categories }, isLimit: true, limit: { $lte: order.orderPrice } },
      ]
    }
    return await this.userCouponService.findByCondition(condition)
  }

  async   download(path: string, type: number, ids: string) {
    const filename = `${uuid()}.xlsx`
    const pathExist = fs.existsSync(path);
    if (!pathExist) {
      fs.mkdirSync(path)
    }
    const condition: any = { checkResult: { $gt: 0 } }
    if (type === 2) {
      condition._id = { $in: ids.split(',') }
    }
    const orders = await this.orderModel
      .find(condition)
      .populate({ path: 'user', model: 'user', select: 'avatar nickname phone _id' })
      .populate({
        path: 'products.product', model: 'product',
        populate: {
          path: 'specifications', model: 'goodSpecification',
        }
      })
      .populate({ path: 'products.good', model: 'good' })
      .sort({ confirmTime: -1 })
      .lean()
      .exec()
    const data: any = []
    const merges: any = []
    const checkResult = ['待付款', '待发货', '待收货', '待评价', '已完成']
    for (let order of orders) {
      const orderData = {
        '订单号': order.orderSn,
        '购买用户': order.user.nickname,
        '状态': checkResult[order.checkResult - 1],
        '收货人': order.consignee,
        '收货地址': `${order.country}${order.province}${order.city}${order.district}${order.address}`,
        '收货人手机号': order.phone,
        '备注': order.postscript,
        '商品总价': order.goodsPrice.toFixed(2),
        '订单总价': order.orderPrice.toFixed(2),
        '支付金额': order.actualPrice.toFixed(2),
        '下单时间': order.confirmTime ? moment(order.confirmTime).format('YYYY-MM-DD HH:mm:ss') : '',
        '支付时间': order.payTime ? moment(order.payTime).format('YYYY-MM-DD HH:mm:ss') : '',
        '发货时间': order.sendTime ? moment(order.sendTime).format('YYYY-MM-DD HH:mm:ss') : '',
        '收货时间': order.receiveTime ? moment(order.receiveTime).format('YYYY-MM-DD HH:mm:ss') : '',
        '完成时间': order.completeTime ? moment(order.completeTime).format('YYYY-MM-DD HH:mm:ss') : '',
        '配送方式': order.shipType ? order.shipType === 2 ? '商家配送' : '物流配送' : '物流配送',
      }
      if (order.products.length > 1) {
        const start = data.length + 1
        const end = data.length + order.products.length
        for (let j = 0; j < 16; j++) {
          merges.push({//合并第一行数据[B1,C1,D1,E1]
            s: {//s为开始
              c: j,//开始列
              r: start//开始取值范围
            },
            e: {//e结束
              c: j,//结束列
              r: end//结束范围
            }
          })
        }
      }
      for (let i = 0; i < order.products.length; i++) {
        const product = order.products[i]
        const productData = {
          '商品名称': product.good.name,
          '商品规格': product.product.specifications.map(spe => spe.value).toString().replace(/,/g, '+'),
          '商品价格': product.realPrice.toFixed(2),
          '优惠价格': product.promoteMinus.toFixed(2),
          '购买数量': product.count,
        }
        if (i === 0) {
          data.push({ ...orderData, ...productData })
        } else {
          data.push(productData)
        }

      }

    }
    const wch: any = []
    for (let w = 0; w < 20; w++) {
      wch.push({ wch: 25 })
    }


    const sheet = XLSX.utils.json_to_sheet(data);
    sheet['!cols'] = wch
    sheet["!merges"] = merges;
    const workbook = { SheetNames: ['订单汇总表'], Sheets: { '订单汇总表': sheet } };
    XLSX.writeFile(workbook, `${path}/${filename}`);
    return filename
  }
}