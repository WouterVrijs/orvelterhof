"use server";

export type BookingActionState = {
  success: boolean;
  reservationNumber?: string;
  error?: string;
  details?: string;
} | null;

export async function submitBooking(
  _prevState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const bookingType = formData.get("bookingType") || "verblijf";

  const body: Record<string, unknown> = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    arrivalDate: String(formData.get("arrivalDate") ?? ""),
    departureDate: String(formData.get("departureDate") ?? ""),
    numberOfGuests: Number(formData.get("numberOfGuests") || 2),
    guestNote: String(formData.get("guestNote") ?? "") || undefined,
  };

  // Add arrangement-specific fields
  if (bookingType === "arrangement") {
    body.arrangementId = formData.get("arrangementId");
    body.arrangementName = formData.get("arrangementName");
  }

  const res = await fetch(`${process.env.BOOKING_API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.BOOKING_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.error || `HTTP ${res.status}`,
      details: typeof data.details === "object" ? JSON.stringify(data.details) : data.details,
    };
  }

  return { success: true, reservationNumber: data.reservationNumber };
}
