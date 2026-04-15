import React from "react";
import moment from "moment";
import clsx from "clsx";
import { MinusStrokeSrvIcon20, CaretleftStrokeSrvIcon20, CaretrightStrokeSrvIcon20 } from "@sberbusiness/icons-next";
import { dateFormatYYYYMMDD } from "../../consts/DateConst";
import { ButtonIcon, IButtonIconProps } from "../Button/ButtonIcon";
import { EDateRangeShiftUnit } from "../DateRange/enums";
import { MonthYearField } from "../MonthYearField";
import { IMonthYearFieldProps } from "../MonthYearField/types";
import styles from "./styles/MonthYearRange.module.less";

/** Значение компонента MonthYearRange. */
export type TMonthYearRangeValue = [string, string];

/** Вспомогательные свойства поля MonthYearField внутри MonthYearRange. */
export type TMonthYearRangeFieldProps = Omit<IMonthYearFieldProps, "value" | "onChange" | "format">;

/** Вспомогательные свойства кнопок навигации внутри MonthYearRange. */
export type TMonthYearRangeButtonProps = Omit<IButtonIconProps, "children" | "className" | "disabled" | "onClick">;

/** Свойства компонента MonthYearRange. */
export interface IMonthYearRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    /** Диапазон месяцев. */
    value: TMonthYearRangeValue;
    /** Функция, вызывающаяся при изменении диапазона месяцев. */
    onChange: (value: TMonthYearRangeValue) => void;
    /** Численная величина сдвига диапазона. */
    shiftAmount?: number;
    /** Единица измерения сдвига диапазона. */
    shiftUnit?: EDateRangeShiftUnit;
    /** Управление отображением кнопок сдвига диапазона. */
    hideNavigation?: boolean;
    /** Общий формат значения для обоих полей. */
    format?: string;
    /** Свойства поля выбора месяца "с". */
    pickerFromProps?: TMonthYearRangeFieldProps;
    /** Свойства поля выбора месяца "по". */
    pickerToProps?: TMonthYearRangeFieldProps;
    /** Дополнительные свойства кнопки сдвига диапазона назад. */
    buttonBackProps?: TMonthYearRangeButtonProps;
    /** Дополнительные свойства кнопки сдвига диапазона вперёд. */
    buttonForwardProps?: TMonthYearRangeButtonProps;
}

/** Выбор диапазона месяцев. */
export const MonthYearRange = React.forwardRef<HTMLDivElement, IMonthYearRangeProps>(
    (
        {
            className,
            value,
            onChange,
            shiftAmount = 1,
            shiftUnit = EDateRangeShiftUnit.MONTH,
            hideNavigation,
            format = dateFormatYYYYMMDD,
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

        const getMonthValue = (date: string) => {
            if (!date) {
                return null;
            }

            const parsedDate = moment(date, format, true);

            return parsedDate.isValid() ? parsedDate.startOf("month") : null;
        };
        const hasRangeValue = !!(start && end);

        /** Обработчик изменения значения в поле выбора месяца "с". */
        const handleChangePickerFrom = (date: string) => {
            const nextStart = getMonthValue(date);
            const currentEnd = getMonthValue(end);

            if (!nextStart || !currentEnd || nextStart.isSameOrBefore(currentEnd, "month")) {
                onChange([date, end]);
            } else {
                onChange([date, ""]);
            }
        };

        /** Обработчик изменения значения в поле выбора месяца "по". */
        const handleChangePickerTo = (date: string) => {
            const currentStart = getMonthValue(start);
            const nextEnd = getMonthValue(date);

            if (!nextEnd || !currentStart || nextEnd.isSameOrAfter(currentStart, "month")) {
                onChange([start, date]);
            } else {
                onChange(["", date]);
            }
        };

        /** Смещение диапазона месяцев назад. */
        const shiftRangeBack = () => {
            const momentStart = getMonthValue(start);
            const momentEnd = getMonthValue(end);

            if (!momentStart || !momentEnd) {
                return;
            }

            onChange([
                momentStart.clone().subtract(shiftAmount, shiftUnit).format(format),
                momentEnd.clone().subtract(shiftAmount, shiftUnit).format(format),
            ]);
        };

        /** Смещение диапазона месяцев вперёд. */
        const shiftRangeForward = () => {
            const momentStart = getMonthValue(start);
            const momentEnd = getMonthValue(end);

            if (!momentStart || !momentEnd) {
                return;
            }

            onChange([
                momentStart.clone().add(shiftAmount, shiftUnit).format(format),
                momentEnd.clone().add(shiftAmount, shiftUnit).format(format),
            ]);
        };

        return (
            <div className={classNames} {...rest} ref={ref}>
                {!hideNavigation && (
                    <ButtonIcon
                        {...buttonBackProps}
                        className={clsx(styles.monthYearRangeButton, { disabled: !hasRangeValue })}
                        disabled={!hasRangeValue}
                        onClick={shiftRangeBack}
                    >
                        <CaretleftStrokeSrvIcon20 paletteIndex={5} />
                    </ButtonIcon>
                )}
                <MonthYearField
                    label="С"
                    format={format}
                    {...pickerFromProps}
                    value={start}
                    onChange={handleChangePickerFrom}
                />
                <MinusStrokeSrvIcon20 className={styles.separator} paletteIndex={5} />
                <MonthYearField
                    label="По"
                    format={format}
                    {...pickerToProps}
                    value={end}
                    onChange={handleChangePickerTo}
                />
                {!hideNavigation && (
                    <ButtonIcon
                        {...buttonForwardProps}
                        className={clsx(styles.monthYearRangeButton, { disabled: !hasRangeValue })}
                        disabled={!hasRangeValue}
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
