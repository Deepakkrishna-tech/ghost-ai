import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { ProjectSidebar } from "../project-sidebar"

describe("ProjectSidebar", () => {
  describe("structural rendering", () => {
    it("renders an aside element", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(screen.getByRole("complementary")).toBeInTheDocument()
    })

    it("renders the 'Projects' header title", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(screen.getByText("Projects")).toBeInTheDocument()
    })

    it("renders the close button with accessible label", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(
        screen.getByRole("button", { name: "Close sidebar" })
      ).toBeInTheDocument()
    })

    it("close button has aria-label 'Close sidebar'", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      const closeBtn = screen.getByRole("button", { name: "Close sidebar" })
      expect(closeBtn).toHaveAttribute("aria-label", "Close sidebar")
    })

    it("renders the 'New Project' button", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(
        screen.getByRole("button", { name: /new project/i })
      ).toBeInTheDocument()
    })
  })

  describe("open/closed state (CSS transform)", () => {
    it("applies translate-x-0 class when isOpen is true", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      const aside = screen.getByRole("complementary")
      expect(aside).toHaveClass("translate-x-0")
    })

    it("applies -translate-x-full class when isOpen is false", () => {
      render(<ProjectSidebar isOpen={false} onClose={vi.fn()} />)
      const aside = screen.getByRole("complementary")
      expect(aside).toHaveClass("-translate-x-full")
    })

    it("does not apply translate-x-0 when isOpen is false", () => {
      render(<ProjectSidebar isOpen={false} onClose={vi.fn()} />)
      const aside = screen.getByRole("complementary")
      expect(aside).not.toHaveClass("translate-x-0")
    })

    it("does not apply -translate-x-full when isOpen is true", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      const aside = screen.getByRole("complementary")
      expect(aside).not.toHaveClass("-translate-x-full")
    })

    it("updates class when isOpen prop changes from false to true", () => {
      const { rerender } = render(
        <ProjectSidebar isOpen={false} onClose={vi.fn()} />
      )
      const aside = screen.getByRole("complementary")
      expect(aside).toHaveClass("-translate-x-full")

      rerender(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(aside).toHaveClass("translate-x-0")
      expect(aside).not.toHaveClass("-translate-x-full")
    })

    it("updates class when isOpen prop changes from true to false", () => {
      const { rerender } = render(
        <ProjectSidebar isOpen={true} onClose={vi.fn()} />
      )
      const aside = screen.getByRole("complementary")
      expect(aside).toHaveClass("translate-x-0")

      rerender(<ProjectSidebar isOpen={false} onClose={vi.fn()} />)
      expect(aside).toHaveClass("-translate-x-full")
      expect(aside).not.toHaveClass("translate-x-0")
    })
  })

  describe("tabs", () => {
    it("renders 'My Projects' tab trigger", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(screen.getByRole("tab", { name: "My Projects" })).toBeInTheDocument()
    })

    it("renders 'Shared' tab trigger", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(screen.getByRole("tab", { name: "Shared" })).toBeInTheDocument()
    })

    it("shows 'No projects yet' empty state in My Projects tab by default", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(screen.getByText("No projects yet")).toBeInTheDocument()
    })

    it("shows 'No shared projects' text in Shared tab after clicking it", async () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      const sharedTab = screen.getByRole("tab", { name: "Shared" })
      await userEvent.click(sharedTab)
      expect(screen.getByText("No shared projects")).toBeInTheDocument()
    })

    it("My Projects tab is active by default", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      const myProjectsTab = screen.getByRole("tab", { name: "My Projects" })
      // Base UI uses aria-selected or data-active for the active tab
      const isActive =
        myProjectsTab.getAttribute("aria-selected") === "true" ||
        myProjectsTab.hasAttribute("data-active")
      expect(isActive).toBe(true)
    })

    it("renders both tab panels in the DOM", () => {
      render(<ProjectSidebar isOpen={true} onClose={vi.fn()} />)
      expect(screen.getByRole("tabpanel")).toBeInTheDocument()
    })
  })

  describe("interaction", () => {
    it("calls onClose when the close button is clicked", async () => {
      const onClose = vi.fn()
      render(<ProjectSidebar isOpen={true} onClose={onClose} />)
      const closeBtn = screen.getByRole("button", { name: "Close sidebar" })
      await userEvent.click(closeBtn)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("calls onClose each time the close button is clicked", async () => {
      const onClose = vi.fn()
      render(<ProjectSidebar isOpen={true} onClose={onClose} />)
      const closeBtn = screen.getByRole("button", { name: "Close sidebar" })
      await userEvent.click(closeBtn)
      await userEvent.click(closeBtn)
      expect(onClose).toHaveBeenCalledTimes(2)
    })

    it("does not call onClose before any interaction", () => {
      const onClose = vi.fn()
      render(<ProjectSidebar isOpen={true} onClose={onClose} />)
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe("sidebar rendered even when closed", () => {
    it("still renders 'Projects' title when isOpen is false", () => {
      render(<ProjectSidebar isOpen={false} onClose={vi.fn()} />)
      expect(screen.getByText("Projects")).toBeInTheDocument()
    })

    it("close button is still in DOM when isOpen is false", () => {
      render(<ProjectSidebar isOpen={false} onClose={vi.fn()} />)
      expect(
        screen.getByRole("button", { name: "Close sidebar" })
      ).toBeInTheDocument()
    })

    it("'New Project' button is still present when isOpen is false", () => {
      render(<ProjectSidebar isOpen={false} onClose={vi.fn()} />)
      expect(
        screen.getByRole("button", { name: /new project/i })
      ).toBeInTheDocument()
    })
  })
})