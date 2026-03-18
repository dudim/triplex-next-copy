import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MonthYearRange, IMonthYearRangeButtonProvideProps, TMonthYearRangeValue } from "../MonthYearRange";
import { EDateRangeShiftUnit } from "../../DateRange/enums";

vi.mock("@sberbusiness/icons-next", () => ({
    MinusStrokeSrvIcon20: () => <span data-testid="minus-icon" />,
    CaretleftStrokeSrvIcon20: () => <span data-testid="caret-left-icon" />,
    CaretrightStrokeSrvIcon20: () => <span data-testid="caret-right-icon" />,
}));

vi.mock("../../MonthYearField", () => ({
    MonthYearField: ({
        value,
        onChange,
        placeholder,
    }: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    }) => (
        <input
            data-testid={placeholder || value || "empty-field"}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
        />
    ),
}));

describe("MonthYearRange", () => {
    const mockOnChange = vi.fn();

    const defaultProps = {
        value: ["20240101", "20240301"] as TMonthYearRangeValue,
        onChange: mockOnChange,
        fieldPropsFrom: { placeholder: "from-field" },
        fieldPropsTo: { placeholder: "to-field" },
    };

    const renderButton = (props: IMonthYearRangeButtonProvideProps) => (
        <button
            data-testid={props.disabled ? "button-disabled" : "button-enabled"}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders both month-year fields and separator", () => {
        render(<MonthYearRange {...defaultProps} />);

        expect(screen.getByTestId("from-field")).toBeInTheDocument();
        expect(screen.getByTestId("to-field")).toBeInTheDocument();
        expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
    });

    it("calls onChange when start value becomes earlier than end value", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByTestId("from-field"), { target: { value: "20240201" } });

        expect(mockOnChange).toHaveBeenCalledWith(["20240201", "20240301"]);
    });

    it("clears end value when start value becomes greater than end value", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByTestId("from-field"), { target: { value: "20240401" } });

        expect(mockOnChange).toHaveBeenCalledWith(["20240401", ""]);
    });

    it("clears start value when end value becomes less than start value", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByTestId("to-field"), { target: { value: "20231201" } });

        expect(mockOnChange).toHaveBeenCalledWith(["", "20231201"]);
    });

    it("shifts the range forward by one month by default", () => {
        render(<MonthYearRange {...defaultProps} renderButtonBack={renderButton} renderButtonForward={renderButton} />);

        fireEvent.click(screen.getAllByRole("button")[1]);

        expect(mockOnChange).toHaveBeenCalledWith(["20240201", "20240401"]);
    });

    it("shifts the range by custom units", () => {
        render(
            <MonthYearRange
                {...defaultProps}
                shiftUnit={EDateRangeShiftUnit.YEAR}
                renderButtonBack={renderButton}
                renderButtonForward={renderButton}
            />,
        );

        fireEvent.click(screen.getAllByRole("button")[1]);

        expect(mockOnChange).toHaveBeenCalledWith(["20250101", "20250301"]);
    });

    it("disables navigation when one of the values is missing", () => {
        render(
            <MonthYearRange
                {...defaultProps}
                value={["20240101", ""]}
                renderButtonBack={renderButton}
                renderButtonForward={renderButton}
            />,
        );

        expect(screen.getAllByTestId("button-disabled")).toHaveLength(2);
    });

    it("hides navigation buttons when hideNavigation is true", () => {
        render(<MonthYearRange {...defaultProps} hideNavigation />);

        expect(screen.queryByTestId("caret-left-icon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("caret-right-icon")).not.toBeInTheDocument();
    });
});
