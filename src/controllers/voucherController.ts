import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { voucherService } from '~/services/vouchereService.js'

const getAllVouchers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vouchers = await voucherService.getAllVouchers()
    res.status(StatusCodes.OK).json(vouchers)
  } catch (error) {
    next(error)
  }
}

const getVoucherById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const voucher = await voucherService.getVoucherById(id)
    if (!voucher) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Voucher not found' })
    }
    res.status(StatusCodes.OK).json(voucher)
  } catch (error) {
    next(error)
  }
}

const createVoucher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voucher = await voucherService.createVoucher(req.body)
    console.log(req.body)
    res.status(StatusCodes.CREATED).json({ message: 'Voucher created successfully!', voucher })
  } catch (error) {
    next(error)
  }
}

const updateVoucher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updatedVoucher = await voucherService.updateVoucher(id, req.body)
    if (!updatedVoucher) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Voucher not found' })
    }
    res.status(StatusCodes.OK).json({ message: 'Voucher updated successfully!', updatedVoucher })
  } catch (error) {
    next(error)
  }
}

const deleteVoucher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const deletedVoucher = await voucherService.deleteVoucher(id)
    if (!deletedVoucher) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Voucher not found' })
    }
    res.status(StatusCodes.OK).json({ message: 'Voucher deleted successfully!', deletedVoucher })
  } catch (error) {
    next(error)
  }
}

export const voucherController = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher
}
