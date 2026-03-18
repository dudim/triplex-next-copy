import React from "react";
import clsx from "clsx";
import moment, { unitOfTime } from "moment";
import { MinusStrokeSrvIcon20, CaretleftStrokeSrvIcon20, CaretrightStrokeSrvIcon20 } from "@sberbusiness/icons-next";
import { dateFormatYYYYMMDD } from "../../consts/DateConst";
import { ButtonIcon } from "../Button/ButtonIcon";
import { EDateRangeShiftUnit } from "../DateRange/enums";
import { MonthYearField, IMonthYearFieldProps } from "../MonthYearField";
import styles from "./styles/MonthYearRange.module.less";

/** Свойства функции рендеринга кнопки сдвига диапазона месяцев. */
export interface IMonthYearRangeButtonProvideProps {
    /** Содержимое кнопки. */
    children: React.ReactNode;
    /** CSS-класс кнопки. */
    className: string;
    /** Обработчик нажатия на кнопку. */
    onClick: () => void;
    /** Признак недоступности кнопки. */
    disabled: boolean;
}

/** Значение компонента MonthYearRange. */
export type TMonthYearRangeValue = [string, string];

/** Дополнительные свойства поля диапазона месяцев. */
export type TMonthYearRangeFieldProps = Omit<IMonthYearFieldProps, "value" | "onChange" | "format">;

/** Свойства компонента MonthYearRange. */
export interface IMonthYearRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    /** Диапазон месяцев. */
    value: TMonthYearRangeValue;
    /** Функция, вызывающаяся при изменении диапазона месяцев. */
    onChange: (value: TMonthYearRangeValue) => void;
    /** Формат значения диапазона месяцев. */
    format?: string;
    /** Численная величина сдвига диапазона месяцев. */
    shiftAmount?: number;
    /** Единица измерения сдвига диапазона месяцев. */
    shiftUnit?: EDateRangeShiftUnit;
    /** Управление отображением/скрытием кнопок сдвига диапазона месяцев. */
    hideNavigation?: boolean;
    /** Свойства поля выбора месяца "с". */
    fieldPropsFrom?: TMonthYearRangeFieldProps;
    /** Свойства поля выбора месяца "по". */
    fieldPropsTo?: TMonthYearRangeFieldProps;
    /** Функция рендеринга кнопки сдвига диапазона месяцев "назад". */
    renderButtonBack?: (props: IMonthYearRangeButtonProvideProps) => React.ReactNode;
    /** Функция рендеринга кнопки сдвига диапазона месяцев "вперёд". */
    renderButtonForward?: (props: IMonthYearRangeButtonProvideProps) => React.ReactNode;
}

const getMomentValue = (value: string, format: string) => {
    if (!value) {
        return null;
    }

    const date = moment(value, format, true);

    return date.isValid() ? date : null;
};

const isAfter = (from: string, to: string, format: string) => {
    const fromValue = getMomentValue(from, format);
    const toValue = getMomentValue(to, format);

    if (!fromValue || !toValue) {
        return false;
    }

    return fromValue.isAfter(toValue, "day");
};

const defaultRenderButton = ({ children, ...props }: IMonthYearRangeButtonProvideProps) => (
    <ButtonIcon {...props}>{children}</ButtonIcon>
);

/** Выбор диапазона месяцев. */
export const MonthYearRange = React.forwardRef<HTMLDivElement, IMonthYearRangeProps>(
    (
        {
            className,
            value,
            onChange,
            format = dateFormatYYYYMMDD,
            shiftAmount = 1,
            shiftUnit = EDateRangeShiftUnit.MONTH,
            hideNavigation,
            fieldPropsFrom,
            fieldPropsTo,
            renderButtonBack = defaultRenderButton,
            renderButtonForward = defaultRenderButton,
            ...rest
        },
        ref,
    ) => {
        const [start, end] = value;
        const classNames = clsx(styles.monthYearRange, className);
        const isNavigationDisabled = !(start && end);

        /** Обработчик изменения значения в поле выбора месяца "с". */
        const handleChangePickerFrom = (date: string) => {
            if (!date || !end || !isAfter(date, end, format)) {
                onChange([date, end]);
            } else {
                onChange([date, ""]);
            }
        };

        /** Обработчик изменения значения в поле выбора месяца "по". */
        const handleChangePickerTo = (date: string) => {
            if (!date || !start || !isAfter(start, date, format)) {
                onChange([start, date]);
            } else {
                onChange(["", date]);
            }
        };

        /** Функция, смещающая диапазон месяцев назад. */
        const shiftRangeBack = () => {
            const momentStart = getMomentValue(start, format);
            const momentEnd = getMomentValue(end, format);

            if (!momentStart || !momentEnd) {
                return;
            }

            onChange([
                momentStart
                    .clone()
                    .subtract(shiftAmount, shiftUnit as unitOfTime.DurationConstructor)
                    .format(format),
                momentEnd
                    .clone()
                    .subtract(shiftAmount, shiftUnit as unitOfTime.DurationConstructor)
                    .format(format),
            ]);
        };

        /** Функция, смещающая диапазон месяцев вперёд. */
        const shiftRangeForward = () => {
            const momentStart = getMomentValue(start, format);
            const momentEnd = getMomentValue(end, format);

            if (!momentStart || !momentEnd) {
                return;
            }

            onChange([
                momentStart
                    .clone()
                    .add(shiftAmount, shiftUnit as unitOfTime.DurationConstructor)
                    .format(format),
                momentEnd
                    .clone()
                    .add(shiftAmount, shiftUnit as unitOfTime.DurationConstructor)
                    .format(format),
            ]);
        };

        return (
            <div className={classNames} {...rest} ref={ref}>
                {!hideNavigation &&
                    renderButtonBack({
                        children: <CaretleftStrokeSrvIcon20 paletteIndex={5} />,
                        className: clsx(styles.monthYearRangeButton, { disabled: isNavigationDisabled }),
                        disabled: isNavigationDisabled,
                        onClick: shiftRangeBack,
                    })}
                <MonthYearField {...fieldPropsFrom} value={start} onChange={handleChangePickerFrom} format={format} />
                <MinusStrokeSrvIcon20 className={styles.separator} paletteIndex={5} />
                <MonthYearField {...fieldPropsTo} value={end} onChange={handleChangePickerTo} format={format} />
                {!hideNavigation &&
                    renderButtonForward({
                        children: <CaretrightStrokeSrvIcon20 paletteIndex={5} />,
                        className: clsx(styles.monthYearRangeButton, { disabled: isNavigationDisabled }),
                        disabled: isNavigationDisabled,
                        onClick: shiftRangeForward,
                    })}
            </div>
        );
    },
);

MonthYearRange.displayName = "MonthYearRange";
