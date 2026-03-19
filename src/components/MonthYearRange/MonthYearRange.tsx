import React from "react";
import moment from "moment";
import clsx from "clsx";
import { MinusStrokeSrvIcon20, CaretleftStrokeSrvIcon20, CaretrightStrokeSrvIcon20 } from "@sberbusiness/icons-next";
import { dateFormatYYYYMMDD } from "../../consts/DateConst";
import { ButtonIcon, IButtonIconProps } from "../Button";
import { EDateRangeShiftUnit } from "../DateRange";
import { MonthYearField } from "../MonthYearField";
import { IMonthYearFieldProps } from "../MonthYearField/types";
import styles from "./styles/MonthYearRange.module.less";

/** Значение компонента MonthYearRange. */
export type TMonthYearRangeValue = [string, string];

/** Дополнительные свойства поля выбора месяца/года. */
export interface IMonthYearRangePickerProps extends Omit<IMonthYearFieldProps, "value" | "onChange"> {}

/** Дополнительные свойства кнопки навигации диапазона. */
export interface IMonthYearRangeButtonProps extends Omit<IButtonIconProps, "children" | "disabled" | "onClick"> {}

/** Свойства компонента MonthYearRange. */
export interface IMonthYearRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    /** Диапазон месяцев/лет. */
    value: TMonthYearRangeValue;
    /** Функция, вызывающаяся при изменении диапазона месяцев/лет. */
    onChange: (value: TMonthYearRangeValue) => void;
    /** Численная величина сдвига диапазона. */
    shiftAmount?: number;
    /** Единица измерения сдвига диапазона. */
    shiftUnit?: EDateRangeShiftUnit;
    /** Управление отображением/скрытием кнопок сдвига диапазона. */
    hideNavigation?: boolean;
    /** Дополнительные свойства поля выбора периода "с". */
    pickerFromProps?: IMonthYearRangePickerProps;
    /** Дополнительные свойства поля выбора периода "по". */
    pickerToProps?: IMonthYearRangePickerProps;
    /** Дополнительные свойства кнопки сдвига диапазона "назад". */
    buttonBackProps?: IMonthYearRangeButtonProps;
    /** Дополнительные свойства кнопки сдвига диапазона "вперёд". */
    buttonForwardProps?: IMonthYearRangeButtonProps;
}

/** Выбор диапазона месяцев/лет. */
export const MonthYearRange = React.forwardRef<HTMLDivElement, IMonthYearRangeProps>(
    (
        {
            className,
            value,
            onChange,
            shiftAmount = 1,
            shiftUnit = EDateRangeShiftUnit.MONTH,
            hideNavigation,
            pickerFromProps,
            pickerToProps,
            buttonBackProps,
            buttonForwardProps,
            ...rest
        },
        ref,
    ) => {
        const [start, end] = value;
        const classNames = clsx(styles.monthYearRange, className);
        const formatFrom = pickerFromProps?.format || dateFormatYYYYMMDD;
        const formatTo = pickerToProps?.format || dateFormatYYYYMMDD;

        /** Нормализовать значение месяца/года к началу месяца. */
        const normalizeValue = (nextValue: string, format: string) => {
            if (!nextValue) {
                return "";
            }

            const parsedDate = moment(nextValue, format, true);

            if (!parsedDate.isValid()) {
                return nextValue;
            }

            return parsedDate.startOf("month").format(format);
        };

        /** Получить дату из значения компонента. */
        const parseValue = (nextValue: string, format: string) => {
            if (!nextValue) {
                return null;
            }

            const parsedDate = moment(nextValue, format, true);

            return parsedDate.isValid() ? parsedDate.startOf("month") : null;
        };

        /** Обработчик изменения значения в поле выбора периода "с". */
        const handleChangePickerFrom = (nextValue: string) => {
            const normalizedStart = normalizeValue(nextValue, formatFrom);
            const normalizedEnd = normalizeValue(end, formatTo);
            const startDate = parseValue(normalizedStart, formatFrom);
            const endDate = parseValue(normalizedEnd, formatTo);

            if (!normalizedStart || !endDate || !startDate || !startDate.isAfter(endDate, "month")) {
                onChange([normalizedStart, normalizedEnd]);
            } else {
                onChange([normalizedStart, ""]);
            }
        };

        /** Обработчик изменения значения в поле выбора периода "по". */
        const handleChangePickerTo = (nextValue: string) => {
            const normalizedStart = normalizeValue(start, formatFrom);
            const normalizedEnd = normalizeValue(nextValue, formatTo);
            const startDate = parseValue(normalizedStart, formatFrom);
            const endDate = parseValue(normalizedEnd, formatTo);

            if (!normalizedEnd || !startDate || !endDate || !endDate.isBefore(startDate, "month")) {
                onChange([normalizedStart, normalizedEnd]);
            } else {
                onChange(["", normalizedEnd]);
            }
        };

        /** Сместить диапазон назад. */
        const shiftRangeBack = () => {
            const startDate = parseValue(start, formatFrom);
            const endDate = parseValue(end, formatTo);

            if (!startDate || !endDate) {
                return;
            }

            onChange([
                startDate.clone().subtract(shiftAmount, shiftUnit).startOf("month").format(formatFrom),
                endDate.clone().subtract(shiftAmount, shiftUnit).startOf("month").format(formatTo),
            ]);
        };

        /** Сместить диапазон вперёд. */
        const shiftRangeForward = () => {
            const startDate = parseValue(start, formatFrom);
            const endDate = parseValue(end, formatTo);

            if (!startDate || !endDate) {
                return;
            }

            onChange([
                startDate.clone().add(shiftAmount, shiftUnit).startOf("month").format(formatFrom),
                endDate.clone().add(shiftAmount, shiftUnit).startOf("month").format(formatTo),
            ]);
        };

        return (
            <div className={classNames} {...rest} ref={ref}>
                {!hideNavigation && (
                    <ButtonIcon
                        {...buttonBackProps}
                        className={clsx(styles.monthYearRangeButton, buttonBackProps?.className)}
                        aria-label={buttonBackProps?.["aria-label"] || "Сдвинуть период назад"}
                        disabled={!(start && end)}
                        onClick={shiftRangeBack}
                    >
                        <CaretleftStrokeSrvIcon20 paletteIndex={5} />
                    </ButtonIcon>
                )}
                <MonthYearField {...pickerFromProps} value={start} onChange={handleChangePickerFrom} />
                <MinusStrokeSrvIcon20 className={styles.separator} paletteIndex={5} />
                <MonthYearField {...pickerToProps} value={end} onChange={handleChangePickerTo} />
                {!hideNavigation && (
                    <ButtonIcon
                        {...buttonForwardProps}
                        className={clsx(styles.monthYearRangeButton, buttonForwardProps?.className)}
                        aria-label={buttonForwardProps?.["aria-label"] || "Сдвинуть период вперёд"}
                        disabled={!(start && end)}
                        onClick={shiftRangeForward}
                    >
                        <CaretrightStrokeSrvIcon20 paletteIndex={5} />
                    </ButtonIcon>
                )}
            </div>
        );
    },
);

MonthYearRange.displayName = "MonthYearRange";
