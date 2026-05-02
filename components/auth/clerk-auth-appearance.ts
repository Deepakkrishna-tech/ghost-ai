export const clerkAuthAppearance = {
  options: {
    logoPlacement: "none",
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    showOptionalFields: false,
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full border-0 bg-transparent shadow-none",
    card: "w-full border-0 bg-transparent p-0 shadow-none",
    logoBox: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    main: "w-full",
    formContainer: "flex w-full flex-col gap-4",
    socialButtonsRoot: "flex w-full flex-col gap-3",
    socialButtonsBlockButton:
      "h-11 w-full rounded-xl border border-surface-border bg-base text-copy-primary shadow-none hover:border-subtle-border hover:bg-surface",
    socialButtonsBlockButtonText: "text-sm font-medium text-copy-primary",
    socialButtonsProviderIcon: "h-5 w-5",
    dividerRow: "w-full",
    dividerLine: "bg-surface-border",
    dividerText: "px-3 text-xs uppercase tracking-[0.22em] text-copy-muted",
    formFieldRow: "w-full",
    formField: "w-full",
    formFieldLabelRow: "w-full",
    formFieldLabel: "text-sm font-medium text-copy-primary",
    formFieldInputGroup: "w-full",
    formFieldInput:
      "h-11 w-full rounded-xl border-surface-border bg-subtle text-copy-primary placeholder:text-copy-faint shadow-none focus:border-brand focus:ring-brand/20",
    formButtonPrimary:
      "h-12 w-full rounded-xl bg-brand text-sm font-semibold text-copy-primary shadow-none hover:bg-brand/90",
    footer: "mt-5 w-full border-t border-surface-border bg-base px-6 py-4 text-center",
    footerAction: "text-sm text-copy-secondary",
    footerActionText: "text-copy-secondary",
    footerActionLink:
      "font-medium text-brand transition-colors hover:text-brand/90",
  },
} as const
