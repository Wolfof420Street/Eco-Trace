import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/api-client";

export function ok<T>(data: T, status = 200) {
  const response: ApiResponse<T> = { success: true, data };
  return NextResponse.json(response, { status });
}

export function err(message: string, code?: string, status = 400) {
  const response: ApiResponse<never> = { success: false, error: message, code };
  return NextResponse.json(response, { status });
}
