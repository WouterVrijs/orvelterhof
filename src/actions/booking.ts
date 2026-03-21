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
    bookingType,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    arrivalDate: formData.get("arrivalDate"),
    departureDate: formData.get("departureDate"),
    numberOfGuests: Number(formData.get("numberOfGuests")),
    guestNote: formData.get("guestNote") || undefined,
  };

  // Add arrangement-specific fields
  if (bookingType === "arrangement") {
    body.arrangementId = formData.get("arrangementId");
    body.arrangementName = formData.get("arrangementName");
  }

  const res = await fetch(process.env.BOOKING_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.BOOKING_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error, details: data.details };
  }

  return { success: true, reservationNumber: data.reservationNumber };
}
