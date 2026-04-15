import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MonthYearRange, TMonthYearRangeValue } from "../MonthYearRange";
import { EDateRangeShiftUnit } from "../../DateRange";

vi.mock("@sberbusiness/icons-next", () => ({
    MinusStrokeSrvIcon20: () => <span data-testid="minus-icon" />,
    CaretleftStrokeSrvIcon20: () => <span data-testid="caret-left-icon" />,
    CaretrightStrokeSrvIcon20: () => <span data-testid="caret-right-icon" />,
}));

vi.mock("../../MonthYearField", () => ({
    MonthYearField: ({
        value,
        onChange,
        label,
    }: {
        value: string;
        onChange: (value: string) => void;
        label?: string;
    }) => <input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} />,
}));

describe("MonthYearRange", () => {
    const mockOnChange = vi.fn();

    const defaultProps = {
        value: ["20240101", "20240301"] as TMonthYearRangeValue,
        onChange: mockOnChange,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders two month fields and separator", () => {
        render(<MonthYearRange {...defaultProps} />);

        expect(screen.getByLabelText("С")).toBeInTheDocument();
        expect(screen.getByLabelText("По")).toBeInTheDocument();
        expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
    });

    it("clears the end value when start becomes greater than end", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByLabelText("С"), { target: { value: "20240401" } });

        expect(mockOnChange).toHaveBeenCalledWith(["20240401", ""]);
    });

    it("clears the start value when end becomes less than start", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByLabelText("По"), { target: { value: "20231201" } });

        expect(mockOnChange).toHaveBeenCalledWith(["", "20231201"]);
    });

    it("shifts the range forward by one month by default", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.click(screen.getAllByRole("button")[1]);

        expect(mockOnChange).toHaveBeenCalledWith(["20240201", "20240401"]);
    });

    it("shifts the range by a custom unit", () => {
        render(<MonthYearRange {...defaultProps} shiftAmount={1} shiftUnit={EDateRangeShiftUnit.YEAR} />);

        fireEvent.click(screen.getAllByRole("button")[1]);

        expect(mockOnChange).toHaveBeenCalledWith(["20250101", "20250301"]);
    });

    it("disables navigation buttons when range values are incomplete", () => {
        render(<MonthYearRange {...defaultProps} value={["", "20240301"]} />);

        const [backButton, forwardButton] = screen.getAllByRole("button");

        expect(backButton).toBeDisabled();
        expect(forwardButton).toBeDisabled();
    });

    it("hides navigation buttons when hideNavigation is enabled", () => {
        render(<MonthYearRange {...defaultProps} hideNavigation />);

        expect(screen.queryByTestId("caret-left-icon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("caret-right-icon")).not.toBeInTheDocument();
    });
});
