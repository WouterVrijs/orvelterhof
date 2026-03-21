"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Check } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  message: string;
}

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  type: "",
  message: "",
};

export default function ContactForm() {
  const t = useTranslations("contact.form");

  const TYPE_OPTIONS = [
    { value: "", label: t("typeSelect") },
    { value: "groepsverblijf", label: t("typeGroepsverblijf") },
    { value: "zakelijk", label: t("typeZakelijk") },
    { value: "vergaderen", label: t("typeVergaderen") },
    { value: "overig", label: t("typeOverig") },
  ];

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): Partial<Record<keyof FormData, string>> {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) e.firstName = t("errorFirstName");
    if (!form.lastName.trim()) e.lastName = t("errorLastName");
    if (!form.email.trim()) {
      e.email = t("errorEmail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = t("errorEmailInvalid");
    }
    if (!form.message.trim()) e.message = t("errorMessage");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const localErrors = validate();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      const firstKey = Object.keys(localErrors)[0];
      document.getElementById(`contact-${firstKey}`)?.focus();
      return;
    }

    setStatus("sending");
    setErrors({});

    // TODO: Connect to a real form handler (e.g. email API, Formspree, or server action)
    // For now, simulate a successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#5a9a5a]/10">
          <Check size={28} className="text-[#5a9a5a]" />
        </span>
        <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
          {t("successTitle")}
        </h3>
        <p className="mb-6 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
          {t("successText")}
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY_FORM);
            setStatus("idle");
          }}
          className="font-[family-name:var(--font-lato)] text-sm font-medium text-terracotta transition-colors hover:text-terracotta-dark"
        >
          {t("successAnother")}
        </button>
      </div>
    );
  }

  const isSending = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Name */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id="contact-firstName"
          label={t("firstName")}
          required
          value={form.firstName}
          error={errors.firstName}
          onChange={(v) => updateField("firstName", v)}
          disabled={isSending}
          autoComplete="given-name"
          placeholder={t("firstNamePlaceholder")}
        />
        <Field
          id="contact-lastName"
          label={t("lastName")}
          required
          value={form.lastName}
          error={errors.lastName}
          onChange={(v) => updateField("lastName", v)}
          disabled={isSending}
          autoComplete="family-name"
          placeholder={t("lastNamePlaceholder")}
        />
      </div>

      {/* Contact */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id="contact-email"
          label={t("email")}
          type="email"
          required
          value={form.email}
          error={errors.email}
          onChange={(v) => updateField("email", v)}
          disabled={isSending}
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
        />
        <Field
          id="contact-phone"
          label={t("phone")}
          type="tel"
          value={form.phone}
          onChange={(v) => updateField("phone", v)}
          disabled={isSending}
          autoComplete="tel"
          placeholder={t("phonePlaceholder")}
        />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label
          htmlFor="contact-type"
          className="mb-1.5 block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-[#6b6b63]"
        >
          {t("typeLabel")}
        </label>
        <select
          id="contact-type"
          value={form.type}
          onChange={(e) => updateField("type", e.target.value)}
          disabled={isSending}
          className="w-full rounded-xl border border-[#ede6d8] bg-[#fbf8f6] px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-[#3a3a35] outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive disabled:opacity-60"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="mb-6">
        <label
          htmlFor="contact-message"
          className="mb-1.5 block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-[#6b6b63]"
        >
          {t("message")} <span className="text-terracotta">*</span>
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          disabled={isSending}
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`w-full rounded-xl border bg-[#fbf8f6] px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-[#3a3a35] outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive disabled:opacity-60 ${
            errors.message
              ? "border-red-300 focus:border-red-400 focus:ring-red-200"
              : "border-[#ede6d8]"
          }`}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1 font-[family-name:var(--font-lato)] text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSending}
        className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all ${
          !isSending
            ? "bg-terracotta text-white shadow-md hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
            : "bg-terracotta/60 text-white/80"
        }`}
      >
        {isSending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        {isSending ? t("submitting") : t("submit")}
      </button>

      {status === "error" && (
        <p className="mt-3 text-center font-[family-name:var(--font-lato)] text-xs text-red-600">
          {t("errorGeneral")}
        </p>
      )}
    </form>
  );
}

// ── Reusable field ──────────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  required,
  value,
  error,
  onChange,
  disabled,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-[#6b6b63]"
      >
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-[#fbf8f6] px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-[#3a3a35] placeholder:text-[#c5c2bc] outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive disabled:opacity-60 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
            : "border-[#ede6d8]"
        }`}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 font-[family-name:var(--font-lato)] text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
