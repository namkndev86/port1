import { type NextRequest, NextResponse } from "next/server"

import { handleApiError } from "@/lib/errors"
import { ContactService } from "@/services/contact.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const contactService = new ContactService()
    const message = await contactService.submitMessage(body)
    return NextResponse.json({ success: true, data: message }, { status: 201 })
  } catch (err: any) {
    const apiError = handleApiError(err)
    return NextResponse.json(
      { message: apiError.message, errors: apiError.errors },
      { status: apiError.status }
    )
  }
}
