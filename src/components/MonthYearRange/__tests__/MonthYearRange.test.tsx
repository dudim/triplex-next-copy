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
        placeholder,
        label,
        targetProps,
    }: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        label?: string;
        targetProps?: {
            inputProps?: {
                "data-testid"?: string;
            };
        };
    }) => (
        <input
            aria-label={label}
            data-testid={targetProps?.inputProps?.["data-testid"] || placeholder || value || "empty"}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        />
    ),
}));

vi.mock("../../Button", () => ({
    ButtonIcon: ({
        children,
        className,
        disabled,
        onClick,
        "aria-label": ariaLabel,
        ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button aria-label={ariaLabel} className={className} disabled={disabled} onClick={onClick} {...rest}>
            {children}
        </button>
    ),
}));

describe("MonthYearRange", () => {
    const mockOnChange = vi.fn();

    const defaultProps = {
        value: ["20240101", "20240301"] as TMonthYearRangeValue,
        onChange: mockOnChange,
        pickerFromProps: {
            placeholder: "From month",
            label: "From",
            targetProps: {
                inputProps: {
                    "data-testid": "picker-from",
                },
            },
        },
        pickerToProps: {
            placeholder: "To month",
            label: "To",
            targetProps: {
                inputProps: {
                    "data-testid": "picker-to",
                },
            },
        },
        buttonBackProps: {
            "aria-label": "Назад",
        },
        buttonForwardProps: {
            "aria-label": "Вперёд",
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders both month-year fields and navigation by default", () => {
        render(<MonthYearRange {...defaultProps} />);

        expect(screen.getByTestId("picker-from")).toBeInTheDocument();
        expect(screen.getByTestId("picker-to")).toBeInTheDocument();
        expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
        expect(screen.getByTestId("caret-left-icon")).toBeInTheDocument();
        expect(screen.getByTestId("caret-right-icon")).toBeInTheDocument();
    });

    it("hides navigation when hideNavigation is true", () => {
        render(<MonthYearRange {...defaultProps} hideNavigation />);

        expect(screen.queryByTestId("caret-left-icon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("caret-right-icon")).not.toBeInTheDocument();
    });

    it("updates range when start month is changed within bounds", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByTestId("picker-from"), { target: { value: "20240215" } });

        expect(mockOnChange).toHaveBeenCalledWith(["20240201", "20240301"]);
    });

    it("clears end value when start month becomes greater than end month", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByTestId("picker-from"), { target: { value: "20240415" } });

        expect(mockOnChange).toHaveBeenCalledWith(["20240401", ""]);
    });

    it("updates range when end month is changed within bounds", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByTestId("picker-to"), { target: { value: "20240515" } });

        expect(mockOnChange).toHaveBeenCalledWith(["20240101", "20240501"]);
    });

    it("clears start value when end month becomes less than start month", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.change(screen.getByTestId("picker-to"), { target: { value: "20231215" } });

        expect(mockOnChange).toHaveBeenCalledWith(["", "20231201"]);
    });

    it("shifts range back by one month by default", () => {
        render(<MonthYearRange {...defaultProps} />);

        fireEvent.click(screen.getByRole("button", { name: "Назад" }));

        expect(mockOnChange).toHaveBeenCalledWith(["20231201", "20240201"]);
    });

    it("shifts range forward by custom shift amount and unit", () => {
        render(<MonthYearRange {...defaultProps} shiftAmount={1} shiftUnit={EDateRangeShiftUnit.YEAR} />);

        fireEvent.click(screen.getByRole("button", { name: "Вперёд" }));

        expect(mockOnChange).toHaveBeenCalledWith(["20250101", "20250301"]);
    });

    it("does not shift incomplete range", () => {
        render(<MonthYearRange {...defaultProps} value={["20240101", ""]} />);

        fireEvent.click(screen.getByRole("button", { name: "Назад" }));

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("disables navigation buttons for incomplete range", () => {
        render(<MonthYearRange {...defaultProps} value={["", ""]} />);

        expect(screen.getByRole("button", { name: "Назад" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Вперёд" })).toBeDisabled();
    });

    it("supports custom formats for picker values", () => {
        render(
            <MonthYearRange
                {...defaultProps}
                value={["01/2024", "03/2024"]}
                pickerFromProps={{ ...defaultProps.pickerFromProps, format: "MM/YYYY" }}
                pickerToProps={{ ...defaultProps.pickerToProps, format: "MM/YYYY" }}
            />,
        );

        fireEvent.change(screen.getByTestId("picker-to"), { target: { value: "04/2024" } });

        expect(mockOnChange).toHaveBeenCalledWith(["01/2024", "04/2024"]);
    });

    it("passes additional html attributes and custom className to root", () => {
        render(<MonthYearRange {...defaultProps} className="custom-class" data-testid="range-root" />);

        expect(screen.getByTestId("range-root")).toHaveClass("custom-class");
    });
});
