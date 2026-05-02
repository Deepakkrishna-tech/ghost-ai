import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { EditorNavbar } from "../editor-navbar"

describe("EditorNavbar", () => {
  describe("structural rendering", () => {
    it("renders a nav element", () => {
      render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={vi.fn()} />
      )
      expect(screen.getByRole("navigation")).toBeInTheDocument()
    })

    it("renders the sidebar toggle button", () => {
      render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={vi.fn()} />
      )
      expect(
        screen.getByRole("button", { name: "Toggle sidebar" })
      ).toBeInTheDocument()
    })

    it("toggle button has aria-label 'Toggle sidebar'", () => {
      render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={vi.fn()} />
      )
      const button = screen.getByRole("button", { name: "Toggle sidebar" })
      expect(button).toHaveAttribute("aria-label", "Toggle sidebar")
    })
  })

  describe("icon rendering based on sidebar state", () => {
    it("renders a single icon when sidebar is closed", () => {
      const { container } = render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={vi.fn()} />
      )
      const button = screen.getByRole("button", { name: "Toggle sidebar" })
      const svgs = button.querySelectorAll("svg")
      expect(svgs).toHaveLength(1)
    })

    it("renders a single icon when sidebar is open", () => {
      const { container } = render(
        <EditorNavbar isSidebarOpen={true} onToggleSidebar={vi.fn()} />
      )
      const button = screen.getByRole("button", { name: "Toggle sidebar" })
      const svgs = button.querySelectorAll("svg")
      expect(svgs).toHaveLength(1)
    })

    it("renders different icon SVG content when sidebar is open vs closed", () => {
      const { container: openContainer } = render(
        <EditorNavbar isSidebarOpen={true} onToggleSidebar={vi.fn()} />
      )
      const openButton = openContainer.querySelector(
        "[aria-label='Toggle sidebar']"
      )
      const openSvgHtml = openButton?.querySelector("svg")?.innerHTML

      const { container: closedContainer } = render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={vi.fn()} />
      )
      const closedButton = closedContainer.querySelector(
        "[aria-label='Toggle sidebar']"
      )
      const closedSvgHtml = closedButton?.querySelector("svg")?.innerHTML

      // PanelLeftClose and PanelLeftOpen produce different SVG markup
      expect(openSvgHtml).not.toBe(closedSvgHtml)
    })
  })

  describe("interaction", () => {
    it("calls onToggleSidebar when the toggle button is clicked", async () => {
      const onToggleSidebar = vi.fn()
      render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={onToggleSidebar} />
      )
      const button = screen.getByRole("button", { name: "Toggle sidebar" })
      await userEvent.click(button)
      expect(onToggleSidebar).toHaveBeenCalledTimes(1)
    })

    it("calls onToggleSidebar when sidebar is open and button is clicked", async () => {
      const onToggleSidebar = vi.fn()
      render(
        <EditorNavbar isSidebarOpen={true} onToggleSidebar={onToggleSidebar} />
      )
      const button = screen.getByRole("button", { name: "Toggle sidebar" })
      await userEvent.click(button)
      expect(onToggleSidebar).toHaveBeenCalledTimes(1)
    })

    it("calls onToggleSidebar each time the button is clicked", async () => {
      const onToggleSidebar = vi.fn()
      render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={onToggleSidebar} />
      )
      const button = screen.getByRole("button", { name: "Toggle sidebar" })
      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)
      expect(onToggleSidebar).toHaveBeenCalledTimes(3)
    })

    it("does not call onToggleSidebar before any interaction", () => {
      const onToggleSidebar = vi.fn()
      render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={onToggleSidebar} />
      )
      expect(onToggleSidebar).not.toHaveBeenCalled()
    })
  })

  describe("icon state reflects isSidebarOpen prop", () => {
    it("re-renders with different icon when isSidebarOpen prop changes", () => {
      const { rerender, container } = render(
        <EditorNavbar isSidebarOpen={false} onToggleSidebar={vi.fn()} />
      )
      const button = container.querySelector("[aria-label='Toggle sidebar']")
      const closedSvgContent = button?.querySelector("svg")?.innerHTML

      rerender(<EditorNavbar isSidebarOpen={true} onToggleSidebar={vi.fn()} />)
      const openSvgContent = button?.querySelector("svg")?.innerHTML

      expect(closedSvgContent).not.toBe(openSvgContent)
    })
  })
})