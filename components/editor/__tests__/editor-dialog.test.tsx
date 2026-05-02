import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { EditorDialog } from "../editor-dialog"

describe("EditorDialog", () => {
  describe("title rendering", () => {
    it("renders the title when open", () => {
      render(<EditorDialog open title="My Dialog Title" />)
      expect(screen.getByText("My Dialog Title")).toBeInTheDocument()
    })

    it("renders the title with correct slot attribute", () => {
      render(<EditorDialog open title="Slot Title" />)
      const title = screen.getByText("Slot Title")
      expect(title.closest("[data-slot='dialog-title']")).toBeInTheDocument()
    })
  })

  describe("description rendering", () => {
    it("renders description when provided", () => {
      render(
        <EditorDialog open title="Title" description="Helpful description" />
      )
      expect(screen.getByText("Helpful description")).toBeInTheDocument()
    })

    it("renders description with correct slot attribute", () => {
      render(
        <EditorDialog open title="Title" description="Some description" />
      )
      const desc = screen.getByText("Some description")
      expect(desc.closest("[data-slot='dialog-description']")).toBeInTheDocument()
    })

    it("does not render description when not provided", () => {
      render(<EditorDialog open title="Title" />)
      expect(
        document.querySelector("[data-slot='dialog-description']")
      ).not.toBeInTheDocument()
    })
  })

  describe("children rendering", () => {
    it("renders children inside the dialog content", () => {
      render(
        <EditorDialog open title="Title">
          <p>Dialog body content</p>
        </EditorDialog>
      )
      expect(screen.getByText("Dialog body content")).toBeInTheDocument()
    })

    it("renders multiple children", () => {
      render(
        <EditorDialog open title="Title">
          <input placeholder="Name" />
          <input placeholder="Email" />
        </EditorDialog>
      )
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    })
  })

  describe("footer rendering", () => {
    it("renders footer when provided", () => {
      render(
        <EditorDialog
          open
          title="Title"
          footer={<button>Confirm</button>}
        />
      )
      expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
    })

    it("renders footer inside dialog-footer slot", () => {
      render(
        <EditorDialog
          open
          title="Title"
          footer={<button>Save</button>}
        />
      )
      const saveBtn = screen.getByRole("button", { name: "Save" })
      expect(saveBtn.closest("[data-slot='dialog-footer']")).toBeInTheDocument()
    })

    it("does not render footer when not provided", () => {
      render(<EditorDialog open title="Title" />)
      expect(
        document.querySelector("[data-slot='dialog-footer']")
      ).not.toBeInTheDocument()
    })
  })

  describe("open state", () => {
    it("does not render content when open is false", () => {
      render(<EditorDialog open={false} title="Hidden Title" />)
      expect(screen.queryByText("Hidden Title")).not.toBeInTheDocument()
    })

    it("does not render content when open is undefined", () => {
      render(<EditorDialog title="No Open Prop" />)
      expect(screen.queryByText("No Open Prop")).not.toBeInTheDocument()
    })

    it("renders content when open is true", () => {
      render(<EditorDialog open={true} title="Visible Title" />)
      expect(screen.getByText("Visible Title")).toBeInTheDocument()
    })
  })

  describe("onOpenChange callback", () => {
    it("accepts onOpenChange prop without error", () => {
      const onOpenChange = vi.fn()
      expect(() => {
        render(
          <EditorDialog open title="Title" onOpenChange={onOpenChange} />
        )
      }).not.toThrow()
    })
  })

  describe("dialog content styling", () => {
    it("renders dialog content without a close button (showCloseButton=false)", () => {
      render(<EditorDialog open title="Title" />)
      // The EditorDialog passes showCloseButton={false}, so no close button should appear
      expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument()
    })
  })

  describe("combined props", () => {
    it("renders all optional sections together", () => {
      render(
        <EditorDialog
          open
          title="Full Dialog"
          description="Full description"
          footer={<button>Submit</button>}
        >
          <p>Body text</p>
        </EditorDialog>
      )
      expect(screen.getByText("Full Dialog")).toBeInTheDocument()
      expect(screen.getByText("Full description")).toBeInTheDocument()
      expect(screen.getByText("Body text")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
    })
  })
})