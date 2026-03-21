import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvailabilityStatusMessage from "../AvailabilityStatusMessage";
import type { AvailabilityCheckStatus } from "@/lib/availability/types";

describe("AvailabilityStatusMessage", () => {
  // ── Idle ──────────────────────────────────────────────────────

  it("renders idle state with instructive text", () => {
    render(<AvailabilityStatusMessage status="idle" />);
    expect(screen.getByText("Kies uw periode")).toBeInTheDocument();
    expect(
      screen.getByText(/aankomst- en vertrekdatum/),
    ).toBeInTheDocument();
  });

  // ── Checking ─────────────────────────────────────────────────

  it("shows spinner and label when checking", () => {
    render(<AvailabilityStatusMessage status="checking" />);
    expect(
      screen.getByText(/Beschikbaarheid controleren/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Even geduld/)).toBeInTheDocument();
  });

  // ── Available ────────────────────────────────────────────────

  it("shows success message when available", () => {
    render(<AvailabilityStatusMessage status="available" />);
    expect(
      screen.getByText(/Goed nieuws/),
    ).toBeInTheDocument();
    expect(screen.getByText(/doorgaan met boeken/)).toBeInTheDocument();
  });

  // ── Unavailable ──────────────────────────────────────────────

  it("shows unavailable with default description and action hint", () => {
    render(<AvailabilityStatusMessage status="unavailable" />);
    expect(
      screen.getByText(/niet beschikbaar/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/al bezet/)).toBeInTheDocument();
    expect(screen.getByText(/andere periode/)).toBeInTheDocument();
  });

  it("shows custom reason when provided", () => {
    render(
      <AvailabilityStatusMessage
        status="unavailable"
        reason="Er is al een reservering in deze periode."
      />,
    );
    expect(
      screen.getByText("Er is al een reservering in deze periode."),
    ).toBeInTheDocument();
  });

  // ── Invalid ──────────────────────────────────────────────────

  it("shows invalid status with corrective guidance", () => {
    render(<AvailabilityStatusMessage status="invalid" />);
    expect(screen.getByText("Ongeldige selectie")).toBeInTheDocument();
    expect(screen.getByText(/vertrekdatum/)).toBeInTheDocument();
  });

  // ── Error ────────────────────────────────────────────────────

  it("shows error status with default message", () => {
    render(<AvailabilityStatusMessage status="error" />);
    expect(
      screen.getByText(/niet gelukt/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/niet controleren/),
    ).toBeInTheDocument();
  });

  it("shows error with custom reason", () => {
    render(
      <AvailabilityStatusMessage
        status="error"
        reason="Server onbereikbaar."
      />,
    );
    expect(screen.getByText("Server onbereikbaar.")).toBeInTheDocument();
  });

  it("shows retry button on error when onRetry is provided", async () => {
    const onRetry = vi.fn();
    render(
      <AvailabilityStatusMessage status="error" onRetry={onRetry} />,
    );
    const retryButton = screen.getByText("Opnieuw proberen");
    expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not show retry button when onRetry is not provided", () => {
    render(<AvailabilityStatusMessage status="error" />);
    expect(screen.queryByText("Opnieuw proberen")).not.toBeInTheDocument();
  });

  it("does not show retry button for non-error states", () => {
    const onRetry = vi.fn();
    render(
      <AvailabilityStatusMessage status="available" onRetry={onRetry} />,
    );
    expect(screen.queryByText("Opnieuw proberen")).not.toBeInTheDocument();
  });

  // ── Accessibility ────────────────────────────────────────────

  it("has aria-live polite on all states", () => {
    const statuses: AvailabilityCheckStatus[] = [
      "idle",
      "checking",
      "available",
      "unavailable",
      "invalid",
      "error",
    ];
    for (const status of statuses) {
      const { container, unmount } = render(
        <AvailabilityStatusMessage status={status} />,
      );
      const el = container.querySelector("[aria-live='polite']");
      expect(el).not.toBeNull();
      unmount();
    }
  });

  it("uses role=status for semantic meaning", () => {
    render(<AvailabilityStatusMessage status="available" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("marks icon as aria-hidden", () => {
    const { container } = render(
      <AvailabilityStatusMessage status="available" />,
    );
    const iconSpan = container.querySelector("[aria-hidden='true']");
    expect(iconSpan).not.toBeNull();
  });

  // ── Layout stability ────────────────────────────────────────

  it("always renders a container with stable min-height", () => {
    const statuses: AvailabilityCheckStatus[] = [
      "idle",
      "checking",
      "available",
      "unavailable",
    ];
    for (const status of statuses) {
      const { container, unmount } = render(
        <AvailabilityStatusMessage status={status} />,
      );
      const el = container.firstElementChild;
      expect(el).not.toBeNull();
      expect(el?.className).toContain("min-h-");
      unmount();
    }
  });

  // ── Visual distinction ──────────────────────────────────────

  it("uses distinct container styles for each state", () => {
    const pairs: [AvailabilityCheckStatus, string][] = [
      ["idle", "bg-[#fbf8f6]"],
      ["checking", "bg-terracotta/5"],
      ["available", "bg-[#5a9a5a]/5"],
      ["unavailable", "bg-red-50"],
      ["invalid", "bg-amber-50"],
      ["error", "bg-amber-50"],
    ];
    for (const [status, expectedClass] of pairs) {
      const { container, unmount } = render(
        <AvailabilityStatusMessage status={status} />,
      );
      expect(container.firstElementChild?.className).toContain(expectedClass);
      unmount();
    }
  });
});
