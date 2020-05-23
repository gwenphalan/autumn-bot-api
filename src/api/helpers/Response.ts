import { Response } from "express";

export class ApiResponse {
  statusCode: number;
  status: string;
  data: string | null;
  constructor(statusCode: number, data?: string) {
    this.statusCode = statusCode;
    this.status = statusCode === 200 ? "success" : "error";
    this.data = data || null;
  }
}

export class ApiError extends ApiResponse {
  message: string;
  constructor(statusCode: number, message: string) {
    super(statusCode);
    this.message = message;
  }
}

export const handleError = (err: ApiError, res: Response) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};
